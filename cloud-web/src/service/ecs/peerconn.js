/*
 * @Author: wenfang 
 * @Date: 2018-07-28 16:25:49 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-28 17:30:02
 * 对等链接
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 *
 * @param {*} pageIndex 页码
 * @param {*} limit 条数
 * @param {*} zone 可用域
 * @param {*} reqVpcName 本端VPC名称
 * @param {*} accVpcName 对端VPC名称
 */
export async function getList({pageIndex = 1, limit = 20, zone = '', reqVpcName = '', accVpcName = ''} = {}) {
    let res = await http.get(API_ECS.peering.peeringList, {
        params: {
            pageIndex,
            limit,
            zone,
            reqVpcName,
            accVpcName
        }
    });
    return res && res.data;
}

/**
 * 创建对等连接
 * @param {*} accVpcId
 * @param {*} reqVpcId
 * @param {*} name 对等连接名称
 */
export async function createPeering({reqVpcId = '', accVpcId = '', name = ''}) {
    let res = await http.post(API_ECS.peering.peering, {
        name,
        reqVpcId,
        accVpcId
    });
    return res && res.data;
}

/**
 * 删除对等连接
 * @param {*} peering_id
 */
export async function delPeering(peering_id) {
    let res = await http.delete(replaceParamVal(API_ECS.peering.actionPeering, [peering_id]));
    return res && res.data;
}

/**
 * 修改对等连接
 * @param {*} peering_id
 * @param {*} name 对等连接名称
 */
export async function putPeering(peering_id, name) {
    let res = await http.put(replaceParamVal(API_ECS.peering.actionPeering, [peering_id]), {
        name
    });
    return res && res.data;
}
