const Index = () => import('@/views/accountMg/Index.vue');
const UserInfo = () => import('@/views/accountMg/userInfo/Overview.vue');
export default [
    {
        path: 'accountMg',
        name: 'app.accountMg',
        meta: {
            moduleName: '账号管理'
        },
        redirect: '/people/accountMg/userinfo',
        component: Index,
        children: [
            {
                path: 'userinfo',
                name: 'accountMg.info',
                component: UserInfo
            }
        ]
    }
];
