// 防暴力破解
import {API_SECURITY} from '@/constants/apiUrl';
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
 * 获取操作信息列表接口 GET /bruteForce/list
 * @param server_id	""MAC地址，可传多个query	string
 * @param type (required)是否封停 0：全部 1：已封停 2：未封停 3：误报query	string
 * @param server_type	(required)服务类型 all：全部 sshd：ssh服务 vsftpd：ftp服务 mysql：mysql服务 tomcat：tomcat服务 query	string
 * @param start_date	起始封停日期 0：不限 其它：yyyy-mm-dd hh:mm:ss query	string
 * @param end_date	结束封停日期 0：不限 其它：yyyy-mm-dd hh:mm:ss query	string
 * @param src_ip	攻击来源IP query	string
 */
export const bruteForceDetail = async function({
    server_id,
    pageIndex,
    limit,
    type,
    server_type,
    start_date,
    end_date,
    src_ip
}) {
    let ret = await http.get(API_SECURITY.bruteForceDetail, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            type: type,
            pageIndex,
            limit,
            server_type,
            start_date,
            end_date,
            src_ip
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};

/**
 * 获取配置接口  GET /bruteForce/list
 * @param server_id	""MAC地址，可传多个query	string
 */
export const bruteForceConfig = async function({server_id}) {
    let ret = await http.get(API_SECURITY.bruteForceConfig, {
        params: {
            server_id: server_id
        }
    });
    return isSuccess(ret) && isSuccess(ret).data;
};


/**
 * 设置接口  POST /bruteForce/config
 * @param server_id	""MAC地址，可传多个query	string
 * @param op_status	开关操作 0：关闭 1：开始or设置 op_status=1时，不传port_link_count、ip_lock_span则为开启，否则为设置（设置前如果是关闭，设置后则会开启）
 * @param port_link_count	端口连接数量
 * @param ip_lock_span	IP锁定时间 单位：秒
 */
export const setBruteForceConfig = async function({server_id, ...arg}) {
    let ret = await http.post(API_SECURITY.bruteForceConfig, {
        server_id: server_id,
        ...arg
    });
    return isSuccess(ret) && isSuccess(ret).data;
};

/**
 * 获取操作信息列表接口 POST /bruteForce/addTrust
 * @param server_id	""MAC地址，可传多个query	string
 * @param src_ip	解封IP
 */
export const bruteForceAddTrust = async function({server_id, src_ip}) {
    let ret = await http.post(API_SECURITY.bruteForceAddTrust, {
        server_id,
        src_ip
    });
    return isSuccess(ret) && isSuccess(ret).code === 0;
};

/**
 * 解封IP接口 POST /bruteForce/unlockIP
 * @param server_id	""MAC地址，可传多个query	string
 * @param src_ip	解封IP
 */
export const bruteForceUnlockIP = async function({server_id, src_ip}) {
    let ret = await http.post(API_SECURITY.bruteForceUnlockIP, {
        server_id,
        src_ip
    });
    return isSuccess(ret) && isSuccess(ret).code === 0;
};
