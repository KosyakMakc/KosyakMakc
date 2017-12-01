main.particles = {
	list: [],
	push: function (obj) {
		obj.i = main.particles.list.length;
		obj.remove = function () {
			main.particles.list.splice(this.i, 1);
			for (var i = 0; i < main.particles.list.length; i++) main.particles.list[i].i = i;
		}
		main.particles.list.push(obj);
	}
}