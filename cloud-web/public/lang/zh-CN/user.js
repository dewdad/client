export default {
    login: {
        login: '登  录',
        register: '免费注册',
        forget: '忘记密码',
        directLogin: '直接登录',
        userNameIsEmpty: '请输入账号名/邮箱进行登录',
        userNameIsError: '当前网络信号较差，请稍后再试...',
        pwdIsEmpty: '请输入密码',
        helpTips: '账号登录支持账号名/邮箱+密码，短信登录支持手机号码+验证码',
        loginMax: '登录失败次数过多，请您5分钟后再试',
        sendSuccess: '验证码发送成功，请注意查收',
        sendError: '获取验证码失败，请重新获取',
        accountLogin: '账号登录',
        mobileLogin: '短信登录',
        noMobileCode: '没有收到短信验证码',
        iKnow: '我知道了',
        tips: `
        <p>1、非中国大陆手机号码<br/> 目前仅支持中国大陆手机号码注册，请更换其他手机。
        </p>
        <p>2、手机安全软件拦截（针对已安装安全软件的智能手机用户）<br/> 请打开手机安全软件，暂时关闭拦截功能，然后再次尝试获取验证码。
            <p>3、短信网关拥堵或出现异常<br/> 短信网关拥堵或出现异常时会导致已发送的短信出现延时或丢失的情况，建议联系手机运营商核实或过段时间再尝试获取。
                <p>4、周围的人可以正常使用，但自己始终收不到<br/> 建议交换机卡测试，将自己手机卡换到别人的手机上接收短信，再次尝试。
                    <p>5、发送短信验证频率过快导致<br/> 由于您发送短信验证频率过快导致的，建议您隔一段时间后再重新尝试操作即可。
                    </p>`
    },
    register: {
        register: '注册',
        hasAcount: '已有账号',
        title: '欢迎您加入人民日报媒体云',
        mobilePlacehoder: '请输入手机号码',
        loginPassPlacehoder: '设置你的登录密码',
        confirmPassPlacehoder: '请再次输入你的登录密码',
        imageCodePlacehoder: '请输入图片验证码',
        mobileCodePlacehoder: '请输入短信验证码',
        mobileIsEmpty: '请输入手机号码',
        mobileIsError: '请输入正确的手机号码',
        mobileIsRegisted: '该手机号码已绑定其他账号',
        mobileIsNotRegisted: '该手机号码未注册 ',
        loginPassIsEmpty: '请输入登录密码',
        confirmPassIsEmpty: '请再次输入密码',
        loginPassLength: '8-32个字符，字母区分大小写',
        loginPassIsError: '密码格式不正确',
        passAgain: '请再次输入密码',
        passIsUnEqual: '两次输入的密码不一致，请重新输入',
        imageCodeIsEmpty: '请输入图片验证码',
        imageCodeIsError: '请输入正确的验证码',
        emailCodeIsEmpty: '请输入验证码',
        emailCodeIsError: '短信验证码输入错误',
        mobileCodeIsEmpty: '请输入短信验证码',
        mobileCodeIsError: '请输入正确的短信验证码',
        agree: '同意条款并注册',
        agreement: '同意并遵守',
        notAgree: '请仔细阅读后勾选同意再提交',
        termsOfService: '《服务条款》',
        privacyStatement: '《隐私声明》',
        success: '恭喜您注册成功',
        successTitle: '注册成功',
        successTips: '完成实名认证，即可享受云产品',
        account: '您的注册账号：',
        authentication: '快速实名认证',
        homeBtn: '随便看看'
    },
    account: {
        emailIsEmpty: '请输入邮箱地址',
        emailIsError: '邮箱地址格式错误',
        emailIsUsed: '邮箱地址已使用',
        Auth: {
            title: '实名认证',
            titleDepart: '部门认证',
            authType: '认证类型',
            material: '材料证明',
            imageSizeTip: '上传图片大小不能超过',
            //实名认证页面
            overview: {
                btnAuth: '立即认证',
                btnRetryAuth: '重新认证',
                clickHere: '点击进入',
                comName: '企业名称',
                deptName: '部门名称',
                certNo: '证件号码',
                creditCode: '统一社会信用代码',
                status0: {
                    title: '您还未进行实名认证，认证通过后方可申请媒体云资源',
                    tip: '接下来您可以申请认证'
                },
                status1: {
                    title: '您的申请已提交，请耐心等待审核...',
                    tip: '您可以去文档与支持进行阅览'
                },
                status2: {
                    //title: '您已通过媒体云实名认证！'
                    title: '认证成功！',
                    tip: '接下来您可以创建自己的云服务器'
                },
                status3: {
                    title: '审核失败',
                    subtitle: '很抱歉，您的审核没有通过，请重新进行认证申请',
                    tip: '接下来您可以重新申请认证'
                },
                status4: {
                    //title: '您的审核已通过，媒体云将在2-3日内向您输入的对公账号进行打款认证，请注意查收',
                    moneyConfirm: {
                        //确认打款
                        title: '媒体云已向您的对公账号进行打款，请输入打款金额完成认证',
                        subtitle: '输入错误3次则认证失败，请您仔细核对后提交',
                        placeholder: '输入打款金额',
                        tipSuccess: '金额输入正确',
                        tipError: '金额输入错误',
                        validator: {
                            required: '',
                            error: '您输入的金额错误，还有{failedCnt}次提交机会'
                        },
                        titleFailedCnt: '认证失败',
                        subtitleFailedCnt: '很抱歉，由于您的认证金额错误次数太多，请重新进行申请认证'
                    }
                }
            },

            companyAuth: {
                companyAuthTitle: '企业认证',
                title: '尊敬的客户，您因为订购媒体云服务需进行认证。',
                subtitle: '请确认贵公司工商在册，并规定通过年检，谢谢',
                contextTitle: '请按照要求填写认证信息，认证成功后将为您开启媒体云服务',
                alterTips: '请核对认证申请信息，提交后将不能修改',
                companyLicense: '营业执照',
                companyNameExist: '该企业名称已认证',
                label: {
                    companyName: '公司名称',
                    area: '企业注册地区',
                    creditCode: '统一社会信用代码',
                    bankName: '开户行',
                    bankAcctNo: '对公账号',
                    companyLicense: '上传营业执照'
                },
                placeholder: {
                    companyName: '请按照营业执照上的名称核对输入',
                    creditCode: '请填写统一社会信用代码',
                    bankName: '请填写开户行',
                    bankAcctNo: '请填写公司对公账号'
                },
                tips: {
                    bankAcctNo: '不支持个人信用卡和个人存折进行认证',
                    companyLicense: '支持格式：JPG/JPEG/PNG，最大值{filesize}MiB，数量：1'
                },
                dlg: {
                    context: '{companyName}已在媒体云存在认证记录,<br/>是否认证为该公司所属部门？<br/>'
                },
                msg: {
                    imageAccept: '上传图片支持的格式：JPG/JPEG/PNG'
                },
                validator: {
                    companyName: {
                        required: '请输入公司名称'
                    },
                    area: {
                        required: '请选择企业注册地区'
                    },
                    creditCode: {
                        required: '请输入统一社会信用代码',
                        error: '请输入正确的信用代码，限18位',
                        maxlength: '统一社会信用代码长度不正确'
                    },
                    bankName: {
                        required: '请输入开户行',
                        error: '请输入正确的对公账号开户行',
                        maxlength: '长度错误'
                    },
                    bankAcctNo: {
                        required: '请输入对公账号',
                        error: '请输入正确的对公账号',
                        maxlength: '对公账号长度错误'
                    },
                    companyLicense: {
                        required: '请上传营业执照'
                    }
                }
            },

            departAuth: {
                departAuthTitle: '部门认证',
                title: '尊敬的客户，您因为订购媒体云服务需进行认证。',
                subtitle: '请确认您所在的企业已通过实名认证，谢谢!',
                tips: ' 请核对认证申请信息，提交后将不能修改',
                companyName: {
                    label: '已认证企业',
                    validator: {
                        required: '已认证企业不能为空'
                    }
                },
                companyDept: {
                    label: '部门名称',
                    placeholder: '请填写部门名称',
                    validator: {
                        required: '请输入部门名称',
                        max: '最多100个字符'
                    }
                },
                contact: {
                    label: '认证联系人',
                    placeholder: '请填写认证联系人',
                    validator: {
                        required: '请输入认证联系人',
                        max: '最多100个字符',
                        pattern: '只能包含中英文，数字，下划线'
                    }
                },
                tel: {
                    label: '联系人手机号码',
                    placeholder: '请填写认证联系人手机号码',
                    validator: {
                        required: '请输入联系人手机号码',
                        pattern: '请输入正确的手机号码'
                    }
                },
                material: {
                    label: '上传材料证明',
                    validator: {
                        required: '请上传材料证明(不超过九张)',
                        max: '上传材料证明不能多于九张',
                        error: '请删除或重新上传失败图片'
                    },
                    note: '支持格式：JPG/JPEG/PNG，最大值{filesize}MiB，数量：{max}'
                }
            },
            authApply: {
                authApplyTitle: '您已提交企业认证信息，耐心等候！',
                authApplyTitleTips: '打款需要2-3个工作日，请关注系统通知，及时进行打款金额确认！'
            },
            status: {
                statusOne: '您未进行实名认证',
                statusTwo: '待审批',
                statusThree: '您已实名认证',
                statusFour: '实名认证失败',
                statusFive: '待确认金额'
            }
        },
        baseInfo: {
            comAgeIsEmpty: '请选择营业年限',
            comScaleIsEmpty: '请选择企业规模',
            mainBusinnessIsEmpty: '请选择主要行业应用',
            cityIsEmpty: '请选择城市',
            zoomIsEmpty: '请选择区',
            majorappIsEmpty: '请填写主营业务',
            comNatureEmpty: '请填写企业性质',
            areaIsEmpty: '请选择省市区',
            telephoneIsError: '请填写正确的电话号码',
            faxIsError: '请填写正确的传真号码',
            websiteIsError: '请填写正确的网址'
        },
        pwdManage: {
            title: '修改密码',
            step1: '验证身份',
            step2: '修改密码',
            step3: '完成',
            isOldPwdError: '新密码不能与最近三次旧密码相同',
            step1Tips: '为确认是您本人操作，请完成手机验证码验证',
            step2Tips: '请修改您的登录密码',
            step3Tips: '新密码重置已完成，请重新登录',
            imageCodeTips: '请输入图片验证码',
            mobileCodeTips: '请输入短信验证码',
            next: '下一步',
            toLogin: '重新登录',
            pwdForget: {
                title: '忘记密码',
                step2: '忘记密码'
            },
            pwdReset: {
                title: '修改密码',
                mobileTips: '您当前绑定的手机号码:'
            },
            tips: {
                tips1: '8-32个字符，字母区分大小写',
                tips2: '只能包含数字、字母、特殊符号（空格、>、< 除外）',
                tips3: '数字、字母、特殊符号必须同时存在'
            }
        }
    },
    management: {
        avatar: '上传公司logo',
        securitySet: '安全设置',
        userId: '用户ID',
        loginAccount: '登录账号',
        registerTime: '注册时间',
        noAuthentication: '未认证',
        nameAuthentication: '点击进行实名认证',
        loginPwd: '登录密码',
        loginPwdContent: '安全性能高的密码可以使账号更安全，建议定期更换密码，设置一个包含字母，符号或数字且至少长度超过8位数的密码。',
        bindPhone: '手机绑定',
        bindPhoneContentFront: '您已绑定了手机',
        bindPhoneContentAfter: '您的手机作为安全手机，可以用于登录、找回密码',
        emailTitle: '邮箱',
        emailTitleContent: '邮箱绑定后可用来接收平台发送的各类系统、营销、服务通知。',
        bind: '绑定',
        alreadyBind: '已绑定',
        nobind: '未绑定',
        setting: '已设置',
        amend: '修改',
        avatarUpload: '公司logo上传',
        uploadTips: '从电脑里挑一张好图作为头像吧',
        uploadRule: '图片支持JPG/JPEG/PNG格式，大小不超过2MiB',
        upload: '上传',
        uploadFail: '上传失败',
        uploadRuleTip: '请按规则上传图片',
        uploadFile: '请选择一个文件'
    },
    basicInfo: {
        basicInfo: '基本资料',
        companyName: '公司名称',
        basicMessage: '基本信息',
        businessLife: '营业年限',
        companyScale: '企业规模',
        companyNature: '企业性质',
        businessInfo: '业务信息',
        businessScope: '营业范围',
        mainBusiness: '主营业务',
        website: '网址',
        contactInfo: '联系信息',
        localArea: '所在地区',
        address: '地址',
        contactPhone: '联系电话',
        fax: '传真',
        lengthTip: '最多只能输入100个字符',
        phoneTip: '例如：0731-88888888',
        websiteTip: '例如：www.xxx.com',
        productName: '产品名',
        pleaseSel: '请选择',
        provinceSel: '选择省',
        citySel: '选择市',
        areaSel: '选择区',
        comAgeData: {
            one: '6个月以内',
            two: '1年以内',
            three: '1~2年',
            four: '3~5年',
            five: '6~10年',
            six: '10年以上'
        },
        comScaleData: {
            one: '100人以下',
            two: '100~500人',
            three: '500~1000人',
            four: '1000人以上',
            five: '5000人以上'
        },
        comNatureData: {
            one: '外资',
            two: '合资',
            three: '国营',
            four: '民营'
        },
        mainBusinnessData: {
            one: '互联网IT',
            two: '金融',
            three: '房地产/建筑',
            four: '贸易/零售/物流',
            five: '教育/传媒/广告',
            six: '服务业',
            seven: '市场/销售',
            eight: '人事/财务/行政'
        }
    },
    bindMobile: {
        identityVerify: '验证身份',
        amendPhone: '修改手机',
        finish: '完成',
        currentPhone: '您当前绑定的手机号码',
        bindFinish: '手机号码更换绑定完成',
        toSecurityTip: '后回到安全设置页面'
    },
    useremail: {
        change: '修改安全邮箱',
        changeSuccess: '邮箱更换绑定已完成',
        errormsg: '邮箱验证失败',
        steps: [
            {
                title: '验证身份',
                tips: '为确认是您本人操作，请完成手机验证码验证'
            },
            {
                title: '修改安全邮箱',
                tips: '验证邮件将发送至您的邮箱，请确保邮箱能正常接收邮件'
            },
            {
                title: '修改安全邮箱',
                step: '完成',
                tips: '验证邮件已发送至您的邮箱，24小时有效'
            }
        ],
        bind: {
            title: '绑定邮箱',
            tips: '验证邮件将发送至您的邮箱，请确保邮箱能正常接收邮件',
            sendSuccess: '验证邮件已发送至您的邮箱，24小时有效',
            bindBtn: '立即绑定',
            success: '绑定成功',
            bindSuccess: '恭喜您绑定邮箱成功'
        },
        unbind: {
            title: '您的账号未绑定电子邮箱，请绑定一个电子邮箱，以方便您完成以下操作',
            content: `<p>1.接收云服务开通、到期、故障及关停等操作通知</p>
            <p>2.接收资源告警、云安全产品相关通知</p>`,
            next: '下次再说'
        }
    }
};
