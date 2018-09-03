import {API_SECURITY} from '@/constants/apiUrl';
import http from '@/utils/http';

// 安全配置
export * from '@/service/security/security';
export * from '@/service/security/safeConfig';
export * from '@/service/security/hostInfo';
export * from '@/service/security/webshell';
export * from '@/service/security/bruteForce';
export * from '@/service/security/portScan';
export * from '@/service/security/leakManage';
export * from '@/service/security/opAudit';

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
 * 资产列表
 *
 * @param {*} serverId  服务器MAC地址,可传多个
 * @param {*} pageIndex 页码
 * @param {*} limit 条数 空值
 */
export const assetList = async function({serverId, pageIndex, limit}) {
    console.log('assetList params', {serverId, pageIndex, limit});

    let ret = await http.get(API_SECURITY.assetList, {
        params: {
            serverId,
            // serverId: JSON.stringify(['fa:16:3e:13:58:a7']),
            pageIndex,
            limit
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 一键检查接口
 */
export const onKeyScan = async function({serverId = ''} = {}) {
    let ret = await http.post(API_SECURITY.onKeyScan, {
        serverId
    });
    return ret && ret.data && ret.data.code === '0000';
};

/**
 * 防护开关开启接口  POST /asset/protect
 * opStatus 开关操作 0：关 1：开
 */
export const protect = async function({serverId = '', opStatus} = {}) {
    let ret = await http.post(API_SECURITY.protect, {
        serverId,
        opStatus
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 获取检测状态接口
 */
export const onkeyscanStatus = async function({serverId} = {}) {
    let params = {serverId: serverId ? JSON.stringify(serverId) : undefined};
    let ret = await http.get(API_SECURITY.onkeyscanStatus, {
        params
    });
    return (
        ret &&
        ret.data &&
        ret.data.code === '0000' &&
        ret.data.result &&
        JSON.parse(ret.data.result)
    );
};

/**
 * 基线管理列表 GET /baseLine/list
 * @param serverId 服务器MAC地址,可传多个 query	string
 * @param handleStatus 是否处理 0：全部 1：未处理 2：已处理 3：已忽略 query	string
 * @param riskType	风险类型 不传：全部 baseLine：合规基线 system：系统 account：账号 database：数据库 query	string
 * @param riskLevle	风险等级 不传：全部 1：低危 2：中危 3：高危 4：严重 query	string
 * @param pageIndex	页码 query	string
 * @param limit	条数 query	string
 */
export const baseLineList = async function({
    title,
    serverId,
    handleStatus,
    riskType,
    riskLevel,
    pageIndex,
    limit
}) {
    if (handleStatus === '') {
        handleStatus = undefined;
    }
    if (riskType === '') {
        riskType = undefined;
    }
    if (riskLevel === '') {
        riskLevel = undefined;
    }
    let ret = await http.get(API_SECURITY.baseLineList, {
        params: {
            serverId: serverId ? JSON.stringify([serverId]) : undefined,
            handleStatus,
            risk_name: title,
            riskType,
            riskLevel,
            pageIndex,
            limit
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 基线管理列表 GET /baseLine/detail
 * @param serverId 服务器MAC地址,可传多个 query	string
 * @param handleStatus 是否处理 0：全部 1：未处理 2：已处理 3：已忽略 query	string
 * @param riskNo	风险类型 不传：全部 baseLine：合规基线 system：系统 account：账号 database：数据库 query	string
 * @param pageIndex	页码 query	string
 * @param limit	条数 query	string
 */
export const baseLineDetail = async function({
    serverId,
    serverName,
    handleStatus,
    riskNo,
    pageIndex,
    limit
}) {
    let ret = await http.get(API_SECURITY.baseLineDetail, {
        params: {
            serverId: JSON.stringify([serverId]),
            handleStatus,
            riskNo,
            serverName,
            pageIndex,
            limit
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 验证漏洞 POST /baseLine/verify
 *  @param riskNo	(required) 基线编号 query	string
 */
export const baseLineVerify = async function({serverId, riskNo}) {
    let ret = await http.post(API_SECURITY.baseLineVerify, {
        serverId,
        riskNo
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
 * 漏洞管理列表 POST /baseLine/ignore
 *  @param riskNo	(required)基线编号 query	string
 */
export const baseLineIgnore = async function({server_id, riskNo}) {
    let ret = await http.post(API_SECURITY.baseLineIgnore, {
        serverId: server_id,
        riskNo
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
 * 漏洞管理列表 POST /baseLine/ignoreCancel
 *  @param riskNo	(required)基线编号 query	string
 */
export const baseLineIgnoreCancel = async function({server_id, riskNo}) {
    let ret = await http.post(API_SECURITY.baseLineIgnoreCancel, {
        serverId: server_id,
        riskNo
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
 * 基线管理列表 GET /weakWwd/list
 * @param server_id	""MAC地址，可传多个query	string
 * @param type	0漏洞等级 0：弱口令 1：空口令 不传：全部 query	string
 * @param service_name	""应用名称 不传：全部 query	string
 */
export const weakPwdDetail = async function({
    server_id,
    type,
    service_name,
    pageIndex,
    limit
}) {
    let ret = await http.get(API_SECURITY.weakPwdDetail, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            type: type ? JSON.stringify([type]) : type,
            service_name,
            pageIndex,
            limit
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

// 异常登录

/**
 * 获取异常登录信息列表接口 GET /abnLogin/addIpWhitelist
 * @param server_id	""MAC地址，可传多个query	string
 * @param type (required)是否封停 0：全部 1：已封停 2：未封停 3：误报query	string
 * @param start_date	起始封停日期 0：不限 其它：yyyy-mm-dd hh:mm:ss query	string
 * @param end_date	结束封停日期 0：不限 其它：yyyy-mm-dd hh:mm:ss query	string
 * @param alert_type	攻击来源IP query	string
 */
export const abnLoginDetail = async function({
    server_id,
    pageIndex,
    limit,
    handle_status,
    alert_type
}) {
    let ret = await http.get(API_SECURITY.abnLoginDetail, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            handle_status,
            pageIndex,
            limit,
            alert_type
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 获取操作信息列表接口 POST /abnLogin/addTrust
 * @param server_id	""MAC地址，可传多个query	string
 * @param ip	解封IP
 * @param type	解封IP
 */
export const abnLoginAddTrust = async function({server_id, ip, type}) {
    let ret = await http.post(API_SECURITY.abnLoginAddTrust, {
        server_id,
        ip,
        type
    });
    return ret && ret.data && ret.data.code === '0000';
};

/**
 * 解封IP接口 POST /abnLogin/unlockIP
 * @param server_id	""MAC地址，可传多个query	string
 * @param src_ip	解封IP
 * @param ban_time_span	解封IP
 */
export const abnLoginUnlockIP = async function({
    server_id,
    src_ip,
    ban_time_span
}) {
    let ret = await http.post(API_SECURITY.abnLoginUnlockIP, {
        ban_time_span: ban_time_span && ban_time_span + '',
        server_id,
        src_ip
    });
    return isSuccess(ret);
};

/**
 * 解封IP接口 POST /abnLogin/unlockIP
 * @param server_id	""MAC地址，可传多个query	string
 * @param src_ip	解封IP
 * @param ban_time_span	解封IP
 */
export const abnLoginLockIP = async function({
    server_id,
    src_ip,
    ban_time_span
}) {
    let ret = await http.post(API_SECURITY.abnLoginLockIP, {
        ban_time_span: ban_time_span && ban_time_span + '',
        server_id,
        src_ip
    });
    return isSuccess(ret);
};
