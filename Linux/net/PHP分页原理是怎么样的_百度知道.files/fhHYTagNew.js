function cf_h(flashsrc,flashwidth,flashheight,flashlink,br,ec_tag,ec_tagURL){
	if (ec_tag =="ec_hytag")
	{
		var tagblock="<a style=\"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=http://eiv.baidu.com/mapm2/hyjjtag/tag_houyi.png,sizingMethod=image);width:77px;cursor:default;height:15px;z-index:20;position:absolute;right:0;bottom:0;\"><img src='http://eiv.baidu.com/mapm2/hyjjtag/tag_houyi.png' style='filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)' width='77' height='15' border='0'/></a>";
	}
	else {
		var tagblock="<a target=\"_blank\" href=\""+ec_tagURL+"\" onfocus=\"this.blur();\" style=\"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=http://eiv.baidu.com/mapm2/hyjjtag/tag_juejinNew.png,sizingMethod=image);width:77px;height:15px;cursor:pointer;z-index:20;position:absolute;right:0;bottom:0;\"><img src='http://eiv.baidu.com/mapm2/hyjjtag/tag_juejinNew.png' style='filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)' width='77' height='15' border='0'/></a>";
	}
	document.write("<table width="+flashwidth+" height="+flashheight+" border=0 cellpadding=0 cellspacing=0>");
	document.write("<tr><td>");
	document.write("<div style=\"position:relative;text-align:left;width:"+flashwidth+"px;height:"+flashheight+"px;font-family:ËÎÌו;\">");
	document.write("<embed style=\"position:absolute;z-index:0\" src="+flashsrc+" quality=\"high\" width="+flashwidth+" height="+flashheight+" TYPE=\"application/x-shockwave-flash\" PLUGINSPAGE=\"http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash\" wmode=\"opaque\"></embed>");
	document.write("<a href="+flashlink+" target=\"_blank\" style=\"cursor:pointer;z-index:1; position:absolute;display:block;background:white;filter:alpha(opacity=0);opacity:0;width:"+flashwidth+"px;height:"+flashheight+"px;\" onfocus=\"this.blur();\"></a>");
	document.write(tagblock);
	document.write("</div>");
	document.write("</td></tr></table>");
	if (br=="1") {
	document.write("<br>");
	}
}

function cf1_h(flashsrc,flashwidth,flashheight,br,ec_tag,ec_tagURL,flashvar){	
	if (ec_tag =="ec_hytag")
	{
		var tagblock="<a style=\"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=http://eiv.baidu.com/mapm2/hyjjtag/tag_houyi.png,sizingMethod=image);width:77px;cursor:default;height:15px;z-index:20;position:absolute;right:0;bottom:0;\"><img src='http://eiv.baidu.com/mapm2/hyjjtag/tag_houyi.png' style='filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)' width='77' height='15' border='0'/></a>";
	}
	else {
		var tagblock="<a target=\"_blank\" href=\""+ec_tagURL+"\" onfocus=\"this.blur();\" style=\"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=http://eiv.baidu.com/mapm2/hyjjtag/tag_juejinNew.png,sizingMethod=image);width:77px;height:15px;cursor:pointer;z-index:20;position:absolute;right:0;bottom:0;\"><img src='http://eiv.baidu.com/mapm2/hyjjtag/tag_juejinNew.png' style='filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)' width='77' height='15' border='0'/></a>";
	}
	document.write("<table width="+flashwidth+" height="+flashheight+" border=0 cellpadding=0 cellspacing=0>");
	document.write("<tr><td>");
	document.write("<div style=\"position:relative;text-align:left;width:"+flashwidth+"px;height:"+flashheight+"px;font-family:ËÎÌו;\">");
	document.write("<embed src=\""+flashsrc+"\""+((typeof flashvar == "string")?(" flashvars=\""+flashvar+"\""):"")+" quality=high pluginspage=\"http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash\" type=\"application/x-shockwave-flash\" width="+flashwidth+" height="+flashheight+" align=center wmode=\"opaque\"></embed>");
	document.write(tagblock);
	document.write("</div>");
	document.write("</td></tr></table>");
	if (br=="1") {
	document.write("<br>");
	}
}
