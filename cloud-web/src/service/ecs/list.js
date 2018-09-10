/*
 * @Author: sunersheng 
 * @Date: 2018-07-05 16:59:00 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-10 09:33:46
 * ecs模块 列表页面
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';
import RSA from '@/utils/RSA';

/**获取实例列表数据 *
 * @param {*} data
 */
export async function getEcsInstList(data) {
    let url = API_ECS.inst.getInstList;
    data.pageIndex = data.pageIndex || 1;
    data.limit = data.limit || 10;
    data['offset'] = (data.pageIndex - 1) * data.limit + 1;
    return http.get(url, {
        params: data
    });
}
/**获取实例列表数据 *
 * @param {*} data
 */
export async function getAllPortList(data) {
    let url = API_ECS.inst.getAllPortList;
    return http.get(url);
}

/**远程登录连接： 核对vnc远程登录密码 *
 * @param {*} data  getAllPortList
 */
export async function checkVncPwd({instanceId, password}) {
    let url = replaceParamVal(API_ECS.vnc.vncCheck, [instanceId]);
    let res = await http.post(url, {password});
    return res && res.data;
}

/**远程登录连接： 获取远程登录url *
 * @param {*} data
 */
export async function getVncUrl({instanceId}) {
    let url = replaceParamVal(API_ECS.vnc.vncGetUrl, [instanceId]);
    let res = await http.get(url, {});
    return res && res.data;
}

/**远程登录连接： 修改远程登录密码 *
 * @param {*} data
 */
export async function modifyVncPwd({ecsId, password1, password2}) {
    // let RSA_PWD1 = await RSA.encrypt(password1);
    // let RSA_PWD2 = await RSA.encrypt(password2);
    let url = API_ECS.vnc.vncModify;
    let res = await http.put(url, {ecsId, password1: password1, password2: password2});
    return res && res.data;
}

/**获取实例规格 *
 * @param {*} data  *
 */
export async function getInstFlavor({sysCode = 'iamge', isSensitive = 0} = {}) {
    let url = API_ECS.flavors.getFlavors;
    let res = await http.get(url, {
        params: {
            sysCode,
            isSensitive
        }
    });
    return res && res.data;
}

/**升降配：修改实例规格 *
 * @param {*} data
 * instanceId:
 * flavorId： 规格id
 */
export async function modifyInstFlavor({instanceId, flavorId}) {
    let url = replaceParamVal(API_ECS.inst.modifyInstFlavor, [instanceId, flavorId]);
    let res = await http.post(url, {});
    return res && res.data;
}

/**升降配：确定升降配 *
 * @param {*} data
 * instanceId:
 * flavorId： 规格id
 */
export async function saveInstFlavor({ecsId, flavorId}) {
    let url = API_ECS.inst.modifyInstFlavor;
    let res = await http.post(url, {
        ecsId,
        flavorId
    });
    return res && res.data;
}

/**
 * 实例列表：开关机操作:开机、软关机、硬关机、软重启、硬重启
 * type:1开机os-start、2软关机os-stop-soft、3硬关机os-stop-hard、4软重启os-reboot-soft、5硬重启os-reboot-hard
 */
export async function ecsInstAction(instanceId, actionReq, type) {
    let url = replaceParamVal(API_ECS.inst.actionInst, [instanceId]);
    let res = await http.post(url, {
        actionReq,
        type
    });
    return res && res.data;
}

/**编辑实例，编辑实例名称 *
 * @param {*} data
 */
export async function editInstInfo({instanceId, name, remark}) {
    let url = replaceParamVal(API_ECS.inst.editInstInfo, [instanceId]);
    let res = await http.post(url, {name, remark});
    return res && res.data;
}

/**删除实例 *
 * @param {*} data
 */
export async function deleteEcsInstList({instanceId, actionReq = {}, type = 1} = {}) {
    let url = replaceParamVal(API_ECS.inst.deleteInst, [instanceId]);
    let res = await http.delete(url, {actionReq, type});
    return res && res.data;
}

/**创建自定义镜像 *
 * @param {*} data
 */
export async function createCustomImage({ecsId, imageName, imageDesc}) {
    let url = API_ECS.images.createImage;
    let res = await http.post(replaceParamVal(url, [ecsId]), {name: imageName, describe: imageDesc});
    return res && res.data;
}

/**重装操作系统 *
 * @param {*} data
 */
export async function reloadSystem({instanceId}) {
    let url = API_ECS.inst.reloadInstOS;
    let res = await http.post(url, {instanceId});
    return res && res.data;
}

//根据实例id查询端口（端口和内网IP是一对一的关系，可以理解是内网IP）
export async function getPortByEcsId(ecsId, ipId) {
    let url = replaceParamVal(API_ECS.inst.getPortByEcsId, [ecsId, ipId]);
    let res = await http.put(url, {});
    return res && res.data;
}

//查询本实例已经绑定的公网IP
export async function getBindedPublicIpByEcsId({ecsId}) {
    let url = replaceParamVal(API_ECS.inst.getBindedPublicIpByEcsId, [ecsId]);
    let res = await http.get(url, {});
    return res && res.data;
}

/**
 * 创建ecs
 * {
  "server": {
    "flavorRef": "cd2700ac-6243-45a2-a508-47dfafe0f67f",
    "name": "huwen-test2",
    "adminPass": "Huwen@123",
    "circle": "1_month",
    "block_device_mapping_v2": [
      {
        "source_type": "image",
        "destination_type": "volume",
        "uuid": "cfb3eb6a-9613-495a-8ce5-70c9b2e4d35f",
        "delete_on_termination": "False",
        "boot_index": "0",
        "volume_type": "SATA",
        "volume_size": 20
      }
    ],
    "security_groups": [
      {
        "name": "e968dd5d-8fcb-412d-a40c-1f2c16213501"
      }
    ],
    "networks": [
      {
        "uuid": "3718d6fe-8f4a-4ae8-aae6-9a31fe9b25f0"
      }
    ],
    "availability_zone": "az1.dc1",
    "key_name": ""
  },
  "instanceDescribe": "test2",
  "applyInstNum": 1,
  "dataDiskList": [
    {
      "diskPerformance": "SATA",
      "diskSize": 20,
      "diskNum": 1
    }
  ],
  "ecsName": "huwen-test2",
  "availabilityZone": "az1.dc1",
  "imageId": "cfb3eb6a-9613-495a-8ce5-70c9b2e4d35f",
  "bandWidth": 4,
  "floatIpId": "",
  "floatIpType": "newCreate",
  "eip_subnet_id": "79e1ce89-1d94-481b-b4f7-67a0632a51c1",
  "loginCert": 2,
  "ports": "",
  "labels": [
    
  ],
  "bill": [
    {
      "billType": 1
    },
    {
      "flavorId": "cd2700ac-6243-45a2-a508-47dfafe0f67f"
    },
    {
      "period": "1_month"
    },
    {
      "count": 1
    },
    {
      "bandWidth": 4
    },
    {
      "sata": 20
    },
    {
      "sata": 20
    }
  ]
}
 */
export async function createECS(data) {
    let res = await http.post(API_ECS.inst.createECS, data, {
        config: {
            timeout: 60000
        }
    });
    return res && res.data;
}

//实例重置密码
//data:{ ecsId,password1,password2}
export async function resetEcsInstPassword({ecsId, password1, password2}) {
    let RSA_PWD1 = await RSA.encrypt(password1);
    let RSA_PWD2 = await RSA.encrypt(password2);
    $log('RSA_PWD', RSA_PWD1);
    let url = replaceParamVal(API_ECS.inst.resetPassword, [ecsId]);
    let res = await http.put(url, {
        ecsId,
        password1: RSA_PWD1,
        password2: RSA_PWD2
    });
    return res && res.data;
}
