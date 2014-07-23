(function (global) {
	var RpcObject = function (spec) {
		this.execute = function (command) {
			var func = spec.target[command.name];
			if (typeof func === 'function') {
				func.apply(spec.target, command.arguments);
			}
		};
	};
	
	global.RpcObject = RpcObject;
} (this));