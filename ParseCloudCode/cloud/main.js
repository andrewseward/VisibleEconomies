
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.job("convertMockData", function(request, status) {
  var migration = require('cloud/migration.js');

  var Profile = Parse.Object.extend("Profile");
  var Tag = Parse.Object.extend("Tag");
  var ProfileTag = Parse.Object.extend("ProfileTag");

  var query = new Parse.Query(Profile);
  var counter = 0;

  migration.migrateProfiles();

/*  query.each(function(profile) {
    var point = new Parse.GeoPoint({latitude: profile.get("latitude")/1000, longitude: profile.get("longitude")/1000});
    profile.set("location", point);
    profile.save(null, null);

    migration.makeTags(profile);

    counter++;
  }).then(function() {
    status.success("Migration done");
  }, function(error) {
    status.error("Migration fail");
  });
*/
});


Parse.Cloud.define("topTags", function(request, response) {
  var tags = require('cloud/tag.js');
  tags.topTags(request, response);
});

Parse.Cloud.define("hello", function(request, response) {
  response.success("hello");
});

