exports.matchingProfiles = function(request, response) {
  var query = new Parse.Query("Profile");
//  query.limit(10);
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("profile fetch error");
    }
  });
}

