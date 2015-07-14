/*
  依赖文件：
    自定义的 swipe.js
    _img.scss

    预览用到 swipe，可以叫做 swipe-box

    PS：本工程不用，仅供参考

*/
$.fn.photoUpload = function (opts) {
  return this.each(function () {
    var opts = $.extend({
        limit: 5,
        maxSize: 2048
      }, opts),
      $this = $(this),
      lastBtn = $this.find('li').last(),
      template =
        '<div class="swipe">' +
        ' <div class="img-box">' +
        '   <ul></ul>' +
        '   <div class="swipe-num"></div>' +
        '   <a href="javascript:void(0);" class="swipe-cancel">×</a>' +
        ' </div>' +
        '</div>',
      _swipe = $(template).appendTo('body'),
      mySwipe;

    /*$this.on('input', 'change', function () {
      var item = $(this).parent().clone(),
        file = this.files[0],
        _parent = $(this).parents('.upload_img');

      if (file.size / 1024 > opts.maxSize) {
        $.alert({txt: '所选文件太大，不能超过' + opts.maxSize / 1024 + 'M'});
        return;
      }

      _parent.find('.file_btn').css('background-image', 'url(' + webkitURL.createObjectURL(file) + ')').removeClass('file_btn').next().show();
      ;


      lastBtn = item.appendTo(_parent);

      if (_parent.find('li').length > opts.limit) {
        lastBtn.hide();
      }
    });*/

    $this.delegate('span', 'click', showImg);

    $this.delegate('.del_img', 'click', function () {
      if (lastBtn.css('display') == 'none') lastBtn.show();
      $(this).parent().remove();
    });


    _swipe.on('click', function (e) {
      var className = e.target.className;

      if (className == 'swipe' || className == 'cancle_box') {
        _swipe.hide().find('ul').html('').next().html('');
      }
    });


    function swipeCallback(obj, index) {
      obj.find('.swipe_num span').eq(index).addClass('on').siblings().removeClass('on');
    }

    function showImg() {
      var htmls = '',
        numHtml = '',
        iIndex = $(this).parent().index();

      $this.find('span').each(function () {
        if (this.className != 'file_btn') {
          htmls += '<li><div style="background-image:' + $(this).css('background-image') + '"></div></li>';
          numHtml += '<span></span>';
        }
      });

      _swipe.find('ul').append(htmls);
      _swipe.find('.swipe_num').append(numHtml);
      _swipe.show();

      if (!mySwipe) {
        if (typeof Swipe === 'undefined') throw Error('please load swipe.js');
        mySwipe = new Swipe(_swipe.find('.imgBox')[0], {
          cur: iIndex,
          dir: 'horizontal',
          callback: function (index) {
            swipeCallback($(this.el), index);
          }
        });
      } else {
        mySwipe.cur = iIndex;
        mySwipe.init();
      }
      swipeCallback(_swipe, iIndex);
    }
  });
}

$(function () {
  $('#uploadImg').photoUpload();


});