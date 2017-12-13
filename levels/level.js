main.level = {
	require: {
		image: [
			"img/cursor.png",
			"img/aim.png",
			"img/houseProduce.png",
			"img/footmanAttackDown.png",
			"img/footmanAttackUp.png",
			"img/footmanAttackRight.png",
			"img/footmanAttackLeft.png",
			"img/footmanMoveDown.png",
			"img/footmanMoveUp.png",
			"img/footmanMoveRight.png",
			"img/footmanMoveLeft.png",
			"img/mageShell.png",
			"img/mageShellAnim.png",
			"img/mageAttackDown.png",
			"img/mageAttackUp.png",
			"img/mageAttackRight.png",
			"img/mageAttackLeft.png",
			"img/mageMoveDown.png",
			"img/mageMoveUp.png",
			"img/mageMoveRight.png",
			"img/mageMoveLeft.png",
			"img/workerMiningDown.png",
			"img/workerMiningLeft.png",
			"img/workerMiningRight.png",
			"img/workerMiningUp.png",
			"img/workerMoveDown.png",
			"img/workerMoveLeft.png",
			"img/workerMoveRight.png",
			"img/workerMoveUp.png",
		],
		libraly: [
			"mods/interface.js",
			"mods/is.js",
			"mods/tiles16.js"
		],
		styles: ["ui.css"]
	},
	tiles : {
		" " : {
			hide: 1
		},
		"1" : {
			img: "img/1.bmp",
			layer: 1,
			fill: "#00ff00"
		},
		"3": {
			passible: 1,
			hide: 1
		}
	},
	units : {
		"house": {
			name: "house",
			img: "img/house.png",
			fill: "#888888",
			size: 3,
			health: 2000,
			layer: 2,
			commands: [
				{ name: "wait",          ico: "img/waitIco.png" },
				{ name: "createWorker",  ico: "img/workerIco.png" },
				{ name: "createFootman", ico: "img/footmanIco.png" },
				{ name: "createMage",    ico: "img/mageIco.png" },
				{ name: "delete",        ico: "img/deleteIco.png" }
			],
			angle: "down"
		},
		"mine": {
			name: "mine",
			img: "img/mine.png",
			fill: "#ffffff",
			size: 2,
			health: 2500,
			layer: 3,
			commands: [
				{ name: "wait", ico: "img/waitIco.png" },
			],
			angle: "down"
		},
		"mage": {
			name: "mage",
			img: "img/mage.png",
			fill: "#ff0000",
			size: 1,
			speed: 2,
			health: 150,
			attack: 15,
			money: 200,
			timeBuild: 2.5,
			attackSpeed: 0.5,
			fpsAttack: 0.125,
			distanceAttack: 7,
			isFire: true,
			shellSpeed: 6,
			layer: 2,
			commands: [
				{ name: "moveTo", ico: "img/moveIco.png", targetable: true }, 
				{ name: "wait",   ico: "img/waitIco.png" },
				{ name: "attack", ico: "img/attackIco.png", targetable: true }, 
				{ name: "delete", ico: "img/deleteIco.png" }
			],
			angle: "down"
		},
		"footman": {
			name: "footman",
			img: "img/footman.png",
			fill: "#ff0000",
			size: 1,
			speed: 1,
			health: 200,
			attack: 10,
			money: 300,
			timeBuild: 2,
			attackSpeed: 1,
			fpsAttack: 0.25,
			distanceAttack: 1.2,
			layer: 2,
			commands: [
				{ name: "moveTo", ico: "img/moveIco.png", targetable: true }, 
				{ name: "wait",   ico: "img/waitIco.png" }, 
				{ name: "attack", ico: "img/attackIco.png", targetable: true },
				{ name: "delete", ico: "img/deleteIco.png" }
			],
			angle: "down"
		},
		"worker": {
			name: "worker",
			img: "img/worker.png",
			fill: "#888888",
			size: 1,
			speed: 3,
			health: 100,
			timeBuild: 2,
			money: 100,
			mineDistance: 1,
			layer: 2,
			commands: [
				{ name: "moveTo", ico: "img/moveIco.png", targetable: true },
				{ name: "wait",   ico: "img/waitIco.png" },
				{ name: "mining", ico: "img/miningIco.png", targetable: true },
				{ name: "delete", ico: "img/deleteIco.png" }
			],
			angle: "down"
		},
	},
	commands: {
		"mining": function (data) {
			if (data.unit.mineDistance < Math.sqrt((data.target.tileX - data.unit.x)*(data.target.tileX - data.unit.x) + (data.target.tileY - data.unit.y)*(data.target.tileY - data.unit.y))) {
				for (var i = 0; i < main.level.floors[0].map[data.target.tileY][data.target.tileX].object.length; i++)
					if(main.level.floors[0].map[data.target.tileY][data.target.tileX].object[i].name == "mine") {
						var a  = new Control(data.control);
						a.set("moveTo", { target: data.target });
						a.push("mining", { target: data.target });
						return a;
					}
			} else {
				for (var i = 0; i < main.level.floors[0].map[data.target.tileY][data.target.tileX].object.length; i++)
					if(main.level.floors[0].map[data.target.tileY][data.target.tileX].object[i].name == "mine") {
						var mine = main.level.floors[0].map[data.target.tileY][data.target.tileX].object[i];
						data.unit.angle = getDirection(data.target.tileX - data.unit.x, data.target.tileY - data.unit.y);
						data.unit.setAnimation("img/" + data.unit.name + "Mining" + data.unit.angle + ".png", 0.1);
						function onremove() { if (mine.health <= 0) data.control.shift(); }
						mine.on("remove", onremove);
						return {
							time: 1,
							update: function () {
								this.time -= main.deltaTime;
								while (this.time < 0) {
									this.time += 1;
									data.unit.fraction.money += 5;
									data.unit.fraction.emit("money");
									mine.health -= 5;
									mine.emit("attack");
									if (mine.health <= 0) {
										if (data.unit.fraction.name == main.fraction) main.message("the forest is cut down");
										data.control.shift();	
										mine.deconstract();
										return;
									}
								}
							},
							close: function () { mine.remove("remove", onremove); },
						};
					}
			}
		},
		"attack": function (data) {
			if(isUnitInTile(data.target.tileX, data.target.tileY)) {
				var map = main.level.floors[0].map
				var obj = map[data.target.tileY][data.target.tileX].object[0];
				var d = Math.sqrt(Math.pow(data.target.tileX - data.unit.x, 2) + Math.pow(data.target.tileY - data.unit.y, 2));
				if (d < data.unit.distanceAttack) {
					data.unit.angle = getDirection(data.target.tileX - data.unit.x, data.target.tileY - data.unit.y);
					function onremove() { obj.remove("remove", onremove); data.control.shift(); }
					obj.on("remove", onremove);
					data.unit.setAnimation("img/" + data.unit.name + "Attack" + data.unit.angle + ".png", data.unit.fpsAttack);
					var a = {
						time: data.unit.attackSpeed,
						update: function () {
							this.time -= main.deltaTime;
							while (this.time <= 0) {
								this.time += data.unit.attackSpeed;
								if (data.unit.isFire) {
									var asd = {
										img: "img/" + data.unit.name + "Shell.png",
										size: 1,
										x: data.target.tileX,
										y: data.target.tileY,
										attack: data.unit.attack,
										layer: 3,
										time: 0.4,
										update: function () {
											this.time -= main.deltaTime;
											if (this.time < 0) {
												for (var i = 0; i < main.level.floors[0].map[this.y][this.x].object.length; i++) {
													var a = main.level.floors[0].map[this.y][this.x].object[i];
													a.health -= this.attack;
													a.emit("attack");
													if(a.health < 0) a.deconstract();
												}
												this.remove();
											}
										}
									}
									main.particles.push(asd);
									asd.setAnimation("img/" + data.unit.name + "ShellAnim.png", 0.1);
								} else {
									obj.health -= data.unit.attack;
									obj.emit("attack");
									if (obj.health <= 0) {
										data.control.shift();
										obj.deconstract();
									}
								}
							}
						},
						close: function () {
							obj.remove("remove", onremove);
						}
					};
					return a;
				} else {
					var a = new Control(data.control);
					var tile = findDistanceTile(map[data.unit.tileY][data.unit.tileX], map[data.target.tileY][data.target.tileX], data.unit.size, data.unit.distanceAttack);
					if (!tile) {
						if (data.unit.fraction.name == main.fraction) main.message(data.unit.name + " can not get there");
						return;
					}
					a.set("moveTo", {
						target: {
							tileX: tile.x,
							tileY: tile.y
						}
					})
					a.push("attack", data);
					return a;
				}
			}
		},
		"createFootman": function (data) {
			if (data.unit.fraction.money < main.level.units["footman"].money) return;
			data.unit.fraction.money -= main.level.units["footman"].money;
			data.unit.fraction.emit("money");
			data.unit.setAnimation("img/" + data.unit.name + "Produce.png", 0.1);
			return {
				update: function () {
					this.time -= main.deltaTime;
					if (this.time < 0) {
						if (data.unit.fraction.name == main.fraction) main.message("footman created");
						new main.UnitObject("footman", {x: data.unit.x, y: data.unit.y, fraction: data.unit.fraction.name});
						data.control.shift();
					}
				},
				time: main.level.units["footman"].timeBuild,
				close: function () {
					data.unit.fraction.money += main.level.units["footman"].money;
					data.unit.fraction.emit("money");
				}
			}
		},
		"createMage": function (data) {
			if (data.unit.fraction.money < main.level.units["mage"].money) return;
			data.unit.fraction.money -= main.level.units["mage"].money;
			data.unit.fraction.emit("money");
			data.unit.setAnimation("img/" + data.unit.name + "Produce.png", 0.1);
			return {
				update: function () {
					this.time -= main.deltaTime;
					if (this.time < 0) {
						if (data.unit.fraction.name == main.fraction) main.message("mage created");
						new main.UnitObject("mage", {x: data.unit.x, y: data.unit.y, fraction: data.unit.fraction.name});
						data.control.shift();
					}
				},
				time: main.level.units["mage"].timeBuild,
				close: function () {
					data.unit.fraction.money += main.level.units["mage"].money;
					data.unit.fraction.emit("money");
				}
			}
		},
		"createWorker": function (data) {
			if (data.unit.fraction.money < main.level.units["worker"].money) return;
			data.unit.fraction.money -= main.level.units["worker"].money;
			data.unit.fraction.emit("money");
			data.unit.setAnimation("img/" + data.unit.name + "Produce.png", 0.1);
			return {
				update: function () {
					this.time -= main.deltaTime;
					if (this.time < 0) {
						if (data.unit.fraction.name == main.fraction) main.message("worker created");
						new main.UnitObject("worker", {x: data.unit.x, y: data.unit.y, fraction: data.unit.fraction.name});
						data.control.shift();
					}
				},
				time: main.level.units["worker"].timeBuild,
				close: function () {
					data.unit.fraction.money += main.level.units["worker"].money;
					data.unit.fraction.emit("money");
				}
			}
		},
		"wait": function (data) {
			data.unit.setAnimation();
			return {
				update: function () { if (data.control.commands.length > 1) data.control.shift(); },
				close: function () {},
			}
		},
		"moveTo": function (data) {
			var path = findPath(main.level.floors[0].map[data.unit.tileY][data.unit.tileX], main.level.floors[0].map[data.target.tileY][data.target.tileX], data.unit.size);
			return {
				update: function (s) {
					if (path.length) {
						var speed = (s || data.unit.speed*main.deltaTime);
						var last = path.pop();
						if((data.unit.tileX == last.x && data.unit.tileY == last.y) || verifyTile(last.x, last.y, data.unit.size)) {
							var dy = last.y - data.unit.y;
							var dx = last.x - data.unit.x;
							data.unit.angle = getDirection(dx, dy);
							if (!data.unit.animation)
								data.unit.setAnimation("img/" + data.unit.name + "Move" + data.unit.angle + ".png", 0.1);
							else if (data.unit.animation.img + "" != "img/" + data.unit.name + "Move" + data.unit.angle + ".png")
								data.unit.setAnimation("img/" + data.unit.name + "Move" + data.unit.angle + ".png", 0.1);
							if (Math.abs(dx) + Math.abs(dy) < speed) {
								data.unit.physicalMoveTo(last);
								this.update(speed - (Math.abs(dx) + Math.abs(dy)));
							} else if (Math.abs(dx) + Math.abs(dy) == speed) data.unit.physicalMoveTo(last);
							else {
								if (dx + dy < 0) speed = -speed;
								if (dx) data.unit.x += speed;
								if (dy) data.unit.y += speed;
								main.level.floors[0].draw = 1;
								path.push(last);
							}
						} else if (path.length) path = findPath(main.level.floors[0].map[data.unit.tileY][data.unit.tileX], path[0], data.unit.size);
						else data.control.shift();
					} else data.control.shift();
				},
				close: function () {}
			};
		},
		"delete": function (data) { data.unit.deconstract(); }
	},
	floors: {
		"-1": {
			symbols: [
				"   111                111   ",
				"   111                111   ",
				"  1111                1111  ",
				"1111111              1111111",
				"111111111          111111111",
				"1111111111111111111111111111",
				"1111111111111111111111111111",
				"1111111111111111111111111111",
				"111111111          111111111",
				"1111111              1111111",
				"  1111                1111  ",
				"   111                111   ",
				"   111                111   "
			]
		},
		"0": {
			symbols: [
				"   333                333   ",
				"   333                333   ",
				"  3333                3333  ",
				"3333333              3333333",
				"333333333          333333333",
				"3333333333333333333333333333",
				"3333333333333333333333333333",
				"3333333333333333333333333333",
				"333333333          333333333",
				"3333333              3333333",
				" 33333                33333 ",
				" 33333                33333 ",
				"   333                333   ",
			]
		}
	}
};
main.on("mapParsed", function () {
	main.players.add("#0000ff");
	main.players.get("#0000ff").money = 1000;
	main.players.add("#ff0000");
	main.players.get("#ff0000").money = 1000;

	new main.UnitObject("mine", {x: 2, y: 2});
	new main.UnitObject("mine", {x: 0, y: 3});
	new main.UnitObject("mine", {x: 3, y: 0});
	new main.UnitObject("mine", {x: 3, y: 11});
	new main.UnitObject("mine", {x: 0, y: 8});
	new main.UnitObject("mine", {x: 2, y: 9});

	new main.UnitObject("mine", {x: 23, y: 0});
	new main.UnitObject("mine", {x: 24, y: 2});
	new main.UnitObject("mine", {x: 26, y: 3});
	new main.UnitObject("mine", {x: 26, y: 8});
	new main.UnitObject("mine", {x: 24, y: 9});
	new main.UnitObject("mine", {x: 23, y: 11});

	new main.UnitObject("house", {x: 5, y: 5, fraction: "#ff0000"});

	new main.UnitObject("worker", {x: 5, y: 4, fraction: "#ff0000"});
	new main.UnitObject("worker", {x: 4, y: 5, fraction: "#ff0000"});
	new main.UnitObject("worker", {x: 4, y: 6, fraction: "#ff0000"});
	new main.UnitObject("worker", {x: 4, y: 7, fraction: "#ff0000"});
	new main.UnitObject("worker", {x: 5, y: 8, fraction: "#ff0000"});
	
	new main.UnitObject("house", {x: 20, y: 5, fraction: "#0000ff"});

	new main.UnitObject("worker", {x: 22, y: 4, fraction: "#0000ff"});
	new main.UnitObject("worker", {x: 23, y: 5, fraction: "#0000ff"});
	new main.UnitObject("worker", {x: 23, y: 6, fraction: "#0000ff"});
	new main.UnitObject("worker", {x: 23, y: 7, fraction: "#0000ff"});
	new main.UnitObject("worker", {x: 22, y: 8, fraction: "#0000ff"});

	var a = main.players.get(main.fraction).units[0];
	main.camera.set({
		x: a.x + a.size/2,
		y: a.y + a.size/2
	});
})