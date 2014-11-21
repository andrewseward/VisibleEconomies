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

    template: _.template($('#tag-template').html()),

    events: {
      "click label.tag-name" : "selectedTagClick",
    },

    selectedTagClick: function(event) {
      state.selectedTagList.remove(this.model);
      state.tagList.add(this.model);
    },

    initialize: function() {
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
  });


  var AvailableTagView = Parse.View.extend({
    tagName:  "li",

    template: _.template($('#tag-template').html()),

    events: {
      "click label.tag-name" : "availableTagClick",
    },

    availableTagClick: function(event) {
      state.tagList.remove(this.model);
      state.selectedTagList.add(this.model);
    },
    
    initialize: function() {
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
  });


  var ResultsView = Parse.View.extend({
    template: _.template($('#results-list').html()),

    initialize: function() {
    },
    
    render: function() {
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
      _.bindAll(this, 'addOneAvailableTag', 'addAllAvailableTags', 'addOneSelectedTag', 'addAllSelectedTags', 'addOneProfile', 'addAllProfiles');

      this.fetch()
      
      state.tagList.on("add remove", this.addAllAvailableTags, this);
      state.selectedTagList.on("add remove", this.addAllSelectedTags, this);
    },

    fetch: function() {
      var profileList = state.profileList;

      var self = this;
      Parse.Cloud.run("topTags", "", {
        success: function(result) {
          state.tagList.add(result);
          self.addAllAvailableTags();
        }
      });
      Parse.Cloud.run("matchingProfiles", "", {
        success: function(result) {
          profileList.add(result);
          self.addAllProfiles();
        }
      });
    },

    render: function() {
      return this.$searchTemplate;
    },

    addOneAvailableTag: function(tag) {
      var view = new AvailableTagView({model: tag});
      $("#top-tags").append(view.render().el);
    },

    addAllAvailableTags: function(collection, filter) {
      $("#top-tags").html("");
      state.tagList.each(this.addOneAvailableTag);
    },

    addOneSelectedTag: function(tag) {
      var view = new SelectedTagView({model: tag});
      $("#selected-tags").append(view.render().el);
    },

    addAllSelectedTags: function(collection, filter) {
      $("#selected-tags").html("");
      state.selectedTagList.each(this.addOneSelectedTag);
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

