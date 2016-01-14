/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: config.js 5132 2011-07-05 09:10:56Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * config.js ~ 2011/07/04 18:43:13
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5132 $ 
 * @description 
 *  
 **/

/**
 * @type {Object}
 */
var CONFIG = {
};

/**
 * @type {Array.<{{text:string,value:string}}> hash 需要查找的数据源
 * @type {string} key 需要比较的值
 *
 * @return {string}
 */
function find_value(hash, key) {
  for(var i = 0, j = hash.length; i < j; i ++) {
    if (hash[i].text == key) {
      return hash[i].value;
    }
  }

  throw new Error("can't find key = [" + key + "]");
}

/**
 * 注册可用的结果
 * @param {string} purpose 用途.
 * @param {string} vediocard 显卡类别.
 * @param {string} personality 个性化需求.
 * @param {string} price 价格.
 * @param {*} description 描述信息.
 */
function add_config(purpose, vediocard, personality, price, description) {
  var key = [
    find_value(PURPOSE_DATA, purpose),
    find_value(VEDIOCARD_DATA, vediocard),
    find_value(PERSONALITY_DATA, personality),
    find_value(PRICE_DATA, price)
  ].join('/');

  CONFIG[key] = description;
}

/**
 * 不用考虑太复杂的情况了.
 * @return {boolean}
 */
function type_is_string(obj) {
  return typeof obj == 'string';
}

/**
 * 注册可用的结果
 * @param {Array.<string>|string} purposes 用途.
 * @param {Array.<string>|string} vediocards 显卡类别.
 * @param {Array.<string>|string} personalitys 个性化需求.
 * @param {Array.<string>|string} prices 价格.
 * @param {*} description 描述信息.
 */
function add_batch_config(purposes, vediocards, personalitys, prices, description) {
  for(var a = 0; a < purposes.length; a ++) {
    for (var b = 0; b < vediocards.length; b ++) {
      for (var c = 0; c < personalitys.length; c ++) {
        for (var d = 0; d < prices.length; d ++ ) {
          add_config(purposes[a], vediocards[b], personalitys[c], prices[d], description);
        }
      }
    }
  }
}

(function(){
var pc_inspiron_mini10 = [
  "Inspiron Mini10",
  "3小时30分钟续航,250G硬盘,1.37KG,尽情娱乐首选.",
  "http://china.dell.com/cn/p/inspiron-mini1018/pd?c=cn&cs=cndhs1&l=zh&s=dhs&~ck=mn",
  "thumbnail/Ins_Mini10.jpg"
];

var pc_inspiron_m102z = [
  "Inspiron M102z",
  "1.56KG,轻薄便携,4种艳丽色彩,DDR3内存.",
  "http://china.dell.com/cn/p/inspiron-m102z/pd.aspx?c=cn&cs=cndhs1&l=zh&s=dhs&~ck=mn",
  "thumbnail/Ins_M102z.jpg"
];

var pc_inspiron_15r = [
  "Inspiron 15R",
  "强劲显卡,大容量硬盘,WIFI随时上网,多种彩壳供选.",
  "http://china.dell.com/cn/p/inspiron-15r/pd.aspx?c=cn&cs=cndhs1&l=zh&s=dhs&~ck=mn",
  "thumbnail/Ins_15R.jpg"
];

var pc_inspiron_14r = [
  "Inspiron 14R",
  "强劲显卡,大容量硬盘,WIFI随时上网,多种彩壳供选.",
  "http://china.dell.com/cn/p/inspiron-14r-n4110/pd?refid=inspiron-14r-n4110&s=dhs&cs=cndhs1&baynote_bnrank=0&baynote_irrank=1&~ck=dellSearch",
  "thumbnail/Ins_14R.jpg"
]

var pc_vostro_v130 = [
  "Vostro V130",
  "极轻薄绚彩时尚机身,移动超便携商务首选.",
  "http://china.dell.com/cn/business/p/vostro-v130/fs.aspx?c=cn&cs=cnbsd1&l=zh&s=bsd&~ck=mn",
  "thumbnail/vostro_v130.jpg"
];

var pc_latitude_2120 = [
  "Latitude 2120",
  "智能灵活,适用于企业的上网本",
  "http://china.dell.com/cn/business/p/latitude-2120/pd.aspx?c=cn&cs=cnbsd1&l=zh&s=bsd&~ck=mn",
  "thumbnail/latitude-2120.jpg"
];
	
var pc_vostro_3400 = [
  "Vostro 3400",
  "拥有个性机身,防跌硬盘的小型企业便携笔记本",
  "http://china.dell.com/cn/business/p/vostro-3400/pd?refid=vostro-3400&s=bsd&cs=cnbsd1&~lt=popup#Overview",
  "thumbnail/vostro_3400.jpg"
];

var pc_vostro_v3450 = [
  "Vostro V3450",
  "高效便捷,高品质安全无忧移动办公解决方案",
  "http://china.dell.com/cn/business/p/vostro-3450/pd?refid=vostro-3450&s=bsd&cs=cnbsd1&~lt=popup#Overview",
  "thumbnail/vostro_3450.jpg"
];

var pc_vostro_v3550 = [
  "Vostro V3550",
  "高品质安全无忧移动办公,15寸专业笔记本电脑",
  "http://china.dell.com/cn/business/p/vostro-3550/fs?c=cn&cs=cnbsd1&l=zh&s=bsd&~ck=mn",
  "thumbnail/vostro_3550.jpg"
];

var pc_vostro_v3750 = [
  "Vostro V3750",
  "17.3英寸高品质安全办公,台式机替代方案",
  "http://china.dell.com/cn/business/p/vostro-3750/fs?c=cn&cs=cnbsd1&l=zh&s=bsd&~ck=mn",
  "thumbnail/vostro_3750.jpg"
];

add_config("家用", "集成", "可选颜色", "3000以下", pc_inspiron_mini10);
add_config("家用", "集成", "背光键盘", "3000以下", pc_inspiron_mini10);
add_config("家用", "集成", "防跌硬盘", "3000以下", pc_inspiron_mini10);
add_config("家用", "集成", "指纹识别", "3000以下", pc_inspiron_mini10);
add_config("家用", "集成", "可选颜色", "3000-4000", pc_inspiron_m102z);
add_config("家用", "集成", "背光键盘", "3000-4000", pc_inspiron_m102z);
add_config("家用", "集成", "防跌硬盘", "3000-4000", pc_inspiron_m102z);
add_config("家用", "集成", "指纹识别", "3000-4000", pc_inspiron_m102z);
add_config("家用", "集成", "可选颜色", "4000-5000", pc_inspiron_m102z);
add_config("家用", "集成", "背光键盘", "4000-5000", pc_inspiron_m102z);
add_config("家用", "集成", "防跌硬盘", "4000-5000", pc_inspiron_m102z);
add_config("家用", "集成", "指纹识别", "4000-5000", pc_inspiron_m102z);
add_config("家用", "集成", "可选颜色", "5000-6000", pc_inspiron_m102z);
add_config("家用", "集成", "背光键盘", "5000-6000", pc_inspiron_m102z);
add_config("家用", "集成", "防跌硬盘", "5000-6000", pc_inspiron_m102z);
add_config("家用", "集成", "指纹识别", "5000-6000", pc_inspiron_m102z);
add_config("家用", "集成", "可选颜色", "6000以上", pc_inspiron_m102z);
add_config("家用", "集成", "背光键盘", "6000以上", pc_inspiron_m102z);
add_config("家用", "集成", "防跌硬盘", "6000以上", pc_inspiron_m102z);
add_config("家用", "集成", "指纹识别", "6000以上", pc_inspiron_m102z);
add_config("家用", "独立", "可选颜色", "3000以下", pc_inspiron_m102z);
add_config("家用", "独立", "背光键盘", "3000以下", pc_inspiron_m102z);
add_config("家用", "独立", "防跌硬盘", "3000以下", pc_inspiron_m102z);
add_config("家用", "独立", "指纹识别", "3000以下", pc_inspiron_m102z);
add_config("家用", "独立", "可选颜色", "3000-4000", pc_inspiron_m102z);
add_config("家用", "独立", "背光键盘", "3000-4000", pc_inspiron_m102z);
add_config("家用", "独立", "防跌硬盘", "3000-4000", pc_inspiron_m102z);
add_config("家用", "独立", "指纹识别", "3000-4000", pc_inspiron_m102z);
add_config("家用", "独立", "可选颜色", "4000-5000", pc_inspiron_15r);
add_config("家用", "独立", "背光键盘", "4000-5000", pc_inspiron_15r);
add_config("家用", "独立", "防跌硬盘", "4000-5000", pc_inspiron_15r);
add_config("家用", "独立", "指纹识别", "4000-5000", pc_inspiron_15r);
add_config("家用", "独立", "可选颜色", "5000-6000", pc_inspiron_14r);
add_config("家用", "独立", "背光键盘", "5000-6000", pc_inspiron_14r);
add_config("家用", "独立", "防跌硬盘", "5000-6000", pc_inspiron_14r);
add_config("家用", "独立", "指纹识别", "5000-6000", pc_inspiron_14r);
add_config("家用", "独立", "可选颜色", "6000以上", pc_inspiron_14r);
add_config("家用", "独立", "背光键盘", "6000以上", pc_inspiron_14r);
add_config("家用", "独立", "防跌硬盘", "6000以上", pc_inspiron_14r);
add_config("家用", "独立", "指纹识别", "6000以上", pc_inspiron_14r);
add_config("商用", "集成", "可选颜色", "3000以下", pc_inspiron_14r);
add_config("商用", "集成", "背光键盘", "3000以下", pc_inspiron_14r);
add_config("商用", "集成", "防跌硬盘", "3000以下", pc_inspiron_14r);
add_config("商用", "集成", "指纹识别", "3000以下", pc_inspiron_14r);
add_config("商用", "集成", "可选颜色", "3000-4000", pc_inspiron_14r);
add_config("商用", "集成", "背光键盘", "3000-4000", pc_inspiron_14r);
add_config("商用", "集成", "防跌硬盘", "3000-4000", pc_inspiron_14r);
add_config("商用", "集成", "指纹识别", "3000-4000", pc_inspiron_14r);
add_config("商用", "集成", "可选颜色", "4000-5000", pc_vostro_v130);
add_config("商用", "集成", "背光键盘", "4000-5000", pc_latitude_2120);
add_config("商用", "集成", "防跌硬盘", "4000-5000", pc_vostro_v130);
add_config("商用", "集成", "指纹识别", "4000-5000", pc_vostro_v130);
add_config("商用", "集成", "可选颜色", "5000-6000", pc_vostro_v130);
add_config("商用", "集成", "背光键盘", "5000-6000", pc_vostro_v130);
add_config("商用", "集成", "防跌硬盘", "5000-6000", pc_vostro_v130);
add_config("商用", "集成", "指纹识别", "5000-6000", pc_vostro_v130);
add_config("商用", "集成", "可选颜色", "6000以上", pc_vostro_v130);
add_config("商用", "集成", "背光键盘", "6000以上", pc_vostro_v130);
add_config("商用", "集成", "防跌硬盘", "6000以上", pc_vostro_v130);
add_config("商用", "集成", "指纹识别", "6000以上", pc_vostro_v130);
add_config("商用", "独立", "可选颜色", "3000以下", pc_vostro_v130);
add_config("商用", "独立", "背光键盘", "3000以下", pc_vostro_v130);
add_config("商用", "独立", "防跌硬盘", "3000以下", pc_vostro_v130);
add_config("商用", "独立", "指纹识别", "3000以下", pc_vostro_v130);
add_config("商用", "独立", "可选颜色", "3000-4000", pc_vostro_v130);
add_config("商用", "独立", "背光键盘", "3000-4000", pc_vostro_v130);
add_config("商用", "独立", "防跌硬盘", "3000-4000", pc_vostro_v130);
add_config("商用", "独立", "指纹识别", "3000-4000", pc_vostro_v130);
add_config("商用", "独立", "可选颜色", "4000-5000", pc_vostro_3400);
add_config("商用", "独立",	"背光键盘",	"4000-5000", pc_vostro_3400);
add_config("商用", "独立",	"防跌硬盘",	"4000-5000", pc_vostro_3400);
add_config("商用", "独立", "指纹识别", "4000-5000",	pc_vostro_3400);
add_config("商用", "独立", "可选颜色", "5000-6000",	pc_vostro_v3450);
add_config("商用", "独立", "背光键盘", "5000-6000",	pc_vostro_v3450);
add_config("商用", "独立", "防跌硬盘", "5000-6000",  pc_vostro_v3450);
add_config("商用", "独立", "指纹识别", "5000-6000",	pc_vostro_v3450);
add_config("商用", "独立", "可选颜色", "6000以上", pc_vostro_v3550);
add_config("商用", "独立", "背光键盘", "6000以上", pc_vostro_v3550);
add_config("商用", "独立", "防跌硬盘", "6000以上", pc_vostro_v3750);
add_config("商用", "独立", "指纹识别", "6000以上", pc_vostro_v3750);

})();


















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
