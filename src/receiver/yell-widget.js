(function (global) {
	
	var renderYellElement = function (yel) {
		var el = document.createElement("div"),
			img = document.createElement("img"),
			label = document.createElement("label");
		
		el.classList.add("yell-node");
		el.setAttribute("id", yel.url);
		
		img.setAttribute("width", "100%");	
		img.src = yel.url;
		
		label.appendChild(document.createTextNode(yel.label));
		
		img.addEventListener("load", function () {
			el.appendChild(img);
			el.appendChild(label);
		});
		return el;
	};
	
	global.YellWidget = function (spec) {
		var yell = spec.data;
		
		this.appendTo = function (parent) {
			parent.appendChild(renderYellElement(yell));
		};
	};
} (this));