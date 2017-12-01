main.mouse = new Hammer(main.cnv);
main.mouse.x = innerWidth/2;
main.mouse.y = innerHeight/2;
main.mouse.get('pinch').set({ enable: true });
main.mouse.get('pan').set({ direction: Hammer.DIRECTION_ALL });
main.mouse.get('pinch').set({ direction: Hammer.DIRECTION_ALL });
main.mouse.cursor = "img/cursor.png";
main.mouse.type = "arrow";
main.mouse.tap = function (a) {
	main.mouse.x = a.center.x;
	main.mouse.y = a.center.y;

	var x = Math.floor((a.center.x - innerWidth/2)/main.camera.zoom + main.camera.x);
	var y = Math.floor((a.center.y - innerHeight/2)/main.camera.zoom + main.camera.y);

	if (isUnitInTile(x, y)) {
		var a = main.focus;
		main.focus = main.level.floors[0].map[y][x].object[0];
		main.emit("focus", [main.focus, a]);
		return;
	} else if (main.focus) {
		main.focus = undefined;
		main.emit("focus", [, main.focus]);
	}
}

main.mouse.on("tap", main.mouse.tap);
main.mouse.on("panstart", function (event) {
	main.mouse.x = event.center.x;
	main.mouse.y = event.center.y;
});
main.mouse.on("pan", function (event) {
	main.camera.move({
		x: (main.mouse.x - event.center.x)/main.camera.zoom,
		y: (main.mouse.y - event.center.y)/main.camera.zoom
	});
	main.mouse.x = event.center.x;
	main.mouse.y = event.center.y;
});
main.mouse.on("pinchstart", function (event) {
	main.mouse.zoom = main.camera.zoom;
});
main.mouse.on("pinch", function (event) {
	main.camera.set({ zoom: event.scale*main.mouse.zoom });
});
main.mouse.on("pinchend", function (event) {
	main.mouse.zoom = main.camera.zoom;
});
main.cnv.addEventListener("mousewheel", function (a) {
	main.mouse.emit("pinchstart", {});
	main.mouse.emit("pinch", {
		scale: a.deltaY > 0 ? 0.9 : 1.1
	});
	main.mouse.emit("pinchend", {});
});
main.cnv.addEventListener("mousemove", function (a) {
	if(!a.buttons) {
		main.mouse.x = a.offsetX;
		main.mouse.y = a.offsetY;
	}
});