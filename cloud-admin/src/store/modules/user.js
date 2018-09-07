
const user = {
    namespaced: true,
    state: {
        userInfo: {}
    },
    getters: {

    },
    mutations: {

        /**
         * 记录用户信息
         * @param {*} state
         * @param {*} userInfo
         */
        SET_USERINFO(state, userInfo) {
            state.userInfo = userInfo;
        },
        /**
         * 记录部门信息
         * @param {*} state
         * @param {*} userInfo
         */
        DEPT(state, dept) {
            state.dept = dept;
        },

    },
    actions: {

    }
};
export default user;
