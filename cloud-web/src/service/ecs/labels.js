/*
 * @Author: sunersheng 
 * @Date: 2018-07-18 16:59:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-18 17:13:49
 * ecs模块 便签管理
 */

import http from '@/utils/http';
import { API_ECS } from '@/constants/apiUrl';
//import {replaceParamVal} from '@/utils/utils';

/**
 * 查询标签列表
 * @param {*} data
 * data对象：{
 * limit ：每页条数
 * pageIndex ：开始页码，
 * deviceId ：设备ID，
 * type ：大模块类型： 1：ecs ， 2： rds ，3：负载均衡，
 * modules：二、三级菜单模块 大模块为ECS的时候,modules 1:实例， 2：云盘，3：安全组
 * } 
 */
export async function getLabelsList( data) {   
    let url = API_ECS.labels.labels;
    let res = await http.get(url, {
        params:{ data }
    });
    return res && res.data; 
}

/**
 * 为各个设备保存标签
 * @param {*} data
 * data对象 ：{
 * deviceId ：设备ID，
 * type ：大模块类型： 1：ecs ， 2： rds ，3：负载均衡，
 * modules： 二、三级菜单模块 大模块为ECS的时候,modules 1:实例， 2：云盘，3：安全组,
 * labelKey: 标签键
 * labelKey: 标签值
 * } 
 */
export async function saveLabels( data) {  
    let url = API_ECS.labels.labels;
    let res = await http.post(url, data);
    return res && res.data; 
}

/**
 * 统计各个标签下 实例、云盘、RDS等的数量
 * @param {*} data
 * data对象 ：{
 * limit：每页条数
 * pageIndex：开始页码，
 * deviceId ：设备ID(实例id)
 * type ：大模块类型： 1：ecs ， 2： rds ，3：负载均衡，
 * labelKey: 标签键
 * labelKey: 标签值
 * } 
 */
export async function statLabels( data) { 
    let url = API_ECS.labels.labelsCount;
    let res = await http.get(url, {
        params:{ data }
    });  
    return res && res.data;   
}