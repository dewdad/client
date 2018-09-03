const rds = {
    namespaced: true,
    state: {
        instance: {},
        instList: []
    },
    mutations: {
        SET_INSTANCE(state, payload) {
            state.instance = payload;
        },
        SET_INST_LIST(state, payload) {
            state.instList = payload;
        },
        CLEAR_STATE(state, payload) {
            state.instance = {};
            state.instList = [];
        }
    },
    actions: {}
};
export default rds;