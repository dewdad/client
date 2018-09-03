/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-23 15:39:00 
 * ecs模块 图表监控接口
 */

import http from '@/utils/http';
import { API_ECS } from '@/constants/apiUrl';
// import {replaceParamVal} from '@/utils/utils';

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