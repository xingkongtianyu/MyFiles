$(document).ready(function() {

    //        $(function() {
    //                $('#tabs_news').tabs({
    //                        fxFade: true,
    //                        fxSpeed: 'fast'
    //                });
    //        });
/*
    $("ul.sf-menu").superfish({
        autoArrows:  false,
        delay:       400,                             // one second delay on mouseout
        animation:   {
            opacity:'show',
            height:'show'
        },  // fade-in and slide-down animation
        speed:       'fast',                          // faster animation speed
        autoArrows:  false,                           // disable generation of arrow mark-up
        dropShadows: false                            // disable drop shadows
    });
*/
    $('.content .list li').each(function() {
        var a = $(this).children('a');
        var aClass = a.attr('rel');
        if (a.hasClass('active')) {
            $('.'+aClass).css({
                'display':'block'
            });
        } else {
            $('.'+aClass).css({
                'display':'none'
            });
        }
    });
    $('.content .list li a').click(function () {
        var thisaClass = $(this).attr('rel');
        $(this).parent('li').parent('ul').children('li').each(function() {
            var a = $(this).children('a');
            var aClass = a.attr('rel');
            if (thisaClass == aClass) {
                $('.'+aClass).show();
                a.attr('class','active');
            } else {
                $('.'+aClass).hide();
                a.attr('class','');
            }
        });
        return false;
    });

    // wrap 'span' to nav page link
    $('.topnav ul').children('li').each(function() {
        $(this).children('a').html('<span>'+$(this).children('a').text()+'</span>'); // add tags span to a href
    });

    var radius = 75;
    var dtr = Math.PI/120;
    var d=100;
    var mcList = [];
    var active = false;
    var lasta = 1;
    var lastb = 2;
    var distr = true;
    var tspeed=1.2;
    var size=300;
    var mouseX=0;
    var mouseY=0;
    var howElliptical=1;
    var aA=null;
    var oDiv=null;
    window.onload=function ()
    {
        var i=0;
        var oTag=null;
        oDiv=document.getElementById('memo_tags');
        aA=oDiv.getElementsByTagName('a');
        for(i=0;i<aA.length;i++)
        {
            oTag={};
            oTag.offsetWidth=aA[i].offsetWidth;
            oTag.offsetHeight=aA[i].offsetHeight;
            mcList.push(oTag);
        }
        sineCosine( 0,0,0 );
        positionAll();
        oDiv.onmouseover=function ()
        {
            active=true;
        };
        oDiv.onmouseout=function ()
        {
            active=false;
        };
        oDiv.onmousemove=function (ev)
        {
            var oEvent=window.event || ev;
            mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/2);
            mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/2);
            mouseX/=5;
            mouseY/=5;
        };
        setInterval(update, 30);
    };
    function update()
    {
        var a;
        var b;
        if(active)
        {
            a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
            b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
        }
        else
        {
            a = lasta * 0.98;
            b = lastb * 0.98;
        }
        lasta=a;
        lastb=b;
        if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
        {
            return;
        }
        var c=0;
        sineCosine(a,b,c);
        for(var j=0;j<mcList.length;j++)
        {
            var rx1=mcList[j].cx;
            var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
            var rz1=mcList[j].cy*sa+mcList[j].cz*ca;
            var rx2=rx1*cb+rz1*sb;
            var ry2=ry1;
            var rz2=rx1*(-sb)+rz1*cb;
            var rx3=rx2*cc+ry2*(-sc);
            var ry3=rx2*sc+ry2*cc;
            var rz3=rz2;
            mcList[j].cx=rx3;
            mcList[j].cy=ry3;
            mcList[j].cz=rz3;
            per=d/(d+rz3);
            mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
            mcList[j].y=ry3*per;
            mcList[j].scale=per;
            mcList[j].alpha=per;
            mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
        }
        doPosition();
        depthSort();
    }
    function depthSort()
    {
        var i=0;
        var aTmp=[];
        for(i=0;i<aA.length;i++)
        {
            aTmp.push(aA[i]);
        }
        aTmp.sort
        (
            function (vItem1, vItem2)
            {
                if(vItem1.cz>vItem2.cz)
                {
                    return -1;
                }
                else if(vItem1.cz<vItem2.cz)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            );
        for(i=0;i<aTmp.length;i++)
        {
            aTmp[i].style.zIndex=i;
        }
    }
    function positionAll()
    {
        var phi=0;
        var theta=0;
        var max=mcList.length;
        var i=0;
        var aTmp=[];
        var oFragment=document.createDocumentFragment();
        //随机排序
        for(i=0;i<aA.length;i++)
        {
            aTmp.push(aA[i]);
        }
        aTmp.sort
        (
            function ()
            {
                return Math.random()<0.5?1:-1;
            }
            );
        for(i=0;i<aTmp.length;i++)
        {
            oFragment.appendChild(aTmp[i]);
        }
        oDiv.appendChild(oFragment);
        for( var i=1; i<max+1; i++){
            if( distr )
            {
                phi = Math.acos(-1+(2*i-1)/max);
                theta = Math.sqrt(max*Math.PI)*phi;
            }
            else
            {
                phi = Math.random()*(Math.PI);
                theta = Math.random()*(2*Math.PI);
            }
            //坐标变换
            mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
            mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
            mcList[i-1].cz = radius * Math.cos(phi);
            aA[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
            aA[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
        }
    }
    function doPosition()
    {
        var l=oDiv.offsetWidth/2;
        var t=oDiv.offsetHeight/2;
        for(var i=0;i<mcList.length;i++)
        {
            aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
            aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';
            aA[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+1+'px';
            aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
            aA[i].style.opacity=mcList[i].alpha;
        }
    }
    function sineCosine( a, b, c)
    {
        sa = Math.sin(a * dtr);
        ca = Math.cos(a * dtr);
        sb = Math.sin(b * dtr);
        cb = Math.cos(b * dtr);
        sc = Math.sin(c * dtr);
        cc = Math.cos(c * dtr);
    }

});
//查找网页内宽度太大的图片进行缩放以及PNG纠正
function ReImgSize()
{
	for (i=0;i<document.images.length;i++)
	{
		//IE
		if(document.all)
		{
			if (document.images[i].width>550)
			 {
			   document.images[i].width="550"
			   try
			   {
			       document.images[i].outerHTML='<a href="'+document.images[i].src+'" target="_blank" title="在新窗口打开图片">'+document.images[i].outerHTML+'</a>'
			   }
				catch(e){}
			}
		}
		//safari && opera && firefox
		else
		{
			if (document.images[i].width>550) 
			{
			  document.images[i].width="500"
			  document.images[i].title="在新窗口打开图片"
			  document.images[i].style.cursor="pointer"
			  document.images[i].onclick=function(e){window.open(this.src)}
			}
		}
	}
}
function commentReply(pid,c){
	var response = document.getElementById('comment-post');
	document.getElementById('comment-pid').value = pid;
	document.getElementById('cancel-reply').style.display = '';
	c.parentNode.parentNode.appendChild(response);
}
function cancelReply(){
	var commentPlace = document.getElementById('comment-place'),response = document.getElementById('comment-post');
	document.getElementById('comment-pid').value = 0;
	document.getElementById('cancel-reply').style.display = 'none';
	commentPlace.appendChild(response);
}