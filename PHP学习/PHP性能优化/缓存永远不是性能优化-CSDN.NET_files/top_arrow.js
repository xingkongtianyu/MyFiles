$(document).ready(function(){

//首先将#top_arrow隐藏

    $("#top_arrow").hide();

//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失

    $(function () {
        $(window).scroll(function(){
            if ($(window).scrollTop()>100){
                $("#top_arrow").fadeIn(400);
            }
            else
            {
                $("#top_arrow").fadeOut(400);
            }
        });

//当点击跳转链接后，回到页面顶部位置

        $("#top_arrow").click(function(){
            $('body,html').animate({scrollTop:0},400);
            return false;
        });
    });
});