var loadingBarImage = new Image();
loadingBarImage.src = 'html5contents/lpic.png';
loadingBarImage.width = 360;
loadingBarImage.height = 140;
loadingBarImage.x_offset = -(loadingBarImage.width / 2);
loadingBarImage.y_offset = -(loadingBarImage.height / 2);
function Deg2Rad(_deg) { return _deg; }
function jsDrawCenteredText(_graphics, x, y, colour, text) {
	_graphics.fillStyle = colour;
	_graphics.lineStyle = colour;
	_graphics.font = "18px Arial"; ;
	_graphics.textAlign = "center";
	_graphics.fillText(text, x, y);
	_graphics.textAlign = "left";
}
function rt_loader(_graphics, _width, _height, _total, _current, _loadingscreen) {
	if (_loadingscreen){
		_graphics.drawImage(_loadingscreen, 0, 0, _width, _height);
	} 
	else
	{
		var barwidth = (_width * 0.4);
		var barheight = 20; 
		var x = (_width - barwidth) / 2;
		var y = _height*0.6;	
		var w = (barwidth / _total) * _current;
  		var loading = document.getElementById("loading_screen");
		var load_width = document.getElementById("loading_screen").offsetWidth;
		var load_height = document.getElementById("loading_screen").offsetHeight;
		var w_w = window.innerWidth;
		var w_h = window.innerHeight;
		loading.style.position = "fixed";
		if (w_w >= w_h){
			loading.style.height = "100%";
			loading.style.left = "50%";
			loading.style.marginLeft = -(0.5)*load_width+"px";
		}else{
			loading.style.width = "100%";
			loading.style.top = "50%";
			loading.style.marginTop = -(0.5)*load_height+"px"
		}
		loading.style.padding = "0";
		loading.style.border = "0";
		_graphics.fillStyle = "#ffffff";
		_graphics.fillRect(0, 0, _width, _height);
		if (_current != 0)
		{
			_graphics.fillStyle = "#afd138";
			_graphics.barheight = 15;
			_graphics.fillRect(x, y, barwidth, barheight);
			_graphics.fillStyle = "#80b741";
			_graphics.barheight = 15;
			_graphics.fillRect(x, y, w, barheight);
			
				_graphics.drawImage(loadingBarImage,_width/2+loadingBarImage.x_offset,60);

		}
	}
}

