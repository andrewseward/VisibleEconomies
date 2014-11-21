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

  var TagView = Parse.View.extend({
    tagName:  "li",

    template: _.template($('#tag-template').html()),

    initialize: function() {
    },
    
    render: function() {
      console.log("render");
      $(this.el).html(this.model.toJSON()["tagName"]);
      return this;
    },
  });

  var SearchView = Parse.View.extend({
    searchTemplate: _.template($('#search-template').html()),

    events: {
    },

    initialize: function() {
      var self = this;
      _.bindAll(this, 'addOne', 'addAll');

      this.tagList = new TagList();
      this.tagList.query = new Parse.Query(Tag);
      this.tagList.query.limit(10);

      this.fetch()
    },
    
    fetch: function() {
      this.tagList.fetch({
        success: this.addAll
      });
    },

    filter: function() {
      this.addAll();
    },

    render: function() {
      return this.$searchTemplate;
    },

    addOne: function(tag) {
      var view = new TagView({model: tag});
      $("#top-tags").append(view.render().el);
    },

    // Add all items in the Todos collection at once.
    addAll: function(collection, filter) {
      $("#top-tags").html("");
      this.tagList.each(this.addOne);
    },
  });


  // Profile class
  var Profile = Parse.Object.extend("Profile", {
  });


  // collection of profiles (results)
  var ProfileList = Parse.Collection.extend({
  });


  // Tag class
  var Tag = Parse.Object.extend("Tag", {
  });


  // collection of tags
  var TagList = Parse.Collection.extend({
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

