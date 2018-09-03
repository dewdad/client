// 主机木马

import {API_SECURITY} from '@/constants/apiUrl';
import http from '@/utils/http';

/**
 * 获取异常登录信息列表接口 GET /webshell/list
 * @param server_id	""MAC地址，可传多个query	string
 * @param handle_status	处理状态 0：所有 1：未处理 2：已处理 3：误报
 * @param server_name 服务器IP或名称
 */
export const webshellDetail = async function({
    server_id,
    pageIndex,
    limit,
    handle_status,
    server_name
}) {
    let ret = await http.get(API_SECURITY.webshellDetail, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            handle_status,
            pageIndex,
            limit,
            server_name
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 获取操作信息列表接口 POST /webshell/addTrust
 * @param server_id	""MAC地址，可传多个query	string
 * @param detail_info
 * @param file_path_base64
 */
export const webshellTrust = async function({
    server_id,
    detail_info,
    file_path_base64
}) {
    let ret = await http.post(API_SECURITY.webshellTrust, {
        server_id,
        detail_info,
        file_path_base64
    });
    return ret && ret.data && ret.data.code === '0000';
};

/**
 * 获取操作信息列表接口 POST /webshell/backup 隔离
 * @param server_id	""MAC地址，可传多个query	string
 * @param detail_info
 * @param file_path_base64
 * @param ws_type 后门特征码
 */
export const banWebshell = async function({
    server_id,
    detail_info,
    ws_type,
    file_path_base64
}) {
    let ret = await http.post(API_SECURITY.webshellBackup, {
        server_id,
        ws_type,
        detail_info,
        file_path_base64
    });
    return ret && ret.data && ret.data.code === '0000';
};

/**
 * 获取操作信息列表接口 PUT /webshell/backup 隔离
 * @param server_id	""MAC地址，可传多个query	string
 * @param file_path
 * @param file_md5
 */
export const unBanWebshell = async function({server_id, file_path, file_md5}) {
    let ret = await http.put(API_SECURITY.webshellBackup, {
        server_id,
        file_path,
        file_md5
    });
    return ret && ret.data && ret.data.code === '0000';
};
