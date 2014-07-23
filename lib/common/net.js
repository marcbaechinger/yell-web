(function (global) {
	
	var getJson = function (url) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onreadystatechange = function(e) {
			  if (this.readyState == 4 && this.status == 200) {
				try {
				    resolve(JSON.parse(this.responseText));
				} catch (e) {
					reject(new Error("error parsing response"));
				}
			  }
			};
			xhr.onerror = function() {
				reject(Error("Network Error"));
			};
			xhr.send();
		});
	};
	
	var getText = function (url) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.overrideMimeType('text/plain; charset=x-user-defined');
			xhr.onreadystatechange = function(e) {
			  if (this.readyState == 4 && this.status == 200) {
				try {
				    resolve(this.responseText);
				} catch (e) {
					reject(e);
				}
			  }
			};
			xhr.onerror = function() {
				reject(Error("Network Error"));
			};
			xhr.send();
		});
	};
	
	global.net = {
		getJson: getJson,
		getText: getText
	};
	
}(this));