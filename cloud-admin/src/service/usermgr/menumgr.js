import http from '../../utils/http';
import { API_MENU_MGR } from '../../constants/apiUrl';
import { replaceParamVal } from '../../utils/utils';

/**
 *查询菜单列表
 * @param {*}  { pageIndex,limit,searchText }
 */
export async function getMenuList(data) {  
    let url = API_MENU_MGR.listMenu;
    let res = await http.get(url, {
        params: data
    });
    return res.data;
}

/**
 * 创建菜单
 * @param {*}
 */
export async function addtMenu(data) {  
    let url = API_MENU_MGR.addMenu;
    let res = await http.post(url, data);
    return res.data;
}

/**
 * 更新菜单
 * @param {*}
 */
export async function updateMenu(data) {  
    let url = API_MENU_MGR.updateMenu;
    let res = await http.put(url, data);
    return res.data;
}

/**
 * 获取菜单对应的事件操作列表
 * @param {*}
 */
export async function getHandleListOfMenu(data) {  
    let url = API_MENU_MGR.opList;
    let res = await http.get(url, {
        params: data
    });
    return res.data;
}


/**
 * 创建菜单操作
 * @param {*}
 * {
    "description": "string",
    "id": "string",
    "menuCode": "string",
    "opKey": "string",
    "opMethod": "string",
    "opName": "string",
    "opUrl": "string",
    "selected": true
}
 */
export async function addMenuOp(data) {  
    let url = API_MENU_MGR.addMenuOp;
    let res = await http.post(url, data);
    return res.data;
}

/**
 * 更新菜单操作
 * @param {*}
 * {
    "description": "string",
    "id": "string",
    "menuCode": "string",
    "opKey": "string",
    "opMethod": "string",
    "opName": "string",
    "opUrl": "string",
    "selected": true
}
 */
export async function updateMenuOp(data) {  
    let url = API_MENU_MGR.updateMenuOp;
    let res = await http.put(url, data);
    return res.data;
}

/**
 * 删除菜单操作
 * @param {*}
    opId
 */
export async function deleteMenuOp(opId) {  
    let url = replaceParamVal(API_MENU_MGR.deleteMenuOp,[opId]);
    let res = await http.delete(url);
    return res.data;
}

