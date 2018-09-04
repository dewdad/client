import http from '../../utils/http';
import {SYSCONFIG} from '../../constants/apiUrl';
import { replaceParamVal } from '../../utils/utils';

/**
 *查询配置列表
 * @param {*}
 */
export async function getConfigList(data) {
    let response = await http.get(SYSCONFIG.getConfigList, {
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
    let url=RoleMgr.getMgrUser+'/'+data.roleId;
    let response = await http.get(url);
    return response.data;
}
/**
 *创建角色
 * @param {*}
 */
export async function createRole(data) {
    console.log('data',data);
    let response = await http.post(RoleMgr.createRole,data);
    console.log('response',response);
    return response.data.code === '0000'&&response.data;
}
/**
 *获取权限列表
 * @param {*}
 */
export async function getAllrelateList(data) {
    console.log('data',data);
    console.log('RoleMgr.getMgrUser',RoleMgr.getAllrelateList);
    let url=RoleMgr.getMgrUser+'/'+data.roleId;
    let response = await http.get(url);
    return response.data;
}

