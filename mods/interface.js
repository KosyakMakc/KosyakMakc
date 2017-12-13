main.on("start", function () {
	DOM = {};
	DOM.res = document.createElement("div");
	DOM.res.className = "resources";
	DOM.res.innerHTML = "money: " + main.players.get(main.fraction).money;
	document.body.appendChild(DOM.res);

	main.players.get(main.fraction).on("money", function () { DOM.res.innerHTML = "money: " + main.players.get(main.fraction).money; });
	
	DOM.menu = document.createElement("a");
	DOM.menu.className = "button";
	DOM.menu.href = "index.html";
	DOM.menu.innerHTML = "return to menu";
	document.body.appendChild(DOM.menu);

	// DOM.debug = document.createElement("div");
	// DOM.debug.className = "debug";
	// document.body.appendChild(DOM.debug);

	// main.on("frame", function () { DOM.debug.innerHTML = "x: " + main.mouse.x + "<br />y: " + main.mouse.y + "<br />tileX: " + (-Math.ceil((innerWidth/2 - main.mouse.x)/main.camera.zoom - main.camera.x)) + "<br />tileY: " + (-Math.ceil((innerHeight/2 - main.mouse.y)/main.camera.zoom - main.camera.y)); });
	
	DOM.msgs = document.createElement("div");
	DOM.msgs.className = "msgs";
	document.body.appendChild(DOM.msgs);

	main.message = function (msg) {
		var a = document.createElement("p");
		DOM.msgs.innerHTML = "<p>" + msg + "</p>" + DOM.msgs.innerHTML;
		setTimeout(function () {
			DOM.msgs.lastChild.remove();
		}, 1500)
	}

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

	function onattack () { DOM.hp.innerHTML = "hp: " + main.focus.health; }
	function onremove () { main.emit("focus"); main.focus = null; }

	main.on("focus", function (unit) {
		if (main.focus) {
			main.focus.remove("attack", onattack);
			main.focus.remove("remove", onremove);
		}
		if (unit) {
			DOM.info.style.display = "block";
			DOM.name.innerHTML = unit.name;
			DOM.hp.innerHTML = "hp: " + unit.health;
			DOM.damage.innerHTML = unit.attack ? "attack: " + unit.attack : "";
			DOM.dist.innerHTML = unit.distanceAttack ? "distance attack: " + unit.distanceAttack : "";
			unit.on("attack", onattack);
			unit.on("remove", onremove);
			if (DOM.commands) DOM.commands.remove();
			if (unit.fraction.name !== main.fraction) return;
			DOM.commands = document.createElement("div");
			DOM.commands.className = "commands";
			for (var i = 0; i < unit.commands.length; i++) {
				var b = document.createElement("img");
				b.alt = unit.commands[i].name;
				b.src = unit.commands[i].ico;
				b.className = "command";
				var c = new Action(b);
				b.command = unit.commands[i].name;
				c.on("pan", function (a) {
					main.mouse.x = a.x;
					main.mouse.y = a.y;
				});
				if (unit.commands[i].targetable) {
					c.on("panstart", function (a) {
						main.mouse.cursor = "img/aim.png";
						main.mouse.type = "aim";
					});
					c.on("panend", function (a) {
						main.mouse.cursor = "img/cursor.png";
						main.mouse.type = "arrow";
						var tx = -Math.ceil((innerWidth/2 - a.x)/main.camera.zoom - main.camera.x);
						var ty = -Math.ceil((innerHeight/2 - a.y)/main.camera.zoom - main.camera.y);
						if (isTile(tx, ty)) main.focus.control.set(a.target.command, {
							target: {
								x: a.x,
								y: a.y,
								tileX: tx,
								tileY: ty
							}
						});
					});
					c.on("tap", tapper);
				} else c.on("tap", function (a) {
					main.focus.control.set(a.target.command);
				});	
				DOM.commands.appendChild(b);
			}
			document.body.appendChild(DOM.commands);
		} else {
			DOM.info.style.display = "none";
			if (DOM.commands) DOM.commands.style.display = "none";
		}
	});
	function tapper (a) {
		main.focus.on("remove", function () {
			main.mouse.remove("tap", emit);
			main.mouse.on("tap", main.mouse.tap);
			main.mouse.cursor = "img/cursor.png";
			main.mouse.type = "arrow";
		})
		function emit(a) {
			var tx = -Math.ceil((innerWidth/2 - a.x)/main.camera.zoom - main.camera.x);
			var ty = -Math.ceil((innerHeight/2 - a.y)/main.camera.zoom - main.camera.y);
			if (isTile(tx, ty)) main.focus.control.set(main.cnv.command, {
				target: {
					x: a.x,
					y: a.y,
					tileX: tx,
					tileY: ty
				}
			});
			main.mouse.remove("tap", emit);
			main.mouse.on("tap", main.mouse.tap);
			main.mouse.cursor = "img/cursor.png";
			main.mouse.type = "arrow";
		}
		main.cnv.command = a.target.command;
		main.mouse.cursor = "img/aim.png";
		main.mouse.type = "aim";
		main.mouse.remove("tap", main.mouse.tap);
		main.mouse.on("tap", emit);
	}
})