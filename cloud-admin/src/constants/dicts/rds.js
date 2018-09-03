/*
 * @Author: wenfang 
 * @Date: 2018-07-23 15:27:52 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-08-17 11:08:28
 * 数据字典
 */

// rds
export const DICT_RDS = {
    // 实例类型
    INST_TYPE: [
        {
            value: 'master',
            text: '主实例'
        },
        {
            value: 'readreplica',
            text: '只读实例'
        }
    ],
    // VOLUME_TYPE
    VOLUME_TYPE: [
        {
            value: 'COMMON',
            text: '高效云盘'
        },
        {
            value: 'HIGH',
            text: '高IO'
        },
        {
            value: 'ULTRAHIGH',
            text: 'SSD云盘'
        }
    ],
    // 实例状态
    RDS_STATUS: [
        {
            text: '运行中',
            value: 'ACTIVE',
            className: 'color-success',
            icon: 'zticon-running_people'
        },
        {
            text: '创建中',
            value: 'BUILD',
            className: 'color-danger',
            type: 'progress',
            icon: 'el-icon-loading'
        },
        {
            text: '已停止',
            value: 'BUILD',
            className: 'color-danger',
            icon: 'zticon-stop'
        },
        {
            text: '重启中',
            value: 'REBOOTING',
            className: 'color-danger',
            icon: 'el-icon-loading'
        },
        {
            text: '配置中',
            value: 'RESIZE',
            className: 'color-danger',
            icon: 'el-icon-loading'
        },
        {
            text: '故障',
            value: 'FAILED',
            className: 'color-danger',
            icon: 'icon_success'
        }
    ],
    // 监控类型
    MONITOR_TYPE: [{key: 1, value: '资源监控'}, {key: 2, value: '引擎监控'}],
    // 查询时间段
    TIMELIST: [{key: 1, value: '1小时'}, {key: 2, value: '1天'}, {key: 3, value: '7天'}, {key: 4, value: '1个月'}],
    // 备份状态
    BACKUP_STATUS: [
        {
            text: '备份中',
            value: 'backing_up',
            className: 'color-danger',
            icon: 'el-icon-loading'
        },
        {
            text: '备份成功',
            value: 'success',
            className: 'color-success',
            icon: 'icon-success'
        },
        {
            text: '备份失败',
            value: 'failed',
            className: 'color-danger',
            icon: 'el-icon-loading'
        },
        {
            text: '删除备份中',
            value: 'DELETING',
            className: 'color-danger',
            icon: 'el-icon-loading'
        }
    ]
};
