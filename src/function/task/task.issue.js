/*
  目录：
*/

/*--------------------------
  $ 页内全局变量
  be careful 要设置清晰的锚点
--------------------------*/



/*--------------------------
  $ 切换文字/录音模式
--------------------------*/
// 功能：切换为音频输入
$('#audio-mode').tap(function () {
  _switchTextMode(false);
  _switchAudioMode(true);
});

// 功能：切换为文本输入
$('#text-mode').tap(function () {
  _switchTextMode(true);
  _switchAudioMode(false);
});

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

// Hammer Setup
var recordGesture = Hammer(record, {});
var bodyGesture = Hammer(document.documentElement, {});
//  var bodyH = document.documentElement.clientHeight;

var maskOffsetTop = mask.offsetTop;
var maskClientHeight = mask.clientHeight;
var maskBottomSideY = maskOffsetTop + maskClientHeight;

// 定义控制变量
var isRecordCanel = false;
var isRecordStart = false;

// 按住录音
recordGesture.on('press', function (e) {
  isRecordStart = true;
  var indicator = $('record-indicator');
  if (indicator.length == 0) {
    $('#mask').append('<div id="record-indicator" class="record-indicator">');
    console.log($('#record-mask').length);
  } else {
    indicator.show();
    indicator.css('backgroundPosition', '0px 0px')
    //indicator[0].style.backgroundPosition = '0px 0px';
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


/*--------------------------
  $ 播放录音
--------------------------*/


/*--------------------------
  $ 重录
--------------------------*/


/*--------------------------
  $ 停止录音
--------------------------*/


/*--------------------------
  $ 试听
--------------------------*/





/*--------------------------
  $ 创建任务
--------------------------*/





/*--------------------------
  $ 辅助内部函数
--------------------------*/

function _switchTextMode(bool){
  if (bool) {
    $('#text-mode').removeClass('hide');
    $('.task-body-text').removeClass('hide');
  }else{
    $('#text-mode').addClass('hide');
    $('.task-body-text').addClass('hide');
  }
}

function _switchAudioMode(bool){
  if (bool) {
    // 显示
    $('#audio-mode').removeClass('hide');
    $('.task-body-audio').removeClass('hide task-slideOut').addClass('task-slideIn');
  }else{
    // 隐藏
    $('#audio-mode').addClass('hide');
    $('.task-body-audio').removeClass('task-slideIn').addClass('task-slideOut');
  }
  _toggleMask(bool);
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








