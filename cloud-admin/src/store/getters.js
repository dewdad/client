const getters = {
    userInfo: state => state.user.userInfo,
    dept: state => state.user.dept,
    collapse: state => state.collapse,
    navCollapse: state => state.navCollapse,
    isLogined: state => state.isLogined,
};
export default getters;
