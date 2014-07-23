(function (global) {
	var init = function(loaded, spec) {
		if (loaded) {
			var sessionRequest = new chrome.cast.SessionRequest(spec.appId);
			chrome.cast.initialize(
				new chrome.cast.ApiConfig(
					sessionRequest,
				    spec.sessionListener,
					function receiverListener(msg) {
						if (msg === chrome.cast.ReceiverAvailability.AVAILABLE) {
							castApi.openSession(spec.sessionListener);
						}
					}
				),
				function () { console.log("chrome cast initialitation succeeded for app", spec.appId); },
				function () { console.warn("chrome cast initialitation failed for app", spec.appId); }
			);
		} else {
			console.warn("Could not load cast API. Are you on Chrome with the Chromecast extension installed?");
		}
	};
	global.castApi = {
		init: function (spec) {
			if (chrome.cast && chrome.cast.media) {
				init(true, spec);
			} else {
				window.__onGCastApiAvailable = function (loaded) {
					init(loaded, spec);
				};	
			}
		},
		openSession: function (onSessionOpen) {
			chrome.cast.requestSession(
				onSessionOpen,
				function onLaunchError(err) {
					console.warn(err);
				}
			);
		},
		loadMedia: function(session, url, contentType, successHandler, errorHandler) {
			var mediaInfo = new chrome.cast.media.MediaInfo(url),
				loadRequest;
				
			mediaInfo.contentType = contentType;
			loadRequest = new chrome.cast.media.LoadRequest(mediaInfo);
			
			session.loadMedia(
				loadRequest,
				successHandler,
			   	errorHandler
			);
		}
	};
}(this));
