<template>
    <div class="page-main diskMonitorInfo">
        <ecs-disk-detail-header :rowItem='rowItem' @refresh="refresh"></ecs-disk-detail-header>
        <div class="page-body">
            <!-- 监控信息 -->
            <div class="monitor">
                <div class="selDate mt10 mb20">
                    <span class="font16">监控信息</span>
                    <div class="pull-right font12">
                        <el-date-picker v-model="monitorDate" :clearable="true" @change="selTime();" type="daterange" align="right" size="small" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                        </el-date-picker>
                    </div>
                </div>

                <!-- IOPS -->
                <div class="IOPS mb20" >
                    <div class="title">
                        <b class="leftBlueBox mr5"></b>IOPS
                    </div>
                    <div style="height: 280px;" v-loading="loading_iops">
                        <echarts-line 
                            v-if="seriesData_iops.length > 0"
                            :isMarkPoint="false"
                            :legendData="legendData_iops"  
                            :seriesData="seriesData_iops" 
                            :xAxisData="xData_iops" 
                            legendIcon="rect"
                            yUnit="b/s"
                            :gridVal="gridVal"
                            :markPointSymbolSize="['150','55']" 
                            :mouldColor="['#0d7ef2', '#ffad00', '#61a0a8', '#c4ccd3']"
                            :dotStyle="['b0e9c4', 'b0e9c4']" >
                        </echarts-line>
                        <div v-else-if="!loading_iops" class="color-secondary font24 text-c no-data">暂无数据</div>
                    </div>
                </div>
                <!-- 分割线 -->
                <div class="mt20 mb20">
                    <hr>
                </div>
                <!-- 吞吐量 -->
                <div class="IOPS mb20">
                    <div class="title">
                        <b class="leftBlueBox mr5"></b>吞吐量
                    </div>
                    <div style="height: 280px;" v-loading="loading_mbps">
                        <echarts-line 
                            v-if="seriesData_mbps.length > 0"
                            :isMarkPoint="false"
                            :legendData="legendData_mbps"  
                            :seriesData="seriesData_mbps" 
                            :xAxisData="xData_mbps" 
                            legendIcon="rect"
                            yUnit="b/s"
                            :gridVal="gridVal"
                            :markPointSymbolSize="['150','55']" 
                            :mouldColor="['#0d7ef2', '#ffad00', '#61a0a8', '#c4ccd3']" 
                            :dotStyle="['b0e9c4', 'b0e9c4']">
                        </echarts-line>
                        <div v-else-if="!loading_mbps" class="color-secondary font24 text-c no-data">暂无数据</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import EcsDiskDetailHeader from './detailHeader';
import EchartsLine from '@/components/charts/EchartsLine.vue';
import {moniterEchartMetricData} from '@/service/ecs/overview';
import {getDiskList} from '@/service/ecs/disk/disk.js';

export default {    
    data() {
        return {
            dateRange: '',
            stateParams: {},
            rowItem: {},
            legendData_iops:['读', '写', '总'],
            legendData_mbps:['读', '写', '总'],
            seriesData: [{
                seriesData: [1, 2, 2, 3]
            }],
            xData_iops: [],
            xData_mbps: [],
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
            seriesData_iops: [],
            seriesData_mbps: [],
            startTime: '',
            endTime: '',
            loading_iops: true,
            loading_mbps: true,
            gridVal: {
                bottom: '60',
                right: '70',
                left: '80',
                top: '50'
            }
        };
    },
    components: {
        EcsDiskDetailHeader,
        EchartsLine 
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
                    let resData = res.data;
                    console.log(resData);
                    if (resData && resData.data) {
                        this.rowItem = resData.data[0] || {};
                    }
                }
            });
        },
        //查询图表数据
        searchCharts: function(dataType) {
            this.loading_iops = true;
            this.loading_mbps = true;
            if (!this.serverId){
                this.loading_iops = false;
                this.loading_mbps = false;
                return;
            } 
            let now = new Date();
            let st = new Date(now);
            st.setHours(st.getHours() - 2);
            let filters = this.$options.filters;

            let data = {
                startTime: this.startTime || filters['date'](st, 'YYYY-MM-DD HH:mm:ss'),
                endTime: this.endTime || filters['date'](now, 'YYYY-MM-DD HH:mm:ss'),
                dataType: dataType, //'iops','mbps'
                instanceType: 'disk',
                instanceId: this.serverId,
                mount: '/dev/vdc'
            };
            moniterEchartMetricData(data).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let datas = res.data || [];
                    console.warn(datas);
                    switch (dataType) {
                        case 'iops': {
                            this.loading_iops = false;
                            this.seriesData_iops = datas;
                            this.xData_iops = datas[0].xData;
                            break;
                        }
                        case 'mbps': {
                            this.loading_mbps = false;
                            this.seriesData_mbps = datas;
                            this.xData_mbps = datas[0].xData;
                            break;
                        }
                        default: {
                        }
                    }
                }
            });
        },
        selTime() {
            let filters = this.$options.filters;
            this.startTime = this.monitorDate && filters['date'](this.monitorDate[0], 'YYYY-MM-DD HH:mm:ss') || '';
            this.endTime = this.monitorDate && filters['date'](this.monitorDate[1], 'YYYY-MM-DD HH:mm:ss') || '';
            this.searchCharts('iops');
            this.searchCharts('mbps');
        }
    },
    computed: {
        serverId() {
            return this.rowItem.attachments && this.rowItem.attachments.length > 0 && this.rowItem.attachments[0].serverId;
        } 
    }     
};
</script>
 
<style lang="scss">
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
            .el-input__inner{
                width: 300px;
            }
        }
        .no-data{
            display: flex;
            align-items: center;
            justify-content: center;
            height:100%;
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
 