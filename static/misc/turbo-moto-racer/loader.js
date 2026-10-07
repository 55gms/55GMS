! function(e) {
	function t(i) {
		if (n[i]) return n[i].exports;
		var o = n[i] = {
			i: i,
			l: !1,
			exports: {}
		};
		return e[i].call(o.exports, o, o.exports, t), o.l = !0, o.exports
	}
	var n = {};
	t.m = e, t.c = n, t.d = function(e, n, i) {
		t.o(e, n) || Object.defineProperty(e, n, {
			configurable: !1,
			enumerable: !0,
			get: i
		})
	}, t.n = function(e) {
		var n = e && e.__esModule ? function() {
			return e.default
		} : function() {
			return e
		};
		return t.d(n, "a", n), n
	}, t.o = function(e, t) {
		return Object.prototype.hasOwnProperty.call(e, t)
	}, t.p = "", t(t.s = 1)
}([function(e, t, n) {
	"use strict";

	function i() {
		d.style.display = "block", s.style.display = "none", a(), PokiSDK.gameLoadingFinished(), window.removeSlideshowEventListeners()
	}

	function o() {
		if (!m) {
			m = !0;
			var e = document.createElement("script");
			e.src = window.config.unityWebglLoaderUrl, e.addEventListener("load", function() {
				window.unityGame = window.UnityLoader.instantiate("game", window.config.unityWebglBuildUrl, {
					onProgress: r,
					Module: {
						onRuntimeInitialized: i
					}
				})
			}), PokiSDK.gameLoadingStart(), document.body.appendChild(e)
		}
	}

	function a() {
		var e = window.innerWidth,
			t = window.innerHeight,
			n = e / t;
		n > window.config.maxRatio ? (d.style.height = t + "px", d.style.width = t * window.config.maxRatio + "px") : n < window.config.minRatio ? (d.style.width = e + "px", d.style.height = e / window.config.minRatio + "px") : (d.style.width = e + "px", d.style.height = t + "px");
		var i = d.getBoundingClientRect();
		d.style.marginLeft = -.5 * i.width + "px", d.style.marginTop = -.5 * i.height + "px"
	}

	function r(e, t) {
		if (e.Module) {
			var n = 100 * t;
			l.style.width = n + "%", u.innerHTML = (n << 0) + "%";
			var i = {
				percentageDone: n
			};
			PokiSDK.gameLoadingProgress(i), t >= 1 && (c.className = "done")
		}
	}
	Object.defineProperty(t, "__esModule", {
		value: !0
	}), t.startLoadingGame = o;
	var d = document.getElementById("game-container"),
		s = document.getElementById("loader"),
		c = document.getElementById("progress-container"),
		l = document.getElementById("progress-fill"),
		u = document.getElementById("progress-amount"),
		m = !1;
	window.addEventListener("resize", a), window.addEventListener("focus", a), window.PokiSDK.init().then(function() {
		window.pokiBridge ? window.unityGame.SendMessage(window.pokiBridge, "ready") : window.pokiReady = !0
	}).catch(function() {
		window.pokiBridge ? window.unityGame.SendMessage(window.pokiBridge, "adblock") : window.pokiAdBlock = !0, console.log("AdBlocker active")
	}), window.PokiSDK.setDebug(window.config && window.config.debug)
}, function(e, t, n) {
	e.exports = n(2)
}, function(e, t, n) {
	"use strict";
	n(0), n(3), n(4)
}, function(e, t, n) {
	"use strict";

	function i() {
		var e = 1e3 * v,
			t = B.querySelector("#slideshow-images .right"),
			n = t.getAttribute("data-idx") << 0;
		if (t.getAttribute("fullImageLoaded")) window.setTimeout(o, e);
		else {
			var i = Date.now();
			d("screenshots/" + (n + 1) + ".jpg")(function(n) {
				t.querySelector("img").src = n.src, t.setAttribute("fullImageLoaded", !0);
				var a = Date.now() - i;
				a > e ? o() : window.setTimeout(o, e - a)
			})
		}
	}

	function o() {
		if (!A) {
			var e = x + 1;
			e > y - 1 && (e = 0), a(e)
		}
	}

	function a(e) {
		x = e << 0;
		var t = x > 0 ? x - 1 : y - 1,
			n = x < y - 1 ? x + 1 : 0;
		B.querySelectorAll(".image").forEach(function(e) {
			e.className === S + " left" && (e.className = S + " fromLeft"), e.className === S + " right" && (e.className = S + " fromRight"), -1 === e.className.indexOf("inactive") && (e.className += " inactive")
		}), B.querySelector('[data-idx="' + x + '"]').className = S + " middle", B.querySelector('[data-idx="' + t + '"]').className = S + " left", B.querySelector('[data-idx="' + n + '"]').className = S + " right", b.querySelectorAll(".bullet").forEach(function(e, t) {
			e.className = "bullet", t === x && (e.className += " active")
		}), window.setTimeout(function() {
			B.querySelectorAll(".inactive").forEach(function(e) {
				e.className = S + " inactive fromRight"
			})
		}, 1e3 * p), i()
	}

	function r() {
		var e = window.innerWidth / window.innerHeight,
			t = m / N * e,
			n = m;
		t > w && (t = w, n = t * N / e);
		var i = n * f,
			o = .5 - n / 2,
			a = n * g,
			r = -2 * a,
			d = 1 + a,
			s = (1 - n) / 4 - n / 2,
			c = .5 - .5 * n - (i + n) / 2 - h,
			l = 1 - (1 - n) / 4 - n / 2,
			u = .5 + .5 * i + h,
			v = Math.min(s, c),
			y = Math.max(l, u);
		L.innerHTML = "\n\t\t#slideshow-images {\n\t\t\theight: " + 100 * t + "vh;\n\t\t}\n\t\t#slideshow-images .image {\n\t\t\ttransition-duration: " + p + "s;\n\t\t\twidth: " + 100 * n + "vw;\n\t\t\theight: " + 100 * t + "vh;\n\t\t}\n\t\t#slideshow-images .middle {\n\t\t\ttransform: translateX(" + 100 * o + "vw);\n\t\t}\n\t\t#slideshow-images .left {\n\t\t\ttransform: translateX(" + 100 * v + "vw) scale(" + f + ");\n\t\t}\n\t\t#slideshow-images .right {\n\t\t\ttransform: translateX(" + 100 * y + "vw) scale(" + f + ");\n\t\t}\n\t\t#slideshow-images .inactive.fromLeft {\n\t\t\ttransform: translateX(" + 100 * r + "vw) scale(" + f * g + ");\n\t\t}\n\t\t#slideshow-images .inactive.fromRight {\n\t\t\ttransform: translateX(" + 100 * d + "vw) scale(" + f * g + ");\n\t\t}\n\t"
	}

	function d(e) {
		return function(t) {
			var n = new Image;
			return "function" == typeof t && (n.onload = function() {
				t(n), n.onload = null
			}), n.src = e, n
		}
	}

	function s(e, t) {
		var n = e.slice(),
			i = [],
			o = n.length,
			a = function(e) {
				i.push(e(function() {
					0 == --o && t(i)
				}))
			};
		n.forEach(a)
	}

	function c() {
		var e = document.createElement("div");
		return e.className = S, e
	}

	function l() {
		window.setTimeout(function() {
			var e = document.getElementById("spinner");
			e.parentNode.removeChild(e)
		}, 1e3)
	}
	var u = n(0);
	Array.prototype.forEach || (Array.prototype.forEach = function(e) {
			var t, n;
			if (null == this) throw new TypeError("this is null or not defined");
			var i = Object(this),
				o = i.length >>> 0;
			if ("function" != typeof e) throw new TypeError(e + " is not a function");
			for (arguments.length > 1 && (t = arguments[1]), n = 0; n < o;) {
				var a;
				n in i && (a = i[n], e.call(t, a, n, i)), n++
			}
		}),
		function() {
			if ("function" == typeof NodeList.prototype.forEach) return !1;
			NodeList.prototype.forEach = Array.prototype.forEach
		}();
	var m = .6,
		w = .7,
		f = .8,
		g = .5,
		h = 0,
		p = .5,
		v = 5,
		y = window.config.numScreenshots,
		E = document.getElementById("slideshow"),
		k = document.getElementById("slideshow-top"),
		b = document.getElementById("slideshow-nav"),
		B = document.getElementById("slideshow-images"),
		S = "image",
		x = 0,
		N = void 0,
		L = void 0,
		A = !1;
	! function() {
		var e = document.createElement("div");
		e.setAttribute("id", "spinner"), e.className = "spinner";
		for (var t = 0; t < 3; t++) {
			var n = document.createElement("div");
			n.className = "bounce" + t, e.appendChild(n)
		}
		document.body.appendChild(e)
	}(), d("screenshots/1-small.jpg")(function(e) {
		N = e.width / e.height, L = document.createElement("style"), r(), document.body.appendChild(L), window.addEventListener("resize", r);
		for (var t = 0; t <= y - 1; t++) {
			var n = document.createElement("div");
			n.className = "bullet" + (0 === t ? " active" : ""), n.setAttribute("data-idx", t), b.appendChild(n)
		}
		d("thumbnail.jpg")(function() {
			k.className = "active", d("screenshots/1.jpg")(function(e) {
				var t = c();
				t.className = S + " middle", t.setAttribute("fullImageLoaded", !0), t.setAttribute("data-idx", 0), t.appendChild(e), B.appendChild(t);
				for (var n = [], o = 1; o <= y - 1; o++) n.push(d("screenshots/" + (o + 1) + "-small.jpg"));
				s(n, function(e) {
					e.forEach(function(e) {
						var t = (e.src.match(/screenshots\/([0-9]+)[-.]/)[1] << 0) - 1,
							n = c();
						n.appendChild(e), n.setAttribute("data-idx", t), n.className = 1 === t ? S + " right" : t === y - 1 ? S + " left" : S + " inactive", B.appendChild(n)
					}), l(), E.className = "active", i()
				}), (0, u.startLoadingGame)()
			})
		})
	}), window.removeSlideshowEventListeners = function() {
		A = !0
	}
}, function(e, t, n) {
	"use strict";
	window.initPokiBridge = function(e) {
		window.pokiReady || window.pokiAdBlock ? window.pokiReady ? window.unityGame.SendMessage(e, "ready") : window.pokiAdBlock && window.unityGame.SendMessage(e, "adblock") : window.pokiBridge = e, window.commercialBreak = function() {
			PokiSDK.commercialBreak().then(function() {
				window.unityGame.SendMessage(e, "commercialBreakCompleted")
			})
		}, window.rewardedBreak = function() {
			PokiSDK.rewardedBreak().then(function(t) {
				window.unityGame.SendMessage(e, "rewardedBreakCompleted", t.toString())
			})
		}
	}
}]);