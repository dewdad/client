/*
 * @Author: wenfang 
 * @Date: 2018-07-26 16:23:49 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-27 10:13:23
 * 白名单服务 
 */

import http from '@/utils/http';
import {API_RDS} from '@/constants/apiUrl';
import {replaceParamVal, isEmpty} from '@/utils/utils';

/**
 * 白名单列表
 * @param {*} instance_id 
 */
export const getWhiteList = async (instance_id) => {
    let res = await http.get(API_RDS.whiteList, {
        params: {
            instance_id
        }
    });
    return res && res.data;
};

/**
 * 添加,修改白名单 
 * @param {*} id 分组ID
 * @param {*} instance_id 
 * id 不为空时修改白名单
 */
export const addWhite = async ({id, instanceId, groupName, ipAddress} = {}) => {
    let res = '';
    if(!isEmpty(id)) {
        res = await http.put(replaceParamVal(API_RDS.updateWhite, [id]), {
            id,
            instanceId,
            groupName,
            ipAddress
        });
    } else {
        res = await http.post(API_RDS.addWhite, {
            instanceId,
            groupName,
            ipAddress
        });
    }
    
    return res && res.data;
};

/**
 * 删除白名单分
 * @param {*} group_id 
 */
export const deleteWhite = async (group_id) => {
    let res = await http.delete(replaceParamVal(API_RDS.updateWhite, [group_id]));
    return res && res.data;
};

/**
 * 清空分组白名单
 * @param {*} group_id 
 */
export const clearWhite = async (group_id) => {
    let res = await http.put(replaceParamVal(API_RDS.clearWhite, [group_id]));
    return res && res.data;
};