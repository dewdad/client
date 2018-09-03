import http from '../utils/http';
import { API_UserAccount,API_USR_AUTH} from '../constants/apiUrl';
import { replaceParamVal } from '../utils/utils';
import RSA from '@/utils/RSA';
/**
 * 获取用户详情
 * @param {*} user_id 需要验证的用户ID
 */
export async function getUserDetail(data) {
    let response = await http.get(replaceParamVal(API_UserAccount.getUserDetail, [data.uid]));
    return response.data;
}
/**
 * 获取用户详情
 * @param {*} user_id 需要验证的用户ID
 */
export async function saveUserInfo(data) {
    let response = await http.post(API_UserAccount.saveUserInfo,data);
    return response.data;
}
/**
/**
 * 获取用户基本资料详情
 * @param {*} user_id 需要验证的用户ID
 */
export async function getUserInfoDetail(data) {
    let response = await http.get(replaceParamVal(API_UserAccount.getUserInfoDetail, [data.uid]));
    return response.data;
}

/**
/**
 * 更新用户基本资料
 * @param {*} id 用户基本资料ID
 */
export async function updateUserInfoDetail(data) {
    let response = await http.put(replaceParamVal(API_UserAccount.updateUserInfo, [data.id]), data);
    return response.data;
}

/**
 * 验证手机号码是否注册过-
 * @param {*} mobile 需要验证的手机号码
 */
export async function checkMobileIsExist(mobile) {
    let response = await http.get(API_UserAccount.checkMobileIsExist + '?mobile=' + mobile);
    return response.data.code === '0000';
}

/**
 * 验证手机号码是否注册过-
 * POST /user/checkEmailExist
 * @param {*} mobile 需要验证的手机号码
 */
export async function validatePassword(loginPass,mobile) {
    console.log(loginPass,mobile);
    let RSA_PWD = await RSA.encrypt(loginPass);
    let response = await http.post(API_UserAccount.validatePassword, {
        mobile: mobile,
        password:RSA_PWD
    });
    return response.data;
}

//修改密码   
export async function pwdChange(data) {
    let RSA_PWD = await RSA.encrypt(data.loginPass);
    let postdata = {
        password: RSA_PWD
    };
    let response = await http.post(API_UserAccount.pwdReset, postdata);
    return response.data;
}
/**
 * getModulus
 */
export async function getModulus() {
    let url = API_USR_AUTH.RSA.split('//').join('/');
    let ret = await http.get(url);
    return ret && ret.data && ret.data.code === '0000' && ret.data.data;
}


