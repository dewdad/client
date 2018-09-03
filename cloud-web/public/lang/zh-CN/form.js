export default {
    input: {
        mobile: '请输入手机号码',
        newMobile: '请输入新手机号码',
        username: '请输入账号名',
        password: '请输入登录密码',
        newPassword: '请输入新密码',
        confirmPassword: '请再次输入密码',
        code: '请输入验证码',
        mobileCode: '请输入短信验证码',
        imageCode: '请输入图形验证码',
        emailCode: '请输入邮箱验证码',
        emailOrMobile: '账号名/邮箱',
        email: '请输入邮箱地址',
        newEmail: '请输入需要绑定的新邮箱',
        formatError: '请输入正确格式',
        network: '请选择网络',
        subnet: '请选择子网',
        keyname: '请选择密钥对',
        ostype: '请选择操作系统类别',
        osversion: '请选择版本',
        instname: '请输入名称',
        instdesc: '请输入描述',
        ecsPassword: '请输入密码',
        ecsconfirmPassword: '请输入确认密码'
    },
    btn: {
        sendMobileCode: '获取短信验证码',
        sendEmail: '获取验证邮件',
        resendEmail: '重新获取邮箱验证码',
        code: '获取验证码',
        hasSend: '已发送',
        sendError: '发送失败',
        resend: '重新获取',
        changePicture: '换一张',
        changePictureCode: '点击刷新验证码',
        sending: '发送中...'
    },
    label: {
        currentMobile: '您当前绑定的手机号码',
        code: '验证码',
        email: '邮箱'
    },
    tips: {
        username: '请勿包含身份证/银行卡等隐私信息，一旦设置成功无法修改'
    },
    error: {
        username: {
            empty: '请输入账号名',
            registed: '账号名已存在',
            length: '5-32个字符，推荐使用公司名进行注册',
            allNumber: '不能为纯数字',
            format: '只能包含中英文，数字，下划线',
            length2_32: '长度为2-30位'
        }
    }
};
