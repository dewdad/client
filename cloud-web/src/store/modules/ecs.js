import { getSecurityGroupList } from '@/service/ecs/security.js';
import {cloneDeep} from '@/utils/utils';

const ecs = {
    namespaced: true,
    state: {
        needGroup: [],
        searchHistory: []
    },
    mutations: {
        getNeedGroup(state, payload){
            state.needGroup = payload;
        },
        saveHistory(state, payload) {
            if (!payload || !payload.type || !payload.value) return;

            // 已经有了，更新顺序
            let hasHistory = false;
            state.searchHistory.forEach((e, index) => {
                if (e.value === payload.value && e.type === payload.type) {
                    hasHistory = index;
                }
            });
            if (hasHistory !== false) {
                state.searchHistory.splice(hasHistory, 1);
            }

            // 只显示最新5条
            if (state.searchHistory.length === 5) {
                state.searchHistory.shift();
            }

            state.searchHistory.push(payload);
        }
    },
    getters: {
        searchHistoryDesc(state) {
            return cloneDeep(state.searchHistory).reverse();
        }
    },
    actions: {
        // 获得安全组列表
        getNeedGroupFn({ state, commit, dispatch }, params) {
            getSecurityGroupList(params).then( (res) => {
                if(res.code && res.code === '0000'){
                    let resData = res.result;
                    if(resData && resData.records){
                        commit('getNeedGroup', resData.records || []);
                    }                           
                }
            });
        }
    }
};
export default ecs;
