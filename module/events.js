function Events () {
	this.__events = {};
}
Events.prototype.on = function (name, cb) {
	if(!this.__events[name]) this.__events[name] = [];
	this.__events[name].push(cb);
}
Events.prototype.emit = function (name, argv) {
	if (this.__events[name]) {
		for (var i = 0; i < this.__events[name].length; i++) {
			this.__events[name][i](argv);
		}
	}
}
Events.prototype.remove = function (name, cb) {
	if (this.__events[name]) {
		for (var i = 0; i < this.__events[name].length; i++) {
			if (this.__events[name][i] === cb) {
				this.__events[name].splice(i, 1);
				return;
			}
		}
	}
}