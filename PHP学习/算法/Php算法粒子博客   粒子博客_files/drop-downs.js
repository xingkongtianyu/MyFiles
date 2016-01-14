/**
 * Functions file for loading custom JS for Radius drop downs.
 *
 * @package Radius
 * @subpackage Functions
 */


/** Minified: jquery.hoverIntent.js */
(function(a){a.fn.hoverIntent=function(k,j){var l={sensitivity:7,interval:100,timeout:0};l=a.extend(l,j?{over:k,out:j}:k);var n,m,h,d;var e=function(f){n=f.pageX;m=f.pageY};var c=function(g,f){f.hoverIntent_t=clearTimeout(f.hoverIntent_t);if((Math.abs(h-n)+Math.abs(d-m))<l.sensitivity){a(f).unbind("mousemove",e);f.hoverIntent_s=1;return l.over.apply(f,[g])}else{h=n;d=m;f.hoverIntent_t=setTimeout(function(){c(g,f)},l.interval)}};var i=function(g,f){f.hoverIntent_t=clearTimeout(f.hoverIntent_t);f.hoverIntent_s=0;return l.out.apply(f,[g])};var b=function(o){var g=jQuery.extend({},o);var f=this;if(f.hoverIntent_t){f.hoverIntent_t=clearTimeout(f.hoverIntent_t)}if(o.type=="mouseenter"){h=g.pageX;d=g.pageY;a(f).bind("mousemove",e);if(f.hoverIntent_s!=1){f.hoverIntent_t=setTimeout(function(){c(g,f)},l.interval)}}else{a(f).unbind("mousemove",e);if(f.hoverIntent_s==1){f.hoverIntent_t=setTimeout(function(){i(g,f)},l.timeout)}}};return this.bind("mouseenter",b).bind("mouseleave",b)}})(jQuery);

/** Minified: superfish.js */
(function(b){b.fn.superfish=function(k){var g=b.fn.superfish,j=g.c,f=b(['<span class="',j.arrowClass,'"> &#187;</span>'].join("")),i=function(){var c=b(this),l=d(c);clearTimeout(l.sfTimer);c.showSuperfishUl().siblings().hideSuperfishUl()},e=function(){var c=b(this),m=d(c),l=g.op;clearTimeout(m.sfTimer);m.sfTimer=setTimeout(function(){l.retainPath=(b.inArray(c[0],l.$path)>-1);c.hideSuperfishUl();if(l.$path.length&&c.parents(["li.",l.hoverClass].join("")).length<1){i.call(l.$path)}},l.delay)},d=function(c){var l=c.parents(["ul.",j.menuClass,":first"].join(""))[0];g.op=g.o[l.serial];return l},h=function(c){c.addClass(j.anchorClass).append(f.clone())};return this.each(function(){var c=this.serial=g.o.length;var m=b.extend({},g.defaults,k);m.$path=b("li."+m.pathClass,this).slice(0,m.pathLevels).each(function(){b(this).addClass([m.hoverClass,j.bcClass].join(" ")).filter("li:has(ul)").removeClass(m.pathClass)});g.o[c]=g.op=m;b("li:has(ul)",this)[(b.fn.hoverIntent&&!m.disableHI)?"hoverIntent":"hover"](i,e).each(function(){if(m.autoArrows){h(b(">a:first-child",this))}}).not("."+j.bcClass).hideSuperfishUl();var l=b("a",this);l.each(function(n){var o=l.eq(n).parents("li");l.eq(n).focus(function(){i.call(o)}).blur(function(){e.call(o)})});m.onInit.call(this)}).each(function(){var c=[j.menuClass];if(g.op.dropShadows&&!(b.browser.msie&&b.browser.version<7)){c.push(j.shadowClass)}b(this).addClass(c.join(" "))})};var a=b.fn.superfish;a.o=[];a.op={};a.IE7fix=function(){var c=a.op;if(b.browser.msie&&b.browser.version>6&&c.dropShadows&&c.animation.opacity!=undefined){this.toggleClass(a.c.shadowClass+"-off")}};a.c={bcClass:"sf-breadcrumb",menuClass:"sf-js-enabled",anchorClass:"sf-with-ul",arrowClass:"sf-sub-indicator",shadowClass:"sf-shadow"};a.defaults={hoverClass:"sfHover",pathClass:"overideThisToUse",pathLevels:1,delay:800,animation:{opacity:"show"},speed:"normal",autoArrows:true,dropShadows:true,disableHI:false,onInit:function(){},onBeforeShow:function(){},onShow:function(){},onHide:function(){}};b.fn.extend({hideSuperfishUl:function(){var e=a.op,d=(e.retainPath===true)?e.$path:"";e.retainPath=false;var c=b(["li.",e.hoverClass].join(""),this).add(this).not(d).removeClass(e.hoverClass).find(">ul").hide().css("visibility","hidden");e.onHide.call(c);return this},showSuperfishUl:function(){var e=a.op,d=a.c.shadowClass+"-off",c=this.addClass(e.hoverClass).find(">ul:hidden").css("visibility","visible");a.IE7fix.call(c);e.onBeforeShow.call(c);c.animate(e.animation,e.speed,function(){a.IE7fix.call(c);e.onShow.call(c)});return this}})})(jQuery);

/** Minified: supersubs.js */
(function(a){a.fn.supersubs=function(b){var c=a.extend({},a.fn.supersubs.defaults,b);return this.each(function(){var d=a(this);var e=a.meta?a.extend({},c,d.data()):c;var f=a('<li id="menu-fontsize">&#8212;</li>').css({padding:0,position:"absolute",top:"-999em",width:"auto"}).appendTo(d).width();a("#menu-fontsize").remove();$ULs=d.find("ul");$ULs.each(function(l){var k=$ULs.eq(l);var j=k.children();var g=j.children("a");var m=j.css("white-space","nowrap").css("float");var h=k.add(j).add(g).css({"float":"none",width:"auto"}).end().end()[0].clientWidth/f;h+=e.extraWidth;if(h>e.maxWidth){h=e.maxWidth}else{if(h<e.minWidth){h=e.minWidth}}h+="em";k.css("width",h);j.css({"float":m,width:"100%","white-space":"normal"}).each(function(){var n=a(">ul",this);var i=n.css("left")!==undefined?"left":"right";n.css(i,h)})})})};a.fn.supersubs.defaults={minWidth:9,maxWidth:25,extraWidth:0}})(jQuery);

/** Drop Down Menu Logic */
(function($){
	
	/** Radius Dorp Downs */
	function radiusMenu() {
		
		$( '.menu1 ul' ).supersubs({			
			
			minWidth: 16,
			maxWidth: 27,
			extraWidth: 1		
		
		}).superfish({		
			
			delay: 100,
			speed: 'fast',
			animation: { opacity:'show', height:'show' },
			//autoArrows: false,
			dropShadows: false
	  
	  });
	  
	}
	
	/** jQuery Document Ready */
	$(document).ready(function(){
		radiusMenu();
	});

})(jQuery);