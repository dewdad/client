/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: sunersheng
 * @Last Modified time: 2018-07-28 10:42:50
 * ecs模块 快照接口
 */

import http from '@/utils/http';
import { API_ECS } from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 创建快照
 * @param {*} data 
 */
export async function createSnapshot( data ) {    
    let res = await http.post(API_ECS.snapshot.createSnapshot,data);
    return res && res.data; 
}

/**
 * 查询快照
 * @param {*} data 
 */
export async function getSnapshotList( data ) {    
    let res = await http.get(API_ECS.snapshot.getSnapshotList,{
        params:data
    });
    return res && res.data; 
}

/**
 * 删除快照
 * @param {*} data 
 * snapshot_ids:要删除的快照ids字符串，多个id以逗号分隔；
 */
export async function deleteSnapshots( snapshot_ids ) {   
    let url = replaceParamVal(API_ECS.snapshot.deleteSnap,[snapshot_ids]);
    let res = await http.delete(url);
    return res && res.data; 
}