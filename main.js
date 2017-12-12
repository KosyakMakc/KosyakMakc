function starter () {
	for (var i = 0; i < main.level.require.image.length; i++) 
		main.img(main.level.require.image[i]);
	for (var key in main.level.tiles)
		main.img(main.level.tiles[key].img);
	for (var key in main.level.units) {
		main.img(main.level.units[key].img);
		main.level.units[key].__proto__ = main.baseObject;
	}
	main.emit("loaded");
	for (var i in main.level.floors) {
		(function () {
			var floor = main.level.floors[i];
			floor.layer = i*1;
			floor.draw = 1;
			floor.__proto__ = new Events();
			floor.on("check", function () {
				if (floor.draw) {
					floor.draw = false;
					floor.emit("redraw");
				}
			});
			floor.on("redraw", function () {
				var cnv = document.createElement("canvas");
				var maxX = 0;

				for (var y = 0; y < floor.map.length; y++)
					for (var x = 0; x < floor.map[y].length; x++)
						if (x > maxX) maxX = x+1;

				cnv.height = main.camera.maxZoom*floor.map.length;
				cnv.width = main.camera.maxZoom*maxX;
				var ctx = cnv.getContext("2d");

				var stak = {};
				var stakLayer = [];

				for (var y = 0; y < floor.map.length; y++) for (var x = 0; x < floor.map[y].length; x++) if(floor.map[y]) if(floor.map[y][x]) {
					stakLayer.push(floor.map[y][x]);
					for (var j = 0; j < floor.map[y][x].object.length; j++)
						stak[floor.map[y][x].object[j].fraction.name + ":" + floor.map[y][x].object[j].unitId] = floor.map[y][x].object[j];
				}
				for (var key in stak) stakLayer.push(stak[key]);
				
				stakLayer.sort(function (a, b) {
					if (a.layer > b.layer) return 1
					else if (a.layer < b.layer) return -1;
					else return 0;
				});
			
				for (var i = 0; i < stakLayer.length; i++) {
					if(stakLayer[i].hide) continue;
					var z = stakLayer[i].size ? stakLayer[i].size*main.camera.maxZoom : main.camera.maxZoom;
					var x = stakLayer[i].x*main.camera.maxZoom;
					var y = stakLayer[i].y*main.camera.maxZoom;
					if (main.images[stakLayer[i].animation + ""] || main.images[stakLayer[i].img]) {
						var img = main.images[stakLayer[i].animation + (stakLayer[i].fraction ? stakLayer[i].fraction.name : "")]
						|| main.images[stakLayer[i].animation + ""]
						|| main.images[stakLayer[i].img + (stakLayer[i].fraction ? stakLayer[i].fraction.name : "")]
						|| main.images[stakLayer[i].img];
						ctx.drawImage(img, x, y, z, z);
					}
					else {
						ctx.fillStyle = stakLayer[i].fraction ? stakLayer[i].fraction.name : stakLayer[i].fill;
						ctx.fillRect(x, y, z, z);
					}
				}
				floor.cnv = cnv;
				floor.ctx = ctx;
			});

			floor.map = [];
			for (var y = 0; y < floor.symbols.length; y++) {
				floor.map.push([]);
				for (var x = 0; x < floor.symbols[y].length; x++) {
					var a = {};
					a.__proto__ = main.level.tiles[floor.symbols[y][x]];
					a.x = x;
					a.y = y;
					a.symbol = floor.symbols[y][x];
					a.object = [];
					floor.map[y].push(a);
				}
			}
		})()
	}

	main.emit("mapParsed");
	
	window.engine = function () {
		main.ctx.clearRect(-innerWidth/2, -innerHeight/2, innerWidth, innerHeight);

		var time = +new Date();
		main.deltaTime = (time - main.lastFrame)/1000;
		main.lastFrame = time;

		main.emit("frame");

		var stakLayer = [];

		var x =  (-innerWidth/2/main.camera.zoom + main.camera.x)*main.camera.maxZoom;
		var y = (-innerHeight/2/main.camera.zoom + main.camera.y)*main.camera.maxZoom;
		var w =  innerWidth/main.camera.zoom*main.camera.maxZoom;
		var h = innerHeight/main.camera.zoom*main.camera.maxZoom;
		
		for (var i in main.level.floors) {
			main.level.floors[i].emit("check");
			stakLayer.push(main.level.floors[i]);
		}

		stakLayer.sort(function (a, b) {
			if (a.layer > b.layer) return 1
			else if (a.layer < b.layer) return -1;
			else return 0;
		});

		for (var i = 0; i < stakLayer.length; i++)
			main.ctx.drawImage(stakLayer[i].cnv, x, y, w, h, -innerWidth/2, -innerHeight/2, innerWidth, innerHeight);

		if (main.focus) { // focus stroke
			main.ctx.lineWidth = main.focusLine;
			main.ctx.strokeStyle = main.focus.fraction.name;
			main.ctx.beginPath();
			var x = (main.focus.x - main.camera.x)*main.camera.zoom;
			var y = (main.focus.y - main.camera.y)*main.camera.zoom;
			var size = main.camera.zoom*main.focus.size;
			var xs = x + size;
			var ys = y + size;
			main.ctx.moveTo(x, y);
			main.ctx.lineTo(xs, y);
			main.ctx.lineTo(xs, ys);
			main.ctx.lineTo(x, ys);
			main.ctx.closePath();
			main.ctx.stroke();
		}

		// отрисовка частиц, in camera?
		for (var i = 0; i < main.particles.list.length; i++) graphicsDraw(main.particles.list[i], main.ctx);

		if (main.images[main.mouse.cursor]) { // cursor
			var img = main.images[main.mouse.cursor];
			var x = main.mouse.x;
			var y = main.mouse.y;
			if (main.mouse.type == "arrow") {
				x -= innerWidth*0.5;
				y -= innerHeight*0.5;
			} else if (main.mouse.type == "aim") {
				x -= (innerWidth + img.width)*0.5;
				y -= (innerHeight + img.height)*0.5;
			}
			var w = img.width;
			var h = img.height;
			main.ctx.drawImage(img, x, y, w, h);
		}
		if(main.live) frame(engine);
	}
	main.emit("start");
	frame(engine);
}