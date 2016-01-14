(function(){
	//原型部分img
	var tuiFloat = new Function();
	tuiFloat.prototype = {
		init : function (){
			//外容器
			this.oBox		=	this.oBox || document.body;
			//tui 尺寸
			this["width"]	=	Number(this["set"]["style"]["style_width"]);
			this["height"]	=	Number(this["set"]["style"]["style_length"]);
			//doctype
			this.mode =	document.compatMode;
			//是否支持fixed
			if (Sys().ie=="6.0" || (Sys().ie && this.mode=="BackCompat")) {
				this.fix=false;
			}else {
				this.fix=true;
			};
			//用户行为
			this.userOpen=false;
			this.userClose=false;
			this.closeOnce=true;
			this.timer = "";
			
			//创建iframe
			var iframe=document.createElement("iframe");
			iframe.setAttribute("allowTransparency","true");
			iframe.setAttribute("frameBorder","0");
			iframe.setAttribute("scrolling","no");
			iframe.style.cssText="float:none;position:absolute;display:none;overflow:hidden;z-index:2147483646;margin:0;padding:0;border:0 none;background:none;";
			this.oBox.appendChild(iframe);
			if (/msie/i.test(navigator.userAgent)) {
				var that=this;
				try {
					iframe.contentWindow.document;
					this.o = iframe;
					//创建内容
					this.createHtml();
				} catch (e) {
					iframe.src = "javascript:void((function(){document.open();document.domain='" + document.domain + "';document.close()})())";
					if (!window.XMLHttpRequest) {
						iframe.onload = function () {
							iframe.onload = null;
							that.o = iframe;
							//创建内容
							that.createHtml();
						}
					}else {
						this.o = iframe;
						//创建内容
						this.createHtml();
					};
				}
			}else{
				this.o = iframe;
				//创建内容
				this.createHtml();
			};
		},
		createHtml : function () {
			var that=this;
			this.oDoc = this.o.contentWindow.document;
			this.oDoc.open();
			this.oDoc.write('<!doctype html><html><head><meta charset="utf-8"><title>云推荐</title><style type="text/css">body,div,ul,li,em,span,a{padding:0;margin:0;}img{border:0 none;display:block;}em{font-weight:normal;font-style:normal;}ol,ul{list-style:none;}table{border-collapse:collapse;border-spacing:0;}body,input,textarea{font-family:simsun;}#tui{overflow:hidden;border-width:1px;border-style:solid;float:left;}#img{overflow:hidden;*zoom:1;padding:0 10px;}#img li{float:left;overflow:hidden;margin-top:10px;display:inline;}#img li.i_0{margin-left:0;}#img img{display:block;overflow:hidden;padding:1px;border:1px solid #ddd}#img a{display:block;width:100%;}#img a span{display:block;overflow:hidden;padding-top:5px;cursor:pointer;}#txt{overflow:hidden;*zoom:1;}#txt li{display:inline;float:left;overflow:hidden;padding:0 10px;}.mt{margin-top:10px;}#hot{overflow:hidden;margin-left:10px;margin-right:10px;}#hot ul{overflow:hidden;*zoom:1;}#hot li{float:left;word-wrap:normal;word-break:keep-all;padding-left:10px;}#foot{padding:5px 0;height:18px;line-height:18px;text-align:right;padding-right:10px;font-size:12px;}#foot a{color:#969696;}#r,#l{float:left;overflow:hidden;display:none;}#r b,#l b{display:block;overflow:hidden;cursor:pointer;background-image:url(http://tui.cnzz.net/templates/images/float/icon_24.png);background-repeat:no-repeat;_background-image:url(http://tui.cnzz.net/templates/images/float/icon.png);}#l b.hide_0{width:24px;height:104px;overflow:hidden;background-position:0 -380px;}#l b.show_0{width:24px;height:104px;overflow:hidden;background-position:0 -270px;}#l b.hide_1{width:40px;height:30px;overflow:hidden;background-position:0 -40px;}#l b.show_1{width:28px;height:81px;overflow:hidden;background-position:0 -80px;}#l b.hide_2{width:24px;height:104px;overflow:hidden;background-position:-50px -380px;}#l b.show_2{width:24px;height:104px;overflow:hidden;background-position:-50px -270px;}#l b.hide_3{width:40px;height:30px;overflow:hidden;background-position:-50px -40px;}#l b.show_3{width:28px;height:81px;overflow:hidden;background-position:-50px -80px;}#l b.hide_4{width:24px;height:104px;overflow:hidden;background-position:-100px -380px;}#l b.show_4{width:24px;height:104px;overflow:hidden;background-position:-100px -270px;}#l b.hide_5{width:40px;height:30px;overflow:hidden;background-position:-100px -40px;}#l b.show_5{width:28px;height:81px;overflow:hidden;background-position:-100px -80px;}#l b.hide_6{width:24px;height:104px;overflow:hidden;background-position:-150px -380px;}#l b.show_6{width:24px;height:104px;overflow:hidden;background-position:-150px -270px;}#l b.hide_7{width:40px;height:30px;overflow:hidden;background-position:-150px -40px;}#l b.show_7{width:28px;height:81px;overflow:hidden;background-position:-150px -80px;}#l b.hide_8{width:24px;height:104px;overflow:hidden;background-position:-200px -380px;}#l b.show_8{width:24px;height:104px;overflow:hidden;background-position:-200px -270px;}#l b.hide_9{width:40px;height:30px;overflow:hidden;background-position:-200px -40px;}#l b.show_9{width:28px;height:81px;overflow:hidden;background-position:-200px -80px;}#r b.hide_0{width:24px;height:104px;overflow:hidden;background-position:0 -270px;}#r b.show_0{width:24px;height:104px;overflow:hidden;background-position:0 -380px;}#r b.hide_1{width:40px;height:30px;overflow:hidden;background-position:0 -530px;}#r b.show_1{width:28px;height:81px;overflow:hidden;background-position:0 -180px;}#r b.hide_2{width:24px;height:104px;overflow:hidden;background-position:-50px -270px;}#r b.show_2{width:24px;height:104px;overflow:hidden;background-position:-50px -380px;}#r b.hide_3{width:40px;height:30px;overflow:hidden;background-position:-50px -530px;}#r b.show_3{width:28px;height:81px;overflow:hidden;background-position:-50px -180px;}#r b.hide_4{width:24px;height:104px;overflow:hidden;background-position:-100px -270px;}#r b.show_4{width:24px;height:104px;overflow:hidden;background-position:-100px -380px;}#r b.hide_5{width:40px;height:30px;overflow:hidden;background-position:-100px -530px;}#r b.show_5{width:28px;height:81px;overflow:hidden;background-position:-100px -180px;}#r b.hide_6{width:24px;height:104px;overflow:hidden;background-position:-150px -270px;}#r b.show_6{width:24px;height:104px;overflow:hidden;background-position:-150px -380px;}#r b.hide_7{width:40px;height:30px;overflow:hidden;background-position:-150px -530px;}#r b.show_7{width:28px;height:81px;overflow:hidden;background-position:-150px -180px;}#r b.hide_8{width:24px;height:104px;overflow:hidden;background-position:-200px -270px;}#r b.show_8{width:24px;height:104px;overflow:hidden;background-position:-200px -380px;}#r b.hide_9{width:40px;height:30px;overflow:hidden;background-position:-200px -530px;}#r b.show_9{width:28px;height:81px;overflow:hidden;background-position:-200px -180px;}</style></head><body><div id="r"><b></b></div><div id="tui"><div id="img"></div><div id="txt" class="mt"></div><div id="hot" class="mt"></div><div id="foot"><a href="'+this.tuiUrl+'?pd=PowerBy"  target="_blank" title="云推荐">云推荐</a></div></div><div id="l"><b></b></div>'+this.funcStyle()+'</body></html>');
			this.oDoc.close();
			//定义容器
			this.oTui	=	this.oDoc.getElementById("tui");
			this.oImg	=	this.oDoc.getElementById("img");
			this.oTxt	=	this.oDoc.getElementById("txt");
			this.oHot	=	this.oDoc.getElementById("hot");
			this.oFoot	=	this.oDoc.getElementById("foot");
			//图片
				//显示图片数量
				var imgLength=Math.min(this["set"]["style"]["style_pic_col"]*this["set"]["style"]["style_pic_row"],this["data"].length);
				//图片容器内容
				if (this["set"]["base"]["data_type"]!=0) {
					var ihtml="<ul>";
					for (var i=0;i<imgLength;i++) {
						if(!this["data"][i]["title"]){continue;}
						if (i%this["set"]["style"]["style_pic_col"] != 0) {
							ihtml+="<li>";
						}else {
							ihtml+='<li class="i_0">';
						};
						ihtml+='<a href="'+this["data"][i]["url"]+'" target="_blank" title="'+this["data"][i]["title"]+'"><img src="'+this["imgLoad"]+'" alt="'+this["data"][i]["thumbnail"]+'" title="'+this["data"][i]["title"]+'" hidefocus="true">';
						if (this["set"]["pic"]["pic_summary"]=="1") {
							if (this["data"][i]["title"]){
								ihtml+='<span>'+this["data"][i]["title"]+'</span>';
							}else {
								ihtml+='<span></span>';
							};
						};
						ihtml+='</a></li>';
					};
					ihtml+="</ul>";
					this.oImg.innerHTML=ihtml;
					//load图片
					var Img=this.oImg.getElementsByTagName("img");
					function loadImg(oBj) {
						var src  =oBj.getAttribute("alt");
						if (!that.demo) {
							var img = new Image();
							var ErrorNum = that.errorNum || 7;
							img.onload = function(){
								oBj.setAttribute("src",src);
							};
							img.onerror = img.onabort = function(){
								oBj.setAttribute("src",that.errorDir+Math.ceil(Math.random()*ErrorNum)+".jpg");
							};
							img.src=src;
						} else {
							oBj.src = src;
						};
					};
					for (var i=0;i<Img.length;i++) {
						loadImg(Img[i]);	
					};
				}else {
					imgLength = 0;
					this.oImg.style.display="none";
				};
				
			//文字
				//剩余数据量
				var dataLeft=(this["data"].length-imgLength) || 0;
				//文字显示数量
				var txtLength=Math.min(this["set"]["style"]["style_txt_col"]*this["set"]["style"]["style_txt_row"],dataLeft);
				//文字容器内容
				if (this["set"]["base"]["data_type"]!="2" && dataLeft >= 1) {
					var thtml="<ul>";
					for (var i=imgLength;i<imgLength+txtLength;i++) {
						if (this["data"][i]["title"]) {
							if (this["set"]["txt"]["txt_focus"] == 1) {
								thtml += '<li>&bull;&nbsp;';
							} else if (this["set"]["txt"]["txt_focus"] == 2) {
								thtml += '<li>▪&nbsp;';
							}else {
								thtml+='<li>';
							};
							thtml+='<a href="'+this["data"][i]["url"]+'" target="_blank" title="'+this["data"][i]["title"]+'" hidefocus="true">'+this["data"][i]["title"]+'</a></li>';
						};
					};
					thtml+="</ul>";
					this.oTxt.innerHTML=thtml;
				}else {
					this.oTxt.style.display="none";
				};
			//热词
				if (this["set"]["hot"]["data_hot"]!=0 && this["set"]["hot"]["data_hot_txt"]!="") {
					var hotLength;
					if (this["set"]["hot"]["data_hot_num"]==0) {
						hotLength=5;
					}else {
						hotLength=this["set"]["hot"]["data_hot_num"];
					};
					var hotList=this["set"]["hot"]["data_hot_txt"].split(",");
					hotLength=Math.min(hotLength,hotList.length);
					var hhtml="<ul>";
					for (var i=0;i<hotLength;i++) {
						if (hotList[i]) {
							hhtml+='<li><a href="' + this.searchUrl + '?kw=' + encodeURIComponent(hotList[i]) + '&site='+(this.request.sid||"")+'&ip='+(this.ip||"")+'&pui=czb&cok='+(this.Rcookie||"")+'&vr=1&hid='+(this.request.hid||"")+'&bkt='+(this.request.bkt||"")+'&ch=kwrdc&l=click&ft=' + this["ft"] + '&ps=' + i + '&wd=' + encodeURIComponent(hotList[i]) + '&aid=' + this["request"]["aid"] + '&sid=' + this["request"]["aid"] + '" target="_blank" title="'+hotList[i]+'" hidefocus="true">'+hotList[i]+'</a></li>';
						};
					};
					hhtml+="</ul>";
					this.oHot.innerHTML=hhtml;
				}else {
					this.oHot.style.display="none";
				};
			//左右标识
				var btn;
				if (this["set"]["locat"]["locat_left_right"]%2!=0) {
					btn=this.oDoc.getElementById("r");
				}else {
					btn=this.oDoc.getElementById("l");
				};
				btn.style.display="block";
				this.oBtn=btn.getElementsByTagName("b")[0];
			//点击事件
				var that=this;
				//关闭
				this.oBtn.onclick=function(){
					that.userClose=true;
					that.funcHide();
				};
				//展开
				this.oBtn.onmouseover=function(){
					that.userOpen=true;
					if (that.oTui.style.display=="none") {
						that.funcShow();
					};
				};
			//计算尺寸;
			this.funcSize();
			//显示模式
			if (this["set"]["locat"]["locat_float"]!=1) {
				this.funcHide();
			}else {
				this.funcShow();
			};
			//不支持fixed情况下绑定
			if (!this.fix) {
				window.attachEvent("onscroll",function(){
					that.funcPos();
				});
			};
			//滚动
			if (this["set"]["locat"]["locat_float"]!=1 && !this.demo) {
				this.funcScroll();
			};
			//显示主容器
			this.o.style.display="block";
			
			//请求
			if (!this.demo) {
				this.funcQuery();
			};
			this.showOnce=true;
		},
		funcSize:function(){
			if (this["set"]["locat"]["locat_mark"]%2!=0) {
				this["show_width"]=Number(this["set"]["style"]["style_width"])+28;
				this["hide_width"]=40;
				this["show_height"]=Math.max(81,this["set"]["style"]["style_length"]);
				this["hide_height"]=30;
			}else {
				this["show_width"]=Number(this["set"]["style"]["style_width"])+24;
				this["hide_width"]=24;
				this["show_height"]=Math.max(104,this["set"]["style"]["style_length"]);
				this["hide_height"]=104;
			};
		},
		funcShow:function(){
			this.o.style.width=this["show_width"]+"px";
			this.o.style.height=this["show_height"]+"px";
			this.oTui.style.display="block";
			this.oBtn.className="show_"+this["set"]["locat"]["locat_mark"];
			//第一次展现
			if (this["set"]["locat"]["locat_float"]!=1 && this.showOnce && !this.demo) {
				var hid		= this["request"]["hid"];
				var bkt		= this["request"]["bkt"];
				var la		= encodeURIComponent(String.fromCharCode(1));
				var lb		= encodeURIComponent(String.fromCharCode(2));
				url="&"+la+"&ch=aid&l=view&hid="+hid+"&bkt="+bkt+"&"+lb+"&ch=wpr_pop&l=view&hid="+hid+"&bkt="+bkt;
				//热词
				if (this["set"]["hot"]["data_hot"]!=0 && this["set"]["hot"]["data_hot_txt"]!="") {
					url+="&"+lb+"&has=true&ch=hkwrdsp&l=view&hid="+hid+"&bkt="+bkt
				}else {
					url+="&"+lb+"&has=false&ch=hkwrdsp&l=view&hid="+hid+"&bkt="+bkt	
				};
				questImg(url);
				this.showOnce=false;
			};
			//计算位置
			this.funcPos();
		},
		funcHide:function(){
			this.o.style.width=this["hide_width"]+"px";
			this.o.style.height=this["hide_height"]+"px";
			this.oBtn.className="hide_"+this["set"]["locat"]["locat_mark"];
			this.oTui.style.display="none";
			//计算位置
			this.funcPos();
		},
		funcPos:function(){
				var that=this;
				//左 右
				if (this["set"]["locat"]["locat_left_right"]%2!=0) {
					this.o.style.right=0;
				}else {
					this.o.style.left=0;
				};
			if (!this.demo) {
				var h1=parseInt(this.o.style.height);
				var h2;
				if (this.mode=="BackCompat") {
					h2=document.body.clientHeight;
				}else {
					h2=document.documentElement.clientHeight;
				};
				var t1=(h2-h1)/2;
				t1=Math.max(t1,0);
				//位置形式
				//不支持fixed
				if (!this.fix) {
					this.o.style.position="absolute";
					var t2=Math.max(document.body.scrollTop,document.documentElement.scrollTop);
					if (this["set"]["locat"]["locat_left_right"]>1) {
						this.o.style.top=(t2+h2-h1)+"px";
					}else {
						this.o.style.top=(t2+t1)+"px";
					};
				//支持fixed
				}else {
					this.o.style.position="fixed";
					if (this["set"]["locat"]["locat_left_right"]>1) {
						this.o.style.bottom=0;
					}else {
						this.o.style.top=t1+"px";
					};
				};
			};
		},
		funcScroll:function(){
			var h3=Math.max(document.body.offsetHeight,document.documentElement.offsetHeight);
			var that=this;
			addEvent(window,"scroll",function(){
				clearTimeout(that.timer);
				that.timer=setTimeout(function(){
						var h1=Math.max(document.body.scrollTop,document.documentElement.scrollTop);
						var h2;
						if (that.mode=="BackCompat") {
							h2=document.body.clientHeight;
						}else {
							h2=document.documentElement.clientHeight;
						};
						var h3=Math.max(document.body.offsetHeight,document.documentElement.offsetHeight,document.body.scrollHeight);
						var h4;
						if (that["set"]["locat"]["locat_float"]==0) {
							h4=(h3-h2)*2/3
						}else {
							h4=h3-h2-10
						};
						if (h1>=h4) {
							if (!that.userClose) {
								that.funcShow();
							};
						}else {
							if (!that.userOpen) {
								that.funcHide();
							}
						};
					},10					
				);
			});
		},
		funcStyle:function(){
			//计算图片间距 MM=( W - (MW+4)*COL - 22) / (COL-1)
				var W		= Number(this["width"]);
				var MW		= Number(this["set"]["pic"]["pic_width"]);
				var MH		= Number(this["set"]["pic"]["pic_length"]);
				var MCOL	= Number(this["set"]["style"]["style_pic_col"]);
				var MROW	= Number(this["set"]["style"]["style_pic_row"]);
				var MM 		= Math.floor(( W - MW*MCOL - 4*MCOL - 22) / (MCOL-1));
			//文字宽度 TW=(W - COL*20 +18 )/COL
				var TCOL	= Number(this["set"]["style"]["style_txt_col"]);
				var TW		= Math.floor((W-TCOL*20-2)/TCOL);
			//热词行高
				var HLH		= Number(this["set"]["hot"]["hot_body_margin"]);
			//文字行高
				var BLH		= Number(this["set"]["txt"]["txt_body_margin"])
			//各种配置
			var style='<style type="text/css">';
				//计算的数据
			if (MCOL!=1) {
				style 	+= "#img li {margin-left:" + MM + "px;}";
			}else {
				style 	+= "#img li.i_0 {margin-right:" + (W - MW * MCOL - 4 * MCOL - 22) + "px;}";
			};
				style	+=	"#txt li {width:"+TW+"px;}";
				//style
			if (this["set"]["base"]["r_radius"]==1) {
				style	+=	"#tui {border-radius:5px;}";	//是否圆角
			};
				style	+=	"#tui {height:"+(this["height"]-2)+"px}";
				style	+=	"#tui {width:"+(this["width"]-2)+"px;}";
				style	+=	"#tui {background-color:#"+this["set"]["style"]["style_background_color"]+";}";
				style	+=	"#img a:hover {background-color:#"+this["set"]["style"]["style_hover_color"]+";}";
				style	+=	"#tui {border-color:#"+this["set"]["style"]["style_border_color"]+";}";
				//pic
				style	+=	"#img li {width:"+(MW+4)+"px;}";
				style	+=	"#img img {height:"+MH+"px;}";
				style	+=	"#img img {width:"+MW+"px;}";
				//hot
				style	+=	"#hot {background-color:#"+this["set"]["hot"]["hot_body_background"]+";}";
				style	+=	"#hot {font-size:"+this["set"]["hot"]["hot_body_size"]+"px;}";
			if (this["set"]["hot"]["hot_body_bold"]==1) {
				style	+=	"#hot {font-weight:700;}";	
			}else {
				style	+=	"#hot {font-weight:400;}";	
			};
				style	+=	"#hot {height:"+HLH+"px;line-height:"+HLH+"px;}";
				style 	+=	"#hot li a:link {color:#"+this["set"]["hot"]["hot_default_color"]+";}"
			if (this["set"]["hot"]["hot_default_underline"]==1) {
				style 	+=	"#hot li a:link {text-decoration:underline;}";
			}else {
				style 	+=	"#hot li a:link {text-decoration:none;}";
			};
				style 	+=	"#hot li a:visited {color:#"+this["set"]["hot"]["hot_clicked_color"]+";}"
			if (this["set"]["hot"]["hot_clicked_underline"]==1) {
				style 	+=	"#hot li a:visited {text-decoration:underline;}";
			}else {
				style 	+=	"#hot li a:visited {text-decoration:none;}";
			};
				style 	+=	"#hot li a:hover {color:#"+this["set"]["hot"]["hot_hover_color"]+";}"
			if (this["set"]["hot"]["hot_hover_underline"]==1) {
				style 	+=	"#hot li a:hover {text-decoration:underline;}";
			}else {
				style 	+=	"#hot li a:hover {text-decoration:none;}";
			};
				style 	+=	"#hot li a:active {color:#"+this["set"]["hot"]["hot_click_color"]+";}"
			if (this["set"]["hot"]["hot_click_underline"]==1) {
				style 	+=	"#hot li a:active {text-decoration:underline;}";
			}else {
				style 	+=	"#hot li a:active {text-decoration:none;}";
			};
				//txt
				style	+=	"body {font-size:"+this["set"]["txt"]["txt_body_size"]+"px;}";
			if (this["set"]["txt"]["txt_body_bold"]==1) {
				style	+=	"body {font-weight:700;}";	
			}else {
				style	+=	"body {font-weight:400;}";	
			};
				style	+=	"#txt li {height:"+BLH+"px;line-height:"+BLH+"px;}";
				style	+=	"#img a span {height:"+BLH*2+"px;line-height:"+BLH+"px;}";
				style 	+=	"a:link,#txt li {color:#"+this["set"]["txt"]["txt_default_color"]+";}"
			if (this["set"]["txt"]["txt_default_underline"]==1) {
				style 	+=	"a:link {text-decoration:underline;}";
			}else {
				style 	+=	"a:link {text-decoration:none;}";
			};
				style 	+=	"a:visited {color:#"+this["set"]["txt"]["txt_clicked_color"]+";}"
			if (this["set"]["txt"]["txt_clicked_underline"]==1) {
				style 	+=	"a:visited {text-decoration:underline;}";
			}else {
				style 	+=	"a:visited {text-decoration:none;}";
			};
				style 	+=	"a:hover {color:#"+this["set"]["txt"]["txt_hover_color"]+";}"
			if (this["set"]["txt"]["txt_hover_underline"]==1) {
				style 	+=	"a:hover {text-decoration:underline;}";
			}else {
				style 	+=	"a:hover {text-decoration:none;}";
			};
				style 	+=	"a:active {color:#"+this["set"]["txt"]["txt_click_color"]+";}"
			if (this["set"]["txt"]["txt_click_underline"]==1) {
				style 	+=	"a:active {text-decoration:underline;}";
			}else {
				style 	+=	"a:active {text-decoration:none;}";
			};
				style	+=	"</style>";
			return (style);
		},
		funcQuery:function(){
			var that	= this;
			var hid		= this["request"]["hid"];
			var bkt		= this["request"]["bkt"];
			var la		= encodeURIComponent(String.fromCharCode(1));
			var lb		= encodeURIComponent(String.fromCharCode(2));
			var l;
			this["set"]["locat"]["locat_float"]==1 ? l="view" : l="hide";
			//打开页面
			var url="";
			if (this["set"]["locat"]["locat_float"]==1) {
				url="&"+la+"&ch=aid&l=view&hid="+hid+"&bkt="+bkt+"&"+lb+"&ch=wpr_pop&l=view&hid="+hid+"&bkt="+bkt;
			}else {
				url="&"+la+"&ch=wpr_pop&l="+l+"&hid="+hid+"&bkt="+bkt;	
			};
			if (this["set"]["hot"]["data_hot"]!=0) {
				if (this["set"]["hot"]["data_hot_txt"]!=""){
					url+="&"+lb+"&has=true&ch=hkwrdsp&l="+l+"&hid="+hid+"&bkt="+bkt
				}else {
					url+="&"+lb+"&has=false&ch=hkwrdsp&l="+l+"&hid="+hid+"&bkt="+bkt	
				};
			};
			questImg(url);
			
			// 点击热词
			var a=this.oHot.getElementsByTagName("a");
			for (var i=0;i<a.length;i++) {
				a[i].index=i;
				a[i].onclick=function(){
					var url="";
					url="&"+la+"&ch=kwrdc&l=click&ps="+this.index+"&wd="+encodeURIComponent(this.innerHTML)+"&hid="+hid+"&bkt="+bkt+"&"+lb+"&ch=aid&l=click&hid="+hid+"&bkt="+bkt
					questImg(url);
				};
			};
			
			//链接
			var a = this.oImg.getElementsByTagName("a");
			for (var i = 0; i < a.length; i++) {
				a[i].index = i;
				a[i].onclick = function () {
					var url = "";
					urltemp = "&"+ la +"&ch=wpr_pop&l=click&ps="+ this.index +"&hid="+ hid +"&bkt="+ bkt +"&isimg=1&curl="+ encodeURIComponent(this.href) +"&"+ lb +"&ch=aid&l=click&hid="+ hid +"&bkt="+ bkt;
					questImg(urltemp);
				};
			};
			var a = this.oTxt.getElementsByTagName("a");
			for (var i = 0; i < a.length; i++) {
				a[i].index = i;
				a[i].onclick = function () {
					var url = "";
					urltemp = "&"+ la +"&ch=wpr_pop&l=click&ps="+ this.index +"&hid="+ hid +"&bkt="+ bkt +"&isimg=0&curl="+ encodeURIComponent(this.href) +"&"+ lb +"&ch=aid&l=click&hid="+ hid +"&bkt="+ bkt;
					questImg(urltemp);
				};
			};
		}
	};
	//原型结束

	//*********配置参数***************************
	var tuiFloatRun = new tuiFloat();
	tuiFloatRun.demo = false;
	tuiFloatRun.set = {"logo":{"logo_background_user":"1","logo_background_img":""},"style":{"style_length":"295","style_width":"250","style_pic_col":"2","style_pic_row":"1","style_txt_col":"1","style_txt_row":"6","style_background_color":"fbfff5","style_hover_color":"ffffff","style_border_color":"81BCFF"},"pic":{"pic_length":"96","pic_width":"96","pic_summary":"1"},"hot":{"data_hot":"0","data_hot_num":"4","data_hot_txt":"php\u6559\u7a0b,js\u7279\u6548,js\u6559\u7a0b,css\u6559\u7a0b","hot_body_background":"f7f7f7","hot_body_size":"12","hot_body_bold":"0","hot_body_margin":"26","hot_default_color":"222222","hot_default_underline":"0","hot_hover_color":"ff6600","hot_hover_underline":"1","hot_click_color":"222222","hot_click_underline":"0","hot_clicked_color":"222222","hot_clicked_underline":"0"},"txt":{"txt_title_icon":"1","txt_title_txt":"\u731c\u4f60\u559c\u6b22","txt_title":"1","txt_title_size":"14","txt_title_bold":"0","txt_title_margin":"31","txt_title_background":"1","txt_title_bgcolor":"ffffff","txt_title_bgimage":"http:\/\/tui.cnzz.net\/templates\/images\/fix_txt_img\/1\/title.png","txt_title_color":"222222","txt_body_size":"12","txt_body_bold":"0","txt_body_margin":"20","txt_default_color":"222222","txt_hover_color":"ff6600","txt_click_color":"222222","txt_clicked_color":"222222","txt_default_underline":"0","txt_hover_underline":"1","txt_click_underline":"0","txt_clicked_underline":"0","txt_focus":"2"},"locat":{"locat_left_right":"0","locat_float":"2","locat_mark":"5"},"base":{"cloud_id":"10005110","r_name":"\u7231\u5fae\u7f51\u7cbe\u5fc3\u63a8\u8350","r_type":"2","r_style_id":"28","r_style_name":"\u7eff\u8272\u6e05\u65b0\u7ad6\u7248","r_status":"1","data_type":"1","domain":"http:\/\/www.iiwnet.com","yn_host":"0"}};
	tuiFloatRun.set.hot.data_hot_txt = "";
	//列表数据
	tuiFloatRun.data = [{"url":"http:\/\/www.iiwnet.com\/php_base\/849.html","title":"PHP\u5c0f\u5077\u7a0b\u5e8f\u539f\u7406\u548c\u5b9e\u4f8b\u6559\u7a0b","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/100728251551273B71400A720607077068217B40","in_bloom_filter":"true"},{"url":"http:\/\/www.iiwnet.com\/php_base\/1064.html","title":"PHP\u6559\u7a0b: \u652f\u4ed8\u7cfb\u7edf\u7684\u8bbe\u8ba1\u4e0e\u5b9e\u73b0","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/6118175D364D3A404640170E23440B3E455D1B40","in_bloom_filter":"true"},{"url":"http:\/\/www.iiwnet.com\/php_base\/381.html","title":"PHP\u4e2d\u7684\u76ee\u5f55\u904d\u5386\u7ec6\u8bf4\u6559\u7a0b","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/0700521C223803327C0032064D0D651D555B1100","in_bloom_filter":"true"},{"url":"http:\/\/www.iiwnet.com\/php_base\/1084.html","title":"PHP\u5b66\u4e60\u4e4b7\u79cd\u8d85\u5b9e\u7528\u7684PHP\u65b9\u6cd5","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/2A085625162D26424440001C271C07254D242840","in_bloom_filter":"true"},{"url":"http:\/\/www.iiwnet.com\/php_base\/438.html","title":"php\u57fa\u7840\u6559\u7a0b---php\u5185\u7f6e\u51fd\u6570\u5b9e\u4f8b\u6559\u7a0b","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/5748411F5E4305286F40406D100A703059564A40","in_bloom_filter":"true"},{"url":"http:\/\/www.iiwnet.com\/php_base\/386.html","title":"PHP\u6559\u7a0b\u7f51\u8f6c\u8f7d\u58f0\u660e\u901a\u77e5","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/46571B210B3F08462B00024B46274C0D77404900","in_bloom_filter":"true"},{"url":"http:\/\/www.iiwnet.com\/php_base\/692.html","title":"PHP\u900f\u660e\u6c34\u5370\u751f\u6210\u4ee3\u7801","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/62431665287A21712C400C6A572C14657C637700"},{"url":"http:\/\/www.iiwnet.com\/php_base\/512.html","title":"PHP\u5b9e\u4f8b\u6559\u7a0b-PHP\u8bb8\u613f\u5899\u7a0b\u5e8f\u5236\u4f5c\u6559\u7a0b","algId":"1","thumbnail":"http:\/\/storage.aliyun.com\/recimg\/030D072C1B3322762C406F041C5B1B542D2A1240"}];
	//图片loading
	tuiFloatRun.imgLoad = "http://tui.cnzz.net/templates/images/loading.gif";
	//错误图片
	tuiFloatRun.errorDir = "http://tui.cnzz.net/templates/images/error/error_";
	tuiFloatRun.errorNum = 35;
	//logo 点击地址
	tuiFloatRun.tuiUrl = "http://tui.cnzz.com";
	//统计地址
	tuiFloatRun.tongjiUrl = "http://log.so.cnzz.net/stat.gif?";
	//搜索地址
	tuiFloatRun.searchUrl = "http://s.cnzz.net/";
	//图片路径
	tuiFloatRun.imgDir = "http://tui.cnzz.net/templates/images/";
	//公用方法
	function Sys(){
		var Sys={};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		return Sys;
	};
	function addEvent(Elem, type, handle) {
		if (Elem.addEventListener) {
			Elem.addEventListener(type, handle, false);
		} else if (Elem.attachEvent) {
			Elem.attachEvent("on" + type, handle);
		};
	};
	function getElemPos(obj) {
		var pos = {
			"top" : 0,
			"left" : 0
		};
		if (obj.offsetParent) {
			while (obj.offsetParent) {
				pos.top += obj.offsetTop;
				pos.left += obj.offsetLeft;
				obj = obj.offsetParent;
			}
		} else if (obj.x) {
			pos.left += obj.x;
		} else if (obj.x) {
			pos.top += obj.y;
		}
		return {
			x : pos.left,
			y : pos.top
		};
	};
	
	if (tuiFloatRun["set"]["locat"]["locat_left_right"]==0 || tuiFloatRun["set"]["locat"]["locat_left_right"]==2) {
		tuiFloatRun.ft = "pop_l";
	} else {
		tuiFloatRun.ft = "pop_r";
	};
	
	tuiFloatRun.request = {
		"common" : tuiFloatRun.tongjiUrl+"&ip=10.135.251.147&pui=czb&cok=0350e3d6ab308ea2a98d22d8fdd6d85d&vr=1&aid=1000001827&sid=iiwnet.com&img=" + tuiFloatRun["set"]["base"]["data_type"] + "&so=t&ft=" + tuiFloatRun.ft,
		"sid" : "iiwnet.com",
		"aid" : "1000001827",
		"hid" : "cd3d8a7e783e2812ee858c68b6f27a53",
		"bkt" : "0",
		"so" : "t"
	};
	
	function questImg(url) {
		var Img=new Image();
		var d=new Date();
		Img.onload = Img.onabort = Img.onerror= function(){
			Img=null;
		};
		Img.src = tuiFloatRun.request.common + url + "&"+ encodeURIComponent(String.fromCharCode(1)) + "&oref=" + encodeURIComponent(document.referrer) + "&purl=" + encodeURIComponent(window.location.href) +"&_rnd=" + (Date.parse(d) + "." + d.getMilliseconds());
	};
	function checkData() {
		var t = 0;		//总数
		var dt = 0;		//总需
		var r = false;	//结果
		var n = 0.6;	//良品率
		var set = tuiFloatRun.set;
		if (set.base.data_type == 0) {
			dt = Number(set.style.style_txt_col) * Number(set.style.style_txt_row);
		}else if (set.base.data_type == 2) {
			dt = Number(set.style.style_pic_col) * Number(set.style.style_pic_row);
		}else {
			dt = Number(set.style.style_pic_col) * Number(set.style.style_pic_row) + Number(set.style.style_txt_col) * Number(set.style.style_txt_row);
		};
		//计算总需
		if (tuiFloatRun.data.length < dt * n){
			return false;
		}else {
			//计算良好数据
			for (var i=0;i<tuiFloatRun.data.length;i++) {
				if (tuiFloatRun.data[i].title) {
					t++;
				};
			};
			var l = t / dt;
			l < n ? r = false : r = true;
			return r;
		};
	};
	//*********************************
	if (!tuiFloatRun.demo) {
		//运行之
		if (tuiFloatRun.data && tuiFloatRun.data[0]) {
			if (checkData()) {
				tuiFloatRun.init();
			}else {
				var url =  "&" + encodeURIComponent(String.fromCharCode(1)) + "&has=false&ch=wprdsp&l=view&good=false";
				questImg(url)
			};
		} else {
			var url =  "&" + encodeURIComponent(String.fromCharCode(1)) + "&has=false&ch=wprdsp&l=view";
			questImg(url)
		};
	};
	//*********demo***************************
})();