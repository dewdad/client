import http from '../../utils/http';
import {DEPT} from '../../constants/apiUrl';
//import { replaceParamVal } from '../../utils/utils';

/**
 *部门树
 * @param {*}
 */
export async function deptTree(data) {
    let response = await http.get(DEPT.deptTree, {
        params: data
    });
    return response.data;
}
/**
 *删除部门
 * @param {*}
 */
export async function delDept(data) {
    console.log('data',data);
    var url = DEPT.delDept + data.id;
    let response = await http.delete(url);
    return response.data.code === '0000'&&response.data;
}
/**
 *创建部门
 * @param {*}
 */
export async function createDept(data) {
    console.log('data',data);
    let url = DEPT.createDept ;
    let response = await http.post(url,data);
    return response;
}
/**
 *编辑部门
 * @param {*}
 */
export async function editDept(data) {
    console.log('data',data);
    let url = DEPT.editDept +data.parentId;
    let response = await http.put(url,data);
    return response;
}
/**
 *启用禁用部门
 * @param {*}
 */
export async function ableDept(data) {
    console.log('data',data);
    let url = DEPT.editDept +data.id;
    let response = await http.put(url,data);
    return response;
}
/**
 *查看配额和使用量
 * @param {*}
 */
export async function searchQuota(data) {
    let url = DEPT.searchQuota;
    let response = await http.get(url,{
        params: data
    });
    return response.data;
}
/**
 *获取租户列表
 * @param {*}
 */
export async function projectList(data) {
    let url = DEPT.projectList;
    let response = await http.get(url,{
        params: data
    });
    return response.data;
}
/**
 *编辑角色
 * @param {*}
 */
export async function editRole(data) {
    let url = RoleMgr.editRole;
    let res = await http.put(url, data);
    return res.data;
}

/**
 *获取权限列表
 * @param {*}
 */
export async function getMenuListByType(data) {
    console.log('data',data);
    console.log('RoleMgr.getMgrUser',RoleMgr.getMenuListByType);
    let url = RoleMgr.getMenuListByType;
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

