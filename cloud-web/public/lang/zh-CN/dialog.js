export default {
    //公共的
    tipPart0: '您所选的',
    tipPart1: '1 个实例',

    //绑定连接IP
    bindLinkip: {
        newIP: '新建IP地址',
        selectExisted: '选择已有',
        placeholder: '请选择连接IP地址',
        linkIP: '连接IP地址',
        bindLinkip: '绑定连接IP地址',
        unbindLinkip: '解绑连接IP地址'
    },

    //绑定公网IP
    bindPublicip: {
        currentInst: '当前实例',
        selectExisted: '选择已有',
        goCreatePublicIP: '去创建公网IP',
        '': '绑定公网IP',
        '': '解绑公网IP',
        isEmpty: '请选择公网IP'
    },

    //删除ecs云主机实例
    deleteEcsInst: {
        tipPart0: '您所选的',
        tipPart1: '1 个实例',
        tipPart2: '将执行删除操作，您是否确认操作？',
        alert: '您确定删除后，证通云会为您保留七天，七天内可以联系管理员恢复，超过七天将无法恢复'
    },

    //编辑名称
    editName: {
        title: '编辑名称',
        label: '名称',
        inputHelp: '只能由中文字符、英文字母、数字、下划线、中划线组成，且长度小于等于64个字符',
        name: {
            validator: {
                required: '请输入名称',
                max: '长度小于等于64个字符',
                pattern: '不能包含特殊字符'
            }
        }
    },

    //ecs实例 修改信息
    modifyEcsInstInfo: {
        title: '修改信息',
        currentInst: '当前实例',
        instName: {
            label: '实例名称',
            placeholder: '请输入名称',
            required: '请输入名称'
        },
        desc: {
            label: '实例描述',
            placeholder: '请输入描述',
            tip: '长度小于300个字符'
        }
    },

    //身份验证 （手机短信验证）
    moblieVerify: {
        smsVerification: '身份验证',
        yourPhone: '您绑定的手机',
        changePhone: '更换手机',
        smsCode: '短信验证码',
        pleaseInputSmsCode: '请填写验证码',
        smsCodeError: '验证码错误'
    },

    //远程连接指导
    telnetGuide: {
        title: '远程连接指导',
        noIpTitle: '没有绑定公网IP或者连接IP的云服务器',
        byVncLogin: '通过vnc登录',
        byOtherHostLogin: '通过另一台可以远程登录的云服务器间接登录',
        telnet: '远程登录进入另一台带公网IP或者连接IP的云服务器',
        bySelfhostToTargetHost: '通过该台云服务器登录目标云服务器',

        linuxHost: 'Linux系统的云服务器',
        bindPublicIP: '绑定公网IP',
        openSSHClient: '打开SSH客户端',
        inputPubIPAndPort: '输入公网IP地址、端口',
        inputUserNamePwd: '输入用户名、密码登录',
        inputPublicIP: '输入公网IP地址',
        bindLinkIP: '绑定连接IP',
        newMedia: '接入新媒体大楼办公网络',
        inputLinkIPAndPort: '输入连接IP地址、端口',

        windowHost: 'Windows系统的云服务器',

        aboutDownload: '下载安装Windows SSH和Telnet客户端Putty（访问的机器如果也是Windows系统，直接打开远程桌面连接）',
        inputLinkIP: '输入连接IP地址'
    },

    //重置密码
    resetPwd: {
        title: '重置密码',
        alertTip0: '提示：重置实例密码后，只有在控制台重启实例才能生效。',
        loginPwd: '登录密码',
        confirmPwd: '确认密码',

        tipPart0: '您所选的',
        tipPart1: '1 个实例',
        tipPart2: '将执行启动操作，您是否确认操作？',

        passwordNotSame: '两次输入密码不一致',
        inputNewPwd: '请输入新密码',
        inputConfirmPwd: '请输入确认密码',
        tooltip1: '8-30个字符'
    },

    //远程密码修改
    remotePwd: {
        title: '修改远程登录密码',
        newPwd: '新密码',
        confirmPwd: '确认密码',
        inputNewPwd: '请输入新密码',

        pwdIsNotCorrect: '密码格式不正确',
        inputConfirmPwd: '请输入确认密码',
        confirmPwd: '确认密码'
    },

    //ecs实例停止
    stopEcsInst: {
        title: '停止实例',
        alert: '停止实例后仍旧保留实例，已分配IP、规格等配置不会改变',
        tipPart2: '将执行停止操作，您是否确认操作？',
        stopType: '停止方式',

        stop: '停止',
        forceStop: '强制停止',
        forceStopTip: '强制停止模式，会导实例当前未保存的数据丢失。',
        checkboxOfForceStop: '确定要强制停止'
    },

    //ecs实例启动
    startEcsInst: {
        title: '启动',
        tipPart2: '将执行启动操作，您是否确认操作？'
    },

    //ecs实例重启
    restartEcsInst: {
        title: '重启实例',
        alert: '重启实例后仍旧保留实例，已分配IP、规格等配置不会改变',
        tipPart2: '将执行重启操作，您是否确认操作？',

        restartType: '重启方式',

        restart: '重启',
        forceRestart: '强制重启',
        forceRestartTip: '强制重启模式，会导致实例当前未保存的数据丢失。',
        checkboxOfForceRestart: '确定要强制重启'
    }
};
