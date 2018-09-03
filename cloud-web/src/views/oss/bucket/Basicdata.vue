<template>
    <div class="basicdata mt10">
        <el-row>
            <el-col :span="6">
                <span class="font16 lh32">基础数据</span>
            </el-col>
            <el-col :span="18" class="text-right lh32">
                <el-radio-group class="primary mr10" v-model="form.dataItem" size="small">
                    <el-radio label="0" border>今天</el-radio>
                    <el-radio label="1" border>昨天</el-radio>
                    <el-radio label="2" border>七天</el-radio>
                </el-radio-group>
                <el-date-picker v-model="form.daterange" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row class="mt10">
            <el-col :span="24">
                <section class="chart-box">
                    <h5>存储空间</h5>
                    <div class="chart mt10">
                        <charts-line :legend-visible="false" :loading="loading" :chart-data="capacityChartData.datas" :settings="capacityChartData.settings" :chartExtendData="capacityChartData.chartExtend" height="320px"></charts-line>
                    </div>
                </section>
                <section class="chart-box">
                    <h5>请求次数</h5>
                    <div class="chart mt10">
                        <charts-line :legend-visible="false" :loading="loading" :chart-data="requestChartData.datas" :settings="requestChartData.settings" :chartExtendData="requestChartData.chartExtend" height="320px"></charts-line>
                    </div>
                </section>
                <section class="chart-box">
                    <h5>使用流量</h5>
                    <div class="chart mt10">
                        <charts-line :legend-visible="false" :loading="loading" :chart-data="transferChartData.datas" :settings="transferChartData.settings" :chartExtendData="transferChartData.chartExtend" height="320px"></charts-line>
                    </div>
                </section>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ChartsLine from '@/components/charts/ChartsLine';
import {getBucketData} from '@/service/oss/index';
import {echartToVchartData, dateFormat, isEmpty} from '@/utils/utils';
let chartExtend = {
    grid: {
        top: 10,
        bottom: 0
    }
};
export default {
    name: 'Basicdata',
    data() {
        return {
            loading: true,
            form: {
                dataItem: '2',
                daterange: [],
                startTime: '',
                endTime: ''
            },
            capacityChartData: {
                settings: {
                    labelMap: {
                        mem: '存储占用量(M)'
                    }
                    // dataType: {
                    //     mem: 'percent'
                    // }
                },
                datas: {
                    columns: ['date', 'mem'],
                    rows: []
                },
                loading: false,
                dataEmpty: false,
                chartExtend
            },
            requestChartData: {
                settings: {
                    labelMap: {
                        get: 'Get类请求(次)',
                        put: 'Put类请求(次)'
                    }
                    // dataType: {
                    //     mem: 'percent'
                    // }
                },
                grid: {
                    top: 10,
                    bottom: 0
                },
                datas: {
                    columns: ['date', 'get', 'put'],
                    rows: []
                },
                loading: false,
                dataEmpty: false,
                chartExtend
            },
            transferChartData: {
                settings: {
                    labelMap: {
                        transfer: '下载流量(M)'
                    }
                    // dataType: {
                    //     mem: 'percent'
                    // }
                },
                grid: {
                    top: 10,
                    bottom: 0
                },
                datas: {
                    columns: ['date', 'transfer'],
                    rows: []
                },
                loading: false,
                dataEmpty: false,
                chartExtend
            }
        };
    },
    components: {
        ChartsLine
    },
    props: {
        bucketId: {
            type: String,
            default: ''
        }
    },
    watch: {
        'form.dataItem': function() {
            this.getBucket();
        },
        'form.daterange': function(newval) {
            if (!isEmpty(newval)) {
                this.form.startTime = dateFormat(newval[0], 'YYYY-MM-DD HH:mm:ss');
                this.form.endTime = dateFormat(newval[1], 'YYYY-MM-DD HH:mm:ss');
                this.form.dataItem = '4';
            } else { // 没有选择日期默认查7天数据
                this.form.startTime = '';
                this.form.endTime = '';
                this.form.dataItem = '2';
            }
            
        }
    },
    created() {
        if (this.bucketId) {
            this.getBucket();
        }
    },
    methods: {
        getBucket() {
            this.loading = true;
            let post = {
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                dataItem: this.form.dataItem
            };
            getBucketData(this.bucketId, post)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.capacityChartData.datas.rows = echartToVchartData(res.result, {date: res.result.capacity.times, mem: 'capacity'}, 'MM-DD HH:mm');
                        this.requestChartData.datas.rows = echartToVchartData(res.result, {date: res.result.get.times, get: 'get', put: 'put'}, 'MM-DD HH:mm');
                        this.transferChartData.datas.rows = echartToVchartData(res.result, {date: res.result.transfer.times, transfer: 'transfer'}, 'MM-DD HH:mm');
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style scoped lang="scss">
</style>
