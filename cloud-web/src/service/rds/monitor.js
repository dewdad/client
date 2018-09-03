/*
 * @Author: wenfang 
 * @Date: 2018-07-25 17:36:34 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-28 15:21:33
 */

import http from '@/utils/http';
import axios from 'axios';
// eslint-disable-next-line
import {replaceParamVal, isEmpty, isArray} from '@/utils/utils';

// eslint-disable-next-line
import {API_RDS, API_ECS} from '@/constants/apiUrl';

/**
 * 获取监控图表数据-资源监控
 * @param {*} instance_id
 * @param {*} startTime 开始时间
 * @param {*} endTime 结束时间
 * @param {*} dataType 监控类型 如cpuAndmem diskSpace IOPS CONNECT_COUNT TPSQPS INNODB_CACHE INNODB_READ_WRITE
 * @param {*} instanceType 实例类型 如 ecs
 */
export async function resourcesMoniterData(instance_id, {startTime, endTime, instanceType = 'rds'} = {}) {
    let res = await axios.all([
        http.get(API_ECS.monitor.moniterEchartMetricData, {
            params: {
                startTime,
                endTime,
                dataType: 'cpuAndmem',
                instanceType
            }
        }),
        http.get(API_ECS.monitor.moniterEchartMetricData, {
            params: {
                startTime,
                endTime,
                dataType: 'diskSpace',
                instanceType
            }
        }),
        http.get(API_ECS.monitor.moniterEchartMetricData, {
            params: {
                startTime,
                endTime,
                dataType: 'IOPS',
                instanceType
            }
        })
    ]);
    return res && res.data;
}

/**
 * 获取监控图表数据-引擎监控
 * @param {*} instance_id
 * @param {*} startTime 开始时间
 * @param {*} endTime 结束时间
 * @param {*} dataType 监控类型 如cpuAndmem diskSpace IOPS CONNECT_COUNT TPSQPS INNODB_CACHE INNODB_READ_WRITE
 * @param {*} instanceType 实例类型 如 ecs
 */
export async function engineMoniterData(instance_id, {startTime, endTime, instanceType = 'rds'} = {}) {
    let res = await axios.all([
        http.get(API_ECS.monitor.moniterEchartMetricData, {
            params: {
                startTime,
                endTime,
                dataType: 'CONNECT_COUNT',
                instanceType
            }
        }),
        http.get(API_ECS.monitor.moniterEchartMetricData, {
            params: {
                startTime,
                endTime,
                dataType: 'TPSQPS',
                instanceType
            }
        }),
        http.get(API_ECS.monitor.moniterEchartMetricData, {
            params: {
                startTime,
                endTime,
                dataType: 'INNODB_CACHE',
                instanceType
            }
        }),
        http.get(API_ECS.monitor.moniterEchartMetricData, {
            params: {
                startTime,
                endTime,
                dataType: 'INNODB_READ_WRITE',
                instanceType
            }
        })
    ]);
    return res && res.data;
}
