/*
 * @Author: wenfang 
 * @Date: 2018-06-27 09:53:24 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-10-17 17:13:31
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
    let config = await http.get('/resources/systemConfig/list', {
        params: {
            code: 'wac_config'
        }
    });
    $log(config);
    if (config.data.data && config.data.data.data) {
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
