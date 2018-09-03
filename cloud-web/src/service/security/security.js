import {API_SECURITY} from '@/constants/apiUrl';
import http from '@/utils/http';

// 云安全接口-总览

/**
 * 获取入侵事件信息
 * @param {*} timeperiod  时间范围 单位为天
 * @param {*} eventtypes 类型 空值：全部 ；bruteforce：防暴破；portscan：防端口；abnlogin：异常登录；webshell：网站木马
 * @param {*} severitys 严重度 空值：全部 1：低危；2：中危；3：高危；4：严重
 */
export const event = async function({timeperiod, eventtypes, severitys}) {
    let ret = await http.get(API_SECURITY.event, {
        params: {
            timeperiod,
            eventtypes: JSON.stringify(eventtypes),
            severitys: JSON.stringify(severitys)
        }
    });
    return ret && ret.data && ret.data.result && JSON.parse(ret.data.result);
};

/**
 * 获取评分信息
 */
export const info = async function() {
    let ret = await http.get(API_SECURITY.info);
    return ret && ret.data && ret.data.result && JSON.parse(ret.data.result);
};

/**
 * 取弱点信息
 * @param {*} timeperiod  时间范围 单位为天
 * @param {*} weaktypes 类型 空值：全部 ；leak：漏洞；baseline：基线；weakpwd：弱口令
 * @param {*} severitys 严重度 空值：全部 1：低危；2：中危；3：高危；4：严重
 */
export const weakness = async function({timeperiod, weaktypes, severitys}) {
    let ret = await http.get(API_SECURITY.weakness, {
        params: {
            timeperiod,
            weaktypes: JSON.stringify(weaktypes),
            severitys: JSON.stringify(severitys)
        }
    });
    return ret && ret.data && ret.data.result && JSON.parse(ret.data.result);
};

/**
 * 获取配置项接口
 * @param {*} server_id 严重度 空值：全部 1：低危；2：中危；3：高危；4：严重
 */
export const getWarningConfig = async function({server_id} = {}) {
    let ret = await http.get(API_SECURITY.getWarningConfig, {
        params: {
            server_id
        }
    });
    return ret && ret.data && ret.data.result && JSON.parse(ret.data.result);
};

/**
 * 获取配置项接口
 * @param {*} type_name 通知项目名 leak：漏洞 baseline：基线 abnlogin：登录 webshell：后门 host：主机 weekpwd：弱口令 bruteforce：防爆破 portscan：防端口
 * @param {*} send_way  需要开启的通知方式 sms：短信 email：邮件 只传需要开启的通知方式，未传的则关闭。
 * @param {*} send_time 通知时间 1：每周一 2：24小时 3：仅8:00-20:00
 */
export const setWarningConfig = async function({
    server_id,
    type_name,
    send_way,
    send_time
} = {}) {
    let ret = await http.post(API_SECURITY.setWarningConfig, {
        server_id,
        type_name,
        send_way: send_way ? JSON.stringify(send_way) : undefined,
        send_time
    });
    return ret && ret.data && ret.data.result && JSON.parse(ret.data.result);
};
