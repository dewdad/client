
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
         * @param {*} dept
         */
        DEPT(state, dept) {
            state.dept = dept;
        },
        /**
         * 记录当前部门分支
         * @param {*} state
         * @param {*} brunch
         */
        DEPTBRUNCH(state, brunch) {
            state.deptbrunch = brunch;
        },

    },
    actions: {

    }
};
export default user;
