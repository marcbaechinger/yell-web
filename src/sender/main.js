(function (global) {
	// connect to ui events
	var receiverApp = new ChromeCastReceiverApp({
		appId: "4FF83149", //"BE6E4473"
		ui: {
			media: $("#media")
		}
	});
	
	$("#connect").on("click", function () {
		receiverApp.init();
	});
} (this));