/*
 * @Author: wenfang 
 * @Date: 2018-07-24 16:22:48 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-28 14:38:02
 */

// eslint-disable-next-line
import http from '@/utils/http';
import axios from 'axios';
// eslint-disable-next-line
import {replaceParamVal, isEmpty} from '@/utils/utils';

// eslint-disable-next-line
import {API_RDS, API_ECS} from '@/constants/apiUrl';

/**
 * 实例详情
 * @param {*} instance_id
 */
export const getInstInfo = async instance_id => {
    let res = await http.get(replaceParamVal(API_RDS.instance, [instance_id]));
    return res && res.data;
};

/**
 * 获取只读副本数量
 * @param {*} instance_id
 */
export const getReplicaCount = async instance_id => {
    let res = await http.get(replaceParamVal(API_RDS.replicaCount, [instance_id]));
    return res && res.data;
};

/**
 * 获取只读副本数量和数据库类型
 * @param {*} instance_id
 */
export const getDetails = async instance_id => {
    let res = await axios.all([http.get(API_RDS.dataStoreType), http.get(replaceParamVal(API_RDS.replicaCount, [instance_id]))]);
    let obj = {
        dataStoreType: res[0].data,
        replica: res[1].data
    };
    return obj;
};

/**
 * 查询未绑定的浮动IP列表
 */
export async function getUnbindFloatingIP({status = 'DOWN', zone = 'az1.dc1', eip_subnet = true} = {}) {
    let url = API_ECS.floating.getFloatingList;
    let res = await http.get(url, {
        params: {
            zone,
            status,
            eip_subnet
        }
    });
    return res && res.data;
}

/**
 * 绑定/解绑浮动IP
 * @param {*} instance_id
 * @param {*} action  绑定action:enablePublicAccess 解绑action:disablePublicAccess
 * @param {*} publicIP 浮动 IP
 * @param {*} publicIPId 浮动IP的id
 */
export async function updateFloatIp(instance_id, action, publicIP, publicIPId) {
    let res = await http.post(replaceParamVal(API_RDS.floatIp, [instance_id]), {
        action,
        publicIP,
        publicIPId
    });
    return res && res.data;
}

/**
 * 性能优化
 * @param {*} instance_id
 * @param {*} code 监控指标
 */
export async function getPerformance(instance_id, code) {
    let res = await http.get(replaceParamVal(API_RDS.performance, [instance_id]), {
        params: {
            code
        }
    });
    return res && res.data;
}

/**
 * 快照列表
 * @param {*} pageIndex 页码
 * @param {*} limit 条数
 * @param {*} filterType 为查询方式（实例名称、快照名称、数据库引擎），三种方式的值为insname、name、DBengine、instId
 * @param {*} filterContent 需要查询的实例名称、快照名称、数据库引擎名称、实例id
 */
export async function getSnapshotList({pageIndex = 1, limit = 20, filterType = 'instId', filterContent = ''} = {}) {
    let res = await http.get(API_RDS.snapshotList, {
        params: {
            pageIndex,
            limit,
            filterType,
            filterContent
        }
    });
    return res && res.data;
}

/**
 * 删除备份
 * @param {*} backup_id
 */
export async function deleteBackup(backup_id) {
    let res = await http.delete(replaceParamVal(API_RDS.deleteSnapshot, [backup_id]));
    return res && res.data;
}

/**
 * 设置自动备份
 * @param {*} instance_id
 * @param {*} keepday 保留时间
 * @param {*} starttime 开始备份时间
 */
export async function updatePolicy(instance_id, keepday, starttime) {
    let res = await http.put(replaceParamVal(API_RDS.policy, [instance_id]), {
        keepday,
        starttime
    });
    return res && res.data;
}

/**
 * 获取配置参数列表
 * @param {*} instance_id
 */
export async function getParameters(instance_id) {
    let res = await http.get(replaceParamVal(API_RDS.parameters, [instance_id]));
    return res && res.data;
}

/**
 * 设置实例配置参数
 * @param {*} instance_id
 * @param {*} connect_timeout 该字段根据参数列表返回的数据取值，形式为key-value。key为动态
 */
export async function putParameters(instance_id, connect_timeout) {
    let res = await http.put(replaceParamVal(API_RDS.parameters, [instance_id]), {
        ...connect_timeout
    });
    return res && res.data;
}
