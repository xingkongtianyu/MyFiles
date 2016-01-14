var __QY_MonitorUrlnew2 = 'http://s.qiyou.com/post_newmonitor.php?sid=9e7a301cb624df43ffd5264e776f024b&tid=1353393533&wid=16018&adstype=2';
document.writeln('<div id="__QY_MonitorDivnew2" style="z-index:1000;position:absolute;background-color:#CCCCCC;top:0px;left:0px;width:0px;height:0px;display:none;"></div>')
;(function(){
	var anew2={};
	var d=navigator.userAgent;
	this.DebugMode = null;
	this.Timer = null;
	this.TimerScroll = null;
	this.MouseX = 0;
	this.MouseY = 0;
	this.ScrollTop = 0;
	this.MouseRec = 0;
	this.MouseNO  = 0;
	this.MousePOST = 0;
	this.MouseALL = 0;
	this.ScrollRec = 0;
	this.ScrollNO = 0;
	this.ScrollALL = 0;
	this.ScrollPOST = 0;
	this.BrowseRec = 0;
	this.MouseTrack = Array();
	anew2.ver={
		webkit:/Safari/.test(d),
		mozilla4:/MSIE/.test(d),
		mozilla5:/Firefox/.test(d)
	};
	anew2.init=function(){
		this.MouseRec = 0;
		this.MouseNO  = 0;
		this.MouseALL = 0;
		this.MousePOST = 0;
		this.ScrollRec = 0;
		this.ScrollNO = 0;
		this.ScrollALL = 0;
		this.ScrollPOST = 0;
		this.BrowseRec = 0;
		this.MouseX = 0;
		this.MouseY = 0;
		this.ScrollTop = 0;
		this.MouseTrack = Array();
	}
	anew2.start=function(){
		this.DebugMode = "status1";
		this.init();
		try {document.onmousemove = __QY_MouseFollownew2;} catch(e) {this.stop();}
		//try {window.onscroll = __QY_ScrollFollownew2;} catch(e) {this.stop();}
		this.TimerScroll = setTimeout("__QY_ScrollFollownew2()", 50);
		this.Timer = setTimeout("__QY_BrowseTimenew2()", 1000);
	}
	anew2.stop=function(){
		clearTimeout(this.Timer);
		clearTimeout(this.TimerScroll);
		window.onscroll = null;
		document.onmousemove = null;
	}
	anew2.bindmouse=function(ev){
		evev = ev || window.event;
		this.MouseX = evev.clientX;
		this.MouseY = evev.clientY;
	}
	anew2.scrolltop=function(){
		this.TimerScroll = setTimeout("__QY_ScrollFollownew2()", 50);
		this.ScrollTop = document.body.scrollTop;
		if (this.ScrollTop == 0) this.ScrollTop = document.documentElement.scrollTop;
	}
	anew2.browsetime=function(){
		this.Timer = setTimeout("__QY_BrowseTimenew2()", 1000);
		this.BrowseRec+=1;
		if (this.BrowseRec==1) { LastMouseX = this.MouseX; LastMouseY = this.MouseY; LastScrollTop = this.ScrollTop; this.MouseTrack[0] = LastMouseX+':'+LastMouseY; }
		else {
			if ((LastMouseX != this.MouseX && this.MouseX-LastMouseX>20) || (LastMouseY != this.MouseY && this.MouseY-LastMouseY>20)) {
				this.MouseRec=1; LastMouseX = this.MouseX; LastMouseY = this.MouseY;this.MouseNO++;
				
			}
			if (LastScrollTop != this.ScrollTop && this.ScrollTop-LastScrollTop>5) {
				this.ScrollRec=1; LastScrollTop = this.ScrollTop;this.ScrollNO++;
			}
		}
		if (this.BrowseRec==1||this.BrowseRec==5||this.BrowseRec==15||this.BrowseRec==30||this.BrowseRec==60){ 
		anew2.poststatus(this.BrowseRec, this.MouseRec , this.ScrollRec);	
		this.MouseRec=0;
		this.ScrollRec=0;
		LastMouseX = this.MouseX;
		LastMouseY = this.MouseY;
		LastScrollTop = this.ScrollTop;
		}
		if (this.MouseNO>=1 && this.MousePOST==0){
		this.MousePOST=1;
		anew2.poststatus(62, 1 ,0);	
		}
		if (this.ScrollNO>=1 && this.ScrollPOST==0){
		this.ScrollPOST=1;
		anew2.poststatus(62, 0 ,1);	
		}
		if (this.BrowseRec >= 70) { anew2.stop(); }
		anew2.debug(this.BrowseRec, this.MouseRec, this.ScrollRec, this.MouseX, this.MouseY, this.ScrollTop);
	}
	anew2.poststatus=function(argTime,argMouse,argScroll){
		//argType 0.BrowseRec 1.MouseRec 2.ScrollRec 3.MouseTrack
		sUrl = __QY_MonitorUrlnew2+'&Time='+argTime+'&Mouse='+argMouse+'&Scroll='+argScroll;
		document.getElementById('__QY_MonitorDivnew2').innerHTML='<img src="'+sUrl+'" width="1" height="1" />';
	}
	anew2.debug=function( argBrowseRec, argMouseRec, argScrollRec, argX, argY, argZ ){
		arg = "#"+argBrowseRec+" Mouse:"+argMouseRec+" Scroll:"+argScrollRec+" Mouse X:"+argX+" Y:"+argY+" Z:"+argZ;
		if ( this.DebugMode == "alert" ) { alert(arg.toString());}
		if ( this.DebugMode == "status" ) { window.status = arg.toString();document.title = arg.toString();}
	}
	
	__QY_BrowseTimenew2=function(){__qy_monitornew2.browsetime();}
	__QY_MouseFollownew2=function(ev){__qy_monitornew2.bindmouse( ev );}
	__QY_ScrollFollownew2=function(ev){__qy_monitornew2.scrolltop();}
	window.__qy_monitornew2 = anew2;
})();
__qy_monitornew2.start();


is_code=0;