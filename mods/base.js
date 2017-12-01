function isTile(x, y, floor) {
	floor = (floor || 0);
	if (main.level.floors[floor]) if (main.level.floors[floor].map[y]) if (main.level.floors[floor].map[y][x]) { return true; }
}
function isUnitInTile(x, y, floor) {
	floor = (floor || 0);
	if(isTile(x, y, floor)) if (main.level.floors[floor].map[y][x].object[0]) return true;
}
function graphicsDraw(obj, ctx) {
	if(obj.hide) return;
	var z = obj.size ? obj.size*main.camera.zoom : main.camera.zoom;
	var x = (obj.x - main.camera.x)*main.camera.zoom;
	var y = (obj.y - main.camera.y)*main.camera.zoom;
	if (main.images[obj.animation + obj.animationFrame] || main.images[obj.img]) {
		var img  = main.images[obj.animation + obj.animationFrame + (obj.fraction ? obj.fraction.name : "")]
				|| main.images[obj.animation + obj.animationFrame]
				|| main.images[obj.img + (obj.fraction ? obj.fraction.name : "")]
				|| main.images[obj.img];
		ctx.drawImage(img, x, y, z, z);
	}
	else {
		ctx.fillStyle = obj.fraction ? obj.fraction.name : obj.fill;
		ctx.fillRect(x, y, z, z);
	}
}
function verifyTile (x1, y1, size) {
	for (var y2 = 0; y2 < size; y2++) {
		var y = y2 + y1;
		for (var x2 = 0; x2 < size; x2++) {
			var x = x2 + x1;
			if (isTile(x, y)) {
				if (!main.level.floors[0].map[y][x].passible) return;
				for (var i = 0; i < main.level.floors[0].map[y][x].object.length; i++)
					if (!main.level.floors[0].map[y][x].object[i].passible) return;
			} else return;
		}
	}
	return true;
}
function findFreeTile(start, size) {
	if (verifyTile(start.x, start.y, size)) return start;
	var map = main.level.floors[0].map;
	var stak = [start];
	start.verify = 1;
	function verify (x, y) {
		if (isTile(x, y)) {
			if (verifyTile(x, y, size)) {
				stak.push(map[y][x]);
				return true;
			}
			if (!map[y][x].verify) {
				stak.push(map[y][x]);
			}
		}
	}
	while (stak.length) {
		var tile = stak.shift();
		if (verify(tile.x, tile.y + 1)) break;
		if (verify(tile.x + 1, tile.y)) break;
		if (verify(tile.x, tile.y - 1)) break;
		if (verify(tile.x - 1, tile.y)) break;
	}
	for (var y = 0; y < map.length; y++)
		for (var x = 0; x < map[y].length; x++)
			delete map[y][x].verify;
	return stak.pop();
}
function findPath (start, end, size) {
	if (start.x == end.x && start.y == end.y) return [end];
	var map = main.level.floors[0].map;
	var stak = [start];
	var endRec = start;
	start.verify = 1;
	function isPassible(x, y) {
		if (isTile(x, y)) {
			if (map[y][x].verify) return;
			if (verifyTile(x, y, size)) {
				map[y][x].verify = tile.verify + 1;
				if (x == end.x && y == end.y) return true;
				stak.push(map[y][x]);
				if (Math.abs(end.x - x) + Math.abs(end.y - y) < Math.abs(end.x - endRec.x) + Math.abs(end.y - endRec.y)) endRec = map[y][x];
			}
		}
	}
	while (stak.length) {
		var tile = stak.shift();
		if (isPassible(tile.x, tile.y - 1)) break;
		if (isPassible(tile.x + 1, tile.y)) break;
		if (isPassible(tile.x, tile.y + 1)) break;
		if (isPassible(tile.x - 1, tile.y)) break;
	}
	var path = [map[end.y][end.x].verify ? map[end.y][end.x] : endRec];
	var res = end.verify || endRec.verify;
	function check(x, y) {
		if (isTile(x, y)) if (tile.verify > map[y][x].verify) {
			path.push(map[y][x]);
			return true;
		}
	}
	while(res > 1) {
		res--;
		var tile = path[path.length-1];
		if (check(tile.x, tile.y - 1)) continue;
		if (check(tile.x, tile.y + 1)) continue;
		if (check(tile.x + 1, tile.y)) continue;
		if (check(tile.x - 1, tile.y)) continue;
	}
	for (var y = 0; y < map.length; y++)
		for (var x = 0; x < map[y].length; x++)
			delete map[y][x].verify;
	return path;
}
function findDistanceTile(start, end, size, dist) {
	if (start.x == end.x && start.y == end.y) return start;
	var map = main.level.floors[0].map;
	var stak = [start];
	start.verify = 1;
	function isPassible(x, y) {
		if (isTile(x, y)) {
			if (map[y][x].verify) return;
			if (verifyTile(x, y, size)) {
				map[y][x].verify = tile.verify + 1;
				stak.push(map[y][x]);
				if (Math.sqrt((x - end.x)*(x - end.x) + (y - end.y)*(y - end.y)) <= dist) return true;
			}
		}
	}
	while (stak.length) {
		var tile = stak.shift();
		if (isPassible(tile.x, tile.y - 1)) break;
		if (isPassible(tile.x + 1, tile.y)) break;
		if (isPassible(tile.x, tile.y + 1)) break;
		if (isPassible(tile.x - 1, tile.y)) break;
	}
	for (var y = 0; y < map.length; y++) 
		for (var x = 0; x < map[y].length; x++)
			delete map[y][x].verify;
	return stak.pop();
}
function findTileWithObject (start, size, name) {
	for (let i = 0; i < start.object.length; i++) if (start.object[i].name == name) return start;
	var map = main.level.floors[0].map;
	var stak = [start];
	start.verify = 1;
	function verify (x, y) {
		if (isTile(x, y)) {
			if (map[y][x].verify) return;
			if (verifyTile(x, y, size)) {
				stak.push(map[y][x]);
				map[y][x].verify = true;
				for (let i = 0; i < map[y][x].object.length; i++) if (map[y][x].object[i].name == name) return true;
			}
		}
	}
	while (stak.length) {
		var tile = stak.shift();
		if (verify(tile.x, tile.y + 1)) break;
		if (verify(tile.x + 1, tile.y)) break;
		if (verify(tile.x, tile.y - 1)) break;
		if (verify(tile.x - 1, tile.y)) break;
	}
	for (var y = 0; y < map.length; y++)
		for (var x = 0; x < map[y].length; x++)
			delete map[y][x].verify;
	return stak.pop();
}