const getters = {
    collapse: state => state.collapse,
    navCollapse: state => state.navCollapse,
    theme: state => state.theme,
    token: state => state.token,
    loginFailNums: sate => sate.user.loginFailNums,
    userInfo: state => state.user.userInfo,
    isIdentity: (state, getters) => getters['user/isIdentity'],
    lastMoibleVerifyTime: state => state.lastMoibleVerifyTime
};
export default getters;
