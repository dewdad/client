/*
 * @author bujiaxing
 * @data: 2018-07-24 20:24:00
 * ecs模块-云盘
 */

import http from '@/utils/http';
import {API_ECS} from '@/constants/apiUrl';
import {replaceParamVal} from '@/utils/utils';

/**
 * 查询安全组列表
 * @param {*} data
 * data: {
 * limit: 分页条数,
 * pageIndex: 开始页码,
 * name: 安全组名称,
 * id: 安全组ID,
 * ecsId: 实例ID，查询实例的安全组
 * }
 *
 */
export async function getSecurityGroupList(data) {
    data['offset'] = (data.pageIndex - 1) * data.limit + 1;
    let url = API_ECS.security.getGroupList;
    let res = await http.get(url, {params: data});
    return res && res.data;
}

/**
 * 创建安全组
 * @param {*} data
 * data: {
 * name: 安全组名称
 * }
 *
 */
export async function createGroup({name = '', description = '', zone = 'az1.dc1'} = {}) {
    let url = API_ECS.security.createGroup;
    let res = await http.post(url, {
        name,
        description,
        zone
    });
    return res && res.data;
}

/**
 * 修改安全组
 *
 * group_id: 安全组ID
 * name: 安全组名称
 * remark: 安全组描述
 */

export async function modifyGroup({id, name = '', description = ''} = {}) {
    let url = API_ECS.security.modifyGroup;
    let res = await http.put(url, {
        id,
        name,
        description
    });
    return res && res.data;
}

/**
 * 删除安全组
 *
 * group_id: 安全组ID
 */

export async function deleteGroup(group_id) {
    let url = API_ECS.security.deleteGroup;
    let res = await http.delete(replaceParamVal(url, [group_id]));
    return res && res.data;
}

/**
 * 查询安全组规则列表
 *
 * group_id: 安全组规则ID
 * limit： 每页条数
 * pageIndex： 页码
 * direction： 方向
 * create_date： 创建日期
 */

export async function getGroupRuleList({groupId, pageIndex, limit = 10, security_group_id, direction = 'ingress'} = {}) {
    let url = API_ECS.security.getGroupRuleList;
    let res = await http.get(url, {
        params: {
            groupId,
            pageIndex,
            limit,
            security_group_id: groupId,
            direction
        }
    });
    return res && res.data;
}

/**
 * 删除安全组规则
 *
 * rule_id: 安全组规则ID
 */

export async function deleteGroupRuleList(rule_id) {
    let url = API_ECS.security.deleteGroupRule;
    let res = await http.delete(url, {
        params: {
            req_param: rule_id
        }
    });
    return res && res.data;
}

/**
 * 查询所有实例-用于给安全组添加实例-过滤掉已经加入到本安全组的实例
 *
 * group_id : 安全组ID
 */

export async function getExistEcs(group_id) {
    let url = API_ECS.security.existEcs;
    let res = await http.get(replaceParamVal(url, [group_id]));
    return res && res.data;
}

/**
 * 给实例绑定安全组
 * group_id: 安全组ID
 * ecsId: 实例ID
 * grp: 处理多个IP地址时用 例如[{"192.168.0.1":"安全组ID"},{"192.168.0.1":"安全组ID"}]
 */

export async function exampleBindGroup(data) {
    let url = API_ECS.security.exampleBindGroup;
    let res = await http.post(url, data);
    return res && res.data;
}

/**
 * 给实例解绑安全组
 * group_id: 安全组ID
 * ecsId: 实例ID
 */

export async function exampleUntieGroup(data) {
    let url = API_ECS.security.exampleUntieGroup;
    let res = await http.post(url, data);
    return res && res.data;
}
/**
 *根据安全组查询所绑定的实例
 *
 * group_id: 安全组ID
 */

export async function getInstByGroup(data) {
    let url = API_ECS.security.getInstByGroup;
    let res = await http.get(url, {params: data});
    return res && res.data;
}

/**
 * 创建安全组规则
 * data: {
 *  createdate: 创建时间
 *  direction: 出入方向
 *  Protocol_type: 访问类型
 *  groupid: 安全组ID
 *  port: 端口
 *  orderlevel: 优先级
 *  remark: 描述
 *  uthorizationtype: 授权类型
 *  uthorizationip:
 *  uthorizationpolicy:
 *  id:
 * }
 */

export async function createGroupRule(data) {
    let url = API_ECS.security.createGroupRule;
    let res = await http.post(url, data);
    return res && res.data;
}

/**
 * 更新安全组规则
 * rule_id
 * remark: 描述
 */

export async function updateGroupRule(rule_id, {remark = ''} = {}) {
    let url = API_ECS.security.updateGroupRule;
    let res = await http.put(replaceParamVal(url, [rule_id]), {
        remark
    });
    return res && res.data;
}
