/**
 + ---------------------------------------- +
 + AutoScroll组件v1.0
 + Author: zzf
 +	TODO: 通用性不够，仅仅实现了垂直和水平的滚动。性能问题？？
 + Date: 2012-3-29
 + ---------------------------------------- +
**/
/**
 *	AutoScrol自动滚动效果
 * @name jQuery.AutoScroll
 * @param {object} obj 对象形式的参数
 * @class
 * @return  jQuery.AutoScroll instance
 */

$.AutoScroll = function(opts) { 
	//如果在构造实例的时候忘了new,就重新实例化
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(opts);
	}
	//执行类似其他语言的初始化函数，利用apply指定上下文(context)为该实例，并且传入参数
	this.init.apply(this, arguments);
}

$.AutoScroll.prototype ={
	constructor: $.AutoScroll,
	init: function(opts) {
		var self=this;
		//配置属性
		$.extend(this, {
			wrap:null,
			selector:'>li',	
			scrollCount:1,
			dir:'v',              //滚动方向,'v'垂直,'h'水平
			interval:3000,
			fxTime:1000
		},opts || {});
		this.timer=null;
		this.run();
	},
	run:function (){
		var self=this,
			count=this.dir==='v'?'height':'width',
			m=self.dir==='v'?'marginTop':'marginLeft';
		self.wrap.hover(function (){
			clearInterval(self.timer);
			self.timer=null;
		},function (){
			self.timer=setInterval(function() {
				var scrollnum =parseFloat(self.wrap.find(self.selector+':first')[count]())*self.scrollCount,opt={};
				opt[m]=-scrollnum + 'px';
				self.wrap.animate(opt,self.fxTime,function() {
					self.wrap.css(m,0).find(self.selector+':lt('+self.scrollCount+')').appendTo(self.wrap);
				});
			},self.interval);
		}).trigger('mouseleave');
	}
}
