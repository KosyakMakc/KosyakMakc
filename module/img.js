main.images = {};
main.on("connect", function (a) {
	for (var key in main.level.units)
		if (main.images[main.level.units[key].img])
			main.images[main.level.units[key].img + a.name] = rep(main.images[main.level.units[key].img], a.name);
	for (var i = 0; i < main.level.require.image.length; i++) {
		var img = main.level.require.image[i];
		if (main.images[img]) {
			if (main.images[img].width/main.images[img].height > 1) {
				for (var i = 0; i < main.images[img].width/main.images[img].height; i++)
					main.images[img + i + a.name] = rep(main.images[img + i], a.name);
			} else
				main.images[img + a.name] = rep(main.images[img], a.name);
		}
	}
});
main.img = function (url, bool) {
	if(!url) return;
	var img = document.createElement("img");
	img.src = url;
	img.name = url;
	img.onerror = function (e) {
		console.log("loader images: Error!");
		console.log(this.src);
	}
	img.onload = function () {
		for (var i in main.level.floors) main.level.floors[i].draw = 1;

		var players = main.players.getAll();

		if (this.width/this.height > 1) {
			for (var i = 0; i < this.width/this.height; i++) {
				var b = document.createElement("canvas");
				b.width = this.height;
				b.height = this.height;
				var d = b.getContext("2d");
				d.drawImage(this, this.height*i, 0, this.height, this.height, 0, 0, this.height, this.height);
				main.images[this.name + i] = b;
				for (var j = 0; j < players.length; j++)
					main.images[this.name + i + players[j].name] = rep(b, players[j].name);
			}
		} else {
			var a = document.createElement("canvas");
			a.width = this.width;
			a.height = this.height;
			var c = a.getContext("2d");
			c.drawImage(this, 0, 0);
			main.images[this.name] = a;
			for (var i = 0; i < players.length; i++)
				main.images[this.name + players[i].name] = rep(a, players[i].name);
		}
	}
}


function rep (canvas, name) {
	var arr = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < arr.data.length; i += 4) {
		if (arr.data[i] != 0 && arr.data[i+1] == 0 && arr.data[i+2] == 0 && arr.data[i+3] != 0) {
			arr.data[i+1] = Math.floor(parseInt(name[3] + "" + name[4], 16)*(arr.data[i]/255));
			arr.data[i+2] = Math.floor(parseInt(name[5] + "" + name[6], 16)*(arr.data[i]/255));
			arr.data[i] = Math.floor(parseInt(name[1] + "" + name[2], 16)*(arr.data[i]/255));
		}
	}
	var c1 = document.createElement("canvas");
	c1.width = canvas.width;
	c1.height = canvas.height;
	var c2 = c1.getContext("2d");
	c2.putImageData(arr, 0, 0);
	return c1;
}