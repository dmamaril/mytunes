// Define Entry View per Entry Model passed in from Library Collection
var EntryView = Backbone.View.extend({
  template: _.template('<%=title%> <br> <%=artist%> <hr>'),
  events: {
    'click': 'addToQueue'
  },

  addToQueue: function () {
    this.model.enqueue();
    this.model.play();
  },

  render: function () {
    this.$el.html( this.template(this.model.toJSON()) );
    return this;
  }
});

// Define Library View Collection --- connects to Library Collection
var LibraryView = Backbone.View.extend({
  el: '.container',
  initialize: function () { this.render(); },
  render: function () {
    this.collection.each(function (song) {
      var entryView = new EntryView({ model: song });
      this.$el.append( entryView.render().el );
    }, this);
    return this;
  }
});


// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------


// Define Sing Song Queue Entry View
var SongQueueEntryView = Backbone.View.extend ({
  tagName: 'li',

  template: _.template('|| <a href=#> <%=title%> by: <%=artist%> </a> '),

  events: {
    'click' : 'dequeue'
  },

  dequeue: function () {
    this.model.dequeue();
  },

  render: function () {
    this.$el.html ( this.template( this.model.toJSON()) );
    return this;
  }
});


// Define Song Queue View Collection -- connects to SongQueue Collectiong
var SongQueueView = Backbone.View.extend({
  el: '.queue',

  tagName: 'ul',

  initialize: function () {
    this.collection.on('add', this.render, this);
    this.collection.on('remove', this.render, this);
  },

  render: function () {
    this.$el.html('<div><h4>SongQueue</h4></div>').append(
      this.collection.map(function(song){
        return new SongQueueEntryView({model: song}).render().el;
      })
    );
    return this
  }
});


// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------



var PlayerView = Backbone.View.extend({

  // HTML5 (native) audio tag is being used
  // see: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
  el: '<audio controls autoplay />',

  setSong: function(song){
    this.$el.on('ended', function () {
      song.trigger('ended', this);
      this.render();
    }, this);
  },

  render: function() {
    return this.$el.attr('src', this.model ? this.model.get('url') : '');
  }

});


// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

var AppView = Backbone.View.extend({
  initialize: function(whatIsThis) {
    this.playerView = new PlayerView({ model: this.model.get('currentSong') });
    this.libraryView = new LibraryView({ collection: this.model.get('library') });
    this.songQueueView = new SongQueueView({ collection: this.model.get('songQueue') });

    this.model.on('change:currentSong', function(model){
      this.playerView.setSong(model.get('currentSong'));
    }, this);
  },
  render: function () {
    return this.$el.html([
      this.libraryView.$el,
      this.songQueueView.$el,
      this.playerView.$el
    ]);
  }
});