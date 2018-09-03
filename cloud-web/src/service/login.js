/*
 * @Author: wenfang 
 * @Date: 2018-07-06 15:39:05 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-09 10:56:54
 * 登录服务
 */

import http from '../utils/http';
import { API_LOGIN } from '../constants/apiUrl';
import {get} from '@/utils/utils';
import RSA from '@/utils/RSA';
/**
 *
 * 登录
 * @export
 * @param {Number} loginType  登录方式，0为用户密码登录，1为短信验证码登录。默认为0
 * @param {*} loginNo 手机号码或者用户邮箱
 * @param {*} loginPass 用户密码，loginType为0时必填
 * @param {*} messageCode 短信验证码，loginType为1时必填
 * @param {*} imageCode 图形验证码，登录失败后必填
 * @param {*} imageId 图形验证码生成ID，可从imageCode接口的header中获取
 */
export async function userLogin({ loginType = 0, loginNo, loginPass, messageCode, imageCode, imageId } = {}) {
    let RSA_PWD = await RSA.encrypt(loginPass);
    $log('RSA_PWD', RSA_PWD);
    let response = await http.post(API_LOGIN.login, {
        userName: loginNo,
        passWord : RSA_PWD,
        imageCode : imageCode
    });
    return response && response.data;
}

export async function checkUserName ({ user_name } = {}) {
    let ret = await http.get(API_LOGIN.checkUserName, {
        params: {
            user_name
        }
    });
    return get(ret, 'data.code') === '0000' && get(ret, 'data.result') === true;
}

export async function getLoginState() {
    let ret = await http.get(API_LOGIN.getLoginState);
    return ret && ret.data;
}
