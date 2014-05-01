var SongModel = Backbone.Model.extend({
  enqueue: function () {
    this.trigger('enqueue', this);
  },

  dequeue: function () {
    this.trigger('dequeue', this);
  },

  ended: function () {
    this.trigger('ended', this);
  },

  play: function () {
    this.trigger('play', this);
  }
});

var Library = Backbone.Collection.extend({ 
  model: SongModel,
  initialize: function () {
    console.log('Initializing Library...');
    this.add(songData);
    console.log('Library Collection Set!');
  }
});


// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------



var SongQueue = Backbone.Collection.extend({
  model: SongModel,

  initialize: function (blah, options) {
    queue = this;

    options.parent.on('play', function (song) {
      if (this.length >= 1) { this.playFirst(); }
    }, this);


    options.parent.on('enqueue', function (song) { 
      queue.add(song);
    }, this);

    options.parent.on('dequeue', function (song) {
      queue.remove(song);
      // feature: delete 'SongQueue' when queue.length === 0
    }, this);

    options.parent.on('ended', function () {
      this.shift();
      if (this.length >= 1) { this.playFirst(); }
    }, this);
  },

  playFirst: function () { this.at(0).play(); }

});


// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------


var App = Backbone.Model.extend({
  initialize: function () {
    this.set('currentSong', new SongModel())
    this.set('library', new Library());
    this.set('songQueue', new SongQueue(null, {parent: this.get('library')} ));

  }
});

