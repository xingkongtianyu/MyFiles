/**
 * @author Ben
 * 
 * @company CSDN
 * 
 * by 2012/05/23
 */


(function($){
	$.fn.like = function(options) {
		var defaults = {    
		    get_data_url:'http://ptcms.csdn.net/like/like/get_data?jsonpcallback=?',
		    do_like_url:'http://ptcms.csdn.net/like/like/do_like?jsonpcallback=?',
		    article_id:'',
		    ding_class:'',
		    cai_class:'',
            domain:'',
		    callback:function(data)
			{
				//console.log('a');
			}
		};
		
		

		var options = $.extend(defaults,options);
		//console.log(options);
		return this.each(function(){
			var o = options;

			function dothings(data)
			{

				var url = location.href;

				if(data.succ == -3)
				{
					insert_data(data);
				}
				else
				{
					if(data.succ == -2)
					{
						if(confirm(data.msg)){
							window.location.href = "http://passport.csdn.net/UserLogin.aspx?from="+url;
							return false;
						}
					}
					if(data.succ == -1)
					{
						return false;
					}
					if(data.succ == -4)
					{
						$('.'+o.ding_class+' dd').text(data.info.ding);
						$('.'+o.cai_class+' dd').text(data.info.cai);
					}
					else
					{
						insert_data(data);
					}
				}
				o.callback(data);
			}

			function insert_data(data)
			{
				$('.'+o.ding_class).addClass('disable');
				$('.'+o.cai_class).addClass('disable');
				$('.'+o.ding_class+' dd').text(data.info.ding);
				$('.'+o.cai_class+' dd').text(data.info.cai);
			}

			$.getJSON(o.get_data_url,{article_id:o.article_id,domain:o.domain},dothings);

			$('.'+o.ding_class).click(function(){
				$.getJSON(o.do_like_url,{article_id:o.article_id,status:1,domain:o.domain},dothings);
			});
			$('.'+o.cai_class).click(function(){
				$.getJSON(o.do_like_url,{article_id:o.article_id,status:2,domain:o.domain},dothings);
			});
		});
	}
})(jQuery);
