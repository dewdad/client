/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-28 18:14:00
 * ecs模块 读取网络信息接口
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal, get} from '@/utils/utils';
import ERRCODE from '@/constants/code';

/**获取网络
 * data: 值为空查询所有
 * @param {*} data
 */
export async function getNetwork(data) {
    let res = await http.get(API_ECS.network.getNetwork, {
        params: {data}
    });
    return res && res.data;
}

/**
 * 通过网络id获取子网
 * @param {*} networkId
 */
export async function getSubnetByNetId({...arg}) {
    let res = await http.get(API_ECS.network.subnetList, {params: {...arg}});
    return res && res.data && res.data.code === ERRCODE.SUCCESS_CODE && res.data.data;
}

/**
 * 网络列表数据查询 GET /networks
 * @param limit 每页条数
 * @param pageIndex 每页条数
 * @param name 根据服务器名称查询
 * @param zone 区域
 */
export async function queryNetwork({...arg}) {
    $log('GET /networks ->', {...arg});
    let ret = await http.get(API_ECS.network.network, {params: {...arg}});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}

/**
 * 浮动IP列表数据查询 GET /networks
 * @param limit 每页条数
 * @param pageIndex 每页条数
 * @param name 根据服务器名称查询
 */
export async function queryFlexIP({...arg}) {
    $log('GET /flexIP ->', {...arg});
    let ret = await http.get(API_ECS.network.flexIP, {params: {...arg}});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}

/**
 * 绑定浮动IP
 */
export async function bindFloatIP(instIP, floatIP) {
    $log('put /bindFloatIP ->', floatIP);
    let ret = await http.put(replaceParamVal(API_ECS.network.bindFloatIP, [instIP, floatIP]));
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}


/**
 * 网络列表数据查询 GET /networks/vpcId
 * @param vpcId 网络ID
 */
export async function queryNetworkByID({vpcId}) {
    $log('GET /networks/vpcId ->', {vpcId});
    let ret = await http.get(replaceParamVal(API_ECS.network.networkID, [vpcId]), {params: {vpcId}});
    return get(ret, 'data.code') === ERRCODE.SUCCESS_CODE && get(ret, 'data.result.result');
}

/**
 * 网络列表数据查询 GET /networks/count/{vpcId}
 * @param vpcId 网络ID
 */
export async function getNetworkCount({vpcId}) {
    $log('GET /networks ->', {vpcId});
    let ret = await http.get(replaceParamVal(API_ECS.network.networkCount, [vpcId]), {params: {vpcId}});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.result;
}

/**
 * 创建网络 POST /networks
 * @param name 根据服务器名称查询
 * @param zone 区域
 * @param remark 区域
 * @param isDefault 区域
 */
export async function createNetwork({...arg}) {
    $log('GET /networks ->', {...arg});
    let ret = await http.post(API_ECS.network.creatNetwork, {...arg});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}

/**
 * 创建子网 POST /network/subnet
 * @param name 根据服务器名称查询
 * @param zone 区域
 * @param remark 区域
 * @param vpcId network hwID
 * @param vpcIdLocal  network ID
 * @param subnet IP地址范围，如"192.168.1.0/24"
 */
export async function createSubnet({...arg}) {
    $log('GET /createSubnet ->', {...arg});
    let ret = await http.post(API_ECS.network.subnet, {...arg});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.result;
}

/**
 * 更新子网 PUT /network/subnet/{subnetId}
 * @param name 根据服务器名称查询
 */
export async function updateSubnet({id, ...arg}) {
    $log('put /updateSubnet ->', {id, ...arg});
    let ret = await http.put(replaceParamVal(API_ECS.network.subnetID, [id]), {...arg});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE;
}

/**
 * 删除子网 DELETE /network/subnet/{subnetId}
 * @param name 根据服务器名称查询
 */
export async function deleteSubnet({id}) {
    $log('delete /deleteSubnet ->', {id});
    let ret = await http.delete(replaceParamVal(API_ECS.network.subnetID, [id]));
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE;
}

/**
 * 更新网络 POST /networks
 * @param name 名称
 * @param vpcId 区域
 */
export async function updateNetwork({name, vpcId, remark}) {
    $log('GET /networks ->', {name, vpcId, remark});
    let ret = await http.put(replaceParamVal(API_ECS.network.networkID, [vpcId]), {name, vpcId, remark});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}

/**
 * 删除专有网络 DELETE /networks/{vpcId}
 * @param vpcId 网络ID
 */
export async function deleteNetwork({vpcId}) {
    $log('DELETE /networks/{vpcId} ->', {vpcId});
    let ret = await http.delete(replaceParamVal(API_ECS.network.networkID, [vpcId]), {vpcId});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE;
}
