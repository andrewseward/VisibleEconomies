var map;
var markers = [];

var markerImage = new google.maps.MarkerImage(
    'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Azure.png',
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new google.maps.Size(30, 30)
  );

var highlightMarkerImage = new google.maps.MarkerImage(
    'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png',
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new google.maps.Size(30, 30)
  );

function initializeMap() {
  var mapOptions = {
    zoom: 9
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'You are here'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function clearMapMarkers(){
  for (var i=0; i<markers.length; i++){
    markers[i].setMap(null);
  }
  markers = [];
}

function addMapMarker(latitude, longitude, objectId){


  /*var markerImage = {
    url: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Azure.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(20, 32),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 32)
  };*/



  var newMarker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      icon: markerImage,
      title: objectId
  });

  markers.push(newMarker);
}

function highlightMarker(objectId){
  unHighlightMarkers();
  var marker = getMarkerById(objectId);
  marker.setIcon(highlightMarkerImage);
}

function getMarkerById(objectId){
  var marker = null;

  var i=0;
  while ((i < markers.length) && (marker==null))
  {
    if (markers[i].getTitle() == objectId){
      marker= markers[i];
    }
    i++;
  }
  return marker;
}

function unHighlightMarkers(){
  for (var i=0; i<markers.length; i++){
    markers[i].setIcon(markerImage);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

//google.maps.event.addDomListener(window, 'load', initialize);
