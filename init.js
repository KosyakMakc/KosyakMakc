'use strict';
window.frame = (requestAnimationFrame || webkitRequestAnimationFrame || oRequestAnimationFrame || mozRequestAnimationFrame || function (cb) { setTimeout(cb, 50/3)});
window.main = new Events();
main.live = 1;
main.cnv = document.getElementById("main");
main.cnv.style.cursor = "none";
main.fraction = "#0000ff";
main.deltaTime = 1;
main.lastFrame = +new Date();
main.GET = {};
var a = location.search.split("?")[1].split("&");
for (var i = 0; i < a.length; i++) {
	a[i] = a[i].split("=");
	main.GET[a[i][0]] = a[i][1];
}
window.onresize = function () {
	main.cnv.width = innerWidth;
	main.cnv.height = innerHeight;
	main.ctx = main.cnv.getContext("2d");
	main.ctx.translate(innerWidth/2, innerHeight/2);
}
window.onresize();
function start() {
	var s = document.createElement("script");
	s.src = main.GET.level;
	s.onload = function () {
		for (var i = 0; i < main.level.require.styles.length; i++) {
			var a = document.createElement("link");
			a.rel = "stylesheet";
			a.href = main.level.require.styles[i];
			document.head.appendChild(a);
		}
		main.loaded = 0;
		if (main.level.require.libraly.length) {
			for (var i = 0; i < main.level.require.libraly.length; i++) {
				var s = document.createElement("script");
				s.src = main.level.require.libraly[i];
				s.onload = function () {
					main.loaded++;
					if (main.loaded == main.level.require.libraly.length) {
						delete main.loaded;
						starter();
					}
				}
			document.body.appendChild(s);
			}
		} else starter();
	}
	document.body.appendChild(s);
}