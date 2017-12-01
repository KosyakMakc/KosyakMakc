function getDirection(x, y) {
	if (Math.abs(x) > Math.abs(y)) {
		if (x < 0) return "Left";
		else return "Right";
	} else {
		if (y < 0) return "Up";
		else return "Down";
	}
}