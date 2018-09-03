import http from '../utils/http';
import { OVERVIEW} from '../constants/apiUrl';
import { replaceParamVal } from '../utils/utils';

/**
 *查询数据
 * @param {*}
 */
export async function getDeptList(data) {
    console.log('data',data);
    let response = await http.get(OVERVIEW.deptlist, {
        params: data
    });
    return response.data;
}
/**
 *查询数据
 * @param {*}
 */
export async function GetmenuList(data) {
    let response = await http.get(OVERVIEW.menulist, {
        params: data
    });
    return response.data;
}

