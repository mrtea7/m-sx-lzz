$(function () {
  window.loadheight = $('#hook').height();
  window.hidden = $("#hook").animate("marginTop", "-" + loadheight + "px");
  window.visible = $("#hook").animate("marginTop", "0px");
  $("#hook").css("marginTop", "-" + loadheight + "px")
});
$(function hook() {
  var loadheight = $('#hook').height();
  $(window).scroll(function (event) {
    var st = $(window).scrollTop();
    if (st <= 0) {
      $("#hook").animate({"marginTop": "0px"}, 200);
      $("#hook").delay(500).slideUp(200, function () {
        window.location.reload()
      })
    }
    if ($.browser.webkit) {
      if (st == 0) {
        $('body').css('overflow', 'hidden')
      }
    }
  })
});