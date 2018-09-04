import http from '../../utils/http';
import { RoleMgr} from '../../constants/apiUrl';
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

