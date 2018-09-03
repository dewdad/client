/*
 * @Author: sunersheng 
 * @Date: 2018-07-23 15:39:00 
 * @Last Modified by: sunersheng
 * @Last Modified time: 2018-07-28 10:43:36
 * ecs模块 自定义镜像接口
 */

import http from '@/utils/http';
import { API_IMAGE } from '@/constants/apiUrl';
//import {replaceParamVal} from '@/utils/utils';

/**
 * 添加自定义镜像
 * @param {*} data 
 * {
  "bucketId": "string",
  "createDate": "string",
  "description": "string",
  "fileName": "string",
  "fileSize": 0,
  "id": "string",
  "imageStatus": "string",
  "imageType": "string",
  "instanceId": "string",
  "localId": "string",
  "minSize": "string",
  "name": "string",
  "osBit": "string",
  "osType": "string",
  "osVer": "string",
  "ossUrl": "string",
  "userId": "string"
}
 */
export async function addCustomImage( data ) {    
    let res = await http.post(API_IMAGE.addCustomImage,data);
    return res && res.data; 
}