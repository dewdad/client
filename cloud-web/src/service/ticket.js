import http from '../utils/http';
import { API_TICKET } from '../constants/apiUrl';
// import { cloneDeep } from '../utils/utils';

/**
 * 创建工单
 * @param {*} data  对象类型 
 */
export async function createTicket(data) {   
    let url = API_TICKET.createTicket;
    let res = await http.post(url, data );
    return res.data;
}

/**
 * 分页查询我的工单列表
 * @param {*} data  对象类型{ pageIndex,limit,orderNO,orderTitle,phone }
 */
export async function getOrderList(data) { 
    let url = API_TICKET.getOrderList;  
    let res = await http.get(url, {
        params: data
    });
    return res && res.data;
}