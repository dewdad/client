// 注册模块 User服务api文档,服务上下文为people-services-user
// const USER_CONTROLLER = 'people-services-user-tanjin';
const USER_CONTROLLER = '/identity';
const USER_RSA = '/identity';
const PLATFORM = '/identity/platform';
const MENU = '/menu';
const OP_LOG = '/mq';
const SYS = '/resources';


// 登录模块
export const API_LOGIN = {
    login: USER_CONTROLLER + '/auth/token',
    logOut: USER_CONTROLLER + '/auth/logout'

};
// 系统配置
export const SYSCONFIG = {
    getConfigList: SYS + '/systemConfig/list',
    addConfig: SYS + '/systemConfig/add',
    editConfig: SYS + '/systemConfig/update',

};
// 概览
export const OVERVIEW = {
    deptlist: USER_RSA + '/adminOverview/view',
    menulist: USER_RSA + '/menu/getMenuListByRoleId'
};
// 概览
export const OPLOG = {
    getLoglist: OP_LOG + '/opLogQry/list'
};
// 角色管理
export const RoleMgr = {
    rolelist: USER_RSA + '/role/list',
    getMgrUser: USER_RSA + '/user/getUserListByRId',
    createRole: USER_RSA + '/role/',
    editRole: USER_RSA + '/role/',
    delRole: USER_RSA + '/role/',
    getAllrelateList: MENU + '/getMenuListByType',
};
//平台管理
export const PlatForm = {
    platformList: PLATFORM + '/',//查询平台列表
    addPlatForm: PLATFORM + '/',//添加平台
    addPlatAuth: PLATFORM + '/role',//添加平台权限
    searchPlatAuth: PLATFORM + '/role/',//查询平台列表权限
    delPlatAuth: PLATFORM + '/role/',//删除平台权限
    editPlatAuth: PLATFORM + '/role/',//修改平台权限
    delPlatForm: PLATFORM + '/',//删除平台
    editPlatForm: PLATFORM + '/',//修改平台

    roleTypeList: USER_RSA + '/roleType',//查询角色类型列表
    getPlatformList: USER_RSA + '/roleType/getPlatformList',//查询平台角色权限列表
    searchBindAuth: USER_RSA + '/roleType/bindPlatformRole',//查询用户角色类型绑定的平台权限
    bindAuth: USER_RSA + '/roleType/bindPlatformRole',//用户角色类型绑定平台权限
};
//获取公钥加密
export const API_USR_AUTH = {
    RSA:USER_RSA + '/rsa', //GET 获取公钥加密
};


export const API_MENU_MGR = {
    addMenu: USER_RSA + '/menu/add', //post 新增菜单 menu
    updateMenu: USER_RSA + '/menu/update', //put 更新菜单menu
    listMenu: USER_RSA + '/menu/list', //get 查询菜单列表
};


