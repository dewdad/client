<template>
    <div class="basicdata mt10">
        <el-row>
            <el-col :span="6">
                <span class="font16 lh32">基础数据</span>
            </el-col>
        </el-row>
        <el-alert :title="$t('oss.overviewTips')" type="warning" :closable="false">
        </el-alert>
        <!-- <el-row class="mt10">
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
        </el-row> -->
    </div>
</template>

<script>
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
    },
    props: {
        bucketId: {
            type: String,
            default: ''
        }
    },
    watch: {
    },
    created() {
    },
    methods: {
    }
};
</script>
<style scoped lang="scss">
</style>
