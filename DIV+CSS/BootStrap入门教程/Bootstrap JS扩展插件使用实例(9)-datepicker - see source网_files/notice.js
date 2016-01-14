$(document).ready(function(){
	$(".notice .close").bind("click", function(){
		$(".notice .msg_border").hide();
		$(".notice .content").hide();
		$(".notice .time").hide();
		$(".notice").animate({"height":"20px"}, 1000);
		$(".notice .open").show();
		$(this).hide();		
	})
	$(".notice .open").bind("click", function(){
		$(".notice .msg_border").show();
		$(".notice .content").show();
		$(".notice .time").show();
		$(".notice").animate({"height":"80px"}, 500);
		$(".notice .close").show();
		clearTimeout(timeOutVar);
		timeOutVar = window.setTimeout("closeNotice()", 10000);
		$(this).hide();
		
	})
	
	timeOutVar = window.setTimeout("closeNotice()", 10000);
})
var timeOutVar = null;
function closeNotice(){
	var val = $(".notice .close").css("display");
	if(val == "block")
	   $(".notice .close").trigger("click");
}