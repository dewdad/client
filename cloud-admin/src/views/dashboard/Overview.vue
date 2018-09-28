<template>
    <div class="page-main overflow-box">
        <!-- 外层 -->
        <el-row :gutter="20" style="height: 100%;">
            <el-col :span="24" class="el-col-box" style="height: 100%;">
                <!-- 上部分 -->
                <el-row :gutter="20">
                    <!-- 弹性云主机 -->
                    <el-col :span="8">
                        <div class="cloud-host" style="min-height: 528px;">
                            <div class="cloud-host__title">
                                <div class="pull-left cloud-host__title__icon">
                                    <i class="iconfont icon-yunzhuji-gailan"></i>
                                </div>
                                <div>
                                    <div style="height: 20px;" class="font16">弹性云主机</div>
                                    <div style="line-height:28px;height:28px;">
                                        <span class="is-bold font25">{{usages.instances || 0 }}</span>个
                                        <!-- <span style="margin-top:3px;" class="pull-right color-secondary">
                                            较上月同期：
                                            <span class="color-success">+{{addAmount || 0 }}个</span>
                                        </span> -->
                                    </div>
                                </div>
                            </div>
                            <h5 class="cloud-host__data">
                                <div class="pull-left">
                                    <span class="color-secondary font14 mb5 inline-block">近{{timeVal}}日警告线</span>
                                    <br>
                                    <span class="font16">{{ecsTotal}}个</span>
                                </div>
                                <div class="pull-right" style="width: 100px;">
                                    <el-select v-model="timeVal" @change="selEcsFn" placeholder="请选择" size="mini">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </h5>
                            <div style="height: 350px;">
                                <!-- 图表 -->
                                <echarts-line
                                v-if="xData.length > 0"
                                :gridVal="gridVal" 
                                :legendData="legendData"
                                :seriesData="seriesData" 
                                :xAxisData="xData" 
                                :isMarkPoint="false"
                                yUnit=" "
                                :markPointSymbolSize="['150','55']" 
                                :mouldColor="['#3ac76c', '#0d7ef2', '#61a0a8', '#c4ccd3']" 
                                :dotStyle="['b0e9c4', 'b0e9c4']" 
                                :idString="'mychart'"></echarts-line>
                                <div v-else class="color-secondary text-c font20" style="line-height: 350px">暂无数据</div>
                            </div>
                        </div>
                    </el-col>
                    <!-- CPU、内存、磁盘 -->
                    <el-col :span="16">
                        <div class="cpu_net-box"> 
                            <div class="cpu item back-white mr20">
                                <div class="item__title">
                                    <span>CPU</span>
                                    <span class="pull-right">
                                        <i class="dot" :class="{'color-warning': getUsage(usages.cpu, quota.cpu)}"></i> 总配额：{{quota.cpu || '0'}}个
                                    </span>
                                </div>
                                <!-- CPU 饼图 -->
                                <div class="item__data">
                                    <div style="width:154px;height:154px;float:left;background: #fff;">
                                        <echarts-pie v-if="seriesDataCpu.length > 0" :seriesData="seriesDataCpu"></echarts-pie>
                                        <div v-else style="line-height:154px;" class="color-secondary font18 text-c">暂无数据</div>
                                    </div>
                                    <div class="text-r" style="height:77px; border-bottom: 1px solid #ebf3f7;">
                                        <div class="font30 icon-box" :class="{'color-warning': getUsage(usages.cpu, quota.cpu)}">
                                            {{usages.cpu || '0'}}
                                            <span class="icon" v-if="getUsage(usages.cpu, quota.cpu)">
                                                <el-tooltip class="item" effect="light" content="即将达到上限" placement="right">
                                                    <i class="iconfont icon-wuuiconsuotanhao font14"></i>
                                                </el-tooltip>
                                            </span>
                                        </div>
                                        <span class="color-secondary font14">已使用</span>
                                    </div>
                                    <div class="text-r mt10">
                                        <div class="font30 lh30">{{parseInt(quota.cpu-usages.cpu) || '0'}}</div>
                                        <span class="color-secondary font14">可用</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mem item back-white">
                                <div class="item__title">
                                    <span>内存</span>
                                    <span class="pull-right"><i class="dot" :class="{'color-warning': getUsage(usages.ram, quota.ram)}"></i> 总配额：{{quota.ram || '0'}}GB</span>
                                </div>
                                <!-- 内存 饼图 -->
                                <div class="item__data">
                                    <div style="width:154px;height:154px;float:left;background: #fff;">
                                        <echarts-pie v-if="seriesDataRam.length > 0" :seriesData="seriesDataRam" :mouldColor="['#ffad00', '#ebf3f7']" ></echarts-pie>
                                        <div v-else style="line-height:154px;" class="color-secondary font18 text-c">暂无数据</div>
                                    </div>
                                    <div class="text-r" style="height:77px; border-bottom: 1px solid #ebf3f7;">
                                        <div class="font30 icon-box">
                                            {{usages.ram || '0'}}
                                            <span class="icon" v-if="getUsage(usages.ram, quota.ram)">
                                                <el-tooltip class="item" effect="light" content="即将达到上限" placement="right">
                                                    <i class="iconfont icon-wuuiconsuotanhao font14"></i>
                                                </el-tooltip>
                                            </span>
                                        </div>
                                        <span class="color-secondary font14">已使用</span>
                                    </div>
                                    <div class="text-r mt10">
                                        <span class="font30 lh30">{{parseInt(quota.ram-usages.ram) || '0'}}</span>
                                        <br>
                                        <span class="color-secondary font14">可用</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 磁盘 -->
                        <div class="mt20 back-white disk" style="min-height: 214px;">
                            <div class="disk__title">
                                <span class="font16">磁盘</span>
                            </div>
                            <div class="disk__data">
                                <div class="disk__data__item">
                                    <div class="pull-left cloud-host__title__icon back-gray">
                                        <i class="iconfont icon-cipan-gailan"></i>
                                    </div>
                                    <div class="font16"><i class="dot"></i>SATA</div>
                                    <div>
                                        <span class="is-bold font25">{{quota.volumeSize || '0'}} </span>GB
                                    </div>
                                </div>
                                <div class="disk__data__item disk__data__pie">
                                    <div style="width:94px;height:94px;float:left;background: #fff;">
                                        <echarts-pie v-if="seriesDataVolume.length > 0" :seriesData="seriesDataVolume" :mouldColor="['#18bcc9', '#ebf3f7']"></echarts-pie>
                                        <div v-else style="line-height:94px;" class="color-secondary font16 text-c">暂无数据</div>
                                    </div>
                                    <div class="text-r" style="height: 47px; border-bottom: 1px solid #ebf3f7;">
                                        <div class="font18 pos-relative" :class="{'color-warning': getUsage(usages.ram, quota.ram)}">
                                            {{usages.volumeSize || '0'}}
                                        </div>
                                        <span class="color-secondary font12" >已使用</span>
                                    </div>
                                    <div class="text-r pt10" style="height: 47px;">
                                        <div class="font18">96</div>
                                        <span class="color-secondary font12">可用</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <!-- 已申请资源 -->
                <el-row class="mt20">
                    <el-col :span="24">
                        <div class="resource-box">
                            <div class="resource-box__item">
                                <i class="iconfont icon-wangluo-gailan font20 color-secondary"></i>
                                <span class="ml10">网络</span>
                                <span class="pull-right"><span>{{usages.network || '0'}}</span>/{{quota.network || '0'}}</span>
                            </div>
                            <div class="resource-box__item">
                                <i class="iconfont icon-anquanzu-gailan font20 color-secondary"></i>
                                <span class="ml10">安全组</span>
                                <span class="pull-right"><span>{{usages.securityGroup || '0'}}</span>/{{quota.securityGroup || '0'}}</span>
                            </div>
                            <div class="resource-box__item">
                                <i class="iconfont icon-luyouqi-gailan font20 color-secondary"></i>
                                <span class="ml10">路由器 </span>
                                <span class="pull-right"><span>{{usages.routers || '0'}}</span>/{{quota.routers || '0'}}</span>
                            </div>
                            <div class="resource-box__item">
                                <i class="iconfont icon-fudongIP-gailan font20 color-secondary"></i>
                                <span class="ml10">浮动IP</span>
                                <span class="pull-right"><span>{{usages.floatingIps || '0'}}</span>/{{quota.floatingIps || '0'}}</span>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import EchartsLine from '@/components/charts/EchartsLine';
import EchartsPie from '@/components/charts/EchartsPie';

import {getAdminOverview, selectUsageByDate, selectUsageByMoth} from '@/service/overview.js';
export default {
    data() {
        return {
            legendData: ['警告数'],
            xData: [],
            seriesData: [],
            gridVal: {
                bottom: '60',
                right: '30',
                left: '70',
                top: '60'
            },
            options: [
                {value: 1, label: '1天'},
                {value: 3, label: '3天'},
                {value: 7, label: '7天'}
            ],
            timeVal: 7,
            quota: {},
            usages: {},
            addAmount: '', // 较上月增加量
            ecsTotal: ''
        };
    },
    computed: {
        seriesDataCpu() {
            let data = [
                {
                    name: 'CPU',
                    data:[
                        {value: this.usages.cpu, name:'已使用'},
                        {
                            value:parseInt(this.quota.cpu - this.usages.cpu) || 0,
                            name:'可用',
                            itemStyle: {
                                normal:{color:'#ebf3f7'},
                                emphasis:{color:'#ebf3f7'}
                            }
                        }
                    ],
                }
            ];
            if (this.quota.cpu === 0 || this.quota.cpu === '0' || !this.quota.cpu) {
                data = [];
            }
            return data;
        },
        seriesDataRam() {
            let data = [
                {
                    name: '内存',
                    data:[
                        {value: this.usages.ram, name:'已使用'},
                        {
                            value: parseInt(this.quota.ram - this.usages.ram) >= 0 ? parseInt(this.quota.ram - this.usages.ram) : 0,
                            name:'可用',
                            itemStyle: {
                                normal:{color:'#ebf3f7'},
                                emphasis:{color:'#ebf3f7'}
                            }
                        }
                    ],
                }
            ];
            if (this.quota.ram === 0 || this.quota.ram === '0' || !this.quota.ram) {
                data = [];
            }
            return data;
        },
        seriesDataVolume() {
            let data = [
                {
                    name: '磁盘',
                    data:[
                        {value: this.usages.volumeSize, name:'已使用'},
                        {
                            value:parseInt(this.quota.volumeSize - this.usages.volumeSize) || 0,
                            name:'可用',
                            itemStyle: {
                                normal:{color:'#ebf3f7'},
                                emphasis:{color:'#ebf3f7'}
                            }
                        }
                    ],
                }
            ];
            if (this.quota.volumeSize === 0 || this.quota.volumeSize === '0' || !this.quota.volumeSize) {
                data = [];
            }
            return data;
        }
    },
    methods: {
        // 概览数据
        getAdminOverviewFn(){
            getAdminOverview()
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.quota = res.data && res.data.quota || [];
                        this.usages = res.data && res.data.usages || [];
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 获取租户ecs每日使用量
        selectUsageByDateFn() {
            let params = {
                days: this.timeVal
            };
            selectUsageByDate(params)
                .then(res => {
                    // console.warn(res);
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let dayEcsUsages = res.data && res.data.dayEcsUsages || [];
                        this.ecsTotal = res.data && res.data.ecsTotal || '0';
                        this.xData = []; // x轴数据
                        let ecsNumArr = {
                            seriesData: []
                        };
                        this.seriesData = [];
                        for(let d in dayEcsUsages) {
                            this.xData.push(dayEcsUsages[d].countDate.substring(5));
                            ecsNumArr.seriesData.push(dayEcsUsages[d].ecsNum);
                        }
                        this.seriesData.push(ecsNumArr);
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 根条件据获取本月和上月ecs使用量差额
        selectUsageByMothFn() {
            selectUsageByMoth()
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.addAmount = res.data || [];
                    }
                })
                .catch(e => {

                    console.error('getEcsInstList', e);
                });
        },
        // 根据时间筛选ecs使用量
        selEcsFn() {
            this.selectUsageByDateFn();
        },
        // 即将达到上限标准
        getUsage(val1, val2) {
            // console.warn(val2);
            if(val2 === 0) {
                return false;
            }
            return parseFloat(val1 / val2) > 0.9;
        }
    },
    mounted() {
        this.getAdminOverviewFn();
        this.selectUsageByDateFn();
        this.selectUsageByMothFn();
    },
    components: {
        EchartsLine,
        EchartsPie
    },
};
</script>

<style lang="scss">
.overflow-box{
    background: #ebeef3;
    .el-col-box{
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }
    // 弹性云主机
    .cloud-host{
        background: #fff;
        border-radius: 5px;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
        &__data{
            height: 37px;
            border-left: 2px solid #d3d8de;
            margin: 30px 30px 0 30px;
            padding-left: 10px;
        }
        &__title{
            padding: 20px;
            border-bottom: 1px solid #ebf3f7;
            &__icon{
                width: 48px; 
                height: 48px;
                background-color: #0d7ef2;
                border-radius: 4px;
                line-height: 55px;
                margin-right: 15px;
                text-align: center;
                i{
                    color: #fff;
                    font-size: 24px;
                }
            }
            &::after{
                content: '';
                display: block;
                clear: both;
            }
        }
        .el-input__inner{
            border-radius: 0;
        }
    }
    // CPU、内存、磁盘
    .cpu_net-box{
        display: flex;
        .item{
            min-height: 294px;
            flex: 1;
            border-radius: 4px;
            &__title{
                padding: 20px 30px;
                border-bottom: 1px solid #ebf3f7;
                height: 60px;
            }
            &__data{
                padding: 40px 54px;
                &::after{
                    content: '';
                    display: block;
                    clear: both;
                }
                .icon-box{
                    position: relative;
                }
                .icon{
                    position: absolute;
                    right: -18px;
                    top: -18px;
                    color: #ff4400;
                    cursor: pointer;
                }
            }
        }
    }
    // 磁盘
    .disk{
        border-radius: 4px;
        &__title{
            border-bottom: 1px solid #ebf3f7;
            padding: 20px 30px;
        }
        &__data{
            display: flex;
            padding: 28px 0;
            align-items: center;
            &__item{
                flex: 1;
                padding-left: 89px;
            }
            &__pie{
                flex: 1;
                border-left: 1px solid #ebf3f7;
                .text-r{
                    margin-right: 89px;
                    box-sizing: border-box;
                }
            }
        }
    }
    .back-white{
        background-color: #fff;
    }
    .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #36ab46;
        margin-right: 5px;
        vertical-align: middle;
        position: relative;
        top: -1px;
        &.color-warning {
            background-color: #ff4400;
        }
    }
    .back-gray{
        background-color: #8da3c6;
    }

    // 已申请资源
    .resource-box {
        background-color: #fff;
        padding: 39px 60px;
        display: flex;
        &__item{
            flex: 1;
            padding: 0 30px;
            border-right: 1px solid #ebf3f7;
            i{
                vertical-align: middle;
            }
        }
    }
}
</style>
