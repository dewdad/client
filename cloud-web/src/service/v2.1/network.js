/*
 * @Author: sunersheng
 * @Date: 2018-07-23 15:39:00
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-11-14 09:27:22
 * ecs模块 读取网络信息接口
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/v2.1/apiUrl';
import {replaceParamVal, get} from '@/utils/utils';
import ERRCODE from '@/constants/code';

/**获取网络
 * data: 值为空查询所有
 * @param {*} data
 */
export async function getNetwork() {
    let res = await http.get(API_ECS.network.network, {
        params: {}
    });
    return res && res.data;
}

/**
 * 通过网络id获取子网
 * @param {*} networkId
 */
export async function getSubnetByNetId({...arg}) {
    let res = await http.get(replaceParamVal(API_ECS.network.subnetList, [arg.networkId]), {params: {...arg}});
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
 * 确认申请浮动IP
 * @param networkId 外网ID
 */
export async function confirmApplyFloatIP({...arg}) {
    $log('GET /applyFloatIP ->', {...arg});
    let ret = await http.post(API_ECS.network.applyFloatIP, {...arg});
    return ret && ret.data;
}

/**
 * 释放浮动IP
 * @param name 根据服务器名称查询
 */
export async function deleteFloatIP({floatIP}) {
    $log('delete /deleteFloatIP ->', {floatIP});
    let ret = await http.delete(replaceParamVal(API_ECS.network.delFloatIP, [floatIP]));
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}

/**
 * 路由管理列表数据查询 GET /networks
 * @param limit 每页条数
 * @param pageIndex 每页条数
 */
export async function getRouterList({...arg}) {
    $log('GET /routerList ->', {...arg});
    let ret = await http.get(API_ECS.network.routerList, {params: {...arg}});
    return ret;
}

/**
 * 添加路由
 * @param name 路由名称
 * @param adminStateUp 管理状态
 * @param networkId 外网ID
 */
export async function editRouter({...arg}) {
    $log('post /editRouter ->', {...arg});
    let ret = await http.post(API_ECS.network.editRouter, {...arg});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}

/**
 * 获得路由详情
 */
export async function getRouterInfo(id) {
    $log('get /editRouter ->', id);
    let ret = await http.get(replaceParamVal(API_ECS.network.getRouterInfo, [id]));
    return ret && ret.data;
}

/**
 * 设置网关或清除网关
 * @param name 路由名称
 * @param adminStateUp 管理状态
 * @param networkId 外网ID
 */
export async function editGateway({...arg}) {
    $log('put /editRouter ->', {...arg});
    let ret = await http.put(API_ECS.network.editRouter, {...arg});
    return ret && ret.data;
}

/**
 * 修改路由
 * @param name 路由名称
 * @param adminStateUp 管理状态
 * @param networkId 外网ID
 */
export async function amendRouter({...arg}) {
    $log('put /editRouter ->', {...arg});
    let ret = await http.put(API_ECS.network.editRouter, {...arg});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}

/**
 * 添加静态路由
 * @param name 路由名称
 * @param adminStateUp 管理状态
 * @param networkId 外网ID
 */
export async function addStaticRouter({...arg}) {
    $log('put /editRouter ->', {...arg});
    let ret = await http.put(API_ECS.network.editRouter, {...arg});
    return ret && ret.data;
}

/**
 * 删除路由
 */
export async function deleteRouter({id}) {
    $log('delete /editRouter ->', {id});
    let ret = await http.delete(replaceParamVal(API_ECS.network.delRouter, [id]));
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
    let ret = await http.get(replaceParamVal(API_ECS.network.getRouterInfo, [vpcId]));
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
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
    let ret = await http.post(replaceParamVal(API_ECS.network.subnet, [arg.networkId]), {...arg});
    return ret && ret.data;
}

/**
 * 更新子网 PUT /network/subnet/{subnetId}
 * @param name 根据服务器名称查询
 */
export async function updateSubnet({id, name}) {
    let ret = await http.put(replaceParamVal(API_ECS.network.subnetID, [id]) + '?name=' + name);
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
 * @param id id
 */
export async function updateNetwork({name, id, remark}) {
    $log('GET /networks ->', {name, id, remark});
    let ret = await http.put(replaceParamVal(API_ECS.network.networkID, [id]) + '?name=' + name);
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

/**
 * 创建路由接口
 * @param fixedIp 路由名称
 * @param networkId 管理状态
 * @param routerId 外网ID
 * @param subnetId 外网ID
 */
export async function addRoutePort({...arg}) {
    $log('post /editRouter ->', {...arg});
    let ret = await http.post(API_ECS.network.addRoutePort, {...arg});
    return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.data;
}
