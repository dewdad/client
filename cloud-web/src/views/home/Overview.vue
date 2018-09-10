<template>
    <div id="overview" class="homeoverview">
        <el-row :gutter="20" class="overview">
            <el-col :span="24">
                <el-row :gutter="20" style="height:218px;">
                    <el-col :span="16">
                        <div class="info-box data-count">
                            <div class="info-box-content">
                                <el-row :gutter="0">
                                    <el-col>
                                        <div class="data--inner">
                                            <div class="text-right img-text-center color999">
                                                <i class="dot"></i> 100</div>
                                            <div style="margin-top:20px;">
                                                <i class="iconfont icon-yunzhuji-gailan" />
                                            </div>
                                            <div class="number mt20"><ICountUp :startVal="0" :endVal="25" :duration="2" /></div>
                                            <div class="font14 color999">弹性云主机</div>
                                        </div>
                                    </el-col>
                                    <el-col>
                                        <div class="data--inner">
                                            <div class="text-right img-text-center color999">
                                                <i class="dot"></i> 100</div>
                                            <div style="margin-top:20px;">
                                                <i class="iconfont icon-CPU-gailan" />
                                            </div>
                                            <div class="number mt20"><ICountUp :startVal="0" :endVal="50" :duration="2" /></div>
                                            <div class="font14 color999">CPU</div>
                                        </div>
                                    </el-col>
                                    <el-col>
                                        <div class="data--inner">
                                            <div class="text-right img-text-center color999">
                                                <i class="dot"></i> 100</div>
                                            <div style="margin-top:20px;">
                                                <i class="iconfont icon-neicun-gailan" />
                                            </div>
                                            <div class="number mt20">
                                                <ICountUp :startVal="0" :endVal="75" :duration="2" />
                                                <i v-show="false" class="iconfont icon-wuuiconsuotanhao font12 color-danger" v-tooltip.right="{content:'即将到达上限', 'theme': 'is-light'}"></i>
                                            </div>
                                            <div class="font14 color999">内存</div>
                                        </div>
                                    </el-col>
                                    <el-col>
                                        <div class="data--inner">
                                            <div class="text-right img-text-center color999">
                                                <i class="dot color-warning"></i> 100</div>
                                            <div style="margin-top:20px;">
                                                <i class="iconfont icon-cipan-gailan" />
                                            </div>
                                            <div class="number mt20 color-warning">
                                                <ICountUp :startVal="0" :endVal="99" :duration="2" />
                                                <i class="iconfont icon-wuuiconsuotanhao font12 color-danger" v-tooltip.right="{content:'即将到达上限', 'theme': 'is-light'}"></i>
                                            </div>
                                            <div class="font14 color999">磁盘</div>
                                        </div>
                                    </el-col>
                                    <el-col>
                                        <div class="data--inner">
                                            <div class="text-right img-text-center color999">
                                                <i class="dot"></i> 100</div>
                                            <div style="margin-top:20px;">
                                                <i class="iconfont icon-kuaizhao-gailan" />
                                            </div>
                                            <div class="number mt20"><ICountUp :startVal="0" :endVal="125" :duration="2" /></div>
                                            <div class="font14 color999">快照</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <!-- 待办工单 -->
                    <el-col :span="8">
                        <div class="info-box todo">
                            <div class="info-box-head">待办工单</div>
                            <div class="info-box-content">
                                <div class="todo-task">
                                    我的工单
                                    <span class="pull-right">{{allOrder.myorderCount}}</span>
                                </div>
                                <div class="todo-task mt10">
                                    未处理工单
                                    <span class="pull-right">{{allOrder.todoOrderCount}}</span>
                                </div>
                                <div class="todo-task mt10">
                                    已处理工单
                                    <span class="pull-right">{{allOrder.doneOrderCount}}</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <!-- 监控部分 -->
                <el-row :gutter="20" class="mt20" style="min-height: 316px;">
                    <el-col :span="16">
                        <div class="info-box monitor-data">
                            <div class="info-box-head">
                                监控数据
                                <span class="pull-right">
                                    <el-radio-group value="1d" v-model="radioTime" class="header-radio-group mr5">
                                        <el-radio border name="1天" label="1d">1天</el-radio>
                                        <el-radio border name="7天" label="7d">7天</el-radio>
                                        <el-radio border name="30天" label="30d">30天</el-radio>
                                    </el-radio-group>
                                    <el-select value="" placeholder="请选择" size="mini">
                                        <el-option value="">monitorInstance</el-option>
                                        <el-option value="monitorInstance">monitorInstance</el-option>
                                        <el-option value="monitorInstance">monitorInstance</el-option>
                                        <i class="iconfont icon-zhuji" slot="prefix"></i>
                                    </el-select>
                                </span>
                            </div>
                            <div class="info-box-content" id="echartsLine">
                                <echarts-line 
                                :isMarkPoint="false" 
                                :gridVal="gridVal" 
                                :legendData="legendData"  
                                :seriesData="seriesData" 
                                :xAxisData="xData" 
                                legendIcon="rect"
                                :markPointSymbolSize="['150','55']" 
                                :mouldColor="['#ffad00', '#0d7ef2', '#61a0a8', '#c4ccd3']" 
                                :dotStyle="['b0e9c4', 'b0e9c4']" 
                                :idString="'mychart'"></echarts-line>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8 ">
                        <div class="info-box monitor-warning">
                            <div class="info-box-head">监控警告
                                <a class="pull-right font14 ">查看更多</a>
                            </div>
                            <h5 style="height: 37px; border-left: 2px solid #d3d8de;margin: 0 0 10px 0;padding-left: 10px;">
                                <div class="pull-left">
                                    <span class="color-secondary font14 mb5 inline-block">近{{value}}日警告线</span>
                                    <br>
                                    <span class="font16">10条</span>
                                </div>
                                <div class="pull-right" style="width: 100px;">
                                    <el-select v-model="value" @change="getMonitorWarnFn" placeholder="请选择" size="mini">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </h5>
                            <div class="info-box-content">
                                <echarts-bar v-if="xWarnData.length > 0" :legendData="legendData" :isMarkPoint="false" :gridVal="gridVal2" :seriesData="seriesData2" :xAxisData="xWarnData" :markPointSymbolSize="['150','55']" :mouldColor="['#f77e28', '#0d7ef2', '#61a0a8', '#c4ccd3']" :dotStyle="['b0e9c4']" :idString="'mychart1'"></echarts-bar>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <!-- 已申请资源 -->
                <el-row class="mt20" style="height: 142px;">
                    <el-col :span="24">
                        <div class="info-box applylist">
                            <div class="info-box-head">已申请资源</div>
                            <div class="info-box-content products-flex">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <div class="products">
                                            <div class="products-inner img-text-center">
                                                <i class="iconfont icon-wangluo-gailan"></i>
                                                <span class="font14 products-name">网络</span>
                                                <div class="products-count pull-right">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="products">
                                            <div class="products-inner img-text-center">
                                                <i class="iconfont icon-anquanzu-gailan"></i>
                                                <span class="font12 products-name">安全组</span>
                                                <div class="products-count pull-right">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="products">
                                            <div class="products-inner img-text-center">
                                                <i class="iconfont icon-luyouqi-gailan"></i>
                                                <span class="font12 products-name">路由器</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="products">
                                            <div class="products-inner img-text-center" style="border-right: 0;">
                                                <i class="iconfont icon-fudongIP-gailan"></i>
                                                <span class="font12 products-name">浮动IP</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import EchartsLine from '@/components/charts/EchartsLine.vue';
import EchartsBar from '@/components/charts/EchartsBar.vue';
import ICountUp from 'vue-countup-v2';
import {getOrderCount, getMonitorWarn} from '@/service/ecs/overview.js';
export default {
    name: 'Overview',
    data() {
        return {
            legendData: ['CPU使用率', '内存使用率'],
            xData: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            xWarnData: [],
            seriesData: [
                {
                    seriesData: [20, 22, 81, 34, 50, 50, 70, 67, 63]
                },
                {
                    seriesData: [20, 32, 91, 34, 60, 20, 10, 56, 24]
                }
            ],
            gridVal: {
                bottom: '60',
                right: '20',
                left: '60',
                top: '10'
            },
            gridVal2: {
                bottom: '30',
                right: '20',
                left: '20',
                top: '10'
            },
            seriesData2: [
                {
                    seriesData: [120, 132, 101, 134, 90, 230, 210]
                }
            ],
            options: [
                {value: 1, label: '1天'},
                {value: 3, label: '3天'},
                {value: 7, label: '7天'}
            ],
            value: 7,
            echartsLineHeight: '200px',
            radioTime: '1d',
            allOrder: []
        };
    },
    computed: {},
    components: {
        EchartsLine,
        EchartsBar,
        ICountUp
    },
    methods: {
        getOrderCountFn() {
            getOrderCount()
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.allOrder = res.data && res.data.allOrder || [];
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 监控告警接口
        getMonitorWarnFn() {
            getMonitorWarn(this.value)
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let monitoRet = res.data || [];
                        // this.seriesData2 = [];
                        this.xWarnData = []; 
                        for (let w in monitoRet) {
                            let xVal = monitoRet[w].countDate;
                            this.xWarnData.push(xVal.substring(5, xVal.length));
                            // this.seriesData2.push(monitoRet[w].count);
                        }
                        $log('dfdsfs', monitoRet);
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        }
    },
    mounted() {
        this.getOrderCountFn();
        this.getMonitorWarnFn();
    }
};
</script>
<style scoped lang="scss">
.homeoverview {
    height: 100%;
    padding: 20px;
    background: rgb(237, 242, 249);
    display: flex;
    flex: 1;
    flex-direction: column;
    > .overview {
        height: 100%;
        > .el-col {
            height: 100%;
            display: flex;
            flex-direction: column;
            > .el-row {
                > .el-col {
                    height: 100%;
                }
            }
            > .el-row:nth-child(2) {
                flex: 2;
            }
           
        }
    }
}

.info-box {
    background-color: #fff;
    padding: 20px 30px;
    height: 100%;
    overflow: hidden;
    &:hover {
        box-shadow: 0px 0px 15px 0px rgba(66, 103, 178, 0.15);
    }
}

.info-box .info-box-head {
    height: 40px;
    font-size: 16px;
}

.data-count {
    padding: 0px;
    width: 100%;
    .el-row {
        height: 100%;
        .el-col {
            height: 100%;
            width: 20%;
            background: #fff;
            text-align: center;
            &:not(:last-child) {
                border-right: 1px solid #f6f6f6;
            }
            .data--inner {
                margin: auto;
                transition: transform 0s;
                height: 100%;
                width: 100%;
                background: #fff;
                padding: 26px 13px;
                .dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 3px;
                    background-color: #36ab46;
                    margin-right: 5px;
                    &.color-warning {
                        background-color: #ff4400;
                    }
                }
                .iconfont {
                    font-size: 24px;
                    color: #94a8c9;
                }
            }
            &:hover {
                .data--inner {
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
                    transform: scale(1.02);
                    .iconfont {
                        color: #0d7ef2;
                    }
                }
            }
        }
    }
}

.todo,
.data-count {
    height: 100%;
}

.info-box {
    display: flex;
    flex-direction: column;
}

.info-box-content {
    flex:1;
    .todo-task:hover{
        background-color: #e1e6ed;
        cursor: pointer;
        span{
            color: #999;
        }
    }
}

.info-box-content-info {
    height: 100%;
    padding: 15px 10px;
    font-size: 12px;
    color: #999;
    position: relative;
}

.number {
    position: relative;
    font-size: 30px;
    line-height: 1;
    &.color-warning {
        color: #ff4400 !important;
    }
    .iconfont {
        position: absolute;
        top: -5px;
        margin-left: 5px;
    }
}

.info-box-content-info .number1 {
    font-size: 26px;
}

.todo-task {
    background: #f6f8fb;
    line-height: 36px;
    height: 36px;
    font-size: 14px;
    padding: 0 22px;
}

.recharge {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #fa970c;
    color: #fff;
}

.applylist {
    display: flex;
    flex-direction: column;
}
.products-flex {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.products-flex .el-row {
    flex: 1;
    width: 100%;
    .el-col {
        height: 100%;
        position: relative;
    }
}

.products {
    position: absolute;
    top: 50%;
    left: 0px;
    right: 0px;
    margin-top: -10px;
    cursor: pointer;
    &:hover{
        i, span{
            color:#0d7ff2 !important;
        }
    }
}

.products .products-inner {
    line-height: 22px;
    padding-left: 30px;
    .iconfont {
        font-size: 22px;
        color: #8da3c6;
    }
    display: flex;
    flex-direction: row;
    align-items: center;
    border-right: 1px solid #f6f6f6;
}

.products .products-inner .products-name {
    flex: 1;
}

.products .products-inner .products-count {
    margin-top: 5px;
    float: right;
    width: 30px;
    height: 18px;
    text-align: center;
    border-radius: 9px;
    line-height: 18px;
    background: #e3e6ef;
    color: #656565;
    transition: all 0.1s linear;
    margin-right: 30px;
}
</style>
