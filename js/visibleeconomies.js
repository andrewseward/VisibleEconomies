$(function() {
  Parse.$ = jQuery;
  Parse.initialize("RmWiMOjHfkLRlkXsK29dzlZ3kLLyL887Qwe4STkU", "cp6dx0CArZKNdrpjxKzYtlae2jIP0Go9WBaXr34O");
  
  // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
    }
  });


/*
  var PageParse.View.extend({
    searchTemplate: _.template('#search-template').html(),

    events: {
    },

    el: ".visibleeconomies",

    initialize: function() {
      this.render();
    },

    render: function() {
      new SearchView();
    }
  });
*/


  var SearchView = Parse.View.extend({
    searchTemplate: _.template($('#search-template').html()),

    events: {
    },

    initialize: function() {
    },

    render: function() {
      return this.$searchTemplate;
    }
  });


  
  // main view for the app
  var AppView = Parse.View.extend({
    // load the search template
    searchTemplate: _.template($('#search-template').html()),

    // bind to element already in the DOM
    el: $("#visibleeconomies"),

    initialize: function() {
      var self = this;

      this.$el.html(_.template($("#page-template").html()));

      var searchView = new SearchView();

      var centre = this.$("#content");
      centre.html(this.searchTemplate());
    },

    render: function() {
    }
  });

  var AppRouter = Parse.Router.extend({
    routes: {
    },

    initialize: function(options) {
    },
  });


  var state = new AppState;

  new AppRouter;
  new AppView;
//  Parse.history.start();
});
