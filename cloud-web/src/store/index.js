import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import rds from './modules/rds';
import ecs from './modules/ecs';
import user from './modules/user';
import oss from './modules/oss';
import security from './modules/security';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 当前系统主题  people
        theme: 'theme-people',
        // 侧边栏展开,收起 默认展开
        collapse: false,
        // 二级菜单展开，收起 默认展开
        navCollapse: false,
        // 登录状态
        isLogined: false,
        // token
        token: '',
        // 路由加载中
        pageLoading: true,
        // 页面加载错误
        pageLoadError: false,
        // 创建ECS实例表单数据
        createEcsFormData: {},
        // 创建rds实例表单数据
        createRdsFormData: {},
        resize: new Date().getTime(),
        showVerifyDialog: false,
        // 最后一次身份验证时间
        lastMoibleVerifyTime: ''
    },
    mutations,
    actions,
    modules: {
        ecs,
        rds,
        user,
        oss,
        security
    },
    getters,
    // state持久化
    plugins: [
        createPersistedState({
            // 指定需要持久化保存的state
            paths: ['collapse', 'navCollapse', 'isLogined', 'token', 'user', 'oss.showPwdFlag', 'security', 'rds', 'ecs.searchHistory', 'lastMoibleVerifyTime']
        })
    ]
});
