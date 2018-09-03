
export default {
    /**
     * 退出
     * @param {*} {commit, state}
     * @param {*} data
     */
    LOGOUT({commit, state}, data) {
        commit('SET_LOGIN_STATUS', {status: false, token: ''});
        commit('security/CLEAR_STATE');
        commit('oss/CLEAR_STATE');
        commit('rds/CLEAR_STATE');
        commit('user/SET_USERINFO', {});
    }
};
