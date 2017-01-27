function hasResInstalled()
{
	chrome.management.get("kbmfpngjjgdllneeigpgjifpgocmfgmb", function(extensionInfo) {
		var isInstalled;
		if (chrome.runtime.lastError) {
			console.log("RES is not installed");
			isInstalled = false;
	    } else {
			//The extension is installed. Use "extensionInfo" to get more details
			console.log("RES is installed");
			isInstalled = true;
		}
		chrome.storage.sync.set({hasResInstalled: isInstalled});
	});
}

//Check regularly if RES is installed
chrome.runtime.onInstalled.addListener(hasResInstalled);
chrome.runtime.onStartup.addListener(hasResInstalled);