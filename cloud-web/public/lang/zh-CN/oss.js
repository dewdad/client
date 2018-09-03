export default {
    "overviewTips": "总概览及存储空间概览基础数据都非实时数据，数据延迟2～3个小时。",
    "skeymgrTips": "Access Key ID和Access Key Secret是您访问人民日报媒体云API的密钥，具有该账户的完全的权限，请您妥善保管，且至少要保留一条有效的密钥。",
    "createOss": "创建存储空间",
    "searchTips": "搜索Bucket",
    "ossName": "存储空间",
    "sortText": {
        "default": "默认排序",
        "name": "按名称排序",
        "time": "按时间排序"
    },
    "overview": {
        "baseData": "基础数据",
        "storageSize": "存储容量",
        "monthFlow": "本月流量",
        "monthRequest": "本月请求次数",
        "fileNums": "文件数量",
        "specialService": {
            "name": "特色服务",
            "viewLinkText": "查看",
            "pictureProcessing": "图片处理",
            "videoProcessing": "音视频处理",
            "siteMove": "站点平滑迁移",
            "highAvailability": "高可用同城双活",
            "websiteTrusteeship": "静态网站托管",
            "antiStealingLink": "防盗链",
            "pictureProcessingDesc": "提供多种图片处理模式，至少包括图片的缩放、缩率、剪裁、旋转、渐进显示、格式转换、文字水印、图片水印、计算平均色调，并可以提供图片格式、大小、色彩、EXIF等模型信息",
            "videoProcessingDesc": "支持音视频实时转码功能；提供多种音视频处理模式，至少包括音视频的多码率自适应转码、截取、切片、水印、拼接、抽帧、采样；并且支持音视频元信息提取等功能",
            "siteMoveDesc": "利用媒体云提供的镜像存储功能，可以非常简单地将源站的数据被动地同步到媒体云存储中，所谓被动同步即——只有在资源被访问时，媒体云才会回源站获取一次，此后对该资源的访问都不会再发生回源动作，是直接从媒体云这里拿到数据。",
            "highAvailabilityDesc": "支持系统跨机房部署，当发生不可预知的离线事故时，仍可对外提供服务。系统采用高可用架构设计，任何一个节点出现故障，不影响数据的正常访问，整集群无单点故障。免人工干预的磁盘、主机自动故障检测和告警，在线更换磁盘，主机自动进行数据修复工作。",
            "websiteTrusteeshipDesc": "媒体云对象存储无缝集合各类第三方扩展插件，如 WordPress、Discuz、Emlog 等，并支持一键将各类插件里的静态资源托管到媒体云对象存储。",
            "antiStealingLinkDesc": "下载有一种常见的场景，即公开资源的防盗链，例如禁止特定来源域名的访问，禁止非浏览器发起的访问等。可以通过 HTTP 协议支持的 Referer 机制，来进行相应的来源识别和管理。"
        },
        "accessDomain": "访问域名",
        "networkAccessTips": "通过互联网访问OSS的地址",
        "accessDomainTips": "1.访问域名带上文件路径，即可通过互联网访问到Bucket 内的任意文件。如果 ACL 是私有读，则还需要带上签名，URL 拼写规则：1233332.oss-cn-beijing.mediayuncs.com/object<br>2.您若使用【域名绑定】功能，则需要将用户域名（CNAME 域名解析）指向到 1233332.oss-cn-beijing.mediayuncs.com 上",
        "baseSetting": "基础设置"
    }
};