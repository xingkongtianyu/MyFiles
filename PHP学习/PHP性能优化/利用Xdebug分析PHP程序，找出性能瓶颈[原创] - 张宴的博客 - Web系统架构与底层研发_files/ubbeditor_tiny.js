/* -----------------------------------------------------
UBB Code Editor for Bo-Blog 2
Code: Bob Shen <bob.shen@gmail.com>
Offical site: http://www.bo-blog.com
Copyright (c) Bob Shen
------------------------------------------------------- */

var clientVer = navigator.userAgent.toLowerCase(); // Get browser version
var is_firefox = ((clientVer.indexOf("gecko") != -1) && (clientVer.indexOf("firefox") != -1) && (clientVer.indexOf("opera") == -1)); //Firefox or other Gecko

function AddText(NewCode) {
	document.getElementById('v_content').value+=NewCode
	document.getElementById('v_content').focus();
}

// From http://www.massless.org/mozedit/
function FxGetTxt(open, close)
{
	var selLength = document.getElementById('v_content').textLength;
	var selStart = document.getElementById('v_content').selectionStart;
	var selEnd = document.getElementById('v_content').selectionEnd;
	if (selEnd == 1 || selEnd == 2)  selEnd = selLength;
	var s1 = (document.getElementById('v_content').value).substring(0,selStart);
	var s2 = (document.getElementById('v_content').value).substring(selStart, selEnd)
	var s3 = (document.getElementById('v_content').value).substring(selEnd, selLength);
	document.getElementById('v_content').value = s1 + open + s2 + close + s3;
	return;
}

function email() {
	txt=prompt(jslang[23],"name\@domain.com");      
	if (txt!=null) {
		AddTxt="[email]"+txt+"[/email]";
		AddText(AddTxt);
	}
}

function bold() {
if (document.selection && document.selection.type == "Text") {
		var range = document.selection.createRange();
		range.text = "[b]" + range.text + "[/b]";
} 
else if (is_firefox && document.getElementById('v_content').selectionEnd) {
	txt=FxGetTxt ("[b]", "[/b]");
	return;
} else {
	txt=prompt(jslang[24],jslang[26]);
	if (txt!=null) {
		AddTxt="[b]"+txt;
		AddText(AddTxt);
		AddTxt="[/b]";
		AddText(AddTxt);
	}
}
}

function italicize() {
if (document.selection && document.selection.type == "Text") {
		var range = document.selection.createRange();
		range.text = "[i]" + range.text + "[/i]";
} else if (is_firefox && document.getElementById('v_content').selectionEnd) {
	txt=FxGetTxt ("[i]", "[/i]");
	return;
} else {
	txt=prompt(jslang[25],jslang[26]);
	if (txt!=null) {
		AddTxt="[i]"+txt;
		AddText(AddTxt);
		AddTxt="[/i]";
		AddText(AddTxt);
	}
}
}

function underline() {
if (document.selection && document.selection.type == "Text") {
		var range = document.selection.createRange();
		range.text = "[u]" + range.text + "[/u]";
} else if (is_firefox && document.getElementById('v_content').selectionEnd) {
	txt=FxGetTxt ("[u]", "[/u]");
	return;
} else {
	txt=prompt(jslang[27],jslang[26]);
	if (txt!=null) {
		AddTxt="[u]"+txt;
		AddText(AddTxt);
		AddTxt="[/u]";
		AddText(AddTxt);
	}
}
}

function quoteme() {
if (document.selection && document.selection.type == "Text") {
		var range = document.selection.createRange();
		range.text = "[quote]" + range.text + "[/quote]";
} else if (is_firefox && document.getElementById('v_content').selectionEnd) {
	txt=FxGetTxt ("[quote]", "[/quote]");
	return;
} else {
	txt=prompt(jslang[28],jslang[26]);
	if(txt!=null) {
		AddTxt="[quote]"+txt;
		AddText(AddTxt);
		AddTxt="[/quote]";
		AddText(AddTxt);
	}
}
}

function hyperlink() {
if (document.selection && document.selection.type == "Text") {
		var range = document.selection.createRange();
		txt=prompt(jslang[29],"http://");
		range.text = "[url=" + txt + "]" + range.text + "[/url]";
} else if (is_firefox && document.getElementById('v_content').selectionEnd) {
	txt=prompt(jslang[29],"http://");
	txt=FxGetTxt ("[url=" + txt + "]", "[/url]");
	return;
} else {
	txt2=prompt(jslang[30]+"\n"+jslang[31],"");
	if (txt2!=null) {
		txt=prompt(jslang[32],"http://");
		if (txt!=null) {
			if (txt2=="") {
				AddTxt="[url]"+txt;
				AddText(AddTxt);
				AddTxt="[/url]";
				AddText(AddTxt);
			} else {
				AddTxt="[url="+txt+"]"+txt2;
				AddText(AddTxt);
				AddTxt="[/url]";
				AddText(AddTxt);
			}
		}
	}
}
}


function image() {
	txt=prompt(jslang[33],"http://");
	if(txt!=null) {
		AddTxt="[img]"+txt+"[/img]";
		AddText(AddTxt);
	}
}