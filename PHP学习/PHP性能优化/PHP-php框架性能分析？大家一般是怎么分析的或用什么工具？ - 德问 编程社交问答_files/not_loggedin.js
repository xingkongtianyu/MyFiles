var Tip_login =  {};
var doing_login = false;
Tip_login.box = null;
Tip_login.cookieName = cookie_prefix("_tip_login_");
var loginTimer = 0;

//检测未登录前的动作，并执行
Tip_login.cheakAll = function(){
    var cookie = Cookies.get(Tip_login.cookieName);
    if(cookie !== undefined && cookie.indexOf(':') !== -1) {
        Cookies.set(Tip_login.cookieName,'',-1,'/');
        var arr = cookie.split(':');
        switch (arr[0]) {
            case '1' : Tip_login.ask_question.ask_checked(cookie); break; //未登录时有 “提问” 动作
            case '2' : Tip_login.follow.follow_checked(cookie); break;    //未登录时有 “关注” 动作
            case '3' : Tip_login.vote.vote_checked(cookie); break;    //未登录时有 “关注” 动作
        }
    }
}


//提问登录提示
Tip_login.ask_question = {

        ask : function() {
            Tip_login.show_login({tip:Tip_login.tip.ask_question,success:function(data){
                    Tip_login.ask_question.ask_callback(data);
                }
            });
        },
        ask_callback : function (data) {
            Cookies.set(Tip_login.cookieName,"1:" + $('#search_input').val(),'','/');
            window.location.reload();
        },
        ask_checked : function(data) {
           $('#search_input').val(data.split(':')[1]);
           DW.ask.add(data.split(':')[1]);
        }
}

//关注
Tip_login.follow = {

      follow_type : '',
      data        : '',
      obj         : null,
      login : function(obj,type,data) {
          if(!type) return false;
          this.follow_type = type;
          this.data = data;
          this.obj = obj;
          Tip_login.show_login({tip:Tip_login.tip.follow,success:function(data,msg,pub_uid){
                Tip_login.follow.follow_callback(data,msg,pub_uid);
            }
        });
      },
      follow_callback : function(data,msg,pub_uid) {

           if(this.follow_type == 'question_view') {
                Cookies.set(Tip_login.cookieName,"2:"+this.follow_type + ":"+this.data,'','/');
                window.location.reload();
           }else {
                Tip_login.follow.request();
           }
      },
      follow_checked : function(data) {
            var temp =data.split(':');
            switch(temp[1]) {
                case 'question_view':
                if($("." + temp[2]).attr('rel') != 'unfollow') {
                    $("." + temp[2]).trigger("click");
                }
                break;
            }
      },
      request : function() {

        var obj = this.obj;
        var _rel = typeof(obj) == 'string' ? obj : obj.attr('rel');
        var type = this.follow_type;
        var url = '';
        var data = [];
        data['type'] = type;
        if(_rel.indexOf('|') == -1) {
            data['id'] = _rel;
            data['name'] = '';
            data['act'] = '';
        }else {
            var rel = _rel.split('|');
            data['id'] = rel[0];
            data['name'] = rel[1];
            data['act'] = rel[2] != undefined && rel[2] == '+' ? '加' : '';
        }

        if(obj.hasClass('follow')) {
            url = '/ajax/follow';
            data['class'] = 'unfollow';
            data['txt'] =  obj.hasClass('fbtn') ? '取消关注' : '取消关注';
        }else if(obj.hasClass('unfollow')) {
            url = '/ajax/unfollow';
            data['class'] = 'follow';
            data['txt'] = data['act'] + '关注' + data['name'];
        }

        var tmp_data = []
        //debug(data);
        var j = 0;
        for(var i in data) {
            tmp_data[j] = i + "=" + data[i];
            j++;
        }

        $.ajax({
           type: "POST",
           url: url,
           data: tmp_data.join('&')+"&ajax=1",
           success: function(msg){
             var result = $.parseJSON( msg );
             if (result.success == 1) {
                 obj.removeClass('follow');
                 obj.removeClass('unfollow');
                 obj.addClass(data['class']);
                 obj.html(data.txt);
            }
            window.location.reload();
           }
        });
      }
}

//投票操作
Tip_login.vote = {
    do_vote : function(li) {
        DW.util.error_msg(li,'您还没有登录，<a href="#" onclick="Tip_login.vote.do_login();return false;">点击这里登录</a>');
    },
    do_login : function() {
        Cookies.set(Tip_login.cookieName,"3:"+window.location.href,'','/');
        location.href='/user/login?redirect_to='+location.href;
    },
    vote_checked : function(data) {
        $(":input[name='redirect_to']").val(data.substring(data.indexOf(':') + 1));
    }
}
//添加答案
Tip_login.add_answer = {
    show_login : function(){
        Tip_login.show_login({tip:Tip_login.tip.add_answer,success:function(data,msg,pub_uid){
                window.location.reload();
            }
        });
    }
}

//页面顶部登录 (当前页刷新)
Tip_login.top_login = {
    login : function() {

        if(doing_login) return false;
        clearTimeout(loginTimer);
        loginTimer = setTimeout(function(){$.ajax({
            url:'/user/ajax_login',
            type: "POST",
            data: $("#top_login").serialize(),
            dataType : 'json',
            beforeSend: function(){
                doing_login = true;
            },
            complete: function(){doing_login = false;},
            success:function(data){
                if(data.status == 'success') {
                    var reg = new RegExp(location.host+'\/fast_ask\?.*$', "i");
                     if(reg.test(location.href)){
                        location.href="/";
                     }else
                     window.location.reload();
                }else {
                    if(data.redirect_to != undefined) {
                        location.href= data.redirect_to;
                    } else {
                        $("#top_show_error").find('span').remove();
                        $("#top_show_error").append('<span class="line26 padb10 f12_c" style="font-size:12px;padding-left:10px;">'+data.msg+'</span>');
                        setTimeout(function(){$("#top_show_error").find('span').fadeOut();},5000);
                    }
                }
            },
            error :function(){
                $("#top_show_error").find('span').remove();
                $("#top_show_error").append('<span class="line26 padb10 f12_c" style="font-size:12px;padding-left:10px;">登录失败，请稍后再试</span>');
                setTimeout(function(){$("#top_show_error").find('span').fadeOut();},5000);
            }
        })},200);
    }
}


// 执行登录
Tip_login.do_login = function(callBakc){

    if(doing_login) return false;

    $.ajax({
        url:'/user/ajax_login',
        type: "POST",
        data: $("#ajax_login_form").serialize(),
        dataType : 'json',
        beforeSend: function(){
            doing_login = true;
        },
        complete: function(){doing_login = false;},
        success:function(data){
            if(data.status == 'success') {
                 eval("("+callBakc+")('"+data.msg+"',"+data.pub_uid+")");
            }else {
                $("#show_error").find('span').remove();
                $("#show_error").append('<span class="line26 padb10 f12_c">'+data.msg+'</span>');
            }
        },
        error :function(){
            $("#show_error").find('span').remove();
            $("#show_error").append('<span class="line26 padb10 f12_c">登录失败，请稍后再试</span>');
        }
    })

}

Tip_login.tip = {
    ask_question : '您还没有登录，登录后将继续提问',
    follow       : '登录后将自动完成关注操作',
    add_answer   : '您还没有登录，请登录后在发答案'

}

Tip_login.show_login = function(args) {

        html_info = '<div class="padf205">\
                            <form  method="post" id="ajax_login_form">\
                               <input type="hidden" value="" name="redirect_to">\
                                <ul class="floatul">\
                                    <li class="w580 padb10">\
                                        <label class="f16 line26">邮箱</label> <input type="text" value="" class="inputtxt" name="email">\
                                    </li>\
                                    <li class="w580">\
                                        <label class="f16 line26">密码</label>\
                                        <input type="password" class="inputtxt" name="passwd">\
                                    </li>\
                                    <li class="w55">&nbsp;</li>\
                                    <li class="w580 hei40 lft3"><label class="f16 line26">&nbsp;</label><input type="checkbox" checked="checked" name="remember_me">在这台电脑上记住我 <a style="margin-left:20px;" class="c_90" href="/account/findpasswd">忘记密码?</a></li>\
                                    <li class="w55">&nbsp;</li>\
                                    <li style="margin-top:10px;" class="w580" id="show_error">\
                                        <label class="f16 line26">&nbsp;</label>\
                                        <input type="button" class="w90 cur" onclick="Tip_login.do_login('+args.success+',this)" value="登录">\
                                    </li>\
                                    <li class="w55">&nbsp;</li>\
                                    <li class="w580">\
                                        <label class="f16 line26">&nbsp;</label>\
                                        还没有德问账号？<a href="/account/reg">立即注册</a>\
                                    </li>\
                                </ul>\
                                <div class="clear"></div>\
                            </form>\
                        </div>';
    Tip_login.box = $('#wBox').wBox({
            title: "登录",
            html: html_info
        });
   Tip_login.box.showBox();
}
