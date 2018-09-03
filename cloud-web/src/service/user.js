import http from '../utils/http';
import { API_UserAccount,API_USR_AUTH,API_CONTACT } from '../constants/apiUrl';
import { replaceParamVal } from '../utils/utils';
import RSA from '@/utils/RSA';
/**
 * 检测邮件验证码
 * @param {*} emailAddress 需要验证的邮箱地址
 * @param {*} emailCode 需要验证的邮件验证码
 */
export async function activeEmail(data) {
    let params = {
        code: data.emailCode,
        email: data.email
    };
    let response = await http.get(API_UserAccount.activeMail,{params});
    return response.data;
}

/**
 * 邮箱链接验证接口
 * @param {*} code 需要验证的code
 */
export function validateEmailCode({code}) {
    return http.post(API_UserAccount.validateEmailCode, {code});
}

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
export async function checkEmailExist(email) {
    let response = await http.post(API_UserAccount.checkEmailExist, {
        email
    });
    $log('checkEmailExist', email, response);
    return response.data;
}
//检测图片验证码
export async function checkImageCode(code, imageId) {
    let response = await http.get(API_UserAccount.checkImageCode, {
        params: {
            code,
            imageId
        }
    });
    return response.data;
}
//绑定邮箱
export async function bindMail(data) {
    let postdata = {
        email: data.email
    };
    let response = await http.post(API_UserAccount.bindMail, postdata);
    return response.data;
}
//绑定手机
export async function bindMobile(data) {
    let postdata = {
        mobile: data.newMobile,
        code:  data.newMobileCode
    };
    let response = await http.post(API_UserAccount.bindMobile, postdata);
    return response.data;
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

//忘记密码
export async function pwdForget(data) {
    let RSA_PWD = await RSA.encrypt(data.loginPass);
    let postdata = {
        mobile: data.mobile,
        password: RSA_PWD
    };
    let response = await http.post(API_UserAccount.pwdForget, postdata);
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



// 用户认证
/**
 * 实名认证申请 :保存用户认证申请资料
 * @param {*} data 
 * @param {*} companyType 企业性质： 1：政府机关； 2：事业单位； 3：企业;
 * @param {*} province 企业注册所在省
 * @param {*} city 企业注册所在市
 * @param {*} area 企业注册所在地区
 * @param {*} bankName 对公账号开户行
 * @param {*} bankAcctNo 对公账号
 * @param {*} companyName 公司名称
 * @param {*} companyLicense 公司营业执照（统一社会信用代码）
 * @param {*} companyLicenseUrl 营业执照文件上传到服务器生成的url地址id,多个时以逗号分隔
 * @param {*} companyTeam 部门认证：公司部门
 * @param {*} contactPhone 部门认证：联系人手机
 * @param {*} contactName 部门认证：联系人
 */
export async function userAuthApply(data) {    
    let res = await http.post(API_USR_AUTH.userAuthApply, data);
    return res && res.data;
}

export async function userAuthMoneyConfirm(data) {
    let postdata = {
        money: data.money,
    };
    let res = await http.post(API_USR_AUTH.userAuthMoneyConfirm, postdata);
    return res && res.data;
}
//用户认证资料详情
export async function userAuthResult(data) {
    let url = replaceParamVal(API_USR_AUTH.getUserAuthInfo, [data.uid]);
    let res = await http.get(url);
    return res && res.data;
}

//用户认证资料详情
export async function getUserAuthInfo(uid) {
    let url = replaceParamVal(API_USR_AUTH.getUserAuthInfo, [uid]);
    let res = await http.get(url,{
        params:{ }
    });
    return res && res.data;
}

/**
 * 实名认证申请 :查询已认证企业
 * @param {*} data 
 * @param {data} pageIndex 分页页码;查全部可不传
 * @param {data} limit 分页条数，查全部可不传
 * @param {data} status 认证状态，已认证状态传 2
 * @param {data} companyName 企业名称，支持模糊查询
 */
export async function getUserAuthCompanyList(data) {
    let url = API_USR_AUTH.userAuthCompanyList;
    let res = await http.get(url,{
        params:data
    });
    return res && res.data;
}

/**
 * getModulus
 */
export async function getModulus() {
    let url = API_USR_AUTH.RSA;
    let ret = await http.get(url);
    return ret && ret.data && ret.data.code === '0000' && ret.data.data;
}


// 添加联系人
export async function addContact(data) {
    $log('添加联系人', data);
    // const {name,phone,email,position} = data;
    let url = API_CONTACT.addContact;
    let res = await http.post(url, data);
    return res && res.data;
}

// 删除联系人
export async function delContact(data) {
    $log('联系人Id', data);
    let url = API_CONTACT.delContact;
    let res = await http.delete(url, {data});
    return res && res.data;
}

// 修改联系人
export async function amendContact(data) {
    $log(data);
    let url = API_CONTACT.amendContact;
    let res = await http.put(url, data);
    return res && res.data;
}

// 查询联系人列表
export async function getContactList(data) {
    $log('查询联系人',data);
    let url = API_CONTACT.getContact;
    let res = await http.get(url,{
        params:data
    });
    return res && res.data;
} 

// 发送联系人邮箱验证链接
export async function sendContactEmail(rowItem) {
    $log(rowItem);
    let params = {
        email: rowItem.email,
        type: 'contact',
        contactId: rowItem.id
    };
    let ret = await http.post(API_UserAccount.bindMail, params);
    return ret;
}
