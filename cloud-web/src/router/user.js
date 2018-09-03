const unbindMailbox = () => import('@/views/user/bindMailbox/UnBindMailbox.vue');
const pwdForget = () => import('@/views/user/pwdForget/PwdForget.vue');
const PwdReset = () => import('@/views/user/pwdReset/PwdReset.vue');
const Authentication = () => import('@/views/user/authentication/Auth.vue');
const CompanyAuth = () => import('@/views/user/authentication/CompanyAuth.vue');
const AuthApply = () => import('@/views/user/authentication/AuthApply.vue');
const DepartAuth = () => import('@/views/user/authentication/DepartAuth.vue');
const BindMailbox = () => import('@/views/user/bindMailbox/BindMailbox.vue');
const bindMailboxIndex = () => import('@/views/user/bindMailbox/Index.vue');
const BindMobile = () => import('@/views/user/bindMobile/BindMobile.vue');
const changeMailBox = () => import('@/views/user/changeMailBox/index.vue');
const Identity = () => import('@/views/login/Identity.vue');
const BindMailBoxSuccess = () => import('@/views/user/bindMailbox/BindMailBoxSuccess.vue');
const BindMailBoxError = () => import('@/views/user/bindMailbox/BindMailBoxError.vue');
const BindManagerMail = () => import('@/views/user/contactEmail/BindManagerMail.vue');
export default [
    {
        path: '/forgetpwd',
        name: 'user.forgetPwd',
        component: pwdForget
    },
    {
        path: '/BindManagerMail/:id',
        name: 'accountMg.BindManagerMail',
        component: BindManagerMail,
        meta: {
            fullpage: true
        }
    },
    {
        path: '/user',
        name: 'user',
        meta: {
            moduleName: '用户设置'
        },
        redirect: '/user/auth',
        component: {
            render(c) {
                return c('router-view');
            }
        },
        children: [
            {
                path: 'identity',
                name: 'user.identity',
                meta: {
                    title: '验证',
                    auth: false // 当前路由是否需要登录, 不设置或为false时表示不需要登录可进入路由
                },
                component: Identity
            },
            {
                path: 'unbind',
                name: 'user.unbind',
                component: unbindMailbox
            },
            {
                path: 'bindmailbox',
                name: 'user.BindMailbox',
                component: bindMailboxIndex,
                redirect: '/user/bindmailbox/bind',
                children: [
                    {
                        path: 'bind',
                        name: 'BindMailBox.bind',
                        component: BindMailbox
                    },
                    {
                        path: '/checkemail/:id',
                        name: 'BindMailBox.Success',
                        component: BindMailBoxSuccess
                    },
                    {
                        path: 'error',
                        name: 'BindMailBox.Error',
                        component: BindMailBoxError
                    }

                ]
            },
            {
                path: 'changeMailBox',
                name: 'user.changeMailBox',
                component: changeMailBox
            },
            {
                path: 'resetpwd',
                name: 'user.PwdReset',
                component: PwdReset
            },
            {
                path: 'chgemail',
                name: 'user.chgemail',
                component: pwdForget
            },
            {
                path: 'bindmobile',
                name: 'user.bindmobile',
                component: BindMobile
            },
            {
                path: 'auth',
                name: 'user.auth',
                meta: {
                    title: '实名认证',
                    auth: false // 当前路由是否需要登录, 不设置或为false时表示不需要登录可进入路由
                },
                component: Authentication,
                redirect: 'user/auth/companyAuth',
                children: [
                    {
                        path: 'companyAuth',
                        name: 'user.auth.companyAuth',
                        component: CompanyAuth
                    },
                    {
                        path: 'departAuth/:id?',
                        name: 'auth.departAuth',
                        component: DepartAuth
                    },
                    {
                        path: 'authApply',
                        name: 'auth.authApply',
                        component: AuthApply
                    }
                ]
            }
        ]
    }
];
