/*
 * @Author: wenfang 
 * @Date: 2018-07-26 14:28:25 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-26 15:42:53
 * 日志服务 
 */


import http from '@/utils/http';
import {API_RDS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 根据实例ID查询该实例的错误日志列表，支持分页查询
 * @param instance_id
 * @param {*} pageIndex 页码
 * @param {*} limit 条数
 * @param {*} startDate 开始时间
 * @param {*} endDate 结束时间
 */
export const getErrorLog = async (instance_id, {pageIndex = 1, limit = 20, startDate = '', endDate = ''} = {}) => {
    let res = await http.get(replaceParamVal(API_RDS.errorLog, [instance_id]), {
        params: {
            pageIndex,
            limit,
            startDate,
            endDate
        }
    });
    return res && res.data;
};

/**
 * 根据实例ID查询该实例的错误日志列表，支持分页查询
 * @param {*} top 返回前多少条记录，取值为1~50
 * @param {*} sftype 语句类型,空值（表示所有语句类型都存在）或者INSERT、UPDATE、SELECT、DELETE、CREATE其中之一
 */
export const getSlowLog = async (instance_id, top = 20, sftype = '') => {
    let res = await http.get(replaceParamVal(API_RDS.slowLog, [instance_id]), {
        params: {
            top,
            sftype
        }
    });
    return res && res.data;
};