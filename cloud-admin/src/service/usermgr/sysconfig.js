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


