export default {
    basicInfo: '基本信息',
    severity: '严重度',
    history: '历史统计',
    overview: {
        safetyExamination: '安全体检',
        safetyExaminationTips: '云媒体每天会对您的资源进行一次安全检查',
        checkInspectionStrategy: '查看巡检策略',
        detectionResult: '检测结果：',
        detectionScore: '检测结果评分中',
        detecting: '正在进行：',
        detectionError: '检测失败，请重试。'
    },
    anomaly: {
        hostWeakness: '主机弱点'
    },
    leak: {
        unTreated: '待处理漏洞'
    },
    baseline: {
        error: '基线配置不当'
    },
    assetslist: {
        title: '资产列表',
        tips: 'Windows机器不在资产列表里面',
        weaknessTrend: '弱点发展趋势',
        topWeakness: 'TOP主机弱点',
        topSecurityEvent: 'TOP安全事件主机',
        intrusionEvent: '主机入侵事件',
        intrusionEventTrend: '入侵事件趋势'
    },
    vulnerablity: {
        title: '漏洞管理',
        vulnerablityMrgSetting: '漏洞管理设置',
        VulnerabilityLevelDescription: '漏洞等级说明'
    },
    dict: {
        filters: {
            online: {
                online: '在线',
                offline: '离线'
            },
            protect_switch: {
                protection: '保护中',
                agentNotInstall: '未安装Agent',
                notProtect: '暂停保护'
            }
        },
        status_list: {
            unTreated: '待处理',
            treated: '已处理',
            verification: '验证中',
            overlooked: '已忽略'
        },
        level_list: {
            serious: '严重',
            danger: '高危',
            normal: '中危',
            low: '低危'
        },
        weaktypes: {
            leak: '漏洞',
            baseline: '基线',
            weakpwd: '弱口令',
            emptypwd: '空口令'
        },
        eventtypes: {
            bruteforce: '暴力破解',
            portscan: '端口扫描',
            abnlogin: '异常登录',
            host_anomaly: '主机异常',
            webshell: '主机木马'
        },
        risk_type: {
            baseline: '合规基线',
            system: '系统',
            account: '账号',
            database: '数据库'
        },
        anti_violence_handle_status: {
            shutDown: '已封停',
            notShutDown: '未封停',
            misreport: '误报'
        },
        event_type: {
            process_exce: '异常行为',
            sen_file_distort: '文件篡改',
            abn_network: '异常连接',
            abn_event: '异常事件',
            sus_file: '可疑文件',
            mal_process: '恶意进程'
        },
        anomaly_status: {
            unTreated: '未处理',
            treated: '已处理'
        },
        webshell_status: {
            unTreated: '待处理',
            treated: '已隔离',
            misreport: '误报'
        },
        alert_type: {
            location: '异地登录',
            ip: '非法IP登录',
            acount: '非法账号登录',
            time: '非法时间登录',
            violence: '爆破登录'
        },
    }
};
