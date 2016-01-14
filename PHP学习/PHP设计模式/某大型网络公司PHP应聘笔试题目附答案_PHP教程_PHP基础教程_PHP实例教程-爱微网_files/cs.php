(function () {
	var doc = document,
	win = window,
	nav = navigator,
	loc = location,
	funcs = function () {};
	funcs.prototype = {
		run	 : function(){
			this.init();
		},
		init : function () {
			var client_referer = doc.referrer,
			keyword = "",
			url = this.settings.host,
			surl = window.location.href;
			if(!!surl){
				url = url + "&surl="+encodeURIComponent(surl);
			}
			if (!!client_referer) {
				keyword = this.getkeyword(client_referer);
				url = url + "&keyword=" + keyword;
			}
			if (doc.title) {
				url = url + "&title=" + encodeURIComponent(doc.title);
			}
			doc.write('<div id="aliyun_cnzz_tui_'+this.settings.id+'" style="display:block;float:none;border:0 none;background:none;opacity:1;filter:alpha(opacity=100);margin:0;padding:0;visibility:visible;overflow:visible;*zoom:1;position:relative;"></div>');
			this.loadScript(url);
		},
		getQueryString : function (name, urls) {
			var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
			if (reg.test(urls))
				return RegExp.$2.replace(/\+/g, " ");
			return "";
		},
		getkeyword : function (referer) {
			var keyword = "";
			keyword = this.getQueryString("wd", referer);
			if (keyword == "") {
				keyword = this.getQueryString("q", referer);
			}
			if (keyword == "") {
				keyword = this.getQueryString("word", referer);
			}
			if (keyword == "") {
				keyword = this.getQueryString("query", referer);
			}
			if (keyword == "") {
				keyword = this.getQueryString("search", referer);
			}
			if (keyword == "") {
				keyword = this.getQueryString("keyword", referer);
			}
			if (keyword == "") {
				keyword = this.getQueryString("kw", referer);
			}
			if (keyword == "") {
				keyword = this.getQueryString("w", referer);
			}
			if (keyword) {
				keyword = encodeURIComponent(keyword);
			}
			return keyword;
		},
		addEvent : function (Elem, type, handle) {
			if (Elem.addEventListener) {
				Elem.addEventListener(type, handle, false);
			} else if (Elem.attachEvent) {
				Elem.attachEvent("on" + type, handle);
			};
		},
		loadScript : function (url) {
			var dtime = new Date().getMilliseconds(),
			rtime = +new Date + "" + dtime;
			url = url + "&ts=" + rtime;
			if(document.body){
				var s = document.createElement("script");
				s.charset = "utf-8";
				s.async = !0;
				s.src = url;
				document.body.insertBefore(s, document.body.firstChild);	
			}else {
				this.addEvent(window,"load",function(){
					var s = document.createElement("script");
					s.charset = "utf-8";
					s.async = !0;
					s.src = url;
					document.body.insertBefore(s, document.body.firstChild);
				});
			}
		}
	};
	var doit = new funcs();
	doit.settings = {
		"host":"http://tui.cnzz.net/api.php?id=1000001827",
		"id":"1000001827"
	};
	doit.run();
})();
(function () {
	if (typeof(aliyun_recommend_opts) == "object") {
		var key = [];
		for (var i in aliyun_recommend_opts) {
			key.push(i)
		};
		var img = new Image();
		var d = new Date();
		img.onload = function () {
			img = null;
		};
		img.onerror = function () {
			img = null;
		};
		var Src = "http://rc.so.cnzz.net/stat.gif?url=" + encodeURIComponent(window.location.href) + "&ts=" + d;
		for (var i = 0; i < key.length; i++) {
			if (aliyun_recommend_opts[key[i]]) {
				Src += "&" + key[i] + "=" + encodeURIComponent(aliyun_recommend_opts[key[i]]);
			};
		};
		if (key[0]) {
			aliyun_recommend_opts = ""
				img.src = Src;
		}
	};
})();