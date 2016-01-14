//nav sub menu
var isNavHover=false;

//focus img player
var t = n = 0;
var count = 0;

function copy_code(text) {
    if (window.clipboardData) {
        window.clipboardData.setData("Text", text)
        alert("已经成功复制到剪贴板！");
    } else {
        var x=prompt('你的浏览器可能不能正常复制\n请你手动进行：',text);
    }
//return false;
}

function shareto(id){
    var url=encodeURIComponent(document.location.href);
    var title=encodeURIComponent(document.title);
    if(id=="fav"){
        addBookmark(document.title);
        return;
    }else if(id=="qzone"){
        window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url);
        return;
    }else if(id=="twitter"){
        window.open('http://twitter.com/home?status='+title+encodeURIComponent(' ')+url,'_blank');
        return;
    }else if(id=="sina"){
        window.open("http://v.t.sina.com.cn/share/share.php?url="+url+"&appkey=3661011550&title="+title+"&pic=","_blank","width=615,height=505");
        return;
    }else if(id=="baidu"){
        window.open('http://cang.baidu.com/do/add?it='+title+'&iu='+url+'&fr=ien#nw=1','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
        return;
    }else if(id=="googlebuzz"){
        window.open('http://www.google.com/buzz/post?url='+url,'_blank');
        return;
    }else if(id=="douban"){
        var d=document,e=encodeURIComponent,s1=window.getSelection,s2=d.getSelection,s3=d.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',r='http://www.douban.com/recommend/?url='+e(d.location.href)+'&title='+e(d.title)+'&sel='+e(s)+'&v=1',x=function(){
            if(!window.open(r,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330'))location.href=r+'&r=1'
                };
        if(/Firefox/.test(navigator.userAgent)){
            setTimeout(x,0)
            }else{
            x()
            }
        return;
    }else if(id=="renren"){
        window.open('http://www.connect.renren.com/share/sharer?url='+url+'&title='+title,'_blank');
        return;
    }else if(id=="xianguo"){
        window.open('http://xianguo.com/service/submitdigg/?link='+url+'&title='+title+'&pic=','_blank');
        return;
    }else if(id=="digu"){
        window.open('http://www.diguff.com/diguShare/bookMark_FF.jsp?title='+title+'&url='+url,'_blank','width=580,height=310');
        return;
    }else if(id=="mail"){
        window.open('mailto:?subject='+title+'&body='+encodeURIComponent('这是我看到了一篇很不错的文章，分享给你看看！\r\n\r\n')+title+encodeURIComponent('\r\n')+url,'_blank');
        return;
    }else if(id=="tqq"){
        window.open('http://v.t.qq.com/share/share.php?title='+title+'&site=http://www.iplaysoft.com/&pic=&url='+url,'_blank');
        return;
    }else if(id=="kaixin"){
        window.open('http://www.kaixin001.com/repaste/share.php?rtitle='+title+'&rurl='+url,'_blank');
        return;
    }else if(id=="sohu"){
        window.open('http://t.sohu.com/third/post.jsp?&title='+title+'&url='+url+'&content=utf-8','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
        return;
    }else if(id=="tao"){
        window.open('http://share.jianghu.taobao.com/share/addShare.htm?url='+url+'&title='+title+'&content=','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
        return;
    }else if(id=='msn'){
        window.open('https://skydrive.live.com/sharefavorite.aspx/.SharedFavorites?url='+url+'&title='+title+'&wa=wsignin1.0','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
        return;
    }else if(id=="bai"){
        window.open('http://bai.sohu.com/share/blank/add.do?&title='+title+'&link='+url+'&content=gb2312','_blank','');
        return;
    }else if(id=="163"){
        window.open('http://t.163.com/article/user/checkLogin.do?source='+url+'&info='+title,'_blank','');
        return;
    }else if(id=="xiaoyou"){
        window.open('http://pengyou.qq.com/index.php?mod=usershare&act=onekey&to=xiaoyou&url='+url+'&title='+title,'_blank','');
        return;
    }else if(id=="miliao"){
        window.open('http://openapi.miliao.com/v1/app/share?url='+url+'&content='+title,'_blank','');
        return;
    }
}


function addBookmark(title){
    var url = parent.location.href;
    if (window.sidebar) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(title, url,"");
    } else if(document.all) { // IE Favorite
        window.external.AddFavorite( url, title);
    } else if(window.opera) { // Opera 7+
        return false; // do nothing
    } else {
        alert('请按 Ctrl + D 为Chrome浏览器添加书签!');
    }
}

//图片透明及鼠标滑过效果
$(function(){
    $('.post-info-bottom .spana a').animate({
        "opacity": .5
    });
    var background;
    $('.post-info-bottom .spana a').hover(function() {
        background = this.style.backgroundPosition.split(" ");
        $(this).css({"background-position":"-32px"+" "+background[1]});
        $(this).stop().animate({
            "opacity": 1
        });
    }, function() {
        $(this).css({"background-position":"0px"+" "+background[1]})
        $(this).stop().animate({
            "opacity": .5
        });
    });
});