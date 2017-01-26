$(document).ready(function() {

	$(this).find('.link.thing').each(function(){
		if ($(this).attr('data-domain') == "imgur.com") {
			console.log($(this).attr('data-url'));
			console.log($(this).find("ul").text());
			$(this).find("ul").append('<li><a target="_blank" href="google.com">KarmaDecay</a></li>');
		}
	});

});