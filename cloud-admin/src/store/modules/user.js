import {getUserInfoDetail} from '@/service/user';
import {API_UserAccount} from '@/constants/apiUrl';
import {isArray} from '@/utils/utils';
const user = {
    namespaced: true,
    state: {

        datumId: '',
        // 记录登录过的账号ID
        accountList: []
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
            state.userInfo = userInfo
        },
        /**
         * 记录zoons
         * @param {*} state
         * @param {*} zoons
         */
        SET_ZOONS(state, zoons) {
            state.zoons = zoons
        },
        /**
         * 记录dept
         * @param {*} state
         * @param {*} dept
         */
        SET_DEPTS(state, dept) {
            state.depts = dept
        },


    },
    actions: {
        // getUserInfoDetailFn({state, commit, dispatch}, params = state.userInfo.uid) {
        //     return getUserInfoDetail({uid: params}).then(res => {
        //         let datumId = res && res.result && res.result.id || '';
        //         let photoId = res && res.result && res.result.photoId || '';
        //         let params = {
        //             datumId: datumId,
        //             photoId: photoId
        //         };
        //         commit('SET_PHOTOID', params);
        //         return res.result;
        //     });
        // }
    }
};
export default user;
