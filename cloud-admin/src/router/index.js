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
            path: '/',
            redirect: '/app/overview'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/Login')
        },
        {
            path: '/app',
            name: 'app',
            redirect: '/app/overview',
            component: () => import('@/views/layout/Layout'),
            meta: {
                title: '首页'
            },
            children: [
                {
                    path: 'overview',
                    name: 'app.overview',
                    meta: {
                        title: '概览'
                    },                    
                    component: () => import('@/views/dashboard/Index') //部门管理员
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
                            component: () => import('@/views/usermgr/rolemgr/rolemgr')
                        },
                        {
                            path: 'rolemgrUser/:roleId',
                            name: 'app.usrmgr.rolemgrUser',
                            meta: {
                                title: '关联用户',
                                parentName:'app.usrmgr.rolemgr'
                            },
                            component: () => import('@/views/usermgr/rolemgr/rolemgrUser')
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
                                title: '菜单编辑',
                                parentName:'app.usrmgr.menumgr'
                            },
                            component: () => import('@/views/usermgr/menumgr/editMenu')
                        },
                        {
                            path: 'handler/:code',
                            name: 'app.usrmgr.menumgr.handler',
                            meta: {
                                title: '关联操作',
                                parentName:'app.usrmgr.menumgr'
                            },
                            component: () => import('@/views/usermgr/menumgr/menuHandle')
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
                            path: 'platformExpand/:id',
                            name: 'app.platform.platformExpand',
                            meta: {
                                title: '平台扩展'
                            },
                            component: () => import('@/views/usermgr/platform/platformExpand')
                        } ,
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
                                title: '修改和添加配置',
                                parentName:'app.usrmgr.sysconfig'
                            },
                            component: () => import('@/views/usermgr/sysconfig/editConfig')
                        },{
                            path: 'deptmgr',
                            name: 'app.usrmgr.deptmgr',
                            meta: {
                                title: '部门管理'
                            },
                            component: () => import('@/views/usermgr/deptmgr/dept')
                        },{
                            path: 'createRente/:optType',
                            name: 'app.usrmgr.createRente',
                            meta: {
                                title: '创建租户'
                            },
                            component: () => import('@/views/usermgr/deptmgr/createRente')
                        },{
                            path: 'createUser/:optType',
                            name: 'app.usrmgr.createUser',
                            meta: {
                                title: '创建用户'
                            },
                            component: () => import('@/views/usermgr/deptmgr/createUser')
                        },{
                            path: 'myorder',
                            name: 'app.workorder.myorder',
                            meta: {
                                title: '我的工单'
                            },
                            component: () => import('@/views/workorder/myorder/myorder')
                        },{
                            path: 'pendingOrder',
                            name: 'app.workorder.PendingOrder',
                            meta: {
                                title: '待处理工单'
                            },
                            component: () => import('@/views/workorder/myorder/PendingOrder')
                        },{
                            path: 'processedOrder',
                            name: 'app.workorder.ProcessedOrder',
                            meta: {
                                title: '已处理工单'
                            },
                            component: () => import('@/views/workorder/myorder/ProcessedOrder')
                        },{
                            path: 'hosts',
                            name: 'app.resources.instance',
                            meta: {
                                title: '云主机'
                            },
                            component: () => import('@/views/cloudres/instance')
                        },{
                            path: 'network',
                            name: 'app.resources.network',
                            meta: {
                                title: '网络管理'
                            },
                            component: () => import('@/views/cloudres/network/networkmgr')
                        },{
                            path: 'protmgr/:id',
                            name: 'app.resources.network.protmgr',
                            meta: {
                                title: '端口管理'
                            },
                            component: () => import('@/views/cloudres/network/protmgr')
                        },{
                            path: 'resmodel',
                            name: 'app.resources.resmodel',
                            meta: {
                                title: '资源模板'
                            },
                            component: () => import('@/views/cloudres/resmodel/resmodel')
                        },{
                            path: 'instanceDetail/:id',
                            name: 'app.resources.instance.instanceDetail',
                            meta: {
                                title: '云主机详情'
                            },
                            component: () => import('@/views/cloudres/instanceDetail')
                        },{
                            path: 'image',
                            name: 'app.cloudres.image',
                            meta: {
                                title: '镜像'
                            },
                            component: () => import('@/views/cloudres/mirror/mirror')
                        },{
                            path: 'cloud',
                            name: 'app.resource.volume.cloud',
                            meta: {
                                title: '云盘'
                            },
                            component: () => import('@/views/cloudres/volume/cloud')
                        },{
                            path: 'backup',
                            name: 'app.resource.volume.backup',
                            meta: {
                                title: '备份'
                            },
                            component: () => import('@/views/cloudres/volume/backup')
                        },{
                            path: 'snapshot',
                            name: 'app.resource.volume.snapshot',
                            meta: {
                                title: '快照'
                            },
                            component: () => import('@/views/cloudres/volume/snapshot')
                        },{
                            path: 'routermgr',
                            name: 'app.cloudres.network.routermgr',
                            meta: {
                                title: '路由管理'
                            },
                            component: () => import('@/views/cloudres/routermgr/router')
                        },{
                            path: 'routermanage/:item',
                            name: 'app.cloudres.network.routermanage',
                            meta: {
                                title: '接口管理'
                            },
                            component: () => import('@/views/cloudres/routermgr/routermanage')
                        },{
                            path: 'ipmgr',
                            name: 'app.cloudres.network.ipmgr',
                            meta: {
                                title: 'IP管理'
                            },
                            component: () => import('@/views/cloudres/floatmgr/floatip')
                        }
                    ]
                }
            ]
        }
    ]
});
