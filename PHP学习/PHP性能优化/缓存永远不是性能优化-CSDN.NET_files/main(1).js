/*
Tag推荐弹窗
*/

var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function(definition) {
  var $, exports, global, i, pop;
  global = this;
  $ = global.jQuery;
  exports = {};
  definition(global, exports, $);
  if (global.csdn === void 0) {
    global.csdn = exports;
  }
  for (i in exports) {
    if (!__hasProp.call(exports, i)) continue;
    global[i] = global.csdn[i] = exports[i];
  }
  pop = exports.tagSuggestPop;
  return exports.mapping({
    'bbs.csdn.net': pop('/topics/'),
    'blog.csdn.net': pop('/article/details/'),
    'download.csdn.net': pop('/detail/', '/download/'),
    'www.csdn.net': pop('/article/')
  });
})(function(global, exports, $) {
  var f, fixedSupported, k, keywordsMap, p, recommendAPI, tagSuggestPop, takeKeywords, v;
  p = location.protocol === 'https:' ? 'https:' : 'http:';
  f = $('<div style="position: fixed; top: 10px">').prependTo('body');
  fixedSupported = f[0].offsetTop === 10;
  f.remove();
  exports.mapping = function(opts) {
    return $(function() {
      var cbs, i, _i, _len;
      if (cbs = opts[location.host]) {
        if (typeof cbs === 'function') {
          cbs = [cbs];
        }
        for (_i = 0, _len = cbs.length; _i < _len; _i++) {
          i = cbs[_i];
          if (typeof i === "function") {
            i();
          }
        }
      }
    });
  };
  exports.tagSuggestPop = tagSuggestPop = function() {
    var paths;
    paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function() {
      var i, wd, _i, _len;
      try {
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          i = paths[_i];
          if (~location.pathname.indexOf(i)) {
            throw '';
          }
        }
        return;
      } catch (_error) {

      }
      if (wd = takeKeywords(document.referrer)) {
        return $("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + p + "//csdnimg.cn/public/common/tag-suggest-pop/css/style.css?ae19e92\"/>").appendTo('head').load(function() {
          return recommendAPI(wd, function(data) {
            var ele, n, name;
            if (data.length === 0) {
              return;
            }
            ele = $("<div id=\"tag-suggest-pop\">\n  <div class=\"relative\">\n    <div class=\"close\"></div>\n    <div class=\"content\">\n      <span>更多相关资源：</span>\n      " + (((function() {
              var _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
                name = data[_j].name;
                _results.push("<a href='http://www.csdn.net/tag/" + (encodeURIComponent(name)) + "' target='_blank'>" + name + "</a>");
              }
              return _results;
            })()).join('')) + "\n    </div>\n  </div>\n</div>").appendTo('body');
            if (!fixedSupported) {
              ele.css({
                position: 'absolute',
                bottom: 'auto'
              });
              n = 0;
              $(global).bind('scroll resize', function() {
                clearTimeout(n);
                return n = setTimeout(function() {
                  return ele.css('top', ($('html')[0].scrollTop || $('body')[0].scrollTop) + $(window).height() - ele.height());
                }, 80);
              }).triggerHandler('scroll');
            }
            setTimeout(function() {
              return ele.fadeIn();
            }, 1000);
            return $('.close', ele).click(function() {
              return ele.fadeOut();
            });
          });
        });
      }
    };
  };
  keywordsMap = {
    '.baidu.com': 'wd,bs,word',
    '.so.com': 'q,pq',
    '.soso.com': 'query',
    '.youdao.com': 'q,lq',
    '.bing.com': 'q,pq',
    '.bing.com': 'q,pq',
    '.sogou.com': 'query',
    '.google.com': 'q'
  };
  for (k in keywordsMap) {
    if (!__hasProp.call(keywordsMap, k)) continue;
    v = keywordsMap[k];
    keywordsMap[k] = v.split(',');
  }
  takeKeywords = function(url) {
    var host, i, path, query, ret, skip, wd, _i, _len, _ref, _ref1, _ref2;
    try {
      _ref = /^[\w:]+\/\/([^/]+)([^?]*)\?(.*)$/.exec(url), skip = _ref[0], host = _ref[1], path = _ref[2], query = _ref[3];
    } catch (_error) {
      return;
    }
    for (k in keywordsMap) {
      if (!__hasProp.call(keywordsMap, k)) continue;
      v = keywordsMap[k];
      if (!(~host.indexOf(k))) {
        continue;
      }
      wd = v;
      break;
    }
    if (!wd) {
      return;
    }
    ret = [];
    _ref1 = query.split('&');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _ref2 = i.split('='), k = _ref2[0], v = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
      if (__indexOf.call(wd, k) >= 0) {
        ret.push(decodeURIComponent(v.join('=')).replace(/\+/g, ' '));
      }
    }
    return ret.join(' ');
  };
  return recommendAPI = function(data, cb) {
    var contentId;
    if (typeof data === 'string') {
      data = {
        title: data,
        body: data
      };
    }
    contentId = 'tagsCallback' + +new Date();
    global[contentId] = {
      title: data.title,
      content: data.body,
      onGetTag: function(data) {
        try {
          delete global[contentId];
        } catch (_error) {

        }
        cb(data);
        return setTimeout(function() {
          return $('#' + contentId).remove();
        }, 1000);
      }
    };
    document.domain = 'csdn.net';
    return $('body').append("<iframe id='" + contentId + "'      src='//recommend.api.csdn.net/proxy.html?X-ACL-TOKEN=tag_suggest_kdfjkqwuiplkajmncbsb_token&contentId=" + contentId + "'      style='display:none'>");
  };
});
