main.on("mapParsed", function () {
	for (var i in main.level.floors) {
		var floor = main.level.floors[i];
		for (var y = 0; y < floor.symbols.length; y++) {
			for (var x = 0; x < floor.symbols[y].length; x++) {
				if (floor.map[y][x].hide) continue;
				var a = floor.symbols[y][x];
				var up = isTile(x, y-1, i) ? (floor.symbols[y-1][x] == a ? 1 : 0) : 0;
				var left = isTile(x+1, y, i) ? (floor.symbols[y][x+1] == a ? 1 : 0) : 0;
				var down = isTile(x, y+1, i) ? (floor.symbols[y+1][x] == a ? 1 : 0) : 0;
				var right = isTile(x-1, y, i) ? (floor.symbols[y][x-1] == a ? 1 : 0) : 0;
				floor.map[y][x].img = floor.map[y][x].img + (up*1 + left*2 + down*4 + right*8);
			}
		}
	}
});