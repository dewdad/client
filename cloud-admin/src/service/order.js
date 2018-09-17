import http from '../utils/http';
import {ORDER_MODULE, PlatForm} from '../constants/apiUrl';
//import { replaceParamVal } from '../utils/utils';

/**
 *查询我的工单列表
 * @param {*}
 */
export async function myorderList(data) {
    console.log('data',data);
    let response = await http.get(ORDER_MODULE.myorderList, {
        params: data
    });
    return response.data;
}
/**
 *创建工单
 * @param {*}
 */
export async function createOrder(data) {
    console.log('data',data);
    let response = await http.post(ORDER_MODULE.createOrder,data);
    return response.data;
}
/**
 *删除工单
 * @param {*}
 */
export async function delOrder(data) {
    console.log('data',data);
    var utl = ORDER_MODULE.delOrder + '?req_param=' + data;
    let response = await http.delete(utl);
    return response.data;
}

/**
 * 获得转交用户列表
 * @param {*}
 */ 
export async function transferList(data) {
    console.log('data',data);
    let response = await http.get(ORDER_MODULE.transferList, {
        params: data
    });
    return response.data;
}

/**
 * 补充工单
 */
export async function supplement({...arg}) {
    $log('post /supplement ->', {...arg});
    let ret = await http.post(ORDER_MODULE.supplement, {...arg});
    return ret && ret.data;
}