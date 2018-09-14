/*
 * @Author: wenfang 
 * @Date: 2018-09-14 15:27:45 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-14 17:18:11
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
// import {replaceParamVal} from '@/utils/utils';

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
    let res = await http.get(API_ECS.monitor.createRule, data);
    return res && res.data;
}
