/*
 目录：
 页内全局变量
 切换文字/录音模式
 录音功能
 */

/*--------------------------
 $ 页内全局变量
 --------------------------*/
// 集中管理变量
var record = $('#record');
var mask = $('#mask');
var recordFooter = $('#record-footer');
var recordFooterHeight; // get height when display block
var indicator; // dynamic

// Hammer Setup
var recordGesture = Hammer(record[0], {});
var bodyGesture = Hammer(document.documentElement, {});
var bodyH = document.documentElement.clientHeight;

//var maskOffsetTop = mask[0].offsetTop;
//var maskClientHeight = mask[0].clientHeight;
//var maskBottomSideY = maskOffsetTop + maskClientHeight;

// 定义控制变量
var isRecordValid = false;  // true 必然是有录音了
var isRecordStart = false;


/*--------------------------
 $ 切换文字/录音模式
 --------------------------*/
// 功能：切换为音频输入
$('#audio-mode').on('touchstart', function () {
  _switchTextMode(false);
  _switchAudioMode(true);
});

// 功能：切换为文本输入
$('#text-mode').on('touchstart', function () {
  _switchAudioMode(false);
  setTimeout(function () {
    _switchTextMode(true);
  }, 300) // 等待动画执行完毕
});

/*--------------------------
 $ 录音功能
 --------------------------*/
// 按住录音
recordGesture.on('press', function (e) {
  isRecordStart = true;
  isRecordValid = true;
  mask.css({'top': '0', 'bottom': '0'});
  indicator = $('#record-indicator');
  if (indicator.length == 0) {
    indicator = $('<div id="record-indicator" class="record-indicator">')
    mask.append(indicator);
  } else {
    indicator.show();
    indicator.css('background-position', '0px 0px')
  }
})
// 上滑取消录音
bodyGesture.on('panup', function (e) {
  if (isRecordStart) {
    // 指定下移到特定的区域才更改状态
    var touchY = e.pointers[0].pageY;
    if (bodyH - touchY >= 2 * recordFooterHeight) {
      indicator.css('background-position', '0px -152px')
      isRecordValid = false;
    }
  }
})
// 下滑继续录音
bodyGesture.on('pandown', function (e) {
  if (isRecordStart) {
    // 指定下移到特定的区域才更改状态
    var touchY = e.pointers[0].pageY;
    if (bodyH - touchY < 2 * recordFooterHeight) {
      console.log('hello');
      indicator.css('background-position', '0px 0px')
      isRecordValid = true;
    }
  }
})
// 停止录音（经过平移）
bodyGesture.on('panend', stopRecord)
// 停止录音（未平移过） PS：与
bodyGesture.on('pressup', stopRecord)

function stopRecord(e){
  if (isRecordStart) {
    _closeRecord();
    if (isRecordValid) {
      _showAudioCtrl();
    }
  }
}


/*--------------------------
 $ 重录
 --------------------------*/
$('#remake').on('touchstart', function () {
  _switchMask(true)
})


/*--------------------------
 $ 播放录音
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
function _switchTextMode(bool) {
  var mode = $('#audio-mode');
  var body = $('#text-body');
  if (bool) {
    mode.removeClass('hide');
    body.removeClass('hide');
  } else {
    mode.addClass('hide');
    body.addClass('hide');
  }
}

function _switchAudioMode(bool) {
  var mode = $('#text-mode');
  var body = $('#audio-body');
  if (bool) {
    mode.removeClass('hide');
    body.removeClass('hide task-slideOut').addClass('task-slideIn');
  } else {
    mode.addClass('hide');
    body.removeClass('task-slideIn').addClass('task-slideOut');
  }
  _switchMask(bool);
}

// 遮罩层开关
function _switchMask(bool) {
  if (bool) {
    recordFooter.removeClass('hide').on('touchmove', function (e) {
      e.preventDefault();
    })
    recordFooterHeight = recordFooter[0].clientHeight
    // 的确每次得重置
    mask.css({'top': '15rem', 'bottom': '0'}).on('touchmove', function (e) {
      e.preventDefault();
    }).removeClass('hide')
  } else {
    recordFooter.addClass('hide');
    mask.addClass('hide')
  }
}

function _closeRecord() {
  if (isRecordStart) {
    mask.addClass('hide');
    indicator.addClass('hide');
    recordFooter.addClass('hide');
    isRecordStart = false;
  }
}

function _showAudioCtrl() {
  $('.audio-ctrl').removeClass('hide');
}




