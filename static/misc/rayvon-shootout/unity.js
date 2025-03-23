! function(n) {
  function e(o) {
      if (t[o]) return t[o].exports;
      var i = t[o] = {
          i: o,
          l: !1,
          exports: {}
      };
      return n[o].call(i.exports, i, i.exports, e), i.l = !0, i.exports
  }
  var t = {};
  e.m = n, e.c = t, e.d = function(n, t, o) {
      e.o(n, t) || Object.defineProperty(n, t, {
          configurable: !1,
          enumerable: !0,
          get: o
      })
  }, e.n = function(n) {
      var t = n && n.__esModule ? function() {
          return n.default
      } : function() {
          return n
      };
      return e.d(t, "a", t), t
  }, e.o = function(n, e) {
      return Object.prototype.hasOwnProperty.call(n, e)
  }, e.p = "", e(e.s = 2)
}([function(n, e, t) {
  "use strict";
  var o = {
      loader: "unity",
      maxRatio: 16 / 9,
      minRatio: 9 / 16,
      thumbnail: "",
      numScreenshots: 0,
      commentChangeTime: 5e3,
      spinnerRemoveDelay: 1e3,
      fullImageMaxWidth: .6,
      fullImageMaxHeight: .7,
      smallImageSizeOfFullImage: .8,
      animationTargetSizeOfSmallImage: .5,
      transitionDuration: .5,
      slideshowInterval: 5
  };
  window.config.title || console.error(new Error("No title on window.config"));
  var i = Object.assign(o, window.config);
  e.a = i
}, function(n, e, t) {
  "use strict";

  function o(n, e, t, o, i, r, a) {
      try {
          var s = n[r](a),
              c = s.value
      } catch (n) {
          return void t(n)
      }
      s.done ? e(c) : Promise.resolve(c).then(o, i)
  }

  function i(n) {
      return function() {
          var e = this,
              t = arguments;
          return new Promise(function(i, r) {
              function a(n) {
                  o(c, i, r, a, s, "next", n)
              }

              function s(n) {
                  o(c, i, r, a, s, "throw", n)
              }
              var c = n.apply(e, t);
              a(void 0)
          })
      }
  }

  function r() {
      return a.apply(this, arguments)
  }

  function a() {
      return a = i(x.a.mark(function n() {
          var e, t, o, i, r, a, c;
          return x.a.wrap(function(n) {
              for (;;) switch (n.prev = n.next) {
                  case 0:
                      return m = document.getElementById("slideshow"), p = document.getElementById("slideshow-top"), g = document.getElementById("slideshow-nav"), w = document.getElementById("slideshow-images"), p.className = "active", n.prev = 5, n.next = 8, f("".concat(B, "screenshots/1-small.jpg").concat(I));
                  case 8:
                      e = n.sent, n.next = 16;
                      break;
                  case 11:
                      return n.prev = 11, n.t0 = n.catch(5), n.next = 15, f("".concat(B, "screenshots/1.jpg").concat(I));
                  case 15:
                      e = n.sent;
                  case 16:
                      for (t = h(), t.className = "".concat(L, " middle"), t.setAttribute("fullImageLoaded", !0), t.setAttribute("data-idx", 0), t.appendChild(e), w.appendChild(t), m.className = "active", v = e.width / e.height, y = document.createElement("style"), u(), document.body.appendChild(y), window.addEventListener("resize", u), o = 0; o <= S.a.numScreenshots - 1; o++) i = document.createElement("div"), i.className = "bullet".concat(0 === o ? " active" : ""), i.setAttribute("data-idx", o), g.appendChild(i);
                      return n.next = 31, f("".concat(B, "screenshots/1.jpg").concat(I));
                  case 31:
                      for (r = n.sent, t.querySelector("img").src = r.src, a = function(n) {
                              var e = h(),
                                  t = new Image;
                              t.src = "".concat(B, "screenshots/").concat(n + 1, "-small.jpg").concat(I), e.appendChild(t), e.setAttribute("data-idx", n), 1 === n ? e.className = "".concat(L, " right") : n === S.a.numScreenshots - 1 ? e.className = "".concat(L, " left") : e.className = "".concat(L, " inactive"), w.appendChild(e)
                          }, c = 1; c <= S.a.numScreenshots - 1; c++) a(c);
                      s();
                  case 36:
                  case "end":
                      return n.stop()
              }
          }, n, null, [
              [5, 11]
          ])
      })), a.apply(this, arguments)
  }

  function s() {
      return c.apply(this, arguments)
  }

  function c() {
      return c = i(x.a.mark(function n() {
          var e, t, o, i, r, a;
          return x.a.wrap(function(n) {
              for (;;) switch (n.prev = n.next) {
                  case 0:
                      if (e = 1e3 * S.a.slideshowInterval, t = w.querySelector("#slideshow-images .right"), o = t.getAttribute("data-idx") << 0, t.getAttribute("fullImageLoaded")) {
                          n.next = 16;
                          break
                      }
                      return i = Date.now(), n.next = 7, f("".concat(B, "screenshots/").concat(o + 1, ".jpg").concat(I));
                  case 7:
                      r = n.sent, t.querySelector("img").src = r.src, t.setAttribute("fullImageLoaded", !0), clearTimeout(window.slideShowMoveTransitionID), clearTimeout(window.slideShowTimeoutID), a = Date.now() - i, a > e ? l() : window.slideShowTimeoutID = window.setTimeout(l, e - a), n.next = 19;
                      break;
                  case 16:
                      clearTimeout(window.slideShowMoveTransitionID), clearTimeout(window.slideShowTimeoutID), window.slideShowTimeoutID = window.setTimeout(l, e);
                  case 19:
                  case "end":
                      return n.stop()
              }
          }, n)
      })), c.apply(this, arguments)
  }

  function l() {
      if (!E) {
          var n = k + 1;
          n > S.a.numScreenshots - 1 && (n = 0), d(n)
      }
  }

  function d(n) {
      k = n << 0;
      var e = k > 0 ? k - 1 : S.a.numScreenshots - 1,
          t = k < S.a.numScreenshots - 1 ? k + 1 : 0;
      w.querySelectorAll(".image").forEach(function(n) {
          n.className === "".concat(L, " left") && (n.className = "".concat(L, " fromLeft")), n.className === "".concat(L, " right") && (n.className = "".concat(L, " fromRight")), -1 === n.className.indexOf("inactive") && (n.className += " inactive")
      }), w.querySelector('[data-idx="'.concat(k, '"]')).className = "".concat(L, " middle"), w.querySelector('[data-idx="'.concat(e, '"]')).className = "".concat(L, " left"), w.querySelector('[data-idx="'.concat(t, '"]')).className = "".concat(L, " right"), g.querySelectorAll(".bullet").forEach(function(n, e) {
          n.className = "bullet", e === k && (n.className += " active")
      }), window.slideShowMoveTransitionID = window.setTimeout(function() {
          w.querySelectorAll(".inactive").forEach(function(n) {
              n.className = "".concat(L, " inactive fromRight")
          })
      }, 1e3 * S.a.transitionDuration), s()
  }

  function u() {
      var n = window.innerWidth / window.innerHeight,
          e = S.a.fullImageMaxWidth / v * n,
          t = S.a.fullImageMaxWidth;
      e > S.a.fullImageMaxHeight && (e = S.a.fullImageMaxHeight, t = e * v / n);
      var o = t * S.a.smallImageSizeOfFullImage,
          i = .5 - t / 2,
          r = t * S.a.animationTargetSizeOfSmallImage,
          a = -2 * r,
          s = 1 + r,
          c = (1 - t) / 4 - t / 2,
          l = .5 - .5 * t - (o + t) / 2,
          d = 1 - (1 - t) / 4 - t / 2,
          u = .5 + .5 * o,
          f = Math.min(c, l),
          h = Math.max(d, u);
      y.innerHTML = ""
  }

  function f(n) {
      return new Promise(function(e, t) {
          var o = new Image;
          o.addEventListener("load", function() {
              return e(o)
          }), o.addEventListener("error", function(n) {
              o.src.indexOf(".jpg") > 0 ? o.src = o.src.replace(".jpg", ".png") : t(n)
          }), o.src = n
      })
  }

  function h() {
      var n = document.createElement("div");
      return n.className = L, n
  }
  e.a = r;
  var m, p, g, w, v, y, b = t(10),
      x = t.n(b),
      S = t(0),
      L = "image",
      k = 0,
      E = !1,
      I = S.a.screenshotsVersion ? "?v".concat(S.a.screenshotsVersion) : "",
      C = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")),
      T = window.location.hostname.endsWith("game-cdn.poki.com") || window.location.hostname.endsWith(".poki-gdn.com"),
      B = T ? "/cdn-cgi/image/f=auto,quality=78".concat(C, "/") : "";
  window.navigateNext = l, window.removeSlideshowEventListeners = function() {
      E = !0
  }
}, function(n, e, t) {
  n.exports = t(3)
}, function(n, e, t) {
  "use strict";

  function o(n) {
      var e = document.createElement("div");
      return e.id = n, e
  }
  Object.defineProperty(e, "__esModule", {
      value: !0
  });
  var i = t(4),
      r = (t.n(i), t(0)),
      a = (t(9), t(1), t(11)),
      s = (t.n(a), o("loader")),
      c = o("slideshow"),
      l = o("slideshow-top"),
      d = document.createElement("img");
  var u = o("slideshow-top-container"),
      f = o("game-title");
  f.innerText = r.a.title;
  var h = o("progress-spinner");
  h.innerHTML = '<div class="bounce0"></div><div class="bounce1"></div><div class="bounce2">', h.setAttribute("class", "spinner");
  var m = o("progress-container"),
      p = o("progress-bar"),
      g = o("progress-fill");
  g.style.width = "0%";
  var w = o("progress-amount");
  w.innerText = "0%";
  var v = o("progress-comment");
  v.innerText = "Loading";
  var y = o("slideshow-images"),
      b = o("slideshow-nav"),
      x = o("game-container"),
      S = o("game");
  s.appendChild(c), c.appendChild(l), c.appendChild(y), c.appendChild(b), l.appendChild(d), l.appendChild(u), u.appendChild(f), u.appendChild(h), u.appendChild(m), m.appendChild(p), m.appendChild(w), u.appendChild(v), p.appendChild(g), x.appendChild(S), document.body.appendChild(s), document.body.appendChild(x)
}, function(n, e, t) {
  var o = t(5);
  "string" == typeof o && (o = [
      [n.i, o, ""]
  ]);
  var i = {
      hmr: !0
  };
  i.transform = void 0, i.insertInto = void 0;
  t(7)(o, i);
  o.locals && (n.exports = o.locals)
}, function(n, e, t) {
  e = n.exports = t(6)(!1), e.push([n.i, "* {\n    margin: 0;\n    padding: 0;\n}\n\nhtml,\nbody {\n    width: 100vw;\n    height: 100vh;\n    overflow: hidden;\n    background: #002B50;\n    font-family: Torus, Arial, Helvetica, sans-serif;\n    color: #fff;\n}\n\n#game-container {\n    position: absolute !important;\n    left: 50%;\n    top: 50%;\n    display: none;\n}\n\n#game,\n#game canvas {\n    width: 100%;\n    height: 100%;\n}\n\n#loader {\n    width: 100%;\n    height: 100%;\n}\n\n/**\n   * Slideshow\n   */\n\n#slideshow {\n    width: 100%;\n    height: 100%;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-evenly;\n    display: flex;\n    user-select: none;\n}\n\n@font-face {\n    font-family: Torus;\n    src:\n        url('./fonts/torus-bold-webfont.woff2') format('woff2'),\n        url('//a.poki.com/fonts/torus-bold-webfont.woff') format('woff');\n    font-style: bold;\n    font-weight: 700;\n}\n\n/**\n   * Slideshow - Top section\n   */\n#progress-spinner{\n    margin-left: 0;\n    margin-top: 0;\n    left: 0px;\n    display:none;\n    transform: translate(100%, -50%);\n    width:10vh;\n}\n#progress-spinner >div{\n    width:2vh;\n    height:2vh;\n}\n\n\n#slideshow-top {\n    display: flex;\n    margin: 2.5vh 0;\n}\n\n#slideshow-top-container {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    flex-grow: 1;\n}\n\n#game-title, #progress-comment {\n    display: flex;\n    flex-grow: 1;\n    align-items: center;\n    font-size:2vh;\n}\n\n#progress-container {\n    display: flex;\n    align-items: center;\n    flex-grow: 1;\n    transition: 0.2s ease-out all;\n}\n\n#progress-container.done {\n    opacity: 0;\n}\n\n#progress-bar {\n    background: #fff;\n    width: 100%;\n    overflow: hidden;\n}\n\n#progress-fill {\n    background: #3CF7DC;\n    height: 100%;\n    transition: 0.2s ease-out all;\n    animation-name: fillColor;\n    animation-duration: 3.5s;\n    animation-iteration-count: infinite;\n    animation-fill-mode: both;\n}\n\n@keyframes fillColor {\n    0% {\n        background-color: #3CF7DC;\n    }\n\n    25% {\n        background-color: #FFA9BE;\n    }\n\n    50% {\n        background-color: #FFDC00;\n    }\n\n    75% {\n        background-color: #E0AEF5;\n    }\n\n    100% {\n        background-color: #3CF7DC;\n    }\n}\n\n@media (orientation: portrait) {\n    \n\n    #game-title h1 {\n        font-size: 2vh;\n    }\n\n    #slideshow-top {\n        width: 70vw;\n    }\n\n    #progress-bar {\n        height: 1vh;\n        border-radius: 0.5vh;\n    }\n\n    #progress-fill {\n        border-radius: 0.5vh;\n    }\n\n    \n\n    #progress-amount {\n        font-size: 2vh;\n        margin-left: 1.5vh;\n        width: 3vh;\n    }\n}\n\n@media (orientation: landscape) {\n    \n\n    #game-title h1 {\n        font-size: 3vh;\n    }\n\n    #slideshow-top {\n        width: 50vw;\n    }\n\n    #progress-bar {\n        height: 1.2vh;\n        border-radius: 0.6vh;\n    }\n\n    #progress-fill {\n        border-radius: 0.6vh;\n    }\n\n    \n\n    #progress-amount {\n        font-size: 2.5vh;\n        margin-left: 1.875vh;\n        width: 3.75vh;\n    }\n}\n\n/**\n   * Slideshow - Images section\n   */\n\n#slideshow-images {\n    width: 100vw;\n    display: flex;\n    justify-content: center;\n}\n\n#slideshow-images .image {\n    position: absolute;\n    box-shadow: 0 2.4vh 3.6vh rgba(0, 0, 0, 0.4);\n    transition-property: transform;\n    transition-timing-function: ease-in-out;\n    perspective: 1000px;\n    left: 0;\n    overflow: hidden;\n    /* border: 1vh solid; */\n}\n\n#slideshow-images .image img {\n    width: 100%;\n    height: 100%;\n}\n\n#slideshow-images .image:nth-of-type(1n) {\n    border-color: #3BE8B0;\n}\n\n#slideshow-images .image:nth-of-type(2n) {\n    border-color: #FF6D92;\n}\n\n#slideshow-images .image:nth-of-type(3n) {\n    border-color: #A177FF;\n}\n\n#slideshow-images .image:nth-of-type(4n) {\n    border-color: #FFD200;\n}\n\n#slideshow-images .left {\n    z-index: 2;\n}\n#slideshow-images .right {\n    z-index: 1;\n}\n\n#slideshow-images .middle {\n    z-index: 3;\n}\n\n#slideshow-images .left img,\n#slideshow-images .right img {\n    transform: scale(1.05);\n}\n\n#slideshow-images .left img,\n#slideshow-images .right img,\n#slideshow-images .fromLeft img,\n#slideshow-images .fromRight img {\n    filter: blur(1vh);\n}\n\n#slideshow-images .inactive {\n    display: none;\n}\n\n#slideshow-images .inactive.fromLeft,\n#slideshow-images .inactive.fromRight {\n    display: block;\n}\n\n/**\n   * Slideshow - Navigation section\n   */\n\n#slideshow-nav {\n    display: flex;\n    justify-content: center;\n    margin: 2.5vh 0;\n}\n\n#slideshow-nav .bullet {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n#slideshow-nav .bullet:after {\n    content: '';\n    background: #fff;\n    border-radius: 0.4vh;\n    width: 0.8vh;\n    height: 0.8vh;\n}\n\n#slideshow-nav .bullet.active:after {\n    background: #009CFF;\n}\n\n#slideshow-nav .bullet {\n    width: 2.5vh;\n    height: 2.5vh;\n}\n\n#slideshow-nav .bullet:after {\n    border-radius: 50%;\n    width: 50%;\n    height: 50%;\n}\n\n/**\n   * Pop-in animation\n   */\n\n#slideshow-nav,\n#slideshow-images {\n    opacity: 0;\n    transition: 0.4s all ease-out;\n    transform: translateY(2vh);\n    perspective: 1000px;\n    transition-delay: 400ms;\n}\n\n#slideshow-nav {\n    transition-delay: 600ms;\n}\n\n#slideshow.active #slideshow-images,\n#slideshow.active #slideshow-nav {\n    opacity: 1;\n    transform: translateY(0);\n}\n\n@keyframes bounceInDown {\n\n    from,\n    60%,\n    75%,\n    90%,\n    to {\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n    }\n\n    0% {\n        transform: translate3d(0, -100vh, 0);\n    }\n\n    40% {\n        transform: translate3d(0, 0.5vh, 0);\n    }\n\n    65% {\n        transform: translate3d(0, -0.2vh, 0);\n    }\n\n    80% {\n        transform: translate3d(0, 0.1vh, 0);\n    }\n\n    to {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n#slideshow-top {\n    transform: translate3d(0, -20vh, 0);\n    opacity: 0;\n}\n\n#slideshow-top.active {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n    animation-name: bounceInDown;\n    animation-duration: 0.5s;\n}\n\n/**\n   * Loading dots\n   */\n.spinner {\n    position: relative;\n    left: -9999px;\n    animation: dot-pulse 1.5s infinite linear;\n    animation-delay: .25s;\n    transform:translate(50vw, 50vh) translate(-130%, -130%);\n  }\n\n  .spinner:before, .spinner:after {\n    content: '';\n    display: inline-block;\n    position: absolute;\n    top: 0;\n    width: 10px;\n    height: 10px;\n    border-radius: 5px;\n  }\n  .spinner, .spinner:before, .spinner:after{\n    width: 10px;\n    height: 10px;\n    border-radius: 5px;\n  }\n\n  .spinner:before {\n    animation: dot-pulse 1.5s infinite linear;\n    animation-delay: 0s;\n    left:-20px;\n  }\n\n  .spinner:after {\n    animation: dot-pulse 1.5s infinite linear;\n    animation-delay: .5s;\n    left:20px;\n  }\n\n  @keyframes dot-pulse {\n    0% {\n      box-shadow: 9999px 0 0 -5px #FFF;\n    }\n    30% {\n      box-shadow: 9999px 0 0 2px #FFF;\n    }\n    60%,\n    100% {\n      box-shadow: 9999px 0 0 -5px #FFF;\n    }\n  }\n", ""])
}, function(n, e, t) {
  "use strict";

  function o(n, e) {
      var t = n[1] || "",
          o = n[3];
      if (!o) return t;
      if (e && "function" == typeof btoa) {
          var r = i(o);
          return [t].concat(o.sources.map(function(n) {
              return "/*# sourceURL=" + o.sourceRoot + n + " */"
          })).concat([r]).join("\n")
      }
      return [t].join("\n")
  }

  function i(n) {
      return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(n)))) + " */"
  }
  n.exports = function(n) {
      var e = [];
      return e.toString = function() {
          return this.map(function(e) {
              var t = o(e, n);
              return e[2] ? "@media " + e[2] + "{" + t + "}" : t
          }).join("")
      }, e.i = function(n, t) {
          "string" == typeof n && (n = [
              [null, n, ""]
          ]);
          for (var o = {}, i = 0; i < this.length; i++) {
              var r = this[i][0];
              null != r && (o[r] = !0)
          }
          for (i = 0; i < n.length; i++) {
              var a = n[i];
              null != a[0] && o[a[0]] || (t && !a[2] ? a[2] = t : t && (a[2] = "(" + a[2] + ") and (" + t + ")"), e.push(a))
          }
      }, e
  }
}, function(n, e, t) {
  function o(n, e) {
      for (var t = 0; t < n.length; t++) {
          var o = n[t],
              i = p[o.id];
          if (i) {
              i.refs++;
              for (var r = 0; r < i.parts.length; r++) i.parts[r](o.parts[r]);
              for (; r < o.parts.length; r++) i.parts.push(u(o.parts[r], e))
          } else {
              for (var a = [], r = 0; r < o.parts.length; r++) a.push(u(o.parts[r], e));
              p[o.id] = {
                  id: o.id,
                  refs: 1,
                  parts: a
              }
          }
      }
  }

  function i(n, e) {
      for (var t = [], o = {}, i = 0; i < n.length; i++) {
          var r = n[i],
              a = e.base ? r[0] + e.base : r[0],
              s = r[1],
              c = r[2],
              l = r[3],
              d = {
                  css: s,
                  media: c,
                  sourceMap: l
              };
          o[a] ? o[a].parts.push(d) : t.push(o[a] = {
              id: a,
              parts: [d]
          })
      }
      return t
  }

  function r(n, e) {
      var t = v(n.insertInto);
      if (!t) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
      var o = x[x.length - 1];
      if ("top" === n.insertAt) o ? o.nextSibling ? t.insertBefore(e, o.nextSibling) : t.appendChild(e) : t.insertBefore(e, t.firstChild), x.push(e);
      else if ("bottom" === n.insertAt) t.appendChild(e);
      else {
          if ("object" != typeof n.insertAt || !n.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
          var i = v(n.insertAt.before, t);
          t.insertBefore(e, i)
      }
  }

  function a(n) {
      if (null === n.parentNode) return !1;
      n.parentNode.removeChild(n);
      var e = x.indexOf(n);
      e >= 0 && x.splice(e, 1)
  }

  function s(n) {
      var e = document.createElement("style");
      if (void 0 === n.attrs.type && (n.attrs.type = "text/css"), void 0 === n.attrs.nonce) {
          var t = d();
          t && (n.attrs.nonce = t)
      }
      return l(e, n.attrs), r(n, e), e
  }

  function c(n) {
      var e = document.createElement("link");
      return void 0 === n.attrs.type && (n.attrs.type = "text/css"), n.attrs.rel = "stylesheet", l(e, n.attrs), r(n, e), e
  }

  function l(n, e) {
      Object.keys(e).forEach(function(t) {
          n.setAttribute(t, e[t])
      })
  }

  function d() {
      return t.nc
  }

  function u(n, e) {
      var t, o, i, r;
      if (e.transform && n.css) {
          if (!(r = "function" == typeof e.transform ? e.transform(n.css) : e.transform.default(n.css))) return function() {};
          n.css = r
      }
      if (e.singleton) {
          var l = b++;
          t = y || (y = s(e)), o = f.bind(null, t, l, !1), i = f.bind(null, t, l, !0)
      } else n.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (t = c(e), o = m.bind(null, t, e), i = function() {
          a(t), t.href && URL.revokeObjectURL(t.href)
      }) : (t = s(e), o = h.bind(null, t), i = function() {
          a(t)
      });
      return o(n),
          function(e) {
              if (e) {
                  if (e.css === n.css && e.media === n.media && e.sourceMap === n.sourceMap) return;
                  o(n = e)
              } else i()
          }
  }

  function f(n, e, t, o) {
      var i = t ? "" : o.css;
      if (n.styleSheet) n.styleSheet.cssText = L(e, i);
      else {
          var r = document.createTextNode(i),
              a = n.childNodes;
          a[e] && n.removeChild(a[e]), a.length ? n.insertBefore(r, a[e]) : n.appendChild(r)
      }
  }

  function h(n, e) {
      var t = e.css,
          o = e.media;
      if (o && n.setAttribute("media", o), n.styleSheet) n.styleSheet.cssText = t;
      else {
          for (; n.firstChild;) n.removeChild(n.firstChild);
          n.appendChild(document.createTextNode(t))
      }
  }

  function m(n, e, t) {
      var o = t.css,
          i = t.sourceMap,
          r = void 0 === e.convertToAbsoluteUrls && i;
      (e.convertToAbsoluteUrls || r) && (o = S(o)), i && (o += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(i)))) + " */");
      var a = new Blob([o], {
              type: "text/css"
          }),
          s = n.href;
      n.href = URL.createObjectURL(a), s && URL.revokeObjectURL(s)
  }
  var p = {},
      g = function(n) {
          var e;
          return function() {
              return void 0 === e && (e = n.apply(this, arguments)), e
          }
      }(function() {
          return window && document && document.all && !window.atob
      }),
      w = function(n, e) {
          return e ? e.querySelector(n) : document.querySelector(n)
      },
      v = function(n) {
          var e = {};
          return function(n, t) {
              if ("function" == typeof n) return n();
              if (void 0 === e[n]) {
                  var o = w.call(this, n, t);
                  if (window.HTMLIFrameElement && o instanceof window.HTMLIFrameElement) try {
                      o = o.contentDocument.head
                  } catch (n) {
                      o = null
                  }
                  e[n] = o
              }
              return e[n]
          }
      }(),
      y = null,
      b = 0,
      x = [],
      S = t(8);
  n.exports = function(n, e) {
      if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
      e = e || {}, e.attrs = "object" == typeof e.attrs ? e.attrs : {}, e.singleton || "boolean" == typeof e.singleton || (e.singleton = g()), e.insertInto || (e.insertInto = "head"), e.insertAt || (e.insertAt = "bottom");
      var t = i(n, e);
      return o(t, e),
          function(n) {
              for (var r = [], a = 0; a < t.length; a++) {
                  var s = t[a],
                      c = p[s.id];
                  c.refs--, r.push(c)
              }
              if (n) {
                  o(i(n, e), e)
              }
              for (var a = 0; a < r.length; a++) {
                  var c = r[a];
                  if (0 === c.refs) {
                      for (var l = 0; l < c.parts.length; l++) c.parts[l]();
                      delete p[c.id]
                  }
              }
          }
  };
  var L = function() {
      var n = [];
      return function(e, t) {
          return n[e] = t, n.filter(Boolean).join("\n")
      }
  }()
}, function(n, e) {
  n.exports = function(n) {
      var e = "undefined" != typeof window && window.location;
      if (!e) throw new Error("fixUrls requires window.location");
      if (!n || "string" != typeof n) return n;
      var t = e.protocol + "//" + e.host,
          o = t + e.pathname.replace(/\/[^\/]*$/, "/");
      return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(n, e) {
          var i = e.trim().replace(/^"(.*)"$/, function(n, e) {
              return e
          }).replace(/^'(.*)'$/, function(n, e) {
              return e
          });
          if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)) return n;
          var r;
          return r = 0 === i.indexOf("//") ? i : 0 === i.indexOf("/") ? t + i : o + i.replace(/^\.\//, ""), "url(" + JSON.stringify(r) + ")"
      })
  }
}, function(n, e, t) {
  "use strict";

  function o() {
      var n = window.innerWidth,
          e = window.innerHeight,
          t = n / e;
      d.style.width = "".concat(n, "px"), d.style.height = "".concat(e, "px"), t > w.a.maxRatio ? d.style.width = "".concat(e * w.a.maxRatio, "px") : t < w.a.minRatio && (d.style.height = "".concat(n / w.a.minRatio, "px"));
      var o = d.getBoundingClientRect();
      d.style.marginLeft = "".concat(-.5 * o.width, "px"), d.style.marginTop = "".concat(-.5 * o.height, "px")
  }

  function i() {
      d = document.getElementById("game-container"), u = document.getElementById("loader"), f = document.getElementById("progress-container"), h = document.getElementById("progress-fill"), m = document.getElementById("progress-amount"), p = document.getElementById("progress-comment"), window.addEventListener("resize", o), window.addEventListener("focus", o), window.PokiSDK.init().then(function() {
          window.pokiBridge ? window.unityGame.SendMessage(window.pokiBridge, "ready") : window.pokiReady = !0
      }).catch(function() {
          window.pokiBridge ? window.unityGame.SendMessage(window.pokiBridge, "adblock") : window.pokiAdBlock = !0, console.info("AdBlocker active")
      }), window.PokiSDK.setDebug(w.a && w.a.debug)
  }

  function r() {
      d.style.display = "block", u.style.display = "none", o(), PokiSDK.gameLoadingFinished(), window.removeSlideshowEventListeners(), g && clearTimeout(g)
  }

  function a(n, e) {
      if (n.Module) {
          var t = 100 * e;
          h.style.width = "".concat(t, "%"), m.innerHTML = "".concat(t << 0, "%"), w.a.fileSize && (m.innerHTML += " of ".concat(w.a.fileSize, "MB"));
          var o = {
              percentageDone: t
          };
          PokiSDK.gameLoadingProgress(o), e >= 1 && "done" !== f.className && (f.className = "done", document.getElementById("progress-comment").innerHTML = "Preparing game...", document.getElementById("progress-spinner").style.display = "flex", g && clearTimeout(g))
      }
  }

  function s() {
      var n = w.a.loadingComments || ["Loading..."];
      n ? (p.innerHTML = n[y], y++, y >= n.length && (y = 0), g = setTimeout(s, w.a.commentChangeTime)) : p.innerHTML = ""
  }

  function c() {
      ! function() {
          var n = document.createElement("script");
          n.src = w.a.unityWebglLoaderUrl, n.addEventListener("load", function() {
              window.unityGame = window.UnityLoader.instantiate("game", w.a.unityWebglBuildUrl, {
                  onProgress: a,
                  Module: {
                      onRuntimeInitialized: r
                  }
              })
          }), document.body.appendChild(n)
      }(), PokiSDK.gameLoadingStart(), w.a.fileSize && (m.innerHTML += " of ".concat(w.a.fileSize, "MB"), m.style.width = "12vh", m.style.whiteSpace = "nowrap"), s()
  }

  function l() {
      window.setTimeout(function() {
          var n = document.getElementById("spinner");
          n && n.parentNode && n.parentNode.removeChild(n)
      }, w.a.spinnerRemoveDelay)
  }
  var d, u, f, h, m, p, g, w = t(0),
      v = t(1),
      y = 0;
  ! function() {
      var n = document.createElement("div");
      n.setAttribute("id", "spinner"), n.className = "spinner", document.body.appendChild(n)
  }(), window.onload = function() {
      i();
      try {
          Object(v.a)().then(function() {
              l()
          })
      } catch (n) {
          console.info("Slideshow loading error", n), l()
      }
      c()
  }
}, function(n, e, t) {
  var o = function(n) {
      "use strict";

      function e(n, e, t, i) {
          var r = e && e.prototype instanceof o ? e : o,
              a = Object.create(r.prototype),
              s = new f(i || []);
          return a._invoke = c(n, t, s), a
      }

      function t(n, e, t) {
          try {
              return {
                  type: "normal",
                  arg: n.call(e, t)
              }
          } catch (n) {
              return {
                  type: "throw",
                  arg: n
              }
          }
      }

      function o() {}

      function i() {}

      function r() {}

      function a(n) {
          ["next", "throw", "return"].forEach(function(e) {
              n[e] = function(n) {
                  return this._invoke(e, n)
              }
          })
      }

      function s(n) {
          function e(o, i, r, a) {
              var s = t(n[o], n, i);
              if ("throw" !== s.type) {
                  var c = s.arg,
                      l = c.value;
                  return l && "object" == typeof l && w.call(l, "__await") ? Promise.resolve(l.__await).then(function(n) {
                      e("next", n, r, a)
                  }, function(n) {
                      e("throw", n, r, a)
                  }) : Promise.resolve(l).then(function(n) {
                      c.value = n, r(c)
                  }, function(n) {
                      return e("throw", n, r, a)
                  })
              }
              a(s.arg)
          }

          function o(n, t) {
              function o() {
                  return new Promise(function(o, i) {
                      e(n, t, o, i)
                  })
              }
              return i = i ? i.then(o, o) : o()
          }
          var i;
          this._invoke = o
      }

      function c(n, e, o) {
          var i = S;
          return function(r, a) {
              if (i === k) throw new Error("Generator is already running");
              if (i === E) {
                  if ("throw" === r) throw a;
                  return m()
              }
              for (o.method = r, o.arg = a;;) {
                  var s = o.delegate;
                  if (s) {
                      var c = l(s, o);
                      if (c) {
                          if (c === I) continue;
                          return c
                      }
                  }
                  if ("next" === o.method) o.sent = o._sent = o.arg;
                  else if ("throw" === o.method) {
                      if (i === S) throw i = E, o.arg;
                      o.dispatchException(o.arg)
                  } else "return" === o.method && o.abrupt("return", o.arg);
                  i = k;
                  var d = t(n, e, o);
                  if ("normal" === d.type) {
                      if (i = o.done ? E : L, d.arg === I) continue;
                      return {
                          value: d.arg,
                          done: o.done
                      }
                  }
                  "throw" === d.type && (i = E, o.method = "throw", o.arg = d.arg)
              }
          }
      }

      function l(n, e) {
          var o = n.iterator[e.method];
          if (o === p) {
              if (e.delegate = null, "throw" === e.method) {
                  if (n.iterator.return && (e.method = "return", e.arg = p, l(n, e), "throw" === e.method)) return I;
                  e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method")
              }
              return I
          }
          var i = t(o, n.iterator, e.arg);
          if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, I;
          var r = i.arg;
          return r ? r.done ? (e[n.resultName] = r.value, e.next = n.nextLoc, "return" !== e.method && (e.method = "next", e.arg = p), e.delegate = null, I) : r : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, I)
      }

      function d(n) {
          var e = {
              tryLoc: n[0]
          };
          1 in n && (e.catchLoc = n[1]), 2 in n && (e.finallyLoc = n[2], e.afterLoc = n[3]), this.tryEntries.push(e)
      }

      function u(n) {
          var e = n.completion || {};
          e.type = "normal", delete e.arg, n.completion = e
      }

      function f(n) {
          this.tryEntries = [{
              tryLoc: "root"
          }], n.forEach(d, this), this.reset(!0)
      }

      function h(n) {
          if (n) {
              var e = n[y];
              if (e) return e.call(n);
              if ("function" == typeof n.next) return n;
              if (!isNaN(n.length)) {
                  var t = -1,
                      o = function e() {
                          for (; ++t < n.length;)
                              if (w.call(n, t)) return e.value = n[t], e.done = !1, e;
                          return e.value = p, e.done = !0, e
                      };
                  return o.next = o
              }
          }
          return {
              next: m
          }
      }

      function m() {
          return {
              value: p,
              done: !0
          }
      }
      var p, g = Object.prototype,
          w = g.hasOwnProperty,
          v = "function" == typeof Symbol ? Symbol : {},
          y = v.iterator || "@@iterator",
          b = v.asyncIterator || "@@asyncIterator",
          x = v.toStringTag || "@@toStringTag";
      n.wrap = e;
      var S = "suspendedStart",
          L = "suspendedYield",
          k = "executing",
          E = "completed",
          I = {},
          C = {};
      C[y] = function() {
          return this
      };
      var T = Object.getPrototypeOf,
          B = T && T(T(h([])));
      B && B !== g && w.call(B, y) && (C = B);
      var j = r.prototype = o.prototype = Object.create(C);
      return i.prototype = j.constructor = r, r.constructor = i, r[x] = i.displayName = "GeneratorFunction", n.isGeneratorFunction = function(n) {
          var e = "function" == typeof n && n.constructor;
          return !!e && (e === i || "GeneratorFunction" === (e.displayName || e.name))
      }, n.mark = function(n) {
          return Object.setPrototypeOf ? Object.setPrototypeOf(n, r) : (n.__proto__ = r, x in n || (n[x] = "GeneratorFunction")), n.prototype = Object.create(j), n
      }, n.awrap = function(n) {
          return {
              __await: n
          }
      }, a(s.prototype), s.prototype[b] = function() {
          return this
      }, n.AsyncIterator = s, n.async = function(t, o, i, r) {
          var a = new s(e(t, o, i, r));
          return n.isGeneratorFunction(o) ? a : a.next().then(function(n) {
              return n.done ? n.value : a.next()
          })
      }, a(j), j[x] = "Generator", j[y] = function() {
          return this
      }, j.toString = function() {
          return "[object Generator]"
      }, n.keys = function(n) {
          var e = [];
          for (var t in n) e.push(t);
          return e.reverse(),
              function t() {
                  for (; e.length;) {
                      var o = e.pop();
                      if (o in n) return t.value = o, t.done = !1, t
                  }
                  return t.done = !0, t
              }
      }, n.values = h, f.prototype = {
          constructor: f,
          reset: function(n) {
              if (this.prev = 0, this.next = 0, this.sent = this._sent = p, this.done = !1, this.delegate = null, this.method = "next", this.arg = p, this.tryEntries.forEach(u), !n)
                  for (var e in this) "t" === e.charAt(0) && w.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = p)
          },
          stop: function() {
              this.done = !0;
              var n = this.tryEntries[0],
                  e = n.completion;
              if ("throw" === e.type) throw e.arg;
              return this.rval
          },
          dispatchException: function(n) {
              function e(e, o) {
                  return r.type = "throw", r.arg = n, t.next = e, o && (t.method = "next", t.arg = p), !!o
              }
              if (this.done) throw n;
              for (var t = this, o = this.tryEntries.length - 1; o >= 0; --o) {
                  var i = this.tryEntries[o],
                      r = i.completion;
                  if ("root" === i.tryLoc) return e("end");
                  if (i.tryLoc <= this.prev) {
                      var a = w.call(i, "catchLoc"),
                          s = w.call(i, "finallyLoc");
                      if (a && s) {
                          if (this.prev < i.catchLoc) return e(i.catchLoc, !0);
                          if (this.prev < i.finallyLoc) return e(i.finallyLoc)
                      } else if (a) {
                          if (this.prev < i.catchLoc) return e(i.catchLoc, !0)
                      } else {
                          if (!s) throw new Error("try statement without catch or finally");
                          if (this.prev < i.finallyLoc) return e(i.finallyLoc)
                      }
                  }
              }
          },
          abrupt: function(n, e) {
              for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                  var o = this.tryEntries[t];
                  if (o.tryLoc <= this.prev && w.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                      var i = o;
                      break
                  }
              }
              i && ("break" === n || "continue" === n) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
              var r = i ? i.completion : {};
              return r.type = n, r.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, I) : this.complete(r)
          },
          complete: function(n, e) {
              if ("throw" === n.type) throw n.arg;
              return "break" === n.type || "continue" === n.type ? this.next = n.arg : "return" === n.type ? (this.rval = this.arg = n.arg, this.method = "return", this.next = "end") : "normal" === n.type && e && (this.next = e), I
          },
          finish: function(n) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                  var t = this.tryEntries[e];
                  if (t.finallyLoc === n) return this.complete(t.completion, t.afterLoc), u(t), I
              }
          },
          catch: function(n) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                  var t = this.tryEntries[e];
                  if (t.tryLoc === n) {
                      var o = t.completion;
                      if ("throw" === o.type) {
                          var i = o.arg;
                          u(t)
                      }
                      return i
                  }
              }
              throw new Error("illegal catch attempt")
          },
          delegateYield: function(n, e, t) {
              return this.delegate = {
                  iterator: h(n),
                  resultName: e,
                  nextLoc: t
              }, "next" === this.method && (this.arg = p), I
          }
      }, n
  }(n.exports);
  try {
      regeneratorRuntime = o
  } catch (n) {
      Function("r", "regeneratorRuntime = r")(o)
  }
}, function(n, e) {
  window.initPokiBridge = function(n) {
      window.pokiReady || window.pokiAdBlock ? window.pokiReady ? window.unityGame.SendMessage(n, "ready") : window.pokiAdBlock && window.unityGame.SendMessage(n, "adblock") : window.pokiBridge = n, window.commercialBreak = function() {
          PokiSDK.commercialBreak().then(function() {
              window.unityGame.SendMessage(n, "commercialBreakCompleted")
          })
      }, window.rewardedBreak = function() {
          PokiSDK.rewardedBreak().then(function(e) {
              window.unityGame.SendMessage(n, "rewardedBreakCompleted", e.toString())
          })
      }
  }
}]);