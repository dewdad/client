/*
 * @Author: sunersheng 
 * @Date: 2018-07-03 16:59:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-03 17:13:49
 * ecs模块概览页面
 */

import http from '@/utils/http';
import { API_ECS, API_OVERVIEW } from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 统计区域 虚机总数、运行中虚机数、新创建虚机数、已过期虚机数、即将过期虚机数
 */
export async function getServerCount( ) {
    let res = await http.get(API_ECS.overview.getServerCount, {
        params:{ }
    });
    return res && res.data; 
}

/**
 * 快照总容量 总数量 卷总容量 总数量
 */
export async function getVolumeCount( ) {
    let res = await http.get(API_ECS.overview.getVolumeCount, {
        params:{ }
    });
    return res && res.data; 
}

/**获取网络
 * data: 值为空查询所有
 * @param {*} data 
 */
export async function getNetwork(data ) {
    let res = await http.get(API_ECS.network.getNetwork, {
        params:{ data }
    });
    return res && res.data; 
}

/**
 * 通过网络id获取子网
 * @param {*} networkId 
 */
export async function getSubnetByNetId( networkId) { 
    let res = await http.get(replaceParamVal(API_ECS.network.getSubnetByNetId, [networkId]));
    return res && res.data;      
}

/**
 * 获取监控图表数据
 * @param {*} data 
 */
export async function moniterEchartMetricData(data ) {    
    let res = await http.get(API_ECS.monitor.moniterEchartMetricData,{
        params:{ data }
    });
    return res && res.data; 
}

/**
 * 概览-工单数量
 */
export async function getOrderCount() {    
    let res = await http.get(API_OVERVIEW.getOrderCount);
    return res && res.data; 
}