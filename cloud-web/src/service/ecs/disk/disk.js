/*
 * @Author: sunersheng 
 * @Date: 2018-07-05 16:59:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-12 15:42:57
 * ecs模块-云盘
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**获取云盘列表数据 *
 * @param {*} data
 * data: {
 * pageIndex:页码
 * limit:分页条数
 * diskName:云盘名称
 * area:区域
 * id:云盘ID
 * diskType:云盘类型
 * diskStatus:云盘状态
 * isBoot:是否启动盘
 * instanceId:实例ID
 * labels:标签,多个标签查询用英文逗号分隔
 * }
 */
export async function getDiskList(data) {
    let url = API_ECS.disk.getDiskList;
    // data['paging']['offset'] = (data.paging.pageIndex - 1) * data.paging.limit + 1;
    let res = await http.get(url, {params: data});
    return res && res.data;
}

export async function setDiskSnapshotPolicy({disk_ids, policy_id, source_page}) {
    let url = API_ECS.disk.setDiskSnapshotPolicy;
    let res = await http.post(url, {disk_ids, policy_id, source_page});
    return res && res.data;
}

//更新磁盘，修改磁盘描述
export async function updateDisk(id, name) {
    let url = replaceParamVal(API_ECS.disk.updateDisk, [id]);
    let res = await http.put(url, {
        name: name
    });
    return res && res.data;
}

//快照：磁盘回滚
export async function diskRollback({disk_id, snapshot_id}) {
    let url = replaceParamVal(API_ECS.disk.diskRollback, [disk_id, snapshot_id]);
    let res = await http.post(url);
    return res && res.data;
}

/**
 * 云盘扩容
 * @param {*} disk_id 云盘id
 * @param {*} size 磁盘扩容大小
 */
export async function resizeDisk({disk_id, size}) {
    let url = replaceParamVal(API_ECS.disk.resizeDisk, [disk_id, size]);
    let res = await http.put(url);
    return res && res.data;
}

/**
 * 挂载云盘
 * @param {*} disk_id 云盘id
 * @param {*} instanceId 实例ID
 * @param {*} imageRef 镜像ID
 * @param {*} autoDelSnapshot 是否随磁盘删除快照
 */
export async function mountDisk({disk_id, instanceId, imageRef, autoDelSnapshot}) {
    let url = replaceParamVal(API_ECS.disk.mountDisk, [disk_id]);
    let res = await http.post(url, {instanceId, imageRef, autoDelSnapshot});
    return res && res.data;
}

//卸载云盘
export async function unmoutDisk({disk_id}) {
    let url = replaceParamVal(API_ECS.disk.unmoutDisk, [disk_id]);
    let res = await http.delete(url);
    return res && res.data;
}

//释放、删除云盘
export async function releaseDisk({disk_id}) {
    let url = replaceParamVal(API_ECS.disk.releaseDisk, [disk_id]);
    let res = await http.delete(url);
    return res && res.data;
}

/**
 * 创建备份
 * @param {*} param0
 */
export async function createBackup({volumeId, name, description = ''} = {}) {
    let res = await http.post(API_ECS.disk.createBackup, {volumeId, name, description});
    return res && res.data;
}

/**
 *
 * 获取云盘备份列表
 * @export
 * @param {*} data
 * @returns
 */
export async function getBackupList(data) {
    let url = API_ECS.disk.getBackupList;
    let res = await http.get(url, {params: data});
    return res && res.data;
}

/**
 *
 * 删除云盘备份
 * @export
 * @param {*} id
 * @returns
 */
export async function deleteBackup(id) {
    let url = replaceParamVal(API_ECS.disk.deleteBackup, [id]);
    let res = await http.delete(url);
    return res && res.data;
}

/**
 *
 * 获取获取云盘
 * @export
 * @param {*} data
 * @returns
 */
export async function getAllDisk(data) {
    let url = API_ECS.disk.getAllDisk;
    let res = await http.get(url);
    return res && res.data;
}

/**
 *
 * 恢复云盘备份
 * @export
 * @param {*} backupId
 * @returns
 */
export async function restoreBackup({backupId, volumeId}) {
    let res = await http.post(API_ECS.disk.restoreBackup, {
        backupId,
        volumeId
    });
    return res && res.data;
}

/**
 *
 * 创建云盘
 * @export
 * @param {*} data
 * @returns
 */
export async function createDisk(data) {
    let res = await http.post(API_ECS.disk.disk, data);
    return res && res.data;
}
