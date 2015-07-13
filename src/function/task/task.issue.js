/*
  目录：
  task-body
  save
*/



/*--------------------------
  $ task-body
--------------------------*/
/*
 功能：切换为音频输入
 */
$('.js-task-btn-text').tap(function () {
  _toggleTextBody(false);
  _toggleAudioBody(true);
  // 开启遮罩层
  _toggleMask(true)
});

/*
 功能：切换为文本输入
 */
$('.js-task-btn-audio').tap(function () {
  _toggleTextBody(true);
  _toggleAudioBody(false);
  _toggleMask(false)
});

function _toggleTextBody(bool){
  if (bool) {
    // 显示：显示文本/进场动画
    $('.js-task-btn-text').removeClass('hide');
    $('.task-body-text').removeClass('hide');
  }else{
    // 隐藏
    $('.js-task-btn-text').addClass('hide');
    $('.task-body-text').addClass('hide');
  }
}

function _toggleAudioBody(bool){
  if (bool) {
    // 显示
    $('.js-task-btn-audio').removeClass('hide');
    $('.task-body-audio').removeClass('hide task-slideOut').addClass('task-slideIn');
  }else{
    // 隐藏
    $('.js-task-btn-audio').addClass('hide');
    $('.task-body-audio').removeClass('task-slideIn').addClass('task-slideOut');
  }
}

// 遮罩层开关
function _toggleMask(bool){
  if (bool) {
    $('.js-task-record-mask').removeClass('hide');
    g('task-record-mask').addEventListener('touchmove', function(e){
      e.stopPropagation();
      e.preventDefault();
    })
    $('#task-record-footer').on('touchmove', function(e){
      e.stopPropagation();
      e.preventDefault();
    })

  }else{
    $('.js-task-record-mask').addClass('hide');
    $('#task-record-mask').tap(function(){
      console.log('start');
    })
  }
}




$('#issue').on('touchstart', function(){
  console.log('');
  //window.location = 'list.html';
})



/*--------------------------
  $ 录音功能
--------------------------*/
var record = $('#record')[0];
var mask = $('#mask')[0];
record.addEventListener('touchmove', function (e) {
  e.preventDefault();
})

mask.addEventListener('touchmove', function (e) {
  e.preventDefault();
})

/*--------------------------
 $ Hammer Setup
 --------------------------*/
var recordGesture = Hammer(record, {});
var bodyGesture = Hammer(document.documentElement, {});
//  var bodyH = document.documentElement.clientHeight;

var maskOffsetTop = mask.offsetTop;
var maskClientHeight = mask.clientHeight;
var maskBottomSideY = maskOffsetTop + maskClientHeight;

/*--------------------------
 $ 录音配置
 --------------------------*/

// 控制变量
var isRecordCanel = false;
var isRecordStart = false;

//  按住录音
recordGesture.on('press', function (e) {
  isRecordStart = true;
  if ($('#record-mask').length == 0) {
    $('#mask').append('<div id="record-mask" class="record-mask">');
    console.log($('#record-mask').length);
  } else {
    $('#record-mask').show();
    $('#record-mask')[0].style.backgroundPosition = '0px 0px';
  }
  console.log('press');
})

bodyGesture.on('panup', function (e) {
  if (isRecordStart) {
    // 指定下移到特定的区域才更改状态
    var touchY = e.pointers[0].pageY;
    if (maskBottomSideY - touchY > maskClientHeight) {
      _closeRecordMask();
      isRecordCanel = true;
    }

    if (maskBottomSideY - touchY >= 100) {
      $('#record-mask')[0].style.backgroundPosition = '0px -152px';
      isRecordCanel = true;
    }
  }
}).on('pandown', function (e) {
  if (isRecordStart) {
    // 指定下移到特定的区域才更改状态
    var touchY = e.pointers[0].pageY;
    if (maskBottomSideY - touchY < 100) {
      $('#record-mask')[0].style.backgroundPosition = '0px 0px';
      isRecordCanel = false;
    }
  }
}).on('panend', function (e) {
  if (isRecordStart) {
    console.log('isRecordCanel = ', isRecordCanel);
    _closeRecordMask();

  }
}).on('pressup', function (e) {
  console.log('pressup');
  _closeRecordMask();
})

function _closeRecordMask(){
  if (isRecordStart) {
    $('#record-mask').hide();
    isRecordStart = false;
  }
}
