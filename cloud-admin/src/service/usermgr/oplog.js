import http from '../../utils/http';
import {OPLOG} from '../../constants/apiUrl';
import { replaceParamVal } from '../../utils/utils';

/**
 *查询日志列表
 * @param {*}
 */
export async function getLoglist(data) {
    let response = await http.get(OPLOG.getLoglist, {
        params: data
    });
    return response.data;
}


