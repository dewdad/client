const Index = () => import('@/views/security/Index.vue');
const Overview = () => import('@/views/security/Overview.vue');
const assetslist = () => import('@/views/security/assetsList/AssetsList.vue');
const assetslistDetails = () =>
    import('@/views/security/assetsList/Details.vue');
const baseInfo = () => import('@/views/security/assetsList/BaseInfo.vue');
const detailsVulnerablity = () =>
    import('@/views/security/assetsList/Vulnerablity.vue');
const detailsVulnerablityDetail = () =>
    import('@/views/security/vulnerablity/VulnerablityDetail.vue');
const detailsBaselinecheck = () =>
    import('@/views/security/assetsList/Baselinecheck.vue');
const baselineCheckDetail = () =>
    import('@/views/security/baselineCheck/BaselineCheckDetail.vue');
const detailsHostinfo = () =>
    import('@/views/security/assetsList/hostinfo/Index.vue');
const detailsWeakpwd = () => import('@/views/security/assetsList/Weakpwd.vue');
const DetialPortScan = () =>
    import('@/views/security/portScan/DetialPortScan.vue');
const DetialExceptionlogin = () =>
    import('@/views/security/exceptionlogin/DetialExceptionlogin.vue');
const DetialWebshell = () =>
    import('@/views/security/webshell/DetialWebshell.vue');
const DetialAnomaly = () =>
    import('@/views/security/anomaly/DetialAnomaly.vue');
const DetailSafecfg = () =>
    import('@/views/security/safecfg/DetailSafecfg.vue');
const ViolenceCracking = () =>
    import('@/views/security/assetsList/ViolenceCracking.vue');
const vulnerablity = () =>
    import('@/views/security/vulnerablity/Vulnerablity.vue');
const audit = () => import('@/views/security/audit/Index.vue');
const safecfg = () => import('@/views/security/safecfg/Index.vue');
const alarmcfg = () => import('@/views/security/alarmcfg/Index.vue');

export default [
    {
        path: 'security',
        name: 'app.security',
        meta: {
            moduleName: '云主机安全'
        },
        redirect: '/people/security/overview',
        component: Index,
        children: [
            {
                path: 'overview',
                name: 'app.security.overview',
                component: Overview
            },
            {
                path: 'assetslist',
                name: 'app.security.assetslist',
                component: assetslist
            },
            {
                path: 'assetslist/details/:serverID',
                name: 'app.security.assetslist.details',
                component: assetslistDetails,
                meta: {
                    showBack: true,
                    backUrl: 'app.security.assetslist'
                },
                children: [
                    {
                        path: 'baseinfo',
                        name: 'app.security.assetslist.baseInfo',
                        component: baseInfo
                    },
                    {
                        path: 'hostinfo/:view',
                        component: detailsHostinfo,
                        meta: {
                            // 指定当前选中菜单
                            activeIndex: 'app.security.assetslist.hostinfo'
                        }
                    },
                    {
                        path: 'hostinfo',
                        name: 'app.security.assetslist.hostinfo',
                        redirect: 'hostinfo/process'
                    },
                    // 漏洞列表
                    {
                        path: 'vulnerablity',
                        name: 'app.security.assetslist.vulnerablity',
                        component: detailsVulnerablity
                    },
                    // 漏洞详情
                    {
                        path: 'vulnerablity/detail/:cve_no',
                        name: 'app.security.assetslist.vulnerablity.detail',
                        component: detailsVulnerablityDetail,
                        meta: {
                            showBack: true,
                            parentName: 'app.security.Vulnerabilitymgr.details',
                            backUrl: 'app.security.assetslist.vulnerablity'
                        }
                    },
                    // 基线检查
                    {
                        path: 'baselinecheck',
                        name: 'app.security.assetslist.baselinecheck',
                        component: detailsBaselinecheck
                    },
                    {
                        path: 'baselinecheck/detail/:no',
                        name: 'app.security.assetslist.baselinecheck.detail',
                        component: baselineCheckDetail,
                        meta: {
                            showBack: true,
                            parentName: 'app.security.baselinecheck.detail',
                            backUrl: 'app.security.assetslist.vulnerablity'
                        }
                    },
                    {
                        path: 'weakpwdchk',
                        name: 'app.security.assetslist.weakpwdchk',
                        component: detailsWeakpwd
                    },
                    {
                        path: 'antiviolencecracking',
                        name: 'app.security.assetslist.antiviolencecracking',
                        component: ViolenceCracking
                    },
                    // 防端口扫描
                    {
                        path: 'antiportscan',
                        name: 'app.security.assetslist.antiportscan',
                        component: DetialPortScan
                    },
                    // 异常登录
                    {
                        path: 'exceptionlogin',
                        name: 'app.security.assetslist.exceptionlogin',
                        component: DetialExceptionlogin
                    },
                    // 主机木马
                    {
                        path: 'webshell',
                        name: 'app.security.assetslist.webshell',
                        component: DetialWebshell
                    },
                    // 主机异常
                    {
                        path: 'hostanomaly',
                        name: 'app.security.assetslist.hostanomaly',
                        component: DetialAnomaly
                    },
                    // 主机异常
                    {
                        path: 'safecfg',
                        name: 'app.security.assetslist.safecfg',
                        component: DetailSafecfg
                    }
                ]
            },
            // 漏洞管理
            {
                path: 'vulnerablity',
                name: 'app.security.vulnerablity',
                component: vulnerablity
            },
            // 漏洞详情
            {
                path: 'vulnerablity/:serverID/:cve_no',
                name: 'app.security.vulnerablity.detail',
                component: detailsVulnerablityDetail,
                meta: {
                    showBack: true,
                    parentName: 'app.security.Vulnerabilitymgr.details',
                    backUrl: 'app.security.vulnerablity'
                }
            },
            // 基线检查
            {
                path: 'baselinecheck',
                name: 'app.security.baselinecheck',
                component: detailsBaselinecheck
            },
            // 弱口令检查
            {
                path: 'weakpwdchk',
                name: 'app.security.weakpwdchk-list',
                component: detailsWeakpwd
            },
            // 防暴力破解
            {
                path: 'violence',
                name: 'app.security.anti-violence-cracking',
                component: ViolenceCracking
            },
            // 防端口扫描
            {
                path: 'antiportscan',
                name: 'app.security.anti-port-scan',
                component: DetialPortScan
            },
            // 异常登录
            {
                path: 'exceptionlogin',
                name: 'app.security.exceptionlogin',
                component: DetialExceptionlogin
            },
            // 主机木马
            {
                path: 'webshell',
                name: 'app.security.webshell',
                component: DetialWebshell
            },
            // 主机异常
            {
                path: 'hostanomaly',
                name: 'app.security.hostanomaly',
                component: DetialAnomaly
            },
            // 操作审计
            {
                path: 'audit',
                name: 'app.security.audit',
                component: audit
            },
            // 安全配置
            {
                path: 'safecfg',
                name: 'app.security.safecfg',
                component: safecfg
            },
            // 告警配置
            {
                path: 'alarmcfg',
                name: 'app.security.alarmcfg',
                component: alarmcfg
            },
            {
                path: 'baselinecheck/:serverID/:no',
                name: 'app.security.baselinecheck.detail',
                component: baselineCheckDetail,
                meta: {
                    showBack: true,
                    parentName: 'app.security.baselinecheck.detail',
                    backUrl: 'app.security.baselinecheck'
                }
            }
        ]
    }
];
