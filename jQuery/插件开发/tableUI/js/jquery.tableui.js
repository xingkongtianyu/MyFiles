/*
 * tableUI 0.1
 * Copyright (c) 2009 JustinYoung  http://justinyoung.cnblogs.com/
 * Date: 2010-01-11
 * 使用tableUI可以方便地将表格提示使用体验。先提供的功能有奇偶行颜色交替，鼠标移上高亮显示
 */
(function($){
	$.fn.tableUI = function(options){
		var defaults = {
			evenRowClass:"evenRow",
			oddRowClass:"oddRow",
			activeRowClass:"activeRow"			
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var thisTable=$(this);
			//添加奇偶行颜色
			$(thisTable).find("tr:even").addClass(options.evenRowClass);
			$(thisTable).find("tr:odd").addClass(options.oddRowClass);
			//添加活动行颜色
			$(thisTable).find("tr").bind("mouseover",function(){
				$(this).addClass(options.activeRowClass);
			});
			$(thisTable).find("tr").bind("mouseout",function(){
				$(this).removeClass(options.activeRowClass);
			});
		});
	};
})(jQuery);