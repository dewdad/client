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
 *查询已办工单列表
 * @param {*}
 */
export async function getDoneOrderList(data) {
    let response = await http.get(ORDER_MODULE.getDoneOrderList, {
        params: data
    });
    return response.data;
}
/**
 *查询待办工单列表
 * @param {*}
 */
export async function getTodoOrderList(data) {
    let response = await http.get(ORDER_MODULE.getTodoOrderList, {
        params: data
    });
    return response.data;
}/**
 *查询附件并下载
 * @param {*}
 */
export async function searchFile(data) {
    console.log('data',data);
    let response = await http.get(ORDER_MODULE.searchFile, {
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
 *转交工单
 * @param {*}
 */
export async function orderTODO(data) {
    console.log('data',data);
    let response = await http.put(ORDER_MODULE.orderTODO,data);
    return response.data;
}
/**
 *回复工单
 * @param {*}
 */
export async function delReply(data) {
    console.log('data',data);
    let response = await http.post(ORDER_MODULE.delReply,data);
    return response.data;
}
/**
 *完成工单
 * @param {*}
 */
export async function complete(data) {
    console.log('data',data);
    let response = await http.put(ORDER_MODULE.complete,data);
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

/**
 * 获得工单补充内容
 * @param {*}
 */ 
export async function getSupplement(data) {
    console.log('data',data);
    let response = await http.get(ORDER_MODULE.getSupplement, {
        params: data
    });
    return response.data;
}
