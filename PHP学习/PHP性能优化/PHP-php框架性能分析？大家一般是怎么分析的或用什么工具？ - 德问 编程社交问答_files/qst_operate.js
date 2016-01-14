/**问题操作**/
var QstMicroBar = (function($){
    var bar, cmt_input, timer, box, id, obj_type;

    //举报问题
    var spam = function()
    {
        if( !$.isEmptyObject( bar.find(('.spam')) ) )
        {
            bar.find(('.spam')).unbind('click').click(function(){
                if(DW.global.is_active == '0') {
                    DW.util.error_msg($(this),'您的账号未激活，暂不能举报问答。');
                    return false;
                }

                if(DW.global.prison == '1') {
                    DW.util.error_msg($(this),'您的账号当前被关禁闭，期间不能举报问答。');
                    return false;
                }
                var oFlag = new Flag();
                oFlag.init({id:id,type:'q'});
            });
        }
    }

    /**
     * 关闭
     */
    var close = function(is_listen)
    {
        var box, submit, cancel, postData = [],from = '';

        function suggest_close()
        {
            var close_type = $("#wBox input[name='close_radio']:checked").val();
            if(close_type == undefined)
            {
                return false;
            }
            var i=0, data=[];
            postData['question_id'] = id;
            postData['close_radio'] = close_type;
            postData['ajax'] = 1;
            postData['t'] = new Date().getTime();
            if(close_type != 5)
            {
                postData['redirect_qid'] = 0;
            }
            else
            {
                if( postData['redirect_qid'] == undefined)
                {
                    $("#wBox .postErr").text('请搜索选择可能重复问题').delay(3000).fadeOut();
                    $("#close_redirect_input").focus();
                    return;
                }
            }

            for(var key in postData)
            {
                data[i] = key +'='+ postData[key];
                i++;
            }
            $.ajax({
                type: "POST",
                url: "/question/close",
                data: data.join('&'),
                success:function(msg)
                {
                    var info_box, info;
                    var result = $.parseJSON( msg );
                    if(result.success == 0){
                        alert( result.message );
                    }
                    //成功关闭
                    else if(result.success == 1)
                    {
                        box.close();

                        //弹出提示层
                        info_box = $('#wBox').wBox({
                            noTitle:true,
                            drag:false,
                            opacity:0.1,
                            title: "系统提示",
                            html: '<div style="width:200px;">'+'问题已成功关闭'+'</div>',
                            timeout:800
                        });
                        info_box.showBox();

                        if(from == 'review') {
                            bar.find('.close').parents('#edit1').find('#edit_btn').prepend('<span id="close_tag">[已关闭]</span>');
                            bar.find('.close').removeClass('close').addClass('reopen').html('重开启').unbind('click').click(function(){
                                reopen(true);
                            });
                            return;
                        }

                        $('#ulmenu2').find('.close').removeClass('close').addClass('reopen').html('重新开启问题').unbind('click').click(function() {
                            reopen(true);
                        });

                        //信息组装
                        info = $.parseJSON( result.info );

                        //版本内容更新
                        var edit_btn = null;
                        var qst_conetnt = $('#qst_content');
                        if(qst_conetnt.find('#edit_btn').length)
                        {
                            edit_btn = qst_conetnt.find('#edit_btn').clone(true);
                        }
                        else if(qst_conetnt.find('.suggest_edit').length)
                        {
                            edit_btn = qst_conetnt.find('.suggest_edit').clone(true);
                        }
                        else if(qst_conetnt.find('.suggest_edited').length)
                        {
                            edit_btn = qst_conetnt.find('.suggest_edited').clone(true);
                        }
                        var cnt = qst_conetnt.html(info.content);
                        if( cnt.children('pre').last().length )
                        {
                            cnt.append(edit_btn);
                        }
                        else
                        {
                            cnt.children('p').last().append(edit_btn);
                        }

                        var s_editor = '<div class="eidtdiv"><div style="line-height:30px;color:#666;">'+info.rev_create_time+'被 <a href="'+info.rev_url+'">'+info.editor.name+'编辑</a></div><div class="clear"></div></div>';

                        $('#closed_time').html('这个问题已经在'+info.closed_time+'被关闭');
                        $('#closed_users').html('参与关闭投票者： '+info.closers);
                        $('#closed_reason').html('关闭原因：'+info.closed_reason);

                        if (info.show_reopen == 1) {
                            $('#show_reopen_div').show();
                        }
                        $('#close_wait').fadeOut(500);
                        $('#ans_editors').fadeOut(500);
                        $('#qst_closed').slideUp(400).delay(1000).fadeIn(500);

                        var top = $('#queue_status_info').offset().top - 30;
                        $("html,body").delay(800).animate({scrollTop: top}, 700, function(){});
                        //显示图片提示
                        DW.show_img_tip.init("/theme/images/close_tips.png");
                    }
                    //参与投票
                    else
                    {
                        box.close();

                        var remain_time = $('#close_vote_remain_time').text();
                        //发起投票
                        if (remain_time == 0) {
                            //弹出提示层
                            info_box = $('#wBox').wBox({
                                noTitle:true,
                                drag:false,
                                opacity:0.1,
                                title: "系统提示",
                                html: '<div style="width:200px;">'+'成功发起关闭问题的投票'+'</div>',
                                timeout:800
                            });
                            info_box.showBox();

                            $('#close_vote_remain_time').text('3天23小时59分');
                            $('#close_wait').slideUp(500).delay(1000).fadeIn(800);
                        } else {
                            //弹出提示层
                            info_box = $('#wBox').wBox({
                                noTitle:true,
                                drag:false,
                                opacity:0.1,
                                title: "系统提示",
                                html: '<div style="width:200px;">'+'感谢您参与投票'+'</div>',
                                timeout:800
                            });
                            info_box.showBox();
                        }

                        info = $.parseJSON( result.info );
                        var html = '<b>您已经投过关闭票</b> ('+info.voted_num+'/'+info.need_num+')';
                        $('#close_vote_btn').html(html);

                        var top = $('#queue_status_info').offset().top - 30;
                        $("html,body").delay(800).animate({scrollTop: top}, 700, function(){});

                    }
                    $('#ulmenu2').hide();
                }
            });
        }

        function deal_count(count, num)
        {
            if(count[num] !== undefined)
            {
                return '('+count[num]+')';
            }
            return '';
        }

        function redirect_func(rs)
        {
            $('#wBox #close_redirect_input').val(rs.text).blur();
            postData['redirect_qid'] = rs.id;
        }

        function create_box(res)
        {
            var count = res.votes_count, redirect_item='', redirect_list = '', redirect = res.redirect;

            for(var key in redirect)
            {
                var rc = redirect[key]['count'] > 1 ? '(<b>'+redirect[key]['count']+'</b>)' : '';

                redirect_list += '<p><a class="redirect_item" href="javascript:void(0)" rel="'+key+'">'+ redirect[key]['title'] +'</a><a target="_blank" href="'+ redirect[key]['url'] +'"><img src="/theme/images/link.gif" /></a>'+ rc +'</p>';
            }
            if(redirect_list != '')
            {
                redirect_list = '<p><strong>其他用户选择的可能重复的问题：</strong></p>' + redirect_list;
            }

            var close_html =
                '<div class="popdiv" id="poperclose"><div class="wrap">'+
                    '<div class="listct">' +
                        '<dl class="dllist">' +
                        '<dd><label><input type="radio" name="close_radio" value="1" class="close_radio" />脱离网站主题'+ deal_count(count, 1) +'</label>'+
                        '<div id="close_list_1" class="padl3 dis_no" style="display: none;">问题与编程或软件开发无关，脱离网站主题(如运维类、项目管理类、产品及运营类等)，对社群用户无实际价值。</div></dd>' +
                        '<dd><label><input type="radio" name="close_radio" value="6" class="close_radio" />问题太泛，立题太大'+ deal_count(count, 6) +'</label>'+
                        '<div id="close_list_6" class="padl3 dis_no" style="display: none;">问题宽泛，立题太大都会让人无从下手，答案往往泛泛而谈缺乏价值，甚至会导致漫无边际的灌水。</div></dd>' +
                        '<dd><label><input type="radio" name="close_radio" value="3" class="close_radio" />灌水刷分或入门级问题'+ deal_count(count, 3) +'</label>'+
                        '<div id="close_list_3" class="padl3 dis_no" style="display: none;">提问者未做功课与认真研究，有灌水刷分的嫌疑或属于入门级问题(缺乏知识性，只涉及简单事实与信息)。徳问的目标是成为一个能够为编程难题提供高效解答的社群，由专家驱动，用户没有精力和意愿回答此类问题。内容水化会导致社群偏离目标，因此请勿提问那些容易从搜索引擎、技术手册上获取答案的入门级问题。</div></dd>' +
                        '<dd><label><input type="radio" name="close_radio" value="2" class="close_radio" />非实际问题'+ deal_count(count, 2) +'</label>'+
                        '<div id="close_list_2" class="padl3 dis_no" style="display: none;">不以解决实际问题为目的，一般包括：<br /><span style="margin-top:6px;float:left;width:100%;">1. 抒发个人观点和看法，不寻求解答，不适合以问题形式出现；<br />2. 完全出于个人臆造，非实际出现过的技术问题；<br />3. 为了调查搜集他人的经验、建议与观点；</span><div class="clear" ></div></div></dd>' +
                        '<dd><label><input type="radio" name="close_radio" value="4" class="close_radio" />含混不清或书写严重错误'+ deal_count(count, 4) +'</label>'+
                        '<div id="close_list_4" class="padl3 dis_no" style="display: none;">1. 问题从标题到描述都含混不清，立题不准，传达信息不全面，导致用户无法定位问题给出准确解答；<br />2. 描述存在严重的排版与书写错误，即使再次修改也无济于事；</div></dd>' +
                        '<dd><label><input type="radio" name="close_radio" value="5" class="close_radio" />与其他问题完全重复'+ deal_count(count, 5) +'</label>'+
                        '<div id="close_list_5" class="padl3 dis_no close_redirect" style="display: none;">'+
                        '<p>搜索已经存在的完全重复的问题：<span class="postErr"></span></p>'+
                        '<p><input id="close_redirect_input" class="seach_input" type="text" /><input type="hidden" id="redirect_qid" value="0" /></p>'+
                        redirect_list +
                        '(输入"关键词"或"#+问题ID"方式来定位相似问题)</div></dd>' +
                        '</dl>' +
                    '</div>' +
                    '<div class="btn1">' +
                        '<span class="f"><b>'+ res.remain_votes +'</b>您今天还可以使用的关闭问题投票数</span>' +
                        '<span class="btns"><a class="cancel" href="javascript:void(0);">取消</a>\n\
                        <a class="re submit" href="javascript:void(0)">提交</a></span>'+
                    '</div>' +
                    '<div class="hei20"></div>' +
                '</div></div>';
            box = $('#wBox').wBox({
                title: "这不是一个好问题，需要关闭，具体原因是：",
                html: close_html
            });
            box.showBox();

            //radio框点击事件
            var cradio = $('#wBox').find('.close_radio');
            cradio.unbind('click').click(function(){
                //显示描述
                radio('close_list_', $(this).val(), 6);
            });

            //初始化按钮
            submit = $('#wBox').find('.submit');
            cancel = $('#wBox').find('.cancel');

            submit.unbind('click').click(function(){
                suggest_close();
            });
            cancel.unbind('click').click(function(){
                box.close();
            });

            setup_suggest({id:'close_redirect_input',filter:'3',func:function(msg){redirect_func(msg)},link:false, state:false, rs:false, filter_id:id, extension:{
                display_callback: function(result, is_link, state, filter_id){
                    return DW.util.close_suggest_list(result, is_link, state, filter_id);
                },
                input_callback: function(str, kw) {
                    var result = str.match(/\(ID:\s*(\d+)\)/i);
                    if( kw.indexOf( result[1] ) != -1 ) {
                        return true;
                    }
                    return false;
                }
            }});

            $('#wBox').find('.redirect_item').click(function(){
                $('#wBox').find('#redirect_qid').val($(this).attr('rel'));
                postData['redirect_qid'] = $(this).attr('rel');
                $('#wBox').find('#close_redirect_input').val($(this).text());
            });
        }

        function show_box(id)
        {
            $.ajax({
                type: "POST",
                url: "/ajax/get_close_info",
                data: "qid="+ id +"&ajax=1" +'&'+ new Date().getTime(),
                success:function(msg)
                {
                    var result = $.parseJSON( msg );
                    if (result.success == 1){
                        var res = result.message;
                        create_box(res);
                    } else {
                        //alert( result.message );
                        DW.util.msg_box('#queue_vote_info', result.message, 300);
                        var top = $('#queue_status_info').offset().top - 200;
                        $("html,body").delay(500).animate({scrollTop: top}, 700, function(){});
                    }
                }
            });
        }

        function click_close() {
            show_box(id);
            $('#ulmenu2').css('display', 'none');
        }

        from = bar.find('.close').attr('from');
        if (is_listen === true) {
            click_close();
        } else {
            if( !$.isEmptyObject( bar.find(('.close')) ) )
            {
                bar.find(('.close')).unbind('click').click(function(){
                    click_close();
                });
            }
        }
    }

    /**
     * 悬赏
     */
    var bounty = function()
    {
        var box, submit, cancel,my_points;

        function bounty_start(points)
        {
            $.ajax({
                type: "POST",
                url: "/question/bounty",
                data: "qid="+id+"&points="+points+"&ajax=1",
                success:function(msg) {
                    var result = $.parseJSON( msg );
                    if(result.success == 0){
                        DW.util.msg_box('#poper_bounty', result.message, 0);
                    } else {
                        box.close();
                        $('#ulmenu2').hide();

                        var info = $.parseJSON(result.message);
                        $('#bounty_user').html(info.bounty_user);
                        $('#bounty_num').text(info.bounty_num);
                        $('#bounty_deadline').text(info.bounty_deadline);
                        $('#bounty_status').slideUp(500).delay(1000).fadeIn(800);
                        var name = $(info.bounty_user).text();
                        if($('#title').find("a").find(".featured_num").length == 0){
                        	$('#title').find("#edit_btn").before('<span style="cursor:pointer;" class="featured_num" title="该问题由'+(name)+'发起声誉值+'+(info.bounty_num)+'分的悬赏">+'+info.bounty_num+'</span>');
                        }
                        //移除title旁的悬赏按钮
                        $('#bounty_btn').remove();
                        $(".author_box").find(".list_tt").find(".small-box").each(function(){
                            $(this).find(".xuanshang").remove();
                            //删除答案不显示按钮
                            var ans_isdeleted=$(this).parent().parent().parent().find(".floatul").find("li:eq(2)").find(".ans_deleted").length;
                            if(ans_isdeleted){
                                add = '  style="display:none;"  ';
                            }else{
                                add = '';
                            }
                            if($(this).find("a").length > 0){
                                if($(this).find(".bounty_send1").length == 0){
                                    if($(this).find(".bounty_layer").length > 0){
                                        $(this).find(".bounty_layer").after('<span'+add+'  class="bounty_send1" title="悬赏发布不足24小时，悬赏声誉值将不能够分配">+'+info.bounty_num+'</span>');
                                    }else{
                                        $(this).find("a").after('<span'+add+'  class="bounty_send1" title="悬赏发布不足24小时，悬赏声誉值将不能够分配">+'+info.bounty_num+'</span>');
                                    }
                                }
                            }else{
                                $(this).append('<a'+add+' id="s" class="xuanshang"><span  class="bounty_send1" title="悬赏发布不足24小时，悬赏声誉值将不能够分配">+'+info.bounty_num+'</span></a>');
                            }
                        });
                        DW.util.msg("悬赏成功");
                    }
                }
            });
        }

        function create_box(bounty_html)
        {
            var html =
                '<div class="popdiv" id="poper_bounty"><div class="wrap" id="bounty_content_id">' + bounty_html + '</div></div>';

            box = $('#wBox').wBox({
                title: "发起悬赏",
                html: html
            });
            box.showBox();

            //初始化按钮
            submit = $('#wBox').find('.submit');
            cancel = $('#wBox').find('.cancel');
            points_change = $('#wBox').find("#bounty_points");
            textarea_id = $('#wBox').find('#u51_rtf');

            textarea_id.click(function(){
            	var is_display = $("#fengpeiyuanze").css("display");
            	if(is_display == "none"){
            		$("#fengpeiyuanze").show();
            		$("#img_id").attr("src","/theme/images/retract.png");
            	}else{
            		$("#fengpeiyuanze").hide();
            		$("#img_id").attr("src","/theme/images/more_down.png");
            	}
            });

            points_change.unbind('change  focus blur').bind('focus',function(){
               textarea_id.unbind('click');
            }).bind('blur',function(){
	            textarea_id.click(function(){
	            	var is_display = $("#fengpeiyuanze").css("display");
	            	if(is_display == "none"){
	            		$("#fengpeiyuanze").show();
	            		$("#img_id").attr("src","/theme/images/retract.png");
	            	}else{
	            		$("#fengpeiyuanze").hide();
	            		$("#img_id").attr("src","/theme/images/more_down.png");
	            	}
	            });
            }).bind('change',function(e){
	            $("#fengpeiyuanze").hide();
    		});

            submit.unbind('click').click(function(){
                var points = $('#bounty_points option:selected').val();
                bounty_start(points);
            });
            cancel.unbind('click').click(function(){
                box.close();
            });
        }

        //检查是否存在悬赏
        function check_bounty() {
            var bounty_html_start = '<div id="u51_rtf" style="cursor:help">' +
                            '<div style="font-size:15px;">提供您声誉值中的';

            var bounty_html_middle = ' <select id="bounty_points" name="bounty_points">';
            var add;
            for(var i = 50;i<=500;i=i+50){

                if(my_points <= i){
                    add = " disabled ";
                }else{
                    add = '';
                }

            	bounty_html_middle += '<option value="'+i+'"'+add+'>'+i+'</option>';
            }
            bounty_html_middle += '</select> ';
            var bounty_html_end = '<div style="display:inline;" id="u51_rtf_back">分为该问题悬赏，确认提交后，悬赏将无法被撤销。<a href="javascript:void(0);"><span style="color:#004B73;">详细规则</span><b class=""></b><img id="img_id" src="/theme/images/more_down.png"/></a></div></div>'+
            			'<div  id="fengpeiyuanze" style="display:none;background:#fafafa;font-size:13px;margin-top:15px;padding:5px 2px;color:#5C605F;"><div style="margin:10px;"><div style="margin-bottom:10px;">7天悬赏期内，悬赏者可将全部悬赏声誉值颁发给一位回答者。</div>'+
						'若悬赏者未在有效期内分配悬赏，德问系统将自动将一半悬赏声誉值分配给悬赏开始后获得正投票数最多（两票或两票以上）的答案，另一半悬赏声誉值没收；如果没有符合上述标准的答案，则悬赏声誉值全部没收。</div>'+
					'</div></div>'+
                    '<div class="btn1">' +
                        '<span class="btns"><a href="javascript:void(0);" class="cancel">取消</a>' +
                            '<a href="javascript:void(0)" class="re submit">提交</a>' +
                        '</span>' +
                    '</div>';
        	var bounty_html = bounty_html_start + bounty_html_middle + bounty_html_end;

            $.ajax({
                type: "POST",
                url: "/ajax/check_user_bounty",
                data: "ajax=1",
                success:function(msg)
                {
                    var result = $.parseJSON( msg );
                    if(result.success == 0){
                        alert(result.message);

                    } else if (result.success == 2) {
                        var res = $.parseJSON(result.message);
                        bounty_html = '<div id="u51_rtf"><span style="font-size:15px;">您尚有未结束的悬赏, 请颁发悬赏后再另发布新的悬赏。</span><br /><a href="/q/'+res.qid+'">'+res.title+'</a></div>';

                    }
                    create_box(bounty_html);
                }
            });
        }

        if( !$.isEmptyObject( bar.find(('.bounty')) ) )
        {
            if($(".layer_head").find("b:first").text().indexOf('K') != -1) {
                var t = $(".layer_head").find("b:first").text();
                t = t.substr(0,t.length -1);
                my_points = parseInt(t*1000);
            }else {
                my_points = parseInt($(".layer_head").find("b:first").text());
            }
        	bar.find(('.bounty')).unbind('click').click(function(){
                if(DW.global.is_active == '0') {
                    DW.util.error_msg($(this),'您的账号未激活，暂不能悬赏问题。');
                    return false;
                }
        	    if(DW.global.prison == '1') {
                    DW.util.msg('您的账号当前被关禁闭，期间不能悬赏问题。',3000);
                    return false;
                }
                check_bounty();
            });
        }
    }

    /**
     * 重开
     */
    var reopen = function(is_listen)
    {
        var from = '';
        function question_unclose()
        {
            $.ajax({
                type: "POST",
                url: "/question/unclose",
                data: "&question_id="+$("#question_id").val()+"&ajax=1",
                success:function(msg)
                {
                    var info_box;
                    var result = $.parseJSON( msg );
                    if (result.success == 0) {
                        alert(result.message);
                    } else if (result.success == 1) {
                        var remain_time = $('#reopen_vote_remain_time').text();
                        if (remain_time == 0) {
                            //弹出提示层
                            info_box = $('#wBox').wBox({
                                noTitle:true,
                                drag:false,
                                opacity:0.1,
                                title: "系统提示",
                                html: '<div style="width:200px;">'+'成功发起重新开启问题的投票'+'</div>',
                                timeout:800
                            });
                            info_box.showBox();

                            $('#qst_closed').hide();
                            $('#reopen_vote_remain_time').text('3天23小时59分');
                            $('#reopen_wait').slideUp(400).delay(1000).fadeIn(400);
                        } else {
                            //弹出提示层
                            info_box = $('#wBox').wBox({
                                noTitle:true,
                                drag:false,
                                opacity:0.1,
                                title: "系统提示",
                                html: '<div style="width:200px;">'+'感谢您参与投票'+'</div>',
                                timeout:1800
                            });
                            info_box.showBox();
                        }

                        var info = $.parseJSON( result.info );
                        var html = '<b>您已经投过重开启票</b> ('+info.voted_num+'/'+info.need_num+')';
                        $('#reopen_vote_btn').html(html);

                        var top = $('#queue_status_info').offset().top - 30;
                        $("html,body").delay(800).animate({scrollTop: top}, 700);

                    } else {
                        //弹出提示层
                        info_box = $('#wBox').wBox({
                            noTitle:true,
                            drag:false,
                            opacity:0.1,
                            title: "系统提示",
                            html: '<div style="width:200px;">'+'重新开启问题成功'+'</div>',
                            timeout:800
                        });
                        info_box.showBox();

                        if(from == 'review') {
                            bar.find('.reopen').parents('#edit1').find('#close_tag').remove();
                            bar.find('.reopen').removeClass('reopen').addClass('close').html('关闭').unbind('click').click(function(){
                                close(true);
                            });
                            return;
                        }
                        $('#ulmenu2').find('.reopen').removeClass('reopen').addClass('close').html('关闭问题').unbind('click').click(function() {
                            close(true);
                        });

                        $('#reopen_wait').fadeOut(400);
                        $('#qst_closed').fadeOut(400);
                    }
                    $('#ulmenu2').hide();
                }
            });
        }

        function click_reopen() {
            var res = confirm('确认要重新开启该问题吗？');
            if (res) {
                question_unclose();
            }
        }

        from = bar.find('.reopen').attr('from');
        if (is_listen === true) {
             click_reopen();
        } else {
            if( !$.isEmptyObject( bar.find(('.reopen')) ) )
            {
                bar.find(('.reopen')).unbind('click').click(function(){
                    click_reopen();
                });
            }
        }
    }

    /**
     * 删除
     */
    var del = function(is_listen)
    {
        var box;
        function question_del()
        {
            $.ajax({
                type: "POST",
                url: "/question/del",
                data: "&question_id="+id+"&ajax=1",
                success:function(msg)
                {
                    var result = $.parseJSON( msg );
                    if (result.success == 0) { //成功删除
                        alert( result.message );
                    } else if(result.success == 2) {
                        //弹出提示层
                        info_box = $('#wBox').wBox({
                            noTitle:true,
                            drag:false,
                            opacity:0.1,
                            title: "系统提示",
                            html: '<div style="width:200px;">'+'成功删除该问题'+'</div>',
                            timeout:800
                        });
                        info_box.showBox();

                        $('#ulmenu2').find('.del').removeClass('del').addClass('undel').html('取消删除问题').unbind('click').click(function() {
                            undel(true);
                        });

                        if ($('#delete_wait').lengh != 0) {
                            $('#delete_wait').fadeOut();
                        }
                        $('#qst_deleted').delay(400);
                        $('#qst_deleted').slideUp(500).delay(1000).fadeIn(800);

                        var top = $('#queue_status_info').offset().top - 30;
                        $("html,body").delay(800).animate({scrollTop: top}, 700);
                    } else {//进行中
                        var remain_time = $('#delete_vote_remain_time').text();
                        //发起投票
                        if (remain_time == 0) {
                            //弹出提示层
                            info_box = $('#wBox').wBox({
                                noTitle:true,
                                drag:false,
                                opacity:0.1,
                                title: "系统提示",
                                html: '<div style="width:200px;">'+'成功发起删除问题的投票'+'</div>',
                                timeout:800
                            });
                            info_box.showBox();

                            $('#qst_closed').fadeOut(500);
                            $('#delete_vote_remain_time').text('3天23小时59分');
                            $('#delete_wait').slideUp(500).delay(1000).fadeIn(800);
                        } else {
                            //弹出提示层
                            info_box = $('#wBox').wBox({
                                noTitle:true,
                                drag:false,
                                opacity:0.1,
                                title: "系统提示",
                                html: '<div style="width:200px;">'+'感谢您参与'+'</div>',
                                timeout:800
                            });
                            info_box.showBox();
                        }

                        var info = $.parseJSON( result.info );
                        var html = '<b>您已经投过删除票</b> ('+info.voted_num+'/'+info.need_num+')';
                        $('#delete_vote_btn').html(html);

                        var top = $('#queue_status_info').offset().top - 30;
                        $("html,body").delay(800).animate({scrollTop: top}, 700);
                    }
                    $('#ulmenu2').hide();
                    box.close();
                }
            });
        }

        function click_del() {
            var html =
                '<div class="popdiv" id="poper_bounty" style="width:420px;"><div class="wrap" id="bounty_content_id"> <div style="font-size:15px;">您确定要删除该问题？ </div>';
            html += '<div class="btn1">' +
                        '<span class="btns"><a href="javascript:void(0);" class="cancel">取消</a>' +
                            '<a href="javascript:void(0)" class="re submit">确定</a>' +
                        '</span></div></div></div>';
            box = $('#wBox').wBox({
                title: "删除问题",
                html: html
            });
            box.showBox();

            //初始化按钮
            submit = $('#wBox').find('.submit');
            cancel = $('#wBox').find('.cancel');

            //var res = confirm('确认删除该问题？');
            submit.unbind('click').click(function(){
                question_del();
                $('#ulmenu2').css('display', 'none');
                box.close();
            });
            cancel.unbind('click').click(function(){
               box.close();
            });
        }

        if (is_listen === true) {
            click_del();
        } else {
            if( !$.isEmptyObject( bar.find(('.del')) ) )
            {
                bar.find(('.del')).unbind('click').click(function(){
                    click_del();
                });
            }
        }
    }

    /**
     * 取消删除
     */
    var undel = function(is_listen)
    {
        var box;
        function question_undel()
        {
            $.ajax({
                type: "POST",
                url: "/question/undel",
                data: "&question_id="+id+"&ajax=1",
                success:function(msg)
                {
                    var result = $.parseJSON( msg );
                    if (result.success == 0) {
                        alert( result.message );
                    } else {
                        //弹出提示层
                        info_box = $('#wBox').wBox({
                            noTitle:true,
                            drag:false,
                            opacity:0.1,
                            title: "系统提示",
                            html: '<div style="width:200px;">'+'成功取消删除该问题'+'</div>',
                            timeout:800
                        });
                        info_box.showBox();

                        $('#ulmenu2').find('.undel').removeClass('undel').addClass('del').html('删除问题').unbind('click').click(function() {
                            del(true);
                        });

                        $('#qst_deleted').slideUp(500).delay(1000).fadeOut();
                    }
                    $('#ulmenu2').hide();
                }
            });
        }

        function click_undelete() {
            var html =
                '<div class="popdiv" id="poper_bounty" style="width:420px;"><div class="wrap" id="bounty_content_id"> <div style="font-size:15px;">您确定要取消删除该问题？ </div>';
            html += '<div class="btn1">' +
                        '<span class="btns"><a href="javascript:void(0);" class="cancel">取消</a>' +
                            '<a href="javascript:void(0)" class="re submit">确定</a>' +
                        '</span></div></div></div>';
            box = $('#wBox').wBox({
                title: "取消删除问题",
                html: html
            });
            box.showBox();

            //初始化按钮
            submit = $('#wBox').find('.submit');
            cancel = $('#wBox').find('.cancel');

            submit.unbind('click').click(function(){
                question_undel();
                $('#ulmenu2').css('display', 'none');
                box.close();
            });
            cancel.unbind('click').click(function(){
               box.close();
            });
        }

        if (is_listen === true) {
            click_undelete();
        } else {
            if( !$.isEmptyObject( bar.find(('.undel')) ) )
            {
                bar.find(('.undel')).unbind('click').click(function(){
                    click_undelete();
                });
            }
        }
    }

    //锁定问题
    var lock = function(is_listen) {
        var lock_box,obj;
        var create_box = function (type) {
            $('#ulmenu2').css('display', 'none');
            $.ajax({
                type: "POST",
                url: "/ajax/get_lock_box",
                data: 'type='+type,
                success:function(data)
                {
                    var result = $.parseJSON( data );
                    if (result.success) {
                        lock_box = $('#wBox').wBox({
                                                    title: "我要锁定这个问题，原因是：",
                                                    html: result.msg
                                                   });
                        lock_box.showBox();

                        //初始化按钮
                        $('#wBox').find('.submit').unbind('click').click(function(){
                            lock_action();
                            $('#ulmenu2').css('display', 'none');
                        });
                        $('#wBox').find('.cancel').unbind('click').click(function(){
                            lock_box.close();
                        });
                    } else {
                        alert( result.msg );
                    }
                }
            });
        }

        //锁定操作
        var lock_action = function() {
            $.ajax({
                type:'post',
                url:'/question/operate',
                beforeSend:function(xhr,s){
					var lock_type = 0;
                    $(':radio').each(function() {
                        if($(this).is(':checked')) {
						    lock_type = $(this).val();
						}
                    })
					if(lock_type == 0) {
					    //alert("请选择一个锁定类型");
						return false;
					} else {
					    s.data += '&lock_type='+lock_type;
					}
                } ,
                data:'act=lock&qid='+id,
                success:function(data) {
					var res = $.parseJSON(data);
					if(res.success) {
					   lock_box.close();
					   var url = window.location.href;
					   if(url.indexOf('#') > -1) {
                           url = url.substr(0,url.indexOf('#')) + '#qst_locked';
					       window.location.href = url;
					   } else {
					       window.location.href = url+'#qst_locked';
					   }
					   window.location.reload(true);
					} else {
					   alert(res.msg);
					}
                }
            })
        }

		if(is_listen === true) {
			obj = bar.find('.lock');
            create_box(3);
		} else {
			if( !$.isEmptyObject( bar.find('.lock') ) )
			{
				bar.find('.lock').unbind('click').click(function(){
					obj = $(this);
					create_box(3);
				});
			}
		}
    }

    //解锁问题
    var unlock = function(is_listen) {
        var obj;
        function unlock_action() {
            $('#ulmenu2').css('display', 'none');
			if(window.confirm('确定要解除锁定该问题吗？')) {
				$.ajax({
				    type:'post',
					url:'/question/operate',
					data:'act=unlock&qid='+id,
					success:function(data) {
					    var res = $.parseJSON(data);
						if(res.success) {
    					    var url = window.location.href;
    					    if(url.indexOf('#qst_locked') > -1) {
    					        window.location.href = url.substr(0,url.indexOf('#'));
    					   } else {
    					        window.location.reload();
    					   }
						} else {
						    alert(res.msg);
						}
					}
				});
			}
        }

        if(is_listen === true) {
			obj = bar.find('.unlock');
			unlock_action();
		} else {
			if( !$.isEmptyObject( bar.find('.unlock') ) )
			{
				bar.find('.unlock').unbind('click').click(function(){
					obj = $(this);
					unlock_action();
				});
			}
		}
    }

    //保护问题
    var protect = function(is_listen) {
        var obj,protect_box;

		function create_box() {
            $.ajax({
			    type:'post',
				url:'/ajax/get_confirm_box',
				data:'act=protect&type=3',
				success:function(data) {
				    var res = $.parseJSON(data);
					if(res.success) {
						protect_box = $('#wBox').wBox({
							title: "保护该问题",
							html: res.msg
						});
						protect_box.showBox();
						//初始化按钮
						$('#wBox').find('.submit').unbind('click').click(function(){
							protect_action();
							$('#ulmenu2').css('display', 'none');
							protect_box.close();
						});
						$('#wBox').find('.cancel').unbind('click').click(function(){
							protect_box.close();
						});
					} else {
					    alert(res.msg);
					}
				}
			});
		}

        function protect_action() {
            $('#ulmenu2').css('display', 'none');
			$.ajax({
				type:'post',
				url:'/question/operate',
				data:'act=protect&qid='+id,
				success:function(data) {
					var res = $.parseJSON(data);
					if(res.success) {
					   var url = window.location.href;
					   if(url.indexOf('#') > -1) {
					       url = url.substr(0,url.indexOf('#')) + '#qst_protected'
					       window.location.href = url;
					   } else {
					       window.location.href = url+'#qst_protected';
					   }
					   window.location.reload(true);
					} else {
						alert(res.msg);
					}
				}
			});
        }

        if(is_listen === true) {
			obj = bar.find('.protect');
			create_box();
		} else {
			if( !$.isEmptyObject( bar.find('.protect') ) )
			{
				bar.find('.protect').unbind('click').click(function(){
					obj = $(this);
					create_box();
				});
			}
		}
    }

    //解除保护
    var unprotect = function(is_listen) {
        var obj;
        function unprotect_action() {
            $('#ulmenu2').css('display', 'none');
			if(window.confirm('确定要取消保护该问题吗？')) {
				$.ajax({
				    type:'post',
					url:'/question/operate',
					data:'act=unprotect&qid='+id,
					success:function(data) {
					    var res = $.parseJSON(data);
						if(res.success) {
    					    var url = window.location.href;
    					    if(url.indexOf('#qst_protected') > -1) {
    					        window.location.href = url.substr(0,url.indexOf('#'));
    					    } else {
    					        window.location.reload();
    					    }
						} else {
						    alert(res.msg);
						}
					}
				});
			}
        }

        if(is_listen === true) {
			obj = bar.find('.unprotect');
			unprotect_action();
		} else {
			if( !$.isEmptyObject( bar.find('.unprotect') ) )
			{
				bar.find('.unprotect').unbind('click').click(function(){
					obj = $(this);
					unprotect_action();
				});
			}
		}
    }

    var init = function()
    {
        try{
            bar = $('.microbar, .titbar');
            var rel = bar.attr('rel').split(',');
            obj_type = rel[0];
            id = rel[1];
            //初始化
            spam();
            close();
            bounty();
            reopen();
            del();
            undel();
            lock();
			unlock();
			protect();
			unprotect();
            //throw new Error('1111');
        } catch (e) {
            //alert( e.message);
        }
    }

    return {
        init:init
    }
})(jQuery);

//问题的微操作
var AnsMicroBar = (function($){
    var p, aid;

    //删除答案
    var del_answer = function(is_listen) {
        //ajax请求
        function request_del() {
            var html =
                '<div class="popdiv" id="poper_bounty" style="width:420px;"><div class="wrap" id="bounty_content_id"> <div style="font-size:15px;">您确定要删除该答案？</div>';
           html += '<div class="btn1">' +
                        '<span class="btns"><a href="javascript:void(0);" class="cancel">取消</a>' +
                            '<a href="javascript:void(0)" class="re submit">确定</a>' +
                        '</span></div></div></div>';
            box = $('#wBox').wBox({
                title: "删除答案",
                html: html
            });
            box.showBox();

            //初始化按钮
            submit = $('#wBox').find('.submit');
            cancel = $('#wBox').find('.cancel');

            cancel.unbind('click').click(function(){
               box.close();
            });
            submit.unbind('click').click(function(){
               $.ajax({
                    type: "POST",
                    url: "/answer/del",
                    data: "answer_id="+aid+"&ajax=1",
                    success: function(msg){
                        var result = $.parseJSON( msg );
                        if (result.success == 1) {
                            $('.del_answer[rel='+aid+']').unbind('click').click(function() {
                                aid = $(this).attr('rel');
                                undel_answer(true);
                            }).removeClass('del_answer').addClass('undel_answer').text('取消删除');
                        }
                        else if (result.success == 2) {
                            var info = $.parseJSON(result.message);
                            var text = '删除('+info.delete_num+')';
                            p.find('.del_answer').text(text);
                        }
                        else {
                            DW.util.msg(result.message);
                        }
                         box.close();
                         $("#del_answer_"+aid).slideUp(300).delay(400).fadeIn(800);
                         var answer_num_info = $(".answers_num").find("span:first").text();
                         var answer_reg = /[0-9]+/i;
                         var answer_match = answer_num_info.match(answer_reg);
                         $(".answers_num").find("span:first").text((parseInt(answer_match) - 1) + '个答案');
                         $("#update"+aid).css("display","none");
                         $("#"+aid).find(".xuanshang").css("display","none");
                         $("#"+aid).find(".bounty_send1").css("display","none");
                         //$("#del_answer_"+aid).css("display","block");
                         var tmpinfo = $("#del_answer_"+aid).attr("rel");
                         var tmp_arr = tmpinfo.split("|");
                         var auid = parseInt(tmp_arr[0]),muid = parseInt(tmp_arr[1]),mutype = parseInt(tmp_arr[2]);
                         //第一次管理员删除自己情况
                         if(mutype = 2 && auid != muid && ($.trim($("#del_answer_"+aid).find("#qst_deleted").text()) == '')){
                             var htmlinfo = '<div style="margin-left: 5px;">该答案已被删除，仅协调员和原作者可见该答案。</div>'+
                                            '<span style="color:#666666;font-size:12px;margin-left: 5px;">请在现有答案基础上改进，协管员会审查并做出是否取消删除的判断。</span>';
                             $("#del_answer_"+aid).find("#qst_deleted").attr("rel","first")
                             $("#del_answer_"+aid).find("#qst_deleted").html(htmlinfo);
                         }else if(auid == muid && ($.trim($("#del_answer_"+aid).find("#qst_deleted").text()) == '')){
                             //自己删除自己（包括管理员自己删除自己情况）
                             var htmlinfo = '<div style="margin-left: 5px;">该答案已被删除，仅协调员和原作者可见该答案。</div>'+
                                            '<span style="color:#666666;font-size:12px;margin-left: 5px;">一个问题您只能发布一个答案，请尽可能完善现有答案再取消删除。</span>';
                             $("#del_answer_"+aid).find("#qst_deleted").attr("rel","first")
                             $("#del_answer_"+aid).find("#qst_deleted").html(htmlinfo);
                         }
                    }
                });
            });
        }

        if (is_listen === true) {
            request_del();
        } else {
            $('.del_answer').unbind('click').click(function(){
                if(DW.global.is_active == '0') {
                    DW.util.error_msg($(this),'您的账号未激活，暂不能操作该功能。');
                    return false;
                }
                if(DW.global.prison == '1') {
                    DW.util.error_msg($(this),'您的账号当前被关禁闭，期间不能操作该功能');
                    return false;
                }
                p = $(this).parent();
                aid = p.attr('rel');
                request_del();
            });
        }
    };

    //取消删除答案
    var undel_answer = function(is_listen) {

        //ajax请求
        function request_undel() {
            var html =
                '<div class="popdiv" id="poper_bounty" style="width:420px;"><div class="wrap" id="bounty_content_id"> <div style="font-size:15px;">您确定要取消删除？</div>';
           html += '<div class="btn1">' +
                        '<span class="btns"><a href="javascript:void(0);" class="cancel">取消</a>' +
                            '<a href="javascript:void(0)" class="re submit">确定</a>' +
                        '</span></div></div></div>';
            box = $('#wBox').wBox({
                title: "取消删除答案",
                html: html
            });
            box.showBox();

            //初始化按钮
            submit = $('#wBox').find('.submit');
            cancel = $('#wBox').find('.cancel');

            cancel.unbind('click').click(function(){
               box.close();
            });
            submit.unbind('click').click(function(){
                $.ajax({
                    type: "POST",
                    url: "/answer/undel",
                    data: "answer_id="+aid+"&ajax=1",
                    success: function(msg){
                        var result = $.parseJSON( msg );
                        if (result.success == 1) {
                            $('.undel_answer[rel='+aid+']').removeClass('undel_answer').addClass('del_answer').text('删除').unbind('click').click(function() {
                                aid = $(this).attr('rel');
                                del_answer(true);
                            });
                        } else {
                            DW.util.msg(result.message);
                        }
                        box.close();
                        $("#del_answer_"+aid).slideUp(500).delay(800).fadeOut(800);
                         var answer_num_info = $(".answers_num").find("span:first").text();
                         var answer_reg = /[0-9]+/i;
                         var answer_match = answer_num_info.match(answer_reg);
                         $(".answers_num").find("span:first").text((parseInt(answer_match) + 1) + '个答案');
                         $("#update"+aid).css("display","block");
                         $("#"+aid).find(".xuanshang").css("display","inline");
                         $("#"+aid).find(".bounty_send1").css("display","inline");
                         //$("#del_answer_"+aid).css("display","none");
                         var tmpinfo = $("#del_answer_"+aid).attr("rel");
                         var tmp_arr = tmpinfo.split("|");
                         var auid = parseInt(tmp_arr[0]),muid = parseInt(tmp_arr[1]),mutype = parseInt(tmp_arr[2]);
                         //第一次管理员删除自己情况
                         if(mutype = 2 && auid != muid && ($.trim($("#del_answer_"+aid).find("#qst_deleted").attr("rel")) == 'first')){
                             $("#del_answer_"+aid).find("#qst_deleted").html("");
                         }else if(auid == muid && ($.trim($("#del_answer_"+aid).find("#qst_deleted").attr("rel")) == 'first')){
                             //自己删除自己（包括管理员自己删除自己情况）
                             $("#del_answer_"+aid).find("#qst_deleted").html("");
                         }
                    }
                });
            });
        }

        if (is_listen === true) {
            request_undel();
        } else {
            $('.undel_answer').unbind('click').click(function(){
                if(DW.global.is_active == '0') {
                    DW.util.error_msg($(this),'您的账号未激活，暂不能操作该功能');
                    return false;
                }
                if(DW.global.prison == '1') {
                    DW.util.error_msg($(this),'您的账号当前被关禁闭，期间不能操作该功能');
                    return false;
                }
                p = $(this).parent();
                aid = p.attr('rel');
                request_undel();
            });
        }

    };

    var spam = function(){
        $('.flag_answer').unbind('click').click(function(){
            if(DW.global.is_active == '0') {
                DW.util.error_msg($(this),'您的账号未激活，暂不能举报问答。');
                return false;
            }
            if(DW.global.prison == '1') {
                DW.util.error_msg($(this),'您的账号当前被关禁闭，期间不能举报问答。');
                return false;
            }
            var id = $(this).attr('rel');
            var oFlag = new Flag();
            oFlag.init({id:id,type:'a'});
        });
    };

    //锁定答案
    var lock = function(is_listen) {
        var lock_box,aid;
        var create_box = function (type) {
            $('#ulmenu2').css('display', 'none');
            $.ajax({
                type: "POST",
                url: "/ajax/get_lock_box",
                data: 'type='+type,
                success:function(data)
                {
                    var result = $.parseJSON( data );
                    if (result.success) {
                        lock_box = $('#wBox').wBox({
                                                    title: "我要锁定这个答案，原因是：",
                                                    html: result.msg
                                                   });
                        lock_box.showBox();

                        //初始化按钮
                        $('#wBox').find('.submit').unbind('click').click(function(){
                            lock_action();
                            $('#ulmenu2').css('display', 'none');
                        });
                        $('#wBox').find('.cancel').unbind('click').click(function(){
                            lock_box.close();
                        });
                    } else {
                        alert( result.msg );
                    }
                }
            });
        }

        //锁定操作
        var lock_action = function() {
            $.ajax({
                type:'post',
                url:'/answer/operate',
                beforeSend:function(xhr,s){
					var lock_type = 0;
                    $(':radio').each(function() {
                        if($(this).is(':checked')) {
						    lock_type = $(this).val();
						}
                    })
					if(lock_type == 0) {
					    //alert("请选择一个锁定类型");
						return false;
					} else {
					    s.data += '&lock_type='+lock_type;
					}
                } ,
                data:'act=lock&aid='+aid,
                success:function(data) {
					var res = $.parseJSON(data);
					if(res.success) {
					   lock_box.close();
					   var url = window.location.href;
					   if(url.indexOf('#') > -1) {
					       window.location.reload(url.substr(0,url.indexOf('#')) + '#ans_lock_'+aid);
					   } else {
					       window.location.href = url+'#ans_lock_'+aid;
					       window.location.reload(true);
					   }
					} else {
					   alert(res.msg);
					}
                }
            })
        }

		if(is_listen === true) {
            create_box(4);
		} else {
			$('.lock_answer').unbind('click').click(function(){
				aid = $(this).attr('rel');
				create_box(4);
			});
		}
    };

    //解锁答案
    var unlock = function(is_listen) {
        var aid;
        function unlock_action() {
            $('#ulmenu2').css('display', 'none');
			if(window.confirm('确定要解除锁定该答案吗？')) {
				$.ajax({
				    type:'post',
					url:'/answer/operate',
					data:'act=unlock&aid='+aid,
					success:function(data) {
					    var res = $.parseJSON(data);
						if(res.success) {
    					    var url = window.location.href;
    					    if(url.indexOf('#ans_lock_'+aid) > -1) {
    					        window.location.href = url.substr(0,url.indexOf('#'));
    					    } else {
    					        window.location.reload();
    					    }
						} else {
						    alert(res.msg);
						}
					}
				});
			}
        }

        if(is_listen === true) {
			unlock_action();
		} else {
			$('.unlock_answer').unbind('click').click(function(){
				aid = $(this).attr('rel');
				unlock_action();
			});
		}
    };

    function init()
    {
        del_answer();
        undel_answer();
        spam();
		lock();
		unlock();
    };

    return {
        init:init
    };

})(jQuery);



//数组转换成字符串
function arr_to_str(data,type) {
    var i = 0, new_data = [] ,str = '';

    switch (type) {
        case 'url':
            for(var key in data) {
                new_data[i] = key +'='+ data[key];
                i++;
            }
            str = new_data.join('&');
            break;
        default:
            str = data.join('&');
            break;
    }
    return str;
}

//ajax创建问题分享框
function create_share_box(id, type){
    var data = "&id="+id+"&type="+type+"&ajax=1";
    $.ajax({
        type: "POST",
        url: "/ajax/get_share_box",
        data: data,
        success:function(msg){
            var result = $.parseJSON( msg );
            if (result.success) {

            }else {
                alert( result.message );
            }
        }
    });
}