$("body").append("<div id='opaque' style='display: none;'></div>");

$(document).bind('loading.facebox', function() {
    $("#opaque").show();
});
$(document).bind('close.facebox', function() {
    $("#opaque").hide();
});
$(document).bind('afterReveal.facebox', function() {
    // this is a fix for IE6 which resets the height to 100% of the window height
    $("#opaque").height($(document).height());
});

function showVideo(){
  jQuery.facebox("<iframe src=\"//player.vimeo.com/video/112572449?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1\" width=\"750\" height=\"420\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>");
}
