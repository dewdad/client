// 注册模块 User服务api文档,服务上下文为people-services-user
// const USER_CONTROLLER = 'people-services-user-tanjin';
const USER_CONTROLLER = 'identity';

// 云安全
// const SECURITY_CONTROLLER = 'people-services-security-pengjie';
const SECURITY_CONTROLLER = 'services-security';

// ECS模块服务上下文为services-ecs
const ECS_CTRL = 'services-ecs';

// OSS模块
const OSS_CONTROLLER = 'services-oss';

// rds模块
const RDS_CONTROLLER = 'services-rds';

// 私有镜像
const IMAGE_CTRL = 'services-image';

// 镜像
// const NEWIMAGE_CTRL = 'image-controller';

// 工单管理
const TICKET_CTRL = '/resources';

// 登录模块
export const API_LOGIN = {
    login: USER_CONTROLLER + '/auth/token',
    checkUserName: USER_CONTROLLER + '/user/checkUserName',
    getLoginState: '/auth/getLoginState'
};

// 注册模块
export const API_REGISTER = {
    register: USER_CONTROLLER + '/user/register',
    checkMobileExist: USER_CONTROLLER + '/user/checkMobileExist',
    checkImageCode: USER_CONTROLLER + '/user/checkImageCode/{code}',
    checkMobileCode: USER_CONTROLLER + '/user/checkMobileCode',
    getImageCode: USER_CONTROLLER + '/user/imageCode',
    sendMobileCode: USER_CONTROLLER + '/user/sendMobileCode'
};

//用户认证
export const API_USR_AUTH = {
    RSA: USER_CONTROLLER + '/rsa', //GET 用户认证资料详情
    getUserAuthInfo: USER_CONTROLLER + '/userAuth/{user_id}', //GET 用户认证资料详情
    userAuthMoneyConfirm: USER_CONTROLLER + '/userAuth/confirm',
    userAuthApply: USER_CONTROLLER + '/userAuth/apply',
    userAuthCompanyList: USER_CONTROLLER + '/userAuth/company/list' //已认证企业列表
};

// 联系人管理模块
export const API_CONTACT = {
    getContact: USER_CONTROLLER + '/contact/list', // 查询联系人列表
    addContact: USER_CONTROLLER + '/contact', // 添加联系人
    amendContact: USER_CONTROLLER + '/contact', // 修改联系人
    delContact: USER_CONTROLLER + '/contact' // 删除联系人
};
// ecs模块
export const API_ECS = {
    overview: {
        getVolumeCount: ECS_CTRL + '/overview/volume-count',
        getServerCount: ECS_CTRL + '/overview/server-count'
    },
    inst: {
        getInstList: '/compute/server/list',
        createECS: '/compute/server/createECS',
        getInstanceCountInfo: '/compute/server/detailInstanceTop/{instanceId}',
        getInstanceDetail: '/compute/server/{instanceId}',
        getInstanceNet: ECS_CTRL + '/servers/{instanceId}/net-info',
        modifyInstFlavor: '/compute/server/resizeECS',
        resizeInstFlavor: ECS_CTRL + '/servers/{instanceId}/resize/{flavorId}',
        reloadInstOS: ECS_CTRL + '/servers/reloadSystem',
        actionInst: '/compute/server/action/{instanceId}',
        reboot: '/compute/serverAction/reboot/{serverId}/{type}',
        editInstInfo: '/compute/server/editEcs/{instanceId}',
        deleteInst: '/compute/server/{instanceId}',
        getPortByEcsId: '/compute/floatip/associateToPort/{ecsId}/{ipId}',
        getBindedPublicIpByEcsId: '/compute/floatip/list',
        getAllPortList: ECS_CTRL + '/servers/ports',
        resetPassword: ECS_CTRL + '/servers/{ecsId}/os-reset-password',
        flavorConfirm: '/compute/server/flavorConfirm/{ecsId}',
        revertResize: '/compute/serverAction/revertResize/{ecsId}',
        attachPort: '/compute/serverAction/attachPort/{serverId}/{portId}',
        detachPort: '/compute/serverAction/detachPort/{serverId}/{attachmentId}',
        listPortAttachment: '/compute/serverAction/listPortAttachment/{serverId}'
    },
    monitor: {
        moniterEchartMetricData: '/compute/overview/getEchartMetricData',
        ruleList: '/monitor/alarmRule/list',
        updateRule: '/monitor/alarmRule/update',
        createRule: '/monitor/alarm/create',
        ruleInfo: '/monitor/alarm/{alarmId}',
        historyList: '/monitor/alarmAction/list',
        alarmNotice: '/monitor/alarmNotice/',
        alarmNoticeList: '/monitor/alarmNotice/list',
        updateNotice: '/monitor/alarmNotice/{id}'
    },
    flavors: {
        getFlavors: '/compute/server/getFlavorGroup',
        getFlavorsDetail: ECS_CTRL + '/flavors/{flavorId}/detail'
    },
    vnc: {
        vncCheck: ECS_CTRL + '/vnc/{instanceId}/check',
        vncGetUrl: '/compute/server/getVNCConsole/{instanceId}',
        vncModify: ECS_CTRL + '/vnc/modify'
    },
    disk: {
        disk: '/compute/disk',
        createBackup: '/compute/disk/createBackup',
        getDiskList: '/compute/disk/list',
        getAllDisk: '/compute/disk/listAll',
        updateDisk: '/compute/disk/{disk_id}',
        diskRollback: ECS_CTRL + '/disk/{disk_id}/rollback/{snapshot_id}', //回滚磁盘
        mountDisk: '/compute/disk/mountVolume', //挂载云盘
        unmoutDisk: '/compute/disk/uninstallVolume', //卸载云盘
        releaseDisk: '/compute/disk/{disk_id}', //释放、删除云盘
        resizeDisk: '/compute/disk/resize/{disk_id}/{size}', //云盘扩容
        getBackupList: '/compute/disk/getBackupList', // 云盘备份列表，
        deleteBackup: '/compute/disk/backup/{id}', // 删除云盘备份
        restoreBackup: '/compute/disk/restoreBackup' // 恢复云盘备份
    },
    snapshot: {
        createSnapshot: '/compute/disk/createSnapshots',
        getSnapshotList: '/compute/disk/getSnapshotsList',
        deleteSnap: '/compute/disk/snapshot/{snapshot_ids}',
        createDisk: '/compute/disk'
    },
    policy: {
        getPolicy: '/compute/policy/listPolicy',
        createPolicy: '/compute/policy',
        modifyPolicy: '/compute/policy/{policy_id}',
        udpateSnapshot: '/compute/policy/snapshot-policy'
    },
    images: {
        createImage: '/compute/server/createImage/{instanceId}',
        getImages: '/compute/image/list',
        imageGroups: ECS_CTRL + '/images/groups',
        updateImages: '/compute/image/{imageId}',
        deleteImages: '/compute/image/{imageId}'
    },
    floatIp: {
        create: ECS_CTRL + '/floating/create',
        bundlingIp: '/compute/floatip/associateToPort/{instanceId}/{floatipId}',
        getPortByInstanceId: ECS_CTRL + '/floating/getPortByInstanceId',
        llistFloatIpist: ECS_CTRL + '/floating/interface/list',
        list: '/compute/floatip/list',
        updateFloatingIp: ECS_CTRL + '/floating/{id}',
        unbundlingIp: '/compute/floatip/disassociateFromPort/{id}',
        deleteFloatIp: ECS_CTRL + '/floating/{id}',
        getFloatingList: ECS_CTRL + '/floating/list',
        modifyFloating: ECS_CTRL + '/floating/{id}',
        // 查询浮动IP
        queryFloatIp: ECS_CTRL + '/floating/interface/list'
    },
    keypairs: {
        searchKeypairs: '/compute/keypair/list', //get
        sreateKeypairs: '/compute/keypair', //post
        deleteKeypairs: '/compute/keypair/{keyId}' //delete {keyId}
    },
    labels: {
        labels: ECS_CTRL + '/labels',
        labelsCount: ECS_CTRL + '/labels/count'
    },
    network: {
        network: '/compute/network/list',
        creatNetwork: '/compute/network',
        networkID: '/compute/network/{vpcId}',
        flexIP: '/compute/floatip/list', // 查询浮动IP列表
        subnetList: '/compute/subnet/list', // 查询子网列表
        bindFloatIP: '/compute/floatip/associateToPort/{floatIP}/{instIP}', // 绑定浮动IP
        routerList: '/compute/router/list', // 路由列表
        editRouter: '/compute/router/', // 添加或修改路由
        delRouter: '/compute/router/{id}', // 添加或修改路由
        applyFloatIP: '/compute/floatip', // 确认申请浮动IP
        delFloatIP: '/compute/floatip/{floatIP}', // 释放浮动IP
        networkCount: '/compute/network/{vpcId}', // 获取网络详情
        getNetwork: '/compute/server/getNetwork',
        addRoutePort: '/compute/router/router/addInterface',
        getSubnetByNetId: ECS_CTRL + '/networks/{networkId}/subnets',
        subnet: ECS_CTRL + '/network/subnet',
        subnetID: ECS_CTRL + '/network/subnet/{subnetId}'
    },
    security: {
        createGroup: '/compute/securityGroup/createSecurityGroup', // 创建安全组
        modifyGroup: '/compute/securityGroup/updateSecurityGroup/{id}', // 修改安全组
        exampleBindGroup: ECS_CTRL + '/security-group/bind-ecs', // 给实例绑定安全组
        exampleUntieGroup: ECS_CTRL + '/security-group/unbind-ecs', // 给实例解绑安全组
        createGroupRule: '/compute/securityGroup/createSecurityGroupRule', // 创建安全组规则
        updateGroupRule: ECS_CTRL + '/security-group/rule/{rule_id}', // 更新安全组规则
        getGroupList: '/compute/securityGroup/getTenantSecurityGroups', // 查询安全组列表
        listByInstanceType: ECS_CTRL + '/security-group/listByInstanceType',
        existGroup: ECS_CTRL + '/security-group/not-exist-group', // 查询所有安全组-用于给实例添加安全组-过滤掉已经加入到本实例中的安全组
        existEcs: ECS_CTRL + '/security-group/{group_id}/not-exist-ecs', // 查询所有实例-用于给安全组添加实例-过滤掉已经加入到本安全组的实例
        deleteGroupRule: '/compute/securityGroup/deleteSecurityGroupRule', // 删除安全组规则
        deleteGroup: '/compute/securityGroup/{group_id}', // 删除安全组
        getGroupRuleList: '/compute/securityGroup/rule/list', // 查询安全组规则列表
        addGroupForInstance: '/compute/securityGroup/addGroupForInstance/{serverId}/{groupId}',
        listGroupByInstance: '/compute/securityGroup/listGroupByInstance/{serverId}',
        delGroupForInstance: '/compute/securityGroup/delGroupForInstance/{serverId}/{groupId}'
    },
    // 对等链接
    peering: {
        peering: ECS_CTRL + '/peering',
        peeringList: ECS_CTRL + '/peering/list',
        //  删除，修改
        actionPeering: ECS_CTRL + 'peering/{peering_id}',
        // 路由
        route: ECS_CTRL + '/peering/{peering_id}/route',
        deleteRoute: ECS_CTRL + '/peering/{peering_id}/route/{route_id}',
        getGroupRuleList: ECS_CTRL + '/security-group/{group_id}/rules', // 查询安全组规则列表
        getInstByGroup: ECS_CTRL + '/servers' // 根据安全组查询所绑定的实例
    },
    // 防火墙
    firewall: {
        firewall: ECS_CTRL + '/firewall',
        ID: ECS_CTRL + '/firewall/{firewall_id}',
        IDNetwork: ECS_CTRL + '/firewall/{firewall_id}/network', //防火墙绑定子网
        list: ECS_CTRL + '/firewall/list',
        rule: ECS_CTRL + '/firewall/rule',
        ruleList: ECS_CTRL + '/firewall/rule/list',
        ruleID: ECS_CTRL + '/firewall/rule/{id}'
    },
    newimages: {
        image: IMAGE_CTRL + '/image',
        // 根据类别查询镜像接口
        list: IMAGE_CTRL + '/image/images/list',
        // 列表接口
        type: '/compute/server/getImageGroup'
    }
};

// OSS对象存储模块API地址
export const API_OSS = {
    // GET /ossSpace 获取命名空间信息-首页加载总概览
    ossSpace: '/oss/user/usage',
    // 获取命名空间秘钥接口
    getAuthKeys: OSS_CONTROLLER + '/ossSpace/authKeys',
    createAuthKey: OSS_CONTROLLER + '/ossSpace/authKeys',
    ossSpaceData: OSS_CONTROLLER + '/ossSpace/data',
    delete: OSS_CONTROLLER + '/ossSpace/authKeys/{keyId}',
    bucketList: '/oss/bucket/list',
    createBucket: '/oss/bucket',
    // 给空间绑定(解绑)一个域名接口
    domain: OSS_CONTROLLER + '/ossBucket/domain',
    // 获取空间下绑定的域名列表接口
    bucketDomainList: OSS_CONTROLLER + '/ossBucket/domain/list/{bucketId}',
    // 获取用户绑定的域名接口
    userDomains: OSS_CONTROLLER + '/ossBucket/domain/userDomains/{bucketId}',
    // 查询桶的单个统计数据接口
    getBucketDataByItem: OSS_CONTROLLER + '/ossBucket/data/item/{bucketId}',
    // 查询桶的统计数据接口
    getBucketData: OSS_CONTROLLER + '/ossBucket/data/{bucketId}',
    getBucket: '/oss/bucket/{bucketId}',
    // 查询基础设置信息
    getBucketBasic: '/oss/bucket/{bucketId}/basicSet',
    // 文件操作 上传 下载 删除
    file: OSS_CONTROLLER + '/ossBucket/file',
    deleteFile: '/oss/bucket/{bucketId}/deleteFile',
    // 获取空间中的文件列表
    fileList: '/oss/bucket/{bucketId}/file',
    // 从空间中搜索指定的文件列表接口
    search: OSS_CONTROLLER + '/ossBucket/file/search',
    // 新建目录
    createDir: '/oss/bucket/{bucket_id}/createDir',
    downloadFile: OSS_CONTROLLER + '/ossBucket/file/download',
    uploadFile: '/oss/bucket/{bucket_id}/uploadFile',
    fileLink: '/oss/bucket/{bucket_id}/getFileLink',
    setBucketPrivacy: '/oss/bucket/{bucket_id}/setBucketPrivacy'
};
// 用户账号模块
export const API_UserAccount = {
    checkMobileExist: '/user/checkMobileExist',
    checkEmailExist: USER_CONTROLLER + '/user/checkEmailExist',
    validatePassword: USER_CONTROLLER + '/user/validatePassword',
    checkImageCode: '/user/checkImageCode/{code}',
    checkMobileCode: '/user/checkImageCode',
    pwdForget: USER_CONTROLLER + '/user/{userId}/resetPassword', //忘记密码
    pwdReset: USER_CONTROLLER + '/user/{userId}/resetPassword', //put 重置密码
    pwdChange: USER_CONTROLLER + '/user/{userId}/password', //put 修改密码
    activeMail: USER_CONTROLLER + '/user/activeMail',
    bindMail: USER_CONTROLLER + '/user/sendEmailValidate',
    // bindMail: USER_CONTROLLER + '/user/bindMail', // 改成发送验证码
    validateEmailCode: USER_CONTROLLER + '/user/validateEmailCode',
    uploadFile: USER_CONTROLLER + '/file/upload',
    getUploadFile: USER_CONTROLLER + '/file',
    // userAuthApply: USER_CONTROLLER + '/userAuth/apply ',
    // userAuthResult: USER_CONTROLLER + '/userAuth/{user_id}',
    // userAuthMoneyConfirm: USER_CONTROLLER + '/userAuth/confirm ',
    //getUserInfo: USER_CONTROLLER + '/user/{user_id}/info',
    //getUserInfoDetail: USER_CONTROLLER + '/user/{user_id}',
    getUserDetail: USER_CONTROLLER + '/user/{user_id}', //get 用户详情
    saveUserInfo: USER_CONTROLLER + '/user/{user_id}', //put 更新用户
    updateUserInfo: USER_CONTROLLER + '/user/{user_id}', //put 更新用户详情
    bindMobile: USER_CONTROLLER + '/user/bindPhone'
};

//租户管理接口
export const API_PROJECT = {
    getProjectByUserId: USER_CONTROLLER + '/project/getProjectByUserId'
};

// 云安全
export const API_SECURITY = {
    // 安全
    event: SECURITY_CONTROLLER + '/security/event',
    info: SECURITY_CONTROLLER + '/security/info',
    weakness: SECURITY_CONTROLLER + '/security/weakness',
    getWarningConfig: SECURITY_CONTROLLER + '/security/warningConfig/getConfig',
    setWarningConfig: SECURITY_CONTROLLER + '/security/warningConfig/setConfig',
    // 资产列表
    assetList: SECURITY_CONTROLLER + '/asset/list',
    onKeyScan: SECURITY_CONTROLLER + '/asset/onKeyScan',
    protect: SECURITY_CONTROLLER + '/asset/protect',
    // 主机信息
    onkeyscanStatus: SECURITY_CONTROLLER + '/hostInfo/onkeyscanStatus',
    hostInfoList: SECURITY_CONTROLLER + '/hostInfo/list',
    hostInfoProcess: SECURITY_CONTROLLER + '/hostInfo/process',
    hostInfoPort: SECURITY_CONTROLLER + '/hostInfo/port',
    hostInfoAccount: SECURITY_CONTROLLER + '/hostInfo/account',
    hostInfoWeb: SECURITY_CONTROLLER + '/hostInfo/web',
    hostAnomaly: SECURITY_CONTROLLER + '/hostInfo/hostAnomaly',
    // 漏洞管理
    leakManageList: SECURITY_CONTROLLER + '/leakManage/list',
    leakManageDetail: SECURITY_CONTROLLER + '/leakManage/detail',
    leakManageIgnore: SECURITY_CONTROLLER + '/leakManage/ignore',
    leakManageIgnoreCancel: SECURITY_CONTROLLER + '/leakManage/ignoreCancel',
    leakManageIgnoreVerify: SECURITY_CONTROLLER + '/leakManage/verify',
    // 基线检查
    baseLineList: SECURITY_CONTROLLER + '/baseLine/list',
    baseLineDetail: SECURITY_CONTROLLER + '/baseLine/detail',
    baseLineIgnore: SECURITY_CONTROLLER + '/baseLine/ignore',
    baseLineVerify: SECURITY_CONTROLLER + '/baseLine/verify',
    baseLineIgnoreCancel: SECURITY_CONTROLLER + '/baseLine/ignoreCancel',
    // 弱口令
    weakPwdDetail: SECURITY_CONTROLLER + '/weakPwd/detail',
    // 防暴力破解
    bruteForceDetail: SECURITY_CONTROLLER + '/bruteForce/list',
    bruteForceAddTrust: SECURITY_CONTROLLER + '/bruteForce/addTrust',
    bruteForceUnlockIP: SECURITY_CONTROLLER + '/bruteForce/unlockIP',
    bruteForceConfig: SECURITY_CONTROLLER + '/bruteForce/config',
    // 端口扫描
    portScanDetail: SECURITY_CONTROLLER + '/portScan/list',
    portScanAddTrust: SECURITY_CONTROLLER + '/portScan/addTrust',
    portScanUnlockIP: SECURITY_CONTROLLER + '/portScan/unlockIP',
    portScanConfig: SECURITY_CONTROLLER + '/portScan/config',
    // 主机木马
    webshellDetail: SECURITY_CONTROLLER + '/webshell/list',
    webshellTrust: SECURITY_CONTROLLER + '/webshell/trust',
    webshellBackup: SECURITY_CONTROLLER + '/webshell/backup',
    webshellWebList: SECURITY_CONTROLLER + '/webshell/webList',
    webshellWebPath: SECURITY_CONTROLLER + '/webshell/webPath',
    // 异常登录
    abnLoginDetail: SECURITY_CONTROLLER + '/abnLogin/list',
    abnLoginAddTrust: SECURITY_CONTROLLER + '/abnLogin/addIpWhitelist',
    abnLoginLockIP: SECURITY_CONTROLLER + '/abnLogin/lockIP',
    abnLoginUnlockIP: SECURITY_CONTROLLER + '/abnLogin/unlockIP',
    abnLoginSecuritySetting: SECURITY_CONTROLLER + '/abnLogin/securitySetting',
    abnLoginSecuritySettingList: SECURITY_CONTROLLER + '/abnLogin/securitySetting/list',
    abnLoginSecuritySettingStatus: SECURITY_CONTROLLER + '/abnLogin/securitySetting/status',
    // 安全设置
    safeConfigWebshellConfigList: SECURITY_CONTROLLER + '/safeConfig/webshellConfig/list',
    safeConfigWebshellConfig: SECURITY_CONTROLLER + '/safeConfig/webshellConfig',
    safeConfigBaseLineConfig: SECURITY_CONTROLLER + '/safeConfig/baseLineConfig',
    safeConfigStatus: SECURITY_CONTROLLER + '/safeConfig/safeConfigStatus',
    safeConfigAgentModelList: SECURITY_CONTROLLER + '/safeConfig/agentModel/list',
    // 操作审计
    opAuditList: SECURITY_CONTROLLER + '/opAudit/list'
};

// rds api
export const API_RDS = {
    // 创建rds实例
    create: RDS_CONTROLLER + '/instance',
    // 删除 详情 修改
    instance: RDS_CONTROLLER + '/instance/{instance_id}',
    // 实例列表
    list: RDS_CONTROLLER + '/instance/list',
    // 调整实例
    action: RDS_CONTROLLER + '/instance/{instance_id}/action',
    // 创建 快照
    snapshot: RDS_CONTROLLER + '/snapshot',
    // 快照列表
    snapshotList: RDS_CONTROLLER + '/snapshot/list',
    // 删除快照
    deleteSnapshot: RDS_CONTROLLER + '/snapshot/{backup_id}',
    // 数据库类型
    dataStoreType: RDS_CONTROLLER + '/datastore/type',
    // 只读副本数量
    replicaCount: RDS_CONTROLLER + '/instance/{instance_id}/replica_count',
    // 绑定/解绑浮动IP
    floatIp: RDS_CONTROLLER + '/instance/{instance_id}/float_ip',
    // 错误日志
    errorLog: RDS_CONTROLLER + '/log/{instance_id}/error',
    // 慢日
    slowLog: RDS_CONTROLLER + '/log/{instance_id}/slow',
    // 添加白名单
    addWhite: RDS_CONTROLLER + '/white',
    // 白名单列表
    whiteList: RDS_CONTROLLER + '/white/list',
    // 删除,更新白名单
    updateWhite: RDS_CONTROLLER + '/white/{group_id}',
    // 清空白名单
    clearWhite: RDS_CONTROLLER + '/white/{group_id}/clear',
    // 性能优化
    performance: RDS_CONTROLLER + '/instance/{instance_id}/performance',
    // 设置自动备份
    policy: RDS_CONTROLLER + '/instance/{instance_id}/policy',
    // 配置参数
    parameters: RDS_CONTROLLER + '/instance/{instance_id}/parameters'
};

//私有镜像
export const API_IMAGE = {
    //添加自定义镜像
    addCustomImage: IMAGE_CTRL + '/image'
};

// 概览
export const API_OVERVIEW = {
    getOrderCount: '/resources/order/getOrderCount', // 概览-工单数量
    getMonitorWarn: '/monitor/alarm/countAlarm/{days}',
    getUserUsagesAndQuota: '/identity/project/getUserUsagesAndQuota'
};

//工单管理
export const API_TICKET = {
    //post 创建工单
    createTicket: TICKET_CTRL + '/order/create',
    //GET 分页查询我的工单列表
    getOrderList: TICKET_CTRL + '/order/getOrderList',

    //delete 删除工单
    deleteOrder: TICKET_CTRL + '/order/delete',

    //put 关闭工单 工单信息，包括工单id和工单编号
    closeOrder: TICKET_CTRL + '/order/complete',

    //根据工单编号查询工单详情
    getOrderDetailByOrderNO: TICKET_CTRL + '/order/detail/{orderNO}',
    //  补充说明
    supplement: 'resources/order/supplement',

    completeOrder: '/resources/order/complete'
};
