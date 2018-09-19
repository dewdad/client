export default {
    /**
     * 设置登录状态
     * @param {*} state
     * @param {*} payload
     */
    SET_LOGIN_STATUS(state, payload) {
        state.isLogined = payload.status;
    },
    /**
     * 设置页面LOADING效果
     * @param {*} state
     * @param {*} data
     */
    SET_PAGE_LOADING(state, data) {
        state.pageLoading = data;
    },
    /**
     * 侧边栏切换
     * @param {*} state
     */
    SET_COLLAPSE(state) {
        state.collapse = !state.collapse;
    },
    /**
     * 二级菜单栏切换
     * @param {*} state
     */
    SET_NAV_COLLAPSE(state) {
        state.navCollapse = !state.navCollapse;
    },
    /**
     * 二级菜单栏收展
     * @param {*} state
     */
    SIDEBAR_COLLAPSE(state) {
        state.sidebarCollapse = true;
    },
    /**
     * 设置页面错误显示
     * @param {*} state
     * @param {*} data
     */
    SET_PAGE_LOAD_ERROR(state, data) {
        state.pageLoadError = data;
    }
};
