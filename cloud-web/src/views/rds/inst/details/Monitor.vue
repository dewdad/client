<template>
    <div>
        <!-- <page-header>
            监控实例
            <div slot="right">
                <router-link :to="'app'" class="el-button el-button--small el-button--primary" target="_blank">
                    <i class="iconfont icon-shezhi"></i> 设置报警规则</router-link>
            </div>
        </page-header> -->
        <el-tabs v-model="monitortype">
            <el-tab-pane v-for="item in monitortypelist" :key="item.value" :name="item.key" :label="item.value"></el-tab-pane>
        </el-tabs>
        <div class="panel panel-default ">
            <div class="panel-heading"> 监控信息
                <div class="text-right header-radio-group panel-heading__right">
                    <el-radio-group class="primary" v-model="searchParams.period" size="mini" @change="timeChange">
                        <!-- <el-radio v-for="item in timelist" :key="item.value" border :label="item.key">{{item.value}}</el-radio> -->
                        <el-radio border name="1小时" label="1h">1小时</el-radio>
                        <el-radio border name="6小时" label="6h">6小时</el-radio>
                        <el-radio border name="1天" label="1d">1天</el-radio>
                        <el-radio border name="7天" label="7d">7天</el-radio>
                        <el-radio border name="30天" label="30d">30天</el-radio>
                    </el-radio-group>
                    <el-date-picker size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="panel-body">
                <el-row class="mt20">
                    <el-col :span="24" v-if="monitortype === 'first'">
                        <section class="chart-box">
                            <h5>CPU和内存利用率</h5>
                            <div class="chart mt10">
                                <echarts-line v-if="xData_cpu.length > 0" :legendData="legendData_cpu" :seriesData="seriesData_cpu" :xAxisData="xData_cpu" :markPointSymbolSize="['168','55']" :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']" :dotStyle="['ffc299', 'cbcef1']">
                                </echarts-line>
                                <div v-else class="content text-center">
                                    <span class="text color-secondary">暂无数据</span>
                                </div>
                            </div>
                        </section>
                        <section class="chart-box">
                            <h5>磁盘空间</h5>
                            <div class="chart mt10">
                                <echarts-line v-if="xData_disk.length > 0" :legendData="legendData_disk" :seriesData="seriesData_disk" :xAxisData="xData_disk" :markPointSymbolSize="['168','55']" :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']" :dotStyle="['ffc299', 'cbcef1']">
                                </echarts-line>
                                <div v-else class="content text-center">
                                    <span class="text color-secondary">暂无数据</span>
                                </div>
                            </div>
                        </section>
                        <section class="chart-box">
                            <h5>IOPS</h5>
                            <div class="chart mt10">
                                <echarts-line v-if="xData_iops.length > 0" :legendData="legendData_iops" :seriesData="seriesData_iops" :xAxisData="xData_iops" :markPointSymbolSize="['168','55']" :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']" :dotStyle="['ffc299', 'cbcef1']">
                                </echarts-line>
                                <div v-else class="content text-center">
                                    <span class="text color-secondary">暂无数据</span>
                                </div>
                            </div>
                        </section>
                    </el-col>
                    <el-col :span="24" v-if="monitortype === 'second'">
                        <section class="chart-box">
                            <h5>数据库总连接数</h5>
                            <div class="chart mt10">
                                <echarts-line v-if="xData_content.length > 0" :legendData="legendData_content" :seriesData="seriesData_content" :xAxisData="xData_content" :markPointSymbolSize="['168','55']" :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']" :dotStyle="['ffc299', 'cbcef1']">
                                </echarts-line>
                                <div v-else class="content text-center">
                                    <span class="text color-secondary">暂无数据</span>
                                </div>
                            </div>
                        </section>
                        <section class="chart-box">
                            <h5>TPS(平均每秒事务数) /QPS(平均每秒SQL语句执行次数)</h5>
                            <div class="chart mt10">
                                <echarts-line v-if="xData_tps.length > 0" :legendData="legendData_tps" :seriesData="seriesData_tps" :xAxisData="xData_tps" :markPointSymbolSize="['168','55']" :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']" :dotStyle="['ffc299', 'cbcef1']">
                                </echarts-line>
                                <div v-else class="content text-center">
                                    <span class="text color-secondary">暂无数据</span>
                                </div>
                            </div>
                        </section>
                        <section class="chart-box">
                            <h5>InnoDB缓存读命中率、使用率、脏块率</h5>
                            <div class="chart mt10">
                                <echarts-line v-if="xData_cache.length > 0" :legendData="legendData_cache" :seriesData="seriesData_cache" :xAxisData="xData_cache" :markPointSymbolSize="['168','55']" :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']" :dotStyle="['ffc299', 'cbcef1']">
                                </echarts-line>
                                <div v-else class="content text-center">
                                    <span class="text color-secondary">暂无数据</span>
                                </div>
                            </div>
                        </section>
                        <section class="chart-box">
                            <h5>InnoDB读写量</h5>
                            <div class="chart mt10">
                                <echarts-line v-if="xData_write.length > 0" :legendData="legendData_write" :seriesData="seriesData_write" :xAxisData="xData_write" :markPointSymbolSize="['168','55']" :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']" :dotStyle="['ffc299', 'cbcef1']">
                                </echarts-line>
                                <div v-else class="content text-center">
                                    <span class="text color-secondary">暂无数据</span>
                                </div>
                            </div>
                        </section>
                    </el-col>
                </el-row>

            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import {DICT_RDS} from '@/constants/dicts/rds';
import {dateFormat} from '@/utils/utils';
import {resourcesMoniterData, engineMoniterData} from '@/service/rds/monitor';
import EchartsLine from '@/components/charts/EchartsLine.vue';

export default {
    name: 'Monitor',
    data() {
        return {
            loading: false,
            monitortypelist: DICT_RDS.MONITOR_TYPE,
            monitortype: DICT_RDS.MONITOR_TYPE[0].key,
            searchParams: {
                period: '1d',
                startTime: '',
                endTime: ''
            },
            daterange: [],
            legendData_cpu: ['cpu', '内存'],
            seriesData_cpu: [],
            xData_cpu: [],
            legendData_disk: ['磁盘空间'],
            seriesData_disk: [],
            xData_disk: [],
            legendData_iops: ['iops'],
            seriesData_iops: [],
            xData_iops: [],
            legendData_content: ['总连接数'],
            seriesData_content: [],
            xData_content: [],
            legendData_tps: ['tps', 'ops'],
            seriesData_tps: [],
            xData_tps: [],
            legendData_cache: ['利用率', '命中率', '脏块率'],
            seriesData_cache: [],
            xData_cache: [],
            legendData_write: ['读取', '写入'],
            seriesData_write: [],
            xData_write: []
        };
    },
    components: {
        EchartsLine
    },
    computed: {
        ...mapState({
            rdsInst: state => state.rds.instance
        }),
        instId: function() {
            return this.$route.params.id;
        }
    },
    watch: {
        'monitortype': function() {
            this.getChartData();
        },
        'searchParams.endTime': function() {
            this.getChartData();
        }
    },
    created() {
        let date = new Date();
        // 设置默认查询时间一天内
        this.searchParams.startTime = dateFormat(date, 'YYYY-MM-DD HH:mm:ss');
        this.searchParams.endTime = dateFormat(date.setDate(date.getDate() - 1), 'YYYY-MM-DD HH:mm:ss');
        this.getChartData();
    },
    methods: {
        getChartData() {
            this.loading = true;
            // 资源监控
            if (this.monitortype === 'first') {
                this.resourcesMoniterData();
            }
            // 引擎监控
            if (this.monitortype === 'second') {
                this.engineMoniterData();
            }
        },
        resourcesMoniterData() {
            resourcesMoniterData(this.instId, {startTime: this.searchParams.startTime, endTime: this.searchParams.endTime})
                .then(res => {
                    console.warn(res);
                    if (res[0] && res[0].data && res[0].data.code && res[0].data.code === '0000') {
                        this.seriesData_cpu = res[0].data.result;
                        this.xData_cpu = this.seriesData_cpu[0].xData;
                    }
                    if (res[1] && res[1].data && res[1].data.code && res[1].data.code === '0000') {
                        this.seriesData_disk = res[1].data.result;
                        this.xData_disk = this.seriesData_disk[0].xData;
                    }
                    if (res[2] && res[2].data && res[2].data.code && res[2].data.code === '0000') {
                        this.seriesData_iops = res[2].data.result;
                        this.xData_iops = this.seriesData_iops[0].xData;
                    }
                    if (res[3] && res[3].data && res[3].data.code && res[3].data.code === '0000') {
                        this.seriesData_content = res[3].data.result;
                        this.xData_content = this.seriesData_content[0].xData;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        engineMoniterData() {
            engineMoniterData(this.instId, {startTime: this.searchParams.startTime, endTime: this.searchParams.endTime})
                .then(res => {
                    console.warn(res);
                    if (res[0] && res[0].data && res[0].data.code && res[0].data.code === '0000') {
                        this.seriesData_tps = res[0].data.result;
                        this.xData_tps = this.seriesData_tps[0].xData;
                    }
                    if (res[1] && res[1].data && res[1].data.code && res[1].data.code === '0000') {
                        this.seriesData_cache = res[1].data.result;
                        this.xData_cache = this.seriesData_cache[0].xData;
                    }
                    if (res[2] && res[2].data && res[2].data.code && res[2].data.code === '0000') {
                        this.seriesData_write = res[2].data.result;
                        this.xData_write = this.seriesData_write[0].xData;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 时间选择改变时执行
        timeChange(value) {
            let date = new Date();
            this.searchParams.startTime = dateFormat(date, 'YYYY-MM-DD HH:mm:ss');
            switch (value) {
                case '1h':
                    date.setHours(date.getHours() - 1); // 1小时内
                    break;
                case '6h':
                    date.setHours(date.getHours() - 6); // 6小时内
                    break;
                case '1d':
                    date.setDate(date.getDate() - 1); // 1天内
                    break;
                case '7d':
                    date.setDate(date.getDate() - 7); // 7天内
                    break;
                case '30d':
                    date.setMonth(date.getMonth() - 1); // 1个月内
                    break;
                default:
                    date.setDate(date.getDate() - 1);
                    break;
            }
            this.searchParams.endTime = dateFormat(date, 'YYYY-MM-DD HH:mm:ss');
        }
    }
};
</script>
<style scoped>
</style>
