import http from '../../utils/http';
import {API_LOGIN, DEPT, RoleMgr} from '../../constants/apiUrl';
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
 *修改租户
 * @param {*}
 */
export async function editRente(data) {
    console.log('data',data);
    let url = DEPT.editRente+data.id;
    let response = await http.put(url,data.data);
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
    var url = DEPT.delRenter+'/'+data;
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
/**
 *编辑用户
 * @param {*}
 */
export async function editUser(data) {
    console.log('data',data);
    let url = DEPT.editUser+data.id;
    let response = await http.put(url,data.data);
    return response;
}
/**
 *重置密码
 * @param {*}
 */
export async function resetPwd(data) {
    let newPwd = await RSA.encrypt(data.newPwd);
    let oldPwd = await RSA.encrypt(data.oldPwd);
    let confirmPwd = await RSA.encrypt(data.confirmPwd);
    let postdata = {
        newPwd:newPwd,
        oldPwd:oldPwd,
        confirmPwd:confirmPwd,
        userId:data.userId,
        userName:data.username
    };
    let url = DEPT.resetPwd+data.userId+'/resetPassword';
    let response = await http.put(url, postdata);
    return response;
}
/**
 *查询用户列表
 * @param {*}
 */
export async function findeRole(data) {
    let response = await http.get(DEPT.findeRole, {
        params: data
    });
    return response.data;
}
/**
 *通过租户id查找用户
 * @param {*}
 */
export async function searchByProjectId(data) {
    let url=DEPT.searchByProjectId+'/'+data.deptId+'/'+data.projectId
    let response = await http.get(url);
    return response.data;
}
/**
 *查询租户使用量
 * @param {*}
 */
export async function viewUsage(data) {
    let response = await http.get(DEPT.viewUsage, {
        params: data
    });
    return response.data;
}
/**
 *通过用户id查找租户集合
 * @param {*}
 */
export async function searchProjectByuserId(data) {
    let response = await http.get(DEPT.searchProjectByuserId, {
        params: data
    });
    return response.data;
}
/**
 *查询租户配额
 * @param {*}
 */
export async function searchRentQuota(data) {
    let url = DEPT.searchRentQuota+data;
    let response = await http.get(url);
    return response.data;
}
/**
 *修改配额
 * @param {*}
 */
export async function changeQuota(data) {
    let url = DEPT.changeQuota;
    let response = await http.put(url,data);
    return response.data;
}
/**
 *删除用户
 * @param {*}
 */
export async function delUser(data) {
    console.log('data',data);
    var url = DEPT.delUser+'/'+data;
    let response = await http.delete(url);
    return response.data.code === '0000'&&response.data;
}
/**
 *取消关联用户
 * @param {*}
 */
export async function delRelateUser(data) {
    console.log('data',data);
    var url = DEPT.delRelateUser+data.projectId+'/relation/'+data.userId;
    let response = await http.delete(url);
    return response;
}
/**
 *关联用户
 * @param {*}
 */
export async function relateUser(data) {
    console.log('data',data);
    var url = DEPT.relateUser+data.projectId+'/relation/'+data.userId;
    let response = await http.put(url);
    return response;
}
/**
 *取消关联租户
 * @param {*}
 */
export async function delRelateProject(data) {
    console.log('data',data);
    var url = DEPT.delRelateProject+data.userId+'/relation/'+data.projectId;
    let response = await http.delete(url);
    return response;
}
/**
 *关联租户
 * @param {*}
 */
export async function relateProject(data) {
    console.log('data',data);
    var url = DEPT.relateProject+data.userId+'/relation/'+data.projectId;
    let response = await http.put(url);
    return response;
}