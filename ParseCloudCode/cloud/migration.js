exports.migrateProfiles = function() {
  var Profile = Parse.Object.extend("Profile");

  var allTags = {};
  
  var query = new Parse.Query(Profile);
  query.each(function(profile) {
//    console.log("got profile " + profile.get("firstname"));
    var point = new Parse.GeoPoint({latitude: profile.get("latitude")/1000, longitude: profile.get("longitude")/1000});
    profile.set("location", point);
    profile.save();
   
    exports.makeTags(allTags, profile);
  
    return;
  }).then(function() {
    // return?
  }, function(error) {
    // return?
  });
}

exports.makeTags = function(allTags, profile) {
  if (profile.get("skill1") != "") {
    exports.makeTag(profile.get("skill1"), allTags, profile);
  }

  if (profile.get("skill2") != "") {
    exports.makeTag(profile.get("skill2"), allTags, profile);
  }

  if (profile.get("skill3") != "") {
    exports.makeTag(profile.get("skill3"), allTags, profile);
  }

}

exports.makeTag = function(tagName, allTags, profile) {
  var Tag = Parse.Object.extend("Tag");
  var ProfileTag = Parse.Object.extend("ProfileTag");
  var tag = allTags[tagName];

  if (tag == null) {
    tag = new Tag();
    tag.set("tagName", tagName);
    tag.set("usage", 1);

    allTags[tagName] = tag;
  } else {
    tag.increment("usage");
  }

  tag.save();

  var profileTag = new ProfileTag();
  profileTag.set("tag", tag);
  profileTag.set("profile", profile);
  profileTag.save();
}

exports.getTagByName = function(tagName) {
  var Tag = Parse.Object.extend("Tag");
  var query = new Parse.Query(Tag);
  query.equalTo("tagName", tagName);
  query.first({
    success: function(object) {
      return object;
    },
    error: function(error) {
      return null;
    }
  })
  return null;
}
