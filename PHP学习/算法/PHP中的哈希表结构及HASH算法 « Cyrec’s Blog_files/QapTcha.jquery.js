/************************************************************************
*************************************************************************
@Name :       	QapTcha - jQuery Plugin
@Revison :    	2.5
@Date : 		26/01/2011
@Author:     	 Surrel Mickael (www.myjqueryplugins.com - www.msconcept.fr) 
@License :		 Open Source - MIT License : http://www.opensource.org/licenses/mit-license.php
 
**************************************************************************
*************************************************************************/
jQuery.QapTcha = {
	build : function(options)
	{
        var defaults = {
			txtLock : '发表评论前，请滑动滚动条解锁',
			txtUnlock : '已解锁，可以发表评论了'
        };   
		
		if(this.length>0)
		return jQuery(this).each(function(i) {
			/** Vars **/
			var 
				pass = generatePass(),
				opts = $.extend(defaults, options),      
				$this = $(this),
				form = $('form').has($this),
				Clr = jQuery('<div>',{'class':'clr'}),
				bgSlider = jQuery('<div>',{id:'bgSlider'}),
				Slider = jQuery('<div>',{id:'Slider'}),
				Icons = jQuery('<div>',{id:'Icons'}),
				TxtStatus = jQuery('<div>',{id:'TxtStatus','class':'dropError',text:opts.txtLock}),
				inputQapTcha = jQuery('<input>',{name:'iqaptcha',value:pass,type:'hidden'});
			
			/** Disabled submit button **/
			document.getElementById('com_submit').style.opacity='0';
			form.find('input[type=\'submit\']').attr('disabled','disabled');
			$('#captcha_check').attr('value',pass);//将产生的随机值写入到hidden的input框准备提要到后台验证
			/** Construct DOM **/
			bgSlider.appendTo($this);
			Icons.insertAfter(bgSlider);
			Clr.insertAfter(Icons);
			TxtStatus.insertAfter(Clr);
			//inputQapTcha.appendTo($this);
			Slider.appendTo(bgSlider);
			$this.show();
			Slider.draggable({ 
				containment: bgSlider,
				axis:'x',
				stop: function(event,ui){
					if(ui.position.left > 150)
					{
						$.ajax({   
							type: "POST",  
							dataType: "text",  
							url: '../../index.php/comment',  
							data: 'captcha=' + pass,                
							success: function(data) {                                   
								Slider.draggable('disable').css('cursor','default');
								inputQapTcha.val("");
								TxtStatus.text(opts.txtUnlock).addClass('dropSuccess').removeClass('dropError');
								Icons.css('background-position', '-16px 0');
								form.find('input[type=\'submit\']').fadeTo(600, 1);
								form.find('input[type=\'submit\']').removeAttr('disabled');
							}  
						});  
						//var $js=jQuery.noConflict();
						/*-----这里ajax用post方式提交到后台,后台用session保存这个随机值以便后面和提交过来的随机值比对达到crsf防护作用--------*/
						/*
						$js.post("index.php/comments_insert",{
										captcha : pass
									},
									function(data) {
										if(data.error)
										{
											TxtStatus.text(data.error);
											//document.getElementById('com_submit').style.display='block';
										}
									});
						*/
						/*
						// set the SESSION iQaptcha in PHP file
						var $js=jQuery.noConflict();
						$js.post("ui/Qaptcha.jquery.php",{
							action : 'qaptcha'
						},
						function(data) {
							if(!data.error)
							{
								Slider.draggable('disable').css('cursor','default');
								inputQapTcha.val("");
								TxtStatus.text(opts.txtUnlock).addClass('dropSuccess').removeClass('dropError');
								Icons.css('background-position', '-16px 0');
								form.find('input[type=\'submit\']').fadeTo(600, 1);
								form.find('input[type=\'submit\']').removeAttr('disabled');
								//document.getElementById('com_submit').style.display='block';
								
							}
						},'json');
						*/
					}
				}
			});
			
			function generatePass() {
		        var chars = 'azertyupqsdfghjkmwxcvbn23456789AZERTYUPQSDFGHJKMWXCVBN';
		        var pass = '';
		        for(i=0;i<10;i++){
		            var wpos = Math.round(Math.random()*chars.length);
		            pass += chars.substring(wpos,wpos+1);
		        }
		        return pass;
		    }
			
		});
	}
}; jQuery.fn.QapTcha = jQuery.QapTcha.build;