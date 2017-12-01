main.on("start", function () {
	DOM = {};
	DOM.res = document.createElement("div");
	DOM.res.className = "resources";
	DOM.res.innerHTML = "money: " + main.players.get(main.fraction).money;
	document.body.appendChild(DOM.res);

	main.players.get(main.fraction).on("money", function () { DOM.res.innerHTML = "money: " + main.players.get(main.fraction).money; });
	
	DOM.debug = document.createElement("div");
	DOM.debug.className = "debug";
	document.body.appendChild(DOM.debug);

	main.on("frame", function () { DOM.debug.innerHTML = "x: " + main.mouse.x + "<br />y: " + main.mouse.y + "<br />tileX: " + (-Math.ceil((innerWidth/2 - main.mouse.x)/main.camera.zoom - main.camera.x)) + "<br />tileY: " + (-Math.ceil((innerHeight/2 - main.mouse.y)/main.camera.zoom - main.camera.y)); });
	
	DOM.info = document.createElement("div");
	DOM.info.className = "info";

	DOM.name = document.createElement("div");
	DOM.name.id = "unit-name";
	DOM.info.appendChild(DOM.name);

	DOM.hp = document.createElement("div");
	DOM.hp.id = "unit-hp";
	DOM.info.appendChild(DOM.hp);

	DOM.damage = document.createElement("div");
	DOM.damage.id = "unit-damage";
	DOM.info.appendChild(DOM.damage);

	DOM.dist = document.createElement("div");
	DOM.dist.id = "unit-attack-distance";
	DOM.info.appendChild(DOM.dist);

	document.body.appendChild(DOM.info);

	function onattack (unit) { DOM.hp.innerHTML = "hp: " + main.focus.health; }
	function onremove () { main.emit("focus", [, main.focus]); main.focus = undefined; }

	main.on("focus", function (arr) {
		var unit = arr[0];
		if (unit) {
			DOM.info.style.display = "block";
			DOM.name.innerHTML = unit.name;
			DOM.hp.innerHTML = "hp: " + unit.health;
			DOM.damage.innerHTML = unit.attack ? "attack: " + unit.attack : "";
			DOM.dist.innerHTML = unit.distanceAttack ? "distance attack: " + unit.distanceAttack : "";
			if (arr[1]) arr[1].remove("attack", onattack);
			if (arr[1]) arr[1].remove("remove", onremove);
			unit.on("attack", onattack);
			unit.on("remove", onremove);
			if (DOM.commands) DOM.commands.remove();
			if(unit.fraction.name === main.fraction){
				DOM.commands = document.createElement("div");
				DOM.commands.className = "commands";
				for (var i = 0; i < unit.commands.length; i++) {
					var b = document.createElement("img");
					b.alt = unit.commands[i].name;
					b.src = unit.commands[i].ico;
					b.className = "command";
					var c = new Hammer(b);
					b.command = unit.commands[i].name;
					c.get('pan').set({ direction: Hammer.DIRECTION_ALL });
					c.on("pan", function (a) {
						main.mouse.x = a.center.x;
						main.mouse.y = a.center.y;
					});
					if (unit.commands[i].targetable) {
						c.on("panstart", function (a) {
							main.mouse.cursor = "img/aim.png";
							main.mouse.type = "aim";
						});
						c.on("panend", function (a) {
							main.mouse.cursor = "img/cursor.png";
							main.mouse.type = "arrow";
							var tx = -Math.ceil((innerWidth/2 - a.center.x)/main.camera.zoom - main.camera.x);
							var ty = -Math.ceil((innerHeight/2 - a.center.y)/main.camera.zoom - main.camera.y);
							if (isTile(tx, ty)) main.focus.control.set(a.target.command, {
								target: {
									x: a.center.x,
									y: a.center.y,
									tileX: tx,
									tileY: ty
								}
							});
						});
						c.on("tap", tapper);
					} else c.on("tap", function (a) { main.focus.control.set(a.target.command); });	
					DOM.commands.appendChild(b);
				}
				document.body.appendChild(DOM.commands);
			}
		} else {
			DOM.info.style.display = "none";
			if (DOM.commands) DOM.commands.style.display = "none";
		}
	});
	function tapper (a) {
		main.mouse.cursor = "img/aim.png";
		main.mouse.type = "aim";
		main.mouse.off("tap", main.mouse.tap);
		main.cnv.command = a.target.command;
		main.mouse.on("tap", function (a) {
			var tx = -Math.ceil((innerWidth/2 - a.center.x)/main.camera.zoom - main.camera.x);
			var ty = -Math.ceil((innerHeight/2 - a.center.y)/main.camera.zoom - main.camera.y);
			if (isTile(tx, ty)) main.focus.control.set(main.cnv.command, {
				target: {
					x: a.center.x,
					y: a.center.y,
					tileX: tx,
					tileY: ty
				}
			});
			main.mouse.off("tap", tapper);
			main.mouse.cursor = "img/cursor.png";
			main.mouse.type = "arrow";
			main.mouse.on("tap", main.mouse.tap);
		});
	}
})