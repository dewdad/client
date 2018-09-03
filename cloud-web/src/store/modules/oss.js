const oss = {
    namespaced: true,
    state: {
        // 记录是否验证过手机短息
        showPwdFlag: 0,
        // 通知bucket刷新 值 改变时刷新
        refreshBucket: false,
        headerInfo: {
            name: '',
            isPrivate: false,
            createTime: ''
        }
    },
    mutations: {
        SET_SHOW_PWD_FLAG(state, payload) {
            state.showPwdFlag = payload;
        },
        CHANGE_REFRESH_BUCKET(state, payload) {
            state.refreshBucket = !state.refreshBucket;
        },
        SET_HEADER_IFNO(state, payload) {
            state.headerInfo = payload;
        },
        CLEAR_STATE(state, payload) {
            state.showPwdFlag = 0;
        }
    },
    actions: {}
};
export default oss;