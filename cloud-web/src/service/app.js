/*
 * @Author: wenfang 
 * @Date: 2018-06-27 09:53:24 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-11-06 16:23:20
 */
import http from '../utils/http';
import store from '../store';
/**
 * 获取左侧菜单导航
 *
 * @export
 * @returns
 */
export async function getNavList1() {
    let res = await http.get('server/sidebar-menu.json?t=' + Math.random());
    let config = await http.get('/resources/systemConfig/list', {
        params: {
            code: 'wac_config'
        }
    });
    $log(config);
    if (config && config.data.code === '0000' && config.data.data && config.data.data.data) {
        let item = {
            text: config.data.data.data[0].itemList[0].name,
            icon: 'iconfont icon-icon_wac',
            sref: config.data.data.data[0].itemList[0].value.trim(),
            redirect: true
        };
        res.data.push(item);
    }

    console.log(res);
    return process.env.VUE_APP_BUILD === 'pro' ? res.data.filter(e => e.evn === 'pro') : res.data;
}

/**
 * 将获取到的二级菜单做参数转换
 */
const getSubMenu = submenu => {
    let arr = [];
    if (Array.isArray(submenu)) {
        submenu.forEach(element => {
            let sub = {
                text: element.menuName,
                hidden: element.isNew !== 'new' || element.menuName.includes('隐藏'),
                sref: element.routeHref,
                icon: element.menuIcon,
                submenu: getSubMenu(element.submenus)
            };
            arr.push(sub);
        });
    }
    return arr;
};

export async function getNavList() {
    let userInfo = store.getters.userInfo;
    let res = await http.get('/identity/menu/getMenuListByRoleId?roleId=' + userInfo.roleId);
    let navList = [];
    if (res && res.data) {
        res.data.forEach(element => {
            let nav = {
                text: element.menuName,
                hidden: element.isNew !== 'new' || element.menuName.includes('隐藏'),
                sref: element.routeHref,
                icon: element.menuIcon,
                submenu: getSubMenu(element.submenus)
            };
            navList.push(nav);
        });
    }
    return navList;
}

/**
 * 获取区域region
 *
 * @export
 * @returns
 */
export async function getRegion() {
    let res = await http.get('server/region.json');
    return res.data;
}

/**
 * 获取城市数据
 *
 * @export
 * @returns
 */
export async function getCitys() {
    let res = await http.get('server/citys.json');
    return res.data;
}

/**
 * 获取系统配置
 * @param {*} data
 */
export async function getSysConfig({limit = 9999, pageIndex = 1, code = ''} = {}) {
    let res = await http.get('/resources/systemConfig/list', {
        params: {
            limit,
            pageIndex,
            code
        }
    });
    return res && res.data;
}
