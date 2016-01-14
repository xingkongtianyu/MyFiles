
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
                if (linkArray[i].className && (linkArray[i].className.toLowerCase() === "gylogo" || linkArray[i].className.toLowerCase() === "bdlogo")) {
                    continue;
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
    布局引擎基础类
    @class BaseLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: 'BaseLayoutEngine',
        namespace: 'Cpro.Template',
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
            if (option.containerBorderWidth) {
                option.containerBorderTop = option.containerBorderWidth;
                option.containerBorderRight = option.containerBorderWidth;
                option.containerBorderBottom = option.containerBorderWidth;
                option.containerBorderLeft = option.containerBorderWidth;
            }
            style["border-width"] = option.containerBorderWidth;
            style["border-style"] = option.containerBorderStyle;
            style["border-top-width"] = option.containerBorderTop;
            style["border-right-width"] = option.containerBorderRight;
            style["border-bottom-width"] = option.containerBorderBottom;
            style["border-left-width"] = option.containerBorderLeft;
            style["border-color"] = "#" + option.containerBorderColor.replace("#", "");
            style["width"] = width - style["padding-left"] - style["padding-right"] - 2 * style["border-width"];
            style["height"] = height - style["padding-top"] - style["padding-bottom"] - 2 * style["border-width"];
            style["background-color"] = "#" + option.containerBackgroundColor.replace("#", "");
            if (parseInt(option.containerOpacity) == 1) {
                style["background-color"] = "transparent";
            }
            style["position"] = "relative";
            style["overflow"] = "hidden";
            container.props = {
                id: option.idPrefix ? (option.idPrefix + "container") : "container"
            };
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
            style["color"] = "#" + option.urlFontColor.replace("#", "");
            style["float"] = "left";
            style["text-decoration"] = option.urlShowUnderline ? "underline" : "none";
            style["font-weight"] = option.urlFontWeight;
            url.rowCount = option.urlRowCount > 0 ? option.urlRowCount : 1;
            url.showEllipsis = option.urlIsShowEllipsis;
            if (floatDirection) {
                style["float"] = floatDirection;
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
            style["height"] = height;
            style["float"] = "left";
            style["overflow"] = "hidden";

            if (option.itemColumnBorderStyle) {
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
                line.style["border-color"] = "#" + option.containerBorderColor;
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

            if (option.itemRowBorderStyle) {
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
                line.style["border-color"] = "#" + option.containerBorderColor;
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
            result.width = option.titleWidth !== -1 ? option.titleWidth : parentWidth;
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
    渲染引擎
    @class DataEngine
    @namespace $baseName.UI.Template
    */
    return {
        name:'DataEngine',
        namespace: 'Cpro.Template',
        flashTemplate: '<object classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" id="{flashid}" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" border="0" width="{width}" height="{height}"><param name="movie" value="{url}"><param name="quality" value="high"><param name="wmode" value="transparent"><param name="menu" value="false"><embed src="{url}" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" name="{flashid}" width="{width}" height="{height}" quality="High" wmode="transparent"></embed></object>',
        /**
		@param {Object} 	option 					创建flash的选项参数
		@param {string} 	option.url 				flash文件的url
		@param {string} 	option.width 			flash的宽度
		@param {string} 	option.height 			flash的高度
		*/
        createFlashHtml: function (option) {
            option.id = option.id ? option.id : "";
            var result = this.flashTemplate.replace(/\{url\}/gi, option.url).replace(/\{width\}/gi, option.width).replace(/\{height\}/gi, option.height).replace(/\{flashid\}/gi, option.id);
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
            var domHeight = dom.offsetHeight;
            var domTargetHeight = showRowCount * showLineHeight;
            var domContent = dom.innerText || dom.textContent;
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
                    if(isTruncate){
                        dom.innerHTML = this.subStringByBytes(content, rowCount * width * 2 / fontSize, true);
                    }
                    else{
                        dom.innerHTML= content;
                    }

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
                        
                        if(slotData.keywordIsFlush && slotData.keywordIsFlush!==4){
                            var needFlush = false;
                            if( slotData.keywordIsFlush===1 ){
                                needFlush=true;
                            }
                            else if( slotData.keywordIsFlush===2 && key==="title"){
                                needFlush=true;
                            }
                            else if( slotData.keywordIsFlush===3 && key==="desc"){
                                needFlush=true;
                            }
                            if(needFlush){
                                var keywordPainter = using("Cpro.Template.KeywordPainter");
                                keywordPainter.flush( dom,  item["bid"], slotData.keywordFlushColor);
                            }
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
            containerBorderWidth: 1,
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
            urlIsShow: 1
        },
        /**
        嵌入式-图文物料样式变量默认值
        */
        inlay_tuwen: {
            containerPaddingRight: 8
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
            containerBorderWidth: 1,
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
            "backupColor": "ffffff",
            "backupUrl": "",
            "containerBorderColor": "ffffff",
            "containerBorderWidth": 0,
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
            "itemPaddingLeft": 0,
            "itemPaddingRight": 0,
            "itemPaddingTop": 0,
            "itemPaddingBottom": 0,
            "itemColumnSpace": 20,
            "itemColumnBorderWidth": 0,
            "itemColumnBorderStyle": "solid",
            "itemColumnPaddingTop": 0,
            "itemColumnPaddingLeft": 0,
            "itemColumnPaddingRight": 0,
            "itemColumnPaddingBottom": 0,
            "itemRowSpace": 10,
            "itemRowBorderWidth": 0,
            "itemRowBorderStyle": "solid",
            "itemRowPaddingTop": 0,
            "itemRowPaddingLeft": 0,
            "itemRowPaddingRight": 0,
            "itemRowPaddingBottom": 0,
            "logoIsShow": 1,
            "logoPaddingLeft": 0,
            "logoPaddingRight": 4,
            "logoPaddingTop": 0,
            "logoPaddingBottom": 0,
            "logoStyle": "-1",
            "titleFontColor": "0F0CBF",
            "titleFontFamily": "arial,sans-serif",
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
            "titleTextAlign": "left",
            "titleWidth": -1,
            "titleFontWeight": "normal",
            "titleBackgroundColor": "-1",
            "titleHoverFontColor": "-1",
            "titleHoverShowUnderline": -1,
            "titleHoverBackgroundColor": "-1",
            "titleVisitedFontColor": "-1",
            "titleVisitedShowUnderline": -1,
            "titleVisitedBackgroundColor": "-1",
            "titleActiveFontColor": "-1",
            "titleActiveShowUnderline": -1,
            "titleActiveBackgroundColor": "-1",
            "descFontColor": "444444",
            "descFontFamily": "arial,sans-serif",
            "descFontSize": 12,
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
            "descHoverFontColor": "-1",
            "descHoverShowUnderline": -1,
            "descHoverBackgroundColor": "-1",
            "descVisitedFontColor": "-1",
            "descVisitedShowUnderline": -1,
            "descVisitedBackgroundColor": "-1",
            "descActiveFontColor": "-1",
            "descActiveShowUnderline": -1,
            "descActiveBackgroundColor": "-1",
            "urlFontColor": "008000",
            "urlFontFamily": "arial,sans-serif",
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
            "urlHoverFontColor": "-1",
            "urlHoverShowUnderline": -1,
            "urlHoverBackgroundColor": "-1",
            "urlVisitedFontColor": "-1",
            "urlVisitedShowUnderline": -1,
            "urlVisitedBackgroundColor": "-1",
            "urlActiveFontColor": "-1",
            "urlActiveShowUnderline": -1,
            "urlActiveBackgroundColor": "-1"
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
        name:'FlashLayoutEngine',
        namespace: 'Cpro.Template',

        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.BaseLayoutEngine");

            //container
            var containerWidth = option.templateWidth;
            var containerHeight = option.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, option);
            if (option.adRowCount == 1 && option.adColumnCount == 1) {
                container.style["text-align"] = "center";
            }

            //item
            var itemWidth = Math.floor((container.style["width"] - option.itemColumnSpace * (option.adColumnCount - 1)) / option.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - option.itemRowSpace * (option.adRowCount - 1)) / option.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, option);

            //flash
            var flashLayout = engine.calculateFlash(item.style["width"], item.style["height"], option);
            var flashWidth = flashLayout.width;
            var flashHeight = flashLayout.height;
            var flash = engine.layoutFlash(flashWidth, flashHeight, option);
            layoutIndex[flash.dataKey] = flash;


            //组装item
            item.content.push(flash);


            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(option.itemColumnSpace, itemHeight, option);
            var rowSpace = engine.layoutRowSpace(itemWidth, option.itemRowSpace, option);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, option);

            container.layoutIndex = layoutIndex;
            return container;
        }
    };
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
    嵌入式-图片 布局引擎
    @class TextLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: 'ImageLayoutEngine',
        namespace: 'Cpro.Template',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.BaseLayoutEngine");

            //container
            var containerWidth = option.templateWidth;
            var containerHeight = option.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, option);
            if (option.adRowCount == 1 && option.adColumnCount == 1) {
                container.style["text-align"] = "center";
            }

            //item
            var itemWidth = Math.floor((container.style["width"] - option.itemColumnSpace * (option.adColumnCount - 1)) / option.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - option.itemRowSpace * (option.adRowCount - 1)) / option.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, option);

            //image
            var imageLayout = engine.calculateImage(item.style["width"], item.style["height"], option);
            var imageHeight = imageLayout.height;
            var imageWidth = imageLayout.width;
            var image = engine.layoutImage(imageWidth, imageHeight, option);
            layoutIndex[image.dataKey] = image;


            //组装item
            item.content.push(image);


            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(option.itemColumnSpace, itemHeight, option);
            var rowSpace = engine.layoutRowSpace(itemWidth, option.itemRowSpace, option);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, option);
            container.layoutIndex = layoutIndex;
            return container;
        }
    };
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
                keywordArray = keywordArray.split(" ");
            }
            if(keywordArray.length<=0){
                return;
            }
        
            keywordFlushColor = keywordFlushColor.replace("#","")
            for(var i=0, count=keywordArray.length; i<count; i++){
                var content = dom.innerHTML;
                var keyWord = keywordArray[i];
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
    @class LayoutEngineManager
    @namespace $baseName.UI.Template
    @static
    */
    return {
        name: 'LayoutEngineManager',
        namespace: 'Cpro.Template',
        /**
        获取布局引擎对象
        @method getLayoutEngine        
        @param {Object} option 本次请求的参数        
        @param {String} [option.displayType]  广告展现类型
        @param {String} [option.stuffType]  广告物料类型
        @param {Number} [option.width]  广告宽度
        @param {Number} [option.height]  广告高度
        @return {Object} 模板样式变量的默认值对象, key是fullName.
        */
        getLayoutEngine: function (option) {
            var result;
            this.Template = using("Cpro.Template");
            
            //函数重载. 如果传递的是字符串, 则标识获取指定名字的布局引擎
            if( typeof option ==="string" ){
                return this.Template[option];
            }
            
            //根据物料类型, 选择模板引擎
            switch (option.stuffType.toLowerCase()) {
            case "text":
                result = this.Template.TextLayoutEngine;
                break;
            case "image":
                result = this.Template.ImageLayoutEngine;
                break;
            case "tuwen":
                result = this.Template.TuwenLayoutEngine;
                break;
            case "flash":
                result = this.Template.FlashLayoutEngine;
                break;
            case "linkunit1":
                result = this.Template.LinkUnit1LayoutEngine;
                break;
            case "linkunit":
                result = this.Template.LinkUnitLayoutEngine;
                break;
            default:
                result = this.Template.TextLayoutEngine;
                break;
            }
            return result;
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
        name:'LinkUnit1LayoutEngine',
        namespace: 'Cpro.Template',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.BaseLayoutEngine");
            //container
            var containerWidth = option.templateWidth;
            var containerHeight = option.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, option);
            if (option.adRowCount == 1 && option.adColumnCount == 1) {
                container.style["text-align"] = "center";
            }

            //item
            var itemWidth = Math.floor((container.style["width"] - option.itemColumnSpace * (option.adColumnCount - 1)) / option.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - option.itemRowSpace * (option.adRowCount - 1)) / option.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, option);

            //title
            var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], option);
            var titleWidth = titleLayout.width;
            var titleHeight = titleLayout.height;
            var title = engine.layoutTitle(titleWidth, titleHeight, option);
            layoutIndex[title.dataKey] = title;


            //组装item
            item.content.push(title);

            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(option.itemColumnSpace, itemHeight, option);
            var rowSpace = engine.layoutRowSpace(itemWidth, option.itemRowSpace, option);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, option);
            container.layoutIndex = layoutIndex;
            return container;
        }
    };
});

declare(function() {
    /**
    嵌入式-文字 调整布局引擎,在数据引擎运行之后，再进行布局的第二次调整
    @class LinkUnitAdjustLayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name: "LinkUnitAdjustLayoutEngine",
        namespace: "Cpro.Template",
        hasClass: function(element, className) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                return element.className.match(reg);
        },
        layout: function(option) {
            var slotData = option.slotData;
            var layoutObj = option.layoutObj;
            var data = option.data;
            //获取广告容器
            var containerId = layoutObj.props.id?layoutObj.props.id: "container";
            var container = document.getElementById(containerId);
            var idPrefix = slotData.idPrefix || "";
            //获取数据引擎
            var DataEngine = using("Cpro.Template.DataEngine");
            var itmeSumWidth = 0; //所有广告title的宽度之和
            var columnIndex = 1; //保存当前元素所在列的序号
            var rowIndex = 1; //保存当前元素所在行的序号
            var grandFatherArray = [];//保存当前元素，也就是title的祖父元素item的数组
            //重置 itemColumnSpace 和 itemRowSpace值，用户如何自定义？第一版默认值为2
            var containerChildArray = container.childNodes; 
            slotData.itemColumnSpace = 2;
            slotData.itemRowSpace = 2;             
            for(var i=0,l=containerChildArray.length; i<l; i++){
                if(this.hasClass(containerChildArray[i],"itemColumnSpace")){
                    containerChildArray[i].style.width = slotData.itemColumnSpace+"px";
                }
                if(this.hasClass(containerChildArray[i],"itemRowSpace")){
                    containerChildArray[i].style.height = slotData.itemRowSpace+"px";
                }
            }
            for (var i = 0,count = data.length; i < count; i++) {  
                var item = data[i]; 
                var index = i;   
                var dom = null;                
                dom = document.getElementById(idPrefix + layoutObj.content[0].content[0].dataKey + index);    
                if (!dom) continue;    
                //如果广告块只有一行，则需要加和每个title的offsetWidth，然后将剩余宽度平均分配给每个item的padding，使得item直接的间距一致
                if(slotData.adRowCount == 1){
                    //因为textOverflow中有width:100%,导致offsetWidth不准确
                    dom.className = dom.className.replace("textOverflow","");
                    var titleoffsetWidth = dom.offsetWidth;
                    //给title,item重置宽度
                    dom.style.width = dom.parentNode.style.width = dom.parentNode.parentNode.style.width= titleoffsetWidth + "px";
                    itmeSumWidth = itmeSumWidth+titleoffsetWidth;//记录所有title元素需要的高宽
                     //重新给title元素添加class "offsetWidth" 
                    dom.className = dom.className + " textOverflow";
                    grandFatherArray.push(dom.parentNode.parentNode);//记录每行的item元素，一行遍历结束后，需要调整padding
                
                    //如果遍历结束，调整每个item的padding
                    if(columnIndex == slotData.adColumnCount){
                        var remainderWidth = slotData.templateWidth - slotData.containerPaddingRight - slotData.containerPaddingLeft - itmeSumWidth - (slotData.adColumnCount - 1) * slotData.itemColumnSpace;
                        //由于IE6不识别小数，故需要取整，然后针对最后一个dom做特殊处理
                        paddingWidth = Math.floor(remainderWidth/(slotData.adColumnCount*2));
                        for(var k=0;k<grandFatherArray.length;k++){ 
                            grandFatherArray[k].style.paddingLeft = paddingWidth + "px";
                            grandFatherArray[k].style.paddingRight = paddingWidth + "px";   
                        }
                        //针对最后一列的dom做特殊处理
                        grandFatherArray[columnIndex-1].style.paddingRight = remainderWidth - paddingWidth*(columnIndex*2-1)+"px"
                    }

                }
                columnIndex++; //保存当前元素所在列的序号,用来判断一行是否结束
               
                //调整item，title的height，lineheight
                var domHeight = Math.floor((slotData.templateHeight - slotData.containerPaddingTop - slotData.containerPaddingBottom - (slotData.adRowCount-1)*slotData.itemRowSpace)/slotData.adRowCount) - slotData.itemPaddingTop - slotData.itemPaddingBottom;
                dom.style.height =dom.parentNode.style.height = dom.parentNode.parentNode.style.height = dom.style.lineHeight = dom.parentNode.style.lineHeight = dom.parentNode.parentNode.style.lineHeight = domHeight+"px";
                dom.style.textAlign = dom.parentNode.style.textAlign = dom.parentNode.style.textAlign = dom.parentNode.parentNode.style.textAlign = "center";
               //针对最后一行的dom做特殊处理
                if(rowIndex == slotData.adRowCount){
                    dom.style.height = dom.parentNode.style.height = dom.parentNode.parentNode.style.height = dom.style.lineHeight = dom.parentNode.style.lineHeight = dom.parentNode.parentNode.style.lineHeight = slotData.templateHeight - slotData.containerPaddingTop - slotData.containerPaddingBottom - (slotData.adRowCount-1)*(slotData.itemRowSpace + domHeight + slotData.itemPaddingTop + slotData.itemPaddingBottom) + "px"
                }                
            
            }
            
        }
     
    }
});

declare(function () {
    /**
    嵌入式-文字 布局引擎
    @class LinkUnit1LayoutEngine
    @namespace $baseName.UI.Template
    */
    return {
        name:'LinkUnitLayoutEngine',
        namespace: 'Cpro.Template',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {

            /* 全局控制区域 */
            var isShowUrl = false; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.BaseLayoutEngine");

            // container
            option.containerPaddingLeft = 0;
            option.containerPaddingRight = 0;
            option.containerPaddingTop = 0;
            option.containerPaddingBottom = 0;
            var containerWidth = option.templateWidth;
            var containerHeight = option.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, option);
            if (option.adRowCount == 1) {
                container.style["text-align"] = "center";
            }

            //item
            option.itemPaddingLeft = 6;
            option.itemPaddingRight = 6;
            option.itemPaddingTop = 1;
            option.itemPaddingBottom = 1;
            var itemWidth = 7 * option.titleFontSize + option.itemPaddingLeft + option.itemPaddingRight;
            var itemHeight = option.titleFontSize + 4 + option.itemPaddingTop + option.itemPaddingBottom;
            var item = engine.layoutItem(itemWidth, itemHeight, option);


            //title
            option.titlePaddingLeft = 0;
            option.titlePaddingRight = 0;
            option.titlePaddingTop = 0;
            option.titlePaddingBottom = 0;
            var titleWidth = 7 * option.titleFontSize;
            var titleHeight = option.titleFontSize + 4;
            option.titleLineHeight = option.titleFontSize + 4;
            option.titleFontFamily = decodeURIComponent(option.titleFontFamily); //解码汉字
            if (option.titleFontFamily !== decodeURIComponent("%E5%AE%8B%E4%BD%93")) { //增加默认字体
                option.titleFontFamily += "," + decodeURIComponent("%E5%AE%8B%E4%BD%93");
            }
            if (option.adRowCount == 1) {
                option.titleTextAlign = "center";
            }
            var title = engine.layoutTitle(titleWidth, titleHeight, option);
            layoutIndex[title.dataKey] = title;


            //组装item
            item.content.push(title);


            //添加间距元素
            if (option.adColumnCount > 1) {
                option.itemColumnSpace = Math.floor(
                (option.templateWidth - 2 * option.containerBorderWidth - itemWidth * option.adColumnCount) / (option.adColumnCount - 1));
            }
            else {
                option.itemColumnSpace = option.templateWidth - 2 * option.containerBorderWidth - itemWidth * option.adColumnCount;
            }

            if (option.adRowCount > 1) {
                option.itemRowSpace = Math.floor(
                (option.templateHeight - 2 * option.containerBorderWidth - itemHeight * option.adRowCount) / (option.adRowCount - 1));
            }
            else {
                option.itemRowSpace = option.templateHeight - 2 * option.containerBorderWidth - itemHeight * option.adRowCount;
            }

            container = engine.layoutSpace(container, item, option);


            container.layoutIndex = layoutIndex;
            return container;
        }
    };
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
                default:
                    break;
                }

                dom.appendChild(domLink);
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
                logoDom.title="\u767e\u5ea6\u7f51\u76df\u63a8\u5e7f";
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
            var layoutObj = option.layoutObj;
            var userFullNameConfig = option.userFullNameConfig;
            var styleCssString = option.styleCssString || "";
            this.idPrefix=userFullNameConfig.idPrefix || "";

            result = this.drawDom(layoutObj);
            this.cssString += styleCssString;
            this.addCssByStyle(this.cssString);

            if (window.ad) {
                window.ad.parentNode.removeChild(window.ad);
                window.ad = null;
            }

            window.loader = document.getElementById(this.idPrefix+"loader");
            window.ad = result;
            window.loader.parentNode.insertBefore(result, window.loader);

            //<<a id="logo" class="logo" title="推广用户：www.tczlq.com" href="http://wangmeng.baidu.com/" target="_blank">&nbsp;</a>
            //添加推广logo
            if (userFullNameConfig.containerShowLogo) {
                var logoOption = {};
                if(userFullNameConfig.stuffType==="linkunit" || userFullNameConfig.stuffType==="linkunit1"){
                    logoOption.className="bd-logo2";
                }
                if( userFullNameConfig.logoStyle && userFullNameConfig.logoStyle.toString() !== "-1"){
                    logoOption.className = userFullNameConfig.logoStyle;
                }
                result.appendChild(this.drawLogo(logoOption));
            }
            window.loader = window.ad = result = null;

        }

    }
});

declare(function () {
    /**
    嵌入式-文字 单行布局引擎
    @class SingleLineLayoutEngine
    @namespace $baseName.UI.Template
    */
    return SingleLineLayoutEngine = {
        name:'SingleLineLayoutEngine',
        namespace:'Cpro.Template',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.BaseLayoutEngine");
            
            //container
            var containerWidth = option.templateWidth;
            var containerHeight = option.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, option);          

            //item
            var itemWidth = Math.floor((container.style["width"] - option.itemColumnSpace * (option.adColumnCount - 1)) / option.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - option.itemRowSpace * (option.adRowCount - 1)) / option.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, option);

            //title
            if( option.titleWidth &&  option.titleWidth!==-1){
                option.titleWidth = option.titleWidth;
            }
            else{
                //没有传递titleWidth, 自动计算
                if( !option.urlIsShow && !option.descIsShow ){
                    //url和desc都不显示, title占满item宽度
                    option.titleWidth = item.style["width"];
                }
                else{
                    //url或者desc显示, 则title默认为五分之二item宽度
                    var defaultTitleWidth = parseInt(2*item.style["width"]/5);
                    defaultTitleWidth = defaultTitleWidth>300?300:defaultTitleWidth;                
                    option.titleWidth = defaultTitleWidth;    
                }

            }
            var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], option);
            var titleWidth = titleLayout.width;
            var titleHeight = item.style["height"];
            var title = engine.layoutTitle(titleWidth, titleHeight, option);
            title.domName = "span";
            title.style["display"]="inline-block";
            title.style["text-overflow"] = option.titleIsShowEllipsis ? "ellipsis" : "clip";
            title.style["white-space"] = "nowrap";
            title.style["line-height"] = title.style["height"];
            layoutIndex[title.dataKey] = title;

            //url
            var urlWidth = 0;
            var urlHeight = titleHeight;
            if(option.urlIsShow){
                if( option.urlWidth &&  option.urlWidth!==-1){
                    urlWidth = option.urlWidth;
                }
                else{
                    //没有传递urlWidth, 自动计算
                    var defaultUrlWidth = parseInt(1*item.style["width"]/5);
                    defaultUrlWidth = defaultUrlWidth<100?100:defaultUrlWidth;
                    urlWidth = defaultUrlWidth;
                }

                var url = engine.layoutUrl(urlWidth, urlHeight, option);
                url.domName = "span";
                url.style["display"]="inline-block";
                url.style["text-overflow"] = option.urlIsShowEllipsis ? "ellipsis" : "clip";
                url.style["white-space"] = "nowrap";
                url.style["float"]="none";
                url.style["line-height"]=url.style["height"];
                layoutIndex[url.dataKey] = url;
            }
            
            //desc
            var descWidth = titleWidth; 
            var descHeight = titleHeight;
            if( option.descWidth && option.descWidth !== -1){
                descWidth = option.descWidth;
            }
            else{
                //没有传递descWidth, 自动计算
                var defaultDescWidth = itemWidth -  titleWidth - urlWidth;
                defaultDescWidth = defaultDescWidth<0?0:defaultDescWidth;
                descWidth = defaultDescWidth;
            }
            var desc = engine.layoutDesc(descWidth, descHeight, option);
            desc.domName = "span";
            desc.style["display"]="inline-block";
            desc.style["text-overflow"] = option.descIsShowEllipsis ? "ellipsis" : "clip";
            desc.style["white-space"] = "nowrap";
            desc.style["float"]="none";
            desc.style["line-height"]=desc.style["height"];
            layoutIndex[desc.dataKey] = desc;

            //组装item
            if (option.titleIsShow) {
                item.content.push(title);
            }
            if (option.descIsShow) {
                item.content.push(desc);
            }
            if (option.urlIsShow > 0 || (option.urlIsShow === -1 && isShowUrl)) {
                item.content.push(url);
            }

            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(option.itemColumnSpace, itemHeight, option);
            var rowSpace = engine.layoutRowSpace(itemWidth, option.itemRowSpace, option);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, option);
            container.layoutIndex = layoutIndex; 
            
            return container;
        }
    };
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
        获取所有参数列表
        @method getFullName
        @static
        */
        getVariables: function (userConfig) {
            var userFullNameConfig = {};
            var defaultValueManager = using("Cpro.Template.DefaultValueManager");
            var key;
            var paramFullName;
            //将shortName转换成fullName 
            for (key in userConfig) {
                paramFullName = this.getFullName(key.toLowerCase());
                if (paramFullName) {
                    userFullNameConfig[paramFullName] = userConfig[key];
                }
            }
            key = null;

            //写入展现类型和物料类型
            userFullNameConfig.displayType = userConfig.displayType;
            userFullNameConfig.stuffType = userConfig.stuffType;

            //从defaultValueManager类中, 根据当前用户的请求配置, 获取本次请求的默认值. 
            var defaultValue = defaultValueManager.getDefaultValue(userFullNameConfig);

            //使用用户设置的值替换默认值 
            for (key in userFullNameConfig) {
                if (key && (typeof userFullNameConfig[key] !== "undefined")) {
                    if (typeof userFullNameConfig[key] === "string") {
                        userFullNameConfig[key] = decodeURIComponent(userFullNameConfig[key]).replace("#", "");
                    }
                    defaultValue[key] = userFullNameConfig[key];
                }
            }

            //对于column和row参数的特殊处理
            if (userConfig.column) {
                defaultValue.adColumnCount = parseInt(userConfig.column);
            }
            if (userConfig.row) {
                defaultValue.adRowCount = parseInt(userConfig.row);
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
            "wn": "adRowCount",
            "hn": "adColumnCount",
            "rsi5": "KeywordIsFlush",
            "rss6": "KeywordFlushColor",
            "rad": "isShowUnrelated",
            "cad": "isShowPublicAd",
            "rss7": "backupColor",
            "aurl": "backupUrl",
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
            "itepl": "itemPaddingLeft",
            "itepr": "itemPaddingRight",
            "itept": "itemPaddingTop",
            "itepb": "itemPaddingBottom",
            "itecs": "itemColumnSpace",
            "itecbw": "itemColumnBorderWidth",
            "itecbs": "itemColumnBorderStyle",
            "itecpt": "itemColumnPaddingTop",
            "itecpl": "itemColumnPaddingLeft",
            "itecpr": "itemColumnPaddingRight",
            "itecpb": "itemColumnPaddingBottom",
            "iters": "itemRowSpace",
            "iterbw": "itemRowBorderWidth",
            "iterbs": "itemRowBorderStyle",
            "iterpt": "itemRowPaddingTop",
            "iterpl": "itemRowPaddingLeft",
            "iterpr": "itemRowPaddingRight",
            "iterpb": "itemRowPaddingBottom",
            "logis": "logoIsShow",
            "logpl": "logoPaddingLeft",
            "logpr": "logoPaddingRight",
            "logpt": "logoPaddingTop",
            "logpb": "logoPaddingBottom",
            "logs": "logoStyle",
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
            "titta": "titleTextAlign",
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
            "urlabc": "urlActiveBackgroundColor"
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
        name:'TextLayoutEngine',
        namespace:'Cpro.Template',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.BaseLayoutEngine");
            //container
            var containerWidth = option.templateWidth;
            var containerHeight = option.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, option);          

            //item
            var itemWidth = Math.floor((container.style["width"] - option.itemColumnSpace * (option.adColumnCount - 1)) / option.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - option.itemRowSpace * (option.adRowCount - 1)) / option.adRowCount);
            var item = engine.layoutItem(itemWidth, itemHeight, option);

            //title
            var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], option);
            var titleWidth = titleLayout.width;
            var titleHeight = titleLayout.height;
            var title = engine.layoutTitle(titleWidth, titleHeight, option);
            layoutIndex[title.dataKey] = title;

            //url
            var urlLayout = engine.calculateUrl(item.style["width"], item.style["height"], option);
            var urlWidth = urlLayout.width
            var urlHeight = urlLayout.height;
            var url = engine.layoutUrl(urlWidth, urlHeight, option);
            layoutIndex[url.dataKey] = url;

            //desc
            var descWidth = item.style["width"];
            var descHeight = item.style["height"] - titleHeight - urlHeight;
            if (option.urlIsShow === 0 || option.urlIsShow === -1 && engine.calculateDescRowCount(descHeight, option) < 2) { //如果用户指定不显示url, 或者用户没有指定但是剩下的空间不够显示两个desc, 则不显示url
                isShowUrl = false;
                descHeight = item.style["height"] - titleHeight;
            }
            var desc = engine.layoutDesc(descWidth, descHeight, option);
            layoutIndex[desc.dataKey] = desc;

            //组装item
            if (option.titleIsShow) {
                item.content.push(title);
            }
            if (option.descIsShow) {
                item.content.push(desc);
            }
            if (option.urlIsShow > 0 || (option.urlIsShow === -1 && isShowUrl)) {
                item.content.push(url);
            }

            //行间距元素和列间距元素
            var columnSpace = engine.layoutColumnSpace(option.itemColumnSpace, itemHeight, option);
            var rowSpace = engine.layoutRowSpace(itemWidth, option.itemRowSpace, option);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, option);
            container.layoutIndex = layoutIndex;
            
            //单条广告的特殊处理
            if (option.adRowCount == 1 && option.adColumnCount == 1) {
                //水平居中
                container.style["text-align"] = "center";
                item.style["text-align"] = "center";
                title.style["text-align"] = "center";
                
                //垂直居中
                var innerHeight = titleHeight + urlHeight + desc.style["line-height"] * desc.rowCount + option.descPaddingTop + option.descPaddingBottom;                
                item.style["padding-top"]  = item.style["padding-bottom"] = parseInt((containerHeight - innerHeight)/2);

            }
            
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
        name: 'TuwenLayoutEngine',
        namespace: 'Cpro.Template',
        /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
        layout: function (option) {

            /* 全局控制区域 */
            var isShowUrl = true; //是否显示url, 如果desc的内容显示小于两行, 则不显示url
            var layoutIndex = {}; //索引器
            var engine = using("Cpro.Template.BaseLayoutEngine");

            //container
            var containerWidth = option.templateWidth;
            var containerHeight = option.templateHeight;
            var container = engine.layoutContainer(containerWidth, containerHeight, option);

            //item
            var itemWidth = Math.floor((container.style["width"] - option.itemColumnSpace * (option.adColumnCount - 1)) / option.adColumnCount);
            var itemHeight = Math.floor((container.style["height"] - option.itemRowSpace * (option.adRowCount - 1)) / option.adRowCount);
           
            //单条广告的特殊处理
            if (option.adRowCount == 1 && option.adColumnCount == 1) {
                 //单个广告块最大宽度为600
                itemWidth = itemWidth > 500 ? 500 : itemWidth;
            }
            var item = engine.layoutItem(itemWidth, itemHeight, option);
            
            
            //========= 三种布局  ==========
            if (item.style["height"] <= 60 ) { //布局1: 图片独立一列, title+desc一列, 不显示url
                //图片, 独立一列		
                var logoLayout = engine.calculateLogo(item.style["width"], item.style["height"], option);
                var logoHeight = logoLayout.height;
                var logoWidth = logoLayout.width;
                var logo = engine.layoutLogo(logoWidth, logoHeight, option);
                layoutIndex[logo.dataKey] = logo;

                //title
                var titleLayout = engine.calculateTitle(item.style["width"] - logoWidth, item.style["height"], option);
                var titleWidth = titleLayout.width;
                var titleHeight = titleLayout.height;
                var title = engine.layoutTitle(titleWidth, titleHeight, option, "left");
                layoutIndex[title.dataKey] = title;

                //desc
                var descWidth = titleWidth;
                var descHeight = item.style["height"] - titleHeight;
                var desc = engine.layoutDesc(descWidth, descHeight, option, "left");
                layoutIndex[desc.dataKey] = desc;

                //组装item
                item.content.push(logo);
                item.content.push(title);
                item.content.push(desc);
                item.style["inner-height"]=logoHeight;
                layoutIndex["item"] = item;
            }
            else { //布局2, 3: title独立一行

                //title
                var titleLayout = engine.calculateTitle(item.style["width"], item.style["height"], option);
                var titleWidth = titleLayout.width;
                var titleHeight = titleLayout.height;
                var title = engine.layoutTitle(titleWidth, titleHeight, option);
                layoutIndex[title.dataKey] = title;

                var leftHeight = item.style["height"] - title.style["outer-height"]; //除去title后剩下的高度.  根据这个高度确定url是否独立显示一行

                var urlLayout = engine.calculateUrl(item.style["width"], item.style["height"], option);
                var urlWidth = urlLayout.width;
                var urlHeight = urlLayout.height;

                if (leftHeight - urlHeight >= 64) { //布局2: title独立一行, logo独立一列, desc独立一列, url独立一行
                    //url
                    var url = engine.layoutUrl(urlWidth, urlHeight, option);
                    layoutIndex[url.dataKey] = url;

                    //logo
                    var logoLayout = engine.calculateLogo(item.style["width"], item.style["height"] - titleHeight - urlHeight, option);
                    var logoHeight = logoLayout.height;
                    var logoWidth = logoLayout.width;
                    var logo = engine.layoutLogo(logoWidth, logoHeight, option);
                    layoutIndex[logo.dataKey] = logo;

                    //desc
                    var descWidth = item.style["width"] - logoWidth;
                    var descHeight = logoHeight;
                    var desc = engine.layoutDesc(descWidth, descHeight, option, "left");
                    layoutIndex[desc.dataKey] = desc;
                    
                    item.style["inner-height"]=titleHeight+logoHeight+urlHeight;
                    layoutIndex["item"] = item;
                }
                else { //布局3: title独立一行, logo独立一列, desc和url一列.

                    var logoLayout = engine.calculateLogo(item.style["width"], item.style["height"] - titleHeight, option);
                    var logoHeight = logoLayout.height;
                    var logoWidth = logoLayout.width;
                    var logo = engine.layoutLogo(logoWidth, logoHeight, option);
                    layoutIndex[logo.dataKey] = logo;

                    //url	
                    var urlLayout = engine.calculateUrl(item.style["width"] - logoWidth, item.style["height"], option);
                    var urlWidth = urlLayout.width
                    var urlHeight = urlLayout.height;
                    var url = engine.layoutUrl(urlWidth, urlHeight, option, "left");
                    layoutIndex[url.dataKey] = url;

                    //desc
                    var descWidth = item.style["width"] - logoWidth;
                    var descHeight = logoHeight - urlHeight;
                    isShowUrl = true; //默认显示url
                    if (engine.calculateDescRowCount(descHeight, option) < 2) { //不够显示两行, 则不显示url
                        descHeight = logoHeight;
                        isShowUrl = false;
                    }
                    var desc = engine.layoutDesc(descWidth, descHeight, option, "left");
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
            var columnSpace = engine.layoutColumnSpace(option.itemColumnSpace, itemHeight, option);
            var rowSpace = engine.layoutRowSpace(itemWidth, option.itemRowSpace, option);

            //组装container, 添加间距元素
            container = engine.layoutSpace(container, item, option);
            container.layoutIndex = layoutIndex;
            
            //单条广告的特殊处理
            if (option.adRowCount == 1 && option.adColumnCount == 1) {
                //水平居中
                item.style["margin-left"] = parseInt((containerWidth-itemWidth)/2);
            }
            
            //垂直居中处理. 根据item的内容高度和item占位高度只差, 自动判断是否需要垂直居中
            if( !option.itemVerticalAlign || option.itemVerticalAlign===-1){
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
        name:'CssBuilder',
        namespace: 'Cpro.Utility',
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
