/* Copyright (c) 2010 Baidu */
var baidu=baidu||{version:"1-1-1"};baidu.guid="$BAIDU$";window[baidu.guid]=window[baidu.guid]||{};baidu.ui=baidu.ui||{get:function(a){var b;
while((a=a.parentNode)!=document.body){if(b=baidu.dom.getAttr(a,"data-tguid")){return baidu.lang.instance(b)}}}};baidu.ui.dialog=baidu.ui.dialog||{instances:{}};
(function(){var a={id:"",getId:function(b){var d=this,c;c="tangram-"+d.uiType+"--"+(d.id?d.id:d.guid);return b?c+b:c},getClass:function(c){var f=this,e=f.uiType.toLowerCase(),d=f.classPrefix||"tangram-"+e,b=f.skin;
if(c){d+="-"+c;b+="-"+c}if(f.skin){d+=" "+b}return d},mainId:"",getMain:function(){return baidu.g(this.mainId)},getBody:function(){return baidu.g(this.getId())
},uiType:"",addons:[],getCallRef:function(){return"window[baidu.guid]._instances['"+this.guid+"']"},getCallString:function(e){var d=0,c=Array.prototype.slice.call(arguments,1),b=c.length;
for(;d<b;d++){if(typeof c[d]=="string"){c[d]="'"+c[d]+"'"}}return this.getCallRef()+"."+e+"("+c.join(",")+");"},addBehavior:function(b,c){return baidu.ui.behavior[b](this,c)
},renderMain:function(c){var e=this,d=0,b;if(e.getMain()){return}c=baidu.g(c);if(!c){c=document.createElement("div");document.body.appendChild(c);
c.style.position="absolute";c.className=e.getClass("main")}if(!c.id){c.id=e.getId("main")}e.mainId=c.id;c.setAttribute("data-guid",e.guid);
if(e.decorator){for(b=e.decorator.length;d<b;d++){baidu.ui.decorator[e.decorator[d]](this)}}return c}};baidu.ui.UIBase=a;
baidu.ui.create=function(d,k){k=k||{};var h=k.superClass||baidu.lang.Class,e,c,j=function(i){i=i||{};h.call(this,i.superClass?i:(i.guid?i.guid:""));
baidu.object.extend(this,j.options);baidu.object.extend(this,i);d.apply(this,arguments);for(e=0,c=j.addons.length;e<c;e++){j.addons[e](this)
}};var b=function(){},g=d.prototype;b.prototype=h.prototype;var f=j.prototype=new b();for(var e in g){f[e]=g[e]}typeof k.className=="string"&&(f._className=k.className);
f.constructor=g.constructor;for(e in a){f[e]=a[e]}j.extend=function(m){for(var l in m){j.prototype[l]=m[l]}return j};j.addons=[];
j.register=function(i){if(typeof i=="function"){j.addons.push(i)}};j.options={};return j}})();baidu.ui.dialog.Dialog=baidu.ui.create(function(a){}).extend({uiType:"DIALOG",width:"",height:"",top:"auto",left:"auto",zIndex:1000,titleText:"",contentText:"",onbeforeclose:function(){return true
},tplDOM:"<div id='#{id}' class='#{class}'>#{title}#{content}#{footer}</div>",tplTitle:"<div id='#{id}' class='#{class}'><span id='#{inner-id}' class='#{inner-class}'>#{content}</span></div>",tplContent:"<div id='#{id}' class='#{class}'>#{content}</div>",tplFooter:"<div id='#{id}' class='#{class}'></div>",isShown:function(){return baidu.ui.dialog.instances[this.guid]=="show"
},getString:function(){var b=this,a,e="title",d="title-inner",c="content",f="footer";return baidu.format(b.tplDOM,{id:b.getId(),"class":b.getClass(),title:baidu.format(b.tplTitle,{id:b.getId(e),"class":b.getClass(e),"inner-id":b.getId(d),"inner-class":b.getClass(d),content:b.titleText}),content:baidu.format(b.tplContent,{id:b.getId(c),"class":b.getClass(c),content:b.contentText}),footer:baidu.format(b.tplFooter,{id:b.getId(f),"class":b.getClass(f)})})
},render:function(){var b=this,a;if(b.getMain()){return}a=b.renderMain();a.innerHTML=b.getString();b.update(b);baidu.dom.setStyles(b.getMain(),{position:"absolute",zIndex:this.zIndex,marginLeft:"-100000px"});
b.windowResizeHandler=b.getWindowResizeHandler();baidu.on(window,"resize",b.windowResizeHandler);b.dispatchEvent("onload");
return a},getWindowResizeHandler:function(){var a=this;return function(){a.update()}},open:function(a){var b=this;b.update(a);
b.getMain().style.marginLeft="auto";baidu.ui.dialog.instances[b.guid]="show";b.dispatchEvent("onopen")},close:function(){var a=this;
if(a.dispatchEvent("onbeforeclose")){a.getMain().style.marginLeft="-100000px";baidu.ui.dialog.instances[a.guid]="hide";a.dispatchEvent("onclose")
}},update:function(b){b=b||{};var c=this,a=c.getContent();baidu.object.extend(c,b);if(b.content){if(a.firstChild!=b.content){a.innerHTML="";
a.appendChild(b.content)}}else{if(b.contentText){a.innerHTML=b.contentText}}if(b.titleText){c.getTitleInner("title-inner").innerHTML=b.titleText
}c._updatePosition();c.dispatchEvent("onupdate")},_updatePosition:function(){var c=this,e="",b="",a="",d="";baidu.dom.setStyles(c.getContent(),{width:c.width,height:c.height});
if((c.left&&c.left!="auto")||(c.right&&c.right!="auto")){d=c.left||"";b=c.right||""}else{d=Math.max((baidu.page.getViewWidth()-parseInt(c.getMain().offsetWidth))/2+baidu.page.getScrollLeft(),0)
}if((c.top&&c.top!="auto")||(c.button&&c.button!="auto")){e=c.top||"";a=c.bottom||""}else{e=Math.max((baidu.page.getViewHeight()-parseInt(c.getMain().offsetHeight))/2+baidu.page.getScrollTop(),0)
}baidu.dom.setStyles(c.getMain(),{top:e,right:b,bottom:a,left:d})},getTitle:function(){return baidu.g(this.getId("title"))
},getTitleInner:function(){return baidu.g(this.getId("title-inner"))},getContent:function(){return baidu.g(this.getId("content"))
},getFooter:function(){return baidu.g(this.getId("footer"))},dispose:function(){var a=this;delete baidu.ui.dialog.instances[a.guid];
a.dispatchEvent("dispose");baidu.un(window,"resize",a.windowResizeHandler);baidu.dom.remove(a.getMain());baidu.lang.Class.prototype.dispose.call(a)
}});baidu.ui.dialog.login=function(options){options=options||{};options=baidu.extend({titleText:"登录",loginURL:"http://passport.rdtest.baidu.com/api/?login&time=&token=&tpl=pp",regURL:"http://passport.rdtest.baidu.com/api/?reg&time=&token=&tpl=pp",jumpURL:window.location.href,onLoginSuccess:function(obj,json){},onLoginFailure:function(obj,json){},onRegisterSuccess:function(obj,json){},onRegisterFailure:function(obj,json){},loginContainerId:"loginContainer",regContainerId:"regContainer",loginPanelId:"loginPanel",regPanelId:"regPanel",tabId:"navTab",currentTabClass:"act",tplLoginContent:'		<div id="nav" class="passport-nav">            <ul id="#{tabId}" class="passport-nav-tab">                <li class="#{currentTabClass}" ><a href="##{idLoginPanel}" onclick="#{clickTabLogin};return false;" hidefocus="true" >登录</a></li>                <li><a href="##{idRegPanel}" onclick="#{clickTabReg};return false;" hidefocus="true" >注册</a></li>            </ul>            <p class="clear"></p>        </div>        <div id="content" class="passport-content">            <div id="#{idLoginPanel}" class="passport-login-panel">	            <div id="#{idLoginContainer}"></div>	            <div id="regDiv">                    <hr size="0" style="border-top:1px solid #AAAAAA">                    <div class="reg">没有百度账号？<a href="##{idRegPanel}" onclick="#{clickTabReg};return false;">立即注册百度账号</a></div>                </div>            </div>            <div id="#{idRegPanel}" class="passport-reg-panel" style="display:none">                <div id="#{idRegContainer}" class="passport-reg-container"></div>            </div>        </div>'},options);
options.changeTab=options.changeTab||function(type){var panelIds=[options.loginPanelId,options.regPanelId],tabs=baidu.dom.children(options.tabId),className=options.currentTabClass,curIndex=type=="login"?0:1;
for(var i=0;i<panelIds.length;++i){baidu.dom.removeClass(tabs[i],className);baidu.g(panelIds[i]).style.display="none"}baidu.dom.addClass(tabs[curIndex],className);
baidu.g(panelIds[curIndex]).style.display="";if(type=="reg"){this.renderReg()}};var dialogInstance=new baidu.ui.dialog.Dialog(options);
dialogInstance.render();dialogInstance.update({contentText:options.contentText||baidu.string.format(options.tplLoginContent,{clickTabLogin:dialogInstance.getCallRef()+".changeTab('login')",clickTabReg:dialogInstance.getCallRef()+".changeTab('reg')",idLoginContainer:options.loginContainerId,idRegContainer:options.regContainerId,idLoginPanel:options.loginPanelId,idRegPanel:options.regPanelId,tabId:options.tabId,currentTabClass:options.currentTabClass})});
baidu.extend(dialogInstance,{open:function(){this.renderLogin()},close:function(){var me=this;me.loginJson=me.regJson=null;
baidu.ui.dialog.Dialog.prototype.close.call(me)},renderLogin:function(){var me=this;if(me.loginJson){return}baidu.sio.callByServer(me.loginURL,function(value){var json=me.loginJson=eval(value);
baidu.sio.callByBrowser(json.jslink,function(value){baidu.ui.dialog.Dialog.prototype.open.call(me);dialogInstance.loginDom=bdPass.LoginTemplate.render(json,options.loginContainerId,{renderSafeflg:true,onSuccess:options.onLoginSuccess,jumpUrl:options.jumpURL,onFailure:options.onLoginFailure});
dialogInstance.update()})})},renderReg:function(){var me=this;if(me.regJson){return}baidu.sio.callByServer(me.regURL,function(value){var json=me.regJson=eval(value);
baidu.sio.callByBrowser(json.jslink,function(value){baidu.ui.dialog.Dialog.prototype.open.call(me);dialogInstance.registerDom=bdPass.RegTemplate.render(json,options.regContainerId,{renderSafeflg:true,onSuccess:options.onRegisterSuccess,jumpUrl:options.jumpURL,onFailure:options.onRegisterFailure});
dialogInstance.update()})})}});return dialogInstance};baidu.ui.dialog.Dialog.prototype.closeOnEscape=true;baidu.ui.dialog.Dialog.register(function(a){function b(f){f=window.event||f;
var d=f.keyCode||f.which,g,c;if(d==27){baidu.object.each(baidu.ui.dialog.instances,function(h,e){if(h=="show"){c=baidu.lang.instance(e);
if(!g||c.zIndex>g.zIndex){g=c}}});if(g){g.close()}}}if(a.closeOnEscape){if(!baidu.ui.dialog.keyboardEventReady){baidu.on(document,"keyup",b);
baidu.ui.dialog.keyboardEventReady=true;a.addEventListener("ondispose",function(){var c=true;baidu.object.each(baidu.ui.dialog.instances,function(e,d){c=false
});if(c){baidu.event.un(document,"keyup",b);baidu.ui.dialog.keyboardEventReady=false}})}}});baidu.object.extend(baidu.ui.dialog.Dialog.prototype,{draggable:true,ondragstart:new Function,ondrag:new Function,ondragend:new Function});
baidu.ui.dialog.Dialog.register(function(b){function a(){b.dragOption.range[1]=baidu.page.getWidth();b.dragOption.range[2]=baidu.page.getHeight()
}b.addEventListener("onload",function(){var c=this;c.dragOption={handler:c.getTitle(),range:[0,baidu.page.getWidth(),baidu.page.getHeight(),0],ondragend:function(){c.ondragend();
c.left=baidu.dom.getStyle(c.getMain(),"left");c.top=baidu.dom.getStyle(c.getMain(),"top")},ondragstart:c.ondragstart,ondrag:c.ondrag};
if(c.draggable){baidu.dom.draggable(c.getMain(),c.dragOption)}baidu.on(window,"resize",a)});b.addEventListener("ondispose",function(){baidu.un(window,"resize",a);
baidu.un(b.getTitle(),"mousedown")})});baidu.ui.get=function(a){var b;if(baidu.lang.isString(a)){return baidu.lang.instance(a)
}else{while((a=a.parentNode)!=document.body){if(a.nodeType==9){return null}if(b=baidu.dom.getAttr(a,"data-guid")){return baidu.lang.instance(b)
}}}};baidu.ui.smartPosition=baidu.ui.smartPosition||{};baidu.ui.smartPosition.setBorderBoxStyles=function(c,d){var e=["marginTop","marginLeft","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth","paddingLeft","paddingRight","paddingTop","paddingBottom"],a={},b=e.length-1;
for(;b>=0;b--){a[e[b]]=parseFloat(baidu.getStyle(c,e[b]))||0}if(d.top){d.top-=a.marginTop}if(d.left){d.left-=a.marginLeft
}if(document.compatMode!="BackCompat"){if(d.width){d.width-=a.paddingLeft+a.paddingRight+a.borderLeftWidth+a.borderRightWidth
}if(d.height){d.height-=a.paddingTop+a.paddingBottom+a.borderTopWidth+a.borderBottomWidth}}return baidu.dom.setStyles(c,d)
};baidu.ui.smartPosition.SmartPosition=baidu.ui.create(function(a){var b=this;if(!this.once){baidu.event.on(baidu.dom.getWindow(b.source),"resize",function(){b.update()
})}}).extend({position:"bottomRight",update:function(c,h){var g=this,f={},d=baidu.page.getViewHeight(),a=baidu.page.getViewWidth(),b=g.source.offsetWidth,e=g.source.offsetHeight;
baidu.object.extend(this,c||{});g.position=g.position.toLowerCase();g.coordinate.x=g.coordinate[0]||g.coordinate.x||g.coordinate.left||0;
g.coordinate.y=g.coordinate[1]||g.coordinate.y||g.coordinate.top||0;g.dispatchEvent("onbeforeupdate");f.left=g.coordinate.x-(g.position.indexOf("left")>=0?b:0);
f.top=g.coordinate.y-(g.position.indexOf("top")>=0?e:0);if(g.insideScreen){f.left=Math.max(0-parseFloat(baidu.dom.getStyle(g.source,"marginLeft"))||0,Math.min(f.left,baidu.page.getViewWidth()-b));
f.top=Math.max(0-parseFloat(baidu.dom.getStyle(g.source,"marginTop"))||0,Math.min(f.top,baidu.page.getViewHeight()-e))}baidu.ui.smartPosition.setBorderBoxStyles(g.source,f);
if(!h&&(d!=baidu.page.getViewHeight()||a!=baidu.page.getViewWidth())){g.update({},true)}if(!h){g.dispatchEvent("onupdate")
}}});baidu.ui.smartPosition.set=function(b,d,a){a=a||{};a.source=baidu.g(b);a.coordinate=d||[0,0];var c=new baidu.ui.smartPosition.SmartPosition(a);
c.update();return c};(function(){var d="data-tangram-smartcover-previousVisibility";function c(k){var o=[],n=k.length-1,m,l;
for(;n>=0;n--){l=document.getElementsByTagName(k[n]);for(m=l.length-1;m>=0;m--){if(l[m]){o.push(l[m])}}}return o}function a(r,u){var s=[],o={};
baidu.object.extend(o,e.options);baidu.object.extend(o,u||{});o.hideFlash&&s.push("object");o.hideSelect&&s.push("select");
var k=c(s),p=k.length,m,n,l=r.getMain(),q=baidu.dom.getPosition(l),j=r.getId(),t=e.iframes[j];if(baidu.ie&&!o.hideSelect){if(!t){t=e.iframes[j]=document.createElement("IFRAME");
        r.getMain().appendChild(t);t.style.display="none"}t.src="javascript:void(0)";t.className='smart-cover-iframe';baidu.dom.setStyles(t,{zIndex:-1,display:"block",border:"none",position:"absolute",width:l.offsetWidth,height:l.offsetHeight,top:0,left:0})
}if(!k){return}for(n=0;n<p;n++){m=k[n];if(baidu.ui.get(m)!=r){f(m,r.guid)}}}function h(j){if(baidu.ie){var i=j.getMain(),k=j.getId();
if(!e.iframes[k]){return}baidu.dom.setStyles(e.iframes[k],{width:i.offsetWidth,height:i.offsetHeight})}}function b(n){var o=c(["object","select"]),j=o.length,m,l,k=e.iframes[n.getId()];
if(baidu.ie&&k){k.style.display="none"}if(!o){return}for(l=0;l<j;l++){m=o[l];if(baidu.ui.get(m)!=n){g(m,n.guid)}}}function f(k,i){var j=d+i;
if((k.hasAttribute&&!k.hasAttribute(j))||!(j in k.attributes)){k.setAttribute(j,k.style.visibility);k.style.visibility="hidden"
}}function g(k,i){var j=d+i;if((k.hasAttribute&&k.hasAttribute(j))||(j in k.attributes)){k.style.visibility=k.getAttribute(j);
k.removeAttribute(j)}}var e={show:a,hide:b,update:h,iframes:[],options:{hideSelect:false,hideFlash:true}};baidu.ui.smartCover=baidu.ui.smartCover||e
})();baidu.ui.dialog.Dialog.register(function(a){a.addEventListener("onopen",function(){baidu.ui.smartCover.show(this)});
a.addEventListener("onclose",function(){baidu.ui.smartCover.hide(this)});a.addEventListener("onupdate",function(){baidu.ui.smartCover.update(this)
})});baidu.ui.dialog.Dialog.extend({okText:"确定",ok:function(){if(this.dispatchEvent("ok")){this.close()}},tplAlert:"<div id='#{id}' class='#{class}' onclick=#{onclick}>#{content}</div>"});
baidu.ui.dialog.Dialog.register(function(a){a.addEventListener("onload",function(){var d=this,c="ok",e="dispatchEvent";function b(f){return baidu.format(d.tplAlert,{id:d.getId(f),"class":d.getClass(f),onclick:d.getCallString(f),content:d[f+"Text"]})
}if(d.type=="alert"){baidu.dom.insertHTML(d.getId("footer"),"beforeEnd",b(c))}})});baidu.ui.dialog.alert=function(b,a){a=a||{};
a.type="alert";if(baidu.isString(b)){a.contentText=b}else{a.content=b}var c=new baidu.ui.dialog.Dialog(a);if(typeof a.autoDispose=="undefined"||a.autoDispose){c.addEventListener("onclose",function(){this.dispose()
})}c.render();if(typeof a.autoOpen=="undefined"||a.autoOpen){c.open()}return c};baidu.ui.dialog.iframe=function(d,a){a=a||{};
var b=new baidu.ui.dialog.Dialog(a),c="iframe";b.contentText=baidu.format(b.tplIframe,d,b.getId(c),b.getClass(c),b.iframeName?b.iframeName:b.getId(c));
b.render();b.getContent().firstChild.src=b.getContent().firstChild.src;b.open();return b};baidu.ui.dialog.Dialog.extend({tplIframe:"<iframe style='zoom:1' width='100%' height='100%' frameborder='0' scrolling='no' src='#{0}' name='#{3}' id='#{1}' class='#{2}'></iframe>"});
baidu.ui.dialog.Dialog.extend({acceptText:"确定",cancelText:"取消",onaccept:function(){},oncancel:function(){},accept:function(){if(this.dispatchEvent("onaccept")){this.close()
}},cancel:function(){if(this.dispatchEvent("oncancel")){this.close()}},tplConfirm:"<div id='#{id}' class='#{class}' onclick=#{onclick}>#{content}</div>"});
baidu.ui.dialog.Dialog.register(function(a){a.addEventListener("onload",function(){var d=this,c="accept",e="cancel",f="dispatchEvent";
function b(g){return baidu.format(d.tplConfirm,{id:d.getId(g),"class":d.getClass(g),onclick:d.getCallString(g),content:d[g+"Text"]})
}if(d.type=="confirm"){baidu.dom.insertHTML(d.getId("footer"),"beforeEnd",b(c)+b(e))}})});baidu.ui.dialog.confirm=function(b,a){a=a||{};
a.type="confirm";if(baidu.isString(b)){a.contentText=b}else{a.content=b}var c=new baidu.ui.dialog.Dialog(a);if(typeof a.autoDispose=="undefined"||a.autoDispose){c.addEventListener("onclose",function(){this.dispose()
})}c.render();if(typeof a.autoOpen=="undefined"||a.autoOpen){c.open()}return c};baidu.ui.modal=baidu.ui.modal||{mainId:null,showing:[],instances:{}};
baidu.ui.modal.Modal=baidu.ui.create(function(a){}).extend({uiType:"MODAL",color:"#000000",opacity:0.6,zIndex:1000,tplDOM:"<div id='#{id}' class='#{class}'></div>",getString:function(){var a=this;
return baidu.format(a.tplDOM,{id:a.getId(),"class":a.getClass()})},render:function(){var c=this,b={width:"100%",height:"100%",left:0,top:0,display:"none"},a;
if(baidu.ui.modal.mainId){c.mainId=baidu.ui.modal.mainId;return}a=c.renderMain();if(baidu.browser.ie&&baidu.browser.ie<=6||document.compatMode=="BackCompat"){b={width:baidu.page.getViewWidth(),height:baidu.page.getViewHeight(),left:baidu.page.getScrollLeft(),top:baidu.page.getScrollTop(),position:"absolute",display:"none"};
if(!c._alreadyBindEvent){baidu.on(window,"resize",function(d){a.style.width=baidu.page.getViewWidth();a.style.height=baidu.page.getViewHeight()
});baidu.on(window,"scroll",function(d){a.style.left=baidu.page.getScrollLeft()+"px";a.style.top=baidu.page.getScrollTop()+"px"
});c._alreadyBindEvent=true}}baidu.dom.setStyles(a,b);baidu.ui.modal.mainId=c.mainId},update:function(b){b=b||{};var c=this,a=c.getMain();
a.innerHTML=c.getString();a.setAttribute("data-guid",c.guid);baidu.object.extend(c,b);baidu.dom.setStyles(c.getMain(),{opacity:c.opacity,"background-color":c.color,"z-index":c.zIndex})
},show:function(b){var c=this,a=this.getMain(),d=baidu.ui.modal.instances;if(d[c.guid]!="show"){baidu.ui.modal.showing.push(this);
d[c.guid]="show"}c.update(b);a.style.display="block";if((!baidu.browser.ie||baidu.browser.ie>=7)&&document.compatMode!="BackCompat"){a.style.position="fixed"
}if(c.targetUI){baidu.ui.smartCover.show(c.targetUI,baidu.ie?{hideSelect:true}:{})}},hide:function(){var b=this,a=baidu.ui.modal.showing;
a.pop();baidu.ui.modal.instances[b.guid]="hide";if(!b.getBody()){return}b.getMain().style.display="none";if(b.targetUI){baidu.ui.smartCover.hide(b.targetUI)
}if(a[0]){a[0].show()}},getBody:function(){return baidu.g(this.getId())}});baidu.ui.modal.create=function(a){a=a||{};var b=new baidu.ui.modal.Modal(a);
b.render();return b};baidu.object.extend(baidu.ui.dialog.Dialog.prototype,{modal:true,modalColor:"#000000",modalOpacity:0.4});
baidu.ui.dialog.Dialog.register(function(a){a.addEventListener("onopen",function(){var c=this;if(c.modal&&!c.modalInstance){c.modalInstance=baidu.ui.modal.create({targetUI:c,color:c.modalColor,opacity:c.modalOpacity,zIndex:c.modalZIndex?c.modalZIndex:c.zIndex-1});
c.modalInstance.show()}});function b(){if(a.modal&&a.modalInstance){a.modalInstance.hide()}}a.addEventListener("onclose",b);
a.addEventListener("ondispose",b)});baidu.ui.dialog.create=function(a){var b=new baidu.ui.dialog.Dialog(a);b.render();return b
};baidu.ui.button=baidu.ui.button||{};baidu.ui.button.Button=baidu.ui.create(new Function).extend({uiType:"BUTTON",tplBody:'<div id="#{id}" class="#{class}" onmouseover="#{onmouseover}" onmousedown="#{onmousedown}" onmouseup="#{onmouseup}" onmouseout="#{onmouseout}">#{content}</div>',disabled:false,getString:function(){var a=this;
return baidu.format(a.tplBody,{id:a.getId(),onmouseover:a.getCallString("_onMouseOver"),onmousedown:a.getCallString("_onMouseDown"),onmouseup:a.getCallString("_onMouseUp"),onmouseout:a.getCallString("_onMouseOut"),content:a.content,"class":a.getClass(a.isDisabled()?"disable":"")})
},render:function(b){var a=this;baidu.dom.insertHTML(a.renderMain(b),"beforeEnd",a.getString())},_onMouseOver:function(){var a=this;
if(a.isDisabled()){return}a._changeStyle("hover");a.dispatchEvent("onmouseover")},_onMouseDown:function(){var a=this;if(a.isDisabled()){return
}a._changeStyle("press");a.dispatchEvent("onmousedown")},_onMouseUp:function(){var a=this;if(a.isDisabled()){return}a._changeStyle();
a.dispatchEvent("onmouseup")},_onMouseOut:function(){var a=this;if(a.isDisabled()){return}a._changeStyle();a.dispatchEvent("onmouseout")
},_changeStyle:function(c){var b=this,a=b.getBody();baidu.dom.removeClass(a,b.getClass("hover")+" "+b.getClass("press")+" "+b.getClass("disable"));
baidu.addClass(a,b.getClass(c))},isDisabled:function(){return this.disabled},enable:function(){var a=this;a._changeStyle();
a.disabled=false;a.dispatchEvent("onenable")},disable:function(){var a=this;a._changeStyle("disable");a.disabled=true;a.dispatchEvent("ondisable")
},dispose:function(){var a=this;baidu.dom.remove(a.getBody());baidu.lang.Class.prototype.dispose.call(a)}});baidu.ui.dialog.Dialog.prototype.closeText="";
baidu.ui.dialog.Dialog.register(function(a){a.addEventListener("onload",function(){var c=this,b=new baidu.ui.button.Button({classPrefix:c.getClass("close")});
c.buttonInstance=b;b.onmousedown=function(){c.close()};b.render(c.getTitle())})});
