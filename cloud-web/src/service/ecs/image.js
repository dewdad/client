/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-10 16:00:38
 * ecs模块 镜像接口
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 镜像列表查询
 * @param {*} data
 * data:{
 * limit:每页条数
 * pageIndex:分页索引
 * type: private表示查询自定义镜像， public表示查询公共镜像
 * }
 */
export async function getImages({pageIndex = 1, limit = 10, type = '', status = '',name = ''} = {}) {
    let offset = (pageIndex - 1) * limit + 1;
    let res = await http.get(API_ECS.images.getImages, {
        params: {
            pageIndex,
            limit,
            offset,
            status,
            name,
            type
        }
    });
    return res && res.data;
}

/**
 * 更新镜像
 * @param {*} data
 * data:{
 * imageId:imageId
 * is_protected
 * is_public
 * }
 */
export async function updateImage({imageId, is_protected, name, is_public}) {
    let url = replaceParamVal(API_ECS.images.updateImages, [imageId]);
    let res = await http.put(url, {is_protected, name, is_public});
    return res && res.data;
}

export async function deleteImages(imageId) {
    let url = replaceParamVal(API_ECS.images.deleteImages, [imageId]);
    let res = await http.delete(url);
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
