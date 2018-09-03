/*
 * @Author: sunersheng 
 * @Date: 2018-08-03 10:45:15 
 * @Last Modified by: sunersheng
 * @Last Modified time: 2018-08-24 10:53:59
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
    WEB_SITE_URL:'www.peopledailycloud.com:8002', //媒体云公网地址
    REMOTE_LOGIN_URL_ALIAS:'www.meitiyun.com/vnc', //远程登录显示url地址

};

export default ZT_CONFIG;
