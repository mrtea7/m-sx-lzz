/*
 功能：切换为音频输入
 */
$('.js-task-btn-text').tap(function () {
  // 隐藏文本/出场动画
  $(this).addClass('hide');
  $('.task-body-text').removeClass('task-slideIn').addClass('task-slideOut');
  // 显示音频
  $('.js-task-btn-audio').removeClass('hide');
  $('.task-body-audio').removeClass('hide task-slideOut').addClass('task-slideIn');
});

/*
 功能：切换为文本输入
 */
$('.js-task-btn-audio').tap(function () {
  // 隐藏音频
  $(this).addClass('hide');
  //$('.task-body-audio').addClass('hide');
  // 隐藏文本
  $('.js-task-btn-text').removeClass('hide');
  //$('.task-body-text').removeClass('hide');
});






/*save.addEventListener('touchstart', function (e) {
 console.log('touchstart');
 $("#demo_date").mobiscroll().date({theme: 'ios', display: 'bottom', lang: 'zh', mode: 'scroller'});


 })*/


/*

 $(function(){
 $("#demo_date").mobiscroll().date({theme: 'ios', display: 'bottom', lang: 'zh', mode: 'scroller'});


 // create a listview
 $('#list').mobiscroll().listview({
 stages: [
 { percent: -20, color: 'red', icon: 'remove', text: 'Remove', action: function (li, inst) {
 // Remove the swiped list item
 inst.remove(li);
 return false;
 } },
 { percent: 20, color: 'green', icon: 'plus', text: 'Add', action: function (li, inst, index) {
 // Add a new list item without id
 inst.add(null, 'New Item', index);
 } }
 ]
 });
 });

 $(function () {

 var ids = 6;

 $('#demo').mobiscroll().listview({
 theme: 'mobiscroll',
 sortable: true,
 iconSlide: true,
 altRow: true,
 stages: [
 {
 percent: 25,
 color: 'crimson',
 icon: 'checkmark',
 text: 'Complete',
 action: function (item) {
 $('.md-wo-status', item).text(' Completed');
 }
 },
 {
 percent: -50,
 color: 'red',
 icon: 'remove',
 text: 'Delete',
 confirm: true,
 action: function (item, inst) {
 inst.remove(item);
 return false;
 }
 },
 {
 percent: 50,
 color: 'green',
 icon: 'plus',
 text: 'Spawn',
 undo: true,
 action: function (item, inst, index) {
 inst.add(++ids, 'Work order #000' + ids + ' created from WO #000' + item.attr('data-id') + '<div class="md-wo-status">Assigned</div>', index + 1);
 }
 },
 {
 percent: -25,
 color: 'olive',
 icon: 'clock',
 text: 'Pending',
 action: function (item) {
 $('.md-wo-status', item).text(' Pending');
 }
 }
 ],
 onItemAdd: function () {
 $('#demo_note').hide();
 },
 onItemRemove: function () {
 if ($('li', this).length < 2) {
 $('#demo_note').show();
 }
 }
 });

 $('#demo_note').click(function () {
 window.location.reload();
 });

 });*/
