(function() {

var xmlHttp;

function getXmlHttpObject() {
	var xmlHttp = null;

	try {
		xmlHttp = new XMLHttpRequest();
	} catch(e) {
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	return xmlHttp;
}

function showall(wpurl, args, loading) {

	xmlHttp = getXmlHttpObject();
	if (xmlHttp == null) {
		alert ("Oop! Browser does not support HTTP Request.")
		return;
	}

	var url = wpurl;
	url += "?action=ml_ajax";
	url += "&args=" + args;

	xmlHttp.onreadystatechange = function(){runChange(loading)};
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function runChange(loading) {
	var navigator = document.getElementById("ml_nav");
	var parent = navigator.parentNode;

	if (xmlHttp.readyState < 4) {
		document.body.style.cursor = 'wait';
		navigator.innerHTML = (loading == undefined) ? "Loading..." : loading + "...";

	} else if (xmlHttp.readyState == 4 || xmlHttp.readyState=="complete") {
		parent.innerHTML = xmlHttp.responseText;
		document.body.style.cursor = 'auto';
	}
}

window['MLJS'] = {};
window['MLJS']['showall'] = showall;

})();