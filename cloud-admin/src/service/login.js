/*
 * @Author: wenfang 
 * @Date: 2018-07-06 15:39:05 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-09 10:56:54
 * 登录服务
 */

import http from '../utils/http';
import {API_LOGIN, PlatForm} from '../constants/apiUrl';
import {get} from '@/utils/utils';
import RSA from '@/utils/RSA';
/**
 *
 * 登录
 * @export
 * @param {*} loginNo 手机号码或者用户邮箱
 * @param {*} loginPass 用户密码，loginType为0时必填
 */
export async function userLogin({userName, passWord} = {}) {
    let RSA_PWD = await RSA.encrypt(passWord);
    let response = await http.post(API_LOGIN.login, {
        userName,
        passWord :  RSA_PWD ,
    });
    return response;
}
/**
 *
 * 获取可用域
 * @export
 */
export async function getZoons(data) {
    let response = await http.get(API_LOGIN.getZoons);
    return response;
}
/**
 *
 * 获取部门列表
 * @export
 */
export async function getDomains(data) {
    let response = await http.get(API_LOGIN.getDomains, {
        params: data
    });
    return response;
}


