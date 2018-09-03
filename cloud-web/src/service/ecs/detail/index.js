/*
 * @Author: sunersheng 
 * @Date: 2018-07-13 16:59:00 
 * @Last Modified by: sunersheng
 * @Last Modified time: 2018-07-13 17:13:49
 * ecs模块概览页面
 */

import http from '@/utils/http';
import { API_ECS } from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 获取实例详情头部磁盘快照的统计信息
 */
export async function getInstanceCountInfo( instanceId ) {
    let url = replaceParamVal(API_ECS.inst.getInstanceCountInfo, [instanceId]);
    let res = await http.get(url, {
        params:{ }
    });
    return res && res.data;
}

/**
 * 获取实例详情信息
 */
export async function getInstanceDetail( instanceId ) {
    let url = replaceParamVal(API_ECS.inst.getInstanceDetail, [instanceId]);
    let res = await http.get(url, {
        params:{ }
    });
    return res && res.data;    
}

/**
 * 获取实例规格
 */
export async function getFlavorsDetail( flavorId ) {
    let url = replaceParamVal(API_ECS.flavors.getFlavorsDetail, [flavorId]);
    let res = await http.get(url, {
        params:{ }
    });
    return res && res.data;
}

/**
 * 获取实例网络信息
 */
export async function getInstanceNet( instanceId ) {
    let url = replaceParamVal(API_ECS.inst.getInstanceNet, [instanceId]);
    let res = await http.get(url, {
        params:{ }
    });
    return res && res.data;    
}