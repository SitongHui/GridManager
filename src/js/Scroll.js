/*
 * Scroll: 滚动轴
 * */
import $ from './jTool';
import Settings from './Settings'
const Scroll = {
	initDOM: function () {
		return '<div class="scroll-area"><div class="sa-inner"></div></div>';
	}
	/*
	 @绑定表格滚动轴功能
	 $.table: table [jTool object]
	 */
	,bindScrollFunction: function(table){
		var _this = this;
		var _tableDIV = table.closest('.table-div'),		//列表所在的DIV,该DIV的class标识为table-div
			_tableWarp = _tableDIV.closest('.table-wrap');//列表所在的外围容器
		//绑定窗口变化事件
		window.onresize = function () {
			$('.table-div').trigger('scroll', [true]);
		};
		//绑定模拟X轴滚动条
		$('.scroll-area').unbind('scroll');
		$('.scroll-area').bind('scroll', function(){
			$(this).closest('.table-div').scrollLeft(this.scrollLeft);
			this.style.left = this.scrollLeft + 'px';
		});
		//Settings.scrollDOM != window 时 清除Settings.scrollDOM 的padding值
		// if(Settings.scrollDOM != window){
		// 	$(Settings.scrollDOM).css('padding','0px');
		// }

		//绑定滚动条事件
		_tableDIV.unbind('scroll');
		_tableDIV.bind('scroll', function(e, _isWindowResize_){
			var _scrollDOM = $(this),
				_setTopHead,			//吸顶元素
				_table,					//原生table
				_thead,					//列表head
				_thList,				//列表下的th
				_tbody;					//列表body
			var _scrollDOMTop = _scrollDOM.scrollTop();

			var _tWarpMB	= undefined; //吸顶触发后,table所在外围容器的margin-bottom值
			// var scrollDOMisWindow = $.isWindow(Settings.scrollDOM);
			_tableDIV 		= table.closest('.table-div');
			_tableWarp 		= _tableDIV.closest('.table-wrap');
			_table			= table.get(0);
			_thead 			= $('thead[grid-manager-thead]', table);
			_tbody 			= $('tbody', table);

			var _tDIVTop = _tableDIV.offset().top;
			// 列表与_tableDIV之间的间隙，如marin-top,padding-top
			var _tableOffsetTop = _table.offsetTop;

			_setTopHead 	= $('.set-top', table);
			//当前列表数据为空
			if($('tr', _tbody).length == 0){
				return true;
			}
			//配置X轴滚动条
			var scrollArea = $('.scroll-area', _tableWarp);
			if(_tableDIV.width() < table.width()){  //首先验证宽度是否超出了父级DIV
				// if(scrollDOMisWindow){
				// 	_tWarpMB = Number(_tableDIV.height())
				// 		+ Number(_tableWarp.css('margin-bottom'))
				// 		- (document.body.scrollTop || document.documentElement.scrollTop || window.scrollY)
				// 		- (window.innerHeight - _tableDIV.offset().top);
				// }else{
				// 	_tWarpMB = Number(_tableDIV.height())
				// 		+ Number(_tableWarp.css('margin-bottom'))
				// 		- _scrollDOM.scrollTop()
				// 		- _scrollDOM.height();
				// }
                //
				// if(_tWarpMB < 0){
				// 	_tWarpMB = 0;
				// }
				$('.sa-inner', scrollArea).css({
					width : table.width()
				});
				scrollArea.css({
					left	: _tableDIV.scrollLeft()
				});
				scrollArea.scrollLeft(_tableDIV.scrollLeft());
				scrollArea.show();
			}else{
				scrollArea.hide();
			}
			//表头完全可见 分两种情况 scrollDOM 为 window 或自定义容器
			// if(scrollDOMisWindow ? (_tDIVTop - _scrollDOMTop >= -_tableOffsetTop) : (_scrollDOMTop == 0)){
			// 	console.log('表头完全可见')
			// 	if(_thead.hasClass('scrolling')){
			// 		_thead.removeClass('scrolling');
			// 	}
			// 	_setTopHead.remove();
			// 	return true;
			// }
			//表完全不可见
			// console.log('表完全不可见')
			// console.log(Math.abs(_tDIVTop - _scrollDOMTop));
			// console.log(_thead.height());
			// console.log();
			// if(scrollDOMisWindow ? (_tDIVTop - _scrollDOMTop < 0 &&
			// 	Math.abs(_tDIVTop - _scrollDOMTop) + _thead.height() - _tableOffsetTop > _tableDIV.height()) : false){
			// 	_setTopHead.show();
			// 	_setTopHead.css({
			// 		top		: 'auto',
			// 		bottom	: '0px'
			// 	});
			// 	return true;
			// }
			//配置吸顶区的宽度
			if(_setTopHead.length == 0 || _isWindowResize_){
				_setTopHead.length == 0 ? table.append(_thead.clone(true).addClass('set-top')) : '';
				_setTopHead = $('.set-top', table);
				_setTopHead.removeAttr('grid-manager-thead');
				_setTopHead.css({
					width : _thead.width()
					+ Number(_thead.css('border-left-width'))
					+ Number(_thead.css('border-right-width'))
					,left: table.css('border-left-width')
				});
				//$(v).width(_thList.get(i).offsetWidth)  获取值只能精确到整数
				//$(v).width(_thList.eq(i).width()) 取不到宽
				//调整吸顶表头下每一个th的宽度[存在性能问题，后期需优化]
				// _thList = $('th', _thead);
				// $.each($('th', _setTopHead), function(i, v){
				// 	$(v).css({
				// 		width : _thList.eq(i).width()
				// 		+ _thList.eq(i).css('border-left-width')
				// 		+ _thList.eq(i).css('border-right-width')
				// 	});
				// });
			}
			//当前吸引thead 没有背景时 添加默认背景
			if(!_setTopHead.css('background') ||
				_setTopHead.css('background') == '' ||
				_setTopHead.css('background') == 'none'){
				_setTopHead.css('background', '#f5f5f5');
			}

			//表部分可见
			// if(scrollDOMisWindow ? (_tDIVTop - _scrollDOMTop < 0 &&
			// 	Math.abs(_tDIVTop - _scrollDOMTop) <= _tableDIV.height() +_tableOffsetTop) : true){
			// 	if(!_thead.hasClass('scrolling')){
			// 		_thead.addClass('scrolling');
			// 	}
			// 	_setTopHead.css({
			// 		top		: _scrollDOMTop  - _tDIVTop + _this.topValue,
			// 		bottom	: 'auto'
			// 	});
			// 	_setTopHead.show();
			// 	return true;
			// }
			// 隐藏表头置镜像顶条
			if(_scrollDOMTop === 0){
				_thead.removeClass('scrolling');
				_setTopHead.remove();
			}
			// 显示表头置镜像顶条
			else {
				_thead.addClass('scrolling');
				_setTopHead.css({
					top		: _scrollDOMTop ,
					bottom	: 'auto'
				});
				_setTopHead.show();
			}
			return true;
		});
   //     $(Settings.scrollDOM).trigger('scroll');
	}
};
export default Scroll;
