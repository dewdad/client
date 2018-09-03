/*
 * @Author: wenfang 
 * @Date: 2018-07-18 15:04:01 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-20 15:09:00
 * 文件管理服务
 */

import http from '@/utils/http';
// eslint-disable-next-line
// import {
//     replaceParamVal
// } from '@/utils/utils';
import {
    API_OSS
} from '@/constants/apiUrl';

/**
 * 获取空间中的文件列表
 * @param {*} bucketId 桶id
 * @param {*} prefix 前缀
 * @param {*} marker 下一次返回文件列表的位置
 * @param {*} delimiter 分隔符
 * @param {*} limit 每次返回的文件最大数量
 * @description 该方法每次调用批量返回一批文件信息，如果空间中文件超过了每批允许的最大数量，则需要多次调用该方法，并传入新的marker参数才能获取到新的文件列表，其中marker参数标记了下一次调用的起始位置
 */
export const getFileList = async ({
    bucketId,
    prefix = '',
    marker = '',
    delimiter = '',
    limit = 99999
} = {}) => {
    let res = await http.get(API_OSS.fileList, {
        params: {
            bucketId,
            prefix,
            marker,
            delimiter,
            limit
        }
    });
    return res && res.data;
};

/**
 * 从空间中搜索指定的文件列表接口
 * @param {*} bucketId 桶id
 * @param {*} path 路径
 * @param {*} marker 下一次返回文件列表的位置
 * @param {*} searchText 搜索字符串
 * @param {*} limit 每次返回的文件最大数量
 * @param {*} folderMarker 查询path文件夹下的文件列表，用folderMarker
 */
export const searchFile = async ({
    bucketId,
    path = '',
    marker = '',
    searchText = '',
    folderMarker = '',
    limit = 99999
} = {}) => {
    let res = await http.get(API_OSS.search, {
        params: {
            bucketId,
            path,
            marker,
            searchText,
            folderMarker,
            limit
        }
    });
    return res && res.data;
};

/**
 * 上传一个文件到空间
 * @param {*} bucketId 桶id
 * @param {*} localFilePath 本地文件路径
 * @param {*} prefix 前缀
 * @description 该方法只适用于小文件的上传；对于大的文件上传，强烈建议使用七牛的上传SDK进行上传
 */
export const uploadFile = async (bucketId, localFilePath, prefix) => {
    let res = await http.post(API_OSS.uploadFile, {
        bucketId,
        prefix,
        localFilePath
    });
    return res && res.data;
};

/**
 * 删除文件
 * @param {*} bucketId 桶id
 * @param {*} fileName 本地文件路径
 * @param {*} type one:删除单个文件,more:删除多个文件,folder:删除单个文件夹
 */
export const removeFile = async (bucketId, fileName, type) => {
    let res = await http.delete(API_OSS.file, {
        data: {
            bucketId,
            fileName,
            type
        }
    });
    return res && res.data;
};

/**
 * 新建目录
 * @param {*} bucketId 桶id
 * @param {*} localFilePath 本地文件路径
 * @param {*} prefix 文件前缀
 * @description 该方法只适用于小文件的上传；对于大的文件上传，强烈建议使用七牛的上传SDK进行上传
 */
export const createDir = async (bucketId, prefix, localFilePath = 's') => {
    let res = await http.post(API_OSS.createDir, {
        bucketId,
        prefix,
        localFilePath
    });
    return res && res.data;
};

/**
 * 下载文件
 * @param {*} bucketId 桶id
 * @param {*} fileType 文件路径
 * @param {*} mimeType 文件类型
 * @description 从空间中下载一个文件接口，不指定本地下载路径接口
 */
export const getFile = async (bucketId, fileType, mimeType) => {
    let res = await http.get(API_OSS.file, {
        params: {
            bucketId,
            fileType,
            mimeType
        }
    });
    return res && res.data;
};

/**
 * 下载文件
 * @param {*} bucketId 桶id
 * @param {*} fileKey 文件名称
 * @param {*} mimeType 文件类型
 * @param {*} localFilePath 本地文件路径
 * @description 从空间中下载一个文件接口
 */
export const downloadFile = async ({bucketId, fileKey, mimeType, localFilePath = ''} = {}) => {
    let res = await http.get(API_OSS.downloadFile, {
        params: {
            bucketId,
            fileKey,
            mimeType,
            localFilePath
        }
    });
    return res && res.data;
};

/**
 * 获取文件的下载链接接口
 * @param {*} bucketId 
 * @param {*} fileKey 
 */
export const getFileLink = async (bucketId, fileKey) => {
    let res = await http.get(API_OSS.fileLink, {
        params: {
            bucketId,
            fileKey
        }
    });
    return res && res.data;
};