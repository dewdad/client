/**
 * author:sunersheng
 * time:2018-07-03
 * ecs模块的路由
 */
const Overview = () => import('@/views/ecs/Overview.vue');
const EcsInstCreate = () => import('@/views/ecs/create/Index.vue');
const EcsInstList = () => import('@/views/ecs/inst/EcsInstList.vue');
const ClouddiscList = () => import('@/views/ecs/clouddisc/clouddiscList.vue');
const Snaplist = () => import('@/views/ecs/clouddisc/snaplist.vue');
const Expandsize = () => import('@/views/ecs/clouddisc/Expandsize.vue');
const CloudDiscDetail = () => import('@/views/ecs/clouddisc/detail/detail.vue');
const Monitorinfo = () => import('@/views/ecs/clouddisc/detail/monitorinfo.vue');
const CreateDisc = () => import('@/views/ecs/clouddisc/createDisc.vue');
const BackupList = () => import('@/views/ecs/clouddisc/BackupList.vue');
const EcsInstDetail = () => import('@/views/ecs/inst/details/Detail.vue');
const EcsInstDiskList = () => import('@/views/ecs/inst/details/disk/EcsInstDiskList.vue');
const EcsInstSecuritygrpList = () => import('@/views/ecs/inst/details/securitygrp/EcsInstSecuritygrpList.vue');
const EcsInstSnapList = () => import('@/views/ecs/inst/details/snap/EcsInstSnapList.vue');
const EcsImageList = () => import('@/views/ecs/image/EcsImageList.vue');
const Changeconfig = () => import('@/views/ecs/changeconfig/changeconfig.vue');
const DiskSnapshot = () => import('@/views/ecs/diskSnapshot/DiskSnapshot.vue');
const Safegrp = () => import('@/views/ecs/netsecurity/Safegrp.vue');
const SafegrpList = () => import('@/views/ecs/netsecurity/SafegrpList.vue');
const SafegrpRule = () => import('@/views/ecs/netsecurity/SafegrpRule.vue');
const Keypair = () => import('@/views/ecs/netsecurity/Keypair.vue');
const Lablemgr = () => import('@/views/ecs/lablemgr/Lablemgr.vue');

export default [
    {
        path: 'ecs',
        name: 'app.ecs',
        redirect: '/app/ecs/overview',
        component: {
            render(c) {
                return c('router-view');
            }
        },
        meta: {
            moduleName: '云服务器ECS'
        },
        children: [
            {
                path: 'create',
                name: 'app.ecs.create',
                component: EcsInstCreate,
                meta: {
                    fullpage: true
                }
            },
            {
                path: 'overview',
                name: 'app.ecs.overview',
                component: Overview
            },
            {
                path: 'list',
                name: 'app.ecs.list',
                component: EcsInstList
            },
            {
                path: 'clouddisc-list',
                name: 'app.ecs.clouddisc-list',
                component: ClouddiscList
            },
            {
                path: 'snaplist',
                name: 'app.ecs.snaplist',
                component: Snaplist
            },
            {
                path: 'expandsize/:id?',
                name: 'app.ecs.expandsize',
                component: Expandsize,
                meta: {
                    parentName: 'aa'
                }
            },
            {
                path: 'backuplist',
                name: 'app.ecs.backuplist',
                component: BackupList
            },
            {
                path: 'clouddisc/createDisc',
                name: 'app.ecs.clouddisc.createDisc',
                component: CreateDisc
            },
            {
                path: 'image',
                name: 'app.ecs.image',
                component: EcsImageList
            },
            {
                path: 'changeconfig/:id',
                name: 'app.ecs.changeconfig',
                component: Changeconfig
            },
            {
                path: 'lablemgr',
                name: 'app.ecs.lablemgr',
                component: Lablemgr
            },
            {
                path: 'netsecurity/safegrp',
                name: 'app.ecs.netsecurity.safegrp',
                component: Safegrp
            },
            {
                path: 'netsecurity/keypair',
                name: 'app.ecs.netsecurity.keypair',
                component: Keypair
            },
            {
                path: 'inst/:id',
                name: 'app.ecs.inst',
                component: {
                    render(c) {
                        return c('router-view');
                    }
                },
                redirect: '/people/ecs/inst/detail',
                meta: {
                    showBack: true,
                    backUrl: 'app.ecs.list'
                },
                children: [
                    {
                        path: 'detail',
                        name: 'app.ecs.inst.detail',
                        component: EcsInstDetail
                    },
                    {
                        path: 'disk',
                        name: 'app.ecs.inst.disk',
                        component: EcsInstDiskList
                    },
                    {
                        path: 'snap',
                        name: 'app.ecs.inst.snap',
                        component: EcsInstSnapList
                    },
                    {
                        path: 'securitygrp',
                        name: 'app.ecs.inst.securitygrp',
                        component: EcsInstSecuritygrpList
                    }
                ]
            },
            {
                path: 'clouddisc/:id',
                name: 'app.ecs.clouddisc',
                component: {
                    render(c) {
                        return c('router-view');
                    }
                },
                redirect: '/people/ecs/clouddisc/detail',
                meta: {
                    showBack: true,
                    backUrl: 'app.ecs.clouddisc-list'
                },
                children: [
                    {
                        path: 'detail',
                        name: 'app.ecs.clouddisc.detail',
                        component: CloudDiscDetail
                    },
                    {
                        path: 'monitorinfo',
                        name: 'app.ecs.clouddisc.monitorinfo',
                        component: Monitorinfo
                    }
                ]
            },
            {
                path: 'snapshot',
                name: 'app.ecs.snapshot',
                component: {
                    render(c) {
                        return c('router-view');
                    }
                },
                redirect: '/people/ecs/snapshot/detail',
                meta: {
                    showBack: true,
                    backUrl: 'app.ecs.snaplist'
                },
                children: [
                    {
                        path: 'detail/:id',
                        name: 'app.ecs.snapshot.detail',
                        component: DiskSnapshot
                    }
                ]
            },
            {
                path: 'groupRule',
                name: 'app.ecs.groupRule',
                component: {
                    render(c) {
                        return c('router-view');
                    }
                },
                redirect: '/people/ecs/groupRule/safegrpList',
                meta: {
                    showBack: true,
                    backUrl: 'app.ecs.netsecurity.safegrp'
                },
                children: [
                    {
                        path: 'safegrpList/:ruleId',
                        name: 'app.ecs.groupRule.safegrpList',
                        component: SafegrpList
                    },
                    {
                        path: 'safegrpRule/:ruleId',
                        name: 'app.ecs.groupRule.safegrpRule',
                        component: SafegrpRule
                    }
                ]
            }
        ]
    }
];
