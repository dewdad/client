import http from '../utils/http';
import { API_TICKET } from '../constants/apiUrl';
import { replaceParamVal } from '../utils/utils';

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

/**
 * 删除工单
 * @param {*} req_param  工单ID,多个用英文逗号分隔
 */
export async function deleteOrder(data) { 
    let url = API_TICKET.deleteOrder;  
    let res = await http.delete(url, {
        params: data
    });
    return res && res.data;
}

/**
 * 关闭工单
 * @param {id,orderNO} 工单信息，包括工单id和工单编号
 */
export async function closeOrder(data) { 
    let url = API_TICKET.closeOrder;  
    let res = await http.put(url, data);
    return res && res.data;
}

/**
 * 根据工单编号查询工单详情
 * @param orderNO 工单信息，包括工单id和工单编号
 */
export async function getOrderDetailByOrderNO(orderNO) { 
    let url = replaceParamVal(API_TICKET.getOrderDetailByOrderNO,[orderNO]);  
    let res = await http.get(url);
    return res && res.data;
}


/**
 * 根据工单编号查询工单详情
 * @param orderNO 工单信息，包括工单id和工单编号
 */
export async function supplement({...arg}) {
    $log('post /supplement ->', {...arg});
    let ret = await http.post(API_TICKET.supplement, {...arg});
    return ret && ret.data;
}