/*
 * @author:zhukai
 * @version:1.0
 *
 **/
/***********************************************************封装js问题类********************************************************************/
//工具类
var my_command = {
};
//获取滚动条距离顶端距离
my_command.getScrollTop = function(){
    var scrollPos;
    if (window.pageYOffset) {
        scrollPos = window.pageYOffset;
    }else if (document.compatMode && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }else if (document.body) {
        scrollPos = document.body.scrollTop;
    }
    return scrollPos;
};

my_command.load_copy = function(index,copytext){
    ZeroClipboard.setMoviePath( "/theme/images/editor/ZeroClipboard.swf" );
    var clip = new ZeroClipboard.Client();

    $(window).resize(function(){
        clip.reposition();
    });
    clip.setHandCursor(true);
    clip.addEventListener( "load", function(client) {
        //alert("Flash 加载完毕！");
    });
    clip.addEventListener('mouseOver', function(client) {
        clip.setText(copytext);
    });
    //复制成功后弹出对话框
    clip.addEventListener('complete', function(client, text) {
        DW.util.msg('代码已复制到剪切板');
    });
     clip.glue("copy_code_"+index);
};


var qus={
    'qid':0
};

qus.set_bounty = function(){
    //颁发悬赏
    $('.close_bounby').unbind('click').click(function(){
        var ans = $(this);
        var rel = ans.attr('rel').split('|');
        var confirm_info, qid = rel[0], bounty_aid = rel[1], cw_mode = rel[3],bounty_points = rel[4],old_points = rel[5],pub_uid = rel[6];
        var user_old_points = rel[7];
        var bounty_user_points = parseInt(rel[8]);
        old_points = old_points ? parseInt(old_points) : 0;
        confirm_info = "<b style='font-size:15px'>您确定要将悬赏声誉值"+bounty_points+"分授予 <a target='_blank' href='/people/"+pub_uid+"'>"+rel[2]+'</a>？</b> <br><b style="font-weight:normal;color:#666;">悬赏一经颁发，将无法撤销。</b>';
        confirm_info =
        '<div class="popdiv" id="poper_bounty"><div class="wrap" id="bounty_content_id" style="font-align:center;"><span style="font-size:13px;">' + confirm_info + '</span><div class="btn1"><span class="btns"><a class="cancel" href="javascript:void(0);">取消</a><a class="re submit" href="javascript:void(0)">确定</a></span></div></div></div>';
        box = $('#wBox').wBox({
            title: "颁发悬赏",
            html: confirm_info
        });
        box.showBox();
        $(".wBox_body").css("width","485px");
        $(".popdiv").css("width","480px");
        $("#bounty_content_id").find(".wrap").css("width","450px");
        //初始化按钮
        submit = $('#wBox').find('.submit');
        cancel = $('#wBox').find('.cancel');
        submit.unbind('click').click(function(){
            $.ajax({
                type: "POST",
                url: "/question/close_bounty",
                data: "qid="+qid+"&bounty_aid="+bounty_aid+"&ajax=1",
                success: function(msg){
                    var result = $.parseJSON( msg );
                    if (result.success == 1 ) {
                        box.close();
                        //当前答案分数变亮
                        ans.removeClass('bounty_send');
                        ans.addClass('bounty_sended');
                        //当前页面的悬赏分数背景变灰
                        $('.bounty_send').each(function() {
                            $(this).remove();
                        });
                        $(".xuanshang").removeAttr("title");
                        if(ans.closest('.small-box').find("span").length >= 2){
                            ans.closest('.small-box').find("span:first").remove();
                        }
                        var new_points = parseInt(bounty_points) + parseInt(old_points);
                        var replace_html = '<span class="bounty_sended bounty_layer" rel="'+bounty_aid+'|'+bounty_aid+'">'+new_points+'</span>';
                        ans.replaceWith(replace_html);
                        $("#bounty_status").css("display","none");
                        DW.tip_layer.init_bounty('.bounty_layer');
                        if(parseInt(user_old_points) < 100){
                            $("#ulmenu2").find("li:first").replaceWith('<span style="cursor:pointer;padding-left: 6px;color:#ccc;display:block;clear:both;" title="声誉值不足100分不能够悬赏问题">悬赏问题</span>');
                        }
                        var my_old_points = parseInt($(".layer_head").find("h3").find("b").text());

                        $("#"+bounty_aid).find(".li_rgt").find(".small-box").text(DW.util.format_points(bounty_user_points + parseInt(bounty_points)));
                        DW.util.msg("悬赏颁发成功");
                    } else{
                        //DW.util.msg(result.message);
                    }
                }
            });
        });
        cancel.unbind('click').click(function(){
            box.close();
        });
    });
};

qus.invite_people_ans_qus = function(){
	$("#invite_questions").unbind('click').bind('click',function(){
		$(".site_invite_answer").css("display","block");
		$("#invite_ans_qus").css("display","none");
	});
};

var user = {
    'points' : 0,               //用户分数
    'points_boundaries' : 100,   //新老用户分数界限
    'user_total_answers':1,
    'user_box_times':1
};

/****************************************封装js答案类**********************************************************/
//全局变量
var times_start;
//var ans_tipbox;
var answer = {
    'aid':0,
    config:{
        'slidedown_time':400,
        'slideup_time':600,
        'delay_time':200,
        'fadeout_time':150,
        'fadein_time':300,
        'showbox':true,         //弹出框提示
        'times':5,              //倒计时时间限制
        'string_limit':100,     //老用户答案字数判断
        'is_show_tab':false,     //出现tab提示
        'knowmsg':'我知道了'
    },
    'handle':null,              //倒计时时间句柄
    'tab_exist':false,         //弹出错误信息是否存在
    'scroll':false,
    'dialog_box' : null,
    toolbar:{
        alert:function(msg){
            var type = typeof(msg);
            var alertstr='';
            switch(type){
                case 'string':
                    alertstr = 'string msg:'+msg;
                    break;
                case 'number':
                    alertstr = 'number msg:'+msg;
                    break;
                case 'boolean':
                    alertstr = 'boolean msg:'+msg;
                    break;
                case 'object':
                    var tmp_arr = [];
                    for(var k in msg){
                        tmp_arr[k] = $.trim(msg[k]);
                    }
                    alertstr = 'object msg:'+(tmp_arr.join(','));
                    break;
                case 'function':
                    alertstr = 'function msg';
                    break;
                case 'undefined':
                    alertstr = 'variable is undefined';
                    break;
                default:
                    alertstr = 'error msg';
            }
            //alert(alertstr);
        },
        useragent:function(){
          return navigator.userAgent;
        },
        createintervalbox:function(){
            var notice_for_newuser =
                '<div class="popdiv" id="poper_bounty">'+
                '<div class="wrap" style="text-align:center;padding:20px;height:260px;">'+
                    '<div id="u51_rtf" class="boxcss">'+
                        '<p class="titlecss">这是您第一次回答哦，让我这个小助手来给你一些建议吧！</p>'+
                        '<p class="t">您的答案必须是对问题的解答，以下情况不适合作为答案内容发布：</p>'+
                        '<ul>'+
                            '<li class="tips_li">要发表意见或问询，请使用评论功能；</li>'+
                            '<li class="tips_li">要表达感谢或不满，请对问答投票；</li>'+
                            '<li class="tips_li">要对问题/答案做补充完善，请直接在原内容上进行编辑。</li>'+
                        '</ul>'+
                        '<p class="desc">好答案会让您获得更多人的赞同、更多的社区权利和更高的社区声望，也能帮助社区构建高质量的内容库。</p>'+
                    '</div>'+
                    '<div id="timestip">'+
                        '<span id="l" class="timecss">还剩<span id="timesid">'+answer.config.times+'</span>秒</span>'+
                    '</div>'+
                '</div>'+
            '</div>';

            answer.dialog_box = $('#wBox').wBox({
                noTitle:true,
                opacity:0.04,
                html: notice_for_newuser
            });
            answer.dialog_box.showBox();
            $("#wmd-input").blur();
        }
    },
    showintervalbox:function(){
        $("#timesid").text(--answer.config.times);
        if(parseInt(answer.config.times) == 0){
            window.clearInterval(answer.handle);
            //清除时间句柄
            answer.handle = null;
            var tmp_html = '<a id="l" href="javascript:void(0)" class="knowcss">'+(answer.config.knowmsg)+'</a>';
            $("#timestip").html(tmp_html);
            $('#wBox #l').unbind('click').bind("click",function(){
                answer.dialog_box.close();
                    $("#wmd-input").focus();
                });
            answer.config.times = times_start;
        }
    },
    addtab:function(str){
        if(!answer.tab_exist){
            $(".help_items").append('<li rel="sug" class="on" id="m">启发式提示</li>');
            $(".help_cnt").append('<div id="c_sug" style="display:none;"><p>'+str+'</p></div>');
            $(".md_help").fadeIn(answer.config.fadein_time,function(){
                $("#c_sug").delay(answer.config.delay_time).slideDown(answer.config.slidedown_time);
            });
        }else{
            var md_helpstyle = $(".md_help").css("display");
            $("#m").addClass("on");
            if(md_helpstyle == 'block'){
                $("#c_sug").delay(answer.config.delay_time).slideDown(answer.config.slidedown_time);
            }else{
                $("#c_sug").css("display","none");
                $(".md_help").fadeIn(answer.config.fadein_time,function(){
                    $("#c_sug").delay(answer.config.delay_time).slideDown(answer.config.slidedown_time);
                });
            }
        }
        answer.config.is_show_tab = true;
        answer.tab_exist = true;
        answer.error_showhide();
    },
    removetab:function(){
        if(!answer.tab_exist){
            $("#c_sug").slideUp(answer.config.slideup_time,function(){
                $(this).remove();
                $("#m").fadeOut(answer.config.fadeout_time,function(){
                    $(this).remove();
                });
            });
        }else{
            $("#c_sug").slideUp(answer.config.slideup_time);
            //$("#c_sug").slideUp(answer.config.slideup_time, function(){
               //$(this).remove();
            //});
        }
    },
    cleartab:function(){
        $("#c_sug").slideUp(answer.config.slideup_time,function(){
             $(this).remove();
             $("#m").fadeOut(answer.config.fadeout_time,function(){
                   $(this).remove();
             });
       });
    },
    clearother_tab:function(){
        $(".help_cnt").find("div").each(function(){
             var idname = $(this).attr('id');
             if(idname != 'c_sug'){
                  $("#"+idname).css("display", "none");
             }
        });
        $(".help_items").find("li").each(function(){
             var rel = $(this).attr("rel");
             if(rel != 'sug'){
                 $(this).removeClass("on");
             }
        });
    },
    error_showhide:function(){
        $("#m").unbind("click").bind("click",function(){
            answer.clearother_tab();
            var display_style = $("#c_sug").css("display");
            if(display_style == 'none'){
                $(this).addClass("on");
                $("#c_sug").slideDown(answer.config.slidedown_time);
            }else{
                $(this).removeClass("on");
                $("#c_sug").slideUp(answer.config.slideup_time);
            }
        });
    },
    clear_config:function(){
        answer.tab_exist = false;
        answer.config.is_show_tab = false;
    },
    show_tabmsg:function(msg){
        answer.clearother_tab();
        if(answer.config.is_show_tab){
              answer.removetab();
        }
        answer.addtab(msg);
    }
};


answer.hidden_tools = function(copyobj,cobj){
    $(".copy_code").css({"position":"absolute","visibility":"hidden","left":"480px"});
    // copyobj.css({"position":"absolute","visibility":"hidden","left":"480px"});
    cobj.css({"position":"absolute","visibility":"hidden","left":"550px","top":"3px"});
    answer.scroll = false;
};

answer.show_tools = function(copyobj,cobj,is_answer){
    if(is_answer){
        //answer icon
        if(answer.scroll){
            copyobj.css({"position":"absolute","visibility":"visible","left":"515px"});
            cobj.css({"position":"absolute","visibility":"visible","left":"535px","top":"3px"});
        }else{
            copyobj.css({"position":"absolute","visibility":"visible","left":"530px"});
            cobj.css({"position":"absolute","visibility":"visible","left":"550px","top":"3px"});
        }
    }else{
        if(answer.scroll){
            copyobj.css({"position":"absolute","visibility":"visible","left":"515px"});
            cobj.css({"position":"absolute","visibility":"visible","left":"535px","top":"3px"});
        }else{
            copyobj.css({"position":"absolute","visibility":"visible","left":"530px"});
            cobj.css({"position":"absolute","visibility":"visible","left":"550px","top":"3px"});
        }
    }

};

//去掉样式以及html部分，返回code
answer.code_content = function(str,flag){

    var add = '';
    if(flag){
        add = "<br/>";
    }else{
        add = "\r\n";
    }
    var words = "</li>";
    var span_words = "</span>";
    var new_content = '';
    if(answer.toolbar.useragent().indexOf('MSIE') != -1){
        var index = str.indexOf("<LI");
        var lastindex = str.lastIndexOf("</OL>");
        new_content = str.substring(index,lastindex);
        words = words.toUpperCase();
        span_words = span_words.toUpperCase();
    }else{
        var reg = /<ol([^<>]+)>(.+)<\/ol>/ig;
        new_content = str.replace(reg,"$2");
    }
    var pos = new_content.getpos(new_content,words);
    var substr_arr = [];
    var start = 0;
    var reg1 = /<li[^<>]+>(<h\d+>)?(.+)(<\/h\d+>)?(.*)<\/li>/ig;
    for(var i in pos){
        substr_arr[i] = new_content.substring(start,pos[i]+ words.length);
        start = pos[i] + words.length;
        substr_arr[i] = substr_arr[i].replace(reg1,"$2").replace(/<\/h\d+>/ig,'');
    }
    var pos1 = [];
    for(var i in substr_arr){
        pos1[i] = span_words.getpos(substr_arr[i],span_words);
    }
    var k = 0;
    var span_content = [];
    var start;
    var tmp = [];
    for(var i in pos1){
        start = 0;
        var length1 = pos1[i].length;
        for(var j=0;j<length1;j++)
        {
            span_content[k] = substr_arr[i].substring(start,pos1[i][j]+span_words.length);
            if(j == length1 -1 && i != pos1.length-1){
                span_content[k] += add;
            }
            start = pos1[i][j]+span_words.length;
            ++k;
        }
    }
    var true_content = [];
    var reg2 = /(.*)<span[^<>]+>(.*)<\/span>/ig;
    var tmp_content = '';
    var j = 0;
    var content = '';
    for(var i in span_content){
        //tmp_content = span_content[i].replace(reg2,"$1").replace(/(^\s*)(\s*$)/g,'');
        if($.trim(span_content[i]) != '<\/span>'){
            tmp_content = span_content[i].replace(reg2,"$2");
            if(tmp_content!=''){
                true_content[j] = tmp_content.HTMLDeCode(tmp_content);
                content += true_content[j];
                ++j;
            }
        }
    }
    return content;
};

answer.addans = function(){
    $(".addans").unbind("click").click(function(){
        var ret = submit_form(this);
        if(ret){
            var qid = parseInt($(this).attr("rel"));
            var old_content = $('#wmd-input').val().replace(/(\s*$)/g,"");
            var content = encodeURIComponent($('#wmd-input').val().replace(/(\s*$)/g,""));
            var cw = 0;
            if($("#cw_mode").is(":checked")){
                cw = 1;
            }
            /*
            * 0:新用户答案含有垃圾情况
            * 1:答案发表成功
            * 2:新用户内容含有赞同等词汇
            * 3:自问自答情况
            */
            $.ajax({
                type: "POST",
                url: "/answer/add",
                data:"qid="+qid+"&cw_mode="+cw+"&content="+content,
                success:function(msg){
                    var result = $.parseJSON( msg );
                    var tops1 = Math.ceil(parseInt($("#errorid").offset().top));
                    var tops = Math.ceil(parseInt($("#ans_editors").offset().top));
                    var scrolls = Math.ceil(parseInt(my_command.getScrollTop()));
                    answer.config.slideup_time = 180;
                    if(result.success == 0){
                        var weight = parseInt(result.weight);
                        var words = result.words;
                        var tipshtml='';
                        switch(weight){
                            case 6:
                            tipshtml = "答案内容中发现<font class='kw1'>\""+words+"\"</font>关键词, 请勿发布含有色情、敏感性词汇。";
                            break;
                            case 5:
                            tipshtml = "答案内容中发现<font class='kw2'>\""+words+"\"</font>关键词，请勿发布含有谩骂、侮辱、诽谤性词汇。";
                            break;
                            case 4:
                            tipshtml = "答案内容中发现<font class='kw3'>\""+words+"\"</font>关键词，德问不是论坛，请用提及功能(输入@)关联用户。";
                            break;
                            case 3:
                            tipshtml = "答案内容中发现<font class='kw4'>\""+words+"\"</font>关键词，您确定是在回答问题而不是发表评论？要发表意见请使用评论功能。" ;
                            break;
                            //老用户类型6提示
                            case 1:
                            tipshtml = "答案内容中发现<font class='kw6'>\""+words+"\"</font>关键词，您确定是在回答问题而不是表达赞同或感谢？对问题或答案表示赞同或感谢请对问答投票或评论。";
                            break;
                            default:
                            tipshtml = result.message;
                            break;
                        }
                        if(tops < scrolls){
                            $(document).scrollTop(tops);
                        }
                        $(".loadupdate").css("display","none");
                        answer.show_tabmsg(tipshtml);
                        var pos_arr = old_content.getpos(old_content,words);
                        for(var k in pos_arr){
                            tipshtml.set_caret_position(document.getElementById('wmd-input'),parseInt(pos_arr[k]),parseInt(pos_arr[k])+parseInt(words.length));
                        }
                        /*
                        $("#anstips").html(tipshtml);
                        if(answer.config.is_delay){
                            $('.errorans').slideUp(answer.config.slideup_time,function(){
                                $(".errorans").delay(answer.config.delay_time).slideDown(answer.config.slidedown_time);
                            });
                        }else{
                            $(".errorans").slideDown(answer.config.slidedown_time);
                        }
                        */
                    }else if(result.success == 1){
                        var q_title = result.data;
                        location.href = '/q/'+qid+'/'+q_title;
                    }else if(result.success == 2){
                        //新用户类型6提示
                        var words = result.words;
                        tipshtml = "答案内容中发现<font class='kw6'>\""+words+"\"</font>关键词，您确定是在回答问题而不是表达赞同或感谢？对问题或答案表示赞同或感谢请对问答投票或评论。";
                        if(tops < scrolls){
                            $(document).scrollTop(tops);
                        }
                        answer.show_tabmsg(tipshtml);
                        var pos_arr = old_content.getpos(old_content,words);
                        for(var k in pos_arr){
                            old_content.set_caret_position(document.getElementById('wmd-input'),parseInt(pos_arr[k]),parseInt(pos_arr[k])+parseInt(words.length));
                        }
                        $(".loadupdate").css("display","none");
                    }else if(result.success == 3){
                        tipshtml = "您确定是在回答问题而不是补充完善问题？请勿将对问题的补充完善当作答案发布。" ;
                        if(tops < scrolls){
                            $(document).scrollTop(tops);
                        }
                        answer.show_tabmsg(tipshtml);
                        $(".loadupdate").css("display","none");
                    }
                }
            });
        }
    });
};

//弹出提示框
answer.show_anstips = function(){
    $('#wmd-input').click(function(){
        times_start = answer.config.times;
        var user_total_answers = parseInt($("#box_info").val());
        answer.config.showbox = (user_total_answers < parseInt(user.user_total_answers)) ? true : false;
        if(answer.config.showbox){
             $("#box_info").val(9999);
             answer.toolbar.createintervalbox();
             answer.handle = setInterval("answer.showintervalbox()",1000);
        }
        //answer.removetab();
        answer.cleartab();
        answer.clear_config();
    });
};

answer.copycode = function(){
    //复制代码按钮增加flash透明层
    /*
    var totalcode_block = parseInt($(".prettyprint").length);
    var tmpstr = '';
    for(var k = 0;k<totalcode_block;k++){
        var index = $(".prettyprint").eq(k).attr("index");
        //去除完善之后重复添加flash
        $(".prettyprint").eq(k).find(".swf").remove();
        //var copytext =  tmpstr.HTMLDeCode($(".prettyprint").eq(k).html().replace(/<br\s*?\/?>/ig,'\n\r'));
        //var copytext = answer.code_content($(".prettyprint [index="+k+"]").eq(k).html(),false);
        var copytext = answer.code_content($(".prettyprint[index="+index+"]").html(),false);
        if($.trim(copytext) == ''){
            copytext = tmpstr.HTMLDeCode($(".prettyprint[index="+index+"]").html().replace(/<br\s*?\/?>/ig,'\n'));
        }
        my_command.load_copy(index,copytext);
    }
     */

    $(".prettyprint").each(function(i){
        _this = $(this);
        var index = _this.attr("index");
        var copytext = answer.code_content(_this.html(), false);
        if($.trim(copytext) == ''){
            copytext = "".HTMLDeCode(_this.html().replace(/<br\s*?\/?>/ig,'\n'));
        }
        my_command.load_copy(index, copytext);
        _this.find(".swf").remove();
    });
}

//0:question 1:answer
answer.editcode = function(){
    var nag = answer.toolbar.useragent();
    var tobj = null;
    var copyobj = null;
    //$(".code_block").unbind("mouseenter").bind("mouseenter",function(evt){
    $(".code_block").unbind('mouseover').bind("mouseover",function(e){
        if(answer.checkHover(e,this)){
            var cobj = $(this).children('.prettyprint');
            tobj = $(this).children('.tool');
            copyobj = $(this).children('.copy_code');
            answer.scroll = (parseInt(cobj.height()) >= 600) ? true : false;
            //var cobj = $(this);
            //var tobj = $(this).prev('.tool');
            var tmp_arr = $(this).closest(".codetitle").attr("rel").split(",");
            answer.show_tools(copyobj,tobj,parseInt(tmp_arr[2]));
            tobj.find(".edit_code").unbind("click").bind("click",function(){
                return false;
                var lang = cobj.attr("lang");
                lang = lang ? lang : 'other';
                var summary = encodeURIComponent($.trim(cobj.closest(".codetitle").attr("summary")));
                var type = parseInt(tmp_arr[2]);
                if(type == 0){
                    var qid = parseInt(tmp_arr[0]);
                    qus.qid = qid;
                }else{
                    var aid = parseInt(tmp_arr[0]);
                    answer.aid = aid;
                    qus.qid = parseInt(cobj.closest(".codetitle").attr("qid"));
                }
                var cw_mode = parseInt(tmp_arr[1]);
                var diff_length = cobj.text().length;
                //var old_content = encodeURIComponent($.trim($("#org_"+aid).text()));
                var lang_arr = ['ActionScript','Base Shell','C','C++','Css','C#','Delphi','Htm','Html','Java','Javascript','Matlab','Mxml','Perl','Php','Python','Ruby','Shell','Xhtml','Xslt'];
                lang_arr.push('Other');
                var lang_arr_option = ['as','bsh','c','cpp','cs','csh','delphi','htm','html','java','js','m','mxml','perl','php','py','rb','sh','xhtml','xml','xsl'];
                lang_arr_option.push('other');
                var lang_content = '<select id="language">';
                var add= '';
                var lang_value = '';
                for(var i = 0,j=lang_arr.length;i<j;i++){
                    var lang_con = lang_arr[i].toString().toLowerCase();
                    if(lang_con == lang){
                        add = ' selected ';
                    }else{
                        add = '';
                    }
                    lang_content +="<option value='"+lang_arr_option[i]+"'"+add+">"+lang_arr[i]+"</option>";
                }
                lang_content += "</select>";

                var edit_content = answer.code_content($.trim(cobj.html()),false);
                var  edit_info =
                '<div class="popdiv" id="poper_edit"><div class="wrap" style="padding-right:0px;" id="code_content_id"><div><table><tr><td><span style="padding:0 10px;">语言选择</span>'+lang_content+'</td></tr></table></div><div id="c" style="font-size:13px;margin:5px;padding:3px;text-align:left;"><textarea rows="15" cols="80" id="oll">' +  edit_content + '</textarea></div><div class="btn1"><span class="btns"><a class="cancel" href="javascript:void(0);">取消</a><a class="re submit" href="javascript:void(0)">确定</a></span></div></div></div>';
                var box = $('#wBox').wBox({
                    title: "编辑代码",
                    html: edit_info
                });
                box.showBox();
                $("#wBoxContent").css("text-align","center");
                //初始化按钮
                var submit = $('#wBox').find('.submit');
                var cancel = $('#wBox').find('.cancel');
                var ajaxurl = '';
                var ajaxdata = '';
                submit.unbind('click').click(function(){
                    var new_code = encodeURIComponent($("#oll").val());
                    if(type == 0){
                        var index = parseInt($("#qst_content").find(".prettyprint").index(cobj))+1;
                        ajaxurl = '/question/edit';
                        var title = encodeURIComponent($.trim(cobj.closest(".codetitle").attr("qtitle")));
                        var topic = $.trim(cobj.closest(".codetitle").attr("topic"));
                        ajaxdata = "id="+(qus.qid)+"&is_code=1&title="+title+"&index="+index+"&topic="+topic+"&topic_bak="+topic+"&suggest_topic=&summary="+summary+"&code="+new_code+"&cw_mode="+cw_mode+"&diff_len="+diff_length+"&improve=0&ajax=1&round="+Math.random()
                    }else if(type == 1){
                        var index = parseInt($("#ans_content_"+(answer.aid)).find(".prettyprint").index(cobj))+1;
                        ajaxurl = '/answer/edit';
                        ajaxdata = "id="+(answer.aid)+"&summary="+summary+"&code="+new_code+"&is_code=1&cw_mode="+cw_mode+"&index="+index+"&diff_len="+diff_length+"&improve=0&ajax=1&round="+Math.random();
                    }

                    $.ajax({
                        type: "POST",
                        url: ajaxurl,
                        data:ajaxdata,
                        success: function(msg){
                            var result = $.parseJSON( msg );
                            if (result.success != 0 ) {
                                box.close();
                                cobj.prev(".tool").css("display", "none");
                                DW.util.msg("编辑成功");
                                if(type == 0){
                                    location.href = '/q/'+(qus.qid)
                                }else{
                                    location.href = '/q/'+(qus.qid)+'#'+aid;
                                }
                            } else{
                                DW.util.msg(result.message);
                            }
                        }
                    });
                });

                cancel.unbind('click').click(function(){
                    box.close();
                    cobj.prev(".tool").css("display", "none");
                });

            });

            tobj.unbind("click").bind("click",function(){
                answer.showcode(copyobj,cobj,tobj);
            });
        }

    });

    //$(".code_block").unbind("mouseleave").bind("mouseleave",function(){
    $(".code_block").unbind('mouseout').bind("mouseout",function(e){
        if(answer.checkHover(e,this)){
            answer.hidden_tools(copyobj,$(this).children('.tool'));
        }
    });
};

answer.showcode = function(copyobj,cobj,tobj){
    var textarea_code = (answer.code_content($.trim(cobj.html()),false));
    var code = cobj.html();
    var lang = cobj.attr("lang");
    var t_arr = ['ActionScript','Base Shell','C','C++','Css','C#','Delphi','Htm','Html','Java','Javascript','Matlab','Mxml','Perl','Php','Python','Ruby','Shell','Xhtml','Xslt','其它'];
    var s_arr = ['as','bsh','c','cpp','cs','csh','delphi','htm','html','java','js','m','mxml','perl','php','py','rb','sh','xhtml','xsl','other'];
    for(var k = 0,j = s_arr.length; k < j; k++){
        if(lang == s_arr[k]){
            lang = t_arr[k];
            break;
        }
    }
    var box_title = '查看代码' + ' ('+lang+')';
    //var  code_info = '<div class="popdiv" id="poper_edit"><div class="wrap" id="viewcode_id"><div style="display:none" id="copycodeid"><textarea id="textarea_code" cols="80" rows="20">'+textarea_code+'</textarea></div><div>'+code+'</div><div class="btn1"><span><a class="cancel" id="copycode_id" href="javascript:void(0);">复制代码</a><a class="re submit" href="javascript:void(0)">关闭</a></span></div></div></div>';
    var  code_info = '<div class="popdiv" id="poper_edit"><div class="wrap" style="padding:5px 5px 5px 20px;" id="viewcode_id"><div>'+code+'</div></div></div>';
    var box = $('#wBox').wBox({
        title: box_title,
        html: code_info
    });
    box.showBox();
    $("#wBox").css({"left":"170px"});
    $("#poper_edit").css({"width":"850px"});
    $(".wrap").css({"background":"none"});
    $("#viewcode_id").find("ol").css({"max-height":"500px","overflow":"auto","word-wrap":"break-word"});
    answer.hidden_tools(copyobj,tobj);
};

//清除先前所发内容
answer.clearcontent = function(){
   $("#wmd-input").val('');
};

//设置最佳答案
answer.set_bestans = function(){
    $(function(){
        $(".setanswer").unbind("click").click(function(){
            var setanswer_obj = $(this);
            var setanswer_arr = setanswer_obj.attr("rel").split("|");
            var qid = parseInt(setanswer_arr[0]),aid = parseInt(setanswer_arr[1]);
            var has_good_answer = parseInt(setanswer_arr[2]);
            var my_id = parseInt(setanswer_arr[3]),old_answer_info = setanswer_arr[4],new_answer_info = setanswer_arr[5];
            var old_answer_arr = old_answer_info.split(",");
            var new_answer_arr = new_answer_info.split(",");
            var old_answer_uid = parseInt(old_answer_arr[0]),old_answer_uname = old_answer_arr[1],old_answer_wiki = parseInt(old_answer_arr[2]),old_answer_good_after_wiki = parseInt(old_answer_arr[3]),old_answer_pubuid = old_answer_arr[4] ? parseInt(old_answer_arr[4]) : 0;
            var new_answer_uid = parseInt(new_answer_arr[0]),new_answer_uname = new_answer_arr[1],new_answer_wiki = parseInt(new_answer_arr[2]),new_answer_pubuid = parseInt(new_answer_arr[3]) ? parseInt(new_answer_arr[3]) : 0;
            if(has_good_answer == 0){
                $.ajax({
                    type: "POST",
                    url: "/question/best_answer",
                    data: "qid="+qid+"&aid="+aid+"&ajax=1&round="+Math.random(),
                    success: function(msg){
                        var result = $.parseJSON( msg );
                        if (result.success == 1 ) {
                            location.href = '/q/'+qid;
                        } else{
                            DW.util.msg(result.message);
                        }
                    }
                });
            }else{
                var html_info = '';
                if(my_id == old_answer_uid){
                    if(my_id != new_answer_uid && new_answer_wiki == 0){
                        html_info = '因此<a target="_blank" href="/people/'+new_answer_pubuid+'">'+new_answer_uname+'</a>声誉值增加15分，您声誉值增加2分。';
                    }
                }else{
                    if(my_id == new_answer_uid){
                        html_info = '因此<a target="_blank" href="/people/'+old_answer_pubuid+'">'+old_answer_uname+'</a>声誉值15分和您声誉值2分将被收回。';
                    }else{
                        if(new_answer_wiki){
                            if(!old_answer_good_after_wiki){
                                html_info = '因此<a target="_blank" href="/people/'+old_answer_pubuid+'">'+old_answer_uname+'</a>声誉值15分和您声誉值2分将被收回。';
                            }
                        }else{
                            if(old_answer_good_after_wiki){
                                html_info = '因此<a target="_blank" href="/people/'+new_answer_pubuid+'">'+new_answer_uname+'</a>声誉值增加15分，您声誉值增加2分。';
                            }else{
                                html_info = '因此<a target="_blank" href="/people/'+old_answer_pubuid+'">'+old_answer_uname+'</a>声誉值15分将转给<a target="_blank" href="/people/'+new_answer_pubuid+'">'+new_answer_uname+'</a>。';
                            }
                        }
                    }
                }
                if($.trim(html_info) != ''){
                    confirm_info = "<font style='font-size:15px;text-align:center;font-weight:bold;'>只能有一个最佳答案，您确定要更换最佳答案？<br/></font><font style='color:#777;text-align:center;'>"+html_info+"</font>";
                }else{
                    confirm_info = "<font style='font-size:15px;text-align:center;font-weight:bold;'>只能有一个最佳答案，您确定要更换最佳答案？<br/></font>";
                }

                confirm_info =
                '<div class="popdiv" id="poper_bounty"><div class="wrap" id="bounty_content_id"><span style="font-size:13px;">' + confirm_info + '</span><div class="btn1"><span class="btns"><a class="cancel" href="javascript:void(0);">取消</a><a class="re submit" href="javascript:void(0)">确定</a></span></div></div></div>';
                var box = $('#wBox').wBox({
                    title: "更换最佳答案",
                    html: confirm_info
                });
                box.showBox();
                $("#wBoxContent").css("text-align","center");
                //初始化按钮
                submit = $('#wBox').find('.submit');
                cancel = $('#wBox').find('.cancel');
                submit.unbind('click').click(function(){
                    $.ajax({
                        type: "POST",
                        url: "/question/best_answer",
                        data: "qid="+qid+"&aid="+aid+"&ajax=1&round="+Math.random(),
                        success: function(msg){
                            var result = $.parseJSON( msg );
                            if (result.success == 1 ) {
                                box.close();
                                location.href = '/q/'+qid;
                                DW.util.msg("更换成功");
                            } else{
                                DW.util.msg(result.message);
                            }
                        }
                    });
                });
                cancel.unbind('click').click(function(){
                    box.close();
                });
            }
        });
    });
};
//end answer code

/************************String prorotype***************************/
//获取关键词位置
if(!String.prototype.getpos){
    String.prototype.getpos = function(mainstr,words){
        var offset = 0;
        var k = 0;
        var pos = [];
        var words_length = words.length;
        do{
            offset = mainstr.indexOf(words,offset);
            if(offset != -1){
                pos[k] = offset;
                ++k;
                offset += words_length;
            }
        }while(offset!=-1);
        return pos;
    };
}


//返回html解码
if(!String.prototype.HTMLDeCode){
    String.prototype.HTMLDeCode = function(str){
        var s = "";
        if(str.length == 0) return "";
        //s = str.replace(/&gt;/g,"&");
        s = str.replace(/&lt;/g,"<");
        s = s.replace(/&gt;/g,">");
        s = s.replace(/&nbsp;/g," ");
        //s = s.replace(/'/g,"\'");
        s = s.replace(/&quot;/g,"\"");
        s = s.replace(/<br>/g,"\n");
        s = s.replace(/&amp;/g,"&");
        return s;
    };
}

if(!String.prototype.copy){
    String.prototype.copy = function(txt){
        if(window.clipboardData) {
            window.clipboardData.clearData();
            window.clipboardData.setData("Text", txt);
            DW.util.msg("复制成功");
        } else if(navigator.userAgent.indexOf("Opera") != -1) {
            window.location = txt;
        } else if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                //DW.util.msg("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
                alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
            }
            var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
            if (!clip)  return;
            var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
            if (!trans) return;
            trans.addDataFlavor('text/unicode');
            var str = new Object();
            var len = new Object();
            var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            var copytext = txt;
            str.data = copytext;
            trans.setTransferData("text/unicode",str,copytext.length*2);
            var clipid = Components.interfaces.nsIClipboard;
            if (!clip) return false;
            clip.setData(trans,null,clipid.kGlobalClipboard);
            DW.util.msg("复制成功");
        }
    };
}

//选中文本中指定部分
if(!String.prototype.set_caret_position){
    String.prototype.set_caret_position = function(obj,start,end){
        if(document.selection){
            var i=obj.value.indexOf("\r",0);
            while(i!=-1&&i<end){
                end--;
                if(i<start){
                    start--;
                }
                i=obj.value.indexOf("\r",i+1);
            }
            var range=obj.createTextRange();
            range.collapse(true);
            range.moveStart('character',start);
            if(end!=undefined){
                range.moveEnd('character',end-start);
            }
            range.select();
        }else{
            obj.selectionStart=start;
            var sel_end=end==undefined?start:end;
            obj.selectionEnd=Math.min(sel_end,obj.value.length);
            obj.focus();
        }
    };
}

/*Object prototype*/
answer.contains = function(parentNode, childNode){
    if(parentNode.contains){
        return parentNode != childNode && parentNode.contains(childNode);
    }else{
        //return !!(parentNode.compareDocumentPosition(childNode) & 16);
    }
}

answer.getEvent = function(evt){
    return evt||window.event;
}

answer.checkHover = function(e,target){
    if (answer.getEvent(e).type == "mouseover"){
        return !answer.contains(target,answer.getEvent(e).relatedTarget||answer.getEvent(e).fromElement) && !((answer.getEvent(e).relatedTarget||answer.getEvent(e).fromElement)===target);
    }else{
        return !answer.contains(target,answer.getEvent(e).relatedTarget||answer.getEvent(e).toElement) && !((answer.getEvent(e).relatedTarget||answer.getEvent(e).toElement)===target);
    }
}

DW.LandingPage = (function($){
    var page,data;
    function init(page_data) {

       var page_html = '<div class="poprecommend"><div class="tit"><span class="c"></span></div><div class="cnt"><div class="poptabtit" id="poptabtit"><em class="active" id="relevance">相关推荐</em><em id="site_hot">社区热门</em></div><div class="poptabcnt" id="poptabcnt"><div class="popcntitem db">'+page_data.relevance+'</div><div class="popcntitem">'+page_data.hot+'</div></div></div><div class="fastask"><span style="color:#666;padding-right:20px;">当前有<b>'+page_data.online_cnt+'位</b>技术同行在线。</span>&nbsp;&nbsp;&nbsp;<a href="/fast_ask?q='+page_data.qid+'" class="askbtn">快速提问</a></div></div>';
       page = $(page_html).appendTo('body');

       //绑定关闭事件
       page.find('.c').unbind('click').click(function(){page.animate({right:-467+ "px"},200,function(){page.remove();});});

        //增加window scroll事件
        //window.addEventListener?window.addEventListener("scroll",toggle_page,false):window.attachEvent&&window.attachEvent("onscroll",toggle_page);

        //$(window).unbind('scroll').bind('scroll',toggle_page);
        //toggle_page();

        //tab 切换事件
        $("#relevance,#site_hot").unbind('click').click(function(){
            if($(this).attr('class') == 'active') return false;
             $('.popcntitem').removeClass('db').hide();
            if($(this).attr('id') == 'relevance') {
                $("#site_hot").removeClass('active');
                $('.popcntitem').eq(0).show();
            }else {
                DW.tip_layer.init_topic('.t_layer');
                DW.tip_layer.init_user('.u_layer');
                $("#relevance").removeClass('active');
                $('.popcntitem').eq(1).show();
            }
            $(this).addClass('active');
        });
        $('.list').find('a').unbind('click').click(function(){
            Cookies.set(cookie_prefix('temp_hash'),'#landingPage','','/');
        })
        //初始化事件
        DW.tip_layer.init_topic('.t_layer');
        DW.tip_layer.init_user('.u_layer');
        data = page_data;
    }
    toggle_page = function() {

        //var position_r = $(document).scrollTop() > $(window).height() ? 0 : '-467px';
        var position_r = $(document).scrollTop() > Math.ceil(($(document).height() - $(window).height())/3) ? 1 :'-467px';
        if($('.poprecommend').length == 0) {
            if($(document).scrollTop() <= Math.ceil(($(document).height() - $(window).height())/3)) {
                return init(data);
            }
        }
        page.stop().animate({right:position_r},200);
    }
    return {
        init:init
    }
})(jQuery);



$(function(){
    answer.clearcontent();
    answer.show_anstips();
    answer.addans();
    answer.set_bestans();
    answer.editcode();
    answer.copycode();
    qus.set_bounty();
    qus.invite_people_ans_qus();
});
