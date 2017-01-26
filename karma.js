$(document).ready(function() {
	//We select the posts that link to imgur
	$(this).find('.link.thing').each(function(){
		if ($(this).attr('data-domain') == "imgur.com") {
			//We find the url of the reddit post and add the karmadecay prefix
			var fullurl = "http://karmadecay.com" + $(this).find("li.first a").attr("href").toString().substr($(this).find("li.first a").attr("href").indexOf("/r/"));

			//We add the karmadecay link
			$(this).find("ul").append('<li><a target="_blank" href="' + fullurl + '">KarmaDecay</a></li>');
		}
	});

});