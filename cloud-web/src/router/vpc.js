const pn = () => import('@/views/vpc/pn/pn.vue');
const pnDetail = () => import('@/views/vpc/pn/Detail.vue');
const pnSubnet = () => import('@/views/vpc/pn/Subnet.vue');
const Flexip = () => import('@/views/vpc/pn/Flexip.vue');
const vfirewall = () => import('@/views/vpc/vfirewall/Index.vue');
export default [
    {
        path: 'vpc',
        name: 'app.vpc',
        meta: {
            moduleName: '云主机安全'
        },
        redirect: '/app/vpc/pn',
        component: {
            render(c) {
                return c('router-view');
            }
        },
        children: [
            {
                path: 'pn',
                name: 'app.vpc.pn',
                component: pn
            },
            {
                path: 'pn/detail/:id',
                name: 'app.vpc.pn-detail',
                component: pnDetail
            },
            {
                path: 'pn/subnet/:id',
                name: 'app.vpc.pn-subnet',
                component: pnSubnet
            },
            {
                path: 'pn/flexip',
                name: 'app.vpc.pn-flexip',
                component: Flexip
            },
            {
                path: 'vfirewall',
                name: 'app.vpc.vfirewall',
                redirect: '/people/vpc/vfirewall/list',
                component: {
                    render(c) {
                        return c('router-view');
                    }
                },
                children: [
                    {
                        path: 'list',
                        name: 'app.vpc.vfirewall.list',
                        component: vfirewall,
                        meta: {
                            parentName: 'app.vpc'
                        }
                    }
                ]
            },
            {
                path: 'peerconn',
                name: 'app.vpc.peerconn',
                redirect: '/people/vpc/peerconn/list',
                component: () => import('@/views/vpc/peerconn/Peerconn.vue'),
                children: [
                    {
                        path: 'list',
                        name: 'app.vpc.peerconn.list',
                        component: () => import('@/views/vpc/peerconn/List.vue'),
                        meta: {
                            parentName: 'app.vpc'
                        }
                    }
                ]
            }
        ]
    }
];
