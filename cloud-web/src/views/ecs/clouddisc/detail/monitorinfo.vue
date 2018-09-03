<template>
    <div class="page-main">
        <ecs-disk-detail-header :rowItem='rowItem' @refresh="refresh"></ecs-disk-detail-header>
        <div class="page-body">
            <!-- 监控信息 -->
            <div class="monitor">
                <div class="selDate mt20 mb20">
                    <span class="font16">监控信息</span>
                    <div class="right font12">
                        <span>选择日期：</span>
                        <el-date-picker v-model="monitorDate" type="daterange" align="right" size="small" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                        </el-date-picker>
                    </div>
                </div>

                <!-- IOPS -->
                <div class="IOPS mb20">
                    <div class="title">
                        <b class="leftBlueBox mr5"></b>IOPS(个)</div>
                    <charts-line class="chart" :legend-visible="false" :chartExtendData="iopsChartData.chartExtendData" :chart-data="iopsChartData.datas" :settings="iopsChartData.settings" height="240px"></charts-line>
                </div>
                <!-- 分割线 -->
                <div class="mt20 mb20">
                    <hr>
                </div>
                <!-- 吞吐量 -->
                <div class="IOPS mb20">
                    <div class="title">
                        <b class="leftBlueBox mr5"></b>吞吐量(MBps)</div>
                    <charts-line :legend-visible="false" :chartExtendData="mbpsChartData.chartExtendData" :chart-data="mbpsChartData.datas" :settings="mbpsChartData.settings" height="240px"></charts-line>
                </div>
            </div>
        </div>

        <!-- 对话框 创建快照 -->
        <create-snap-dialog ref="CreateSnapDialog" />
        <!-- 对话框 设置自动快照策略 -->
        <set-auto-snap-dialog ref="SetAutoSnapDialog" />
    </div>
</template>

<script>
import EcsDiskDetailHeader from './detailHeader';
import ChartsLine from '@/components/charts/ChartsLine.vue';
import {moniterEchartMetricData} from '@/service/ecs/overview';
import {convertToVchartData} from '@/utils/utils';
import {getDiskList} from '@/service/ecs/disk/disk.js';

export default {    
    data() {
        let chartExtendData = {
            grid: {
                // 网格配置
                bottom: '12%', // 离容器下侧的距离（留白）。
                left: '5%', // 离容器左侧的距离（留白）。
                right: '5%', // 离容器右侧的距离（留白）。
                top: '9%' // 离容器上侧的距离（留白）。
            },
            legend: {
                // 图列组件的配置
                bottom: '0'
            },
            yAxis: {
                //设置类别
                type: 'value',
                //y轴刻度
                axisLabel: {
                    //设置y轴数值为%
                    formatter: '{value} %'
                }
            }
        };
        let chartData = {
            chartExtendData,
            settings: {
                labelMap: {
                    cpu: 'IOPS'
                },
                dataType: {
                    IOPS: 'percent'
                },
                area: true
            },
            datas: {}
        };
        return {
            stateParams: {},
            rowItem: {},
            pickerOptions2: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            monitorDate: '',
            iopsChartData: Object.assign({}, chartData),
            mbpsChartData: Object.assign({}, chartData)
        };
    },
    components: {
        EcsDiskDetailHeader,
        ChartsLine,       
    },
    created() {
        this.stateParams = this.$route.params || {};
        if (this.stateParams && this.stateParams.item) {
            this.rowItem = this.stateParams.item;
            this.searchCharts('iops');
            this.searchCharts('mbps');
        } else {
            //刷新页面，路由参数item会丢失，则通过id查询磁盘信息
            this.getDiskInfoById().then(res => {
                this.searchCharts('iops');
                this.searchCharts('mbps');
            }); //获取磁盘信息
        }
    },
    methods: {
        //刷新
        refresh(){
            this.getDiskInfoById().then(res => {
                this.searchCharts('iops');
                this.searchCharts('mbps');
            });
        },
        //获取云盘列表数据
        async getDiskInfoById() {
            console.log('this.stateParams----------------', this.stateParams);
            let params = {
                paging: {
                    pageIndex: 1,
                    limit: 10
                },
                id: this.stateParams.id //传入磁盘id
            };
            return getDiskList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let resData = res.result;
                    if (resData && resData.records) {
                        this.rowItem = resData.records[0] || {};
                    }
                }
            });
        },
        //查询图表数据
        searchCharts: function(dataType) {
            if (!this.rowItem.instanceId || !this.rowItem.mount) return;
            let now = new Date();
            let st = new Date(now);
            st.setHours(st.getHours() - 2);
            let filters = this.$options.filters;
            let data = {
                startTime: filters['date'](st, 'YYYY-MM-DD HH:mm:ss'),
                endTime: filters['date'](now, 'YYYY-MM-DD HH:mm:ss'),
                dataType: dataType, //'iops','mbps'
                instanceType: 'disk',
                instanceId: this.stateParams.instanceId,
                mount: this.rowItem.mount
            };
            moniterEchartMetricData(data).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let datas = res.result || [];
                    let echartDatas = convertToVchartData(datas);
                    switch (dataType) {
                        case 'iops': {
                            this.iopsChartData.datas = echartDatas;
                            break;
                        }
                        case 'mbps': {
                            this.mbpsChartData.datas = echartDatas;
                            break;
                        }
                        default: {
                        }
                    }
                }
            });
        },
       
    },    
};
</script>
 
<style scoped lang="scss">
.diskMonitorInfo {
    padding: 0 15px;
    .head {
        border-bottom: 1px solid #e8e8e8;
        height: 70px;
        line-height: 70px;
        .right {
            float: right;
        }
    }
    .monitor {
        .selDate {
            line-height: 32px;
            &::after {
                content: '';
                display: block;
                clear: both;
            }
        }
        .right {
            float: right;
        }
    }
    .chart {
        width: 100%;
    }
    .hr {
        border: 1px solid #e4eaec;
    }
}
</style>
 