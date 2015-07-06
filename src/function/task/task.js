/*
  目录：
  task-body
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
});

/*
 功能：切换为文本输入
 */
$('.js-task-btn-audio').tap(function () {
  _toggleTextBody(true);
  _toggleAudioBody(false);
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


