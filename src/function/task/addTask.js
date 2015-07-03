
var setDate = {
	method:null,
	handleEvent: function(evt){
		var page = "#addTask_container";
		$("#addTask_container, #page_calendar, #page_contacts").removeClass("on");
		evt = evt||window.event;
		switch(evt.data.method){
			case "getDate":
				this.method = evt.data.method;
				// page = "#page_calendar";
				// new calendarDialog().open().drawMonth().drawTime();
				
			break;
			case "getContact_fzr":case "getContact_xzr":
				this.method = evt.data.method;
				page = "#page_contacts";
			break;
			case "setdate":
				if(evt.data.val){
					$("#task_endTime_label").html(evt.data.val+'<input type="hidden" value="'+evt.data.val+'" name="task_endTime" />');
					$('.section_task_remind').show();
				}
			break;
			case "setContacts":
				if("getContact_fzr" == this.method){
					var _html = "";
					getContact_fzr: for(var ci  in evt.data.val){
						_html = '<span>'+evt.data.val[ci].name+'<input type="hidden" name="task_fzr" value=\''+evt.data.val[ci].email+'\' /></span>';
						break getContact_fzr;
					}
					$("#task_fzr_p")[0].innerHTML = _html;
				}else{
					var _html_arr = [],
						_vals_arr = [];
					getContact_xzr: for(var ci  in evt.data.val){
						_html_arr.push('<span>'+evt.data.val[ci].name+'</span>');
						_vals_arr.push(evt.data.val[ci].email);
					}
					if(_html_arr.length>2){
						_html_arr.splice(2,10000,"<span>等"+_html_arr.length+"人</span>");
					}
					_html_arr.push('<input type="hidden" name="task_fzr" value="'+_vals_arr.join(",")+'" />');
					$("#task_xzr_p")[0].innerHTML = _html_arr.join('');
				}
			break;
		}
		$(page).addClass("on");
	}
}
window.addEventListener("message", setDate, false);

function validteForm(thi){ //这里仅检查文字任务，若为语音，由于需要上传，所以在点击提交函数中处理
	var task_data = {};
		try{
			if($('.text_btn').hasClass('on')){
				if(thi.content){
					task_data.task_des = thi.content.value;
					if(!task_data.task_des.length){
						alert("请填写任务内容");
						return false;
					}
				}
			}
		}catch(e){
			alert("form 数据异常");
			console.log(e);
			return false;
		}
		
		return true;
}


function set_task_remind_time(thi, evt, val){
	switch(val){
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
			$("#remind_time_label").html(thi.nextSibling.innerHTML);
		break;
		default:

		break;
	}
	$("#remind_time_select")[val>-1?"removeClass":"addClass"]("on");
}

function deal_record_mode(val){
	switch(val){
		case 0://弹出“按住录音”按钮
			$('#record_mode').addClass('on');
    		$('.record_mask1').addClass('on');
		break;
		case 1://收起“按住录音”按钮
			$('.record_mask1').removeClass('on');
			$('#record_mode').removeClass('on');
		break;
		case 2://长按“按住录音”按钮，开始录音
			$('.record_mask1').removeClass('on');
			$('.record_mask2').addClass('on');
			$('#record_btn').text("松开结束").css("background-color","#f0f0f0");
			console.log("Start recording...");
			$('.record_duration').text('0\"');
			//这里加入录音程序
			wx.startRecord();
			count_time();

		break;
		case 3://在录音时，移动到取消发送区域
			$('.ico_record').css("background-position", "0 -151px");
		break;
		case 4: //在录音时，移动到非取消发送区域
			$('.ico_record').css("background-position", "0 0");
		break;
		case 5: //录音结束，隐藏所有mask
			$('#record_btn').text("按住录音").css("background-color","#ffffff");
			$('.record_mask2').removeClass('on');
			$('#record_mode').removeClass('on');
			$('.ico_record').css("background-position", "0 0");
			$('.record').removeClass('cancel');
			$('.record').find('div').eq(1).text("重录");
		break;
		default:
		break;
	}
}

var audioAction = function(){
	var btn = $('.audio_task_ctrl.listen');
	if(btn.data('status') === "playing"){
		btn.addClass("pause");
		btn.find('div').eq(1).text("暂停");
	}
	else{
		btn.removeClass("pause");
		btn.find('div').eq(1).text("试听");
	}
}

var record;
var count;
var endY;
var isHold = false;
var clientHeight = document.documentElement.clientHeight;
function preRecord(){
	record = setTimeout(function(){
    	deal_record_mode(2);
    	isHold = true;
    },500); //长按500ms
}
function count_time(){
	count = setInterval(function(){
		var time = $('.record_duration').text();
		var time_next = parseInt(time.substring(0, time.length-1)) + 1;
		$('.record_duration').text(time_next+'\"');
	}, 1000);
}
wx.ready(function(){
	wx.checkJsApi({
    	jsApiList: ['startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    	success: function(res) {
    		//alert(JSON.stringify(res));
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    	}
    });
	// 录音时间超过一分钟没有停止的时候会执行 complete 回调
    wx.onVoiceRecordEnd({
    	complete: function (res) {
    		clearInterval(count);
    		deal_record_mode(5);
    		if(clientHeight - endY > 120){
    			//no operation
    		}
    		else{
    			APP.localId = res.localId;
    			$('#localId').val(res.localId);
    			var duration = $('.record_duration').text();
        		$('.audio_task_time').text(duration); //显示录音时间
        		duration = duration.substring(0, duration.length-1); //录音时间去掉"，以便获取纯数字
        		$('#audioDuration').val(duration);
        		wx.uploadVoice({
    				localId: APP.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
    				isShowProgressTips: 1, // 默认为1，显示进度提示
        			success: function (res) {
        				var serverId = res.serverId; // 返回音频的服务器端ID
        				$('#serverId').val(serverId);
        				var task_id = $('#task_id').val();
        				//告知服务器上传到腾讯的音频的ID和时长
        				$.ajax({
        					type: 'POST',
        					url: APP.urls.saveAudio,
        					data: {
        						audioId: serverId,
        						audioDuration: duration,
        						task_id: task_id
        					},
        					dataType: 'json',
        					timeout: 10000,
        					success: function(r){
        						//发送成功,返回音频的url
        						$('#speech_url').val(r.url);
        					},
        					error: function(){
        						alert("录音保存出错")
        					}
        				});
    				}
				});
    		} 
        	isHold=false;
    	}
	});

	wx.onVoicePlayEnd({
    	success: function (res) {
      		$('.audio_task_ctrl.listen').removeClass("pause");
			$('.audio_task_ctrl.listen').find('div').eq(1).text("试听");
   		}
	});
});
wx.error(function(res){

    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    alert(JSON.stringify(res));
});

$(function(){
	var form = $("#form_task")[0],
		$btn_create = $("#btn_create");

	$btn_create.click(function(){
		if($('.text_btn').hasClass('on')){
			confirm("您将提交的是文字任务", {
							TPL:'<div class="widget_wrap" style="z-index:{zIndex};">\
								<div class="widget_header"></div>\
								<div class="widget_body">{str}</div>\
								<div class="widget_footer">\
								<ul>\
									<li><a href="javascript:;" type="button" data-button="0">'+('取消')+'</a></li>\
									<li><a href="javascript:;" type="button" data-button="1">'+('确定')+'</a></li>\
								</ul>\
								</div>\
								</div>',
							callBack: function(evt){
								var that = this,ele = null, dataButton = null;
								if(evt && (ele = evt.target) && (dataButton = ele.getAttribute("data-button")) ){
									if("1"==dataButton){
										form.submit();
									}
									that.destroy();
								}
							}
			});
		}
		else{
			confirm("您将提交的是语音任务", {
							TPL:'<div class="widget_wrap" style="z-index:{zIndex};">\
								<div class="widget_header"></div>\
								<div class="widget_body">{str}</div>\
								<div class="widget_footer">\
								<ul>\
									<li><a href="javascript:;" type="button" data-button="0">'+('取消')+'</a></li>\
									<li><a href="javascript:;" type="button" data-button="1">'+('确定')+'</a></li>\
								</ul>\
								</div>\
								</div>',
							callBack: function(evt){
								var that = this,ele = null, dataButton = null;
								if(evt && (ele = evt.target) && (dataButton = ele.getAttribute("data-button")) ){
									if("1"==dataButton){
										if(!APP.localId){
											if($('.audio_task_ctrl.listen').data("sound")){
												form.submit();
											}
											else{
												alert("请录下任务内容");
											}
										}
										else{
											// wx.uploadVoice({
    							// 				localId: APP.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
    							// 				isShowProgressTips: 1, // 默认为1，显示进度提示
        			// 							success: function (res) {
        			// 								var serverId = res.serverId; // 返回音频的服务器端ID
        			// 								$('#serverId').val(serverId);
        			// 								form.submit();
    							// 				}
											// });
											form.submit();
										}

									}
									that.destroy();	
									
								}
							}
			});
		}
		
		form.callBack= function(res){
			if(0 == res.status){
				location.href = res.url;
			}else{
				alert(res.message);
			}
		}
	});
});

$(function(){
	$('#addTime').on("change", function(){
		$('.section_task_remind').show();
	});
	var d = new Date();
	$('#addTime').mobiscroll()['datetime']({
        lang: 'zh',
        display: 'bottom',
        minWidth: 64,
        //startYear: d.getFullYear(),
        minDate: d,
        endYear: d.getFullYear() + 1,
        dateFormat: 'yy-mm-dd DD'
    });
    //切换文字发布和语音发布
	var audio_task = $(".audio_task_des");
	audio_task.on('webkitAnimationEnd', function(){
		if(audio_task.hasClass('slideOut')){
			audio_task.removeClass('slideOut');
		}
		if(audio_task.hasClass('slideIn')){
			$(".text_task_des").hide();
		}
	});
    $('.task_btn').tap(function(){
    	if($('.text_btn').hasClass('on')){
    		$("#textOrAudio").val("audio");
    		$('.text_task_des').find('textarea').blur();
    		audio_task.removeClass('slideOut').addClass('slideIn');
    		$('.text_btn').removeClass('on');
    		$('.audio_btn').addClass('on');
    		if($('.record').hasClass('cancel') || !$('.record').hasClass('on')){
    			deal_record_mode(0);
    		}
    	}
    	else{
    		$("#textOrAudio").val("text");
    		$(".text_task_des").show();
    		audio_task.removeClass('slideIn on').addClass('slideOut');
    		$('.audio_btn').removeClass('on');
    		$('.text_btn').addClass('on');
    		deal_record_mode(1);
    	}
    });
   
    //点击录音出现按住录音按钮
    // $('.audio_task_time').tap(function(){
    // 	deal_record_mode(0);
    // });
    // $('.record_mask1').on('touchstart',function(event){
    // 	deal_record_mode(1);
    // })

    $('#record_btn').on('touchstart',function(event){
    	event.preventDefault();
    	var touch = event.touches[0];
    	endY = touch.clientY;
    	preRecord();
    });
    $('#record_btn').on('touchmove',function(event){
    	event.preventDefault();
    	if(isHold){
    		var touch = event.touches[0];
    		endY = touch.clientY;
    		if(clientHeight - touch.clientY > 120){
    			deal_record_mode(3);
    		}
    		else{
    			deal_record_mode(4);
    		}
    	}
    	
    });
    $('#record_btn').on('touchend', function(event){
    	clearTimeout(record);
    	if(isHold){
    			deal_record_mode(5);
    			if(clientHeight - endY > 120){
					//停止录音，但不保存localId，不设置播放控制按钮
    				wx.stopRecord({
    					success: function (res) {
    						//不做任何处理
    					}
					});
					clearInterval(count);
					if(!$('.audio_task_ctrl').hasClass('on')){
						deal_record_mode(0);
					}
    			}
    			else{
    				//停止录音，保存localId，然后设置播放控制按钮
    				wx.stopRecord({
    					success: function (res) {
        					APP.localId = res.localId;
        					$('#localId').val(res.localId);
        					clearInterval(count);
							var duration = $('.record_duration').text();
        					$('.audio_task_time').text(duration);
    						$('.audio_task_ctrl').addClass('on');
    						duration = duration.substring(0, duration.length-1);
    						duration = (duration == 0)?1:duration; //未满一秒的设为一秒
    						$('#audioDuration').val(duration);
    						wx.uploadVoice({
    							localId: APP.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
    							isShowProgressTips: 1, // 默认为1，显示进度提示
        						success: function (res) {
        							var serverId = res.serverId; // 返回音频的服务器端ID
        							$('#serverId').val(serverId);
        							var task_id = $('#task_id').val();
        							//告知服务器上传到腾讯的音频的ID和时长
        							$.ajax({
        								type: 'POST',
        								url: APP.urls.saveAudio,
        								data: {
        									audioId: serverId,
        									audioDuration: duration,
        									task_id: task_id
        								},
        								dataType: 'json',
        								timeout: 10000,
        								success: function(r){
        									//发送成功
        									$('#speech_url').val(r.url);
        								},
        								error: function(){
        									alert("录音保存出错")
        								}
        							});
    							}
							});
    					}
					});
					
    			}
    			isHold=false;
    	}
    	
    });
    $('.audio_task_ctrl.record').tap(function(){
    	if($(this).hasClass("cancel")){
    		deal_record_mode(1);
    		$(this).removeClass("cancel");
 			$(this).find('div').eq(1).text("重录");
    	}
    	else{
    		deal_record_mode(0);
    		$(this).addClass("cancel");
    		$(this).find('div').eq(1).text("取消");
    	}
    });
    $('.audio_task_ctrl.listen').tap(function(){
    	if(APP.localId){
    		if($(this).hasClass("pause")){
    			wx.pauseVoice({
    				localId: APP.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
				});
				$(this).removeClass("pause");
				$(this).find('div').eq(1).text("试听");
    		}
    		else{
    			wx.playVoice({
    				localId: APP.localId
				});
				$(this).addClass("pause");
    			$(this).find('div').eq(1).text("暂停");
    		}
    	}
    	else if($(this).data('sound')){
    		audioPlayer.playSound($('.audio_task_ctrl.listen')[0], event, audioAction);
    	}
    });
    $('.record_mask1').on('touchmove', function(event){event.preventDefault();});
});


