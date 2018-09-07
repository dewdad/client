/**
 * axios全局配置
 */
/* eslint-disable */
import axios from 'axios';
import {Message, MessageBox} from 'element-ui';
import ERRCODE from '../constants/code';
import store from '../store/';
import Router from 'vue-router';
import {throttle} from 'lodash';

let CancelToken = axios.CancelToken,
    requestList = [];

const env = process.env.NODE_ENV;
/**
 * 将一个多维的源对象转成一个只有一维的新对象
 * @param {*} data 源对象
 * @param {*} urlParams 生成的目录对象
 */
function params(data, urlParams = {}) {
    let newParams = urlParams;
    if (typeof data === 'object') {
        for (const key of Object.keys(data)) {
            if (typeof data[key] === 'object') {
                let json = params(data[key], newParams);
                newParams = Object.assign(newParams, json);
            } else {
                newParams[key] = data[key];
            }
        }
        return newParams;
    }
}

/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
function stopRepeatRequest(url, c) {
    for (let i = 0; i < requestList.length; i++) {
        if (requestList[i] == url) {
            c();
            return;
        }
    }
    requestList.push(url);
}

// 定义一个白名单,当后台接口返回code不为0000是不弹出提示框
const whiteList = ['/user/login', '/user/register', 'user/checkMobileExist', 'user/checkImageCode', 'user/checkMobileCode', 'user/bindMail', 'activeMail', 'user/sendMobileCode'];

/**
 * 验证当前api是否在白名单中
 * @param {*} url
 */
function checkWhiteList(url) {
    for (const value of whiteList) {
        if (url.includes(value)) return true;
    }
    return false;
}

/*  create http client */
const http = axios.create({
    timeout: 30000, // 请求超时时间 30s,
    baseURL: 'http://10.11.3.61:7100/',
    // baseURL: API_URL,
    // 请求方法同上
    method: 'post', // default
    // 表明是否有跨域请求
    withCredentials: true,
    responseType: 'json',
    headers: {
        // 'X-People-Token': store.state.token || '6dca163cd317fc2408669dfdb8a26be85e3f9e62cb21def7f94b6b8af08011126ca0bc1b68c54d153e28accf412edfd8'
    }
});

// baseURL
// axios.defaults.baseURL = 'https://api.github.com'

// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
http.interceptors.request.use(
    config => {
        /* eslint-disable */
        let cancel;
        config.cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        });
        // checkToken(cancel, function () {
        //     Auth.setLoginStatus()
        //     config.headers.Authorization = `${store.state.user.token}`
        // })
        // if (process.env.NODE_ENV === 'production') {
        //     stopRepeatRequest(config.url, cancel);
        // }
        if (config.url.indexOf('.json') !== -1) {
            config.baseURL = '';
        }
        // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
        // config.data = qs.stringify(config.data)
        // 在这里统一处理params参数
        config.params = params(config.params, {});
        // config.headers['X-People-Token'] = '6dca163cd317fc2408669dfdb8a26be85e3f9e62cb21def7f94b6b8af08011126ca0bc1b68c54d153e28accf412edfd8'||store.state.token;
        config.headers['X-People-Token'] = store.state.token;
        config.headers["zt"]='zt';//登录session区分admmin和web

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

/**
 * MessageBox提示框
 * @param {string} str
 */
function $alert(str) {
    MessageBox.alert(str, {
        title: '提示',
        type: 'error'
    });
}

/**
 * Message提示框
 * @param {string} str
 */
function $message(str) {
    Message({
        message: str,
        type: 'error'
    });
}

// 使用 Lodash.throttle 来做节流 规定时间内只执行一次 具体用法参考https://www.lodashjs.com/docs/4.17.5.html#throttle
const throttled_alert = throttle($alert, 1000, {
    leading: true,
    trailing: false
});

const throttled_message = throttle($message, 1000, {
    leading: true,
    trailing: false
});

// http response 拦截器
// 针对响应代码确认跳转到对应页面
http.interceptors.response.use(
    response => {
        for (let i = 0; i < requestList.length; i++) {
            console.log(response.config.url + '  ' + requestList[i]);
            if (response.config.url === requestList[i]) {
                // 注意，不能保证500ms必定执行，详情请了解JS的异步机制
                setTimeout(function() {
                    requestList.splice(i, 1);
                }, 500);
                break;
            }
        }

        // token过期或错误 退出重新登录
        if (response.data && response.data.code === ERRCODE.INVALID_TOKEN) {
            // throttled_message(response.data.msg);
            store.dispatch('LOGOUT');
            return;
        }

        // 在这里统一处理状态码
        if (response.data && response.data.code && response.data.code !== ERRCODE.SUCCESS_CODE && !checkWhiteList(response.config.url)) {
            // MessageBox.alert(response.data.msg, {
            //     title: '提示',
            //     type: 'error'
            // });
            throttled_alert(response.data.msg);
        }

        // todo...
        console.log(response.config.url + ': ', response);
        return Promise.resolve(response);
    },
    error => {
        if (axios.isCancel(error)) {
            return Promise.reject(env === 'production' ? '重复的请求' : 'Ajax Abort: 该请求在http拦截器中被中断');
        } else if (error.response) {
            switch (error.response.status) {
                case 401:
                case 408:
                    store.dispatch('LOGOUT');
                    Router.push({name: 'login'});
                    break;
                case 403:
                    //router.push('error/403')
                    break;
                default:
                    if (env === 'production') {
                        throttled_message('当前网络信号较差，请稍后再试...');
                    } else {
                        throttled_message(`服务器错误！错误代码：${error.response.status}`);
                    }

                    break;
            }
            return Promise.reject(env === 'production' ? '当前网络信号较差，请稍后再试' : error.response.data);
        }
    }
);

export default http;
