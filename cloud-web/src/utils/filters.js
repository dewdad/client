import Vue from 'vue';
import moment from 'moment';
import {isEmpty} from './utils';
/**
 * 时候格式化
 * value 需要格式化的时间
 * formatString 格式
 */
Vue.filter('date', function(value = '', formatString = 'YYYY-MM-DD HH:mm') {
    if (value === '' || value === null || value === undefined) return;
    formatString = formatString || 'YYYY-MM-DD HH:mm';
    return moment(value).format(formatString);
});

/** 参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * start 开始位置
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
Vue.filter('cut', function(str, start, len) {
    // length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str;
    }
    let strlen = 0;
    let s = '';
    for (let i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + '...';
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + '...';
            }
        }
    }
    return s;
});

/**
 * 路由名称转路径
 * @param name 路由名称
 */
Vue.filter('name_to_path', name => {
    return '/' + name.replace(/\./g, '/');
});

/**
 * 容量大小转换
 * @param size 大小
 * @param decimal 需要保留的小数长度
 * @param backType 返回类型
 */
Vue.filter('convertByteSize', (size, decimal = 1, backType = 'array') => {
    if (isNaN(size)) return;
    let unit;
    let p = 1;
    if (size < 1024) {
        unit = 'B';
    } else if (size < 1048576) {
        //1024*1024
        unit = 'KB';
        p = 1024;
    } else if (size < 1073741824) {
        //1024 * 1024 * 1024
        unit = 'MB';
        p = 1048576;
    } else {
        unit = 'GB';
        p = 1073741824;
    }
    return backType === 'array' ? [(size / p).toFixed(decimal), unit] : (size / p).toFixed(decimal) + '' + unit;
});

/**
 * 手机号码替换151****0000
 * @param mobile 手机号码
 */
Vue.filter('mobileReplace', mobile => {
    if (mobile !== '') {
        return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    return '';
});

/**
 * 隐藏部分姓名、电话号码、身份证、银行卡号等部分信息，其他部分用 * 代替
 * @param {*} str
 * @param {*} frontLen 前面需要保留几位
 * @param {*} endLen 后面需要保留几位
 */
Vue.filter('hiddenStr', (str = '', frontLen = 0, endLen = 0) => {
    if (str === '' || str === null || str.length === 0) return '';
    // 如果str长度小于等于2 endLen设为0
    endLen = str.length <= 2 ? 0 : endLen;
    let len = str.length - frontLen - endLen;
    let xing = '';
    for (let i = 0; i < len; i++) {
        xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
});

/**
 * 根据文件名获取文件图标
 * @param filename 文件名
 */
Vue.filter('getFileIcon', filename => {
    let alltypes = ['aep', 'ai', 'avi', 'cdr', 'css', 'doc', 'eps', 'gif', 'html', 'jpeg', 'mov', 'mp3', 'pdf', 'php', 'png', 'ppt', 'psd', 'rar', 'ttf', 'txt', 'url', 'xls', 'zip'];
    let index = filename.lastIndexOf('.');
    let src = 'statics/images/bucket/filemgr/other.svg';
    if (index > -1 && index < filename.length) {
        let suffix = filename.slice(index + 1);
        if (alltypes.indexOf(suffix) > -1) {
            src = 'statics/images/bucket/filemgr/' + suffix + '.svg';
        }
    }
    return src;
});

/**
 * 格式化状态
 * @param {*} module 模块
 * @param {*} value
 */
Vue.filter('formatter', (value, module) => {
    if (Array.isArray(module) && value) {
        let item = module.find(arr => {
            return arr.value === value;
        });
        return `<span class="${item.className}"><i class="iconfont ${item.icon}">${item.text}</span>`;
    }
    return '';
});

/**
 * utils.js中showTextByKey方法的过滤器实现
 */
Vue.filter('showTextByKey', (val, items, itemkeyname = 'value', itemtextname = 'text') => {
    if (typeof val === 'undefined') {
        return '';
    }
    if (Array.isArray(items)) {
        for (var i = 0, ii = items.length; i < ii; i++) {
            var item = items[i];
            if (val == item[itemkeyname] || parseInt(val) === parseInt(item[itemkeyname])) {
                return item[itemtextname];
            }
        }
    }
    return '';
});

/**
 * 显示所在区域
 */
Vue.filter('zone', (val, type = 'string') => {
    if (isEmpty(val)) return '';
    if (type === 'array') {
        return ['北京可用区1', '资源池A'];
    }
    return '北京可用区1 资源池A';
});

/**
 * 显示所在区域
 */
Vue.filter('nettype', val => {
    return $t('common.privateNet');
});

/**
 * 参数替换
 */
Vue.filter('replaceParamVal', (string, replaceWith = []) => {
    if (string) {
        replaceWith.forEach((value, index) => {
            string = string.replace(/{\w+}/, replaceWith[index]);
        });
        return string;
    }
    return string;
});

Vue.filter('getScrollWidth', (string, ele) => {
    if (document.querySelector(ele)) {
        return document.querySelector(ele).scrollWidth;
    } else {
        return 0;
    }
});

Vue.filter('getWeekString', string => {
    if (string === '') return '';
    let week = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    let newString = [];
    let arr = string.split(',');
    for (const iterator of arr) {
        newString.push(week[iterator]);
    }
    return newString.join('，');
});
