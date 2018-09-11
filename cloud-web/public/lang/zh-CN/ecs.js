export default {
    overview: {
        headTitle1: '综述',
        headTitle2: '监控信息',
        total: '总数量',
        nearExpired: '即将过期',
        baselineCheck: '基线检查',
        loophole: '漏洞',
        snapCapacity: '快照总容量',

        cpuUsageRate: 'CPU平均使用率',
        cpuUsageRateRank: 'CPU使用率排名',
        memUsageRate: '内存平均使用率',
        memUsageRateRank: '内存使用率排名',
        allUsageRate: '所有实例的综合平均使用率',
        allUsageRateCpuDesc: '所有实例的CPU平均使用率总和/实例个数',
        allUsageRateMemDesc: '所有实例的内存平均使用率总和/实例个数',
        placeholderName: '输入要搜索的名称、IP',

        baseData: '基础数据',
        storageSize: '存储容量',
        monthFlow: '本月流量',
        monthRequest: '本月请求次数',
        fileNums: '文件数量',

        cpuMonitor: 'CPU监控',
        memMonitor: '内存监控',
        latelyOneHour: '最近2小时',
        latelyfullHour: '最近24小时',
        latelysevenDay: '最近7天',
        goConfigure: '去升配>',

        specialService: {
            name: '特色服务',
            viewLinkText: '查看',
            pictureProcessing: '图片处理',
            videoProcessing: '音视频处理',
            siteMove: '站点平滑迁移',
            highAvailability: '高可用同城双活',
            websiteTrusteeship: '静态网站托管',
            antiStealingLink: '防盗链',
            pictureProcessingDesc: '提供多种图片处理模式，至少包括图片的缩放、缩率、剪裁、旋转、渐进显示、格式转换、文字水印、图片水印、计算平均色调，并可以提供图片格式、大小、色彩、EXIF等模型信息',
            videoProcessingDesc: '支持音视频实时转码功能；提供多种音视频处理模式，至少包括音视频的多码率自适应转码、截取、切片、水印、拼接、抽帧、采样；并且支持音视频元信息提取等功能',
            siteMoveDesc:
                '利用媒体云提供的镜像存储功能，可以非常简单地将源站的数据被动地同步到媒体云存储中，所谓被动同步即——只有在资源被访问时，媒体云才会回源站获取一次，此后对该资源的访问都不会再发生回源动作，是直接从媒体云这里拿到数据。',
            highAvailabilityDesc:
                '支持系统跨机房部署，当发生不可预知的离线事故时，仍可对外提供服务。系统采用高可用架构设计，任何一个节点出现故障，不影响数据的正常访问，整集群无单点故障。免人工干预的磁盘、主机自动故障检测和告警，在线更换磁盘，主机自动进行数据修复工作。',
            websiteTrusteeshipDesc: '媒体云对象存储无缝集合各类第三方扩展插件，如 WordPress、Discuz、Emlog 等，并支持一键将各类插件里的静态资源托管到媒体云对象存储。',
            antiStealingLinkDesc: '下载有一种常见的场景，即公开资源的防盗链，例如禁止特定来源域名的访问，禁止非浏览器发起的访问等。可以通过 HTTP 协议支持的 Referer 机制，来进行相应的来源识别和管理。'
        },
        keypairs: {},
        noHost: {
            descTitle: '媒体云 · 弹性云主机重磅来袭',
            descTip: '您当前未创建实例',
            createNow: '立即创建',
            advantageTitle: '媒体云弹性云主机优势',
            rubberSheet: '弹性伸缩',
            rubberSheetDesc: '提供多种实例配置规格，实例随时升降配，高效匹配业务要求',
            dilatation: '灵活扩容',
            dilatationDesc: '虚拟块存储弹性扩展，具有数据高可靠性，I/O高吞吐能力',
            networkSDN: '软件定义网络SDN',
            networkSDNDesc: '将网络设备控制面与数据面分离，实现网络流量的灵活控制',
            HA: '高可用性',
            HADesc: '提供三副本，宕机自动迁移，自动快照备份，保证业务连续性',
            omnibearing: '全方位监控',
            omnibearingDesc: '提供CPU、内存使用监控，磁盘IOPS监控，网络流量监控等',
            efficiency: '管理高效',
            efficiencyDesc: '可通过控制台实现生命周期管理操作秒级响应'
        }
    },

    inst: {
        list: {
            help: '使用帮助',
            title: '实例列表',
            createInst: '创建实例',
            instIdAndName: '实例ID/名称',
            netType: '网络类型',
            configInfo: '配置',
            payType: '付费方式',
            region: '所在区域',
            linkIP: '连接IP',
            publicNet: '公',
            innerNet: '私有',
            memory: '内存',
            bandWidth: '带宽',
            configChanged: '配置变更',
            freeTrial: '免费试用',
            manage: '管理',
            remoteLogin: '远程登录',
            modifyConfig: '升降配',
            clickToView: '点击查看',
            instCreatingTip: '创建实例需要1~6分钟，请耐心等待',

            dropdownBtns: {
                start: '启动',
                stop: '停止',
                restart: '重启',
                reinstallOperateSysem: '重装操作系统',
                changeSystemDisk: '更换系统盘',
                modifyInfo: '修改信息',
                editLable: '编辑标签',
                createCustomImage: '创建自定义镜像',
                securityGroupConfig: '安全组配置',
                bindPublicIP: '绑定公网IP',
                unbindPublicIP: '解绑公网IP',
                bindConnIp: '绑定连接IP',
                unbindConnIp: '解绑连接IP',
                delete: '删除',
                modifyRemoteLoginPassword: '修改远程登录密码',
                resetPassword: '重置密码',
                remoteConnGuide: '远程连接指导',
                submitTicket: '提交工单'
            },
            remoteLoginDlg: {
                alertTip: '警告！远程连接密码只出现一次，您以后每次远程连接登录时都需要输入该密码，请做好记录存档工作。'
            },
            remoteConnGuideDialog: {
                NoIpTitle: '没有绑定公网IP或者连接IP的云服务器',
                linuxTitle: 'Linux系统的云服务器',
                WindowsTitle: 'Windows系统的云服务器'
            },
            deleteDialog: {
                tip: '删除操作无法恢复，且系统盘将随云服务器一并删除,确定要对该云服务器进行删除操作吗？',
                releaseFloatIp: '释放浮动IP',
                releaseDataDisk: '删除服务器挂载数据盘'
            },
            helpDialog: {
                title: '实例搜索帮助',
                infoTitle: '自动识别',
                info: `<p>您可以简单的输入搜索内容然后按Enter键，搜索框将会自动识别内容的属性类型，然后进行搜索。通过左侧的箭头下拉菜单，您也可以手动选择搜索的类型。</p>
                
                <p>自动识别支持实例ID(e-开头)、私有IP、公网IP、镜像ID(img-开头)、安全组ID(sg-开头)、私有网络ID(net-开头)。默认的识别类型为实例名称。</p>`
            },
            vMachineIsReady: '虚拟机已经可用',
            newMediaBuildingBindconnectip: '新媒体大楼办公的用户可以使用该主机连接云主机'
        },

        details: {
            title: {
                basicInfo: '基本信息',
                monitorInfo: '监控信息',
                configInfo: '配置信息',
                payInfo: '付费信息'
            },
            oNet: '出网',
            iNet: '入网',
            cpuPercentUsed: 'CPU使用率',
            memoryPercentUsed: '内存使用率',
            outerNetwork: '网络流量',
            instType: '实例类型',
            instSpecification: '实例规格',
            bandwidth: '当前使用带宽'
        }
    },
    store: {
        disk: {},
        snap: {},
        snapStrategy: {}
    },
    image: {
        list: {
            title: '镜像列表',
            imageName: '镜像名称',
            importImage: '导入镜像',
            publicImage: '公共镜像',
            customImage: '自定义镜像',

            imageIdAndName: '镜像ID/名称',
            imageType: '镜像类型',
            platform: '平台',

            editDesc: '编辑描述',
            relatedInst: '相关实例'
        }
    },
    lableMgr: {},
    changeconfig: {
        riseFall: '升降配须知',
        riseFallList: {
            one: '1.实例规格升级：实例规格升降配提交成功后，需要重启实例，配置才能生效',
            two: '2.需要通过ECS控制台或者API重启实例，通过其他方式重启实例无效'
        },
        SpecTitle: '实例规格',
        ConfigureTitle: '当前配置',
        CostBtn: '确定升降配',
        currentSel: '当前选中实例',
        cost: '配置费用'
    },
    overviewTips: '总概览及存储空间概览基础数据都非实时数据，数据延迟2～3个小时。',
    skeymgrTips: 'Access Key ID和Access Key Secret是您访问人民日报媒体云API的密钥，具有该账户的完全的权限，请您妥善保管，且至少要保留一条有效的密钥。',
    create: {
        stepOne: '基础配置',
        stepTwo: '网络配置',
        stepThree: '确认规格',
        pre: '上一步：基础配置',
        next: '下一步：网络和安全组',
        preNet: '上一步：网络配置',
        maxApplyNumber: '本次最多可开通{max}台弹性云主机',
        selectConfig: '所选配置',
        serviceAgreement: '服务协议',
        basicConfig: '基础配置',
        netAndSafe: '网络和安全',
        priceColumn: '规格参考价格(元/月)',
        imageTips: `是由人民日报媒体云提供公共基础镜像，仅包括初始系统环境。请根据您的实际情况自助配置应用环境或相关软件配置。`,
        passwordtext: '密码',
        loginPassword: '登录密码',
        confirmPassword: '确认密码',
        username: '用户名',
        instname: {
            tips: '只能由中文字符、英文字母、数字、下划线、中划线组成，且长度小于等于64个字符'
        },
        instdesc: {
            tips: '描述为选填内容，长度小于300个字符'
        },
        password: {
            tips: '8-30个字符，且同时包含三项(大写字母，小写字母，数字或特殊字符)',
            placeholder: '请输入{user}用户密码'
        },
        password1: {
            tips: '请牢记您所设置的密码，如遗忘可登录弹性云主机控制台重置密码',
            placeholder: '请再次输入{user}用户密码'
        },
        safeGroup: {
            tips:
                '安全组是一个逻辑上的分组，这个分组是由具有相同安全保护需求并相互信任的实例组成。每个实例至少属于一个安全组，在创建的时候就需要指定。同一安全组内的实例之间网络互通，不同安全组的实例之间默认内网不通',
            descTxt: '安全组类似防火墙功能，用于设置网络访问控制，您也可以到管理控制台',
            labelTxt: '标签',
            customPort: '自定义端口',
            labelTips:
                '是用来描述弹性云主机的特征跟用途，常用标签有linux、web server、mysql server等，表示该服务器是linux类型的服务器，需要开通22端口来SSH远程连接；部署了web应用跟mysql数据库，需要开通对应的默认端口来提供服务',
            portTips: '标签无法满足用户需求时，使用自定义端口方式可以灵活配置端口。支持是否开通ICMP协议，选择常用TCP端口；如果常用端口不满足，还可以配置TCP、UDP协议自定义端口',
            windowAlert: '您已选择Windows镜像，但所选安全组未开放3389端口，无法远程登陆弹性云主机。您可以进入控制台设置。',
            linuxAlert: '您已选择{osType}镜像，当前安全组未开放22端口，无法远程登陆弹性云主机。您可以进入控制台设置。',
            selectLabel: '所选安全组',
            select: '选择安全组',
            defaultPort: '配置默认安全组端口',
            openPort: '开通的协议端口',
            commTcp: '常用TCP端口',
            customTcp: '自定义TCP端口',
            customUdp: '自定义UDP端口',
            rule: '所选安全组规则',
            moreinfo: '媒体云安全组对实例访问外部网络不做限制'
        },
        flavor: {
            descTxt: '<ul><li>实例规格族</li><li>场景配置选型</li></ul>'
        },
        storage: {
            descTxt: '<ul><li>云盘参数和性能</li><li>云盘三副本技术</li></ul>',
            sysDiskTxt: '如何选择 SSD云盘 / 高效云盘，请看',
            dataDiskDesc: '数据盘需要分区格式化后才能正常使用，如何',
            autoTips:
                '<span class="font14 is-bold">基于公共镜像创建弹性云主机实例</span><br> 系统盘设备名默认为/dev/xvda，数据盘的设备名由系统默认分配，从 /dev/xvdb 开始往后顺序排列，分布范围包括 /dev/xvdb - /dev/xvdz',
            labelTxt: '自动分配设备名'
        }
    }
};
