import user from './zh-CN/user';
import layout from './zh-CN/layout';
import oss from './zh-CN/oss';
import ecs from './zh-CN/ecs';
import security from './zh-CN/security';
import exception from './zh-CN/exception';
import common from './zh-CN/common';
import abbr from './zh-CN/abbr';
import rds from './zh-CN/rds';
import form from './zh-CN/form';
import tips from './zh-CN/tips';
export default {
    // header footer
    ...layout,
    //...user,
    // 异常
    exception,
    // 公共模块
    common,
    //术语、缩略词
    abbr,
    // ecs
    ecs,
    // rds
    rds,
    // rss
    oss: oss,
    // 登录 注册 用户模块
    ...user,
    // 云安全
    security,
    // form 表单
    form,
    // 提示文字
    tips
};
