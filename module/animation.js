main.setAnimation = function (anim, unit, fps) {
	if (unit.animation) {
		clearInterval(unit.idAnimation);
		delete unit.idAnimation;
	}
	main.level.floors[0].draw = 1;
	unit.animationFrame = 0;
	unit.animation = anim;
	unit.idAnimation = setInterval(function (unit) {
		main.level.floors[0].draw = 1;
		unit.animationFrame++;
		if (!main.images[unit.animation + unit.animationFrame + (unit.fraction ? unit.fraction.name : "")])
			unit.animationFrame = 0;

	}, fps, unit);
};