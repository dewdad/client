import http from '../utils/http';
import {CLOUD_RES} from '../constants/apiUrl';
//import { replaceParamVal } from '../utils/utils';

/**
 *查询主机列表
 * @param {*}
 */
export async function ecsList(data) {
    console.log('data',data);
    let response = await http.get(CLOUD_RES.ecsList, {
        params: data
    });
    return response.data;
}
/**
 *操作虚机
 * @param {*}
 */
export async function bootEcs(data) {
    console.log('data',data);
    let url = CLOUD_RES.bootEcs+data.id + '/'+data.type;
    let response = await http.put(url);
    return response.data;
}/**
 *重启
 * @param {*}
 */
export async function rebootEcs(data) {
    console.log('data',data);
    let url = CLOUD_RES.rebootEcs+data.id;
    let response = await http.put(url);
    return response.data;
}
/**
 *删除主机
 * @param {*}
 */
export async function delEcs(data) {
    console.log('data',data);
    var url = CLOUD_RES.delEcs+ data;
    let response = await http.delete(url);
    return response.data;
}

