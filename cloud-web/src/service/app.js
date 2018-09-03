/*
 * @Author: wenfang 
 * @Date: 2018-06-27 09:53:24 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-08-27 23:04:05
 */
import http from '../utils/http';

/**
 * 获取左侧菜单导航
 *
 * @export
 * @returns
 */
export async function getNavList() {
    let res = await http.get('server/sidebar-menu.json?t=' + Math.random());
    console.log(res);
    return process.env.VUE_APP_BUILD === 'pro' ? res.data.filter(e => e.evn === 'pro') : res.data;
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
