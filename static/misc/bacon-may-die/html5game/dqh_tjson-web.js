/**
 * TJSON (c) YellowAfterlife, 2016+
 * This is a JavaScript helper module.
 * @author YellowAfterlife
 */
//{ Errors
var tj_error;
var tj_error_text;
///
function tj_get_error_value() { return tj_error; }
///
function tj_get_error_text() { return tj_error_text; }
//#tj_error_text = tj_get_error_text()
///
function tj_get_null_value() { return null; }
//}

//{ Boolean
///
function tj_bool(v) {
	return (v > 0.5);
}
///
function tj_is_bool(v) {
	return (typeof v == "boolean") ? 1 : 0;
}
//}

//{ Object
/// tj_object(...key_value_pairs)
function tj_object(__rest__) {
	var r = { }, n = arguments.length >> 1;
	for (var i = 0; i < n; i++) {
		r[arguments[i << 1]] = arguments[(i << 1) + 1];
	}
	return r;
}
/// tj_array(...values)
function tj_array(__rest__) {
	var r = [];
	for (var i = 0; i < arguments.length; i++) {
		r[i] = arguments[i];
	}
	return r;
}
///
function tj_is_object(value) {
	return (value && (typeof value == "object") && !Array.isArray(value)) ? 1 : 0;
}
///
function tj_is_array(value) {
	return Array.isArray(value) ? 1 : 0;
}
///
function tj_get(obj, key) {
	return tj_is_object(obj) ? obj[key] : null;
}
///
function tj_set(obj, key, value) {
	if (tj_is_object(obj)) obj[key] = value;
}
///
function tj_size(obj) {
	var r = 0;
	if (tj_is_object(obj)) for (var k in obj) {
		if (obj.hasOwnProperty(k)) r += 1;
	}
	return r;
}
///
function tj_keys(obj) {
	var r = [];
	if (tj_is_object(obj)) for (var k in obj) {
		if (obj.hasOwnProperty(k)) r.push(k);
	}
	return r;
}
///
function tj_typeof(value) {
	if (value == null) return "undefined";
	var t = typeof value;
	if (t == "object") return Array.isArray(value) ? "array" : "object";
	return t;
}
///
function tj_typeid(value) {
	if (value == null) return 0;
	var t = typeof value;
	switch (t) {
		case "boolean": return 1;
		case "number": return 2;
		case "string": return 3;
		case "object": return Array.isArray(value) ? 4 : 5;
		default: return (value == tj_error) ? 6 : 0;
	}
}
///
function tj_compare(a, b) {
	return JSON.stringify(a) == JSON.stringify(b);
}
//}

///
function tj_decode(src) {
	try {
		return JSON.parse(src);
	} catch (e) {
		tj_error_text = "" + e;
		return tj_error;
	}
}
/// tj_encode(value, ?indent)
function tj_encode(value, indent) {
	try {
		return JSON.stringify(value, null, indent);
	} catch (e) {
		tj_error_text = "" + e;
		return null;
	}
}

///
function tj_init_js() {
	tj_error = new Error("TJSON error");
}
