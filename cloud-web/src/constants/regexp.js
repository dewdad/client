/*
 * @Author: wenfang 
 * @Date: 2018-06-27 10:48:38 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-09-05 13:24:00
 * 常量正则表达式配置文件
 */

/**
 * 手机号码正则
 */
export const MOBILE_REGEXP = new RegExp(/^1(3|4|5|7|8)\d{9}$/);
/**
 * 注册密码正则
 */
export const REG_PASSWORD_REGEXP = new RegExp(/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])/);
/**
 * 邮箱地址正则
 */
export const EMAIL_REGEXP = new RegExp(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/);

/**
 * 名称正则 小写字母、数字、中划线
 */
export const NAME_REGEXP = new RegExp(/^[0-9a-z-]+$/);
/**
 * 域名正则
 */
export const DOMAIN_REGEXP = new RegExp(/^(https?:\/\/)?([\da-z.-]+)\.([a-zA-Z0-9.]{1,6})([\w .-]*)*\/?$/);

/**
 * 名称必须以字母开头，不区分大小写，可以包含字母、数字、中划线或下划线，不能包含其他特殊字符。
 */
export const RDS_BACKUP_NAME_REGEXP = new RegExp(/^[a-zA-Z]{1}[a-zA-Z0-9_-]*$/);
/**
 * 账号名 只能包含中英文，数字，下划线
 */
export const USERNAME_REGEXP = new RegExp(/^[[\u4e00-\u9fa5a-zA-Z0-9-_]+$/);

/**
 * 不能为纯数字
 */
export const ALL_NUMBER = /^.*[^\d].*$/;
/**
 * 只能由中文字符、英文字母、数字、下划线、中划线组成
 */
export const INST_NAME = new RegExp(/^[[\u4e00-\u9fa5a-zA-Z0-9-_]+$/);

/**
 * 只能包含数字，字母，特殊符号（空格，>，<除外）
 */

export const PASSWORD_REGEXP = new RegExp(/^[0-9a-zA-Z~`'"!@#￥$%^&*()-+_=:;,.|?/\\]+$/);

/**
 * 创建实例登录密码 数字，字母，特殊符号必须同时存在
 */
export const INST_PASSWORD = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\u4e00-\u9fa5a-zA-Z\d])[\s\S]*$/;

/**
 * IPV4
 */
export const IP_REGEXP = new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/);

/**
 * 远程登录密码 只能由数字、大小写字母组成
 */
export const REMOTE_LOGIN_PWD = new RegExp(/^[a-zA-Z0-9]*$/);

/**
 * 以中英文开始
 */
export const ZY_START = new RegExp(/^[\u4e00-\u9fa5_a-zA-Z]+.*$/);
/**
 * 自定义端口如20,68
 */

export const CUSTOM_PORT = new RegExp(/^\d+(,{1}\d+)*$/);

/**
 * ipaddr 匹配格式10.0.0/32,10.0.0.1/32
 */
export const IPAddr_REGEXP = new RegExp(
    /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d{1,2})?(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d{1,2})*$/
);
