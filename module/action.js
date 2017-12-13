function Action(DOM) {
	this.__proto__ = new Events();
	var self = this;
	this.pointers = [];

	// mouse
	DOM.addEventListener("mousedown", function (e) {
		e.preventDefault();
		self.pointers.push({
			target: DOM,
			type: "mouse",
			startX: e.offsetX,
			startY: e.offsetY,
			deltaX: 0,
			deltaY: 0,
			x: e.offsetX,
			y: e.offsetY,
			isPan: false
		});
		document.addEventListener("mousemove", moveMouse);
	});
	function moveMouse(e) {
		e.preventDefault();
		for (var i = 0; i < self.pointers.length; i++)
			if (self.pointers[i].type == "mouse") {
				self.pointers[i].deltaX = self.pointers[i].x - e.offsetX;
				self.pointers[i].deltaY = self.pointers[i].y - e.offsetY;
				self.pointers[i].prevX = self.pointers[i].x;
				self.pointers[i].prevY = self.pointers[i].y;
				self.pointers[i].x = e.offsetX;
				self.pointers[i].y = e.offsetY;
				if (!self.pointers[i].isPan) self.emit("panstart", self.pointers[i]);
				self.pointers[i].isPan = true;
				self.emit("pan", self.pointers[i]);
				break;
			}
	}
	document.addEventListener("mouseup", function (e) {
		e.preventDefault();
		for (var i = 0; i < self.pointers.length; i++)
			if (self.pointers[i].type == "mouse") {
				self.pointers[i].deltaX = self.pointers[i].x - e.offsetX;
				self.pointers[i].deltaY = self.pointers[i].y - e.offsetY;
				self.pointers[i].prevX = self.pointers[i].x;
				self.pointers[i].prevY = self.pointers[i].y;
				self.pointers[i].x = e.offsetX;
				self.pointers[i].y = e.offsetY;
				if (!self.pointers[i].isPan) self.emit("tap", self.pointers[i]);
				else self.emit("panend", self.pointers[i]);
				self.pointers[i].isPan = false;
				self.pointers.splice(i, 1);
				document.removeEventListener("mousemove", moveMouse);
				break;
			}
	});
	document.addEventListener("mousewheel", function (e) {
		e.preventDefault();
		self.emit("zoomstart");
		self.emit("zoom", (e.deltaY > 0 ? 0.9 : 1.1 ));
	});
	
	// touches
	DOM.addEventListener("touchstart", function (e) {
		e.preventDefault();
		for (var j = 0; j < e.changedTouches.length; j++)
			self.pointers.push({
				target: DOM,
				type: "touch-" + e.changedTouches[j].identifier,
				startX: e.changedTouches[j].pageX,
				startY: e.changedTouches[j].pageY,
				x: e.changedTouches[j].pageX,
				y: e.changedTouches[j].pageY,
				deltaX: 0,
				deltaY: 0,
				isPan: false
			});
		if (self.pointers.length == 2) self.dist = Math.sqrt((self.pointers[1].x - self.pointers[0].x)*(self.pointers[1].x - self.pointers[0].x) + (self.pointers[1].y - self.pointers[0].y)*(self.pointers[1].y - self.pointers[0].y));
	});
	DOM.addEventListener("touchmove", function (e) {
		e.preventDefault();
		for (var j = 0; j < e.changedTouches.length; j++)
			for (var i = 0; i < self.pointers.length; i++)
				if (self.pointers[i].type == "touch-" + e.changedTouches[j].identifier) {
					self.pointers[i].deltaX = self.pointers[i].x - e.changedTouches[j].pageX;
					self.pointers[i].deltaY = self.pointers[i].y - e.changedTouches[j].pageY;
					self.pointers[i].prevX = self.pointers[i].x;
					self.pointers[i].prevY = self.pointers[i].y;
					self.pointers[i].x = e.changedTouches[j].pageX;
					self.pointers[i].y = e.changedTouches[j].pageY;
					break;
				}
		if (self.pointers.length == 1) {
			if (self.pointers[i].isPan) self.emit("pan", self.pointers[i]);
			else if (Math.abs(self.pointers[i].x - self.pointers[i].startX) > 5 || Math.abs(self.pointers[i].y - self.pointers[i].startY) > 5) {
				self.pointers[i].isPan = true;
				self.emit("panstart", self.pointers[i]);
				self.emit("pan", self.pointers[i]);
			}
		} else if (self.pointers.length == 2) {
			var dist = Math.sqrt((self.pointers[1].x - self.pointers[0].x)*(self.pointers[1].x - self.pointers[0].x) + (self.pointers[1].y - self.pointers[0].y)*(self.pointers[1].y - self.pointers[0].y));
			if (!self.isPinch) {
				self.isPinch = true;
				self.pointers[0].isPan = true;
				self.pointers[1].isPan = true;
				self.emit("zoomstart");
			} 
			var zoom = dist/self.dist;
			self.emit("zoom", zoom);
		}
	});
	DOM.addEventListener("touchend", function (e) {
		e.preventDefault();
		for (var j = 0; j < e.changedTouches.length; j++)
			for (var i = 0; i < self.pointers.length; i++)
				if (self.pointers[i].type == "touch-" + e.changedTouches[j].identifier) {
					self.pointers[i].x = e.changedTouches[j].pageX;
					self.pointers[i].y = e.changedTouches[j].pageY;
					if (!self.pointers[i].isPan && !self.isPinch) self.emit("tap", self.pointers[i]);
					else if (self.pointers[i].isPan) self.emit("panend", self.pointers[i]);
					self.pointers.splice(i, 1);
					break;
				}
		if (self.pointers.length != 2) self.isPinch = false;
	});
	DOM.addEventListener("touchcancel", function (e) {
		e.preventDefault();
		for (var j = 0; j < e.changedTouches.length; j++)
			for (var i = 0; i < self.pointers.length; i++)
				if (self.pointers[i].type == "touch-" + e.changedTouches[j].identifier) {
					self.pointers[i].x = e.changedTouches[j].pageX;
					self.pointers[i].y = e.changedTouches[j].pageY;
					if (!self.pointers[i].isPan) self.emit("tapcancel", self.pointers[i]);
					else self.emit("pancancel", self.pointers[i]);
					self.pointers.splice(i, 1);
					break;
				}
		if (self.pointers.length != 2) self.isPinch = false;
	});
}