/*
 * @Author: wenfang 
 * @Date: 2018-07-03 16:59:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-11 09:21:06
 * 注册服务
 */

import http from '../utils/http';
import {API_REGISTER} from '../constants/apiUrl';
import RSA from '@/utils/RSA';
import {replaceParamVal} from '@/utils/utils';

/**
 * 验证手机号码是否已注册-
 * @param {*} value 需要验证的值
 * @param {*} type 需要验证的字段
 */
export async function checkMobileExist(value, type = 'mobile') {
    let response = await http.get(API_REGISTER.checkMobileExist, {
        params: {
            [type]: value
        }
    });
    return response.data.code === '0000';
}

/**
 * 获取图片验证码
 * @param {*} mobile 图片验证码
 */
export async function getImageCode() {
    return http.get(API_REGISTER.getImageCode, {
        responseType: 'text'
    });
}

/**
 * 验证图片验证码
 * @param {*} code 图片验证码
 */
export async function checkImageCode(code) {
    let response = await http.post(replaceParamVal(API_REGISTER.checkImageCode, [code]));
    return response && response.data;
}

export async function registerUser(data) {
    let RSA_PWD = await RSA.encrypt(data.loginPass);
    let CONFIRM_RSA_PWD = await RSA.encrypt(data.confirmPass);

    let postdata = {
        mobile: data.mobile,
        loginPass: RSA_PWD,
        confirmPass: CONFIRM_RSA_PWD,
        userName: data.username,
        imageCode: data.imageCode,
        imageId: data.imageId,
        mobileCode: data.mobileCode
    };
    let response = await http.post(API_REGISTER.register, postdata);
    return response;
}
