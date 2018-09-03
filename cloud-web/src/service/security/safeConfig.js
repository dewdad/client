import {API_SECURITY} from '../../constants/apiUrl';
import http from '@/utils/http';

function isSuccess(ret) {
    if (ret && ret.data && ret.data.code === '0000' && ret.data.result) {
        if (typeof ret.data.result === 'string') {
            return JSON.parse(ret.data.result);
        } else {
            return ret.data.result;
        }
    }
    return false;
}

/**
 * @param server_id	服务器MAC地址,可传多个 query	string
 * @param pageIndex	(required)页码 query	string
 * @param limit	(required)每页条数 query	string
 * @param switch_status	请求指定开关状态的服务器 0：关闭 1：开启 不传：全部 query	string
 */
export const safeConfigStatus = async function({
    server_id,
    pageIndex = '1',
    limit = '10',
    ...arg
}) {
    let ret = await http.get(API_SECURITY.safeConfigStatus, {
        params: {
            server_id: JSON.stringify([server_id]),
            pageIndex,
            limit,
            ...arg
        }
    });
    return isSuccess(ret) && isSuccess(ret)[0];
};

/**
 * @param server_id	服务器MAC地址,可传多个 query	string
 * @param pageIndex	(required)页码 query	string
 * @param limit	(required)每页条数 query	string
 * @param model	模式 0：全部 1：业务模式 2：防护模式
 */
export const safeConfigAgentModelList = async function({
    server_id,
    pageIndex = '1',
    limit = '10',
    model = '0'
} = {}) {
    let ret = await http.get(API_SECURITY.safeConfigAgentModelList, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            pageIndex,
            limit,
            model
        }
    });
    return isSuccess(ret) && isSuccess(ret).data;
};

/**
 * @param server_id	服务器MAC地址,可传多个 query	string
 * @param pageIndex	(required)页码 query	string
 * @param limit	(required)每页条数 query	string
 * @param switch_status 请求指定开关状态的服务器 0：关闭 1：开启 不传：全部
 */
export const safeConfigWebshellConfigList = async function({
    server_id,
    pageIndex = '1',
    limit = '10',
    switch_status
} = {}) {
    let ret = await http.get(API_SECURITY.safeConfigWebshellConfigList, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            pageIndex,
            limit,
            switch_status
        }
    });
    return isSuccess(ret) && isSuccess(ret)[0];
};

/**
 * 开关状态列表获取接口 PUT /safeConfig/webshellConfig
 * @param server_id	服务器MAC地址,可传多个 query	string
 * @param op_status	开关操作 0：关 1：开
 */
export const setSafeConfigWebshellConfig = async function({
    server_id,
    ...arg
}) {
    let ret = await http.put(API_SECURITY.safeConfigWebshellConfig, {
        server_id,
        ...arg
    });
    return isSuccess(ret) && isSuccess(ret)[0];
};

/**
 * 开关状态列表获取接口 PUT /safeConfig/baseLineConfig
 * @param server_id	服务器MAC地址,可传多个 query	string
 * @param op_status	开关操作 0：关 1：开
 */
export const setSafeConfigBaseLineConfig = async function({
    server_id,
    ...arg
}) {
    let ret = await http.put(API_SECURITY.safeConfigBaseLineConfig, {
        server_id,
        ...arg
    });
    return isSuccess(ret) && isSuccess(ret)[0];
};
