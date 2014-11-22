Parse.Cloud.job("convert1", function(request, status) {
  var migration = require('cloud/migration.js');

console.log("convert1 started");
  migration.createTags();
//  status.success("Create tags done");
});

Parse.Cloud.job("convert2", function(request, status) {
  var migration = require('cloud/migration.js');

  migration.addTagsToProfiles();
//  status.success("Migration done");
});


Parse.Cloud.define("topTags", function(request, response) {
  var tags = require('cloud/tag.js');
  tags.topTags(request, response);
});

Parse.Cloud.define("matchingProfiles", function(request, response) {
  var profile = require('cloud/profile.js');
  profile.matchingProfiles(request, response);
});

Parse.Cloud.define("hello", function(request, response) {
  response.success("hello");
});

