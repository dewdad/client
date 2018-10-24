import http from '../../utils/http';
import { FREE_MODULE } from '../../constants/apiUrl';


/**
 *查询菜单列表
 * @param {*}  { pageIndex,limit,searchText }
 */
export async function freeList(data) {
    let url = FREE_MODULE.freeList;
    let res = await http.get(url, {
        params: data
    });
    return res.data;
}

/**
 * 创建免费试用
 * @param {*}
 */
export async function createFreeTrial(data) {
    let url = FREE_MODULE.createFreeTrial;
    let res = await http.post(url, data);
    return res.data;
}
/**
 * 管理员审批
 * @param {*}
 */
export async function applyRequest(id,data) {
    let url = FREE_MODULE.applyRequest + id;
    let res = await http.put(url, data);
    return res.data;
}


