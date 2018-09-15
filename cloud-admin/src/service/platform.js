import http from '../utils/http';
import { PlatForm} from '../constants/apiUrl';
//import { replaceParamVal } from '../utils/utils';

/**
 *查询平台列表
 * @param {*}
 */
export async function getplatformList(data) {
    console.log('data',data);
    let response = await http.get(PlatForm.platformList, {
        params: data
    });
    return response.data;
}
/**
 *查询平台扩展列表
 * @param {*}
 */
export async function getExpandList(data) {
    console.log('data',data);
    let response = await http.get(PlatForm.getExpandList, {
        params: data
    });
    return response.data;
}
/**
 *添加平台
 * @param {*}
 */
export async function addPlatForm(data) {
    console.log('data',data);
    let response = await http.post(PlatForm.addPlatForm,data);
    return response.data;
}
/**
 *添加权限
 * @param {*}
 */
export async function addPlatAuth(data) {
    console.log('data',data);
    let response = await http.post(PlatForm.addPlatAuth,data);
    return response.data;
}
/**
 *查询平台列表权限
 * @param {*}
 */
export async function searchPlatAuth(data) {
    console.log('data',data);
    let response = await http.get(PlatForm.searchPlatAuth, {
        params: data
    });
    return response.data;
}
/**
 *删除平台权限
 * @param {*}
 */
export async function delPlatAuth(data) {
    console.log('data',data);
    var utl = PlatForm.delPlatAuth + '/' + data.id;
    let response = await http.delete(utl);
    return response.data;
}
/**
 *修改平台权限
 * @param {*}
 */
export async function editPlatAuth(data) {
    console.log('data',data);
    var utl = PlatForm.editPlatAuth + data.id;
    let response = await http.put(utl,data.form);
    return response.data;
}
/**
 *删除平台
 * @param {*}
 */
export async function delPlatForm(data) {
    console.log('data',data);
    var utl = PlatForm.delPlatForm + '/' + data.id;
    let response = await http.delete(utl);
    return response.data;
}
/**
 *修改平台
 * @param {*}
 */
export async function editPlatForm(data) {
    console.log('data',data);
    let param = {
        resource:data.resource
    };
    var utl = PlatForm.editPlatForm + data.id;
    let response = await http.put(utl,param);
    return response.data;
}
/**
 *查询角色类型列表
 * @param {*}
 */
export async function roleTypeList(data) {
    console.log('data',data);
    let response = await http.get(PlatForm.roleTypeList, {
        params: data
    });
    return response.data;
}
/**
 *查询角色类型列表
 * @param {*}
 */
export async function getPlatformList(data) {
    let url = PlatForm.getPlatformList+'/'+data;
    let response = await http.get(url);
    return response.data;
}
/**
 *查询用户角色类型绑定的平台权限
 * @param {*}
 */
export async function searchBindAuth(data) {
    console.log('data',data);
    let url = PlatForm.searchBindAuth + '/' + data;
    let response = await http.get(url);
    return response.data;
}
/**
 *查询用户角色类型绑定的平台权限
 * @param {*}
 */
export async function bindAuth(data) {
    console.log('data',data);
    var utl = PlatForm.bindAuth + '/' + data.roleType;
    let response = await http.put(utl,data.platformRoleIds);
    return response.data;
}
/**
 *添加扩展信息
 * @param {*}
 */
export async function createExpand(data) {
    console.log('data',data);
    let response = await http.post(PlatForm.createExpand,data.expand);
    return response.data;
}
/**
 *修改扩展信息
 * @param {*}
 */
export async function editExpand(data) {
    console.log('data',data);
    let url = PlatForm.editExpand + data.id;
    let response = await http.put(url,data.expand);
    return response.data;
}
/**
 *删除平台扩展信息
 * @param {*}
 */
export async function delExpand(data) {
    console.log('data',data);
    var utl = PlatForm.delExpand  + data.id;
    let response = await http.delete(utl);
    return response.data;
}

