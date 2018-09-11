import http from '../utils/http';
import { OVERVIEW} from '../constants/apiUrl';
import { replaceParamVal } from '../utils/utils';

/**
 *查询数据
 * @param {*}
 */
export async function getDeptList(data) {
    console.log('data',data);
    let response = await http.get(OVERVIEW.deptlist, {
        params: data
    });
    return response.data;
}
/**
 *查询数据
 * @param {*}
 */
export async function GetmenuList(data) {
    let response = await http.get(OVERVIEW.menulist, {
        params: data
    });
    return response.data;
}
/**
 *查询部门
 * @param {*}
 */
export async function getDomainList(data) {
    let param = {
        pageIndex:1,
        limit:999,
        totalItems:0
    };
    let response = await http.get(OVERVIEW.getdomainlist, {
        params: param
    });
    return response.data;
}


/**
 * 概览-超级管理员版本查询概览
 */
export async function getAdminOverview() {
    let res = await http.get(OVERVIEW.getAdminOverview);
    return res && res.data;
}

/**
 * 概览-管理员版本查询概览
 */
export async function getAdminOverviewOrdinary(params) {
    let res = await http.get(OVERVIEW.getAdminOverview, {...params});
    return res && res.data;  
}

/**
 * 超级管理员概览-获取租户ecs每日使用量
 */
export async function selectUsageByDate(params) {
    let res = await http.get(OVERVIEW.selectUsageByDate, {
        params: params
    });
    return res && res.data;  
}

/**
 * 超级管理员概览-根条件据获取本月和上月ecs使用量差额
 */
export async function selectUsageByMoth() {
    let res = await http.get(OVERVIEW.selectUsageByMoth);
    return res && res.data;  
}

/**
 * 管理员概览-租户使用量和配额
 */

export async function tenantUsages(params) {
    let res = await http.get(OVERVIEW.tenantUsages, {
        params: params
    });
    return res && res.data;  
}