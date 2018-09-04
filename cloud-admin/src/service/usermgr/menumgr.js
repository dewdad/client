import http from '../../utils/http';
import { API_MENU_MGR } from '../../constants/apiUrl';
//import { replaceParamVal } from '../../utils/utils';

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
 * 创建菜单列表
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



