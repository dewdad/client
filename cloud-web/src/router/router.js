import Vue from 'vue';
import Router from 'vue-router';
const Layout = () => import('@/views/Layout.vue');
const Login = () => import('@/views/login/Index.vue');
const RegisterIndex = () => import('@/views/register/Index.vue');
const Register = () => import('@/views/register/Register.vue');
const RegisterSuccess = () => import('@/views/register/RegisterSuccess.vue');
const Overview = () => import('@/views/home/Overview.vue');
import ECS from './ecs';
import RDS from './rds';
import OSS from './oss';
import Security from './security';
import AccountMg from './account';
import User from './user';
import Ip from './ip';
import Ticket from './ticket';
import VPC from './vpc';
import Monitor from './monitor';
Vue.use(Router);
/**
 * 白名单列表
 *@description 未登录时可访问的路由, 由多个路由名称组成的数组 注意大小写问题
 */
export const whiteList = ['login', 'register.reg', 'user.forgetPwd', 'BindMailBox.Success', 'accountMg.BindManagerMail'];

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
            path: '',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                title: '登录',
                auth: false // 当前路由是否需要登录, 不设置或为false时表示不需要登录可进入路由
            },
            component: Login
        },
        ...User,
        {
            path: '/register',
            name: 'register',
            meta: {
                title: '注册',
                auth: false // 当前路由是否需要登录, 不设置或为false时表示不需要登录可进入路由
            },
            component: RegisterIndex,
            redirect: '/register/reg',
            children: [
                {
                    path: 'reg',
                    name: 'register.reg',
                    component: Register
                },
                {
                    path: 'success',
                    name: 'register.success',
                    component: RegisterSuccess
                }
            ]
        },
        {
            path: '/app',
            name: 'app',
            redirect: '/app/overview',
            component: Layout,
            children: [
                {
                    path: 'overview',
                    name: 'app.home',
                    component: Overview
                },
                ...ECS,
                ...RDS,
                ...OSS,
                ...Security,
                ...AccountMg,
                ...Ip,
                ...Ticket,
                ...VPC,
                ...Monitor
            ]
        }
    ]
});
