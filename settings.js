$(document).ready(function() {
	var g_checkbox = $("input[type=checkbox]");

	$('label').click(function(){
		if( $(g_checkbox).is(':checked') ) {
			console.log('Must now hide ads');
			chrome.storage.sync.set({hide_ads: true}, function() {
				if (chrome.runtime.error) {
					console.log("Runtime error.");
				}
			});
		} else {
			console.log('Must now show ads');
			chrome.storage.sync.set({hide_ads: false}, function() {
				if (chrome.runtime.error) {
					console.log("Runtime error.");
				}
			});
		}
	});

	chrome.storage.sync.get({hide_ads: false}, function(settings) {
		if (settings.hide_ads) {
			$(g_checkbox).prop('checked', true);
		}
	});
});