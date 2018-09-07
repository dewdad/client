/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-07 10:06:44
 * ecs模块 镜像接口
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
// import {replaceParamVal} from '@/utils/utils';

/**
 * 镜像列表查询
 * @param {*} categoryId
 * }
 */
export async function getImages(categoryId) {
    let res = await http.get(API_ECS.newimages.list, {
        params: {
            categoryId
        }
    });
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

/**
 *
 * GET /image/list镜像类别
 * @export
 * @param {string} [name='']
 * @param {string} [platformName='']
 * @param {number} [limit=1000]
 * @param {pageIndex} [limit=1000]
 * @returns
 */
export async function getImageList({sysCode = 'image', isSensitive = 0} = {}) {
    let res = await http.get(API_ECS.newimages.type, {
        params: {
            sysCode,
            isSensitive
        }
    });
    return res && res.data;
}
