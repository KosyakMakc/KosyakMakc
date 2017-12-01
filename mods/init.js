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
	new main.UnitObject("mine", {x: 1, y: 10});

	new main.UnitObject("mine", {x: 23, y: 0});
	new main.UnitObject("mine", {x: 24, y: 2});
	new main.UnitObject("mine", {x: 26, y: 3});
	new main.UnitObject("mine", {x: 26, y: 8});
	new main.UnitObject("mine", {x: 25, y: 10});
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