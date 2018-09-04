
export default {
    /**
     * 退出
     * @param {*} {commit, state}
     * @param {*} data
     */
    LOGOUT({commit, state}, data) {
        commit('SET_LOGIN_STATUS', {
            status: false
        });
        commit('user/SET_USERINFO', {});
    }
};
