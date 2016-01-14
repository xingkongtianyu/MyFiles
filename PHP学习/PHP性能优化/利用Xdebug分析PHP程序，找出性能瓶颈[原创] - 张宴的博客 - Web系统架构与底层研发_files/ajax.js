var http_request = false;
function makeRequest(url, functionName, httpType, sendData) {

	http_request = false;
	if (!httpType) httpType = "GET";

	if (window.XMLHttpRequest) { // Non-IE...
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {
			http_request.overrideMimeType('text/plain');
		}
	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!http_request) {
		alert('Cannot send an XMLHTTP request');
		return false;
	}

	var changefunc="http_request.onreadystatechange = "+functionName;
	eval (changefunc);
	//http_request.onreadystatechange = alertContents;
	http_request.open(httpType, url, true);
	http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	http_request.send(sendData);
}

function getReturnedText () {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			return messagereturn;
		} else {
			alert('There was a problem with the request.');
		}
	}
}


function starblog() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn == 'ok') {
				var staridcon=document.getElementById(currentstarid);
				if (staridcon.innerHTML.indexOf("/starred.gif")!=-1) {
					staridcon.innerHTML="<a href=\"javascript: dostar('"+currentblogid+"');\"><img src=\""+moreimagepath+"/others/unstarred.gif\" alt=\"\" title=\""+jslang[14]+"\" border=\"0\"/></a>";
				} else {
					staridcon.innerHTML="<a href=\"javascript: dostar('"+currentblogid+"');\"><img src=\""+moreimagepath+"/others/starred.gif\" alt=\"\" title=\""+jslang[15]+"\" border=\"0\"/></a>";
				}
			}
			else alert(messagereturn);
		} else {
			alert('There was a problem with the request.');
		}
	}
}

function quickreply () {
	var new_addnew=document.getElementById('addnew');
	var new_btnSubmit=document.getElementById('btnSubmit');
	var new_vcontent=document.getElementById('v_content');
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				new_btnSubmit.value=jslang[1];
				new_btnSubmit.disabled='';
				refreshsecuritycode('securityimagearea', 'v_security');
				alert(messagereturn);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::success>", '');
				messagereturn=messagereturn.replace(/\\/g, '');

				new_addnew.innerHTML=messagereturn+new_addnew.innerHTML;
				new_btnSubmit.value=jslang[1];
				new_btnSubmit.disabled='';
				new_vcontent.value='';
				onetimecounter+=1;
				refreshsecuritycode('securityimagearea', 'v_security');
				window.location.hash="topreply";
			} else {
				alert(messagereturn);
			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}

function quickadminreply() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::success>", '');
				var newcomid="blogcomment"+currentcommentid;
				document.getElementById(newcomid).innerHTML=messagereturn;
			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}

function quickdeladminreply() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				alert(messagereturn);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				var admrpid="replied_com_"+currentcommentid;
				document.getElementById(admrpid).innerHTML='';
				document.getElementById(admrpid).style.display='none';
			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}

function quickdelreply() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				alert(messagereturn);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				var rpid="blogcomment"+currentcommentid;
				document.getElementById(rpid).innerHTML='';
				document.getElementById(rpid).style.display='none';
			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}

function quicklogin() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				refreshsecuritycode('securityimagearea', 'securitycode');
				alert(messagereturn);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::success>", '');
				var cookieset=messagereturn.split('-');
				var dateObjexp= new Date();
				if (cookieset[2]==0) var dateObjexp=null;
				else dateObjexp.setSeconds(cookieset[2]);
				setCookie ('userid',cookieset[0],dateObjexp,null, null, false);
				setCookie ('userpsw',cookieset[1],dateObjexp,null, null, false);
				window.location="login.php?job=ajaxloginsuccess";
			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}

function quickaddcategory() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				alert(messagereturn);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::success>", '');
				document.getElementById('cateselarea').innerHTML=messagereturn;
			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}

function quickgetprotectedblog () {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				alert(messagereturn);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::success>", '');
				document.getElementById('protectedentry'+currentblogid).innerHTML=messagereturn;

			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}

function quickeditcomment () {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				alert(messagereturn);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::success>", '');
				document.getElementById('blogcomment'+currentcommentid).innerHTML=messagereturn;
			}
		}  else {
			alert('There was a problem with the request.');
		}
	}
}


function adminSubmitAjaxRun() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (messagereturn.indexOf("<boblog_ajax::error>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::error>", '');
				adminAjaxAlert(messagereturn, 1);
			} else if (messagereturn.indexOf("<boblog_ajax::success>")!=-1) {
				messagereturn=messagereturn.replace("<boblog_ajax::success>", '');
				if (messagereturn.indexOf("<boblog_ajax::fetch>")!=-1) {
					var tmpmsg=messagereturn.split("<boblog_ajax::fetch>");
					messagereturn=tmpmsg[0];
					ajaxURL=tmpmsg[1]+"&ajax=on";
					makeRequest(ajaxURL, 'adminFetchAjaxRun', 'GET', null);
				}
				adminAjaxAlert(messagereturn, 0);
			}
		}  else {
			adminAjaxAlert('There was a problem with the request.', 1);
		}
	}
}

function adminFetchAjaxRun() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var messagereturn = http_request.responseText;
			if (document.getElementById('admininner')) {
				document.getElementById('admininner').innerHTML=messagereturn;
			}
		}
	}
}
