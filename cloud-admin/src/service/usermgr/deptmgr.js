import http from '../../utils/http';
import { DEPT, RoleMgr} from '../../constants/apiUrl';
import {replaceParamVal} from "../../utils/utils";
import RSA from '@/utils/RSA';

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
 *创建租户
 * @param {*}
 */
export async function createRenter(data) {
    console.log('data',data);
    let url = DEPT.createRenter;
    let response = await http.post(url,data);
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
 *根据租户ID查询用户集合
 * @param {*}
 */
export async function selectAllUsers(data) {
    let url = DEPT.selectAllUsers;
    let response = await http.get(url,{
        params: data
    });
    return response.data;
}
/**
 *删除租户
 * @param {*}
 */
export async function delRenter(data) {
    console.log('data',data);
    var url = DEPT.delRenter+'?req_param='+data;
    let response = await http.delete(url);
    return response.data.code === '0000'&&response.data;
}
/**
 *创建用户
 * @param {*}
 */
export async function createUser(data) {
    let pwd = data.password;
    let RSA_PWD = await RSA.encrypt(pwd);
    data.password = RSA_PWD;
    console.log('data',data);
    let url = DEPT.createUser;
    let response = await http.post(url,data);
    return response;
}