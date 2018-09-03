import {
    bruteForceConfig,
    portScanConfig,
    safeConfigAgentModelList,
    onkeyscanStatus,
    onKeyScan
} from '@/service/security';

export default {
    namespaced: true,
    state: {
        getInfoTime: '',
        scanStatus: {},
        infoData: {},
        bruteForceConfig: {}, // 防暴力破解配置
        portScanConfig: {}, // 防端口扫描配置
        agentModelList: [], // 服务器模式列表
        assetList: {}
    },
    getters: {
        scanedTody(state) {
            let last_scan_time = state.getInfoTime;
            if (!last_scan_time) return false;
            let day = new Date().toLocaleString().split(' ')[0];
            let lastDay = new Date(last_scan_time)
                .toLocaleString()
                .split(' ')[0];
            return day === lastDay;
        },
        // 展示过程
        showProcess(state) {
            let last_scan_time = state.getInfoTime;
            if (!last_scan_time) return false;
            let time = new Date().getTime();
            return time - new Date(last_scan_time).getTime() < 5000;
        }
    },
    mutations: {
        setAssetList(state, data) {
            state.assetList = data;
        },
        setScanStatus(state, data) {
            state.scanStatus = data;
        },
        setInfo(state, data) {
            state.infoData = data;
        },
        setGetInfoTime(state, time) {
            if (time !== undefined) {
                state.getInfoTime = time;
            } else {
                state.getInfoTime = new Date().getTime();
            }
        },
        setBruteForceConfig(state, config) {
            state.bruteForceConfig = config;
        },
        setPortScanConfig(state, config) {
            state.portScanConfig = config;
        },
        setAgentModelList(state, list) {
            state.agentModelList = list;
        },
        CLEAR_STATE(state, payload) {
            state.getInfoTime = '';
            state.scanStatus = {};
            state.infoData = {};
            state.assetList = {};
        }
    },
    actions: {
        async onKeyScan({commit}, {serverId} = {}) {
            try {
                let ret = await onKeyScan({
                    serverId
                });
                if (!ret) {
                    // 扫描成功，扫描时间
                }
                return ret;
            } catch (error) {
                console.error('Vuex onKeyScan', error.message);
            }
        },
        async onkeyscanStatus({commit}) {
            try {
                let ret = await onkeyscanStatus();
                console.log('onkeyscanStatus', ret);
                // TODO 保存检测状态
                commit('setScanStatus', ret);
                return ret;
            } catch (error) {
                console.error('Vuex onkeyscanStatus', error.message);
            }
        },
        async fetchBruteForceConfig({commit}, payload) {
            try {
                let ret = await bruteForceConfig(payload);
                $log('获取防暴力破解结果', ret);
                if (ret) {
                    commit('setBruteForceConfig', ret);
                    return ret;
                } else {
                    throw new Error('无数据');
                }
            } catch (error) {
                console.warn('获取防暴力破解失败', error.message);
            }
        },
        async fetchPortScanConfig({commit}, payload) {
            try {
                let ret = await portScanConfig(payload);
                $log('获取端口扫描破解结果', ret);
                if (ret) {
                    commit('setPortScanConfig', ret);
                    return ret;
                } else {
                    throw new Error('无数据');
                }
            } catch (error) {
                console.warn('获取端口扫描破解失败', error.message);
            }
        },
        async fetchAgentModelList({commit}, payload) {
            try {
                let ret = await safeConfigAgentModelList(payload);
                $log('服务器模式列表获取接口', ret);
                if (ret) {
                    commit('setAgentModelList', ret);
                    return ret;
                } else {
                    throw new Error('无数据');
                }
            } catch (error) {
                console.warn('服务器模式列表获取接口', error.message);
            }
        }
    }
};
