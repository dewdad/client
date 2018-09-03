// 筛选条件
export const FILTERS = {
    online: [
        {
            text: $t('security.dict.filters.online.online'),
            value: 'online'
        },
        {
            text: $t('security.dict.filters.online.offline'),
            value: 'offline'
        }
    ],
    protect_switch: [
        {
            text: $t('security.dict.filters.protect_switch.protection'),
            value: '0'
        },
        {
            text: $t('security.dict.filters.protect_switch.agentNotInstall'),
            value: '1'
        },
        {
            text: $t('security.dict.filters.protect_switch.notProtect'),
            value: '2'
        }
    ]
};
// 状态列表
// export const STATUS_LIST = ['全部', '待处理', '已处理', '验证中', '已忽略'];
export const STATUS_LIST = [
    {
        label: $t('security.dict.status_list.unTreated'),
        value: '0'
    },
    {
        label: $t('security.dict.status_list.treated'),
        value: '1'
    },
    {
        label: $t('security.dict.status_list.verification'),
        value: '2'
    },
    {
        label: $t('security.dict.status_list.overlooked'),
        value: '3'
    }
];
export const BASELINE_STATUS_LIST = [
    {
        label: $t('security.dict.status_list.unTreated'),
        value: '1'
    },
    {
        label: $t('security.dict.status_list.treated'),
        value: '2'
    },
    {
        label: $t('security.dict.status_list.overlooked'),
        value: '3'
    }
];
// 漏洞等级列表
export const LEVEL_LIST = [
    $t('common.all'), //全部
    $t('security.dict.level_list.serious'),
    $t('security.dict.level_list.danger'),
    $t('security.dict.level_list.normal'),
    $t('security.dict.level_list.low')
];
export const SEVERITYS = [
    {
        label: $t('security.dict.level_list.serious'), // '严重',
        value: '4'
    },
    {
        label: $t('security.dict.level_list.danger'), // '高危',
        value: '3'
    },
    {
        label: $t('security.dict.level_list.normal'), // '中危',
        value: '2'
    },
    {
        label: $t('security.dict.level_list.low'), //'低危',
        value: '1'
    }
];

// 漏洞类型
export const WEAKTYPES = [
    {
        label: $t('security.dict.weaktypes.leak'), //漏洞
        value: 'leak'
    },
    {
        label: $t('security.dict.weaktypes.baseline'), //基线
        value: 'baseline'
    },
    {
        label: $t('security.dict.weaktypes.weakpwd'), //弱口令
        value: 'weakpwd'
    }
];

export const EVENTTYPES = [
    {
        label: $t('security.dict.eventtypes.bruteforce'), // '暴力破解',
        value: 'bruteforce'
    },
    {
        label: $t('security.dict.eventtypes.portscan'), // '端口扫描',
        value: 'portscan'
    },
    {
        label: $t('security.dict.eventtypes.abnlogin'), // '异常登录',
        value: 'abnlogin'
    },
    {
        label: $t('security.dict.eventtypes.host_anomaly'), // '主机异常',
        value: 'host_anomaly'
    },
    {
        label: $t('security.dict.eventtypes.webshell'), // '主机木马',
        value: 'webshell'
    }
];

export const ROOT_LIST = [
    {
        label: '是',
        value: '2'
    },
    {
        label: '否',
        value: '1'
    }
];

// 风险分类
export const RISK_TYPE = [
    {value: 'baseline', label: $t('security.dict.risk_type.baseline')}, //'合规基线'},
    {value: 'system', label: $t('security.dict.risk_type.system')}, //'系统'},
    {value: 'account', label: $t('security.dict.risk_type.account')}, //'账号'},
    {value: 'database', label: $t('security.dict.risk_type.database')} //'数据库'}
];
// 搜素查询条件
export const SEARCH_OPTION_TYPE = [
    {
        label: $t('common.all'),
        value: ''
    },
    {
        label: '服务器IP',
        value: 'IP'
    }
];
export const INFO = {
    leak: {
        name: $t('security.leak.unTreated'), //待处理漏洞
        level: {
            1: $t('security.dict.level_list.low'), //'低危',
            2: $t('security.dict.level_list.normal'), //'中危',
            3: $t('security.dict.level_list.danger'), //'高危',
            4: $t('security.dict.level_list.serious') //'严重'
        }
    },
    base_line: {
        name: $t('security.baseline.error'), //'基线配置不当',
        level: {
            1: $t('security.dict.level_list.low'), //'低危',
            2: $t('security.dict.level_list.normal'), //'中危',
            3: $t('security.dict.level_list.danger'), //'高危',
            4: $t('security.dict.level_list.serious') //'严重'
        }
    },
    brute_force: {
        name: $t('security.dict.eventtypes.bruteforce') //'暴力破解'
    },
    weak_pwd: {
        name: $t('security.dict.weaktypes.weakpwd') //'弱口令'
    },
    port_scan: {
        name: $t('security.dict.eventtypes.portscan') //'端口扫描'
    },
    abn_login: {
        name: $t('security.dict.eventtypes.abnlogin') //'异常登录'
    },
    webshell: {
        name: $t('security.dict.eventtypes.webshell') //'主机木马'
    },
    host_anomaly: {
        name: $t('security.dict.eventtypes.abnlogin'), //异常登录
        level: {
            1: $t('security.dict.level_list.low'), //'低危',
            2: $t('security.dict.level_list.normal'), //'中危',
            3: $t('security.dict.level_list.danger'), //'高危',
            4: $t('security.dict.level_list.serious') //'严重'
        }
    }
};

// 保护开关
export const PROTECT_SWITCH = [
    {
        text: $t('security.dict.filters.protect_switch.protection'), //'保护中',
        value: '1'
    },
    {
        text: $t('security.dict.filters.protect_switch.agentNotInstall'), // '未安装Agent',
        value: '0'
    },
    {
        text: $t('security.dict.filters.protect_switch.notProtect'), // '暂停保护',
        value: '2'
    }
];

// 在线状态
export const ONLINE = [
    {
        text: $t('security.dict.filters.online.online'), //'在线',
        value: 'online'
    },
    {
        text: $t('security.dict.filters.online.offline'), //'离线',
        value: 'offline'
    }
];

/**
 * 弱口令类型
 */
export const WEAK_PWD_TYPE = [
    {
        label: $t('security.dict.weaktypes.weakpwd'), //'弱口令',
        value: '0'
    },
    {
        label: $t('security.dict.weaktypes.emptypwd'), //'空口令',
        value: '1'
    }
];

/**
 *  服务类型
 */
export const SERVER_TYPE = [
    {value: 'sshd', label: 'SSH服务'},
    {value: 'vsftpd', label: 'FTP服务'}
    // {value: 'mysql', label: 'mysql服务'},
    // {value: 'tomcat', label: 'tomcat服务'}
];

/**
 *  服务类型
 */
export const ANTI_VIOLENCE_HANDLE_STATUS = [
    {value: '0', label: $t('common.all')}, //'全部'
    {
        value: '1',
        label: $t('security.dict.anti_violence_handle_status.shutDown')
    }, //已封停
    {
        value: '2',
        label: $t('security.dict.anti_violence_handle_status.notShutDown')
    }, //'未封停'
    {
        value: '3',
        label: $t('security.dict.anti_violence_handle_status.misreport')
    } //'误报'
];

/**
 *  服务类型
 */
export const ALERT_TYPE = [
    {value: '1', label: $t('security.dict.alert_type.location')}, //'异地登录'},
    {value: '2', label: $t('security.dict.alert_type.ip')}, //'非法IP登录'},
    {value: '3', label: $t('security.dict.alert_type.acount')}, //'非法账号登录'},
    {value: '4', label: $t('security.dict.alert_type.time')}, //'非法时间登录'},
    {value: '5', label: $t('security.dict.alert_type.violence')}, //'爆破登录'}
];

/**
 *  木马状态 0 所有
 */
export const WEBSHELL_STATUS = [
    {value: '1', label: $t('security.dict.webshell_status.unTreated')}, //'待处理'},
    {value: '2', label: $t('security.dict.webshell_status.treated')}, //'已隔离'},
    {value: '3', label: $t('security.dict.webshell_status.misreport')}, //'误报'}
];

/**
 * 主机异常 event_type
 */
export const EVENT_TYPE = [
    {value: 'process_exce', label: $t('security.dict.event_type.process_exce')}, // '异常行为'},
    {
        value: 'sen_file_distort',
        label: $t('security.dict.event_type.sen_file_distort')
    }, // '文件篡改'},
    {value: 'abn_network', label: $t('security.dict.event_type.abn_network')}, // '异常连接'},
    {value: 'abn_event', label: $t('security.dict.event_type.abn_event')}, // '异常事件'},
    {value: 'sus_file', label: $t('security.dict.event_type.sus_file')}, // '可疑文件'},
    {value: 'mal_process', label: $t('security.dict.event_type.mal_process')} // '恶意进程'}
];

/**
 * 危险程度 event_type
 */
export const ANOMALY_LEVEL = [
    {value: '1', label: $t('security.dict.level_list.low')}, //'低危',
    {value: '2', label: $t('security.dict.level_list.normal')}, //'中危',
    {value: '3', label: $t('security.dict.level_list.danger')}, //'高危',
    {value: '4', label: $t('security.dict.level_list.serious')} //'严重'
];

/**
 * 危险程度 event_type
 */
export const ANOMALY_STATUS = [
    {value: '1', label: $t('security.dict.anomaly_status.unTreated')}, //'未处理'},
    {value: '2', label: $t('security.dict.anomaly_status.treated')} //'已处理'}
];
