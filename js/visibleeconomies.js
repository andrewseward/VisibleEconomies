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

      state.selectedTagNames = [];
      state.selectedTagList.forEach(function(tag) {
        state.selectedTagNames.push(tag.get("tagName"));
      });
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

      state.selectedTagNames = [];
      state.selectedTagList.forEach(function(tag) {
        state.selectedTagNames.push(tag.get("tagName"));
      });
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
      state.selectedTagList.on("add remove", this.fetch, this);
      state.profileList.on("profileschanged", this.profilesChanged, this);
    },

    profilesChanged: function() {
      clearMapMarkers();
      state.profileList.toArray().forEach(function(object) {
        var jsonObject = object.toJSON();
        var firstName = jsonObject["firstname"];
        var geoPoint = jsonObject["geopoint"];

        addMapMarker(geoPoint.latitude, geoPoint.longitude, jsonObject["objectId"]);
//        console.log("firstname/lat/lon: " + firstName + " " + geoPoint.latitude + " " + geoPoint.longitude);
      });
    },

    fetch: function() {
      var self = this;

      var tagNames = [];
      state.selectedTagList.toArray().forEach(function(object) {
        tagNames.push(object.toJSON().tagName);
      });

      Parse.Cloud.run("topTags", {"tagNames":tagNames}, {
        success: function(result) {
          state.tagList.remove(state.tagList.toArray());

          result.forEach(function(tag) {
            // hack!
            if (!_.contains(state.selectedTagNames, tag.toJSON()["tagName"])) {
                state.tagList.add(tag);
            }
          });
          //state.tagList.add(result);
          self.addAllAvailableTags();
        }
      });
      Parse.Cloud.run("matchingProfiles", {"tagNames":tagNames}, {
        success: function(result) {
          state.profileList.remove(state.profileList.toArray());
          var probability;
          if (state.selectedTagNames.length == 0)
            probability = 1.0;
          else if (state.selectedTagNames.length == 1)
            probability = 0.4;
          else if (state.selectedTagNames.length == 2)
            probability = 0.2;
          else
            probability = 0.1;


          result.forEach(function(profile) {
            if (Math.random() < probability) {
              var bigstring = profile.get("firstname") + profile.get("lastname") + profile.get("email");
              var stringlength = bigstring.length;
              var imageNumber = stringlength %17;
              var image = "images/" + imageNumber + ".jpg";
              profile.set("image", image);
              state.profileList.add(profile);
            }
          });
          state.profileList.trigger("profileschanged");
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

  // collection of selected tags
  var SelectedTagList = Parse.Collection.extend({
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

      initializeMap();
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
  // hack
  state.selectedTagNames = [];


  new AppRouter;
  new AppView;
//  Parse.history.start();


/*  var profileQuery = new Parse.Query("Profile");
  profileQuery.containedIn("tagName", ["enamel", "woodwork"]);
  profileQuery.find({
    success: function(tagResults) {
      console.log("success");
    },
    error: function() {
      console.log("failure");
    }
  });

  // this finds all the joins where those tags appear
  var joinQuery = new Parse.Query("ProfileTag");
  joinQuery.matchesQuery("tag", tagQuery);
  joinQuery.limit(20);
//  joinQuery.includeKey("profile");

  joinQuery.find({
    success: function(joinResults) {
      var profiles = [];

      joinResults.forEach(function(object) {
        profiles.push(object.profile);
      });

     console.log("success");
    },
    error: function() {
      console.log("failure");
    }
  });
*/
});

