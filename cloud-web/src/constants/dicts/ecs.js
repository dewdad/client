export const ESC_SEARCH_TYPE = [
    // {value: '', label: '自动识别', placehold: '选择实例属性项搜索，或者输入关键字识别搜索'},
    {value: 'uuid', label: '实例ID', placehold: '输入实例ID精确查询'},
    {value: 'name', label: '实例名称', placehold: '请输入实例名称'},
    {value: 'ip', label: '公网IP', placehold: '请输入IP'},
    // {value: 'floatingIp', label: '弹性公网IP', placehold: '请输入弹性公网IP精确查询'},
    {value: 'image', label: '镜像ID', placehold: '请输入镜像ID精确查询'},
    {value: 'flavor', label: '模版ID', placehold: '请输入模版ID精确查询'},
    // {value: 'groupId', label: '安全组ID', placehold: '请输入安全组ID精确查询'},
    // {value: 'vpcId', label: '私有网络ID', placehold: '请输入虚拟专有网络ID精确查询'},
    // {value: 'subnetId', label: '子网ID', placehold: '请输入子网ID精确查询'},
    {value: 'status', label: '状态', placehold: '请输入状态'}
];

export const ECS_STATUS = [
    {
        text: '关机',
        value: 'SHUTOFF',
        className: 'color-danger',
        icon: 'zticon-stop'
    },
    {
        text: '运行中',
        value: 'active',
        className: 'color-success',
        icon: 'zticon-running_people'
    },
    {
        text: '运行中',
        value: 'ACTIVE',
        className: 'color-success',
        icon: 'zticon-running_people'
    },
    {
        text: '失败',
        value: 'ERROR',
        className: 'color-danger',
        icon: 'zticon-overdue_people'
    },
    {
        text: '待重启',
        value: 'WAIT_REBOOT',
        className: 'color-warning',
        icon: 'zticon-running_people1'
    },
    {
        text: '创建中',
        value: 'build',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '停止中',
        value: 'SHUTDOWN',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '调整套餐中',
        value: 'resize',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '重启中',
        value: 'hard_reboot',
        className: 'color-success',
        type: 'progress'
    },
    {
        text: '重启中',
        value: 'reboot',
        className: 'color-success',
        type: 'progress'
    },
    {
        text: '启动中',
        value: 'STARTUP',
        className: 'color-success',
        type: 'progress'
    },
    {
        text: '重装中',
        value: 'rebuild',
        className: 'color-progress-info',
        type: 'progress'
    },
    {
        text: '确认中',
        value: 'verify_resize',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '删除中',
        value: 'deleted',
        className: 'color-warning',
        type: 'progress'
    },
    {
        text: '恢复中',
        value: 'revert_resize',
        className: 'color-warning',
        type: 'progress'
    },
    {
        text: '挂起',
        value: 'suspended',
        className: 'color-primary',
        icon: 'zticon-stop'
    },
    {
        text: '未知',
        value: 'unknown',
        className: 'color-danger',
        icon: 'zticon-stop'
    }
];

// ECS 状态集合
export const ECS_STATU_SET = Array.from(new Set(ECS_STATUS.map(e => e.value)));
// 允许远程登录的状态
export const remoteLoginActivedStatus = ['ACTIVE'];
// 允许更改实例规格的状态
export const modifyConfigActivedStatus = ['ACTIVE', 'SHUTOFF'];
// 下拉菜单
export const ECS_DROPDOWN = [
    // 状态
    {
        text: '实例状态',
        children: [
            {key: 1, text: $t('ecs.inst.list.dropdownBtns.start'), activedStatus: ['SHUTOFF', 'WAIT_REBOOT'], tip: '', handle: 'startinst'},
            {key: 2, text: $t('ecs.inst.list.dropdownBtns.stop'), activedStatus: ['ACTIVE'], tip: '', handle: 'stopinst'},
            {key: 3, text: $t('ecs.inst.list.dropdownBtns.restart'), activedStatus: ['ACTIVE'], tip: '', handle: 'restart'},
            {key: 14, text: $t('ecs.inst.list.dropdownBtns.delete'), tip: '', handle: 'delECS', activedStatus: ECS_STATU_SET.filter(e => e !== 'BUILD')}, // 创建中不能删除
            {text: '恢复', activedStatus: ['verify_resize'], tip: '', handle: 'revertResize'},
            {text: '确认', activedStatus: ['verify_resize'], tip: '', handle: 'flavorConfirm'}
            // {key: 4, text: $t('ecs.inst.list.dropdownBtns.reinstallOperateSysem'), activedStatus: ['SHUTOFF'], tip: $t('common.tips.mustStopInst'), handle: 'reinstall'}
        ]
    },
    // 设置
    {
        text: '实例设置',
        children: [
            {
                key: 6,
                text: $t('ecs.inst.list.dropdownBtns.modifyInfo'),
                activedStatus: ['SHUTOFF', 'ACTIVE', 'WAIT_REBOOT', 'HARD_REBOOT', 'REBOOT', 'SHUTDOWN', 'STARTUP'],
                tip: '',
                handle: 'editinfo'
            },
            {
                key: 16,
                text: '创建自定义镜像',
                activedStatus: ['SHUTOFF'],
                tip: '',
                handle: 'createImage'
            }
        ]
    },
    // 密码/秘钥
    // {
    //     text: '密码', //禅道4680bug单去掉秘钥
    //     children: [
    //         {key: 15, text: $t('ecs.inst.list.dropdownBtns.modifyRemoteLoginPassword'), activedStatus: ['SHUTOFF', 'ACTIVE', 'WAIT_REBOOT'], tip: '', handle: 'modifyVncpwd'},
    //         {key: 20, text: $t('ecs.inst.list.dropdownBtns.resetPassword'), activedStatus: ['SHUTOFF', 'ACTIVE', 'WAIT_REBOOT'], tip: '', handle: 'resetPassword'}
    //     ]
    // },
    // 网络和安全
    {
        flag: true, //需要处理显示和隐藏按钮
        text: '网络和安全',
        children: [
            {key: 9, text: $t('ecs.inst.list.dropdownBtns.securityGroupConfig'), activedStatus: ['SHUTOFF', 'ACTIVE', 'WAIT_REBOOT'], tip: '', handle: 'instSafeGroup', show: true},
            {key: 10, text: $t('ecs.inst.list.dropdownBtns.bindPublicIP'), activedStatus: ['SHUTOFF', 'ACTIVE', 'WAIT_REBOOT'], tip: '', handle: 'bindip', show: false},
            {key: 11, text: $t('ecs.inst.list.dropdownBtns.unbindPublicIP'), activedStatus: ['SHUTOFF', 'ACTIVE', 'WAIT_REBOOT'], tip: '', handle: 'unbindip', show: false}
        ]
    }
];
/**
 * ecs类型
 */
export const PLAT_FORM = [
    {
        text: 'X86计算',
        value: '1',
        disabled: false
    },
    {
        text: '异构计算GPU/FPGA（即将上线）',
        value: '2',
        disabled: true
    },
    {
        text: '弹性裸金属服务器（即将上线）',
        value: '3',
        disabled: true
    }
];

/**
 * 操作系统类型
 */
export const OS_TYPES = [
    {
        sysValueDesc: 'CentOS',
        icon: 'icon-centos'
    },
    {
        sysValueDesc: 'Windows',
        icon: 'icon-windows'
    },
    {
        sysValueDesc: 'Ubuntu',
        icon: 'icon-ubuntu'
    },
    {
        sysValueDesc: 'Redhat',
        icon: 'icon-redhat'
    },
    {
        sysValueDesc: 'Debian',
        icon: 'icon-debian'
    },
    {
        sysValueDesc: 'SUSE',
        icon: 'icon-suse'
    },
    {
        sysValueDesc: 'CoreOS',
        icon: 'icon-coreos'
    }
];

export const STORAGE_TYPES = [
    {
        value: 'SATA',
        label: '高效云盘'
    },
    {
        value: 'SSD',
        label: 'SSD云盘'
    }
];

export const FLAVOR_TYPE = [
    {
        value: 'generalType',
        label: '通用型'
    },
    {
        value: 'largeCpuType',
        label: '计算型'
    },
    {
        value: 'largeMemoryType',
        label: '内存型'
    }
];

/**
 * 常用TCP端口
 */
export const TCP_PORT = [
    {
        port: '22',
        desc: '22端口用于Linux SSH登录'
    },
    {
        port: '23',
        desc: '23端口用于telnet远程登陆'
    },
    {
        port: '80',
        desc: '80端口用于Web网站服务默认端口'
    },
    {
        port: '443',
        desc: '443端口用于加密Web网站服务默认端口'
    },
    {
        port: '1433',
        desc: '1433端口用于Microsoft SQL Server数据库默认端口'
    },
    {
        port: '1521',
        desc: '1521端口用于Oracle数据库默认端口'
    },
    {
        port: '3306',
        desc: '3306端口用于MySQL数据库默认端口'
    },
    {
        port: '3389',
        desc: '3389端口用于windows远程登录'
    },
    {
        port: '6379',
        desc: '6379端口用于Redis缓存数据库默认端口'
    },
    {
        port: '8009',
        desc: '8009端口用于tomcat的AJP协议默认端口'
    },
    {
        port: '8080',
        desc: '8080端口用于tomcat的HTTP协议默认端口'
    }
];

/**
 * 常用标签
 */
export const COMMON_LABEL = [
    {
        label: 'linux',
        port: '22',
        desc: '22端口用于Linux SSH登录'
    },
    {
        label: 'windows',
        port: '3389',
        desc: '3389端口用于windows远程登录'
    },
    {
        label: 'web server',
        port: '80,443',
        desc: '80端口用于Web网站服务默认端口；443端口用于加密Web网站服务默认端口'
    },
    {
        label: 'mysql',
        port: '3306',
        desc: '3306端口用于MySQL数据库默认端口'
    },
    {
        label: 'tomcat server',
        port: '8009,8080',
        desc: '8009端口用于tomcat的AJP协议默认端口；8080端口用于tomcat的HTTP协议默认端口'
    },
    {
        label: 'redis server',
        port: '6379',
        desc: '6379端口用于Redis缓存数据库默认端口'
    }
];

export const DISK_STATUS = [
    {
        text: '创建中',
        value: 'creating',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '使用中',
        state: false,
        value: 'in-use',
        className: 'color-success',
        icon: 'zticon-running_people'
    },
    {
        text: '创建错误',
        value: 'error',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '待挂载',
        value: 'available',
        className: 'color-primary',
        icon: 'zticon-recentcreation_peop'
    },
    {
        text: '连接中',
        value: 'attaching',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '挂载中',
        value: 'in-user',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '分离中',
        value: 'detaching',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '删除中',
        value: 'deleting',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '删除错误',
        value: 'error_deleting',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '备份中',
        value: 'backing-up',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '备份失败',
        value: 'error_backing-up',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '恢复错误',
        value: 'error_restoring',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '恢复中',
        value: 'restoring-backup',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '上传中',
        value: 'uploading',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '下载中',
        value: 'downloading',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '扩容中',
        value: 'extending',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '扩容错误',
        value: 'error_extending',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '回滚中',
        value: 'rollbacking',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '回滚错误',
        value: 'error_rollbacking',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    }
];

export const DISK_BACK_STATUS = [
    {
        text: '创建中',
        value: 'creating',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '使用中',
        state: false,
        value: 'in-use',
        className: 'color-success',
        icon: 'zticon-running_people'
    },
    {
        text: '创建错误',
        value: 'error',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '成功',
        value: 'available',
        className: 'color-success',
        icon: 'icon-chenggong',
        type: 'font'
    },
    {
        text: '连接中',
        value: 'attaching',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '挂载中',
        value: 'in-user',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '分离中',
        value: 'detaching',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '删除中',
        value: 'deleting',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '删除错误',
        value: 'error_deleting',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '备份中',
        value: 'backing-up',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '备份失败',
        value: 'error_backing-up',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '恢复错误',
        value: 'error_restoring',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '恢复中',
        value: 'restoring-backup',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '上传中',
        value: 'uploading',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '下载中',
        value: 'downloading',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '扩容中',
        value: 'extending',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '扩容错误',
        value: 'error_extending',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '回滚中',
        value: 'rollbacking',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '回滚错误',
        value: 'error_rollbacking',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    }
];

export const MONITOR_RULE_TYPES = [
    {key: '1', value: 'get请求数', unit: 'Frequency'},
    {key: '2', value: 'put请求数', unit: 'Frequency'},
    {key: '3', value: '总请求数', unit: 'Frequency'},
    {key: '4', value: '下载流量', unit: 'byte'},
    {key: '5', value: '带宽流量', unit: 'byte'},
    {key: 'cpu_util', value: 'cpu使用率', unit: '%'},
    {key: 'mem_util', value: '内存使用率', unit: '%'},
    {key: 'network_incoming_bytes_aggregate_rate', value: '带外网络流入速率', unit: 'byte/s'},
    {key: 'network_outgoing_bytes_aggregate_rate', value: '带外网络流出速率', unit: 'byte/s'},
    {key: 'disk_read_bytes_rate', value: '磁盘读速率', unit: 'byte/s'},
    {key: 'disk_read_requests_rate', value: '磁盘读操作速率', unit: 'Frequency'},
    {key: 'disk_write_bytes_rate', value: '磁盘写速率', unit: 'byte/s'},
    {key: 'disk_write_requests_rate', value: '磁盘写操作速率', unit: 'Frequency'},
    {key: 'disk_device_read_bytes_rate', value: '磁盘读速率', unit: 'byte/s'},
    {key: 'disk_device_read_requests_rate', value: '磁盘读操作速率', unit: 'Frequency'},
    {key: 'disk_device_write_bytes_rate', value: '磁盘写速率', unit: 'byte/s'},
    {key: 'disk_device_write_requests_rate', value: '磁盘写操作速率', unit: 'Frequency'},
    {key: 'rds001_cpu_usage', value: 'CPU利用率', unit: '该指标用于统计测量对象的CPU利用率，以比率为单位。'},
    {key: 'rds002_mem_usage', value: '内存利用率', unit: '该指标用于统计测量对象的内存利用率，以比率为单位。'},
    {key: 'rds003_iops', value: 'IOPS', unit: '该指标用于统计当前实例，单位时间内系统处理的I/O请求数量（平均值）。'},
    {key: 'rds047_disk_total_size', value: '磁盘总大小', unit: '该指标用于统计测量对象的磁盘总大小。'},
    {key: 'rds006_conn_count', value: '数据库总连接数', unit: '该指标用于统计试图连接到MySQL服务器的总连接数，以个为单位。'}
];
