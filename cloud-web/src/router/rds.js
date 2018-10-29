export default [
    {
        path: 'rds',
        name: 'app.rds',
        redirect: '/app/rds/list',
        meta: {
            moduleName: '云数据库RDS'
        },
        component: () => import('@/views/rds/Index.vue'),
        children: [
            {
                path: 'list',
                name: 'app.rds.list',
                component: () => import('@/views/rds/list/List.vue')
            },
            {
                path: 'create',
                name: 'app.rds.create',
                component: () => import('@/views/rds/create/Index.vue'),
                meta: {
                    fullpage: true
                }
            },
            {
                path: 'inst/:id',
                name: 'app.rds.inst',
                redirect: '/app/rds/inst/:id/detail',
                meta: {
                    showBack: true,
                    backUrl: 'app.rds.list'
                },
                component: () => import('@/views/rds/inst/Inst.vue'),
                children: [
                    {
                        path: 'detail',
                        name: 'app.rds.inst.detail',
                        component: () => import('@/views/rds/inst/details/Details')
                    },
                    {
                        path: 'monitor',
                        name: 'app.rds.inst.monitor',
                        component: () => import('@/views/rds/inst/details/Monitor')
                    },
                    {
                        path: 'logmgr/:tab?',
                        name: 'app.rds.inst.logmgr',
                        component: () => import('@/views/rds/inst/details/Logmgr')
                    },
                    {
                        path: 'whitelist',
                        name: 'app.rds.inst.whitelist',
                        component: () => import('@/views/rds/inst/details/Whitelist')
                    },
                    {
                        path: 'upperforman',
                        name: 'app.rds.inst.upperforman',
                        component: () => import('@/views/rds/inst/details/Upperforman')
                    },
                    {
                        path: 'backrecover/:tab?',
                        name: 'app.rds.inst.backrecover',
                        component: () => import('@/views/rds/inst/details/Backrecover')
                    },
                    {
                        path: 'paraset',
                        name: 'app.rds.inst.paraset',
                        component: () => import('@/views/rds/inst/details/Paraset')
                    }
                ]
            }
        ]
    }
];
