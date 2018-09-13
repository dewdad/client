/*
 * @Author: sunersheng 
 * @Date: 2018-08-03 10:45:15 
 * @Last Modified by: sunersheng
 * @Last Modified time: 2018-09-13 16:31:42
 * 返回码
 */

const ZT_CONFIG = {
    /**
     * 实名认证相关的配置
     */
    INPUT_MAXLENGTH: 100, //一些输入框允许最大输入长度（比如：名称）
    MOBLIE_NUMBER_MAX: 11, //手机号码最大位数
    IMAGE_ACCEPT: 'jpg,jpeg,png', //支持的文件格式
    IMAGE_SIZE_MAX: 8, //最大限制大小，单位默认M
    IMAGE_TOTAL_LIMIT: 9, //上传材料证明（限9张）
    BUSINESS_LICENSE_NO_LENGTH: 18, //统一社会信用代码位数：18位
    COMPANY_ACCOUNT_LENGTH: 30, //公司对公账户位数
    CONFIRM_MONNEY_FAILED_MAX: 3, //确认金额失败次数限制
    CONFIRM_MONNEY_MIN: 0.01, //实名认证确认金额最小值

    /** 远程登录 */
    REMOTE_LOGIN_VNCPWD: '9999', //远程登录前端生成随机密码后设置字段vncPassword值
    WEB_SITE_URL: 'www.peopledailycloud.com', //证通云公网地址
    REMOTE_LOGIN_URL_ALIAS: 'http://175.6.40.20:40068', //远程登录显示url地址

    /**绑定解绑连接IP、绑定解绑公网IP 判断floatip是连接ip还是公网ip的前缀*/
    FLOAT_IP_IS_PUBLIC_IP: '43.',
    FLOAT_IP_IS_CONNECT_IP: '10.3',

    //工单管理 ticketSystem
    TS_IMAGE_ACCEPT: 'jpg,jpeg,png,bmp,gif,txt,rar,zip,doc,xls,docx,xlsx,pdf,ini,conf,eml',
    TS_IMAGE_SIZE_MAX: 8, //最大限制大小，单位默认M
    TS_IMAGE_TOTAL_LIMIT: 3, //附件数限制
    TS_TICKET_AUTO_CLOSED_DAY: 30, //30天后工单自动关闭
};

export default ZT_CONFIG;
