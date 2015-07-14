/*
 目录：
 页内全局变量
 切换文字/录音模式
 录音功能
 重录/取消重录
 试听/停止录音
 ------
 图片列表
 图片预览
 辅助内部函数
 */

/*--------------------------
 $ 页内全局变量
 此处也是对外开放的区域
 --------------------------*/
// 集中管理全局变量
var record = $('#record');
var mask = $('#mask');
var recordFooter = $('#record-footer');
var recordFooterHeight; // get height when display block
var indicator = $('#record-indicator');

// Hammer Setup
var recordGesture = Hammer(record[0], {});
var bodyGesture = Hammer(document.documentElement, {});
var bodyH = document.documentElement.clientHeight;

// 定义控制变量
var isRecordValid = false;  // 当前录音是否有效
var isRecordStart = false;
var hasAudio = false; // 是否已有录音

var maskInitHeight = $('#task-body')[0].clientHeight + $('#mode')[0].clientHeight;
var timerConfig = {id: null, seconds: 0, active: false}; // 计数器开关, active 用于保证一次录音仅触发一次计数器
var recordTimer = $('#record-timer');
var timerSeconds = $('#timer-seconds');


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
// 同时满足 touchstart 和 press 有较好的体验，以及修复 bug
// 只要保证 计数器 timer 只触发一次
record.on('touchstart', recordStart)
recordGesture.on('press', recordStart)

function recordStart() {
  isRecordStart = true;
  isRecordValid = true;
  // 改变按钮状态
  record.text('松开结束').addClass('active');
  // 计数器
  _timerStart();
  mask.css({'top': '0', 'bottom': '0'});
  indicator.removeClass('hide')
  indicator.css('background-position', '0px 0px')
  recordTimer.removeClass('hide')
}

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
// 停止录音（未平移过）
bodyGesture.on('pressup', stopRecord)
recordGesture.on('pressup', stopRecord)
recordGesture.on('touchend', stopRecord)
$('body').on('touchend', stopRecord)


function stopRecord(e) {
  if (isRecordStart) {
    // 改变按钮状态
    record.text('按住录音').removeClass('active');
    if (isRecordValid) {
      hasAudio = true;
      _showAudioCtrl();
      _closeRecord();
      _updateTimerPanel();
    } else {
      _resetRecord();
    }
    // 计数器
    _timerStop();
  }
}


/*--------------------------
 $ 重录/取消重录
 --------------------------*/
$('#remake').on('touchstart', function () {
  var $this = $(this);
  // 逻辑是切换
  if ($this.prop('is-remake') == '是') {
    _switchRemake(false);
    _switchInitAudioMask(true);
  } else {
    _switchRemake(true);
    _switchInitAudioMask(false);
  }
})


/*--------------------------
 $ 试听/停止录音
 --------------------------*/
$('#play').on('touchstart', function () {
  var $this = $(this);
  var icon = $this.children('*:nth-child(1)')
  var txt = $this.children('*:nth-child(2)')
  if (txt.text() == '试听') {
    icon.removeClass('task-icon-play').addClass('task-icon-stop');
    txt.text('暂停')
  } else {
    icon.removeClass('task-icon-stop').addClass('task-icon-play');
    txt.text('试听')
  }
})


/*--------------------------
 $ 图片列表
 --------------------------*/
// 上传图片
$('#img-upload').on('touchstart', function () {
  var $this = $(this), $thisLi = $this.parent();
  var opts = $.extend({
    limit: 5,
    maxSize: 2048
  }, opts)
  var li =
    $('<li>' +
    ' <img src="../../assets/imgs/tmp/Lighthouse.jpg"/>' +
    ' <span class="img-list-del"></span>' +
    '</li>')
  // 插入到 ul 中
  $thisLi.before(li)
  // 增加删除事件
  li.find('.img-list-del').on('touchstart', _deletePhoto);
  li.find('img').on('touchstart', previewPhoto)
  // 判断 li 的个数
  if (($('#img-list').find('li').length - 1) >= 5) {
    $thisLi.hide();
  }
})

// 删除图片
$('.img-list-del').on('touchstart', _deletePhoto)

function _deletePhoto(){
  $(this).parent().remove();
  // 判断 li 的个数
  if (($('#img-list').find('li').length - 1) < 5) {
    $('#img-upload').parent().show();
  }
}


/*--------------------------
 $ 图片预览
 --------------------------*/
$('#img-list').find('img').on('touchstart', previewPhoto)
function previewPhoto() {
  var template =
    '<div id="swipe" class="swipe">' +
    ' <div id="img-box" class="img-box">' +
    '   <ul></ul>' +
    '   <div id="swipe-num" class="swipe-num"></div>' +
    '   <a href="javascript:void(0);" class="swipe-cancel">×</a>' +
    ' </div>' +
    '</div>';
  var swipe = $('#swipe'), mySwipe;
  var liHtml = '', numHtml = '';
  var imgListIndex = $(this).parent().index(); // li

  if (swipe.length == 0) {
    swipe = $(template).appendTo('body')
  }

  $('#img-list').find('img').each(function () {
    liHtml += '<li><img src="' + $(this).prop('src') + '"/></div></li>';
    numHtml += '<span></span>';
  })

  swipe.find('ul').append(liHtml);
  swipe.find('#swipe-num').append(numHtml);
  swipe.show(); // 图片加载全后再显示 swipe

  if (!mySwipe) {
    if (typeof Swipe === 'undefined') throw Error('please load swipe.js');
    mySwipe = new Swipe(swipe.find('#img-box')[0], {
      cur: imgListIndex,
      dir: 'horizontal',
      callback: function (index) {
        _swipeCallback($(this.el), index);
      }
    });
  } else {
    mySwipe.cur = imgListIndex;
    mySwipe.init();
  }
  _swipeCallback(swipe, imgListIndex);

  function _swipeCallback(obj, index) {
    obj.find('#swipe-num span').eq(index).addClass('on').siblings().removeClass('on');
  }

  // 关闭 swipe
  swipe.on('touchstart', function (e) {
    var className = e.target.className;
    if (className == 'swipe' || className == 'swipe-cancel') {
      swipe.hide().find('ul').html('').next().html('');
    }
    e.preventDefault();
  });
}


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
    mask.css({'top': maskInitHeight + 'px', 'bottom': '0'}).on('touchmove', function (e) {
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
  recordTimer.addClass('hide');
  recordFooter.addClass('hide');
  isRecordStart = false;
}

// 回到一开始录音的状态（界面）
function _resetRecord() {
  _switchInitAudioMask(true);
  indicator.addClass('hide');
  recordTimer.addClass('hide');
  isRecordStart = false;
}

function _showAudioCtrl() {
  $('.audio-ctrl').removeClass('hide');
  _switchRemake(true);
}

// 计数器开始/停止
function _timerStart() {
  if (!timerConfig.active) {
    // 建议在此处重置
    timerConfig.seconds = 0;
    timerSeconds.text(0);
    timerConfig.id = setInterval(function () {
      timerConfig.seconds += 1;
      timerSeconds.text(timerConfig.seconds)
    }, 1000);
    timerConfig.active = true;
  }
}

function _timerStop() {
  clearInterval(timerConfig.id);
  timerConfig.active = false;
}

// 如果录音有效，才更新到时间面板
function _updateTimerPanel() {
  $('#time-panel-seconds').text(timerConfig.seconds);
}

function _switchRemake(bool) {
  var $this = $('#remake');
  var icon = $this.children('*:nth-child(1)')
  var txt = $this.children('*:nth-child(2)')
  if (bool) {
    icon.removeClass('task-icon-cancel').addClass('task-icon-remake');
    txt.text('重录')
    $this.prop('is-remake', '是')
  } else {
    icon.removeClass('task-icon-remake').addClass('task-icon-cancel');
    txt.text('取消')
    $this.prop('is-remake', '否')
  }
}
