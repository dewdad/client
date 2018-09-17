export default [
    {
        path: 'monitor',
        name: 'app.monitor',
        meta: {
            moduleName: '云监控CMS'
        },
        redirect: '/app/monitor/alarmrule/list',
        component: {
            render(c) {
                return c('router-view');
            }
        },
        children: [
            {
                path: 'alarmrule',
                name: 'app.monitor.alarmrule',
                redirect: '/app/monitor/alarmrule/list',
                component: {
                    render(c) {
                        return c('router-view');
                    }
                },
                meta: {
                    parentName: 'app.monitor'
                },
                children: [
                    {
                        path: 'list',
                        name: 'app.monitor.alarmrule.list',
                        component: () => import('@/views/monitor/alarmrule/List.vue'),
                        meta: {
                            parentName: 'app.monitor'
                        }
                    },
                    {
                        path: 'add',
                        name: 'app.monitor.alarmrule.add',
                        component: () => import('@/views/monitor/alarmrule/Add.vue'),
                        meta: {
                            parentName: 'app.monitor',
                            activeIndex: 'app.monitor.alarmrule.list'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'app.monitor.alarmrule.edit',
                        component: () => import('@/views/monitor/alarmrule/Edit.vue'),
                        meta: {
                            parentName: 'app.monitor',
                            activeIndex: 'app.monitor.alarmrule.list'
                        }
                    }
                ]
            },
            {
                path: 'contacts',
                name: 'app.monitor.contacts',
                component: () => import('@/views/monitor/Contacts.vue'),
                meta: {
                    parentName: 'app.monitor',
                    activeIndex: 'app.monitor.contacts'
                }
            },
            {
                path: 'history',
                name: 'app.monitor.history',
                component: () => import('@/views/monitor/History.vue'),
                meta: {
                    parentName: 'app.monitor',
                    activeIndex: 'app.monitor.history'
                }
            }
        ]
    }
];
