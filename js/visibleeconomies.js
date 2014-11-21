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
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
  });

  var SelectedTagView = Parse.View.extend({
    tagName:  "li",

    template: _.template($('#selected-tag-template').html()),

    initialize: function() {
    },

    render: function() {
      $(this.el).html(this.model.toJSON()["tagName"]);
      return this;
    },
  });

  var TagView = Parse.View.extend({
    tagName:  "li",

    template: _.template($('#tag-template').html()),

    events: {
      "click label.available-tag-name" : "topTagClick",
    },
    
    topTagClick: function(event) {
      state.tagList.remove(this.model);
      state.trigger("tagList");
      state.selectedTagList.add(this.model);
      state.trigger("selectedTagList");
      console.log("top tag click");
    },

    initialize: function() {
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
  });

  var ResultsView = Parse.View.extend({
//    tagName:  "li",

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
      
      state.on("tagList", this.allAllTags, this);
    },

    onChangeTagList: function(e) {
      console.log("change: " + e);
    },
    
    fetch: function() {
      var profileList = state.profileList;
      var tagList = state.tagList;

      var self = this;
      Parse.Cloud.run("topTags", "", {
        success: function(result) {
          tagList.add(result);
          state.trigger("tagList");
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
      state.tagList.each(this.addOneTag);
    },

    addOneProfile: function(profile) {
      var view = new ProfileView({model: profile});
      $("#results-list").append(view.render().el);
    },

    addAllProfiles: function(collection, filter) {
      $("#results-list").html("");
      state.profileList.each(this.addOneProfile);
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

  
  // collection of selected tags
  var SelectedTagList = Parse.Collection.extend({
  });

  
  // main view for the app
  var AppView = Parse.View.extend({
    // load the search template
    searchTemplate: _.template($('#search-template').html()),

    // bind to element already in the DOM
    el: $("#visibleeconomies"),

//    onChange: function(e) {
//      console.log("change: " + e);
//    },

    initialize: function() {
      var self = this;

      this.$el.html(_.template($("#page-template").html()));

      var searchView = new SearchView();

      var centre = this.$("#content");
      centre.html(this.searchTemplate());

      //state.on("tagList", this.onChange, this);
    },

    render: function() {
    },
  });

  var AppRouter = Parse.Router.extend({
    routes: {
    },

    initialize: function(options) {
    },
  });


  var state = new AppState;
  state.profileList = new ProfileList();
  state.tagList = new TagList();
  state.selectedTagList = new TagList();


  new AppRouter;
  new AppView;
//  Parse.history.start();
});

