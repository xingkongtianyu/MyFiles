var jQCmt_server='http://comment2.csdn.net';
function _$(e,v){return (v==null)?document.getElementById(e):((v=='hide')?document.getElementById(e).style.display='none':document.getElementById(e).style.display='');}

var jQCmt = {
		server:null,
		params:null,
		signed:false,
		avatar:null,
		width:0,

		load: function() {
			if(typeof($)=="undefined"){
				_$('comment','hide');
				return;
			}
			this.server=jQCmt_server;
			this.avatar=this.server+'/images/i.jpg';
			if( typeof(jQCmt_params)=='undefined' ) {
				var jQCmt_params = new Object();
				var c = $('#jQCmt_params');
				if( c.length>0 ) {
					jQCmt_params['fid'] = jQuery.trim($(c).attr('fid'));
					jQCmt_params['tid'] = jQuery.trim($(c).attr('tid'));
					jQCmt_params['rid'] = jQuery.trim($(c).attr('rid'));
					jQCmt_params['url'] = jQuery.trim($(c).attr('url'));
					jQCmt_params['dateline'] = jQuery.trim($(c).attr('dateline'));
					jQCmt_params['width'] = jQuery.trim($(c).attr('width'));
					jQCmt_params['digest'] = jQuery.trim($(c).attr('digest'));
					jQCmt_params['title'] = jQuery.trim($(c).text());
					$('#jQCmt_params').hide();
				} else {
					jQCmt_params['width'] = 0;
					jQCmt_params['url'] = jQuery.trim(document.location.href);
					jQCmt_params['title'] = jQuery.trim(document.title);
				}
				jQCmt_params['keywords'] = $("meta[name='keywords']").length>0?$("meta[name='keywords']").attr('content'):$("meta[name='Keywords']").attr('content');
				jQCmt_params['desc'] = $("meta[name='description']").length>0?$("meta[name='description']").attr('content'):$("meta[name='Description']").attr('content');
			}
			this.width=jQCmt_params['width']==''?0:jQCmt_params['width'];
			this.params = jQCmt_params;
			this.addStyleSheet(this.server+'/style/comment.css');
			if($('#commentlist').length<1) {
				document.write('<div id="commentlist"></div>');
			}
			if($('#commentpage').length<1) {
				document.write('<div id="commentpage">...</div>');
			}
			this.loadCmtForm();
			this.loadRplForm();
			this.getCmt();
			
			$(window).resize(function(){$("#commentform textarea").width( (jQCmt.width>0)?jQCmt.width:($("#commentform .commenttitle").width()-6));});
			$(window).resize();
			$(window).load(function(){$(window).resize();});
		},

		mkHtpRequest: function(e,url) {
			if(url=='###'||url.indexOf('###')>0) return;
			var rs = _$(e);
			var h = document.getElementsByTagName('head').item(0);
			if(rs) h.removeChild(rs);
			var d = new Date();
			rs=document.createElement("script");
			rs.setAttribute("id", e);
			rs.setAttribute("language","javascript");
			rs.setAttribute("type","text/javascript");
			rs.setAttribute("src", url+'&'+d.getTime());
			h.appendChild(rs);
			return rs;
		},
		
		addStyleSheet:function(url) {
			var h = document.getElementsByTagName('head').item(0);
			var rs=document.createElement("link");
			rs.setAttribute("rel","stylesheet");
			rs.setAttribute("type","text/css");
			rs.setAttribute("media","all");
			rs.setAttribute("href", url);
			h.appendChild(rs);
		},
		
		getCmt: function(url) {
			if(url==null) {
				var url = this.server+'/review.php?ac=load';
				for(var k in this.params){
					url += '&'+k+'='+encodeURIComponent(this.params[k]);
				}
			}
			this.mkHtpRequest('jQCmtGetCmtScript', url);
		},

		reply: function(cid,ct) {
			$('#cmtRplBlock').remove();
			$('#rplMsg').hide();
			$(((ct>0)?'#dcomment_':'#comment_')+cid+'>p.detail').after('<div id="cmtRplBlock">'+$('#replycomment').html()+'</div>');
			$('#cmtRplBlock #rCcid').val(cid);
			$('#cmtRplBlock #rDcid').val((ct>0)?cid:0);
			if(this.signed){$("#cmtRplBlock input[name='anonymous']").attr("checked","");}
			$("#cmtRplBlock textarea").width( $("#cmtRplBlock .commenttitle").width()-2 );
		},
		
		append: function(cid,k,h,ct) {
			if(ct>0) {
				if($('#dccommentlist_'+k).length>0) {
					$('#dccommentlist_'+k).append(h);
					$('#comment_'+cid).hide();
					$('#comment_'+cid).slideDown("slow");
					return;
				}
			}
			if(k>0) {
				$('#ccommentlist_'+k).append(h);
			} else {
				if($('#commentlist>ul.commentlist').length<1) {
					$('#commentlist').html('<ul class="commentlist"></ul>');
				}
				$('#commentlist>ul.commentlist').prepend(h);
				this.scrollTo('#comment');
			}
			$('#comment_'+cid).hide();
			$('#comment_'+cid).slideDown("slow");
		},
		
		report:function(cid,key) {
			var s=window.prompt('请输入举报原因..','垃圾广告');  
		    if(s==""||s==null) {
		    	alert('请输入举报原因。');
		    } else {
		    	$('#cmtRpt_'+cid).text('正在提交..');
		    	var ss = this.server+'/comment.php?ac=report&cid='+cid+'&ckey='+key+'&msg='+s;
				this.mkHtpRequest('jQCmtRptScript', ss);
		    }
		},
		
		digg:function(cid,key) {
		    $('#cmtDig_'+cid).text('正在提交..');
		    $('#dcmtDig_'+cid).text('正在提交..');
		    var ss = this.server+'/comment.php?ac=digg&cid='+cid+'&ckey='+key;
			this.mkHtpRequest('jQCmtDiggScript', ss);
		},
		
		bury:function(cid,key) {
		    $('#cmtBry_'+cid).text('正在提交..');
		    $('#dcmtBry_'+cid).text('正在提交..');
		    var ss = this.server+'/comment.php?ac=bury&cid='+cid+'&ckey='+key;
			this.mkHtpRequest('jQCmtBuryScript', ss);
		},
		
		del:function(cid){
			if(window.confirm('确认要删除吗？')){
			    $('#cmtDel_'+cid).text('正在删除..');
			    var ss = this.server+'/comment.php?ac=del&cid='+cid;
				this.mkHtpRequest('jQCmtDelScript', ss);
			}
		},

		digest:function(cid){
			if(window.confirm('确认要设为精华吗？')){
			    $('#cmtDigest_'+cid).text('设为精华..');
			    var ss = this.server+'/comment.php?ac=digest&cid='+cid;
				this.mkHtpRequest('jQCmtDigestScript', ss);
			}
		},
		
		dig:function(val){
			var ss = this.server+'/comment.php?ac=dig&val='+val;
			for(var k in this.params){
				ss += '&'+k+'='+this.params[k];
			}
			this.mkHtpRequest('jQCmtDigScript', ss);
		},
		
		msg: function(m,e,a) {
			if(e==null) e='#cmtMsg';
			$('.commentform input:submit').attr('disabled', '');
			if(a) {alert(m);$(e).hide();}
			else {
				if(m.indexOf('"loading"')>0) {
					$(e).html('<span>'+m+'</span>');
					$(e).show();
				} else {
					$(e).hide();
					$(e).html('<span>'+m+'</span>');
					$(e).fadeIn();
				}
			}
		},
		
		OK: function(e) {
			$(".commentform input:text").attr('value', '');
			$(".commentform input:password").attr('value', '');
			$(".commentform textarea").attr('value', '');
			$(".commentform textarea").empty();
			if(e=='#rplMsg') {
				$('#cmtRplBlock').fadeOut();
			}
			$(".commenttitle em").empty();
		},
		
		submit: function(f) {
			if($(f.message).val().length>800){
				alert('评论内容超长了，请控制在800个字以内。');return;
			}
			if(f.ac.value=='comment') {
				f.ccid.value=0;
			}
			if(f.ccid.value>0) {
				this.msg('<em class="loading">正在提交..</em>','#rplMsg');
			} else {
				this.msg('<em class="loading">正在提交..</em>','#cmtMsg');
			}
			$('.commentform input:submit').attr('disabled', 'disabled');
			this.mkHtpRequest('jQCmtSmtScript',f.action+'&'+$(f).serialize());
		},
		
		txtCounter:function(t){
			var len = $(t).val().length;
			var e = '#'+t.form.ac.value+'words';
			if(len>800){
				$(e).html('评论内容超长了');
				$(e).css('color','red');
				t.form.submit.disabled='disabled';
			} else {
				$(e).html('还可以输入<b>'+(800-len)+'</b>个字');
				$(e).css('color','#666666');
				t.form.submit.disabled='';
			}
		},

		scrollTo:function(o){
			var p=$(o).position();
			window.scrollTo(p.left,p.top);
		},

		loadCmtForm: function() {
			document.write('<div id="commentform" class="commentform">');
			document.write('<div class="commenttitle"><em id="commentwords"></em><strong><a name="postcomment" href="#postcomment">发表评论</a>/共<span class="reviewcount">0</span>条评论</strong>..</div>');
			document.write('<div id="cmtMsg"></div>');
			document.write('<form action="'+this.server+'/comment.php?ac=comment" method="post" onsubmit="jQCmt.submit(this);return false;">');
			document.write('<input type="hidden" name="ac" value="comment" />');
			document.write('<input type="hidden" name="ccid" value="0" />');
			document.write('<input type="hidden" name="fid" value="'+this.params['fid']+'" />');
			document.write('<input type="hidden" name="tid" value="'+this.params['tid']+'" />');
			document.write('<input type="hidden" name="rid" value="'+this.params['rid']+'" />');
			document.write('<input type="hidden" name="url" value="'+this.params['url']+'" />');
			document.write('<textarea name="message" onkeyup="jQCmt.txtCounter(this);" onfocus="if(_$(\'cAImg\').alt==\'\'){_$(\'cAImg\').alt=\'验证码\';_$(\'cAImg\').src=\''+this.server+'/v.php?ac=vpic\';};" onkeydown="if(event.ctrlKey&&event.keyCode==13){event.returnValue=false;event.cancel=true;this.form.submit.click();this.blur();};"></textarea><br />');
			document.write('<input type="submit" class="submit" name="submit" value="发表评论" />');
			//document.write('<span id="cLPnl"><label>登录名：<input type="text" class="input" name="uname" /></label> <label>密码：<input type="password" class="input" name="upass" /></label></span>');
			document.write('<span id="cLPnl"><label></label></span>');
			//document.write('<span id="cAPnl"><label>验证码：<input type="text" class="input" name="authcode" onfocus="if(_$(\'cAImg\').alt==\'\'){_$(\'cAImg\').alt=\'验证码\';_$(\'cAImg\').src=\''+this.server+'/v.php?ac=vpic\';};"/> <img id="cAImg" src="'+this.server+'/images/none.gif" onclick="var d=new Date();this.src=\''+this.server+'/v.php?ac=vpic&d=\'+d.getTime();" title="看不清楚，点击换一张" /></label></span>');
			document.write('<label style="cursor:pointer;display:none;"> <input type="checkbox" name="anonymous" checked="checked" value="1" onclick="if(this.checked){_$(\'cLPnl\',\'hide\');_$(\'cAPnl\',\'show\');}else{_$(\'cLPnl\',\'show\');_$(\'cAPnl\',\'hide\');}" />匿名评论(无需注册)</label>');
			document.write('</form>');
			document.write('<div class="cmtNotice"><strong>请您注意</strong><br />·自觉遵守：爱国、守法、自律、真实、文明的原则<br />·尊重网上道德，遵守《全国人大常委会关于维护互联网安全的决定》及中华人民共和国其他各项有关法律法规<br />·严禁发表危害国家安全，破坏民族团结、国家宗教政策和社会稳定，含侮辱、诽谤、教唆、淫秽等内容的作品<br />·承担一切因您的行为而直接或间接导致的民事或刑事法律责任<br />·您在CSDN新闻评论发表的作品，CSDN有权在网站内保留、转载、引用或者删除<br />·参与本评论即表明您已经阅读并接受上述条款</div>');
			document.write('</div>');
		},

		loadRplForm: function() {
			document.write('<div id="replycomment" style="display:none;">');
			document.write('<div class="replyform commentform">');
			document.write('<div class="commenttitle"><em id="replywords"></em><strong>回复</strong></div>');
			document.write('<div id="rplMsg"></div>');
			document.write('<form action="'+this.server+'/comment.php?ac=reply" method="post" onsubmit="jQCmt.submit(this);return false;">');
			document.write('<input type="hidden" name="ac" value="reply" />');
			document.write('<input type="hidden" name="ccid" id="rCcid" value="0" />');
			document.write('<input type="hidden" name="dcid" id="rDcid" value="0" />');
			document.write('<input type="hidden" name="fid" value="'+this.params['fid']+'" />');
			document.write('<input type="hidden" name="tid" value="'+this.params['tid']+'" />');
			document.write('<input type="hidden" name="rid" value="'+this.params['rid']+'" />');
			document.write('<input type="hidden" name="url" value="'+this.params['url']+'" />');
			document.write('<textarea name="message" onkeyup="jQCmt.txtCounter(this);" onfocus="if($(\'.rAImg\').attr(\'alt\')==\'\'){$(\'.rAImg\').attr(\'alt\',\'验证码\');$(\'.rAImg\').attr(\'src\',\''+this.server+'/v.php?ac=vpic\');};" onkeydown="if(event.ctrlKey&&event.keyCode==13){event.returnValue=false;event.cancel=true;this.form.submit.click();this.blur();};"></textarea><br />');
			document.write('<input type="submit" class="submit" name="submit" value="回复评论" />');
			//document.write('<span class="rLPnl"><label>登录名：<input type="text" class="input" name="uname" /></label> <label>密码：<input type="password" class="input" name="upass" /></label></span>');
			document.write('<span id="cLPnl"><label></label></span>');
			//document.write('<span class="rAPnl"><label>验证码：<input type="text" class="input" name="authcode" onfocus="if($(\'.rAImg\').attr(\'alt\')==\'\'){$(\'.rAImg\').attr(\'alt\',\'验证码\');$(\'.rAImg\').attr(\'src\',\''+this.server+'/v.php?ac=vpic\');};"/> <img class="rAImg" src="'+this.server+'/images/none.gif" onclick="this.src=\''+this.server+'/v.php?ac=vpic&d=\'+(new Date()).getTime();" title="看不清楚，点击换一张" /></label></span>');
			document.write('<label style="cursor:pointer;display:none;"> <input type="checkbox" name="anonymous" checked="checked" value="1" class="rAnonymous" onclick="if(this.checked){$(\'#cmtRplBlock .rLPnl\').hide();$(\'#cmtRplBlock .rAPnl\').show();$(\'#cmtRplBlock .rAnonymous\').attr(\'checked\',\'checked\');}else{$(\'#cmtRplBlock .rLPnl\').show();$(\'#cmtRplBlock .rAPnl\').hide();$(\'#cmtRplBlock .rAnonymous\').attr(\'checked\',\'\')}" />匿名评论(无需注册)</label>');
			document.write('</form>');
			document.write('</div>');
			document.write('</div>');
		},

		init: function() {
			this.load();
		}
};

jQCmt.init();