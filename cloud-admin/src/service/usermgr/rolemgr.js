import http from '../../utils/http';
import {API_MENU_MGR, PlatForm, RoleMgr} from '../../constants/apiUrl';
//import { replaceParamVal } from '../../utils/utils';

/**
 *查询角色列表
 * @param {*}
 */
export async function getRoleList(data) {
    console.log('data',data);
    console.log('RoleMgr.rolelist',RoleMgr.rolelist);
    let response = await http.get(RoleMgr.rolelist, {
        params: data
    });
    return response.data;
}

/**
 *查询角色列表下的关联用户
 * @param {*}
 */
export async function getMgrUser(data) {
    console.log('data',data);
    console.log('RoleMgr.getMgrUser',RoleMgr.getMgrUser);
    let url = RoleMgr.getMgrUser + '/' + data.roleId;
    let response = await http.get(url);
    return response.data;
}
/**
 *创建角色
 * @param {*}
 */
export async function createRole(data) {
    console.log('data',data);
    let url = RoleMgr.createRole ;
    let response = await http.post(url,data);
    return response;
}
/**
 *编辑角色
 * @param {*}
 */
export async function editRole(data) {
    let url = RoleMgr.editRole;
    let res = await http.put(url, data);
    return res
}
/**
 *删除角色
 * @param {*}
 */
export async function delRole(data) {
    console.log('data',data);
    var url = RoleMgr.delRole + data.id;
    let response = await http.delete(url);
    return response.data.code === '0000'&&response.data;
}
/**
 *获取权限列表
 * @param {*}
 */
export async function getMenuTreeByRoleId(data) {
    console.log('data',data);
    console.log('RoleMgr.getMgrUser',RoleMgr.getMenuTreeByRoleId);
    let url = RoleMgr.getMenuTreeByRoleId;
    let response = await http.get(url,{
        params: data
    });
    return response.data;
}
/**
 *关联权限
 * @param {*}
 */
export async function subAuth(data) {
    let url = RoleMgr.subAuth;
    let res = await http.put(url, data);
    return res.data;
}

