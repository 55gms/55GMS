// Hide the address bar
function jchtml5_hide_address_bar(){
	if(!window.location.hash){
		var divh = document.getElementById('gm4html5_div_id').style.height;
		if (divh < (window.outerHeight + 200)){
			document.getElementById('gm4html5_div_id').style.height = (window.outerHeight + 200) + 'px';
		}
		setTimeout ( function(){ window.scrollTo(0,1); },50);
	}
}