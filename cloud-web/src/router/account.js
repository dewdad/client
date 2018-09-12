const Index = () => import('@/views/accountMg/Index.vue');
const UserInfo = () => import('@/views/accountMg/userInfo/Overview.vue');
const MyAccount = () => import('@/views/accountMg/myinfo/accountInfo.vue');
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
                path: 'myAccount',
                name: 'accountMg.myAccount',
                component: MyAccount
            },
            {
                path: 'userinfo',
                name: 'accountMg.info',
                component: UserInfo
            }
        ]
    }
];
