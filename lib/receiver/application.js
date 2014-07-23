(function (global) {
	
	/*
		spec.videoElement
		spec.disconnect => listens for disconnection
		spec.namespace  => the namespace to listen for cast messages 
	*/
	var Application = function (spec) {
		var videoElement = spec.videoElement,
			videoElementManager,
			castReceiverManager,
			messageBus;
			
		this.getConnectedSenders = function() {
			return castReceiverManager.getSenders();
		};
		
		this.broadcast = function(message) {
			console.log("broadcast", message);
			messageBus.broadcast(JSON.stringify(message));
		};
		this.send = function(senderId, message) {
			console.log("send", senderId, message);
			if (senderId && message) {
				messageBus.send(senderId, JSON.stringify(message));	
			}
		};
			
		if (videoElement) {
			// connect media manager to video element
			videoMediaManager = new cast.receiver.MediaManager(spec.videoElement);
		}
		// create the receiver manager
		castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
		if (spec.disconnect) {
			castReceiverManager.onSenderDisconnected = spec.disconnect;
		}

		if (spec.connect) {
			castReceiverManager.onSenderConnected = spec.connect;
		}
		
		// messaging requested?
		if (spec.namespace) {
			messageBus = castReceiverManager.getCastMessageBus(spec.namespace);
			if (spec.messageListener) {
				messageBus.onMessage = spec.messageListener;
			}
		}
		
		castReceiverManager.start({maxInactivity: 600 });
	};
	
	global.Application = Application;

} (this));