$('.task-card').on('touchstart', function (e) {
  $(this).addClass('active')
}).on('touchend', function () {
  window.location = 'detail.html';
})









