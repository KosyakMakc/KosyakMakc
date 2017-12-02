main.players = new (function () {
	var players = {};
	this.add = function (name) {
		players[name] = new Events();
		players[name].units = [];
		players[name].name = name;
		main.emit("connect", players[name]);
	};
	this.getAll = function () {
		var res = [];
		for (var key in players) res.push(players[key]);
		return res;
	};
	this.get = function (name) { return players[name]; };
	this.delete = function (name) {
		main.emit("disconnect", players[name]);
		delete players[name];
	};
	main.on("frame", function () { for (var key in players) for (var i = 0; i < players[key].units.length; i++) players[key].units[i].control.update(); });
})();
main.on("loaded", function () { main.players.add("#ffffff"); });
main.baseObject = {};
main.baseObject.__proto__ = Events.prototype;
main.baseObject.deconstract = function () {
	this.emit("remove");
	this.fraction.emit("removeUnit", this);
	this.fraction.units.splice(this.unitId, 1);
	for (var i = 0; i < this.fraction.units.length; i++) this.fraction.units[i].unitId = i;
	for (var y = 0; y < this.size; y++) {
		for (var x = 0; x < this.size; x++) {
			var b = this.tileY + y;
			var a = this.tileX + x;
			for (var i = 0; i < main.level.floors[0].map[b][a].object.length; i++) {
				if (main.level.floors[0].map[b][a].object[i].i == this.i) {
					main.level.floors[0].map[b][a].object.splice(i, 1);
					break;
				}
			}
		}
	}
};
main.baseObject.physicalMoveTo = function (p) {
	for (var y = 0; y < this.size; y++) {
		for (var x = 0; x < this.size; x++) {
			var a = this.tileX + x;
			var b = this.tileY + y;
			if (isTile(a, b)) {
				for (var i = 0; i < main.level.floors[0].map[b][a].object.length; i++) {
					if (main.level.floors[0].map[b][a].object[i] == this) {
						main.level.floors[0].map[b][a].object.splice(i, 1);
						break;
					}
				}
			}
		}
	}
	var a = findFreeTile(main.level.floors[0].map[p.y || 0][p.x || 0], this.size);
	for (var y = 0; y < this.size; y++) 
		for (var x = 0; x < this.size; x++) {
			main.level.floors[0].map[a.y + y][a.x + x].object.push(this);
		}
	this.x = this.tileX = a.x;
	this.y = this.tileY = a.y;
	main.level.floors[0].draw = 1;
}	
main.UnitObject = function (type, obj) {
	this.__proto__ = new Events();
	this.__proto__.__proto__ = main.level.units[type];
	this.control = new Control(this);
	this.fraction = main.players.get(obj.fraction) || main.players.get("#ffffff");
	this.unitId = this.fraction.units.length;
	this.physicalMoveTo({x: obj.x, y: obj.y});
	this.fraction.units.push(this);
	this.fraction.emit("addUnit", this);
};
function Control (parent) {
	this.control = parent instanceof Control ? parent : null;
	this.self = parent.self || parent;
	this.commands = [];
}
Control.prototype = {
	close: function () {
		if (this.control) this.control.shift();
		else this.set("wait");
	},
	set: function (name, param) {
		if (this.commands[0]) this.commands[0].close();
		this.commands.shift();
		var args = {
			unit: this.self,
			name: name,
			fraction: main.fraction,
			control: this
		};
		if (param) args.__proto__ = param;
		var a = main.level.commands[name](args);
		if (a) {
			this.commands = [a];
			this.commands[0].name = name;
		}
	},
	push: function (name, param) {
		var args = {
			unit: this.self,
			name: name,
			fraction: main.fraction,
			control: this
		};
		if (param) args.__proto__ = param;
		this.commands.push(args);
	},
	shift: function () {
		this.commands.shift();
		if (this.commands.length) {
			var name = this.commands[0].name;
			var a = main.level.commands[name](this.commands[0]);
			if (a) {
				this.commands[0] = a;
				this.commands[0].name = name;
			} else this.commands.shift();
		} else this.close();
	},
	update: function () {
		if(!this.commands.length) this.close();
		else this.commands[0].update();
	}
}