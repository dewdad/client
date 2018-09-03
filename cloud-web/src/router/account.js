const Index = () => import('@/views/accountMg/Index.vue');
const SecutitySet = () => import('@/views/accountMg/secutitySet/Overview.vue');
const UserAuth = () => import('@/views/accountMg/userAuth/Overview.vue');
const UserInfo = () => import('@/views/accountMg/userInfo/Overview.vue');
const ContactManager = () => import('@/views/accountMg/contactManager/Overview.vue');
export default [
    {
        path: 'accountMg',
        name: 'app.accountMg',
        meta: {
            moduleName: '账号管理'
        },
        redirect: '/people/accountMg/SecutitySet',
        component: Index,
        children: [
            {
                path: 'SecutitySet',
                name: 'accountMg.SecutitySet',
                component: SecutitySet
            },
            {
                path: 'userinfo',
                name: 'accountMg.info',
                component: UserInfo
            },
            {
                path: 'auth',
                name: 'accountMg.auth',
                component: UserAuth
            },
            {
                path: 'manager',
                name: 'accountMg.manager',
                component: ContactManager,
            }
            
        ]
    }
];
