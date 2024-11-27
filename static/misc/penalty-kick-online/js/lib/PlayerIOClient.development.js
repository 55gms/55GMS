if (typeof (_pio) == 'undefined') { _pio = {} }
(function () {
	_pio.channel = function () { };
	_pio.channel.prototype.call = function (method, args, successCallback, errorCallback, converter) {
		var url = typeof(PLAYERIO_API_HOST) != 'undefined' ? PLAYERIO_API_HOST : ((PlayerIO.useSecureApiRequests ? 'https' : 'http') + '://api.playerio.com/json/');

		var webrequest = new XMLHttpRequest();
		if ("withCredentials" in webrequest) { // Both Safari 4 and Firefox 3.5 provide the withCredentials property on XMLHttpRequest
			//webrequest.withCredentials = true;
			webrequest.open("post", url, true);
		} else if (typeof XDomainRequest != "undefined") { // IE uses XDomainRequest for some reason (?)
			webrequest = new XDomainRequest();
			webrequest.open("post", url);
		} else {
			// USE FLASH
			webrequest = new _pio.flashWebRequest("post",url	);
		}

		var originalStack = new Error();

		if (webrequest != null) {
			webrequest.send("[" +method + "|" + (this.token||"") + "]" + JSON.stringify(args));
			webrequest.onload = function () {
				var result = null;
				try{
					var response = webrequest.response || webrequest.responseText;
					if( response[0] == "[" ){
						var end = response.indexOf("]");
						this.token = response.substring(1,end);
						response = response.substring(end+1)
					}
					result = JSON.parse(response)
				}catch(e){
					_pio.handleError(originalStack, errorCallback, PlayerIOErrorCode.GeneralError, "Error decoding response from webservice: " + e)
					return;
				}

				// success or error?
				if( typeof(result.errorcode) == 'undefined' && typeof(result.message) == 'undefined' ){
					var value = result;
					if( converter ){
						try{
							value = converter(result);
						} catch (e) {
							_pio.handleError(originalStack, errorCallback, e.code, e.message)
						}
					}
					if( successCallback ){
						successCallback(value)
					}
				}else{
					_pio.handleError(originalStack, errorCallback, result.errorcode, result.message)
				}
			}
			webrequest.onerror = function (req) {
				_pio.handleError(originalStack, errorCallback, PlayerIOErrorCode.GeneralError, "Error talking to webservice: " + JSON.stringify(req))
			}
		} else {
			_pio.handleError(originalStack, errorCallback, PlayerIOErrorCode.GeneralError, "Need to implement flash calling")
		}
	};
	_pio.runCallback = function(callback, callbackArg, originalStackError){
		try{
			if( callback ){
				callback(callbackArg);
			}
		} catch (e) {
			var message = "Unhandled error in callback: " + e.message;
			message += "\nStack:\n"
			message += (e.stack||e.stacktrace||e.StackTrace);
			if( originalStackError ){
				message += "\nCallsite stack:\n"
				message += (originalStackError.stack||originalStackError.stacktrace||originalStackError.StackTrace);
			}
			console.log(message)
		}
	}
	_pio.handleError = function(originalStackError,errorCallback,code,message){
		var err =  _pio.error(code, message) 
		if(originalStackError){
			if(originalStackError.stack) err.stack = originalStackError.stack;
			if(originalStackError.stacktrace) err.stacktrace = originalStackError.stacktrace;
			if(originalStackError.StackTrace) err.StackTrace = originalStackError.StackTrace
		}

		if( errorCallback ){
			_pio.runCallback(errorCallback, err, originalStackError)
		}else if(typeof(console) != 'undefined'){
			console.log("No error callback specified for: "+err.code + ": " + err.message + "\n" + (err.stack||err.stacktrace||err.StackTrace));
		}else{
			alert("No error callback specified for: "+err.code + ": " + err.message + "\n" + (err.stack||err.stacktrace||err.StackTrace));
		}
	}
	_pio.error = function(code,message){
		if(arguments.length == 1 ){
			message = code;
			code = PlayerIOErrorCode.GeneralError;
		}

		if( typeof(code) == 'number' ){
			code = PlayerIOErrorCode.codes[code]
		}
		if( typeof(code) != 'string' ){
			console.log(code, message, new Error().stack)
			throw "Code must be a string!"
		}
		var e = new Error()
		return new PlayerIOError(code, message, (e.stack || e.stacktrace || e.StackTrace));
	}
	_pio.debugLog = function(message){
		if (typeof (console) != 'undefined') {
			console.log(message);
		}
	}

	_pio.convertToKVArray = function(object){
		var result = []
		if( object ){
			for(var k in object){
				result.push({key:(''+k),value:(''+object[k])})
			}
		}
		return result;
	}

	_pio.convertFromKVArray = function(arr){
		var result = {}
		if( arr && arr.length){
			for(var k in arr){
				result[ arr[k].key ] = arr[k].value
			}
		}
		return result;
	}

	_pio.convertToSegmentArray = function (object) {
		var result = [];
		if (object) {
			for (var k in object) {
				result.push(k + ':' + object[k]);
			}
		}
		return result;
	};
})();
/**
* @class Main class for authenticating a user and getting a client.
* @example Here is an example of using the class to authenticate:
* <listing>
* PlayerIO.authenticate(
*	'[Enter your game id here]',	//Game id
*	'public',						//Connection id
*	{ userId:'user-id' },			//Authentication arguments
*	{ campaign:'2017' },			//Optional PlayerInsight segments
*	function(client) {
*		//Success!
*		//You can now use the client object to make API calls.
*	},
*	function(error) {
*		if (error.code == PlayerIOErrorCode.UnknownGame) {
*			//Unknown game id used
*		} else {
*			//Another error
*		}
*	}
* );
* </listing>
*/
PlayerIO = {
	/**
	* If set to true, all API Requests will be encrypted using TLS/SSL. Be aware that this will cause a performance degradation by introducting secure connection negotiation latency for all requests.
	* @type bool
	*/
	useSecureApiRequests: false,

	/**
	 * Authenticates a user to Player.IO. See the Authentication documentation on which authenticationArguments that are needed for each authentication provider.
	 * @param {string} gameId The game id of the game you wish to connect to. This value can be found in the admin panel.
	 * @param {string} connectionId The id of the connection, as given in the settings section of the admin panel. 'public' should be used as the default
	 * @param {object} authenticationArguments A dictionary of arguments for the given connection.
	 * @param {object} playerInsightSegments Custom segments for the user in PlayerInsight.
	 * @param {function(client)} successCallback Callback function that will be called with a client when succesfully connected
	 * @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
	 */
	authenticate: function (gameId, connectionId, authenticationArguments, playerInsightSegments, successCallback, errorCallback) {
		if (authenticationArguments.publishingnetworklogin == 'auto') {
			if (typeof (window.PublishingNetwork) == 'undefined') {
				errorCallback(new PlayerIOError(PlayerIOErrorCode.GeneralError, "Could not find the PublishingNetwork object on the current page. Did you include the PublishingNetwork.js script?"));
				return
			}
			PublishingNetwork.dialog("login", { gameId: gameId, connectionId: connectionId, __use_usertoken__: true }, function (r) {
				if (r.error) {
					errorCallback(new PlayerIOError(PlayerIOErrorCode.GeneralError, r.error));
				} else if (typeof(r.userToken) == 'undefined') {
					errorCallback(new PlayerIOError(PlayerIOErrorCode.GeneralError, "Missing userToken value in result, but no error message given."));
				} else {
					PlayerIO.authenticate(gameId, connectionId, {userToken:r.userToken}, playerInsightSegments, successCallback, errorCallback)
				}
			})
			return
		}

		var channel = new _pio.channel();
		channel.authenticate(gameId, connectionId, _pio.convertToKVArray(authenticationArguments), _pio.convertToSegmentArray(playerInsightSegments), "javascript", _pio.convertToKVArray({}), null, successCallback, errorCallback, function (result) {
			channel.token = result.token;
			return new _pio.client(channel, gameId, result.gamefsredirectmap, result.userid); 
		});
	},

	/**
	 * Access the QuickConnect service 
	 * @type {quickConnect} 
	 */
	quickConnect: null, // gets overwritten at runtime.

	/**
	 * Get a gameFS instance for a specific game (only use this method when you don't have a valid client).
	 * @param {string} gameId The game id of the game you wish to access.
	 */
	gameFS: function (gameId) {
		return new _pio.gameFS(gameId);
	}
};
var JSON;
if (!JSON) {
	JSON = {};
}

(function () {
	'use strict';

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function (key) {

			return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
		};

		String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
            	return this.valueOf();
            };
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
        	'\b': '\\b',
        	'\t': '\\t',
        	'\n': '\\n',
        	'\f': '\\f',
        	'\r': '\\r',
        	'"': '\\"',
        	'\\': '\\\\'
        },
        rep;


	function quote(string) {

		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.

		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	function str(key, holder) {

		// Produce a string from holder[key].

		var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

		// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

		// What happens next depends on the value's type.

		switch (typeof value) {
			case 'string':
				return quote(value);

			case 'number':

				// JSON numbers must be finite. Encode non-finite numbers as null.

				return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':

				// If the value is a boolean or null, convert it to a string. Note:
				// typeof null does not produce 'null'. The case is included here in
				// the remote chance that this gets fixed someday.

				return String(value);

				// If the type is 'object', we might be dealing with an object or an array or
				// null.

			case 'object':

				// Due to a specification blunder in ECMAScript, typeof null is 'object',
				// so watch out for that case.

				if (!value) {
					return 'null';
				}

				// Make an array to hold the partial results of stringifying this object value.

				gap += indent;
				partial = [];

				// Is the value an array?

				if (Object.prototype.toString.apply(value) === '[object Array]') {

					// The value is an array. Stringify every element. Use null as a placeholder
					// for non-JSON values.

					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}

					// Join all of the elements together, separated with commas, and wrap them in
					// brackets.

					v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

				// If the replacer is an array, use it to select the members to be stringified.

				if (rep && typeof rep === 'object') {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						if (typeof rep[i] === 'string') {
							k = rep[i];
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				} else {

					// Otherwise, iterate through all of the keys in the object.

					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				}

				// Join all of the member texts together, separated with commas,
				// and wrap them in braces.

				v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
				gap = mind;
				return v;
		}
	}

	// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON.stringify !== 'function') {
		JSON.stringify = function (value, replacer, space) {

			// The stringify method takes a value and an optional replacer, and an optional
			// space parameter, and returns a JSON text. The replacer can be a function
			// that can replace values, or an array of strings that will select the keys.
			// A default replacer method can be provided. Use of the space parameter can
			// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

			// If the space parameter is a number, make an indent string containing that
			// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

				// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

			// If there is a replacer, it must be a function or an array.
			// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

			// Make a fake root object containing our value under the key of ''.
			// Return the result of stringifying the value.

			return str('', { '': value });
		};
	}


	// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON.parse !== 'function') {
		JSON.parse = function (text, reviver) {

			// The parse method takes a text and an optional reviver function, and returns
			// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

				// The walk method is used to recursively walk the resulting structure so
				// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


			// Parsing happens in four stages. In the first stage, we replace certain
			// Unicode characters with escape sequences. JavaScript handles many characters
			// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

			// In the second stage, we run the text against regular expressions that look
			// for non-JSON patterns. We are especially concerned with '()' and 'new'
			// because they can cause invocation, and '=' because it can cause mutation.
			// But just to be safe, we want to reject all unexpected forms.

			// We split the second stage into 4 regexp operations in order to work around
			// crippling inefficiencies in IE's and Safari's regexp engines. First we
			// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
			// replace all simple value tokens with ']' characters. Third, we delete all
			// open brackets that follow a colon or comma or that begin the text. Finally,
			// we look to see that the remaining characters are only whitespace or ']' or
			// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

				// In the third stage we use the eval function to compile the text into a
				// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
				// in JavaScript: it can begin a block or an object literal. We wrap the text
				// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

				// In the optional fourth stage, we recursively walk the new structure, passing
				// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
}());
(function () {
	var callbacks = {};
	var idCounter = 0;
	var flashUrl = "http://192.168.30.154/html5client/FlashFallback/bin-debug/FlashFallback.swf"

	// this method gets called back from flash
	__pio_flashfallback_callback__ = function () {
		var callback = callbacks[arguments[0]];
		if (callback) {
			var args = []
			for (var i = 1; i != arguments.length; i++) {
				args[i - 1] = arguments[i];
			}
			callback.apply(null, args);
		}
	}

	_pio.flashWebRequest = function (method, url) {
		var self = this;

		this.response = null;
		this.onload = function () { }
		this.onerror = function () { }

		this.send = function (data) {
			getFlashFallbackObj(function (obj) {
				if (obj == null) {
					self.onerror("Browser does not support Cross-Origin (CORS) webrequest or Flash as a fallback method");
				} else {
					var id = "cb" + (idCounter++)

					callbacks[id] = function (success, response) {
						delete callbacks[id];
						if (success) {
							self.response = response;
							self.onload();
						} else {
							self.onerror(response);
						}
					}

					// start the web request via flash
					obj.webrequest(id, method, url, data)
				}
			})
		}
	}

	_pio.flashSocketConnection = function (endpoint, connectTimeout, onConnectResult, onDisconnect, onMessage) {
		var id = "cb" + (idCounter++)
		var self = this;
		var serializer = new _pio.messageSerializer();
		var connectComplete = false;
		var connected = false;
		var timeout = setTimeout(function () {
			if (!connectComplete) {
				connectComplete = true;
				onConnectResult(false, "Connect attempt timed out");
			}
		}, connectTimeout);

		this.disconnect = function () { console.log("... this shouldn't happen"); }
		this.sendMessage = function (message) { console.log("... send msg. this shouldn't happen"); }

		getFlashFallbackObj(function (obj) {
			if (obj == null) {
				connectComplete = true;
				onConnectResult(false, "Browser does not support WebSocket connections and the Flash fallback failed.");
			} else {
				callbacks[id] = function (evt, data) {
					switch (evt) {
						case 'onopen':
							if (!connectComplete) {
								clearTimeout(timeout)
								connectComplete = true;
								connected = true;
								obj.socketSend(id, [0]); // protocol selection
								onConnectResult(connected);
							}
							break;
						case 'onclose':
							self.disconnect();
							break;
						case 'onerror':
							self.disconnect();
							break;
						case 'onmessage':
							onMessage(serializer.deserializeMessage(data, 0, data.length))
							break;
					}
				}

				self.disconnect = function () {
					if (connected) {
						connected = false;
						onDisconnect();
						try {
							obj.socketClose(id);
						} catch (e) { _pio.debugLog(e) }
					}
				}

				self.sendMessage = function (message) {
					var serialized = serializer.serializeMessage(message);
					obj.socketSend(id, serialized);
				}

				// start the web request via flash
				obj.socketConnection(id, endpoint)
			}
		})
	}

	_pio.isFlashFallbackEnabled = function (callback) {
		getFlashFallbackObj(function (obj) {
			callback(obj != null);
		})
	}

	var fallbackObj = null;
	var fallbackFailed = false;
	var waitingGetFallbacks = null;

	function getFlashFallbackObj(callback) {
		if (fallbackObj != null) {
			callback(fallbackObj);
		} else if (fallbackFailed) {
			callback(null);
		} else {
			if (waitingGetFallbacks == null) {
				// create the list for future listners
				waitingGetFallbacks = [callback];

				// try to create the flash object
				var tryInterval = setInterval(function () {
					var obj = createFallbackObj();
					if (obj != null) {
						done(obj);
					}
				}, 50);

				// set a timeout to timeout the request if it does not work
				setTimeout(function () {
					if (fallbackObj == null) {
						done(null);
					}
				}, 30000);

				var done = function (obj) {
					fallbackObj = obj;
					fallbackFailed = obj == null;
					clearInterval(tryInterval);
					for (var i = 0; i != waitingGetFallbacks.length; i++) {
						waitingGetFallbacks[i](obj);
					}
				}
			} else {
				waitingGetFallbacks.push(callback);
			}
		}
	}

	function createFallbackObj() {
		var id = "__pio_flashfallback__";
		var containerId = "__pio_flashfallback_container__";
		var html = ""
		html += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="10" height="10" style="$style$" id="$id$">'
		html += '	<param name="movie" value="$src$" />'
		html += '	<param name="allowNetworking" value="all" />'
		html += '	<param name="allowScriptAccess" value="always" />'
		html += '	<!--[if !IE]>-->'
		html += '	<object type="application/x-shockwave-flash" data="$src$" width="10" height="10" style="$style$">'
		html += '		<param name="allowNetworking" value="all" />'
		html += '		<param name="allowScriptAccess" value="always" />'
		html += '	</object>'
		html += '	<!--<![endif]-->'
		html += '</object>'
		html = html.replace(/\$id\$/gi, id);
		html = html.replace(/\$src\$/gi, flashUrl);
		html = html.replace(/\$style\$/gi, "width:10px;height:10px");

		var container = document.getElementById("containerId");
		if (!container) {
			var div = document.createElement("div");
			div.setAttribute("id", container)
			div.setAttribute("style", "position:absolute;top:-20px;left:-20px")
			div.innerHTML = html;
			try {
				document.body.appendChild(div);
			} catch (e) { }
		}

		var find = function (tag) {
			var list = document.getElementsByTagName(tag);
			for (var i = 0; i != list.length; i++) {
				if (list[i].ping && list[i].ping() == "pong") {
					return list[i]
				}
			}
		};

		return find("embed") || find("object");
	}
})();

(function () {
	var c = _pio.channel.prototype;
	c.connect = function(gameId, connectionId, userId, auth, partnerId, playerInsightSegments, clientAPI, clientInfo, successCallback, errorCallback, converter){this.call(10, {gameid:gameId, connectionid:connectionId, userid:userId, auth:auth, partnerid:partnerId, playerinsightsegments:playerInsightSegments, clientapi:clientAPI, clientinfo:clientInfo}, successCallback, errorCallback, converter)}
	_pio.ApiSecurityRule = {RespectClientSetting:0,UseHttp:1,UseHttps:2}
	c.authenticate = function(gameId, connectionId, authenticationArguments, playerInsightSegments, clientAPI, clientInfo, playCodes, successCallback, errorCallback, converter){this.call(13, {gameid:gameId, connectionid:connectionId, authenticationarguments:authenticationArguments, playerinsightsegments:playerInsightSegments, clientapi:clientAPI, clientinfo:clientInfo, playcodes:playCodes}, successCallback, errorCallback, converter)}
	c.createRoom = function(roomId, roomType, visible, roomData, isDevRoom, successCallback, errorCallback, converter){this.call(21, {roomid:roomId, roomtype:roomType, visible:visible, roomdata:roomData, isdevroom:isDevRoom}, successCallback, errorCallback, converter)}
	c.joinRoom = function(roomId, joinData, isDevRoom, successCallback, errorCallback, converter){this.call(24, {roomid:roomId, joindata:joinData, isdevroom:isDevRoom}, successCallback, errorCallback, converter)}
	c.createJoinRoom = function(roomId, roomType, visible, roomData, joinData, isDevRoom, successCallback, errorCallback, converter){this.call(27, {roomid:roomId, roomtype:roomType, visible:visible, roomdata:roomData, joindata:joinData, isdevroom:isDevRoom}, successCallback, errorCallback, converter)}
	c.listRooms = function(roomType, searchCriteria, resultLimit, resultOffset, onlyDevRooms, successCallback, errorCallback, converter){this.call(30, {roomtype:roomType, searchcriteria:searchCriteria, resultlimit:resultLimit, resultoffset:resultOffset, onlydevrooms:onlyDevRooms}, successCallback, errorCallback, converter)}
	c.userLeftRoom = function(extendedRoomId, newPlayerCount, closed, successCallback, errorCallback, converter){this.call(40, {extendedroomid:extendedRoomId, newplayercount:newPlayerCount, closed:closed}, successCallback, errorCallback, converter)}
	c.writeError = function(source, error, details, stacktrace, extraData, successCallback, errorCallback, converter){this.call(50, {source:source, error:error, details:details, stacktrace:stacktrace, extradata:extraData}, successCallback, errorCallback, converter)}
	c.updateRoom = function(extendedRoomId, visible, roomData, successCallback, errorCallback, converter){this.call(53, {extendedroomid:extendedRoomId, visible:visible, roomdata:roomData}, successCallback, errorCallback, converter)}
	_pio.ValueType = {String:0,Int:1,UInt:2,Long:3,Bool:4,Float:5,Double:6,ByteArray:7,DateTime:8,Array:9,Obj:10}
	c.createObjects = function(objects, loadExisting, successCallback, errorCallback, converter){this.call(82, {objects:objects, loadexisting:loadExisting}, successCallback, errorCallback, converter)}
	c.loadObjects = function(objectIds, successCallback, errorCallback, converter){this.call(85, {objectids:objectIds}, successCallback, errorCallback, converter)}
	_pio.LockType = {NoLocks:0,LockIndividual:1,LockAll:2}
	c.saveObjectChanges = function(lockType, changesets, createIfMissing, successCallback, errorCallback, converter){this.call(88, {locktype:lockType, changesets:changesets, createifmissing:createIfMissing}, successCallback, errorCallback, converter)}
	c.deleteObjects = function(objectIds, successCallback, errorCallback, converter){this.call(91, {objectids:objectIds}, successCallback, errorCallback, converter)}
	c.loadMatchingObjects = function(table, index, indexValue, limit, successCallback, errorCallback, converter){this.call(94, {table:table, index:index, indexvalue:indexValue, limit:limit}, successCallback, errorCallback, converter)}
	c.loadIndexRange = function(table, index, startIndexValue, stopIndexValue, limit, successCallback, errorCallback, converter){this.call(97, {table:table, index:index, startindexvalue:startIndexValue, stopindexvalue:stopIndexValue, limit:limit}, successCallback, errorCallback, converter)}
	c.deleteIndexRange = function(table, index, startIndexValue, stopIndexValue, successCallback, errorCallback, converter){this.call(100, {table:table, index:index, startindexvalue:startIndexValue, stopindexvalue:stopIndexValue}, successCallback, errorCallback, converter)}
	c.loadMyPlayerObject = function(successCallback, errorCallback, converter){this.call(103, {}, successCallback, errorCallback, converter)}
	c.payVaultReadHistory = function(page, pageSize, targetUserId, successCallback, errorCallback, converter){this.call(160, {page:page, pagesize:pageSize, targetuserid:targetUserId}, successCallback, errorCallback, converter)}
	c.payVaultRefresh = function(lastVersion, targetUserId, successCallback, errorCallback, converter){this.call(163, {lastversion:lastVersion, targetuserid:targetUserId}, successCallback, errorCallback, converter)}
	c.payVaultConsume = function(ids, targetUserId, successCallback, errorCallback, converter){this.call(166, {ids:ids, targetuserid:targetUserId}, successCallback, errorCallback, converter)}
	c.payVaultCredit = function(amount, reason, targetUserId, successCallback, errorCallback, converter){this.call(169, {amount:amount, reason:reason, targetuserid:targetUserId}, successCallback, errorCallback, converter)}
	c.payVaultDebit = function(amount, reason, targetUserId, successCallback, errorCallback, converter){this.call(172, {amount:amount, reason:reason, targetuserid:targetUserId}, successCallback, errorCallback, converter)}
	c.payVaultBuy = function(items, storeItems, targetUserId, successCallback, errorCallback, converter){this.call(175, {items:items, storeitems:storeItems, targetuserid:targetUserId}, successCallback, errorCallback, converter)}
	c.payVaultGive = function(items, targetUserId, successCallback, errorCallback, converter){this.call(178, {items:items, targetuserid:targetUserId}, successCallback, errorCallback, converter)}
	c.payVaultPaymentInfo = function(provider, purchaseArguments, items, successCallback, errorCallback, converter){this.call(181, {provider:provider, purchasearguments:purchaseArguments, items:items}, successCallback, errorCallback, converter)}
	c.payVaultUsePaymentInfo = function(provider, providerArguments, successCallback, errorCallback, converter){this.call(184, {provider:provider, providerarguments:providerArguments}, successCallback, errorCallback, converter)}
	c.partnerPayTrigger = function(key, count, successCallback, errorCallback, converter){this.call(200, {key:key, count:count}, successCallback, errorCallback, converter)}
	c.partnerPaySetTag = function(partnerId, successCallback, errorCallback, converter){this.call(203, {partnerid:partnerId}, successCallback, errorCallback, converter)}
	c.notificationsRefresh = function(lastVersion, successCallback, errorCallback, converter){this.call(213, {lastversion:lastVersion}, successCallback, errorCallback, converter)}
	c.notificationsRegisterEndpoints = function(lastVersion, endpoints, successCallback, errorCallback, converter){this.call(216, {lastversion:lastVersion, endpoints:endpoints}, successCallback, errorCallback, converter)}
	c.notificationsSend = function(notifications, successCallback, errorCallback, converter){this.call(219, {notifications:notifications}, successCallback, errorCallback, converter)}
	c.notificationsToggleEndpoints = function(lastVersion, endpoints, enabled, successCallback, errorCallback, converter){this.call(222, {lastversion:lastVersion, endpoints:endpoints, enabled:enabled}, successCallback, errorCallback, converter)}
	c.notificationsDeleteEndpoints = function(lastVersion, endpoints, successCallback, errorCallback, converter){this.call(225, {lastversion:lastVersion, endpoints:endpoints}, successCallback, errorCallback, converter)}
	c.gameRequestsSend = function(requestType, requestData, requestRecipients, successCallback, errorCallback, converter){this.call(241, {requesttype:requestType, requestdata:requestData, requestrecipients:requestRecipients}, successCallback, errorCallback, converter)}
	c.gameRequestsRefresh = function(playCodes, successCallback, errorCallback, converter){this.call(244, {playcodes:playCodes}, successCallback, errorCallback, converter)}
	c.gameRequestsDelete = function(requestIds, successCallback, errorCallback, converter){this.call(247, {requestids:requestIds}, successCallback, errorCallback, converter)}
	c.achievementsRefresh = function(lastVersion, successCallback, errorCallback, converter){this.call(271, {lastversion:lastVersion}, successCallback, errorCallback, converter)}
	c.achievementsLoad = function(userIds, successCallback, errorCallback, converter){this.call(274, {userids:userIds}, successCallback, errorCallback, converter)}
	c.achievementsProgressSet = function(achievementId, progress, successCallback, errorCallback, converter){this.call(277, {achievementid:achievementId, progress:progress}, successCallback, errorCallback, converter)}
	c.achievementsProgressAdd = function(achievementId, progressDelta, successCallback, errorCallback, converter){this.call(280, {achievementid:achievementId, progressdelta:progressDelta}, successCallback, errorCallback, converter)}
	c.achievementsProgressMax = function(achievementId, progress, successCallback, errorCallback, converter){this.call(283, {achievementid:achievementId, progress:progress}, successCallback, errorCallback, converter)}
	c.achievementsProgressComplete = function(achievementId, successCallback, errorCallback, converter){this.call(286, {achievementid:achievementId}, successCallback, errorCallback, converter)}
	c.playerInsightRefresh = function(successCallback, errorCallback, converter){this.call(301, {}, successCallback, errorCallback, converter)}
	c.playerInsightSetSegments = function(segments, successCallback, errorCallback, converter){this.call(304, {segments:segments}, successCallback, errorCallback, converter)}
	c.playerInsightTrackInvitedBy = function(invitingUserId, invitationChannel, successCallback, errorCallback, converter){this.call(307, {invitinguserid:invitingUserId, invitationchannel:invitationChannel}, successCallback, errorCallback, converter)}
	c.playerInsightTrackEvents = function(events, successCallback, errorCallback, converter){this.call(311, {events:events}, successCallback, errorCallback, converter)}
	c.playerInsightTrackExternalPayment = function(currency, amount, successCallback, errorCallback, converter){this.call(314, {currency:currency, amount:amount}, successCallback, errorCallback, converter)}
	c.playerInsightSessionKeepAlive = function(successCallback, errorCallback, converter){this.call(317, {}, successCallback, errorCallback, converter)}
	c.playerInsightSessionStop = function(successCallback, errorCallback, converter){this.call(320, {}, successCallback, errorCallback, converter)}
	c.oneScoreLoad = function(userIds, successCallback, errorCallback, converter){this.call(351, {userids:userIds}, successCallback, errorCallback, converter)}
	c.oneScoreSet = function(score, successCallback, errorCallback, converter){this.call(354, {score:score}, successCallback, errorCallback, converter)}
	c.oneScoreAdd = function(score, successCallback, errorCallback, converter){this.call(357, {score:score}, successCallback, errorCallback, converter)}
	c.oneScoreRefresh = function(successCallback, errorCallback, converter){this.call(360, {}, successCallback, errorCallback, converter)}
	c.simpleConnect = function(gameId, usernameOrEmail, password, playerInsightSegments, clientAPI, clientInfo, successCallback, errorCallback, converter){this.call(400, {gameid:gameId, usernameoremail:usernameOrEmail, password:password, playerinsightsegments:playerInsightSegments, clientapi:clientAPI, clientinfo:clientInfo}, successCallback, errorCallback, converter)}
	c.simpleRegister = function(gameId, username, password, email, captchaKey, captchaValue, extraData, partnerId, playerInsightSegments, clientAPI, clientInfo, successCallback, errorCallback, converter){this.call(403, {gameid:gameId, username:username, password:password, email:email, captchakey:captchaKey, captchavalue:captchaValue, extradata:extraData, partnerid:partnerId, playerinsightsegments:playerInsightSegments, clientapi:clientAPI, clientinfo:clientInfo}, successCallback, errorCallback, converter)}
	c.simpleRecoverPassword = function(gameId, usernameOrEmail, successCallback, errorCallback, converter){this.call(406, {gameid:gameId, usernameoremail:usernameOrEmail}, successCallback, errorCallback, converter)}
	c.kongregateConnect = function(gameId, userId, gameAuthToken, playerInsightSegments, clientAPI, clientInfo, successCallback, errorCallback, converter){this.call(412, {gameid:gameId, userid:userId, gameauthtoken:gameAuthToken, playerinsightsegments:playerInsightSegments, clientapi:clientAPI, clientinfo:clientInfo}, successCallback, errorCallback, converter)}
	c.simpleGetCaptcha = function(gameId, width, height, successCallback, errorCallback, converter){this.call(415, {gameid:gameId, width:width, height:height}, successCallback, errorCallback, converter)}
	c.facebookOAuthConnect = function(gameId, accessToken, partnerId, playerInsightSegments, clientAPI, clientInfo, successCallback, errorCallback, converter){this.call(418, {gameid:gameId, accesstoken:accessToken, partnerid:partnerId, playerinsightsegments:playerInsightSegments, clientapi:clientAPI, clientinfo:clientInfo}, successCallback, errorCallback, converter)}
	c.steamConnect = function(gameId, steamAppId, steamSessionTicket, playerInsightSegments, clientAPI, clientInfo, successCallback, errorCallback, converter){this.call(421, {gameid:gameId, steamappid:steamAppId, steamsessionticket:steamSessionTicket, playerinsightsegments:playerInsightSegments, clientapi:clientAPI, clientinfo:clientInfo}, successCallback, errorCallback, converter)}
	c.simpleUserGetSecureLoginInfo = function(successCallback, errorCallback, converter){this.call(424, {}, successCallback, errorCallback, converter)}
	c.joinCluster = function(clusterAccessKey, isDevelopmentServer, ports, machineName, version, machineId, os, cpu, cpuCores, cpuLogicalCores, cpuAddressWidth, cpuMaxClockSpeed, ramMegabytes, ramSpeed, successCallback, errorCallback, converter){this.call(504, {clusteraccesskey:clusterAccessKey, isdevelopmentserver:isDevelopmentServer, ports:ports, machinename:machineName, version:version, machineid:machineId, os:os, cpu:cpu, cpucores:cpuCores, cpulogicalcores:cpuLogicalCores, cpuaddresswidth:cpuAddressWidth, cpumaxclockspeed:cpuMaxClockSpeed, rammegabytes:ramMegabytes, ramspeed:ramSpeed}, successCallback, errorCallback, converter)}
	c.serverHeartbeat = function(serverId, appDomains, serverTypes, machineCPU, processCPU, memoryUsage, avaliableMemory, freeMemory, runningRooms, usedResources, aPIRequests, aPIRequestsError, aPIRequestsFailed, aPIRequestsExecuting, aPIRequestsQueued, aPIRequestsTime, serverUnixTimeUtc, successCallback, errorCallback, converter){this.call(510, {serverid:serverId, appdomains:appDomains, servertypes:serverTypes, machinecpu:machineCPU, processcpu:processCPU, memoryusage:memoryUsage, avaliablememory:avaliableMemory, freememory:freeMemory, runningrooms:runningRooms, usedresources:usedResources, apirequests:aPIRequests, apirequestserror:aPIRequestsError, apirequestsfailed:aPIRequestsFailed, apirequestsexecuting:aPIRequestsExecuting, apirequestsqueued:aPIRequestsQueued, apirequeststime:aPIRequestsTime, serverunixtimeutc:serverUnixTimeUtc}, successCallback, errorCallback, converter)}
	c.getGameAssemblyUrl = function(clusterAccessKey, gameCodeId, machineId, successCallback, errorCallback, converter){this.call(513, {clusteraccesskey:clusterAccessKey, gamecodeid:gameCodeId, machineid:machineId}, successCallback, errorCallback, converter)}
	c.devServerLogin = function(username, password, successCallback, errorCallback, converter){this.call(524, {username:username, password:password}, successCallback, errorCallback, converter)}
	c.webserviceOnlineTest = function(successCallback, errorCallback, converter){this.call(533, {}, successCallback, errorCallback, converter)}
	c.getServerInfo = function(machineId, successCallback, errorCallback, converter){this.call(540, {machineid:machineId}, successCallback, errorCallback, converter)}
	c.socialRefresh = function(successCallback, errorCallback, converter){this.call(601, {}, successCallback, errorCallback, converter)}
	c.socialLoadProfiles = function(userIds, successCallback, errorCallback, converter){this.call(604, {userids:userIds}, successCallback, errorCallback, converter)}
})();

/**
* @class Instances of this class are returned in all error callbacks and contain information about the error that occurred.
* @example Here is an example of authenticating and then handling an UnknownGame error:
* <listing>
* PlayerIO.authenticate(
* 	'[Enter your game id here]',	//Game id
* 	'public',						//Connection id
* 	{ userId: 'user-id' },			//Authentication arguments
* 	{ campaign: '2017' },			//Optional PlayerInsight segments
* 	function(client) {
* 		//Success!
* 		//You can now use the client object to make API calls.
* 	},
* 	function(error) {
* 		if (error.code == PlayerIOErrorCode.UnknownGame) {
* 			//Unknown game id used
* 		} else {
* 			//Another error
* 		}
* 	}
* );
* </listing>
*/
PlayerIOError = function (code, message, stack) {
	/** The PlayerIO error code for this error
	* @type string
	*/
	this.code = code

	/** The error message for this error
	* @type string
	*/
	this.message = message

	/** The stack for this error, if any. The type depends on the current browser.
	* @type object
	*/
	this.stack = stack
	if (!this.stack) {
		var e = new Error()
		this.stack = e.stack || e.stacktrace || e.StackTrace
	}

	/** Get a string representation of error
	* @return string */
	this.toString = function () {
		return "PlayerIOError[" + code + "]: " + message;
	}
};
PlayerIOError.prototype = new Error();

/**
* @class This class contains a list of all the error codes that can be returned from PlayerIO calls
* @example Here is an example of authenticating and then handling an UnknownGame error:
* <listing>
* PlayerIO.authenticate(
* 	'[Enter your game id here]',	//Game id
* 	'public',						//Connection id
* 	{ userId: 'user-id' },			//Authentication arguments
* 	{ campaign: '2017' },			//Optional PlayerInsight segments
* 	function(client) {
* 		//Success!
* 		//You can now use the client object to make API calls.
* 	},
* 	function(error) {
* 		if (error.code == PlayerIOErrorCode.UnknownGame) {
* 			//Unknown game id used
* 		} else {
* 			//Another error
* 		}
* 	}
* );
* </listing>
*/
PlayerIOErrorCode = {
	/** The method requested is not supported */
	UnsupportedMethod:"UnsupportedMethod",
	/** A general error occurred */
	GeneralError:"GeneralError",
	/** An unexpected error occurred inside the Player.IO webservice. Please try again. */
	InternalError:"InternalError",
	/** Access is denied */
	AccessDenied:"AccessDenied",
	/** The message is malformatted */
	InvalidMessageFormat:"InvalidMessageFormat",
	/** A value is missing */
	MissingValue:"MissingValue",
	/** A game is required to do this action */
	GameRequired:"GameRequired",
	/** An error occurred while contacting an external service */
	ExternalError:"ExternalError",
	/** The given argument value is outside the range of allowed values. */
	ArgumentOutOfRange:"ArgumentOutOfRange",
	/** The game has been disabled, most likely because of missing payment. */
	GameDisabled:"GameDisabled",
	/** The game requested is not known by the server */
	UnknownGame:"UnknownGame",
	/** The connection requested is not known by the server */
	UnknownConnection:"UnknownConnection",
	/** The auth given is invalid or malformatted */
	InvalidAuth:"InvalidAuth",
	/** There is no server in any of the selected server clusters for the game that are eligible to start a new room in (they're all at full capacity or there are no servers in any of the clusters). Either change the selected clusters for your game in the admin panel, try again later or start some more servers for one of your clusters. */
	NoServersAvailable:"NoServersAvailable",
	/** The room data for the room was over the allowed size limit */
	RoomDataTooLarge:"RoomDataTooLarge",
	/** You are unable to create room because there is already a room with the specified id */
	RoomAlreadyExists:"RoomAlreadyExists",
	/** The game you're connected to does not have a room type with the specified name */
	UnknownRoomType:"UnknownRoomType",
	/** There is no room running with that id */
	UnknownRoom:"UnknownRoom",
	/** You can't join the room when the RoomID is null or the empty string */
	MissingRoomId:"MissingRoomId",
	/** The room already has the maxmium amount of users in it. */
	RoomIsFull:"RoomIsFull",
	/** The key you specified is not set as searchable. You can change the searchable keys in the admin panel for the server type */
	NotASearchColumn:"NotASearchColumn",
	/** The QuickConnect method (simple, facebook, kongregate...) is not enabled for the game. You can enable the various methods in the admin panel for the game */
	QuickConnectMethodNotEnabled:"QuickConnectMethodNotEnabled",
	/** The user is unknown */
	UnknownUser:"UnknownUser",
	/** The password supplied is incorrect */
	InvalidPassword:"InvalidPassword",
	/** The supplied data is incorrect */
	InvalidRegistrationData:"InvalidRegistrationData",
	/** The key given for the BigDB object is not a valid BigDB key. Keys must be between 1 and 50 characters. Only letters, numbers, hyphens, underbars, and spaces are allowed. */
	InvalidBigDBKey:"InvalidBigDBKey",
	/** The object exceeds the maximum allowed size for BigDB objects. */
	BigDBObjectTooLarge:"BigDBObjectTooLarge",
	/** Could not locate the database object. */
	BigDBObjectDoesNotExist:"BigDBObjectDoesNotExist",
	/** The specified table does not exist. */
	UnknownTable:"UnknownTable",
	/** The specified index does not exist. */
	UnknownIndex:"UnknownIndex",
	/** The value given for the index, does not match the expected type. */
	InvalidIndexValue:"InvalidIndexValue",
	/** The operation was aborted because the user attempting the operation was not the original creator of the object accessed. */
	NotObjectCreator:"NotObjectCreator",
	/** The key is in use by another database object */
	KeyAlreadyUsed:"KeyAlreadyUsed",
	/** BigDB object could not be saved using optimistic locks as it's out of date. */
	StaleVersion:"StaleVersion",
	/** Cannot create circular references inside database objects */
	CircularReference:"CircularReference",
	/** The server could not complete the heartbeat */
	HeartbeatFailed:"HeartbeatFailed",
	/** The game code is invalid */
	InvalidGameCode:"InvalidGameCode",
	/** Cannot access coins or items before vault has been loaded. Please refresh the vault first. */
	VaultNotLoaded:"VaultNotLoaded",
	/** There is no PayVault provider with the specified id */
	UnknownPayVaultProvider:"UnknownPayVaultProvider",
	/** The specified PayVault provider does not support direct purchase */
	DirectPurchaseNotSupportedByProvider:"DirectPurchaseNotSupportedByProvider",
	/** The specified PayVault provider does not support buying coins */
	BuyingCoinsNotSupportedByProvider:"BuyingCoinsNotSupportedByProvider",
	/** The user does not have enough coins in the PayVault to complete the purchase or debit. */
	NotEnoughCoins:"NotEnoughCoins",
	/** The item does not exist in the vault. */
	ItemNotInVault:"ItemNotInVault",
	/** The chosen provider rejected one or more of the purchase arguments */
	InvalidPurchaseArguments:"InvalidPurchaseArguments",
	/** The chosen provider is not configured correctly in the admin panel */
	InvalidPayVaultProviderSetup:"InvalidPayVaultProviderSetup",
	/** Unable to locate the custom PartnerPay action with the given key */
	UnknownPartnerPayAction:"UnknownPartnerPayAction",
	/** The given type was invalid */
	InvalidType:"InvalidType",
	/** The index was out of bounds from the range of acceptable values */
	IndexOutOfBounds:"IndexOutOfBounds",
	/** The given identifier does not match the expected format */
	InvalidIdentifier:"InvalidIdentifier",
	/** The given argument did not have the expected value */
	InvalidArgument:"InvalidArgument",
	/** This client has been logged out */
	LoggedOut:"LoggedOut",
	/** The given segment was invalid. */
	InvalidSegment:"InvalidSegment",
	/** Cannot access requests before Refresh() has been called. */
	GameRequestsNotLoaded:"GameRequestsNotLoaded",
	/** Cannot access achievements before Refresh() has been called. */
	AchievementsNotLoaded:"AchievementsNotLoaded",
	/** Cannot find the achievement with the specified id. */
	UnknownAchievement:"UnknownAchievement",
	/** Cannot access notification endpoints before Refresh() has been called. */
	NotificationsNotLoaded:"NotificationsNotLoaded",
	/** The given notifications endpoint is invalid */
	InvalidNotificationsEndpoint:"InvalidNotificationsEndpoint",
	/** There is an issue with the network */
	NetworkIssue:"NetworkIssue",
	/** Cannot access OneScore before Refresh() has been called. */
	OneScoreNotLoaded:"OneScoreNotLoaded",
	/** The Publishing Network features are only avaliable when authenticated to PlayerIO using Publishing Network authentication. Authentication methods are managed in the connections setting of your game in the admin panel on PlayerIO. */
	PublishingNetworkNotAvailable:"PublishingNetworkNotAvailable",
	/** Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first. */
	PublishingNetworkNotLoaded:"PublishingNetworkNotLoaded",
	/** The dialog was closed by the user */
	DialogClosed:"DialogClosed",
	/** Check cookie required. */
	AdTrackCheckCookie:"AdTrackCheckCookie",
	codes:{0:"UnsupportedMethod",1:"GeneralError",2:"InternalError",3:"AccessDenied",4:"InvalidMessageFormat",5:"MissingValue",6:"GameRequired",7:"ExternalError",8:"ArgumentOutOfRange",9:"GameDisabled",10:"UnknownGame",11:"UnknownConnection",12:"InvalidAuth",13:"NoServersAvailable",14:"RoomDataTooLarge",15:"RoomAlreadyExists",16:"UnknownRoomType",17:"UnknownRoom",18:"MissingRoomId",19:"RoomIsFull",20:"NotASearchColumn",21:"QuickConnectMethodNotEnabled",22:"UnknownUser",23:"InvalidPassword",24:"InvalidRegistrationData",25:"InvalidBigDBKey",26:"BigDBObjectTooLarge",27:"BigDBObjectDoesNotExist",28:"UnknownTable",29:"UnknownIndex",30:"InvalidIndexValue",31:"NotObjectCreator",32:"KeyAlreadyUsed",33:"StaleVersion",34:"CircularReference",40:"HeartbeatFailed",41:"InvalidGameCode",50:"VaultNotLoaded",51:"UnknownPayVaultProvider",52:"DirectPurchaseNotSupportedByProvider",54:"BuyingCoinsNotSupportedByProvider",55:"NotEnoughCoins",56:"ItemNotInVault",57:"InvalidPurchaseArguments",58:"InvalidPayVaultProviderSetup",70:"UnknownPartnerPayAction",80:"InvalidType",81:"IndexOutOfBounds",82:"InvalidIdentifier",83:"InvalidArgument",84:"LoggedOut",90:"InvalidSegment",100:"GameRequestsNotLoaded",110:"AchievementsNotLoaded",111:"UnknownAchievement",120:"NotificationsNotLoaded",121:"InvalidNotificationsEndpoint",130:"NetworkIssue",131:"OneScoreNotLoaded",200:"PublishingNetworkNotAvailable",201:"PublishingNetworkNotLoaded",301:"DialogClosed",302:"AdTrackCheckCookie"}
};

(function () {
	/**
	* @class 
	* An instance of this class is returned after successfully authenticating a user to PlayerIO.
	* It contains the id of the current user, and methods for making all API calls on behalf of that user.
	* @example Authenticate and create a BigDB Object
	* <listing>
	* PlayerIO.authenticate(
	*	"[Enter your game id here]",
	*	"public",						//Default Basic connection
	*	{ userId:'user-id' },			//Basic auth only requires a user id
	*	{},								//Optional PlayerInsight segments
	*	function(client) {
	*		//The user was successfully authenticated, we can now access the various PlayerIO services:
	*		var obj = { name:"Charlie", age:20 };
	*		client.bigDB.createObject("Users", client.connectUserId, obj, function(dbObj) {
	*			dbObj.location = 'Paris';
	*			dbObj.save();
	*		});
	*	},
	*	function(error){
	*		//Something went wrong while authenticating.
	*		console.log(error);
	*	}
	* );
	* </listing>
	*/
	_pio.client = function (channel, gameId, gameFsRedirectMap, userId) {
		/**
		* User id of the currently connected user 
		* @type string
		*/
		this.connectUserId = userId;

		/**
		* The game id of the client 
		* @type string
		*/
		this.gameId = gameId;

		/**
		* The GameFS service
		* @type gameFS
		*/
		this.gameFS = new _pio.gameFS(gameId, gameFsRedirectMap);

		/**
		* The ErrorLog service
		* @type errorLog
		*/
		this.errorLog = new _pio.errorLog(channel);

		/**
		* The PayVault service
		* @type payVault
		*/
		this.payVault = new _pio.payVault(channel);

		/**
		* The BigDB service
		* @type bigDB
		*/
		this.bigDB = new _pio.bigDB(channel);

		/**
		* The Multiplayer service
		* @type multiplayer
		*/
		this.multiplayer = new _pio.multiplayer(channel);

		/**
		* The GameRequests service
		* @type gameRequests
		*/
		this.gameRequests = new _pio.gameRequests(channel);

		/**
		* The Achievements service
		* @type achievements
		*/
		this.achievements = new _pio.achievements(channel);

		/**
		* The PlayerInsight service
		* @type playerInsight
		*/
		this.playerInsight = new _pio.playerInsight(channel);

		/**
		* The OneScore service
		* @type oneScore
		*/
		this.oneScore = new _pio.oneScore(channel);

		/**
		* The Notifications service
		* @type notifications
		*/
		this.notifications = new _pio.notifications(channel);

		/**
		* The PlayerIO Publishing Network service
		* @type publishingNetwork
		*/
		this.publishingNetwork = new _pio.publishingNetwork(channel, this.connectUserId);
	}
})();
(function () {
	var maps = {}
	/**
	* @class The GameFS service. This class is used to get an absolute URL for assets you have stored in GameFS.
	* @example Example of how to request the file game.swf from your games GameFS via PlayerIO
	* <listing>
	* 	var url = PlayerIO.gameFS("[Enter your game id here]").getURL("game.swf");
	* </listing>
	* 
	* @example Example of how to request the file game.swf from your games GameFS via client
	* <listing>
	* 	var url = client.gameFS.getURL("game.swf");
	* </listing>
	*/
	_pio.gameFS = function(gameId, redirectMap){
		if( typeof(redirectMap) == 'string' && redirectMap.length>0 ){
			var parts = (redirectMap||"").split("|");	
			if( parts.length >= 1 ){
				var map = maps[gameId.toLowerCase()] = {}
				for(var i=0;i!=parts.length;i++){
					var part = parts[i];
					if(part =="alltoredirect" || part == "cdnmap"){
						map.baseUrl = parts[i+1];
					}else if( part == "alltoredirectsecure" || part == "cdnmapsecure" ){
						map.secureBaseUrl = parts[i+1];
					}else{
						map["."+part] = parts[i+1];
					}
				}
			}
		}

		/**
		 * Converts a GameFS path (like '/mygame.swf') into a full url, that can be downloaded over the internet.
		 * Important! Do not save or otherwise persist (bigdb, cookies, etc) the returned url, since the url will change over time.
		 * @param {string} path The path of the file in the GameFS, including the initial slash. Examples: '/mygame.swf' or '/characters/bob.jpg'
		 * @param {boolean} secure If true, this method returns a secure (https) url.
		 * @return {string} An url that can be used to download the resource over the internet.
		 */
		this.getUrl = function (path, secure) {
			if(!path[0] == "/") {
				throw _pio.error("The path given to getUrl must start with a slash, like: '/myfile.swf' or '/folder/file.jpg'");
			}
			var map = maps[gameId];
			if( map ){
				return (secure ? map.secureBaseUrl : map.baseUrl) + (map["."+path] || path);
			}else{
				return (secure ? "https" : "http") + "://r.playerio.com/r/" + gameId + path;
			}
		}
	}
})();
(function () {
	/**
	* @class The GameRequest service. This class has methods for sending game requests to other users, and for
	* handling the requests received by the current user. All game request types have to be defined in the admin panel first.
	* @example Refresh local requests
	* <listing>
	* client.gameRequests.refresh(function() {
	*	for (var i = 0; i != client.gameRequests.waitingRequests.length; i++) {
	*		var request = client.gameRequests.waitingRequests[i];
	*		console.log(request.id)
	*		console.log(request.type)
	*		console.log(request.senderUserId)
	*		console.log(request.created)
	*		console.log(request.data)
	*	}
	* }, function(error) {
	*     console.log(error);
	* });
	* </listing>

	* @example Send a game request to another player
	* <listing>
	* client.gameRequests.send(
	*	'invite',						//Type
	*	{ game: "poker", bonus: 5 },	//Extra data
	*	['userid1', 'userid2'],			//Recipients
	*	function () {
	*		//Success
	*	}, function(error) { 
	*		console.log(error);
	*	}
	* );
	* </listing>

	* @example Delete all waiting requests
	* <listing>
	* client.gameRequests.delete(client.gameRequests.waitingRequests, function () {
	*	//Success, all waiting requests have been deleted.
	* }, function(error) { 
	*     console.log(error);
	* });
	* </listing>
	*/
	_pio.gameRequests = function (channel) {
		var _playCodes = [];

		/** The list of waiting requests for the current user. You must call refresh() first to initialize this list.
		* @type gameRequest[]
		*/
		this.waitingRequests = "[ERROR: You tried to access gameRequests.waitingRequests before loading waiting requests. You have to call the refresh method first.]";
		var self = this;

		/**
		* Send a GameRequest to the specified recipients.
		* @param {number} requestType The request type of the request to send.
		* @param {object} requestData Data that will be available to the recipient of the request with information about the request. Useful for passing any kind of data to the recipient.
		* @param {string[]} requestRecipients The recipients to send this request to.
		* @param {function()} successCallback Callback function that will be called when the request has been sent.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.send = function (requestType, requestData, requestRecipients, successCallback, errorCallback) {
			channel.gameRequestsSend(requestType, _pio.convertToKVArray(requestData), requestRecipients, successCallback, errorCallback, function (result) {
				//...
			});
		}

		/**
		* Refresh the list of received requests.
		* @param {function()} successCallback Callback function that will be called when the refresh is complete
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.refresh = function (successCallback, errorCallback) {
			channel.gameRequestsRefresh(_playCodes, successCallback, errorCallback, function (result) {
				self._playCodes = result.newplaycodes;
				self.waitingRequests = readRequests(result.requests);
				var foo = result.morerequestswaiting;
			});
		}

		/**
		* Delete the given requests. Will also update the waitingRequests property after deletion is complete.
		* @param {gameRequest[]} requests The list of requests to delete.
		* @param {function()} successCallback Callback function that will be called when the delete has been completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.delete = function (requests, successCallback, errorCallback) {
			if (typeof (requests) != 'object' && !requests.length) {
				var e = _pio.error("The first argument to delete should be an array: client.gameRequests.delete([requests], ...)");
				_pio.handleError(e, errorCallback, e.code, e.message);
				return;
			}

			var ids = [];
			for (var i = 0; i != requests.length; i++) {
				var id = requests[i].id;
				if (id) {
					ids.push(id);
				} else {
					var e = _pio.error("No GameRequest id found on item#" + i + ". You have to use requests from the gameRequests.waitingRequests array. For instance: client.gameRequests.delete(client.gameRequests.waitingRequests, ...)");
					_pio.handleError(e, errorCallback, e.code, e.message);
					return;
				}
			}
			channel.gameRequestsDelete(ids, successCallback, errorCallback, function (result) {
				self.waitingRequests = readRequests(result.requests);
				var foo = result.morerequestswaiting;
			});
		}
		
		function readRequests(requests) {
			if (requests == null || requests.length == 0) { return []; }
			var arr = [];
			for (var i = 0; i != requests.length; i++) {
				var item = requests[i];
				arr.push(new _pio.gameRequest(item.id, item.type, item.senderuserid, item.created, item.data));
			}
			return arr;
		}
	}

	/**
	* @class This class encapsulates all the data of a received game request.
	*/
	_pio.gameRequest = function (id, type, senderUserId, created, data) {
		/** The id of this request.
		* @type string
		*/
		this.id = id;
		/** The type of this request.
		* @type string
		*/
		this.type = type;
		/** The sender user id of this request.
		* @type string
		*/
		this.senderUserId = senderUserId;
		/** When this request was created. 
		* @type Date
		*/
		this.created = new Date(created);
		/** The custom data that was passed in when this request was created
		* @type object
		*/
		this.data = _pio.convertFromKVArray(data);
	}
})();
(function () {
	/**
	* @class The ErrorLog service. This class has methods for writing custom errors to your game's error log.
	* You can browse your game's error log in the PlayerIO admin panel.
	* @example Writing an error to the error log
	* <listing>
	* client.errorLog.writeError(
	*	"Could not perform action", 
	*	"time: "+(new Date()).getTime(), 
	*	err.stack, 
	*	{name:'john'}
	* );
	* </listing>
	*/
	_pio.errorLog = function (channel) {
		/**
		* Writes an entry to the error log
		* @param {string} error A short string describing the error without details. Example 'Object not set to instance of an object'
		* @param {string} details The message describing the error in detail. Example 'couldn't find the user 'bob' in the current game'
		* @param {string} stacktrace The stacktrace (if available) of the error
		* @param {object} extraData Any extra data you'd like to associate with the error log entry. Example: {score:200, level:'skyland'}
		*/
		this.writeError = function(error, details, stacktrace, extradata){
			channel.writeError("Javascript", error, details, stacktrace, _pio.convertToKVArray(extradata));
		}
	}
})();

(function () {
	/**
	* @class The QuickConnect service. This class is used for support methods for users created and authenticated
	* through the Simple Users feature.
	* @example Here's an example on how to fetch a captcha for display, and submitting it when registering a Simple User.
	* <listing>
	* //Fetch a captcha
	* PlayerIO.quickConnect.simpleGetCaptcha(
	*	"[your-game-id-here]", 
	*	200,									//Image width
	*	100,									//Image height
	*	function (captcha) {
	* 		var url = captcha.captchaImageUrl;	//Display this in the user registration form
	* 		var key = captcha.captchaKey;		//Save this for later
	*	}, function (error) {
	* 		console.log(error);
	*	}
	* );
	* 
	* 
	* //After the user has submitted the registration form, register a new Simple User:
	* PlayerIO.authenticate(
	* 	"[Enter your game id here]",
	* 	"public",									//A connection with the authentication type SimpleUsers
	* 	{
	* 		register: "true",
	* 		username: "[The username]",
	* 		password: "[The password]",
	* 		email: "[The email address]",
	* 		captchaKey: key,						//The captcha key we got earlier
	* 		captchaValue:"[The captcha value]",		//What the user entered
	* 	},
	* 	{},
	* 	function (client) {
	* 		//Success!
	* 		//The user is now registered and connected.
	* 	},
	* 	function (error) {
	* 		//Error registering.
	* 		//Check error.message to find out in what way it failed,
	* 		//if any registration data was missing or invalid, or if
	* 		//the entered captcha value didn't match the captcha image.
	* 	}
	* );
	* </listing>
	*/
	_pio.quickConnect = function () {
		/**
		* Creates a Captcha image and key, to be used for registrations where the added security of Captcha is required.
		* @param {string} gameId The game id of the game you wish to make a captcha for. This value can be found in the admin panel.
		* @param {number} width The width of the Captcha image.
		* @param {number} height The height of the Captcha image.
		* @param {function(simpleGetCaptchaOutput)} successCallback Callback function that will be called with the captcha information
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.simpleGetCaptcha = function (gameId, width, height, successCallback, errorCallback) {
			var channel = new _pio.channel();
			channel.simpleGetCaptcha(gameId, width, height, successCallback, errorCallback, function (result) {
				return new _pio.simpleGetCaptchaOutput(result.captchakey, result.captchaimageurl);
			})
		}

		/**
		* Initiates the password recovery process for a user by sending him an email. The user must have supplied an email address during registration.
		* @param {string} gameId The game id of the game the user is registered in.
		* @param {string} usernameOrEmail The username or email address of the user that wishes to recover his password.
		* @param {function()} successCallback Callback function that will be called when the recovery e-mail has been sent
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.simpleRecoverPassword = function (gameId, usernameOrEmail, successCallback, errorCallback) {
			var channel = new _pio.channel();
			channel.simpleRecoverPassword(gameId, usernameOrEmail, successCallback, errorCallback, function (result) {})
		}
	}

	/**
	* @class Captcha information for the QuickConnect simple users feature.
	*/
	_pio.simpleGetCaptchaOutput = function (captchaKey, captchaImageUrl) {
		/** The key for this captcha image. This value must be kept and sent to the PlayerIO.authenticate() method along with the input from the user.
		* @type string
		*/
		this.captchaKey = captchaKey;

		/** An url for the captcha image. You must show the image to the user, and ask what text is shown in the image
		* @type string
		*/
		this.captchaImageUrl = captchaImageUrl;
	}

	PlayerIO.quickConnect = new _pio.quickConnect();
})();
(function () {
	/**
	* @class The PayVault service.
	* Instances of this class represent a specific user's Vault, and contains methods and properties both for inspecting and manipulating the contents.
	* All properties and methods that inspect the Vault requires that it is up-to-date first. This can be achieved explicitly by calling the refresh() method
	* or implicitly by calling any method which modifies the Vault such as credit() or debit().
	* @example Here is how to read the Coins balance:
	* <listing>
	* client.payVault.refresh(function() {
	*	var coins = client.payVault.coins;
	* }, function(error) { console.log(error); });
	* </listing>
	* 
	* @example This is how to list all items in a vault:
	* <listing>
	* client.payVault.refresh(function() {
	*	for (var i = 0; i != client.payVault.items.length; i++) {
	*		var item = client.payVault.items[i];
	*		console.log(item.itemkey);
	*		console.log(item.purchaseDate);
	*		console.log(item.id);
	*	}
	* }, function(error) { console.log(error); });
	* </listing>
	* 
	* @example This is how you check if an item exists:
	* <listing>
	* client.payVault.refresh(function() {
	*	if (client.payVault.has('simplecar')) {
	*		//Vault contains at least one item of type 'simplecar'.
	*	}
	* }, function(error) { console.log(error); });
	* </listing>
	* 
	* @example Credit and Debit can be used like this:
	* <listing>
	* client.payVault.credit(100, 'New player bonus', function() {
	*	var newcoins = client.payVault.coins;
	* 	//Show new amount to user...
	* }, function(error) { console.log(error); });
	* 
	* client.payVault.debit(10, 'Race starting fee', function() {
	*	//Let player start race...
	* }, function(error) { 
	*	//Something went wrong, or the user doesn't have enough coins in his Vault.
	*	console.log(error); 
	* });
	* </listing>
	* 
	* @example Buying items with Coins is really easy. This requires that you have created an item in the PayVaultItems table in BigDB with the key "speedboost", and a property "PriceCoins" containing the price.
	* <listing>
	* client.payVault.buy(true, [{itemkey:'speedboost'}], function() {
	*	var boosts = client.payVault.count('speedboost');
	*	//Show new number of boosts to user.
	* }, function(error) {
	*	//Something went wrong, or the user couldn't afford the item.
	*	console.log(error); 
	* });
	* </listing>
	* 
	* @example And here's how to consume an item:
	* <listing>
	* client.payVault.refresh(function() {
	*	var boost = client.payVault.first('speedboost');
	*	client.payVault.consume([boost], function(){
	*		//Boost the player's car
	*	})
	* }, function(error) { console.log(error); });
	* </listing>
	* 
	* @example When it's time for a user to add more Coins, you can do it like this:
	* <listing>
	* client.payVault.getBuyCoinsInfo(
	*	'paypal',							//PayVault provider
	*	{ 
	*		coinamount: 1000,				//Provider-specific arguments
	*		currency:'USD',
	*		item_name:'1000 Coins'
	*	}, 
	*	function(result){
	*		var url = result.paypalurl;		//Provider-specific result
	*		//Show url to user
	*	}, function(error) {
	*		console.log(error);
	*	}
	* );
	* </listing>
	* 
	* @example And this is how to let the user buy an item directly. This requires that you have created an item in the PayVaultItems table in BigDB with the key "supercar", and a property "PriceUSD" containing the price.
	* <listing>
	* client.payVault.getBuyDirectInfo(
	*	'paypal',							//PayVault provider
	*	{
	*		currency:'USD',					//Provider-specific arguments
	*		item_name:'Red Supercar'
	*	},
	*	[{									//Array of items to buy.
	*		itemkey:'supercar',				//Item key
	*		color:'red'						//Optional payload
	*	}], 
	*	function(result){					//Provider-specific result
	*		var url = result.paypalurl;
	*		// show url to player...
	*	}, function(error) { 
	*		console.log(error); 
	*	}
	* );
	* </listing>
	* 
	* @example Finally, there are methods for retrieving the payment history of a user:
	* <listing>
	* client.payVault.readHistory(1, 10, function(historyEntries){
	*	if (historyEntries.length > 0) {
	* 		var lastprice = historyEntries[0].providerPrice;
	* 	}
	* }, function(error) { console.log(error); });
	* </listing>
	*/
	_pio.payVault = function (channel) {
		var currentVersion = null;

		/** The number of coins in this user's Vault. You must call refresh() first to initialize this value.
		* @type Number
		*/
		this.coins = "[ERROR: you tried to access payVault.coins before the vault was loaded. You have to refresh the vault before the .coins property is set to the right value]";
		/** The list of items in this user's Vault. You must call refresh() first to initialize this value.
		* @type Number
		*/
		this.items = "[ERROR: you tried to access payVault.items before the vault was loaded. You have to refresh the vault before the .items property is set to the right value]";

		/**
		* This method checks if the Vault contains at least one item of the given itemKey. This method can only be called on an up-to-date vault.
		* @param {string} itemKey The itemKey to check for.
		* @return {boolean} True if the user has at least one item of the given type (itemKey).
		*/
		this.has = function (itemKey) {
			if (currentVersion == null) { throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded, "Cannot access items before vault has been loaded. Please refresh the vault first"); }
			for (var i = 0; i != this.items.length; i++) {
				if (this.items[i].itemKey == itemKey) {
					return true;
				}
			}
			return false;
		}

		/**
		* Returns the first item of the given itemKey from this Vault. This method can only be called on an up-to-date vault.
		* @param {string} itemKey The itemKey of the item to get.
		* @return {number} A VaultItem if one was found, or null if not.
		*/
		this.first = function (itemKey) {
			if (currentVersion == null) { throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded, "Cannot access items before vault has been loaded. Please refresh the vault first"); }
			for (var i = 0; i != this.items.length; i++) {
				if (this.items[i].itemKey == itemKey) {
					return this.items[i];
				}
			}
			return null;
		}
		/**
		* Returns the number of items of a given itemKey is in this Vault. This method can only be called on an up-to-date vault.
		* @param string itemKey The itemKey of the items to count.
		* @return number The number of items of the given type that the user has in the vault.
		*/
		this.count = function (itemKey) {
			if (currentVersion == null) { throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded, "Cannot access items before vault has been loaded. Please refresh the vault first"); }
			var result = 0;
			for (var i = 0; i != this.items.length; i++) {
				if (this.items[i].itemKey == itemKey) {
					result++;
				}
			}
			return result;
		}

		/**
		* Refreshes this Vault, making sure the Items and Coins are up-to-date.
		* @param {function()} successCallback Callback function that will be called when the refresh is complete
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.refresh = function (successCallback, errorCallback) {
			channel.payVaultRefresh(currentVersion, null, successCallback, errorCallback, function (result) {
				readContent(result.vaultcontents);
			});
		}

		/**
		* Loads a page of entries from this Vaults history, in reverse chronological order, i.e. newest first.
		* @param {number} page The page of entries to load. The first page has number 0.
		* @param {number} pageSize The number of entries per page.
		* @param {function(payVaultHistoryEntries)} successCallback Callback function that will be called with the history entries found
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.readHistory = function (page, pageSize, successCallback, errorCallback) {
			channel.payVaultReadHistory(page, pageSize, null, successCallback, errorCallback, function (result) {
				var arr = [];
				for (var i = 0; i != result.entries.length; i++) {
					var item = result.entries[i];
					arr.push(new _pio.payVaultHistoryEntry(item.type, item.amount, item.timestamp, item.itemkeys || [], item.reason, item.providertransactionid, item.providerprice))
				}
				return arr;
			})
		}

		/**
		* Give coins to this Vault
		* @param {number} coinAmount The amount of coins to give.
		* @param {string} reason Your reason for giving the coins to this user. This will show up in the vault history, and in the PayVault admin panel for this user.
		* @param {function()} successCallback Callback function that will be called when the credit has been completed. You don't need to call refresh after this call.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.credit = function (coinAmount, reason, successCallback, errorCallback) {
			channel.payVaultCredit(coinAmount, reason, null, successCallback, errorCallback, function (result) {
				readContent(result.vaultcontents);
			})
		}

		/**
		* Take coins from this Vault
		* @param {number} coinAmount The amount of coins to take.
		* @param {string} reason Your reason for taking the coins from this user. This will show up in the vault history, and in the PayVault admin panel for this user.
		* @param {function()} successCallback Callback function that will be called when the credit has been completed. You don't need to call refresh after this call.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.debit = function (coinAmount, reason, successCallback, errorCallback) {
			channel.payVaultDebit(coinAmount, reason, null, successCallback, errorCallback, function (result) {
				readContent(result.vaultcontents);
			})
		}

		/**
		* Consume items in this Vault. This will cause them to be removed, but this action will not show up in the vault history.
		* @param {vaultItem[]} items The VaultItems to use from the users vault - this should be instances of items in this Vault.
		* @param {function()} successCallback Callback function that will be called when the item(s) has been consumed. You don't need to call refresh after this call.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.consume = function (items, successCallback, errorCallback) {
			if (typeof (items) != 'object' && !items.length) {
				var e = _pio.error("The first argument to consume should be an array: client.payVault.consume([item], ...)");
				_pio.handleError(e, errorCallback, e.code, e.message)
				return;
			} 

			var ids = [];
			for (var i = 0; i != items.length; i++) {
				var id = items[i].id;
				if (id) {
					ids.push(id);
				} else {
					var e = _pio.error("No PayVault item id found on item#" + i + ". You have to use items from the payVault.items array. For instance: client.payVault.consume([client.payVault.first('sportscar')], ...)")
					_pio.handleError(e, errorCallback, e.code, e.message)
					return;
				}
			}

			channel.payVaultConsume(ids, null, successCallback, errorCallback, function (result) {
				readContent(result.vaultcontents);
			})
		}


		/**
		* Buy items with Coins.
		* @param {object[]} items A list of items to buy. Each item must have a property called 'itemkey' with the item key. Any additional properties will be converted to item payload.
		* @param {boolean} storeItems Whether or not to store the items in the vault after purchase
		* @param {function()} successCallback Callback function that will be called when the item(s) have been bought and added to the vault. You don't need to call refresh after this call.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.buy = function (items, storeItems, successCallback, errorCallback) {
			channel.payVaultBuy(_pio.convertBuyItems(items), storeItems, null, successCallback, errorCallback, function (result) {
				readContent(result.vaultcontents);
			})
		}

		/**
		* Give the user items without taking any of his coins from the vault.
		* @param {object[]} items A list of items to give. Each item must have a property called 'itemkey' with the item key. Any additional properties will be converted to item payload.
		* @param {function()} successCallback Callback function that will be called when the item(s) have been added to the vault. You don't need to call refresh after this call.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.give = function (items, successCallback, errorCallback) {
			channel.payVaultGive(_pio.convertBuyItems(items), null, successCallback, errorCallback, function (result) {
				readContent(result.vaultcontents);
			})
		}

		/**
		* Gets information about how to make a coin purchase with the specified PayVault provider.
		* @param {string} provider The name of the PayVault provider to use for the coin purchase.
		* @param {object} purchaseArguments Any additional information that will be given to the PayVault provider to configure this purchase.
		* @param {function(object)} successCallback Callback function that will be called with provider specifics about how to complete the purchase.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.getBuyCoinsInfo = function (provider, purchaseArguments, successCallback, errorCallback) {
			channel.payVaultPaymentInfo(provider, _pio.convertToKVArray(purchaseArguments), null, successCallback, errorCallback, function (result) {
				return _pio.convertFromKVArray(result.providerarguments)
			})
		}

		/**
		* Gets information about how to make a direct item purchase with the specified PayVault provider.
		* @param {string} provider The name of the PayVault provider to use for the item purchase.
		* @param {object} purchaseArguments Any additional information that will be given to the PayVault provider to configure this purchase.
		* @param {object[]} items A list of items to buy. Each item must have a property called 'itemkey' with the item key. Any additional properties will be converted to item payload.
		* @param {function(object)} successCallback Callback function that will be called with provider specifics about how to complete the purchase.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.getBuyDirectInfo = function (provider, purchaseArguments, items, successCallback, errorCallback) {
			channel.payVaultPaymentInfo(provider, _pio.convertToKVArray(purchaseArguments), _pio.convertBuyItems(items), successCallback, errorCallback, function (result) {
				return _pio.convertFromKVArray(result.providerarguments)
			})
		}

		var self = this;
		function readContent(content) {
			if (content != null) {
				currentVersion = content.version;
				self.coins = content.coins || 0;
				self.items = [];
				if (content.items && content.items.length) {
					for (var i = 0; i != content.items.length; i++) {
						var item = content.items[i];
						var obj = self.items[i] = new _pio.vaultItem(item.id, item.itemkey, (new Date()).setTime(item.purchasedate))

						_pio.bigDBDeserialize(item.properties, obj, true);
					}
				}
			}
		}

	}

	_pio.convertBuyItems = function(items) {
		if (items == null) return [];
		var results = [];
		for (var i = 0; i != items.length; i++) {
			var itemKey = items[i].itemkey

			if (!itemKey) {
				throw _pio.error("You have to specify an itemkey for the payvault item. Example:  {itemkey:'car'}")
			}

			results.push({
				itemkey: itemKey,
				payload: _pio.compareForChanges({ itemkey: itemKey }, items[i], true, true)
			})
		}
		return results;
	}

	/**
	* @class This class represents an item in a user's Vault
	*/
	_pio.vaultItem = function (id, itemKey, purchaseDate) {
		/** The unique id of this particular vault item in the user's vault
		* @type string
		*/
		this.id = id;

		/** The key of the underlying item in the PayVaultItems BigDB table
		* @type string
		*/
		this.itemKey = itemKey;

		/** The time when the vault item was originally purchased
		* @type Date
		*/
		this.purchaseDate = purchaseDate;
	}

	/**
	* @class This class represents an entry in a user's PayVault history.
	*/
	_pio.payVaultHistoryEntry = function (type, amount, timestamp, itemkeys, reason, providerTransactionId, providerPrice) {
		/** The type of this entry, for example 'buy','credit','debit'... 
		* @type string
		*/
		this.type = type;
		/** The coin amount of this entry. 
		* @type number
		*/
		this.amount = amount;
		/** When this entry was created. 
		* @type Date
		*/
		this.timestamp = new Date().setTime(timestamp);
		/** The item keys related to this entry (entries with type 'buy'). 
		* @type string[]
		*/
		this.itemKeys = itemkeys;
		/** The developer supplied reason for entries of type 'credit' and 'debit'. 
		* @type string
		*/
		this.reason = reason;
		/** The transaction id from the PayVault provider corresponding to this entry. 
		* @type string
		*/
		this.providerTransactionId = providerTransactionId;
		/** The price in real currency of this entry formatted as a human readable currency string, e.g. $10.00 USD 
		* @type string
		*/
		this.providerPrice = providerPrice;
	}
})();
(function () {
	/**
	* @class The BigDB service.
	* <p>This class is used to create, load, and delete database objects. All database objects are stored in tables and have a unique key. 
	* You can set up tables in your admin panel, and you can also set up indexes there for when you want to load objects by properties
	* or ranges of properties.</p>
	* @example Here's how to store and update an object:
	* <listing>
	* //Make new object and set some properties
	* var obj = {username:"Adam",location:"London", age:20};
	*
	* //Create object in table Users with ConnectUserId as key
	* client.bigDB.createObject("Users", connectUserId, obj, function(dbObj) {
	*	dbObj.location = 'Paris';
	*	dbObj.save();
	* }, function(error) { console.log(error); });
	* </listing>
	* @example This is how you load an object:
	* <listing>
	* client.bigDB.load("Users", connectUserId, function(obj) {
	*	if (obj != null) {
	*		obj.location = 'Paris';
	*		obj.save();
	* 	}
	* }, function(error) { console.log(error); });
	* </listing>
	* @example In case you always want to modify an object, you can use the LoadOrCreate method to ensure you get an object back:
	* <listing>
	* client.bigDB.loadOrCreate("Users", connectUserId, function(obj) {
	*	if(!obj.username) {
	*		dbObj.username = 'Charlie';
	*		dbObj.age = 20;
	* 	}
	*	obj.location = 'London';
	*	obj.save();
	* }, function(error) { console.log(error); });
	* </listing>
	* @example 
	* <p>
	* BigDB also supports indexes for retrieving objects by a specific property, a range of properties, 
	* or to sort objects by properties. Indexes need to be set up in the admin panel for each table, 
	* each index needs a name, and a list of properties, and for each property you also need to specify a
	* sort order.
	* </p>
	* <p>Imagine that we have objects that look like this:</p>
	* <listing>
	* {
	* 	username:"Adam",
	* 	created:2010-05-12 15:28,
	* 	location:"London",
	* 	age:20,
	* }
	* </listing>
	* <p>That we have defined an index called "ByUsername" that looks like this:
	* 	<ul>
	* 		<li>{Property:"username", Type:String, Order:Ascending}</li>
	* 	</ul>
	* </p>
	* <p>And an index called "ByCreated" that looks like this:
	* 	<ul>
	* 		<li>{Property:"created", Type:Datetime, Order:Descending}</li>
	* 	</ul>
	*</p>
	* <p>Then we can do lookups like these:</p>
	* <listing>
	* //Get the object where username="Adam"
	* client.bigDB.loadSingle("Users", "ByUsername", ["Adam"], function(obj) {
	*	//...
	* }, function(error) { console.log(error); });
	* 
	* //Get all users with usernames between "Adam" and "Charlie".
	* //This would retrieve users named "Adamsson" and "Barney", 
	* //but not users named "Abel" or "Charlotte".
	* client.bigDB.loadRange("Users", "ByUsername", null, "Adam", "Charlie", 100, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Get all users up to and including "Adam". This would retrieve 
	* //users named "Aaron" and "Ackerman", but not "Adamsson" or "Barney".
	* client.bigDB.loadRange("Users", "ByUsername", null, null, "Adam", 100, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Get all users from "Xerxes". This would retrieve users named 
	* //"Yngwie" and "Zed", but not "Charlie" or "Xantippa".
	* client.bigDB.loadRange("Users", "ByUsername", null, "Xerxes", null, 100, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Retrieve the ten first objects by the ByCreated index. 
	* //Since that index is sorted in descending order, this will actually 
	* //retrieve the 10 latest created users.
	* client.bigDB.loadRange("Users", "ByCreated", null, null, null, 10, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Get the 10 latest users that were created more than 7 days ago.
	* var weekago = new Date();
	* weekago.setDate(weekago.getDate() - 7);
	*
	* client.bigDB.loadRange("Users", "ByCreated", null, weekago, null, 10, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* </listing>
	* @example 
	* <p>
	* BigDB also supports compound indexes, that is indexes with more than one property. Given our example object above, we can create an index called "ByLocationAgeCreated" that looks like this:
	* 	<ul>
	* 		<li>{Property:"location", Type:String, Order:Ascending}</li>
	* 		<li>{Property:"age", Type:Integer, Order:Ascending}</li>
	* 		<li>{Property:"created", Type:Datetime, Order:Descending}</li>
	* 	</ul>
	* </p>
	* <p>
	* With this index, we can then lookup on either location, or location and age, or location and age and created. If we use more than one property in the lookup, we can only specify the range for the last one, the preceding ones have to be fixed and are sent in via the path parameter.
	* </p>
	* <listing>
	* //Load all users where location is "London"
	* client.bigDB.loadRange("Users", "ByLocationAgeCreated", null, "London", "London", 100, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Load all users from London between 20 and 30 years of age
	* client.bigDB.loadRange("Users", "ByLocationAgeCreated", ["London"], 20, 30, 100, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Load all users from London that are above 50
	* client.bigDB.loadRange("Users", "ByLocationAgeCreated", ["London"], 50, null, 100, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Load all users from Paris that are 30 years old, and were created in April
	* client.bigDB.loadRange("Users", "ByLocationAgeCreated", ["Paris", 30], new Date(2010, 4, 1), new Date(2010, 4, 30), 100, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* 
	* //Load the 10 latest 20-year old users from Amsterdam
	* client.bigDB.loadRange("Users", "ByLocationAgeCreated", ["Amsterdam", 20], null, null, 10, function(objects) {
	*	//objects is an array of found objects...
	* }, function(error) { console.log(error); });
	* </listing>
	* 
	* @example 
	* <p>Finally, deleting objects is as easy as calling the DeleteKeys method, or DeleteRange if you want to delete by an index.</p>
	* <listing>
	* //Delete current Users object.
	* client.bigDB.deleteKeys("Users", connectUserId, function(){
	*	//success
	* }, function(error) { console.log(error); });
	* 
	* //Delete all objects with usernames between "Adam" and "Charlie"
	* client.bigDB.deleteRange("Users", "ByUsername", null, "Adam", "Charlie", function(){
	*	//success
	* }, function(error) { console.log(error); });
	* 
	* //Delete all objects with created older than 1st Jan 2011
	* client.bigDB.deleteRange("Users", "ByUsername", null, new Date(2011, 1, 1), null, function(){
	*	//success
	* }, function(error) { console.log(error); });
	* </listing>
	*/
	_pio.bigDB = function (channel) {
		var self = this;
		var queuedSaves = [];
		/**
		* Creates a new database object in the given table with the specified key. If no key is specified (null), the object will receive an autogenerated id.
		* @param {string} table The name of the table to create the database object in.
		* @param {string} key The key to assign to the database object.
		* @param {object} obj The database object to create in the table.
		* @param {function(databaseobject)} successCallback Callback function that will be called with the newly created databaseobject instance
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.createObject = function (table, key, obj, successCallback, errorCallback) {
			var properties = _pio.compareForChanges({}, obj || {}, true, true);
			channel.createObjects([{ key: key, table: table, properties: properties}], false, successCallback, errorCallback, function (results) {
				if (results.objects.length == 1) {
					return new _pio.databaseobject(self, table, results.objects[0].key, results.objects[0].version, false, properties);
				} else {
					throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "Error creating object");
				}
			})
		}

		/**
		* Loads the database object corresponding to the player from the PlayerObjects table.
		* @param {function(databaseobject)} successCallback Callback function that will be called with the databaseobject 
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.loadMyPlayerObject = function (successCallback, errorCallback) {
			channel.loadMyPlayerObject(successCallback, errorCallback, function (result) {
				return new _pio.databaseobject(self, "PlayerObjects", result.playerobject.key, result.playerobject.version, true, result.playerobject.properties);
			})
		}

		/**
		* Load the database object with the given key from the given table.
		* @param {string} table The table to load the database object from.
		* @param {string} key The key of the database object to load.
		* @param {function(databaseobject)} successCallback Callback function that will be called with the databaseobject found, or null if no object exists for the given key
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.load = function (table, key, successCallback, errorCallback) {
			channel.loadObjects([{ table: table, keys: [key]}], successCallback, errorCallback, function (results) {
				if (results.objects.length == 1) {
					return results.objects[0] == null ? null : new _pio.databaseobject(self, table, results.objects[0].key, results.objects[0].version, false, results.objects[0].properties);
				} else {
					throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "Error loading object");
				}
			})
		}

		/**
		* Loads the database objects with the given keys from the given table.
		* @param {string} table The table to load the database objects from.
		* @param {string[]} keys The keys of the database objects to load.
		* @param {function(databaseobjects)} successCallback Callback function that will be called with an array of databaseobjects found, or an empty array if no objects exist for the given keys
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.loadKeys = function (table, keys, successCallback, errorCallback) {
			channel.loadObjects([{ table: table, keys: keys}], successCallback, errorCallback, function (results) {
				var ret = [];
				for (var i = 0; i != results.objects.length; i++) {
					var obj = results.objects[i];
					ret[i] = obj == null ? null : new _pio.databaseobject(self, table, obj.key, obj.version, false, obj.properties);
				}
				return ret;
			})
		}

		/**
		* Loads or creates the database object with the given key from the given table.
		* @param {string} table The table from which to load or create the database object
		* @param {string} key The key of the database object to load or create
		* @param {function(databaseobject)} successCallback Callback function that will be called with the databaseobject found or created
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.loadOrCreate = function (table, key, successCallback, errorCallback) {
			channel.createObjects([{ key: key, table: table, properties: []}], true, successCallback, errorCallback, function (results) {
				if (results.objects.length == 1) {
					return new _pio.databaseobject(self, table, results.objects[0].key, results.objects[0].version, false, results.objects[0].properties);
				} else {
					throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "Error creating object");
				}
			})
		}

		/**
		* Delete a set of database objects from a table.
		* @param {string} table The table to delete the database objects from.
		* @param {string[]} keys The keys of the database objects to delete.
		* @param {function()} successCallback Callback function that will be called when the objects have been successfully deleted
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.deleteKeys = function (table, keys, successCallback, errorCallback) {
			channel.deleteObjects([{ table: table, keys: keys}], successCallback, errorCallback, function (result) { return null })
		}
		/**
		* Loads or creates database objects with the given keys from the given table. New objects are created if there are no existing objects for the given keys.
		* @param {string} table The table from which to load or create the database objects.
		* @param {string[]} keys The keys of the database objects to load or create.
		* @param {function(databaseobjects)} successCallback Callback function that will be called with an array of databaseobjects found or created
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.loadKeysOrCreate = function (table, keys, successCallback, errorCallback) {
			var objectIds = [];
			for (var i = 0; i != keys.length; i++) {
				objectIds.push({ key: keys[i], table: table, properties: [] })
			}

			channel.createObjects(objectIds, true, successCallback, errorCallback, function (results) {
				var ret = [];
				for (var i = 0; i != results.objects.length; i++) {
					var obj = results.objects[i];
					ret[i] = new _pio.databaseobject(self, table, obj.key, obj.version, false, obj.properties);
				}
				return ret;
			})
		}

		/**
		* Load a database object from a table using the specified index.
		* @param {string} table The table to load the database object from.
		* @param {string} index The name of the index to query for the database object.
		* @param {array} indexValue An array of objects of the same types as the index properties, specifying which object to load.
		* @param {function(databaseobject)} successCallback Callback function that will be called with the databaseobject found, or null if no object was found
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.loadSingle = function (table, index, indexValue, successCallback, errorCallback) {
			channel.loadMatchingObjects(table, index, getIndexValue(indexValue), 1, successCallback, errorCallback, function (results) {
				return results.objects.length == 0 ? null : new _pio.databaseobject(self, table, results.objects[0].key, results.objects[0].version, false, results.objects[0].properties);
			})
		}

		/**
		* Load a range of database objects from a table using the specified index.
		* @param {string} table The table to load the database objects from.
		* @param {string} index The name of the index to query for the database objects.
		* @param {array} indexPath Where in the index to start the range search: An array of objects of the same types as the index properties, specifying where in the index to start loading database objects from. For instance, in the index [Mode,Map,Score] you might use new object[]{"expert","skyland"} as the indexPath and use the start and stop arguments to determine the range of scores you wish to return. IndexPath can be set to null if there is only one property in the index.
		* @param {object} start Where to start the range search. For instance, if the index is [Mode,Map,Score] and indexPath is ["expert","skyland"], then start defines the minimum score to include in the results.
		* @param {object} stop Where to stop the range search. For instance, if the index is [Mode,Map,Score] and indexPath is ["expert","skyland"], then stop defines the maximum score to include in the results.
		* @param {int} limit The max amount of objects to return.
		* @param {function(databaseobjects)} successCallback Callback function that will be called with an array of databaseobjects found, or an empty array if no objects are found.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.loadRange = function (table, index, indexPath, start, stop, limit, successCallback, errorCallback) {
			channel.loadIndexRange(table, index, getIndexValue(indexPath, start), getIndexValue(indexPath, stop), limit, successCallback, errorCallback, function (results) {
				var ret = [];
				for (var i = 0; i != results.objects.length; i++) {
					var obj = results.objects[i];
					ret[i] = obj == null ? null : new _pio.databaseobject(self, table, obj.key, obj.version, false, obj.properties);
				}
				return ret;
			})
		}

		/**
		* Delete a range of database objects from a table using an index.
		* @param {string} table The table to delete the database object from.
		* @param {string} index The name of the index to query for the database objects to delete.
		* @param {array} indexPath Where in the index to start the range delete: An array of objects of the same types as the index properties, specifying where in the index to start loading database objects from. For instance, in the index [Mode,Map,Score] you might use new object[]{"expert","skyland"} as the indexPath and use the start and stop arguments to determine the range of scores you wish to delete. IndexPath can be set to null instead of an empty array.
		* @param {object} start Where to start the range delete. For instance, if the index is [Mode,Map,Score] and indexPath is ["expert","skyland"], then start defines the minimum score to delete.
		* @param {function()} successCallback Callback function that will be called when the objects have been successfully deleted
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.deleteRange = function (table, index, indexPath, start, stop, successCallback, errorCallback) {
			channel.deleteIndexRange(table, index, getIndexValue(indexPath, start), getIndexValue(indexPath, stop), successCallback, errorCallback, function () { });
		}

		/**
		* Save changes to one or more database objects in one go.
		* @param {bool} useOptimisticLock Should the save only go through, if no other process has modified the object since it was loaded?
		* @param {bool} fullOverwrite Will completely overwrite the database object in BigDB with the properties in this instance, instead of just sending the changed properties to the server.
		* @param {array} objects The objects with changes to save.
		* @param {function()} successCallback Callback function that will be called when the objects have been successfully saved
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.saveChanges = function (useOptimisticLock, fullOverwrite, objects, successCallback, errorCallback) {
			var createIfMissing = arguments[5] == true;
			var changesets = [];
			for (var i in objects) {
				var obj = objects[i];

				// verify that it's a databaseobject
				if (!obj.existsInDatabase || !obj.key || !obj.table || !obj._internal_ || !obj.save) {
					var e = _pio.error("You can only save database objects that exist in the database")
					_pio.handleError(e, errorCallback, e.code, e.message)
					return;
				}

				// get changeset for object
				var changes = _pio.compareForChanges(fullOverwrite ? {} : obj._internal_('get-dbCurrent'), obj, true, true)
				if (fullOverwrite || changes.length > 0) {
					changesets.push({
						key: obj._internal_('get-key'),
						table: obj._internal_('get-table'),
						fulloverwrite: fullOverwrite,
						onlyifversion: useOptimisticLock ? obj._internal_('get-version') : null,
						changes: changes
					})
				}
			}

			// queue the save
			queuedSaves.push({
				objects: objects,
				changesets: changesets,
				fullOverwrite: fullOverwrite,
				useOptimisticLock: useOptimisticLock,
				futureSaves: [],
				setIsSavingOnAll: function (value) {
					for (var i = 0; i != this.objects.length; i++) {
						this.objects[i]._internal_('set-is-saving', value)
					}
				},
				done: function () {
					this.setIsSavingOnAll(false);
					startSaves();
				},
				execute: function () {
					var self = this;

					// mark as saving
					self.setIsSavingOnAll(true);

					// save changes to server
					if (self.changesets.length > 0) {
						channel.saveObjectChanges(_pio.LockType.LockAll, self.changesets, createIfMissing, successCallback, function (e) {
							self.done();
							_pio.handleError(e, errorCallback, e.code, e.message)
						}, function (result) {
							for (var i = 0; i != self.objects.length; i++) {
								var obj = self.objects[i];
								obj._internal_('set-version', result.versions[i])
								obj._internal_('change-dbCurrent', self.changesets[i].changes)

								// remove changes from any of the future saves we took changes from
								for (var x = 0; x != self.futureSaves.length; x++) {
									var futureSave = self.futureSaves[x];
									for (var o = 0; o < futureSave.objects.length; o++) {
										if (futureSave.objects[o] == obj) {
											futureSave.changesets.splice(o, 1);
											futureSave.objects.splice(o, 1);
											o--;
										}
									}
								}
							}

							self.done();
						});
					} else {
						self.done();
						setTimeout(successCallback, 1);
					}
				}
			})

			startSaves();
		}

		function startSaves() {
			for (var s = 0; s < queuedSaves.length; s++) {
				var save = queuedSaves[s];
				var canSave = true;

				for (var i in save.objects) {
					if (save.objects[i]._internal_('get-is-saving')) {
						//console.log(save.objects[i].key + " is already saving...");
						canSave = false;
						break;
					}
				}

				// execute the save if ready, or queue for next time
				if (canSave) {
					// scan forward to find newest changeset for each object
					for (var i in save.objects) {
						for (var f = s + 1; f < queuedSaves.length; f++) {
							futureSave = queuedSaves[f];
							for (var o = 0; o < futureSave.objects.length; o++) {
								// it's the same object, but in the future, in a similar save
								if (futureSave.objects[o] == save.objects[i] && futureSave.fullOverwrite == save.fullOverwrite && futureSave.useOptimisticLock == save.useOptimisticLock) {
									// override current changeset with future changeset
									save.changesets[i] = futureSave.changesets[o];

									// save a reference to the future save, so we can 
									// remove the changeset when successful later
									save.futureSaves.push(futureSave);
								}
							}
						}
					}

					// remove the save from queue
					queuedSaves.splice(s, 1);
					s--;

					// run it
					save.execute()
				}
			}
		}

		function getIndexValue(values, extraValue) {
			if (values == null) {
				values = []
			} else if (!(values instanceof Array)) {
				values = [values];
			}
			if (extraValue != null) {
				values = values.concat([extraValue]);
			}

			var result = [];
			for (var i = 0; i != values.length; i++) {
				var value = values[i];
				switch (typeof (value)) {
					case 'boolean': result.push({ valuetype: _pio.ValueType.Bool, bool: value }); break;
					case 'string': result.push({ valuetype: _pio.ValueType.String, string: value }); break;
					case 'number':
						var isFloatingPoint = value % 1 != 0;
						if (isFloatingPoint) {
							
							result.push({ valuetype: _pio.ValueType.Double, double: value })
						} else {
							if (value > -2147483648 && value < 2147483647) { // INTEGER RANGE
								result.push({ valuetype: _pio.ValueType.Int, int: value })
							} else if (value > 0 && value < 4294967295) { // uint
								result.push({ valuetype: _pio.ValueType.UInt, uint: value })
							} else { // long
								result.push({ valuetype: _pio.ValueType.Long, long: value })
							}
						}
						break;
					case 'object': // date, object & array
						if (value.getTime && value.getMilliseconds) { // date
							result.push({ valuetype: _pio.ValueType.DateTime, datetime: value.getTime() })
						} else {
							throw new Error("Don't know how to serialize type '" + typeof value + "' for BigDB");
						}
						break;
					default: throw new Error("Don't know how to serialize type '" + typeof value + "' for BigDB");
				}
			}
			return result;
		}
	}

	/**
	* @class This class represents a database object in BigDB. It contains all the data of the database object, as well
	* as a method for persisting any changes back to BigDB.
	*/
	_pio.databaseobject = function (owner, table, key, version, createIfMissing, properties) {
		// make an object representing what we think is
		// currently in the database, for future diffs
		var dbCurrent = {};
		var isSaving = false;
		_pio.bigDBDeserialize(properties, dbCurrent, true);

		/** The table of the database object
		* @type string
		*/
		this.table = table;

		/** The key of the database object
		* @type string
		*/
		this.key = key;

		/** Returns true if this object has been persisted
		* @type bool
		*/
		this.existsInDatabase = true;

		/**
		* Persist the object to the database, using optimistic locking and full overwrite if specified.
		* @param {bool} useOptimisticLock If true, the save will only be completed if the database object has not changed in BigDB since this instance was loaded.
		* @param {bool} fullOverwrite Will completely overwrite the database object in BigDB with the properties in this instance, instead of just sending the changed properties to the server.
		* @param {function()} successCallback Callback function that will be called when the object have been successfully saved
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.save = function (useOptimisticLocks, fullOverwrite, successCallback, errorCallback) {
			owner.saveChanges(useOptimisticLocks, fullOverwrite, [this], successCallback, errorCallback, createIfMissing);
		}

		this._internal_ = function (method, arg1) {
			switch (method) {
				case 'get-table': return table;
				case 'get-key': return key;
				case 'set-is-saving': isSaving = arg1;
				case 'get-is-saving': return isSaving;
				case 'get-version': return version;
				case 'set-version': version = arg1;
				case 'get-dbCurrent': return dbCurrent;
				case 'change-dbCurrent': _pio.bigDBDeserialize(arg1, dbCurrent, true);
			}
		}

		_pio.bigDBDeserialize(properties, this, true);
	}

	_pio.compareForChanges = function (original, current, isObject, isRoot) {
		var changes = []

		// loop over all values in the current object
		// to find sets and changes
		for (var key in current) {
			var value = current[key];
			var valueOriginal = original ? original[key] : null

			switch (key) {
				case 'table': if (isRoot) continue;
				case 'key': if (isRoot) continue;
				case 'save': if (isRoot) continue;
				case 'existsInDatabase': if (isRoot) continue;
				case '_internal_': if (isRoot) continue;
				case '_circular_reference_finder_': continue;
			}

			if (value != null) {
				var prop = isObject ? { name: key} : { index: parseInt(key) }

				switch (typeof (value)) {
					case 'boolean':
						if (value != valueOriginal) {
							prop.value = { valuetype: _pio.ValueType.Bool, bool: value }
							changes.push(prop)
						}
						break;
					case 'number':
						if (value != valueOriginal) {
							if (isFinite(value) && Math.floor(value) === value) {
								if (value >= -2147483648 && value <= 2147483647) {
									prop.value = { valuetype: _pio.ValueType.Int, int: value }
								} else if (value > 0 && value <= 4294967295) {
									prop.value = { valuetype: _pio.ValueType.UInt, uint: value }
								} else if (value >= -9223372036854775000 && value <= 9223372036854775000) { //Boundary is rounded because max_long and min_long can't be accurately represented as double
									prop.value = { valuetype: _pio.ValueType.Long, long: value }
								} else if (value > 0 && value <= 18446744073709550000) { //Boundary is rounded because max_ulong can't be accurately represented as double
									prop.value = { valuetype: _pio.ValueType.ULong, ulong: value }
								} else {
									prop.value = { valuetype: _pio.ValueType.Double, double: value }
								}
							} else {
								prop.value = { valuetype: _pio.ValueType.Double, double: value }
							}
							changes.push(prop)
						}
						break;
					case 'string':
						if (value != valueOriginal) {
							prop.value = { valuetype: _pio.ValueType.String, string: value }
							changes.push(prop)
						}
						break;
					case 'object': // date, object & array
						if (value.getTime && value.getMilliseconds) { // date
							if (value + '' != valueOriginal + '') {
								prop.value = { valuetype: _pio.ValueType.DateTime, datetime: value.getTime() }
								changes.push(prop)
							}
						} else {
							// check for circular references
							if (value._circular_reference_finder_) {
								throw new PlayerIOError(PlayerIOErrorCode.CircularReference, "The object you're trying to save contains a circular reference for " + (isObject ? "a property named" : "the array entry") + "): " + key)
							} else {
								value._circular_reference_finder_ = true;
							}

							var valueIsArray = value instanceof Array;
							if (valueIsArray && value.bytearray) {
								var bytes = new Array(value.length);
								for (var i = 0; i != bytes.length; i++) {
									var val = value[i];
									if (val >= 0 && val <= 255) {
										bytes[i] = val
									} else {
										throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "The bytearray property '" + key + "' was supposed to only contain byte (0-255) values, but contained the value: " + val);
									}
								}
								prop.value = { valuetype: _pio.ValueType.ByteArray, bytearray: bytes }
							} else {
								var subChanges = _pio.compareForChanges(valueOriginal, value, !valueIsArray, false);
								if (valueIsArray) {
									prop.value = { valuetype: _pio.ValueType.Array, arrayproperties: subChanges }
								} else {
									prop.value = { valuetype: _pio.ValueType.Obj, objectproperties: subChanges }
								}
							}
							changes.push(prop)

							// remove circular reference finder
							delete value._circular_reference_finder_;
						}
						break;
					case 'undefined': break;
					case 'function': break;
					default: throw new Error("Don't know how to serialize type '" + typeof value + "' for BigDB");
				}
			}
		}

		// loop over all values in the original object to find
		// properties that were deleted
		for (var key in original) {
			if (current[key] == null || typeof (current[key]) == 'undefined') {
				// property was deleted
				changes.push(isObject ? { name: key} : { index: parseInt(key) }); //getProp(null, key, isObject));
			}
		}

		return changes;
	}

	_pio.bigDBDeserialize = function (properties, target, isObject) {
		for (var x in properties) {
			var p = properties[x];
			var key = isObject ? p.name : (p.index || 0);
			var val = p.value;

			if (val) {
				switch (val.valuetype || 0) {
					case _pio.ValueType.String: target[key] = val.string || ""; break;
					case _pio.ValueType.Int: target[key] = val.int || 0; break;
					case _pio.ValueType.UInt: target[key] = val.uint || 0; break;
					case _pio.ValueType.Long: target[key] = val.long || 0; break;
					case _pio.ValueType.Bool: target[key] = val.bool || 0; break;
					case _pio.ValueType.Float: target[key] = val.float || 0.0; break;
					case _pio.ValueType.Double: target[key] = val.double || 0.0; break;
					case _pio.ValueType.ByteArray:
						target[key] = val.bytearray;
						target[key].bytearray = true;
						break;
					case _pio.ValueType.DateTime: target[key] = new Date(val.datetime || 0); break;
					case _pio.ValueType.Array:
						var arr = target[key] instanceof Array ? target[key] : [];
						_pio.bigDBDeserialize(val.arrayproperties, arr, false);
						target[key] = arr;
						break;
					case _pio.ValueType.Obj:
						var obj = typeof (target[key]) == 'object' ? target[key] : {}
						_pio.bigDBDeserialize(val.objectproperties, obj, true);
						target[key] = obj;
						break;
				}
			} else {
				delete target[key];
			}
		}
	}
})();
(function () {
	var entryType_Integer = 0;
	var entryType_UnsignedInteger = 1;
	var entryType_Long = 2;
	var entryType_UnsignedLong = 3;
	var entryType_Double = 4;
	var entryType_Float = 5;
	var entryType_String = 6;
	var entryType_ByteArray = 7;
	var entryType_Boolean = 8;

	/**
	* @class The Multiplayer service. This class has method for listing, creating, and joining multiplayer rooms.
	* Once a user has been sucessfully connected to a room, a connection object will be returned. This class is also
	* used to override the development server setting when developing and testing multiplayer code against your 
	* local development server.
	* @example Joining a multiplayer room and listening to all messages
	* <listing>
	* client.multiplayer.createJoinRoom(
	*	'my-room-id',			//Room id
	*	'bounce',				//Room type
	*	true,					//Visible
	*	{ mode: 'team' },		//Room data
	*	{ team: 'awesome' },	//Join data
	*	function(connection) {
	*		//Success!
	*		//Setup a message handler to listen to messages of all types:
	*		connection.addMessageCallback("*", function(message) {
	*			//When we receive a message, log it to the console:
	*			console.log(message);	
	*			//Send back a message to the room:
	*			connection.send('messagetype','arg1',2,'arg3');
	*			//Disconnect from the room:
	*			connection.disconnect();
	*		});
	*		//Setup a disconnect handler:
	*		connection.addDisconnectCallback(function(){
	*			console.log("disconnected from room");	
	*		});
	*	}, 
	*	function(error) { 
	*		console.log(error);
	*	}
	* );
	* </listing>
	*/
	_pio.multiplayer = function (channel) {
		var self = this;
		/** 
		* If not null, rooms will be created on the development server at the address defined by the server endpoint, instead of using the live multiplayer servers. 
		* @type string
		*/
		this.developmentServer = null;

		/**
		* If set to true, the multiplayer connections will be encrypted using TLS/SSL. Be aware that this will cause a performance degradation by introducting secure connection negotiation latency when connecting.
		* @type bool
		*/
		this.useSecureConnections = false;

		/**
		* Create a multiplayer room on the Player.IO infrastructure.
		* @param {string} roomId The id you wish to assign to your new room - You can use this to connect to the specific room later as long as it still exists.
		* @param {string} roomType The name of the room type you wish to run the room as. This value should match one of the [RoomType(...)] attributes of your uploaded code. A room type of 'bounce' is always available.
		* @param {bool} visible Should the room be visible when listing rooms with GetRooms or not?
		* @param {object} roomData The data to initialize the room with, this can be read with ListRooms and changed from the serverside.
		* @param {function(string)} successCallback Callback function that will be called with the newly created room id
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.createRoom = function (roomId, roomType, visible, roomData, successCallback, errorCallback) {
			channel.createRoom(roomId, roomType, visible, _pio.convertToKVArray(roomData), self.developmentServer != null, successCallback, errorCallback, function (result) {
				return result.roomid;
			});
		}

		/**
		* Join a running multiplayer room.
		* @param {string} roomId The id of the room you wish to connect to.
		* @param {string} joinData Data to send to the room with additional information about the join.
		* @param {function(connection)} successCallback Callback function that will be called with a connection to the room
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.joinRoom = function (roomId, joinData, successCallback, errorCallback) {
			// this lets autocomplete in visual studio know the success callback takes a connection.
			clearTimeout(setTimeout(function () { successCallback(new _pio.connection()) },10000))
			var originalStack = new Error();
			channel.joinRoom(roomId, _pio.convertToKVArray(joinData), self.developmentServer != null, function(){}, errorCallback, function (result) {
				return new _pio.connection(originalStack, self.developmentServer, self.useSecureConnections, result.endpoints, result.joinkey, joinData || {}, successCallback, errorCallback)
			});
		}

		/**
		* Creates a multiplayer room (if it does not exist already) and joins it.
		* @param {string} roomId The id of the room you wish to create/join.
		* @param {string} roomType The name of the room type you wish to run the room as. This value should match one of the [RoomType(...)] attributes of your uploaded code. A room type of 'bounce' is always available.
		* @param {bool} visible If the room doesn't exist: Should the room be visible when listing rooms with GetRooms upon creation?
		* @param {object} roomData If the room doesn't exist: The data to initialize the room with upon creation.
		* @param {object} joinData Data to send to the room with additional information about the join.
		* @param {function(connection)} successCallback Callback function that will be called with a connection to the room
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.createJoinRoom = function (roomId, roomType, visible, roomData, joinData, successCallback, errorCallback) {
			// this lets autocomplete in visual studio know the success callback takes a connection.
			clearTimeout(setTimeout(function () { successCallback(new _pio.connection()) },10000))
			var originalStack = new Error();
			channel.createJoinRoom(roomId, roomType, visible, _pio.convertToKVArray(roomData), _pio.convertToKVArray(joinData), self.developmentServer != null, function () { }, errorCallback, function (result) {
				return new _pio.connection(originalStack, self.developmentServer, self.useSecureConnections, result.endpoints, result.joinkey, joinData || {}, successCallback, errorCallback)
			})
		}

		/**
		* List the currently running multiplayer rooms.
		* @param {string} roomType The type of room you wish to list.
		* @param {object} searchCriteria Only rooms with the same values in their roomdata will be returned.
		* @param {int} resultLimit The maximum amount of rooms you want to receive. Use 0 for 'as many as possible'.
		* @param {int} resultOffset The offset into the list you wish to start listing at.
		* @param {function(RoomInfo[])} successCallback Callback function that will be called with a connection to the room
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.listRooms = function (roomType, searchCriteria, resultLimit, resultOffset, successCallback, errorCallback) {
			channel.listRooms(roomType, _pio.convertToKVArray(searchCriteria), resultLimit, resultOffset, self.developmentServer != null, successCallback, errorCallback, function (result) {
				var arr = [];

				if (result.rooms && result.rooms.length > 0) {
					for (var i = 0; i != result.rooms.length; i++) {
						var item = result.rooms[i];
						arr.push(new _pio.roomInfo(item.id, item.roomtype, item.onlineusers, _pio.convertFromKVArray(item.roomdata)))
					}
				}

				return arr;
			});
		}
	}

	_pio.websocketConnection = function (talkBinary, useSecureConnections, endpoint, connectTimeout, onConnectResult, onDisconnect, onMessage) {
		var self = this;
		var connectComplete = false;
		var serializer = new _pio.messageSerializer();
		var connected = false;
		var socket = null;
		var url = (useSecureConnections ? 'wss://' : 'ws://') + endpoint + '/';
		try {
			if (typeof (MozWebSocket) != 'undefined') {
				socket = new MozWebSocket(url);
			} else {
				socket = new WebSocket(url);
			}
		} catch (e) {
			onConnectResult(false, '' + e);
			return;
		}

		var timeout = setTimeout(function () {
			if (!connectComplete) {
				connectComplete = true;
				onConnectResult(false, "Connect attempt timed out");
			}
		}, connectTimeout);

		socket.onopen = function () {
			if (!connectComplete) {
				clearTimeout(timeout)
				connectComplete = true;
				connected = true;
				onConnectResult(connected);
			}
		}
		socket.onclose = function (e) {
			self.disconnect();
		}
		socket.onerror = function (msg) {
			self.disconnect();
		}
		socket.onmessage = function (msg) {
			if (connected) {
				if (talkBinary) {
					var fr = new FileReader();
					fr.onloadend = function () {
						var uint8view = new Uint8Array(fr.result);
						var bytes = new Array(uint8view.length)
						for (var i = 0; i != uint8view.length; i++) {
							bytes[i] = uint8view[i];
						}
						onMessage(serializer.deserializeMessage(bytes, 0, bytes.length))
					}
					fr.readAsArrayBuffer(msg.data);
				} else {
					var bytes = _pio.base64decode(msg.data);
					onMessage(serializer.deserializeMessage(bytes, 0, bytes.length))
				}
			}
		}
		this.disconnect = function () {
			if (connected) {
				connected = false;
				onDisconnect();
				try {
					socket.close();
				} catch (e) { _pio.debugLog(e) }
			}
		}
		this.sendMessage = function (message) {
			var serialized = serializer.serializeMessage(message);

			if (talkBinary) {
				var bytes = new Uint8Array(serialized.length);
				for (var i = 0; i < serialized.length; i++) {
					bytes[i] = serialized[i];
				}
				socket.send(bytes.buffer)
			} else {
				var str = _pio.base64encode(serialized);
				socket.send(str);
			}
		}
	}

	/**
	* @class An instance of this class is returned after successfully joining a Multiplayer room.
	* It encapsulates the active network connection between the user and the room, and has methods
	* for sending and handling messages, as well as disconnecting fom the room. See the Multiplayer class for examples.
	*/
	_pio.connection = function (originalStack, developmentServer, useSecureConnections, endpoints, joinKey, joinData, successCallback, errorCallback) {
		var self = this;
		var waitingForJoinResult = true;
		var disconnectCallbacks = [];
		var messageCallback = {}
		var queuedMessages = [];
		var socket = null;

		// decide what kind of socket connection to establish (websocket-binary, flash or websocket-base64).
		// unfortunately, there is no way to easily detect if the current browser supports binary data over websockets.
		// so what we do is have a whitelist of known supported browsers, then fallback to flash, then fallback to base64 text over websockets.
		var browsers = (/(WebKit|Firefox|Trident)\/([0-9]+)/gi).exec(navigator.userAgent);
		var engine = browsers && browsers.length >= 3 ? browsers[1] : null
		var version = browsers && browsers.length >= 3 ? parseInt(browsers[2]) : null
		var supportsBinaryWebsockets = window.FileReader && (engine == "WebKit" && version >= 535) || (engine == "Firefox" && version >= 11) || (engine == "Trident" && version >= 6);

		if (supportsBinaryWebsockets) {
			connect(function (useSecureConnections, endpoint, connectTimeout, onConnect, onDisconnect, onMesssage) { return new _pio.websocketConnection(true, useSecureConnections, endpoint, connectTimeout, onConnect, onDisconnect, onMesssage); })
		} else {
			_pio.isFlashFallbackEnabled(function (enabled) {
				if (enabled) {
					connect(function (useSecureConnections, endpoint, connectTimeout, onConnect, onDisconnect, onMesssage) { return new _pio.flashSocketConnection(endpoint, connectTimeout, onConnect, onDisconnect, onMesssage); })
				} else {
					connect(function (useSecureConnections, endpoint, connectTimeout, onConnect, onDisconnect, onMesssage) { return new _pio.websocketConnection(false, useSecureConnections, endpoint, connectTimeout, onConnect, onDisconnect, onMesssage); })
				}
			})
		}

		function connect(createSocket) {
			// find the endpoints
			var endpointStrings = [];
			if (developmentServer) {
				endpointStrings.push(developmentServer);
			} else {
				for (var i = 0; i != endpoints.length; i++) {
					endpointStrings.push(endpoints[i].address + ":" + endpoints[i].port);
				}
			}

			function tryNextEndpoint() {
				if (endpointStrings.length > 0) {
					// grab the first endpoint
					var endpoint = endpointStrings[0];
					endpointStrings.splice(0, 1);

					// try connecting to this endpoint
					var s = createSocket(useSecureConnections, endpoint, 4000,
						function (connected, reason) { // onConnect
							if (connected) {
								socket = s;
								self.connected = true;
								// send join data
								var msg = self.createMessage('join');
								msg.addString(joinKey);
								if (joinData != null) {
									for (var x in joinData) {
										msg.addString(x);
										msg.addString('' + joinData[x]);
									}
								}
								self.sendMessage(msg);
							} else {
								_pio.debugLog("Unable to connect to endpoint: " + endpoint + ". reason: \"" + reason + (endpointStrings.length > 0 ? "\". Trying next endpoint." : "\". No more endpoints to try."));
								tryNextEndpoint();
							}
						}, function (reason) { // onDisconnect
							if (self.connected) {
								self.connected = false;
								setTimeout(function () {
									for (var i = 0; i != disconnectCallbacks.length; i++) {
										_pio.runCallback(disconnectCallbacks[i].callback, self, disconnectCallbacks[i].stackSource);
									}
								}, 100);
							}
						}, function (msg) { // onMessage
							if (waitingForJoinResult) {
								if (msg.type == "playerio.joinresult") {
									waitingForJoinResult = false;
									if (!msg.getBoolean(0)) {
										_pio.handleError(originalStack, errorCallback, msg.getInt(1), msg.getString(2))
									} else {
										_pio.runCallback(successCallback, self, null);
									}
								} else {
									_pio.handleError(originalStack, errorCallback, PlayerIOErrorCode.GeneralError, "The expected inital messagetype is: playerio.joinresult, received: " + joinResult.getType())
								}
							} else {
								executeCallbacks(msg.type, msg);
								executeCallbacks('*', msg);
							}
						}
					)
				} else {
					_pio.handleError(originalStack, errorCallback, PlayerIOErrorCode.GeneralError, "Could not establish a socket connection to any of the given endpoints for the room")
				}
			}

			tryNextEndpoint();

			function executeCallbacks(type, msg) {
				var arr = messageCallback[type];
				if (arr) {
					for (var i = 0; i < arr.length; i++) {
						_pio.runCallback(arr[i].callback, msg, arr[i].stackSource);
					}
				}
			}
		}

		/**
		* Indicates if the connection is still alive
		*/
		this.connected = false;

		/**
		* Add a disconnect callback that will be called when the connection is disconnected
		* @param {function()} callback The callback to be called when a disconnect happens
		*/
		this.addDisconnectCallback = function (callback) {
			disconnectCallbacks.push({ callback: callback, stackSourc: new Error() });
		}

		/**
		* Add a message callback for the given message type.
		* @param {string} type The type of message to invoke the callback for. Use '*' to handle all message types.
		* @param {function(message)} callback The callback to be called when a message of the given type is received
		*/
		this.addMessageCallback = function (type, callback) {
			if (type == null) {
				type = "*"
			}
			var list = messageCallback[type]
			if (!list) {
				messageCallback[type] = list = [];
			}
			list.push({ callback: callback, stackSource: new Error() });
		}

		/**
		* Remove an already registered disconnect callback
		* @param {function} callback The callback to remove
		*/
		this.removeDisconnectCallback = function (callback) {
			for (var i = 0; i < disconnectCallbacks.length; i++) {
				if (disconnectCallbacks[i].callback == callback) {
					disconnectCallbacks.splice(i, 1);
					i--;
				}
			}
		}

		/**
		* Remove an already registered message callback
		* @param {function} callback The callback to remove
		*/
		this.removeMessageCallback = function (callback) {
			for (var t in messageCallback) {
				var arr = messageCallback[t];
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].callback == callback) {
						arr.splice(i, 1);
						i--;
					}
				}
			}
		}

		/**
		* Create a message with arguments inline: connection.createMessage('invite', arg1, arg2...)
		* @param {string} type The string type to give to the message.
		* @return {message} message The message
		*/
		this.createMessage = function (type) {
			var msg = new _pio.message(type);
			for (var i = 1; i < arguments.length; i++) {
				msg.add(arguments[i]);
			}
			return msg;
		}

		/**
		* Send a message with arguments inline: connection.createMessage('invite', arg1, arg2...)
		* @param {string} type The string type to give to the message.
		*/
		this.send = function (type) {
			var msg = this.createMessage.apply(this, arguments);
			this.sendMessage(msg);
		}

		/**
		* Send a message 
		* @param {message} message The message to send.
		*/
		this.sendMessage = function (message) {
			if (self.connected) {
				socket.sendMessage(message);
			} else {
				queuedMessages.push(message);
			}
		}

		/**
		* Disconnect from the multiplayer room
		*/
		this.disconnect = function () {
			if (self.connected) {
				socket.disconnect();
			}
		}
	}

	/**
	* @class Represents a message sent between client and server.
	* A message consists of a string type, and a payload of zero or more typed parameters.
	* @example This is how to create a simple message that we send to the server indicating that this player is ready:
	* <listing>
	* //Create a message of type ready with no payload:
	* var m = connection.createMessage("ready");
	*
	* //Send the message to the server:
	* connection.sendMessage(m);
	* </listing>	
	*
	* @example Usually, it's much easier to simply use the convenience methods:
	* <listing>
	* //Send the server a message of which maps this player selected:
	* connection.Send("mapsselected", "fields-of-glory", "small-skirmish");
	*
	* //Send a chat message to the server, that it can broadcast:
	* connection.Send("chat", "Hey guys, are you ready to start the game?");
	* </listing>
	* @example You can also build up messages as you go, if you don't know the exact payload until runtime. 
	* In this example, imagine the player has multiple pieces and we send in the list of moves this player wants to do in a single turn.
	* <listing>
	* //Create a new message of type moves:
	* var m = connection.createMessage("moves");
	*
	* //Add all pending moves to the message:
	* foreach(var move in moves) {
	*	m.add(move.pieceid, move.x, move.y);
	* }
	*
	* //Send the message to the server:
	* connection.sendMessage(m);
	* </listing>
	*/
	_pio.message = function (type) {
		var self = this;
		var types = [];
		var objects = [];

		/** The type of the message
		* @type string
		*/
		this.type = type;

		/** The number of entries in this message
		* @type int
		*/
		this.length = 0;

		/**
		* Adds data entries to the Message object 
		* @param arguments Entries to add. Valid types are Number, String, Boolean and ByteArray. If a Number is passed, and it is an integer, it will be added to the first type it fits in this order: Int, UInt, Long, ULong. If it doesn't fit in any integer type, or if it's not an integer, it will be added as a Double.
		* @example How to add values to a message
		* <listing>
		* message.add("This is a chat message", 3, true);
		* </listing>
		*/
		this.add = function () {
			for (var i = 0; i < arguments.length; i++) {
				var value = arguments[i];
				switch (typeof (value)) {
					case 'string': self.addString(value); break;
					case 'boolean': self.addBoolean(value); break;
					case 'number':
						if (isFinite(value) && Math.floor(value) === value) {
							if (value >= -2147483648 && value <= 2147483647) {
								self.addInt(value); break;
							} else if (value > 0 && value <= 4294967295) {
								self.addUInt(value); break;
							} else if (value >= -9223372036854775000 && value <= 9223372036854775000) {
								//Boundary is rounded because max_long and min_long can't be accurately represented as double
								self.addLong(value); break;
							} else if (value > 0 && value <= 18446744073709550000) {
								//Boundary is rounded because max_ulong can't be accurately represented as double
								self.addULong(value); break;
							}
						}
						self.addDouble(value); break;
					case 'object':
						if (isByteArray(value)) {
							this.addByteArray(value)
							break;
						}
					default:
						throw _pio.error("The type of the value (" + value + ") cannot be inferred");
				}
			}
		}

		/** Add a value encoded as an int to the message
		* @param {number} value The number to add
		*/
		this.addInt = function (value) {
			add(value >= -2147483648 && value <= 2147483647, Math.trunc(value), entryType_Integer, "an integer (32bit)");
		}

		/** Add a value encoded as a uint to the message
		* @param {number} value The number to add
		*/
		this.addUInt = function (value) {
			add(value >= 0 && value <= 4294967295, Math.trunc(value), entryType_UnsignedInteger, "an unsigned integer (32bit)");
		}

		/** Add a value encoded as a long to the message
		* @param {number} value The number to add
		*/
		this.addLong = function (value) {
			//Boundary is rounded because max_long and min_long can't be accurately represented as double
			add(value >= -9223372036854775000 && value <= 9223372036854775000, Math.trunc(value), entryType_Long, "a long (64bit)");
		}

		/** Add a value encoded as a ulong to the message
		* @param {number} value The number to add
		*/
		this.addULong = function (value) {
			//Boundary is rounded because max_ulong can't be accurately represented as double
			add(value >= 0 && value <= 18446744073709550000, value, entryType_UnsignedLong, "an unsigned long (64bit)");
		}

		/** Add a boolean value to the message
		* @param {bool} value The bool to add
		*/
		this.addBoolean = function (value) {
			add(true, value ? true : false, entryType_Boolean, "a boolean value");
		}

		/** Add a value encoded as a float to the message
		* @param {number} value The number to add
		*/
		this.addFloat = function (value) {
			
			add(true, Number(value), entryType_Float, "a floating point value (32bit)");
		}

		/** Add a value encoded as a double to the message
		* @param {number} value The number to add
		*/
		this.addDouble = function (value) {
			
			add(true, Number(value), entryType_Double, "a double floating point value (64bit)");
		}

		/** Add a byte array value to the message
		* @param {byte[]} value The byte array to add
		*/
		this.addByteArray = function (value) {
			add(isByteArray(value), value, entryType_ByteArray, "a bytearray");
		}

		/** Add a string value to the message
		* @param {string} value The string to add
		*/
		this.addString = function (value) {
			add(true, value + '', entryType_String, "a string");
		}

		/** Get the int from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return int */
		this.getInt = function (index) {
			return get(index, entryType_Integer)
		}

		/** Get the uint from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return uint */
		this.getUInt = function (index) {
			return get(index, entryType_UnsignedInteger)
		}

		/** Get the long from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return long */
		this.getLong = function (index) {
			return get(index, entryType_Long)
		}

		/** Get the ulong from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return ulong */
		this.getULong = function (index) {
			return get(index, entryType_UnsignedLong)
		}

		/** Get the bool from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return bool */
		this.getBoolean = function (index) {
			return get(index, entryType_Boolean)
		}

		/** Get the double from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return double */
		this.getDouble = function (index) {
			return get(index, entryType_Double)
		}

		/** Get the float from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return float */
		this.getFloat = function (index) {
			return get(index, entryType_Float)
		}

		/** Get the int from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return int */
		this.getByteArray = function (index) {
			return get(index, entryType_ByteArray)
		}

		/** Get the string from the message at the given index
		* @param {int} index The zero-based index of the entry to get
		* @return string */
		this.getString = function (index) {
			return get(index, entryType_String)
		}

		/** Get a string representation of the message
		* @return string */
		this.toString = function () {
			var str = "msg.Type = " + this.type + "";
			for (var i = 0; i != this.length; i++) {
				str += ", msg[" + i + "] = " + objects[i] + " (" + getTypeString(types[i]) + ")"
			}
			return str;
		}

		this._internal_ = function (method, arg) {
			switch (method) {
				case 'get-objects': return objects;
				case 'get-types': return types;
			}
		}

		function add(check, value, type, errorMessage) {
			if (check) {
				objects.push(value);
				types.push(type);
				self.length = objects.length;
			} else {
				throw _pio.error("The given value (" + value + ") is not " + errorMessage);
			}
		}

		function get(index, type) {
			if (index > objects.length) {
				throw _pio.error("this message (" + self.type + ") only has " + objects.length + " entries");
			} else {
				if (types[index] == type) {
					return objects[index];
				} else {
					throw _pio.error("Value at index:" + index + " is a " + getTypeString(types[index]) + " and not a " + getTypeString(type) + " as requested. The value is: " + objects[index]);
				}
			}
		}

		function getTypeString(type) {
			var t = {}
			t[entryType_Integer] = "Integer"
			t[entryType_UnsignedInteger] = "Unsigned Integer"
			t[entryType_Long] = "Long"
			t[entryType_UnsignedLong] = "Unsigned Long"
			t[entryType_Double] = "Double"
			t[entryType_Float] = "Float"
			t[entryType_String] = "String"
			t[entryType_ByteArray] = "ByteArray"
			t[entryType_Boolean] = "Boolean"
			return t[type];
		}

		function isByteArray(value) {
			var isBytes = typeof (value) == 'object' && typeof (value.length) != 'undefined'
			if (isBytes) {
				for (var i = 0; i != value.length; i++) {
					if (value[i] > 255 || value[i] < 0) {
						isBytes = false;
						break;
					}
				}
			}
			return isBytes;
		}
	}

	/**
	* Information about a room returned from listRooms
	*/
	_pio.roomInfo = function (id, roomType, onlineUsers, roomData) {
		/** The id of the room 
		* @type string
		*/
		this.id = id;

		/** The type of the room (coresponding to the [RoomType(...)] attribute assignd to the room) 
		* @type string
		*/
		this.roomType = roomType;

		/** How many users are currently in the room 
		* @type int
		*/
		this.onlineUsers = onlineUsers;

		/** How many users are currently in the room 
		* @type object
		*/
		this.roomData = roomData;
	}

	_pio.byteWriter = function () {
		this.bytes = [];

		this.writeByte = function (byte) {
			if (byte >= 0 && byte <= 255) {
				this.bytes.push(byte);
			} else {
				throw new Error("This is not a byte value: " + byte);
			}
		}

		this.writeBytes = function (bytes) {
			for (var i = 0; i != bytes.length; i++) {
				this.writeByte(bytes[i]);
			}
		}

		this.writeTagWithLength = function (length, topPattern, bottomPattern) {
			if (length > 63 || length < 0) {
				this.writeBottomPatternAndBytes(bottomPattern, _pio.binaryserializer.bytesFromInt(length))
			} else {
				this.writeByte(topPattern | length);
			}
		}

		this.writeBottomPatternAndBytes = function (pattern, bytes) {
			var count = 0;
			if (bytes[0] != 0) {
				count = 3
			} else if (bytes[1] != 0) {
				count = 2;
			} else if (bytes[2] != 0) {
				count = 1;
			}

			this.writeByte(pattern | count);
			for (var i = bytes.length - count - 1; i != bytes.length; i++) {
				this.writeByte(bytes[i]);
			}
		}

		this.writeLongPattern = function (shortPattern, longPattern, bytes) {
			var count = 0;
			for (var i = 0; i != 7; i++) {
				if (bytes[i] != 0) {
					count = 7 - i;
					break;
				}
			}

			if (count > 3) {
				this.writeByte(longPattern | (count - 4));
			} else {
				this.writeByte(shortPattern | count);
			}

			for (var i = bytes.length - count - 1; i != bytes.length; i++) {
				this.writeByte(bytes[i]);
			}
		}
	}

	_pio.messageSerializer = function () {
		var topPattern = 192; 					//11000000
		var bottomPattern = 60;                 //00111100
		//------------------------------------------------
		var stringTopPattern = 192; 			//11000000
		var integerTopPattern = 128; 			//10000000
		var byteArrayTopPattern = 64; 			//01000000
		//------------------------------------------------
		var integerBottomPattern = 4; 			//00000100
		var unsignedIntegerBottomPattern = 8;   //00001000
		var stringBottomPattern = 12; 			//00001100
		var byteArrayBottomPattern = 16;        //00010000
		var shortLongBottomPattern = 48;        //00110000
		var longBottomPattern = 52; 			//00110100
		var shortUnsignedLongBottomPattern = 56; //00111000
		var unsignedLongBottomPattern = 60; 	//00111100
		//------------------------------------------------
		var doublePattern = 3; 					//00000011
		var floatPattern = 2; 					//00000010
		var booleanTruePattern = 1; 			//00000001
		var booleanFalsePattern = 0;            //00000000

		this.serializeMessage = function (message) {
			var writer = new _pio.byteWriter();
			var startLength = writer.length;

			// write the amount of items as first thing
			writer.writeTagWithLength(message.length, integerTopPattern, integerBottomPattern);

			// write the type as the second thing
			var bytes = _pio.binaryserializer.bytesFromString(message.type);
			writer.writeTagWithLength(bytes.length, stringTopPattern, stringBottomPattern);
			writer.writeBytes(bytes);

			// write all the contents of the message
			for (var i = 0; i != message.length; i++) {
				var value = message._internal_('get-objects')[i];
				switch (message._internal_('get-types')[i]) {
					case entryType_String:
						var bytes = _pio.binaryserializer.bytesFromString(value);
						writer.writeTagWithLength(bytes.length, stringTopPattern, stringBottomPattern);
						writer.writeBytes(bytes);
						break;
					case entryType_Integer:
						writer.writeTagWithLength(value, integerTopPattern, integerBottomPattern);
						break;
					case entryType_UnsignedInteger:
						writer.writeBottomPatternAndBytes(unsignedIntegerBottomPattern, _pio.binaryserializer.bytesFromUInt(value))
						break;
					case entryType_Long:
						writer.writeLongPattern(shortLongBottomPattern, longBottomPattern, _pio.binaryserializer.bytesFromLong(value));
						break;
					case entryType_UnsignedLong:
						writer.writeLongPattern(shortUnsignedLongBottomPattern, unsignedLongBottomPattern, _pio.binaryserializer.bytesFromULong(value));
						break;
					case entryType_ByteArray:
						writer.writeTagWithLength(value.length, byteArrayTopPattern, byteArrayBottomPattern);
						writer.writeBytes(value);
						break;
					case entryType_Double:
						writer.writeByte(doublePattern);
						writer.writeBytes(_pio.binaryserializer.bytesFromDouble(value));
						break;
					case entryType_Float:
						writer.writeByte(floatPattern);
						var fb = _pio.binaryserializer.bytesFromFloat(value);
						writer.writeBytes(fb);
						break;
					case entryType_Boolean:
						writer.writeByte(value ? booleanTruePattern : booleanFalsePattern);
						break;
				}
			}

			return writer.bytes;
		}

		this.deserializeMessage = function (bytes, start, count) {
			var position = start;
			var end = start + count;
			var output = null;
			var partsInMessage = 0;

			while (position < end) {
				var startPosition = position;
				var length = 0;
				var value = 0;

				// find the pattern used
				var tag = bytes[position];
				position++; // pass the tag
				var pattern = tag & topPattern;
				if (pattern == 0) {
					pattern = tag & bottomPattern;
					if (pattern == 0) {
						pattern = tag;
					}
				}

				// find the length of the actual data
				switch (pattern) {
					case stringBottomPattern:
					case byteArrayBottomPattern:
						length = (tag & 3) + 1; // bytes

						// do we have the bytes for the length?
						if (position + length > end) {
							throw new Error("Unexpected: Unfinished message");
						}

						// read the bytes containing the length
						var jump = length;
						length = _pio.binaryserializer.intFromBytes(bytes, position, length);
						position += jump; // move forward over the bytes containing the length
						break;
					case stringTopPattern: length = tag & 63; break;
					case integerTopPattern:
						value = tag & 63;
						break;
					case byteArrayTopPattern: length = tag & 63; break;
					case integerBottomPattern:
					case unsignedIntegerBottomPattern:
					case shortLongBottomPattern:
					case shortUnsignedLongBottomPattern:
						length = (tag & 3) + 1; // 3 = 00000011;
						break;
					case longBottomPattern:
					case unsignedLongBottomPattern:
						length = (tag & 3) + 5; // 3 = 00000011;
						break;
					case doublePattern: length = 8; break;
					case floatPattern: length = 4; break;
					case booleanTruePattern: break;
					case booleanFalsePattern: break;
				}

				// move forward and ensure we've got those bytes
				if (position + length > end) {
					throw new Error("Unexpected: Unfinished message");
				}

				switch (pattern) {
					case stringBottomPattern:
					case stringTopPattern:
						if (output == null) {
							output = new _pio.message(_pio.binaryserializer.stringFromBytes(bytes, position, length));
							partsInMessage++; //Add one to parts since the type of the message isn't counted as a parameter.
						} else {
							output.addString(_pio.binaryserializer.stringFromBytes(bytes, position, length));
						}
						break;
					case integerBottomPattern:
						value = _pio.binaryserializer.intFromBytes(bytes, position, length);
					case integerTopPattern:
						if (partsInMessage == 0) {
							//If partsInMessage is 0, then we've just started deserializing a new message, which means that
							//the first integer is the number of parameters in the message.
							partsInMessage = value;
						} else {
							output.addInt(value);
						}
						break;
					case byteArrayBottomPattern:
					case byteArrayTopPattern: output.addByteArray(bytes.slice(position, position + length)); break;
					case unsignedIntegerBottomPattern: output.addUInt(_pio.binaryserializer.uintFromBytes(bytes, position, length)); break;
					case shortLongBottomPattern:
					case longBottomPattern: output.addLong(_pio.binaryserializer.longFromBytes(bytes, position, length)); break;
					case shortUnsignedLongBottomPattern:
					case unsignedLongBottomPattern: output.addULong(_pio.binaryserializer.ulongFromBytes(bytes, position, length)); break;
					case doublePattern: output.addDouble(_pio.binaryserializer.doubleFromBytes(bytes, position, length)); break;
					case floatPattern: output.addFloat(_pio.binaryserializer.floatFromBytes(bytes, position, length)); break;
					case booleanTruePattern: output.addBoolean(true); break;
					case booleanFalsePattern: output.addBoolean(false); break;
				}

				// move forward
				position += length;

				// no parts left in the message -- then it's done!
				if (output != null && (--partsInMessage) == 0) {
					return output;
				}
			}
			throw new Error("Unexpected: Misaligned message");
		}
	}


	_pio.binaryserializer = {
		pow2 : function(n) {
			return (n >= 0 && n < 31) ? (1 << n) : (this.pow2[n] || (this.pow2[n] = Math.pow(2, n)));
		},
		_intEncode: function (value, bytes) {
			
			var b = new Array(bytes);
			if (bytes == 4) {
				b = [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
			} else {
				if (value >= 0) {
					var hi = Math.floor(value / this.pow2(32));
					var lo = value - hi * this.pow2(32);
					b = [(hi >>> 24) & 0xff, (hi >>> 16) & 0xff, (hi >>> 8) & 0xff, hi & 0xff, (lo >>> 24) & 0xff, (lo >>> 16) & 0xff, (lo >>> 8) & 0xff, lo & 0xff];
				} else {
					var hi = Math.floor(value / this.pow2(32));
					var lo = value - hi * this.pow2(32);
					hi += this.pow2(32);
					b = [(hi >>> 24) & 0xff, (hi >>> 16) & 0xff, (hi >>> 8) & 0xff, hi & 0xff, (lo >>> 24) & 0xff, (lo >>> 16) & 0xff, (lo >>> 8) & 0xff, lo & 0xff];
				}
			}
			return b;
		},
		_floatEncode: function (value, mantSize, expSize) {
			
			var signBit = value < 0 ? 1 : 0,
				exponent,
				mantissa,
				eMax = ~(-1 << (expSize - 1)),
				eMin = 1 - eMax;

			if (value < 0) {
				value = -value;
			}

			if (value === 0) {
				exponent = 0;
				mantissa = 0;
			} else if (isNaN(value)) {
				exponent = 2 * eMax + 1;
				mantissa = 1;
			} else if (value === Infinity) {
				exponent = 2 * eMax + 1;
				mantissa = 0;
			} else {
				exponent = Math.floor(Math.log(value) / Math.LN2);
				if (exponent >= eMin && exponent <= eMax) {
					mantissa = Math.floor((value * this.pow2(-exponent) - 1) * this.pow2(mantSize));
					exponent += eMax;
				} else {
					mantissa = Math.floor(value / this.pow2(eMin - mantSize));
					exponent = 0;
				}
			}

			var b = [];
			while (mantSize >= 8) {
				b.push(mantissa % 256);
				mantissa = Math.floor(mantissa / 256);
				mantSize -= 8;
			}
			exponent = (exponent << mantSize) | mantissa;
			expSize += mantSize;
			while (expSize >= 8) {
				b.push(exponent & 0xff);
				exponent >>>= 8;
				expSize -= 8;
			}
			b.push((signBit << expSize) | exponent);
			b.reverse(); //big endian
			return b;
		},
		bytesFromString: function (value) {
			var byteArray = [];
			for (var i = 0; i < value.length; i++) {
				if (value.charCodeAt(i) <= 0x7F) {
					byteArray.push(value.charCodeAt(i));
				} else {
					var h = encodeURIComponent(value.charAt(i)).substr(1).split('%');
					for (var j = 0; j < h.length; j++) {
						byteArray.push(parseInt(h[j], 16));
					}
				}
			}
			return byteArray;
		},
		bytesFromInt: function (value) {
			return this._intEncode(value, 4);
		},
		bytesFromUInt: function (value) {
			return this._intEncode(value, 4);
		},
		bytesFromLong: function (value) {
			return this._intEncode(value, 8);
		},
		bytesFromULong: function (value) {
			return this._intEncode(value, 8);
		},
		bytesFromFloat: function (value) {
			return this._floatEncode(value, 23, 8);
		},
		bytesFromDouble: function (value) {
			return this._floatEncode(value, 52, 11);
		},
		//------------

		_intDecode: function (bytes, position, length, typeBytes, signed) {
			var end = position + length - 1;
			var negate = signed && length == typeBytes && bytes[position] & 0x80;
			var value = 0, carry = 1;
			for (var i = 0; i < length; i++) {
				var v = bytes[end - i];
				if (negate) {
					v = (v ^ 0xff) + carry;
					carry = v >> 8;
					v = v & 0xff;
				}
				value += v * this.pow2(i*8);
			}
			value = negate ? -value : value;
			return value;
		},
		_float32Decode: function (bytes, position) {
			
			var b = bytes.slice(position, position + 4).reverse(),
				sign = 1 - (2 * (b[3] >> 7)),
				exponent = (((b[3] << 1) & 0xff) | (b[2] >> 7)) - 127,
				mantissa = ((b[2] & 0x7f) << 16) | (b[1] << 8) | b[0];

			if (exponent === 128) {
				if (mantissa !== 0) {
					return NaN;
				} else {
					return sign * Infinity;
				}
			}

			if (exponent === -127) { // Denormalized
				return sign * mantissa * this.pow2(-126 - 23);
			}

			return sign * (1 + mantissa * this.pow2(-23)) * this.pow2(exponent);
		},
		_float64Decode: function (bytes, position) {
			
			var b = bytes.slice(position, position + 8).reverse(),
				sign = 1 - (2 * (b[7] >> 7)),
				exponent = ((((b[7] << 1) & 0xff) << 3) | (b[6] >> 4)) - ((1 << 10) - 1),
				mantissa = ((b[6] & 0x0f) * this.pow2(48)) + (b[5] * this.pow2(40)) + (b[4] * this.pow2(32)) +
							(b[3] * this.pow2(24)) + (b[2] * this.pow2(16)) + (b[1] * this.pow2(8)) + b[0];

			if (exponent === 1024) {
				if (mantissa !== 0) {
					return NaN;
				} else {
					return sign * Infinity;
				}
			}

			if (exponent === -1023) { // Denormalized
				return sign * mantissa * this.pow2(-1022 - 52);
			}

			return sign * (1 + mantissa * this.pow2(-52)) * this.pow2(exponent);
		},
		stringFromBytes: function (bytes, position, length) {
			var str = '';
			for (var i = position; i < position + length; i++) str += bytes[i] <= 0x7F ?
                bytes[i] === 0x25 ? "%25" : // %
                String.fromCharCode(bytes[i]) :
                "%" + bytes[i].toString(16).toUpperCase();
			return decodeURIComponent(str);
		},
		intFromBytes: function (bytes, position, length) {
			return this._intDecode(bytes, position, length, 4, true);
		},
		uintFromBytes: function (bytes, position, length) {
			return this._intDecode(bytes, position, length, 4, false);
		},
		longFromBytes: function (bytes, position, length) {
			return this._intDecode(bytes, position, length, 8, true);
		},
		ulongFromBytes: function (bytes, position, length) {
			return this._intDecode(bytes, position, length, 8, false);
		},
		floatFromBytes: function (bytes, position, length) {
			if (length == 4) {
				return this._float32Decode(bytes, position);
			}
			return NaN;
		},
		doubleFromBytes: function (bytes, position, length) {
			if (length == 8) {
				return this._float64Decode(bytes, position);
			}
			return NaN;
		}
	}

	// simple bas64 round trip methods for arrays of bytes (0-255)
	var codex = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var inverseCodex = [];
	for (var i = 0; i != codex.length; i++) {
		inverseCodex[codex.charCodeAt(i)] = i;
	};
	_pio.base64encode = function (bytes) {
		var output = [];

		for (var b = 0; b < bytes.length; b++) {
			// pick the 3 bytes
			var b1 = bytes[b];
			var b2 = ++b <= bytes.length ? bytes[b] : NaN;
			var b3 = ++b <= bytes.length ? bytes[b] : NaN;

			// encode them together
			var enc1 = b1 >> 2;
			var enc2 = ((b1 & 3) << 4) | (b2 >> 4);
			var enc3 = ((b2 & 15) << 2) | (b3 >> 6);
			var enc4 = b3 & 63;

			// overflow w. /
			if (isNaN(b2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(b3)) {
				enc4 = 64;
			}

			output.push(codex.charAt(enc1));
			output.push(codex.charAt(enc2));
			output.push(codex.charAt(enc3));
			output.push(codex.charAt(enc4));
		}

		return output.join("")
	}

	_pio.base64decode = function (string) {
		var output = [];
		for (var c = 0; c < string.length; c++) {
			// pick the 4 characters representing 3 bytes
			var chr1 = inverseCodex[string.charCodeAt(c)];
			var chr2 = ++c < string.length ? inverseCodex[string.charCodeAt(c)] : 64;
			var chr3 = ++c < string.length ? inverseCodex[string.charCodeAt(c)] : 64;
			var chr4 = ++c < string.length ? inverseCodex[string.charCodeAt(c)] : 64;

			// encode them together
			var b1 = (chr1 << 2) | (chr2 >> 4);
			var b2 = ((chr2 & 15) << 4) | (chr3 >> 2);
			var b3 = ((chr3 & 3) << 6) | chr4;

			output.push(b1);
			if (chr3 != 64) {
				output.push(b2);
				if (chr4 != 64) {
					output.push(b3);
				}
			}
		}
		return output;
	}
})();
(function () {
	/**
	* @class The Achievements service. This class is used to update the progress of an achievement for the 
	* current user, and loading achievements of other users. All achievements have to be defined in the 
	* admin panel first.
	* @example Refresh to get the user's current achievements and the progress of each:
	* <listing>
	* client.achievements.refresh(function() {
	*	//Print all achievements and their progress
	*	for (var i=0; i!=client.achievements.myAchievements.length; i++) {
	*		var achievement = client.achievements.myAchievements[i];
	*		console.log("[ " + achievement.title + " ]");
	*		console.log(achievement.description);
	*		console.log(achievement.progress);
	*		console.log(achievement.progressGoal);
	*		console.log(achievement.progressRatio);
	*	}
	* }, function(error) { 
	*	console.log(error);
	* });
	*</listing>
	* @example Load achivements for other users:
	* <listing>
	* client.achievements.load(['connectUserId1', 'connectUserId2'], function(result) {
	*	for (var user in result) {
	*		var list = result[user];
	*		console.log(user);
	*		for (var i = 0; i != list.length; i++) {
	*			var achievement = list[i];
	*			console.log("[ "+ achievement.title +" ]");
	*			console.log(achievement.description);
	*			console.log(achievement.progress);
	*			console.log(achievement.progressGoal);
	*			console.log(achievement.progressRatio);
	*		}
	*	}
	* }, function(error) {
	*	console.log(error);
	* });
	*</listing>
	* @example Set the progress of the achievement "fiveinarow" to 2.
	* <listing>
	* client.achievements.progressSet('fiveinarow', 2, function(achievement) {
	* 	console.log(achievement);
	* }, function(error) {
	*	console.log(error);
	* });
	*</listing>
	*/
	_pio.achievements = function (channel) {
		var currentVersion = null;
		/** The list of achievements for the current user. You must call refresh() first to initialize this list.
		* @type achievement[]
		*/
		this.myAchievements = "[ERROR: You tried to access achievements.myAchievements before loading them. You have to call the refresh method first.]";
		this.onCompleteHandlers = [];
		var self = this;

		/**
		* Add an OnComplete event handler that will be called every time an achievement is completed.
		* @param {function(achievement)} onComplete The function to add.
		*/
		this.addOnComplete = function (onCompleteHandler) {
			if (typeof onCompleteHandler === 'function' && onCompleteHandler.length == 1) {
				self.onCompleteHandlers.push(onCompleteHandler);
			} else {
				throw new PlayerIOError(PlayerIOErrorCode.InvalidArgument, "Expects argument to be a function that takes an achievement as an argument.");
			}
		}

		/**
		* Get an achievement by id
		* @param {string} achievementId Id of the achievement to get.
		*/
		this.get = function (achievementId) {
			if (typeof self.myAchievements === 'string') { return null; }
			for (var i = 0; i < self.myAchievements.length; i++) {
				if (self.myAchievements[i].id == achievementId) {
					return self.myAchievements[i];
				}
			}
			return null;
		}

		/**
		* Refresh the list of achievements.
		* @param {function()} successCallback Callback function that will be called when the refresh is complete
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.refresh = function (successCallback, errorCallback) {
			channel.achievementsRefresh(currentVersion, successCallback, errorCallback, function (result) {
				if (currentVersion != result.version) {
					currentVersion = result.version;
					if (result.achievements == null || result.achievements.length == 0) {
						self.myAchievements = [];
					} else {
						var ach = [];
						for (var i = 0; i < result.achievements.length; i++) {
							var item = result.achievements[i];
							ach.push(new _pio.achievement(item.identifier, item.title, item.description, item.imageurl, item.progress, item.progressgoal, item.lastupdated));
						}
						self.myAchievements = ach;
					}
				}
			});
		}

		/**
		* Load the achivements for multiple users by their connectUserId
		* @param {string[]} userIds The list of users to load achievements for.
		* @param {function(result)} successCallback Callback function that will be called with the loaded achievements.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.load = function (userIds, successCallback, errorCallback) {
			if (typeof (userIds) != 'object' && !requests.length) {
				var e = _pio.error("The first argument to load should be an array: client.achievements.load(['user1', 'user2', ...], ...)");
				_pio.handleError(e, errorCallback, e.code, e.message);
				return;
			}

			channel.achievementsLoad(userIds, successCallback, errorCallback, function (result) {
				if (result == null || result.length == 0) { return {}; }
				var users = {};
				for (var i = 0; i < result.userachievements.length; i++) {
					var user = result.userachievements[i];
					var ach = [];
					for (var j = 0; j < user.achievements.length; j++) {
						var item = user.achievements[j];
						ach.push(new _pio.achievement(item.identifier, item.title, item.description, item.imageurl, item.progress, item.progressgoal, item.lastupdated));
					}
					users[user.userid] = ach;
				}
				return users;
			});
		}

		/**
		* Sets the progress of the specified achievement
		* @param {string} achievementId The id of the achievement to set the progress for.
		* @param {Number} progress The value to set the progress to
		* @param {function(achievement)} successCallback Callback function that will be called when the operation has completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.progressSet = function (achievementId, progress, successCallback, errorCallback) {
			channel.achievementsProgressSet(achievementId, progress, successCallback, errorCallback, function (result) {
				return update(result.achievement, result.completednow);
			});
		}

		/**
		* Adds the delta to the progress of the specified achievement
		* @param {string} achievementId The id of the achievement to add to the progress for.
		* @param {Number} progressDelta The value to add to the progress.
		* @param {function(achievement)} successCallback Callback function that will be called when the operation has completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.progressAdd = function (achievementId, progressDelta, successCallback, errorCallback) {
			channel.achievementsProgressAdd(achievementId, progressDelta, successCallback, errorCallback, function (result) {
				return update(result.achievement, result.completednow);
			});
		}

		/**
		* Sets the progress of the specified achievement to the bigger value of the current value and the given value.
		* @param {string} achievementId The id of the achievement to set the progress for.
		* @param {Number} progress The value to set the progress to, if it's bigger than the current value.
		* @param {function(achievement)} successCallback Callback function that will be called when the operation has completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.progressMax = function (achievementId, progress, successCallback, errorCallback) {
			channel.achievementsProgressMax(achievementId, progress, successCallback, errorCallback, function (result) {
				return update(result.achievement, result.completednow);
			});
		}

		/**
		* Completes the specified achievement by setting the progress to the progress goal.
		* @param {string} achievementId The id of the achievement to complete.
		* @param {function(achievement)} successCallback Callback function that will be called when the operation has completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.progressComplete = function (achievementId, successCallback, errorCallback) {
			channel.achievementsProgressComplete(achievementId, successCallback, errorCallback, function (result) {
				return update(result.achievement, result.completednow);
			});
		}

		function update(achievement, completednow) {
			//Convert received achievement data into client achievement object
			var ach = new _pio.achievement(achievement.identifier, achievement.title, achievement.description, achievement.imageurl, achievement.progress, achievement.progressgoal, achievement.lastupdated);
			//Update myAchievements, replacing the old if we have it.
			if (typeof self.myAchievements !== 'string') {
				for (var i = 0; i < self.myAchievements.length; i++) {
					if (self.myAchievements[i].id == ach.id) {
						self.myAchievements[i] = ach;
						//Clear version, because we can't be sure our current local state is the latest.
						self.currentVersion = null;
					}
				}
			}

			//Fire event on complete.
			if (completednow) {
				for (var i = 0; i < self.onCompleteHandlers.length; i++) {
					var handler = self.onCompleteHandlers[i];
					handler(ach);
				}
			}

			return ach;
		}
	}

	/**
	* @class This class encapsulates all the data of a single achievement.
	*/
	_pio.achievement = function (id, title, description, imageUrl, progress, progressGoal, lastUpdated) {
		/** The id of this achievement.
		* @type string
		*/
		this.id = id;
		/** The title of this achievement.
		* @type string
		*/
		this.title = title;
		/** The description of this achievement.
		* @type string
		*/
		this.description = description;
		/** The image url of this achievement.
		* @type string
		*/
		this.imageUrl = imageUrl;
		/** The progress of this achievement.
		* @type Number
		*/
		this.progress = (typeof progress === 'undefined') ? 0 : progress;
		/** The progress goal of this achievement.
		* @type Number
		*/
		this.progressGoal = progressGoal;
		/** When this achievement was last updated.
		* @type Date
		*/
		this.lastUpdated = new Date(lastUpdated * 1000);
		/** The progress ratio of this achievement.
		* @type Number
		*/
		this.progressRatio = this.progress / this.progressGoal;
		/** If this achievement is completed.
		* @type bool
		*/
		this.completed = (this.progress == this.progressGoal);
	}
})();

(function () {
	/**
	* @class The PlayerInsight service. This class is used for setting segments for the current user and tracking
	* events in PlayerInsight.
	* @example Load PlayerInsight data:
	* <listing>
	* client.playerInsight.refresh(function() {
	*	//How many users are online in this game?
	*	console.log(client.playerInsight.playersOnline);
	*	//What segments are set on the current user?
	*	console.log(client.playerInsight.segments);
	* }, function(error) {
	*     console.log(error);
	* });
	* </listing>
	* @example Set segments on the current user:
	* <listing>
	* client.playerInsight.setSegments({browser:'chrome', build:'v23'}, function() {
	*	//Success
	*	console.log(client.playerInsight.segments);
	* }, function(error) {
	*     console.log(error);
	* });
	* </listing>
	* @example Track a $1 purchase:
	* <listing>
	* client.playerInsight.trackExternalPayment('USD', 100, function (result) {
	*	//Success
	* }, function(error) {
	*     console.log(error);
	* });
	* </listing>
	*/
	_pio.playerInsight = function (channel) {
		/** The number of users online in this game. You must call refresh() to initialize this number.
		* @type Number
		*/
		this.playersOnline = "[ERROR: You tried to access playerInsight.playersOnline before loading it. You have to call the refresh method first.]";

		/** The list of PlayerInsight segments that are set on this user. You must call refresh() to initialize this list.
		* @type Object
		*/
		this.segments = {};
		var self = this;

		/**
		* Refresh the players online counter and the current segments of the user.
		* @param {function()} successCallback Callback function that will be called when the refresh is complete.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.refresh = function (successCallback, errorCallback) {
			channel.playerInsightRefresh(successCallback, errorCallback, function (result) {
				setState(result.state);
			});
		}

		/**
		* Assign custom PlayerInsight segments to the current user
		* @param {Object} segments Custom segments for the user in PlayerInsight
		* @param {function()} successCallback Callback function that will be called when the operation is complete.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.setSegments = function (segments, successCallback, errorCallback) {
			channel.playerInsightSetSegments(_pio.convertToSegmentArray(segments), successCallback, errorCallback, function (result) {
				setState(result.state);
			});
		}

		/**
		* Tell PlayerInsight who invited the current user in this session. Used for viral analysis.
		* @param {string} invitingUserId The connectUserId of the user who invited this user.
		* @param {string} invitationChannel An identifier for the channel the invitation was received over, like 'email' or 'fb_invite'.
		* @param {function()} successCallback Callback function that will be called when the operation is complete.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.trackInvitedBy = function (invitingUserId, invitationChannel, successCallback, errorCallback) {
			channel.playerInsightTrackInvitedBy(invitingUserId, invitationChannel, successCallback, errorCallback, function (result) { });
		}

		/**
		* Track the given event for the current user in PlayerInsight
		* @param {string} eventType The name of the event to track.
		* @param {Number} value The amount to add to the counter value.
		* @param {function()} successCallback Callback function that will be called when the operation is complete.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.trackEvent = function (eventType, value, successCallback, errorCallback) {
			channel.playerInsightTrackEvents([{eventtype:eventType, value:value}], successCallback, errorCallback, function (result) { });
		}

		/**
		* Track a completed payment in PlayerInsight from an external non-PayVault payment method.
		* @param {string} currency The currency the payment was made in.
		* @param {string} amount The amount of the payment in the given currency.
		* @param {function()} successCallback Callback function that will be called when the operation is complete.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.trackExternalPayment = function (currency, amount, successCallback, errorCallback) {
			channel.playerInsightTrackExternalPayment(currency, amount, successCallback, errorCallback, function (result) { });
		}

		/**
		* Keep the PlayerInsight session alive. Call this method if you know the game hasn't made any other API requests in the last 20 minutes, and the player is still playing.
		* @param {function()} successCallback Callback function that will be called when the operation is complete.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.sessionKeepAlive = function (successCallback, errorCallback) {
			channel.playerInsightSessionKeepAlive(successCallback, errorCallback, function (result) { });
		}

		function setState(state) {
			if (state.playersonline == -1) {
				self.playersOnline = "[ERROR: The current connection does not have the rights required to read the playersonline variable.]";
			} else {
				self.playersOnline = state.playersonline;
			}
			self.segments = _pio.convertFromKVArray(state.segments);
		}
	}
})();
(function () {
	/**
	* @class The OneScore service. This class is used to update the score of the current user, and loading the 
	* scores of other users.
	* @example Load the current user's OneScore and print the details:
	* <listing>
	* client.oneScore.refresh(function() {
	*	console.log(client.oneScore.score);
	*	console.log(client.oneScore.percentile);
	*	console.log(client.oneScore.topRank);
	* }, function(error) { 
	*     console.log(error);
	* });
	* </listing>
	* @example Setting the current user's OneScore:
	* <listing>
	*client.oneScore.set(5, function(result) {
	*	//Success
	* }, function(error) { 
	*     console.log(error);
	* });
	* </listing>
	* @example Adding to the current user's OneScore:
	* <listing>
	*client.oneScore.add(10, function(result) {
	*	//Success
	* }, function(error) { 
	*     console.log(error);
	* });
	* </listing>
	* @example Loading other users' OneScore:
	* <listing>
	*client.oneScore.load(['UserId1', 'UserId2', 'Bob', 'Bobbelina'], function(result) {
	*	//Print out the scores for each user
	*	for (var i = 0; i != result.length; i++) {
	*		console.log(result[i]);
	*	}
	* }, function(error) { 
	*     console.log(error);
	* });
	* </listing>
	*/
	_pio.oneScore = function (channel) {
		/** The percentile compared to all other players. A value from 0 -> 100. A value of 30.0 means you are in the bottom 30% of players. A value of 100 means you are in the top 1% with other players. You must call refresh() first to initialize this value.
		* @type Number
		*/
		this.percentile = "[ERROR: You tried to access oneScore.percentile before loading the OneScore. You have to call the refresh method first.]";

		/** The score. You must call refresh() first to initialize this value.
		* @type Number
		*/
		this.score = "[ERROR: You tried to access oneScore.score before loading the OneScore. You have to call the refresh method first.]";

		/** The absolute ranking number -- if you are one of the N top players, then it returns N. 1 means you are the best. Returns 0 if you are not one the top N players. (N is currently 1000.) You must call refresh() first to initialize this value.
		* @type Number
		*/
		this.topRank = "[ERROR: You tried to access oneScore.topRank before loading the OneScore. You have to call the refresh method first.]";
		var self = this;

		/**
		* Refresh the OneScore of the current user.
		* @param {function()} successCallback Callback function that will be called when the refresh is complete
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.refresh = function (successCallback, errorCallback) {
			channel.oneScoreRefresh(successCallback, errorCallback, function (result) {
				var score = new _pio.oneScoreValue(result.onescore.percentile, result.onescore.score, result.onescore.toprank);
				self.percentile = score.percentile;
				self.score = score.score;
				self.topRank = score.toprank;
			});
		}

		/**
		* Sets the OneScore for the user.
		* @param {number} score The score to set for the user.
		* @param {function(oneScoreValue)} successCallback Callback function that will be called when the operation has been completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.set = function (score, successCallback, errorCallback) {
			channel.oneScoreSet(score, successCallback, errorCallback, function (result) {
				var score = new _pio.oneScoreValue(result.onescore.percentile, result.onescore.score, result.onescore.toprank);
				self.percentile = score.percentile;
				self.score = score.score;
				self.topRank = score.toprank;
				return score;
			});
		}

		/**
		* Adds the score to the OneScore for the user.
		* @param {number} score The score to add for the user.
		* @param {function(oneScoreValue)} successCallback Callback function that will be called when the operation has been completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.add = function (score, successCallback, errorCallback) {
			channel.oneScoreAdd(score, successCallback, errorCallback, function (result) {
				var score = new _pio.oneScoreValue(result.onescore.percentile, result.onescore.score, result.onescore.toprank);
				self.percentile = score.percentile;
				self.score = score.score;
				self.topRank = score.toprank;
				return score;
			});
		}
		
		/**
		* Load the OneScores for multiple users by their connectUserId
		* @param {string[]} userIds The list of users to load scores for.
		* @param {function(oneScoreValue[])} successCallback Callback function that will be called with the loaded scores.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.load = function (userIds, successCallback, errorCallback) {
			if (typeof (userIds) != 'object' && !requests.length) {
				var e = _pio.error("The first argument to load should be an array: client.oneScore.load(['user1', 'user2', ...], ...)");
				_pio.handleError(e, errorCallback, e.code, e.message);
				return;
			}

			channel.oneScoreLoad(userIds, successCallback, errorCallback, function (result) {
				if (result == null || result.onescores == null || result.onescores.length == 0) { return []; }
				var scores = [];
				var j = 0;
				for (var i = 0; i < userIds.length; i++) {
					var score = result.onescores[j];
					if (score && userIds[i] == score.userid) {
						scores.push(new _pio.oneScoreValue(score.percentile, score.score, score.toprank));
						j++;
					} else {
						scores.push(null);
					}
				}
				return scores;
			});
		}
	}

	/**
	* @class This class encapsulates the OneScore value for a single user. It contains the user's score, as well as the user's global rank.
	*/
	_pio.oneScoreValue = function (percentile, score, topRank) {
		/** The percentile compared to all other players. A value from 0 -> 100. A value of 30.0 means you are in the bottom 30% of players. A value of 100 means you are in the top 100% with other players.
		* @type Number
		*/
		this.percentile = (typeof percentile === 'undefined') ? 0 : percentile;
		/** The score.
		* @type Number
		*/
		this.score = (typeof score === 'undefined') ? 0 : score;
		/** The absolute ranking number -- if you are one of the N top players, then it returns N. 1 means you are the best. Returns 0 if you are not one the top N players. (N is currently 1000.)
		* @type Number
		*/
		this.topRank = (typeof topRank === 'undefined') ? 0 : topRank;
	}
})();
(function () {
	/**
	* @class The Notifications service. This class is used for registering mobile endpoints and sending 
	* mobile push notifications to other users.
	* @example Refresh and list the user's registered endpoints:
	* <listing>
	* client.notifications.refresh(function() {
	*	for (var i = 0; i != client.notifications.myEndpoints.length; i++) {
	*		console.log(client.notifications.myEndpoints[i])
	*	}
	* }, function(error) { 
	*     console.log(error);
	* });
	* </listing>

	* @example Registering a notification endpoint for the current client:
	* <listing>
	*client.notifications.registerEndpoint(
	*	'test',								//Type
	*	'identifier',						//Device identifier
	*	{ configuration: 'goes here' },		//Optional configuration
	*	true,								//Initially enabled
	*	function () {
	*		//Success
	*	}, function(error) { 
	*		console.log(error);
	*	}
	* );
	* </listing>

	* @example Sending a notification:
	* <listing>
	* client.notifications.send([{ endpointType: 'test', recipientUserId: 'someUserId', message: 'Hello world!' }], function () {
	*	//Notification sent
	* }, function(error) { 
	*     console.log(error);
	* });
	* </listing>
	*/
	_pio.notifications = function (channel) {
		/** The list of registered endpoints for the current user. You must call refresh() first to initialize this list.
		* @type notificationEndpoint[]
		*/
		this.myEndpoints = "[ERROR: You tried to access notifications.myEndpoints before calling refresh.]";
		var self = this;
		var version = ""

		function refreshed(result) {
			if( result.version != version){
				var list = []
				if(result.endpoints){
					for (var i = 0; i != result.endpoints.length; i++) {
						var e = result.endpoints[i]
						list[i] = new _pio.notificationEndpoint(e.type, e.identifier, _pio.convertFromKVArray(e.configuration), e.enabled?true:false)
					}
				}
				version = result.version;
				self.myEndpoints = list;
			}
		}

		function equalConfiguration(c1, c2) {
			return JSON.stringify(c1) == JSON.stringify(c2);
		}

		function get(type, identifier) {
			if (version != "") {
				for (var i = 0; i != self.myEndpoints.length; i++) {
					var ep = self.myEndpoints[i]
					if (ep.type == type && ep.identifier == identifier) {
						return ep
					}
				}
			}
			return null
		}

		function getIds(endpoints) {
			var result = []
			if (endpoints && endpoints.length > 0) {
				for (var i = 0; i != endpoints.length; i++) {
					var ep = endpoints[i]
					if (ep.type && ep.identifier) {
						result.push({type:ep.type, identifier:ep.identifier})
					}
				}
			}
			return result;
		}

		/**
		* Refresh the notification endpoints of the current user.
		* @param {function()} successCallback Callback function that will be called when the refresh is complete
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs
		*/
		this.refresh = function (successCallback, errorCallback) {
			channel.notificationsRefresh(version, successCallback, errorCallback, refreshed)
		}

		/**
		* Register a device or endpoint with Player.IO
		* @param {string} endpointType Endpoint type, such as, IOS, Android, email, etc.
		* @param {string} identifier The identifier of the endpoint, such as the device token on iOS or an email address for email.
		* @param {object} configuration Configuration relating to the endpoint. Can be null.
		* @param {bool} enabled Should the endpoint be enabled
		* @param {function()} successCallback Callback function that will be called when the operation has been completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.registerEndpoint = function (endpointType, identifier, configuration, enabled, successCallback, errorCallback) {
			var current = get(endpointType, identifier)
			if (current == null || current.enabled != enabled || !equalConfiguration(current.configuration, configuration)) {
				channel.notificationsRegisterEndpoints(version, [{ type: endpointType, identifier: identifier, configuration: _pio.convertToKVArray(configuration), enabled: enabled }], successCallback, errorCallback, refreshed)
			}else if(successCallback){ successCallback() }
		}

		/**
		* Enables or disabled the given endpoints
		* @param {notificationEndpoint[]} endpoints The endpoints to enable or disable.
		* @param {bool} enabled If true, all the given endpoints will be enabled. If false, they'll be disabled.
		* @param {function()} successCallback Callback function that will be called when the operation has been completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.toggleEndpoints = function (endpoints, enable, successCallback, errorCallback) {
			var ids = getIds(endpoints)
			if (ids.length > 0) {
				channel.notificationsToggleEndpoints(version, ids, enable?true:false, successCallback, errorCallback, refreshed)
			}else if(successCallback){ successCallback() }
		}

		/**
		* Deletes the given endpoints
		* @param {notificationEndpoint[]} endpoints The endpoints to delete
		* @param {function()} successCallback Callback function that will be called when the operation has been completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.deleteEndpoints = function (endpoints, successCallback, errorCallback) {
			var ids = getIds(endpoints)
			if (ids.length > 0) {
				channel.notificationsDeleteEndpoints(version, ids, successCallback, errorCallback, refreshed)
			}else if(successCallback){ successCallback() }
		}

		/**
		* Send one or more notifications
		* @param {object[]} notifications The notifications to send
		* @param {function()} successCallback Callback function that will be called when the operation has been completed.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.send = function (notifications, successCallback, errorCallback) {
			var toSend = []
			for(var i=0;i!=notifications.length;i++){
				var s = notifications[i]
				var n = { recipient: s.recipientUserId, endpointtype: s.endpointType, data: {} }
				if( (n.recipient+'').length == 0 || (n.endpointtype+'').length == 0){
					console.log("error")
				}
				for(var x in s){
					if(x != 'recipientUserId' && x != 'endpointType'){
						n.data[x] = s[x]
					}
				}
				toSend[i] = n
			}
			if (toSend.length > 0) {
				channel.notificationsSend(toSend, successCallback, errorCallback, null)
			}else if(successCallback){ successCallback() }
		}
	}

	/**
	* @class This class encapsulates all the data of a notification endpoint.
	*/
	_pio.notificationEndpoint = function (type, identifier, configuration, enabled) {
		/** The type of the endpoint
		* @type string
		*/
		this.type = type
		/** The endpoint identifier (e.g, push device id or e-mail address...)
		* @type string
		*/
		this.identifier = identifier
		/** The configuration of the endpoint
		* @type object
		*/
		this.configuration = configuration;
		/** Is this endpoint currently enabled?
		* @type bool
		*/
		this.enabled = enabled
	}
})();
(function () {
	/**
	* @class The PlayerIO Publishing Network service. This class is used to access all the functionality available to games
	* that are published on the PlayerIO Publishing Network.
	* @example Refreshing data
	* <listing>
	* client.publishingNetwork.refresh(function(){
	*	// refresh succeeded
	* }, function (err) { console.log(err) })
	* </listing>
	*/
	_pio.publishingNetwork = function (channel, connectUserId) {
		var self = this;
		/**
		* Access to the PlayerIO Publishing Network profiles
		* @type publishingNetworkProfiles
		*/
		this.profiles = new _pio.publishingNetworkProfiles(channel);

		/**
		* Access to PlayerIO Publishing Network payments
		* @type publishingNetworkPayments
		*/
		this.payments = new _pio.publishingNetworkPayments(channel);

		/**
		* Access to PlayerIO Publishing Network relations
		* @type publishingNetworkRelations
		*/
		this.relations = new _pio.publishingNetworkRelations(channel, connectUserId, this);

		/** 
		* A UserToken that can be used to authenticate as the current user.
		* @type string
		*/
		this.userToken = "[ERROR: you tried to access publishingNetwork.userToken before calling publishingNetwork.refresh(callback)]"

		/**
		* Refresh the Profiles and Relations
		* @param {function()} successCallback Callback function that will be called when the refresh is complete.
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.refresh = function (successCallback, errorCallback) {
			channel.socialRefresh(successCallback, errorCallback, function (result) {
				self.userToken = result.myprofile.usertoken
				self.profiles.myProfile = new _pio.publishingNetworkProfile(result.myprofile)

				if(typeof(_pio.friendLookup)=='undefined'){
					_pio.friendLookup = {}
					_pio.blockedLookup = {}
				}

				var fl = _pio.friendLookup[self.profiles.myProfile.userId]
				var bl = _pio.blockedLookup[self.profiles.myProfile.userId]
				if (!fl && !bl) {
					fl = _pio.friendLookup[self.profiles.myProfile.userId] = {}
					bl = _pio.blockedLookup[self.profiles.myProfile.userId] = {}
				}

				self.relations.friends = []
				for (var i = 0; i != result.friends.length; i++) {
					var f = new _pio.publishingNetworkProfile(result.friends[i])
					self.relations.friends.push(f)
					fl[f.userId] = true
				}
				for (var i = 0; i != result.blocked.length; i++) {
					bl[result.blocked[i]] = true
				}
			});
		}
	}

	_pio.showDialog = function(dialog, channel, args, closedCallback){
		if (typeof (window.PublishingNetwork) == 'undefined') {
			throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotAvailable, "PublishingNetwork.js was not found on the current page. You have to include the 'piocdn.com/publishingnetwork.js' on the containing page to show dialogs. See http://playerio.com/documentation/ for more information.")
        } else {
            args.__apitoken__ = channel.token
			window.PublishingNetwork.dialog(dialog, args, closedCallback)
		}
	}
})();
(function () {
	/**
	* @class The PlayerIO Publishing Network Payments service. This class is used to initiate in-game payments for games
	* that are published on the PlayerIO Publishing Network.
	* @example Showing a buy coins dialog
	* <listing>
	* client.publishingNetwork.payments.showBuyCoinsDialog(200, {
	*	name: 'Buy 200 coins', 
	*	description: '...', 
	*	icon: 'http://server.com/icon.jpg', 
	*	currency:'USD'
	* },function(){
	*	// payment success
	* }, function (err) { console.log(err) })
	* </listing>
	* @example Showing a buy items dialog
	* <listing>
	* client.publishingNetwork.payments.showBuyItemsDialog([
	*	{itemkey:'myitem'}	
	* ],{
	*	name: 'Buy 200 coins', 
	*	description: '...', 
	*	icon: 'http://server.com/icon.jpg', 
	*	currency:'USD'
	* },function(){
	*	// payment success
	* }, function (err) { console.log(err) })
	* </listing>
	*/
	_pio.publishingNetworkPayments = function (channel) {
		var self = this;

		/**
		* Shows a dialog for buying coins
		* @param {int} coinAmount The amount of coins to buy
		* @param {object} purchaseArguments Any additional information that is needed to show the payment dialog
		* @param {function(result)} successCallback Callback function that will be called with the result
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.showBuyCoinsDialog = function (coinAmount, purchaseArguments, successCallback, errorCallback) {
			if (!purchaseArguments) {
				purchaseArguments = {}
			}
			purchaseArguments.coinamount = coinAmount
			channel.payVaultPaymentInfo('publishingnetwork', _pio.convertToKVArray(purchaseArguments), null, function(result){
				_pio.showDialog('buy', channel, result, function (r) {
					if (r.error) {
						errorCallback(new PlayerIOError(PlayerIOErrorCode.GeneralError, r.error))
					} else {
						successCallback(r)
					}
				})
			}, errorCallback, function (result) { return _pio.convertFromKVArray(result.providerarguments) })
		}

		/**
		* Shows a dialog for buying items
		* @param {object[]} items A list of items to buy, together with any additional payload.
		* @param {object} purchaseArguments Any additional information that is needed to show the payment dialog
		* @param {function(result)} successCallback Callback function that will be called with the result
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.showBuyItemsDialog = function (items, purchaseArguments, successCallback, errorCallback) {
			channel.payVaultPaymentInfo('publishingnetwork', _pio.convertToKVArray(purchaseArguments||{}), _pio.convertBuyItems(items), function(result){
				_pio.showDialog('buy',channel, result, function (r) {
					if (r.error) {
						errorCallback(new PlayerIOError(PlayerIOErrorCode.GeneralError, r.error))
					} else {
						successCallback(r)
					}
				})
			}, errorCallback, function (result) { return _pio.convertFromKVArray(result.providerarguments) })
		}
	}
})();
(function () {
	/**
	* @class PlayerIO Publishing Network Profiles service. This class is used to fetch or show the profile of 
	* the current user, or to load the profiles of other users.
	*/
	_pio.publishingNetworkProfiles = function (channel) {
		var self = this;

		/**
		* The profile of the current user
		* @type publishingNetworkProfile
		*/
		this.myProfile = "[ERROR: you tried to access publishingNetworkProfiles.myProfile before calling publishingNetwork.refresh(callback)]"

		/**
		* Show the profile for the specified user
		* @param {string} userId The userId of the user to show
		* @param {function()} closedCallback Callback function that will be called when the profile is closed
		*/
        this.showProfile = function (userId, closedCallback) {
			_pio.showDialog('profile', channel, { userId: userId }, closedCallback)
		}

		/**
		* Load a set of PlayerIO Publishing Network profiles
		* @param {string[]} userIds The userIds of the profiles to load
		* @param {function(publishingNetworkProfile[])} successCallback Callback function that will be called with the loaded profiles
		* @param {function(PlayerIOError)} errorCallback Callback function that will be called if an error occurs.
		*/
		this.loadProfiles = function(userIds, successCallback, errorCallback){
			channel.socialLoadProfiles(userIds, successCallback, errorCallback, function (result) {
				var arr = []
				for (var i = 0; i != userIds.length; i++) {
					var userId = userIds[i];
					arr[i] = null
					for (var x = 0; x != result.profiles.length; x++) {
						var user = result.profiles[x]
						if (user && user.userid == userId) {
							arr[i] = new _pio.publishingNetworkProfile(result.profiles[x])
							break
						}
					}
				}
				return arr
			})
		}
	}

	/**
	* @class This class encapsulates all the data of a PlayerIO Publishing Network Profile.
	*/
	_pio.publishingNetworkProfile = function (profile) {
		/** The userId of the user
		* @type string
		*/
		this.userId = profile.userid

		/** The display name of the user
		* @type string
		*/
		this.displayName = profile.displayname
		
		/** The avatar url for the user
		* @type string
		*/
		this.avatarUrl = profile.avatarurl

		/** When was this user last seen
		* @type Date
		*/
		this.lastOnline = new Date(profile.lastonline)

		/** The country code of the user
		* @type string
		*/
		this.countryCode = profile.countrycode
	}
})();
(function () {
	/**
	* @class The PlayerIO Publishing Network Relations service. This class is used to fetch the current users friends, and 
	* to show the various friend management dialogs for games published on the PlayerIO Publishing Network.
	*/
	_pio.publishingNetworkRelations = function (channel, connectUserId, publishingNetwork) {
		var self = this;

		/**
		* List of all friends
		* @type publishingNetworkProfile[]
		*/
		this.friends = "[ERROR: you tried to access publishingNetworkRelations.friends before calling publishingNetwork.refresh(callback)]"

		/**
		* Check if a specific user is a friend
		* @param {string} userId The userId of the user to check
		* @return {bool} A boolean indicating friendship status
		*/
		this.isFriend = function (userId) {
			if (typeof (_pio.friendLookup) != 'undefined' && typeof(_pio.friendLookup[connectUserId]) != 'undefined') {
				return _pio.friendLookup[connectUserId][userId] || false;
			} else {
				throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotLoaded, "Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first")
			}
		}

		/**
		* Check if a specific user is a blocked
		* @param {string} userId The userId of the user to check
		* @return {bool} A boolean indicating blocked status
		*/
		this.isBlocked = function (userId) {
			if (typeof (_pio.blockedLookup) != 'undefined' && typeof(_pio.blockedLookup[connectUserId]) != 'undefined') {
				return _pio.blockedLookup[connectUserId][userId] || false;
			} else {
				throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotLoaded, "Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first")
			}
		}


		/**
		* Shows a dialog where the user can choose to send a friend request to the specified user
		* @param {string} userId The userId of the user that will receive the friendship request, if sent
		* @param {function()} closedCallback Callback function that will be called when the dialog is closed
		*/
		this.showRequestFriendshipDialog = function (userId, closedCallback) {
			_pio.showDialog('requestfriendship',channel, { userId: userId }, closedCallback)
		}

		/**
		* Shows a dialog where the user can choose to block a specific user
		* @param {string} userId The userId of the user to block
		* @param {function()} closedCallback Callback function that will be called when the dialog is closed
		*/
		this.showRequestBlockUserDialog = function(userId, closedCallback){
			_pio.showDialog('requestblockuser',channel, { userId: userId }, function(){
				publishingNetwork.refresh(function(){
					if(closedCallback)closedCallback()
				}, function(){
					if(closedCallback)closedCallback()
				})
			})
		}

		/**
		* Shows the a dialog where the user can manage their friends list
		* @param {function()} closedCallback Callback function that will be called when the dialog is closed
		*/
		this.showFriendsManager = function(closedCallback){
			_pio.showDialog('friendsmanager',channel, { }, function (result) {
				if (result.updated) {
					publishingNetwork.refresh(function () {
						if (closedCallback) closedCallback()
					}, function () {
						if (closedCallback) closedCallback()
					})
				} else {
					if (closedCallback) closedCallback()
				}
			})
		}

		/**
		* Shows the a dialog where the user can manage their blocked users list
		* @param {function()} closedCallback Callback function that will be called when the dialog is closed
		*/
		this.showBlockedUsersManager = function (closedCallback) {
			_pio.showDialog('blockedusersmanager',channel, { }, function (result) {
				if (result.updated) {
					publishingNetwork.refresh(function () {
						if (closedCallback) closedCallback()
					}, function () {
						if (closedCallback) closedCallback()
					})
				} else {
					if (closedCallback) closedCallback()
				}
			})
		}
	}
})();
