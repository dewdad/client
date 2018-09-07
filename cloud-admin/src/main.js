import Vue from 'vue';
import App from './App.vue';
import router from './router/';
import store from './store/';

// 过滤器
import '@/utils/filters';

import ElementUI from 'element-ui';
// element-ui样式
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/styles.scss'; // global css
Vue.use(ElementUI);

// 阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false;
// 取消 Vue 所有的日志与警告
Vue.config.silent = process.env.NODE_ENV === 'production' ? true : false;

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
import './directive/dialogdrag';
// 注册v-tip全局指令
import {VTooltip} from './directive/tooltip';

import code from './constants/code';
Vue.prototype.CODE = code;

Vue.directive('tooltip', VTooltip);
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// import echarts from 'echarts'; // echarts插件
const echarts = require('echarts');
Vue.prototype.$echarts = echarts;

// 路由跳转前执行
router.beforeEach(async (to, from, next) => {
    // 如果是登录成功后跳转或F5刷新，加载左侧菜单
    NProgress.start();
    if (to.matched.length === 0) {
        // 如果未匹配到路由
        from.name ? next({name: from.name}) : next('/login'); // 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
    } else {
        if (to.name !== 'login' && !store.getters.isLogined) {
            //return next('/login');
            return window.location.href = '/#/login';
        }
        next();
    }
});
// 定义一个全局的$log方法，代替console.log
window.$log = function(...args) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...args);
    }
};

// import echartsliquidfill from 'echarts-liquidfill'; // 水球图组件扩展
// Vue.use(echartsliquidfill);
// 路由跳转后执行
router.afterEach(() => {
    // 页面动画结束
    NProgress.done();
    //store.commit('SET_PAGE_LOADING', false);
});
console.log(router);
window.app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
