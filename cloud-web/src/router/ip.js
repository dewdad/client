const Index = () => import('@/views/ip/Index.vue');
const List = () => import('@/views/ip/List.vue');
const CreatFlexip = () => import('@/views/ip/CreatFlexip.vue');
const Modifyflexip = () => import('@/views/ip/ModifyFlexip.vue');
export default [
    {
        path: 'ip',
        name: 'app.ip',
        redirect: '/people/ip/flexip',
        meta: {
            moduleName: '弹性公网IP'
        },
        component: Index,
        children: [
            {
                path: 'flexip',
                name: 'app.ip.flexip',
                component: List
            },
            {
                path: 'creatflexip',
                name: 'app.ip.creatflexip',
                component: CreatFlexip,
                meta: {
                    fullpage: true
                }
            },
            {
                path: 'modifyflexip',
                name: 'app.ip.modifyflexip',
                component: Modifyflexip
            }
        ]
    }
];
