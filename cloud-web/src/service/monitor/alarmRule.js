/*
 * @Author: wenfang 
 * @Date: 2018-09-14 15:27:45 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-14 15:34:57
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
// import {replaceParamVal} from '@/utils/utils';

export async function getAlarmRuleList({pageIndex = 1, limit = 10} = {}) {
    let url = API_ECS.monitor.ruleList;
    let res = await http.get(url, {
        params: {
            ...arguments[0]
        }
    });
    return res && res.data;
}
