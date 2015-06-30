(function(){
	function Getlist(obj, url){
		this.curPage = 0;
		this.total = 1;
		this.url = url;
		this.el = $(obj);
		this.kw = '';
		this.loader = $('#loading');
		this.noListStyle = config.HIDELOGO == 'true' ? 'no_list_text' : 'no_list';

		this.loadList();
	}
	Getlist.prototype = {
		loadList: function(){
			var _this = this;

			if(_this.loader.length && _this.loader.css('display') == 'none'){
				_this.loader.show();

				$.get(_this.url, {curPage: _this.curPage + 1, kw: _this.kw}, function(res){
					var res = typeof res === 'string' ? JSON.parse(res) : res;

					if(res.status == 0){
						_this.loader.hide();

						if(!res.data.trim()){
							_this.el.addClass(_this.noListStyle);
							return;
						}else{
							_this.el.removeClass(_this.noListStyle);
						}

						_this.curPage += 1;
						_this.total = res.total;
						_this.el.find('ul').append(res.data);

						// 木有更多了。
						if(_this.total <= _this.curPage){
							$(window).off('scroll.gl');
						}else{
							if(!_this.isBind) _this.bindSc();
						}
					}else{
						alert(res.message);
					}
				});
			}
		},
		bindSc: function(){
			var _this = this;
			$(window).on('scroll.gl', function(){
				if($(this).height() + $(this).scrollTop() > $('body').height() - 50){
					_this.loadList();
				}
			});
			_this.isBind = true;
		},
		search: function(keyword){
			this.kw = keyword;
			this.curPage = 0;
			this.isBind = false;
			this.el.find('ul').html('');
			$(window).off('scroll.gl');

			this.loadList();
		}
	}

	window.Getlist = Getlist;

	$.fn.getList = function(url){
		return this.each(function(){
			$(this).data('getList', new Getlist(this, url));
		});
	}
})();

$(function(){
	var list = new Getlist($('#list'), config.URL),
		length = $('#nav a').length,
		_searchInput = $('#searchInput'),
		_searchTxt = _searchInput.find('input');

	if(!length){
		_searchInput.css('left', 0).removeClass('animated');
	}

	$('#searchBtn').on('click', function(){
		if(length){
			if(parseInt(_searchInput.css('left'))){
				_searchInput.css('left', 0).find('input').focus();
			}else{
				_searchInput.css('left', '100%');
			}
		}else{
			list.search(_searchTxt.val());
		}
	});

	_searchTxt.on('keydown', function(e){
		if(e.keyCode == 13){
			list.search(this.value);
		}
	});
	
	//按钮
	var delLoader;
	$('#list').delegate('button', 'click', function(){
		var url = $(this).data('url'),
			role = $(this).data('role'),
			_this = $(this),
			_parent = _this.parents('ul');

		if(url){
			location.href = url;
		}else if(role == 'delete'){
			$.confirm({txt: '确定要删除吗？', callback: function(){
				$.ajax({
					url: config.DELURL,
					data: {id: _this.data('id')},
					dataType: 'json',
					beforeSend: function(){
						if(!delLoader){
							delLoader = new loading();
						}else{
							delLoader.open();
						}
					},
					success: function(res){
						alert(res.message);
						if(res.status == 0){
							_this.parents('li').remove();
							if(!_parent.find('li').length) _parent.addClass(_this.noListStyle);
						}
						delLoader.close();
					}
				});
			}});
		}
			
		return false;
	});
});