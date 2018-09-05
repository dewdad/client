import http from '../../utils/http';
import {RoleMgr, SYSCONFIG} from '../../constants/apiUrl';
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
 *添加系统配置
 * @param {*}
 */
export async function addConfig(data) {
    console.log('data',data);
    let url = SYSCONFIG.addConfig ;
    let response = await http.post(url,data);
    return response;
}
/**
 *编辑系统配置
 * @param {*}
 */
export async function editConfig(data) {
    console.log();
    let url = SYSCONFIG.editConfig;
    let res = await http.post(url, data);
    return res;
}
/**
 *删除配置
 * @param {*}
 */
export async function delConfig(data) {
    console.log('data',data);
    var url = SYSCONFIG.delConfig + data.id;
    let response = await http.delete(url);
    return response.data.code === '0000'&&response.data;
}

