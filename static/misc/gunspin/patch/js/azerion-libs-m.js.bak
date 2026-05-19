var _azerionIntegration = {
    gdId: "762c932b4db74c6da0c1d101b2da8be6",
    alxType: "std",
    advType: "gd",
    af: !1,
    sa: !1,
    la: !1,
    bd: 8,
    playBtn: !0,
    build: {
        version: "tc-24",
        timeStamp: 1680267092432,
        h: "8d828ac6"
    }
};
var libs = [];
var enableAnalytics;
!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? factory(exports) : "function" == typeof define && define.amd ? define(["exports"], factory) : factory((global = "undefined" != typeof globalThis ? globalThis : global || self).h5branding = global.h5branding || {})
}(this, function(exports) {
    "use strict";
    var commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    function commonjsRequire() {
        throw new Error("Dynamic requires are not currently supported by rollup-plugin-commonjs")
    }
    function createCommonjsModule(fn, module) {
        return fn(module = {
            exports: {}
        }, module.exports),
        module.exports
    }
    var es6Promise;
    var list;
    createCommonjsModule(function(module, exports) {
        function objectOrFunction(x) {
            var type = typeof x;
            return null !== x && ("object" == type || "function" == type)
        }
        function isFunction(x) {
            return "function" == typeof x
        }
        function setScheduler(scheduleFn) {
            customSchedulerFn = scheduleFn
        }
        function setAsap(asapFn) {
            asap = asapFn
        }
        function useNextTick() {
            return function() {
                return process.nextTick(flush)
            }
        }
        function useVertxTimer() {
            return void 0 !== vertxNext ? function() {
                vertxNext(flush)
            }
            : useSetTimeout()
        }
        function useMutationObserver() {
            var iterations = 0;
            var observer = new BrowserMutationObserver(flush);
            var node = document.createTextNode("");
            return observer.observe(node, {
                characterData: !0
            }),
            function() {
                node.data = iterations = ++iterations % 2
            }
        }
        function useMessageChannel() {
            var channel = new MessageChannel;
            return channel.port1.onmessage = flush,
            function() {
                return channel.port2.postMessage(0)
            }
        }
        function useSetTimeout() {
            var globalSetTimeout = setTimeout;
            return function() {
                return globalSetTimeout(flush, 1)
            }
        }
        function flush() {
            for (var i = 0; i < len; i += 2) {
                var callback;
                var arg;
                (0,
                queue[i])(queue[i + 1]),
                queue[i] = void 0,
                queue[i + 1] = void 0
            }
            len = 0
        }
        function attemptVertx() {
            try {
                var vertx = Function("return this")().require("vertx");
                return vertxNext = vertx.runOnLoop || vertx.runOnContext,
                useVertxTimer()
            } catch (e) {
                return useSetTimeout()
            }
        }
        function then(onFulfillment, onRejection) {
            var parent = this;
            var child = new this.constructor(noop);
            void 0 === child[PROMISE_ID] && makePromise(child);
            var _state = parent._state;
            var callback;
            return _state ? (callback = arguments[_state - 1],
            asap(function() {
                return invokeCallback(_state, child, callback, parent._result)
            })) : subscribe(parent, child, onFulfillment, onRejection),
            child
        }
        function resolve$1(object) {
            var Constructor = this;
            var promise;
            return object && "object" == typeof object && object.constructor === this ? object : (resolve(promise = new this(noop), object),
            promise)
        }
        function noop() {}
        function selfFulfillment() {
            return new TypeError("You cannot resolve a promise with itself")
        }
        function cannotReturnOwn() {
            return new TypeError("A promises callback cannot return that same promise.")
        }
        function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
            try {
                then$$1.call(value, fulfillmentHandler, rejectionHandler)
            } catch (e) {
                return e
            }
        }
        function handleForeignThenable(promise, thenable, then$$1) {
            asap(function(promise) {
                var sealed = !1;
                var error = tryThen(then$$1, thenable, function(value) {
                    sealed || (sealed = !0,
                    (thenable !== value ? resolve : fulfill)(promise, value))
                }, function(reason) {
                    sealed || (sealed = !0,
                    reject(promise, reason))
                }, "Settle: " + (promise._label || " unknown promise"));
                !sealed && error && (sealed = !0,
                reject(promise, error))
            }, promise)
        }
        function handleOwnThenable(promise, thenable) {
            thenable._state === FULFILLED ? fulfill(promise, thenable._result) : thenable._state === REJECTED ? reject(promise, thenable._result) : subscribe(thenable, void 0, function(value) {
                return resolve(promise, value)
            }, function(reason) {
                return reject(promise, reason)
            })
        }
        function handleMaybeThenable(promise, maybeThenable, then$$1) {
            maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1 ? handleOwnThenable(promise, maybeThenable) : void 0 !== then$$1 && isFunction(then$$1) ? handleForeignThenable(promise, maybeThenable, then$$1) : fulfill(promise, maybeThenable)
        }
        function resolve(promise, value) {
            if (promise === value)
                reject(promise, selfFulfillment());
            else if (objectOrFunction(value)) {
                var then$$1 = void 0;
                try {
                    then$$1 = value.then
                } catch (error) {
                    return void reject(promise, error)
                }
                handleMaybeThenable(promise, value, then$$1)
            } else
                fulfill(promise, value)
        }
        function publishRejection(promise) {
            promise._onerror && promise._onerror(promise._result),
            publish(promise)
        }
        function fulfill(promise, value) {
            promise._state === PENDING && (promise._result = value,
            promise._state = FULFILLED,
            0 !== promise._subscribers.length) && asap(publish, promise)
        }
        function reject(promise, reason) {
            promise._state === PENDING && (promise._state = REJECTED,
            promise._result = reason,
            asap(publishRejection, promise))
        }
        function subscribe(parent, child, onFulfillment, onRejection) {
            var _subscribers = parent._subscribers;
            var length = _subscribers.length;
            parent._onerror = null,
            _subscribers[length] = child,
            _subscribers[length + FULFILLED] = onFulfillment,
            _subscribers[length + REJECTED] = onRejection,
            0 === length && parent._state && asap(publish, parent)
        }
        function publish(promise) {
            var subscribers = promise._subscribers;
            var settled = promise._state;
            if (0 !== subscribers.length) {
                var child = void 0
                  , callback = void 0
                  , detail = promise._result;
                for (var i = 0; i < subscribers.length; i += 3)
                    child = subscribers[i],
                    callback = subscribers[i + settled],
                    child ? invokeCallback(settled, child, callback, detail) : callback(detail);
                promise._subscribers.length = 0
            }
        }
        function invokeCallback(settled, promise, callback, detail) {
            var hasCallback = isFunction(callback)
              , value = void 0
              , error = void 0
              , succeeded = !0;
            if (hasCallback) {
                try {
                    value = callback(detail)
                } catch (e) {
                    succeeded = !1,
                    error = e
                }
                if (promise === value)
                    return void reject(promise, cannotReturnOwn())
            } else
                value = detail;
            promise._state === PENDING && (hasCallback && succeeded ? resolve(promise, value) : !1 === succeeded ? reject(promise, error) : settled === FULFILLED ? fulfill(promise, value) : settled === REJECTED && reject(promise, value))
        }
        function initializePromise(promise, resolver) {
            try {
                resolver(function resolvePromise(value) {
                    resolve(promise, value)
                }, function rejectPromise(reason) {
                    reject(promise, reason)
                })
            } catch (e) {
                reject(promise, e)
            }
        }
        function nextId() {
            return id++
        }
        function makePromise(promise) {
            promise[PROMISE_ID] = id++,
            promise._state = void 0,
            promise._result = void 0,
            promise._subscribers = []
        }
        function validationError() {
            return new Error("Array Methods must be provided an Array")
        }
        function all(entries) {
            return new Enumerator(this,entries).promise
        }
        function race(entries) {
            var Constructor = this;
            return isArray(entries) ? new Constructor(function(resolve, reject) {
                var length = entries.length;
                for (var i = 0; i < length; i++)
                    Constructor.resolve(entries[i]).then(resolve, reject)
            }
            ) : new Constructor(function(_, reject) {
                return reject(new TypeError("You must pass an array to race."))
            }
            )
        }
        function reject$1(reason) {
            var Constructor = this;
            var promise = new this(noop);
            return reject(promise, reason),
            promise
        }
        function needsResolver() {
            throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
        }
        function needsNew() {
            throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
        }
        function Promise(resolver) {
            this[PROMISE_ID] = id++,
            this._result = this._state = void 0,
            this._subscribers = [],
            noop !== resolver && ("function" != typeof resolver && needsResolver(),
            this instanceof Promise ? initializePromise(this, resolver) : needsNew())
        }
        function polyfill() {
            var local = void 0;
            if (void 0 !== commonjsGlobal)
                local = commonjsGlobal;
            else if ("undefined" != typeof self)
                local = self;
            else
                try {
                    local = Function("return this")()
                } catch (e) {
                    throw new Error("polyfill failed because global object is unavailable in this environment")
                }
            var P = local.Promise;
            if (P) {
                var promiseToString = null;
                try {
                    promiseToString = Object.prototype.toString.call(P.resolve())
                } catch (e) {}
                if ("[object Promise]" === promiseToString && !P.cast)
                    return
            }
            local.Promise = Promise$1
        }
        var _isArray, isArray, len, vertxNext, customSchedulerFn, asap, module, browserGlobal, BrowserMutationObserver, isWorker, queue, scheduleFlush, PROMISE_ID, PENDING, FULFILLED, REJECTED, id, Enumerator, Promise$1;
        module.exports = (_isArray = void 0,
        isArray = _isArray = Array.isArray || function(x) {
            return "[object Array]" === Object.prototype.toString.call(x)
        }
        ,
        customSchedulerFn = vertxNext = void (len = 0),
        asap = function asap(callback, arg) {
            queue[len] = callback,
            queue[len + 1] = arg,
            2 === (len += 2) && (customSchedulerFn ? customSchedulerFn(flush) : scheduleFlush())
        }
        ,
        module = "undefined" != typeof window ? window : void 0,
        BrowserMutationObserver = (browserGlobal = module || {}).MutationObserver || browserGlobal.WebKitMutationObserver,
        browserGlobal = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
        isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
        queue = new Array(1e3),
        scheduleFlush = void 0,
        scheduleFlush = (browserGlobal ? useNextTick : BrowserMutationObserver ? useMutationObserver : isWorker ? useMessageChannel : void 0 === module ? attemptVertx : useSetTimeout)(),
        PROMISE_ID = Math.random().toString(36).substring(2),
        PENDING = void 0,
        FULFILLED = 1,
        REJECTED = 2,
        id = 0,
        Enumerator = function() {
            function Enumerator(Constructor, input) {
                this._instanceConstructor = Constructor,
                this.promise = new Constructor(noop),
                this.promise[PROMISE_ID] || makePromise(this.promise),
                isArray(input) ? (this.length = input.length,
                this._remaining = input.length,
                this._result = new Array(this.length),
                0 !== this.length && (this.length = this.length || 0,
                this._enumerate(input),
                0 !== this._remaining) || fulfill(this.promise, this._result)) : reject(this.promise, validationError())
            }
            return Enumerator.prototype._enumerate = function _enumerate(input) {
                for (var i = 0; this._state === PENDING && i < input.length; i++)
                    this._eachEntry(input[i], i)
            }
            ,
            Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
                var c = this._instanceConstructor;
                var resolve$$1 = c.resolve;
                if (resolve$$1 === resolve$1) {
                    var _then = void 0;
                    var error = void 0;
                    var didError = !1;
                    try {
                        _then = entry.then
                    } catch (e) {
                        didError = !0,
                        error = e
                    }
                    var promise;
                    _then === then && entry._state !== PENDING ? this._settledAt(entry._state, i, entry._result) : "function" != typeof _then ? (this._remaining--,
                    this._result[i] = entry) : c === Promise$1 ? (promise = new c(noop),
                    didError ? reject(promise, error) : handleMaybeThenable(promise, entry, _then),
                    this._willSettleAt(promise, i)) : this._willSettleAt(new c(function(resolve$$1) {
                        return resolve$$1(entry)
                    }
                    ), i)
                } else
                    this._willSettleAt(resolve$$1(entry), i)
            }
            ,
            Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
                var promise = this.promise;
                promise._state === PENDING && (this._remaining--,
                state === REJECTED ? reject(promise, value) : this._result[i] = value),
                0 === this._remaining && fulfill(promise, this._result)
            }
            ,
            Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
                var enumerator = this;
                subscribe(promise, void 0, function(value) {
                    return enumerator._settledAt(FULFILLED, i, value)
                }, function(reason) {
                    return enumerator._settledAt(REJECTED, i, reason)
                })
            }
            ,
            Enumerator
        }(),
        Promise.prototype.catch = function _catch(onRejection) {
            return this.then(null, onRejection)
        }
        ,
        Promise.prototype.finally = function _finally(callback) {
            var promise = this;
            var constructor = this.constructor;
            return isFunction(callback) ? this.then(function(value) {
                return constructor.resolve(callback()).then(function() {
                    return value
                })
            }, function(reason) {
                return constructor.resolve(callback()).then(function() {
                    throw reason
                })
            }) : this.then(callback, callback)
        }
        ,
        (Promise$1 = Promise).prototype.then = then,
        Promise$1.all = all,
        Promise$1.race = race,
        Promise$1.resolve = resolve$1,
        Promise$1.reject = reject$1,
        Promise$1._setScheduler = setScheduler,
        Promise$1._setAsap = setAsap,
        Promise$1._asap = asap,
        Promise$1.polyfill = polyfill,
        Promise$1.Promise = Promise$1)
    }).polyfill();
    var Sld = function() {
        function Sld() {}
        return Sld.has = function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            var sldOffset, sldList;
            return !(tldOffset <= 0 || tldOffset >= domain.length - 1 || (sldOffset = domain.lastIndexOf(".", tldOffset - 1)) <= 0 || tldOffset - 1 <= sldOffset || !(sldList = list[domain.slice(tldOffset + 1)])) && 0 <= sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ")
        }
        ,
        Sld.is = function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            var sldOffset, sldList;
            return !(tldOffset <= 0 || tldOffset >= domain.length - 1 || 0 <= domain.lastIndexOf(".", tldOffset - 1) || !(sldList = list[domain.slice(tldOffset + 1)])) && 0 <= sldList.indexOf(" " + domain.slice(0, tldOffset) + " ")
        }
        ,
        Sld.get = function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            var sldOffset, sldList;
            return tldOffset <= 0 || tldOffset >= domain.length - 1 || (sldOffset = domain.lastIndexOf(".", tldOffset - 1)) <= 0 || tldOffset - 1 <= sldOffset || !(sldList = list[domain.slice(tldOffset + 1)]) || sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ") < 0 ? null : domain.slice(sldOffset + 1)
        }
        ,
        Sld
    }();
    var Domain = function() {
        function Domain() {}
        return Domain.setList = function(newList) {
            list = newList || {}
        }
        ,
        Domain.getDomain = function(host) {
            var t, t, t;
            return list ? (t = host.match(/\./g)) && t.length < 2 ? host : (t = this.getTld(host)) ? (t = host.length - t.length - 1,
            t = host.lastIndexOf(".", t - 1) + 1,
            host.substring(t) || "") : null : null
        }
        ,
        Domain.getTld = function(host) {
            var pos, pos;
            return list ? (pos = host.lastIndexOf("."),
            pos = host.substring(pos + 1),
            list[pos.toLowerCase()] && Sld.get(host) || pos) : ""
        }
        ,
        Domain.KEY = "Domains",
        Domain
    }();
    var Loader = function() {
        function Loader() {
            this.cache = {}
        }
        return Object.defineProperty(Loader, "instance", {
            get: function() {
                return Loader.classInstance = void 0 === Loader.classInstance ? new Loader : Loader.classInstance
            },
            enumerable: !1,
            configurable: !0
        }),
        Loader.prototype.load = function(key, url, contentType) {
            var _this = this;
            return this.contains(key) ? Promise.reject("Already in cache.") : (this.cache[key] = {
                url: url,
                data: null
            },
            this.requestXhr(url, contentType).then(function(data) {
                return _this.loadComplete(key, data)
            }).catch(function(e) {
                return _this.remove(key),
                Promise.reject(e)
            }))
        }
        ,
        Loader.prototype.loadComplete = function(key, data) {
            if (!this.contains(key))
                return Promise.reject("Item was removed from cache before loading was complete.");
            try {
                var json = JSON.parse(data);
                return this.cache[key].data = json,
                Promise.resolve(json)
            } catch (error) {
                return Promise.reject("There was an error parsing JSON file.")
            }
        }
        ,
        Loader.prototype.remove = function(key) {
            this.contains(key) && delete this.cache[key]
        }
        ,
        Loader.prototype.get = function(key) {
            return this.contains(key) ? this.cache[key].data : null
        }
        ,
        Loader.prototype.contains = function(key) {
            return this.cache.hasOwnProperty(key)
        }
        ,
        Loader.prototype.isLoading = function(key) {
            return this.contains(key) && null === this.cache[key].data
        }
        ,
        Loader.prototype.isLoaded = function(key) {
            return this.contains(key) && null !== this.cache[key].data
        }
        ,
        Loader.prototype.loadScript = function(url, deferred, callback) {
            return new Promise(function(resolve, reject) {
                var tag = document.createElement("script");
                tag.src = url,
                tag.async = !1,
                tag.onload = function() {
                    "function" == typeof callback && callback(),
                    resolve()
                }
                ,
                document.head.appendChild(tag)
            }
            )
        }
        ,
        Loader.prototype.requestXhr = function(url, contentType) {
            var xhr;
            return void 0 === contentType && (contentType = "application/json"),
            window.XMLHttpRequest ? (xhr = new XMLHttpRequest,
            new Promise(function(resolve, reject) {
                xhr.onreadystatechange = function() {
                    4 === xhr.readyState && (200 === xhr.status ? (resolve(xhr.responseText),
                    xhr.onreadystatechange = null) : 0 < xhr.status && (reject("There was a problem with the request: status ".concat(xhr.status)),
                    xhr.onreadystatechange = null))
                }
                ;
                try {
                    xhr.open("GET", url, !0),
                    xhr.setRequestHeader("Content-Type", contentType),
                    xhr.send()
                } catch (e) {
                    reject("Error: Unable to send request, CORS not allowed.")
                }
            }
            )) : Promise.reject("Unable to send request, XMLHttpRequest not supported.")
        }
        ,
        Loader
    }();
    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P = P || Promise)(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function(resolve) {
                    resolve(result.value)
                }
                ).then(fulfilled, rejected)
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next())
        }
        )
    }
    function __generator(thisArg, body) {
        var _ = {
            label: 0,
            sent: function() {
                if (1 & t[0])
                    throw t[1];
                return t[1]
            },
            trys: [],
            ops: []
        }, f, y, t, g;
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        },
        "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this
        }
        ),
        g;
        function verb(n) {
            return function(v) {
                return step([n, v])
            }
        }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            for (; _; )
                try {
                    if (f = 1,
                    y && (t = 2 & op[0] ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y),
                    0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    switch (y = 0,
                    (op = t ? [2 & op[0], t.value] : op)[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        return _.label++,
                        {
                            value: op[1],
                            done: !1
                        };
                    case 5:
                        _.label++,
                        y = op[1],
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop(),
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = 0 < (t = _.trys).length && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                            _ = 0;
                            continue
                        }
                        if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3]))
                            _.label = op[1];
                        else if (6 === op[0] && _.label < t[1])
                            _.label = t[1],
                            t = op;
                        else {
                            if (!(t && _.label < t[2])) {
                                t[2] && _.ops.pop(),
                                _.trys.pop();
                                continue
                            }
                            _.label = t[2],
                            _.ops.push(op)
                        }
                    }
                    op = body.call(thisArg, _)
                } catch (e) {
                    op = [6, e],
                    y = 0
                } finally {
                    f = t = 0
                }
            if (5 & op[0])
                throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            }
        }
    }
    var BrandingDomain;
    exports.BrandingDomain = void 0,
    (BrandingDomain = exports.BrandingDomain || (exports.BrandingDomain = {}))[BrandingDomain.Neutral = 0] = "Neutral",
    BrandingDomain[BrandingDomain.Yepi = 1] = "Yepi",
    BrandingDomain[BrandingDomain.Spele = 2] = "Spele",
    BrandingDomain[BrandingDomain.Funnygames = 3] = "Funnygames",
    BrandingDomain[BrandingDomain.Kizi = 4] = "Kizi",
    BrandingDomain[BrandingDomain.PlayCell = 5] = "PlayCell",
    BrandingDomain[BrandingDomain.GameCell = 6] = "GameCell",
    BrandingDomain[BrandingDomain.Bild = 7] = "Bild",
    BrandingDomain[BrandingDomain.AGame = 8] = "AGame",
    BrandingDomain[BrandingDomain.Admeen = 9] = "Admeen",
    BrandingDomain[BrandingDomain.PlayTime = 10] = "PlayTime",
    BrandingDomain[BrandingDomain.Zigiz = 11] = "Zigiz";
    var Hosts = function() {
        function Hosts() {}
        return Hosts.isBip = function() {
            return -1 !== window.location.search.indexOf("bipgaming") || "bip.fbrq.io" === window.location.host
        }
        ,
        Hosts.isPlaycellApp = function() {
            return -1 !== window.location.search.indexOf("playcellApp")
        }
        ,
        Hosts.isAGame = function() {
            return -1 !== window.location.search.indexOf("agame")
        }
        ,
        Hosts.isAirfi = function() {
            return !!window.hasOwnProperty("airfi") && window.airfi
        }
        ,
        Hosts.isPlaytime = function() {
            return -1 !== window.location.host.indexOf("playtime.nl")
        }
        ,
        Hosts.isBild = function() {
            return "bild.fbrq.io" === window.location.host || -1 !== window.location.host.indexOf("contentfleet.com")
        }
        ,
        Hosts.isYandex = function() {
            return window.hasOwnProperty("_YaSDK") || window.hasOwnProperty("YaGames")
        }
        ,
        Hosts.getYandexBaseURL = function() {
            var _a, _a;
            var lang;
            if (null != (_a = null == (_a = window.YandexGamesSDKEnvironment) ? void 0 : _a.browser) && _a.lang && "en" === window.YandexGamesSDKEnvironment.browser.lang)
                return "yandex.com";
            return "yandex.ru"
        }
        ,
        Hosts
    }();
    var BrandingDomain;
    exports.UtmTargets = void 0,
    (BrandingDomain = exports.UtmTargets || (exports.UtmTargets = {}))[BrandingDomain.splashscreen = 0] = "splashscreen",
    BrandingDomain[BrandingDomain.logo = 1] = "logo",
    BrandingDomain[BrandingDomain.facebook = 2] = "facebook",
    BrandingDomain[BrandingDomain.twitter = 3] = "twitter",
    BrandingDomain[BrandingDomain.playstore = 4] = "playstore",
    BrandingDomain[BrandingDomain.appstore = 5] = "appstore",
    BrandingDomain[BrandingDomain.more_games = 6] = "more_games",
    BrandingDomain[BrandingDomain.download_game = 7] = "download_game",
    BrandingDomain[BrandingDomain.walkthrough = 8] = "walkthrough",
    BrandingDomain[BrandingDomain.disclaimer = 9] = "disclaimer",
    BrandingDomain[BrandingDomain.highscores = 10] = "highscores";
    var CrossPromo = function() {
        function CrossPromo() {}
        return CrossPromo.getProtocol = function(isDevice) {
            var protocol;
            return isDevice ? "https://" : "//"
        }
        ,
        CrossPromo.getUtmContent = function(type) {
            return "string" == typeof type ? type : exports.UtmTargets[type]
        }
        ,
        CrossPromo.getDomainURL = function(domain, protocol) {
            var url;
            switch (domain) {
            case exports.BrandingDomain.Spele:
                url = protocol + "www.spele.nl";
                break;
            case exports.BrandingDomain.Yepi:
                url = protocol + "www.yepi.com";
                break;
            case exports.BrandingDomain.Admeen:
                url = "https://media.admeen.com/branding/link.php";
                break;
            case exports.BrandingDomain.PlayCell:
                url = protocol + "www.playcell.com";
                break;
            case exports.BrandingDomain.GameCell:
                url = protocol + "www.gamecell.com";
                break;
            case exports.BrandingDomain.Kizi:
                url = protocol + "www.kizi.com";
                break;
            case exports.BrandingDomain.Bild:
                url = protocol + "www.bildspielt.de";
                break;
            case exports.BrandingDomain.Funnygames:
                url = protocol + "www.funnygames.nu";
                break;
            case exports.BrandingDomain.PlayTime:
                url = protocol + "playtime.nl";
                break;
            default:
            case exports.BrandingDomain.AGame:
                url = protocol + "www.agame.com";
                break;
            case exports.BrandingDomain.Zigiz:
                url = protocol + "m.zigiz.com";
                break
            }
            return url
        }
        ,
        CrossPromo.getPromoURL = function(domain, url, host, gameTitle, utmContent) {
            return window.hasOwnProperty("_YaSDK") || window.hasOwnProperty("YaGames") ? "https://".concat(Hosts.getYandexBaseURL(), "/games/developer?name=Azerion") : domain === exports.BrandingDomain.Admeen ? "https://media.admeen.com/branding/link.php" : domain === exports.BrandingDomain.Bild ? url : url + "/?utm_source=" + host + "&utm_medium=html5&utm_term=" + gameTitle + "&utm_content=" + utmContent + "&utm_campaign=Gamedistribution"
        }
        ,
        CrossPromo
    }();
    function addScript(src, buster, callback) {
        var s = document.createElement("script");
        s.setAttribute("src", src + "?v=" + buster),
        "function" == typeof callback && (s.onload = callback),
        document.body.appendChild(s)
    }
    var PortalScripts = function() {
        function PortalScripts() {}
        return PortalScripts.loadPortalScript = function(siteLockList) {
            siteLockList && siteLockList.hasOwnProperty("minijuegos") && -1 !== siteLockList.minijuegos.indexOf(Utils.getSourceSite()) && (void 0 !== window.mpConfig ? window.mpConfig.partner = "orange-games" : window.mpConfig = {
                partner: "orange-games"
            },
            addScript("https://ext.minijuegosgratis.com/external-host/main.js", Date.now() / 1e3)),
            siteLockList && siteLockList.hasOwnProperty("kongregate") && -1 !== siteLockList.kongregate.indexOf(Utils.getSourceSite()) && addScript("https://cdn1.kongregate.com/javascripts/kongregate_api.js", Date.now() / 1e3, function() {
                "undefined" != typeof kongregateAPI && kongregateAPI.loadAPI(function() {
                    window.kongregate = kongregateAPI.getAPI()
                })
            }),
            siteLockList && siteLockList.hasOwnProperty("newgrounds") && -1 !== siteLockList.newgrounds.indexOf(Utils.getSourceSite()) && addScript("https://cdn.fbrq.io/@azerion/splash/assets/scripts/newgroundsio.min.js", Date.now() / 1e3)
        }
        ,
        PortalScripts
    }();
    var BuildSettings = function() {
        function BuildSettings() {}
        return BuildSettings.isStandAlone = function() {
            var _a, _a;
            return null != (_a = window._azerionIntegration) && _a.sa ? null == (_a = window._azerionIntegration) ? void 0 : _a.sa : !!window.hasOwnProperty("fbrqSA") && window.fbrqSA
        }
        ,
        BuildSettings.hasDomainForCustomBuild = function() {
            var _a;
            return (null == (_a = window._azerionIntegration) ? void 0 : _a.bd) || window.hasOwnProperty("fbrqBD")
        }
        ,
        BuildSettings.getDomainForCustomBuild = function() {
            var _a, _a, _a;
            return null != (_a = window._azerionIntegration) && _a.bd && (null == (_a = window._azerionIntegration) ? void 0 : _a.bd)in exports.BrandingDomain ? null == (_a = window._azerionIntegration) ? void 0 : _a.bd : window.hasOwnProperty("fbrqBD") && window.fbrqBD in exports.BrandingDomain ? window.fbrqBD : void 0
        }
        ,
        BuildSettings.hasLinksSettingsForCustomBuild = function() {
            var _a;
            return (null == (_a = window._azerionIntegration) ? void 0 : _a.la) || window.hasOwnProperty("fbrqLA")
        }
        ,
        BuildSettings.getLinkSettingsForCustomBuild = function() {
            var _a, _a;
            return null != (_a = window._azerionIntegration) && _a.la ? null == (_a = window._azerionIntegration) ? void 0 : _a.la : window.hasOwnProperty("fbrqLA") ? window.hasOwnProperty("fbrqLA") : void 0
        }
        ,
        BuildSettings
    }();
    var Branding = function() {
        function Branding() {}
        return Branding.preload = function(version) {
          return false;
            var promise = Promise.all([Loader.instance.load(Domain.KEY, "".concat(Utils.ASSET_LOCATION, "json/domains.json?v=").concat(version), "text/plain"), Loader.instance.load(Branding.SITELOCK_PORTALS, "".concat(Utils.ASSET_LOCATION, "json/sitelock.json?v=").concat(version), "text/plain")]);
            return Promise.all([Loader.instance.load(Branding.INTERNAL_PORTALS_KEY, "".concat(Utils.ASSET_LOCATION, "json/internal.json?v=").concat(version), "text/plain"), Loader.instance.load(Branding.CONTRACTED_PORTALS_KEY, "".concat(Utils.ASSET_LOCATION, "json/contracted.json?v=").concat(version), "text/plain"), Loader.instance.load(Branding.SPECIAL_PORTALS_KEY, "".concat(Utils.ASSET_LOCATION, "json/special.json?v=").concat(version), "text/plain")]),
            promise.then(function(data) {              
                var domains = data[0];
                var data = data[1];
                Domain.setList(domains),
                PortalScripts.loadPortalScript(data),
                Branding.setSiteLock(data)
            }).catch(function() {
                console.warn("Unable to parse json")
            })
        }
        ,
        Branding.setSiteLock = function(data) {
            Branding.siteLocks = data
        }
        ,
        Object.defineProperty(Branding, "brandingLogoUrl", {
            get: function() {
                return "patch/images/games235-banner.png";
                var imageName;
                switch (Utils.isOnDevice() || Hosts.isAirfi() ? Utils.ASSET_LOCATION = "assets/" : "fbrq.io" === Utils.getSourceSite(!0) && (Utils.ASSET_LOCATION = "https://" + window.location.host + "/@azerion/splash/assets/"),
                Utils.getBrandingDomain()) {
                case exports.BrandingDomain.Spele:
                    imageName = "spele";
                    break;
                case exports.BrandingDomain.PlayCell:
                    imageName = "playcell";
                    break;
                case exports.BrandingDomain.GameCell:
                    imageName = "gamecell";
                    break;
                case exports.BrandingDomain.Yepi:
                    imageName = "yepi";
                    break;
                case exports.BrandingDomain.Admeen:
                    imageName = "admeen";
                    break;
                case exports.BrandingDomain.Bild:
                    imageName = "bild";
                    break;
                case exports.BrandingDomain.Kizi:
                    imageName = "kizi";
                    break;
                case exports.BrandingDomain.Funnygames:
                    imageName = "funnygames";
                    break;
                case exports.BrandingDomain.PlayTime:
                    imageName = "playtime";
                    break;
                default:
                case exports.BrandingDomain.AGame:
                    imageName = "agame";
                    break;
                case exports.BrandingDomain.Zigiz:
                    imageName = "zigiz";
                    break
                }
                return Utils.ASSET_LOCATION + "images/branding_logo_" + imageName + "_small.png"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(Branding, "brandingBackgroundColor", {
            get: function() {
                var bgColor;
                switch (Utils.getBrandingDomain()) {
                case exports.BrandingDomain.Spele:
                    bgColor = "#4a72ad";
                    break;
                case exports.BrandingDomain.PlayCell:
                    bgColor = "#52a1e1";
                    break;
                case exports.BrandingDomain.GameCell:
                    bgColor = "#c600b2";
                    break;
                case exports.BrandingDomain.Yepi:
                    bgColor = "#0573a7";
                    break;
                case exports.BrandingDomain.AGame:
                    bgColor = "#0C486C";
                    break;
                case exports.BrandingDomain.Admeen:
                    bgColor = "#4267B2";
                    break;
                case exports.BrandingDomain.Bild:
                    bgColor = "#de0000";
                    break;
                default:
                case exports.BrandingDomain.Kizi:
                    bgColor = "#012f50";
                    break;
                case exports.BrandingDomain.Funnygames:
                    bgColor = "#33b0ff";
                    break;
                case exports.BrandingDomain.PlayTime:
                    bgColor = "#023a63";
                    break;
                case exports.BrandingDomain.Zigiz:
                    bgColor = "#023a63";
                    break
                }
                return bgColor
            },
            enumerable: !1,
            configurable: !0
        }),
        Branding.blockedDomain = function() {
            return Utils.isOnDevice() || Branding.isSpecial()
        }
        ,
        Branding.createCampaignURL = function(gameTitle, type) {
            var host = Utils.getSourceSite();
            var domain = Utils.getBrandingDomain();
            var protocol = CrossPromo.getProtocol(Utils.isOnDevice());
            var protocol = CrossPromo.getDomainURL(domain, protocol);
            var type = CrossPromo.getUtmContent(type);
            return CrossPromo.getPromoURL(domain, protocol, host, gameTitle, type)
        }
        ,
        Branding.openCampaignLink = function(gameTitle, type) {
            var type;
            var gameTitle = Branding.createCampaignURL(gameTitle, type);
            Branding.blockedDomain() || (type = window.open(gameTitle)) && type.focus && type.focus()
        }
        ,
        Branding.isInternal = function() {
            return Branding.hostMatchesList(Loader.instance.get(Branding.INTERNAL_PORTALS_KEY))
        }
        ,
        Branding.isContracted = function() {
            return Branding.hostMatchesList(Loader.instance.get(Branding.CONTRACTED_PORTALS_KEY))
        }
        ,
        Branding.isSpecial = function() {
            return Branding.hostMatchesList(Loader.instance.get(Branding.SPECIAL_PORTALS_KEY))
        }
        ,
        Branding.isAdmeen = function() {
            var admeen;
            return !(!Branding.siteLocks || !Branding.siteLocks.hasOwnProperty("admeen")) && (admeen = Branding.siteLocks.admeen,
            Branding.hostMatchesList(admeen))
        }
        ,
        Branding.isKongregate = function() {
            var kongregate;
            return !(!Branding.siteLocks || !Branding.siteLocks.hasOwnProperty("kongregate")) && (kongregate = Branding.siteLocks.kongregate,
            Branding.hostMatchesList(kongregate))
        }
        ,
        Branding.isNewgrounds = function() {
            var newgrounds;
            return !(!Branding.siteLocks || !Branding.siteLocks.hasOwnProperty("newgrounds")) && (newgrounds = Branding.siteLocks.newgrounds,
            Branding.hostMatchesList(newgrounds))
        }
        ,
        Branding.crossPromoAllowed = function() {
            var yandex = Branding.siteLocks.yandex;
            return Branding.hostMatchesList(yandex)
        }
        ,
        Branding.outGoingLinksAllowed = function() {
            return !(Hosts.isAirfi() || Branding.isSpecial() || Branding.isContracted()) && (!BuildSettings.hasLinksSettingsForCustomBuild() || BuildSettings.getLinkSettingsForCustomBuild())
        }
        ,
        Branding.hostMatchesList = function(portals) {
            portals = portals || [];
            var host = Utils.getSourceSite();
            for (var id = 0; id < portals.length; id++)
                if (host === portals[id])
                    return !0;
            return !1
        }
        ,
        Branding.LOGO_KEY = "branding_logo",
        Branding.INTERNAL_PORTALS_KEY = "branding_portals",
        Branding.CONTRACTED_PORTALS_KEY = "branding_contracted",
        Branding.SPECIAL_PORTALS_KEY = "branding_special",
        Branding.SITELOCK_PORTALS = "sitelock_portals",
        Branding.DOMAIN_OVERWRITE = null,
        Branding.analyticsEnabled = !0,
        Branding
    }();
    var Utils = function() {
        function Utils() {}
        return Utils.loadHost = function() {
            return __awaiter(this, void 0, void 0, function() {
                var host, result, result;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                    case 0:
                        if (host = document.referrer || window.location.host,
                        !window.hasOwnProperty("gdsdk"))
                            return [3, 4];
                        _a.label = 1;
                    case 1:
                        return _a.trys.push([1, 3, , 4]),
                        [4, window.gdsdk.getSession()];
                    case 2:
                        return result = _a.sent(),
                        host = result.location.parentDomain,
                        [3, 4];
                    case 3:
                        return result = _a.sent(),
                        console.log(result),
                        [3, 4];
                    case 4:
                        return Utils.HOST = host,
                        [2]
                    }
                })
            })
        }
        ,
        Utils.getSourceSite = function(forceLocal) {
            var host = Utils.HOST;
            if (-1 !== (host = (forceLocal = void 0 === forceLocal ? !1 : forceLocal) ? window.location.host : host).indexOf("embed.gamedistribution.com") && -1 !== window.location.search.indexOf("gd_sdk_referrer_url") && (host = Utils.getUrlParameter("gd_sdk_referrer_url") || host),
            host = decodeURIComponent(host),
            Hosts.isBild())
                return "bildspielt.de";
            if (Hosts.isBip())
                return "bipgaming.com";
            host = (host = -1 < host.indexOf("://") ? host.split("/")[2] : host.split("/")[0]).split(":")[0];
            var forceLocal = Domain.getDomain(host);
            return null !== forceLocal ? forceLocal : host = 3 === host.split(".").length ? host.substr(host.indexOf(".") + 1) : host
        }
        ,
        Utils.getBrandingDomain = function() {            
            if (BuildSettings.hasDomainForCustomBuild())
                return BuildSettings.getDomainForCustomBuild();
            if (Branding.DOMAIN_OVERWRITE)
                return Branding.DOMAIN_OVERWRITE;
            var source = Utils.getSourceSite();
            if (Branding.isAdmeen())
                return exports.BrandingDomain.Admeen;
            if (Hosts.isPlaycellApp() || Hosts.isBip())
                return exports.BrandingDomain.PlayCell;
            switch (source) {
            case "spele.nl":
                return exports.BrandingDomain.Spele;
            case "yepi.com":
                return exports.BrandingDomain.Yepi;
            case "oyunskor.com":
            case "barbioyunu.com.tr":
            case "bebekoyunu.com.tr":
            case "oyunkolu.com":
            case "oyungemisi.com":
            case "oyunlar1.com":
            case "oyunkuzusu.com":
            case "kraloyun.com":
            case "rekoroyun.com":
            case "oyundedem.com":
            case "oyunoyna.com":
            case "pastaoyunu.com.tr":
            case "playcell.com":
                return exports.BrandingDomain.PlayCell;
            case "gamecell.com":
                return exports.BrandingDomain.GameCell;
            case "playxl.com":
                return exports.BrandingDomain.Admeen;
            case "kizi.com":
                return exports.BrandingDomain.Kizi;
            case "bildspielt.de":
                return exports.BrandingDomain.Bild;
            case "funnygames.nl":
                return exports.BrandingDomain.Funnygames;
            case "playtime.nl":
                return exports.BrandingDomain.PlayTime;
            default:
            case "agame.com":                
                return exports.BrandingDomain.AGame;
            case "gmbl.nl":
            case "zigiz.com":
                return exports.BrandingDomain.Zigiz;
            case "coolmathgames.com":
                return exports.BrandingDomain.Neutral
            }
        }
        ,
        Utils.getReferrer = function(host) {
            return -1 !== host.indexOf("?ref=") ? host.substr(host.indexOf("?ref=") + 5) : host
        }
        ,
        Utils.inIframe = function() {
            try {
                return window.self !== window.top
            } catch (e) {
                return !0
            }
        }
        ,
        Utils.inGDGameZone = function() {
            return -1 !== document.referrer.indexOf("html5.gamedistribution.com")
        }
        ,
        Utils.getDomain = function(uri) {
            var parser = document.createElement("a");
            return parser.href = uri,
            parser.origin
        }
        ,
        Utils.isOnDevice = function() {
            return void 0 !== window.cordova && !/(gamedistribution\.com)/.test(window.location.hostname)
        }
        ,
        Utils.isTc = function() {
            return /(teamcity\.azerdev\.com)/.test(window.location.host)
        }
        ,
        Utils.getRandomRange = function(min, max) {
            return Math.random() * (max - min) + min | 0
        }
        ,
        Utils.getUrlParameter = function(name) {
            var regex;
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var name = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(location.search);
            return null === name ? "" : decodeURIComponent(name[1].replace(/\+/g, " "))
        }
        ,
        Utils.intTimeToString = function(time) {
            var hours = Math.floor(time / 3600);
            var minutes = Math.floor(time % 3600 / 60);
            var time = time % 60;
            var sHours;
            var sMinutes;
            var sSeconds;
            return (hours < 10 ? "0" + hours : hours.toString()) + ":" + (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" + (time < 10 ? "0" + time : time.toString())
        }
        ,
        Utils.LANGUAGE = "en",
        Utils.HOST = document.referrer || window.location.host,
        Utils.ASSET_LOCATION = BuildSettings.isStandAlone() ? "assets/" : "https://cdn.fbrq.io/@azerion/splash/assets/",
        Utils
    }();
    var progressbar = createCommonjsModule(function(module, exports) {
        var f;
        f = function() {
            return function e(t, n, r) {
                function s(o, u) {
                    if (!n[o]) {
                        if (!t[o]) {
                            var a;
                            if (!u && commonjsRequire)
                                return commonjsRequire(o, !0);
                            if (i)
                                return i(o, !0);
                            var u = new Error("Cannot find module '" + o + "'");
                            throw u.code = "MODULE_NOT_FOUND",
                            u
                        }
                        var u = n[o] = {
                            exports: {}
                        };
                        t[o][0].call(u.exports, function(e) {
                            var n = t[o][1][e];
                            return s(n || e)
                        }, u, u.exports, e, t, n, r)
                    }
                    return n[o].exports
                }
                var i = commonjsRequire;
                for (var o = 0; o < r.length; o++)
                    s(r[o]);
                return s
            }({
                1: [function(require, module, exports) {
                    !function() {
                        var root = this || Function("return this")();
                        var Tweenable = function() {
                            var formula;
                            var DEFAULT_SCHEDULE_FUNCTION;
                            var DEFAULT_EASING = "linear";
                            var DEFAULT_DURATION = 500;
                            var UPDATE_TIME = 1e3 / 60;
                            var _now = Date.now || function() {
                                return +new Date
                            }
                            ;
                            var now = "undefined" != typeof SHIFTY_DEBUG_NOW ? SHIFTY_DEBUG_NOW : _now;
                            function noop() {}
                            function each(obj, fn) {
                                var key;
                                for (key in obj)
                                    Object.hasOwnProperty.call(obj, key) && fn(key)
                            }
                            function shallowCopy(targetObj, srcObj) {
                                return each(srcObj, function(prop) {
                                    targetObj[prop] = srcObj[prop]
                                }),
                                targetObj
                            }
                            function defaults(target, src) {
                                each(src, function(prop) {
                                    void 0 === target[prop] && (target[prop] = src[prop])
                                })
                            }
                            function tweenProps(forPosition, currentState, originalState, targetState, duration, timestamp, easing) {
                                var normalizedPosition = forPosition < timestamp ? 0 : (forPosition - timestamp) / duration;
                                var prop;
                                var easingObjectProp;
                                var easingObjectProp;
                                for (prop in currentState)
                                    currentState.hasOwnProperty(prop) && (easingObjectProp = "function" == typeof (easingObjectProp = easing[prop]) ? easingObjectProp : formula[easingObjectProp],
                                    currentState[prop] = tweenProp(originalState[prop], targetState[prop], easingObjectProp, normalizedPosition));
                                return currentState
                            }
                            function tweenProp(start, end, easingFunc, position) {
                                return start + (end - start) * easingFunc(position)
                            }
                            function applyFilter(tweenable, filterName) {
                                var filters = Tweenable.prototype.filter;
                                var args = tweenable._filterArgs;
                                each(filters, function(name) {
                                    void 0 !== filters[name][filterName] && filters[name][filterName].apply(tweenable, args)
                                })
                            }
                            var timeoutHandler_endTime;
                            var timeoutHandler_currentTime;
                            var timeoutHandler_isEnded;
                            var timeoutHandler_endTime;
                            function timeoutHandler(tweenable, timestamp, delay, duration, currentState, originalState, targetState, easing, step, schedule, opt_currentTimeOverride) {
                                timeoutHandler_endTime = timestamp + delay + duration,
                                timeoutHandler_currentTime = Math.min(opt_currentTimeOverride || now(), timeoutHandler_endTime),
                                timeoutHandler_isEnded = timeoutHandler_endTime <= timeoutHandler_currentTime,
                                timeoutHandler_endTime = duration - (timeoutHandler_endTime - timeoutHandler_currentTime),
                                tweenable.isPlaying() && (timeoutHandler_isEnded ? (step(targetState, tweenable._attachment, timeoutHandler_endTime),
                                tweenable.stop(!0)) : (tweenable._scheduleId = schedule(tweenable._timeoutHandler, 1e3 / 60),
                                applyFilter(tweenable, "beforeTween"),
                                timeoutHandler_currentTime < timestamp + delay ? tweenProps(1, currentState, originalState, targetState, 1, 1, easing) : tweenProps(timeoutHandler_currentTime, currentState, originalState, targetState, duration, timestamp + delay, easing),
                                applyFilter(tweenable, "afterTween"),
                                step(currentState, tweenable._attachment, timeoutHandler_endTime)))
                            }
                            function composeEasingObject(fromTweenParams, easing) {
                                var composedEasing = {};
                                var typeofEasing = typeof easing;
                                return each(fromTweenParams, "string" == typeofEasing || "function" == typeofEasing ? function(prop) {
                                    composedEasing[prop] = easing
                                }
                                : function(prop) {
                                    composedEasing[prop] || (composedEasing[prop] = easing[prop] || "linear")
                                }
                                ),
                                composedEasing
                            }
                            function Tweenable(opt_initialState, opt_config) {
                                this._currentState = opt_initialState || {},
                                this._configured = !1,
                                this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION,
                                void 0 !== opt_config && this.setConfig(opt_config)
                            }
                            return DEFAULT_SCHEDULE_FUNCTION = "undefined" != typeof window && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.mozCancelRequestAnimationFrame && window.mozRequestAnimationFrame) || setTimeout,
                            Tweenable.prototype.tween = function(opt_config) {
                                return this._isTweening ? this : (void 0 === opt_config && this._configured || this.setConfig(opt_config),
                                this._timestamp = now(),
                                this._start(this.get(), this._attachment),
                                this.resume())
                            }
                            ,
                            Tweenable.prototype.setConfig = function(config) {
                                config = config || {},
                                this._configured = !0,
                                this._attachment = config.attachment,
                                this._pausedAtTime = null,
                                this._scheduleId = null,
                                this._delay = config.delay || 0,
                                this._start = config.start || noop,
                                this._step = config.step || noop,
                                this._finish = config.finish || noop,
                                this._duration = config.duration || 500,
                                this._currentState = shallowCopy({}, config.from || this.get()),
                                this._originalState = this.get(),
                                this._targetState = shallowCopy({}, config.to || this.get());
                                var self = this;
                                this._timeoutHandler = function() {
                                    timeoutHandler(self, self._timestamp, self._delay, self._duration, self._currentState, self._originalState, self._targetState, self._easing, self._step, self._scheduleFunction)
                                }
                                ;
                                var currentState = this._currentState;
                                var targetState = this._targetState;
                                return defaults(targetState, currentState),
                                this._easing = composeEasingObject(currentState, config.easing || "linear"),
                                this._filterArgs = [currentState, this._originalState, targetState, this._easing],
                                applyFilter(this, "tweenCreated"),
                                this
                            }
                            ,
                            Tweenable.prototype.get = function() {
                                return shallowCopy({}, this._currentState)
                            }
                            ,
                            Tweenable.prototype.set = function(state) {
                                this._currentState = state
                            }
                            ,
                            Tweenable.prototype.pause = function() {
                                return this._pausedAtTime = now(),
                                this._isPaused = !0,
                                this
                            }
                            ,
                            Tweenable.prototype.resume = function() {
                                return this._isPaused && (this._timestamp += now() - this._pausedAtTime),
                                this._isPaused = !1,
                                this._isTweening = !0,
                                this._timeoutHandler(),
                                this
                            }
                            ,
                            Tweenable.prototype.seek = function(millisecond) {
                                millisecond = Math.max(millisecond, 0);
                                var currentTime = now();
                                return this._timestamp + millisecond === 0 || (this._timestamp = currentTime - millisecond,
                                this.isPlaying()) || (this._isTweening = !0,
                                this._isPaused = !1,
                                timeoutHandler(this, this._timestamp, this._delay, this._duration, this._currentState, this._originalState, this._targetState, this._easing, this._step, this._scheduleFunction, currentTime),
                                this.pause()),
                                this
                            }
                            ,
                            Tweenable.prototype.stop = function(gotoEnd) {
                                return this._isTweening = !1,
                                this._isPaused = !1,
                                this._timeoutHandler = noop,
                                (root.cancelAnimationFrame || root.webkitCancelAnimationFrame || root.oCancelAnimationFrame || root.msCancelAnimationFrame || root.mozCancelRequestAnimationFrame || root.clearTimeout)(this._scheduleId),
                                gotoEnd && (applyFilter(this, "beforeTween"),
                                tweenProps(1, this._currentState, this._originalState, this._targetState, 1, 0, this._easing),
                                applyFilter(this, "afterTween"),
                                applyFilter(this, "afterTweenEnd"),
                                this._finish.call(this, this._currentState, this._attachment)),
                                this
                            }
                            ,
                            Tweenable.prototype.isPlaying = function() {
                                return this._isTweening && !this._isPaused
                            }
                            ,
                            Tweenable.prototype.setScheduleFunction = function(scheduleFunction) {
                                this._scheduleFunction = scheduleFunction
                            }
                            ,
                            Tweenable.prototype.dispose = function() {
                                var prop;
                                for (prop in this)
                                    this.hasOwnProperty(prop) && delete this[prop]
                            }
                            ,
                            Tweenable.prototype.filter = {},
                            formula = Tweenable.prototype.formula = {
                                linear: function(pos) {
                                    return pos
                                }
                            },
                            shallowCopy(Tweenable, {
                                now: now,
                                each: each,
                                tweenProps: tweenProps,
                                tweenProp: tweenProp,
                                applyFilter: applyFilter,
                                shallowCopy: shallowCopy,
                                defaults: defaults,
                                composeEasingObject: composeEasingObject
                            }),
                            "function" == typeof SHIFTY_DEBUG_NOW && (root.timeoutHandler = timeoutHandler),
                            "object" == typeof exports ? module.exports = Tweenable : void 0 === root.Tweenable && (root.Tweenable = Tweenable),
                            Tweenable
                        }();
                        function cubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
                            var ax = 0
                              , bx = 0
                              , cx = 0
                              , ay = 0
                              , by = 0
                              , cy = 0;
                            function sampleCurveX(t) {
                                return ((ax * t + bx) * t + cx) * t
                            }
                            function sampleCurveY(t) {
                                return ((ay * t + by) * t + cy) * t
                            }
                            function sampleCurveDerivativeX(t) {
                                return (3 * ax * t + 2 * bx) * t + cx
                            }
                            function solveEpsilon(duration) {
                                return 1 / (200 * duration)
                            }
                            function solve(x, epsilon) {
                                return sampleCurveY(solveCurveX(x, epsilon))
                            }
                            function fabs(n) {
                                return 0 <= n ? n : 0 - n
                            }
                            function solveCurveX(x, epsilon) {
                                var t0, t1, t2, x2, d2, i;
                                for (t2 = x,
                                i = 0; i < 8; i++) {
                                    if (fabs(x2 = sampleCurveX(t2) - x) < epsilon)
                                        return t2;
                                    if (fabs(d2 = sampleCurveDerivativeX(t2)) < 1e-6)
                                        break;
                                    t2 -= x2 / d2
                                }
                                if ((t2 = x) < (t0 = 0))
                                    return t0;
                                if ((t1 = 1) < t2)
                                    return t1;
                                for (; t0 < t1; ) {
                                    if (fabs((x2 = sampleCurveX(t2)) - x) < epsilon)
                                        return t2;
                                    x2 < x ? t0 = t2 : t1 = t2,
                                    t2 = .5 * (t1 - t0) + t0
                                }
                                return t2
                            }
                            return ax = 1 - (cx = 3 * p1x) - (bx = 3 * (p2x - p1x) - cx),
                            ay = 1 - (cy = 3 * p1y) - (by = 3 * (p2y - p1y) - cy),
                            solve(t, 1 / (200 * duration))
                        }
                        function getCubicBezierTransition(x1, y1, x2, y2) {
                            return function(pos) {
                                return cubicBezierAtTime(pos, x1, y1, x2, y2, 1)
                            }
                        }
                        function getInterpolatedValues(from, current, targetState, position, easing, delay) {
                            return Tweenable.tweenProps(position, current, from, targetState, 1, delay, easing)
                        }
                        var mockTweenable;
                        Tweenable.shallowCopy(Tweenable.prototype.formula, {
                            easeInQuad: function(pos) {
                                return Math.pow(pos, 2)
                            },
                            easeOutQuad: function(pos) {
                                return -(Math.pow(pos - 1, 2) - 1)
                            },
                            easeInOutQuad: function(pos) {
                                return (pos /= .5) < 1 ? .5 * Math.pow(pos, 2) : -.5 * ((pos -= 2) * pos - 2)
                            },
                            easeInCubic: function(pos) {
                                return Math.pow(pos, 3)
                            },
                            easeOutCubic: function(pos) {
                                return Math.pow(pos - 1, 3) + 1
                            },
                            easeInOutCubic: function(pos) {
                                return (pos /= .5) < 1 ? .5 * Math.pow(pos, 3) : .5 * (Math.pow(pos - 2, 3) + 2)
                            },
                            easeInQuart: function(pos) {
                                return Math.pow(pos, 4)
                            },
                            easeOutQuart: function(pos) {
                                return -(Math.pow(pos - 1, 4) - 1)
                            },
                            easeInOutQuart: function(pos) {
                                return (pos /= .5) < 1 ? .5 * Math.pow(pos, 4) : -.5 * ((pos -= 2) * Math.pow(pos, 3) - 2)
                            },
                            easeInQuint: function(pos) {
                                return Math.pow(pos, 5)
                            },
                            easeOutQuint: function(pos) {
                                return Math.pow(pos - 1, 5) + 1
                            },
                            easeInOutQuint: function(pos) {
                                return (pos /= .5) < 1 ? .5 * Math.pow(pos, 5) : .5 * (Math.pow(pos - 2, 5) + 2)
                            },
                            easeInSine: function(pos) {
                                return 1 - Math.cos(pos * (Math.PI / 2))
                            },
                            easeOutSine: function(pos) {
                                return Math.sin(pos * (Math.PI / 2))
                            },
                            easeInOutSine: function(pos) {
                                return -.5 * (Math.cos(Math.PI * pos) - 1)
                            },
                            easeInExpo: function(pos) {
                                return 0 === pos ? 0 : Math.pow(2, 10 * (pos - 1))
                            },
                            easeOutExpo: function(pos) {
                                return 1 === pos ? 1 : 1 - Math.pow(2, -10 * pos)
                            },
                            easeInOutExpo: function(pos) {
                                return 0 === pos ? 0 : 1 === pos ? 1 : (pos /= .5) < 1 ? .5 * Math.pow(2, 10 * (pos - 1)) : .5 * (2 - Math.pow(2, -10 * --pos))
                            },
                            easeInCirc: function(pos) {
                                return -(Math.sqrt(1 - pos * pos) - 1)
                            },
                            easeOutCirc: function(pos) {
                                return Math.sqrt(1 - Math.pow(pos - 1, 2))
                            },
                            easeInOutCirc: function(pos) {
                                return (pos /= .5) < 1 ? -.5 * (Math.sqrt(1 - pos * pos) - 1) : .5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1)
                            },
                            easeOutBounce: function(pos) {
                                return pos < 1 / 2.75 ? 7.5625 * pos * pos : pos < 2 / 2.75 ? 7.5625 * (pos -= 1.5 / 2.75) * pos + .75 : pos < 2.5 / 2.75 ? 7.5625 * (pos -= 2.25 / 2.75) * pos + .9375 : 7.5625 * (pos -= 2.625 / 2.75) * pos + .984375
                            },
                            easeInBack: function(pos) {
                                var s = 1.70158;
                                return pos * pos * ((1 + s) * pos - s)
                            },
                            easeOutBack: function(pos) {
                                var s = 1.70158;
                                return (pos -= 1) * pos * ((1 + s) * pos + s) + 1
                            },
                            easeInOutBack: function(pos) {
                                var s = 1.70158;
                                return (pos /= .5) < 1 ? pos * pos * ((1 + (s *= 1.525)) * pos - s) * .5 : .5 * ((pos -= 2) * pos * ((1 + (s *= 1.525)) * pos + s) + 2)
                            },
                            elastic: function(pos) {
                                return -1 * Math.pow(4, -8 * pos) * Math.sin((6 * pos - 1) * (2 * Math.PI) / 2) + 1
                            },
                            swingFromTo: function(pos) {
                                var s = 1.70158;
                                return (pos /= .5) < 1 ? pos * pos * ((1 + (s *= 1.525)) * pos - s) * .5 : .5 * ((pos -= 2) * pos * ((1 + (s *= 1.525)) * pos + s) + 2)
                            },
                            swingFrom: function(pos) {
                                var s = 1.70158;
                                return pos * pos * ((1 + s) * pos - s)
                            },
                            swingTo: function(pos) {
                                var s = 1.70158;
                                return --pos * pos * ((1 + s) * pos + s) + 1
                            },
                            bounce: function(pos) {
                                return pos < 1 / 2.75 ? 7.5625 * pos * pos : pos < 2 / 2.75 ? 7.5625 * (pos -= 1.5 / 2.75) * pos + .75 : pos < 2.5 / 2.75 ? 7.5625 * (pos -= 2.25 / 2.75) * pos + .9375 : 7.5625 * (pos -= 2.625 / 2.75) * pos + .984375
                            },
                            bouncePast: function(pos) {
                                return pos < 1 / 2.75 ? 7.5625 * pos * pos : pos < 2 / 2.75 ? 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + .75) : pos < 2.5 / 2.75 ? 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + .9375) : 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + .984375)
                            },
                            easeFromTo: function(pos) {
                                return (pos /= .5) < 1 ? .5 * Math.pow(pos, 4) : -.5 * ((pos -= 2) * Math.pow(pos, 3) - 2)
                            },
                            easeFrom: function(pos) {
                                return Math.pow(pos, 4)
                            },
                            easeTo: function(pos) {
                                return Math.pow(pos, .25)
                            }
                        }),
                        Tweenable.setBezierFunction = function(name, x1, y1, x2, y2) {
                            var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
                            return cubicBezierTransition.displayName = name,
                            cubicBezierTransition.x1 = x1,
                            cubicBezierTransition.y1 = y1,
                            cubicBezierTransition.x2 = x2,
                            cubicBezierTransition.y2 = y2,
                            Tweenable.prototype.formula[name] = cubicBezierTransition
                        }
                        ,
                        Tweenable.unsetBezierFunction = function(name) {
                            delete Tweenable.prototype.formula[name]
                        }
                        ,
                        (mockTweenable = new Tweenable)._filterArgs = [],
                        Tweenable.interpolate = function(from, targetState, position, easing, opt_delay) {
                            var current = Tweenable.shallowCopy({}, from);
                            var opt_delay = opt_delay || 0;
                            var easing = Tweenable.composeEasingObject(from, easing || "linear");
                            mockTweenable.set({});
                            var filterArgs = mockTweenable._filterArgs;
                            filterArgs.length = 0,
                            filterArgs[0] = current,
                            filterArgs[1] = from,
                            filterArgs[2] = targetState,
                            filterArgs[3] = easing,
                            Tweenable.applyFilter(mockTweenable, "tweenCreated"),
                            Tweenable.applyFilter(mockTweenable, "beforeTween");
                            var filterArgs = getInterpolatedValues(from, current, targetState, position, easing, opt_delay);
                            return Tweenable.applyFilter(mockTweenable, "afterTween"),
                            filterArgs
                        }
                        ,
                        function(Tweenable) {
                            var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
                            var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
                            var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
                            var R_RGB = new RegExp("rgb\\(" + R_UNFORMATTED_VALUES.source + /,\s*/.source + R_UNFORMATTED_VALUES.source + /,\s*/.source + R_UNFORMATTED_VALUES.source + "\\)","g");
                            var R_RGB_PREFIX = /^.*\(/;
                            var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
                            var VALUE_PLACEHOLDER = "VAL";
                            function getFormatChunksFrom(rawValues, prefix) {
                                var accumulator = [];
                                var rawValuesLength = rawValues.length;
                                var i;
                                for (i = 0; i < rawValuesLength; i++)
                                    accumulator.push("_" + prefix + "_" + i);
                                return accumulator
                            }
                            function getFormatStringFrom(formattedString) {
                                var chunks = formattedString.match(R_FORMAT_CHUNKS);
                                return chunks ? 1 !== chunks.length && !formattedString.charAt(0).match(R_NUMBER_COMPONENT) || chunks.unshift("") : chunks = ["", ""],
                                chunks.join(VALUE_PLACEHOLDER)
                            }
                            function sanitizeObjectForHexProps(stateObject) {
                                Tweenable.each(stateObject, function(prop) {
                                    var currentProp = stateObject[prop];
                                    "string" == typeof currentProp && currentProp.match(R_HEX) && (stateObject[prop] = sanitizeHexChunksToRGB(currentProp))
                                })
                            }
                            function sanitizeHexChunksToRGB(str) {
                                return filterStringChunks(R_HEX, str, convertHexToRGB)
                            }
                            function convertHexToRGB(hexString) {
                                var hexString = hexToRGBArray(hexString);
                                return "rgb(" + hexString[0] + "," + hexString[1] + "," + hexString[2] + ")"
                            }
                            var hexToRGBArray_returnArray = [];
                            function hexToRGBArray(hex) {
                                return 3 === (hex = hex.replace(/#/, "")).length && (hex = (hex = hex.split(""))[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]),
                                hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2)),
                                hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2)),
                                hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2)),
                                hexToRGBArray_returnArray
                            }
                            function hexToDec(hex) {
                                return parseInt(hex, 16)
                            }
                            function filterStringChunks(pattern, unfilteredString, filter) {
                                var pattenMatches = unfilteredString.match(pattern);
                                var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);
                                if (pattenMatches) {
                                    var pattenMatchesLength = pattenMatches.length;
                                    var currentChunk;
                                    for (var i = 0; i < pattenMatchesLength; i++)
                                        currentChunk = pattenMatches.shift(),
                                        filteredString = filteredString.replace(VALUE_PLACEHOLDER, filter(currentChunk))
                                }
                                return filteredString
                            }
                            function sanitizeRGBChunks(formattedString) {
                                return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk)
                            }
                            function sanitizeRGBChunk(rgbChunk) {
                                var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
                                var numbersLength = numbers.length;
                                var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];
                                for (var i = 0; i < numbersLength; i++)
                                    sanitizedString += parseInt(numbers[i], 10) + ",";
                                return sanitizedString = sanitizedString.slice(0, -1) + ")"
                            }
                            function getFormatManifests(stateObject) {
                                var manifestAccumulator = {};
                                return Tweenable.each(stateObject, function(prop) {
                                    var currentProp = stateObject[prop];
                                    var rawValues;
                                    "string" == typeof currentProp && (rawValues = getValuesFrom(currentProp),
                                    manifestAccumulator[prop] = {
                                        formatString: getFormatStringFrom(currentProp),
                                        chunkNames: getFormatChunksFrom(rawValues, prop)
                                    })
                                }),
                                manifestAccumulator
                            }
                            function expandFormattedProperties(stateObject, formatManifests) {
                                Tweenable.each(formatManifests, function(prop) {
                                    var currentProp;
                                    var rawValues = getValuesFrom(stateObject[prop]);
                                    var rawValuesLength = rawValues.length;
                                    for (var i = 0; i < rawValuesLength; i++)
                                        stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
                                    delete stateObject[prop]
                                })
                            }
                            function collapseFormattedProperties(stateObject, formatManifests) {
                                Tweenable.each(formatManifests, function(prop) {
                                    var currentProp = stateObject[prop];
                                    var formatChunks;
                                    var valuesList = getValuesList(extractPropertyChunks(stateObject, formatManifests[prop].chunkNames), formatManifests[prop].chunkNames);
                                    currentProp = getFormattedValues(formatManifests[prop].formatString, valuesList),
                                    stateObject[prop] = sanitizeRGBChunks(currentProp)
                                })
                            }
                            function extractPropertyChunks(stateObject, chunkNames) {
                                var extractedValues = {};
                                var currentChunkName, chunkNamesLength = chunkNames.length;
                                for (var i = 0; i < chunkNamesLength; i++)
                                    extractedValues[currentChunkName = chunkNames[i]] = stateObject[currentChunkName],
                                    delete stateObject[currentChunkName];
                                return extractedValues
                            }
                            var getValuesList_accumulator = [];
                            function getValuesList(stateObject, chunkNames) {
                                getValuesList_accumulator.length = 0;
                                var chunkNamesLength = chunkNames.length;
                                for (var i = 0; i < chunkNamesLength; i++)
                                    getValuesList_accumulator.push(stateObject[chunkNames[i]]);
                                return getValuesList_accumulator
                            }
                            function getFormattedValues(formatString, rawValues) {
                                var formattedValueString = formatString;
                                var rawValuesLength = rawValues.length;
                                for (var i = 0; i < rawValuesLength; i++)
                                    formattedValueString = formattedValueString.replace(VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
                                return formattedValueString
                            }
                            function getValuesFrom(formattedString) {
                                return formattedString.match(R_UNFORMATTED_VALUES)
                            }
                            function expandEasingObject(easingObject, tokenData) {
                                Tweenable.each(tokenData, function(prop) {
                                    var currentProp;
                                    var chunkNames = tokenData[prop].chunkNames;
                                    var chunkLength = chunkNames.length;
                                    var easing = easingObject[prop];
                                    var i;
                                    if ("string" == typeof easing) {
                                        var easingChunks = easing.split(" ");
                                        var lastEasingChunk = easingChunks[easingChunks.length - 1];
                                        for (i = 0; i < chunkLength; i++)
                                            easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk
                                    } else
                                        for (i = 0; i < chunkLength; i++)
                                            easingObject[chunkNames[i]] = easing;
                                    delete easingObject[prop]
                                })
                            }
                            function collapseEasingObject(easingObject, tokenData) {
                                Tweenable.each(tokenData, function(prop) {
                                    var currentProp;
                                    var chunkNames = tokenData[prop].chunkNames;
                                    var chunkLength = chunkNames.length;
                                    var firstEasing = easingObject[chunkNames[0]];
                                    var typeofEasings;
                                    if ("string" == typeof firstEasing) {
                                        var composedEasingString = "";
                                        for (var i = 0; i < chunkLength; i++)
                                            composedEasingString += " " + easingObject[chunkNames[i]],
                                            delete easingObject[chunkNames[i]];
                                        easingObject[prop] = composedEasingString.substr(1)
                                    } else
                                        easingObject[prop] = firstEasing
                                })
                            }
                            Tweenable.prototype.filter.token = {
                                tweenCreated: function(currentState, fromState, toState, easingObject) {
                                    sanitizeObjectForHexProps(currentState),
                                    sanitizeObjectForHexProps(fromState),
                                    sanitizeObjectForHexProps(toState),
                                    this._tokenData = getFormatManifests(currentState)
                                },
                                beforeTween: function(currentState, fromState, toState, easingObject) {
                                    expandEasingObject(easingObject, this._tokenData),
                                    expandFormattedProperties(currentState, this._tokenData),
                                    expandFormattedProperties(fromState, this._tokenData),
                                    expandFormattedProperties(toState, this._tokenData)
                                },
                                afterTween: function(currentState, fromState, toState, easingObject) {
                                    collapseFormattedProperties(currentState, this._tokenData),
                                    collapseFormattedProperties(fromState, this._tokenData),
                                    collapseFormattedProperties(toState, this._tokenData),
                                    collapseEasingObject(easingObject, this._tokenData)
                                }
                            }
                        }(Tweenable)
                    }
                    .call(null)
                }
                , {}],
                2: [function(require, module, exports) {
                    var Shape = require("./shape");
                    var utils = require("./utils");
                    var require = function Circle(container, options) {
                        this._pathTemplate = "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}",
                        this.containerAspectRatio = 1,
                        Shape.apply(this, arguments)
                    };
                    ((require.prototype = new Shape).constructor = require).prototype._pathString = function _pathString(opts) {
                        var widthOfWider = opts.strokeWidth;
                        var opts = 50 - (widthOfWider = opts.trailWidth && opts.trailWidth > opts.strokeWidth ? opts.trailWidth : widthOfWider) / 2;
                        return utils.render(this._pathTemplate, {
                            radius: opts,
                            "2radius": 2 * opts
                        })
                    }
                    ,
                    require.prototype._trailString = function _trailString(opts) {
                        return this._pathString(opts)
                    }
                    ,
                    module.exports = require
                }
                , {
                    "./shape": 7,
                    "./utils": 9
                }],
                3: [function(require, module, exports) {
                    var Shape = require("./shape");
                    var utils = require("./utils");
                    var require = function Line(container, options) {
                        this._pathTemplate = "M 0,{center} L 100,{center}",
                        Shape.apply(this, arguments)
                    };
                    ((require.prototype = new Shape).constructor = require).prototype._initializeSvg = function _initializeSvg(svg, opts) {
                        svg.setAttribute("viewBox", "0 0 100 " + opts.strokeWidth),
                        svg.setAttribute("preserveAspectRatio", "none")
                    }
                    ,
                    require.prototype._pathString = function _pathString(opts) {
                        return utils.render(this._pathTemplate, {
                            center: opts.strokeWidth / 2
                        })
                    }
                    ,
                    require.prototype._trailString = function _trailString(opts) {
                        return this._pathString(opts)
                    }
                    ,
                    module.exports = require
                }
                , {
                    "./shape": 7,
                    "./utils": 9
                }],
                4: [function(require, module, exports) {
                    module.exports = {
                        Line: require("./line"),
                        Circle: require("./circle"),
                        SemiCircle: require("./semicircle"),
                        Square: require("./square"),
                        Path: require("./path"),
                        Shape: require("./shape"),
                        utils: require("./utils")
                    }
                }
                , {
                    "./circle": 2,
                    "./line": 3,
                    "./path": 5,
                    "./semicircle": 6,
                    "./shape": 7,
                    "./square": 8,
                    "./utils": 9
                }],
                5: [function(require, module, exports) {
                    var Tweenable = require("shifty");
                    var utils = require("./utils");
                    var EASING_ALIASES = {
                        easeIn: "easeInCubic",
                        easeOut: "easeOutCubic",
                        easeInOut: "easeInOutCubic"
                    };
                    var require = function Path(path, opts) {
                        if (!(this instanceof Path))
                            throw new Error("Constructor was called without new keyword");
                        var path;
                        opts = utils.extend({
                            duration: 800,
                            easing: "linear",
                            from: {},
                            to: {},
                            step: function() {}
                        }, opts),
                        path = utils.isString(path) ? document.querySelector(path) : path,
                        this.path = path,
                        this._opts = opts,
                        this._tweenable = null;
                        var path = this.path.getTotalLength();
                        this.path.style.strokeDasharray = path + " " + path,
                        this.set(0)
                    };
                    require.prototype.value = function value() {
                        var offset = this._getComputedDashOffset();
                        var length = this.path.getTotalLength();
                        var progress;
                        return parseFloat((1 - offset / length).toFixed(6), 10)
                    }
                    ,
                    require.prototype.set = function set(progress) {
                        this.stop(),
                        this.path.style.strokeDashoffset = this._progressToOffset(progress);
                        var step = this._opts.step;
                        var easing, values, reference;
                        utils.isFunction(step) && (easing = this._easing(this._opts.easing),
                        step(this._calculateTo(progress, easing), this._opts.shape || this, this._opts.attachment))
                    }
                    ,
                    require.prototype.stop = function stop() {
                        this._stopTween(),
                        this.path.style.strokeDashoffset = this._getComputedDashOffset()
                    }
                    ,
                    require.prototype.animate = function animate(progress, opts, cb) {
                        opts = opts || {},
                        utils.isFunction(opts) && (cb = opts,
                        opts = {});
                        var passedOpts = utils.extend({}, opts);
                        var defaultOpts = utils.extend({}, this._opts);
                        opts = utils.extend(defaultOpts, opts);
                        var defaultOpts = this._easing(opts.easing);
                        var passedOpts = this._resolveFromAndTo(progress, defaultOpts, passedOpts);
                        this.stop(),
                        this.path.getBoundingClientRect();
                        var offset = this._getComputedDashOffset();
                        var progress = this._progressToOffset(progress);
                        var self = this;
                        this._tweenable = new Tweenable,
                        this._tweenable.tween({
                            from: utils.extend({
                                offset: offset
                            }, passedOpts.from),
                            to: utils.extend({
                                offset: progress
                            }, passedOpts.to),
                            duration: opts.duration,
                            easing: defaultOpts,
                            step: function(state) {
                                self.path.style.strokeDashoffset = state.offset;
                                var reference = opts.shape || self;
                                opts.step(state, reference, opts.attachment)
                            },
                            finish: function(state) {
                                utils.isFunction(cb) && cb()
                            }
                        })
                    }
                    ,
                    require.prototype._getComputedDashOffset = function _getComputedDashOffset() {
                        var computedStyle = window.getComputedStyle(this.path, null);
                        return parseFloat(computedStyle.getPropertyValue("stroke-dashoffset"), 10)
                    }
                    ,
                    require.prototype._progressToOffset = function _progressToOffset(progress) {
                        var length = this.path.getTotalLength();
                        return length - progress * length
                    }
                    ,
                    require.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
                        return opts.from && opts.to ? {
                            from: opts.from,
                            to: opts.to
                        } : {
                            from: this._calculateFrom(easing),
                            to: this._calculateTo(progress, easing)
                        }
                    }
                    ,
                    require.prototype._calculateFrom = function _calculateFrom(easing) {
                        return Tweenable.interpolate(this._opts.from, this._opts.to, this.value(), easing)
                    }
                    ,
                    require.prototype._calculateTo = function _calculateTo(progress, easing) {
                        return Tweenable.interpolate(this._opts.from, this._opts.to, progress, easing)
                    }
                    ,
                    require.prototype._stopTween = function _stopTween() {
                        null !== this._tweenable && (this._tweenable.stop(),
                        this._tweenable = null)
                    }
                    ,
                    require.prototype._easing = function _easing(easing) {
                        return EASING_ALIASES.hasOwnProperty(easing) ? EASING_ALIASES[easing] : easing
                    }
                    ,
                    module.exports = require
                }
                , {
                    "./utils": 9,
                    shifty: 1
                }],
                6: [function(require, module, exports) {
                    var Shape = require("./shape");
                    var Circle = require("./circle");
                    var utils = require("./utils");
                    var require = function SemiCircle(container, options) {
                        this._pathTemplate = "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0",
                        this.containerAspectRatio = 2,
                        Shape.apply(this, arguments)
                    };
                    ((require.prototype = new Shape).constructor = require).prototype._initializeSvg = function _initializeSvg(svg, opts) {
                        svg.setAttribute("viewBox", "0 0 100 50")
                    }
                    ,
                    require.prototype._initializeTextContainer = function _initializeTextContainer(opts, container, textContainer) {
                        opts.text.style && (textContainer.style.top = "auto",
                        textContainer.style.bottom = "0",
                        opts.text.alignToBottom ? utils.setStyle(textContainer, "transform", "translate(-50%, 0)") : utils.setStyle(textContainer, "transform", "translate(-50%, 50%)"))
                    }
                    ,
                    require.prototype._pathString = Circle.prototype._pathString,
                    require.prototype._trailString = Circle.prototype._trailString,
                    module.exports = require
                }
                , {
                    "./circle": 2,
                    "./shape": 7,
                    "./utils": 9
                }],
                7: [function(require, module, exports) {
                    var Path = require("./path");
                    var utils = require("./utils");
                    var DESTROYED_ERROR = "Object is destroyed";
                    var require = function Shape(container, opts) {
                        if (!(this instanceof Shape))
                            throw new Error("Constructor was called without new keyword");
                        if (0 !== arguments.length) {
                            this._opts = utils.extend({
                                color: "#555",
                                strokeWidth: 1,
                                trailColor: null,
                                trailWidth: null,
                                fill: null,
                                text: {
                                    style: {
                                        color: null,
                                        position: "absolute",
                                        left: "50%",
                                        top: "50%",
                                        padding: 0,
                                        margin: 0,
                                        transform: {
                                            prefix: !0,
                                            value: "translate(-50%, -50%)"
                                        }
                                    },
                                    autoStyleContainer: !0,
                                    alignToBottom: !0,
                                    value: null,
                                    className: "progressbar-text"
                                },
                                svgStyle: {
                                    display: "block",
                                    width: "100%"
                                },
                                warnings: !1
                            }, opts, !0),
                            utils.isObject(opts) && void 0 !== opts.svgStyle && (this._opts.svgStyle = opts.svgStyle),
                            utils.isObject(opts) && utils.isObject(opts.text) && void 0 !== opts.text.style && (this._opts.text.style = opts.text.style);
                            var opts = this._createSvgView(this._opts);
                            var element;
                            if (!(element = utils.isString(container) ? document.querySelector(container) : container))
                                throw new Error("Container does not exist: " + container);
                            this._container = element,
                            this._container.appendChild(opts.svg),
                            this._opts.warnings && this._warnContainerAspectRatio(this._container),
                            this._opts.svgStyle && utils.setStyles(opts.svg, this._opts.svgStyle),
                            this.svg = opts.svg,
                            this.path = opts.path,
                            this.trail = opts.trail,
                            this.text = null;
                            var container = utils.extend({
                                attachment: void 0,
                                shape: this
                            }, this._opts);
                            this._progressPath = new Path(opts.path,container),
                            utils.isObject(this._opts.text) && null !== this._opts.text.value && this.setText(this._opts.text.value)
                        }
                    };
                    require.prototype.animate = function animate(progress, opts, cb) {
                        if (null === this._progressPath)
                            throw new Error(DESTROYED_ERROR);
                        this._progressPath.animate(progress, opts, cb)
                    }
                    ,
                    require.prototype.stop = function stop() {
                        if (null === this._progressPath)
                            throw new Error(DESTROYED_ERROR);
                        void 0 !== this._progressPath && this._progressPath.stop()
                    }
                    ,
                    require.prototype.destroy = function destroy() {
                        if (null === this._progressPath)
                            throw new Error(DESTROYED_ERROR);
                        this.stop(),
                        this.svg.parentNode.removeChild(this.svg),
                        this.svg = null,
                        this.path = null,
                        this.trail = null,
                        (this._progressPath = null) !== this.text && (this.text.parentNode.removeChild(this.text),
                        this.text = null)
                    }
                    ,
                    require.prototype.set = function set(progress) {
                        if (null === this._progressPath)
                            throw new Error(DESTROYED_ERROR);
                        this._progressPath.set(progress)
                    }
                    ,
                    require.prototype.value = function value() {
                        if (null === this._progressPath)
                            throw new Error(DESTROYED_ERROR);
                        return void 0 === this._progressPath ? 0 : this._progressPath.value()
                    }
                    ,
                    require.prototype.setText = function setText(newText) {
                        if (null === this._progressPath)
                            throw new Error(DESTROYED_ERROR);
                        null === this.text && (this.text = this._createTextContainer(this._opts, this._container),
                        this._container.appendChild(this.text)),
                        utils.isObject(newText) ? (utils.removeChildren(this.text),
                        this.text.appendChild(newText)) : this.text.innerHTML = newText
                    }
                    ,
                    require.prototype._createSvgView = function _createSvgView(opts) {
                        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        this._initializeSvg(svg, opts);
                        var trailPath = null;
                        (opts.trailColor || opts.trailWidth) && (trailPath = this._createTrail(opts),
                        svg.appendChild(trailPath));
                        var opts = this._createPath(opts);
                        return svg.appendChild(opts),
                        {
                            svg: svg,
                            path: opts,
                            trail: trailPath
                        }
                    }
                    ,
                    require.prototype._initializeSvg = function _initializeSvg(svg, opts) {
                        svg.setAttribute("viewBox", "0 0 100 100")
                    }
                    ,
                    require.prototype._createPath = function _createPath(opts) {
                        var pathString = this._pathString(opts);
                        return this._createPathElement(pathString, opts)
                    }
                    ,
                    require.prototype._createTrail = function _createTrail(opts) {
                        var pathString = this._trailString(opts);
                        var opts = utils.extend({}, opts);
                        return opts.trailColor || (opts.trailColor = "#eee"),
                        opts.trailWidth || (opts.trailWidth = opts.strokeWidth),
                        opts.color = opts.trailColor,
                        opts.strokeWidth = opts.trailWidth,
                        opts.fill = null,
                        this._createPathElement(pathString, opts)
                    }
                    ,
                    require.prototype._createPathElement = function _createPathElement(pathString, opts) {
                        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        return path.setAttribute("d", pathString),
                        path.setAttribute("stroke", opts.color),
                        path.setAttribute("stroke-width", opts.strokeWidth),
                        opts.fill ? path.setAttribute("fill", opts.fill) : path.setAttribute("fill-opacity", "0"),
                        path
                    }
                    ,
                    require.prototype._createTextContainer = function _createTextContainer(opts, container) {
                        var textContainer = document.createElement("div");
                        textContainer.className = opts.text.className;
                        var textStyle = opts.text.style;
                        return textStyle && (opts.text.autoStyleContainer && (container.style.position = "relative"),
                        utils.setStyles(textContainer, textStyle),
                        textStyle.color || (textContainer.style.color = opts.color)),
                        this._initializeTextContainer(opts, container, textContainer),
                        textContainer
                    }
                    ,
                    require.prototype._initializeTextContainer = function(opts, container, element) {}
                    ,
                    require.prototype._pathString = function _pathString(opts) {
                        throw new Error("Override this function for each progress bar")
                    }
                    ,
                    require.prototype._trailString = function _trailString(opts) {
                        throw new Error("Override this function for each progress bar")
                    }
                    ,
                    require.prototype._warnContainerAspectRatio = function _warnContainerAspectRatio(container) {
                        var computedStyle, width, height;
                        this.containerAspectRatio && (computedStyle = window.getComputedStyle(container, null),
                        width = parseFloat(computedStyle.getPropertyValue("width"), 10),
                        height = parseFloat(computedStyle.getPropertyValue("height"), 10),
                        utils.floatEquals(this.containerAspectRatio, width / height) || (console.warn("Incorrect aspect ratio of container", "#" + container.id, "detected:", computedStyle.getPropertyValue("width") + "(width)", "/", computedStyle.getPropertyValue("height") + "(height)", "=", width / height),
                        console.warn("Aspect ratio of should be", this.containerAspectRatio)))
                    }
                    ,
                    module.exports = require
                }
                , {
                    "./path": 5,
                    "./utils": 9
                }],
                8: [function(require, module, exports) {
                    var Shape = require("./shape");
                    var utils = require("./utils");
                    var require = function Square(container, options) {
                        this._pathTemplate = "M 0,{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{strokeWidth}",
                        this._trailTemplate = "M {startMargin},{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{halfOfStrokeWidth}",
                        Shape.apply(this, arguments)
                    };
                    ((require.prototype = new Shape).constructor = require).prototype._pathString = function _pathString(opts) {
                        var w = 100 - opts.strokeWidth / 2;
                        return utils.render(this._pathTemplate, {
                            width: w,
                            strokeWidth: opts.strokeWidth,
                            halfOfStrokeWidth: opts.strokeWidth / 2
                        })
                    }
                    ,
                    require.prototype._trailString = function _trailString(opts) {
                        var w = 100 - opts.strokeWidth / 2;
                        return utils.render(this._trailTemplate, {
                            width: w,
                            strokeWidth: opts.strokeWidth,
                            halfOfStrokeWidth: opts.strokeWidth / 2,
                            startMargin: opts.strokeWidth / 2 - opts.trailWidth / 2
                        })
                    }
                    ,
                    module.exports = require
                }
                , {
                    "./shape": 7,
                    "./utils": 9
                }],
                9: [function(require, module, exports) {
                    var PREFIXES = "Webkit Moz O ms".split(" ");
                    var FLOAT_COMPARISON_EPSILON = .001;
                    function extend(destination, source, recursive) {
                        for (var attrName in destination = destination || {},
                        recursive = recursive || !1,
                        source = source || {}) {
                            var destVal, sourceVal;
                            source.hasOwnProperty(attrName) && (destVal = destination[attrName],
                            sourceVal = source[attrName],
                            recursive && isObject(destVal) && isObject(sourceVal) ? destination[attrName] = extend(destVal, sourceVal, recursive) : destination[attrName] = sourceVal)
                        }
                        return destination
                    }
                    function render(template, vars) {
                        var rendered = template;
                        for (var key in vars) {
                            var val, regExpString, key;
                            vars.hasOwnProperty(key) && (val = vars[key],
                            key = new RegExp("\\{" + key + "\\}","g"),
                            rendered = rendered.replace(key, val))
                        }
                        return rendered
                    }
                    function setStyle(element, style, value) {
                        var elStyle = element.style;
                        for (var i = 0; i < PREFIXES.length; ++i) {
                            var prefix;
                            elStyle[PREFIXES[i] + capitalize(style)] = value
                        }
                        elStyle[style] = value
                    }
                    function setStyles(element, styles) {
                        forEachObject(styles, function(styleValue, styleName) {
                            null != styleValue && (isObject(styleValue) && !0 === styleValue.prefix ? setStyle(element, styleName, styleValue.value) : element.style[styleName] = styleValue)
                        })
                    }
                    function capitalize(text) {
                        return text.charAt(0).toUpperCase() + text.slice(1)
                    }
                    function isString(obj) {
                        return "string" == typeof obj || obj instanceof String
                    }
                    function isFunction(obj) {
                        return "function" == typeof obj
                    }
                    function isArray(obj) {
                        return "[object Array]" === Object.prototype.toString.call(obj)
                    }
                    function isObject(obj) {
                        var type;
                        return !isArray(obj) && "object" == typeof obj && !!obj
                    }
                    function forEachObject(object, callback) {
                        for (var key in object) {
                            var val;
                            object.hasOwnProperty(key) && callback(object[key], key)
                        }
                    }
                    function floatEquals(a, b) {
                        return Math.abs(a - b) < .001
                    }
                    function removeChildren(el) {
                        for (; el.firstChild; )
                            el.removeChild(el.firstChild)
                    }
                    module.exports = {
                        extend: extend,
                        render: render,
                        setStyle: setStyle,
                        setStyles: setStyles,
                        capitalize: capitalize,
                        isString: isString,
                        isFunction: isFunction,
                        isObject: isObject,
                        forEachObject: forEachObject,
                        floatEquals: floatEquals,
                        removeChildren: removeChildren
                    }
                }
                , {}]
            }, {}, [4])(4)
        }
        ,
        module.exports = f()
    });
    function getCss() {
        return "\n        #h5branding-center {\n            position: absolute;\n            top: 45%;\n            left: 50%;\n            transform: translate(-50%, -20%);\n            text-align: center;\n            width: 100%;\n        }\n        #h5branding-wrapper {\n            position: relative;\n            z-index: 665;\n            width: 150px;\n            height: 150px;\n            display:inline-block;\n            margin: 35px 40px 96px 40px;\n        }\n\n        #h5branding-version {\n            position: absolute;\n            right: 10px;\n            font-family: Helvetica, Arial, sans-serif;\n            color: #ffffff;\n            font-size: 0.8em;\n            top: 10px;\n            display: none;\n        }\n\n        #h5branding-wrapper > #h5branding-bar, #h5branding-wrapper > img {\n            box-shadow: inset 10px 10px 20px 5px rgba(0, 0, 0, 0.5);\n            border-radius: 50%;\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n        }\n\n        #h5branding-ad {\n            position: relative;\n            z-index: 667;\n            border-radius: 5px;\n            border: 3px solid white;\n            background: rgba(256, 256, 256, 0.2);\n            width: 336px;\n            height: 280px;\n            display: none;\n            margin: 0px 10px 0px 10px;\n        }\n\n        #h5branding-wrapper > img {\n            /* Needs appropriate vendor prefixes */\n            box-sizing: border-box;\n\n            /* This needs to be equal to strokeWidth */\n            padding: 4%;\n        }\n\n        #h5branding-wrapper > img {\n            border-radius: 50%;\n            box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.5), 5px 5px 7px rgba(0, 0, 0, 0.3);\n        }\n\n        #h5branding-container {\n            box-sizing: border-box;\n            position: absolute;\n            z-index: 664;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background-color: #000;\n            overflow: hidden;\n        }\n\n        #h5branding-background {\n            position: absolute;\n            top: -25%;\n            left: -25%;\n            width: 150%;\n            height: 150%;\n            background-blend-mode: multiply;\n            background-size: cover;\n            filter: blur(40px) brightness(1.5);\n        }\n\n        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n             /* IE10+ CSS styles go here */\n             #h5branding-background {\n                background-image: none !important;\n             }\n        }\n\n        #h5branding-logo {\n            position: absolute;\n            margin: 0 auto;\n            left: 0;\n            right: 0;\n            text-align: center;\n            top: 10%;\n        }\n\n        #h5branding-logo > img {\n            height: 150px;\n        }\n\n        #h5branding-title {\n            position: absolute;\n            width: 100%;\n            background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.5) 50%, transparent);\n            color: #fff;\n            text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);\n            bottom:10%;\n            padding: 15px 0;\n            text-align: center;\n            font-size: 18px;\n            font-family: Helvetica, Arial, sans-serif;\n            font-weight: bold;\n            line-height: 100%;\n        }\n\n        #h5branding-button {\n            /* border: 0; */\n            padding: 10px 22px;\n            border-radius: 5px;\n            border: 3px solid white;\n            background: linear-gradient(0deg, #dddddd, #ffffff);\n            color: #222;\n            text-transform: uppercase;\n            text-shadow: 0 0 1px #fff;\n            font-family: Helvetica, Arial, sans-serif;\n            font-weight: bold;\n            font-size: 18px;\n            cursor: pointer;\n            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n            display: none;\n            width: 150px;\n            position: absolute;\n            top: 170px;\n            margin: 0 auto;\n            left: 0;\n            right: 0;\n        }\n\n        @media (orientation: portrait) and (max-width: 1080px) {\n            #h5branding-logo > img {\n                height: initial;\n                width:100%;\n            }\n        }\n\n        @media (orientation: landscape) and (max-height: 640px) {\n            #h5branding-title {\n                display: none;\n            }\n\n            #h5branding-logo > img {\n                height: 100px;\n            }\n        }\n\n        @media (orientation: landscape) and (max-height: 460px) {\n            #h5branding-title {\n                display: none;\n            }\n\n            #h5branding-wrapper {\n                width: 110px;\n                height: 110px;\n                margin: 0;\n            }\n\n            #h5branding-logo {\n                top: 0;\n                transform: scale(0.7, 0.7);\n            }\n\n            #h5branding-button {\n                top: initial;\n                width: 110px;\n                font-size: 14px;\n                position: absolute;\n                top: 140px;\n                left: 0;\n                right: 0;\n            }\n\n            #h5branding-ad {\n               display: none !important;\n            }\n        }\n\n        @media (orientation: portrait) and (max-width: 250px) {\n            #h5branding-logo {\n                top: 2%;\n            }\n        }\n\n        @media (orientation: landscape) and (max-width: 330px) {\n             #h5branding-button {\n                top: 120px;\n            }\n\n            #h5branding-logo > img {\n                height: 70px;\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 850px) {\n            #h5branding-ad {\n               display: none !important;\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 1100px) {\n            #h5branding-center {\n                top: 40%;\n            }\n\n            #h5branding-title {\n               bottom: 5%\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 900px) {\n            #h5branding-title {\n               display: none\n            }\n        }\n\n        @media (orientation: landscape) and (min-width: 800px) {\n            #h5branding-wrapper {\n                margin-left: 120px;\n                margin-right: 120px;\n            }\n        }\n\n        "
    }
    function getHtml(gameLogo, gameTitle) {
        return '\n        <div id="h5branding-background"></div>\n        <div id="h5branding-version"></div>\n        <div id="h5branding-logo"></div>\n        <div id="h5branding-center">\n            <div id="h5branding-ad"></div>\n            <div id="h5branding-wrapper">\n                <img src="'.concat(gameLogo, '" />\n                <div id="h5branding-bar"></div>\n                <button id="h5branding-button" onclick="h5branding.SplashLoader.getInstance().onPlayButtonClick();">Play</button>\n            </div>\n        </div>\n        <div id="h5branding-title">').concat(gameTitle, "</div>\n    ")
    }
    var BrandingDomain = function() {
        function SplashLoader(options) {
            this.circleLoader = null,
            this.loaded = !1,
            this.showPlayButton = "undefined" == typeof playBtn || playBtn,
            // this.showPlayButton = 0,
            this.progress = 0,
            this.options = {
                gameId: "12346",
                gameTitle: "Place Holder",
                gameName: "place-holder",
                libs: [],
                version: "dev",
                barColor: "white",
                gaMeasurementId: "none"
            },
            this.options.gameId = options.gameId,
            this.options.gameTitle = options.gameTitle,
            this.options.version = options.version,
            this.options.barColor = options.barColor || this.options.barColor,
            this.options.libs = options.libs,
            this.options.gaMeasurementId = options.gaMeasurementId
        }
        return SplashLoader.getInstance = function(options) {
            if (!SplashLoader.instance) {
                if (!options)
                    throw new Error("Can not create new SplashLoader instance without options!");
                SplashLoader.instance = new SplashLoader(options)
            }
            return SplashLoader.instance
        }
        ,
        SplashLoader.prototype.create = function() {
            return __awaiter(this, void 0, void 0, function() {
                var css, html, head, style, css, head, style;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                    case 0:
                        return css = getCss(),
                        html = getHtml(this.getGameLogoUrl(), this.options.gameTitle),
                        head = document.head || document.getElementsByTagName("head")[0],
                        (style = document.createElement("style")).type = "text/css",
                        style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css)),
                        head.appendChild(style),
                        (css = document.createElement("div")).innerHTML = html,
                        css.id = "h5branding-container",
                        (head = document.body || document.getElementsByTagName("body")[0]).insertBefore(css, head.firstChild),
                        this.circleLoader = new progressbar.Circle("#h5branding-bar",{
                            strokeWidth: 3,
                            color: this.options.barColor
                        }),
                        (style = document.getElementById("h5branding-version")) && (style.innerHTML = this.options.version),
                        [4, this.loadLibs()];
                    case 1:
                        return _a.sent(),
                        [4, Utils.loadHost()];
                    case 2:
                        return _a.sent(),
                        [4, this.loadBranding()];
                    case 3:
                        return _a.sent(),
                        this.loaded = !0,
                        [2]
                    }
                })
            })
        }
        ,
        SplashLoader.prototype.loadBranding = function() {
            return __awaiter(this, void 0, void 0, function() {
                var background, background, logo;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                    case 0:
                        return [4, Branding.preload(Date.now().toString())];
                    case 1:
                        return _a.sent(),
                        (background = document.getElementById("h5branding-background")) && (background.style.backgroundColor = Branding.brandingBackgroundColor),
                        (background = document.getElementById("h5branding-logo")) && Utils.getBrandingDomain() !== exports.BrandingDomain.Neutral && ((logo = document.createElement("img")).src = Branding.brandingLogoUrl.replace("_small", ""),
                        background.appendChild(logo)),
                        [2]
                    }
                })
            })
        }
        ,
        SplashLoader.prototype.loadLibs = function() {
            var _this = this;
            var scripts = this.options.libs.map(function(url, index) {
                return Loader.instance.loadScript(url, !0, function() {
                    _this.setScriptloadProgress(scripts.length, index + 1)
                })
            });
            return Promise.all(scripts)
        }
        ,
        Object.defineProperty(SplashLoader.prototype, "bannerAllowed", {
            get: function() {
                var width = document.body.clientWidth;
                var height = document.body.clientHeight;
                return this.progress < 100 && !(height < width && height <= 460) && !(width < 600 && height < 850)
            },
            enumerable: !1,
            configurable: !0
        }),
        SplashLoader.prototype.showBanner = function() {
            var banner;
            return this.bannerAllowed && (banner = document.getElementById("h5branding-ad")) ? (banner.style.display = "inline-flex",
            banner) : null
        }
        ,
        SplashLoader.prototype.setScriptloadProgress = function(maxScripts, increment) {
            var progress;
            this.circleLoader.animate(.3 * increment / maxScripts, null, function() {})
        }
        ,
        SplashLoader.prototype.setLoadProgress = function(progress) {
            var _this = this;
            var button_1;
            this.loaded && (100 === (this.progress = progress = 30 + .7 * progress) ? (button_1 = document.querySelector("#h5branding-button"),
            this.circleLoader.animate(1, null, function() {
              h5branding.SplashLoader.getInstance().onPlayButtonClick();
                !Utils.inGDGameZone() && button_1 && !0 === _this.showPlayButton ? button_1.style.display = "block" : !Utils.inGDGameZone() && !1 !== _this.showPlayButton || _this.onPlayButtonClick()
            })) : this.circleLoader.animate(progress / 100, null, function() {}))
        }
        ,
        SplashLoader.prototype.setButtonCallback = function(cb) {
            this.buttonCallback = cb
        }
        ,
        SplashLoader.prototype.onPlayButtonClick = function() {
            this.buttonCallback && this.buttonCallback()
        }
        ,
        SplashLoader.prototype.destroy = function() {
            var element = document.querySelector("#h5branding-container");
            null !== element && null !== element.parentNode && element.parentNode.removeChild(element)
        }
        ,
        SplashLoader.prototype.getGameLogoUrl = function() {
            return "assets/icon.jpeg"
        }
        ,
        SplashLoader
    }();
    exports.Branding = Branding,
    exports.Domain = Domain,
    exports.Hosts = Hosts,
    exports.SplashLoader = BrandingDomain,
    exports.Utils = Utils,
    Object.defineProperty(exports, "__esModule", {
        value: !0
    })
}),
(()=>{
    var __webpack_modules__ = {
        34: module=>{
            "use strict";
            var has = Object.prototype.hasOwnProperty
              , prefix = "~";
            function Events() {}
            function EE(fn, context, once) {
                this.fn = fn,
                this.context = context,
                this.once = once || !1
            }
            function addListener(emitter, event, fn, context, once) {
                if ("function" != typeof fn)
                    throw new TypeError("The listener must be a function");
                var fn = new EE(fn,context || emitter,once)
                  , context = prefix ? prefix + event : event;
                return emitter._events[context] ? emitter._events[context].fn ? emitter._events[context] = [emitter._events[context], fn] : emitter._events[context].push(fn) : (emitter._events[context] = fn,
                emitter._eventsCount++),
                emitter
            }
            function clearEvent(emitter, evt) {
                0 == --emitter._eventsCount ? emitter._events = new Events : delete emitter._events[evt]
            }
            function EventEmitter() {
                this._events = new Events,
                this._eventsCount = 0
            }
            Object.create && (Events.prototype = Object.create(null),
            (new Events).__proto__ || (prefix = !1)),
            EventEmitter.prototype.eventNames = function eventNames() {
                var names = [], events, name;
                if (0 === this._eventsCount)
                    return names;
                for (name in events = this._events)
                    has.call(events, name) && names.push(prefix ? name.slice(1) : name);
                return Object.getOwnPropertySymbols ? names.concat(Object.getOwnPropertySymbols(events)) : names
            }
            ,
            EventEmitter.prototype.listeners = function listeners(event) {
                var event = prefix ? prefix + event : event
                  , handlers = this._events[event];
                if (!handlers)
                    return [];
                if (handlers.fn)
                    return [handlers.fn];
                for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)
                    ee[i] = handlers[i].fn;
                return ee
            }
            ,
            EventEmitter.prototype.listenerCount = function listenerCount(event) {
                var event = prefix ? prefix + event : event
                  , event = this._events[event];
                return event ? event.fn ? 1 : event.length : 0
            }
            ,
            EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
                var evt = prefix ? prefix + event : event;
                if (!this._events[evt])
                    return !1;
                var listeners = this._events[evt], len = arguments.length, args, i;
                if (listeners.fn) {
                    switch (listeners.once && this.removeListener(event, listeners.fn, void 0, !0),
                    len) {
                    case 1:
                        return listeners.fn.call(listeners.context),
                        !0;
                    case 2:
                        return listeners.fn.call(listeners.context, a1),
                        !0;
                    case 3:
                        return listeners.fn.call(listeners.context, a1, a2),
                        !0;
                    case 4:
                        return listeners.fn.call(listeners.context, a1, a2, a3),
                        !0;
                    case 5:
                        return listeners.fn.call(listeners.context, a1, a2, a3, a4),
                        !0;
                    case 6:
                        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5),
                        !0
                    }
                    for (i = 1,
                    args = new Array(len - 1); i < len; i++)
                        args[i - 1] = arguments[i];
                    listeners.fn.apply(listeners.context, args)
                } else {
                    var length = listeners.length, j;
                    for (i = 0; i < length; i++)
                        switch (listeners[i].once && this.removeListener(event, listeners[i].fn, void 0, !0),
                        len) {
                        case 1:
                            listeners[i].fn.call(listeners[i].context);
                            break;
                        case 2:
                            listeners[i].fn.call(listeners[i].context, a1);
                            break;
                        case 3:
                            listeners[i].fn.call(listeners[i].context, a1, a2);
                            break;
                        case 4:
                            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                            break;
                        default:
                            if (!args)
                                for (j = 1,
                                args = new Array(len - 1); j < len; j++)
                                    args[j - 1] = arguments[j];
                            listeners[i].fn.apply(listeners[i].context, args)
                        }
                }
                return !0
            }
            ,
            EventEmitter.prototype.on = function on(event, fn, context) {
                return addListener(this, event, fn, context, !1)
            }
            ,
            EventEmitter.prototype.once = function once(event, fn, context) {
                return addListener(this, event, fn, context, !0)
            }
            ,
            EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
                var event = prefix ? prefix + event : event;
                if (this._events[event])
                    if (fn) {
                        var listeners = this._events[event];
                        if (listeners.fn)
                            listeners.fn !== fn || once && !listeners.once || context && listeners.context !== context || clearEvent(this, event);
                        else {
                            for (var i = 0, events = [], length = listeners.length; i < length; i++)
                                (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) && events.push(listeners[i]);
                            events.length ? this._events[event] = 1 === events.length ? events[0] : events : clearEvent(this, event)
                        }
                    } else
                        clearEvent(this, event);
                return this
            }
            ,
            EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
                var event;
                return event ? (event = prefix ? prefix + event : event,
                this._events[event] && clearEvent(this, event)) : (this._events = new Events,
                this._eventsCount = 0),
                this
            }
            ,
            EventEmitter.prototype.off = EventEmitter.prototype.removeListener,
            EventEmitter.prototype.addListener = EventEmitter.prototype.on,
            EventEmitter.prefixed = prefix,
            module.exports = EventEmitter.EventEmitter = EventEmitter
        }
        ,
        729: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(548), __webpack_require__(498)],
            void 0 !== (exports = function(require, exports, AdWrapper_1, types_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.AdType = exports.AdEvents = exports.ProviderTypes = exports.GameDistributionBannerSize = exports.GameDistributionAlignment = exports.AdWrapper = void 0,
                Object.defineProperty(exports, "AdWrapper", {
                    enumerable: !0,
                    get: function() {
                        return AdWrapper_1.AdWrapper
                    }
                }),
                Object.defineProperty(exports, "GameDistributionAlignment", {
                    enumerable: !0,
                    get: function() {
                        return types_1.GameDistributionAlignment
                    }
                }),
                Object.defineProperty(exports, "GameDistributionBannerSize", {
                    enumerable: !0,
                    get: function() {
                        return types_1.GameDistributionBannerSize
                    }
                }),
                Object.defineProperty(exports, "ProviderTypes", {
                    enumerable: !0,
                    get: function() {
                        return types_1.ProviderTypes
                    }
                }),
                Object.defineProperty(exports, "AdEvents", {
                    enumerable: !0,
                    get: function() {
                        return types_1.AdEvents
                    }
                }),
                Object.defineProperty(exports, "AdType", {
                    enumerable: !0,
                    get: function() {
                        return types_1.AdType
                    }
                })
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        470: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(12)],
            void 0 !== (exports = function(require, exports, shared_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.JioAdProvider = void 0;
                var JioAdProvider = function() {
                    function JioAdProvider(config) {
                        this.adsEnabled = !1;
                        var adSpotInterstitial = config.adSpotInterstitial
                          , adSpotRewardedVideo = config.adSpotRewardedVideo
                          , config = config.gamePackage;
                        try {
                            window.adSpotInterstitial = adSpotInterstitial,
                            window.adSpotRewardedVideo = adSpotRewardedVideo,
                            window.isAdReady = !1,
                            window.isRVReady = !1,
                            window.isINSReady = !1,
                            window.gamePackage = config
                        } catch (err) {
                            console.log("Could not initialize Jio Games SDK", err)
                        }
                    }
                    return JioAdProvider.prototype.setManager = function(manager) {
                        this.adManager = manager
                    }
                    ,
                    JioAdProvider.prototype.showAd = function(adType, adSpotKey) {
                        var _this = this;
                        if (void 0 === adType && (adType = shared_1.AdType.interstitial),
                        this.adAvailable(adType)) {
                            if (window.hasOwnProperty("onAdView") && (window.onAdView,
                            1) && (window.onAdView = function(cbAdSpot) {
                                setTimeout(function() {
                                    console.log("JioGames ads: onAdView " + cbAdSpot),
                                    _this.resumeGameplay()
                                }, 2e3)
                            }
                            ),
                            window.hasOwnProperty("onAdClosed") && (window.onAdClosed,
                            1) && (window.onAdClosed = function(data, pIsVideoCompleted, pIsEligibleForReward) {
                                var localData = data.split(",");
                                var data = data;
                                var pIsVideoCompleted = pIsVideoCompleted;
                                var pIsEligibleForReward = pIsEligibleForReward;
                                null != localData && 1 < localData.length && (data = localData[0].trim(),
                                pIsVideoCompleted = Boolean(localData[1].trim()),
                                pIsEligibleForReward = Boolean(localData[2].trim())),
                                data === window.adSpotInterstitial && (window.isAdReady = !1),
                                data === window.adSpotRewardedVideo && (window.isRVReady = !1,
                                pIsEligibleForReward) && pIsVideoCompleted && _this.adManager.emit(shared_1.AdEvents.AD_REWARDED),
                                setTimeout(function() {
                                    console.log("JioGames ads: onAdClose"),
                                    _this.resumeGameplay()
                                }, 3e3)
                            }
                            ),
                            adType === shared_1.AdType.interstitial && window.hasOwnProperty("showAdMidRoll") && (window.showAdMidRoll,
                            1))
                                try {
                                    window.adSpotInterstitial = adSpotKey,
                                    window.showAdMidRoll(adSpotKey, window.gamePackage)
                                } catch (e) {
                                    this.resumeGameplay(),
                                    console.log("Error caching midroll ads")
                                }
                            if (adType === shared_1.AdType.rewarded && window.hasOwnProperty("showAdRewardedVideo") && (window.showAdRewardedVideo,
                            1))
                                try {
                                    window.adSpotRewardedVideo = adSpotKey,
                                    window.showAdRewardedVideo(adSpotKey, window.gamePackage)
                                } catch (e) {
                                    this.resumeGameplay(),
                                    console.log("Error caching rewarded ads")
                                }
                        } else
                            console.log("Cannot show Jio ads; Ads were not preloaded or failed to load. Resuming game"),
                            this.resumeGameplay()
                    }
                    ,
                    JioAdProvider.prototype.resumeGameplay = function() {
                        this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)
                    }
                    ,
                    JioAdProvider.prototype.preloadAd = function(adType, adSpotKey) {
                        if (void 0 === adType && (adType = shared_1.AdType.interstitial),
                        console.log("Calling cache Jio Ad"),
                        adType === shared_1.AdType.interstitial && window.hasOwnProperty("cacheAdMidRoll") && (window.cacheAdMidRoll,
                        1))
                            try {
                                window.adSpotInterstitial = adSpotKey,
                                window.cacheAdMidRoll(adSpotKey, window.gamePackage)
                            } catch (e) {
                                console.log("Error caching midroll ads")
                            }
                        if (adType === shared_1.AdType.rewarded && window.hasOwnProperty("cacheAdRewardedVideo") && (window.cacheAdRewardedVideo,
                        1))
                            try {
                                window.adSpotRewardedVideo = adSpotKey,
                                window.cacheAdRewardedVideo(adSpotKey, window.gamePackage)
                            } catch (e) {
                                console.log("Error cacheAdRewardedVideo of Jio rewarded ads")
                            }
                        window.hasOwnProperty("onAdPrepared") && (window.onAdPrepared,
                        1) && (window.onAdPrepared = function(preparedAdSpotKey) {
                            try {
                                preparedAdSpotKey === window.adSpotInterstitial && (window.isAdReady = !0),
                                preparedAdSpotKey === window.adSpotRewardedVideo && (window.isRVReady = !0)
                            } catch (e) {
                                console.log("Error onAdPrepared for Jio rewarded ads")
                            }
                        }
                        ),
                        window.hasOwnProperty("onAdFailedToLoad") && (window.onAdFailedToLoad,
                        1) && (window.onAdFailedToLoad = function(data, pDescription) {
                            var localData = data.split(",");
                            var failedAdSpotKey = data;
                            var pDescription = pDescription;
                            null != localData && 1 < localData.length && (failedAdSpotKey = localData[0].trim(),
                            pDescription = localData[1].trim());
                            try {
                                failedAdSpotKey === window.adSpotInterstitial && (window.isAdReady = !1),
                                failedAdSpotKey === window.adSpotRewardedVideo && (window.isRVReady = !1),
                                console.log("JioGames: onAdFailedToLoad => ".concat(data.toString(), " => ").concat(pDescription))
                            } catch (e) {
                                console.log("Error loading Jio ads")
                            }
                        }
                        )
                    }
                    ,
                    JioAdProvider.prototype.destroyAd = function() {}
                    ,
                    JioAdProvider.prototype.hideAd = function() {}
                    ,
                    JioAdProvider.prototype.adAvailable = function(adType) {
                        return !0
                    }
                    ,
                    JioAdProvider
                }();
                exports.JioAdProvider = JioAdProvider
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        766: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(470)],
            void 0 !== (exports = function(require, exports, JioAdProvider_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.JioAdProvider = void 0,
                Object.defineProperty(exports, "JioAdProvider", {
                    enumerable: !0,
                    get: function() {
                        return JioAdProvider_1.JioAdProvider
                    }
                })
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        110: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(12)],
            void 0 !== (exports = function(require, exports, shared_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.AdFreeUntrackedProvider = void 0;
                var AdFreeUntrackedProvider = function() {
                    function AdFreeUntrackedProvider() {
                        this.adsEnabled = !1
                    }
                    return AdFreeUntrackedProvider.prototype.setManager = function(manager) {
                        this.adManager = manager
                    }
                    ,
                    AdFreeUntrackedProvider.prototype.showAd = function(adType) {
                        void 0 === adType && (adType = shared_1.AdType.interstitial),
                        this.resumeGameplay()
                    }
                    ,
                    AdFreeUntrackedProvider.prototype.resumeGameplay = function() {
                        this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)
                    }
                    ,
                    AdFreeUntrackedProvider.prototype.preloadAd = function(adType) {
                        void 0 === adType && (adType = shared_1.AdType.interstitial)
                    }
                    ,
                    AdFreeUntrackedProvider.prototype.destroyAd = function() {}
                    ,
                    AdFreeUntrackedProvider.prototype.hideAd = function() {}
                    ,
                    AdFreeUntrackedProvider.prototype.adAvailable = function(adType) {
                        return !0
                    }
                    ,
                    AdFreeUntrackedProvider
                }();
                exports.AdFreeUntrackedProvider = AdFreeUntrackedProvider
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        670: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(12)],
            void 0 !== (exports = function(require, exports, shared_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.DummyProvider = void 0;
                var DummyProvider = function() {
                    function DummyProvider() {
                        this.adsEnabled = !1
                    }
                    return DummyProvider.prototype.setManager = function(manager) {
                        this.adManager = manager,
                        this.adsEnabled = !0
                    }
                    ,
                    DummyProvider.prototype.showAd = function(adType) {
                        var _this = this;
                        void 0 === adType && (adType = shared_1.AdType.interstitial),
                        console.log("[Dummy]: Ad type requested = ", adType === shared_1.AdType.interstitial ? "interstitial" : "rewarded"),
                        this.adManager.emit(shared_1.AdEvents.CONTENT_PAUSED);
                        var num = Math.floor(2 * Math.random());
                        console.log("[Dummy]:Ad Available =>", 0 === num),
                        1 === num ? (console.log("[Dummy]:AD ERROR / UNAVAILABLE"),
                        setTimeout(function() {
                            console.log("[Dummy]: Resuming game"),
                            _this.resumeGameplay()
                        }, 200)) : (adType === shared_1.AdType.rewarded && setTimeout(function() {
                            console.log("[Dummy]: Reward Claimed for rewarded ad"),
                            _this.adManager.emit(shared_1.AdEvents.AD_REWARDED)
                        }, 100),
                        setTimeout(function() {
                            console.log("[Dummy]: Finished watching ad"),
                            console.log("[Dummy]: Resuming game"),
                            _this.resumeGameplay()
                        }, 200))
                    }
                    ,
                    DummyProvider.prototype.resumeGameplay = function() {
                        this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)
                    }
                    ,
                    DummyProvider.prototype.preloadAd = function(adType) {
                        void 0 === adType && (adType = shared_1.AdType.interstitial)
                    }
                    ,
                    DummyProvider.prototype.destroyAd = function() {}
                    ,
                    DummyProvider.prototype.hideAd = function() {}
                    ,
                    DummyProvider.prototype.adAvailable = function(adType) {
                        return !0
                    }
                    ,
                    DummyProvider
                }();
                exports.DummyProvider = DummyProvider
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        474: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(12)],
            void 0 !== (exports = function(require, exports, shared_1) {
                "use strict";
                var GameDistributionAdType;
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.GameDistribution = exports.GameDistributionAdType = void 0,
                function(GameDistributionAdType) {
                    GameDistributionAdType.interstitial = "interstitial",
                    GameDistributionAdType.rewarded = "rewarded",
                    GameDistributionAdType.display = "display"
                }(GameDistributionAdType = exports.GameDistributionAdType || (exports.GameDistributionAdType = {}));
                var GameDistribution = function() {
                    function GameDistribution(gameId) {
                        var _this = this;
                        if (this.adsEnabled = !1,
                        this.hasRewarded = !1,
                        this.adShowing = !1,
                        !gameId)
                            throw new Error("Valid game id is not provided for GD Ad provider");
                        var gameId, s, id, fjs;
                        window.GD_OPTIONS = {
                            gameId: gameId,
                            advertisementSettings: {
                                autoplay: !1
                            },
                            onEvent: function(event) {
                                switch (event.name) {
                                case "SDK_GAME_PAUSE":
                                    _this.adManager.emit(shared_1.AdEvents.CONTENT_PAUSED);
                                    break;
                                case "SDK_ERROR":
                                    _this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED);
                                    break;
                                case "SDK_READY":
                                    _this.sdkLoaded();
                                    break;
                                case "SDK_REWARDED_WATCH_COMPLETE":
                                    _this.adManager.emit(shared_1.AdEvents.AD_REWARDED),
                                    _this.hasRewarded = !1;
                                    break;
                                default:
                                    break
                                }
                            }
                        },
                        gameId = document,
                        s = "script",
                        id = "gamedistribution-jssdk",
                        fjs = gameId.getElementsByTagName(s)[0],
                        gameId.getElementById(id) || ((gameId = gameId.createElement(s)).id = id,
                        gameId.src = "patch/js/gd-sdk.js?html5.api.gamedistribution.com/main.min.js",
                        fjs.parentNode && fjs.parentNode.insertBefore(gameId, fjs))
                    }
                    return GameDistribution.prototype.setManager = function(manager) {
                        this.adManager = manager,
                        this.adManager.emit(shared_1.AdEvents.AD_PROVIDER_LOADED)
                    }
                    ,
                    GameDistribution.prototype.sdkLoaded = function() {
                        this.adsEnabled = !0
                    }
                    ,
                    GameDistribution.prototype.showAd = function(adType) {
                        var _this = this;
                        this.adsEnabled ? void 0 === window.gdsdk || window.gdsdk && void 0 === window.gdsdk.showAd ? (this.adsEnabled = !1,
                        this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)) : window.gdsdk.showAd(adType === shared_1.AdType.rewarded ? GameDistributionAdType.rewarded : GameDistributionAdType.interstitial).then(function() {
                            _this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)
                        }).catch(function() {
                            adType === shared_1.AdType.rewarded && _this.hasRewarded && (_this.hasRewarded = !1),
                            _this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)
                        }) : this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)
                    }
                    ,
                    GameDistribution.prototype.preloadAd = function(adType) {
                        var _this = this;
                        !this.hasRewarded && this.adsEnabled && adType === shared_1.AdType.rewarded && (console.log("preloading ad"),
                        window.gdsdk.preloadAd(GameDistributionAdType.rewarded).then(function() {
                            _this.hasRewarded = !0,
                            _this.adManager.emit(shared_1.AdEvents.AD_LOADED, adType)
                        }))
                    }
                    ,
                    GameDistribution.prototype.adAvailable = function(adType) {
                        return adType !== shared_1.AdType.rewarded || this.hasRewarded
                    }
                    ,
                    GameDistribution.prototype.destroyAd = function() {}
                    ,
                    GameDistribution.prototype.hideAd = function() {}
                    ,
                    GameDistribution
                }();
                exports.GameDistribution = GameDistribution
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        444: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(474), __webpack_require__(869)],
            void 0 !== (exports = function(require, exports, GameDistribution_1, gamedistribution_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.GameDistributionBanner = void 0;
                var GameDistributionBanner = function() {
                    function GameDistributionBanner() {
                        this.scaleFactor = 1,
                        this.offsetX = 0,
                        this.offsetY = 0,
                        this.element = document.createElement("div"),
                        this.element.style.position = "absolute",
                        this.element.style.top = "0px",
                        this.element.style.left = "0px",
                        this.element.id = "banner-".concat(Date.now()).concat(1e7 * Math.random() | 0),
                        document.body.appendChild(this.element)
                    }
                    return GameDistributionBanner.prototype.loadBanner = function() {
                        return void 0 === window.gdsdk ? Promise.reject("GD Sdk not available, probably due to adblocker") : window.gdsdk.showAd(GameDistribution_1.GameDistributionAdType.display, {
                            containerId: this.element.id
                        })
                    }
                    ,
                    GameDistributionBanner.prototype.destroy = function() {
                        document.body.removeChild(this.element),
                        this.resizeListener && window.removeEventListener("resize", this.resizeListener),
                        delete this.element,
                        delete this.parent,
                        delete this.alignment
                    }
                    ,
                    GameDistributionBanner.prototype.alignIn = function(element, position) {
                        var _this = this;
                        this.parent ? console.warn("Banner already aligned, ignoring...") : (this.parent = element,
                        this.alignment = position,
                        this.resizeListener = function() {
                            return _this.resize()
                        }
                        ,
                        window.addEventListener("resize", this.resizeListener),
                        this.resize())
                    }
                    ,
                    GameDistributionBanner.prototype.setOffset = function(x, y) {
                        void 0 === y && (y = 0),
                        this.offsetX = x = void 0 === x ? 0 : x,
                        this.offsetY = y,
                        this.resize()
                    }
                    ,
                    GameDistributionBanner.prototype.resize = function() {
                        if (this.parent) {
                            var parentBoundingRect = this.parent.getBoundingClientRect();
                            switch (this.alignment) {
                            case gamedistribution_1.GameDistributionAlignment.TopLeft:
                                this.position(parentBoundingRect.left, parentBoundingRect.top);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.TopCenter:
                                this.position(parentBoundingRect.left + parentBoundingRect.width / 2 - this.width * this.scaleFactor / 2, parentBoundingRect.top);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.TopRight:
                                this.position(parentBoundingRect.left + parentBoundingRect.width - this.width * this.scaleFactor, parentBoundingRect.top);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.CenterLeft:
                                this.position(parentBoundingRect.left, parentBoundingRect.top + parentBoundingRect.height / 2 - this.height * this.scaleFactor / 2);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.Center:
                                this.position(parentBoundingRect.left + parentBoundingRect.width / 2 - this.width * this.scaleFactor / 2, parentBoundingRect.top + parentBoundingRect.height / 2 - this.height * this.scaleFactor / 2);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.CenterRight:
                                this.position(parentBoundingRect.left + parentBoundingRect.width - this.width * this.scaleFactor, parentBoundingRect.top + parentBoundingRect.height / 2 - this.height * this.scaleFactor / 2);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.BottomLeft:
                                this.position(parentBoundingRect.left, parentBoundingRect.top + parentBoundingRect.height - this.height * this.scaleFactor);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.BottomCenter:
                                this.position(parentBoundingRect.left + parentBoundingRect.width / 2 - this.width * this.scaleFactor / 2, parentBoundingRect.top + parentBoundingRect.height - this.height * this.scaleFactor);
                                break;
                            case gamedistribution_1.GameDistributionAlignment.BottomRight:
                                this.position(parentBoundingRect.left + parentBoundingRect.width - this.width * this.scaleFactor, parentBoundingRect.top + parentBoundingRect.height - this.height * this.scaleFactor);
                                break
                            }
                        }
                    }
                    ,
                    GameDistributionBanner.prototype.setSize = function(size) {
                        var width;
                        var height;
                        switch (size) {
                        default:
                        case gamedistribution_1.GameDistributionBannerSize.LargeRectangle:
                            width = 336,
                            height = 280;
                            break;
                        case gamedistribution_1.GameDistributionBannerSize.MediumRectangle:
                            width = 300,
                            height = 250;
                            break;
                        case gamedistribution_1.GameDistributionBannerSize.Billboard:
                            width = 970,
                            height = 250;
                            break;
                        case gamedistribution_1.GameDistributionBannerSize.Leaderboard:
                            width = 728,
                            height = 90;
                            break;
                        case gamedistribution_1.GameDistributionBannerSize.Skyscraper:
                            width = 120,
                            height = 600;
                            break;
                        case gamedistribution_1.GameDistributionBannerSize.WideSkyscraper:
                            width = 160,
                            height = 600;
                            break
                        }
                        this.width = width,
                        this.height = height,
                        this.element.style.width = "".concat(width, "px"),
                        this.element.style.height = "".concat(height, "px")
                    }
                    ,
                    GameDistributionBanner.prototype.position = function(x, y) {
                        this.element.style.left = "".concat(x + this.offsetX, "px"),
                        this.element.style.top = "".concat(y + this.offsetY, "px")
                    }
                    ,
                    GameDistributionBanner.prototype.scale = function(factor) {
                        this.element.style.transformOrigin = "left top",
                        this.scaleFactor = factor,
                        this.element.style.transform = "scale(".concat(factor, ")")
                    }
                    ,
                    GameDistributionBanner
                }();
                exports.GameDistributionBanner = GameDistributionBanner
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        654: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(12)],
            void 0 !== (exports = function(require, exports, shared_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.YandexAdProvider = void 0;
                var YandexAdProvider = function() {
                    function YandexAdProvider(partnerID) {
                        var _this = this;
                        var d, s, id, fjs;
                        this.adsEnabled = !1,
                        d = document,
                        s = "script",
                        id = "yandex-jssdk",
                        fjs = d.getElementsByTagName(s)[0],
                        d.getElementById(id) || ((d = d.createElement(s)).addEventListener("load", function() {
                            _this.initialize()
                        }),
                        d.id = id,
                        d.src = "//yandex.ru/games/sdk/v2",
                        fjs.parentNode.insertBefore(d, fjs))
                    }
                    return YandexAdProvider.prototype.setManager = function(manager) {
                        this.adManager = manager
                    }
                    ,
                    YandexAdProvider.prototype.showAd = function(adType) {
                        var _this = this;
                        var _a, _a, _a, adType, _a, _a, adType, _a;
                        void 0 === adType && (adType = shared_1.AdType.interstitial),
                        this.adsEnabled && window.hasOwnProperty("_YaSDK") ? adType === shared_1.AdType.interstitial && null != (_a = null == (_a = window._YaSDK) ? void 0 : _a.adv) && _a.adOpened || (adType === shared_1.AdType.rewarded ? null != (_a = null == (adType = null == (_a = window._YaSDK) ? void 0 : _a.adv) ? void 0 : adType.showRewardedVideo) && _a.call(adType, {
                            callbacks: {
                                onOpen: function() {
                                    console.log("Video ad open."),
                                    _this.adManager.emit(shared_1.AdEvents.CONTENT_PAUSED)
                                },
                                onRewarded: function() {
                                    console.log("Rewarded!"),
                                    _this.adManager.emit(shared_1.AdEvents.AD_REWARDED)
                                },
                                onClose: function() {
                                    console.log("Video ad closed."),
                                    _this.resumeGameplay()
                                },
                                onError: function(e) {
                                    console.log("Error while open video ad:", e),
                                    _this.resumeGameplay()
                                }
                            }
                        }) : null != (_a = null == (adType = null == (_a = window._YaSDK) ? void 0 : _a.adv) ? void 0 : adType.showFullscreenAdv) && _a.call(adType, {
                            callbacks: {
                                onOpen: function() {
                                    console.log("Video ad open."),
                                    _this.adManager.emit(shared_1.AdEvents.CONTENT_PAUSED)
                                },
                                onClose: function() {
                                    _this.resumeGameplay()
                                },
                                onError: function() {
                                    _this.resumeGameplay()
                                }
                            }
                        })) : this.resumeGameplay()
                    }
                    ,
                    YandexAdProvider.prototype.initialize = function() {
                        var _this = this;
                        window.YaGames.init().then(function(ysdk) {
                            window._YaSDK = ysdk,
                            _this.adsEnabled = !0
                        })
                    }
                    ,
                    YandexAdProvider.prototype.resumeGameplay = function() {
                        this.adManager.emit(shared_1.AdEvents.CONTENT_RESUMED)
                    }
                    ,
                    YandexAdProvider.prototype.preloadAd = function(adType) {
                        void 0 === adType && (adType = shared_1.AdType.interstitial),
                        this.adManager.emit(shared_1.AdEvents.AD_LOADED, adType)
                    }
                    ,
                    YandexAdProvider.prototype.destroyAd = function() {}
                    ,
                    YandexAdProvider.prototype.hideAd = function() {}
                    ,
                    YandexAdProvider.prototype.adAvailable = function(adType) {
                        return !0
                    }
                    ,
                    YandexAdProvider
                }();
                exports.YandexAdProvider = YandexAdProvider
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        563: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(110), __webpack_require__(670), __webpack_require__(474), __webpack_require__(444), __webpack_require__(654)],
            void 0 !== (exports = function(require, exports, AdFreeUntrackedProvider_1, DummyProvider_1, GameDistribution_1, GameDistributionBanner_1, YandexAdProvider_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.YandexAdProvider = exports.GameDistributionBanner = exports.GameDistribution = exports.DummyProvider = exports.AdFreeUntrackedProvider = void 0,
                Object.defineProperty(exports, "AdFreeUntrackedProvider", {
                    enumerable: !0,
                    get: function() {
                        return AdFreeUntrackedProvider_1.AdFreeUntrackedProvider
                    }
                }),
                Object.defineProperty(exports, "DummyProvider", {
                    enumerable: !0,
                    get: function() {
                        return DummyProvider_1.DummyProvider
                    }
                }),
                Object.defineProperty(exports, "GameDistribution", {
                    enumerable: !0,
                    get: function() {
                        return GameDistribution_1.GameDistribution
                    }
                }),
                Object.defineProperty(exports, "GameDistributionBanner", {
                    enumerable: !0,
                    get: function() {
                        return GameDistributionBanner_1.GameDistributionBanner
                    }
                }),
                Object.defineProperty(exports, "YandexAdProvider", {
                    enumerable: !0,
                    get: function() {
                        return YandexAdProvider_1.YandexAdProvider
                    }
                })
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        869: (module,exports,__webpack_require__)=>{
            var __WEBPACK_AMD_DEFINE_ARRAY__, __webpack_require__;
            void 0 !== (__webpack_require__ = function(require, exports) {
                "use strict";
                var GameDistributionBannerSize;
                var GameDistributionAlignment;
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.GameDistributionAlignment = exports.GameDistributionBannerSize = void 0,
                function(GameDistributionBannerSize) {
                    GameDistributionBannerSize[GameDistributionBannerSize.LargeRectangle = 0] = "LargeRectangle",
                    GameDistributionBannerSize[GameDistributionBannerSize.MediumRectangle = 1] = "MediumRectangle",
                    GameDistributionBannerSize[GameDistributionBannerSize.Billboard = 2] = "Billboard",
                    GameDistributionBannerSize[GameDistributionBannerSize.Leaderboard = 3] = "Leaderboard",
                    GameDistributionBannerSize[GameDistributionBannerSize.Skyscraper = 4] = "Skyscraper",
                    GameDistributionBannerSize[GameDistributionBannerSize.WideSkyscraper = 5] = "WideSkyscraper"
                }(GameDistributionBannerSize = exports.GameDistributionBannerSize || (exports.GameDistributionBannerSize = {})),
                function(GameDistributionAlignment) {
                    GameDistributionAlignment[GameDistributionAlignment.TopLeft = 0] = "TopLeft",
                    GameDistributionAlignment[GameDistributionAlignment.TopCenter = 1] = "TopCenter",
                    GameDistributionAlignment[GameDistributionAlignment.TopRight = 2] = "TopRight",
                    GameDistributionAlignment[GameDistributionAlignment.CenterLeft = 3] = "CenterLeft",
                    GameDistributionAlignment[GameDistributionAlignment.Center = 4] = "Center",
                    GameDistributionAlignment[GameDistributionAlignment.CenterRight = 5] = "CenterRight",
                    GameDistributionAlignment[GameDistributionAlignment.BottomLeft = 6] = "BottomLeft",
                    GameDistributionAlignment[GameDistributionAlignment.BottomCenter = 7] = "BottomCenter",
                    GameDistributionAlignment[GameDistributionAlignment.BottomRight = 8] = "BottomRight"
                }(GameDistributionAlignment = exports.GameDistributionAlignment || (exports.GameDistributionAlignment = {}))
            }
            .apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports])) && (module.exports = __webpack_require__)
        }
        ,
        498: (module,exports,__webpack_require__)=>{
            var __webpack_require__, exports;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(12), __webpack_require__(869)],
            void 0 !== (exports = function(require, exports, shared_1, gamedistribution_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.GameDistributionAlignment = exports.GameDistributionBannerSize = exports.ProviderTypes = exports.AdType = exports.AdEvents = void 0,
                Object.defineProperty(exports, "AdEvents", {
                    enumerable: !0,
                    get: function() {
                        return shared_1.AdEvents
                    }
                }),
                Object.defineProperty(exports, "AdType", {
                    enumerable: !0,
                    get: function() {
                        return shared_1.AdType
                    }
                }),
                Object.defineProperty(exports, "ProviderTypes", {
                    enumerable: !0,
                    get: function() {
                        return shared_1.ProviderTypes
                    }
                }),
                Object.defineProperty(exports, "GameDistributionBannerSize", {
                    enumerable: !0,
                    get: function() {
                        return gamedistribution_1.GameDistributionBannerSize
                    }
                }),
                Object.defineProperty(exports, "GameDistributionAlignment", {
                    enumerable: !0,
                    get: function() {
                        return gamedistribution_1.GameDistributionAlignment
                    }
                })
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
        ,
        12: (module,exports,__webpack_require__)=>{
            var __WEBPACK_AMD_DEFINE_ARRAY__, __webpack_require__;
            void 0 !== (__webpack_require__ = function(require, exports) {
                "use strict";
                var AdEvents;
                var AdType;
                var ProviderTypes;
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.ProviderTypes = exports.AdType = exports.AdEvents = void 0,
                function(AdEvents) {
                    AdEvents.CONTENT_PAUSED = "onContentPaused",
                    AdEvents.CONTENT_RESUMED = "onContentResumed",
                    AdEvents.AD_PROGRESSION = "onAdProgression",
                    AdEvents.AD_DISABLED = "onAdsDisabled",
                    AdEvents.AD_CLICKED = "onAdClicked",
                    AdEvents.AD_REWARDED = "onAdRewardGranted",
                    AdEvents.BANNER_SHOWN = "onBannerShown",
                    AdEvents.BANNER_HIDDEN = "onBannerHidden",
                    AdEvents.AD_LOADED = "onAdLoaded",
                    AdEvents.AD_PROVIDER_LOADED = "onAdProviderLoaded"
                }(AdEvents = exports.AdEvents || (exports.AdEvents = {})),
                function(AdType) {
                    AdType[AdType.interstitial = 0] = "interstitial",
                    AdType[AdType.rewarded = 1] = "rewarded",
                    AdType[AdType.banner = 2] = "banner"
                }(AdType = exports.AdType || (exports.AdType = {})),
                function(ProviderTypes) {
                    ProviderTypes.Yandex = "yx",
                    ProviderTypes.Dummy = "dm",
                    ProviderTypes.AdFree = "af",
                    ProviderTypes.GD = "gd",
                    ProviderTypes.GDBanner = "gdb",
                    ProviderTypes.Jio = "jio"
                }(ProviderTypes = exports.ProviderTypes || (exports.ProviderTypes = {}))
            }
            .apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports])) && (module.exports = __webpack_require__)
        }
        ,
        548: function(module, exports, __webpack_require__) {
            var __webpack_require__, exports;
            var __extends = this && this.__extends || (extendStatics = function(d, b) {
                return (extendStatics = Object.setPrototypeOf || ({
                    __proto__: []
                }instanceof Array ? function(d, b) {
                    d.__proto__ = b
                }
                : function(d, b) {
                    for (var p in b)
                        Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p])
                }
                ))(d, b)
            }
            ,
            function(d, b) {
                if ("function" != typeof b && null !== b)
                    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                function __() {
                    this.constructor = d
                }
                extendStatics(d, b),
                d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype,
                new __)
            }
            );
            var extendStatics;
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                }
            }
            ;
            __webpack_require__ = [__webpack_require__, exports, __webpack_require__(34), __webpack_require__(12), __webpack_require__(563), __webpack_require__(766)],
            void 0 !== (exports = function(require, exports, eventemitter3_1, shared_1, standard_1, special_1) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                }),
                exports.AdWrapper = void 0;
                var eventemitter3_1 = function(_super) {
                    function AdWrapper(type, id, jioConfig) {
                        var _this = _super.call(this) || this;
                        switch (_this.bannerActive = !1,
                        _this.provider = null,
                        type) {
                        case shared_1.ProviderTypes.AdFree:
                            _this.provider = new standard_1.AdFreeUntrackedProvider;
                            break;
                        case shared_1.ProviderTypes.Dummy:
                            _this.provider = new standard_1.DummyProvider;
                            break;
                        case shared_1.ProviderTypes.Yandex:
                            _this.provider = new standard_1.YandexAdProvider;
                            break;
                        case shared_1.ProviderTypes.Jio:
                            _this.provider = new special_1.JioAdProvider(jioConfig);
                            break;
                        default:
                        case shared_1.ProviderTypes.GD:
                            _this.provider = new standard_1.GameDistribution(id);
                            break
                        }
                        return _this.provider.setManager(_this),
                        _this
                    }
                    return __extends(AdWrapper, _super),
                    AdWrapper.prototype.showAd = function(adType) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++)
                            args[_i - 1] = arguments[_i];
                        if (null === this.provider)
                            throw new Error("Can not request an ad without an provider, please attach an ad provider!");
                        args.unshift(adType),
                        this.provider.showAd.apply(this.provider, args)
                    }
                    ,
                    AdWrapper.prototype.createBanner = function() {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++)
                            args[_i] = arguments[_i];
                        return this.provider.loadBanner.apply(this.provider, args)
                    }
                    ,
                    AdWrapper.prototype.loadBanner = function() {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++)
                            args[_i] = arguments[_i];
                        return "function" == typeof this.provider.loadBanner ? this.provider.loadBanner.apply(this.provider, args) : null
                    }
                    ,
                    AdWrapper.prototype.preloadAd = function(adType) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++)
                            args[_i - 1] = arguments[_i];
                        if (null === this.provider)
                            throw new Error("Can not preload an ad without an provider, please attach an ad provider!");
                        args.unshift(adType),
                        this.provider.preloadAd.apply(this.provider, args)
                    }
                    ,
                    AdWrapper.prototype.destroyAd = function(adType) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++)
                            args[_i - 1] = arguments[_i];
                        if (null === this.provider)
                            throw new Error("Can not destroy an ad without an provider, please attach an ad provider!");
                        args.unshift(adType),
                        this.provider.destroyAd.apply(this.provider, args)
                    }
                    ,
                    AdWrapper.prototype.hideAd = function(adType) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++)
                            args[_i - 1] = arguments[_i];
                        if (null === this.provider)
                            throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                        args.unshift(adType),
                        this.provider.hideAd.apply(this.provider, args)
                    }
                    ,
                    AdWrapper.prototype.adsEnabled = function() {
                        if (null === this.provider)
                            throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                        return this.provider.adsEnabled
                    }
                    ,
                    AdWrapper.prototype.adAvailable = function(adType) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++)
                            args[_i - 1] = arguments[_i];
                        if (null === this.provider)
                            throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                        return args.unshift(adType),
                        this.provider.adAvailable.apply(this.provider, args)
                    }
                    ,
                    AdWrapper
                }((eventemitter3_1 = __importDefault(eventemitter3_1)).default);
                exports.AdWrapper = eventemitter3_1
            }
            .apply(exports, __webpack_require__)) && (module.exports = exports)
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        var cachedModule;
        return void 0 !== cachedModule || (cachedModule = __webpack_module_cache__[moduleId] = {
            exports: {}
        },
        __webpack_modules__[moduleId].call(cachedModule.exports, cachedModule, cachedModule.exports, __webpack_require__)),
        cachedModule.exports
    }
    var __webpack_exports__ = __webpack_require__(729);
    self.h5ads = __webpack_exports__
}
)();
!function(){  
  // console.log("--fx--h5branding--", h5branding.SplashLoader.create.toString());
  
}();
