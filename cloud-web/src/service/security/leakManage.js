// 防暴力破解
import {API_SECURITY} from '@/constants/apiUrl';
import http from '@/utils/http';

/**
 * 漏洞管理列表 GET /leakManage/list
 *  @param leak_level	(required)漏洞等级 query	string
 *  @param leak_name	(required)漏洞名称 query	string
 *  @param processing	(required)漏洞状态 query	string
 */
export const leakManageList = async function({
    server_id,
    pageIndex,
    limit,
    leak_level,
    leak_name,
    processing
}) {
    let ret = await http.get(API_SECURITY.leakManageList, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            pageIndex,
            limit,
            leak_level,
            leak_name,
            processing
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 漏洞管理详情 GET /leakManage/detail
 *  @param server_id	(required)mac地址 query	string
 *  @param handle_status	(required)是否处理query	string
 *  @param cve_no	(required)CVE编号query	string
 *  @param emergent	(required)修复必要性 query	string
 *  @param server_name	(required)服务器IP或名称 query	string
 */
export const leakManageDetail = async function({
    pageIndex,
    limit,
    server_id,
    handle_status,
    cve_no,
    emergent,
    server_name
}) {
    let ret = await http.get(API_SECURITY.leakManageDetail, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            pageIndex,
            limit,
            handle_status,
            cve_no,
            emergent,
            server_name
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 漏洞管理列表 POST /leakManage/ignore
 *  @param cve_no	(required)CVE编号 query	string
 *  @param op_note	(required) 操作备注	string
 */
export const leakManageIgnore = async function({server_id, cve_no, op_note}) {
    let ret = await http.post(API_SECURITY.leakManageIgnore, {
        server_id: JSON.stringify([server_id]),
        cve_no,
        op_note
    });
    return (
        ret &&
        ret.data &&
        ret.data.code === '0000' &&
        ret.data.result &&
        JSON.parse(ret.data.result).code === 0
    );
};

/**
 * 取消忽略漏洞 POST /leakManage/ignoreCancel
 *  @param cve_no	(required)CVE编号 query	string
 *  @param op_note	(required) 操作备注	string
 */
export const leakManageIgnoreCancel = async function({server_id, cve_no}) {
    let ret = await http.post(API_SECURITY.leakManageIgnoreCancel, {
        server_id: JSON.stringify([server_id]),
        cve_no
    });
    return (
        ret &&
        ret.data &&
        ret.data.code === '0000' &&
        ret.data.result &&
        JSON.parse(ret.data.result).code === 0
    );
};

/**
 * 验证漏洞 POST /leakManage/verify
 *  @param cve_no	(required)CVE编号 query	string
 *  @param op_note	(required) 操作备注	string
 */
export const leakManageIgnoreVerify = async function({server_id, cve_no}) {
    let ret = await http.post(API_SECURITY.leakManageIgnoreVerify, {
        server_id: JSON.stringify([server_id]),
        cve_no
    });
    return (
        ret &&
        ret.data &&
        ret.data.code === '0000' &&
        ret.data.result &&
        JSON.parse(ret.data.result).code === 0
    );
};

/**
 * 漏洞管理设置 PUT /leakManage/setLeakConfig
 * @param server_id	服务器MAC地址,可传多个 query	string
 * @param leak_level 扫描漏洞等级范围
 * @param leak_clean_cycle 失效漏洞自动删除周期  单位：小时
 */
export const leakManageSetLeakConfig = async function({
    server_id,
    leak_level,
    leak_clean_cycle,
    ...arg
}) {
    let ret = await http.put(API_SECURITY.leakManageSetLeakConfig, {
        server_id: server_id ? JSON.stringify(server_id) : undefined,
        leak_level: leak_level ? JSON.stringify(leak_level) : undefined,
        leak_clean_cycle: leak_clean_cycle ? leak_clean_cycle + '' : undefined,
        ...arg
    });
    return ret && ret.data && ret.data.code === '0000';
};
