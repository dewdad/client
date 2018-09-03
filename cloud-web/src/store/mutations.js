import {addClass} from '@/utils/utils';
export default {
    /**
     * 设置登录状态
     * @param {*} state
     * @param {*} payload
     */
    SET_LOGIN_STATUS(state, payload) {
        state.isLogined = payload.status;
        state.token = payload.token;
        state.uid = payload.uid;
        state.lastMoibleVerifyTime = '';
    },
    /**
     * 更新主题
     * @param {*} state
     * @param {*} theme
     */
    SET_THEME_COLOR(state, theme) {
        document.body.className = '';
        addClass(document.body, theme);
        state.theme = theme;
    },
    /**
     * 侧边栏切换
     * @param {*} state
     */
    SET_COLLAPSE(state, payload) {
        state.collapse = payload;
    },
    /**
     * 二级菜单栏切换
     * @param {*} state
     */
    SET_NAV_COLLAPSE(state) {
        state.navCollapse = !state.navCollapse;
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
     * 设置页面错误显示
     * @param {*} state
     * @param {*} data
     */
    SET_PAGE_LOAD_ERROR(state, data) {
        state.pageLoadError = data;
    },
    /**
     * 设置 createEcsFormData
     * @param {*} state
     * @param {*} data
     */
    SET_CREATE_ECS_FORM_DATA(state, data) {
        state.createEcsFormData = data;
    },
    SET_RESIZE(state) {
        state.resize = new Date().getTime();
    },
    SET_SHOW_VERIFY(state, data) {
        state.showVerifyDialog = data;
    },
    SET_LAST_MOBILE_VERIFY_TIME(state) {
        state.lastMoibleVerifyTime = new Date().getTime();
    }
};
