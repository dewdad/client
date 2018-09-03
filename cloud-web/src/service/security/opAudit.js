// 操作审计
import {API_SECURITY} from '@/constants/apiUrl';
import http from '@/utils/http';

/**
 *
 * @param server_id	MAC地址，可传多个query	string
 * @param pageIndex	(required)页码query	string
 * @param limit	(required)条数query	string
 * @param handle_status	(required)审核状态 0：所有 1：未审核 2：已审核query	string
 * @param is_need_audit	(required)是否需要审核 0：所有 1：无需审核 2：需要审核query	string
 * @param exec_process	(required)执行进程 all：所有 bash：bash 可传多个，格式为base64的json字符串query	string
 * @param start_date	(required)起始操作日期 0：不限 其他：yyyy-mm-dd hh:mm:ssquery	string
 * @param end_date	(required)结束操作日期 0：不限 其他：yyyy-mm-dd hh:mm:ssquery	string
 */
export const opAuditList = async function({
    server_id,
    handle_status = '0',
    is_need_audit = '0',
    exec_process = 'all',
    ...arg
}) {
    let ret = await http.get(API_SECURITY.opAuditList, {
        params: {
            server_id: server_id ? JSON.stringify(server_id) : '',
            handle_status,
            is_need_audit,
            exec_process,
            ...arg
        }
    });
    return ret && ret.data && ret.data.result && ret.data.result;
};
