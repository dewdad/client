import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import createPersistedState from 'vuex-persistedstate';
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
        // 二级菜单展开，收起 默认展开
        sidebarCollapse: false,
        // 登录状态
        isLogined: false,
        // 路由加载中
        pageLoading: true,
        // 页面加载错误
        pageLoadError: false,
        resize: new Date().getTime(),
    },
    mutations,
    actions,
    modules: {
        user
    },
    getters,
    // state持久化
    plugins: [createPersistedState({
        // 指定需要持久化保存的state
        paths: ['collapse','isLogined', 'user']
    })]
});
