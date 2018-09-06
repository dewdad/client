/*
 * @author bujiaxing
 * @data: 2018-07-24 20:24:00
 * ecs模块-云盘
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 密钥对列表查询
 * @param {*} data
 * data: {
 * limit: 分页条数,
 * pageIndex: 开始页码,
 * name: 根据服务器名称查询,
 * ip: 根据服务器的IP地址查询,
 * labels: 根据标签查询服务器
 * }
 *
 */
export async function getKeypairList(data) {
    let url = API_ECS.keypairs.searchKeypairs;
    data['offset'] = (data.pageIndex - 1) * data.limit + 1;
    let res = await http.get(url, {params: data});
    return res && res.data;
}

/**
 * 创建密钥对
 * @param {*} data
 * data: {
 * name: 密钥对名称,Keypair名称， 长度最大为255，只 支持‘_’‘-’以及数字和大小写 字母。,
 * zone: 区域,
 * crtype: 创建类型 如果值为auto 则用系统自动生成的公钥,
 * content: public key 公钥
 * }
 *
 */
export async function createKeypairs(data) {
    let url = API_ECS.keypairs.sreateKeypairs;
    let res = await http.post(url, data);
    return res && res.data;
}

/**
 * 删除密钥对
 *
 * keyId: 密钥对ID
 */

export async function deleteKeypairs(keyId) {
    let url = API_ECS.keypairs.deleteKeypairs;
    let res = await http.delete(replaceParamVal(url, [keyId]));
    return res && res.data;
}
