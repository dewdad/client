<template>
<div class="page-main security-overview">
    <el-row :gutter="20" class="overview">
        <el-col :span="18">
            <!-- 状态检测模块 -->
            <transition name="fade">
                <detect-module class="mb20" v-if="isAutherized"></detect-module>
            </transition>
            <transition name="fade">
                <info-panel v-if="isAutherized && scanedTody" :data="infoData" class="mb20"></info-panel>
            </transition>
            <el-card shadow="hover">
                <!-- 头部 -->
                <div slot="header">
                    <span>{{$t('security.anomaly.hostWeakness')}}</span>
                    <el-radio-group v-model="weaknessQuery.timeperiod" class="pull-right header-radio-group">
                        <el-radio border name="7天" :label="7">7天</el-radio>
                        <el-radio border name="30天" :label="30">30天</el-radio>
                    </el-radio-group>
                </div>
                <!-- 主体 -->
                <el-row>
                    <!-- 选择框 -->
                    <el-col :span="24">
                        <span class="mr20">{{$t('common.type')}}：
                            <el-checkbox-group v-model="weaknessQuery.weaktypes" class="mr20 inline-block" :min="1">
                                <el-checkbox v-for="item in WEAKTYPES" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </span>
                        <span class="text-nowrap">{{$t('security.severity')}}：
                            <el-checkbox-group v-model="weaknessQuery.severitys" class="mr20 inline-block" :min="1">
                                <el-checkbox v-for="item in SEVERITYS" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </span>
                    </el-col>
                </el-row>
                <el-row class="mt10"  v-loading="!weaknessData.day_data">
                    <el-col :span="16"  class="boder-right left-box">
                        <p class="border-left">{{$t('security.assetslist.weaknessTrend')}}</p>
                        <div class="content">
                            <!-- 图表  -->
                            <charts-line
                                v-if="showWeaknessChart"
                                :legend-visible="true"
                                :chart-data="weaknessChartData.datas"
                                :settings="weaknessChartData.settings"
                                :loading="weaknessChartData.loading"
                                :data-empty="weaknessChartData.dataEmpty"
                                height="310px">
                            </charts-line>
                            <span v-else class="text color-secondary">{{$t('common.noData')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8" class="right-box">
                        <p class="border-left">{{$t('security.assetslist.topWeakness')}}</p>
                        <div class="content">
                            <server-info-bar class="mb20" v-for="(item, index) in weaknessData.sum_data" :key="index" :data="item" />
                            <div class="text color-secondary">{{$t('common.noData')}}</div>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="mt20" shadow="hover">
                <!-- 头部 -->
                <div slot="header">
                    <span>{{$t('security.assetslist.intrusionEvent')}}</span>
                    <el-radio-group v-model="eventQuery.timeperiod" class="pull-right header-radio-group">
                        <el-radio border name="7天" :label="7">7天</el-radio>
                        <el-radio border name="30天" :label="30">30天</el-radio>
                    </el-radio-group>
                </div>
                <!-- 主体 -->
                <el-row>
                    <!-- 选择框 -->
                    <el-col :span="24">
                        <span class="text-nowrap">{{$t('common.type')}}：
                            <el-checkbox-group v-model="eventQuery.eventtypes" class="mr20 inline-block" :min="1">
                                <el-checkbox v-for="item in EVENTTYPES" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </span>
                        <span class="text-nowrap">{{$t('security.severity')}}：
                            <el-checkbox-group v-model="eventQuery.severitys" class="mr20 inline-block" :min="1">
                                <el-checkbox v-for="item in SEVERITYS" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </span>
                    </el-col>
                </el-row>
                <el-row class="mt10" v-loading="!eventData.day_data" >
                    <el-col :span="16"  class="boder-right left-box">
                        <p class="border-left">{{$t('security.assetslist.intrusionEventTrend')}}</p>
                        <div class="content">
                            <!-- 图表  -->
                            <charts-line
                                v-if="showEventChart"
                                :legend-visible="true"
                                :chart-data="eventChartData.datas"
                                :settings="eventChartData.settings"
                                :loading="eventChartData.loading"
                                :data-empty="eventChartData.dataEmpty"
                                height="310px">
                            </charts-line>
                            <span v-else class="text color-secondary">{{$t('common.noData')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8" class="right-box">
                        <p class="border-left">{{$t('security.assetslist.topSecurityEvent')}}</p>
                        <div class="content">
                            <server-info-bar class="mb20" v-for="(item, index) in eventData.sum_data" :key="index" :data="item" />
                            <span class="text color-secondary">{{$t('common.noData')}}</span>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <product />
        </el-col>
    </el-row>
</div>
</template>
<script>
import Product from '@/components/product/Index.vue';
import ChartsLine from '@/components/charts/ChartsLine.vue';
import detectModule from './detectModule/Index';
import InfoPanel from './InfoPanel';
import ServerInfoBar from './ServerInfoBar';
import {event, weakness, info} from '@/service/security';
import {EVENTTYPES, SEVERITYS, WEAKTYPES} from '@/constants/dicts/security.js';
import {mapMutations, mapGetters} from 'vuex';

export default {
    name: 'Overview',
    data() {
        return {
            EVENTTYPES,
            SEVERITYS,
            WEAKTYPES,
            infoData: {},
            weaknessData: {},
            weaknessQuery: {
                timeperiod: 7,
                weaktypes: ['leak', 'baseline', 'weakpwd'],
                severitys: ['1', '2', '3', '4']
            },
            eventData: {},
            eventQuery: {
                timeperiod: 7,
                eventtypes: ['bruteforce', 'portscan', 'abnlogin', 'webshell', 'host_anomaly'],
                severitys: ['1', '2', '3', '4']
            }
        };
    },
    created() {
        this.fetechInfo();
        this.fetechWeakness();
        this.fetechEvent();
    },
    computed: {
        ...mapGetters('security', ['scanedTody']),
        ...mapGetters('user', ['isAutherized']),
        showEventChart() {
            return (
                this.eventData &&
                this.eventData.day_data &&
                Object.keys(this.eventData.day_data) &&
                Object.keys(this.eventData.day_data).length > 0
            );
        },
        showWeaknessChart() {
            return (
                this.weaknessData &&
                this.weaknessData.day_data &&
                Object.keys(this.weaknessData.day_data) &&
                Object.keys(this.weaknessData.day_data).length > 0
            );
        },
        eventChartData() {
            if (!this.eventData.day_data) return {};
            let rawData = this.eventData.day_data;
            let datas = this.formatChartData({
                rawData,
                key: 'day'
            });
            let settings = {
                labelMap: {
                    portscan: '端口扫描',
                    abnlogin: '主机异常',
                    host_anomaly: '主机异常',
                    bruteforce: '暴力破解',
                    webshell: '主机木马'
                },
                area: datas.columns.length < 4
            };
            return {
                settings,
                datas,
                dataEmpty: false
            };
        },
        weaknessChartData() {
            if (!this.weaknessData.day_data) return {};
            let rawData = this.weaknessData.day_data;
            let datas = this.formatChartData({
                rawData,
                key: 'day'
            });
            let settings = {
                labelMap: {
                    leak: '漏洞',
                    baseline: '基线',
                    weakpwd: '弱口令'
                },
                area: datas.columns.length < 4
            };
            return {
                settings,
                datas,
                dataEmpty: false
            };
        }
    },
    watch: {
        eventQuery: {
            deep: true,
            handler: function() {
                this.fetechEvent();
            }
        },
        weaknessQuery: {
            deep: true,
            handler: function() {
                this.fetechWeakness();
            }
        }
    },
    methods: {
        ...mapMutations('security', ['setInfo']),
        formatChartData({rawData, key}) {
            let columns = ['day'];
            let rows = [];
            for (const key in rawData) {
                if (rawData.hasOwnProperty(key)) {
                    // 获取列数据
                    const element = rawData[key];
                    element.map(e => {
                        // 获取表头
                        if (columns.indexOf(key) === -1) {
                            columns.push(key);
                        }
                        let item = rows.find(r => r.day === e.day);
                        if (item) {
                            item[key] = e.count;
                        } else {
                            item = {day: e.day};
                            item[key] = e.count;
                            rows.push(item);
                        }
                    });
                }
            }
            return {
                columns,
                rows
            };
        },
        async fetechInfo() {
            try {
                this.infoData = {};
                // 发送请求
                let ret = await info();
                console.log('info', ret);
                if (ret) {
                    this.infoData = ret;
                    this.setInfo(ret);
                } else {
                    throw new Error('无数据。');
                }
            } catch (error) {
                console.warn('fetechInfo 失败', error.message);
                this.infoData = {};
            }
        },
        async fetechEvent() {
            try {
                let params = this.eventQuery;
                // 清空旧数据
                this.eventData = {};
                // 发送请求
                let ret = await event(params);
                if (ret) {
                    this.eventData = ret;
                } else {
                    throw new Error('无数据。');
                }
            } catch (error) {
                console.warn('fetechEvent 失败', error.message);
                this.eventData = {
                    day_data: {},
                    sum_data: []
                };
            }
        },
        async fetechWeakness() {
            try {
                let params = this.weaknessQuery;
                // 清空旧数据
                this.weaknessData = {};
                // 发送请求
                let ret = await weakness(params);
                if (ret) {
                    this.weaknessData = ret;
                } else {
                    throw new Error('无数据。');
                }
            } catch (error) {
                console.warn('fetechEvent 失败', error.message);
                this.weaknessData = {
                    day_data: {},
                    sum_data: []
                };
            }
        }
    },
    components: {
        Product,
        detectModule,
        ChartsLine,
        InfoPanel,
        ServerInfoBar
    }
};
</script>
<style lang="scss">
.security-overview {
    .header-action-btn {
        min-width: 60px;
    }
    .el-checkbox + .el-checkbox {
        margin-left: 10px;
    }
    .el-checkbox__label {
        padding-left: 5px;
        font-size: 12px;
    }
    .boder-right {
        border-right: 1px solid #edeef2;
    }
    
    .left-box,
    .right-box {
        min-height: 240px;
        .content {
            height: 260px;
            overflow: hidden;
            text-align: center;
            .text {
                font-size: 24px;
                line-height: 260px;
            }
        }
    }

    .right-box {
        box-sizing: border-box;
        padding-left: 10px;
    }
    // 若有数据 暂无数据 不显示
    .server-info-bar + .text{
        display: none!important;
    }
}
</style>
