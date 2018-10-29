/*
 * @Author: wenfang 
 * @Date: 2018-07-25 09:56:28 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-10-29 11:56:22
 * 数据库类型
 */

import http from '@/utils/http';
import {API_RDS} from '@/constants/apiUrl';

/**
 * 数据库类型
 */
export const getDataStoreType = async instance_id => {
    let res = await http.get(API_RDS.dataStoreType);
    return res && res.data;
};

/**
 * 只读副本规格
 */
export const getReadFlavor = async () => {
    let res = await http.get(API_RDS.readFlavor);
    return res && res.data;
};
