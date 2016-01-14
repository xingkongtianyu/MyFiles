

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