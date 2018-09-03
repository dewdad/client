/*
 * @Author: wenfang 
 * @Date: 2018-07-13 10:44:50 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-14 17:06:09
 * oss对象存储API服务
 */
import http from '@/utils/http';
import {replaceParamVal} from '@/utils/utils';
import {
    API_OSS
} from '@/constants/apiUrl';

/**
 * 获取命名空间秘钥接口
 * @param {*} showPwdFlag 是否显示秘钥 是 1 否 0
 */
export async function getAuthKeys(showPwdFlag = 0) {
    let res = await http.get(API_OSS.getAuthKeys, {
        params: {
            showPwdFlag
        }
    });
    return res && res.data;
}

/**
 * 创建OSS秘钥
 */
export async function createKey() {
    let res = await http.post(API_OSS.createAuthKey);
    return res && res.data;
}

/**
 *设置Auth Key的状态接口
 * @param {*} keyId keyId
 * @param {*} status suspend 禁用 resume 启用
 */
export async function setKeyStatus(keyId, status) {
    let res = await http.put(API_OSS.createAuthKey, {
        keyId,
        status
    });
    return res && res.data;
}

/**
 * 删除 Auth Key，只能删除处于 suspend 状态的Auth Key
 * @param {*} keyId 
 */
export async function deleteKey(keyId) {
    let res = await http.delete(replaceParamVal(API_OSS.delete, [keyId]));
    return res && res.data;
}