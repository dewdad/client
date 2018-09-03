// 主机木马

import {API_SECURITY} from '@/constants/apiUrl';
import http from '@/utils/http';
/**
 * 主机异常 GET /hostInfo/hostAnomaly
 *  @param event_type 不传不限 事件分类 process_exce：进程异常行为 sen_file_distort：敏感文件篡改 abn_network：异常网络连接 abn_event：异常事件 sus_file：可疑文件 mal_process：恶意进程（云查杀）
 *  @param act	请求标识 列表获取：list_get 忽略本次：ignore_do 误报：wlist_add 已手动处理：handled_add
 *  @param alias 标签
 *  @param server_name,event_name
 *  @param status 处理状态 1：未处理 2：已处理
 *  @param level 1：低危 2：中危 3：高危 4：严重
 */
export const hostAnomaly = async function({server_id, ...arg}) {
    let ret = await http.get(API_SECURITY.hostAnomaly, {
        params: {
            server_id: server_id ? JSON.stringify([server_id]) : undefined,
            ...arg
        }
    });
    $log('hostAnomaly <-', ret);
    return (
        ret &&
        ret.data &&
        ret.data.code === '0000' &&
        ret.data.result &&
        JSON.parse(ret.data.result).code === 0
    );
};

/**
 * 主机信息查询接口 GET /hostInfo/list
 *  @param method 查询方法 process 进程管理 port 端口清点 account 账号管理 web web框架清点
 *
 */
export const hostInfoList = async function({
    serverId,
    pageIndex,
    process_name,
    user_name,
    port_number,
    run_user,
    limit,
    software_name,
    software_version,
    software_install_dir,
    method,
    is_root
}) {
    let urlData = {
        process: API_SECURITY.hostInfoProcess,
        port: API_SECURITY.hostInfoPort,
        account: API_SECURITY.hostInfoAccount,
        web: API_SECURITY.hostInfoWeb
    };
    let ret = await http.get(urlData[method] || API_SECURITY.hostInfoList, {
        params: {
            server_id: serverId ? JSON.stringify([serverId]) : undefined,
            pageIndex,
            limit,
            process_name,
            user_name,
            port_number,
            run_user,
            method,
            software_name,
            is_root,
            software_version,
            software_install_dir,
            act: 'list_get',
            data_type: '1'
        }
    });
    return ret && ret.data && ret.data.code === '0000' && ret.data.result;
};
