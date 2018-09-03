export const ESC_SEARCH_TYPE = [
    {value: '', label: '自动识别'},
    {value: 'id', label: '实例ID'},
    {value: 'name', label: '实例名称'},
    {value: 'fixIp', label: '私有IP'},
    {value: 'floatingIp', label: '弹性公网IP'},
    {value: 'imageId', label: '镜像ID'},
    {value: 'groupId', label: '安全组ID'},
    {value: 'vpcId', label: '虚拟专有网络ID'},
    {value: 'subnetId', label: '子网ID'},
    {value: 'status', label: '状态'}
];

export const ECS_DROPDOWN = [
    // 状态
    {
        text: '状态',
        children: [
            {key: 1, text: $t('ecs.inst.list.dropdownBtns.start'), activedStatus: ['SHUTOFF'], tip: '', handle: 'startinst'},
            {key: 2, text: $t('ecs.inst.list.dropdownBtns.stop'), activedStatus: ['ACTIVE'], tip: '', handle: 'stopinst'},
            {key: 3, text: $t('ecs.inst.list.dropdownBtns.restart'), activedStatus: ['ACTIVE'], tip: '', handle: 'restart'},
            {key: 14, text: $t('ecs.inst.list.dropdownBtns.delete'), tip: '', handle: 'delECS'}
            // {key: 4, text: $t('ecs.inst.list.dropdownBtns.reinstallOperateSysem'), activedStatus: ['SHUTOFF'], tip: $t('common.tips.mustStopInst'), handle: 'reinstall'}
        ]
    },
    // 设置
    {
        text: '实例设置',
        children: [
            {key: 6, text: $t('ecs.inst.list.dropdownBtns.modifyInfo'), activedStatus: [], tip: '', handle: 'editinfo'},
            {key: 16, text: $t('ecs.inst.list.dropdownBtns.remoteConnGuide'), activedStatus: [], tip: '', handle: 'showGuide'}
        ]
    },
    // 密码/秘钥
    {
        text: '密码/秘钥',
        children: [
            {key: 15, text: $t('ecs.inst.list.dropdownBtns.modifyRemoteLoginPassword'), activedStatus: [], tip: '', handle: 'modifyVncpwd'},
            {key: 20, text: $t('ecs.inst.list.dropdownBtns.resetPassword'), activedStatus: [], tip: '', handle: 'resetPassword'}
        ]
    },
    // 网络和安全
    {
        flag: true, //需要处理显示和隐藏按钮
        text: '网络和安全',
        children: [
            {key: 9, text: $t('ecs.inst.list.dropdownBtns.securityGroupConfig'), activedStatus: [], tip: '', handle: 'instSafeGroup',show: true},
            {key: 10, text: $t('ecs.inst.list.dropdownBtns.bindPublicIP'), activedStatus: [], tip: '', handle: 'bindip', show: false},
            {key: 11, text: $t('ecs.inst.list.dropdownBtns.unbindPublicIP'), activedStatus: [], tip: '', handle: 'unbindip', show: false},
            {key: 12, text: $t('ecs.inst.list.dropdownBtns.bindConnIp'), activedStatus: [], tip: '', handle: 'bindconnectip', show: false},
            {key: 13, text: $t('ecs.inst.list.dropdownBtns.unbindConnIp'), activedStatus: [], tip: '', handle: 'unbindconnectip', show: false}
        ]
    }
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
        text: '创建中',
        value: 'BUILD',
        className: 'color-primary',
        type: 'progress'
    },
    {
        text: '更换中',
        value: 'RESIZE',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '重启中',
        value: 'HARD_REBOOT',
        className: 'color-success',
        type: 'progress'
    },
    {
        text: '重启中',
        value: 'REBOOT',
        className: 'color-success',
        type: 'progress'
    },
    {
        text: '重装中',
        value: 'REBUILD',
        className: 'color-progress-info',
        type: 'progress'
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
        desc: ''
    },
    {
        port: '8080',
        desc: ''
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
        port: '80，443',
        desc: '80端口用于Web网站服务默认端口，443端口用于加密Web网站服务默认端口'
    },
    {
        label: 'mysql',
        port: '3306',
        desc: '3306端口用于MySQL数据库默认端口'
    },
    {
        label: 'tomcat server',
        port: '8009，8080',
        desc: ''
    },
    {
        label: 'redis server',
        port: '6379',
        desc: '6379端口用于Redis缓存数据库默认端口'
    }
];
