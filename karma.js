$(document).ready(function() {
	if (document.domain.endsWith("reddit.com")) {
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
	}
	else{
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
	if ($(val).attr('data-domain') == "imgur.com" || 
		$(val).attr('data-domain') == "i.redd.it" || 
		$(val).attr('data-domain') == "i.reddituploads.com" || 
		$(val).attr('data-domain') == "i.imgur.com" || 
		$(val).attr('data-domain') == "i.gyazo.com" || 
		$(val).attr('data-domain') == "gfycat.com" || 
		$(val).attr('data-domain') == "media.giphy.com" || 
		$(val).attr('data-domain') == "youtube.com")
	{	
		//We find the url of the reddit post and add the karmadecay prefix
		var fullurl = "http://karmadecay.com" + $(this).find("li.first a").attr("href").toString().substr($(val).find("li.first a").attr("href").indexOf("/r/")) + "?via=chromeExtension";

		//We add the karmadecay link
		$(val).find("ul").append('<li><a target="_blank" href="' + fullurl + '">karmadecay</a></li>');
	}
}
