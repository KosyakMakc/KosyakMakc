main.mouse = new Action(main.cnv);
main.mouse.x = innerWidth/2;
main.mouse.y = innerHeight/2;
main.mouse.cursor = "img/cursor.png";
main.mouse.type = "arrow";
main.mouse.tap = function (a) {
	main.mouse.x = a.x;
	main.mouse.y = a.y;
	var x = Math.floor((a.x - innerWidth/2)/main.camera.zoom + main.camera.x);
	var y = Math.floor((a.y - innerHeight/2)/main.camera.zoom + main.camera.y);
	if (isUnitInTile(x, y)) {
		main.emit("focus", main.level.floors[0].map[y][x].object[0]);
		main.focus = main.level.floors[0].map[y][x].object[0];
		return;
	} else if (main.focus) {
		main.emit("focus");
		main.focus = null;
	}
}
main.mouse.pan = function (event) {
	main.camera.move({
		x: event.deltaX/main.camera.zoom,
		y: event.deltaY/main.camera.zoom
	});
	main.mouse.x = event.x;
	main.mouse.y = event.y;
}
main.mouse.on("zoomstart", function () { main.mouse.zoom = main.camera.zoom; })
main.mouse.on("zoom", function (zoom) { main.camera.set({ zoom: zoom*main.mouse.zoom }); });
main.mouse.on("tap", main.mouse.tap);
main.mouse.on("pan", main.mouse.pan);
main.cnv.addEventListener("mousemove", function (a) {
	if(!a.buttons) {
		main.mouse.x = a.offsetX;
		main.mouse.y = a.offsetY;
	}
});