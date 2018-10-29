import {getDataStoreType} from '@/service/rds/datastore';
const rds = {
    namespaced: true,
    state: {
        instance: {},
        instList: [],
        dataStoreType: {}
    },
    mutations: {
        SET_DATASTORE(state, payload) {
            state.dataStoreType = payload;
        },
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
    actions: {
        async GET_DATASTORE({commit, state}, data) {
            let res = await getDataStoreType();
            state.dataStoreType = res;
        }
    }
};
export default rds;
