const getters = {
    userInfo: state => state.user.userInfo,
    zoons: state => state.user.zoons,
    depts: state => state.user.depts,
    collapse: state => state.collapse,
    navCollapse: state => state.navCollapse,
};
export default getters;
