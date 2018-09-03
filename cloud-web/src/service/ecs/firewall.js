/**
 * 防火墙
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
// import {replaceParamVal, get} from '@/utils/utils';
// import ERRCODE from '@/constants/code';

/**防火墙列表 /firewall/list
 * @param 分页参数
 */
export async function getFirewallList(data) {
    $log('防火墙列表', data);
    let res = await http.get(API_ECS.firewall.list, {
        params: {data}
    });
    return res && res.data;
}

/**
 * 创建防火墙 POST /firewall
 * @param name 根据服务器名称查询
 * @param zone 区域
 * @param remark 区域
 * @param isDefault 区域
 */
export async function createNetwork({isDefault = '1', ...arg}) {
    $log('GET /networks ->', {isDefault, ...arg});
    // let ret = await http.post(API_ECS.firewall.network, {isDefault, ...arg});
    // return ret && ret.data && ret.data.code === ERRCODE.SUCCESS_CODE && ret.data.result;
}
