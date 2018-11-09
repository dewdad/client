/*
 * @Author: wenfang
 * @Date: 2018-07-21 15:54:57
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-11-09 15:13:21
 */

// eslint-disable-next-line
import http from '@/utils/http';
// eslint-disable-next-line
import {replaceParamVal, isEmpty} from '@/utils/utils';

// eslint-disable-next-line
import {API_RDS, API_PASS} from '@/constants/apiUrl';

/**
 * rds实例列表
 * @param {*} pageIndex  页码
 * @param {*} limit 条数
 * @param {*} begin_create_time 开始时间
 * @param {*} end_create_time 结束时间
 * @param {*} name 名称
 */
export const getList = async ({pageIndex = 1, limit = 20, begin_create_time = '', end_create_time = '', name = '', status = '', type = ''} = {}) => {
    let offset = (pageIndex - 1) * limit;
    let res = await http.get(API_PASS.list, {
        params: {
            pageIndex,
            limit,
            offset,
            begin_create_time,
            end_create_time,
            name,
            type,
            status
        }
    });
    return res && res.data;
};

/**
 * 调整实例
 * @param {*} instance_id 实例ID
 * @param {*} volume 调整实例容量时传入该参数
 * @param {*} flavorRef 调整实例规格时传入该参数
 * @param {*} restart 重启实例时传入该参数
 * @param {*} backupRef 恢复实例时传入该参数
 * @param {*} release 删除实例时传入该参数
 */
export const serverAction = async (instance_id, {volume = '', flavorRef = '', restart = '', backupRef = '', release = ''} = {}) => {
    let data = {};
    if (!isEmpty(volume)) {
        data.volume = volume;
    }
    if (!isEmpty(flavorRef)) {
        data.flavorRef = flavorRef;
    }
    if (!isEmpty(restart)) {
        data.restart = restart;
    }
    if (!isEmpty(backupRef)) {
        data.backupRef = backupRef;
    }
    let res = undefined;
    if (!isEmpty(release)) {
        res = await http.delete(replaceParamVal(API_RDS.instance, [instance_id]));
    } else {
        res = await http.post(replaceParamVal(API_RDS.action, [instance_id]), data);
    }
    return res && res.data;
};

/**
 * 创建快照
 * @param {*} instance_id
 * @param {*} name
 * @param {*} description
 */
export const createSnapShot = async (instance_id, name, description) => {
    let res = await http.post(API_RDS.snapshot, {
        instance: instance_id,
        name: name,
        description: description
    });
    return res && res.data;
};

/** 
 * 创建RDS
 * {
    "stack_name":"cd",
    "template_id":"163475b1-0312-4c30-916a-1dc8b743f016",
    "parameters": {
         "private_network":"a0cce4aa-fa08-4bae-800a-0b707453c201",
         "private_network": "f86c0eea-af1d-45ae-a60d-6624a4d73607",
         "volume_size":"1",
         "Flavor": "7fc45612-7ec9-4704-a098-def7241438d5"
    },
    "mysql_parameters":{
        "mysql_port": "3305",
        "mysql_pwd":"123456"
    }
}
*/
export const createRds = async (data = {}) => {
    let res = await http.post(API_PASS.create, {
        ...data
    });
    return res && res.data;
};
