function ImageLoadBar_hook(ctx, width, height, total, current, image) {
	poki_loading(current/total);
}