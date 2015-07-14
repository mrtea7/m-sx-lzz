$.fn.photoUpload = function(opts){
	return this.each(function(){
		var opts = $.extend({
				limit: 5,
				maxSize: 2048
			}, opts),
			_this = $(this),
			lastBtn = _this.find('li').last(),
			TPL = '<div class="swipe">'+
					'<div class="imgBox">'+
						'<ul></ul>'+
						'<div class="swipe_num"></div>'+
						'<a href="javascript:void(0);" class="cancle_box">×</a>'+
						'<a href="javascript:void(0);" class="delete_img"></a>'+
					'</div>'+
				'</div>',
			_swipe = $(TPL).appendTo('body'),
			mySwipe;

		_this.delegate('input', 'change', function(){
			var item = $(this).parent().clone(),
				file = this.files[0],
				_parent = $(this).parents('.upload_img');

			if(file.size / 1024 > opts.maxSize){
				$.alert({txt: '所选文件太大，不能超过'+ opts.maxSize/1024 +'M'});
				return;
			}

			_parent.find('.file_btn').css('background-image', 'url('+ webkitURL.createObjectURL(file) +')').removeClass('file_btn').next().show();;


			lastBtn = item.appendTo(_parent);

			if(_parent.find('li').length > opts.limit){
				lastBtn.hide();
			}
		});

		_this.delegate('span', 'click', showImg);

		_this.delegate('.del_img', 'click', function(){
			if(lastBtn.css('display') == 'none') lastBtn.show();
			$(this).parent().remove();
		});



		_swipe.on('click', function(e){
			var className = e.target.className;

			if(className == 'swipe' || className == 'cancle_box'){
				_swipe.hide().find('ul').html('').next().html('');
			}
		});

		_swipe.find('.delete_img').on('click', function(){
			var index = _swipe.find('.swipe_num .on').index(),
				_swipeLi = _swipe.find('li'),
				length = _swipeLi.length,
				cur = Math.min(index, length -2);

			_swipeLi.eq(index).remove();
			_swipe.find('.swipe_num span').eq(index).remove();
			_this.find('li').eq(index).remove();

			if(lastBtn.css('display') == 'none') lastBtn.show();
			//如果只有1张图片删除
			if(length == 1){
				_swipe.find('.cancle_box').click();
			}else{
				mySwipe.stop();
				mySwipe.cur = cur;
				mySwipe.init();
				swipeCallback(_swipe, cur);
			}

		});

		function swipeCallback(obj, index){
			obj.find('.swipe_num span').eq(index).addClass('on').siblings().removeClass('on');
		}
		function showImg(){
			var htmls = '',
				numHtml = '',
				iIndex = $(this).parent().index();

			_this.find('span').each(function(){
				if(this.className != 'file_btn'){
					htmls += '<li><div style="background-image:'+ $(this).css('background-image') +'"></div></li>';
					numHtml += '<span></span>';
				}
			});

			_swipe.find('ul').append(htmls);
			_swipe.find('.swipe_num').append(numHtml);
			_swipe.show();

			if(!mySwipe){
				if(typeof Swipe === 'undefined') throw Error('please load swipe.js');
				mySwipe = new Swipe(_swipe.find('.imgBox')[0], {
					cur: iIndex,
					dir: 'horizontal',
					callback: function(index){
						swipeCallback($(this.el), index);	
					}
				});
			}else{
				mySwipe.cur = iIndex;
				mySwipe.init();
			}	
			swipeCallback(_swipe, iIndex);
		}
	});
}

$(function(){
	$('[data-role="select"]').droplist();
	$('#uploadImg').photoUpload();

	var addressEl = $('#address');

	//获取当前位置
	function getLocation(){
		var geolocation = new BMap.Geolocation();

        geolocation.getCurrentPosition(function (r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                var point = new BMap.Point(r.point.lng, r.point.lat),
                	myGeo = new BMap.Geocoder();

                myGeo.getLocation(point, function (result) {
	                if (result) {
	                	addressEl.val(result.address).data('lat', point.lat).data('lng', point.lng);
	                }
	            });
            }else {
                console.log("无法获取定位");
            }

            setTimeout(getLocation, 60000 * 3);
        });
	}
	if(config.status == 0) getLocation();
	// 签到
	$('#signSub').on('click', function(){
		var xhr = new XMLHttpRequest(),
			fd = new FormData(),
			loader = loading();

		$.each($('#myForm').serializeArray(), function(i, n){
			if(n.name != 'files[]' && n.value){
				fd.append(n.name, n.value);
			}
		});

		$('input[type="file"]').each(function(){
			if(this.files.length){
				fd.append(this.name, this.files[0]);
			}
		});

		if(addressEl.val()){
			fd.append('lat', addressEl.data('lat'));
			fd.append('lng', addressEl.data('lng'));
		}

		xhr.open("post", config.URL, true);

		xhr.onreadystatechange = function(e) {
			
			if(xhr.readyState == 4){
				var responseText = xhr.responseText,
					res = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;

				if(xhr.status == 200){
					$.alert({txt: res.message, callback: function(){
						if(res.status == 0){
							// if(config.close == 0){ //关闭页面
								WeixinJSBridge.invoke('closeWindow');
							// }else{
							// 	config.JUMPURL && ( location.href = config.JUMPURL );
							// }
						}
					}});
				}else{
					// failure
				}
				loader.close();
			}
		};

		xhr.send(fd);
	});
});