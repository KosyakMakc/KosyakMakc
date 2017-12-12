main.particles = {
	list: [],
	push: function (obj) {
		obj.__proto__ = new Events();
		obj.__proto__.__proto__ = main.baseObject;
		obj.i = main.particles.list.length;
		obj.remove = function () {
			obj.emit("remove");
			main.particles.list.splice(this.i, 1);
			for (var i = 0; i < main.particles.list.length; i++) main.particles.list[i].i = i;
		}
		main.particles.list.push(obj);
	}
}
main.on("frame", function () {
	for (var i = 0; i < main.particles.list.length; i++) {
		if (main.particles.list[i].animation) main.particles.list[i].animation.change();
		main.particles.list[i].update();
	}

	main.particles.list.sort(function (a, b) {
		if (a.layer > b.layer) return 1
		else if (a.layer < b.layer) return -1;
		else return 0;
	});
});