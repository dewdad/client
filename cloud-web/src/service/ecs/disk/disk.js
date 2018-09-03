/*
 * @Author: sunersheng 
 * @Date: 2018-07-05 16:59:00 
 * @Last Modified by: sunersheng
 * @Last Modified time: 2018-07-28 18:25:33
 * ecs模块-云盘
 */

import http from '@/utils/http';
import { API_ECS } from '@/constants/apiUrl';
import { replaceParamVal } from '@/utils/utils';

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
export async function getDiskList( data) {    
    let url = API_ECS.disk.getDiskList;
    let res = await http.get(url,{ params: data });
    return res && res.data;   
}

export async function setDiskSnapshotPolicy( { disk_ids, policy_id,source_page}) {    
    let url = API_ECS.disk.setDiskSnapshotPolicy;
    let res = await http.post(url,{ disk_ids,policy_id,source_page } );
    return res && res.data;   
}

//更新磁盘，修改磁盘描述
export async function updateDisk( data ) {   
    let url = replaceParamVal(API_ECS.disk.updateDisk,[data.id]);
    let res = await http.put(url, data );
    return res && res.data;   
}

//快照：磁盘回滚
export async function diskRollback( { disk_id,snapshot_id } ) {   
    let url = replaceParamVal(API_ECS.disk.diskRollback,[disk_id,snapshot_id]);
    let res = await http.post(url);
    return res && res.data;   
}

/**
 * 云盘扩容
 * @param {*} disk_id 云盘id
 * @param {*} size 磁盘扩容大小
 */
export async function resizeDisk( { disk_id,size } ) {   
    let url = replaceParamVal(API_ECS.disk.resizeDisk,[disk_id]);
    let res = await http.put(url,{size});
    return res && res.data;   
}

/**
 * 挂载云盘
 * @param {*} disk_id 云盘id
 * @param {*} instanceId 实例ID
 * @param {*} imageRef 镜像ID
 * @param {*} autoDelSnapshot 是否随磁盘删除快照
 */
export async function mountDisk( { disk_id,instanceId,imageRef,autoDelSnapshot } ) {   
    let url = replaceParamVal(API_ECS.disk.mountDisk,[disk_id]);
    let res = await http.post(url,{ instanceId,imageRef,autoDelSnapshot });
    return res && res.data;   
}

//卸载云盘
export async function unmoutDisk( { disk_id } ) {   
    let url = replaceParamVal(API_ECS.disk.unmoutDisk,[disk_id]);
    let res = await http.delete(url);
    return res && res.data;   
}

//释放、删除云盘
export async function releaseDisk( { disk_id } ) {   
    let url = replaceParamVal(API_ECS.disk.releaseDisk,[disk_id]);
    let res = await http.delete(url);
    return res && res.data;   
}