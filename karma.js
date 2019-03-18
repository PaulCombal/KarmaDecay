var g_hide_ads = false;

$(document).ready(function() {
	if (document.domain.endsWith("reddit.com")) {
		if ($("div#SHORTCUT_FOCUSABLE_DIV").length == 0) {
			// old reddit
			console.log("Old reddit design detected");

			//The first page doesnt have a container, so we have to look on the whole page
			//We select the posts that link to imgur on the page
			$(this).find('.link.thing').each(addLinkOnPost);

			chrome.storage.sync.get({hasResInstalled: false}, function(data){
				if(data.hasResInstalled){
					//All the following will only be used by RES users
					//We need to check if RES added a new page continuously
					//To do that, we  count the number of .NERPageMarker and check every second if a new one popped up
					console.log("RES installed")
					var initialNumberOfPages = $(".NERPageMarker").length;

					setInterval(function(){
						//If RES added a new page
						if ($(".NERPageMarker").length > initialNumberOfPages) {
							//We update the number of pages loaded
							initialNumberOfPages = $(".NERPageMarker").length;

							console.log("New page loaded");

							//For each new post with a link on the last page loaded
							$(".NERPageMarker").last().next().find(".link.thing").each(addLinkOnPost);
						} //End of if
					}, 1000); //End of setInterval
				} //End of if RES installed condition
				else{
					console.log("RES not installd");
				}
			}); //End of getting RES installed

		} else {
			// New reddit design
			chrome.storage.sync.get({hide_ads: false}, function(settings) {
				g_hide_ads = settings.hide_ads;
				console.log('Hide ads?', g_hide_ads);
			});

			console.log("New Reddit design detected");
			let posts_container = $('.Post').first().parent().parent().parent();

			// Process all the threads that were here before this event is registered
			$('.Post').each((i, e) => {
				if ($(e).prop('tagName') == 'DIV') {
					addLinkOnPostNewDesign(e);
				}
			});

			// Process all the threads that will be inserted
			$(posts_container).on('DOMNodeInserted', function(e) {
				if ($(e.target).hasClass('Post')) {
					addLinkOnPostNewDesign(e.target);
				}
				else {
					let pleasefind = $(e.target).find('.Post');
					if (pleasefind.length)
					{
						pleasefind = pleasefind.first();
						addLinkOnPostNewDesign(pleasefind);
					}
				}
		    });
		}
	}
	else 
	{
		//9fag
		setInterval(()=>{
			$("article:not([kd])").each((i, post)=>{

				var formstring = `
				<form action="http://karmadecay.com/index/" enctype="multipart/form-data" method="post" target="_blank" style="height: 100%;">
					<input type="hidden" name="MAX_FILE_SIZE" value="10485760">
					<input type="hidden" name="url" value="` + $(post).find("img").attr("src") + `">
					<input type="submit" name="search" value="KD" style="
						margin: 0;
						padding: 0;
						display: list-item;
						height: 100%;
						width: 100%;
						color: #999;
						background: white;
					">
				</form>`;

				$(post).find("ul.btn-vote")
				.append('<li><a class="badge-evt" target="_blank">' + formstring + '</a></li>')

				$(post).attr("kd", "1");
			});
		},
		2000);
	}
}); //End of document.ready callback

function addLinkOnPost(i, val)
{
	const domain = $(val).attr('data-domain');
	const domains = [
		'imgur.com', 
		'i.redd.it', 
		'i.reddituploads.com',
		'i.imgur.com',
		'i.gyazo.com',
		'media.giphy.com',
		'youtube.com'
	];

	if (domains.includes(domain))
	{	
		//We find the url of the reddit post and add the karmadecay prefix
		const fullurl = "http://karmadecay.com" + $(this).find("li.first a").attr("href").toString().substr($(val).find("li.first a").attr("href").indexOf("/r/")) + "?via=chromeExtension";

		//We add the karmadecay link
		$(val).find("ul").append('<li><a target="_blank" href="' + fullurl + '">karmadecay</a></li>');
	}
}

function addLinkOnPostNewDesign(e) {
	const reddit_self_url = $(e).find('[data-click-id=timestamp]').first().attr("href");
	const is_ad = $(e).attr('id').length > 20;
	
	//console.log('YO', e, reddit_self_url, is_ad);

	if (g_hide_ads && is_ad) {
		$(e).hide();

		console.log('Ad dismissed');	
		console.log($(e).text());
		return;	
	}

	try
	{
		let url = new URL(reddit_self_url);
		url = url.pathname;
		const kd_url = 'http://karmadecay.com' + url;
		//console.log('Added link ', kd_url);
	
		var buttons_bar = $(e).find('> div').last().find('> div').last();
		var save_button = buttons_bar.children().eq(1).children().eq(2);

		const cool_button_classes = save_button.attr('class');
		const new_link_html = '<a target="_blank" class="' + cool_button_classes + '" href="' + kd_url + '">Karmadecay</a>';
	
		save_button.after(new_link_html);
	}
	catch(e)
	{
		console.warn("This bad --> " + reddit_self_url, e);
	}
}