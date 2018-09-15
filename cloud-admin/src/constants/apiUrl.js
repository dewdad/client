// 注册模块 User服务api文档,服务上下文为people-services-user
// const USER_CONTROLLER = 'people-services-user-tanjin';
const USER_CONTROLLER = '/identity';
const USER_RSA = '/identity';
const PLATFORM = '/identity/platform';
const MENU = '/menu';
const OP_LOG = '/mq';
const SYS = '/resources';//平台
const ORDER = '/resources/order';//工单


// 登录模块
export const API_LOGIN = {
    login: USER_CONTROLLER + '/auth/token',
    logOut: USER_CONTROLLER + '/auth/logout',
    changePwd: USER_CONTROLLER + '/user/chgpwd',

};
// 系统配置
export const SYSCONFIG = {
    getConfigList: SYS + '/systemConfig/list',
    addConfig: SYS + '/systemConfig/add',
    editConfig: SYS + '/systemConfig/update',
    delConfig: SYS + '/systemConfig/delete/',
    reloadCache: SYS + '/systemConfig/admin/refresh'
};
// 概览
export const OVERVIEW = {
    deptlist: USER_RSA + '/adminOverview/view',
    menulist: USER_RSA + '/menu/getMenuListByRoleId',
    getdomainlist: USER_RSA + '/dept/list',
    getAdminOverview: USER_RSA + '/adminOverview/view',
    selectUsageByDate: '/compute/ecsRecord/selectUsageByDate',
    selectUsageByMoth: '/compute/ecsRecord/selectUsageByMoth',
    getTenantIntro: USER_RSA + '/project/getUserUsagesAndQuotaByDept'
};
// 日志
export const OPLOG = {
    getLoglist: OP_LOG + '/opLogQry/list'
};
// 部门管理
export const DEPT = {
    deptTree: USER_RSA + '/dept/departmentTree',//部门树
    delDept: USER_RSA + '/dept/',//删除部门
    searchUser: USER_RSA + '/dept/get/',//根据id查找用户
    createDept: USER_RSA + '/dept/',//创建部门
    createQuota: USER_RSA + '/dept/quota',//创建部门配额
    changeDeptQuota: USER_RSA + '/dept/quota',//创建部门配额
    searchDeptDetail: USER_RSA + '/dept/get/',//查看部门详情
    editDept: USER_RSA + '/dept/',//编辑部门
    searchQuota: USER_RSA + '/dept/getQuotaAndUsage/',//查看配额和使用量
    projectList: USER_RSA + '/project/list',//租户列表
    selectAllUsers: USER_RSA + '/user/list',//根据租户ID查询用户集合
    createRenter: USER_RSA + '/project/',//创建租户
    delRenter: USER_RSA + '/project',//删除租户
    createUser: USER_RSA + '/user/',//创建用户
    findeRole: USER_RSA + '/user/list',//获取用户列表
    delUser: USER_RSA + '/user/',//删除用户
    viewUsage: USER_RSA + '/project/getUserUsagesAndQuota',//查看使用量
    searchRentQuota: USER_RSA + '/project/quota/',//租户配额查询
    changeQuota: USER_RSA + '/project/quota',//修改配额
    searchByProjectId: USER_RSA + '/project/getUserByProject',//通过租户id查找用户
    editRente: USER_RSA + '/project/',//修改租户
    editUser: USER_RSA + '/user/',//修改用户
    resetPwd: USER_RSA + '/user/',//修改密码
    relateUser: USER_RSA + '/project/',//关联用户
    delRelateUser: USER_RSA + '/project/',//取消关联用户
    relateProject: USER_RSA + '/user/',//关联租户
    delRelateProject: USER_RSA + '/user/',//取消关联租户
    listProjectByDomain: USER_RSA + '/project/listProjectByDomain',//根据部门id查询租户
    searchProjectByuserId: USER_RSA + '/project/getProjectByUserId',//通过用户id查找租户集合
};
// 角色管理
export const RoleMgr = {
    rolelist: USER_RSA + '/role/list',//获取角色列表
    getMgrUser: USER_RSA + '/user/getUserListByRId',//关联用户
    createRole: USER_RSA + '/role/',//创建角色
    editRole: USER_RSA + '/role/',//编辑角色
    delRole: USER_RSA + '/role/',//删除角色
    getAllrelateList: MENU + '/getMenuListByType',//关联用户
    getMenuTreeByRoleId: USER_RSA + '/menu/getMenuTreeByRoleId',//获取权限列表
    subAuth: USER_RSA + '/role/updatePermissionByRoleId',//关联权限
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
    getExpandList: USER_RSA + '/platform/extend/',//查询平台列表扩展信息
    delExpand: USER_RSA + '/platform/extend/',//删除平台列表扩展信息
    createExpand: USER_RSA + '/platform/extend',//创建平台列表扩展信息
    editExpand: USER_RSA + '/platform/extend/',//修改平台列表扩展信息
};
//获取公钥加密
export const API_USR_AUTH = {
    RSA:USER_RSA + '/rsa', //GET 获取公钥加密
};
// 用户账号模块
export const API_UserAccount = {
    checkMobileExist: '/user/checkMobileExist',
    checkEmailExist: USER_CONTROLLER + '/user/checkEmailExist',
    validatePassword: USER_CONTROLLER + '/user/validatePassword',
    checkImageCode: '/user/checkImageCode/{code}',
    checkMobileCode: '/user/checkImageCode',
    pwdForget: USER_CONTROLLER + '/user/resetPassword',
    bindMail: USER_CONTROLLER + '/user/sendEmailValidate',
    // bindMail: USER_CONTROLLER + '/user/bindMail', // 改成发送验证码
    pwdReset: USER_CONTROLLER + '/user/changePassword',
    activeMail: USER_CONTROLLER + '/user/activeMail',
    validateEmailCode: USER_CONTROLLER + '/user/validateEmailCode',
    uploadFile: USER_CONTROLLER + '/file/upload',
    getUploadFile: USER_CONTROLLER + '/file',
    // userAuthApply: USER_CONTROLLER + '/userAuth/apply ',
    // userAuthResult: USER_CONTROLLER + '/userAuth/{user_id}',
    // userAuthMoneyConfirm: USER_CONTROLLER + '/userAuth/confirm ',
    getUserInfo: USER_CONTROLLER + '/user/{user_id}/info',
    getUserInfoDetail: USER_CONTROLLER + '/user/{user_id}/info',
    getUserDetail: USER_CONTROLLER + '/user/{user_id}',
    saveUserInfo: USER_CONTROLLER + '/user/info',
    updateUserInfo: USER_CONTROLLER + '/user/info/{id}',
    bindMobile: USER_CONTROLLER + '/user/bindPhone'
};
export const API_MENU_MGR = {
    addMenu: USER_RSA + '/menu/add', //post 新增菜单 menu
    updateMenu: USER_RSA + '/menu/update', //put 更新菜单menu
    listMenu: USER_RSA + '/menu/list', //get 查询菜单列表
    opList: USER_RSA + '/menu/opList', //get 查询菜单列表
    addMenuOp: USER_RSA + '/menu/addOp', //post 新增菜单操作
    updateMenuOp: USER_RSA + '/menu/updateOp', //put 更新菜单操作
    deleteMenuOp: USER_RSA + '/menu/{opId}', //DELETE 删除菜单操作
};
// 工单模块
export const ORDER_MODULE = {
    myorderList: ORDER + '/getOrderList',//分页查询我的工单
    createOrder: ORDER + '/create',//创建工单
    delOrder: ORDER + '/delete',

};


