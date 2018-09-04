import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'hash', // 默认值: "hash" (浏览器环境) 可选值: "hash" | "history" | "abstract"
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0};
        }
    },
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/Login')
        },
        {
            path: '/app',
            name: 'app',
            component: () => import('@/views/layout/Layout'),
            meta: {
                title: '首页'
            },
            children: [
                {
                    path: 'dashboard',
                    name: 'app.dashboard',
                    meta: {
                        title: '概览'
                    },
                    component: () => import('@/views/dashboard/Dashboard')
                },
                {
                    path: 'usrmgr',
                    name: 'app.usrmgr',
                    meta: {
                        title: '系统管理'
                    },
                    component: {
                        render(c) {
                            return c('router-view');
                        }
                    },
                    children: [
                        {
                            path: 'rolemgr',
                            name: 'app.usrmgr.rolemgr',
                            meta: {
                                title: '角色管理'
                            },
                            component: () => import('@/views/usermgr/rolemgr')
                        },
                        {
                            path: 'rolemgrUser/:roleId',
                            name: 'app.usrmgr.rolemgrUser',
                            meta: {
                                title: '关联用户'
                            },
                            component: () => import('@/views/usermgr/rolemgrUser')
                        },
                        {
                            path: 'account',
                            name: 'app.usrmgr.account',
                            meta: {
                                title: '管理员管理'
                            },
                            component: () => import('@/views/usermgr/Account')
                        },
                        {
                            path: 'userGroup',
                            name: 'app.usrmgr.userGroup',
                            meta: {
                                title: '用户组管理管理'
                            },
                            component: () => import('@/views/usermgr/UserGroup')
                        },
                        {
                            path: 'realAuth',
                            name: 'app.usrmgr.realAuth',
                            meta: {
                                title: '实名认证管理'
                            },
                            component: () => import('@/views/usermgr/RealAuth')
                        },
                        {
                            path: 'menu',
                            name: 'app.usrmgr.menumgr',
                            meta: {
                                title: '菜单管理'
                            },
                            component: () => import('@/views/usermgr/Menu')
                        },
                        {
                            path: 'edit/:opType/:code',
                            name: 'app.usrmgr.menumgr.edit',
                            meta: {
                                title: '菜单编辑'
                            },
                            component: () => import('@/views/usermgr/menumgr/editMenu')
                        },
                        {
                            path: 'platform',
                            name: 'app.platform.resource',
                            meta: {
                                title: '平台管理'
                            },
                            component: () => import('@/views/usermgr/platform/resource')
                        } ,
                        {
                            path: 'platAuth/:id',
                            name: 'app.platform.platAuth',
                            meta: {
                                title: '平台权限'
                            },
                            component: () => import('@/views/usermgr/platform/platauth')
                        },
                        {
                            path: 'role',
                            name: 'app.platform.role',
                            meta: {
                                title: '平台角色'
                            },
                            component: () => import('@/views/usermgr/platform/roletype')
                        } ,
                        {
                            path: 'bindPlatAuth/:val',
                            name: 'app.platform.bindPlatAuth',
                            meta: {
                                title: '绑定平台权限'
                            },
                            component: () => import('@/views/usermgr/platform/bindplatauth')
                        },
                        {
                            path: 'oplog',
                            name: 'app.usrmgr.oplog',
                            meta: {
                                title: '操作日志'
                            },
                            component: () => import('@/views/usermgr/oplog/oplog')
                        },
                        {
                            path: 'sysconfig',
                            name: 'app.usrmgr.sysconfig',
                            meta: {
                                title: '系统配置'
                            },
                            component: () => import('@/views/usermgr/sysconfig/sysconfig'),
                        },
                        {
                            path: 'editConfig/:opType',
                            name: 'app.usrmgr.editConfig',
                            meta: {
                                title: '修改配置'
                            },
                            component: () => import('@/views/usermgr/sysconfig/editConfig')
                        },
                    ]
                }
            ]
        }
    ]
});
