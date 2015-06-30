$(function(){	
	$('[data-role="datetime"]').mobiscroll().datetime({
        lang: 'zh',
        display: 'bottom',
        minWidth: 64,
        minDate: new Date(),
        dateFormat: 'yy-mm-dd'
    });

	$('[data-role="select"]').droplist();

	// 提交
	var myForm = $('#myForm');
	$('#subBtns a').on('click', function(){
		var isSignin = $(this).attr('isSignin');

		myForm.find('.required').each(function(){
			var _parent = $(this).parents('li');

			if(this.value){
				_parent.removeClass('error');
			}else{
				_parent.addClass('error');
			}
		});

		if(myForm.find('.error').length){
			$.alert({txt: '请先完善资料再提交'});
			return false;
		}

		if(valiDate() === false){
			return false;
		}

		// $.confirm({txt: '您确定要发起此次外出申请吗？', callback: function(){
			var loader = loading();
			$.post(config.SUBURL + '?isSignin=' + isSignin, myForm.serialize(), function(res){
				loader.close();
				$.alert({txt: res.message, callback: function(){
					res.status == 0 && res.url && ( location.href = res.url );
				}});
			}, 'json');

		// }});
	});

	myForm.find('li').on('click', function(e){
		if(e.target.tagName != 'INPUT'){
			$(this).find('input').focus();
		}
	});

	function valiDate(){
		var sDate = $('#startTime').val(),
			eDate = $('#endTime').val(),
			eWrap = $('#endTime').parents('li');

		if(sDate && eDate){
			if(getSecond(eDate) < getSecond(sDate)){
				$.alert({txt: '结束时间不能小于开始时间'});
				eWrap.addClass('error');
				return false;
			}else{
				eWrap.removeClass('error');
			}
		}

	}
	function getSecond(time){
		return time ? (isNaN(time) ? Date.parse(time.replace(/\-/g,'/')) : time) : 0;
	}

	// 地图
	var _addressTxt = $('#address'),
		_suggestId = $('#suggestId'),
		_mapWrap = $('#mapWrap'),
		_lat = $('#lat'),
		_lng = $('#lng'),
		_body = $('body');

	_mapWrap.height($(window).height());

	_addressTxt.on('focus', function(){
		_mapWrap.removeClass('slideOut').addClass('slideIn');
		_body.addClass('hide');
		if(!_mapWrap.data('init')){
			myMap.init(config.mapOp);
			_mapWrap.data('init', true);
		}
	});

	$('#selectBtn').on('click', function(){
		_addressTxt.val(_suggestId.text());
		_lat.val(_suggestId.data('lat'));
		_lng.val(_suggestId.data('lng'));

		_mapWrap.removeClass('slideIn').addClass('slideOut');
	});

	$('#clearBtn').on('click', function(){
		_suggestId.text('').data('lat', '').data('lng', '');
	});

	_mapWrap.on('webkitAnimationEnd', function(){
		if(_mapWrap.hasClass('slideOut')){
			_mapWrap.removeClass('slideOut');
			_body.removeClass('hide');
		}
	});

	$('#searchId').on('keydown', function(e){
		if(e.keyCode == 13){
			$(this).next().click();
		}
	});
}); 