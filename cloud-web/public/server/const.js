var SERVER_HOST = '10.11.1.173', //主服务器IP地址  //110.11.1.173
    SERVER_HOST_PORT = '9000', //主服务器端口号
    //PLUPLOAD文件上传下载服务器地址以及端口号
    SERVER_PLUPLOAD = 'http://10.11.1.173:8080',
    // 接口路径
    // API_URL = 'https://www.tianwencloud.cn', // http://192.168.1.73:9000
    // API_URL = 'http://10.3.123.249:9000', // http://192.168.1.73:9000
    HOST_WEBSOCKET = 'ws://10.11.3.220:8000/people-web/websocket', //云主机websocket服务
    ZT_CACHE_BUSTER = '?v=1516018315594',
    ZT_ECS_DATA_DISC_AMOUNT_MAX = 10, //ecs实例添加数据盘个数最大值
    ZT_ECS_APPLY_MAX = 10, //ECS实例创建申请最大E数量
    ZT_ECS_SYS_DISC_SIZE_MAX = 500, //ecs实例添加数据盘最大值容量G
    ZT_ECS_LABEL_MAX = 10, //ecs实例添加标签数最大值
    // 区域配置
    AREA_CITY = {
        regions: [
            {
                key: 'bj1',
                text: '北京可用区1',
                value: 'az1.dc1',
                classes: 'color-primary',
                type: 'primary',
                respool: [
                    {
                        key: 1,
                        text: '资源池A',
                        value: 'az1.dc1',
                        classes: 'areaselect',
                        region: 'az1.dc1'
                    }
                ]
            },
            {
                key: 'bj2',
                text: '北京可用区2',
                value: 'az1.dc2',
                classes: 'btn-white',
                disabled: true,
                respool: [
                    {
                        key: 1,
                        text: '暂不可用',
                        value: 'az1.dc1',
                        classes: 'color9',
                        region: 'az1.dc2'
                    }
                ]
            }
        ],
        regions_radio: [
            {
                key: 'bj1',
                text: '北京可用区1',
                value: 'az1.dc1',
                active: true,
                disabled: false,
                classes: 'btn citybtn mr6'
            },
            {
                key: 'bj2',
                text: '北京可用区2',
                value: 'az1.dc2',
                active: false,
                disabled: true,
                classes: 'btn disabled citybtn mr6'
            }
        ]
    };
