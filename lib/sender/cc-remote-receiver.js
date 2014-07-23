(function (global) {

	var util = {
		debug: true,
		handler: function (message) {
			if (util.debug) {
				return function() { console.log(message); };
			} else {
				return function noop() {};
			}
		}
	};

	var ChromeCastReceiverApp = function (spec) {
		var session, currentMedia,
			ui = spec.ui || {};
	
		var sessionListener = function (connectedSession) {
				if (util.debug) {
					console.log("session connected", connectedSession);
				}
				session = connectedSession;
				if (session.media.length != 0) {
					onMediaDiscovered(session.media[0]);
				}
				showMediaSection();
			},
			showMediaSection = function (hide) {
				if (ui.media) {
					if (hide === true) {
						ui.media.hide();
					} else {
						ui.media.show();	
					}
				}
			},
			showMediaPlayer = function (hide) {
				if (ui.player) {
					if (hide === true) {
						ui.player.hide();
					} else {
						ui.player.show();	
					}
				}			
			},
			onMediaDiscovered = function (media) {
				currentMedia = media;
				currentMedia.addUpdateListener(onMediaStatusUpdate);
				showMediaPlayer();
			},
			onMediaStatusUpdate = function (isAlive) {
				if (typeof isAlive !== 'undefined' && !isAlive) {
					currentMedia.removeUpdateListener(onMediaStatusUpdate);
					currentMedia = undefined;
					showMediaPlayer(true);
					if (util.debug) {
						console.log("unset media object");
					}
				}
				console.log("media update", currentMedia);
			};
		
		this.init = function () {
			global.castApi.init({
				appId: spec.appId,
				sessionListener: sessionListener
			});
		};
		this.loadMedia = function (url, contentType, errorHandler) {
			if (session) {
				castApi.loadMedia(session, url, contentType, 
					onMediaDiscovered, 
					function onMediaError(err) {
						console.warn(err);
					}
				);
			} else {
				console.error("no open session. Can't load media", url);
			}
		};
		this.play = function () {
			if (currentMedia) {
				currentMedia.play(null, util.handler("playing media succeeded"), util.handler("playing media failed"));
			}
		};
		this.pause = function () {
			if (currentMedia) {
				currentMedia.pause(null, util.handler("pausing media succeeded"), util.handler("pausing media failed"));
			}
		};
		this.stop = function () {
			if (currentMedia) {
				currentMedia.stop(null, util.handler("stopping media succeeded"), util.handler("stopping media failed"));
			}
		};
		this.send = function (namespace, message) {
			if (session) {
				session.sendMessage(namespace, message, 
					util.handler("sent message: " + JSON.stringify(message)), 
					util.handler("failed sending message: " + message)
				);
			}
		};
		return this;
	};
	
	global.ChromeCastReceiverApp = ChromeCastReceiverApp;
}(this));