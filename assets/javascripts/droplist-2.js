// 下拉框
(function(){
	function Droplist(obj){
		var opts = '',
			sltTt = obj.next().find('.selectTt').text(),
			_this = this,
			htmls;

		obj.next().find('option').each(function(){
			var isHide = $(this).hasClass('selectTt') ? ' style="display: none"' : '';

			opts += '<li'+ isHide +'><a href="javascript:void(0);" value="'+ this.value +'" class="off">'+ this.innerHTML +'</a></li>';
		});

		htmls = '<div class="select_wrap">'+
		'	<h2 class="select_tt">'+ sltTt +'</h2>'+
		'	<ul id="opt">'+ opts +'</ul>'+
		'	<footer class="menu bold">'+
		'		<div class="fixed border_dark b_top" id="subBtn">'+
		'			<a href="javascript:void(0);" issignin="false">'+
		'				<span>'+'确定'+'</span>'+
		'			</a>'+
		'		</div>'+
		'	</footer>'+
		'</div>';

		this.el = obj;
		this.wrapper = $(htmls).appendTo('body');

		// bind events
		obj.on('focus', function(){
			_this.show();
		});

		this.wrapper.find('li a').on('click', function(){
			_this.select.call(_this, $(this));
		});

		this.wrapper.find('#subBtn').on('click', function(){
			_this.hide.call(_this, $(this));
		});
	}

	Droplist.prototype = {
		show: function(){
			// Hide virtual keyboard
			if ($(document.activeElement).is('input')) {
				$(document.activeElement).blur();
			}

			//this.wrapper.find('a').removeClass('on');
			//this.wrapper.find('a[value="'+ this.el.next().val() +'"]').addClass('on');
			$('body').addClass('hide');
			this.wrapper.addClass('slideDown');
		},
		select: function(obj){
			if(obj.text()=="确定"){
				return;
			}
			if($(obj).attr("class")== "off"){
				$(obj).attr("class","on");
				//this.wrapper.find('a[value="'+ this.el.next().val() +'"]').addClass('on');
			}else{
				$(obj).attr("class","off");
			};

			//this.el.val(obj.text());
			//this.el.next().val(obj.attr("value"));



			//this.el.trigger('select');
		},
		hide: function(){
			$('body').removeClass('hide');
			this.wrapper.removeClass('slideDown');
			var array = $("#opt").find("a[class='on']");
			var sel = "";
            var rel = "";
            var relate = "";
            for(var i=0;i<array.length;i++){
                //if(array[i].innerHTML == "人行道石板破损"||"路面污渍和垃圾抛洒"||"铁丝护栏破损"){
                //    if(rel.indexOf("公路站")>=1){
                //        relate = "";
                //    }
                //    else{
                //        relate = "公路站";
                //    }
                //}
                //else if(array[i].innerHTML=="路面污渍和垃圾抛洒"){
                //    relate = "保洁站";
                //}
                //else if(array[i].innerHTML=="绿化带及侧石破损"){
                //    relate = "绿化站";
                //}
                //else {
                //    relate = "监察、责任路长 信息员 路长办";
                //}
				sel = sel + " " + array[i].innerHTML;
                rel = rel + " " + relate;

			}
			this.el.val(sel);
            //$("#relate").val(rel);
		}
	}

	$.fn.droplist = function(){
		return this.each(function(){
			$(this).data('droplist', new Droplist($(this)));
		});
	}
})();