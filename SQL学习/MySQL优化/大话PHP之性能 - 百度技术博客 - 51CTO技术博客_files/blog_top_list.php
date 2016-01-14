
var start = 1;

var _html = '<div class="blogpopMain"><div class="l">'
          + '<a href="http://blog.51cto.com/zt/570" target="_blank"><img src="http://s3.51cto.com/wyfs02/M01/12/0F/wKioL1L3FZ-zsolLAAAqk9BnV2g735.jpg" width="105" height="105" /></a>'
          + '<p><a href="http://blog.51cto.com/zt/570" target="_blank">SolusVM安装使用</a></p></div>'
          + '<div class="r"><h4 style="text-align:left;"><a href="http://legend2011.blog.51cto.com/3018495/1356983" target="_blank">今天，你用心生活了吗？</a></h4>'
          + '<ul>'
          + '<li><a href="http://dog250.blog.51cto.com/2466061/1357009" target="_blank">一些关于技术设计的想法</a></li>'
          + '<li><a href="http://frankfan.blog.51cto.com/6402282/1354050" target="_blank"style="color:red;">什么是你的核心竞争力——人格力量</a></li>'
          + '<li><a href="http://zhangguoxiang.blog.51cto.com/1943431/1354232" target="_blank">管理的创新与发展在哪里？</a></li>'
          + '<li><a href="http://1936625305.blog.51cto.com/6410597/1357287" target="_blank"style="color:red;">【Java系列】之伪装的“大神”</a></li>'
          + '</ul>'
          + '</div></div>'
          + '';

jQuery('#showMessagerDim').show();

jQuery(function(){
//window.onload=function(){
   if(get_cookie('blog_top')==''&&start==1){
//	 show_pop();
	    jQuery.messager.showblogtop('', _html);
        var date=new Date();
	    var day = 1392134400000;//
	    date.setTime(day);
	    var test = date.getTime();
	    document.cookie="blog_top=yes;domain=.blog.51cto.com;expires="+date.toGMTString()+";path=/;";
    }
	jQuery("#showMessagerDim").click(function(){
		jQuery.messager.showblogtop('', _html);
		//removeIframe();
	});
//}
});


function get_cookie(Name) {
    var search = Name + "=";
    var returnvalue = "";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;

            end1 = document.cookie.indexOf(";", offset);

            if (end1 == -1)
            end1 = document.cookie.length;
            returnvalue=unescape(document.cookie.substring(offset, end1));
        }
    }
    return returnvalue;
}

