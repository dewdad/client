import Vue from 'vue';
import App from './App.vue';
// eslint-disable-next-line
import {default as router, whiteList} from '@/router/router';
import store from '@/store';
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import emailDirective from '@/directive/email';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import modules from '@/modules.js';

// 注册弹框可拖动指令
import './directive/dialogdrag';
// 注册VueClipboards全局指令
import VueClipboards from 'vue-clipboards';
Vue.use(VueClipboards);
Vue.directive('email', emailDirective);
// 注册v-tip全局指令
import {VTooltip} from './directive/tooltip';
Vue.directive('tooltip', VTooltip);
// axios请求
// import http from '@/utils/http';
// 生产环境中注释掉以下语句
// import '../mock/index.js'
// 引入状态码作为全局属性使用
// eslint-disable-next-line
import code from './constants/code';
Vue.prototype.CODE = code;

// Vue.use(echartsliquidfill);

// 过滤器
import '@/utils/filters';
// element-ui样式
import 'element-ui/packages/theme-chalk/src/index.scss';
// 引入主题样式
import '@/assets/css/default.scss';
// import '@/assets/css/theme_red.scss';

// 定义一个全局的$log方法，代替console.log
window.$log = function(...args) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...args);
    }
};

import {get} from '@/utils/utils';

/**
 * 定义一个get方法供template中调用，这样可以避免object元素不存在时报Cannot read property 'type' of undefined
 * @param {*} obj vue实例的对象
 * @param {*} exp 属性表代式 支持多级 one.two.three
 * 使用方法 {{get(rdsInst, 'name')}}
 */
Vue.prototype.get = (obj, exp) => {
    return get(obj, exp, '');
};

Vue.use(ElementUI);

// 使用I18n国际化进行语言配置
Vue.use(VueI18n);

// 阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false;
// 取消 Vue 所有的日志与警告
Vue.config.silent = process.env.NODE_ENV === 'production' ? true : false;

// 兼容不支持promise的浏览器
// require('es6-promise').polyfill()

const i18n = new VueI18n({
    locale: '', // set locale
    messages: {
        'zh-CN': ''
    }
});
const loadedLanguages = [];

function setI18nLanguage(lang) {
    i18n.locale = lang;
    document.querySelector('html').setAttribute('lang', lang);
    return lang;
}

/**
 * 获取语文包配置
 */
async function getLang(lang) {
    let currLang = '';
    // if (process.env.NODE_ENV === 'production') {
    //     // 生成环境下通过接口调用方式加载语言包
    //     await http.get('lang/' + lang + '.json').then(data => {
    //         currLang = data.data;
    //     });
    // } else {
    currLang = require('@public/lang/' + lang + '.js')['default'];
    console.log(currLang);
    // }
    return currLang;
}
// 设置当前语言包
async function loadLanguageAsync(lang) {
    if (i18n.locale !== lang) {
        if (!loadedLanguages.includes(lang)) {
            let json = await getLang(lang);
            i18n.setLocaleMessage(lang, json);
            loadedLanguages.push(lang);
            return setI18nLanguage(lang);
        }
        return Promise.resolve(setI18nLanguage(lang));
    }
    return Promise.resolve(lang);
}

import {getNavList} from '@/service/app';

// 路由跳转前执行
router.beforeEach(async (to, from, next) => {
    // 如果是登录成功后跳转或F5刷新，加载左侧菜单
    if (to.matched.length === 0) {
        // 如果未匹配到路由
        from.name
            ? next({
                name: from.name
            })
            : next('/login'); // 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
    } else {
        // console.error(from.path, from.name);
        // console.error(to.path, to.name);
    
        // 验证页面可以退出
        if (to.name === 'login') {
            store.dispatch('LOGOUT');
            next();
            return;
        }
        // 如果匹配到正确跳转
        // 未登录时检查目标路由是否存在白名单中，如果没有跳转到登录页
        // 如需登录开启下面代码
        let findVal = whiteList.find(item => {
            return item === to.name;
        });
        if (findVal === undefined && !store.state.isLogined) {
            // store.commit('SET_REDIRECT', to.fullPath);
            next({
                path: '/login',
                query: {c: to.fullPath} //把要跳转的地址作为参数传到下一步
            });
            return;
        }
    
        // 登录状态下如果目标路由是登录或注册 直接跳转到控制台首页
        if (store.state.isLogined && !to.path.includes('exceptionlogin') && (to.path.includes('login') || to.path.includes('register')) && to.name !== 'register.success') {
            next('/app');
            return;
        }
        // 如果来源路由是登录或注册 或者浏览器刷新 加载侧边栏菜单
        if (from.name === 'login' || from.name === 'register.reg' || from.name === null) {
            let navList = await getNavList();
            // 只获取一级菜单
            window.navList = navList;
        }
        // 页面动画开始
        if (findVal === undefined) NProgress.start();
        // store.commit('SET_PAGE_LOADING', true);
        // 清空错误信息
        store.commit('SET_PAGE_LOAD_ERROR', '');
        next();
    }
});

// 路由跳转后执行
router.afterEach(() => {
    // 页面动画结束
    NProgress.done();
    // store.commit('SET_PAGE_LOADING', false);
});

// 注册$messageBox全局方法
// eslint-disable-next-line
import ZtMessageBox from '@/components/messageBox/index';
Vue.prototype.$messageBox = ZtMessageBox;
// 注册组件
Object.keys(modules).map(key => {
    Vue.component(key, modules[key]);
});

import 'promise.prototype.finally';

/**
 * 监听resize
 */

window.addEventListener('resize', () => {
    store.commit('SET_RESIZE');
});

// 定义入口方法 先加载语言包再实例VUE对像
async function __main() {
    // 加载默认语言包
    await loadLanguageAsync('zh-CN');
    window.$t = i18n.t.bind(i18n);
    window.app = new Vue({
        router,
        store,
        i18n,
        render: h => h(App)
    }).$mount('#app');
}

__main();

// 当前环境变量
// console.log(process.env)
