/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-07-27 18:37:17
 * ecs模块 镜像接口
 */

import http from '@/utils/http';
import { API_ECS } from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 镜像列表查询
 * @param {*} data 
 * data:{
 * limit:每页条数
 * pageIndex:分页索引
 * type: rue表示查询自定义镜像， false表示查询公共镜像
 * }
 */
export async function getImages( data ) {    
    let res = await http.get(API_ECS.images.getImages,{ 
        params: data 
    });
    return res && res.data; 
}

/**
 * 更新镜像
 * @param {*} data 
 * data:{
 * imageId:imageId
 * type:类型，如只修改名称 则该值为name,修改备注为desc
 * name: rue表示查询自定义镜像， false表示查询公共镜像
 * description：
 * }
 */
export async function updateImage( {imageId,type,name,description} ) {   
    let url = replaceParamVal(API_ECS.images.updateImages,[imageId]);   
    let res = await http.put(url,{ type,name,description });
    return res && res.data; 
}

export async function deleteImages( imageId ) {
    let url = replaceParamVal(API_ECS.images.deleteImages,[imageId]);
    let res = await http.DELETE(url);
    return res && res.data; 
}

/**
 * 获取镜像分组
 * @param types 更换操作系统时传change
 * @param osType centos、redhat、coreos、debian、windows
 */
export async function getImagesGroups(types, osType) {
    let res = await http.get(API_ECS.images.imageGroups, {
        params: {
            types,
            osType
        }
    });
    return res && res.data; 
}

 