/*
 目录：
 页内全局变量
 切换文字/录音模式
 录音功能
 重录/取消重录
 试听/停止录音
 */

/*--------------------------
 $ 页内全局变量
   此处也是对外开放的区域
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

// 定义控制变量
var isRecordValid = false;  // 当前录音是否有效
var isRecordStart = false;
var hasAudio = false; // 是否已有录音

// 高度值
var maskInitHeight = $('#task-body')[0].clientHeight + $('#mode')[0].clientHeight ;


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
  // 改变按钮状态
  record.text('松开结束').addClass('active');

  mask.css({'top': '0', 'bottom': '0'});
  indicator = $('#record-indicator');
  if (indicator.length == 0) {
    indicator = $('<div id="record-indicator" class="record-indicator">')
    mask.append(indicator);
  } else {
    indicator.removeClass('hide')
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
      indicator.css('background-position', '0px 0px')
      isRecordValid = true;
    }
  }
})
// 停止录音（经过平移）
bodyGesture.on('panend', stopRecord)
// 停止录音（未平移过） PS：与
bodyGesture.on('pressup', stopRecord)

function stopRecord(e) {
  if (isRecordStart) {
    // 改变按钮状态
    record.text('按住录音').removeClass('active');
    if (isRecordValid) {
      hasAudio = true;
      _showAudioCtrl();
      _closeRecord();
    } else {
      // 回到录音状态
      _resetRecord();
    }
  }
}


/*--------------------------
 $ 重录/取消重录
 --------------------------*/
$('#remake').on('touchstart', function () {
  var $this = $(this);
  var icon = $this.children('*:nth-child(1)')
  var txt = $this.children('*:nth-child(2)')
  if ($this.prop('state') != '取消') {
    _switchInitAudioMask(true);
    icon.removeClass('task-icon-remake').addClass('task-icon-cancel');
    txt.text('取消')
    $this.prop('state', '取消');
  }else{
    _switchInitAudioMask(false);
    icon.removeClass('task-icon-cancel').addClass('task-icon-remake');
    txt.text('重录')
    $this.prop('state', '');
  }
})



/*--------------------------
 $ 试听/停止录音
 --------------------------*/
$('#play').on('touchstart', function () {
  var $this = $(this);
  var icon = $this.children('*:nth-child(1)')
  var txt = $this.children('*:nth-child(2)')
  if ($this.prop('state') != '暂停') {
    icon.removeClass('task-icon-play').addClass('task-icon-stop');
    txt.text('暂停')
    $this.prop('state', '暂停');
  }else{
    icon.removeClass('task-icon-stop').addClass('task-icon-play');
    txt.text('试听')
    $this.prop('state', '');
  }
})





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
  _switchInitAudioMask(bool);
}

// 遮罩层开关
function _switchInitAudioMask(bool) {
  if (bool) {
    recordFooter.removeClass('hide').on('touchmove', function (e) {
      e.preventDefault();
    })
    recordFooterHeight = recordFooter[0].clientHeight
    // 的确每次得重置
    mask.css({'top': maskInitHeight+'px', 'bottom': '0'}).on('touchmove', function (e) {
      e.preventDefault();
    }).removeClass('hide')
  } else {
    recordFooter.addClass('hide');
    mask.addClass('hide')
  }
}

// 完全关闭录音界面
function _closeRecord() {
  mask.addClass('hide');
  indicator.addClass('hide');
  recordFooter.addClass('hide');
  isRecordStart = false;
}

// 回到一开始录音的状态
function _resetRecord() {
  _switchInitAudioMask(true);
  indicator.addClass('hide');
  isRecordStart = false;
}

function _showAudioCtrl() {
  $('.audio-ctrl').removeClass('hide');
}




