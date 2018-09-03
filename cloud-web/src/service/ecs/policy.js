/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-07-26 15:37:31
 * ecs模块 策略接口
 */

import http from '@/utils/http';
import { API_ECS } from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 查询策略
 * @param {*} data 
 */
export async function getPolicy() {
    let url = API_ECS.policy.getPolicy;
    let res = await http.get(url);
    return res && res.data; 
}

/**
 * 创建策略
 * @param {*} data 
 */
export async function createPolicy(data) {
    let url = API_ECS.policy.createPolicy;
    let res = await http.post(url,data);
    return res && res.data; 
}

/**
 * 修改策略
 * @param {*} data 
 */
export async function modifyPolicy(data) {
    let {pid} = data;
    let url = replaceParamVal(API_ECS.policy.modifyPolicy,[pid]);
    let res = await http.put(url,data);
    return res && res.data; 
}

/**
 * 删除策略
 * @param {*} data 
 */
export async function deletePolicy(policy_id) {
    let url = replaceParamVal(API_ECS.policy.deletePolicy,[policy_id]);
    let res = await http.delete(url);
    return res && res.data; 
}

