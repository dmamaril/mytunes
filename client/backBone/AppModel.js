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
    // console.log('Library Collection Set!');
  }
});


// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------



var SongQueue = Backbone.Collection.extend({
  model: SongModel,

  initialize: function (blah, options) {
    queue = this;
    this.on('add', function(){
      if(this.length === 1){
        this.playFirst();
      }
    });

    options.parent.on('dequeue', function (song) {
      queue.remove(song);
      // feature: delete 'SongQueue' when queue.length === 0
    }, this);

    options.parent.on('ended', function () {
      console.log('Shifting!');
      this.shift();
      if (this.length >= 1) { this.playFirst(); }
    }, this);
  },

  playFirst: function () { 
    this.at(0).play(); }

});


// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------


var App = Backbone.Model.extend({
  initialize: function (library) {
    this.set('currentSong', new SongModel())
    this.set('songQueue', new SongQueue(null, {parent: this.get('library')} ));

    library.library.on('play', function (song) {
      this.set('currentSong', song);
    }, this);

    library.library.on('enqueue', function (song) {
      this.get('songQueue').add(song);
      // console.log('Horray!', this.get('songQueue'));
    }, this)
  }
});

