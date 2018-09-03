/*
 * @Author: wenfang 
 * @Date: 2018-07-13 10:44:50 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-07-17 15:22:11
 * oss对象存储API服务
 */
import http from '@/utils/http';
import { API_OSS } from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 获取命名空间信息-首页加载总概览接口
 */
export async function getOssSpace() {
    let res = await http.get(API_OSS.ossSpace);
    return res && res.data;
}

/**
 * 根据uid查询用户命名空间下面的存储空间接口
 */
export async function getBucketListByUid() {
    let res = await http.get(API_OSS.bucketList);
    return res && res.data;
}

/**
 * 创建桶接口
 * @param {*} bucketName  桶名称
 * @param {*} isPrivate  是否私有 是：true 否 ：fals
 */
export async function createBucket({bucketName, isPrivate = false}) {
    let res = await http.post(API_OSS.createBucket, {
        bucketName,
        isPrivate
    });
    return res && res.data;
}

/**
 * 获取空间下绑定的域名列表接口
 * @param {*} bucketId 桶id
 */
export async function getBucketDomainList(bucketId) {
    let res = await http.get(replaceParamVal(API_OSS.bucketDomainList, [bucketId]));
    return res && res.data;
}

/**
 * 查询桶的统计数据接口
 * @param {*} bucketId 
 * @param dataItem 日期范围类型 0 今天 1 昨天 2 近七天 4 动态范围
 */
export async function getBucketData(bucketId, {startTime = '', endTime = '', dataItem = ''} = {}) {
    let res = await http.get(replaceParamVal(API_OSS.getBucketData, [bucketId]), {
        params: {
            startTime,
            endTime,
            dataItem
        }
    });
    return res && res.data;
}

/**
 * 查询桶的单个统计数据接口
 * @param {*} bucketId 
 * @param dataItem 数据类型 object 文件数量 capacity 存储容量 get/put 请求数 transfer 流量 单位byte bandwidth带宽，单位为bps
 */
export async function getBucketDataByItem(bucketId, {startTime = '', endTime = '', dataItem = ''} = {}) {
    let res = await http.get(replaceParamVal(API_OSS.getBucketDataByItem, [bucketId]), {
        params: {
            startTime,
            endTime,
            dataItem
        }
    });
    return res && res.data;
}

/**
 * 查询bucket的流量和请求数的统计数据接口
 * @param {*} bucketId 
 * @param {*} base_info 是否包含统计信
 */
export async function getBucket(bucketId, base_info = false) {
    let res = await http.get(replaceParamVal(API_OSS.getBucket, [bucketId]), {
        params: {
            base_info
        }
    });
    return res && res.data;
}

/**
 * 查询基础设置信息
 * @param {*} bucketId 
 */
export async function getBucketBasic(bucketId, base_info = false) {
    let res = await http.get(replaceParamVal(API_OSS.getBucketBasic, [bucketId]));
    return res && res.data;
}

/**
 * 删除bucket
 * @param {*} bucketId 
 */
export async function deleteBucket(bucketId) {
    let res = await http.delete(API_OSS.createBucket, {
        data: {
            bucketId
        }
    });
    return res && res.data;
}

/**
 * 获取用户绑定的域名接口
 * @param {*} bucketId 桶id
 */
export async function getUserDomainList(bucketId) {
    let res = await http.get(replaceParamVal(API_OSS.userDomains, [bucketId]));
    return res && res.data;
}

/**
 * 给空间绑定or解绑一个域名接口
 * @param {*} bucketId 桶id
 * @param {*} domain 域名
 * @param {*} type bind: 添加 unbind: 解绑
 */
export async function bindDomain(bucketId, domain, type = 'bind') {
    let res = await http.request(API_OSS.domain, {
        data: {
            domain,
            bucketId
        },
        method: type === 'bind' ? 'post' : 'delete'
    });
    return res && res.data;
}