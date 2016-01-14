
declare(function () {
    return {
        name: 'CookieSync',
        namespace: 'Cpro.BusinessLogic',
        sync: function () {
            var cookie = using("Cpro.Utility.Cookie");
            var log = using("Cpro.Utility.Log");
            var baiduId = cookie.getCookie("BAIDUID");
            var cproId = cookie.getCookie("CPROID");
            var isUserSend = cookie.getCookie("ISUS");
            var isUserSendBid = cookie.getCookie("ISBID");
            var isNeedSend = false;
            var isNeedSendBid = false;
            var currentTimeStamp = (new Date()).getTime();

            //sync baiduid and cproid
            if (!cproId && baiduId) {
                var sendUrl = "http://cpro.baidustatic.com/sync.htm?cproid=" + encodeURIComponent(baiduId);
                log.sendByIframe(sendUrl);
            }

            //sync cproid with others 
            if (cproId && !isUserSend) {
                isNeedSend = true;
            }
            else if (cproId && isUserSend && cproId !== isUserSend) {
                //如果cproId有变化, 则需要同步
                isNeedSend = true;
            }

            if (baiduId && !isUserSendBid) {
                isNeedSendBid = true;
            }
            else if (baiduId && isUserSendBid && baiduId !== isUserSendBid) {
                //如果baiduId有变化, 则需要同步
                isNeedSendBid = true;
            }
            if (isNeedSend || isNeedSendBid) {
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + 86400000);
                cookie.setCookie("ISBID", baiduId || "1", {
                    path: "/",
                    expires: expireDate
                });
                cookie.setCookie("ISUS", cproId || "1", {
                    path: "/",
                    expires: expireDate
                });
                if (cproId && baiduId) {
                    var urlCproId = cproId;
                    var cproIdIndex = cproId.indexOf(":");
                    if (cproIdIndex && cproIdIndex > 0) {
                        urlCproId = cproId.substring(0, cproIdIndex);
                    }
                    log.sendByIframe("http://s.cpro.baidu.com/s.htm?cproid=" + urlCproId + "&t=" + currentTimeStamp);
                }
                if (cproId) {
                    log.sendByIframe("http://weibo.com/aj/static/sync.html?t=" + currentTimeStamp);
                    log.sendByIframe("http://pos.baidu.com/sync_pos.htm?cproid="+encodeURIComponent(cproId)+"&t=" + currentTimeStamp);
                    var urlCproId = cproId;
                    var cproIdIndex = cproId.indexOf(":");
                    if (cproIdIndex && cproIdIndex > 0) {
                        urlCproId = cproId.substring(0, cproIdIndex);
                    }
                    log.sendByIframe("http://bd.tst.35go.net/bd/t.html?bid=" + urlCproId + "&t=" + currentTimeStamp);
                }
            }

        }
    }
});

declare(function () {
    /**
    渲染引擎
    @class DataEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: 'AlignEngine',
        namespace: 'Cpro.Template',
        paint: function (option) {
            var slotData = option.slotData;
            var layoutObj = option.layoutObj;
            var layoutIndex = layoutObj.layoutIndex;
            var data = option.data;
            var dataTypeMapping = {
                image: "image",
                res: "image",
                curl: "link"
            }
            var idPrefix = slotData.idPrefix || "";


            if (option.containerVerticalAlign === "center") {
                var containerDom = document.getElementById(idPrefix + "container");
                if (containerDom) {
                    var containerOldWidth = containerDom.offsetWidth;
                    var containerOldHeight = containerDom.offsetHeight;

                    for (var i = 0, count = data.length; i < count; i++) {
                        var itemDom = document.getElementById(idPrefix + "item" + i);
                        if (itemDom) {
                            itemDom.style.height = "";
                        }
                    }
                }
            }


            for (var i = 0, count = data.length; i < count; i++) {
                var itemDom = document.getElementById(idPrefix + "item" + i);
                if (itemDom) {
                    var itemOldWidth = itemDom.offsetWidth;
                    var itemOldHeight = itemDom.offsetHeight;

                    if (option.itemTextAlign === "center") {}

                    if (option.itemVerticalAlign === "middle") {
                        itemDom.style.height = "";
                        itemNewHeight = itemDom.offsetHeight;
                        var itemHeightDiff = itemOldHeight - itemNewHeight;
                        if (itemHeightDiff > 0) {
                            itemDom.style.paddingTop = itemHeightDiff / 2;
                        }
                        layoutObj["item"]
                    }
                }
            }
        }
    }
});

declare(function () {
    return {
        name: 'AntiCheat',
        namespace: 'Cpro.Template',
        antiCheatArray: [],
        mouseInClientX: -1,
        mouseInClientY: -1,
        mouseInTime: -1,
        mouseInTimeSpan: -1,
        mousePressTime: -1,
        mouseClickClientX: -1,
        mouseClickClientY: -1,
        mouseClickCheckNum: -1,
        mouseOverTimes: -1,
        bind: function (element, eventType, handler) {
            if (window.addEventListener) {
                element.addEventListener(eventType, handler, false)
            }
            else {
                element.attachEvent("on" + eventType, handler)
            }
        },
        
        formatEventObj: function (e) {
            e = e || window.event;
            e.target = e.target || e.srcElement;
            return e;
        },
        
        mouseInHandler: function (e) {
            if (this.mouseInClientX === -1) {
                this.mouseInClientX = e.clientX;
            }
            if (this.mouseInClientY === -1) {
                this.mouseInClientY = e.clientY;
            }
        },
        
        mouseInTimeHandler: function (e) {
            if (this.mouseInTime === -1) {
                this.mouseInTime = (new Date()).getTime();
            }
            this.mouseInTimeSpan = (new Date()).getTime() - this.mouseInTime;
        },

        mousePressTimeHandler: function (e) {
            if (e.type === "mousedown") {
                this.mousePressTime = (new Date()).getTime();
            }
            else {
                this.mousePressTime = (new Date()).getTime() - this.mousePressTime;
            }
        },

        mouseClickHandler: function (e) {
            e = this.formatEventObj(e);
            var sourceElement = e.target;
            if (sourceElement.tagName.toLowerCase() !== "a") {
                sourceElement = sourceElement.parentNode;
            }
            this.mouseClickClientX = e.clientX;
            this.mouseClickClientY = e.clientY;

            this.mouseInTimeHandler();

            //make the mouseClickCheckNum
            this.mouseClickCheckNum = 0;
            var urlParamMatch = /\.php\?(url=)?([0-9a-zA-Z_-]*)\./.exec(sourceElement.href);
            var urlParam = urlParamMatch[2];
            var domIdMatch = /.*(\d+)/.exec(sourceElement.id);
            var domNum = domIdMatch[1];
            var midNum = this.antiCheatArray[domNum];
            for (var i = 0; i < (((this.mouseOverTimes * midNum) % 99) + 9); i++) {
                var idx = (this.mousePressTime * i) % urlParam.length;
                this.mouseClickCheckNum += urlParam.charCodeAt(idx);
            }

            //make click url
            var elementHtml = sourceElement.innerHTML;
            if (sourceElement.href.indexOf("&ck") == -1) {
                sourceElement.href += "&ck=" + this.mouseClickCheckNum + "." + this.mouseOverTimes + "." + this.mousePressTime + "." + this.mouseClickClientX + "." + this.mouseClickClientY + "." + this.mouseInClientX + "." + this.mouseInClientY + "." + this.mouseInTimeSpan;
            }
            if ((elementHtml.match(/(www\.)|(.*@.*)/i) != null) && document.all) {
                elementHtml.match(/\<.*\>/i) == null ? sourceElement.innerHTML = elementHtml : sourceElement.innerTEXT = elementHtml;
            }
        },

        mouseOverHandler: function (e) {
            if (this.mouseOverTimes === -1) {
                this.mouseOverTimes = 0;
            }
            this.mouseOverTimes++;
        },

        check: function (containerId, antiCheatArray) {
            this.antiCheatArray = antiCheatArray||window.antiCheatArray;
            var container = document.getElementById(containerId);
            var linkArray = container.getElementsByTagName("a");
            this.bind(container, "mouseover", this.mouseInHandler.proxy(this));
            this.bind(container, "mouseover", this.mouseInTimeHandler.proxy(this));
            for (var i = 0; i < linkArray.length; i++) {
                var tempClassName = linkArray[i].className;
                if(tempClassName){
                    tempClassName = tempClassName.toLowerCase();
                    if(tempClassName === "gylogo"
                        || tempClassName === "bdlogo"
                        || tempClassName === "bd-logo"
                        || tempClassName === "bd-logo2"
                        || tempClassName === "bd-logo3"){
                        continue;
                    }
                }
                this.bind(linkArray[i], "mousedown", this.mousePressTimeHandler.proxy(this));
                this.bind(linkArray[i], "mouseup", this.mousePressTimeHandler.proxy(this));
                this.bind(linkArray[i], "click", this.mouseClickHandler.proxy(this));
                this.bind(linkArray[i], "mouseover", this.mouseOverHandler.proxy(this));
            }
        }
    }
});

declare(function () {
    /**
    渲染引擎
    @class DataEngine
    @namespace $baseName.UI.Template
    */
    return {
        name:'DataEngine',
        namespace: 'Cpro.Template',

        flashIETemplate :       '<object classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" id="{flashid}"'
                                    + 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"'
                                    + 'border="0" width="{width}" height="{height}">'
                                    + '<param name="quality" value="high">'
                                    + '<param name="wmode" value="opaque">'
                                    + '<param name="menu" value="false">'
                                    + '<param name="movie" value="{url}">'
                                    + '<param name="FlashVars" value="{flashvars}">'
                                    + '<param name="scale" value="{scale}">'
                                    + '<param name="AllowFullScreen" value="{allowfullscreen}">'
                                    + '<param name="AllowScriptAccess" value="{allowscriptaccess}">'
                                    + '<param name="AllowNetworking" value="{allownetworking}">'
                             + '</object>',

        flashNormalTemplate :   '<embed pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"'
                                    + 'wmode="opaque" quality="High"'
                                    + 'name="{flashid}" src="{url}"'
                                    + 'width="{width}" height="{height}"'
                                    + 'scale="{scale}"'
                                    + 'allowfullscreen="{allowfullscreen}" '
                                    + 'allowscriptaccess="{allowscriptaccess}"'
                                    + 'allownetworking="{allownetworking}"'
                                    + 'flashvars="{flashvars}">'
                              + '</embed>',
        /**
		 * 使用数据格式化字符串模版
		 * 
		 * @example
		 * var template = "<div>{name}-{age}</div>";
		 *    var data = {name:test, age:10};
		 *    var result = this.template(template, data); //output:<div>test-10</div>
		 * @function
		 * @meta cpro
		 * @return {string} 格式化后的字符串
		 */
		templateFunc : function(source, data) {
			var regexp = /{(.*?)}/g;
			return source.replace(regexp, function(match, subMatch, index, s) {
						return data[subMatch] || "";
			});
		},
        /**
		@param {Object} 	option 					 创建flash的选项参数
        @param {string}     option.width             flash文件的url
        @param {string}     option.height            flash运行参数
		@param {string} 	option.url 				 flash文件的url
        @param {string}     option.flashvars         flash运行参数
        @param {string}     option.scale             flash缩放模式
        @param {string}     option.allowFullScreen   flash是否允许全屏
        @param {string}     option.allowScriptAccess flash与网页脚本交互
        @param {string}     option.allownetworking   flash文件允许所有的网络API
        */
        createFlashHtml: function (option) {
            option.id                   = option.id ? option.id : "";
            option.flashvars            = option.flashvars ? option.flashvars : "";
            option.scale                = option.scale ? option.scale : "exactfit";
            option.allowFullScreen      = option.allowFullScreen ? option.allowFullScreen : "false";
            option.allowScriptAccess    = option.allowScriptAccess ? option.allowScriptAccess : "never";
            option.allowNetworking      = option.allowNetworking ? option.allowNetworking : "internal";

            /*
            * Chrome28后不支持在object嵌套embed的方式引入Flash,所以针对不同浏览器需要使用不同的模版
            * IE是通过ActiveX控件支持Flash,使用window.ActiveXObject作为FeatureDetection条件
            * 参考:http://www.w3help.org/zh-cn/causes/HO8001
            */
            var flash_template = window.ActiveXObject ? 
                                 this.flashIETemplate : this.flashNormalTemplate;

            /*
            * Flash的参数设置见下
            * http://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html
            */
            var result = this.templateFunc(flash_template,{
                "url" : option.url,
                "width" : option.width,
                "height" : option.height,
                "id": option.id,
                "scale" : option.scale,
                "allowfullscreen" : option.allowFullScreen,
                "allowscriptaccess" : option.allowScriptAccess,
                "allownetworking" : option.allowNetworking,
                "flashvars" : option.flashvars
            });
            
            return result;
        },

        /**
        按照字节截取字符串
        @method subStringByBytes        
        */
        subStringByBytes: function (source, length, isFloor) {
            if (!source) {
                return "";
            }
            source = String(source);
            if (length < 0 || source.replace(/[^\x00-\xff]/g, "ci").length <= length) {
                return source;
            }
            source = source.substr(0, length).replace(/([^\x00-\xff])/g, "\x241 ").substr(0, length); //双字节字符替换成两个, 并截取长度
            source = source.replace(/[^\x00-\xff]$/, ""); //去掉临界双字节字符
            source = source.replace(/([^\x00-\xff]) /g, "\x241"); //还原
            return source;
        },

        /**
        获取字符串的字节长度
        @method getByteLength        
        */
        getByteLength: function (source) {
            if (!source) {
                return "";
            }
            source = String(source);
            source = source.replace(/([^\x00-\xff])/g, "\x241 ");
            return source.length;
        },

        /**
        动态步进文字字节探测法
        @method truncateEngine
         */
        truncateEngine: function (o) {
            var dom = o.dom; //待探测的Dom元素
            var showRowCount = o.showRowCount; //想要显示的行数
            var showLineHeight = o.showLineHeight; //显示内容的行高
            var showWidth = o.showWidth; //想要显示的宽度
            var showFontSize = o.showFontSize; //显示的字体大小
            var showContent = o.showContent; //待显示的内容
            var showEllipsis = false; //是否显示省略号"..."
            if (o.showEllipsis) {
                showEllipsis = true;
            }

            dom.style.whiteSpace = "nowrap"; //把元素内容变成一行
            var domWidth = dom.offsetWidth; //当前元素的宽度(一行)
            var domWidthArray = []; //保存元素宽度变化的数组
            var domByteLengthArray = []; //保存元素字节长度状态的数组
            var domDetectByteLengthArray = []; //保存每次探测的字节数数组
            var domTargetWidth = showRowCount * showWidth; //目标宽度(一行)
            var totalDetectTimes = 0; //总共探测的次数
            
            //========== 单行元素, 使用text-overflow截断
            /*
            if(showRowCount===1){
                dom.innerHTML = showContent;
                dom.className += " textOverflow ";
                if(showEllipsis){
                    dom.className += " textOverflowEllipsis ";
                }
                else{
                    dom.className += " textOverflowClip ";
                }
                return 0;
            }
            */

            //==========监测是否有高度 ==========
            if (showLineHeight <= 0 || showRowCount <= 0) {
                return 0;
            }

            //========== 动态步进探测 ==========
            var widthDiff,
            byteWidth,
            detectDirection;
            for (var i = 0; i < 3; i++, totalDetectTimes++) {
                domWidth = dom.offsetWidth;
                domWidthArray[i] = domWidth;
                domByteLengthArray[i] = this.getByteLength(dom.innerText || dom.textContent);
                widthDiff = domTargetWidth - domWidth; //目标宽度与元素高度的差值
                //如果已经全部显示了文字, 则不进行探测
                if (widthDiff > 0 && showContent.length == dom.innerHTML.length) {
                    break;
                }
                byteWidth; //每个字节的宽度
                detectDirection; //填充方向 , 0标识正向探测, 1标识负向探测

                //如果相差距离小于5像素, 则直接进入微调阶段
                if (Math.abs(widthDiff) < 5) {
                    break;
                }

                //===== 需要确定每个字节占用的宽度	=====
                if (i === 0) { //第一次的步进, 默认字节宽度为font-size的一半
                    byteWidth = Math.ceil(showFontSize / 2);
                }
                else { //以后的字体宽度, 由上一次的宽度确定
                    byteWidth = Math.abs(domWidthArray[i] - domWidthArray[i - 1]) / domDetectByteLengthArray[i - 1];
                    if (byteWidth === 0) { //当内容已经完全显示时, 计算出来的byteWidth为0
                        break;
                    }
                }
                domDetectByteLengthArray[i] = Math.ceil(Math.abs(widthDiff) / byteWidth); //由每字节宽度确定探测长度

                //===== 开始探测 =====
                detectDirection = widthDiff > 0 ? 0 : 1;
                if (!detectDirection) { //正向填充
                    dom.innerHTML = this.subStringByBytes(showContent, domByteLengthArray[i] + domDetectByteLengthArray[i]);
                }
                else { //负向填充
                    dom.innerHTML = this.subStringByBytes(showContent, domByteLengthArray[i] - domDetectByteLengthArray[i]);
                }
            }

            // ========== 微调补余探测	==========
            domWidth = dom.offsetWidth;
            var microDetectDirection; //微调探测方向
            var maxDetectTimes = 10; //最多探测10次
            var currentDetectTimes = 0;
            while (currentDetectTimes < maxDetectTimes && domWidth > domTargetWidth) {
                domWidth = dom.offsetWidth;
                var domContent = dom.innerText || dom.textContent;
                widthDiff = domTargetWidth - domWidth; //虚拟宽度与Dom元素宽度的差值
                microDetectDirection = widthDiff > 0 ? 0 : 1;
                if (!microDetectDirection) { //正向填充
                    dom.innerHTML = showContent.substr(0, domContent.length + 1);
                }
                else { //负向填充
                    dom.innerHTML = showContent.substr(0, domContent.length - 1);
                }
                totalDetectTimes++;
                currentDetectTimes++;

                //check
                domWidth = dom.offsetWidth;
                var domContent = dom.innerText || dom.textContent;
                widthDiff = domTargetWidth - domWidth; //虚拟宽度与Dom元素宽度的差值
                if (!microDetectDirection) { //正向探测
                    if (widthDiff <= 0) {
                        dom.innerHTML = showContent.substr(0, domContent.length - 1);
                        totalDetectTimes++
                        break;
                    }
                }
                else { //负向探测
                    if (widthDiff >= 0) {
                        break;
                    }
                }
            }
            currentDetectTimes = 0;

            //========== 恢复文字的多行显示 ==========
            dom.style.whiteSpace = "normal";
            dom.style.wordBreak = "break-all";
            dom.style.wordWrap = "break-word";

            //========== 多行显示后, 由于折行会导致多显示一些文字, 进行二次微调 ==========
            //========== 只有一行的情况下，无论是否遮挡，都显示广告 ==========
            var domHeight = dom.offsetHeight;
            var domTargetHeight = showRowCount * showLineHeight;
            var domContent = dom.innerText || dom.textContent;
            if(showRowCount != 1){
                //最多试探10次
                var maxDetectTimes = 10;
                var currentDetectTimes = 0;
                while (currentDetectTimes < maxDetectTimes && domHeight > domTargetHeight + 4) {
                    dom.innerHTML = showContent.substr(0, domContent.length - 1);
                    domHeight = dom.offsetHeight;
                    domContent = dom.innerText || dom.textContent;
                    totalDetectTimes++;
                    currentDetectTimes++;
                }
                currentDetectTimes = 0;
            }
            //========== 如果内容没有完全显示, 添加"..."后缀 ==========
            if (showEllipsis) {
                if (domContent.length < showContent.length) {
                    var domContent = dom.innerText || dom.textContent;
                    var domCurrentByteLength = this.getByteLength(domContent);
                    dom.innerHTML = this.subStringByBytes(showContent, domCurrentByteLength - 2) + '<span style="font-family:arial;">...</span>';
                }
            }

            //========== 适应高度 ==========
            var parentTargetHeight = showLineHeight;
            var domOffetHeight = dom.offsetHeight;
            while (parentTargetHeight + 4 < domOffetHeight) {
                parentTargetHeight += showLineHeight;
            }
            dom.parentNode.style.height = parentTargetHeight + "px";

            //========== 返回探测的次数 ==========
            return totalDetectTimes;
        },

        /**
        进行数据渲染
        @method paint
        @param {Object} option 参数对象
        @param {Object} [option.dom] 待探测的Dom元素
        @param {Number} [option.showRowCount] 想要显示的行数
        @param {Number} [option.showLineHeight] 显示内容的行高
        @param {Number} [option.showWidth] 想要显示的宽度
        @param {Number} [option.showFontSize] 待探测的Dom元素
        @param {String} [option.showContent] 待显示的内容
        @param {Boolean} [option.showEllipsis] 是否显示省略号
        */
        paint: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var layoutObj = option.layoutObj;
            var layoutIndex = layoutObj.layoutIndex;
            var data = option.data;
            var isTruncate = (typeof option.isTruncate!=="undefined") ? option.isTruncate : true;
            var dataTypeMapping = {
                image: "image",
                res: "image",
				brand: "image",
                curl: "link",
                icon: "link"
            }
            var idPrefix = fullConfig.idPrefix || "";

            //LU广告替换url的处理
            if (fullConfig.displayType === "inlay" && fullConfig.stuffType === "linkunit" && fullConfig.urlReplace && fullConfig.urlReplace !== "default") {
                for (var i = 0, count = data.length; i < count; i++) {
                    data[i].curl = data[i].curl.replace("http://cpro.baidu.com/cpro/ui/uijs.php?", decodeURIComponent(fullConfig.urlReplace));
                }
            }

            for (var i = 0, count = data.length; i < count; i++) {
                var item = data[i];
                var index = i;
                var stuffType = item["type"];
                for (var key in item) {
                    var href = item["curl"];
                    var dom = document.getElementById(idPrefix + key + index);
                    if (!dom) continue;
                    dom.href = href;
                    var dataType = dataTypeMapping[key] || "text";
                    if (stuffType && stuffType === "flash" && key === "res") {
                        dataType = "flash";
                    }

                    //处理图片
                    if (dataType === "image") {
                        var imageContainer = document.getElementById(dom.id);
                        dom.childNodes[0].width = imageContainer.style.width;
                        dom.childNodes[0].height = imageContainer.style.height;
                        dom.childNodes[0].src = item[key];
                        continue;
                    }
                    else if (dataType === "link") {
                        continue;
                    }
                    else if (dataType === "flash") {
                        var flashContainer = document.getElementById(dom.id + "Flash");
                        flashContainer.innerHTML = this.createFlashHtml({
                            url: item[key],
                            width: flashContainer.style.width,
                            height: flashContainer.style.height
                            /*
                            width: item["width"],
                            height: item["height"]
                            */
                        });
                        continue;
                    }

                    //处理文字
                    var rowCount = layoutIndex[key] && layoutIndex[key].rowCount || 1;
                    var lineHeight = layoutIndex[key].style["line-height"];
                    var width = layoutIndex[key].style["width"];
                    var fontSize = layoutIndex[key].style["font-size"];
                    var content = (item[key] || "").replace(/\s+/g, " ");
                    var showEllipsis = layoutIndex[key].showEllipsis;
                    //默认填充值
                    dom.title=content;          
                    if(isTruncate){
                        dom.innerHTML = this.subStringByBytes(content, rowCount * width * 2 / fontSize, true);
                    }
                    else{
                        dom.innerHTML= content;
                    }

                    if (stuffType === "text" || stuffType === "tuwen" || stuffType === "smartidea2") {
                        if(isTruncate){
                            var o = {
                                dom: dom,
                                showRowCount: rowCount,
                                showLineHeight: lineHeight,
                                showWidth: width,
                                showFontSize: fontSize,
                                showContent: content,
                                showEllipsis: showEllipsis,
                                key: key
                            };
                            var totalDetectTimes = this.truncateEngine(o);
                        }
                        
                        if(fullConfig.keywordIsFlush && fullConfig.keywordIsFlush!==4){
                            var needFlush = false;
                            if( fullConfig.keywordIsFlush===1 ){
                                needFlush=true;
                            }
                            else if( fullConfig.keywordIsFlush===2 && key==="title"){
                                needFlush=true;
                            }
                            else if( fullConfig.keywordIsFlush===3 && key==="desc"){
                                needFlush=true;
                            }
                            if(needFlush){
                                var keywordPainter = using("Cpro.Template.KeywordPainter");
                                keywordPainter.flush( dom,  item["bid"], fullConfig.keywordFlushColor);
                            }
                        }                        
                    }
                    
                    if (o && o.key === "surl" && !layoutIndex["surl"].style.display) {
                        o.dom.parentNode.style.display = "block";
                    }
                }
                //处理文字箭头
                if (fullConfig.itemRightImage){
                    var arrowDom = document.getElementById(idPrefix + "rightimage" + index);
                    if(arrowDom){
                        arrowDom.href = item["curl"];
                        arrowDom.backgroundImage = fullConfig.itemRightImageSrc;
                    }

                }
            }
            if (userConfig.titleFrontIconSrc){
                for (var i=0,count = data.length; i< count; i++){
                    document.getElementById(idPrefix+"icon"+i).getElementsByTagName("img")[0].src = userConfig.titleFrontIconSrc;
                
                }
            
            }

        }
    }
});

declare(function () {
    /**
    模板参数默认值的管理类.
    @class DefaultValueManager
    @namespace UI.Template
    */
    return {
        name: 'DefaultValueManager',
        namespace: "Cpro.Template",
        /**    
        @param {Object} option 本次请求的参数
        @param {Number} [option.width]  广告宽度
        @param {Number} [option.height]  广告高度
        @param {String} [option.displayType]  广告展现类型
        @param {String} [option.stuffType]  广告物料类型
        @return {Object} 模板样式变量的默认值对象, key是fullName.
        */
        getDefaultValue: function (option) {
            var result = this.fastClone(this.globalDefaultValue);
            var keyArray = [];
            
            option.displayType = option.displayType ? option.displayType : "inlay";
            option.stuffType = option.stuffType ? option.stuffType : "text";
            
            keyArray.push(option.stuffType);
            keyArray.push(option.displayType);
            keyArray.push(option.displayType + "_" + option.stuffType);
            keyArray.push(option.displayType + "_" + option.stuffType + "_" + option.adRowCount + "_" + option.adColumnCount);
            keyArray.push(option.displayType + "_" + option.stuffType + "_" + option.templateWidth + "_" + option.templateHeight);
            keyArray.push(option.displayType + "_" + option.stuffType + "_" + option.templateWidth + "_" + option.templateHeight + "_" + option.adRowCount + "_" + option.adColumnCount);
            var tempKey = null;
            var tempObj = null;
            var ttkey = null;
            for (var i = 0, count = keyArray.length;
            i < count;
            i++) {
                tempKey = keyArray[i];
                tempObj = this[tempKey];
                if (tempKey && tempObj) {
                    for (ttkey in tempObj) {
                        if (ttkey && (tempObj[ttkey] !== null) && (typeof tempObj[ttkey] !== "undefined")) {
                            result[ttkey] = tempObj[ttkey];
                        }
                    }
                }
            }
            return result;
        },
        /**    
        @param {Object} option 需要克隆的对象
        @return {Object} 克隆后的对象
        */
        fastClone: function (source) {
            var temp = function () {};
            temp.prototype = source;
            return new temp();
        },
        /**
        Flash物料样式变量默认值
        @property {Object} 
        */
        flash: {
            containerPaddingLeft: 0,
            containerPaddingRight: 0,
            containerPaddingTop: 0,
            containerPaddingBottom: 0,
            adRowCount: 1,
            adColumnCount: 1
        },
        /**
        图片物料样式变量默认值
        @param {Object} imageInlayDefaultValue 
        */
        image: {
            containerPaddingLeft: 0,
            containerPaddingRight: 0,
            containerPaddingTop: 0,
            containerPaddingBottom: 0,
            adRowCount: 1,
            adColumnCount: 1
        },
        /**
        嵌入式-文字物料样式变量默认值
        */
        inlay_text: {
            containerPaddingRight: 8,
            containerBorderTop: 1,
            containerBorderRight: 1,
            containerBorderBottom: 1,
            containerBorderLeft: 1,
            containerBorderColor: "ffffff",
            titlePaddingBottom: 4,
            urlPaddingTop: 2
        },
        /**
        嵌入式-文字物料样式变量默认值
        */
        inlay_text_1_1: {
            titleFontSize: 20,
            descFontSize: 14,
            titleTextAlign: "center",
            descTextAlign: "center",
            urlTextAlign: "center",
            urlIsShow: 1
        },
        /**
        嵌入式-图文物料样式变量默认值
        */
        inlay_tuwen: {
            containerPaddingRight: 8
        },
        inlay_tuwen_1_1: {
            titleFontSize: 16
        },
        inlay_tuwen_1_4: {
            descFontSize: 12
        },
        /**
        嵌入式-LinkUnit1 样式变量默认值
        */
        inlay_linkunit1: {
            titleFontSize: 12,
            titleLineHeight: 15,
            containerPaddingLeft: 0,
            containerPaddingRight: 0,
            containerPaddingTop: 0,
            containerPaddingBottom: 0,
            itemColumnSpace: 6,
            itemRowSpace: 4
        },
        inlay_linkunit1_120_90: {
            containerPaddingLeft: 2,
            containerPaddingRight: 2,
            containerPaddingTop: 1,
            containerPaddingBottom: 1,
            adRowCount: 5,
            adColumnCount: 1
        },
        inlay_linkunit1_160_90: {
            containerPaddingLeft: 2,
            containerPaddingRight: 2,
            containerPaddingTop: 1,
            containerPaddingBottom: 1,
            adRowCount: 5,
            adColumnCount: 1
        },
        inlay_linkunit1_180_90: {
            containerPaddingLeft: 2,
            containerPaddingRight: 2,
            containerPaddingTop: 1,
            containerPaddingBottom: 1,
            adRowCount: 5,
            adColumnCount: 1
        },
        inlay_linkunit1_200_90: {
            containerPaddingLeft: 2,
            containerPaddingRight: 2,
            containerPaddingTop: 1,
            containerPaddingBottom: 1,
            adRowCount: 5,
            adColumnCount: 1
        },
        inlay_linkunit1_468_15: {
            containerPaddingRight: 15,
            adRowCount: 1,
            adColumnCount: 5
        },
        inlay_linkunit1_728_15: {
            containerPaddingRight: 15,
            adRowCount: 1,
            adColumnCount: 6
        },
        /**
        嵌入式-文字-宽度960-高度90-横向广告数1-纵向广告数4 样式变量默认值
        @param {Object} inlay_text_960_90_1_4 
        */
        inlay_text_960_90_1_4: {
            descFontSize: 14,
            descLineHeight: 16,
            titlePaddingBottom: 3,
            urlPaddingTop: 2
        },
        /**
        嵌入式-文字-宽度468-高度60 样式变量默认值
        @param {Object} inlay_text_468_60 
        */
        inlay_text_468_60: {
            descFontSize: 12,
            descLineHeight: 14,
            titlePaddingBottom: 3,
            urlPaddingTop: 2,
            containerPaddingRight: 8,
            adRowCount: 1,
            adColumnCount: 2
        },

        /**
        嵌入式-图文-宽度468-高度60 样式变量默认值
        */
        inlay_tuwen_468_60: {
            descFontSize: 12,
            descLineHeight: 14,
            titlePaddingBottom: 3,
            urlPaddingTop: 2,
            adRowCount: 1,
            adColumnCount: 2
        },

        "float": {
            adRowCount: 1,
            adColumnCount: 1
        },


        float_linkunit1_120_270: {
            idPrefix: "lu_",
            containerShowLogo: 0,
            titleTextAlign: "left",
            titleFontColor: "666666",
            titleFontSize: 12,
            titleLineHeight: 14,
            titleShowUnderline: 0,
            containerPaddingLeft: 8,
            containerPaddingRight: 8,
            containerPaddingTop: 4,
            containerPaddingBottom: 4,
            containerBorderTop: 1,
            containerBorderRight: 1,
            containerBorderBottom: 1,
            containerBorderLeft: 1,
            containerBorderColor: "cccccc",
            itemColumnSpace: 6,
            itemRowSpace: 4,
            adRowCount: 2,
            adColumnCount: 1
        },


        /**
        全局样式变量默认值
        @param {Object} imageInlayDefaultValue 
        */
        globalDefaultValue: {
            "userChargingId": "",
            "templateWidth": 728,
            "templateHeight": 90,
            "adDataType": "text_tuwen",
            "adRowCount": 1,
            "adColumnCount": 4,
            "KeywordIsFlush": 4,
            "KeywordFlushColor": "e10900",
            "isShowUnrelated": 1,
            "isShowPublicAd": 1,
            "isGongyi": 0,
            "backupColor": "ffffff",
            "backupUrl": "",
            "displayType": "inlay",
            "stuffType": "image",
            "layout": "-1",
            "scale":"",
            "containerBorderColor": "ffffff",
            "containerBorderWidth": 1,
            "containerBorderTop": 0,
            "containerBorderRight": 0,
            "containerBorderBottom": 0,
            "containerBorderLeft": 0,
            "containerBorderStyle": "solid",
            "containerBackgroundColor": "ffffff",
            "containerPaddingLeft": 4,
            "containerPaddingRight": 4,
            "containerPaddingTop": 4,
            "containerPaddingBottom": 4,
            "containerOpacity": 0,
            "containerShowLogo": 1,
            "containerWidth": 0,
            "containerHeight": 0,
            "containerHideHeaderFooter": 0,
            "containerFloat": "none",
            "containerLogoStyle": "-1",
            "itemPaddingLeft": 0,
            "itemPaddingRight": 0,
            "itemPaddingTop": 0,
            "itemPaddingBottom": 0,
            "itemVerticalAlign": "-1",
            "itemColumnSpace": 20,
            "itemColumnBackgroundColor": "-1",
            "itemColumnBorderWidth": 0,
            "itemColumnBorderStyle": "solid",
            "itemColumnBorderColor": "-1",
            "itemColumnPaddingTop": 0,
            "itemColumnPaddingLeft": 0,
            "itemColumnPaddingRight": 0,
            "itemColumnPaddingBottom": 0,
            "itemColumnMarginTop" : 0,
            "itemColumnMarginLeft" : 0,
            "itemColumnMarginRight" : 0,
            "itemColumnMarginBottom" : 0,
            "itemRowSpace": 10,
            "itemRowBorderWidth": 0,
            "itemRowBorderStyle": "solid",
            "itemRowBorderColor": "-1",
            "itemRowPaddingTop": 0,
            "itemRowPaddingLeft": 0,
            "itemRowPaddingRight": 0,
            "itemRowPaddingBottom": 0,
            "itemRightImage" : 0,
            "itemRightImageSrc" : "",
            "itemRightImageWidth" : 0,
            "itemRightImageHeight" : 0,
            "itemRightImagePaddingTop" : 0,
            "itemRightImagePaddingLeft" : 0,
            "itemRightImagePaddingRight" : 0,
            "itemRightImagePaddingBottom" :0,
			
            "brandLogoPaddingLeft": 0,
            "brandLogoPaddingRight": 0,
            "brandLogoPaddingTop": 0,
            "brandLogoPaddingBottom": 0,
			
            "logoIsShow": 1,
            "logoPaddingLeft": 0,
            "logoPaddingRight": 4,
            "logoPaddingTop": 0,
            "logoPaddingBottom": 0,
            "titleFontColor": "0F0CBF",
            "titleFontFamily": "arial,simsun,sans-serif",
            "titleFontSize": 14,
            "titleLength": -1,
            "titleIsShowEllipsis": 0,
            "titleIsShow": 1,
            "titleRowCount": 1,
            "titlePaddingLeft": 0,
            "titlePaddingRight": 0,
            "titlePaddingTop": 0,
            "titlePaddingBottom": 5,
            "titleShowUnderline": 1,
            "titleLineHeight": -1,
            "titleWidth": -1,
            "titleFontWeight": "normal",
            "titleBackgroundColor": "-1",
            "titleHoverFontColor": "EE0000",
            "titleHoverShowUnderline": -1,
            "titleHoverBackgroundColor": "-1",
            "titleVisitedFontColor": "-1",
            "titleVisitedShowUnderline": -1,
            "titleVisitedBackgroundColor": "-1",
            "titleActiveFontColor": "-1",
            "titleActiveShowUnderline": -1,
            "titleActiveBackgroundColor": "-1",
            "titleTextAlign": "-1",
            "titleFrontIconSrc": "",
            "titleFrontIconWidth": 0,
            "titleFrontIconHeight": 0,
            "titleFrontIconPaddingRight": 0,
            "titleFrontIconPaddingLeft": 0,
            "descFontColor": "444444",
            "descFontFamily": "arial,simsun,sans-serif",
            "descFontSize": 14,
            "descLength": -1,
            "descIsShowEllipsis": 1,
            "descIsShow": 1,
            "descRowCount": -1,
            "descPaddingLeft": 0,
            "descPaddingRight": 0,
            "descPaddingTop": 0,
            "descPaddingBottom": 0,
            "descShowUnderline": 0,
            "descLineHeight": -1,
            "descWidth": -1,
            "descFontWeight": "normal",
            "descBackgroundColor": "-1",
            "descHoverFontColor": "EE0000",
            "descHoverShowUnderline": 1,
            "descHoverBackgroundColor": "-1",
            "descVisitedFontColor": "-1",
            "descVisitedShowUnderline": -1,
            "descVisitedBackgroundColor": "-1",
            "descActiveFontColor": "-1",
            "descActiveShowUnderline": -1,
            "descActiveBackgroundColor": "-1",
            "descTextAlign": "-1",
            "urlFontColor": "008000",
            "urlFontFamily": "arial,simsun,sans-serif",
            "urlFontSize": 11,
            "urlLength": -1,
            "urlIsShowEllipsis": 0,
            "urlIsShow": -1,
            "urlPaddingLeft": 0,
            "urlPaddingRight": 0,
            "urlPaddingTop": 3,
            "urlPaddingBottom": 0,
            "urlShowUnderline": 0,
            "urlRowCount": 0,
            "urlLineHeight": -1,
            "urlWidth": -1,
            "urlFontWeight": "normal",
            "urlBackgroundColor": "-1",
            "urlReplace": " ",
            "urlHoverFontColor": "EE0000",
            "urlHoverShowUnderline": 1,
            "urlHoverBackgroundColor": "-1",
            "urlVisitedFontColor": "-1",
            "urlVisitedShowUnderline": -1,
            "urlVisitedBackgroundColor": "-1",
            "urlActiveFontColor": "-1",
            "urlActiveShowUnderline": -1,
            "urlActiveBackgroundColor": "-1",
            "urlTextAlign": "-1"
        }
    }
});

declare(function () {
    /**
    渲染引擎
    @class DataEngine
    @namespace $baseName.UI.Template
    */
    return {
        name:'FloatDataEngine',
        namespace: 'Cpro.Template',
        /**
        进行数据渲染
        @method paint
        @param {Object} option 参数对象
        @param {Object} [option.dom] 待探测的Dom元素
        @param {Number} [option.showRowCount] 想要显示的行数
        @param {Number} [option.showLineHeight] 显示内容的行高
        @param {Number} [option.showWidth] 想要显示的宽度
        @param {Number} [option.showFontSize] 待探测的Dom元素
        @param {String} [option.showContent] 待显示的内容
        @param {Boolean} [option.showEllipsis] 是否显示省略号
        */
        paint: function (option) {
            var slotData = option.slotData;
            var layoutObj = option.layoutObj;
            var layoutIndex = layoutObj.layoutIndex;
            var data = option.data;
            var isTruncate = (typeof option.isTruncate!=="undefined") ? option.isTruncate : true;
            var dataTypeMapping = {
                image: "image",
                res: "image",
                curl: "link"
            }
            var dataEngine = using("Cpro.Template.DataEngine");
            
            
            
            var idPrefix = slotData.idPrefix || "";

            //LU广告替换url的处理
            if (slotData.displayType === "inlay" && slotData.stuffType === "linkunit" && slotData.urlReplace && slotData.urlReplace !== "default") {
                for (var i = 0, count = data.length; i < count; i++) {
                    data[i].curl = data[i].curl.replace("http://cpro.baidu.com/cpro/ui/uijs.php?", decodeURIComponent(slotData.urlReplace));
                }
            }

            for (var i = 0, count = data.length; i < count; i++) {
                var item = data[i];
                var index = i;
                var stuffType = item["type"];
                for (var key in item) {
                    var href = item["curl"];
                    var dom = document.getElementById(idPrefix + key + index);
                    if (!dom) continue;
                    dom.href = href;
                    var dataType = dataTypeMapping[key] || "text";
                    if (stuffType && stuffType === "flash" && key === "res") {
                        dataType = "flash";
                    }

                    //处理图片
                    if (dataType === "image") {
                        dom.childNodes[0].src = item[key];
                        continue;
                    }
                    else if (dataType === "link") {
                        continue;
                    }
                    else if (dataType === "flash") {
                        var flashContainer = document.getElementById(dom.id + "Flash");
                        flashContainer.innerHTML = this.createFlashHtml({
                            url: item[key],
                            width: flashContainer.style.width,
                            height: flashContainer.style.height
                            /*
                            width: item["width"],
                            height: item["height"]
                            */
                        });
                        continue;
                    }

                    //处理文字
                    var rowCount = layoutIndex[key] && layoutIndex[key].rowCount || 1;
                    var lineHeight = layoutIndex[key].style["line-height"];
                    var width = layoutIndex[key].style["width"];
                    var fontSize = layoutIndex[key].style["font-size"];
                    var content = (item[key] || "").replace(/\s+/g, " ");
                    var showEllipsis = layoutIndex[key].showEllipsis;
                    //默认填充值
                    dom.title=content;                    
                    dom.innerHTML = this.subStringByBytes(content, rowCount * width * 2 / fontSize, true);

                    if (stuffType === "text" || stuffType === "tuwen") {
                        if(isTruncate){
                            var o = {
                                dom: dom,
                                showRowCount: rowCount,
                                showLineHeight: lineHeight,
                                showWidth: width,
                                showFontSize: fontSize,
                                showContent: content,
                                showEllipsis: showEllipsis,
                                key: key
                            };
                            var totalDetectTimes = this.truncateEngine(o);
                        }
                    }
                    
                    if (o && o.key === "surl") {
                        o.dom.parentNode.style.display = "block";
                    }
                }
            }
        }
    }
});

declare(function () {
    /**
    关键词着色器
    @class KeywordPainter
    @namespace Cpro.Template
    */
    return {
        name:'KeywordPainter',
        namespace: 'Cpro.Template',
        flush:function(dom, keywordArray, keywordFlushColor){
            if(!keywordArray){
                return;
            }
            if( typeof keywordArray === "string" ){
                keywordArray = keywordArray.replace(/(^\s*)|(\s*$)/g, "");
                keywordArray = keywordArray.split(" ");
            }
            if(keywordArray.length<=0){
                return;
            }
        
            keywordFlushColor = keywordFlushColor.replace("#","")
            for(var i=0, count=keywordArray.length; i<count; i++){
                var content = dom.innerHTML;
                var keyWord = keywordArray[i];
				//转义特殊字符
				keyWord = keyWord.replace(/[\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/]/g, "\\$&");
                var regExp = new RegExp(keyWord,"gi");
                dom.innerHTML =  content.replace(regExp, function(word){
                    return '<span style="color:' + '#' + keywordFlushColor +'">'+word+'</span>';
                });
            }
        }
    };
});

declare(function () {
    /**
    布局引擎工厂类
    @class Manager
    @namespace $baseName.UI.Template
    @static
    */
    return {
        name: 'LayoutEngineManager',
        namespace: 'Cpro.Template',
        /**
        获取布局引擎对象
        @method getLayoutEngine        
        @param {Object} fullConfig 本次请求的参数        
        @param {String} [fullConfig.displayType]  广告展现类型
        @param {String} [fullConfig.stuffType]  广告物料类型
        @param {Number} [fullConfig.width]  广告宽度
        @param {Number} [fullConfig.height]  广告高度
        @return {Object} 模板样式变量的默认值对象, key是fullName.
        */
        getLayoutEngine: function (option) {
            var result;
            this.Template = using("Cpro.Template");
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            
            var caseMapping = {
                "singleline" : "SingleLine"
            };
            
            //函数重载. 如果传递的是字符串, 则标识获取指定名字的布局引擎
            if( typeof fullConfig ==="string" ){
                return this.Template.LayoutEngine[fullConfig];
            }else if( userConfig.layout && typeof userConfig.layout ==="string" && userConfig.layout.toString() !=="-1"){
                var layoutEngineName = caseMapping[userConfig.layout.toLowerCase()];
                return this.Template.LayoutEngine[layoutEngineName];
            }
            
            
            //根据物料类型, 选择模板引擎
            switch (fullConfig.stuffType.toLowerCase()) {
            case "text":
                result = this.Template.LayoutEngine.Text;
                break;
            case "image":
                result = this.Template.LayoutEngine.Image;
                break;
            case "tuwen":
                result = this.Template.LayoutEngine.Tuwen;
                break;
            case "flash":
                result = this.Template.LayoutEngine.Flash;
                break;
            case "linkunit1":
                result = this.Template.LayoutEngine.LinkUnit1;
                break;
            case "linkunit":
                result = this.Template.LayoutEngine.LinkUnit;
                break;
            case "iconlinkunit":
                result = this.Template.LayoutEngine.IconLinkUnit;
                break;
			case "smartidea1":
			case "smartidea2":
                result = this.Template.LayoutEngine.SmartIdea;
                break;
            default:
                result = this.Template.LayoutEngine.Text;
                break;
            }
            return result;
        }
    };
});

declare(function() {
    /**
    嵌入式-文字 调整布局引擎,在数据引擎运行之后，再进行布局的第二次调整
    @class LinkUnitAdjust
    @namespace $baseName.UI.Template
    */
    return {
        name: "LinkUnitAdjust",
        namespace: "Cpro.Template",
        hasClass: function(element, className) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                return element.className.match(reg);
        },
        layout: function(option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var layoutObj = option.layoutObj;

            //获取广告容器
            var containerId = layoutObj.props.id?layoutObj.props.id: "container";
            var container = document.getElementById(containerId);
            var idPrefix = fullConfig.idPrefix || "";
            

            var itemSumWidth = 0; //所有广告title的宽度之和
            var columnIndex = 1; //保存当前元素所在列的序号
            var rowIndex = 1; //保存当前元素所在行的序号
            var grandFatherArray = [];//保存当前元素的祖父元素，也就是title的祖父元素item的数组
            var titleoffsetWidthArray = [];//保存当前元素的offsetWidth，也就是title的数组
            //重置 itemColumnSpace 和 itemRowSpace值，用户如何自定义？第一版默认值为2
            var containerChildArray = container.childNodes; 
            fullConfig.itemColumnSpace = 2;
            fullConfig.itemRowSpace = 2;             
            for(var i=0,l=containerChildArray.length; i<l; i++){
                if(this.hasClass(containerChildArray[i],"itemColumnSpace")){
                    containerChildArray[i].style.width = fullConfig.itemColumnSpace+"px";
                }
                if(this.hasClass(containerChildArray[i],"itemRowSpace")){
                    containerChildArray[i].style.height = fullConfig.itemRowSpace+"px";
                }
            }
            //重置slotData.titlePaddingBottom，因为slotData.titlePaddingBottom目前默认值为5，故将slotData.titlePaddingBottom和slotData.titlePaddingTop设置成一样的值
            fullConfig.titlePaddingBottom = fullConfig.titlePaddingTop
            for (var i = 0,count = fullConfig.adColumnCount; i < count; i++) {  
                var index = i;   
                var dom = null;                
                dom = document.getElementById(idPrefix + layoutObj.content[0].content[0].dataKey + index);    
                if (!dom) continue;    
                //如果广告块只有一行，则需要加和每个title的offsetWidth，然后将剩余宽度平均分配给每个item的padding，使得item直接的间距一致
                if(fullConfig.adRowCount == 1){
                    //因为textOverflow中有width:100%,导致offsetWidth不准确
                    dom.className = dom.className.replace("textOverflow","");
                    var titleoffsetWidth = dom.offsetWidth;
                    //给title,item重置宽度
                    dom.style.width = dom.parentNode.style.width = titleoffsetWidth + "px";
                    itemSumWidth = itemSumWidth+titleoffsetWidth;//记录所有title元素需要的高宽
                     //重新给title元素添加class "offsetWidth" 
                    dom.className = dom.className + " textOverflow";
                    grandFatherArray.push(dom.parentNode.parentNode);//记录每行的item元素，一行遍历结束后，需要调整padding
                    titleoffsetWidthArray.push(titleoffsetWidth);
                    //如果遍历结束，调整每个item的padding
                    if(columnIndex == fullConfig.adColumnCount){
                        var remainderWidth = fullConfig.templateWidth - fullConfig.containerPaddingRight - fullConfig.containerPaddingLeft - fullConfig.containerBorderWidth*2 -itemSumWidth - (fullConfig.adColumnCount - 1) * fullConfig.itemColumnSpace - (fullConfig.titlePaddingLeft+fullConfig.titlePaddingRight) * fullConfig.adColumnCount;
                        //由于IE6不识别小数，故需要取整，然后针对最后一个dom做特殊处理
                        paddingWidth = Math.floor(remainderWidth/(fullConfig.adColumnCount*2));
                        for(var k=0; k<grandFatherArray.length; k++){ 
                            grandFatherArray[k].style.paddingLeft = paddingWidth + "px";
                            grandFatherArray[k].style.paddingRight = paddingWidth + "px"; 
                            grandFatherArray[k].style.width = titleoffsetWidthArray[k] + fullConfig.titlePaddingLeft + fullConfig.titlePaddingRight+"px";
                        }
                        //针对最后一列的dom做特殊处理
                        grandFatherArray[columnIndex-1].style.paddingRight = remainderWidth - paddingWidth * (columnIndex*2-1) + "px"
                    }

                }
                columnIndex++; //保存当前元素所在列的序号,用来判断一行是否结束
               
                //调整item，title的height，lineheight
                var domHeight = Math.floor((fullConfig.templateHeight - fullConfig.containerPaddingTop - fullConfig.containerPaddingBottom - fullConfig.containerBorderWidth*2 - (fullConfig.adRowCount-1) * fullConfig.itemRowSpace)/fullConfig.adRowCount) - fullConfig.itemPaddingTop - fullConfig.itemPaddingBottom  - fullConfig.titlePaddingTop - fullConfig.titlePaddingBottom;
                dom.style.height =dom.parentNode.style.height = dom.style.lineHeight = dom.parentNode.style.lineHeight = domHeight+"px";
                dom.parentNode.parentNode.style.height = domHeight + fullConfig.titlePaddingTop + fullConfig.titlePaddingBottom + "px";
                dom.style.textAlign = dom.parentNode.style.textAlign = dom.parentNode.style.textAlign = dom.parentNode.parentNode.style.textAlign = "center";               
            
            }
            
        }
     
    }
});

declare(function () {
    return {
        name: 'TemplateEngine',
        namespace: 'Cpro.Template',
        init : function(){
            
        },
        paint: function (obj) {
            
            var ads = obj.ads;
            var userConfig = obj.userConfig;
            var templatConfig = obj.templateConfig;
            var displayType = obj.displayType;
        
            var mainConfig = Base.fastClone(config);
            var mainFullNameConfig = this.Template.TemplateVariableManager.getVariables(this.mainConfig);

            currentLayoutEngine = this.Template.LayoutEngineManager.getLayoutEngine(this.mainFullNameConfig);
            this.MediaLayoutObj = currentLayoutEngine.layout(this.mainFullNameConfig);
            this.Template.PaintEngine.paint({
                layoutObj: this.MediaLayoutObj,
                userFullNameConfig: this.mainFullNameConfig
            });

            if (ads[0] && ads[0].type && ads[0].type === "image") {
                run(this.ShowContentLoaded.proxy(this), "image");
            }
            else {
                this.ShowContentLoaded();
            }

            this.Template.DataEngine.paint({
                layoutObj: this.MediaLayoutObj,
                data: ads,
                slotData: this.mainFullNameConfig
            });

            //Anticheat
            if (!window.isGongyi) {
                var AntiCheat = using("Cpro.Template.AntiCheat");
                AntiCheat.check("container");
            }
        }
    }
})

declare(function () {
    /**
    渲染引擎
    @class PaintEngine
    @namespace $baseName.UI.Template
    */
    return {
        name:'PaintEngine',
        namespace: 'Cpro.Template',
        idPrefix:"",
        /**
        需要添加px单位的样式属性
        @property pxStyle
        @type Object
        */
        pxStyle: {
            width: 1,
            height: 1,
            "line-height": 1,
            "padding-left": 1,
            "padding-right": 1,
            "padding-top": 1,
            "padding-bottom": 1,
            "border-width": 1,
            "font-size": 1,
            "margin-left": 1,
            "margin-right": 1,
            "margin-top": 1,
            "margin-bottom": 1,
            "border-left-width": 1,
            "border-right-width": 1,
            "border-top-width": 1,
            "border-bottom-width": 1
        },

        /**
        layoutObj中哪些属性是不需要paint的.
        @property excludeStyle
        @type Object
        */
        excludeStyle: {
            "outer-height": 1,
            "outer-width": 1
        },

        /**
        自动生成的a元素, 会继承哪些属性
        @property linkStyle
        @type Object
        */
        linkStyle: {
            "font-size": 1,
            "height": 1,
            "line-height": 1,
            "text-decoration": 1,
            "text-align": 1,
            "font-family": 1,
            "color": 1,
            "word-wrap": 1,
            "word-break" : 1,
            "text-overflow" : 1
        },

        /**
        生成样式时的全局数组对象
        @property globalGetStyleObj
        @type Object
        */
        globalGetStyleObj: {},

        /**
        全局的样式字符串cssString
        @property cssString
        @type {String}
        */
        cssString: "",

        /**
        全局ID记录器
        @property idRecorder
        @type {Object}
        */
        idRecorder: {},

        /**
        获取layoutObj的样式
        @method getStyle 
        */
        getStyle: function (cssClassName, o) {
            var result = "";
            if (this.globalGetStyleObj[cssClassName]) {
                return "";
            }
            else {
                this.globalGetStyleObj[cssClassName] = 1;
            }
            var style = o.style;
            if (style) {
                for (var key in style) {
                    if (this.excludeStyle[key]) {
                        continue;
                    }
                    result += key + ":" + style[key] + (this.pxStyle[key] ? "px;" : ";");
                }
            }
            result = "." + cssClassName + " {" + result + "} \n";
            return result;
        },

        /**
        获取layoutObj对应的a元素的样式
        @method getLinkStyle 
        */
        getLinkStyle: function (cssClassName, o) {
            var result = "";
            if (this.globalGetStyleObj[cssClassName]) {
                return "";
            }
            else {
                this.globalGetStyleObj[cssClassName] = 1;
            }
            var style = o.style;
            if (style) {
                for (var key in style) {
                    if (this.excludeStyle[key] || !this.linkStyle[key]) {
                        continue;
                    }
                    result += key + ":" + style[key] + (this.pxStyle[key] ? "px;" : ";");
                }
            }
            

            if (o.dataType === "flash") {
                result += "display:block; position:absolute; top:0px; left:0px; z-index:9; cursor:hand; opacity:0; filter:alpha(opacity=0); background-color:#FFFFFF; width:" + style["width"] + "px;";
            }

            result = "." + cssClassName + " {" + result + "} \n";
            
            if(o.styleHover){
                var tempOption = {};
                tempOption.style = o.styleHover;
                result += this.getLinkStyle(cssClassName+":hover", tempOption);
            }
            
            return result;
        },

        /**
        添加样式字符串
        @method addCssByStyle 
        */
        addCssByStyle: function (cssString) {
            var doc = document;
            var style = doc.createElement("style");
            style.setAttribute("type", "text/css");

            if (style.styleSheet) { // IE
                style.styleSheet.cssText = cssString;
            }
            else { // w3c
                var cssText = doc.createTextNode(cssString);
                style.appendChild(cssText);
            }

            var heads = doc.getElementsByTagName("head");
            if (heads.length) heads[0].appendChild(style);
            else doc.documentElement.appendChild(style);
        },


        /**
        根据layoutObj, 绘制dom元素
        @method drawDom 
        @return {Object} 
        */
        drawDom: function (layoutObj) {
            var cssName = layoutObj.cssName || layoutObj.dataKey;
            this.cssString += this.getStyle(cssName, layoutObj);
            var dom = document.createElement(layoutObj.domName);
            dom.className = cssName;
            for (var key in layoutObj.props) {
                dom[key] = layoutObj.props[key];
            }
            if (layoutObj.dataType != "layout") {
                this.idRecorder[layoutObj.dataKey+this.idPrefix] = this.idRecorder[layoutObj.dataKey+this.idPrefix] || 0
                var domId = this.idPrefix + layoutObj.dataKey + this.idRecorder[layoutObj.dataKey+this.idPrefix];
                var domLink = document.createElement("a");
                domLink.id = domId;
                domLink.target = "_blank";
                var cssNameLink = cssName + " a";
                this.cssString += this.getLinkStyle(cssNameLink, layoutObj);
                this.idRecorder[layoutObj.dataKey+this.idPrefix]++;

                //set default value of whether click or not is true
                var enableClick = layoutObj.enableClick !== undefined ? layoutObj.enableClick : 1;
                
                switch (layoutObj.dataType) {
                    case "text":
                        break;
                    case "image":
                        var domLinkImg = document.createElement("img");
                        domLinkImg.style.width = (layoutObj.style["width"]) + "px";
                        domLinkImg.style.height = (layoutObj.style["height"]) + "px";
                        domLink.style.display = "block";
                        domLink.appendChild(domLinkImg);
                        break;
                    case "flash":
                        var flashDiv = document.createElement("div");
                        flashDiv.style.width = (layoutObj.style["width"]) + "px";
                        flashDiv.style.height = (layoutObj.style["height"]) + "px";
                        flashDiv.id = domId + "Flash";
                        dom.appendChild(flashDiv);
                        break;
                    case "icon":
                        if(enableClick){
                            var domEmptyDv = document.createElement("div");
                            domEmptyDv.style.width = (layoutObj.style["width"]) + "px";
                            domEmptyDv.style.height = (layoutObj.style["height"]) + "px";
                            domLink.appendChild(domEmptyDv);
                        }
                        break;
                    default:
                        break;
                }
                if(enableClick){
                    dom.appendChild(domLink);
                }
            }

            if (layoutObj.content && layoutObj.content.length) {
                for (var i = 0, count = layoutObj.content.length; i < count; i++) {
                    for (var j = 0, ccount = layoutObj.content[i].count || 1; j < ccount; j++) {
                        dom.appendChild(this.drawDom(layoutObj.content[i]));
                    }
                }
            }
            return dom;
        },
        
        /**
        绘制logo
        @param {Object} option 参数对象集合
        @param {Object} [option.layoutObj] 布局对象
        */
        drawLogo: function(option){       
            option = option || {};
            var logoId = option.logoId || "logo";
            var logoDom = document.getElementById(logoId);
            if(!logoDom){
                logoDom = document.createElement("a");
            }            
  
            var isGongyi = false;
            if(typeof option.isGongyi === "undefined" && typeof window.isGongyi !== "undefined"){
                isGongyi = window.isGongyi;
            }
            else{
                isGongyi = option.isGongyi? true : false;
            }
            logoDom.innerHTML = "&nbsp;";
            logoDom.className=option.className||"bd-logo";
            logoDom.target="_blank";
            if(isGongyi){
                logoDom.href="http://gongyi.baidu.com/";
                logoDom.title="\u767e\u5ea6\u516c\u76ca";                
            }
            else{
                logoDom.href="http://wangmeng.baidu.com/";
                if(option.stuffType == "image" || option.stuffType == "flash"){
                    logoDom.title = "\u63A8\u5E7F\u7528\u6237 : "+option.title
                }else{
                    logoDom.title = "\u767e\u5ea6\u7f51\u76df\u63a8\u5e7f"
                }
            }
            
            var tempFunc = function () {
                logoDom.style.zoom = '1';
            };
            setTimeout(tempFunc, 100);
            return logoDom;
        },


        /**
        根据传入的layoutObject, 渲染页面
        @method paint
        @param {Object} option 参数对象集合
        @param {Object} [option.layoutObj] 布局对象
        */
        paint: function (option) {
            var result = [];
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var layoutObj = option.layoutObj;
            var data = option.data;
            
            var styleCssString = option.styleCssString || "";
            this.idPrefix=fullConfig.idPrefix || "";

            result = this.drawDom(layoutObj);
            this.cssString += styleCssString;
            this.addCssByStyle(this.cssString);

            if (window.ad) {
                window.ad.parentNode.removeChild(window.ad);
                window.ad = null;
            }

            if(option.dom){
                option.dom.appendChild(result)
            }else{
                window.loader = document.getElementById(this.idPrefix+"loader");
                window.ad = result;
                window.loader.parentNode.insertBefore(result, window.loader);
            }

            //<<a id="logo" class="logo" title="推广用户：www.tczlq.com" href="http://wangmeng.baidu.com/" target="_blank">&nbsp;</a>
            //添加推广logo
            if (fullConfig.containerShowLogo) { 
                var logoStyle = "bd-logo";
                if( userConfig.containerLogoStyle ){
                    //如果用户设置了, 则以用户设置的为准
                    logoStyle = userConfig.containerLogoStyle;
                }
                else{
                    //用户未设置, 并且编程未设置, 则自动计算
                    if(fullConfig.containerLogoStyle.toString() === "-1"){
                        if(fullConfig.stuffType==="linkunit1" || fullConfig.stuffType==="iconlinkunit"){
                            logoStyle = "bd-logo2";
                        }
                    }
                }

                var logoOption = { "className": logoStyle, "isGongyi" : fullConfig.isGongyi , title: data[0].surl, stuffType:fullConfig.stuffType};
                result.appendChild(this.drawLogo(logoOption));
            }
            window.loader = window.ad = result = null;

        }

    }
});

declare(function () {
    /**
    样式模板引擎.基于BaiduTemplate开发.支持CSS和HTML部分的模板渲染
    @class StyleTemplate
    @namespace Cpro.Template
    */
    return {
        name:'StyleTemplate',
        namespace: 'Cpro.Template',
        cache: {},
        LEFT_DELIMITER: '<%',
        RIGHT_DELIMITER: '%>',
        
        /**
         * CSS模板函数 
         * @param {string} templateContainerId 模板容器id. 
         * @param {Object} data 模板数据. 
         * @return {undefined} 
         */
        templateCss:function(templateContainerId, data){
            var CssBuilder = using('Cpro.Utility.CssBuilder');
            var templateString = this.template(templateContainerId, data);
            CssBuilder.addCss(templateString);
        },
        
        /**
         * Html模板函数 
         * @param {string} templateContainerId 模板容器id. 
         * @param {Object} data 模板数据. 
         * @return {undefined} 
         */
        templateHtml:function(templateContainerId, data){
            var CssBuilder = using('Cpro.Utility.CssBuilder');
            var templateString = this.template(templateContainerId, data);
            var templateContainer = document.getElementById(templateContainerId);
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = templateString;
            var tempNodes = [];
            for(var i=0, count=tempDiv.childNodes.length; i<count; i++){
                if(tempDiv.childNodes[i] && tempDiv.childNodes[i].nodeType === 1){
                    tempNodes.push(tempDiv.childNodes[i]); 
                }
            }
            
            for(var i=0, count=tempNodes.length; i<count; i++){
               templateContainer.parentNode.insertBefore(tempNodes[i], templateContainer); 
            }    
        },
        
        
        /**
         * 基础模板函数, 用于分析字符串, 解析语法部分. 
         * @param {string} cssString 要加入到页面上的css内容. 
         * @return {boolean}
         */
        template: function (str, data) {

            //检查是否有该id的元素存在，如果有元素则获取元素的innerHTML/value，否则认为字符串为模板
            var compiledFn;
            //判断如果没有document，则为非浏览器环境
            if (!window.document) {
                compiledFn = this.compile(str);
            };

            //HTML5规定ID可以由任何不包含空格字符的字符串组成
            var element = document.getElementById(str);
            if (element) {

                //取到对应id的dom，缓存其编译后的HTML模板函数
                if (this.cache[str]) {
                    compiledFn = this.cache[str];
                };

                //textarea或input则取value，其它情况取innerHTML
                var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
                compiledFn = this.compile(html);

            }
            else {
                //是模板字符串，则生成一个函数
                //如果直接传入字符串作为模板，则可能变化过多，因此不考虑缓存
                compiledFn = this.compile(str);
            };


            //有数据则返回HTML字符串，没有数据则返回函数 支持data={}的情况
            var result = this.isObject(data) ? compiledFn(data) : compiledFn;
            compiledFn = null;
            return result;
        },

        /**
         * 将字符串拼接生成函数，即编译过程(compile) 
         * @param {string} source 待拼接的字符串
         * @return {Function} 字符串拼接函数 
         */
        compile: function (source) {
            var funBody = "var _template_fun_array=[];\nvar fn=(function(data){\nvar _template_varName='';\nfor(name in data){\n_template_varName+=('var '+name+'=data[\"'+name+'\"];');\n};\neval(_template_varName);\n_template_fun_array.push('" + this.analysisStr(source) + "');\n_template_varName=null;\n})(_template_object);\nfn = null;\nreturn _template_fun_array.join('');\n";
            return new Function("_template_object", funBody);
        },

        /**
         * 判断是否是Object类型
         * @param {string} source 要加入到页面上的css内容. 
         * @return {boolean}
         */
        isObject: function (source) {
            return 'function' === typeof source || !! (source && 'object' === typeof source);
        },

        /**
         * 解析模板字符串
         * @param {string} source 待解析的模板字符串
         * @return {string} 
         */
        analysisStr: function (source) {
            var Encoder = using('Cpro.Utility.Encoder');

            //取得分隔符
            var left = this.LEFT_DELIMITER;
            var right = this.RIGHT_DELIMITER;

            //对分隔符进行转义，支持正则中的元字符，可以是HTML注释 <!  !>
            left = Encoder.encodeReg(left);
            right = Encoder.encodeReg(right);

            source = String(source);
            //去掉分隔符中js注释
            source = source.replace(new RegExp("(" + left + "[^" + right + "]*)//.*\n", "g"), "$1");

            //去掉注释内容  <%* 这里可以任意的注释 *%>
            //默认支持HTML注释，将HTML注释匹配掉的原因是用户有可能用 <! !>来做分割符
            source = source.replace(new RegExp("<!--.*?-->", "g"), "");
            source = source.replace(new RegExp(left + "\\*.*?\\*" + right, "g"), "");

            //把所有换行去掉  \r回车符 \t制表符 \n换行符
            source = source.replace(new RegExp("[\\r\\t\\n]", "g"), "");

            //用来处理非分隔符内部的内容中含有 斜杠 \ 单引号 ‘ ，处理办法为HTML转义
            source = source.replace(new RegExp(left + "(?:(?!" + right + ")[\\s\\S])*" + right + "|((?:(?!" + left + ")[\\s\\S])+)", "g"), function (item, $1) {
                var source = '';
                if ($1) {

                    //将 斜杠 单引 HTML转义
                    source = $1.replace(/\\/g, "&#92;").replace(/'/g, '&#39;');
                    while (/<[^<]*?&#39;[^<]*?>/g.test(source)) {

                        //将标签内的单引号转义为\r  结合最后一步，替换为\'
                        source = source.replace(/(<[^<]*?)&#39;([^<]*?>)/g, '$1\r$2')
                    };
                }
                else {
                    source = item;
                }
                return source;
            });

            //定义变量，如果没有分号，需要容错  <%var val='test'%>
            source = source.replace(new RegExp("(" + left + "[\\s]*?var[\\s]*?.*?[\\s]*?[^;])[\\s]*?" + right, "g"), "$1;" + right);

            //对变量后面的分号做容错(包括转义模式 如<%:h=value%>)  <%=value;%> 排除掉函数的情况 <%fun1();%> 排除定义变量情况  <%var val='test';%>   
            source = source.replace(new RegExp("(" + left + ":?[hvu]?[\\s]*?=[\\s]*?[^;|" + right + "]*?);[\\s]*?" + right, "g"), "$1" + right)

            //按照 <% 分割为一个个数组，再用 \t 和在一起，相当于将 <% 替换为 \t
            //将模板按照<%分为一段一段的，再在每段的结尾加入 \t,即用 \t 将每个模板片段前面分隔开   
            source = source.split(left).join("\t");


            //支持用户配置默认是否自动转义
            if (this.ESCAPE) {
                //找到 \t=任意一个字符%> 替换为 ‘，任意字符,'
                //即替换简单变量  \t=data%> 替换为 ',data,'
                //默认HTML转义  也支持HTML转义写法<%:h=value%>  
                source = source.replace(new RegExp("\\t=(.*?)" + right, "g"), "',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'");
            }
            else {
                //默认不转义HTML转义
                source = source.replace(new RegExp("\\t=(.*?)" + right, "g"), "',typeof($1) === 'undefined'?'':$1,'");
            };

            //支持HTML转义写法<%:h=value%> 
            source = source.replace(new RegExp("\\t:h=(.*?)" + right, "g"), "',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'");

            //支持不转义写法 <%:=value%>和<%-value%>
            source = source.replace(new RegExp("\\t(?::=|-)(.*?)" + right, "g"), "',typeof($1)==='undefined'?'':$1,'");

            //支持url转义 <%:u=value%>
            source = source.replace(new RegExp("\\t:u=(.*?)" + right, "g"), "',typeof($1)==='undefined'?'':encodeURIComponent($1),'");

            //支持UI 变量使用在HTML页面标签onclick等事件函数参数中  <%:v=value%>
            source = source.replace(new RegExp("\\t:v=(.*?)" + right, "g"), "',typeof($1)==='undefined'?'':baidu.template._encodeEventHTML($1),'");

            //将字符串按照 \t 分成为数组，在用'); 将其合并，即替换掉结尾的 \t 为 ');
            //在if，for等语句前面加上 '); ，形成 ');if  ');for  的形式
            source = source.split("\t").join("');");

            //将 %> 替换为_template_fun_array.push('
            //即去掉结尾符，生成函数中的push方法
            //如：if(list.length=5){%><h2>',list[4],'</h2>');}
            //会被替换为 if(list.length=5){_template_fun_array.push('<h2>',list[4],'</h2>');}
            source = source.split(right).join("_template_fun_array.push('");

            //*将 "\r" 替换为 "\"
            source = source.split("\r").join("\\'");

            return source;

        }
    };
});

declare(function () {
    /**
    模板参数管理类
    @class TemplateVariableManager
    @namespace UI.Template
    */
    return {
        name: 'TemplateVariableManager',
        namespace: 'Cpro.Template',

        /**
        获取参数的全名
        @method getFullName
        */
        getFullName: function (shortName) {
            return this.nameMapping[shortName];
        },

        /**
        获取转换为了全名参数的配置文件
        返回一个用作mapping的object. 这个object有两个作用. 一个是编程时使用fullName获取到用户的设置值, 
        还以判断用户是否传递了参数,以便在需要的时候决定是否使用默认值.
        @method getFullNameConfig
        */
        getFullNameConfig: function (userConfig) {
            var result = {};
            var paramFullName;
            var paramValue;
            var lowerCaseConfig = {};
            for (key in userConfig) {
                if (!key || (typeof userConfig[key] === "undefined")) {
                    continue;
                }

                paramFullName = this.getFullName(key.toLowerCase());
                paramValue = userConfig[key];

                //对于string类型, 一般是颜色参数要特殊处理, 去掉"#"号
                if (typeof paramValue === "string") {
                    paramValue = decodeURIComponent(paramValue).replace("#", "");
                }

                if (paramFullName) {
                    result[paramFullName] = paramValue;
                }
                else {
                    //未定义参数, 不进行名字转换
                    result[key] = paramValue;
                }

                lowerCaseConfig[key.toLowerCase()] = paramValue;
            }
            userConfig = lowerCaseConfig;

            //特殊处理hn和wn参数
            if (!userConfig.column && userConfig.wn) {
                result.adColumnCount = parseInt(userConfig.wn);
            }
            if (!userConfig.row && userConfig.hn) {
                result.adRowCount = parseInt(userConfig.hn);
            }

            //特殊处理容器宽高
            if (userConfig.conw && userConfig.conw > 0) {
                result.templateWidth = userConfig.conw;
            }
            if (userConfig.conh && userConfig.conh > 0) {
                result.templateHeight = userConfig.conh;
            }

            //特殊处理容器边框
            if (typeof result.containerBorderWidth !== "undefined") {
                result.containerBorderTop = parseInt(result.containerBorderWidth);
                result.containerBorderRight = parseInt(result.containerBorderWidth);
                result.containerBorderBottom = parseInt(result.containerBorderWidth);
                result.containerBorderLeft = parseInt(result.containerBorderWidth);
            }
            
            return result;
        },


        /**
        获取所有参数列表
        @method getFullName
        @static
        */
        getVariables: function (userConfig) {
            var fullConfig = {};
            var defaultValueManager = using("Cpro.Template.DefaultValueManager");

            //从defaultValueManager类中, 根据当前用户的请求配置, 获取本次请求的默认值. 
            var defaultValue = defaultValueManager.getDefaultValue(userConfig);

            //使用用户设置的值替换默认值 
            var paramValue;
            for (key in userConfig) {
                if (key && (typeof userConfig[key] !== "undefined")) {
                    paramValue = userConfig[key];
                    if (typeof paramValue === "string") {
                        paramValue = decodeURIComponent(paramValue).replace("#", "");
                    }
                    if (paramValue !== "") {
                        defaultValue[key] = userConfig[key];
                    }
                }
            }

            return defaultValue;
        },
        /**
        保存参数"缩写"->"全名"的映射关系
        @property nameMapping
        @type Obejct    
         */
        nameMapping: {
            "n": "userChargingId",
            "rsi0": "templateWidth",
            "rsi1": "templateHeight",
            "at": "adDataType",
            "row": "adRowCount",
            "column": "adColumnCount",
            "rsi5": "keywordIsFlush",
            "rss6": "keywordFlushColor",
            "rad": "isShowUnrelated",
            "cad": "isShowPublicAd",
            "isgongyi": "isGongyi",
            "rss7": "backupColor",
            "aurl": "backupUrl",
            "displaytype": "displayType",
            "stufftype": "stuffType",
            "layout": "layout",
            "scale":"scale",
            "rss0": "containerBorderColor",
            "conbw": "containerBorderWidth",
            "conbt": "containerBorderTop",
            "conbr": "containerBorderRight",
            "conbb": "containerBorderBottom",
            "conbl": "containerBorderLeft",
            "conbs": "containerBorderStyle",
            "rss1": "containerBackgroundColor",
            "conpl": "containerPaddingLeft",
            "conpr": "containerPaddingRight",
            "conpt": "containerPaddingTop",
            "conpb": "containerPaddingBottom",
            "conop": "containerOpacity",
            "consl": "containerShowLogo",
            "conw": "containerWidth",
            "conh": "containerHeight",
            "conhhf": "containerHideHeaderFooter",
            "conf": "containerFloat",
            "conls": "containerLogoStyle",
            "itepl": "itemPaddingLeft",
            "itepr": "itemPaddingRight",
            "itept": "itemPaddingTop",
            "itepb": "itemPaddingBottom",
            "iteva": "itemVerticalAlign",
            "itecs": "itemColumnSpace",
            "itecb": "itemColumnBackgroundColor",
            "itecbw": "itemColumnBorderWidth",
            "itecbs": "itemColumnBorderStyle",
            "itecbc": "itemColumnBorderColor",
            "itecpt": "itemColumnPaddingTop",
            "itecpl": "itemColumnPaddingLeft",
            "itecpr": "itemColumnPaddingRight",
            "itecpb": "itemColumnPaddingBottom",
            "itecmt": "itemColumnMarginTop",
            "itecml": "itemColumnMarginLeft",
            "itecmr": "itemColumnMarginRight",
            "itecmb": "itemColumnMarginBottom",
            "iters": "itemRowSpace",
            "iterbw": "itemRowBorderWidth",
            "iterbs": "itemRowBorderStyle",
            "iterbc": "itemRowBorderColor",
            "iterpt": "itemRowPaddingTop",
            "iterpl": "itemRowPaddingLeft",
            "iterpr": "itemRowPaddingRight",
            "iterpb": "itemRowPaddingBottom",
            "iteri": "itemRightImage",
            "iteris": "itemRightImageSrc",
            "iteriw": "itemRightImageWidth",
            "iterih": "itemRightImageHeight",
            "iteript": "itemRightImagePaddingTop",
            "iteripl": "itemRightImagePaddingLeft",
            "iteripr": "itemRightImagePaddingRight",
            "iteripb": "itemRightImagePaddingBottom",
            "logis": "logoIsShow",
            "logpl": "logoPaddingLeft",
            "logpr": "logoPaddingRight",
            "logpt": "logoPaddingTop",
            "logpb": "logoPaddingBottom",
            "blogpl": "brandLogoPaddingLeft",
            "blogpr": "brandLogoPaddingRight",
            "blogpt": "brandLogoPaddingTop",
            "blogpb": "brandLogoPaddingBottom",
            "rss2": "titleFontColor",
            "titff": "titleFontFamily",
            "titfs": "titleFontSize",
            "titl": "titleLength",
            "titse": "titleIsShowEllipsis",
            "titis": "titleIsShow",
            "titrc": "titleRowCount",
            "titpl": "titlePaddingLeft",
            "titpr": "titlePaddingRight",
            "titpt": "titlePaddingTop",
            "titpb": "titlePaddingBottom",
            "titsu": "titleShowUnderline",
            "titlh": "titleLineHeight",
            "titw": "titleWidth",
            "titfw": "titleFontWeight",
            "titbc": "titleBackgroundColor",
            "tithfc": "titleHoverFontColor",
            "tithsu": "titleHoverShowUnderline",
            "tithbc": "titleHoverBackgroundColor",
            "titvfc": "titleVisitedFontColor",
            "titvsu": "titleVisitedShowUnderline",
            "titvbc": "titleVisitedBackgroundColor",
            "titafc": "titleActiveFontColor",
            "titasu": "titleActiveShowUnderline",
            "titabc": "titleActiveBackgroundColor",
            "titta": "titleTextAlign",
            "titfis": "titleFrontIconSrc",
            "titfiw": "titleFrontIconWidth",
            "titfih": "titleFrontIconHeight",
            "titfil": "titleFrontIconPaddingLeft",
            "titfip": "titleFrontIconPaddingRight",
            "rss3": "descFontColor",
            "desff": "descFontFamily",
            "desfs": "descFontSize",
            "desl": "descLength",
            "desse": "descIsShowEllipsis",
            "desis": "descIsShow",
            "desrc": "descRowCount",
            "despl": "descPaddingLeft",
            "despr": "descPaddingRight",
            "despt": "descPaddingTop",
            "despb": "descPaddingBottom",
            "dessu": "descShowUnderline",
            "deslh": "descLineHeight",
            "desw": "descWidth",
            "desfw": "descFontWeight",
            "desbc": "descBackgroundColor",
            "deshfc": "descHoverFontColor",
            "deshsu": "descHoverShowUnderline",
            "deshbc": "descHoverBackgroundColor",
            "desvfc": "descVisitedFontColor",
            "desvsu": "descVisitedShowUnderline",
            "desvbc": "descVisitedBackgroundColor",
            "desafc": "descActiveFontColor",
            "desasu": "descActiveShowUnderline",
            "desabc": "descActiveBackgroundColor",
            "desta": "descTextAlign",
            "rss4": "urlFontColor",
            "urlff": "urlFontFamily",
            "urlfs": "urlFontSize",
            "urll": "urlLength",
            "urlse": "urlIsShowEllipsis",
            "urlis": "urlIsShow",
            "urlpl": "urlPaddingLeft",
            "urlpr": "urlPaddingRight",
            "urlpt": "urlPaddingTop",
            "urlpb": "urlPaddingBottom",
            "urlsu": "urlShowUnderline",
            "urlrc": "urlRowCount",
            "urllh": "urlLineHeight",
            "urlw": "urlWidth",
            "urlfw": "urlFontWeight",
            "urlbc": "urlBackgroundColor",
            "urlre": "urlReplace",
            "urlhfc": "urlHoverFontColor",
            "urlhsu": "urlHoverShowUnderline",
            "urlhbc": "urlHoverBackgroundColor",
            "urlvfc": "urlVisitedFontColor",
            "urlvsu": "urlVisitedShowUnderline",
            "urlvbc": "urlVisitedBackgroundColor",
            "urlafc": "urlActiveFontColor",
            "urlasu": "urlActiveShowUnderline",
            "urlabc": "urlActiveBackgroundColor",
            "urlta": "urlTextAlign"
        }
    };
});

declare(function () {
    return {
        name: 'VerticalAlignHelper',
        namespace: 'Cpro.Template',
        /**
         * 纯文字布局对应居中功能. 目前支持top, middle,bottom. 如果是top或-1则不作任何处理.
         * @method text 
         */
        text: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var layoutObj = option.layoutObj;
            var data = option.data;
            var cssBuilder = using("Cpro.Utility.CssBuilder");
            var verticalAlign = fullConfig.itemVerticalAlign.toString().toLowerCase();

            if (verticalAlign === "-1" || verticalAlign === "top") {
                return;
            }

            //获取广告容器
            var containerId = layoutObj.props.id ? layoutObj.props.id : "container";
            var container = document.getElementById(containerId);
            var idPrefix = fullConfig.idPrefix || "";

            for (var i = 0, count = container.childNodes.length; i < count; i++) {
                var itemDom = container.childNodes[i];
                if (itemDom.className !== idPrefix + "item") {
                    continue;
                }
                var itemWidth = parseInt(cssBuilder.getStyle(itemDom, "width").replace("px", ""));
                var itemHeight = parseInt(cssBuilder.getStyle(itemDom, "height").replace("px", ""));

                //计算内容的高度
                var itemContentHeight = 0;
                var itemContentWidthIndex = 0;
                var itemContentMaxHeightIndex = 0;
                for (var j = 0, jcount = itemDom.childNodes.length; j < jcount; j++) {
                    var itemChild = itemDom.childNodes[j];
                    itemContentHeight += itemChild.offsetHeight;
                }

                if (itemHeight > 0 && itemContentHeight > 0 && itemHeight > itemContentHeight) {
                    if (verticalAlign === "middle") {
                        var tempPaddingTop = Math.floor((itemHeight - itemContentHeight) / 2);
                        itemDom.style.paddingTop = tempPaddingTop + "px";
                        itemDom.style.height = (itemHeight - tempPaddingTop) + "px";
                    }
                    else if (verticalAlign === "bottom") {
                        var tempPaddingTop = Math.floor(itemHeight - itemContentHeight);
                        itemDom.style.paddingTop = tempPaddingTop + "px";
                        itemDom.style.height = (itemHeight - tempPaddingTop) + "px";
                    }
                }
            }

        },

        /**
         * 获取目标元素的样式值
         * 
         * @returns {string} 目标元素的样式值
         */
        getStyle: function (element, styleName) {
            var result;
            element = this.g(element);
            var doc = this.getDocument(element);
            // ie9下获取到的样式名称为: backgroundColor
            // 其他标准浏览器下样式为: background-color
            // 分别使用这两个名字尝试获取样式信息
            var styleNameOther = "";
            if (styleName.indexOf("-") > -1) {
                styleNameOther = styleName.replace(/[-_][^-_]{1}/g, function (
                match) {
                    return match.charAt(1).toUpperCase();
                });
            }
            else {
                styleNameOther = styleName.replace(/[A-Z]{1}/g,

                function (match) {
                    return "-" + match.charAt(0).toLowerCase();
                });
            }

            // 优先使用w3c标准的getComputedStyle方法, 在ie6,7,8下使用currentStyle
            var elementStyle;
            if (doc && doc.defaultView && doc.defaultView.getComputedStyle) {
                elementStyle = doc.defaultView.getComputedStyle(element, null);
                if (elementStyle) {
                    result = elementStyle.getPropertyValue(styleName);
                }
                if (typeof result !== "boolean" && !result) {
                    result = elementStyle.getPropertyValue(styleNameOther);
                }
            }
            else if (element.currentStyle) { // ie6,7,8使用currentStyle
                elementStyle = element.currentStyle;
                if (elementStyle) {
                    result = elementStyle[styleName];
                }
                if (typeof result !== "boolean" && !result) {
                    result = elementStyle[styleNameOther];
                }
            }

            return result;
        }
    }
});

declare(function () {
    /**
    布局引擎基础类
    @class BaseLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: 'Base',
        namespace: 'Cpro.Template.LayoutEngine',
        /**
        获取CssName, 允许添加前缀
        @method GetCssName
        @return {String} CssName字符串
        */
        GetCssName: function (name, option) {
            var result = name;
            if (option.idPrefix) {
                result = option.idPrefix + result;
            }
            return result;
        },

        /**
        container的布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutContainer: function (width, height, option) {
            var container = {
                style: {},
                content: [],
                dataType: "layout",
                domName: "div",
                cssName: this.GetCssName("container", option)
            };
            var style = container.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.containerPaddingLeft);
            style["padding-right"] = parseInt(option.containerPaddingRight);
            style["padding-top"] = parseInt(option.containerPaddingTop);
            style["padding-bottom"] = parseInt(option.containerPaddingBottom);
            style["border-style"] = option.containerBorderStyle;
            style["border-top-width"] = option.containerBorderTop;
            style["border-right-width"] = option.containerBorderRight;
            style["border-bottom-width"] = option.containerBorderBottom;
            style["border-left-width"] = option.containerBorderLeft;
            style["border-color"] = "#" + option.containerBorderColor.replace("#", "");
            style["width"] = width - style["padding-left"] - style["padding-right"] - style["border-right-width"] - style["border-left-width"];
            style["height"] = height - style["padding-top"] - style["padding-bottom"] - style["border-top-width"] - style["border-bottom-width"];
            style["background-color"] = "#" + option.containerBackgroundColor.replace("#", "");
            if (parseInt(option.containerOpacity) == 1) {
                style["background-color"] = "transparent";
            }
            style["position"] = "relative";
            style["overflow"] = "hidden";
            container.props = {
                id: option.idPrefix ? (option.idPrefix + "container") : "container"
            };
            style["float"] = option.containerFloat;
            return container;
        },


        /**
        item容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutItem: function (width, height, option) {
            var item = {
                style: {},
                content: [],
                dataType: "layout",
                domName: "div",
                cssName: this.GetCssName("item", option)
            };
            var style = item.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.itemPaddingLeft);
            style["padding-right"] = parseInt(option.itemPaddingRight);
            style["padding-top"] = parseInt(option.itemPaddingTop);
            style["padding-bottom"] = parseInt(option.itemPaddingBottom);
            style["width"] = Math.floor(style["outer-width"] - style["padding-left"] - style["padding-right"]);
            style["height"] = Math.floor(style["outer-height"] - style["padding-top"] - style["padding-bottom"]);
            style["float"] = "left";
            style["overflow"] = "hidden";
            style["text-align"] = option.itemTextAlign || "left";
            //=========公益广告的特殊处理==========
            if (typeof isGongyi !== "undefined" && isGongyi && (option.stuffType === "text" || option.stuffType === "tuwen")) {
                //对item做特殊处理, 限制最大高度和宽度 
                style["width"] = style["width"] > 250 ? 250 : style["width"];
                style["height"] = style["height"] > 90 ? 90 : style["height"];
                style["padding-left"] = style["padding-left"] + ((width - style["width"]) / 2);
                style["padding-top"] = style["padding-top"] + ((height - style["height"]) / 2);
            }
            return item;
        },
        /**
        icon容器布局函数 
        @method layoutIcon
        @return {Object} 布局对象
        */
        layoutIcon: function(width, height, option) {
            var icon = {
                style: {},
                content: [],
                dataType: "icon",
                domName: "div",
                dataKey: "icon",
                enableClick: option.iconLinkUnitConfig.enableClick
            };
            var style = icon.style;
            style["padding-left"] = parseInt(option.titleFrontIconPaddingLeft) || 0;
            style["padding-right"] = parseInt(option.titleFrontIconPaddingRight) || 0;
            style["padding-top"] = parseInt(option.titleFrontIconPaddingTop) || 0;
            style["padding-bottom"] = parseInt(option.titleFrontIconPaddingBottom) || 0;
            style.width = width;
            style.height = height;
            style["float"] = "left";
            return icon;
        },
        /**
        item右边图片容器布局函数 
        @method layoutRightImage
        @return {Object} 布局对象
        */
        layoutRightImage: function(width, height, itemWidth, itemHeight ,option) {
            var image = {
                style: {},
                content: [],
                dataType: "text",
                domName: "div",
                cssName: this.GetCssName("itemRightImage", option),
                dataKey: "rightimage"
            };
            var style = image.style;
            style.width = width;
            style.height = height;
            style["position"] = "absolute";
            style.overflow = "hidden";
            if(option.templateWidth <= 180){ //如果宽度小于180，则箭头在广告的下方，否则，在广告的右方
                style["right"] = (option.itemRightImagePaddingRight || (itemWidth -width)/2) + "px";
                style["bottom"] = option.itemRightImagePaddingBottom  + "px";
            }else{
                style["right"] = option.itemRightImagePaddingRight + "px";
                style["top"] = (option.itemRightImagePaddingTop || (itemHeight -height)/2) + "px";
            }
            return image

        },
        /**
        title容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutTitle: function (width, height, option, floatDirection) {
            var title = {
                style: {},
                content: [],
                dataType: "text",
                domName: "div",
                cssName: this.GetCssName("title", option),
                dataKey: "title"
            };
            var style = title.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.titlePaddingLeft);
            style["padding-right"] = parseInt(option.titlePaddingRight);
            style["padding-top"] = parseInt(option.titlePaddingTop);
            style["padding-bottom"] = parseInt(option.titlePaddingBottom);
            style["line-height"] = this.calculateTitleLineHeight(option);
            style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
            style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
            style["overflow"] = "hidden";
            style["font-size"] = option.titleFontSize;
            style["font-family"] = option.titleFontFamily;
            style["text-align"] = option.titleTextAlign;
            style["color"] = "#" + option.titleFontColor.replace("#", "");
            style["text-decoration"] = option.titleShowUnderline ? "underline" : "none";
            style["font-weight"] = option.titleFontWeight;
            title.rowCount = option.titleRowCount > 0 ? option.titleRowCount : this.calculateTitleRowCount(height, option);
            title.showEllipsis = option.titleIsShowEllipsis;
            if (floatDirection) {
                style["float"] = floatDirection;
            }
            if (option.titleHoverFontColor.toString() !== "-1" || option.titleHoverShowUnderline.toString() !== "-1" || option.titleHoverBackgroundColor.toString() !== "-1") {
                var styleHover = title.styleHover = {};
                if (option.titleHoverFontColor.toString() !== "-1") {
                    styleHover["color"] = "#" + option.titleHoverFontColor.toString().replace("#", "");
                }
                if (option.titleHoverShowUnderline.toString() !== "-1") {
                    styleHover["text-decoration"] = option.titleHoverShowUnderline ? "underline" : "none";
                }
                if (option.titleHoverBackgroundColor.toString() !== "-1") {
                    styleHover["background-color"] = "#" + option.titleHoverBackgroundColor.toString().replace("#", "");
                }
            }

            return title;
        },


        /**
        url容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutUrl: function (width, height, option, floatDirection) {
            var url = {
                style: {},
                content: [],
                dataType: "text",
                domName: "div",
                cssName: this.GetCssName("url", option),
                dataKey: "surl"
            };
            var style = url.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.urlPaddingLeft);
            style["padding-right"] = parseInt(option.urlPaddingRight);
            style["padding-top"] = parseInt(option.urlPaddingTop);
            style["padding-bottom"] = parseInt(option.urlPaddingBottom);
            style["line-height"] = this.calculateUrlLineHeight(option);
            style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
            style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
            style["overflow"] = "hidden";
            style["font-size"] = option.urlFontSize;
            style["font-family"] = option.urlFontFamily;
            style["text-align"] = option.urlTextAlign;
            style["color"] = "#" + option.urlFontColor.replace("#", "");
            style["float"] = "left";
            style["text-decoration"] = option.urlShowUnderline ? "underline" : "none";
            style["font-weight"] = option.urlFontWeight;
            url.rowCount = option.urlRowCount > 0 ? option.urlRowCount : 1;
            url.showEllipsis = option.urlIsShowEllipsis;
            if (floatDirection) {
                style["float"] = floatDirection;
            }
            
            if (option.urlHoverFontColor.toString() !== "-1" || option.urlHoverShowUnderline.toString() !== "-1" || option.urlHoverBackgroundColor.toString() !== "-1") {
                var styleHover = url.styleHover = {};
                if (option.urlHoverFontColor.toString() !== "-1") {
                    styleHover["color"] = "#" + option.urlHoverFontColor.toString().replace("#", "");
                }
                if (option.urlHoverShowUnderline.toString() !== "-1") {
                    styleHover["text-decoration"] = option.urlHoverShowUnderline ? "underline" : "none";
                }
                if (option.urlHoverBackgroundColor.toString() !== "-1") {
                    styleHover["background-color"] = "#" + option.urlHoverBackgroundColor.toString().replace("#", "");
                }
            }
            
            return url;
        },


        /**
        desc容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutDesc: function (width, height, option, floatDirection) {
            var desc = {
                style: {},
                content: [],
                dataType: "text",
                domName: "div",
                cssName: this.GetCssName("desc", option),
                dataKey: "desc"
            };
            var style = desc.style;
            //style["word-wrap"] = "break-word";
            //style["word-break"] = "break-all";
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.descPaddingLeft);
            style["padding-right"] = parseInt(option.descPaddingRight);
            style["padding-top"] = parseInt(option.descPaddingTop);
            style["padding-bottom"] = parseInt(option.descPaddingBottom);
            style["line-height"] = this.calculateDescLineHeight(option);
            style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
            style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
            style["overflow"] = "hidden";
            style["font-size"] = option.descFontSize;
            style["font-family"] = option.descFontFamily;
            style["text-align"] = option.descTextAlign;
            style["color"] = "#" + option.descFontColor.replace("#", "");
            style["float"] = "left";
            style["text-decoration"] = option.descShowUnderline ? "underline" : "none";
            style["font-weight"] = option.descFontWeight;
            //显示几行, 如果值为-1表示自动计算, 否则以用户设置的为准.
            desc.rowCount = option.descRowCount > 0 ? option.descRowCount : this.calculateDescRowCount(height, option);
            desc.showEllipsis = option.descIsShowEllipsis;
            if (floatDirection) {
                style["float"] = floatDirection;
            }
            
            if (option.descHoverFontColor.toString() !== "-1" || option.descHoverShowUnderline.toString() !== "-1" || option.descHoverBackgroundColor.toString() !== "-1") {
                var styleHover = desc.styleHover = {};
                if (option.descHoverFontColor.toString() !== "-1") {
                    styleHover["color"] = "#" + option.descHoverFontColor.toString().replace("#", "");
                }
                if (option.descHoverShowUnderline.toString() !== "-1") {
                    styleHover["text-decoration"] = option.descHoverShowUnderline ? "underline" : "none";
                }
                if (option.descHoverBackgroundColor.toString() !== "-1") {
                    styleHover["background-color"] = "#" + option.descHoverBackgroundColor.toString().replace("#", "");
                }
            }
            
            return desc;
        },

        /**
        logo容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutLogo: function (width, height, option) {
            var logo = {
                style: {},
                content: [],
                dataType: "image",
                domName: "div",
                cssName: this.GetCssName("logo", option),
                dataKey: "res"
            };
            var style = logo.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.logoPaddingLeft);
            style["padding-right"] = parseInt(option.logoPaddingRight);
            style["padding-top"] = parseInt(option.logoPaddingTop);
            style["padding-bottom"] = parseInt(option.logoPaddingBottom);
            style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
            style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
            style["float"] = "left";
            style["overflow"] = "hidden";
            return logo;
        },

		/**
        brandLogo容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutBrandLogo: function (width, height, option, floatDirection) {
            var brandLogo = {
                style: {},
                content: [],
                dataType: "image",
                domName: "div",
                cssName: this.GetCssName("brandLogo", option),
                dataKey: "brand"
            };
            var style = brandLogo.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.brandLogoPaddingLeft);
            style["padding-right"] = parseInt(option.brandLogoPaddingRight);
            style["padding-top"] = parseInt(option.brandLogoPaddingTop);
            style["padding-bottom"] = parseInt(option.brandLogoPaddingBottom);
            style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
            style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
            style["overflow"] = "hidden";
			
			if (floatDirection) {
                style["float"] = floatDirection;
            }
            return brandLogo;
        },
		
        /**
        container的布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutImage: function (width, height, option) {
            var image = {
                style: {},
                content: [],
                dataType: "image",
                domName: "div",
                cssName: this.GetCssName("image", option),
                dataKey: "res"
            };
            var style = image.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.imagePaddingLeft) || 0;
            style["padding-right"] = parseInt(option.imagePaddingRight) || 0;
            style["padding-top"] = parseInt(option.imagePaddingTop) || 0;
            style["padding-bottom"] = parseInt(option.imagePaddingBottom) || 0;
            style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
            style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
            style["float"] = "left";
            style["overflow"] = "hidden";
            return image;
        },

        /**
        flash元素的布局函数 
        @method layoutFlash
        @return {Object} 布局对象
        */
        layoutFlash: function (width, height, option) {
            var flash = {
                style: {},
                content: [],
                dataType: "flash",
                domName: "div",
                cssName: this.GetCssName("flash", option),
                dataKey: "res"
            };
            var style = flash.style;
            style["outer-width"] = width;
            style["outer-height"] = height;
            style["padding-left"] = parseInt(option.flashPaddingLeft) || 0;
            style["padding-right"] = parseInt(option.flashPaddingRight) || 0;
            style["padding-top"] = parseInt(option.flashPaddingTop) || 0;
            style["padding-bottom"] = parseInt(option.flashPaddingBottom) || 0;
            style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
            style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
            style["float"] = "left";
            style["overflow"] = "hidden";
            return flash;
        },

        /**
        列间距元素 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutColumnSpace: function (width, height, option) {
            var columnSpace = {
                style: {},
                content: [],
                dataType: "layout",
                domName: "div",
                cssName: this.GetCssName("itemColumnSpace", option)
            };
            var style = columnSpace.style;
            style["width"] = width;
            style["height"] = height  - option.itemColumnMarginTop - option.itemColumnMarginBottom;
            style["float"] = "left";
            style["overflow"] = "hidden";
            style["margin-top"] = option.itemColumnMarginTop;
            style["margin-bottom"] = option.itemColumnMarginBottom;
            if(option.itemColumnBackgroundColor){
                 style["background-color"] = "#" + option.itemColumnBackgroundColor;
            }
            if (option.itemColumnBorderWidth) {
                //间距元素需要添加横线 option.itemRowBorderWidth
                var line = {
                    style: {},
                    content: [],
                    dataType: "layout",
                    domName: "div",
                    cssName: this.GetCssName("itemColumnSpaceLine", option)
                };

                line.style["width"] = 1;
                line.style["height"] = height;
                line.style["border-style"] = option.itemColumnBorderStyle;
                if( option.itemColumnBorderColor.toString() === "-1"){
                    line.style["border-color"] = "#" + option.containerBorderColor;
                }
                else{
                    line.style["border-color"] = "#" + option.itemColumnBorderColor;
                }
                line.style["border-width"] = 0;
                line.style["border-left-width"] = option.itemColumnBorderWidth;
                line.style["margin-left"] = Math.floor(width / 2) - 1;
                line.style["overflow"] = "hidden";
                columnSpace.content.push(line);
            }

            return columnSpace;
        },

        /**
        行间距元素 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutRowSpace: function (width, height, option) {
            var rowSpace = {
                style: {},
                content: [],
                dataType: "layout",
                domName: "div",
                cssName: this.GetCssName("itemRowSpace", option)
            };

            var style = rowSpace.style;
            style["width"] = width;
            style["height"] = height;
            style["clear"] = "both";
            style["overflow"] = "hidden";

            if (option.itemRowBorderWidth) {
                //间距元素需要添加横线 option.itemRowBorderWidth
                var line = {
                    style: {},
                    content: [],
                    dataType: "layout",
                    domName: "div",
                    cssName: this.GetCssName("itemRowSpaceLine", option)
                };

                line.style["width"] = width;
                line.style["height"] = 1;
                line.style["border-style"] = option.itemRowBorderStyle;
                if( option.itemRowBorderColor.toString() === "-1"){
                    line.style["border-color"] = "#" + option.containerBorderColor;
                }
                else{
                    line.style["border-color"] = "#" + option.itemRowBorderColor;
                }
                line.style["border-width"] = 0;
                line.style["border-top-width"] = option.itemRowBorderWidth;
                line.style["margin-top"] = Math.floor(height / 2) - 1;
                line.style["overflow"] = "hidden";
                rowSpace.content.push(line);
            }

            return rowSpace;
        },

        /**
        为container添加item, 以及行距和列距元素 
        @method layoutContainer
        @return {Object} 布局对象
        */
        layoutSpace: function (container, item, option) {
            //行间距元素和列间距元素 
            var columnSpace = this.layoutColumnSpace(option.itemColumnSpace, item.style["height"], option);
            var rowSpace = this.layoutRowSpace(container.style["width"], option.itemRowSpace, option);
            //组织container 
            var rowIndex, columnIndex;
            for (rowIndex = 0;
            rowIndex < option.adRowCount;
            rowIndex++) {
                for (columnIndex = 0;
                columnIndex < option.adColumnCount;
                columnIndex++) {
                    container.content.push(item);
                    //非最后一列, 添加列间距元素 
                    if (columnIndex != option.adColumnCount - 1) {
                        container.content.push(columnSpace);
                    }
                }
                //非最后一行, 添加行间距元素 
                if (rowIndex != option.adRowCount - 1) {
                    container.content.push(rowSpace);
                }
            }
            return container;
        },

        calculateLogo: function (parentWidth, parentHeight, option) {
            var result = {
                height: 0,
                width: 0
            };
            result.height = parentHeight > 64 ? 64 : parentHeight;
            result.width = result.height + option.logoPaddingLeft + option.logoPaddingRight;
            return result;
        },
        calculateImage: function (parentWidth, parentHeight, option) {
            var result = {
                height: 0,
                width: 0
            };
            result.height = parentHeight;
            result.width = parentWidth;
            return result;
        },
        calculateFlash: function (parentWidth, parentHeight, option) {
            var result = {
                height: 0,
                width: 0
            };
            result.height = parentHeight;
            result.width = parentWidth;
            return result;
        },
        calculateTitle: function (parentWidth, parentHeight, option) {
            var result = {
                height: 0,
                width: 0
            };
            result.width = option.titleWidth !== -1 ? option.titleWidth : parentWidth - option.titleFrontIconWidth;
            var titleLineHeight = this.calculateTitleLineHeight(option);
            var defaultTitleRowCount = 1;
            if ((parentHeight > 60 && parentWidth <= 120) || (parentHeight > 110 && parentWidth <= 180)) {
                defaultTitleRowCount = 2;
            }
            var titleRowCount = option.titleRowCount > 0 ? option.titleRowCount : defaultTitleRowCount;
            result.height = titleLineHeight * titleRowCount + option.titlePaddingTop + option.titlePaddingBottom;
            return result;
        },
        calculateUrl: function (parentWidth, parentHeight, option) {
            var result = {
                height: 0,
                width: 0
            };
            result.width = parentWidth;
            var urlLineHeight = this.calculateUrlLineHeight(option);
            var urlRowCount = option.urlRowCount > 0 ? option.urlRowCount : 1;
            result.height = urlLineHeight * urlRowCount + option.urlPaddingTop + option.urlPaddingBottom;
            return result;
        },
        calculateTitleRowCount: function (outerHeight, option) {
            var result;
            var titleLineHeight = this.calculateTitleLineHeight(option);
            //预留的高度足够时, 最多显示两行title
            result = Math.floor((outerHeight - option.titlePaddingTop - option.titlePaddingBottom) / titleLineHeight);
            result = result >= 2 ? 2 : result;
            return result;
        },
        calculateDescRowCount: function (outerHeight, option) {
            var result;
            var descLineHeight = this.calculateDescLineHeight(option);
            result = Math.floor((outerHeight - option.descPaddingTop - option.descPaddingBottom) / descLineHeight);
            //最大行数为4
            result = result > 4 ? 4 : result;
            return result;
        },
        calculateTitleLineHeight: function (option) {
            var result = option.titleLineHeight > 0 ? option.titleLineHeight : option.titleFontSize + 2;
            return result;
        },
        calculateDescLineHeight: function (option) {
            var result = option.descLineHeight > 0 ? option.descLineHeight : option.descFontSize + 2;
            return result;
        },
        calculateUrlLineHeight: function (option) {
            var result = option.urlLineHeight > 0 ? option.urlLineHeight : option.urlFontSize + 2;
            return result;
        }
    }
});

declare(function () {
    /**
    嵌入式-Flash 布局引擎
    @class TextLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name:'Flash',
        namespace: 'Cpro.Template.LayoutEngine',

        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");

            //container
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);
            if (fullConfig.adRowCount == 1 && fullConfig.adColumnCount == 1) {
                container.style["text-align"] = "center";
            }

            //item
            var itemWidth = Math.floor((container.style["width"] - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);

            //flash
            var flashLayout = engine.calculateFlash(item.style["width"], item.style["height"], fullConfig);
            var flashWidth = flashLayout.width;
            var flashHeight = flashLayout.height;
            var flash = engine.layoutFlash(flashWidth, flashHeight, fullConfig);
            layoutIndex[flash.dataKey] = flash;


            //组装item
            item.content.push(flash);


            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(fullConfig.itemColumnSpace, itemHeight, fullConfig);
            var rowSpace = engine.layoutRowSpace(itemWidth, fullConfig.itemRowSpace, fullConfig);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, fullConfig);

            container.layoutIndex = layoutIndex;
            return container;
        }
    };
});

declare(function () {
    /**
    嵌入式-文字 布局引擎
    @class LinkUnit1LayoutEngine
    @namespace $baseName.UI.Template
    */
    return IconLinkUnitLayoutEngine = {
        name:'IconLinkUnit',
        namespace: 'Cpro.Template.LayoutEngine',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");
            
            // container
            fullConfig.containerPaddingLeft = 0;
            fullConfig.containerPaddingRight = 0;
            fullConfig.containerPaddingTop = 0;
            fullConfig.containerPaddingBottom = 0;
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);
            if (fullConfig.adRowCount == 1) {
                container.style["text-align"] = "center";
            }
            
            //title
            fullConfig.titlePaddingLeft = 0;
            fullConfig.titlePaddingRight = 0;
            fullConfig.titlePaddingTop = 0;
            fullConfig.titlePaddingBottom = 0;
            var titleWidth = 7 * fullConfig.titleFontSize;
            var titleHeight = fullConfig.titleFontSize + 4;
            fullConfig.titleLineHeight = fullConfig.titleFontSize + 4;
            fullConfig.titleFontFamily = decodeURIComponent(fullConfig.titleFontFamily);//解码汉字
            if(fullConfig.titleFontFamily !== decodeURIComponent("%E5%AE%8B%E4%BD%93")){ //增加默认字体
                fullConfig.titleFontFamily += "," + decodeURIComponent("%E5%AE%8B%E4%BD%93");
            }
            if (fullConfig.adRowCount == 1) {
                fullConfig.titleTextAlign = "center";
            }
            var title = engine.layoutTitle(titleWidth, titleHeight, fullConfig, "left");
            layoutIndex[title.dataKey] = title;
            
            //item
            fullConfig.itemPaddingLeft = 6;
            fullConfig.itemPaddingRight = 6;
            fullConfig.itemPaddingTop = 1;
            fullConfig.itemPaddingBottom = 1;
            var itemWidth = 7 * fullConfig.titleFontSize + fullConfig.itemPaddingLeft + fullConfig.itemPaddingRight;
            var itemHeight = fullConfig.titleFontSize + 4 + fullConfig.itemPaddingTop + fullConfig.itemPaddingBottom;
            
            //icon
            if(fullConfig.iconLinkUnitConfig){
                var iconWidth = fullConfig.titleFontSize == 12 ? 15 : 16;
                var iconHeight = fullConfig.titleFontSize == 12 ? 12 : 15;
                fullConfig.titleFrontIconPaddingRight = 5;
                var icon = engine.layoutIcon(iconWidth, iconHeight, fullConfig);
                layoutIndex[icon.dataKey] = icon;
                itemWidth = itemWidth + iconWidth + fullConfig.titleFrontIconPaddingRight;
            }
            
            //add item
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);
            
            //add icon
            if(fullConfig.iconLinkUnitConfig){
                item.content.push(icon);
            }
            
            //add title
			item.content.push(title);
                       

            //添加间距元素
            if(fullConfig.adColumnCount > 1){
                fullConfig.itemColumnSpace = Math.floor(
                                            (fullConfig.templateWidth - 2 * fullConfig.containerBorderWidth - itemWidth * fullConfig.adColumnCount) / 
                                            (fullConfig.adColumnCount - 1));
            }
            else{
                fullConfig.itemColumnSpace = fullConfig.templateWidth - 2 * fullConfig.containerBorderWidth - itemWidth * fullConfig.adColumnCount;
            }
            
            if(fullConfig.adRowCount > 1){
                fullConfig.itemRowSpace = Math.floor(
                                        (fullConfig.templateHeight - 2 * fullConfig.containerBorderWidth - itemHeight * fullConfig.adRowCount) / 
                                        (fullConfig.adRowCount - 1));
            }
            else{
                fullConfig.itemRowSpace = fullConfig.templateHeight - 2 * fullConfig.containerBorderWidth - itemHeight * fullConfig.adRowCount;
            }
            
            container = engine.layoutSpace(container, item, fullConfig);
            
            
            container.layoutIndex = layoutIndex;
            return container;
        }
    };
});

declare(function () {
    /**
    嵌入式-图片 布局引擎
    @class TextLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: 'Image',
        namespace: 'Cpro.Template.LayoutEngine',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");

            //container
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);
            if (fullConfig.adRowCount == 1 && fullConfig.adColumnCount == 1) {
                container.style["text-align"] = "center";
            }

            //item
            var itemWidth = Math.floor((container.style["width"] - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);

            //image
            var imageLayout = engine.calculateImage(item.style["width"], item.style["height"], fullConfig);
            var imageHeight = imageLayout.height;
            var imageWidth = imageLayout.width;
            var image = engine.layoutImage(imageWidth, imageHeight, fullConfig);
            layoutIndex[image.dataKey] = image;


            //组装item
            item.content.push(image);


            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(fullConfig.itemColumnSpace, itemHeight, fullConfig);
            var rowSpace = engine.layoutRowSpace(itemWidth, fullConfig.itemRowSpace, fullConfig);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, fullConfig);
            container.layoutIndex = layoutIndex;
            return container;
        }
    };
});

declare(function () {
    /**
    嵌入式-文字 布局引擎
    @class LinkUnit1LayoutEngine
    @namespace $baseName.UI.Template
    */
    return LinkUnit1LayoutEngine = {
        name:'LinkUnit1',
        namespace: 'Cpro.Template.LayoutEngine',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");
            //container
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);
            if (fullConfig.adRowCount == 1 && fullConfig.adColumnCount == 1) {
                container.style["text-align"] = "center";
            }

            //item
            var itemWidth = Math.floor((container.style["width"] - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);
            if(fullConfig.titleFrontIconSrc){
                var titleIcon = engine.layoutIcon(fullConfig.titleFrontIconWidth, fullConfig.titleFrontIconHeight, fullConfig);
                item.content.push(titleIcon);
            }
            //title
            var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], fullConfig);
            var titleWidth = titleLayout.width;
            var titleHeight = titleLayout.height;
            if(fullConfig.titleFrontIconSrc){
                var floatDirection = "left"
                var title = engine.layoutTitle(titleWidth, titleHeight, fullConfig, floatDirection);
            }else{
                var title = engine.layoutTitle(titleWidth, titleHeight, fullConfig);
            }
            
            layoutIndex[title.dataKey] = title;


            //组装item
            item.content.push(title);

            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(fullConfig.itemColumnSpace, itemHeight, fullConfig);
            var rowSpace = engine.layoutRowSpace(itemWidth, fullConfig.itemRowSpace, fullConfig);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, fullConfig);
            container.layoutIndex = layoutIndex;
            return container;
        }
    };
});

declare(function () {
    /**
    嵌入式-文字 单行布局引擎
    @class SingleLineLayoutEngine
    @namespace $baseName.UI.Template
    */
    return SingleLineLayoutEngine = {
        name:'SingleLine',
        namespace:'Cpro.Template.LayoutEngine',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var isRecursion = option.isRecursion;

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");
            
            if(!userConfig.itemRowSpace){
                fullConfig.itemRowSpace=7;
            }
            if(!userConfig.titlePaddingBottom){
                fullConfig.titlePaddingBottom=0;
            }
            if(!userConfig.titlePaddingRight){
                fullConfig.titlePaddingRight=5;
            }
            if(!userConfig.descPaddingRight){
                fullConfig.descPaddingRight=5;
            }
            
            //container
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);          

            //item
            var itemWidth = Math.floor((container.style["width"] - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);

            //title
            if( !userConfig.titleWidth ){
                //没有传递titleWidth, 自动计算
                if( !fullConfig.urlIsShow && !fullConfig.descIsShow ){
                    //url和desc都不显示, title占满item宽度
                    fullConfig.titleWidth = item.style["width"];
                }
                else{
                    //url或者desc显示, 则title默认为五分之二item宽度
                    var defaultTitleWidth = Math.floor(2*item.style["width"]/5);
                    defaultTitleWidth = defaultTitleWidth>300?300:defaultTitleWidth;                
                    fullConfig.titleWidth = defaultTitleWidth;    
                }

            }
            var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], fullConfig);
            var titleWidth = titleLayout.width;
            var titleHeight = item.style["height"];
            var title = engine.layoutTitle(titleWidth, titleHeight, fullConfig);
            title.domName = "span";
            title.style["display"]="inline-block";
            title.style["text-overflow"] = fullConfig.titleIsShowEllipsis ? "ellipsis" : "clip";
            title.style["white-space"] = "nowrap";
            title.style["line-height"] = title.style["height"];
            layoutIndex[title.dataKey] = title;

            //url
            var urlWidth = 0;
            var urlHeight = titleHeight;
            if(fullConfig.urlIsShow){
                if(!userConfig.urlWidth){
                    //用户没有传递urlWidth, 自动计算
                    var defaultUrlWidth = Math.floor(1*item.style["width"]/5);
                    urlWidth = fullConfig.urlWidth = defaultUrlWidth<100?100:defaultUrlWidth;
                }           

                var url = engine.layoutUrl(urlWidth, urlHeight, fullConfig);
                url.domName = "span";
                url.style["display"]="inline-block";
                url.style["text-overflow"] = fullConfig.urlIsShowEllipsis ? "ellipsis" : "clip";
                url.style["white-space"] = "nowrap";
                url.style["float"]="none";
                url.style["line-height"]=url.style["height"];
                layoutIndex[url.dataKey] = url;
            }
            
            //desc
            var descWidth = titleWidth; 
            var descHeight = titleHeight;
            if(!userConfig.descWidth){
                var defaultDescWidth = itemWidth -  titleWidth - urlWidth;
                descWidth = fullConfig.descWidth = defaultDescWidth = defaultDescWidth<0?0:defaultDescWidth;
            }
            var desc = engine.layoutDesc(descWidth, descHeight, fullConfig);
            desc.domName = "span";
            desc.style["display"]="inline-block";
            desc.style["text-overflow"] = fullConfig.descIsShowEllipsis ? "ellipsis" : "clip";
            desc.style["white-space"] = "nowrap";
            desc.style["float"]="none";
            desc.style["line-height"]=desc.style["height"];
            desc.rowCount = 1;
            layoutIndex[desc.dataKey] = desc;

            //组装item
            if (fullConfig.titleIsShow) {
                item.content.push(title);
            }
            if (fullConfig.descIsShow) {
                item.content.push(desc);
            }
            if (fullConfig.urlIsShow > 0 || (fullConfig.urlIsShow === -1 && isShowUrl)) {
                item.content.push(url);
            }

            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(fullConfig.itemColumnSpace, itemHeight, fullConfig);
            var rowSpace = engine.layoutRowSpace(itemWidth, fullConfig.itemRowSpace, fullConfig);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, fullConfig);
            container.layoutIndex = layoutIndex; 
            
            return container;
        }
    };
});

declare(function () {
    /**
    智能创意布局引擎
    @class SmartIdeaLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: 'SmartIdea',
        namespace: 'Cpro.Template.LayoutEngine',
		
		/**
        price前缀样式
        @property symbolStyle
        @type Object
        */
        symbolStyle: {
			style:{
				"padding-right": 2,
				"cursor":"pointer"
			}
		},

        /**
        price后缀样式
        @property suffixStyle
        @type Object
        */
        suffixStyle: {
			style:{
				"font-size": 10,
				"color": "#FFFFFF",
				"line-height": 9,
				"display": "inline-block",
				"width": 9,
				"height": 9,
				"position": "relative",
				"left": "10px",
				"text-align": "center",
				"cursor":"pointer"
			}
        },

        /**
        price后缀样式
        @property noPriceStyle
        @type Object
        */
        noPriceStyle: {
			style:{
				"font-size": 14,
				"color": "#FFFFFF",
				"line-height": 24,
				"width": 80,
				"display": "inline-block",
				"position": "relative",
				"background-color": "#436CE9",
				"text-align": "center",
				"cursor":"pointer"
			}
        },
		
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var isRecursion = option.isRecursion; 

            /* 全局控制区域 */
			var brandLogoFloatDirection = "left";//商标logo浮动方向标志位
			var urlFloatDirection = "left";//url（价格）浮动方向标志位
			var layoutType = "blockLayout";
            var isShowDesc = true; //是否显示desc
			var isShowUrl = fullConfig.urlIsShow;
			
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");
			var paintEngine = using("Cpro.Template.PaintEngine");
			var cssBuilder = using("Cpro.Utility.CssBuilder");

            //container
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);

            //item
            var itemWidth = Math.floor((container.style["width"] - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
           
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);
            
			//========= item布局  ==========
			if(fullConfig.stuffType === "smartidea1"){//购物类模板
				isShowDesc = false;
			}
			
			//广告布局标志位参数
			if(item.style["height"]/item.style["width"] > 0.5 && item.style["height"]/item.style["width"] < 2){
				//方块布局
				layoutType = "blockLayout";
			}else if(item.style["height"]/item.style["width"] >= 2){
				//垂直条形布局
				layoutType = "verticalLayout";
			}else {
				//水平条形布局
				layoutType = "HorizontalLayout";
			}
			
			//浮动标志位参数
			if(fullConfig.stuffType === "smartidea2" && layoutType === "blockLayout"){
				brandLogoFloatDirection = "right";
				urlFloatDirection = "right";
			}else if(layoutType === "HorizontalLayout"){
				urlFloatDirection = "right";
			}
			
            //========= item内组件  ==========
			
			//brandLogo
			var brandLogoHeight, brandLogoWidth, brandLogoScale = 2;
			if(layoutType === "blockLayout"){
				brandLogoHeight = Math.floor(item.style["height"]/(6.5 * 5)) * 5;
				brandLogoWidth = Math.floor(brandLogoHeight * brandLogoScale);//商标最高比例为2:1
			}else if(layoutType === "HorizontalLayout"){
				brandLogoWidth = Math.floor(item.style["width"] / 4);
				fullConfig.brandLogoPaddingTop = fullConfig.brandLogoPaddingTop > 0 ? fullConfig.brandLogoPaddingTop : 4;
				fullConfig.brandLogoPaddingBottom = fullConfig.brandLogoPaddingBottom > 0 ? fullConfig.brandLogoPaddingBottom : 4;
				if(item.style["height"] > 80 && item.style["width"] > 720){
					brandLogoScale = 3 / 2;
				}
			}else {//layoutType === "verticalLayout"
				if(item.style["height"] > 500){
					brandLogoScale = 3 / 2;
				}
				brandLogoHeight = Math.round(item.style["height"] / 6);
				fullConfig.brandLogoPaddingLeft = fullConfig.brandLogoPaddingLeft > 0 ? fullConfig.brandLogoPaddingLeft : 19;
				fullConfig.brandLogoPaddingRight = fullConfig.brandLogoPaddingRight > 0 ? fullConfig.brandLogoPaddingRight : 19;
			}
			brandLogoHeight = fullConfig.brandLogoHeight || brandLogoHeight || item.style["height"];
			brandLogoWidth = fullConfig.brandLogoWidth || brandLogoWidth || item.style["width"];
			
			//不得不在得到brandLogo外围尺寸后计算居中
			if(layoutType === "HorizontalLayout"){
				var brandImgHeight = brandLogoHeight - fullConfig.brandLogoPaddingTop - fullConfig.brandLogoPaddingBottom;
				var brandImgWidth = Math.floor(brandImgHeight * brandLogoScale);
				fullConfig.brandLogoPaddingLeft = fullConfig.brandLogoPaddingRight = brandLogoWidth > brandImgWidth ? (brandLogoWidth - brandImgWidth) / 2 : 0;
			}else if(layoutType === "verticalLayout"){
				var brandImgWidth = brandLogoWidth - fullConfig.brandLogoPaddingLeft - fullConfig.brandLogoPaddingRight;
				var brandImgHeight = Math.floor(brandImgWidth / brandLogoScale);
				fullConfig.brandLogoPaddingTop = fullConfig.brandLogoPaddingBottom = brandLogoHeight > brandImgHeight ? (brandLogoHeight - brandImgHeight) / 2 : 0;
			}
			var brand = engine.layoutBrandLogo(brandLogoWidth, brandLogoHeight, fullConfig, brandLogoFloatDirection);
			layoutIndex[brand.dataKey] = brand;
			
			//logo
			var logoHeight, logoWidth;
			if(layoutType === "blockLayout"){
				fullConfig.logoPaddingTop = fullConfig.logoPaddingTop > 0 ? fullConfig.logoPaddingTop : 10;
				fullConfig.logoPaddingBottom = fullConfig.logoPaddingBottom > 0 ? fullConfig.logoPaddingBottom : 10;
				
				logoHeight = 0.5 * item.style["height"] + fullConfig.logoPaddingTop + fullConfig.logoPaddingBottom;
				if(fullConfig.stuffType === "smartidea2"){
					logoHeight = 0.6 * item.style["height"];
					//宽高相等尺寸特殊处理
					if(item.style["height"] <= 250 && item.style["height"] >= item.style["width"]){
						logoHeight -= brandLogoHeight;
						//不显示价格
						isShowUrl = false;
					}
				}
			}else if(layoutType === "HorizontalLayout"){//垂直水平居中
				fullConfig.logoPaddingTop = fullConfig.logoPaddingTop > 0 ? fullConfig.logoPaddingTop : 4;
				fullConfig.logoPaddingBottom = fullConfig.logoPaddingBottom > 0 ? fullConfig.logoPaddingBottom : 4;
				logoWidth = Math.round(item.style["width"] / 65) * 10;
			}else {
				logoHeight = item.style["height"] / 3;
				fullConfig.logoPaddingLeft = fullConfig.logoPaddingLeft > 0 ? fullConfig.logoPaddingLeft : 19;
				fullConfig.logoPaddingRight = fullConfig.logoPaddingLeft;
			}
			logoHeight = fullConfig.logoHeight || logoHeight || item.style["height"];
			logoWidth = fullConfig.logoWidth || logoWidth || item.style["width"];
			if(layoutType === "verticalLayout"){
				var logoImgWidth = logoWidth - fullConfig.logoPaddingLeft - fullConfig.logoPaddingRight;
				var logoImgHeight = fullConfig.logoImgHeight || logoImgWidth*3/4;
				fullConfig.logoPaddingTop = (logoHeight - logoImgHeight - fullConfig.logoPaddingBottom > 0) ? Math.floor(logoHeight - logoImgHeight - fullConfig.logoPaddingBottom) : 0;
			}else {
				var logoImgHeight = logoHeight - fullConfig.logoPaddingTop - fullConfig.logoPaddingBottom;
				var logoImgWidth = fullConfig.logoImgWidth || logoImgHeight*4/3;
				fullConfig.logoPaddingLeft = fullConfig.logoPaddingRight = (logoWidth > logoImgWidth) ? Math.floor((logoWidth - logoImgWidth) / 2) : 0;
			}
			var logo = engine.layoutLogo(Math.floor(logoWidth), Math.floor(logoHeight), fullConfig);
			layoutIndex[logo.dataKey] = logo;
			
			//desc
			var descHeight, descWidth;
			if(layoutType === "blockLayout"){
				if(fullConfig.stuffType === "smartidea2"){
					//desc与brandLogo同一行
					descWidth = item.style["width"] - brandLogoWidth
					if(item.style["height"] <= 250 && item.style["height"] >= item.style["width"]){
						descWidth = item.style["width"];
					}
				}
			}else if(layoutType === "HorizontalLayout"){
				var descWidthScale = 3;
				if(item.style["width"] > 800){
					descWidthScale = 3.5;
				}
				descWidth = Math.round(item.style["width"] / (descWidthScale * 2 * 10)) * 2 * 10;
			}
			//默认一行desc
			fullConfig.descRowCount = fullConfig.descRowCount > 0 ? fullConfig.descRowCount : 1;
			descHeight = engine.calculateDescLineHeight(fullConfig) * fullConfig.descRowCount + fullConfig.descPaddingTop + fullConfig.descPaddingBottom;
			descWidth = fullConfig.descWidth > 0 ? fullConfig.descWidth : (descWidth || item.style["width"]);
			
			//title与desc组件水平居中折行
			//计算title组件padding 用于title、desc组件
			var contentWidth = fullConfig.titleFontSize * (22 / 2 + 1);//购物类超过22字折行
			if(fullConfig.stuffType === "smartidea2"){
				contentWidth = fullConfig.titleFontSize * (16 / 2 + 1);
				contentWidth = contentWidth > fullConfig.descFontSize * (20 / 2 + 1) ? contentWidth : fullConfig.descFontSize * (20 / 2 + 1);
			}
			var descTitlePadding = Math.floor((descWidth - contentWidth) / 2);
			fullConfig.descPaddingLeft = fullConfig.titlePaddingLeft = fullConfig.descPaddingRight = fullConfig.titlePaddingRight = descTitlePadding > 0 ? descTitlePadding : 0;
			
			var desc = engine.layoutDesc(descWidth, descHeight, fullConfig, "left");
            layoutIndex[desc.dataKey] = desc;
			
			//title
			var titleHeight, titleWidth, logoBlankSpace;//位于title下方的logo组件paddingTop
			if(layoutType === "blockLayout"){
				if(fullConfig.stuffType === "smartidea1"){
					
				}else{//旅游类模板
					titleHeight = item.style["height"] - logoHeight;
					logoBlankSpace = fullConfig.logoPaddingTop;
					if(item.style["height"] <= 250 && item.style["height"] >= item.style["width"]){
						titleHeight -= brandLogoHeight;
					}
				}
			}else if(layoutType === "HorizontalLayout"){
				logoBlankSpace = 0;
			}else {
				titleHeight = item.style["height"] - brandLogoHeight - logoHeight;
				fullConfig.titlePaddingTop = fullConfig.titlePaddingTop > 0 ? fullConfig.titlePaddingTop : 5;
			}
			titleHeight = titleHeight || item.style["height"];
			titleWidth = descWidth || item.style["width"];
			//没有desc的模板需要填充desc高度
			if(isShowDesc){
				titleHeight -= descHeight;
			}
			var titleLayout = engine.calculateTitle(titleWidth, titleHeight, fullConfig);
			//title与desc在其空间内居中（指定logoBlankSpace值情况下）
			if((typeof logoBlankSpace) !== "undifine"){
				var blockSpace = titleHeight - titleLayout.height + logoBlankSpace;
				if(blockSpace > 0){
					var userTitlePaddingTop = fullConfig.titlePaddingTop;
					fullConfig.titlePaddingTop = Math.floor(blockSpace / 2);
					titleLayout.height += fullConfig.titlePaddingTop - userTitlePaddingTop;
				}
			}
			titleHeight = titleLayout.height;
			titleWidth = titleLayout.width;
			var title = engine.layoutTitle(titleLayout.width, titleLayout.height, fullConfig, "left");
			layoutIndex[title.dataKey] = title;
			
			//url
			var urlHeight, urlWidth;
			if(layoutType === "blockLayout"){
				if(fullConfig.stuffType === "smartidea1"){
					urlHeight = item.style["height"] - logoHeight - brandLogoHeight - titleHeight;
					urlHeight = urlHeight > 0 ? urlHeight : 0;
					if(fullConfig.urlPaddingBottom <= 0){
						if(item.style["height"] >= 298){
							fullConfig.urlPaddingBottom = 19;
						}else if(item.style["height"] >= 248){
							fullConfig.urlPaddingBottom = 14;
						}else {
							fullConfig.urlPaddingBottom = 9;
						}
					}
				}else {
					urlHeight = item.style["height"] - logoHeight - brandLogoHeight;
					urlWidth = brandLogoWidth;
					//按钮高度
					urlHeight = 30 + fullConfig.urlPaddingBottom + fullConfig.urlPaddingTop;
				}
			}else if(layoutType === "HorizontalLayout"){
				urlWidth = item.style["width"] - brandLogoWidth - logoWidth - descWidth;
				if(fullConfig.stuffType === "smartidea2"){
					fullConfig.urlPaddingLeft = 10;
				}
			}else {
				urlHeight = item.style["height"] - logoHeight - brandLogoHeight - titleHeight;
				if(isShowDesc){
					urlHeight -= descHeight;
				}
				urlHeight = urlHeight > 0 ? urlHeight : 0;
				if(fullConfig.urlPaddingBottom <= 0){
					if(item.style["height"] >= 500){
						fullConfig.urlPaddingBottom = 119;
					}else if(item.style["height"] >= 300){
						fullConfig.urlPaddingBottom = 64;
					}else {
						fullConfig.urlPaddingBottom = 34;
					}
				}
			}
			urlHeight = urlHeight || item.style["height"];
			urlWidth = urlWidth || item.style["width"];
			var urlLingHeight = engine.calculateUrlLineHeight(fullConfig);
			if(fullConfig.urlPaddingBottom > 0){
				fullConfig.urlPaddingTop = (urlHeight - fullConfig.urlPaddingBottom - urlLingHeight) >= 0? (urlHeight - fullConfig.urlPaddingBottom - urlLingHeight): 0;
				fullConfig.urlPaddingBottom = (urlHeight - fullConfig.urlPaddingTop - urlLingHeight) >= 0? (urlHeight - fullConfig.urlPaddingTop - urlLingHeight): 0;
			}else if(layoutType === "HorizontalLayout"){
				fullConfig.urlPaddingTop = fullConfig.urlPaddingBottom = Math.floor((urlHeight - urlLingHeight) / 2);
			}
			var url = engine.layoutUrl(urlWidth, urlHeight, fullConfig, urlFloatDirection);
            layoutIndex[url.dataKey] = url;
            
			//文字部分添加折行属性
			desc.style["word-wrap"] = title.style["word-wrap"] = "break-word";
			desc.style["word-break"] = title.style["word-break"] = "break-all";

			//价格标志
			this.symbolStyle.style["font-size"] = fullConfig.symbolSize || 12;
			if(layoutType === "verticalLayout"){
				this.suffixStyle.style["left"] = "3px";
			}
			this.suffixStyle.style["background-color"] = "#"+fullConfig.urlFontColor;
			this.suffixStyle.style["top"] = "-"+Math.floor(fullConfig.urlFontSize/4)+"px";
			if(urlWidth < 80){
				this.noPriceStyle.style["width"] = 60;
				this.noPriceStyle.style["font-size"] = 12;
			}
			var priceCssExtend = paintEngine.getStyle("symbol", this.symbolStyle);
			priceCssExtend += paintEngine.getStyle("suffix", this.suffixStyle);
			priceCssExtend += paintEngine.getStyle("noPrice", this.noPriceStyle);
			cssBuilder.addCss(priceCssExtend);
			
			//组装item
			if((layoutType === "blockLayout" && fullConfig.stuffType === "smartidea1") || layoutType === "verticalLayout"){
				item.content.push(brand);
				item.content.push(logo);
				item.content.push(title);
				if(isShowDesc) item.content.push(desc);
				if(isShowUrl) item.content.push(url);
				layoutIndex["item"] = item;
			}else if(layoutType === "blockLayout" && fullConfig.stuffType === "smartidea2"){
				item.content.push(brand);
				item.content.push(title);
				if(isShowDesc) item.content.push(desc);
				if(isShowUrl) item.content.push(url);
				item.content.push(logo);
				layoutIndex["item"] = item;
			}else if(layoutType === "HorizontalLayout"){
				item.content.push(brand);
                item.content.push(logo);
				if(fullConfig.stuffType === "smartidea2") item.content.push(url);
				item.content.push(title);
                if(isShowDesc) item.content.push(desc);
				if(fullConfig.stuffType === "smartidea1") item.content.push(url);
                layoutIndex["item"] = item;
			}
			
            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, fullConfig);
            container.layoutIndex = layoutIndex;
            
            
            return container;
        }
    };
});

declare(function () {
    /**
    嵌入式-文字 布局引擎
    @class TextLayoutEngine
    @namespace $baseName.UI.Template
    */
    return TextLayoutEngine = {
        name:'Text',
        namespace:'Cpro.Template.LayoutEngine',
        
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var isRecursion = option.isRecursion;

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");
            
            //container
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);          

            //item
            var itemWidth = Math.floor((container.style["width"] - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);

            //title
            var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], fullConfig);
            //由于title，url,desc是浮动定位，而rightimage是绝对定位，故在IE6下会产生bug，解决方案是rightimage和title的宽度小于item的宽度-3
            var titleWidth = fullConfig.itemRightImage?titleLayout.width-3:titleLayout.width;
            var titleHeight = titleLayout.height;
            var title = engine.layoutTitle(titleWidth, titleHeight, fullConfig);
            layoutIndex[title.dataKey] = title;

            //url
            var urlLayout = engine.calculateUrl(item.style["width"], item.style["height"], fullConfig);
            var urlWidth = fullConfig.itemRightImage?urlLayout.width-3:urlLayout.width;
            var urlHeight = urlLayout.height;
            var url = engine.layoutUrl(urlWidth, urlHeight, fullConfig);
            layoutIndex[url.dataKey] = url;

            //desc
            var descWidth = fullConfig.itemRightImage?item.style["width"]-3:item.style.width;
            var descHeight = item.style["height"] - titleHeight - urlHeight;
            var tempDescRowCount = engine.calculateDescRowCount(descHeight, fullConfig);
            if(typeof userConfig.urlIsShow === "undefined"){
                if( tempDescRowCount<1 || (tempDescRowCount<2 && descWidth<450) ){
                    //如果用户指定不显示url, 则在上述两种情况下不显示url
                    isShowUrl = false;
                    descHeight = item.style["height"] - titleHeight;
                }
            }
            
            //对于非用户设置, 不显示url的情况, 如果用户没有设置行间距, 则缩小默认的行间距, 重新进行探测
            if( !isRecursion && (typeof userConfig.urlIsShow === "undefined") &&  !isShowUrl &&  (typeof userConfig.itemRowSpace === "undefined")){
                fullConfig.itemRowSpace = 4;
                if( typeof userConfig.titlePaddingBottom === "undefined" ){
                    fullConfig.titlePaddingBottom = 1;
                }
                fullConfig.titlePadding
                option.isRecursion = true;
                return this.layout( option );
            }


            var desc = engine.layoutDesc(descWidth, descHeight, fullConfig);
            layoutIndex[desc.dataKey] = desc;

            //组装item
            if (fullConfig.titleIsShow) {
                item.content.push(title);
            }
            if (fullConfig.descIsShow) {
                item.content.push(desc);
            }
            if (fullConfig.urlIsShow > 0 || (fullConfig.urlIsShow === -1 && isShowUrl)) {
                item.content.push(url);
            }
            if(fullConfig.itemRightImage){
                var rightImage = engine.layoutRightImage(fullConfig.itemRightImageWidth, fullConfig.itemRightImageHeight, item.style.width, item.style.height, fullConfig);
                item.content.push(rightImage)
            }
            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(fullConfig.itemColumnSpace, itemHeight, fullConfig);
            var rowSpace = engine.layoutRowSpace(itemWidth, fullConfig.itemRowSpace, fullConfig);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, fullConfig);
            container.layoutIndex = layoutIndex;
            
            return container;
        }
    };
});

declare(function () {
    /**
    图文物料布局引擎
    @class TuwenLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: 'Tuwen',
        namespace: 'Cpro.Template.LayoutEngine',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {
            var userConfig = option.userConfig;
            var fullConfig = option.fullConfig;
            var isRecursion = option.isRecursion; 

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.LayoutEngine.Base");

            //container
            var containerWidth = fullConfig.templateWidth;
            var containerHeight = fullConfig.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, fullConfig);

            //item
            var itemWidth = Math.floor((container.style["width"] - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
           
            //单条广告的特殊处理
            if (fullConfig.adRowCount == 1 && fullConfig.adColumnCount == 1) {
                 //单个广告块最大宽度为600
                itemWidth = itemWidth > 500 ? 500 : itemWidth;
            }
            var item = engine.layoutItem(itemWidth, itemHeight, fullConfig);
            
            
            //========= 三种布局  ==========
            if (item.style["height"] <= 60 || fullConfig.scale != "") { //布局1: 图片独立一列, title+desc一列, 不显示url
                //图片, 独立一列	
                if( fullConfig.scale == "20.3"){
                    var logoLayout = engine.calculateLogo(item.style.width, item.style.height, fullConfig);
                    var logoHeight = logoLayout.height;
                    var logoWidth = logoLayout.width + fullConfig.logoPaddingRight + fullConfig.logoPaddingLeft;
                }else{
                    var logoHeight =  logoWidth = item.style.height;
                    var logoHeight = logoWidth = item.style.height
                    logoWidth = logoWidth + fullConfig.logoPaddingRight + fullConfig.logoPaddingLeft;
                }
                var logo = engine.layoutLogo(logoWidth, logoHeight, fullConfig);
                layoutIndex[logo.dataKey] = logo;

                //title
                var titleLayout = engine.calculateTitle(item.style["width"] - logoWidth, item.style["height"], fullConfig);
                var titleWidth = titleLayout.width;
                var titleHeight = titleLayout.height;
                var title = engine.layoutTitle(titleWidth, titleHeight, fullConfig, "left");
                layoutIndex[title.dataKey] = title;
                
                //url	
                var urlLayout = engine.calculateUrl(titleWidth, logoHeight - titleHeight, fullConfig);
                var urlWidth = urlLayout.width
                var urlHeight = urlLayout.height;
                var url = engine.layoutUrl(urlWidth, urlHeight, fullConfig, "left");
                layoutIndex[url.dataKey] = url;

                //desc
                var descWidth = titleWidth;
                var descHeight = logoHeight - titleHeight - urlHeight;
                isShowUrl = true; 
                var tempDescRowCount = engine.calculateDescRowCount(descHeight, fullConfig);
                if ( tempDescRowCount<1 || (tempDescRowCount===1 &&  descWidth<=400) ) { //不够显示两行, 则不显示url
                    descHeight = logoHeight - titleHeight;
                    isShowUrl = false;
                }
                var desc = engine.layoutDesc(descWidth, descHeight, fullConfig, "left");
                layoutIndex[desc.dataKey] = desc;
                
                //组装item
                item.content.push(logo);
                item.content.push(title);
                item.content.push(desc);
                if (isShowUrl && fullConfig.urlIsShow != "-1") item.content.push(url);
                item.style["inner-height"]=logoHeight;
                layoutIndex["item"] = item;
            }
            else { //布局2, 3: title独立一行

                //title
                var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], fullConfig);
                var titleWidth = titleLayout.width;
                var titleHeight = titleLayout.height;
                var title = engine.layoutTitle(titleWidth, titleHeight, fullConfig);
                layoutIndex[title.dataKey] = title;

                var leftHeight = item.style["height"] - title.style["outer-height"]; //除去title后剩下的高度.  根据这个高度确定url是否独立显示一行

                var urlLayout = engine.calculateUrl(item.style["width"], item.style["height"], fullConfig);
                var urlWidth = urlLayout.width;
                var urlHeight = urlLayout.height;

                if (leftHeight - urlHeight >= 64) { //布局2: title独立一行, logo独立一列, desc独立一列, url独立一行
                    //url
                    var url = engine.layoutUrl(urlWidth, urlHeight, fullConfig);
                    layoutIndex[url.dataKey] = url;

                    //logo
                    var logoLayout = engine.calculateLogo(item.style["width"], item.style["height"] - titleHeight - urlHeight, fullConfig);
                    var logoHeight = logoLayout.height;
                    var logoWidth = logoLayout.width;
                    var logo = engine.layoutLogo(logoWidth, logoHeight, fullConfig);
                    layoutIndex[logo.dataKey] = logo;

                    //desc
                    var descWidth = item.style["width"] - logoWidth;
                    var descHeight = logoHeight;
                    var desc = engine.layoutDesc(descWidth, descHeight, fullConfig, "left");
                    layoutIndex[desc.dataKey] = desc;
                    
                    item.style["inner-height"]=titleHeight+logoHeight+urlHeight;
                    layoutIndex["item"] = item;
                }
                else { //布局3: title独立一行, logo独立一列, desc和url一列.

                    var logoLayout = engine.calculateLogo(item.style["width"], item.style["height"] - titleHeight, fullConfig);
                    var logoHeight = logoLayout.height;
                    var logoWidth = logoLayout.width;
                    var logo = engine.layoutLogo(logoWidth, logoHeight, fullConfig);
                    layoutIndex[logo.dataKey] = logo;

                    //url	
                    var urlLayout = engine.calculateUrl(item.style["width"] - logoWidth, item.style["height"], fullConfig);
                    var urlWidth = urlLayout.width
                    var urlHeight = urlLayout.height;
                    var url = engine.layoutUrl(urlWidth, urlHeight, fullConfig, "left");
                    layoutIndex[url.dataKey] = url;

                    //desc
                    var descWidth = item.style["width"] - logoWidth;
                    var descHeight = logoHeight - urlHeight;
                    isShowUrl = true; //默认显示url
                    if (engine.calculateDescRowCount(descHeight, fullConfig) < 2) { //不够显示两行, 则不显示url
                        descHeight = logoHeight;
                        isShowUrl = false;
                    }
                    var desc = engine.layoutDesc(descWidth, descHeight, fullConfig, "left");
                    layoutIndex[desc.dataKey] = desc;
                    
                    item.style["inner-height"]=titleHeight+logoHeight;
                    layoutIndex["item"] = item;
                }

                item.content.push(title);
                item.content.push(logo);
                item.content.push(desc); 
                if (isShowUrl) item.content.push(url);
            }

            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(fullConfig.itemColumnSpace, itemHeight, fullConfig);
            var rowSpace = engine.layoutRowSpace(itemWidth, fullConfig.itemRowSpace, fullConfig);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, fullConfig);
            container.layoutIndex = layoutIndex;
            
            //单条广告的特殊处理
            if (fullConfig.adRowCount == 1 && fullConfig.adColumnCount == 1) {
                //水平居中
                item.style["margin-left"] = parseInt((container.style.width-itemWidth)/2);
            }
            
            //垂直居中处理. 根据item的内容高度和item占位高度只差, 自动判断是否需要垂直居中
            if( !fullConfig.itemVerticalAlign || fullConfig.itemVerticalAlign===-1){
                var itemBlankHeight = item.style["outer-height"] - item.style["inner-height"];
                if( itemBlankHeight > 50 ){
                    item.style["height"]=item.style["inner-height"];
                    item.style["padding-top"]= item.style["padding-bottom"] = parseInt( itemBlankHeight/2 );
                }
            }
            
            return container;
        }
    };
});

declare(function () {
    return {
        name: 'Cookie',
        namespace: 'Cpro.Utility',
        getCookie: function (key, win) {
            var result;
            var win = win || window;
            var doc = win.document;
            var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)");
            var regResult = reg.exec(doc.cookie);
            if (regResult) {
                result = regResult[2];
            }
            return result;
        },

        setCookie : function (key, value, options) {
            options = options || {};
            var expires = options.expires;
            if ('number' == typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
            document.cookie = key + "=" + value + (options.path ? "; path=" + options.path : "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.domain ? "; domain=" + options.domain : "") + (options.secure ? "; secure" : '');
        }
    }
});

declare(function () {
    return {
        name:'CssBuilder',
        namespace: 'Cpro.Utility',        
        /**
		 * 从文档中获取指定的DOM元素
		 * 
		 * @name Utility.g
		 * @function
		 * @grammar Utility.g(id)
		 * @param {string|HTMLElement}
		 *            id 元素的id或DOM元素
		 * @shortcut g,G
		 * @meta standard
		 * 
		 * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
		 */
		g : function(id, win) {
			win = win || window;
			if ('string' === typeof id || id instanceof String) {
				return win.document.getElementById(id);
			} else if (id && id.nodeName
					&& (id.nodeType == 1 || id.nodeType == 9)) {
				return id;
			}
			return id;
		},
        
        /**
		 * 获取目标元素所属的document对象
		 * 
		 * @name Utility.getDocument
		 * @function
		 * @grammar Utility.getDocument(element)
		 * @param {HTMLElement|string}
		 *            element 目标元素或目标元素的id
		 * @meta standard
		 * 
		 * @returns {HTMLDocument} 目标元素所属的document对象
		 */
		getDocument : function(element) {
			if (!element)
				return document;
			element = this.g(element);
			return element.nodeType == 9 ? element : element.ownerDocument
					|| element.document;
		},
        
        /**
         * 根据传入的CSS字符串, 在页面上动态添加CSS的style元素. 
         * @method addCssByStyle 
         * @param {string} cssString 要加入到页面上的css内容. 
         * @return {boolean}
         */
        addCss: function (cssString) {
            var doc = document;
            var style = doc.createElement("style");
            style.setAttribute("type", "text/css");

            if (style.styleSheet) { // IE
                style.styleSheet.cssText = cssString;
            }
            else { // w3c
                var cssText = doc.createTextNode(cssString);
                style.appendChild(cssText);
            }

            var heads = doc.getElementsByTagName("head");
            if (heads.length) heads[0].appendChild(style);
            else doc.documentElement.appendChild(style);
        },
        
        /**
		 * 获取目标元素的样式值
		 * 
		 * @returns {string} 目标元素的样式值
		 */
		getStyle : function(element, styleName) {
			var result;
			element = this.g(element);
			var doc = this.getDocument(element);
			// ie9下获取到的样式名称为: backgroundColor
			// 其他标准浏览器下样式为: background-color
			// 分别使用这两个名字尝试获取样式信息
			var styleNameOther = "";
			if (styleName.indexOf("-") > -1) {
				styleNameOther = styleName.replace(/[-_][^-_]{1}/g, function(
								match) {
							return match.charAt(1).toUpperCase();
						});
			} else {
				styleNameOther = styleName.replace(/[A-Z]{1}/g,
						function(match) {
							return "-" + match.charAt(0).toLowerCase();
						});
			}

			// 优先使用w3c标准的getComputedStyle方法, 在ie6,7,8下使用currentStyle
			var elementStyle;
			if (doc && doc.defaultView && doc.defaultView.getComputedStyle) {
				elementStyle = doc.defaultView.getComputedStyle(element, null);
				if (elementStyle) {
					result = elementStyle.getPropertyValue(styleName);
				}
				if (typeof result !== "boolean" && !result) {
					result = elementStyle.getPropertyValue(styleNameOther);
				}
			} else if (element.currentStyle) { // ie6,7,8使用currentStyle
				elementStyle = element.currentStyle;
				if (elementStyle) {
					result = elementStyle[styleName];
				}
				if (typeof result !== "boolean" && !result) {
					result = elementStyle[styleNameOther];
				}
			}

			return result;
		}
    }
});

declare(function () {
    return {
        name:'Encoder',
        namespace: 'Cpro.Utility',
        /**
         * HTML转义
         * @param {string} source 待处理的字符串 
         * @return {string} 处理后的字符串
         */
        encodeHTML: function (source) {
            return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\/g, '&#92;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        },

        /**
         * 转义影响正则的字符
         * @param {string} source 待处理的字符串 
         * @return {string} 处理后的字符串
         */
        encodeReg: function (source) {
            return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
        },

        /**
         * 转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
         * @param {string} source 待处理的字符串 
         * @return {string} 处理后的字符串
         */
        encodeEventHTML: function (source) {
            return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\\\\/g, '\\').replace(/\\\//g, '\/').replace(/\\n/g, '\n').replace(/\\r/g, '\r');
        }
    };
});

declare(function () {
    return {
        name: 'Log',
        namespace: 'Cpro.Utility',
        sendByIframe: function (url) {
            var ifr = document.createElement("iframe");
            ifr.id = "ifr" + parseInt(Math.random() * 100000);
            ifr.style.display = "none";
            ifr.setAttribute("src", url);
            document.body.insertBefore(ifr, document.body.firstChild);
        },

        /*
         * 通过请求一个图片的方式令服务器存储一条日志
         * @param   {string}    url 要发送的地址.
         */
        sendByImage: function (url, win) {
            var img = new Image();
            var key = 'cpro_log_' + Math.floor(Math.random() * 2147483648).toString(36);

            win = win || window;
            // 这里一定要挂在window下
            // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
            // 导致服务器收不到日志
            win[key] = img;

            img.onload = img.onerror = img.onabort = function () {
                // 下面这句非常重要
                // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
                // 则在gif动画播放过程中，img会多次触发onload
                // 因此一定要清空
                img.onload = img.onerror = img.onabort = null;

                win[key] = null;

                // 下面这句非常重要
                // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
                // 因此这里一定要置为null
                img = null;
            };

            // 一定要在注册了事件之后再设置src
            // 不然如果图片是读缓存的话，会错过事件处理
            // 最后，对于url最好是添加客户端时间来防止缓存
            // 同时服务器也配合一下传递Cache-Control: no-cache;
            img.src = url;
        }
    }
});
