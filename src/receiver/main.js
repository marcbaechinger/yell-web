window.onload = function() {
	cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
	
	var yells = [],
		yellListView = document.getElementById("yell-list"),
		hasYell = function (yell) {
			var contained = false;
			yells.forEach(function (item) {
				if (item.url === yell.url) {
					contained = true;
				}
			});
			return contained;
		},
		renderYell = function(yell, parent) {
			var yellWidget = new YellWidget({
				data: yell
			});
			yellWidget.appendTo(parent);
		},
		renderAll = function (yells, parentNode) {
			yells.forEach(function(yell) {
				if (!document.getElementById(yell.url)) {
					renderYell(yell, yellListView);
				}
			});
		},
		load = function () {
			if (localStorage.yells) {
				yells = JSON.parse(localStorage.yells);
			} else {
				yells = [];
			}
		},
		store = function () {
			localStorage.yells = JSON.stringify(yells);
		},
		actions = {
			add: function (message) {
				var yell = message.node;
				if (!hasYell(yell)) {
					yells.push(yell);
					renderAll(yells, yellListView);	
					store();
				}
			},
			remove: function (message) {
				var url = message.node.url,
					widget = document.getElementById(url),
					pos = -1;
					
				if (widget) {
					widget.parentNode.removeChild(widget);
				}
				yells.forEach(function (yell, idx) {
					if (yell.url === url) {
						pos = idx;
					}
				});
				if (pos > -1) {
					yells.splice(pos, 1);
					store();
				}
			}
		};
	
	load();
	renderAll(yells, yellListView);
	
	var castApp = new Application({
		namespace: "urn:x-cast:com.yellcast.v1.protocol",
		messageListener: function (ev) {
			try {
				var message = JSON.parse(ev.data),
					action = actions[message.action];
				
				if (action) {
					action(message);
				} else {
					console.warn("unhandled message", message);
				}
			} catch (e) {
				console.error(e, "failed parsing command which is expected to be json", ev.data);
			}
		},
		connect: function(ev) {
			castApp.send(ev.senderId, {
				action: "status",
				yells: yells
			});
		}
	});
};