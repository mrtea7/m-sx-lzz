window.addEventListener("load", function(){
	var container_height=$("[data-role='container']")[0].offsetHeight;
	var header_height=$("[data-role='header']")[0].offsetHeight;
	var footer_height=$("[data-role='footer']")[0].offsetHeight;
	var section_height = container_height -header_height-footer_height;	
	if(section_height>0){
		$("[data-role='body']").css("min-height",section_height);
	}
}, false);