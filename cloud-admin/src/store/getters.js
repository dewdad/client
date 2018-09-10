const getters = {
    userInfo: state => state.user.userInfo,
    dept: state => state.user.dept,
    deptbrunch: state => state.user.deptbrunch,
    collapse: state => state.collapse,
    navCollapse: state => state.navCollapse,
    isLogined: state => state.isLogined,
};
export default getters;
