var loadContent = function(href) {
    $("#main").addClass("animated fadeInLeft");
    $(".blogcontent").empty();
    $(".blogcontent").load(href + " #main", function(response, status, xhr) {
	window.scrollTo(0, 0);
	$(".blogcontent").fadeIn(200);
        //$("img").addClass("materialboxed");
	if (status == "error") {
	    var toastContent = $('<span>Page ' + href + ' not found.</span>');
	    Materialize.toast(toastContent, 5000);
	}
    });
}

$(function() {
    if(Modernizr.history) {
	$("#sidebar a").click(function(e) {
	    e.preventDefault();
	    _href = $(this).attr("href");
	    console.log(_href);
	    if(_href !== "#" && _href !== "" && _href !== undefined) {
		history.pushState(null, null, _href);
		loadContent(_href);
	    }
	});
    }
});
