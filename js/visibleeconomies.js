$(function() {
  Parse.$ = jQuery;
  Parse.initialize("RmWiMOjHfkLRlkXsK29dzlZ3kLLyL887Qwe4STkU", "cp6dx0CArZKNdrpjxKzYtlae2jIP0Go9WBaXr34O");
  
  // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
    }
  });



  var ProfileView = Parse.View.extend({
    tagName:  "li",

    template: _.template($('#result-template').html()),

    initialize: function() {
    },
    
    render: function() {
      $(this.el).html(this.model.toJSON()["firstname"]);
      return this;
    },
  });

  var TagView = Parse.View.extend({
    tagName:  "li",

    template: _.template($('#tag-template').html()),

    initialize: function() {
    },
    
    render: function() {
      $(this.el).html(this.model.toJSON()["tagName"]);
      return this;
    },
  });

  var ResultsView = Parse.View.extend({
    tagName:  "li",

    template: _.template($('#results-list').html()),

    initialize: function() {
    },
    
    render: function() {
      console.log("render");
      $(this.el).html(this.model.toJSON()["firstname"]);
      return this;
    },
  });

  var SearchView = Parse.View.extend({
    searchTemplate: _.template($('#search-template').html()),

    events: {
    },

    initialize: function() {
      var self = this;
      _.bindAll(this, 'addOneTag', 'addAllTags', 'addOneProfile', 'addAllProfiles');

      this.fetch()
    },
    
    fetch: function() {
      this.tagList = new TagList();
      var tagList = this.tagList;

      this.profileList = new ProfileList();
      var profileList = this.profileList;

      var self = this;
      Parse.Cloud.run("topTags", "", {
        success: function(result) {
          tagList.add(result);
          self.addAllTags();
        }
      });
      Parse.Cloud.run("matchingProfiles", "", {
        success: function(result) {
          profileList.add(result);
          self.addAllProfiles();
        }
      });
    },

/*
    filter: function() {
      this.addAllTags();
    },
*/

    render: function() {
      return this.$searchTemplate;
    },

    addOneTag: function(tag) {
      var view = new TagView({model: tag});
      $("#top-tags").append(view.render().el);
    },

    addAllTags: function(collection, filter) {
      $("#top-tags").html("");
      this.tagList.each(this.addOneTag);
    },

    addOneProfile: function(profile) {
      var view = new ProfileView({model: profile});
      $("#results-list").append(view.render().el);
    },

    addAllProfiles: function(collection, filter) {
      $("#results-list").html("");
      this.profileList.each(this.addOneProfile);
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


  // collection of profiles
  var ProfileList = Parse.Collection.extend({
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

