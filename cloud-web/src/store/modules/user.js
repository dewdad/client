import {API_UserAccount} from '@/constants/apiUrl';
import {isArray} from '@/utils/utils';
const user = {
    namespaced: true,
    state: {
        // 登录失败次数
        loginFailNums: 0,
        userInfo: {
            authStatus: '4'
        },
        photoId: '',
        datumId: '',
        // 记录登录过的账号ID
        accountList: []
    },
    getters: {
        isAutherized(state) {
            return state.userInfo.authStatus === 2;
        },
        // 判断账号是否在本机验证过身份
        isIdentity(state) {
            if (isArray(state.accountList)) {
                let acc = state.accountList.find(accId => {
                    return accId === state.userInfo.uid;
                });
                return acc === undefined ? false : true;
            }
            return false;
        },
        getAvatarUrl(state) {
            return API_URL + '/' + API_UserAccount.getUploadFile + '/' + state.photoId;
        }
    },
    mutations: {
        /**
         * 记录登录失败次数
         * @param {*} state
         */
        SET_LOGIN_FAIL_NUMS(state) {
            state.loginFailNums += 1;
        },
        /**
         * 记录用户信息
         * @param {*} state
         * @param {*} userInfo
         */
        SET_USERINFO(state, userInfo) {
            state.userInfo = userInfo;
            state.loginFailNums = 0;
        },
        /**
         * 获取用户头像文件Id
         * @param {*} state
         */
        SET_PHOTOID(state, param) {
            state.photoId = param.photoId;
            state.datumId = param.datumId;
        },
        ADD_ACCOUNT(state, id) {
            let isIdentity = false;
            if (isArray(state.accountList)) {
                let acc = state.accountList.find(accId => {
                    return accId === state.userInfo.id;
                });
                isIdentity = acc === undefined ? false : true;
            }
            if (!isIdentity && isArray(state.accountList)) {
                state.accountList.push(id);
            }
        }
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
