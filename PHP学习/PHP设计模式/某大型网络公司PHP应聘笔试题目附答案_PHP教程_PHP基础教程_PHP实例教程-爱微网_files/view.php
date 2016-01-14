
var objdate = new Date();
var qy_rm_url='http://rs.qiyou.com/popup.php?t='+objdate.getTime()+'&q=MTQ5NzN8MTYwMTh8M3w2fDB8fDEzNTMzOTM3MjB8ZWNhZmY5YWYwYzAwZmEyYmY0ZTM1MzkwNzNmMTU2MmF8MHwxMDB8MA%3D%3D';
var qy_rm_closeresp_url ='http://s.qiyou.com/closecount.php?uid=14973&wid=16018&adstype=2&visit_count=1&isnew=1';
var qy_rm_width=270; var qy_rm_height=200;
var qy_rm_close_left=16;
var qy_rm_domain_left=77; var qy_rm_domain_top=15;
if (typeof(__hasqyrm)=='undefined' && navigator.cookieEnabled) {
;(function(){
	var a = {};
	var d = navigator.userAgent;
	this.DebugMode = null;

	this.Timer = null;
	this.TimerDiv = null;
	this.TimerLogoS = null;
	this.TimerLogoH = null;
	this.isfixed = false;

	a.ver = {
		ie:/MSIE/.test(d),
		ie6:!/MSIE 7\.0/.test(d)&&( /MSIE 6\.0/.test(d)||/MSIE 5\.0/.test(d) )&&!/MSIE 8\.0/.test(d)&&!/MSIE 9\.0/.test(d),
		isie789:/MSIE 7\.0/.test(d) || /MSIE 8\.0/.test(d) || /MSIE 9\.0/.test(d),
		isie9:/MSIE 9\.0/.test(d),
		isfixed:/Firefox/.test(d) || /WebKit/.test(d)
	};
	a.init = function(E){
		var bg_css = {zIndex:2147483647 , width:qy_rm_width+'px' , height:qy_rm_height+'px' , position:'absolute' , padding:'0px' , margin:'0px'};
		var qy_bg_div = a.css('__QY_RM_Div' , bg_css);
		if(E) var qy_divclose = false;
		else {
			var qy_divclose = true;
			if (this.isfixed ) {bg_css.position = 'fixed'; bg_css.right = '0px';}
			bg_css.bottom = '0px';
			qy_bg_div = a.css('__QY_RM_Div' , bg_css);
			document.body.insertBefore(qy_bg_div, document.body.firstChild);

			var qy_close_div = a.css('' , {zIndex:199999 , top:'0px' , left:(qy_rm_width-qy_rm_close_left)+'px' , width:'16px' , height:'16px' , position:'absolute' , display:'none' , cursor:'pointer'});
			qy_close_div.onclick = __qy_richmedia.close;
			qy_close_div.innerHTML = '<img style="width:16px; height:16px;" src="http://img.qiyou.com/close.png">';
			qy_bg_div.insertBefore(qy_close_div, qy_bg_div.firstChild);
		}

		img = '<img src="http://img.qiyou.com/logo.png" style="float:left" width=77 height=15 border=0/>';
		if (a.ver.ie6) img = '<img style="float:left;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=http://img.qiyou.com/logo.png, sizingMethod=scale);" src="http://img.qiyou.com/spacegif.gif" width=77 height=15 border=0/>';
		var qy_logo_div = a.css('__QY_RM_Logo' , {top:(qy_rm_height-qy_rm_domain_top)+'px' , width:'23px' , height:'17px' , overflow:'hidden' , position:'absolute' , display:'none' , zIndex:199998 , right:'0px'});
		qy_logo_div.innerHTML = '<a href="http://www.qiyou.com" target=_blank>'+img+'</a>';
		qy_logo_div.onmouseover = __qy_richmedia.showLogo;
		qy_logo_div.onmouseout = __qy_richmedia.hideLogo;
		qy_bg_div.insertBefore(qy_logo_div, qy_divclose ? qy_bg_div.lastChild.nextSibling : qy_bg_div.firstChild);

		var qy_iframe = a.css('' , {width:qy_rm_width+'px' , height:qy_rm_height+'px' , margin:'0px' , border:'0px'} , 'iframe');
		a.attr(qy_iframe , {src:qy_rm_url , hspace:0 , vspace:0 , frameBorder:0 , scrolling:'no' , allowTransparency:true});
		qy_bg_div.insertBefore(qy_iframe , qy_bg_div.lastChild.nextSibling);

		qy_bg_div.insertBefore(a.css('__QY_RM_Count' , {zIndex:199994 , top:'0px' , left:'0px' , width:'0px' , height:'0px' , position:'absolute' , display:'none'}) , qy_bg_div.lastChild.nextSibling);
		setTimeout( function() {if(qy_divclose) {qy_close_div.style.display = "block";}if (typeof(__QY_RM_HideLogo)=="undefined"){a.css('__QY_RM_Logo' , {display : 'block'});}} , 2000);
	}
	a.open = function(){
		if(document.getElementById('__QY_RM_Div')){a.init(document.getElementById('__QY_RM_Div'));return;}
		if (a.ver.isfixed) this.isfixed = true;
		else if (a.ver.isie789 && document.compatMode!="BackCompat") this.isfixed = true;
		a.Win = ( document.compatMode.toLowerCase() == "css1compat" ) ? document.documentElement : document.body;
		a.init();
		this.DebugMode = "status1";
		this.TimerDiv = setInterval(__qy_richmedia.istop, 1000);
		if (!this.isfixed ) { __qy_richmedia.scrollfllow(); this.Timer = setInterval(__qy_richmedia.scrollfllow, 10); }
	}
	a.close = function(){
		clearInterval(this.Timer);
		clearInterval(this.TimerDiv);
		//window.onscroll = null;
		document.getElementById('__QY_RM_Count').innerHTML = '<img src="'+qy_rm_closeresp_url+'" width=0px height=0px border=0/>';
		document.body.removeChild(document.getElementById('__QY_RM_Div'));
	}
	a.showLogo = function() {
		clearTimeout(this.TimerLogoH);
		var logoDiv = document.getElementById('__QY_RM_Logo');
		var clientW = logoDiv.clientWidth;
		if(clientW + 2 < 77) {
			logoDiv.style.width = (clientW + 2)+'px';
			this.TimerLogoS = setTimeout(__qy_richmedia.showLogo , 1);
		} else logoDiv.style.width = '77px';
	}
	a.hideLogo = function() {
		clearTimeout(this.TimerLogoS);
		var logoDiv = document.getElementById('__QY_RM_Logo');
		var clientW = logoDiv.clientWidth;
		if(clientW - 2 > 23) {
			logoDiv.style.width = (clientW - 2)+'px';
			this.TimerLogoH = setTimeout(__qy_richmedia.hideLogo , 1);
		} else logoDiv.style.width = '23px';
	}
	a.scrollfllow = function(){
		a.css('__QY_RM_Div' , {top : (a.Win.scrollTop + a.Win.clientHeight - qy_rm_height - 3) + 'px' , left : (a.Win.scrollLeft + a.Win.clientWidth - qy_rm_width - 3) + 'px'});
		//this.debug(obj.scrollTop, obj.scrollLeft, obj.clientWidth, obj.clientHeight);
	}
	a.istop = function(){
		var checkElement = ['div', 'iframe'];
		for(var t=0; t<checkElement.length; t++) {
			var divs = document.getElementsByTagName(checkElement[t]);
			var len = divs.length;
			for(var i=0;i<len;i++){
				if (divs[i].id == '__QY_RM_Div') { divs[i].style.zIndex = 2147483647; divs[i].style.display = 'block';}
				else if (divs[i].style.zIndex == 2147483647){ divs[i].style.zIndex --; }
			}
		}
	}

	a.debug = function( argScrollTop, argScrollLeft, argclientWidth, argclientHeight ){
		arg = "#" + " clientWidth:"+argclientWidth+" clientHeight:"+argclientHeight + " ScrollTop:"+argScrollTop+" ScrollLeft:"+argScrollLeft+"      Time:"+new Date().toLocaleString();
		if ( this.DebugMode == "alert" ) { alert(arg.toString());}
		if ( this.DebugMode == "status" ) { window.status = arg.toString();document.title = arg.toString();}
	}
	
	a.css = function(objID , objCss , objType) {
		if(objType == undefined || objType == null) objType = 'div';
		var new_Obj = null;
		if(objID.length > 0) new_Obj = document.getElementById(objID);
		if(new_Obj == null) {
			new_Obj = document.createElement(objType);
			if(objID.length > 0) a.attr(new_Obj , {id : objID});
		}
		for(var i in objCss) try { eval('new_Obj.style.'+(i == 'float' ? (a.ver.ie ? 'styleFloat' : 'cssFloat') : i)+' = "'+objCss[i]+'"'); } catch(e) {}
		return new_Obj;
	}
	a.attr = function(obj , objAttr) {
		for(var i in objAttr) obj.setAttribute(i , objAttr[i]);
	}

	window.__qy_richmedia = a;
})();
var __qy_richmedia_interval = setInterval( function() {if(document.body) { clearInterval(__qy_richmedia_interval);__qy_richmedia.open();}} , 50);
var __hasqyrm=1;
}

//monitor
if (!is_code)
{
	var is_code=1;
	document.writeln('<script src="http://s.qiyou.com/stat.php?uid=14973&wid=16018&adstype=2&visit_count=1&isnew=1&ismonitor=1&url='+encodeURIComponent(document.location)+'&ref='+encodeURIComponent(document.referrer)+'" language="javascript"></script>');
}
