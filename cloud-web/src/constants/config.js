/*
 * @Author: sunersheng 
 * @Date: 2018-08-03 10:45:15 
 * @Last Modified by: sunersheng
 * @Last Modified time: 2018-08-31 15:28:49
 * 返回码
 */

const ZT_CONFIG = {
    /**
     * 实名认证相关的配置
     */
    INPUT_MAXLENGTH: 100, //一些输入框允许最大输入长度（比如：名称）
    MOBLIE_NUMBER_MAX: 11, //手机号码最大位数
    IMAGE_ACCEPT: 'jpg,jpeg,png', //支持的文件格式
    IMAGE_SIZE_MAX: 10, //最大限制大小，单位默认M
    IMAGE_TOTAL_LIMIT: 9, //上传材料证明（限9张）
    BUSINESS_LICENSE_NO_LENGTH: 18, //统一社会信用代码位数：18位
    COMPANY_ACCOUNT_LENGTH: 30, //公司对公账户位数
    CONFIRM_MONNEY_FAILED_MAX: 3, //确认金额失败次数限制 
    CONFIRM_MONNEY_MIN: 0.01, //实名认证确认金额最小值

    /** 远程登录 */
    REMOTE_LOGIN_VNCPWD:'9999', //远程登录前端生成随机密码后设置字段vncPassword值
    WEB_SITE_URL:'www.peopledailycloud.com', //媒体云公网地址
    REMOTE_LOGIN_URL_ALIAS:'www.meitiyun.com', //远程登录显示url地址

    /**绑定解绑连接IP、绑定解绑公网IP 判断floatip是连接ip还是公网ip的前缀*/
    FLOAT_IP_IS_PUBLIC_IP: '43.',
    FLOAT_IP_IS_CONNECT_IP: '10.3',

};

export default ZT_CONFIG;
