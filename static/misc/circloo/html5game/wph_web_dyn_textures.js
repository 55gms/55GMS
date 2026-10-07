///~
function wdt_change_ext(path, newext) {
	return path.replace(/\.[^\\/.]+$/, "") + newext;
}
///~
function wdt_load_texture_raw(tx, path) {
	var img = document.createElement("img");
	var ntx = { WebGLTexture: img };
	img.onload = function(e) {
		window.gml_Script_gmcallback_wdt_async_image(null, null, tx, ntx, 1);
	};
	img.onerror = function(e) {
		window.gml_Script_gmcallback_wdt_async_image(null, null, tx, ntx, -1);
	};
	img.src = path;
}
///~
function wdt_is_null(val) {
	// thank you, GM LTS, very cool
	return val == null;
}
///~
function wdt_get_image_field(tx) {
	if (tx == null) return null;
	
	var cfd = tx.__wdt_image_field;
	if (cfd !== undefined) return cfd;
	
	for (var fd in tx) {
		if (!tx.hasOwnProperty(fd)) continue;
		var val = tx[fd];
		if (!(val instanceof HTMLImageElement)) continue;
		tx.__wdt_image_field = fd;
		return fd;
	}
	tx.__wdt_image_field = null;
	return null;
}
/// ->wdt_image
function wdt_get_image(tx) {
	var fd = wdt_get_image_field(tx);
	return fd ? tx[fd] : undefined;
}
/// ->string
function wdt_get_image_path(tx) {
	var img = wdt_get_image(tx);
	return img ? img.src : undefined;
}
///~
function wdt_assign(tx, ntx) {
	// here we replace references to the <img> element within sub-objects
	// of the texture page entry (except inside the <img> itself)
	var cur_image = wdt_get_image(tx);
	if (cur_image == null) return 0;
	
	var new_image = wdt_get_image(ntx);
	if (new_image == null) return 0;
	
	for (var fd in tx) {
		if (!tx.hasOwnProperty(fd)) continue;
		var sub = tx[fd];
		
		// we don't want to change metadata in the img element
		if (sub == cur_image) {
			//tx[fd] = new_image;
			continue;
		}
		
		for (var sub_fd in sub) {
			if (!sub.hasOwnProperty(sub_fd)) continue;
			
			var val = sub[sub_fd];
			if (val == cur_image) {
				sub[sub_fd] = new_image;
				return 1;
			}
		}
	}
	return 1;
}
var wdt_can_autoload = true;
/// (?enable)->
function wdt_autoload_enable(enable) {
	var _curr = wdt_can_autoload;
	if (enable == null) return _curr;
	wdt_can_autoload = enable;
	return _curr;
}
/// (texture)
function wdt_autoload_texture(tx) {
	if (tx == null) return 0;
	
	var cur_image = wdt_get_image(tx);
	if (cur_image == null) return 0;
	
	for (var fd in tx) {
		if (!tx.hasOwnProperty(fd)) continue;
		
		var sub = tx[fd];
		if (sub == cur_image) continue; // the image itself
		if (sub.__wdt_first != null) continue; // already hooked
		
		for (var sub_fd in sub) {
			if (!sub.hasOwnProperty(sub_fd)) continue;
			
			var val = sub[sub_fd];
			if (val == cur_image) {
				sub.__wdt_first = true;
				sub.__wdt_image = cur_image;
				sub.__wdt_texture = tx;
				delete sub[sub_fd];
				Object.defineProperty(sub, sub_fd, {
					get() {
						if (sub.__wdt_first && wdt_can_autoload) {
							sub.__wdt_first = false;
							//var path = wdt_get_image_path(sub.__wdt_texture);
							//console.log("Auto-loading", path);
							window.gml_Script_gmcallback_wdt_load_texture(null, null, sub.__wdt_texture);
						}
						return sub.__wdt_image;
					},
					set(newImage) {
						sub.__wdt_image = newImage;
					},
					enumerable: true,
					configurable: true,
				});
				return 1;
			}
		}
	}
	return 0;
}

var wdt_raw_textures = null;
///~
function wdt_assign_raw(tx, ntx) {
	if (!wdt_raw_textures) return;
	// Some bits (like Spine attachments) reference not the texture object,
	// but an index in the g_Textures array.
	// This function replaces references in that array.
	var img = wdt_get_image(tx);
	var nimg = wdt_get_image(ntx);
	for (var i = 0; i < wdt_raw_textures.length; i++) {
		if (wdt_raw_textures[i] == img) wdt_raw_textures[i] = nimg;
	}
}

///~
function wdt_preinit_raw() {
	// and this function finds the array for the above function by
	// parsing (potentially minified) JS implementations of functions.
	try {
		var ref_code = window.gml_Script_gmcallback_wdt_preinit.toString();
		var ref_rx = /"draw_texture_flush"\s*,\s*(\w+)/;
		var draw_texture_flush_name = ref_rx.exec(ref_code)[1];
		//
		var draw_texture_flush_code = window[draw_texture_flush_name].toString();
		var draw_texture_flush_rx = /(\w+)\s*\(\s*\)\s*;?\s*}\s*$/;
		var webgl_flush_name = draw_texture_flush_rx.exec(draw_texture_flush_code)[1];
		//
		var webgl_flush_code = window[webgl_flush_name].toString();
		var g_Textures_rx = /(\w+)\s*\.\s*length\b/;
		var g_Textures_name = g_Textures_rx.exec(webgl_flush_code)[1];
		wdt_raw_textures = window[g_Textures_name];
	} catch (x) {
		console.error("[wdt] Failed to locate raw texture array, not everything will work.", x);
	}
}

/// (...)~
function wdt_magic_false() {
	return false;
}
