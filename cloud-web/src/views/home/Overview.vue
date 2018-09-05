<template>
    <div id="overview" class="homeoverview">
        <el-row :gutter="20" class="overview">
            <el-col :span="24">
                <el-row :gutter="20">
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
                                            <div class="number mt20">25</div>
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
                                            <div class="number mt20">50</div>
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
                                            <div class="number mt20">75</div>
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
                                                99
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
                                            <div class="number mt20">75</div>
                                            <div class="font14 color999">快照</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="info-box todo">
                            <div class="info-box-head">待办工单</div>
                            <div class="info-box-content">
                                <div class="todo-task ">
                                    工单
                                    <span class="pull-right">4</span>
                                </div>
                                <div class="todo-task mt10">
                                    工单
                                    <span class="pull-right">0</span>
                                </div>
                                <div class="todo-task mt10">
                                    工单
                                    <span class="pull-right">0</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <!-- 监控部分 -->
                <el-row :gutter="20" class="mt20">
                    <el-col :span="16">
                        <div class="info-box monitor-data">
                            <div class="info-box-head">
                                监控数据
                                <span class="pull-right">
                                    <el-radio-group value="1d" class="header-radio-group mr5">
                                        <el-radio border name="1天" label="1d">1天</el-radio>
                                        <el-radio border name="7天" label="7d">7天</el-radio>
                                        <el-radio border name="30天" label="30d">30天</el-radio>
                                    </el-radio-group>
                                    <el-select value="" placeholder="请选择" size="mini">
                                        <el-option value="">monitorInstance</el-option>
                                        <el-option value="monitorInstance">monitorInstance</el-option>
                                        <el-option value="monitorInstance">monitorInstance</el-option>
                                    </el-select>
                                </span>
                            </div>
                            <div class="info-box-content">
                                <div sytle="height:236px">
                                    <echarts-line :isMarkPoint="false" :gridVal="gridVal" :legendData="legendData" height="236px" :seriesData="seriesData" :xAxisData="xData" :markPointSymbolSize="['150','55']" :mouldColor="['#3ac76c', '#0d7ef2', '#61a0a8', '#c4ccd3']" :dotStyle="['b0e9c4']" :idString="'mychart'"></echarts-line>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8 ">
                        <div class="info-box monitor-warning">
                            <div class="info-box-head">监控警告
                                <a class="pull-right font14 ">查看更多</a>
                            </div>
                            <div style="height: 60px;">

                            </div>
                            <div class="info-box-content">
                                <echarts-bar :isMarkPoint="false" :gridVal="gridVal2"  height="180px" :seriesData="seriesData2" :xAxisData="xData" :markPointSymbolSize="['150','55']" :mouldColor="['#f77e28', '#0d7ef2', '#61a0a8', '#c4ccd3']" :dotStyle="['b0e9c4']" :idString="'mychart1'"></echarts-bar>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <!-- 已申请资源 -->
                <el-row class="mt20">
                    <el-col :span="24">
                        <div class="info-box">
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

import Product from '@/components/product/Index.vue';
export default {
    name: 'Overview',
    data() {
        return {
            legendData: ['邮件营销', '联盟广告'],
            xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            seriesData: [
                {
                    seriesData: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    seriesData: [220, 182, 191, 234, 290, 330, 310]
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
            rightHeight: 100 // 右侧产品动态高度
        };
    },
    computed: {},
    components: {
        Product,
        EchartsLine,
        EchartsBar
    },
    methods: {},
    mounted() {}
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
    > .el-row {
        display: flex;
        > .el-col-6 {
            width: 260px;
        }
        > .el-col-18 {
            flex: 1;
        }
    }
}

.info-box {
    background-color: #fff;
    padding: 20px 30px;
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
    height: 218px;
}

.info-box-content {
    height: 100%;
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

.monitor-warning,
monitor-data {
    height: 316px;
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

.products-flex {
    display: flex;
    flex-direction: column;
    min-height: 50px;
}

.products-flex .el-row {
    flex: 1;
}

.products-flex .el-row .el-col {
    height: 100%;
}

.products {
    padding: 14.5px 20px;
    height: 100%;
    line-height: 100%;
    position: relative;
}

.products .products-inner {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 50%;
    line-height: 22px;
    margin-top: -11px;
    .iconfont {
        font-size: 22px;
        color: #8da3c6;
    }
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
