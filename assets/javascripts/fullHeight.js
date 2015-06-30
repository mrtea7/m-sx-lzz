$(function(){
	function init(){
		var obj = $('[fullHeight="true"]'),
			isCopy = obj.hasClass('copyright'),
			winH = $(window).height(),
			outerHeight = obj.attr('outerHeight'),
			otherH = 0;

		obj.siblings().each(function(){
			if($(this).css('position') == 'fixed') return;
			otherH += $(this).height();
			if(outerHeight) otherH += parseInt($(this).css('margin-top')) + parseInt($(this).css('margin-bottom'));
		});
		if(isCopy){
			otherH += obj.height();
			if(otherH > winH) return;
		}

		obj.css(isCopy ? 'margin-top' : 'min-height', winH - otherH);
	}
	setTimeout(init, 0);
});