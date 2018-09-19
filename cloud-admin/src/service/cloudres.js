import http from '../utils/http';
import {CLOUD_RES,NETWORK,MODEL} from '../constants/apiUrl';
//import { replaceParamVal } from '../utils/utils';

/**
 *查询主机列表
 * @param {*}
 */
export async function ecsList(data) {
    console.log('data',data);
    let response = await http.get(CLOUD_RES.ecsList, {
        params: data
    });
    return response.data;
}
/**
 *操作虚机
 * @param {*}
 */
export async function bootEcs(data) {
    console.log('data',data);
    let url = CLOUD_RES.bootEcs+data.id + '/'+ data.type;
    let response = await http.put(url);
    return response.data;
}/**
 *重启
 * @param {*}
 */
export async function rebootEcs(data) {
    console.log('data',data);
    let url = CLOUD_RES.rebootEcs + data + '/'+ 'HARD';
    let response = await http.put(url);
    return response.data;
}/**
 *云主机热迁移
 * @param {*}
 */
export async function Virtualmig(data) {
    console.log('data',data);
    let url = CLOUD_RES.Virtualmig ;
    let response = await http.put(url,data);
    return response.data;
}
/**
 *远程连接
 * @param {*}
 */
export async function serverGetVNCConsole(data) {
    console.log('dataid',data);
    console.log('CLOUD_RES.serverGetVNCConsole',CLOUD_RES.serverGetVNCConsole);
    let url = CLOUD_RES.serverGetVNCConsole + data;
    let response = await http.put(url);
    return response.data;
}
/**
 *获取云主机详情-安全组详情
 * @param {*}
 */
export async function getHostItem(data) {
    console.log('data',data);
    let url = CLOUD_RES.getHostItem + data;
    let response = await http.get(url);
    return response.data;
}
/**
 *获取云主机详情
 * @param {*}
 */
export async function getHostItemDetail(data) {
    let url = CLOUD_RES.getHostItemDetail + data;
    let response = await http.get(url);
    return response.data;
}
/**
 *获取云主机详情
 * @param {*}
 */
export async function showVolumeDetails(data) {
    let url = CLOUD_RES.showVolumeDetails + data;
    let response = await http.get(url);
    return response.data;
}/**
 *获取图表信息
 * @param {*}
 */
export async function getEcharts(data) {
    console.log('getEcharts.data',data);
    let url = CLOUD_RES.getEcharts;
    let response = await http.get(url,{
        params: data
    });
    return response.data;
}
/**
 *删除主机
 * @param {*}
 */
export async function delEcs(data) {
    console.log('data',data);
    var url = CLOUD_RES.delEcs+ data;
    let response = await http.delete(url);
    return response.data;
}
//网络管理模块
/**
 *查询网络列表
 * @param {*}
 */
export async function networkList(data) {
    console.log('data',data);
    let response = await http.get(NETWORK.networkList, {
        params: data
    });
    return response.data;
}
/**
 *查询端口列表
 * @param {*}
 */
export async function searchPortList(data) {
    console.log('data',data);
    let response = await http.get(NETWORK.searchPortList, {
        params: data
    });
    return response.data;
}
/**
 *编辑网络
 * @param {*}
 */
export async function editNetwork(data) {
    console.log('data',data);
    let url = NETWORK.editNetwork;
    let response = await http.put(url,data);
    return response.data;
}/**
 *创建网络
 * @param {*}
 */
export async function createNetwork(data) {
    console.log('data',data);
    let url = NETWORK.createNetwork;
    let response = await http.post(url,data);
    return response.data;
}
/**
 *删除网络
 * @param {*}
 */
export async function delNetwork(data) {
    console.log('data',data);
    var url = NETWORK.delNetwork+ data;
    let response = await http.delete(url);
    return response.data;
}
/**
 *编辑端口
 *  * @param {*}
 */
export async function editPort(data) {
    console.log('data',data);
    let url = NETWORK.editPort;
    let response = await http.put(url,data);
    return response.data;
}/**
 *创建端口
 * @param {*}
 */
export async function createPort(data) {
    console.log('data',data);
    let url = NETWORK.createPort;
    let response = await http.post(url,data);
    return response.data;
}
/**
 *删除端口
 * @param {*}
 */
export async function delPort(data) {
    console.log('data',data);
    var url = NETWORK.delPort+ data;
    let response = await http.delete(url);
    return response.data;
}
//资源模板
/**
 *查询模板列表
 * @param {*}
 */
export async function modelList(data) {
    console.log('data',data);
    let response = await http.get(MODEL.modelList, {
        params: data
    });
    return response.data;
}
/**
 *创建模板
 * @param {*}
 */
export async function createModel(data) {
    console.log('data',data);
    let url = MODEL.createModel;
    let response = await http.post(url,data);
    return response.data;
}
//镜像
/**
 *创建镜像
 * @param {*}
 */
export async function createMirror(data) {
    console.log('data',data);
    let url = CLOUD_RES.createMirror;
    let response = await http.post(url,data);
    return response.data;
}
/**
 *查询镜像列表
 * @param {*}
 */
export async function searchMirrorList(data) {
    console.log('data',data);
    let response = await http.get(CLOUD_RES.searchMirrorList, {
        params: data
    });
    return response.data;
}
/**
 *删除镜像
 * @param {*}
 */
export async function delMirror(data) {
    console.log('data',data);
    var url = CLOUD_RES.delMirror+ '?req_param=' + data;
    let response = await http.delete(url);
    return response.data;
}