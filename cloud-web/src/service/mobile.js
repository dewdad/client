/*
 * @Author: wenfang 
 * @Date: 2018-07-07 10:37:08 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-09 15:09:42
 * 验证码服务
 */

import http from '../utils/http';
import { API_REGISTER } from '../constants/apiUrl';
import { REGISTER_CODE } from '../constants/const';

/**
 * 验证短信验证码
 * @param {*} code 短信验证码
 */
export async function checkMobileCode(mobile, code, type = REGISTER_CODE) {
    let response = await http.get(API_REGISTER.checkMobileCode, {
        params: {
            mobile,
            type,
            code
        }
    });
    return response.data;
}

/**
 * 发送手机验证码
 * @param {*} mobile 手机号码
 * @param {*} type 发送验证码类型,登录：login_code；注册：register_code，绑定手机号码：reset_phone_code
 * @param {*} validateUser 是否需要验证用户，取值true和false 默认为false
 */
export async function sendMobilecode(mobile, type = REGISTER_CODE, validateUser = false) {
    let response = await http.get(API_REGISTER.sendMobileCode, {
        params: {
            mobile,
            type,
            validateUser
        }
    });
    return response && response.data;
}
