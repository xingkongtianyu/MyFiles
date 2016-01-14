$(function(){
	//turnPage();
	loadComments();//加载评论
	
});
function turnPage(){
	var win = parseInt($(window).height());
	var top = parseInt($("#top").css("height"));
	var header = parseInt($("#header").css("height"));
	var main = parseInt($("#main").css("height"));//alert(win);alert(top + header);alert(win-top-header);
	if(top + header + main < win){
       $("#main").css("min-height",win-top-header-40);
       
	}
}
//跳转到登录页面
function turnLogin(){
	var returnUrl = window.location.href;
	window.location.href = getBaseHref() + "/login.jsp?returnUrl=" + returnUrl ;
}
//退出系统
function turnOut(){
	$.ajax({
        url: getBaseHref() + '/home/index!goOut',
        async : false,
        type: "post",
        dataType: "text",
        success: function (data) {
        	if(data == "success"){
        		window.location.href = getBaseHref() + "/home/index!index" ;
        	}else{
        		alert("退出系统失败！");
        	}	        		
        }
    });	
	return false;
}
//跳转到注册页面
function turnRegister(){
	var returnUrl = window.location.href;
	window.location.href = getBaseHref() + "/register.jsp?returnUrl=" + returnUrl ;

}
$.fn.extend({
    selection: function () {
        var txt = '';
        var doc = this.get(0).document;
        if (doc) {
            var sel = doc.selection.createRange();
            if (sel.text.length > 0)
                txt = sel.text;
        }
        else if (this.get(0).selectionStart || this.get(0).selectionStart == '0') {
            var s = this.get(0).selectionStart;
            var e = this.get(0).selectionEnd;
            if (s != e) {
                txt = this.get(0).value.substring(s, e);
            }
        }
        return $.trim(txt);
    },
    parseHtml: function (t) {
        var doc = this.get(0).document;
        if (doc) {
            this.get(0).focus();
            doc.selection.createRange().collapse;
            this.get(0).document.selection.createRange().text = t;
        }
        else if (this.get(0).selectionStart || this.get(0).selectionStart == '0') {
            var s = this.get(0).selectionStart;
            var e = this.get(0).selectionEnd;
            var val = this.get(0).value;
            var start = val.substring(0, s);
            var end = val.substring(e);
            this.get(0).value = start + t + end;
        }
    }
})

/**
 * 加载评论
 * @return
 */
function loadComments(){
	var baseHref = getBaseHref();
	var article_id = getArticleId();
	var contents = getCommentContents(article_id);
	var comments = getComments(article_id);
	if(contents.length != 0 && comments.length != 0 && contents.length == comments.length){
		var html = "";
		for(var i=0;i<comments.length;i++ ){
			var content = findContentFromContents(contents, comments[i].dbid);
			html += "<li id='comment_item_"+comments[i].dbid+"' class='comment_item'>";
			html += "<table>";
			html += "<td class='user_photo'>";
			if(comments[i].user_photo != '')
			   html += "<img src='"+baseHref+"/"+comments[i].user_photo+"' align='' alt='' title='' /></td>";
			else				
			   html += "<img src='"+baseHref+"/photo/default.gif' align='' alt='' title='' /></td>";
			html += "<td>";
			html += "<div class='title'>";
			if(comments[i].user_number != '')
			   html += "#"+comments[i].floor+"楼 :<a  target='_blank'  href='"+baseHref+"/blog/"+comments[i].user_number+"'>"+comments[i].user_nickname+"</a>&nbsp;发布于"+comments[i].time_create+" "; 
			else
				html += "#"+comments[i].floor+"楼 :"+comments[i].user_nickname+"&nbsp;发布于"+comments[i].time_create+" ";
			html += "</div>";
			html += "<div class='content'>"+content+"</div>";
			html += "<div class='footer'>";
			html += "<a href='javascript:void(0)' onClick='quoteComment()'>引用</a>";
			if(comments[i].login){
				if(comments[i].user_number != '' && comments[i].user_number == comments[i].session_user_number){
					html += "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' onClick='deleteComment(\""+comments[i].dbid+"\")'>删除</a>";
				}
			}
  	        html += "</div>";
  	        html += "</td>";
  	        html += "</table>";     		      
  	        html += "</li>";
		}
		$("#comment_list").html(html);
	}else{
		$("#comment_list").html('<span id="comment_no">暂无评论!</span>');
	}
}
function getCommentContents(article_id){
	var arr = new Array();
	var baseHref = getBaseHref();
	$.ajax({
        url: baseHref + '/comment/comment!getContents',
        data: {"article_id" : article_id},
        async : false,
        type: "post",
        dataType: "text",
        success: function (data) {
        	if(data != "0"){
        		var strs = data.split("@comment_content@");
        		for(var i=0;i<strs.length;i++){
        		   if(strs[i] != ""){
        			  var commentArr = strs[i].split("@comment_dbid@");
           		      var obj = new Object();
           		      obj.dbid = commentArr[0];
           		      obj.content = commentArr[1];
           		      arr.push(obj);
        		   }
        		}
        	}
        }
    });
	return arr;
}
function getComments(article_id){
	var jsonArr;
	var baseHref = getBaseHref();
	$.ajax({
        url: baseHref + '/comment/comment!getComments',
        data: {"article_id" : article_id},
        async : false,
        type: "post",
        dataType: "text",
        success: function (data) {
        	if(data != "0"){
        		jsonArr = eval(data);
        	}else{
        		jsonArr = new Array();
        	}        	
        }
    });
	return jsonArr;
}
function findContentFromContents(contents, article_dbid){
	var content = "";
	for(var i=0;i<contents.length;i++ ){
		if(contents[i].dbid == article_dbid){
			content = contents[i].content;
			return content;
		}
	}
	return content;
}
//添加评论
function postNewComment() {
	var baseHref = getBaseHref();
	var articleId = getArticleId();
	//if(!isLogin()){
		//alert("请先登录！登录后方可发表评论");
		//window.open (baseHref +"/login.jsp");
		//return;
	//}
		
    var content = $("#tbCommentBody").val();
    if (!content) {
        alert('请输入评论内容！');
        return;
    }
    if (content.length > 4000) {
        alert('评论内容过长，超过4000个字数限制！当前长度：' + content.length);
        return;
    }
    var nickName = $("#tbCommentNickname").val();
    if (typeof(nickName)!='undefined' && nickName.length > 50) {
    	alert('昵称过长，超过50个字数限制！当前长度：' + nickName.length);
    }
    content = content.replace(/\n/g, "<br>");   
    $("#newComment_submit").val("提交中...");
    $("#newComment_submit").css("color","#0a5482");
    $.ajax({
        url: getBaseHref() + '/comment/comment!addComment',
        data: {"commentContent" : content,"article_id" : articleId,"user_nick":nickName},
        async : false,
        type: "post",
        dataType: "text",
        success: function (data) {
            if (data != 'fail') {
            	$("#tbCommentBody").val("");
            	var jsonObj = eval("(" + data + ")");
            	var html = "";
            	html += "<li id='comment_item_"+jsonObj.dbid+"' class='comment_item'>";
    			html += "<table>";
    			html += "<td class='user_photo'>";
    			if(jsonObj.user_photo != '')
 				   html += "<img src='"+baseHref+"/"+jsonObj.user_photo+"' align='' alt='' title='' /></td>";
 			    else				
 				   html += "<img src='"+baseHref+"/photo/default.gif' align='' alt='' title='' /></td>";
    			html += "<td>";
    			html += "<div class='title'>";
    			if(jsonObj.user_number != '')
    			   html += "#"+jsonObj.floor+"楼 :<a  target='_blank'  href='"+baseHref+"/blog/"+jsonObj.user_number+"'>"+jsonObj.user_nickname+"</a>&nbsp;发布于"+jsonObj.time_create+" ";
    			else    				
    			   html += "#"+jsonObj.floor+"楼 :"+jsonObj.user_nickname+"&nbsp;发布于"+jsonObj.time_create+" "; 
    			html += "</div>";
    			html += "<div class='content'>"+content+"</div>";
    			html += "<div class='footer'>";
    			html += "<a href='javascript:void(0)' onClick='quoteComment()'>引用</a>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' onClick='deleteComment(\""+jsonObj.dbid+"\")'>删除</a>";
      	        html += "</div>";
      	        html += "</td>";
      	        html += "</table>";     		      
      	        html += "</li>";  	
                $("#comment_list").append(html);
                $("#comment_no").html("");
                $("#newComment_submit").val("发表评论");
                $("#newComment_submit").css("color","#000000");
            } else {
                var errorMsg = "抱歉！评论提交失败！请与管理员联系(contact@cnblogs.com)。";
                ShowCommentMsg(errorMsg);
                $("#span_comment_posted").html('');
                $("#newComment_submit").val("发表评论");
                $("#newComment_submit").css("color","#000000");
            }
        }
    });    
}
/**
 * 刷新评论
 */
function refresh_commend(){
	$("#comment_list").html("");
	loadComments();
}
/**
 * 删除评论
 */
function deleteComment(commentId){
	var baseHref = getBaseHref();
	if(confirm("确定要删除该评论吗?")){
		$.ajax({
	        url: baseHref + '/comment/comment!deleteComment',
	        data: {"comment_id" : commentId},
	        async : false,
	        type: "post",
	        dataType: "text",
	        success: function (data) {
	        	if(data == "success"){
	        		$("#comment_item_"+commentId+"").remove();
	        		alert("删除成功！");
	        	}else{
	        		alert("删除失败！");
	        	}	        		
	        }
	    });		
	}	
	return false;
}
/**
 * 验证是否登录
 * @return
 */
function isLogin(){
	var login = false;
	var baseHref = getBaseHref();
	$.ajax({
        url: baseHref + '/home/user!isLogin',
        async : false,
        type: "post",
        dataType: "text",
        success: function (data) {
        	if(data == "yes"){
        		login = true;
        	}       	
        }
    });
	return login;
}
//添加关注
function addGuanzhu(user_number, user_nick){
	var ret = isLogin();
	if(ret == false){
		if(confirm("您还没有登录，是否转入登录页面？")){
			var returnUrl = window.location.href;
			window.location.href = getBaseHref() + "/login.jsp?returnUrl=" + returnUrl ;
			return false;
		}else{
			return false;
		}
	}
	var baseHref = getBaseHref();
	$.ajax({
        url: baseHref + '/home/user!addGuanzhu',
        data: {"number" : user_number},
        async : false,
        type: "post",
        dataType: "text",
        success: function (data) {
        	if(data == "success"){
        		alert("您已成功添加对  "+user_nick + " 的关注");
        		$(".guanzhu").html('<a href="javascript:void(0)" onclick="delGuanzhu(\''+user_number+'\', \''+user_nick+'\')">取消关注</a>');
        	}       	
        }
    });
}
//添加关注
function delGuanzhu(user_number, user_nick){
	var ret = isLogin();
	if(ret == false){
		if(confirm("您还没有登录，是否转入登录页面？")){
			var returnUrl = window.location.href;
			window.location.href = getBaseHref() + "/login.jsp?returnUrl=" + returnUrl ;
			return false;
		}else{
			return false;
		}
	}
	var baseHref = getBaseHref();
	$.ajax({
        url: baseHref + '/home/user!delGuanzhu',
        data: {"number" : user_number},
        async : false,
        type: "post",
        dataType: "text",
        success: function (data) {
        	if(data == "success"){
        		alert("您已成功取消对  "+user_nick + " 的关注");
        		$(".guanzhu").html('<a href="javascript:void(0)" onclick="addGuanzhu(\''+user_number+'\', \''+user_nick+'\')">加关注</a>');
        	}       	
        }
    });
}
