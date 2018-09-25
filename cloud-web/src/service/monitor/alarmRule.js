/*
 * @Author: wenfang 
 * @Date: 2018-09-14 15:27:45 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-25 09:20:20
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

export async function getAlarmRuleList({pageIndex = 1, limit = 10} = {}) {
    let url = API_ECS.monitor.ruleList;
    let res = await http.get(url, {
        params: {
            ...arguments[0]
        }
    });
    return res && res.data;
}

/**
 * 创建创建告警规则
 * @param {*} data
 * {
  "alarm": {
    "createTime": "2018-09-14T05:49:42.779Z",
    "desc": "string",
    "domainId": "string",
    "id": "string",
    "instanceIds": [
      "string"
    ],
    "name": "string",
    "projectId": "string",
    "resourceType": "string",
    "type": "string",
    "userId": "string"
  },
  "notices": [
    {
      "alarmId": "string",
      "id": "string",
      "noticePerson": "string",
      "noticeType": "string",
      "remark": "string"
    }
  ],
  "rules": [
    {
      "alarmId": "string",
      "alarmTime": "string",
      "comparisonOperator": "string",
      "createTime": "2018-09-14T05:49:42.780Z",
      "id": "string",
      "noticeMail": "string",
      "noticePhone": "string",
      "remark": "string",
      "ruleLevel": 0,
      "ruleMetric": "string",
      "ruleMetricName": "string",
      "ruleName": "string",
      "status": 0,
      "syncFlag": 0,
      "threshold": "string"
    }
  ]
}
 */
export async function createRule(data) {
    let res = await http.post(API_ECS.monitor.createRule, data);
    return res && res.data;
}

/**
 * 报警历史列表
 * @param {*} param0
 */
export async function getAlarmHistoryList({pageIndex = 1, limit = 10} = {}) {
    let url = API_ECS.monitor.historyList;
    let res = await http.get(url, {
        params: {
            ...arguments[0]
        }
    });
    return res && res.data;
}

/**
 * 删除或禁用告警规则
 * @param {*} id
 */
export async function deleteRule(id, status = 2) {
    let res = await http.put(replaceParamVal(API_ECS.monitor.setStatus, [id, status]));
    return res && res.data;
}

/**
 * 更新告警规则
 * @param {*} data
 */
export async function updateRule(data) {
    let res = await http.put(API_ECS.monitor.updateRule, {
        ...data
    });
    return res && res.data;
}

/**
 * 告警详情
 * @param {*} data
 */
export async function getRule(id) {
    let res = await http.get(replaceParamVal(API_ECS.monitor.ruleInfo, [id]));
    return res && res.data;
}

/**
 * 添加联系人
 * @param {*} data 
 * {
  "email": "string",
  "emailCode": "string",
  "messageCode": "string",
  "name": "string",
  "phone": "string",
  "remark": "string",
}
 */
export async function alarmNotice(data) {
    let url = API_ECS.monitor.alarmNotice;
    let res = await http.post(url, data);
    return res && res.data;
}

/**
 * 更新联系人
 * @param {*} data
 */
export async function updateAlarmNotice(data) {
    let res = await http.put(replaceParamVal(API_ECS.monitor.updateNotice, [data.id]), data);
    return res && res.data;
}

/**
 * 联系人列表
 * @param {*} data
 */
export async function alarmNoticeList(data) {
    let res = await http.get(API_ECS.monitor.alarmNoticeList, {
        params: {
            data
        }
    });
    return res && res.data;
}

/**
 * 删除联系人
 * @param {*} id
 */
export async function deleteNotice(id) {
    let res = await http.delete(replaceParamVal(API_ECS.monitor.updateNotice, [id]));
    return res && res.data;
}
