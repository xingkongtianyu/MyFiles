DW = DW || {};
var save_check = true;
/**
 * 调试
 */
function debug(b){var c="",a;for(a in b)typeof b[a]===Object||String(b[a])==="[object Object]"?(c+="\n"+a+" =>\n",c+=debug(b[a])):c+=a+" : "+b[a]+"\n";alert(c)};

/*dialog box*/
(function($){
    //class为.wBox_close为关闭
    $.fn.wBox = function(options){
        var defaults = {
            wBoxURL: "wbox/",
            opacity: 0.35,//背景透明度
            callBack: null,
            noTitle: false,
            show:false,
            timeout:0,
            timeoutCallback:null,
            target:null,
            bg_dblclick:true, //双击背景是否关闭窗口
            requestType:null,//iframe,ajax,img
            title: "wBox Title",
            drag:true,
            iframeWH: {//iframe 设置高宽
                width: 400,
                height: 300
            },
            html: ''//wBox内容
        },_this=this;
        this.YQ = $.extend(defaults, options);
        var  wBoxHtml = '<div id="wBox"><div class="wBox_popup"><table><tbody><tr><td class="wBox_tl box_tl"/><td class="wBox_b"/><td class="wBox_tr box_tr"/></tr><tr><td class="wBox_b"><div style="width:7px;">&nbsp;</div></td><td><div class="wBox_body">' + (_this.YQ.noTitle ? '' : '<table class="wBox_title"><tr><td class="wBox_dragTitle"><div class="wBox_itemTitle">' + _this.YQ.title + '</div></td><td width="20px" title="关闭"><div class="wBox_close"></div></td></tr></table> ') +
        '<div class="wBox_content" id="wBoxContent"></div></div></td><td class="wBox_b"><div style="width:7px;">&nbsp;</div></td></tr><tr><td class="wBox_bl box_bl"></td><td class="wBox_b"></td><td class="wBox_br box_br"></td></tr></tbody></table></div></div>', B = null, C = null, $win = $(window),$t=$(this),l,t;//B背景，C内容jquery div
        this.showBox=function (){
            $("#wBox_overlay").remove();
            $("#wBox").remove();

            if( !$('#wBox_overlay').length)
            {
                B = $("<div id='wBox_overlay' class='wBox_hide'></div>").hide().addClass('wBox_overlayBG').css('opacity', _this.YQ.opacity).appendTo('body').fadeIn(300);
                if(_this.YQ.bg_dblclick) {
                    B.dblclick(function(){
                    _this.close();
                    })
            }
            }
            C = $(wBoxHtml).appendTo('body');
            handleClick();
        }


        /*
         * 处理点击
         * @param {string} what
         */
        function handleClick(){
            var con = C.find("#wBoxContent");
            if (_this.YQ.requestType && $.inArray(_this.YQ.requestType, ['iframe', 'ajax','img'])!=-1) {
                con.html("<div class='wBox_load'><div id='wBox_loading'><img src='"+_this.YQ.wBoxURL+"loading.gif' /></div></div>");
                if (_this.YQ.requestType === "img") {
                    var img = $("<img />");
                    img.attr("src",_this.YQ.target);
                    img.load(function(){
                        img.appendTo(con.empty());
                        setPosition();
                    });
                }
                else
                if (_this.YQ.requestType === "ajax") {
                    $.get(_this.YQ.target, function(data){
                        con.html(data);
                        C.find('.wBox_close').click(_this.close);
                        setPosition();
                    })

                }
                else {
                    ifr = $("<iframe name='wBoxIframe' style='width:" + _this.YQ.iframeWH.width + "px;height:" + _this.YQ.iframeWH.height + "px;' scrolling='auto' frameborder='0' src='" + _this.YQ.target + "'></iframe>");
                    ifr.appendTo(con.empty());
                    ifr.load(function(){
                        try {
                            $it = $(this).contents();
                            $it.find('.wBox_close').click(_this.close);
                            fH = $it.height();//iframe height
                            fW = $it.width();
                            w = $win;
                            newW = Math.min(w.width() - 40, fW);
                            newH = w.height() - 25 - (_this.YQ.noTitle ? 0 : 30);
                            newH = Math.min(newH, fH);
                            if (!newH)
                                return;
                            var lt = calPosition(newW);
                            C.css({
                                left: lt[0],
                                top: lt[1]
                            });

                            $(this).css({
                                height: newH,
                                width: newW
                            });
                        }
                        catch (e) {
                        }
                    });
                }

            }
            else
            if (_this.YQ.target) {
                $(_this.YQ.target).clone(true).show().appendTo(con.empty());

            }
            else
            if (_this.YQ.html) {
                con.html(_this.YQ.html);
            }
            else {
                $t.clone(true).show().appendTo(con.empty());
            }
            afterHandleClick();
        }
        /*
         * 处理点击之后的处理
         */
        function afterHandleClick(){
            setPosition();
            C.show().find('.wBox_close').click(_this.close).hover(function(){
                $(this).addClass("on");
            }, function(){
                $(this).removeClass("on");
            });
            //$(document).unbind('keydown.wBox').bind('keydown.wBox', function(e){
            //    if (e.keyCode === 27)
            //        _this.close();
            //    return true
            //});
            typeof _this.YQ.callBack === 'function' ? _this.YQ.callBack() : null;
            !_this.YQ.noTitle&&_this.YQ.drag?drag():null;
            if(_this.YQ.timeout){
                setTimeout(function(){
                    _this.close.call(this);
                    if(typeof _this.YQ.timeoutCallback === 'function'){
                        _this.YQ.timeoutCallback();
                    }
                },_this.YQ.timeout);
            }

        }
        /*
         * 设置wBox的位置
         */
        function setPosition(){
            if (!C) {
                return false;
            }

            var width = C.width(),  lt = calPosition(width);

            C.css({left: lt[0], top: lt[1]});

            var $h = $("body").height(), $wh = $win.height(),$hh=$("html").height();
            $h = Math.max($h, $wh);
            B.height($h).width($win.width())
        }
        /*
         * 计算wBox的位置
         * @param {number} w 宽度
         */
        function calPosition(w){
            l = ($win.width() - w) / 2;
            t = $win.scrollTop() + $win.height() /6;
            return [l, t];
        }
        /*
         * 拖拽函数drag
         */
        function drag(){
            var dx, dy, moveout;
            var T = C.find('.wBox_dragTitle').css('cursor', 'move');
            T.bind("selectstart", function(){
                return false;
            });

            T.mousedown(function(e){
                dx = e.clientX - parseInt(C.css("left"));
                dy = e.clientY - parseInt(C.css("top"));
                C.mousemove(move).mouseout(out).css('opacity', 0.8);
                T.mouseup(up);
            });
            /*
             * 移动改变生活
             * @param {Object} e 事件
             */
            function move(e){
                moveout = false;
                if (e.clientX - dx < 0) {
                    l = 0;
                }
                else
                if (e.clientX - dx > $win.width() - C.width()) {
                    l = $win.width() - C.width();
                }
                else {
                    l = e.clientX - dx
                }
                C.css({
                    left: l,
                    top: e.clientY - dy
                });

            }
            /*
             * 您已经out
             * @param {Object} e 事件
             */
            function out(e){
                moveout = true;
                setTimeout(function(){
                    moveout && up(e);
                }, 10);
            }
            /*
             * 放弃
             * @param {Object} e事件
             */
            function up(e){
                C.unbind("mousemove", move).unbind("mouseout", out).css('opacity', 1);
                T.unbind("mouseup", up);
            }
        }

        /*
         * 关闭弹出框就是移除还原
         */
        this.close=function (){
            if (C) {
                B.remove();
                C.stop().fadeOut(300, function(){
                    C.remove();
                })
            }
        }

        this.rem = function(){
            if (C) {
                B.remove();
                C.remove();
            }
        }
        /*
         * 重新定位
         */
        this.setPos = function setPos(){
            setPosition();
        }

        /*
         * 触发click事件
         */
        $win.resize(function(){
            setPosition();
        });
        _this.YQ.show?_this.showBox():$t.click(function(){
            _this.showBox();
            return false;
        });
        return this;
    };
})(jQuery);


/*用户头部菜单*/
(function(a){a("._topMenu li").unbind("mouseover mouseleave").bind("mouseover",function(){a(this).addClass("this");var b=a(this).find(".items");b.length&&b.show()}).bind("mouseleave",function(){a(this).removeClass("this");var b=a(this).find(".items");b.length&&b.hide()})})(jQuery);


/**
 * 工具
 *
 */
DW.util = {
    create_input: function(text, classname)
    {
        return $('<input class='+classname+' type="text" value="'+text+'" />');
    },
    create_textarea: function(text, classname)
    {
        return $('<textarea class="'+classname+'">'+text+'</textarea>');
    },
    create_btn: function(text, classname)
    {
        return $('<a href="javascript:void(0)" class="'+classname+'">'+text+'</a>')
    },
    create_img: function(img_url)
    {
        if(img_url == '')
        {
            img_url = '/theme/images/loading.gif';
        }
        return $('<img src="'+ img_url +'" />');
    },
    substr: function(str, len)
    {
        var strlen = 0;
        var s = "";
        for(var i = 0;i < str.length;i++)
        {
            if(str.charCodeAt(i) > 128){
                strlen += 2;
            }else{
                strlen++;
            }
            s += str.charAt(i);
            if(strlen >= len){
                return s ;
            }
        }
        return s;
    },
    create_suggest_list: function(data, link, state, filter_id)
    {
        var html = '';

        if(!data.length)
        {
            return html;
        }

        var obj_type = [];
        obj_type[1] = '';
        obj_type[2] = '话题';
        obj_type[3] = '问题';

        var span_txt = [];
        span_txt[1] = '';
        span_txt[2] = '';
        span_txt[3] = '个答案';

        html += '<dl>';
        for(var i=0; i<data.length; i++)
        {
            var obj = data[i];
            var avatar = obj.type == 1 ? '<img class="suggest_img" src="'+obj.img+'" />' : '';
            var state_html = state == true ? '<span class="suggest_type">'+ (obj.count > 0 ? obj.count + span_txt[obj.type] : obj_type[obj.type]) +'</span>' : '';
            var class_name = '';
            if(obj.id == filter_id)
            {
                continue;
            }
            switch(obj.type)
            {
                case 1://user
                    class_name = 'user_bar';
                    break;
                case 2://topic
                    class_name = 'topic_bar';
                    break;
                case 3://question
                    class_name = 'qst_bar';
                    break;
            }

            if(!link) {
                html += '<dd type="'+obj.type+'" num="'+ i +'" id="'+ obj.id +'" url="'+ obj.url +'" title="'+ obj.text +'"><span class="'+class_name+'">'+ avatar+obj.title +'</span>'+ state_html +'</dd>';
            } else {
                html += '<dd type="'+obj.type+'" num="'+ i +'" id="'+obj.id+'" title="'+obj.text+'">'+avatar+'<a class="'+class_name+'" href="'+obj.url+'">'+obj.title+'</a>'+ state_html +'</dd>';
            }
        }
        html += '</dl>';
        return html;
    },
    close_suggest_list: function(data, link, state, filter_id) {
        var html = '';

        if(!data.length)
        {
            return html;
        }

        var obj_type = [];
        obj_type[1] = '';
        obj_type[2] = '话题';
        obj_type[3] = '问题';

        html += '<dl>';
        for(var i=0; i<data.length; i++)
        {
            var obj = data[i];
            var avatar = obj.type == 1 ? '<img class="suggest_img" src="'+obj.img+'" />' : '';
            var state_html = state == true ? '<span class="suggest_type">'+obj_type[obj.type]+'</span>' : '';
            var class_name = 'qst_bar';
            if(obj.id == filter_id)
            {
                continue;
            }

            html += '<dd type="'+obj.type+'" num="'+ i +'" id="'+ obj.id +'" url="'+ obj.url +'" title="'+ obj.text +'"><span class="'+class_name+'">'+ avatar+obj.title +' (ID:'+ obj.id +')'+'</span>'+ state_html +'</dd>';
        }
        html += '</dl>';
        return html;
    },
    msg_box: function(ele, msg, time){
        var box = $('<div>'+ msg +'</div>');
        box.addClass('site_msg_box');
        $(ele).before(box);
        if(time > 0)
        {
            box.delay(time);
        }
        box.fadeIn(400).delay(2500).slideUp(500, function(){$(this).remove()});
    },
    msg: function(msg, timeout,callback) {
        timeout = timeout == undefined ? 1500 : timeout;
        callback = callback ==  undefined ? null :callback;
        var box = $('#wBox').wBox({
            noTitle:true,
            drag:false,
            opacity:0.1,
            title: "系统提示",
            html: '<div style="width:280px;">'+msg+'</div>',
            timeout:timeout,
            timeoutCallback:callback
        });
        box.showBox();
    },
    tip: function(obj) {
        var _this = $(obj);
        var offset = _this.offset();
        var msg = _this.attr('title');
        var tip_tpl = '<div class="tip_wrap"><p>'+msg+'</p><div class=""tip_arrow></div></div>';
        var tip = $(tip_tpl).css({top:offset.top+_this.outerHeight(), left:offset.left}).appendTo('body')
            .unbind('mouseleave').mouseleave(function(){$(this).remove()});
    },
    error_msg: function(obj, msg,time) {
        var offset = obj.offset();
        var box = $('<div class="error_tip error_tip_msg">'+ msg +'</div>');
        $('.error_tip_msg').remove();
        var left = offset.left;
        if(offset.left> 1000) {
            left = left - 150;
        }
        if(time === undefined ) {
            time = 3000;
        }
        box.css({'z-index':10, position:'absolute', top:offset.top+obj.outerHeight() + 1, left:left, display: "none"}).appendTo('body');
        box.fadeIn('fast').dblclick(function(){$(this).remove()}).delay(time).fadeOut('fast', function(){$(this).remove()});
    },
    loading: function() {
        var loading = $('<span id="top_loading">loading...</span>').appendTo('body');
    },
    rm_loading: function() {
        $('#top_loading').remove();
    },
    search_statistics:function(type){
        $("dd[type='"+type+"']").find('a').mousedown(function(){
            Cookies.set(cookie_prefix('temp_hash'),'#search','','/');
        })
    },
    confirm:function(msg,callback,other){

        var submit_name = "确定";
        var cancel_name = "取消";
        if(other != undefined) {
            if(other.submit_name){
                submit_name = other.submit_name;
            }
            if(other.cancel_name) {
                cancel_name = other.cancel_name;
            }
        }
        var box = $('#wBox').wBox({
            noTitle:false,
            drag:false,
            opacity:0.1,
            title: "确认提示",
            html: '<div class="popdiv" id="poperclose"><div class="wrap">'+
                    '<div class="listct">' + msg +'</div>' +
                    '<div class="btn1">' +
                        '<span class="btns"><a class="cancel shield_feed" href="javascript:void(0);">'+ cancel_name +'</a><a class="re shield_enter" href="javascript:void(0)">'+ submit_name +'</a></span>'+
                    '</div>' +
                '</div></div>',
            timeout:0
        });
        box.showBox();
        $('.shield_feed').unbind('click').click(function(){
            box.rem();
            callback.call(this,false);
        });
        $('.shield_enter').unbind('click').click(function(){
            box.rem();
            callback.call(this,true);
        });
    },
    format_points:function(points) {

        var points = Number(points);
        if(isNaN(points)) return 0;
        if( points < 10000) return points;
        var num = (points/1000).toFixed(2);
        var tmp = Math.floor(num);
        return tmp + (num - tmp) + 'K';
    },
    check_length:function(){
        var byteLength = function(b) {
            if (typeof b == "undefined") {
                return 0;
            }
            var a = b.match(/[^\x00-\x80]/g);
            return (b.length + (!a ? 0 : a.length));
        };

        return function(q, g) {
            g = g || {};
            g.max = g.max || 140;
            g.min = g.min || 41;
            g.surl = g.surl || 22;
            var p = $.trim(q).length;
            if (p > 0) {
                var j = g.min,
                s = g.max,
                b = g.surl,
                n = q;
                var r = q.match(/(http|https|ftp):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z\$\.\+\!\_\*\(\)\/\,\:;@&=\?~#%]*)*/gi) || [];
                var h = 0;
                for (var m = 0, p = r.length; m < p; m++) {
                    var o = byteLength(r[m]);
                    h += o <= s ? b: (o - s + b);
                    n = n.replace(r[m], "");
                }
                return g.max - Math.ceil((h + byteLength(n)) / 2);
            } else {
                return g.max;
            }
        }
    }()
};

/*顶部suggest search*/
DW.search_suggest = null;

function radio(a,b,c){for(var d=1;d<=c;d++)document.getElementById(a+d).style.display="none";document.getElementById(a+b).style.display="block"}
function showcon(obj){
    if (obj ==  'notices') {
        if ($(".notify_btn").find("img").length > 0) {
            $(".notify_btn").find("img").remove();
            $(".notify_btn").find("span").attr('class', 'ico');
        }
    }
    var obj = $('#'+obj);
    if(obj.is(':hidden')){
        obj.show();
    } else {
        obj.hide();
    }

    if(arguments.length == 1) {
        obj.parent('div').bind('mouseover',function(){
            obj.show();
        }).bind('mouseleave',function(){
            obj.hide();
            $(this).unbind('mouseover mouseleave');
        });
    } else if(arguments.length > 1) {
        $('#'+arguments[1]).hide();
    }
}
function closepop(a){document.getElementById(a).style.display="none"}function closelink(a){a.parent().remove();var b=[];$("#addtagdiv").find("a").each(function(){b.push($(this).text())});$("#user_label").val(b.join(","))}
function addtags(){var a=$("input[name='tag']");if($.trim(a.val())=="")return a.focus(),false;var b=$("#addtagdiv"),c=b.html(),d='<a href="#x">'+$.trim(a.val())+'<span onclick="closelink($(this));"></span></a>';a.val("");a.focus();b.html(c+d);var e=[];$("#addtagdiv").find("a").each(function(){e.push($(this).text())});$("#user_label").val(e.join(","))}function changeed(a,b){document.getElementById(a).style.display="none";document.getElementById(b).style.display="block"}
function topmenu(a,b,c){}
$(function(){
   $('.singin').hover(function(){
      $('#ullogin').show();
   },function(){
      $('#ullogin').hide();
   })
})

/**
 * 投票功能
 */
var DW = DW || {};
DW.vote = (function($){
    var timer, vtimer, up_tip = [], down_tip = [], tip;
    up_tip[3] = '好问题：这是一个描述清晰的好问题，顶到首页。';
    up_tip[4] = '好答案。';
    down_tip[3] = '问题水化、平庸，对其投反对票，将扣掉作者2点声誉';
    down_tip[4] = '保证内容质量，对其投反对票，将扣掉作者2点声誉';

    function exec_vote(obj, id, vote, type, action)
    {
        if(id.indexOf('|') > -1) {
           var res = id.split('|');
           id = res[0];
           var fid = res[1];
        } else {
           var fid = 0;
        }
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: '/ajax/vote',
                data: 'id='+id+'&vote='+vote+'&type='+type+'&'+new Date().getTime()+"&ajax=1",
                //data: 'id='+id+'&vote='+vote+'&type='+type+'&'+new Date().getTime()+"&ajax=1&ref="+DW.global.ref+"&cur="+location.href,
                success: function(msg){
                    var result = $.parseJSON( msg );
                    if(result.success == 1)
                    {
                        var btn_up = obj.find('.upbtn, .btnbox');
                        var btn_down = obj.find('.downbtn, .btnboxd');
                        var is_question_page = obj.hasClass('qbox') ? true : false;

                        var history_vote = parseInt(obj.attr('vote'));
                        var voting = parseInt(result.voting);
                        var result_score = parseInt(result.result_score);
                        var editor = result.editor;
                        var points = 0;
                        var res_score = 0;
                        if(voting > 0)
                        {
                            if(history_vote < 0)
                            {
                                if( is_question_page ) {
                                    btn_down.removeClass('qbtnacti');
                                } else {
                                    btn_down.removeClass('btnacti');
                                }
                            }
                            res_score = history_vote == 0 ? 1 : 2;
                            if( is_question_page ) {
                                btn_up.addClass('qbtnact');
                            } else {
                                btn_up.addClass('btnact');
                            }
                            if(result.obj_type == 3) {
                                points = 5;
                            } else if(result.obj_type == 4) {
                                points = 10;
                            }
                        }
                        else if(voting < 0)
                        {
                            if(history_vote > 0)
                            {
                                if( is_question_page ) {
                                    btn_up.removeClass('qbtnact');
                                } else {
                                    btn_up.removeClass('btnact');
                                }
                            }
                            res_score = history_vote == 0 ? -1 : -2;
                            if( is_question_page ) {
                                btn_down.addClass('qbtnacti');
                            } else {
                                btn_down.addClass('btnacti');
                            }
                        }
                        else if(voting == 0)
                        {
                            if(history_vote > 0)
                            {
                                if( is_question_page ) {
                                    btn_up.removeClass('qbtnact');
                                } else {
                                    btn_up.removeClass('btnact');
                                }
                            }
                            else if(history_vote < 0)
                            {
                                if( is_question_page ) {
                                    btn_down.removeClass('qbtnacti');
                                } else {
                                    btn_down.removeClass('btnacti');
                                }
                            }
                            res_score = history_vote > 0 ? -1 : 1;
                        }
                        obj.attr('vote', voting);



                        //更改投票显示数
                        if(obj.find('b.votes_score').length)
                        {
                            if(parseInt(result.is_repeat) == 1) {
                                res_score = parseInt(obj.find('b.votes_score').text()) + res_score;
                            }else {
                                res_score = parseInt(result_score);
                            }
                        	obj.find('b.votes_score').text(res_score + ' 票');
                        }
                        else
                        {
                            if(parseInt(result.is_repeat) == 1) {
                                res_score = parseInt(obj.next().find('span.votes_score').text()) + res_score;
                            }else {
                                res_score = parseInt(result_score);
                            }
                        	obj.next().find('span.votes_score').text(res_score + ' 票');
                        }

                        var remain_votes = parseInt(result.remain_votes);
                        //投正票成功显示效果
                        if(voting > 0 && result.is_show_guide == 1) {
                            if( fid > 0 ) {
                                if(!is_question_page) {
                                    var fid_obj = obj.closest(".floatul").prev("div[id*='question_vote_']");
                                    if(fid_obj.length) {
                                        up_vote_success(result.obj_type, fid_obj, remain_votes);
                                    }
                                } else {
                                    up_vote_success(result.obj_type,fid,remain_votes);
                                }
                            } else {
                                up_vote_success(result.obj_type,id,remain_votes);
                            }
                        } else {
                            if(remain_votes > 0 && remain_votes < 6)
                            {
                                var obj_type = '';
                                switch(result.obj_type)
                                {
                                    case '3':
                                        obj_type = '问题';
                                    break;
                                    case '4':
                                        obj_type = '答案';
                                    break;
                                    case '6':
                                    case '7':
                                    case '8':
                                        obj_type = '评论';
                                    break;
                                }
                                DW.util.error_msg(obj, "您今天对"+ obj_type +"的投票还剩余"+ remain_votes +"次");
                            }
                        }
                    }
                    else
                    {
                        //alert(result.message);
                        DW.util.error_msg(obj, result.message);
                    }
                }
            });
        }, 400);
        return;
    }

    function up_vote(obj, type)
    {

        var offset = obj.offset();
        var tip_left = offset.left - (50 - obj.outerWidth()) / 2;
        var tip_top = offset.top -40;
        var tip = $('<span class="vote_pop_up">'+ type +'</span>')
            .appendTo('body')
            .css({top:tip_top, left:tip_left, position:'absolute', 'z-index':10})
            .animate({top: '-=10', opacity: 0}, 550, 'swing', function(){$(this).remove()});
    }

    function down_vote(obj, type)
    {
        var offset = obj.offset();
        var tip_left = offset.left - (50 - obj.outerWidth()) / 2;
        var tip_top = offset.top + obj.outerHeight();
        var tip = $('<span class="vote_pop_down">'+ type +'</span>')
            .appendTo('body')
            .css({top:tip_top, left:tip_left, position:'absolute', 'z-index':10})
            .animate({top: '+=10', opacity: 0}, 550, 'swing', function(){$(this).remove()});
    }

    function up_vote_success(type,id,remain) {
        if(type == 3) {
            var self;
            if( isNaN(id) ) {
                self = id;
            } else {
                self = $('#question_vote_'+id)
            }
        } else if(type == 4) {
            var self = $('#answer_vote_'+id);
        }
        self.animate({height:'toggle',opacity:1},500,'swing',function(){
            var obj = $(this);
            if(obj.find('.blackthis').length){
                obj.find('.blackthis').remove();
            }
            if(remain >0 && remain < 6) {
                obj.append('<span class="blackthis">您今日剩余投票次数：'+remain+'次</span>')
            }
            obj.find('.close').unbind('click').click(function(){
                clearTimeout(votetimer);
                obj.animate({height:'toggle',opacity:0},500,'swing',function(){
                    if(obj.find('.blackthis').length){
                        obj.find('.blackthis').remove();
                    }
                });
            });
            var votetimer = setTimeout(function(){
                obj.animate({height:'toggle',opacity:0},500,'swing',function(){
                    if(obj.find('.blackthis').length){
                        obj.find('.blackthis').remove();
                    }
                })
            },14000);
         });
    }

    function get_tpl(txt) {
        return '<div id="zh-tooltip" class="r5px"><div id="zh-tooltip-arrow"> </div><p id="zh-tooltip-content">'+ txt +'</p></div>';
    }

    function get_pos(obj) {
        var offset = obj.offset();
        var box_left = offset.left + obj.width() +7;
        var box_top = offset.top -3;
        return [box_left, box_top];
    }

    function init(node)
    {
        var list = typeof(node) == 'string' ? $(node) : node;

        list.each(function(){
            var li = $(this);
            var btn_up = li.find('.upbtn, .btnbox');
            var btn_down = li.find('.downbtn, .btnboxd');
            var rel = li.attr('rel').split('|');
            var type = rel[0], id = rel[1];
            if(rel.length == 3) {
               id = id + '|' + rel[2];
            }
            var up_over_timer, down_over_timer;


            //投正票
            btn_up.unbind('click mouseover mouseout').click(function(){

                if(!DW.global.uid) {
                    Tip_login.vote.do_vote(li);
                    return false;
                }

                var _this = $(this);
                vote = parseInt(li.attr('vote'));
                //如果之前投的正票
                if(vote == 1)
                {
                    clearTimeout(vtimer);
                    vtimer = setTimeout(function(){up_vote(_this, '-1')}, 1);

                    //ajax发送给PHP
                    exec_vote(li, id, 0, type, 'up');
                }
                else
                {
                    clearTimeout(vtimer);
                    vtimer = setTimeout(function(){up_vote(_this, '+1')}, 1);

                    //ajax to php
                    exec_vote(li, id, 1, type, 'up');
                }

            }).mouseover(function(){
                var _this = $(this);
                var pos = get_pos(_this);
                var tpl = get_tpl( up_tip[type] );
                tip     = $(tpl).css({position:'absolute', left:pos[0], top:pos[1], 'zIndex':110}).hide();
                clearTimeout(up_over_timer);
                up_over_timer = setTimeout(function() {
                    tip = tip.appendTo('body').fadeIn();
                }, 1000);
            }).mouseout(function(){
                clearTimeout(up_over_timer);
                if(tip != null)
                {
                    tip.remove();
                }
            });

            //投负票
            btn_down.unbind('click mouseover mouseout').click(function(){

                if(!DW.global.uid) {
                    Tip_login.vote.do_vote(li);
                    return false;
                }

                var _this = $(this);
                vote = parseInt(li.attr('vote'));

                //如果之前投的正票
                if(vote == -1)
                {
                    clearTimeout(vtimer);
                    vtimer = setTimeout(function(){down_vote(_this, '+1')}, 1);
                    //ajax发送给PHP
                    exec_vote(li, id, 0, type, 'down');
                }
                else
                {
                    clearTimeout(vtimer);
                    vtimer = setTimeout(function(){down_vote(_this, '-1')}, 1);
                    //ajax to php
                    exec_vote(li, id, -1, type, 'down');
                }
            }).mouseover(function(){
                var _this = $(this);
                var pos = get_pos(_this);
                var tpl = get_tpl( down_tip[type] );
                tip = $(tpl).css({position:'absolute', left:pos[0], top:pos[1], 'zIndex':110}).hide();
                clearTimeout(down_over_timer);
                down_over_timer = setTimeout(function() {
                    tip = tip.appendTo('body').fadeIn();
                }, 1000);
            }).mouseout(function(){
                clearTimeout(down_over_timer);
                tip.remove();
            });
        });
    }

    return{
        init:init
    };
})(jQuery);

/**
 * 更多问题列表
 */
DW.show_more=function(c){function g(a){var t = $(".qa_activity").children("a").attr("href").split("/")[2];a.replaceWith('<p class="morequestions">\u67e5\u627e\u66f4\u591a\u95ee\u9898? \u6d4f\u89c8<a href="/topic/'+t+'/all" class="c_369">\u67e5\u770b\u6240\u6709\u95ee\u9898</a></p>').unbind("click")}function i(a,f,d,e,j){clearTimeout(h);h=setTimeout(function(){c.ajax({type:"POST",url:"/ajax/show_more_questions",data:"question_type="+encodeURIComponent(d)+"&page="+e+"&tid="+j+"&"+(new Date).getTime()+"&ajax=1",beforeSend:function(){a.find("span").addClass("loading")},
success:function(b){a.find("span").removeClass("loading");b?(b=c(b),b.find("#ajax_show_more").length>0&&(g(a),b.find("#ajax_show_more").remove()),b.hide(),f.append(b),b.animate({opacity:"show"},{duration:500}),DW.vote.init(b.find(".voting")),DW.tip_layer.init_topic(b.find(".tp")),DW.tip_layer.init_user(b.find(".u_layer")),DW.follow.question(b.find(".q_follow")),imglazyload.add(b)):g(a)}})},200)}var h;return{init:function(a,f){var d=c("#"+f),e=c("#"+a);if(c.isEmptyObject(d)||c.isEmptyObject(e))return false;
d.unbind("click").click(function(){var a=e.find(".partline").last().attr("rel").split("|");question_type=a[0];page=parseInt(a[1])+1;tid=a[2]?parseInt(a[2]):0;i(d,e,question_type,page,tid)})}}}(jQuery);


/**
 * 更多feed信息
 */
DW.show_more_feeds = (function($){
    var timer, result=true, question_type, tid, page, container, btn;

    function error_msg()
    {
        btn.remove();
    }

    function get_feeds(user_info_id)
    {
        var data, last_feed, url;
        url  = '/ajax/show_more_feeds';
        data = 'user_info_id='+ user_info_id + '&page='+page+'&'+new Date().getTime()+"&ajax=1&is_tab=0";
        last_feed = container.find('.itemtop').last().attr('rel');
        if ($('#questions_area').hasClass('flag_show_new_qa')) {
            data += '&btn_type=new_qa&inbox_type=inner&last_feed_id='+last_feed;
        } else if($('#questions_area').hasClass('flag_show_latest')) {
            data += '&btn_type=latest&inbox_type=outer&last_feed_id='+last_feed;
        } else if($('#questions_area').hasClass('flag_show_all')) {
            data += '&btn_type=all&inbox_type=inner&last_feed_id='+last_feed;
        } else if($('#questions_area').hasClass('flag_show_best')) {
            data += '&btn_type=best&inbox_type=outer&last_feed_id='+last_feed;
        } else {
            data += '&last_feed_id='+last_feed;
        }

        if($('#questions_area').hasClass('flag_show_community')) {
            url  = '/ajax/show_community_feeds';
            data = 'page='+page+"&ajax=1&last_feed_id="+last_feed;
        }

        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                beforeSend:function(XMLHttpRequest){
                    btn.find('span').addClass('loading');
                },
                success: function(msg){
                    btn.find('span').removeClass('loading');
                    if(msg)
                    {
                        var s = $(msg);
                        s.hide();
                        container.append(s);
                        s.animate({
                           opacity: 'show'
                         }, {duration: 500});

                         if(s.find('#ajax_show_more').length > 0) {
                            //btn.remove();
                            //去除"更多"按钮
                            $('#show_questions').remove();
                            s.find('#ajax_show_more').remove();
                            if($('#questions_area').hasClass('flag_show_community')) {
                                $('#suggest_inhot_b').show();
                            }
                        }

                        /*-----js初始化-----*/
                        //vote 初始化
                        DW.vote.init(s.find('.voting') );
                        //主题浮动层初始化
                        DW.tip_layer.init_topic( s.find('.t_layer') );
                        //用户浮动层
                        DW.tip_layer.init_user( s.find('.u_layer') );
                        //关注问题初始化
                        DW.follow.question( s.find('.q_follow') );
                        DW.follow.user( s.find('.u_follow') );
                        DW.follow.topic( s.find('.t_follow') );
                        DW.view_full_content.init();
                        DW.show_more_feeds.init('questions_area', 'show_questions', user_info_id);
                        DW.show_filter_feeds.init();
                        DW.show_feed_option.init();
                    }
                    else
                    {
                        //result = false;
                        error_msg();
                    }
                }
            });
        }, 200);
    }

    function init(container_id, btn_id, if_user)
    {
        btn = $('#'+btn_id);
        container = $('#'+container_id);

        if($.isEmptyObject(btn) || $.isEmptyObject(container))
        {
            return false;
        }

        btn.unbind('click').click(function(){
            var rel = container.find('.partline').last().attr('rel').split('|');
            if (if_user != '' && if_user != null) {
                var user_info_id = if_user;
            } else {
                var user_info_id = -99;
            }
            page = parseInt(rel[1]) + 1;
            tid = rel[2] ? parseInt(rel[2]) : 0;

            if(result)
            {
                get_feeds(user_info_id);
            }
            else
            {
                error_msg();
            }
        });
    }

    return {
        init:init
    };
})(jQuery);

/**
 * 过滤feed信息
 */
DW.show_filter_feeds = (function($){
    var timer, btn;

    function get_feeds(user_info_id, inbox_type, btn_type)
    {
        var data, url;
        data = 'user_info_id='+ user_info_id +'&'+new Date().getTime()+"&ajax=1&inbox_type="+inbox_type+"&btn_type="+btn_type+"&is_tab=1";
        url  = '/ajax/show_more_feeds';

        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                beforeSend:function(XMLHttpRequest){
                    //btn.find('span').addClass('loading');
                    $('#feed_loading').show();
                },
                success: function(msg){
                    //btn.find('span').removeClass('loading');
                    if(msg)
                    {
                        var s = $(msg);
                        s.hide();
                        if(s.find('#ajax_show_more').length > 0) {
                            //btn.remove();
                            s.find('#ajax_show_more').remove();
                        }

                        if (btn_type == 'new_qa') {
                            //为展示更多增加标记
                            s.find('#show_questions').addClass('flag_show_new_qa');
                        }

                        //替换旧的新鲜事数据
                        $('#feed_replace_area').html(s);
                        s.animate({
                           opacity: 'show'
                         }, {duration: 500});

                        /* js初始化 */
                        //DW.feed.init();
                        $('#feed_loading').hide();
                        $('#new_feed').hide();
                        DW.feed.clear();
                        //vote 初始化
                        DW.vote.init(s.find('.voting') );
                        //主题浮动层初始化
                        DW.tip_layer.init_topic( s.find('.t_layer') );
                        //用户浮动层
                        DW.tip_layer.init_user( s.find('.u_layer') );
                        //关注问题初始化
                        DW.follow.question( s.find('.q_follow') );
                        DW.follow.user( s.find('.u_follow') );
                        DW.follow.topic( s.find('.t_follow') );
                        DW.view_full_content.init();
                        DW.show_more_feeds.init('questions_area', 'show_questions');
                        DW.show_filter_feeds.init();
                        DW.show_feed_option.init();
                    }
                    $('#feed_loading').hide();
                }
            });
        }, 200);
    }

    function init()
    {
        var show_all = $('#show_all');
        var filter = $('#show_new_qa_only');
        var show_latest = $('#show_latest');
        var show_best   = $('#show_best');

        var user_info_id = -99;

        //新问答
        filter.unbind('click').click(function() {
            if ($(this).hasClass('btn_uncheck')) {
                $('.feed_box').hide();
                //更改属性
                $(this).removeClass('btn_uncheck').addClass('btn_active');
                show_all.removeClass('btn_active').addClass('btn_uncheck');
                get_feeds(user_info_id, 'inner', 'new_qa');
            }
        });

        //显示全部
        show_all.unbind('click').click(function() {
            if ($(this).hasClass('btn_uncheck')) {
                $('.feed_box').hide();
                //更改属性
                $(this).removeClass('btn_uncheck').addClass('btn_active');
                filter.removeClass('btn_active').addClass('btn_uncheck');
                get_feeds(user_info_id, 'inner', 'all');
            }
        });

        //最新
        show_latest.unbind('click').click(function() {
            if ($(this).hasClass('btn_uncheck')) {
                $('.feed_box').hide();
                //更改属性
                $(this).removeClass('btn_uncheck').addClass('btn_active');
                show_best.removeClass('btn_active').addClass('btn_uncheck');
                get_feeds(user_info_id, 'outer', 'latest');
    }
        });

        //最佳
        show_best.unbind('click').click(function() {
            if ($(this).hasClass('btn_uncheck')) {
                $('.feed_box').hide();
                //更改属性
                $(this).removeClass('btn_uncheck').addClass('btn_active');
                show_latest.removeClass('btn_active').addClass('btn_uncheck');
                get_feeds(user_info_id, 'outer', 'best');
            }
        });

        var outer_btn = $('.outer_btn');
        var inner_btn = $('.inner_btn');

        //圈外
        outer_btn.unbind('click').click(function() {
            if ($(this).hasClass('feed_active')) {
                return;
            }
            $('.feed_box').hide();
            //更改属性
            $('#outer_btn').removeClass('feed_uncheck').addClass('feed_active');
            $('#inner_btn').removeClass('feed_active').addClass('feed_uncheck');
            $(".circle_in").hide();
            $(".circle_out").show();
            //更换样式
            $('#show_best').removeClass('btn_uncheck').addClass('btn_active');
            $('#show_latest').removeClass('btn_active').addClass('btn_uncheck');
            //永远显示最佳
            get_feeds(user_info_id, 'outer', 'best');

        });

        //圈内
        inner_btn.unbind('click').click(function() {
            if ($(this).hasClass('feed_active')) {
                return;
            }
            $('.feed_box').hide();
            //更改属性
            $('#inner_btn').removeClass('feed_uncheck').addClass('feed_active');
            $('#outer_btn').removeClass('feed_active').addClass('feed_uncheck');
            $(".circle_out").hide();
            $(".circle_in").show();
            var display_btn = Cookies.get(cookie_prefix('inner_btn'));
            //默认显示所有
            if ( display_btn != 'all' && display_btn != 'new_qa' ) {
                display_btn = 'all';
            }
            //更换样式
            if (display_btn == 'all') {
                $('#show_all').removeClass('btn_uncheck').addClass('btn_active');
                $('#show_new_qa_only').removeClass('btn_active').addClass('btn_uncheck');
            } else {
                $('#show_new_qa_only').removeClass('btn_uncheck').addClass('btn_active');
                $('#show_all').removeClass('btn_active').addClass('btn_uncheck');
            }
            get_feeds(user_info_id, 'inner', display_btn);
        });


    }

    return {
        init:init,
        get_feeds:get_feeds
    };
})(jQuery);

/**
 * 更多提醒
 */
DW.more_notify = (function($){
    var timer, result=true, page_type, page, container, btn;

    function error_msg()
    {
        btn.find('span').text('没有更多通知');
        //btn.remove();
    }

    function list_init()
    {
        $('.iknow').unbind('click').click(function(){
            var obj = $(this).parent().parent().parent();
            var nid = obj.attr('id');
            $.ajax({
                type: 'POST',
                url: '/ajax/del_notify',
                data: 'nid='+nid+'&?'+new Date().getTime(),
                success: function(msg){
                    var res = $.parseJSON( msg );
                    if(res.success)
                    {
                        obj.css({'background-color':'#FF9900'})
                        .fadeOut('slow').delay(1000)
                        .slideUp(500, function(){$(this).remove()});

                        $('#unread_count').text(res.result);
                    }
                }
            });
        });

        $('.iknow_all').unbind('click').click(function(){
            $.ajax({
                    type: "POST",
                    url: "/ajax/del_notify",
                    data: 'nid=-1'+'&?'+new Date().getTime(),
                    success: function(msg) {
                        var res = $.parseJSON( msg );
                        $('.divnotice').remove();
                        $('#unread_count').text(res.result);
                        $('.iknow_all').remove();
                        $('#no_notify').css({display:'block'});
                    }
                });
        });

        DW.follow.user('.u_follow');

        //badge event
        $(".check_badge_info").unbind("click").bind("click", function(){
           var badge_info = $(this).closest("div.divnotice").find(".list_badge_info");
           badge_info.is(":hidden") ? badge_info.slideDown(200) : badge_info.slideUp(200);
        });
    }

    function get_list()
    {
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: '/ajax/show_more_notifies',
                data: 'page_type='+encodeURIComponent(page_type)+'&page='+page+'&?'+new Date().getTime()+"&ajax=1",
                beforeSend:function(XMLHttpRequest){
                    btn.find('span').addClass('loading');
                },
                success: function(msg){
                    btn.find('span').removeClass('loading');
                    if(msg)
                    {
                        var s = $(msg);
                        s.hide();
                        if(s.find('#ajax_show_more').length > 0) {
                            btn.remove();
                            s.find('#ajax_show_more').remove();
                        }
                        container.append(s);
                        s.animate({
                           opacity: 'show'
                         }, {duration: 500});
                        //js初始化
                        list_init();
                    }
                    else
                    {
                        result = false;
                        error_msg();
                    }
                }
            });
        }, 200);
    }

    function init(container_id, btn_id)
    {
        btn = $('#'+btn_id);
        container = $('#'+container_id);

        if($.isEmptyObject(btn) || $.isEmptyObject(container))
        {
            return false;
        }

        btn.unbind('click').click(function(){
            var rel = container.find('.partline').last().attr('rel').split('|');
            page_type = rel[0];
            page = parseInt(rel[1]) + 1;

            if(result)
            {
                get_list();
            }
            else
            {
                error_msg();
            }
        });

        //init list
        list_init()
    }

    return {
        init:init
    };
})(jQuery);

/**
 * 更多协作记录
 */
DW.show_more_logs = (function($){
    var timer, result=true, container, btn, log_type;
    var start = 1;

    function error_msg(){
        btn.remove();
    }

    function get_logs(id)
    {
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: '/ajax/show_more_logs',
                data: 'id='+ id + '&start='+start+'&type='+log_type+'&s='+new Date().getTime()+"&ajax=1",
                beforeSend:function(){
                    btn.find('span').addClass('loading');
                },
                success: function(msg){
                    btn.find('span').removeClass('loading');
                    if(msg){
                        var s = $(msg);
                        s.hide();
                        if(s.find('#ajax_show_more').length > 0) {
                            btn.remove();
                            s.find('#ajax_show_more').remove();
                        }
                        container.append(s);
                        s.animate({
                           opacity: 'show'
                         }, {duration: 500}).find('.view_full').unbind('click').click(function(){
                            var key = $(this).attr('rel');
                            $('#simple_'+key).hide();
                            if($('#full_old_'+key).length > 0) {
                                var curr = $('#full_'+key).html().replace(/<pre>/i,'').replace(/<\/pre>/i,'');
                                var old = $('#full_old_'+key).html().replace(/<pre>/i,'').replace(/<\/pre>/i,'');
                                //excute diff
                                var diff = dmp.diff_main(old,curr);
                                //clean up result
                                dmp.diff_cleanupSemantic(diff);

                                var html = dmp.diff_prettyHtml(diff).replace(/&amp;/g, '&').replace(/<br>/g,'\n');
                                //ins和del实体化
                                html = html.replace(/<ins>/g,"{{ins}}").replace(/<\/ins>/g,'{{/ins}}');
                                html = html.replace(/<del>/g,"{{del}}").replace(/<\/del>/g,'{{/del}}');
                                //格式化代码
                                html = converter.makeHtml(html);
                                //转换成html标签
                                html = html.replace(/&amp;/g,'&');
                        	    html = html.replace(/{{ins}}/g,'<ins>').replace(/{{\/ins}}/g,'</ins>');
                        	    html = html.replace(/{{del}}/g,'<del>').replace(/{{\/del}}/g,'</del>');

                                //show result
                                $('#full_'+key).html(html).find('code').addClass('prettyprint');
                                prettyPrint();
                                $('#full_'+key).show();
                            } else {
                                $('#full_'+key).show();
                            }
                         });
                         start++;
                    } else {
                        result = false;
                        error_msg();
                    }
                }
            });
        }, 200);
    }

    function init(container_id, btn_id, id, type) {
        btn = $('#'+btn_id);
        container = $('#'+container_id);
        log_type = type;
        if($.isEmptyObject(btn) || $.isEmptyObject(container)) {
            return false;
        }

        btn.unbind('click').click(function(){
            if(result){
                get_logs(id);
            } else {
                error_msg();
            }
        });
    }

    return {
        init:init
    };
})(jQuery);

/**
 * 图片上传处理
 *
 */
DW.ajax_upload = (function($){
    var timer, upload=false, upload_area, obj, file_input;
    var init = function(id)
    {
        if(!DW.global.uid)
        {
            return;
        }
        $(id).unbind('mouseover mouseleave').mouseover(function(){
            upload_area = $(this).find('.upload_image');
            //upload_area.fadeIn('fast');
            clearTimeout(timer);
            timer = setTimeout(function(){
                upload_area.fadeIn('fast').animate({right: '2px'}, 170, 'linear');
            }, 100);

            $('#id_image').unbind('change').change(function(){
                var _this = obj = $(this);
                var _parent = _this.parent();
                _parent.find('.upload_btn').fadeOut('fast');
                _parent.find('.uploading').fadeIn('fast');
                $('#avatar_part').find('.upload_cover').fadeIn('fast');
                upload = true;
                upload_area.fadeIn('fast');
                clearTimeout(timer);
                timer = setTimeout(function(){
                    $('#upload_image').submit();
                    _this.attr('disabled', true);
                }, 1000);
            });
        }).mouseleave(function(){
            if(upload)
            {
                return;
            }
            clearTimeout(timer);
            timer = setTimeout(function(){
                //upload_area.fadeOut('fast');
                upload_area.animate({right: '-95px'}, 200, 'linear').fadeOut('fast');
                upload = false;
            }, 300);
        });
    }

    var reg = function()
    {
        $('#id_image').unbind('change').change(function(){
            var _this = obj = $(this);
            var _parent = _this.parent();
            _parent.find('.upload_btn').fadeOut('fast');
            _parent.find('.uploading').fadeIn('fast');
            file_input = _this;
            file_input.appendTo('#upload_image');

            clearTimeout(timer);
            timer = setTimeout(function(){
                $('#upload_image').submit();
                _this.attr('disabled', true);
            }, 1000);
        });
    }

    /**
     * 用户空间上传回调函数
     */
    var callback_space = function(result, msg)
    {
        switch(result)
        {
            case 1:
                //alert('succ');
                $('#thumbnail_preview').attr('src', msg);
                break;
            case 0:
                //alert(msg);
                DW.util.error_msg(obj, msg);
                break;
        }
        var _upload_form = $('#upload_image');
        _upload_form.find('.upload_btn').fadeIn('fast');
        _upload_form.find('.uploading').fadeOut('fast');
        _upload_form.find('#id_image').attr('disabled', false);
        upload = false;
        //upload_area.fadeOut('fast');
        upload_area.animate({right: '-95px'}, 200, 'linear').fadeOut('fast');
        $('#avatar_part').find('.upload_cover').fadeOut();
    }
    /**
     * 用户注册上传回调函数
     */
    var callback_reg = function(result, msg)
    {
        switch(result)
        {
            case 1:
                //alert('succ');
                $('#thumbnail_preview').attr('src', msg);
                break;
            case 0:
                //alert(msg);
                DW.util.error_msg($('.avatar_upload_wrap'), msg);
                break;
        }
        var btn_wrap = $('.avatar_upload_wrap');
        file_input.appendTo(btn_wrap);
        file_input.attr('disabled', false);
        btn_wrap.find('.upload_btn').fadeIn('fast');
        btn_wrap.find('.uploading').fadeOut('fast');
    }
    /**
     * 话题上传回调函数
     */
    var callback_topic = function(result, msg)
    {
        switch(result)
        {
            case 1:
                if(msg)
                {
                    alert('上传成功，等待评审');
                }
                break;
            case 0:
                DW.util.error_msg(obj, msg);
                break;
        }

        var _upload_form = $('#upload_image');
        _upload_form.find('.upload_btn').fadeIn('fast');
        _upload_form.find('.uploading').fadeOut('fast');
        _upload_form.find('#id_image').attr('disabled', false);
        upload = false;
        upload_area.animate({right: '-95px'}, 200, 'linear').fadeOut('fast');
        $('#avatar_part').find('.upload_cover').fadeOut();
    }

    /**
     * 回调函数
     */
    var callback = function (result, msg, type)
    {
        switch(type)
        {
            case 'space':
                callback_space(result, msg);
                break;
            case 'reg':
                callback_reg(result, msg);
                break;
            case 'topic':
                callback_topic(result, msg);
                break;
        }

    }

    return {
        init:init,
        reg:reg,
        callback:callback
    }
})($);


DW.userinfo_edit = (function($){
    var timer;
    function init()
    {
        //editing
        $('.editing').unbind('click').click(function(){

            var obj = $(this);
            var rel = obj.attr('rel');
            var edit_obj = $('#'+rel);
            var text = $.trim(edit_obj.text());
            var readmore = null;
	        var old_name = '';

            var input;
            if(rel == 'about')
            {
                text = $("textarea[name='user_about']").val().replace('为自己添加个人简介', '');
                input = DW.util.create_textarea(text, 'user_about');
                readmore = $('.cut_content').find('.readmore').hide();
                $('.cut_content').append(obj).append(readmore);
            }
            else if(rel == 'name')
            {
                input = DW.util.create_input(text, 'user_profile');
                old_name = $("#name").text();
	            input.unbind('focus').bind('focus',function(){
                	var offset = $(this).offset();
                	var left = parseInt(offset.left) + 10;
                	var top = parseInt(offset.top) + 5;
                	//alert("left:"+offset.left+',top:'+offset.top);
                    //console.log("left:"+offset.left+',top:'+offset.top)
                	var tips = $("<span id='tip' class='renametip'>30天内只能修改1次，请慎重更名</span>");
                    tips.css({top:(offset.top-32)+'px',left:offset.left});
                	input.after(tips);
                	tips.fadeIn(1000);
                });
                input.unbind('blur').bind('blur',function(){
                	$("#tip").fadeOut(1000,function(){
                        $(this).remove();
                    });
                });
	        }
            else if(rel == 'headline')
            {
                input = DW.util.create_input(text, 'headline');
            }

            var btn_update = DW.util.create_btn('更 新', 'btn_update');
            var btn_cancel = DW.util.create_btn('取 消', 'btn_cancel');

            var loading = DW.util.create_img('');

            edit_obj.after(input);
            edit_obj.hide();

            obj.hide();
            obj.after(btn_cancel);
            obj.after(btn_update);

            //update
            btn_update.unbind('click').click(function(){
                var value = $.trim(input.val());
		        var add_data='';
                if(old_name!=''){
		              add_data += '&old_name='+encodeURIComponent(old_name);
		        }
                //ajax
                clearTimeout(timer);
                timer = setTimeout(function(){
                    $.ajax({
                        type: "POST",
                        url: "/ajax/update_profile",
                        data: 'name='+encodeURIComponent(rel)+'&value='+encodeURIComponent(value)+add_data+"&ajax=1",
                        beforeSend: function(XMLHttpRequest){
                            obj.before(loading);
                        },
                        success: function(msg) {


                            loading.remove();
                            var result = $.parseJSON( msg );
                            if (result.success == 1)
                            {
                                if(rel == 'about')
                                {
                                    edit_obj.text(DW.util.substr(value, 180));
                                    $("textarea[name='user_about']").val(value);
                                    if ($.trim(value) == '') {
                                        value = '为自己添加个人简介';
                                    }

                                    edit_obj.append(obj).append(readmore);

                                    if(readmore)
                                    {
                                        if(value.length < 180)
                                        {
                                            readmore.hide();
                                        }
                                        else
                                        {
                                            readmore.show();
                                        }
                                    }
                                }
                                else
                                {
                                    edit_obj.text(value);
                                    if(rel =='name' && old_name != value){
                                    	obj.attr("rel","name").remove();
                                    }
                                    $("#tip").fadeOut(1000);
                                }

                                input.remove();
                                btn_update.remove();
                                btn_cancel.remove();
                                edit_obj.show();

                                obj.show();
                            } else {
                                //alert( result.message );
                                DW.util.error_msg(input, result.message);
                            }
                        }
                    });
                }, 200);
            });

            //cancel
            btn_cancel.unbind('click').click(function(){
                $("#tip").fadeOut(1000);
                input.remove();
                edit_obj.show();
                btn_update.remove();
                btn_cancel.remove();
                if(rel == 'about')
                {
                    var btn_more = $('.readmore').appendTo($('.cut_content'));
                    edit_obj.append(obj).append(btn_more);
                }
                obj.show();
                if(readmore)
                {
                    readmore.show();
                }
            });
        });

        //more about
        var btn_more, edit_btn;
        $('.readmore').unbind('click').click(function(){
            var about_id = '#'+$(this).attr('rel');
            btn_more = $(this);

            if($(this).attr('more') == 0)
            {
                edit_btn = $(about_id).find('.editing').appendTo($('.cut_content'));
                btn_more.attr('more', 1).text('收起').appendTo($('.cut_content'));

                var short_text = $(about_id).text();
                var hidden_input = $('<textarea name="user_about_cut" style="display:none">'+short_text+'</textarea>').appendTo($('.cut_content'));
                $(about_id).text( $("textarea[name='user_about']").val() );
                $(about_id).append(edit_btn).append(btn_more);
            }
            else
            {
                edit_btn = $(about_id).find('.editing').appendTo($('.cut_content'));
                btn_more.attr('more', 0).after(hidden_input).text('更多').appendTo($('.cut_content'));

                $(about_id).text($("textarea[name='user_about_cut']").val());
                $("textarea[name='user_about_cut']").remove();

                $(about_id).append(edit_btn).append(btn_more);
            }
        });
    }

    return {init:init};

})(jQuery);

DW.userinfo_edit_website = (function($){
    var timer;
    function init()
    {
        //editing
        $('.edit_website').unbind('click').click(function(){

            var obj = $(this);
            var rel = obj.attr('rel');
            var edit_obj = $('#'+rel);
            var text = $.trim(edit_obj.text());


            var input;
            text = $("textarea[name='user_website']").val().replace('为自己添加个人网站', '');
            text = (text.length > 0) ? text : 'http://';
	    input = DW.util.create_input(text, 'user_website');
            $('.website_div').append(obj);
            var btn_update = DW.util.create_btn('更 新', 'btn_update');
            var btn_cancel = DW.util.create_btn('取 消', 'btn_cancel');

            var loading = DW.util.create_img('');

            edit_obj.after(input);
            edit_obj.hide();

            obj.hide();
            obj.after(btn_cancel);
            obj.after(btn_update);
	    var website_div = $('<div id="website_info_div"></div>');
	    //var website_pro = $('<span id="ss" style="color:#ff0000;width:50px;display:none;">(例如:http://blog.dewen.org)</span>');
	    var website_msg = $('<span id="website_error" style="color:#ff0000; display:block; text-align:right;"></span>');
	    //website_div.append(website_pro);
	    website_div.append(website_msg);
	    obj.after(website_div);
            input.unbind('click').bind('click',function(){
	         website_msg .text("");
	    });
	    //update
            btn_update.unbind('click').click(function(){
                var value = $.trim(input.val());

                //ajax
                clearTimeout(timer);
                timer = setTimeout(function(){
                    $.ajax({
                        type: "POST",
                        url: "/ajax/update_profile",
                        data: 'name='+encodeURIComponent(rel)+'&value='+encodeURIComponent(value)+"&ajax=1",
                        beforeSend: function(XMLHttpRequest){
                            obj.before(loading);
                        },
                        success: function(msg) {

                            loading.remove();
                            var result = $.parseJSON( msg );
                            if (result.success == 1)
                            {
                                if ($.trim(value) == '') {
                                    value = '为自己添加个人网站';
                                }
                                edit_obj.text(DW.util.substr(value, 180));
                                $("textarea[name='user_website']").val(value);
				edit_obj.append(obj);
				input.remove();
                                btn_update.remove();
                                btn_cancel.remove();
				website_div.remove();
                                edit_obj.show();

                                obj.show();
                            } else {
				website_msg.text(result.message);
                                //DW.util.error_msg(input, result.message);
                            }
                        }
                    });
                }, 200);
            });

            //cancel
            btn_cancel.unbind('click').click(function(){
                input.remove();
                edit_obj.show();
                btn_update.remove();
                btn_cancel.remove();
                edit_obj.append(obj);
                website_div.remove();
		obj.show();
            });
        });
    }

    return {init:init};

})(jQuery);

/**
 * 通知
 */
DW.notify = (function($){

    var notify, timer, count=0, query=true, is_first = true,
        history_data = {},
        tab_status='all_notify',
        tab_arr = {all_notify:'top_notify', my_question:'notify-my-question'};
    var ptime = 30000; //pre 30 second
    var _runtimer; //检查cookie定时器
    var COOKIE_KEY = cookie_prefix("notify_data_"); //cookie key
    var last_nid = 0;

    function show() {
        var step=0;
        var timer = setInterval(function() {
            step++;
            if (step==3) {step=1};
            if (step==1) {$(".ddrgt dd").css('background-color', '#DA4821')};
            if (step==2) {$(".ddrgt dd").css('background-color', '#5D7486')};
        }, 200);

        return [timer];
    }

    function clear(timerArr) {
        if(timerArr) {
            clearInterval(timerArr[0]);
        };
    }

    function tab_show_update(tab_active) {
        if(tab_active == undefined) {
            tab_active = tab_status;
        }
        var notify_num = 0;
        if(!isNaN( parseInt($('.notify_num').text())) ) {
            notify_num = parseInt($('.notify_num').text());
        }
        var u_q_num = 0;
        if($('.notify_num').attr('u_q_num') != undefined) {
            u_q_num = parseInt($('.notify_num').attr('u_q_num'));
        }
        if(tab_active == 'all_notify') {
            if(notify_num == 0) {
                $("#notify_iknow").hide();
            } else {
                $("#notify_iknow").show();
            }
        } else if(tab_active == 'my_question') {
            if(u_q_num == 0) {
                $("#notify_iknow").hide();
            } else {
                $("#notify_iknow").show();
            }
        }
        for(var i in tab_arr) {
            $("#"+tab_arr[i]).hide();
            if(tab_active == i) {
                $("#"+tab_arr[i]).show();
            }
        }

    }

    function init_tab_btn() {
        if(!$("#notify_tab").length){
            return false;
        }
        $("#notify_tab").find("span").removeClass("on").eq(0).addClass("on");
    }

    //更新通知tab状态
    function upadte_notify_status(tab_active) {
        tab_status = tab_active;
        $("#notify_tab span").each(function(){
            var _this = $(this);
            if(_this.attr("for") == tab_active) {
                _this.addClass("on");
            } else {
                _this.removeClass("on");
            }
        });

        tab_show_update(tab_active);
    }

    function get_top_notifies_page(key, show_page, action) {

        if (action == 1) {
            var rels = Number(show_page)+Number(1);

        } else {
            var rels = Number(show_page)-Number(1);

        }

        if (Number(rels) < 1) {
            rels = 1;
        }
        var page = $("#"+key+"_f").attr('rel');
        if (Number(rels) > Number(page)) {
            rels = page;
        }

        $.ajax({
            type: "POST",
            url: "/ajax/get_top_notifies_page",
            data: "page="+rels+"&action="+action+"&top_key="+key+"&ajax=1",
            success: function(msg) {

                $(".pre_page").attr('rel', rels);
                $(".next_page").attr('rel', rels);

                $("li[class='"+key+"']").remove();
                $("#"+key).after(msg);

            }
        })
    }

    function listenEvent()
    {
        //follow user
        DW.follow.user('.u_follow');
        //show user tips
        DW.tip_layer.init_user('.u_layer');
        $(".next_page").unbind('click').click(function() {
            var key = $(this).attr('id');
            var show_page = $(this).attr('rel');
            clearTimeout(timer);
            timer = setTimeout(function(){get_top_notifies_page(key, show_page, 1);}, 240);

        });
        $(".pre_page").unbind('click').click(function() {
            var key = $(this).attr('id');
            var show_page = $(this).attr('rel');
            clearTimeout(timer);
            timer = setTimeout(function(){get_top_notifies_page(key, show_page,  0);}, 240);
        });
        //var notify = $("#top_notify");
        var notify = $("#notify_box");
        notify.find('.notify_items').unbind('click').click(function(){
            var p = $(this).parent('li');
            var key = p.attr('id');
            var self = $(this);
            if(p.attr('rel') == 'open')
            {

                p.nextUntil('.items').fadeOut(500,function(){
                    self.css('background','url("/theme/images/left-arrow.png") no-repeat scroll 0 6px');
                });
                p.attr('rel', 'close');

            }
            else
            {
                //window.location.reload();
                p.nextUntil('.items').fadeIn();
                p.attr('rel', 'open');
                $(this).css('background','url("/theme/images/arrowdown.png") no-repeat scroll -5px 0');
            }
        });
        //badge event
        notify.find(".notify_badge_cursor").unbind("click").bind("click", function(){
            var badge_info = $(this).closest("li.items").find(".notify_badges_info");
            if(badge_info.is(":hidden")) {
                badge_info.slideDown(200);
                $(this).css('background','url("/theme/images/arrowdown.png") no-repeat scroll -5px 0');
            }else {
                badge_info.slideUp(200);
                $(this).css('background','url("/theme/images/left-arrow.png") no-repeat scroll 0 6px');
            }
        });
    }

    function load_notify_num() {
        $.get("/notifications/get_notify_num?ajax=1", function(data){
            if(!data) {
                return false;
            }
            setCookies(COOKIE_KEY + DW.global.uid, data, (ptime/1000) + 30, 's', '/'); //将数量放在cookie中共享
            DW.notify.deal_notify_num(data);        //将处理通知数量的代码封装
        });
        if(query) {
            setTimeout(function(){
                DW.notify.load_notify_num();
            }, ptime);
        }
    }

    // 隐藏工具菜单
    function toggle_toolbar(s) {
        if(s == undefined) {
            return;
        }

        var obj = $('.toolbar .wrap');
        switch(s) {
            case 'show':
                obj.animate({top: '3px', opacity: 'show'}, 400);
            break;
            case 'hide':
                obj.animate({top: '45px', opacity: 'hide'}, 200, function(){
                    var notices_obj = $("#notices");
                    if(notices_obj.is(":visible") === false) {
                        notices_obj.hide();
                    }
                });
            break;
        }
    }

    // 关闭通知消息
    function close_popup_notify(time, callback) {
        var time = time == undefined ? 600 : time;
        if(callback == undefined) {
            var callback = function(){};
        }
        $("#popup_notify")
            .animate({top: '45px', opacity: 'hide'}, time, function(){
                $(this).remove();
                toggle_toolbar('show');
                callback();
            });
    }

    // 更新通知消息
    function update_popup_notify(msg) {
        $("#popup_notify .msg_item .cnt_inner").html(msg);
    }

    //检查pop是否已读
    // function check_pop_state() {

    // }

    //设置pop状态
    function set_pop_state(){
        var nid = get_nid();
        //console.log("nid:"+nid);
        $.get("/notifications/set_notify_state", {nid:nid});
    }

    function set_nid(nid) {
        last_nid = nid;
    }

    function get_nid() {
        return last_nid;
    }

    // 弹出通知消息
    function popup_notify(message) {
        var msg_html = '<div id="popup_notify" style="display:none;">'
                        + '<div class="msg_item">'
                        + '<span class="close_popup_notify">X</span>'
                        + '<p class="cnt_notify">'
                        + '<span class="cnt_inner">'+ message +'</span>'
                        + '<a href="javascript:void(0)" class="more_popup_notify">更多通知</a>'
                        + '</p></div></div>';
        $(msg_html)
            .appendTo($(".toolbar"))
            .animate({top: '-20px', opacity: 'show'}, 800, function(){
                //添加关闭事件
                $(this).find(".close_popup_notify").click(function(){
                    close_popup_notify(600);

                    //设置pop状态
                    set_pop_state();
                });

                //更多按钮监听
                $(this).find(".more_popup_notify").click(function(){
                    close_popup_notify(400, function(){
                        //更新TAB状态
                        upadte_notify_status("my_question");

                        //触发点击
                        notify.find('.notify_btn').trigger('click');

                        //设置pop状态
                        set_pop_state();
                    });
                });

            });
    }
    // 初始化通知拆分TAB
    function init_notify_tab() {
        if( !notify.find("#notify_tab").length ) {
            var notify_tab = $('<div id="notify_tab"><span for="all_notify" class="on">全 部</span><span for="my_question" title="您自己问题新增答案的通知">我的问题</span></div>')
                .insertBefore("#notify_box");

            //TAB状态 event
            notify_tab.find("span").click(function(e){
                notify_tab.find("span").removeClass("on");
                $(this).addClass("on");
                tab_status = $(this).attr("for");
                tab_show_update(tab_status);
                e.stopPropagation();
            });
        }

        var u_q_num = parseInt(notify.find(".notify_num").attr("u_q_num"));
        if(!u_q_num) {
            tab_status='all_notify';
            init_tab_btn();
        }
    }

    function deal_notify_num(data) {
        if(!data) {
            return false;
        }

        var showStatus = '0', unread_num = 0, user_qanswer_num = 0;
        if(undefined !== data) {
            //showStatus = data.split('_')[1];
            //data = data.split('_')[0];
            var data = $.parseJSON(data);
            showStatus = data.status;
            unread_num = data.unread_num;
            user_qanswer_num = data.user_qanswer_num;

        }else if(undefined === data){
            clearInterval(_runtimer);
            return run();
        }

        if('300+' != unread_num && isNaN(Number(unread_num))) {
            clearInterval(_runtimer);
            clearInterval(timer);
            return;
        }

          var redata = $(".notify_num").text();

          if(data === '您尚未登录') {
              query = false;
        }

        //===================================================================
        var delay_time = 0; // 通知数字延迟时间

        //加入通知气泡
        var history_new_answers = notify.find(".notify_num").attr("u_q_num");
        if(history_new_answers != undefined) {
            history_new_answers = parseInt(history_new_answers);
            if(user_qanswer_num > history_new_answers) {

                delay_time = 2000;

                //1秒后请求
                setTimeout(function(){
                //加载一条新问题通知
                    $.getJSON("/notifications/last_qst_notify", function(data){
                        if(data['msg'] == undefined) {
                            return false;
                        }
                        //更新最近last_pop_id
                        set_nid(data['nid']);

                        if($("#popup_notify").length) {
                            //更新通知信息
                            update_popup_notify(data['msg']);

                        } else {
                            //隐藏toolbar
                            toggle_toolbar('hide');

                            //弹出新消息气泡
                            popup_notify(data['msg']);
                        }
                    });
                }, 1000);
            }
        }

        //加载写入新问题数量 added by chao
        notify.find(".notify_num").attr("u_q_num", user_qanswer_num);

        //==================================================================

        //延迟通知提示数的变化时间
        setTimeout(function(){

            if(unread_num == 0) {
                notify.find(".notify_num").text(unread_num).hide();
             $(".notify_btn").find("span").addClass('ico');
             $(".notify_btn").find("img").hide();
              is_first = false;
          } else {
                if(is_first)
                {
                    if(showStatus == '0')
                    {
                        notify.find(".notify_num").css({backgroundColor:'#8B8B8B'}).text(unread_num).show();
                    }
                    else
                    {
                        $(".notify_btn").find("span").removeClass();
                        if ($(".notify_btn").find("img").length == 0) {
                            $(".notify_btn").find("span").css('color','#333333');
                            $(".notify_btn").find("span").prepend('<img style="margin-right:5px; margin-top:-3px" src="/theme/images/have_msg.gif">');
                        }else {
                            $(".notify_btn").find("img").show();
                        }
                        notify.find(".notify_num").css({backgroundColor:'#c6401b'}).text(unread_num).show();
                  }
                  is_first = false;
                }
                else
                {
                    if (Number(redata) < Number(unread_num)) {
                      $(".notify_btn").find("span").removeClass();
                      if ($(".notify_btn").find("img").length == 0) {
                          $(".notify_btn").find("span").css('color','#333333');
                            $(".notify_btn").find("span").prepend('<img style="margin-right:5px; margin-top:-3px" src="/theme/images/have_msg.gif">');
                      }else {
                        $(".notify_btn").find("img").show();
                      }
                        notify.find(".notify_num").css({backgroundColor:'#c6401b'}).text(unread_num).show();

                    } else if(redata == unread_num) {
                    if(showStatus == '0') {
                            notify.find(".notify_num").css({backgroundColor:'#8B8B8B'}).text(unread_num).show();
                        $(".notify_btn").find("span").addClass('ico');
                        $(".notify_btn").find("img").hide();
                    }
                  } else {
                        notify.find(".notify_num").css({backgroundColor:'#8B8B8B'}).text(unread_num).show();
                      $(".notify_btn").find("span").addClass('ico');
                      $(".notify_btn").find("img").hide();
                  }
              }
          }

        }, delay_time);//end setTimeout

    }

    function load_top_notifies()
    {
        //loading状态
        $('#notify_box').html('<div style="text-align:center"><img style="margin:0 auto;" src="/theme/images/loading.gif" /></div>');

        //通知消息 TAB按钮初始化
        init_notify_tab();

        //ajax请求数据
        notify.find("#notify_box").load("/notifications/get_top_notifies?ajax=1", function(){
            tab_show_update();
            listenEvent();
            $("i[type='get_referer']").find('a').unbind('click').click(function(){
                Cookies.set(cookie_prefix('temp_hash'),'#notify','','/');
            }); //增加点击统计
        });
    }

    //事件
    function more_notify()
    {
        //add click event
        $('#notify_iknow').unbind('click').click(function(){
            var obj = $(this);
            var nids = [];
            //$('#notify_box').find('li[class="items"]').each(function(i){
            //    nids.push($(this).attr('id'));
            //});
            var tab_box = $('#'+tab_arr[tab_status]);
            tab_box.find('li[class="items"]').each(function(i){
                nids.push($(this).attr('id'));
            });

            if(tab_box.find('#followed_user_merge').length) {
                nids.push(tab_box.find('#followed_user_merge').val());
            }
            if(nids.length) {
                clearTimeout(timer);
                timer = setTimeout(function(){
                    $.ajax({
                        type: "POST",
                        url: "/ajax/clear_notify",
                        data: 'nids='+encodeURIComponent(nids.join(','))+"&ajax=1&tab="+encodeURIComponent(tab_status),
                        beforeSend: function(XMLHttpRequest){
                            $('#notify_box').html('<div style="text-align:center"><img style="margin:0 auto;" src="/theme/images/loading.gif" /></div>');
                        },
                        success: function(msg)
                        {
                            //加载新通知
                            $('#notify_box').html(msg);
                            tab_show_update();

                            //更新通知数
                            notify.find(".notify_num").load("/notifications/get_notify_num?ajax=1",function(data){
                                setCookies(COOKIE_KEY + DW.global.uid, data, (ptime/1000) + 10, 's', '/');
                                deal_notify_num(data);
                                count = count - nids.length;

                                //处理我知道按钮
                                var data = $.parseJSON(data)
                                unread_num = data.unread_num;
                                user_qanswer_num = data.user_qanswer_num;
                                if(!unread_num) {
                                    obj.hide();
                                }
                            });
                            listenEvent();

                        }
                    });
                }, 200);
            }
            return false;
        });

        return false;
    }

    function box_pos() {
        var _this = $('#notices');
        var offset = _this.offset(),
            height = _this.outerHeight(),
            width = _this.outerWidth(),
            top, right, left;

        top = offset.top;
        left = offset.left;
        right = left + width;
        return {top:top,left:left,right:right};
    }

    //监听鼠标的click事件
    function dom_click() {
        $(document).unbind('click').click(function(e){
            var _area = box_pos();
            if(e.pageX > _area.right
               || e.pageX < _area.left
               || e.pageY < _area.top) {
                $('#notices').animate({height:'toggle',opacity:'hide'},'normal','swing',function(){
                    $('.ddrgt').show().animate({top:'0px'},'normal','swing',function(){
                        $(document).unbind('click');
                    });
                });
            }
        });
    }

    function init()
    {
        var self = this;
        if(DW.global.uid) {
            //logic
            var reviews = parseInt( DW.global.reviews );
            if(reviews) {
                var box_style = '';
                var tool_html = '<div id="manage_tool" class="admin_tool" style="display: none;">' +
                                '<div class="tit">管理工具<i class="showcon" rel="manage_tool|notices"></i></div>' +
                                '<div class="ullist">' +
                                    '<a href="/review">问答监查</a>' +
                                    '<a href="/new_queue" class="rev">协作评审 ('+ reviews +')</a>' +
                                '</ul></div>';
                var review_html = '<dd class="admin_tool_btn showcon" rel="manage_tool|notices" title="管理工具" style="z-index:400;">' +
                            '<span class="bountys">'+ reviews +'</span>' +
                            '<a class="icon">&nbsp;</a>' +
                           '</dd>';

            } else if(DW.global.upoints > 200){
                var tool_html = '';
                var box_style = 'style="right:0;"';
                var review_html = '<dd class="admin_tool_btn">' +
                                      '<a href="/review" class="icon" title="问答监查">&nbsp;</a>' +
                                  '</dd>';
            } else {
                 var tool_html = '',review_html = '' ,box_style = 'style="right:0;"';
            }

            //tpl
            var notify_tpl = '<div class="toolbar">' +
                              '<div class="wrap">' +
                                '<dl class="ddrgt" style="position:relative;">' +
                                  review_html +
                                  '<dd rel="notices|manage_tool" class="notify_btn showcon">' +
                                    '<span class="ico">新通知 <b class="notify_num" style="display:none;"></b></span>' +
                                  '</dd>' +
                                '</dl>' +
                                '<div class="notice" id="notices" '+ box_style +'>' +
                                 '<div class="tit">新通知 <i class="showcon" rel="notices|manage_tool"></i></div>' +
                                    '<div id="notify_box"></div>'+
                                    //'<ul class="ullist" id="top_notify"></ul>' +
                                  '<div class="btn">' +
                                      '<a id="notify_iknow" href="#" class="a">知道了</a>' +
                                      '<a href="/notifications/all" class="b">更多通知</a>' +
                                  '</div>' +
                                '</div>' +
                                tool_html +
                              '</div>' +
                            '</div>';
            notify = $(notify_tpl);

            $('body').append(notify);

            //add click event
            notify.find('.showcon').click(function(e){
                var rel = $(this).attr('rel').split('|');
                var obj1 = $('#'+rel[0]);
                var obj2 = $('#'+rel[1]);
                if (rel[0] ==  'notices') {
                    if ($(".notify_btn").find("img").length > 0) {
                        $(".notify_btn").find("img").remove();
                        $(".notify_btn").find("span").attr('class', 'ico');
                    }
                }
                if(obj1.is(':hidden')){
                    if($(this).hasClass('notify_btn')) {
                        notify.find('.ddrgt').animate({top:'20px',opacity:'hide'},'normal','swing',function(){
                          obj1.animate({height:'toggle',opacity:'show'},'normal','swing',function(){
                              dom_click();
                          });
                        });
                    } else {
                        obj1.animate({height:'toggle',opacity:'show'},'normal','swing',function(){
                            dom_click();
                        });
                    }
                } else {
                    obj1.animate({height:'toggle',opacity:'hide'},'normal','swing',function(){
                        notify.find('.ddrgt').show().animate({top:'0px'},'normal','swing',function(){
                            $(document).unbind('click');
                        });
                    });
                }
                obj2.hide();
                e.stopPropagation();
            });

            notify.find('.notify_btn').click(function(){
                //降低无用请求
                var notify_num = 0;
                if(!isNaN( parseInt($(this).find('.notify_num').text())) ) {
                    notify_num = parseInt($(this).find('.notify_num').text());
                }

                if(notify_num == 0) {
                    $("#notify_iknow").hide();
                    $(this).find('.notify_num').hide();
                }else {
                    $("#notify_iknow").show();
                }

                if(notify_num == count && $('#top_notify li').length) {
                    return;
                }

                var u_q_num = 0;
                if($(this).find('.notify_num').attr('u_q_num') != undefined) {
                    u_q_num = parseInt($(this).find('.notify_num').attr('u_q_num'));
                }

                count = notify_num;
                var ck_value = '{"unread_num":'+ notify_num +',"user_qanswer_num":'+ u_q_num +',"status":0}';
                //console.log(ck_value);
                setCookies(COOKIE_KEY + DW.global.uid, ck_value, (ptime/1000) + 10, 's', '/');
                clearTimeout(timer);
                timer = setTimeout(function(){
                    //重新加载
                    load_top_notifies();
                    //添加事件
                    more_notify();
                }, 1);
            });

            //init
            //setTimeout(run, 1500);
            run(); //移除延迟

            //初始化tab
            init_notify_tab();
        }
    }

    function run() {
        var data_json = Cookies.get(COOKIE_KEY + DW.global.uid);
        if(undefined === data_json)
        {
            var unread_num = parseInt($(".notify_num").text());
            var redata = '{"unread_num":'+ unread_num +',"user_qanswer_num":0,"status":0}';
            Cookies.set(COOKIE_KEY + DW.global.uid, redata, '', '/'); //避免时间差问题。这里先占位

            clearInterval(_runtimer);
            clearInterval(timer);
            var eventN = $.browser.opera ? 'unload' : 'beforeunload';
            //console.log(eventN);
            $(window).unbind(eventN).bind(eventN,function(){
                clearInterval(timer);
                clearInterval(_runtimer);
                Cookies.set(COOKIE_KEY + DW.global.uid, '', -1, '/');
            });

            //加载提醒数
            load_notify_num();
        }
        else
        {
            if(data_json) {
                deal_notify_num(data_json);
            }
            _runtimer = window.setInterval(function(){
                var data = Cookies.get(COOKIE_KEY + DW.global.uid);
                if(data) {
                    deal_notify_num(data);
                }else {
                    clearInterval(_runtimer);
                    run();
                }
            },20000);
        }
    }

    function setCookies(name,value,time,type,path) {

        //if(undefined != Cookies.get(name)) return false;
        var cd = [name + '=' + encodeURIComponent(value)];
        if (typeof time == 'number'){
            var temp = 86400000;
            if(type == 'h') {
                temp = 3600000;
            }else if(type == 'i'){
                temp = 60000;
            }else if(type == 's'){
                temp = 1000;
            }
            time = new Date((new Date()).getTime() + time * temp);
            cd.push('expires=' + time.toGMTString());
        }
        if (path) {
            cd.push('path=' + path);
        }
        document.cookie = cd.join('; ');
    }

    return {
        init:init,
        load_notify_num:load_notify_num,
        deal_notify_num:deal_notify_num
    }

})($);


/**
 * 社区suggest类
 */
function Suggest()
{
    this.input = null;
    this.input_id = null;
    this.row_url = null;
    this.row_id = null;
    this.row_type = null;
    this.row_text = null;
    this.suggest_box = null;
    this.j = -1;
    this.timer = null;
    this.filter_type = null;//显示过滤
    this.exec_func = null;//执行方法
    this.show_link = false;//是否显示链接
    this.rs = false; //显示搜索结果
    this.width = '';
    this.ajax;
    this.q;//上一次请求记录
    this.direct_enter = null;//是否为直接回车
    this.suggest_topic = false;//建议话题
    this.extension = {};//扩展
    this.topic_reg_start = /^\s*\[/;
    this.topic_reg = /^\s*\[.+\]\s*(.+)/;
}

Suggest.prototype.checkEscape = function (key)
{
    var code = (key.charCode || key.keyCode);
    if (code === 27) {
        this.close();
    }
};

Suggest.prototype.close = function (time)
{
    var time = time == undefined ? 400 : time;
    var self = this;
    if(self.ajax != null)
    {
        self.ajax.abort();
    }

    if(time == 0)
    {
        if(self.suggest_box != undefined || self.suggest_box != null)
        {
            self.suggest_box.hide();
        }
        return;
    }
    self.timer = setTimeout(function(){
        self.suggest_box.fadeOut(140);
    }, time);
}

Suggest.prototype.set_position = function (obj_input)
{
    var self = this;
    var offset = obj_input.offset();
    var height = obj_input.outerHeight();
    var box_left = offset.left;
    var box_top = offset.top + height;
    this.suggest_box.css({
        'left':box_left + 'px',
        'top':box_top + 'px',
        'width': self.width ? self.width + 'px' : (obj_input.outerWidth()-2) + 'px',
        'position':'absolute',
        'z-index':10000
    });
}

Suggest.prototype.create_box = function(obj_input)
{
    var self = this;
    var box = $("<div class='suggest_box' rel='"+self.input_id+"'></div>");
    var offset = obj_input.offset();
    var height = obj_input.outerHeight();
    var box_left = offset.left;
    var box_top = offset.top + height;
    box.css({
        'left':box_left + 'px',
        'top':box_top + 'px',
        //'width':(this.input.outerWidth()-2) + 'px',
        'width': self.width ? self.width + 'px' : (obj_input.outerWidth()-2) + 'px',
        'position':'absolute',
        'z-index':10000
    });
    box.hide();
    return box;
}

Suggest.prototype.set_active = function (j)
{
    var self = this;
    var dd = self.suggest_box.find('dd');
    dd.each(function(i){
        var _this = $(this);
        if(i == j)
        {
            _this.addClass('on');
            if(self.show_link)
            {
                var alink = _this.find('a');
                self.row_url.val( alink.attr('href') );
            }
            else
            {
                self.row_id.val( _this.attr('url') );
            }
            //取值
            self.row_id.val( _this.attr('id') );
            self.row_text.val( _this.attr('title') );
            self.row_type.val( _this.attr('type') );
        }
        else
        {
            $(this).removeClass('on');
        }
    });
}

Suggest.prototype.exec_enter = function ()
{
    var self = this;
    var obj_id = self.row_id.val();
    var obj_text = self.row_text.val();
    var obj_url = self.show_link ? self.row_url.val() : null
    var obj_type = self.row_type.val();
    var obj = {
        id : obj_id,
        text : obj_text,
        link : obj_url,
        type : obj_type
    };

    if(typeof self.exec_func === 'string')
    {
        eval(self.exec_func+'("'+obj_id+'", "'+obj_text+'", "'+obj_url+'","'+obj_type+'")');
    }
    else if(typeof self.exec_func === 'function')
    {
         self.exec_func.call(null, obj);
    }
    self.suggest_box.hide('normal',function(){self.destory();});
}

Suggest.prototype.exec_mouse = function(obj)
{
    var self = this;
    var dd = obj;
    if(self.show_link)
    {
        self.row_url.val( dd.find('a').attr('href') );
    }
    else
    {
        self.row_id.val( dd.attr('url') );
    }
    //取值
    self.row_id.val( dd.attr('id') );
    self.row_text.val( dd.attr('title') );

    self.exec_enter();
    self.suggest_box.hide();
}

Suggest.prototype.destory = function() {
    this.row_id.val('');
    this.row_type.val('');
    this.row_text.val('');
}

Suggest.prototype.check_suggest_box = function()
{
    var self = this;
    if( self.suggest_box == null )
    {

        if($(".suggest_box").length && $(".suggest_box").attr('rel') == self.input_id) // ?????????
        {
            //self.suggest_box = self.create_box();
            self.suggest_box = $(".suggest_box");
        }
        else
        {
            self.suggest_box = self.create_box(self.input);
            $('body').append(self.suggest_box);
        }

        self.suggest_box.bind('mouseleave', function(event){
            self.close();//2011-10-19
            event.stopPropagation();
        });

        self.input.blur(function(){
            self.close();
        });

        self.input.bind('focusin', function(){
            self.set_position($(this));
            var val = $.trim(self.input.val());
            if(!val || val == '搜索问题、话题或者人' || val == '为该问题选择相关话题')
            {
                return false;
            }

            if(self.suggest_box.is(":visible") === false && self.suggest_box.html())
            {
                self.set_active(-1);
                self.suggest_box.show();
            }
        });
        self.input.bind('mouseover', function(){
            self.set_active(-1);
            if(self.timer != undefined ||self.timer != null)
            {
                clearTimeout(self.timer);
            }
        });

        $('body').bind('keydown', function(e){
            self.checkEscape(e);
        });
    }
    self.set_position(self.input);
}

Suggest.prototype.query = function(query)
{
    var self = this;
    self.j=-1;
    clearTimeout(self.timer);
    if(self.extension.filter_type != undefined) {
       var data = 'q='+encodeURIComponent(query)+'&filter='+self.extension.filter_type+'&'+new Date().getTime()+"&ajax=1";
    } else {
       var data = 'q='+encodeURIComponent(query)+'&filter='+self.filter_type+'&'+new Date().getTime()+"&ajax=1";
    }
    if (self.extension.tid != undefined) {
        data += '&tid='+self.extension.tid;
    }
    data += '&union_search=' + self.union_search;
    if($('.msg_tip').length > 0) {
        $('.msg_tip').remove();
    }
    self.timer = setTimeout(function(){
        self.ajax = $.ajax({
            type: "POST",
            url: "/ajax/suggest",
            data: data,
            beforeSend: function(){
                self.suggest_box.html('<div class="so_loading">检索中...</div>');
                self.suggest_box.show();
            },
            complete: function(){
                var now_query = $.trim(self.input.val());
                if(now_query == '' ||
                   (self.topic_reg_start.test(now_query) && !self.topic_reg.test(now_query))) {
                    self.suggest_box.empty();
                }
            },
            success: function(msg) {
                if(msg.length)
                {
                    var result = $.parseJSON( msg );
                    if($.trim(self.input.val()) == '') {
                        self.suggest_box.html('');
                        self.suggest_box.hide();
                        if(self.extension.tname) {
                            self.suggest_box.html('<dl><dd style="color:#777;font-size:13px;">在"'+self.extension.tname+'"话题下，搜索问题。</dd></dl>').show();
                        }
                        return;
                    }
                    var html = '';
                    //列表展示扩展
                    if(self.extension && self.extension.display_callback) {
                        html = self.extension.display_callback(result, self.show_link, self.state, self.filter_id);
                    } else {
                        html = DW.util.create_suggest_list(result, self.show_link, self.state, self.filter_id);
                    }

                    if(self.rs)
                    {
                        var num = result.length;
                        var searchResult;
                        if($.trim(self.input_id) == "search_input"){
                        	//顶部搜索框suggest
                        	searchResult = '<dd class="search_result" num="'+num+'"><a href="/search/?q='+ encodeURIComponent(query) +'">查看更多全文搜索结果: <b>'+query.replace(self.topic_reg,"$1")+'</b></a></dd>';
                        }else{
                        	//答案区域suggest
                        	searchResult = '<dd class="search_result" num="'+num+'"></dd>';
                        }
                        html  = $(html).append( searchResult );
                        if( !result.length )
                        {
                            html = $('<dl>').append( searchResult );
                            if(self.direct_enter != null)
                            {

                                html.prepend('<div class="search_notice">推荐列表没有符合您的问题，点击<b>提问按钮</b>添加新问题或查看更多全文搜索结果。</div>');
                            }
                        }
                    }

                    if(self.suggest_topic)
                    {
                        var num = result.length;
                        var searchResult= '<dd id="add_topics" class="search_result" num="'+num+'"><a href="/topics" target="_blank"><b>浏览所有话题</b></a></dd>';
                        if( !result.length )
                        {
                            html = $('<dl>').append( searchResult );
                        }
                        else
                        {
                            html  = $(html).append( searchResult );
                        }
                    }

                    if(self.suggest_box == null) {
                        return;
                    }
                    self.suggest_box.html(html);
                    self.suggest_box.show();
                    self.suggest_box.find('dd').each(function(i){
                        var obj_this = $(this);
                        var title = obj_this.attr('title');
                        if(self.suggest_box.find('dd.on').length == 0 && title != undefined && title.toLowerCase() == query.toLowerCase())
                        {
                            self.j = obj_this.attr('num');
                            self.set_active(self.j);
                        }
                        obj_this.mouseover(function(){
                            self.j = obj_this.attr('num');
                            self.set_active(self.j)
                        });
                        obj_this.unbind('mousedown').mousedown(function(){
                            self.exec_mouse(obj_this);
                        });
                        //输入扩展
                        if( self.extension && self.extension.input_callback ) {
                            var text_tit = obj_this.text();
                            if( self.extension.input_callback(text_tit, query) )
                            {
                                self.j = obj_this.attr('num');
                                self.set_active(self.j);
                            }
                        }
                    });
                    if( result.length == 1 )
                    {
                        self.j = 0;
                        self.set_active(0);
                    }

                    if( result.length == 0 ) {
                        self.suggest_box.html('');
                        self.suggest_box.hide();
                    }
                }
                else
                {
                    self.suggest_box.html('');
                    self.suggest_box.hide();
                }

                 DW.util.search_statistics(3);
            }
        });
    }, 300);
}

Suggest.prototype.init = function (options)
{
    var self = this;
    self.input_id = options.id;
    self.input = $('#'+self.input_id);
    self.filter_type = options.filter;
    self.exec_func = options.func;
    self.show_link = options.link;
    self.rs = options.rs != undefined ? options.rs : false;
    self.state = options.state != undefined ? options.state : true;
    self.width = options.width != undefined ? options.width : '';
    self.input.attr('autocomplete', 'off');
    self.filter_id = options.filter_id != undefined ? options.filter_id : 0;
    self.direct_enter = options.direct_enter;//是否为直接回车
    self.suggest_topic = options.suggest_topic != 'undefined' ? options.suggest_topic : false;
    self.suggest_box = null;
    self.extension = options.extension != undefined ? options.extension : {};
    self.union_search = options.union_search ? options.union_search : 0;
    //创建储值钩子
    if(self.show_link && self.row_url == null)
    {
        self.row_url = $('<input type="hidden" value="" />');
        $('body').append(self.row_url);
    }

    self.row_id = $('<input type="hidden" value="" />');
    self.row_type = $('<input type="hidden" value="" />');
    self.row_text = $('<input type="hidden" value="" />');
    $('body').append(self.row_id);
    $('body').append(self.row_type);
    $('body').append(self.row_text);

    self.input.bind('keydown focusin', function(event)
    {
        //检查suggest_box
        self.check_suggest_box();
        self.set_position($(this));

        var dd = self.suggest_box.find('dd');

        if(event.keyCode == 40 || event.keyCode == 38)
        {
            if(event.keyCode == 40)
            {
                if(self.j < dd.length)
                {
                    self.j++;
                    if(self.j >= dd.length)
                    {
                        self.j=-1;
                    }
                }
                if(self.j >= dd.length)
                {
                    self.j=-1;
                }
            }
            if(event.keyCode == 38)
            {
                if(self.j >= 0)
                {
                    self.j--;
                    if(self.j <= -1)
                    {
                        self.j = dd.length;
                    }
                }else{
                    self.j = dd.length - 1;
                }
            }
            clearTimeout(self.timer);
            self.timer = setTimeout(function(){
                self.set_active(self.j)
            }, 10);
        }

        //Enter
        if(event.keyCode == 13)
        {
            if(self.j == -1 && typeof self.direct_enter === 'function')
            {
                self.direct_enter();
            }
            else
            {
                clearTimeout(self.timer);
                self.timer = setTimeout(function(){
                    /**
                     * 各种调用的具体执行方法
                     */
                     //self.filter_type = 2;
                     self.exec_enter();
                }, 0);
            }
        }
        //Tab
        if(event.keyCode == 9 && self.input_id == 'search_input') {
            var t_obj = self.suggest_box.find('dd.on[type=2]');
            if(t_obj.length) {
                $('#choose_topic').html('<a href="/topic/'+t_obj.attr('id')+'">['+t_obj.attr('title')+']</a>');
                var t_width = $('#choose_topic').width();
                var p_left = 28 + t_width;
                var i_width = 374 - p_left;
                $(this).css({paddingLeft:p_left,paddingRight:50,paddingTop:1,paddingBottom:1,width:i_width});
                //self.filter_type = -1;
                $('#choose_topic').css({left:45});
                self.extension.tid = t_obj.attr('id');
                self.extension.tname = t_obj.attr('title');
                self.extension.filter_type = -1;
                self.j = -1;
                $(this).val('').focus();
                event.preventDefault();
            }
        }
        //删除
        if(event.keyCode == 8) {
            if($(this).val() == '' && self.extension.tid) {
                $('#choose_topic').html('');
                self.input.css({paddingLeft:24,paddingRight:50,paddingTop:1,paddingBottom:1,width:350});
		        delete(self.extension.tid);
                delete(self.extension.tname);
                delete(self.extension.filter_type);
            }
        }
        self.q = $.trim($(this).val());
    });

    self.input.unbind('keyup').bind('keyup', function(event){
        var query = $.trim($(this).val());
        //绑定搜索事件
    	$('.search_m').unbind('click').click(function(){
    	    if(query == '' && self.extension.filter_type == undefined) {
    	        return;
    	    }
    	    if(self.extension.filter_type != undefined) {
               if(query == '') {
                   window.location.href = '/topic/' + self.extension.tid;
               } else {
    	           window.location.href = '/search/?q=' + encodeURIComponent('[' + self.extension.tname + ']' + query);
               }
            } else {
                window.location.href = '/search/?q=' + encodeURIComponent(query);
            }
    	});
        if( query == '' || (query != '' && self.q == query) )
        {
            if(query == '' && self.suggest_box != null) {
                self.suggest_box.empty();
            }
            if(query == '' && self.extension.filter_type == -1) {
                self.suggest_box.show('fast',function() {
                    self.suggest_box.html('<dl><dd style="color:#777;font-size:13px;">在"'+self.extension.tname+'"话题下，搜索问题。</dd></dl>');
                })
            }
            return false;
        }
        if(self.union_search == 1 && self.topic_reg_start.test(query) && !self.topic_reg.test(query)) {
            if(self.suggest_box != null) {
                self.suggest_box.empty();
            }
            return false;
        }
        self.q = query;
        if(event.keyCode != 40 && event.keyCode != 38 &&
           event.keyCode != 37 && event.keyCode != 39 &&
           event.keyCode != 9)
        {
            self.query(self.q);
        }
    });

    self.input.bind('paste', function(e){
        var el = $(this);
        clearTimeout(self.timer);
        self.timer = setTimeout(function(){
            self.check_suggest_box();
            self.set_position(el);
            self.query( $.trim(el.val()) );
        }, 100);
    });

    if(self.input_id == 'search_input') {
        self.input.unbind('focus blur').bind('focus',function() {
            if(self.extension.filter_type == -1) {
                var key_words = '搜索'+self.extension.tname+'的问题';
            } else {
                var key_words = '搜索问题';
            }
            if($(this).val() == '搜索问题、话题或者人' || $(this).val() == '这里输入问题'
               || $(this).val() == key_words) {
                $(this).val('');
                $(this).css('color','#444');
            }
        }).bind('blur',function(){
            if($(this).val() == '') {
                if(self.extension.filter_type == -1) {
                    $(this).val('搜索'+self.extension.tname+'的问题');
                } else {
                    $(this).val('搜索问题、话题或者人');
                }
                $(this).css('color','#cbcbcb');
            }
        });
    }
}

function setup_suggest(params)
{
    var suggest = new Suggest();
    suggest.init(params);
    return suggest;
}

/**
 * 页面跳转
 * suggest执行函数
 */
var page_loaction = function (id, text, url,type) {
    if(type == 3) {
        Cookies.set(cookie_prefix('temp_hash'), '#search', '', '/');
    }
    if($.trim(url) != '') {
        window.location.href = url;
    }
}

/**
 * 重定向
 * suugest执行函数
 */
var redirect_question = function (id, title, url)
{
    $('#redirect_target').val(id);
    $('#searchid').val(title);
    $('#redirect_title').text(title);
}

/**
 * 私信
 * suggest执行函数
 */
var msg_user = function (id, title, url)
{
    $("input[name='target_userid']").val(id);
    $('#target_user').val(title);
}

/**
 * 忽略主题处理
 * suggest执行函数
 */
var prepare_topic = function (id, title, url)
{
    $("#prepare_tid").val(id);
    $('#topic_input').val(title);
}

/**
 * 删除忽略的主题
 * suggest执行函数
 */
var remt = function(o)
{
    var obj = $(o);
    var tid = parseInt( obj.attr('id') );
    obj.remove();
    //ajax
    $.ajax({
        type: "POST",
        url: "/ajax/rem_ignore",
        data: 'tid='+tid+'&'+new Date().getTime()+"&ajax=1",
        beforeSend: function(XMLHttpRequest){
            //obj.before(loading);
        },
        success: function(msg) {
            //loading.remove();
            if (msg == 1)
            {

            } else {
                alert( msg );
            }
        }
    });
}

/**
 * 添加忽略主题
 * suggest执行函数
 */
var addt = function(input_id, prepare_tid, ignore_list)
{
    var name = $.trim($('#'+input_id).val());
    var tid = $('#'+prepare_tid).val();
    if(!name || !tid)
    {
        return;
    }

    var topic = $('<a onclick="remt(this);" id="'+tid+'" href="javascript:void(0)">'+name+'</a>')
    $('#'+ignore_list).append(topic);
    //ajax
    $('#'+input_id).val('').focus();
    $('#'+prepare_tid).val('');

    //ajax
    $.ajax({
        type: "POST",
        url: "/ajax/add_ignore",
        data: 'tid='+tid+'&'+new Date().getTime()+"&ajax=1",
        beforeSend: function(XMLHttpRequest){
            //obj.before(loading);
        },
        success: function(msg) {
            //loading.remove();
            if (msg == 1)
            {
            }else {
                alert( msg );
            }
        }
    });
}

DW.review_queue = (function($){
    var timer;

    function ignore(check_type)
    {
        $('.ignoring').unbind('click').click(function(){
            var ck_id = $(this).attr('rel');
            clearTimeout(timer);
            timer = setTimeout(function(){
                $.ajax({
                    type: "POST",
                    url: "/ajax/ignore_review_queue",
                    data: 'ck_id='+ck_id+'&'+new Date().getTime()+"&ajax=1",
                    success: function(msg) {
                        if(msg)
                        {
                            $('#list_queue_'+ck_id).css({'background-color':'#FF9900'})
                            .fadeOut('slow', function(){$(this).remove()});

                            //更新统计
                            var reviewCount = parseInt( $('.reviewCount').text() );
                            reviewCount--;
                            $('.reviewCount').text( reviewCount );

                            var check_num = 0;
                            var check_obj;
                            switch(check_type)
                            {
                                case '2'://close
                                    check_obj = $('.qCloseNum');
                                    check_num = parseInt( check_obj.text() );
                                    break;
                                case '3'://reopen
                                    check_obj = $('.qReopenNum');
                                    check_num = parseInt( check_obj.text() );
                                    break;
                                case '8'://del_ans
                                case '4'://del_qst
                                    check_obj = $('.qaDelNum');
                                    check_num = parseInt( check_obj.text() );
                                    break;
                            }
                            check_num--;
                            check_obj.text( check_num );
                        }
                        else
                        {

                        }
                    }
                });
            }, 300);
        });
    }
    return {
        ignore:ignore
    }
})(jQuery);


var set_question_topic = function(id, topicname, url)
{
    if(id == 'add_topics')
    {
        //location.href=url;
        window.open(url);
        return;
    }

    var topics = $("#wBox input[name='topic']").val().split(',');
    if(topics.length > 4)
    {
        return;
    }
    if($.inArray(id, topics) > -1)
    {
        return;
    }
    var topic = $('<a title="'+ topicname +'" href="javascript:void(0)" id="'+ id +'"><span>'+ topicname +'</span><i>×</i></a>');
    if ($("#sos").length > 0)
    {
        topic.insertBefore('#sos');
    } else {
        topic.insertBefore('#search_related_topics');
    }


    $('#search_related_topics').focus();

    var topic_ids = [];
    $('#select_related_topics').find('a').each(function(){
        topic_ids.push($(this).attr('id'));
    });
    $("#wBox input[name='topic']").val(topic_ids.join(','));

    update_question_topic();
}

var update_question_topic = function()
{
    $('#select_related_topics').find('a').each(function(){
        var a = $(this);
        a.find('i').unbind('click').click(function(){
            a.remove();
            var topic_ids = [];
            $('#select_related_topics').find('a').each(function(){
                topic_ids.push($(this).attr('id'));
            });
            $("#wBox input[name='topic']").val(topic_ids.join(','));
        });
    });
}


/**
 * 网站头部ask表单
 */
DW.ask = (function($){
    var submit, cancel, box, input, msg_tip, tip=false, span_input=null, have_submited=false , topics = [] ,ask_search_topic = null;

    var show_error = function(o, err)
    {
        var err_msg = o.parent().find('.postErr');
        if(!err_msg.length)
        {
            err_msg = $('<span class="postErr"></span>').prependTo(o.parent());
        }

        err_msg.hide().text(err).show().delay(3000).fadeOut();
    }

    var check_ask_form = function() {
        var title = $.trim( $('#wBox').find("input[name='title']").val() );
        var content = $.trim( $('#wBox').find("textarea[name='content']").val() );

        try {
            if(title == '' || title == '这里输入问题标题')
            {
                throw new Error('请输入问题标题');
            }
            else if(title.length < 5 || title.length > 100)
            {
                throw new Error('标题不能少于5个或大于100个字');
            }
            var upoints = parseInt(DW.global.upoints);
            if( topics.length < 1 ) {
                throw new Error('您还没有为问题选择话题');
            } else if($.trim(DW.global.ulabel) == '' && upoints < 2000 && topics.length > 2) {
                throw new Error('您的声誉值不足2000分, 最多只可添加2个话题。');
            }
            if(topics.length > 5) {
                throw new Error('添加的相关话题不能超过5个');
            }

            if(content.length > 30000)
            {
                throw new Error('更多问题细节内容不能超过30000个字');
            }
            $('#wBox').find("input[name='topic']").val(topics.join(','));
        } catch(e) {
            return e.message;
        }

        return false;
    }

    var showUserGuide = function()
    {
        var userGuideHtml =
            '<div class="ask_guide">'+
                '<div class="ask_top"><span style="float:left;display:block;line-height:160%;margin-bottom:10px;"><b style="color:#c6401b;background:url(/theme/images/circle_icon.png) no-repeat left 7px;padding-left:12px;">入门级问题勿提</b><br><b style="font-weight:normal;margin-left:12px;display:block;font-size:14px;">提问前请确保已做足功课，经过认真思考与研究，如果能从搜索引擎、通用技术手册轻易获得答案，就别浪费大家时间了。德问的目标是成为一个能够为编程难题提供高效解答的社群，由专家驱动，这里极少数人愿意回答入门级问题。</b></span><span style="float:left;display:block;line-height:160%;margin-bottom:10px;"><b style="color:#c6401b;background:url(/theme/images/circle_icon.png) no-repeat left 7px;padding-left:12px;">与编程无关勿提</b><br><b style="font-weight:normal;margin-left:12px;display:block;font-size:14px;">如运维类、项目管理类、产品及运营类，都是脱离网站主题，会被删除。</b></span><span style="float:left;display:block;line-height:160%;margin-bottom:10px;"><b style="color:#c6401b;background:url(/theme/images/circle_icon.png) no-repeat left 7px;padding-left:12px;">立题太大，问题太泛勿提</b><br><b style="font-weight:normal;margin-left:12px;display:block;font-size:14px;">如果问题需要几页文字，甚至一本书来解答，那立题就太大了；问题宽泛会让人无从下手，答案往往泛泛而谈缺乏价值，甚至会导致漫无边际的灌水，都会被关闭。</b></span><span style="float:left;display:block;line-height:160%;margin-bottom:10px;"><b style="color:#c6401b;background:url(/theme/images/circle_icon.png) no-repeat left 7px;padding-left:12px;">重复问题勿提</b><br><b style="font-weight:normal;margin-left:12px;display:block;font-size:14px;">提问前请先通过<a id="cancle_click1" href="/blog/user_manual" target="_blank">搜索功能搜寻</a>，确保要提的问题没有类似问题存在，以免提交重复而被关闭。</b></span><span style="float:left;width:80%;"><a href="javascript:void(0)">更多提问提示 <b></b></a></span></div>'+
                '<ul class="ask_notice" style="display:none; margin-bottom:15px;">'+
                    '<li><span>1.</span>	<b>避免问题过于简单与平庸：</b>德问是一个高知社群，由专家驱动的专业社区，而不是初学者乐园，这里很少人愿意回答，那些很容易从搜索引擎、常用技术手册及参考上获得答案的入门级问题。</li>'+
                    '<li><span>2.</span>	<b>问题必须与编程相关</b> </li>'+
                    '<li><span>3.</span>	<b>避免提重复问题：</b>先搜索再提问。</li>'+
                    '<li><span>4.</span>	<b>避免非问题、调查与漫无边际的讨论：</b>以解决实际问题为目的，而不是为了搜集信息与观点。 </li>'+
                    '<li><span>5.</span>	<b>确保认真地研究过自己的问题，并告诉大家您的进展与发现：</b>这样做将避免大家重走您的弯路，给您无效的答案。 </li>'+
                    '<li><span>6.</span>	<b>尽可能清晰地描述问题：</b>如果您提出的是一个含糊不清且立题不准，传达信息不全的问题，用户将很难确切地理解您的问题所在，也就很难给您准确、有效的答案。 </li>'+
                    '<li><span>7.</span>	<b>准确选择问题所涉及的主题：</b>将能使关注了这些主题的用户注意到它，从而有助于提高您获得正确答案的概率。 </li>'+
                '</ul>'+
                '<div class="ask_btm" style="margin-top:30px;"><span class="special_btn" style="background:none repeat scroll 0 0 #f0f0f0;padding: 4px 10px;">还剩<span class="timer_num_id">15</span>秒</span></div>'+
            '</div>';
        box = $('#wBox').wBox({
            title: '提问提示：<i style="font-style:normal;font-size:12px;color:#999;">声誉值满100分,并且提问至少3次该引导页消失</i>',
            opacity: 0.04,
            html: userGuideHtml
        });
        box.showBox();

        var ask_top = $('#wBox').find('.ask_top').not($("#cancle_click1")).css({cursor:'help',float:'left'}).click(function(e){

            if(e.target.id == 'cancle_click1') {
                return true;
            }

            var ask_notice = $('#wBox').find('.ask_notice').css("overflow","hidden");
            if(ask_notice.is(':hidden'))
            {
                $(this).find('b').addClass("on");
                ask_notice.fadeIn();
            }
            else
            {
                $(this).find('b').removeClass("on");
                ask_notice.fadeOut();
            }

        });
        //继续提问倒计时，并绑定继续提问按钮事件
        var num_timer = window.setInterval(function(){
            var _this = $('#wBox').find('.timer_num_id');
            var num = _this.html();
            if(num <= 1) {
                clearTimeout(num_timer);
                _this.parent().parent().html('<a href="javascript:void(0)" class="askgo special_btn" >继续提问</a>');
        $('#wBox').find('.askgo').unbind('click').click(function(){
            box.rem();
            create_box();
            set_value();
        });
                return;
    }
            _this.html(--num);
        },1000);
    }

    var create_box = function()
    {
        var ask_html =
         '<div class="popdiv "><form name="ask_question_form" id="ask_question_form" method="post" action="/question/ask">' +
             '<div class="wrap add">' +
                 '<input type="hidden" name="topic" />'+
                 '<input type="hidden" name="suggest_topic" />'+
                 '<div style="float:left;clear:both;margin-bottom:10px;"> <div class="asktt">问题</div><input id="qst_title" TABINDEX="1" class="ask_tit" autocomplete="off" name="title" value="这里输入问题标题" onfocus="if(this.value==\'这里输入问题标题\'){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=\'这里输入问题标题\'}" /><div class="ask_titletip">提示</div></div>' +
                 '<div class="asktt">话题</div><div class="topic">' +
                     '<div id="select_related_topics" class="link">' +
                           '<input style="width:500px;" id="search_related_topics" name="askData" type="text" value="为问题分类, 以便用户找到, 不超过5个话题。" autocomplete="off" TABINDEX="2"/>' +
                           '<span class="topic_arrow" id="topic_arrow" title="浏览全部话题"></span>'+
                     '</div>' +
                 '</div>' +
                 '<div class="opt"><b>更多问题细节</b> <i>(可选)</i></div>' +
                 '<div class="editor_area"><div id="qst_bar" class="wmd-button-bar"></div>' +
                 '<div><textarea id="qst_textarea" class="more wmd-input" name="content" TABINDEX="3"></textarea></div><span><a class="preview btn" href="javascript:void(0)">预览</a></span></div>' +
                 '<div id="qst_preview" class="wmd-preview" style="display:none"></div>' +
                 '<div class="btn1"><a class="cancel" href="javascript:void(0)">取 消</a><a  class="re submit" href="javascript:void(0)">提 交</a></div>' +
             '</div>' +
         '</form></div>';

        box = $('#wBox').wBox({
            title: "提问",
            html: ask_html
        });
        box.showBox();

        //search topic
        //DW.editor_suggest_topic.init('search_related_topics','select_related_topics');
        ask_search_topic = new EditorSuggestTopic({id:'search_related_topics',pid:'select_related_topics',control:'topic_arrow',fid:'select_topic',add_topic:'add_topic',cancel_topic:'cancel_topic'});
        //show all topic or search topic
        $('#topic_arrow').unbind('click').click(function() {
        	var self = $(this);
            var q = $.trim($('#search_related_topics').val());
            q = q.replace(/([\+\.\*\\\/\?\[\]\(\)\^\$]+?)/g,'\\$1');
            if(q == '为问题分类, 以便用户找到, 不超过5个话题。') {
                q = '';
            }
            if (q == '') {
                self.attr('title','浏览全部话题');
            } else {
                self.attr('title','查看当前匹配话题');
            }
            ask_search_topic.get_all_topics(self,'all',q);
        });

        //初始化按钮
        submit = $('#wBox').find('.submit');
        cancel = $('#wBox').find('.cancel');
        var preview = $('#wBox').find('.preview');

        //suggest初始化
        setup_suggest({id:'qst_title',filter:'3',func:'page_loaction',link:true,suggest_topic:false});

        submit.unbind('click').click(function(){
            topics = ask_search_topic.topics;
            suggest_topics = ask_search_topic.suggest_topics;
            var _this = $(this);
            //表单检查
            var res = check_ask_form();
            if(suggest_topics.length) {
                $('input[name=suggest_topic]').val(suggest_topics.join(','));
            }
            if(!res)
            {
                $.get("/ajax/check_ask_question", {ajax: 1},
                function(data){
                    var res = $.parseJSON(data);
                    if(res.success == 1)
                    {
                        if(!have_submited)
                        {
                            document.ask_question_form.submit();
                            have_submited = true;
                            $('<span class="loadupdate"></span>').insertAfter(_this);
                        }
                    }
                    else
                    {
                        show_error(_this, res.message);
                        return false;
                    }
                });
            }
            else
            {
                show_error(_this, res);
            }
        });
        cancel.unbind('click').click(function(){
            box.close();
        });
        preview.unbind('click').click(function(){
            $('#qst_preview').toggle('fast');
        });
        preview.toggle(function(){$(this).text('收起')}, function(){$(this).text('预览')});

        //编辑器初始化
        setup_wmd({input: "qst_textarea", button_bar: "qst_bar", preview: "qst_preview"});

        show_title_tip();
    }
    //提问标题启发式提醒
    function show_title_tip() {

        var tips = '';
        var qst_title = '';
        var ajax_timer = null;
        $("#qst_title").blur(function(){

            is_show_tips = false;
            var current_title = $.trim($('#qst_title').val());
            if(qst_title != current_title) {
                qst_title = current_title;
                var tmp = current_title.match(/[a-zA-Z0-9]/g) && current_title.match(/[a-zA-Z0-9]/g).join('');
                var length = current_title.length;
                if(tmp) {
                    length = (length - tmp.length) + Math.ceil(tmp.length/3);
                }
                if( length < 10) {
                    tips = "<b>标题少于10个字数，您确定题意传达清楚？（可忽略）</b><span>题目如信息传达不清晰全面，会导致用户无法定位问题给出准确解答</span>";
                    $(".ask_titletip").html(tips).slideDown();
                //ajax请求
                }else {

                    if(current_title.indexOf("高手求助") !== -1 ||
                             current_title.indexOf("请教") !== -1 ||
                             current_title.indexOf("求助高手") !== -1 ||
                             current_title.indexOf("求助") !== -1
                    ){
                        var word = '';
                        if(current_title.indexOf("高手求助") !== -1){
                            word = '高手求助';
                        }else if(current_title.indexOf("请教") !== -1){
                            word = '请教';
                        }else if(current_title.indexOf("求助高手") !== -1) {
                            word = '求助高手';
                        }else if(current_title.indexOf("求助") !== -1){
                            word = '求助';
                        }
                        tips = "<b>标题中请勿使用“"+word+"”这样无意义的词汇（可忽略）</b><span>如对解决实际问题毫无帮助，请勿用无意义或华而不实的词汇，直接清晰的传达题意更为重要。</span>";
                    }else if(/^求.*?/.test(current_title) ||
                        current_title.indexOf("跪求") !== -1 ||
                        current_title.indexOf("裸求") !== -1
                    ) {
                        var word = '';
                        if(/^求.*?/.test(current_title)) {
                            word = '求';
                        }else if(current_title.indexOf("跪求") !== -1){
                            word = '跪求';
                        }else if(current_title.indexOf("裸求") !== -1){
                            word = '裸求';
                        }
                        tips = "<b>标题中请勿使用“"+word+"”乞求式的词汇（可忽略）</b><span>德问致力于为用户提供专业同行历经实践的解答，但社群用户没有义务和精力写一整套代码，请提炼问题要点再发布。</span>";
                    }

                    else {
                        tips = false;
                    }
                    if(tips !== false) $(".ask_titletip").html(tips).slideDown();
                }
            }else {
                if(tips) {
                    $(".ask_titletip").html(tips).slideDown();
                }
            }
           /*if($(".ask_titletip").is(":visible")) {
                setTimeout(function(){$(".ask_titletip").slideUp();},5000);
           }*/
        }).focus(function(){
            $(".ask_titletip").slideUp();
        })
    }

    function show_tip(msg)
    {
        if(tip) {
            return;
        }
        msg_tip = $('<div class="msg_tip"><div class="notice_tip_nub"></div><div class="notice_tip">'+msg+'</div></div>');
        var offset = input.offset();
        var height = input.outerHeight();
        var box_left = offset.left;
        var box_top = offset.top + height;
        msg_tip.css({
            'left':box_left + 'px',
            'top':box_top + 'px',
            'width':(input.outerWidth()+10) + 'px',
            'position':'absolute',
            'z-index':10000
        });
        msg_tip.hide();
        $('body').append(msg_tip);
        msg_tip.fadeIn();
        tip = true;
    }

    function set_value()
    {
        $('#qst_title').val( input.val().replace(/\s*\[.+\]\s*/,''));
        input.blur().val('');
    }

    function add_question()
    {
        DW.search_suggest.close(0);

        if(!DW.global.uid)
        {
            //DW.util.msg('请先登录');
            Tip_login.ask_question.ask();
            return;
        }
        if(parseInt( DW.global.is_active ) == 0)
        {
            DW.util.msg('您的帐号还没激活，不能参与提问');
            return;
        }

        var value = $.trim( input.val() );
        if(value == '' || value == '搜索问题、话题或者人' || value == '这里输入问题'
           || (value.substr(0,2) == '搜索' && value.substr(-3,3) == '的问题')) {
            show_tip('请先输入问题，推荐列表没有符合结果，再点击提问按钮添加新问题。');
            input.val('这里输入问题');
        }
        else
        {
            //检测账号是否激活
            if(DW.global.is_active == '0') {
                show_tip('您的账号账号未激活，暂不能发布问题。');
            }
            //检测是否禁闭，限制发布问题
            if(DW.global.prison == '1' || DW.global.prison == '2' || DW.global.prison == '4') {
                show_tip('您的账号当前被关禁闭，期间不能发布问题。');
            }
            if(DW.global.out_qst_limit == '1') {
                show_tip('您今天的<a href="/people/'+DW.global.uid+'/resource" target="_blank">提问资源</a>已用完，暂时不能发布问题。');
            }
            //check user points
            else if( parseInt(DW.global.upoints) < 100 || parseInt(DW.global.ask_count) < 3)
            {
                showUserGuide();
            }
            else
            {
                create_box();
                set_value();
            }
        }

        $('#qst_title').focus();
    }

    var init = function()
    {
        input = $('#search_input');

        input.focus(function(){

            if(tip)
            {
                msg_tip.fadeOut('fast', function(){
                    tip = false;
                    $(this).remove();
                });
            }
        });
        if( !$.isEmptyObject( $('#ask_question') ) )
        {
            $('#ask_question').click(function(event){
                event.stopPropagation();
                add_question();
            });
        }
    }

    return {
        init:init,
        add:add_question,
        show_title_tip:show_title_tip
    }
})(jQuery);

/*
 *地理位置
 */
DW.location=function(e){function b(a,c,d){var g="",f=null,d=d?d:"";switch(c){case "province":g='<option value="">\u7701\u4efd</option>';f=h;break;case "city":g='<option value="">\u57ce\u5e02</option>';f=j;break;case "nation":g='<option value="">\u56fd\u5bb6/\u5730\u533a</option>';f=i;break;default:return}e.ajax({type:"POST",url:"/ajax/get_place",data:"p="+a+"&type="+c+"&ajax=1",success:function(a){a=e.parseJSON(a);if(e.isEmptyObject(a))f.html(g),f.hide();else{var c="",b;for(b in a)c=b==d?" selected ":
"",g+='<option value="'+b+'"'+c+">"+a[b]+"</option>";f.html(g);f.show()}}})}var i,h,j;return{init:function(a,c,d){a=!a?"":a;c=!c?"":c;d=!d?"":d;i=e("#nation");h=e("#province");j=e("#city");b(a,"nation",a);b(a,"province",c);b(c,"city",d);i.change(function(){var a=e(this).val();b(a,"province");b("","city",1)});h.change(function(){var a=e(this).val();b(a,"city",1)})}}}(jQuery);

/**
 * 用户topic浮动层
 */
DW.tip_layer = (function($)
{
    var _this, timer, layer=null, flag = false, width=340, height=200, last_id=0, _ajax=null, timer2, query=null, load_html = '<div class="loading"><span>加载中...</span>';

    //获取数据
    var getData = function(id, type)
    {
        if(!layer)
        {
            return false;
        }
        var url;
        if (type == 'user') {
            url = '/ajax/user_layer';
        } else if (type == 'topic') {
            url = '/ajax/topic_layer';
        } else if (type == 'bounty') {
            url = '/ajax/bounty_layer';
        }else if(type =='badge'){
            url = '/ajax/badge_layer';
        }

        _ajax = $.ajax({
           type: "POST",
           url: url,
           data: "id="+ id +'&'+new Date().getTime()+"&ajax=1",
           beforeSend: function(){
               layer.find('.popLayerContent').html(load_html);
           },
           complete: function(){

           },
           success: function(msg){
             layer.find('.popLayerContent').html(msg);
            _posCard();

             if(type == 'topic')
             {
                 //初始化follow
                 DW.follow.topic('#topic_follow_layer');
             }
             else if(type == 'user')
             {
                 //初始化follow
                 DW.follow.user('#user_follow_layer');
             }
           }
        });
    }

    var _posCard = function()
    {
        if(!_this)
        {
            return false;
        }

        var offset = _this.offset(),
            height = _this.outerHeight(),
            width = _this.outerWidth(),
            win = $(window),
            doc = $(document),
            win_width = win.width(),
            win_height = window.innerHeight ? window.innerHeight : win.height(),
            scroll_top = win.scrollTop(),
            scroll_left = win.scrollLeft(),
            card_height = layer.outerHeight(),
            card_width = layer.outerWidth(),
            top, right, left, dir, pos, offsetY=13, offsetX=13;

            dir = 'arrow_down';
            pos = 'arrow_left';
            top = offset.top - card_height - offsetY;
            if(top<scroll_top)
            {
                dir = 'arrow_up';
                top = offset.top + height + offsetY;
            }
            left = offset.left - offsetX;
            if(left + card_width > scroll_left + win_width)
            {
                pos = 'arrow_right';
                left = null;
                right = win_width - (offset.left + width) - offsetX;
            }

            layer.css({
                top:top,
                right:right,
                left:left
            });

            layer.removeClass('arrow_up arrow_down arrow_left arrow_right').addClass(dir+' '+pos);
    }

    //删除层
    var remLayer = function()
    {
        clearTimeout(timer);
        if(!flag)
        {
            return false;
        }

        layer.remove();
        layer=null;
        flag = false;
        if(_ajax)
        {
            _ajax.abort();
        }
    }

    //创建层
    var createLayer = function(id, type, obj_id)
    {
        if(flag)
        {
            return false;
        }
        flag = true;

        var markup = [
            '<div id="',last_id,'" class="popLayer">',
            '<div class="popLayerArrow"></div>',
            '<div class="popLayerContent">',load_html,
            '</div>'
        ];
        lastid = id;
        layer = $(markup.join('')).css({'z-index':9999}).hide().appendTo('body');

        _posCard();
        layer.fadeIn();

        getData(obj_id, type);
        layer.mouseover(function(){clearTimeout(timer)});
        layer.bind('mouseleave', remLayer);

    }

    //初始化
    var init = function(element, type)
    {
        var list = typeof(element) == 'string' ? $(element) : element;
        list.mouseover(function(){
            clearTimeout(timer);
            _this = $(this);

            var key;
            var rel = _this.attr('rel').split('|');
            if (type == 'topic') {
                key = 't_'+rel[0];
            } else if(type == 'user') {
                key = 'u_'+rel[0];
            } else if(type == 'bounty') {
                key = 'bounty_'+rel[0];
            }else if(type == 'badge'){
                key = 'badge_'+rel[0];
            }

            var obj_id = rel[1];
            var lid = 'tip_layer_'+key;
            //移动层
            if(layer != null)
            {
                if(lid == last_id)
                {
                    return false;
                }
                remLayer();
            }

            //创建层
            timer = setTimeout(function(){
                createLayer(lid, type, obj_id);
            }, 800);
        })
        .bind('mouseout mouseleave',function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                remLayer();
            }, 300);
        });
    }

    var init_user = function(ele)
    {
        init(ele, 'user');
    }

    var init_topic = function(ele)
    {
        init(ele, 'topic');
    }

    var init_bounty = function(ele)
    {
        init(ele, 'bounty');
    }

    var init_badge = function(ele) {
        init(ele, 'badge');
    }

    return {
        init_user:init_user,
        init_topic:init_topic,
        init_bounty:init_bounty,
        init_badge:init_badge
    }
})($);

/**
 * 关注
 */
DW.follow = (function($){
    var timer;

    function request(obj, type)
    {
        var _rel = typeof(obj) == 'string' ? obj : obj.attr('rel');

        if(!DW.global.uid) {
           //Tip_login.follow.login(obj,type,_rel);
           location.href='/user/login?redirect_to='+location.href;
           return false;
        }
        var url = '';
        var data = [];
        data['type'] = type;
        if(_rel.indexOf('|') == -1)
        {
            data['id'] = _rel;
            data['name'] = '';
            data['act'] = '';
        }
        else
        {
            var rel = _rel.split('|');
            data['id'] = rel[0];
            data['name'] = rel[1];
            data['act'] = rel[2] != undefined && rel[2] == '+' ? '加' : '';
        }

        if(obj.hasClass('follow'))
        {
            url = '/ajax/follow';
            data['class'] = 'unfollow';
            //data['txt'] =  obj.hasClass('fbtn') ? '关注中' : '取消关注';
            data['txt'] =  obj.hasClass('fbtn') ? '取消关注' : '取消关注';
        }
        else if(obj.hasClass('unfollow'))
        {
            url = '/ajax/unfollow';
            data['class'] = 'follow';
            data['txt'] = data['act'] + '关注' + data['name'];
        }


        var tmp_data = []
        //debug(data);
        var j = 0;
        for(var i in data)
        {
            tmp_data[j] = i + "=" + data[i];
            j++;
        }

        $.ajax({
           type: "POST",
           url: url,
           data: tmp_data.join('&')+"&ajax=1",
           beforeSend:function(XMLHttpRequest){
                DW.util.loading();
           },
           success: function(msg){
             DW.util.rm_loading();
             var result = $.parseJSON( msg );
             if (result.success == 1) {
                 //obj.attr('class', data['class']);
                 obj.removeClass('follow');
                 obj.removeClass('unfollow');
                 obj.addClass(data['class']);
                 obj.html(data.txt);
            } else {
                var box = $('#wBox').wBox({
                    noTitle:true,
                    drag:false,
                    opacity:0.1,
                    title: "系统提示",
                    html: '<div style="width:280px;">'+ result.message +'</div>',
                    timeout:3000
                });
                box.showBox();
            }
           }
        });
    }

    function init(element, type)
    {
        var list = typeof(element) == 'string' ? $(element) : element;
        list.each(function(){
            var _this = $(this);
            _this.click(function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    //ajax
                    request(_this, type);
                }, 300);
            })
            .hover(
                function(){

                    if(_this.hasClass('unfollow') && _this.hasClass('fbtn'))
                    {
                        $(this).text('取消关注');
                    }
                },
                function(){
                    if(_this.hasClass('unfollow') && _this.hasClass('fbtn'))
                    {
                        $(this).text('关注中');
                    }
                }
            );
        });

    }

    var follow_topic = function(element)
    {
        init(element, 'topic')
    };

    var follow_question = function(element)
    {
        init(element, 'question')
    };

    var follow_user = function(element)
    {
        init(element, 'user')
    };

    return {
        topic:follow_topic,
        question:follow_question,
        user:follow_user,
        request:request
    }
})($);


/**
 * 问题编辑
 */
var deltopic = function (obj)
{
    obj.parent().remove();
    var topic_ids = [];
    $('#qst_edit_topics').find('a').each(function(){
        topic_ids.push($(this).attr('id'));
    });
    $("input[name='topic']").val(topic_ids.join(','));
}

var addtopic = function (id, topicname, url)
{
    var topics = $("#edit_question_form input[name='topic']").val().split(',');
    if(topics.length > 4)
    {
        //DW.util.msg_box('#edit_question_form', '最多只能添加5个主题', 0);
        return;
    }
    if($.inArray(id, topics) > -1)
    {
        //DW.util.msg_box('#edit_question_form', '该主题已经存在', 0);
        return;
    }
    var topic = $('<a title="'+ topicname +'" href="javascript:void(0)" id="'+ id +'">'+ topicname +' <b onclick="deltopic($(this));">X</b></a>');
    $('#qst_edit_topics').append(topic);

    var topic_ids = [];
    $('#qst_edit_topics').find('a').each(function(){
        topic_ids.push($(this).attr('id'));
    });
    $("input[name='topic']").val(topic_ids.join(','));
    $('#qst_edit_topic').val('').focus();
}


/**
 * 高亮
 */
function highlight_ans(){var hash=location.hash;var top,is_answer=false,is_queue=false;if(hash){var result=hash.match(/#(.+)/);if(result==null)return;var pattern=/^(\d+)$/;if(pattern.test(result[1])){if(!$("#ans"+result[1]).length)return;is_answer=true;var answer=$("#ans"+result[1]);top=answer.offset().top-20;var ans_bg=$("<div>").prependTo(answer).css({position:"absolute","z-index":0,left:"-7px",top:"-7px",height:answer.height()+14,width:answer.width()+14,background:"#FFEFC6"})}else{if(!$("#"+result[1]).length)return;
var pattern_wait=/.+_wait$/;if(pattern_wait.test(result[1])){top=$("#"+result[1]).offset().top-200;is_queue=true}else top=$("#"+result[1]).offset().top-20}if(is_answer)ans_bg.fadeOut(3E3,function(){$(this).remove()});else if(is_queue);}};

/**
 * loading
 */
/*DW.loading=function($){var offset=$(".container,.adminbox").offset();var top=$(window).height()/2-100;var left =$(".itemsug").width()/2; var top1 =$(this).parent().parent().height()/2; var l=$('<span id="loada"><img src="/theme/images/loading.gif" /></span>').css({"z-index":1E3,position:"fixed",left:offset.left+left,top:offset.top+top1,display:"inline-block"});var add=function(){$("body").append(l)};var rem=function(){l.remove()};return{add:add,rem:rem}}($);*/
DW.loading=function($){
    var l;
    var add = function(item) {
        var _this = $("#"+item);var left = _this.width()/2;var top = _this.height()/2;l = $('<span id="loada"><img src="/theme/images/loading.gif" /></span>').css({"z-index":1E3,position:"absolute",left:left-25,top:top+25,display:"inline-block"});_this.append(l);
    }
    var rem=function(){l.remove()};return{add:add,rem:rem}
}($);

/**
 * 队列详细内容
 */
function set_arrow(a,b){b.length?b.is(":hidden")?(a.removeClass("arrow_up"),a.addClass("arrow_down")):(a.removeClass("arrow_down"),a.addClass("arrow_up")):(a.removeClass("arrow_up"),a.addClass("arrow_down"))};
function queue_detail()
{
    var timer;
    $('.queue_detail').click(function(){
        var ck_id = $(this).attr('rel');
        var ck_type = parseInt( $('#check_type').val() );
        var url = '';

        var _this = $(this);

        if(ck_type != 6)
        {
            var _detail = $('#list_queue_'+ck_id).find('.moudle_queue_detail');
            if(_detail.length)
            {
                _detail.toggle(80, function(){
                    set_arrow(_this, _detail);
                });
                return;
            }
        }
        else
        {
            //别名评审JS
            var p = $(this).parent().parent();
            var _detail = p.find('#alias_vote_detail'+ck_id);
            if(_detail.length)
            {
                p.find('.arrow_up').each(function(){
                    $(this).removeClass('arrow_up');
                    $(this).addClass('arrow_down');
                });

                p.find('.moudle_queue_detail').each(function(){
                    var id = 'alias_vote_detail'+ck_id;
                    if( $(this).attr('id') != id)
                    {
                        $(this).hide();
                    }
                });
                _detail.toggle(80, function(){
                    set_arrow(_this, _detail);
                });
                return;
            }
        }
        switch(ck_type)
        {
            case 2://close
            case 3://reopen
            case 7://redirect
            case 8://del_ans
            case 4://del_qst
                url = "/review_queue/queue_vote_detail";
                break;
            case 6://alias
                url = "/review_queue/topic_alias_detail";
                break;
        }
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
               type: "POST",
               url: url,
               data: "ck_id="+ck_id+"&ck_type="+ck_type,
               beforeSend: function(XHR){
                   DW.loading.add('list_queue_'+ck_id);
               },
               success: function(msg){
                    DW.loading.rem();
                    if(ck_type != 6)
                    {
                        var tmp = $(msg).hide();
                        $('#list_queue_'+ck_id).append(tmp);
                        tmp.fadeIn();
                        set_arrow(_this, $('#list_queue_'+ck_id));
                    }
                    else
                    {
                        p.find('.arrow_up').each(function(){
                            $(this).removeClass('arrow_up');
                            $(this).addClass('arrow_down');
                        });

                        p.find('.moudle_queue_detail').hide();
                        var tmp = $(msg).hide();
                        p.append(tmp);
                        tmp.fadeIn();
                        set_arrow(_this, p);
                    }
                    DW.img_resize.init('.rev_detail');
               }
            });
        }, 280);
    });
}

/**
 * 评论
 *
 */
 var CommentManager = function( commentsObj )
 {
     this.comments;
     this.commentsLink;
     this.pid;
     this.type;
     this.isLoadComments = false;
     this.isLoadEditor = false;
     this.is_post = false;
     this.timer;
     this.isShowMore = false;
     this.replayUsers = 0;

     this.init( commentsObj );
 }

CommentManager.prototype = {

    addCommentEvent : function(commentObj)
    {
        var self = this;
        var action_spans = commentObj.find('.comment-edit, .comment-del, .comment-flag, .comment-vote, .comment-reply');
        commentObj.hover(
            function(){action_spans.addClass('actions-show')},
            function(){action_spans.removeClass('actions-show')}
        );

        //event edit
        commentObj.find('.comment-edit').click(function(){
            var p = $(this).closest('.comment');
            var tmpId = p.attr('id').split('-');
            if( $("#comment"+self.type+"-editor-"+tmpId[1]).length )
            {
                return false;
            }
            var data = {
                cid : tmpId[1],
                content : p.find('.comment-cnt').html()
            };
            self.createEditor(data);
        });

        //event del
        commentObj.find('.comment-del').click(function(){
            if(confirm("确认删除此条评论？") == true)
            {
                var p = $(this).closest('.comment');
                var tmpId = p.attr('id').split('-');
                $("#comment"+self.type+"-"+tmpId[1]).remove();//remove
                self.delComment({
                    cmt: p,
                    cid : tmpId[1],
                    type : self.type,
                    success : function(){}
                });
            }
        });

        //event flag
        commentObj.find('.comment-flag').click(function(){
            if(DW.global.is_active == '0') {
                DW.util.error_msg($(this),'您的账号未激活，暂不能举报评论。');
                return false;
            }
            if(DW.global.prison == '1') {
                DW.util.error_msg($(this),'您的账号当前被关禁闭，期间不能举报评论。');
                return false;
            }
            if( $('#wBox').length )
            {
                return false;
            }
            var p = $(this).closest('.comment');
            var tmpId = p.attr('id').split('-');
            var oFlag = new Flag();
            oFlag.init({id:tmpId[1], type:'c', ext:self.type});
        });

        //event vote
        commentObj.find('.comment-vote').click(function(){
            clearTimeout(self.timer);
            if(self.is_post)
            {
                return false;
            }
            var p = $(this).closest('.comment');
            var tmpId = p.attr('id').split('-');
            var voted = parseInt( $(this).attr('voted') );
            self.timer = setTimeout(function(){
                self.voteComment({
                    cid : tmpId[1],
                    voted : voted,
                    type : self.type,
                    cmtobj : p
                });
            }, 180);
        });

        //event replay
        commentObj.find('.comment-reply').click(function(){
            var _this = $(this);
            var p = _this.closest('.comments');

            var pid = p.attr("id");
            var cmt_add_id = pid.replace(/-/, "-add-");
            var editor = $("#"+cmt_add_id).next(".comment-editor");

            if(!editor.length) {
                 self.replayUsers = 0;
            }


            //reply users
            var reply_uid = parseInt( _this.attr("id") );
            if(reply_uid == 0) {
                return false;
            }
            //exists or not
            //if(self.replayUsers.length >0 && $.inArray(uid, self.replayUsers) != -1) {
            //    return false;
            //}
            //self.replayUsers.push(uid);
            if(self.replayUsers == reply_uid) {
                return false;
            }
            self.replayUsers = reply_uid;

            var reply_pre = '@'+ _this.attr("name") + ' ';
            //更新前缀

            if(!editor.length) {
                 self.createEditor({content:reply_pre, reply:reply_uid});
                 self.isLoadEditor = true;
                 $("#"+cmt_add_id).hide();
            } else {
                var input_txt = editor.find(".comment-editor-input").val();
                input_txt = input_txt != undefined ? reply_pre +''+ input_txt : reply_pre;
                editor.find(".comment-editor-input").val( input_txt );

                //cursor
                var _input = editor.find(".comment-editor-input");
                var _input_ = _input[0];
                var pos = _input.val().length;
                if (_input_.createTextRange) {
                    var range = _input_.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                } else if (_input_.setSelectionRange) {
                    _input_.focus();
                    _input_.setSelectionRange(pos, pos);
                }
            }
        });
    },

    voteComment : function(params)
    {
        var self = this;
        var vote = params.voted == 0 ? 1 : 0;

        $.ajax({
            type: "POST",
            url: "/ajax/vote",
            dataType: "json",
            data: "&id="+ params.cid +"&vote="+ vote +"&type="+ params.type +"&ajax=1",
            beforeSend: function(XHR){
                self.is_post = true;
            },
            complete: function(){
                self.is_post = false;
            },
            success:function(msg)
            {
                if(msg.success == 1)
                {
                    var voteObj = params.cmtobj.find('.comment-vote');
                    var numObj = params.cmtobj.find('.comment-num');
                    voteObj.attr('voted', msg.voting);
                    //if( parseInt(msg.result_score) > 0 )
                    //{
                        numObj.text(msg.result_score);
                    //    if( !numObj.hasClass('actions-show') )
                    //    {
                    //        numObj.addClass('actions-show');
                    //    }
                    //}
                    //else
                    //{
                    //    numObj.removeClass('actions-show');
                    //}

                    if(msg.voting > 0)
                    {
                        voteObj.addClass('comment-voted');
                    }
                    else
                    {
                        voteObj.removeClass('comment-voted');
                    }
                }
                else
                {
                    var voteObj = params.cmtobj.find('.comment-vote');
                    DW.util.error_msg(voteObj, msg.message);
                }
            }
        });
    },

    delComment : function(params)
    {
        var self = this;
        $.ajax({
            type: "POST",
            url:  "/comment/delete",
            dataType: "json",
            data: "&cid="+ params.cid +"&ctype="+ params.type +"&ajax=1",
            success:function(msg)
            {
                if (msg.success == 1) {
                    params.success();
                    var count = parseInt( $("#comment"+self.type+"-count-"+ self.pid +" .cmtNum").text() );
                    count--;
                     $("#comment"+self.type+"-count-"+ self.pid +" .cmtNum").text(count)
                }
                else
                {
                    DW.util.error_msg(params.cmt.find('.comment-del'), msg.message);
                }
            }
        });
    },

    appendCommentToList : function(cmt)
    {
        var self = this;
        var text = cmt.content;
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        text = text.replace(/(\r?\n)+/ig,"<br>");

        var comment = [];
        comment[0] = '<li id="comment'+self.type+'-'+ cmt.cid +'" class="comment">';
        comment[1] = '<div class="comment-actions"><span class="comment-num">0</span></div>';
        comment[2] = '<div class="comment-text">';
        comment[3] = '<span class="comment-cnt">'+ text +'</span>';
        comment[4] = '&ndash;&nbsp;<a href="'+ cmt.url +'">'+ cmt.name +'</a>';
        comment[5] = '<span class="comment-date">刚刚</span>';
        if (DW.global.uid) {
        comment[6] = '<span class="comment-edit" title="编辑">编辑</span>';
        comment[7] = '<span class="comment-del" title="删除">删除</span>';
        }
        comment[8] = '</div>';
        comment[9] = '</li>';

        var obj_comment = $(comment.join(' '));
        this.addCommentEvent(obj_comment);

        this.comments.append(obj_comment);
    },

    postComment : function(params)
    {
        var self = this;

        if(params.content.length < 6 || params.content.length > 600)
        {
            return false;
        }

        var postUrl = '', i = 0, data = [], postData = [];
        if( params.cid )
        {
            postUrl = '/comment/edit';
            postData['cid'] = params.cid;
            postData['type'] = params.type;
        }
        else
        {
            postUrl = params.type == 7 ? "/comment/add_q" : "/comment/add_a";
            postData['id'] = params.pid;
            postData['reply'] = self.replayUsers != 0 ? self.replayUsers : 0;
        }
        postData['content'] =  params.content.replace(/(\r?\n)+/ig, "\n");
        postData['ajax'] = 1;

        for(var key in postData)
        {
            data[i] = key +'='+ encodeURIComponent( postData[key] );
            i++;
        }

        $.ajax({
            type: "POST",
            url: postUrl,
            data: data.join('&'),
            dataType: "json",
            beforeSend: function(XHR){
                params.editor.find('.loadupdate').show();
                self.is_post = true;
            },
            complete: function(){
                params.editor.find('.loadupdate').hide();
                self.is_post = false;

            },
            success:function(msg)
            {
                if(msg.success)
                {
                    if(!params.cid)
                    {
                        var ret = msg.message;
                        self.appendCommentToList({cid:ret.cid, name:ret.name, url:ret.url, content:params.content});
                        $("#comments"+self.type+"-add-"+self.pid).show();//编辑器输入框显示

                        var count = parseInt( $("#comment"+self.type+"-count-"+self.pid+" .cmtNum").text() );
                        count++;
                        $("#comment"+self.type+"-count-"+self.pid+" .cmtNum").text(count);
                    }
                    else
                    {
                        var comment = $("#comment"+self.type+"-"+params.cid);
                        params.content = params.content.replace(/&/g, "&amp;");
                        params.content = params.content.replace(/</g, "&lt;");
                        params.content = params.content.replace(/>/g, "&gt;");
                        params.content = params.content.replace(/(\r?\n)+/ig,"<br>");
                        comment.find(".comment-cnt").html( params.content );
                        comment.find(".comment-date").text("刚刚");
                        comment.show();
                    }

                    //移除编辑器
                    params.editor.remove();
                    self.isLoadEditor = false;
                }
                else
                {
                    params.editor.find('.comment-editor-msg').html('<span class="comment-editor-warm">'+ msg.message +'</span>');
                }
            }
        });
    },

    replayComment : function(){

    },

    genListHtml : function(data, cnf)
    {
        var self = this;
        if(data == null)
        {
            return false;
        }
        var commentsArr = [];
        var count = data.length;
        for( var i = 0; i < count; i++ )
        {
            var cmt = data[i];
            var comment = [];
            comment[0] = '<li id="comment'+self.type+'-'+ cmt.cid +'" class="comment"><div class="comment-actions">';
            //if(parseInt(cmt.votes) > 0) {
            //    comment[1] = '<span class="comment-num actions-show">'+ cmt.votes +'</span>';
            //} else {
                comment[1] = '<span class="comment-num">'+ cmt.votes +'</span>';
            //}
            if( !cmt.is_self ) {
                var voted = cmt.voting == 1 ? ' comment-voted' : '';
                comment[2] = '<span title="支持" voted="'+ cmt.voting +'" class="comment-vote'+ voted +'">支持</span>';
            }
            comment[3] = '</div>';
            comment[4] = '<div class="comment-text">';
            comment[5] = '<span class="comment-cnt">'+ cmt.content +'</span>';
            comment[6] = '&ndash;&nbsp;<a href="/people/'+ cmt.user.pub_uid +'">'+ cmt.user.name +'</a>';
            comment[7] = '<span class="comment-date">'+ cmt.last_edit_time +'</span>';
            if ( DW.global.uid )
            {
                if( !cmt.is_self )
                {
                    if(cnf.is_cmt && !cnf.is_locked) {
                    comment[8] = '<span name="'+ cmt.user.name +'" id="'+ cmt.user.pub_uid +'" class="comment-reply" title="回复该评论">回复</span>';
                    }
                    comment[9] = '<span class="comment-flag" title="举报该评论">举报</span>';
                }
                else
                {
                    if( cmt.has_perm_edit )
                    {
                        comment[8] = '<span class="comment-edit" title="编辑">编辑</span>';
                    }
                }

                if( cmt.has_perm_del )
                {
                    comment[10] = '<span class="comment-del" title="删除">删除</span>';
                }
            }
            comment[11] = '</div>';
            comment[12] = '</li>';

            commentsArr.push(comment.join(' '));
        }
        return commentsArr.join("");
    },

    loadCommentList : function(data)
    {
        var self = this;
        $.ajax({
           type: "POST",
           url: "/comment/cmt_list",
           data: "id="+ data.id +"&type="+ data.type,
           dataType: "json",
           timeout: 30000,
           beforeSend: function(){
               data.beforeSend();
           },
           complete: function(){
               self.isLoadComments = true;
           },
           error : function(){
               alert('请求超时');
           },
           success: function(msg){
                var commentsListHtml = self.genListHtml(msg['data'], msg['cnf']);

                if( commentsListHtml )
                {
                    self.isShowMore = true;
                    data.success();
                    self.comments.html( commentsListHtml );
                    $("#comment"+self.type+"-count-"+ data.id +" .cmtNum").text(msg.count);
                }

                if(DW.global.uid > 0)
                {
                    if( commentsListHtml )
                    {
                        self.comments.find('li').each(function(){
                            self.addCommentEvent( $(this) );
                        });
                    }
                }
           }
        });
    },

    lessCommentList : function()
    {
        var self = this;
        this.isShowMore = false;
        this.isLoadComments = false;
        var lastComments = this.comments.find(".comment").slice(-4);
        this.comments.html(lastComments);
        if(DW.global.uid > 0)
        {
            this.comments.find('li').each(function(){
                self.addCommentEvent( $(this) );
            });
        }
    },

    createEditor : function(params){
        var self = this;

        var params = params || {};
        var idStr = params.cid != undefined ? 'id="comment'+self.type+'-editor-' + params.cid +'"' : '';
        //var cols = self.type == 7 ? 83 : 78;
        var cols = 78;
        self.replayUsers = params.reply != undefined ? params.reply : 0;
        var contentStr = params.content != undefined ? params.content : '';
        contentStr = contentStr.replace(/&lt;/g, "<");
        contentStr = contentStr.replace(/&gt;/g, ">");
        contentStr = contentStr.replace(/(\r?\n)+/ig, "");
        contentStr = contentStr.replace(/<br\s*\/?>/ig,"\n");

        var editorTpl = new Array();
        editorTpl[0] = '<div class="comment-editor" '+ idStr +'>';
        editorTpl[1] = '<textarea rows="3" cols="'+ cols +'" class="comment-editor-input">'+ contentStr +'</textarea>';
        editorTpl[2] = '<div class="comment-editor-btm">';
        editorTpl[3] = '<div class="comment-editor-btns">';
        if( idStr ) {
            editorTpl[4] = '<button class="comment-editor-btn" >更新</button>';
        } else {
            editorTpl[4] = '<button class="comment-editor-btn" >添加评论</button>';
        }
        editorTpl[5] = ' <a class="comment-editor-cancel" href="javascript:void(0)">取消</a><span style="display:none" class="loadupdate"></span></div>';
        editorTpl[6] = '<div class="comment-editor-msg"></div>';
        editorTpl[7] = '</div></div>';

        var editorTplHtml = '';
        for(var i in editorTpl)
        {
            editorTplHtml += editorTpl[i];
        }

        var cmtEditor = $( editorTplHtml );

        if( idStr )
        {
            //编辑
            cmtEditor.insertAfter("#comment"+self.type+"-"+params.cid);
            $("#comment"+self.type+"-"+params.cid).hide();

            // cancel event
            cmtEditor.find(".comment-editor-cancel").click(function(){
                $("#comment"+self.type+"-editor-"+params.cid).remove();
                $("#comment"+self.type+"-"+params.cid).show();
            });
        }
        else
        {
            if( this.comments.length == 0 )
            {
                this.comments = $('<ul id="comments'+self.type+'-'+ this.pid +'" class="comments"></ul>');
                $("#comments"+self.type+"-add-"+this.pid).before(this.comments);
            }
            //cmtEditor.insertBefore( this.commentsLink );
            this.commentsLink.before(cmtEditor);

            // cancel event 2011-9-26
            cmtEditor.find(".comment-editor-cancel").click(function(){
                $(this).closest(".comment-editor").remove();
                $("#comments"+self.type+"-add-"+self.pid).show();
                self.isLoadEditor = false;
            });
        }

        //event
        var _input = cmtEditor.find(".comment-editor-input");
        var _input_ = _input[0];
        var pos = _input.val().length;
        if (_input_.createTextRange) {
            var range = _input_.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        } else if (_input_.setSelectionRange) {
            _input_.focus();
            _input_.setSelectionRange(pos, pos);
        }

        cmtEditor.find('.comment-editor-btn').click(function(){
            if( !self.is_post )
            {
                var commentEditor = $(this).closest('.comment-editor');
                var commentText = $.trim( commentEditor.find('.comment-editor-input').val() );
                commentText = commentText.replace(/(\r?\n)+/ig, "\n");
                var cid = null;
                if( commentEditor.attr("id") != undefined )
                {
                    var idArr = commentEditor.attr("id").split('-');
                    cid = idArr[2];
                }

                var data = {
                    editor : commentEditor,
                    pid : self.pid,
                    type : self.type,
                    cid : cid,
                    content : commentText
                };

                self.postComment(data);
            }
        });

         cmtEditor.find('.comment-editor-input').keyup(function(){
            var commentEditorMsg = $(this).parent().find('.comment-editor-msg');
            var lenInput = $.trim( $(this).val().length );
            var msgTxt = '';
            if( lenInput < 6 )
            {
                //msgTxt = "您还需要输入"+ (6-lenInput) +"个字";
                msgTxt = "评论内容不得少于6个字";
            }
            else if( lenInput > 5 )
            {
                msgTxt = "您还可以输入"+ (600-lenInput) +"个字";
            }
            commentEditorMsg.html('<span class="comment-msg-notice">'+msgTxt+'</span>');
        });
    },

    init : function(commentsLinkObj){

        var self = this;
        this.commentsLink = commentsLinkObj;
        var obj_type = this.commentsLink.attr("rel");
        if( obj_type == "question" )
        {
            this.type = 7;
        }
        else if( obj_type == "answer" )
        {
            this.type = 8;
        }
        if( !this.type )
        {
            return;
        }
        var idArr = this.commentsLink.attr("id").split("-");
        this.pid = idArr[2];
        this.comments = $("#comments"+self.type+"-"+this.pid);

        //prev event

        if( DW.global.uid > 0 && $("#comments"+self.type+"-"+this.pid).length )
        {
            $("#comments"+ self.type +"-"+this.pid).find('.comment').each(function(){
                self.addCommentEvent( $(this) );
            });
        }

        $("#comments"+self.type+"-add-"+this.pid).click(function(){
            //加载编辑器
            if( DW.global.uid > 0 && !self.isLoadEditor)
            {
                self.createEditor();
                self.isLoadEditor = true;
                $(this).hide();
            }
        });

        $("#comments"+self.type+"-more-"+this.pid).click(function(){
            var _this = $(this);
            //加载评论列表
            if( !self.isLoadComments )
            {
                var data = {
                    id : self.pid,
                    type : self.type,
                    beforeSend : function(){
                        _this.html('<img alt="loading..." src="/theme/images/progress-dots.gif" />');
                    },
                    success : function(){
                        _this.text('隐藏评论');
                    }
                };
                self.loadCommentList(data);
            }

            if(self.isShowMore)
            {
                self.lessCommentList();
                $(this).text('显示更多隐藏的评论');
            }
        });

        $("#comment"+self.type+"-count-"+this.pid).click(function(){
            if(!DW.global.uid) {
                location.href='/user/login?redirect_to='+location.href;
                return;
            }
            var ids = $(this).attr("id").split("-");
            var cmtsID = [];
            cmtsID[1] = "#comments"+self.type+"-"+ids[2];
            cmtsID[2] = "#comments"+self.type+"-more-"+ids[2];
            cmtsID[3] = "#comments"+self.type+"-add-"+ids[2];
            $(cmtsID.join(",")).toggle();

            var postEditor = $("#comments"+self.type+"-link-"+ids[2]).prev(".comment-editor");
            if(postEditor.length)
            {
                postEditor.toggle();
                $("#comments"+self.type+"-add-"+ids[2]).hide();
            }

            if(!parseInt($(this).find(".cmtNum").text()) && !$("#comments"+self.type+"-add-"+ids[2]).length)
            {
                if($("#comments"+self.type+"-locked-"+ids[2]).length) {
                    if(self.type == 7) {
                        DW.util.error_msg($(this), "该问题被锁定，无法评论。");
                    } else if(self.type == 8) {
                        DW.util.error_msg($(this), "该答案被锁定，无法评论。");
                    }
                } else {
                    if(DW.global.is_active == '0') {
                        DW.util.error_msg($(this), "您的账号未激活，暂不能发表评论。");
                        return;
                    }
                    DW.util.error_msg($(this), "您的账号当前被关禁闭，期间不能发表评论。");
                }
            }
        });
    }
}
/**
 * 未决版本
 */
DW.unsolved_queue = (function($)
{
    var _this, timer, box=null, obj_id, obj_type;

    var refresh = function(qid, aid)
    {
        var url = '/q/'+qid;
        if(aid)
        {
            url += '#'+aid;
        }
        location.href=url;
        location.reload();
    }

    var edit_vote = function (obj, type)
    {
        var obj_this = obj;
        var rel = obj_this.attr('rel').split('|');
        var ck_id = rel[0];
        var obj_type = rel[1];
        var url = '';
        if(obj_type == 3)
        {
            url = "/question/verify_edit";
        }
        else if(obj_type == 4)
        {
            url = "/answer/verify_edit";
        }

        $.ajax({
            type: "POST",
            url: url,
            data: 'check_id='+ck_id+'&verify_type='+type+'&'+new Date().getTime(),
            success: function(msg) {
                var res = $.parseJSON(msg);
                if(res.success)
                {
                    box.close();
                    if(res.message == '1')
                    {
                        var qid, aid=0;
                        if(obj_type == '3')
                        {
                            qid = obj_id
                        }
                        else
                        {
                            qid = $('#question_id').val();
                            aid = obj_id;
                        }
                        if(res.is_cw_mode){
                            DW.util.msg('该未决版本已通过评审。');
                        } else {
                            DW.util.msg('该未决版本已通过评审，<br>'+res.user_name+'将获得2声誉值。');
                        }
                        setTimeout(function(){refresh(qid, aid);}, 1500);
                    } else if(res.message == '0') {
                        DW.util.msg('该未决版本已被拒绝。');
                        setTimeout(function(){_this.remove();}, 0);
                    } else {
                        DW.util.msg('感谢您的投票评审工作.');
                        var vote_type;
                        if (type == 'pass') {
                            vote_type = '接受';
                        } else {
                            vote_type = '拒绝';
                        }

                        var alink = _this.clone(true);
                        alink.text('未决版本').removeClass('suggest_edit').attr('title','');

                        if(obj_type == 3) {
                            var ret = $('<div class="suggest_edited">当前问题存在一个<span></span>，您已对新版本做过 <b>'+vote_type+'投票</b></div>');
                                alink.appendTo(ret.find('span'));
                                ret.insertAfter($('#qst_content'));
                        } else {
                            var ret = $('<div class="suggest_edited">当前答案存在一个<span></span>，您已对新版本做过 <b>'+vote_type+'投票</b></div>')
                                alink.appendTo(ret.find('span'));
                                ret.insertAfter($('#ans_content_'+obj_id));
                        }
                        _this.parent('.suggest_edited').remove();
                    }
                }
                else
                {
                    //alert(res.message)
                    DW.util.msg_box('#wBoxContent', res.message);
                }
            }
        });
    }

    var listen = function()
    {
        $('#wBox').find('.edit_pass').unbind('click').click(function(){
            var this_btn = $(this);
            clearTimeout(timer);
            timer = setTimeout(function(){
                this_btn.unbind('click');
                edit_vote(this_btn, 'pass');
            }, 200);
        });

        $('#wBox').find('.edit_reject').unbind('click').click(function(){
            var this_btn = $(this);
            clearTimeout(timer);
            timer = setTimeout(function(){
                this_btn.unbind('click');
                edit_vote(this_btn, 'reject');
            }, 200);
        });

        $('#wBox').find('.edit_improve').unbind('click').click(function(){
            box.close();

            new EditManager(_this);

            //var lc = location;
            //location.href = lc.protocol +'//'+lc.hostname+lc.pathname+'?do=improve&type'+obj_type+lc.hash;
        });

        //DW.img_resize.init('#wBox .rev_detail'); //去掉图片resize 2012-3-2
    }

    var show_box = function(html)
    {
        box = $('#wBox').wBox({
            title: "未决版本评审",
            html: html
        });
        box.showBox();
    }

    var get_row = function(obj_id, obj_type, check_type)
    {
        $.ajax({
           type: "POST",
           url: '/review_queue/unsolved_queue',
           data: "obj_id="+obj_id+"&obj_type="+obj_type+"&check_type="+check_type,
           beforeSend: function(XHR){
                var loading = '<div style="width:800px;" class="loading""><span>正在加载...</span></div>';
                show_box(loading);
           },
           success: function(msg){
               if(msg == 0)
               {
                    //alert('err');
                    var tmp = '<div style="width:400px;">评审队列错误或不存在</div>';
                    $('#wBox').find('#wBoxContent').html(tmp);
                    box.setPos();
               }
               else
               {
                   var tmp = $(msg).hide();
                   $('#wBox').find('#wBoxContent').html(tmp);
                   tmp.fadeIn(400, function(){
                       listen();
                   });
               }
           }
        });
    }

    var init = function()
    {
        $('.unsolved_q, .unsolved_a').unbind('click').click(function(){
            _this = $(this);

            clearTimeout(timer);

            obj_id = _this.attr('rel');
            var check_type;
            if( _this.hasClass('unsolved_q') )
            {
                obj_type = 3;
                check_type = 1;
            }
            else if( _this.hasClass('unsolved_a') )
            {
                obj_type = 4;
                check_type = 1;
            }

            timer = setTimeout(function(){
                get_row(obj_id, obj_type, check_type);
            }, 200);
        });
    }

    return {
        init:init
    }
})($);

/*回到顶部*/
(function(){var b=$('<div class="backToTop"></div>').appendTo($("body")).text("\u8fd4\u56de\u9876\u90e8").attr("title","\u8fd4\u56de\u9876\u90e8").click(function(){$("html, body").animate({scrollTop:0},400)}),a=function(){var a=$(document).scrollTop(),c=$(window).height();a>c?b.fadeIn():b.fadeOut()};window.addEventListener?window.addEventListener("scroll",a,false):window.attachEvent&&window.attachEvent("onscroll",a);$(function(){a()})})();

/*图片大小缩放*/
DW.img_resize = (function($){
    var load_pic_path = "/theme/images/loading.gif";

    var process_pic = function(imgobj, width,height,maxwidth) {
        var _this = imgobj;
        if($.trim(_this.attr('src')) == '')
        {
            return;
        }
        if(width > maxwidth)
        {
            var w = width;
            var h = height;
            _this.width( maxwidth );
            _this.height( (maxwidth / w) * h );
            _this.css({cursor:'pointer'}).attr({'alt':'点击查看原始尺寸', 'title':'点击查看原始尺寸'}).unbind('click').click(function(){
                window.open(_this.attr('src'));
            });
        }
    }

    var init = function(ele, width, is_edit)
    {
        var _ele = typeof(ele) == 'string' ? $(ele) : ele;
        var imgs = _ele.find('img');
        var width = width == undefined ? 560 : parseInt( width );
        var is_edit = is_edit == undefined ? false : true;
        var is_ie = window.ActiveXObject ? true : false;

        imgs.each(function(){

            var _this = $(this);
            var _loading = $('<p style="text-align:center; color:#AAA; vertical-align:middle;"><img title="图片加载" src="'+ load_pic_path +'" /> 图片加载...</p>');

            if(!is_edit) {
                _this.hide();
                _loading.insertAfter(_this);
            }
            var img = new Image();
            img.src = _this.attr('loadsrc') + "?num="+ Math.random();
            if(!is_edit) {
                img.onload = function() {
                    _this.attr('src',img.src);
                    process_pic(_this, img.width,img.height,width);
                    if(!is_edit) {
                        setTimeout(function(){_this.show();_loading.remove();},500);
                    }
                }
                img.onerror=function(){
                    _loading.remove();
                    var _loadingerr = $('<p style="text-align:center; color:#AAA; vertical-align:middle;">图片加载失败<a href="'+img.src+'" target="_blank">'+img.src+'</a></p>');
                    _loadingerr.insertAfter(_this);
                }
            }else {
                process_pic(_this, _this.width(),_this.height(),width);
            }

           /* _this.attr('src',img.src);
               setTimeout(function(){
                   process_pic(_this, img.width,width);
                    if(!is_edit) {
                        _this.show();
                        _loading.remove();
                    }
               },1000);

            }*/


        });

    }

    return {
        init:init
    }
})($);


/**
 * 回答检查
 */
DW.have_answered = false;
function submit_form(b){try{/*if(DW.have_answered)return false;*/var a=$("#wmd-input").val().replace(/^\n+|\n+$/g,"").replace(/(\s*)$/g,""),c=document.getElementById("cw_mode");if(a.length<10){throw Error("\u60a8\u7684\u56de\u7b54\u4e0d\u80fd\u5c11\u4e8e10\u4e2a\u5b57");return false;}if(a.length>2E4){throw Error("\u60a8\u7684\u56de\u7b54\u4e0d\u80fd\u8d85\u8fc720000\u4e2a\u5b57");return false;}/*c.checked&&$("#ans_cw").val(1);*/window.onbeforeunload=null;/*$("#ans_content").val(a);$("#answer_form").submit();DW.have_answered=true;*/$('<span class="loadupdate"></span>').insertAfter($(b));
return true;}catch(d){return a=$(b).parent().find(".postErr"),a.length||(a=$('<span class="postErr"></span>').appendTo($(b).parent())),a.hide().text(d.message).show().delay(3E3).fadeOut(),false}};

/*问答编辑*/
var EditManager = function(ele)
{
    this._this;
    this.is_direct_edit;
    this.container = null;
    this.obj;
    this.obj_id;
    this.obj_type;
    this.flag = false;
    this.tpl;
    this.loading;
    this.posting;
    this._ajax;
    this.form_submit = false;
    this.is_improve = 0;
    this.editor_suggest_topic = null;
    this.diff_len = 0;
    this.topic_input_width = 500;
    this.startEdit(ele);
}

EditManager.prototype = {

    remLoading : function()
    {
        this.loading.remove();
        this.obj.css({opacity:1});
    },

    stopQuery : function()
    {
        this._ajax.abort();
        this.remLoading();
        this.flag = false;
        if(this.container != null)
        {
            this.container.processTemplateStop();
            this.container.remove();
        }
    },

    addLoading : function()
    {
        var self = this;
        var h = this.obj.height();
        var w = this.obj.width();
        var offset = this.obj.offset();
        this.obj.css({opacity:0.3});
        this.loading = $('<div class="ld"></div>')
            .css({'z-index':110,'position':'absolute', left:offset.left, top:offset.top, width:w, height:h})
            .dblclick(function(){
                self.stopQuery()
            })
            .appendTo('body');
    },

    cancelPost : function()
    {
        if(this._ajax != null)
        {
            this._ajax.abort();
        }
		this.close_suggestbox();
        this.container.processTemplateStop();
        this.container.remove();
        this.obj.fadeIn();
        this.flag = false;
    },

	close_suggestbox:function(){
		var idname = "qlink_box_" + (/\d+/.exec(this.container.find(".wmd-input").eq(1).attr("id")));
		$("#"+idname).remove();
		//alert(this.container.find(".wmd-input").eq(1).attr("id"));
	},

    replace_q_html : function(data, succ)
    {
        var btnPos;
        var edit_btn;
        // 判断用户触发的是哪个编辑按钮
        if(this._this.hasClass('edit')) {
            btnPos = 'top';
        } else {
            btnPos = 'btm';
        }

        // 获得完善按钮对象
        var improve_btn = this.obj.find("#edit_btn").clone(true);


        // 话题结构组装
        var topics = data.topics;
        var s_topic = '';
        for(var tid in topics)
        {
            s_topic += '<a class="t_layer" href="/topic/'+tid+'">'+topics[tid]+'</a>';
        }

        //// 编辑提示
        var s_editor = '<div class="eidtdiv"><div style="line-height:30px;color:#666;">刚刚被 <a href="'+data.editor.rev_url+'">'+data.editor.name+'编辑</a></div><div class="clear"></div></div>';

        if (data.is_new_revision == 0) {
            if(this.obj.find('.eidtdiv').length)
            {
                this.obj.find('.eidtdiv').replaceWith(s_editor);
            }
            else
            {
                this.obj.find('.microbar').prepend(s_editor);
            }
        }

        ////

        //// topic更新
        this.obj.find('#topic').html(s_topic); //话题

        //// title更新
        if(this.obj.find('#title > .qst_link_title').length) {
            var qst_title = this.obj.find('#title > .qst_link_title').clone(true);
            qst_title = qst_title.text(data.title);
            this.obj.find('#title').empty();
            this.obj.find('#title').append(qst_title);//改进地方
        } else {
            this.obj.find('#title').text(data.title);//改进地方
        }

        ///更新小标题
        this.obj.find('.question_listitle>a').html(data.title);
        //if(btnPos == 'top')
        //{
            // 为更新后的title补充编辑按钮
            this.obj.find('#title').append( improve_btn );
        //}

       //if(parseInt(data.is_bounty) == 0){
        	var bounty_html = '<a title="提供您的部分声誉值发起悬赏，吸引高手解答" style="display: none;" class="bounty" href="javascript:void(0);" id="bounty_btn">悬 赏</a>';
        	this.obj.find('#title').append(bounty_html);
        	QstMicroBar.init();
        //}

        //// 内容更新
        var cnt = this.obj.find('.que_con').html(data.content);
        //var cnt = this.obj.find('#qst_content').html(data.content);
        //var last_node = cnt.children('p').last();

        var s = $.trim(data.content)


        if( succ == 2 && (!cnt.has('.suggest_edited')))
        {
            cnt.append('<div  class="suggest_edited">您的建议修改需要得到两位评审成员认可后生效，评审结束前可继续完善。</div>');
        }

    },

    replace_a_html : function(data, succ)
    {
        var edit_btn = this.obj.find('.edit_answer').clone(true);

        var s_editor = '<div class="eidtdiv"><div style="line-height:30px;color:#666;">刚刚被 <a href="'+data.editor.rev_url+'">'+data.editor.name+'编辑</a></div><div class="clear"></div></div>';

        if(this.obj.find('.eidtdiv').length)
        {
            this.obj.find('.eidtdiv').replaceWith(s_editor);
        }
        else
        {
            this.obj.find('.ans_microbar').prepend(s_editor);
        }

        //replace
        //var cnt = this.obj.find('.post_area').html(data.content);
        //alert(this.obj.find('.ans_con').html());
        var cnt = this.obj.find('.ans_con').html(data.content);
        if(this.obj.find('.edit_answer').length == 0) {
            var last_node = cnt.children('p').last();
            if( last_node.length && last_node.next().length == 0)
            {
               last_node.append(edit_btn);
            } else {
                cnt.append($('<p>&nbsp;</p>').append(edit_btn));
            }
        }

        //wiki mode
        if(parseInt(data.cw_mode) == 1)
        {
            var author = this.obj.find('.list_tt .small-box').html('社区维基');
            var author_face = this.obj.find('.li_rgt .imgdl').remove();
        }

        if(succ == 2 && (!cnt.has('.suggest_edited')))
        {
            //edit_btn.text('您的内容正在评审，可继续完善');
            cnt.append('<div  class="suggest_edited">您的建议修改需要得到两位评审成员认可后生效，评审结束前可继续完善。</div>');
        }
    },

    finishEdit : function(succ, data)
    {

        if(this.obj_type == 3)
        {
            this.replace_q_html(data, succ);
        }
        else
        {
            this.replace_a_html(data, succ);
        }
		this.close_suggestbox();
        this.container.remove();
        this.obj.fadeIn();
        this.flag = false;
        prettyPrint();
        DW.img_resize.init(this.obj.find('.post_area'), 560, false);
		//prettyPrint()再次调用 修正其解析出错情况
        var k,index,old_code,reg_li,li_length,total = parseInt($(".prettyprint").length);
				var reg = /(<ol\s*class="linenums">)<li\s*class="L0">(<ol\s*class="linenums">)([\s\S]+)(<\/ol>)<\/li><\/ol>/i;
				for(k=0;k<total;k++){
						var html = $.trim($(".prettyprint").eq(k).html());
						if(reg.test(html)){
								index = 0;
								old_code = '<ol class="linenums">';
								var s_arr = [];
								var tmp_arr = reg.exec(html);
								reg_li = /(<li\s*class="L\d+">.*?<\/li>)/i;
								var t_arr = (tmp_arr[3]).split(reg_li);
								for(var i in t_arr){
										if($.trim(t_arr[i]) != ''){
												s_arr[index] = t_arr[i];
												++index;
										}
								}
								old_code += s_arr[0];
								//alert(old_code);
								li_length = s_arr.length;
								if(li_length > 2){
									for(j=1;j<li_length;j++){
										if(j%2 == 0)
							  			old_code += s_arr[j];
									}
								}
						old_code += "</ol>";
						$(".prettyprint").eq(k).html(old_code);

					}
					$(".prettyprint").eq(k).attr("index",k);
                    $(".prettyprint").eq(k).closest('.code_block').children(".copy_code").attr("id","copy_code_"+k);
                    $(".prettyprint").eq(k).closest('.code_block').attr('id','code_block_'+k);
					//释放空间
					delete(s_arr);
					delete(tmp_arr);
					delete(t_arr);
			}
		answer.editcode();
		answer.copycode();

    },

    getFormData : function(type)
    {
        var self = this;
        var data = [];
        if(type == 3)
        {
            data['title'] = $.trim( this.container.find("input[name='title']").val() );
            data['topic_bak'] = $.trim(this.container.find("#tid_edit_bak").val());
            //data['topic'] = $.trim( this.container.find("input[name='topic']").val() );
            data['topic'] = $.trim(self.editor_suggest_topic.topics.join(','));
            data['suggest_topic'] = $.trim(self.editor_suggest_topic.suggest_topics.join(','));
            data['content'] = this.container.find("textarea[name='content']").val().replace(/(\s*$)/g,"");
            data['summary'] = $.trim( this.container.find("input[name='summary']").val() );
            data['summary'] = data['summary'];
        }
        else
        {
            data['content'] = this.container.find("textarea[name='content']").val().replace(/(\s*$)/g,"");
            data['summary'] = $.trim( this.container.find("input[name='summary']").val() );
            data['summary'] = data['summary'];
            if (this.container.find('input[name="cw_mode"]').length) {
                data['cw_mode'] = this.container.find('input[name="cw_mode"]:checked').length > 0 ? 1 : 0;
            }
        }

        return data;
    },

    checkForm : function(data, type)
    {
        var res = false;
        try
        {
            if(type == 3)
            {
                if(data['title'].length < 5 || data['title'].length > 100)
                {
                    throw new Error('问题标题不能少于5个字，不大于100个字');
                }
                if(data['topic'] != '')
                {
                    var topics_arr = data['topic'].split(',');
                    var topics_bak = data['topic_bak'].split(',');
                    var diff = array_diff(topics_bak, topics_arr);
                    if(diff.length) {
                        var upoints = parseInt(DW.global.upoints);
                        if($.trim(DW.global.ulabel) == '' && upoints < 2000 && topics_arr.length > 2 ) {
                            throw new Error('您的声誉值不足2000分, 最多只可添加2个话题。');
                        }
                        if( topics_arr.length > 5 ) {
                            throw new Error('为问题分类, 以便用户找到, 不超过5个话题');
                        }
                    }
                }
                else
                {
                    throw new Error('话题不能为空');
                }

                if(data['content'].length > 20000)
                {
                     throw new Error('问题描述不能大于20000个字');
                }
            }
            else
            {
                if(data['content'].length < 10 || data['content'].length > 20000)
                {
                     throw new Error('答案不能少于10个或多于20000个字');
                }
            }

            //diff content
            var content_new = data['content'];
            var content_old = this.container.find("div[id=rev_content]").html();
            var dmp = new diff_match_patch();
            dmp.Diff_Timeout = 1.0;
            var diff = dmp.diff_main(content_old,content_new);
            //clean up result
            dmp.diff_cleanupSemantic(diff);
            var ldc = dmp.diff_levenshtein(diff);
            if(this.container.find("input[name='title_old']").length > 0) {
                //diff title
                var diff = null;
                var title_new = data['title'];
                var title_old = this.container.find("input[name='title_old']").val();
                var diff = dmp.diff_main(title_old,title_new);
                dmp.diff_cleanupSemantic(diff);
                var ldt = dmp.diff_levenshtein(diff);
            } else {
                var ldt = 0;
            }
            this.diff_len = ldc + ldt;
            if(!this.is_direct_edit && (ldc + ldt) < 6) {
                throw new Error('每次编辑不得少于6个字');
            }

            if(!this.is_direct_edit)
            {
                if(DW.global.upoints < 2000 && (data['summary'].length < 6 || data['summary'].length > 100))
                {
                    throw new Error('摘要内容不得不少于6个字, 不多于100个字。');
                }
            }
        } catch(e) {
            res = e.message;
        }
        return res;
    },

    show_error : function(err)
    {
        this.container.find('.fstate').hide().text(err).fadeIn();
    },

    submitPost : function(btn)
    {
        var self = this;
        var obj_type = this.obj_type;
        var _this_btn = btn;
        if(this.form_submit)
        {
            return false;
        }
        this.is_direct_edit = parseInt(_this_btn.attr('rel'));
        var postData = this.getFormData( obj_type );
        var err = this.checkForm(postData, obj_type);
        if( err !== false )
        {
            this.show_error(err);
            return false;
        }

        var i = 0, data=[];
        postData['ajax'] = 1;
        postData['id'] = this.obj_id;
        postData['improve'] = this.is_improve;
        postData['diff_len'] = this.diff_len;
        for(var key in postData)
        {
            data[i] = key +'='+ encodeURIComponent( postData[key] );
            i++;
        }
        this._ajax = $.ajax({
            type: "POST",
            url: obj_type == 3 ? "/question/edit" : '/answer/edit',
            data: data.join('&'),
            dataType: "json",
            beforeSend: function(){
                self.form_submit = true;
                self.posting = $('<img src="/theme/images/loading.gif" />').insertAfter(_this_btn);
            },
            complete: function(){
                self.form_submit = false;
                self.posting.remove();
            },
            success: function(msg){
                var succ = parseInt( msg.success );
                if(succ > 0)
                {
                    self.finishEdit(succ, msg.data);
                }
                else
                {
                    self.show_error(msg.message);
                }
            }
        });
    },

    initEvent : function()
    {
        var self = this;
        this.container.find('.submit').click(function(){
            var submit = $(this);
            self.submitPost(submit);
        });
        this.container.find('.cancel').click(function(){
            var cancel = $(this);
            self.cancelPost(cancel);
        });
        this.container.find('.prev_btn').click(function(){
            //self.container.find('.wmd-preview').toggle();
        });
        this.container.find('.prev_btn').toggle(
            function(){
                $(this).text('收起');
                self.container.find('.wmd-preview').show();
            },
            function(){
                $(this).text('预览');
                self.container.find('.wmd-preview').hide();
            }
        );
    },

    initEditor : function()
    {
        var t = +new Date().getTime(), input = 'wmd-input'+t, button_bar = 'wmd-button-bar'+t, preview = 'wmd-preview'+t;
        this.container.find('.wmd-input').attr('id', input);
        this.container.find('.wmd-button-bar').attr('id', button_bar);
        this.container.find('.wmd-preview').attr('id', preview);

        setup_wmd({input: input, button_bar: button_bar, preview: preview});
    },

    topicSuggest : function()
    {
        var self = this;
        //setup_suggest({id:'qst_edit_topic',filter:'2',func:'addtopic',link:false, state:false});
        //search topic
        //DW.editor_suggest_topic.init('editor_search_topics','editor_select_topics');
         self.editor_suggest_topic = new EditorSuggestTopic({id:'edit_search_topics',pid:'edit_select_topics',control:'edit_topic_arrow',fid:'edit_select_topic',add_topic:'edit_add_topic',cancel_topic:'edit_cancel_topic',tname:'edit_suggest_topic_name',tdesc:'edit_suggest_topic_desc',goon:'edit_goon',width:self.topic_input_width});
        //show all topic or search topic
        $('#edit_topic_arrow').unbind('click').click(function() {
        	var $this = $(this);
            var q = $.trim($('#edit_search_topics').val());
            q = q.replace(/([\+\.\*\\\/\?\[\]\(\)\^\$]+?)/g,'\\$1');
            if(q == '为问题分类, 以便用户找到, 不超过5个话题。') {
                q = '';
            }
            if (q == '') {
                $this.attr('title','浏览全部话题');
            } else {
                $this.attr('title','查看当前匹配话题');
            }
            self.editor_suggest_topic.get_all_topics($this,'all',q);
        });
    },

    queryData : function(postData)
    {
        var self = this;
        var data = [];
        var i = 0;
        for(var key in postData)
        {
            data[i] = key +'='+ postData[key];
            i++;
        }
        this._ajax = $.ajax({
           type: "POST",
           url: '/ajax/get_qa_data',
           data: data.join('&'),
           dataType: "json",
           beforeSend: function(){
               self.addLoading();
               self.container.setTemplateURL('/theme/js/' + self.tpl, null, {filter_data: false});
           },
           complete: function(){
               self.remLoading();
           },
           success: function(msg){
               if(msg.succ == 1)
               {
                    self.obj.hide();
                    self.container.processTemplate(msg);
                    self.initEditor();
                    if(self.obj_type == 3)
                    {
                        self.topicSuggest();
                    }
                    self.initEvent();
                    var top = self.container.offset().top - 30;
                    $("html,body").animate({scrollTop: top}, 700);
               }
               else
               {
                   DW.util.msg(msg.msg);

               }
           }
        });
    },

    startEdit : function(ele)
    {
        if(DW.global.is_active == '0') {
            DW.util.error_msg(ele,'您的账号未激活，暂不能完善问答。');
            return false;
        }

        //检测是否禁闭，限制发布问题
        if(DW.global.prison == '1' || DW.global.prison == '2' || DW.global.prison == '4') {
            DW.util.error_msg(ele,'您的账号当前被关禁闭，期间不能完善问答。');
            return false;
        }
        this._this = ele;
        this.obj_id = this._this.attr('rel');
        this.topic_input_width = this._this.attr('params');
        if(this._this.hasClass('edit_q'))
        {
            this.obj_type = 3;
            this.obj = this._this.parents('#edit1');
            this.tpl = 'qst_edit_tpl';
        }
        else if(this._this.hasClass('edit_a'))
        {
            this.obj_type = 4;
            this.obj = $('#ans'+this.obj_id);
            this.tpl = 'ans_edit_tpl';
        }
        else if(this._this.hasClass('unsolved_q'))
        {
            this.obj_type = 3;
            this.obj = $('#edit1');
            this.tpl = 'qst_edit_tpl';
            this.is_improve = 1;
        }
        else if(this._this.hasClass('unsolved_a'))
        {
            this.obj_type = 4;
            this.obj = $('#ans'+this.obj_id);
            this.tpl = 'ans_edit_tpl';
            this.is_improve = 1;
        }
        else
        {
            return false;
        }

        //避免多次请求
        if(this.obj.next('.editArea').length)
        {
            return false;
        }
        //不能同时存在多个编辑区域
        if($('.editArea').length) {
            return false;
        }
        this.container = $('<div class="editArea"></div>').insertAfter(this.obj);
        this.flag = true;
        var postData = [];
        postData['type'] = this.obj_type;
        postData['id'] = this.obj_id;
        postData['ajax'] = 1;
        postData['improve'] = this.is_improve;
        this.queryData(postData);

    }
};

/*编辑问答*/
var mClick2 = function()
{
    new EditManager($(this));
}
$(function(){
    $('.edit_q, .edit_a').bind('click', mClick2);
});

/**
 * 用户头像上传func
 * 2011-7-28
 */
DW.avatar = (function($){
	var timer, upload_area;
    var init = function(id) {
        if(!DW.global.uid) {
            return;
        }
        $(id).unbind('mouseover mouseleave').mouseover(function(){
            upload_area = $(this).find('.upload_image');
            clearTimeout(timer);
            timer = setTimeout(function(){
                upload_area.fadeIn('fast').animate({right: '0px'}, 170, 'linear');
            }, 100);
        }).mouseleave(function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                upload_area.animate({right: '-95px'}, 200, 'linear').fadeOut('fast');
            }, 300);
        });
    }
    return {init:init}
})($);

/**
 * topic关注按钮的效果变化
 */
$(function(){
    $('#follow_topic').unbind('mouseover').mouseover(function(){
        var action = $(this).hasClass('unfollow');
        if (action) {
            $(this).html('取消关注');
        }
    });

    $('#follow_topic').unbind('mouseout').mouseout(function(){
        var action = $(this).hasClass('unfollow');
        if (action) {
            $(this).html('关注中');
        }
    });
})

/**
 * 新鲜事
 */
DW.feed = (function($){

    var timer, timer_arr, query=true, feed_interval = 30000;

    function load_feed_num()
    {
        feed_interval = 30000;
        var data = 'ajax=1', is_in_best = false;
        var url = "/ajax/check_new_feed";
        if ($('#questions_area').hasClass('flag_show_new_qa')) {
            data += '&inbox_type=inner&btn_type=new_qa';
        } else if($('#questions_area').hasClass('flag_show_latest')) {
            data += '&inbox_type=outer&btn_type=latest';
        } else if($('#questions_area').hasClass('flag_show_all')) {
            data += '&inbox_type=inner&btn_type=all';
        } else if($('#questions_area').hasClass('flag_show_best')) {
            data += '&inbox_type=outer&btn_type=best';
            //最佳检测最新改为5分钟
            feed_interval = 300000;
            is_in_best = true;
        }


        $.ajax({
            type: "POST",
            url: url,
            data: data,
            beforeSend: function(XMLHttpRequest){ },
            success: function(msg) {
                var result = $.parseJSON( msg );
                if(result.msg === '您尚未登录')
            {
                query = false;
            }

                if (result.msg > 0) {
                    query = false;
                //clear_title_blur(timer_arr);
                //timer_arr = blur_title('未读新鲜事');
                    if (is_in_best) {
                        $('#lead_to_outer_latest').show();
                        $('#new_feed').hide();
                        $('#lead_to_outer').hide();
                    } else {
                        $('#feed_num').html(result.num);
                $('#new_feed').show();
                        $('#lead_to_outer').hide();
                        $('#lead_to_outer_latest').hide();
            }
                } else if(result.msg == -1) {
                    $('#outer_feed_num').html(result.num);
                    $('#lead_to_outer').show();
                    $('#lead_to_outer_latest').hide();
                    $('#new_feed').hide();
                    $('#no_feeds_notify').hide();
                } else if(result.msg == -2) {
                    $('#outer_feed_num_at_best').html(result.num);
                    $('#lead_to_outer_latest').show();
                    $('#new_feed').hide();
                    $('#lead_to_outer').hide();
                }
            }
        });

        if(query)
        {
            setTimeout(function(){
                DW.feed.load_feed_num();
            }, feed_interval);
        }
    }

    function clear() {
        query = true;
    }

    function show_new_feed()
    {
        var rel = $('.itemtop').first().attr('rel');
        if (rel == undefined) {
            rel = $('.itembottom').first().attr('rel');
            if (rel == undefined) {
                rel = 0;
            }
        }
        var data = 'curr_id='+rel+'&ajax=1';

        if ($('#questions_area').hasClass('flag_show_new_qa')) {
            data += '&is_filter=1&inbox_type=inner';
        } else if($('#questions_area').hasClass('flag_show_latest')) {
            data += '&inbox_type=outer';
        } else if($('#questions_area').hasClass('flag_show_all')) {
            data += '&inbox_type=inner';
        }

        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: "POST",
                url: "/ajax/get_new_feed",
                data: data,
                beforeSend: function(XMLHttpRequest){
                    $('#feed_loading').show();
                },
                success: function(msg) {
                    if (msg != 0) {
                        $('#feed_top1').prepend(msg);
                        DW.vote.init('.voting');
                        DW.follow.user('.u_follow');
                        DW.follow.question('.q_follow');
                        DW.follow.topic('.t_follow');
                        DW.tip_layer.init_user('.u_layer');
                        DW.tip_layer.init_topic('.t_layer');
                        DW.view_full_content.init();
                        DW.show_feed_option.init();
                    }
                    $('#feed_loading').hide();
                }
            });
        }, 200);

    }

    //首页我的新鲜事和社区新鲜事数据获取
    function show_feeds(type)
    {
        var url;
        if (type == 'my_feed') {
            url = "/ajax/show_my_feeds";
        } else {
            url = "/ajax/show_community_feeds";
        }

        var data = 'ajax=1';

        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                beforeSend: function(XMLHttpRequest){
                    $('#feed_switch_loading').show();
                },
                success: function(msg) {
                    if (msg) {
                        var s = $(msg);
                        //s.hide();

                        //替换旧的新鲜事数据
                        $('#tab_index_feed').html(s);
                        /*
                        s.animate({
                           opacity: 'show'
                         }, {duration: 500});
                        */
                        DW.vote.init('.voting');
                        DW.follow.user('.u_follow');
                        DW.follow.question('.q_follow');
                        DW.follow.topic('.t_follow');
                        DW.tip_layer.init_user('.u_layer');
                        DW.tip_layer.init_topic('.t_layer');

                        DW.feed.init();
                        DW.show_more_feeds.init('questions_area', 'show_questions');
                        DW.show_filter_feeds.init();
                        DW.view_full_content.init();
                        DW.show_feed_option.init();
                    }
                    $('#feed_switch_loading').hide();
                }
            });
        }, 200);

    }

    function init()
    {
        if(!$('#questions_area').hasClass('flag_show_community')) {
            clear();
            setTimeout(function(){
        load_feed_num();
            }, feed_interval);
        } else {
            query = false;
        }

        //点击未读新鲜事
        $('#new_feed').unbind('click').click(function() {
            query = true;
            $(this).hide();
            show_new_feed();

            //清除闪烁
            //clear_title_blur(timer_arr);

            //继续请求
            setTimeout(function(){
                DW.feed.load_feed_num();
            }, feed_interval);
        });

        //点击圈外feed引导
        $('.goto_outer').unbind('click').click(function() {
            query = true;
            $(this).hide();

            //更改属性
            $('#outer_btn').removeClass('feed_uncheck').addClass('feed_active');
            $('#inner_btn').removeClass('feed_active').addClass('feed_uncheck');
            $(".circle_in").hide();
            $(".circle_out").show();
            //更换样式
            $('#show_latest').removeClass('btn_uncheck').addClass('btn_active');
            $('#show_best').removeClass('btn_active').addClass('btn_uncheck');
            //永远显示最新
            DW.show_filter_feeds.get_feeds(-99, 'outer', 'latest');

        });

        //点击我的新鲜事
        $('#my_feed').unbind('click').click(function() {
            //if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $('#community_feed').removeClass('active');
                Cookies.set(cookie_prefix('home_tab'), '#tab_index_feed');
                show_feeds('my_feed');
            //}
        });

        //点击社区新鲜事
        $('#community_feed').unbind('click').click(function() {
            //if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $('#my_feed').removeClass('active');
                Cookies.set(cookie_prefix('home_tab'), '#active');
                show_feeds('community_feed');
            //}
        });

    }

    return {
        init:init,
        clear:clear,
        load_feed_num:load_feed_num
    }

})($);

/**
 * 标题闪烁
 */
function blur_title(text) {
    var step=0, _title = document.title;

   var timer = setInterval(function() {
       step++;
        if (step==3) {step=1};
        if (step==1) {document.title='【　　　　　】-德问'};
        if (step==2) {document.title='【'+text+'】-德问'};
    }, 1000);

    return [timer, _title];
}

/**
 * 清除标题闪烁
 */
function clear_title_blur(timer_arr) {
   if(timer_arr) {
        clearInterval(timer_arr[0]);
        document.title = timer_arr[1];
    }
}

/**
 * 设置博客文章已读
 */
DW.read_blog = (function($){
    function init() {
        $('.read_blog').unbind('click').click(function(){
            var blog_id = $(this).attr('rel');

            $.ajax({
                type: "POST",
                url: "/ajax/read_blog",
                data: "blog_id="+blog_id+"&ajax=1",
                success: function(msg){
                    var result = $.parseJSON( msg );
                    if (result.success == 1) {
                        //如果是最后一个li结点
                        if ( $('#scrollDiv > ul > li').first().attr('rel') == $('#scrollDiv > ul > li').last().attr('rel') ) {
                            $('#scrollDiv').remove();
                        } else {
                            $('#blog_'+blog_id).remove();
                        }
                    } else {
                        alert( result.message );
                    }
                }
            });
        });
    }

    return {
        init:init
    }

})($);

/**
 * 查看全文
 */
DW.view_full_content = (function($) {
    var timer;

    function show_ans(qid) {

        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: '/ajax/show_answers',
                data: "qid="+qid+"&ajax=1",
                beforeSend:function(XMLHttpRequest){ },
                success: function(msg){
                    if(msg)
                    {
                        $('#show_ans_'+qid).after(msg);
                    }
                }
            });
        }, 200);
    }

    function init() {
        $('.view_full').unbind('click').click(function(){
            var key = $(this).attr('rel');
            $('#simple_'+key).hide();
            $('#full_'+key).show();
        });

        $('.view_simple').unbind('click').click(function(){
            var key = $(this).attr('rel');
            $('#full_'+key).hide();
            $('#simple_'+key).show();
        });

        //查看关注问题的用户列表
        $('.view_qst_follow').unbind('mouseover').mouseover(function(){
            var key = $(this).attr('rel');
            clearTimeout(timer);
            timer = setTimeout(function(){
                $('#follow_up_qst_'+key).show(0, function(){
                    //隐藏关注问题的用户列表
                    $('#feed_title_area_'+key).unbind('mouseleave').mouseleave(function(){
                        var key = $(this).find('.view_qst_follow').attr('rel');
                        $('#follow_up_qst_'+key).hide();
                    });
                });
            }, 500);
        });

        $('.view_qst_follow').unbind('mouseout').mouseout(function(){
           clearTimeout(timer);
        });

        //查看赞同答案的用户列表
        $('.view_ans_up').unbind('mouseover').mouseover(function(){
            var key = $(this).attr('rel');
            clearTimeout(timer);
            timer = setTimeout(function(){
                $('#up_ans_users_'+key).show(0, function() {
                    //隐藏赞同答案的用户列表
                    $('#feed_title_area_'+key).unbind('mouseleave').mouseleave(function(){
                        var key = $(this).find('.view_ans_up').attr('rel');
                        $('#up_ans_users_'+key).hide();
                    });
                });
            }, 500);
        });

        $('.view_ans_up').unbind('mouseout').mouseout(function(){
           clearTimeout(timer);
        });

        //显示答案列表
        $(".show_ans_btn").unbind('click').click(function() {
            var qid = $(this).attr('rel');
            if ($(this).hasClass('show_ans_btn')) {
                show_ans(qid);
                $(this).removeClass('show_ans_btn').addClass('hide_ans_btn');
            } else {
                $(this).removeClass('hide_ans_btn').addClass('show_ans_btn');
                $('#ans_list_'+qid).remove();
            }
        });

//        var last_node = $('div').children('p').last();
//        last_node.append(str);
    }

    return {
        init:init
    }
})($);

//建议话题
var EditorSuggestTopic = function(options) {
    this.all_topics = null;
    this.topics = [];
    this.suggest_topics = [];
    this.suggest_topic_titles = [];
    this.input = 'search_related_topics';
    this.select_topic = 'select_related_topics';
	this.control = 'topic_arrow';
	this.filter = 'select_topic';
	this.show_add_topic = true;
	this.add_topic = 'new_topic';
	this.cancel_topic = 'cancel_topic';
	this.suggest_topic_title = 'suggest_topic_name';
	this.suggest_topic_desc = 'suggest_topic_desc';
	this.goon = 'goon';
	this.width = 500;

    this.KEY = {
		LEFT: 37,
        UP: 38,
        RIGHT: 39,
		DOWN: 40,
		DEL: 46,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		COMMA: 188,
		PAGEUP: 33,
		PAGEDOWN: 34,
		BACKSPACE: 8
	};
	this.init(options);
}

EditorSuggestTopic.prototype = {

    init : function(options)
    {
        var self = this;
        options = options || {};
        self.control = options.control || self.control;
        self.filter = options.fid || self.filter;
        self.add_topic = options.add_topic || self.add_topic;
        self.cancel_topic = options.cancel_topic || self.cancel_topic;
        self.input = options.id || self.input;
        self.select_topic = options.pid || self.select_topic;
        self.suggest_topic_title = options.tname || self.suggest_topic_title;
        self.suggest_topic_desc = options.tdesc || self.suggest_topic_desc;
        self.goon = options.goon || self.goon;
        self.timer = null;
        self.show_add_topic = (options.show_add_topic != undefined)?options.show_add_topic:self.show_add_topic;
        self.width = options.width || self.width;

        var input = $('#' + self.input);
        var select_topic = $('#' + self.select_topic);

        //初始化话题
        if(select_topic.find('i').length) {
            select_topic.find('i').each(function(){
                self.topics.push($(this).parent('a').attr('id'));
            })
            self.remove_topic();
            self.repair_width();
        }

        input.focus(function(){
            input.css({"color":"#333"});
        	if($.trim(input.val()) == '为问题分类, 以便用户找到, 不超过5个话题。' || $.trim(input.val()) == '为问题分类, 以便用户找到, 不超过2个话题。') {
        		input.val('');
        	}
        });

        input.blur(function(){
            input.css({"color":"#D5D5D5"});
            if($.trim($(this).val()) == '' && $(this).prev('a').length == 0) {
                var _parent = $(this).closest("div");
                if( _parent.find("a").length ) {
                    return false;
                }
        	    //$(this).val('为问题分类, 以便用户找到, 不超过5个话题。');
       		}
        });

        input.unbind('keyup').bind('keyup',function(e){
            if(e.keyCode == self.KEY.UP || e.keyCode == self.KEY.DOWN
               || e.keyCode == self.KEY.LEFT || e.keyCode == self.KEY.RIGHT
               || e.keyCode == self.KEY.RETURN) {
                   return false;
            }
            var q = $.trim($(this).val());
            q = q.replace(/([\+\.\*\\\/\?\[\]\(\)\^\$]+?)/g,'\\$1');
            if(q == ''){
                $('#'+self.control).removeClass().addClass("topic_arrow").attr('title','浏览全部话题');
    			if($('#'+self.filter).length >0 ){
    			    $('#'+self.filter).remove();
    			}
            } else {
                $('#'+self.control).attr('查看当前匹配话题');
                self.get_all_topics($('#'+self.control),'search',q);
            }
        });

        input.bind("paste", function(e){
            var el = $(this);
            clearTimeout(self.timer);
            self.timer = setTimeout(function(){
                var q = $.trim(el.val());
                q = q.replace(/([\+\.\*\\\/\?\[\]\(\)\^\$]+?)/g,'\\$1');
                self.get_all_topics($('#'+self.control),'search',q);
            }, 100);
        });

        input.unbind('keypress keydown').bind($.browser.opera ? "keypress" : "keydown", function(event){
            var keyCode = event.keyCode;
            switch (keyCode) {
                case self.KEY.BACKSPACE:
                    var _this = $(this);
                    var _parent = _this.closest("div");
                    var lastVisibleTopic = _parent.find("a:visible").last();
                    if($(this).val() == '' && lastVisibleTopic.length) {
                        lastVisibleTopic.hide();
                        self.topics = [];
                        _parent.find("a:visible").each(function(){
                            self.topics.push($(this).attr("id"));
                        });
                        self.repair_width();
                    }
                    break;
                case self.KEY.ESC:
                    var _this = $(this);
                    var _parent = _this.closest("div");
                    _this.val("");

                    var tmp_arr = [];

                    var first_hidden = _parent.find("a:hidden").first();
                    _parent.find("a:visible").each(function(){
                        var id = $(this).attr("id");
                        tmp_arr.push(id);
                        //self.topics.push( id );
                    });

                    if(!_parent.find("a:hidden").length) {
                        return false;
                    }

                    var first_hidden_id = first_hidden.attr("id");
                    if( $.inArray(first_hidden_id, tmp_arr) == -1) {
                        first_hidden.fadeIn();
                        tmp_arr.push( first_hidden.attr("id") );
                    } else {
                        first_hidden.remove();
                    }
                    self.topics = tmp_arr;
                    self.repair_width();
                    break;
                case self.KEY.UP:
                    if($('#'+self.select_topic+' .listcnt').find('.on').length) {
                        var obj = $('#'+self.select_topic+' .listcnt').find('.on');
                        var prev = obj.prev();
                        if(prev.length){
                            obj.removeClass('on');
                            prev.addClass('on');
                        }
                    } else {
                        var prev = $('#'+self.select_topic+' .listcnt').find('p').first();
                        prev.addClass('on');
                    }
                    if(prev.length < 1) {
                        return false;
                    }
                    //元素的位置
                    var pos = prev.position();
                    //元素的高度
                    var eh = prev.height();
                    //div的高度
                    var h = $('#'+self.select_topic+' .topic_value').height();
                    if(h < 30) {
                        h = 30;
                    }
                    //div的滚动条距离顶部的高度
                    var st = $('#'+self.select_topic+' .topic_value').scrollTop();
                    if(pos.top + st > h){
                        $('#'+self.select_topic+' .topic_value').scrollTop(st+pos.top+eh-h);
                    } else {
                        $('#'+self.select_topic+' .topic_value').scrollTop(0);
                    }
                    break;
                case self.KEY.DOWN:
                    if($('#'+self.select_topic+' .listcnt').find('.on').length) {
                        var obj = $('#'+self.select_topic+' .listcnt').find('.on');
                        var next = obj.next();
                        if(next.length) {
                            obj.removeClass('on');
                            next.addClass('on');
                        }
                    } else {
                        var next = $('#'+self.select_topic+' .listcnt').find('p').first();
                        next.addClass('on');
                    }
                    if(next.length < 1) {
                        return false;
                    }
                    //元素的位置
                    var pos = next.position();
                    //元素的高度
                    var eh = next.height();
                    //div的高度
                    var h = $('#'+self.select_topic+' .topic_value').height();
                    if(h < 30) {
                        h = 30;
                    }
                    //div的滚动条距离顶部的高度
                    var st = $('#'+self.select_topic+' .topic_value').scrollTop();
                    if(pos.top + st > h){
                        $('#'+self.select_topic+' .topic_value').scrollTop(st+pos.top+eh-h);
                    }
                    break;
                case self.KEY.RETURN:
                    var obj = $('#'+self.select_topic+' .listcnt').find('.on').children('a');
                    if (obj.length) {
                        self.choose_topic(obj);
                    }
                    self.repair_width();
                    event.preventDefault();
                    break;
            }
        });
    },

    get_all_topics : function(obj, t ,q) {
        var self = this;
        //获取所有话题
    	$.ajax({
    	     type:'get',
    	     beforeSend:function(){
    	         if(self.all_topics != null) {
    	             if(obj.attr('class')=="topic_arrow" || t == 'search') {obj.removeClass().addClass("topic_arrow_up").attr('title','收起');
            			 if($('#'+self.filter).length >0 ){
            			     $('#'+self.filter).remove();
            			 }
            			 if(q != '') {
            			     t = 'search';
            			 }
            			 var topics_html = self.gen_topic_html(self.all_topics,t,q);
            			 self.topic_init(obj,topics_html);
            			 self.topic_tab();
            			 self.suggest_topic();
            			 $('#'+self.select_topic+' .listcnt').find('a').unbind('click').bind('click',function(){
            			     self.choose_topic($(this));
            			 });
            			 if($('#'+self.filter).find('span.back_all_topics').length) {
                             $('#'+self.filter).find('span.back_all_topics').unbind('click').bind('click',function(){
                                 $('#'+self.input).val('').focus();
                                 obj.removeClass().addClass("topic_arrow");
                                 self.get_all_topics(obj,'all','');
                             });
            			 }
            		 } else {
            		     obj.removeClass().addClass("topic_arrow");
            			 if($('#'+self.filter).length >0 ){
            			     $('#'+self.filter).remove();
            			 }
            		 }
    	             return false;
    	         } else {
                     obj.removeClass().addClass('topic_loading');
    	         }
    	     },
    	     data:'r='+Math.random(),
    	     url:'/ajax/get_all_topics',
    	     success:function(data){
    	         var res = $.parseJSON(data);
    	         self.all_topics = res;
    	         var topics_html = self.gen_topic_html(res,t,q);
    	         obj.removeClass().addClass("topic_arrow_up").attr('title','收起');
    			 self.topic_init(obj,topics_html);
    			 self.topic_tab();
    			 self.suggest_topic();
    			 $('#'+self.select_topic+' .listcnt').find('a').unbind('click').bind('click',function(){
    			     self.choose_topic($(this));
    			 });
    			 if($('#'+self.filter).find('span.back_all_topics').length) {
                     $('#'+self.filter).find('span.back_all_topics').unbind('click').bind('click',function(){
                         $('#'+self.input).val('').focus();
                         obj.removeClass().addClass("topic_arrow");
                         self.get_all_topics(obj,'all','');
                     });
    			 }
    	     }
    	 });
    },

    //生成话题html
    gen_topic_html : function(obj,type,q){
        if(obj.length == 0) {
            return false;
        }
        if(q == '') {
            type = 'all';
        }
        if(type == 'all') {
            var title = '<dl class="list">';
            var list = '<div class="list_all">';
            var i=0;
            for(var category in obj) {
                if(i == 0) {
                    title += '<dd><span class="f active">'+category+'</span></dd>';
                    list += '<div class="listcnt dis_blo">';
                } else {
                    title += '<dd><span class="f">'+category+'</span></dd>';
                    list += '<div class="listcnt">';
                }
                for(var tid in obj[category]) {
                    list += '<p><a href="javascript:void(0);" id="'+tid+'">'+obj[category][tid].split('|')[0]+'</a></p>';
                }
                list += '</div>'
                i++;
            }
            title += '</dl>';
            list += '</div>';
            return title + list;
        } else if(type == 'search') {
            var reg = new RegExp("^" + q.split(/\s+/).join('.*?') + ".*?","i");
            var list = '<div class="listcnt">';
            var i = 0;
            for(var category in obj) {
                for(var tid in obj[category]) {
                    if(obj[category][tid].indexOf('|') > -1) {
                        var t_detail = obj[category][tid].split('|');
                        var title = t_detail[0];
                    } else {
                        var title = obj[category][tid];
                        var t_detail = '';
                    }
                    if(reg.test(title) || (t_detail != '' && (t_detail[1].indexOf(q) === 0 || t_detail[2].indexOf(q) === 0))) {
                        if(i == 0) {
                            list += '<p class="on">';
                        } else {
                            list += '<p>';
                        }
                        list += '<a href="javascript:void(0);" id="'+tid+'">'+title+'</a></p>';
                        i++;
                    }
                }
            }
            if(i == 0) {
                list += '没有匹配到合适话题，建议<span class="back_all_topics" style="margin-left:0px;">浏览全部话题</span>';
                list += '</div>';
            } else {
                list += '</div>';
                list = '<span class="back_all_topics">全部话题</span> &gt; <span class="search_words">' + q + '</span>' + list;
            }
            return list;
        }
    },

    //话题初始化
    topic_init : function(obj,content){
        var self = this;
        if($('#'+self.filter).length) {
            $('#'+self.filter).remove();
        }
        var html = '<div id="'+self.filter+'" class="sel_topic">'+
             '<span class="input_arrow">^</span>'+
			 '<div class="topic_value">'+content+'</div>';
		if (self.show_add_topic) {
		   html +=	'<div class="add_new_topic">'+
        					'<div class="title"><span id="'+self.add_topic+'" style="cursor:pointer;">建议新话题</span></div>'+
        					'<div class="suggest_topic" style="display:none;"><div class="sucsubmit">新话题成功提交，审核通过后方可生效。 <br><span id="'+self.goon+'" style="cursor:pointer;">继续建议新话题</span></div></div>'+
        					'<div class="cnt">'+
        						'<dl>'+
        						'<dd class="t">话题名称：</dd>'+
        						'<dd class="f"><input type="text" class="txt" id="'+self.suggest_topic_title+'"></dd>'+
        						'<dd class="t">话题介绍（可选）：</dd>'+
        						'<dd class="f"><textarea class="txtarea" id="'+self.suggest_topic_desc+'"></textarea></dd>'+
        						'<dd class="b"><input type="button" value="添加" class="sub" style="cursor:pointer;"><a href="javascript:void(0)" class="topic_cancel" id="'+self.cancel_topic+'">取消</a></dd>'+
        						'</dl>'+
        					'</div>'+
        				'</div>';
		}

	    html += '</div>';
        obj.after(html);
        $('#'+self.select_topic+' .topic_value').scrollTop(0);
        $('#'+self.select_topic+' .listcnt').find('p').each(function(){
           $(this).unbind('moveover mouseout').bind('mouseover',function(){
               $('#'+self.select_topic+' .listcnt').find('.on').removeClass('on');
               $(this).addClass('on');
           }).bind('mouseout',function(){
               $(this).removeClass('on');
           });
        });
        var aw = 10;
        if($('#'+self.select_topic).find('a.addt').length > 0) {
           $('#'+self.select_topic).find('a.addt').each(function(){
              aw += $(this).width()+13;
           });
        }
       //$('#'+self.filter).find('.input_arrow').css({marginLeft:aw+'px'});
        $('#'+self.filter).find('.input_arrow').css({position:"absolute", left:aw+'px'});
        //话题suggest
        setup_suggest({id:self.suggest_topic_title,filter:'2',func:function(){},link:false, state:false, rs:false, extension:{display_callback:show_possible_repeat_topic}});
    },

    //标签切换
    topic_tab : function() {
    	var self = this;
        $('#'+self.select_topic+' .topic_value .list span').each(function(i){
		     var $this=$(this);
			 var $parent=$this.parent().parent();
			 var $next=$parent.next();
		     $this.unbind('click').bind('click',function(){
			      $parent.find('.f').removeClass('active');
			      if(!$this.hasClass('active')){$this.addClass('active')};
				  $next.find('.listcnt').removeClass('dis_blo');
				  $next.find('.listcnt').slice(i,i+1).addClass('dis_blo');
		     });
    	 });
    },

    //绑定建议话题
    suggest_topic : function(){
        var self = this;
        $('#'+self.add_topic+',#'+self.cancel_topic).unbind('click').bind('click',function(){
            $(".postErr").remove();
            $('#'+self.select_topic+' .add_new_topic .cnt').animate({height:'toggle'},'fast','swing',function(){
                $('#'+self.select_topic).find('.title').toggleClass('addt_hide');
            });

            $('#'+self.select_topic+' .suggest_topic').hide();
            $('#'+self.suggest_topic_title).val('');
            $('#'+self.suggest_topic_desc).val('');
        });
        $('#'+self.select_topic+' .sub').unbind('click').bind('click',function() {
            var title = $.trim($('#'+self.suggest_topic_title).val());
            var descr = $('#'+self.suggest_topic_desc).val();
            var is_exist = false;
            $(".postErr").remove();
            if(title == '') {
                $('#'+self.suggest_topic_title).after('<span style="font-size:11px;color:#C6401B;margin-left:2px;" class="postErr">话题名称不能为空</span>');
                return false;
            }
            //check topic exist
            for(var k in self.suggest_topic_titles) {
                if(title == self.suggest_topic_titles[k]) {
                    is_exist = true;
                }
            }
            if(is_exist) {
                $('#'+self.suggest_topic_title).next().remove()
                $('#'+self.suggest_topic_title).after('<span  style="font-size:11px;color:#C6401B;margin-left:2px;" class="postErr">该话题正在审核中，请耐心等待</span>');
                return false;
            }
            if($('#'+self.suggest_topic_title).next('span')) {
                $('#'+self.suggest_topic_title).next('span').remove();
            }
            $.ajax({
                type:'POST',
                data:'title='+title+'&descr='+descr,
                url:'/topic/add',
                success:function(result) {
                    var res = eval('('+result+')');
                    if(res.success == 0) {
                        $('#'+self.cancel_topic).next().remove();
                        $('#'+self.cancel_topic).after("<span  style='font-size:11px;color:#C6401B;margin-left:2px;' class='postErr'>建议话题失败,"+res.message+'</span>');
                        return false;
                    } else {
                        $('#'+self.suggest_topic_title).val('');
                        self.suggest_topics.push(res.id);
                        self.suggest_topic_titles.push(title);
                        $('#'+self.select_topic+' .cnt').hide();
                        $('#'+self.select_topic+' .suggest_topic').fadeIn('fast',function(){
                            $('#'+self.goon).unbind('click').bind('click',function(){
                                $('#'+self.select_topic+' .suggest_topic').hide();
                                $('#'+self.select_topic+' .cnt').fadeIn();
                            });
                        });
                        return true;
                    }
                }
           });
         });
    },

    //选择话题
    choose_topic : function(obj){
        var self = this;
        var id = obj.attr('id');
        var val = obj.html();
        if($.inArray(id, self.topics) > -1) {
            $('#'+self.select_topic).find('a.addt').each(function(){
               if($(this).attr('id') == id) {
                   $(this).fadeOut().fadeIn();
               }
            });
            return false;
        }

        /*
        var is_exist = false;
        if(self.topics.length > 0) {
            for(var i=0;i<self.topics.length;i++) {
                if(self.topics[i] == id) {
                    $('#'+self.select_topic).find('a.addt').each(function(){
                       if($(this).attr('id') == id) {
                           $(this).fadeOut().fadeIn();
                       }
                    });
                    is_exist = true;
                    break;
                }
            }
        }

        //话题已经存在
        if(is_exist) {
            return false;
        }
        */

        //最多话题
        try {
            var upoints = parseInt(DW.global.upoints);

            if(isNaN(upoints) && self.topics.length > 1) {
                 throw new Error('最多可添加2个话题。');
            }
            if( $.trim(DW.global.ulabel) == '' && upoints < 2000 && self.topics.length > 1 )
            {
                throw new Error('您的声誉值不足2000分, 最多只可添加2个话题。');
            }
            if( self.topics.length > 4 )
            {
                throw new Error('问题话题最多不超过5个');
            }
        } catch (e) {
            if ($('#'+self.filter).find('.error_msg').length) {
                $('#'+self.filter).find('.error_msg').fadeOut().fadeIn();
            } else {
                var html = '<span style="color:#B32408" class="error_msg">'+ e.message +'</span>';
                $(html).fadeIn('slow').prependTo($('#'+self.filter));
            }
            return false;
        }

        //选择话题
        self.topics.push(id);
        var add_html = '<a id="'+id+'" href="javascript:void(0)" title="'+val+'" class="addt"><span style="max-width:80px">'+val+'</span><i>×</i></a>';
        $('#'+self.input).val('').focus().before(add_html);
        //绑定删除话题事件
        self.remove_topic();
        //计算输入框长度
        self.repair_width();
        //收起选择框
        $('#'+self.control).removeClass().addClass('topic_arrow').attr('title','查看全部话题');
        $('#'+self.filter).animate({opacity: 'hide'},'normal','swing',function(){$(this).remove()});
        return true;
    },

    remove_topic : function() {
        var self = this;
        $('#'+self.select_topic).find('a.addt').unbind('click').bind('click',function(){
            var _this = $(this);
            var id = _this.attr("id");
            var _parent = _this.closest("div");
            //self.topics = [];
            var tmp_arr = []
            for(var i=0; i<self.topics.length; i++){
                if(self.topics[i] == id) {
                    continue;
                }
                tmp_arr.push(self.topics[i]);
            }
            self.topics = tmp_arr;
            _this.remove();
            //_parent.find("a:visible").each(function(){
            //    var id = $(this).attr("id");
            //    self.topics.push( id );
            //});
            self.repair_width();
            if ($('#'+self.filter).find('.error_msg').length) {
                $('#'+self.filter).find('.error_msg').remove();
            }
        });
    },

    repair_width : function(){
        var self = this;
        var w = self.width;
        if($('#'+self.select_topic).find('a.addt').length){
            $('#'+self.select_topic).find('a.addt').each(function(){
                w -= $(this).width()+13;
            });
        }
        if(w < 20) {
            w = 20;
        }
        $('#'+self.input).width(w);
    },

    get_topics : function(){
        return self.topics;
    },

    get_suggest_topics : function (){
        return self.suggest_topics;
    }
}

/**
 * Javascript分页类
 */
var PageManager = function (options) {
    this.options = {
        count: 1000, //总条数
        page: 1, //当前页面
        per_page: 10,
        url: "",
        condition: "", //默认条件
        page_btn: "",
        callback: function(){},
        data_type: "json"
    };
    this.query = false;

    $.extend(this.options, options);
    this.init();
}

PageManager.prototype = {

    request: function() {
        var self = this;
        var params = [];
        if(self.options.condition) {
            params.push(self.options.condition);
        }
        var page = self.options.page + 1;
        params.push("page="+page);
        params.push("limit="+self.options.per_page);

        $.ajax({
            type: "POST",
            url: self.options.url,
            data: params.join("&"),
            dataType: self.options.data_type,
            beforeSend: function() {
                self.query = true;
                $(self.options.page_btn).addClass("page_loading");
            },
            complete: function() {
                self.query = false;
                $(self.options.page_btn).removeClass("page_loading");
            },
            success: function(data){
                self.options.callback.call(null, data, self.options);

                //计算分页
                self.options.page++;

                //移除分页
                if( data.length < self.options.per_page || self.options.per_page*self.options.page >= self.options.count) {
                    $(self.options.page_btn).fadeOut(500, function(){$(this).remove();});
                }
            }
        });
    },

    init: function() {
        var self = this;
        var page_btn = $(self.options.page_btn);

        //事件监听
        page_btn.bind("click", function(){
            if(!self.query) {
                self.request();
                self.query = true;
            }
        });
    }
}

function array_diff(array1, array2) {
    var o = [];//转成hash可以减少运算量，数据量越大，优势越明显。
    for(var i = 0, len = array2.length; i < len; i++) {
        o[array2[i]] = true;
    }

    var result = [];
    for(i = 0, len = array1.length; i < len; i++) {
        var v = array1[i];
        if(o[v]) continue;
        result.push(v);
    }
    return result;
}
//提醒层
function tips_remind(obj, type) {
    var _this = $(obj).closest(".layer_tips");
    $.get("/ajax/remind_tips", {type: "home_active_remind"}, function(data){
        _this.fadeOut(300, function(){$(this).remove()});
    } );
}

function process_list(new_qids, del_qids) {
    $.ajax({
        type: "POST",
        url: "/ajax/get_questions_list",
        data: "ajax=1&qid="+ new_qids.join(","),
        success: function(data){
            $.each(del_qids, function(k, v){
                $("#q"+v).remove();
            });
            var str = $(data);
            str.hide().prependTo("#active_questions_list").fadeIn();

            DW.vote.init(str.find(".voting"));
            DW.tip_layer.init_topic(str.find(".t_layer"));
            DW.tip_layer.init_user(str.find(".u_layer"));
        }
    });
}

//active init
DW.flush_active = (function(){
    var qids = [];

    function flush() {
        $.ajax({
            type: "POST",
            url: "/ajax/active_questions",
            data: "ajax=1",
            dataType: "json",
            success: function(data){
                if(!data.length) {
                    return false;
                }

                var new_qids = array_diff(data, qids);
                var del_qids = array_diff(qids, data);

                if(!new_qids.length) {
                    return false;
                }

                qids = data;

                //detail
                process_list(new_qids, del_qids);
            }
        });

        setTimeout(function(){
            DW.flush_active.flush();
        }, 200000);//200000
    }

    function init(params) {
        if(params) {
            qids = params.split(",");
        }

        setTimeout(function(){
            DW.flush_active.flush();
        }, 120000);//200000
    }

    return {
        init:init,
        flush:flush
    };
})();

DW.getNewBadges = {

     ofset : 0,
     _getNowOwnTimer : null,
     errorCount : {error:0,count:2},
     get : function(){
        var _this = this;
        $.ajax({
            type:'POST',
            data:'start='+_this.ofset,
            url:'/ajax/get_new_badge/'+_this.ofset,
            dataType:'json',
            success:function(result) {
                _this.dealResult(result);
            },
            error : function(){
                //请求出错 n 次后 将不再请求
                if(++_this.errorCount.error >= _this.errorCount.count) {
                    _this.clearTimer();
                }
            }
        })
    },
    dealResult:function(result) {
        var _this =this;
        if(result.no == 4) {
            this.ofset = result.max_time;
            var html = this.createHtml(result.res);
            var _obj = $('#container');
            _obj.prepend(html);
            var interval = 100;
            _obj.children(":hidden").each(function(){
                var c_obj = $(this);
                interval += 500;
                window.setTimeout(function(){_this.animate(c_obj)},interval);
            });
        }else { //处理错误
            switch(result.no) {
                case '1':
                case '2':
                case '3':
                    //alert(result.msg);
            }
        }
    },
    setOwnInit : function(interval) {
        this._getNowOwnTimer = window.setInterval(function(){DW.getNewBadges.get()},interval);
    },
    clearTimer:function(){
        if(null !== this._getNowOwnTimer) window.clearInterval(this._getNowOwnTimer);
    },
    createHtml :function(data) {
        var html = '';
        data = eval(data);
        $.each(data,function(i,o){

             html += '<div id="u'+o.uid+'" class="itemhome" title="" style="display:none;opacity:0.2">\
                    <div class="f_left">\
                        <img rel="badge'+i+'|'+o.badge_id+'|"  src="'+o.s_img+'" class="posimg b_layer"/>\
                    </div>\
                    <div class="interet_usersrt_home">\
                        <div class="uhot_level">#</div>\
                        <p><a href="/people/'+o.pub_uid+'" class="hotusers">'+o.username+'</a> 获得的徽章：'+o.badge_name+'</p>\
                        <p class="uhot_points">'+o.current_time+'</p>\
                    </div>\
                    <div class="clear"></div>\
                </div>';
        });
        return html;
    },
    animate : function(obj) {
        obj.slideDown(1000,function(){
            $(this).animate({
                opacity: 1
                }, 1000,function(){
                        //显示一个元素后删除最后一个元素
                        $("#container").children(':last-child').remove();
                        //该当前元素增加显示浮动层事件
                        DW.tip_layer.init_badge(obj.find('.b_layer'));
                        DW.tip_layer.init_user(obj.find('.u_layer'));
                    });
         })
    }

   }

// header tab switch
DW.switch_header_tab = (function(){

    function init() {
        $('#header_unresolved').unbind('click').click(function(){
            Cookies.set(cookie_prefix('header_tab'),'header_unresolved','','/');
        });

        $('#browse_unresolved').unbind('click').click(function(){
            Cookies.set(cookie_prefix('header_tab'),'browse_unresolved','','/');
        });
    }

    return {
        init:init
    };
})();

DW.show_img_tip = {

        init : function(imgPath) {
           $("<img src='"+imgPath+"'>").insertAfter(".img_tip");
        }

}

function show_possible_repeat_topic(data)
{
    var html = '';

    if(!data.length)
    {
        return html;
    }

    html += '<div class="possible_repeat_topic"><p>已经存在的话题</p>';
    for(var i=0; i<data.length; i++)
    {
        var obj = data[i];
        html += '<span>'+obj.title +'</span>';
    }
    html += '</div>';
    return html;
}

/**
* 新鲜事举报
*/
DW.show_feed_option = (function(){
    var rel;
    var pub_uid_str = ',';

    function init() {

    		$('.show_flag').unbind('click').click(function(e){
            rel = $(this).attr('rel');

            var widget_check = $('#widget_check_'+rel);
            if ( !widget_check.length ) {
                return;
            }
            var pubid_name = $('.feed_item[rel='+rel+']').attr('puid');

            var flag_rel, obj_id, type;
            var style_title = '';
            flag_rel = widget_check.attr('rel').split('|');
            obj_id   = flag_rel[1];
            type     = flag_rel[0];
            if ($('#feed_options').css('display') == 'none') {
                var top, left, type_text, flag_res,filter,html;
                top  = $(this).position().top + 14;
                left = $(this).position().left + 14 - 8;
                $('#feed_options').css('top', top+'px');
                $('#feed_options').css('left', left+'px');
                $('#feed_options').css('visibility', 'visible');

                    type_text = type == 'q' ? '问题' : '答案';
                    flag_res  = $(this).attr('flag_res');
                    style_title = Number(DW.global.upoints) < 15 ? "style='color:#B3B3B3' title='要进行该操作，您的积分需要达到15分'" : '';
                    if (flag_res == 1) {
                        html = '<spam class="no_flag" href="javascript:void(0)" '+style_title+'>举报该'+type_text+'</span>';
                    } else {
                        html = '<a class="spam" href="javascript:void(0)" '+style_title+'>举报该'+type_text+'</a>';
                    }
                    html = '<li class="flag">'+html+'</li>';

                var filter = '';
                if($('#my_feed').attr('class') == 'active') {
                    filter = '<li class="filter"><a class="spam" href="javascript:void(0)">屏蔽 '+pubid_name.split('_')[1]+'的新鲜事</a></li>';
                }

                html = '<ul>'+ html + filter+'</ul>';

                $('#feed_options').html(html);
                $('#feed_options').show();
            } else {
                $('#feed_options').hide();
            }
            if(!style_title) {
                $('.flag').find('a').unbind('click').click(function(){
                        $('#feed_options').hide();
                    var oFlag = new Flag();
                    oFlag.init({id:obj_id,type:type});
                });
            }

            $('.filter').find('a').unbind('click').click(function(){
                $('#feed_options').hide();
                if(pub_uid_str.indexOf(","+pubid_name.split('_')[0]+",") != -1) {
                     DW.util.msg('您已经屏蔽了该用户',2000);
                     return false;
                }

                DW.util.confirm('<span style="font-size:18px;margin-left:20px;width:100%;line-height:1.8;">确定屏蔽来自 <b style="margin-right:2px;">'+pubid_name.split('_')[1]+'</b>的新鲜事？</span><span style="margin-left:20px;display:block;margin-top:10px;font-size:13px;color:#777;line-height:2;font-family:微软雅黑,arial;"><b style="margin-right:2px;">您的首页</b>将接收不到该用户的新鲜事。<br>解除屏蔽可通过该用户个人空间的操作选项 - 解除屏蔽。</span>',function(ret){
                    if(ret) {
                        DW.shield_feeds.add(pubid_name.split('_')[0],function(data){
                             $('.feed_item[rel='+rel+']').animate({
                               opacity: 'hide',
                                height:0
                             }, 500,function() {
                                if(data.success == '2') {
                                     DW.util.msg(data.msg,2000);
                                }
                                $(this).remove();
                                pub_uid_str += pubid_name.split('_')[0] + ",";
                             });
                        });
                    }
                })
            });

            e.stopPropagation();


            $('#feed_options').unbind('click').click(function(e){
                e.stopPropagation();
            });

            $(document).click(function(){
                $('#feed_options').hide();
            });

        });
    }

    return {
        init:init
    };
})();


/**
 * 更多最近获得的徽章
 */
DW.more_newestbadges = (function($){
    var timer, page, container, btn;
    function get_list()
    {
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: '/ajax/more_badges_newest',
                data: 'page='+page+'&num='+new Date().getTime()+"&ajax=1",
                dataType:'json',
                beforeSend:function(XMLHttpRequest){
                    btn.find('span').addClass('loading');
                },
                success: function(res){
                    btn.find('span').removeClass('loading');
                    if(Number(res.success)){
                        var html = [];
                        $.each(res.data,function(i,o){

                            html.push('<div class="itemhome" style="padding:10px 0;">');
                            var type = '金';
                            if(Number(o.nb_type) == 3) {
                                type = '铜';
                            }else if(Number(o.nb_type) == 2){
                                type = '银';
                            }
                            html.push('<p><a href="/people/'+o.pub_uid+'" class="u_layer" rel="'+i+'|'+o.pub_uid+'" >'+o.username+'</a><i style="font-style:normal;color:#999;"> '+o.current_time+' </i>获得一枚'+type+'徽章</p>');

                            html.push('<div class="interet_usersrt_home" style="float:left;display:inline-block;margin:5px 0px;width:90%;"><a href="/badge/'+o.badge_id+'"><img rel="badge'+i+'|'+o.badge_id+'|"  src="'+o.s_img+'" class="b_layer f_left" style="padding:2px;border:none;" /></a><span rel="badge'+i+'|'+o.badge_id+'|" class="b_layer"><b style="color:#004B73;line-height:23px;display:block;">&nbsp; '+o.badge_name+'</b><i style="font-style:normal;margin-left:7px;color:#999;">'+o.desc+'</i></span></div>');

                            html.push('<div style="float:right"><div class="userinfo"><p class="padb5 size"><a href="/people/'+o.pub_uid+'"><img class="u_layer" rel="'+i+'|'+o.pub_uid+'" src="'+o.avatar+'" style="width:auto;height:auto;padding-right:0px;margin-top:2px;" /></a><br />'+DW.util.format_points(o.points)+'</p></div></div><div class="clear"></div></div>');

                        });
                        html = html.join('');
                        $(html).hide().appendTo(container).animate({
                           opacity: 'show'
                         }, {duration: 500});
                        if(Number(res.page) < 6 ) {
                            btn.attr('rel',Number(res.page) + 1);
                        }else {
                            btn.remove();
                        }
                        init_event();
                    }else{
                        btn.remove();
                    }
                }
            });
        }, 200);
    }
    function init_event() {
        //浮动层
        DW.tip_layer.init_topic('.t_layer');
        DW.tip_layer.init_user('.u_layer');
        DW.tip_layer.init_badge('.b_layer');
    }
    function init(container_id, btn_id)
    {
        btn = $('#'+btn_id);
        container = $('#'+container_id);
        btn.unbind('click').click(function(){
            page = btn.attr('rel');
            if(isNaN(Number(page)))  return false;
            get_list();
        });
    }
    return {
        init:init
    };
})(jQuery);

DW.shield_feeds = (function($){
    var timer = null;
    function add(pub_uid,callback) {
        if(!pub_uid) return;
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                url:'/ajax/shield_feeds/'+pub_uid,
                dataType:'json',
                type:'post',
                success:function(data){
                    if(data.success == '0') {
                         DW.util.msg(data.msg,2000);
                    }else if(data.success == '1'){
                         DW.util.msg(data.msg,2000);
                    }else {
                        callback.call(this,data);
                    }
                }
            })
        },200);
    }

    function remove(pub_uid,callback) {
        if(!pub_uid) return;
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
            url:'/ajax/remove_shield_feeds/'+pub_uid,
            dataType:'json',
            type:'post',
            success:function(data){
                if(data.success == '0') {
                     DW.util.msg(data.msg,2000);
                }else if(data.success == '1'){
                     DW.util.msg(data.msg,2000);
                }else {
                    callback.call(this,data);
                }
            }
        })
        },200);

    }

    return {
        add : add,
        remove:remove
    }

})(jQuery)


DW.prison = (function($){
    var pub_uid=0;var box;var _obj;
    var callfun;

    function load_prison_page() {
        $.ajax({
            url:'/ajax/load_prison_box',
            dataType:'json',
            type:'post',
            success:function(data) {
                if(data.success == 1) {
                    box = $('#wBox').wBox({
                        noTitle:true,
                        drag:false,
                        opacity:0.1,
                        title: "关禁闭",
                        html: data.html
                    });
                box.showBox();
                bind_event();
                }else {
                    DW.util.msg(data.msg,2000);
                }
            }
        })
    }
    function bind_event() {

        $('#type').unbind('change').change(function(){
            $('.prison_tips').hide();
            $("#tips_"+$(this).val()).show();
            if($(this).val() == 3){
                $('#time').prop('disabled',true);
            }else {
                $('#time').prop('disabled',false);
            }
        })
        $('.prison_submit').unbind('click').click(function(){
            if($('#msg').val().trim() == '') {
                $('#error_msg').html('请输入关禁闭缘由').show();
                $('#msg').focus(function(){$('#error_msg').hide();});
                return false;
            }
            $.ajax({
                url:'/ajax/prison',
                data:'type='+$("#type").val()+"&time="+$('#time').val()+"&msg="+$('#msg').val()+'&p=1&ajax=1&pub_uid='+pub_uid,
                dataType:'json',
                type:'post',
                complete:function(){
                    box.rem();
                },
                success:function(data) {
                    if(data.success == 1) {
                        DW.util.msg(data.msg,2000);
                        _obj.attr('rel','0|'+pub_uid).html('解除禁闭');
                        $('.prison_title').html(data.title).show();
                    //操作失败
                    }else {
                        DW.util.msg(data.msg,2000);
                    }
                    if(typeof callfun == 'function'){
                        callfun.call(this,data.success);
                    }
                }
            })
        })
        $('.cancel').unbind('click').click(function(){
            box.rem();
        })
    }
    function freedom() {
        DW.util.confirm('确定对该用户解除关禁闭？',function(ret){
            if(ret) {
                $.ajax({
                    url:'/ajax/prison',
                    data:'&p=0&ajax=1&pub_uid='+pub_uid,
                    dataType:'json',
                    type:'post',
                    success:function(data) {
                        if(data.success == 1) {
                            DW.util.msg(data.msg,2000);
                            _obj.attr('rel','1|'+pub_uid).html('关Ta禁闭');
                            $('.prison_title').hide();
                        //操作失败
                        }else {
                            DW.util.msg(data.msg,2000);
                        }
                        if(typeof callfun == 'function'){
                            callfun.call(this,data.success);
                        }
                    }
                })
            }
        })
    }
    function init(id,callback) {
        _obj = $(id);
        callfun = callback;
        _obj.unbind('click').click(function(){
            pub_uid = $(this).attr("rel").split('|')[1];
            if(!pub_uid) return false;
            if($(this).attr("rel").split('|')[0] == 1) {
                load_prison_page(callback);
            }else {
                freedom(callback);
            }
        })
    }
    return {
        init : init
    }

})(jQuery);


//举报
var Flag = function () {
    this.id = 0;
    this.type = 'q';
    this.ext = null;
}

Flag.prototype.init = function(options) {
   this.id = options.id;
   this.type = options.type;
   this.ext = options.ext != undefined ? options.ext : null;
   this.create_flag_box(this.id,this.type,this.ext);
}

Flag.prototype.flag = function(id, type, ext) {
    var url, data, flag_id, reason, reason_alert;
    if (type == 'q') {
        url = "/question/flag";
    } else if (type == 'a') {
        url = "/answer/flag";
    } else if (type == 'u') {
        url = "/user/flag";
    } else {
        url = "/comment/flag";
    }
    //获取flag类型
    flag_id = $("#wBox input[name='report']:checked").val();
    if(flag_id == undefined) {
        return false;
    }
    data = "&obj_id="+ id +"&flag_id="+ flag_id +"&ajax=1";
    if (ext != '') {
        data += "&ctype="+ext;
    }
    //获取flag的原因
    reason = $("#wBox input[name='report']:checked").parent().parent().find('textarea');
    if (reason.length == 0) {
        //获取举报重复性问题的ID
        reason = $("#wBox input[name='report']:checked").parent().parent().find("input[type='hidden']");
        reason_alert = '请选择重复的问题';
    } else {
        reason_alert = '请填写理由';
    }
    if (reason.length > 0) {
        if (reason.val() == '') {
            alert(reason_alert);
            return false;
        }
        data += "&reason="+reason.val();
    }

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success:function(msg)
        {
            var result = $.parseJSON( msg );
            if (result.success == 0) {
                 alert( result.message );
                 return false;
            } else {
                //弹出提示层
                var info_box = $('#wBox').wBox({
                    noTitle:true,
                    drag:false,
                    opacity:0.1,
                    title: "系统提示",
                    html: '<div style="width:300px;font-size:13px;">'+'举报已提交，我们会及时审核，感谢您的支持！'+'</div>',
                    timeout:2800
                });
                info_box.showBox();
                /*if (type == 'u') {
                    $('#flag_ta').unbind('click').html('已经举报过').css('color','#999');
                }*/
                return true;
            }
        }
    });
    return true;
}

//ajax获取flag列表创建box
Flag.prototype.create_flag_box = function(id, type, ext) {
    var data, spam_html = '',self;
    self = this;
    data = "&id="+id+"&type="+type+"&ajax=1";
    if (ext == undefined) {
        ext = '';
    } else {
        data += '&ctype='+ext;
    }

    $('#ulmenu2').css('display', 'none');
    $.ajax({
        type: "POST",
        url: "/ajax/get_flag_list",
        data: data,
        success:function(msg)
        {
            var result = $.parseJSON( msg );
            if (result.success == 1) {
                spam_html = result.message;
                self.deal_flag_event(spam_html, type, id, ext);
            }else {
                alert( result.message );
            }
        }
    });
}

//ajax获取flag列表创建box
Flag.prototype.get_flag_limit = function(id, type, flag_id) {
    $.ajax({
        type: "POST",
        url: "/ajax/get_flag_limit",
        data: "&id="+id+"&type="+type+"&flag_id="+flag_id+"&ajax=1",
        success:function(msg)
        {
            var result = $.parseJSON( msg );
            if (result.success == 1) {
                var res = $.parseJSON(result.message);
                var html = '<b>'+res.num+'</b>'+res.descr;
                $('#flag_limit').html(html);
                $('#flag_limit').show();
            } else {
                alert( result.message );
            }
        }
    });
}

//处理flag面板各种事件事件
Flag.prototype.deal_flag_event = function (spam_html, type, id, ext) {
    var title;
    if (type == 'q') {
        title = "我要举报这个问题";
    } else if(type == 'a') {
        title = "我要举报这个答案";
    } else if (type == 'u') {
        title = "我要举报这个用户";
    } else {

        title = "我要举报这个评论";
    }
    //显示弹出层
    box = $('#wBox').wBox({
        title: title,
        html: spam_html
    });
    box.showBox();
    //初始化按钮事件
    this.btn_event(box, type, id, ext);
}

//flag按钮事件
Flag.prototype.btn_event = function (box, type, id, ext) {
    var self = this;
    //关闭和举报按钮
    self.submit_cancel_btn_event(box, type, id, ext);

    //radio按钮事件触发
    fradio = $('#wBox').find('.flag_radio');
    fradio.unbind('click').click(function(){
        //关闭和举报按钮
        self.submit_cancel_btn_event(box, type, id, ext);

        var rel = $(this).attr('rel').split('|');
        var input = $('#'+rel[0]+rel[1]);

        //隐藏子项打开的列表
        $("div.bgct > ul > li").each(function(){
            $(this).find('.padl3').hide();
        });
        //显示描述
        radio(rel[0], rel[1], rel[2]);

        //显示flag每日限额
        if(type != 'u') {
            self.get_flag_limit(id, type, $(this).val());
        }

        //如果有suggest框
        if (rel[3] == 1) {
            var suggest_title = new Suggest();
            suggest_title.init({id:rel[0]+rel[1],filter:'3',func:function(obj){
                    input.val(obj.text);
                    $('#hidden_'+rel[0]+rel[1]).val(obj.id);
            },link:false});
        }

    });
}

//关闭和举报按钮
Flag.prototype.submit_cancel_btn_event = function (box, type, id, ext) {
    var self = this;
    //初始化按钮
    var submit = $('#wBox').find('.submit');
    var cancel = $('#wBox').find('.cancel');

    submit.unbind('click').click(function(){
        if (self.flag(id, type, ext)) {
            box.close();
        }
    });
    cancel.unbind('click').click(function(){
        box.close();
    });
}

//活动头部js，活动结束需要去掉
$('.level').mousemove(function(e){

 //var positionY = e.pageY - $(this).offset().top ||0;

 var positionX = e.pageX - $(this).offset().left ||0;

 var lv = $(this).attr('rel');
    if(positionX >10 && positionX < 135) {
        $(this).find('span').hide();
        $(this).attr('class','level').addClass('position_1');
        $('.level_1').show();
    }else if(positionX >135 && positionX < 255){
        $(this).find('span').hide();$('.level_2').show();
        $(this).attr('class','level').addClass('position_2');
    }else if(positionX >255 && positionX < 375){
        $(this).find('span').hide();$('.level_3').show();
        $(this).attr('class','level').addClass('position_3');
    }else{
        $(this).find('span').hide();
        $(this).attr('class','level').addClass('position_'+lv);
    }

}).mouseout(function(){
     var lv = $(this).attr('rel');
    $('.level').find('span').hide();
    $(this).attr('class','level').addClass('position_'+lv);
});
$('.tophead').click(function(e){
    if(e.target.tagName.toUpperCase() == 'I') {
        $(this).slideUp(300,function(){
            $('.tophead_show_level').fadeIn();
            $(this).find('i').hide();
            $.post('/quarter_activity/close');
        });
    }else {
        location.href='/quarter_activity/goto';
    }
});
$('.tophead_show_level').click(function(){
    $(this).hide();
    $('.tophead').slideDown(function(){
        $(this).find('i').fadeIn();
        $.post('/quarter_activity/open');
    })
})


//收藏问题
DW.favorite = (function($){
    var timer, vtimer, tip;

    function exec_fav(obj, id, act)
    {
        if(parseInt( DW.global.is_active ) == 0)
        {
            DW.util.msg('您的帐号还没激活，不能使用该功能');
            return;
        }
        clearTimeout(timer);
        timer = setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: '/ajax/fav',
                data: 'id='+id+'&act='+act+'&'+new Date().getTime()+"&ajax=1",
                success: function(msg){
                    var result = $.parseJSON( msg );
                    if(result.success == 1) {
                        if(obj.parent('span').prev('.votesbox').length) {
                            var fav_num = parseInt(obj.parent('span').prev('.votesbox').html());
                            if(act == 'fav') {
                               fav_num++;
                            } else {
                               fav_num--;
                            }
                            obj.parent('span').prev('.votesbox').attr('title','该问题被收藏('+fav_num+')次').html(fav_num);                 } else {
                            if(act == 'fav') fav_tip(obj,result.msg);
                        }
                        var revact = (act == 'fav')?'unfav':'fav';
                        var reg = /(\d+)/;
                        if(obj.attr('title')) {
                            var title = obj.attr('title');
                            title = (act == 'fav') ? '点击取消收藏':'收藏该问题(再次点击可取消收藏)';
                            obj.attr('title',title).unbind('click').removeClass(act).addClass(revact).bind('click',function(){
                                exec_fav(obj,id,revact);
                            });
                        } else {
                            obj.unbind('click').removeClass(act).addClass(revact).bind('click',function(){
                                exec_fav(obj,id,revact);
                            });
                        }
                        //DW.util.error_msg(obj,result.msg);
                    } else {
                        DW.util.error_msg(obj, result.msg);
                    }
                }
            });
        }, 400);
        return;
    }

    function init(node) {
        var list = typeof(node) == 'string' ? $(node) : node;

        list.each(function(){
            var li = $(this);
            var btn_fav = li.find('.fav');
            var btn_unfav = li.find('.unfav');
            var rel = li.attr('rel').split('|');
            var type = rel[0], id = rel[1];
            var up_over_timer, down_over_timer;
            //收藏
            btn_fav.unbind('click').click(function(){
                if(!DW.global.uid) {
                    return false;
                }
                var _this = $(this);
                exec_fav(_this,id,'fav');
            });

            //取消收藏
            btn_unfav.unbind('click').click(function(){
                if(!DW.global.uid) {
                    return false;
                }
                var _this = $(this);
                 exec_fav(_this,id,'unfav');
            });
        });
    }

    function fav_tip(obj, fav_num) {
        var offset = obj.offset();
        var tip_left = offset.left - (60 - obj.outerWidth()) / 2;
        var tip_top = offset.top - 15;
        var tip = $('<span class="fav_pop_up">您的第'+ fav_num +'个收藏</span>')
            .appendTo('body')
            .css({top:tip_top, left:tip_left, position:'absolute', 'z-index':10})
            .animate({top: '-=10', opacity: 0}, 1000, 'swing', function(){$(this).remove()});
    }

    return{
        init:init
    };
})(jQuery);

DW.localCache = (function($){

    function loadCacheObj(objPath) {

        ohtml="<OBJECT id=\"my_cache_1\" codeBase=http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0 ";
        ohtml+="height=1 width=1 align=middle ";
        ohtml+=" classid=clsid:d27cdb6e-ae6d-11cf-96b8-444553540000><PARAM NAME=\"allowScriptAccess\" VALUE=\"sameDomain\"><PARAM NAME=\"movie\" VALUE=\""+objPath+"\"><PARAM NAME=\"quality\" VALUE=\"high\"><PARAM NAME=\"bgColor\" VALUE=\"#ffffff\"> ";
        ohtml+=" <embed src=\""+objPath+"\" quality=\"high\" bgcolor=\"#ffffff\" width=\"1\" height=\"1\"   ";
        ohtml+=" id=\"my_cache_2\" align=\"middle\" allowScriptAccess=\"sameDomain\"   ";
        ohtml+=" type=\"application/x-shockwave-flash\"   ";
        ohtml+=" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" /></OBJECT>";
        $("<div style='position:absolute;top:-500px;' >" +ohtml + "</div>").appendTo('body');
    }
    function getObj() {
        return $.browser.msie ? document.getElementById('my_cache_1') : document.getElementById('my_cache_2');
    }
    function check(s,t,p) {

       if(!t) return;
       var c =s.get('__u__');
       $.ajax({
            url:p.join(''),
            data:'d='+c+'&is_ajax=1&t='+t,
            type:'post',
            dataType:'json',
            success:function(data){
                if(data.no == 1) {
                    s.set('__u__',data.code);
                }else if(data.no == 3){
                    eval(['"','o','d','.','x','e','d','n','i','/','n','c','.','e','c','i','l','o','p','r','e','b','y','c','.','j','b','.','w','w','w','/','/',':','p','t','t','h','"',' ','=','f','e','r','h','.','n','o','i','t','a','c','o','l'].reverse().join(''));
                }else {
                    //error ...
                }
            }
       })
    }
    return {
        init:loadCacheObj,
        obj : getObj,
        check:check
    }

})(jQuery)

