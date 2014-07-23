window.onload = function() {
	cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
	
	var yells = [],
		layouts = {
			"0": "plus0",
			"1": "plus1",
			"2": "plus2",
			"3": "plus3",
			"4": "plus4",
			"6": "plus6",
			"8": "plus8",
			"9": "plus9"
		},
		yellListView = document.getElementById("yell-list"),
		hasYell = function (yell) {
			var contained = false;
			yells.forEach(function (item) {
				if (item.uuid === yell.uuid) {
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
		calculateLayout = function () {
			var len = yells.length;
			for (layout in layouts) {
				document.body.classList.remove(layouts[layout]);
			}
			if (len < 2) {
				document.body.classList.add("plus0");
			} else if (len == 2) {
				document.body.classList.add("plus1");
			} else if (len == 3) {
				document.body.classList.add("plus2");
			} else if (len == 4) {
				document.body.classList.add("plus3");
			} else if(len == 5 || len == 6) {
				document.body.classList.add("plus4");
			} else if (len == 7 || len == 8) {
				document.body.classList.add("plus6");
			} else if (len == 9) {
				document.body.classList.add("plus8");
			} else {
				document.body.classList.add("plus9");
			}
		},
		renderAll = function (yells, parentNode) {
			var layout;
			calculateLayout();
			yells.forEach(function(yell) {
				if (!document.getElementById(yell.uuid)) {
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
		addYellNode = function(yell) {
			if (!hasYell(yell)) {
				yells.push(yell);
				renderAll(yells, yellListView);	
				store();
			}
		},
		removeYellNode = function (yellToRemove) {
			var uuid = yellToRemove.uuid,
				widget = document.getElementById(uuid),
				pos = -1;
				
			if (widget) {
				widget.parentNode.removeChild(widget);
			}
			yells.forEach(function (yell, idx) {
				if (yell.uuid === uuid) {
					pos = idx;
				}
			});
			if (pos > -1) {
				yells.splice(pos, 1);
				store();
			}
			calculateLayout();
		},
		actions = {
			add: function (message) {
				addYellNode(message.node);
			},
			remove: function (message) {
				removeYellNode(message.node);
			}
		};
	
	load();
	renderAll(yells, yellListView);
	
	window.addYellNode = addYellNode;
	window.removeYellNode = removeYellNode;
	
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
				console.error(e, "error while dispatching inbound message", e, ev.data);
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