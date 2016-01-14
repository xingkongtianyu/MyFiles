/*
@file 前端用户行为跟踪
@author <caoyu#at#csdn.net>
@version 20140109
*/

var __slice = [].slice;

(function(definition, undef) {
  var $, exports, global, i, t;
  global = this;
  $ = global.jQuery;
  exports = {};
  definition(global, exports, $);
  if (global.csdn === undef) {
    global.csdn = exports;
  }
  for (i in exports) {
    global[i] = global.csdn[i] = exports[i];
  }
  t = exports.tracking;
  t({
    '': [t.baseParams, t.tos, t.sessionId],
    'bbs.csdn.net': t.tags('/topics/', 'div.tag span'),
    'blog.csdn.net': t.tags('/article/details/', 'div.tag2box a'),
    'ask.csdn.net': t.tags('/questions/', 'div.tag_data a.tag span'),
    'download.csdn.net': t.tags('/detail/', 'div.info a[href^="/tag/"]'),
    'www.csdn.net': [t.tags('/article/', 'div.tag a'), t.cmsPid],
    'www.csto.com': t.tags('/p/', 'span.tech a'),
    'www.iteye.com': t.tags('/topic/', '#topic_tags a')
  });
})(function(global, exports, $) {
  var crossdomainGet, doc, domReady, flush, fns, hack, loaded, loc, protocol, querySelectorAll, testEl, topDomain, tracking;
  doc = global.document;
  loc = global.location;
  protocol = loc.protocol.substr(0, 4) === 'http' ? '' : 'http:';
  fns = [];
  testEl = doc.documentElement;
  hack = testEl.doScroll;
  loaded = (hack ? /^loaded|^c/ : /^loaded|c/).test(doc['readyState']);
  flush = function() {
    var f;
    loaded = 1;
    while (f = fns.shift()) {
      f();
    }
  };
  if (typeof doc.addEventListener === "function") {
    doc.addEventListener('DOMContentLoaded', function() {
      doc.removeEventListener('DOMContentLoaded', arguments.callee, false);
      flush();
    });
  }
  if (hack) {
    doc.attachEvent('onreadystatechange', function() {
      if (/^c/.test(doc.readyState)) {
        doc.detachEvent('onreadystatechange', arguments.callee);
        flush();
      }
    });
  }
  domReady = hack ? function(fn) {
    if (global.self !== global.top) {
      if (loaded) {
        return fn();
      } else {
        return fns.push(fn);
      }
    } else {
      try {
        testEl.doScroll('left');
      } catch (_error) {
        global.setTimeout(function() {
          domReady(fn);
        }, 50);
        return;
      }
      fn();
    }
  } : function(fn) {
    if (loaded) {
      fn();
    } else {
      fns.push(fn);
    }
  };
  topDomain = function(d) {
    return /\.?([a-z0-9\-]+\.[a-z0-9\-]+)(:\d+)?$/.exec(d)[1];
  };
  /*
  对外公开的跟踪函数tracking
  @param {Object} opts 定义了不同域名下要收集的信息
  */

  exports.tracking = tracking = function(opts) {
    domReady(function() {
      var data, i, opt, _i, _j, _len, _len1, _ref;
      data = {};
      _ref = [opts[loc.host], opts['']];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        opt = _ref[_i];
        if (opt) {
          if (typeof opt === 'function') {
            opt(data);
          } else {
            for (_j = 0, _len1 = opt.length; _j < _len1; _j++) {
              i = opt[_j];
              if (typeof i === "function") {
                i(data);
              }
            }
          }
        }
      }
      crossdomainGet(data);
    });
  };
  /*
  附加基本的参数到数据上，包括referrer user_name oid pid x-acl-token
  */

  tracking.baseParams = function(data) {
    var _ref, _ref1, _ref2, _ref3, _ref4;
    data.user_name = /iteye.com$/.test(loc.host) ? ((_ref = />欢迎([^<]+)<\/a>/.exec((_ref1 = doc.getElementById('user_nav')) != null ? _ref1.innerHTML : void 0)) != null ? _ref[1] : void 0) || '' : ((_ref2 = /(; )?(UserName)=([^;]+)/.exec(doc.cookie)) != null ? _ref2[3] : void 0) || '';
    data['x-acl-token'] = 'status_js_dkuyqthzbajmncbsb_token';
    if (!data.pid) {
      data.pid = /iteye.com$/.test(loc.host) ? 'iteye' : doc.body.getAttribute('data-pid') || ((_ref3 = /(\w+)\.\w+\.\w+$/.exec(loc.host)) != null ? _ref3[1] : void 0);
    }
    data.oid = ((_ref4 = querySelectorAll('.h-entry .p-author')[0]) != null ? _ref4.innerHTML.replace(/^\s+|\s+$/g, '') : void 0) || '';
    return data.referrer = doc.referrer;
  };
  tracking.sessionId = function(data) {
    var num, rand, sid, _ref, _ref1;
    sid = (_ref = /\bdc_session_id=([^;]*)(?:$|;)/.exec(doc.cookie)) != null ? _ref[1] : void 0;
    try {
      _ref1 = sid.split('|'), rand = _ref1[0], num = _ref1[1];
      if (rand) {
        rand = parseInt(rand, 36);
      }
      num = parseInt(num, 10);
    } catch (_error) {}
    if (!rand) {
      rand = Math.random() * Math.pow(10, 16) | 0;
    }
    if (!num) {
      num = 0;
    }
    num++;
    doc.cookie = "dc_session_id=" + (rand.toString(36)) + "|" + num + "; path=/; domain=." + (topDomain(loc.host));
    return data.session_id = "" + data.user_name + "_" + rand + "_" + num;
  };
  /*
  附加上一页面及停留时间到数据上
  */

  tracking.tos = function(data) {
    var e, now, t, tos, _ref;
    now = +new Date() / 1000 | 0;
    t = (_ref = /\bdc_tos=([^;]*)(?:$|;)/.exec(doc.cookie)) != null ? _ref[1] : void 0;
    try {
      tos = now - parseInt(t, 36);
    } catch (_error) {
      e = _error;
      tos = -1;
    }
    doc.cookie = "dc_tos=" + (now.toString(36)) + "; expires=" + (new Date((now + 4 * 60 * 60) * 1000).toGMTString()) + "; max-age=" + (4 * 60 * 60) + "; path=/; domain=." + (topDomain(loc.host));
    return data.tos = tos;
  };
  /*
  返回附加tag参数到数据上的函数，只在指定的path中生效，具体的tags由selectors指定
  @param {String/RegExp} path 要匹配的地址路径片段
  @param {Array[String/Function]} selectors tag的选择器或者是返回tag数组的函数列表
  */

  tracking.tags = function() {
    var path, selectors;
    path = arguments[0], selectors = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return function(data) {
      var e, eles, i, result, sel, t, _i, _j, _k, _len, _len1, _len2, _ref;
      if (typeof path === 'string' && !~loc.pathname.indexOf(path) || path instanceof RegExp && !path.test(loc.pathname)) {
        return;
      }
      eles = [];
      for (_i = 0, _len = selectors.length; _i < _len; _i++) {
        sel = selectors[_i];
        _ref = (typeof sel === 'string' ? querySelectorAll(sel) : (typeof sel === "function" ? sel() : void 0) || []);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          i = _ref[_j];
          eles.push(i);
        }
      }
      result = {};
      for (_k = 0, _len2 = eles.length; _k < _len2; _k++) {
        e = eles[_k];
        result[e.innerHTML.replace(/^\s+|\s+$/g, '')] = 1;
      }
      data.tag = ((function() {
        var _results;
        _results = [];
        for (t in result) {
          _results.push(t);
        }
        return _results;
      })()).join();
    };
  };
  /*
  附加pid参数到数据上的函数，针对 www.csdn.net/article/ 下的文章页探测真实pid
  */

  tracking.cmsPid = function(data) {
    if (loc.pathname.indexOf('/article/') === -1) {
      return;
    }
    try {
      return data.pid = querySelectorAll('.brea_nav > a')[1].hostname.match(/(\w+)\.\w+\.\w+$/)[1];
    } catch (_error) {

    }
  };
  /*
  使用CSS选择器检索对应的DOM元素
  @param {String} selector - CSS选择器
  @returns {Array[HTMLElement]} HTML元素集合，如果浏览器不支持使用CSS选择器查找将返回 undefined，如果找不到任何元素返回0长度的近似数组
  */

  tracking.querySelectorAll = querySelectorAll = function(selector) {
    return (typeof doc.querySelectorAll === "function" ? doc.querySelectorAll(selector) : void 0) || (typeof $ === "function" ? $(selector) : void 0) || global.Prototype && (typeof global.$$ === "function" ? global.$$(selector) : void 0) || [];
  };
  /*
  发送跨域HTTP GET请求
  @param {String} url - 请求的Url，忽略将使用默认的行为跟踪地址
  @param {Object} data - 请求要提交的数据
  */

  return tracking.crossdomainGet = crossdomainGet = function(data) {
    var i, p;
    data[Math.random() * 10000 | 0] = '';
    i = new Image();
    i.onload = i.onerror = function() {
      i.onload = i.onerror = null;
      i.removeAttribute('src');
      i = null;
    };
    i.src = protocol + '//dc.csdn.net/track?' + ((function() {
      var _results;
      _results = [];
      for (p in data) {
        _results.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
      }
      return _results;
    })()).join('&');
  };
});
