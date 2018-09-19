/*
 * @Author: sunersheng 
 * @Date: 2018-07-18 16:59:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-07 16:28:36
 * ecs模块 浮动IP
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

// ECS模块服务上下文为people-services-ecs
const ECS_CTRL = 'services-ecs';

//绑定：找所有未绑定的 公网IP
//status: 值为'DOWN' 时查询找所有未绑定的 公网IP,
//eip_subnet: 传值且为true时查询连接IP
export async function getUnbindPublicIP({status = 'down', floatingIpAddress = ''} = {}) {
    let url = API_ECS.floatIp.list;
    let response = await http.get(url, {
        params: {
            status: status,
            pageIndex: 1,
            limit: 1000
        }
    });
    return response.data;
}

/**更新浮动IP:更新浮动IP（解绑、绑定、修改带宽） *
 * @param {*} data
 * type:更新类型：bind绑定，unbind解绑，modify修改带宽
 * port:端口，type为bind时必传
 * bindwidth:带宽，type为modify时必传
 */
export async function modifyFloatIP({id, type, port, bindwidth}) {
    let url = ECS_CTRL + `/floating/${id}`;
    return http.put(url, {type, port, bindwidth});
}

/**
 *
 * 绑定IP
 * @export
 * @param {*} {instanceId, floatipId}
 * @returns
 */
export async function bundlingIp({instanceId, floatipId}) {
    let url = replaceParamVal(API_ECS.floatIp.bundlingIp, [instanceId, floatipId]);
    return http.put(url);
}

/**
 *
 * 解绑IP
 * @export
 * @param {*} {id}
 * @returns
 */
export async function unbundlingIp({floatipId}) {
    let url = replaceParamVal(API_ECS.floatIp.unbundlingIp, [floatipId]);
    return http.put(url);
}

/**更新浮动IP:更新浮动IP（解绑、绑定、修改带宽） *
 * @param {*} data
 * type:更新类型：bind绑定，unbind解绑，modify修改带宽
 * port:端口，type为bind时必传
 * bindwidth:带宽，type为modify时必传
 */
export async function updateFloatingIp(data) {
    let url = ECS_CTRL + API_ECS.floatIp.updateFloatingIp;
    let postdata;
    console.log('data' + JSON.stringify(data));
    switch (data.type) {
        case 'bind':
            postdata = {
                id: data.id,
                type: 'bind',
                port: data.port
            };
            break;
        case 'unbind':
            postdata = {
                id: data.id,
                type: 'unbind'
            };
            break;
        case 'modify':
            postdata = {
                id: data.id,
                type: 'modify',
                bandwidth: data.bandWidth,
                status: 1
            };
            break;
    }
    let response = await http.put(replaceParamVal(url, [postdata.id]), postdata);
    return response.data;
}

/**创建浮动IP:创建浮动IP *
 * @param {*} data
 * zone:可用域
 * createNum:创建数量
 * bindwidth:带宽
 */
export async function create(data) {
    let url = ECS_CTRL + API_ECS.floatIp.create;
    let response = await http.post(url, data);
    return response.data;
}

/**删除浮动IP:删除浮动IP *
 * @param {*} data
 * id:id
 */
export async function deleteFloatIp(data) {
    let url = ECS_CTRL + API_ECS.floatIp.deleteFloatIp;
    let response = await http.delete(replaceParamVal(url, [data.id]), {data});
    return response.data;
}
/**浮动IP列表:浮动IP列表 *
 * @param {*} data
 * pageIndex:页码
 * limit:条数
 * ip:浮动IP
 * status:状态
 * zone:可用域
 * instance_id:实例ID
 * port_id:端口ID
 *
 */
export async function getIpList(data) {
    console.log(JSON.stringify(data));
    let params = {
        pageIndex: data.pageIndex,
        limit: data.limit,
        ip: data.ip,
        status: data.status,
        zone: data.zone,
        instance_id: data.instance_id,
        port_id: data.port_id
    };
    let url = ECS_CTRL + API_ECS.floatIp.list;
    let response = await http.get(url, {params});
    return response.data;
}
/**浮动IP列表:浮动IP列表 *
 * @param {*} data
 * fixed_ip_address  : 内网IP
 * router_id:VPC的ID
 *router:是否外部网络，取值true和false
 *
 */
export async function getList(data) {
    let params = {
        fixed_ip_address: data.fixed_ip_address,
        router_id: data.router_id,
        external: data.external
    };
    let url = ECS_CTRL + API_ECS.floatIp.llistFloatIpist;
    let response = await http.get(url, {params});
    return response.data;
}
