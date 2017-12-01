main.camera = new (function () {
	this.x = 0;
	this.y = 0;
	this.zoom = 50;
	this.maxZoom = 72;
	this.minZoom = 10;
	main.focusLine = 5;
	this.set = function (obj) {
		this.x = obj.x > 0 || obj.x <= 0 ? obj.x : this.x;
		this.y = obj.y > 0 || obj.y <= 0 ? obj.y : this.y;
		this.zoom = (obj.zoom || this.zoom) >= this.minZoom ? (obj.zoom || this.zoom) : this.minZoom;
		this.zoom = this.zoom >= this.maxZoom ? this.maxZoom : this.zoom;
		main.focusLine = this.zoom/10;
	};
	this.move = function (obj) {
		this.x += obj.x || 0;
		this.y += obj.y || 0;
		this.zoom = this.zoom + (obj.zoom || 0) >= this.minZoom ? this.zoom + (obj.zoom || 0) : this.minZoom;
		this.zoom = this.zoom >= this.maxZoom ? this.maxZoom : this.zoom;
		main.focusLine = this.zoom/10;
	};
});