import http from '../utils/http';
import { API_UserAccount,API_USR_AUTH,API_LOGIN} from '../constants/apiUrl';
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




//修改密码   
export async function pwdChange(data) {
    let newPwd = await RSA.encrypt(data.newPwd);
    let oldPwd = await RSA.encrypt(data.oldPwd);
    let confirmPwd = await RSA.encrypt(data.confirmPwd);
    let postdata = {
        newPwd:newPwd,
        oldPwd:oldPwd,
        confirmPwd:confirmPwd,
        userId:data.userId,
        userName:data.userName
    };
    let url = API_LOGIN.changePwd + data.userId + '/password';
    let response = await http.put(url, postdata);
    return response;
}
/**
 * getModulus
 */
export async function getModulus() {
    let url = API_USR_AUTH.RSA.split('//').join('/');
    let ret = await http.get(url);
    return ret && ret.data && ret.data.code === '0000' && ret.data.data;
}


