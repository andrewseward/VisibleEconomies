exports.createTags = function() {
  var Profile = Parse.Object.extend("Profile");

  var query = new Parse.Query(Profile);
//  query.limit(2);
  query.find({
    success: function(profiles) {
      console.log("got profiles: " + profiles.count);
      exports.processProfiles(profiles);
    },
    error: function() {
      console.log("failure");
    }
  });
}

exports.processProfiles = function(profiles) {
console.log("processProfile...");

  var _ = require('underscore');
  var allTagNames = [];
  profiles.forEach(function(profile) {
console.log("collecting tags from profile: " + profile.get("firstname"));
console.log("skills: " + profile.get("skill1") + " " + profile.get("skill2") + " " + profile.get("skill3"));
    if (!_.contains(allTagNames, profile.get("skill1"))) {
      allTagNames.push(profile.get("skill1"));
    }
    if (!_.contains(allTagNames, profile.get("skill2"))) {
      allTagNames.push(profile.get("skill2"));
    }
    if (!_.contains(allTagNames, profile.get("skill3"))) {
      allTagNames.push(profile.get("skill3"));
    }

    var point = new Parse.GeoPoint({latitude: profile.get("latitude")/1000, longitude: profile.get("longitude")/1000});
console.log("setting geopoint: " + point.latitude + " " + point.longitude);
    profile.set("geopoint", point);
    point = profile.get("geopoint");
console.log("geopoint is: " + point.latitude + " " + point.longitude);
    profile.save();
  });

  // now create the tag objects
  var allTags = {};
  allTagNames.forEach(function(tagName) {
console.log("tagName: " + tagName);
    if (tagName != "") {
        var Tag = Parse.Object.extend("Tag");
        var tag = new Tag();
        tag.set("tagName", tagName);
        tag.set("usage", 0);
        allTags[tagName] = tag;
        tag.save();
    }
  });
}


exports.addTagsToProfiles = function() {
  var Tag = Parse.Object.extend("Tag");

  var allTags = {};
  var tagQuery = new Parse.Query(Tag);  
  tagQuery.find({
    success:function(tags) {
      tags.forEach(function(tag) {
        allTags[tag["tagName"]] = tag;
      });
      exports.doAddTags(allTags);
    },
    error: function() {
      console.log("faiure");
    }
  });
}

exports.doAddTags = function(allTags) {
  var Profile = Parse.Object.extend("Profile");

  var query = new Parse.Query(Profile);
//  query.limit(2);
  query.find({
    success: function(profiles) {
      exports.processProfiles2(profiles, allTags);
    },
    error: function() {
      console.log("failure");
    }
  });
}

exports.processProfiles2 = function(profiles, allTags) {
  var Tag = Parse.Object.extend("Tag");
  var Profile = Parse.Object.extend("Profile");

  // now add tags to profiles
  profiles.forEach(function(profile) {
console.log("adding tags to profile: " + profile.get("firstname"));
    var relation = profile.relation("tags");
    
    if (profile.get("skill1") != null) {
      var tag = allTags[profile.get("skill1")];
      relation.add(tag);
//      tag.increment("usage");
console.log("done skill1");
    }
    
    if (profile.get("skill2") != null) {
      var tag = allTags[profile.get("skill2")];
      relation.add(tag);
//      tag.increment(usage);
console.log("done skill2");
    }
    
    if (profile.get("skill3") != null) {
      var tag = allTags[profile.get("skill3")];
      relation.add(tag);
//      tag.increment(usage);
console.log("done skill3");
    }

    profile.save();
console.log("saved profile after adding relation");
  });

/*  allTags.forEach(function(tagName, tag) {
    tag.save();
console.log("saved tag " + tagName);
  });
  */
}

/*
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
  var Tag = Parse.Object.extend("Tag");
  var tag = allTags[tagName];

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
  
  var relation = profile.relation("tags");
  relation.add(tag);
  profile.save();

//  var profileTag = new ProfileTag();
//  profileTag.set("tag", tag);
//  profileTag.set("profile", profile);
//  profileTag.save();
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
*/
