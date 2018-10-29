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
                                        <router-link :to="{ name: 'app.ecs.list'}">
                                            <div class="data--inner">
                                                <div class="text-right img-text-center color999">
                                                    <i class="dot" :class="{'color-warning': getUsage(tenantData.INSTANCES, tenantData.qInstances)}"></i> {{tenantData.qInstances || 0}}</div>
                                                <div style="margin-top:20px;">
                                                    <i class="iconfont icon-yunzhuji-gailan" />
                                                </div>
                                                <div class="number mt20" :class="{'color-warning': getUsage(tenantData.INSTANCES, tenantData.qInstances)}">
                                                    <ICountUp :startVal="0" :endVal="tenantData.INSTANCES || 0" :duration="2" />
                                                    <i v-show="getUsage(tenantData.INSTANCES, tenantData.qInstances)" class="iconfont icon-wuuiconsuotanhao font12 color-danger" v-tooltip.right="{content:'即将到达上限', 'theme': 'is-light'}"></i>
                                                </div>
                                                <div class="font14 color999">弹性云主机</div>
                                            </div>
                                        </router-link>
                                    </el-col>
                                    <el-col>
                                        <div class="data--inner">
                                            <div class="text-right img-text-center color999">
                                                <i class="dot" :class="{'color-warning': getUsage(tenantData.CPU, tenantData.qCpu)}"></i>{{tenantData.qCpu || 0}}</div>
                                            <div style="margin-top:20px;">
                                                <i class="iconfont icon-CPU-gailan" />
                                            </div>
                                            <div class="number mt20" :class="{'color-warning': getUsage(tenantData.CPU, tenantData.qCpu)}">
                                                <ICountUp :startVal="0" :endVal="tenantData.CPU || 0" :duration="2" />
                                                <i v-show="getUsage(tenantData.CPU, tenantData.qCpu)" class="iconfont icon-wuuiconsuotanhao font12 color-danger" v-tooltip.right="{content:'即将到达上限', 'theme': 'is-light'}"></i>
                                            </div>
                                            <div class="font14 color999">CPU</div>
                                        </div>
                                    </el-col>
                                    <el-col>
                                        <div class="data--inner">
                                            <div class="text-right img-text-center color999">
                                                <i class="dot" :class="{'color-warning': getUsage(tenantData.RAM, tenantData.qRam)}"></i> {{ramVal}}GB</div>
                                            <div style="margin-top:20px;">
                                                <i class="iconfont icon-neicun-gailan" />
                                            </div>
                                            <div class="number mt20" :class="{'color-warning': getUsage(tenantData.RAM, tenantData.qRam)}">
                                                <ICountUp :startVal="0" :endVal="ramUsage" :duration="2" />
                                                <i v-show="getUsage(tenantData.RAM, tenantData.qRam)" class="iconfont icon-wuuiconsuotanhao font12 color-danger" v-tooltip.right="{content:'即将到达上限', 'theme': 'is-light'}"></i>
                                            </div>
                                            <div class="font14 color999">内存(GB)</div>
                                        </div>
                                    </el-col>
                                    <el-col>
                                        <router-link :to="{ name: 'app.ecs.clouddisc-list'}">
                                            <div class="data--inner">
                                                <div class="text-right img-text-center color999">
                                                    <i class="dot" :class="{'color-warning': getUsage(tenantData.VOLUMES, tenantData.qVolumes)}"></i>{{tenantData.qVolumes || 0}}</div>
                                                <div style="margin-top:20px;">
                                                    <i class="iconfont icon-cipan-gailan" />
                                                </div>
                                                <div class="number mt20" :class="{'color-warning': getUsage(tenantData.VOLUMES, tenantData.qVolumes)}">
                                                    <ICountUp :startVal="0" :endVal="tenantData.VOLUMES || 0" :duration="2" />
                                                    <i v-if="getUsage(tenantData.VOLUMES, tenantData.qVolumes)" class="iconfont icon-wuuiconsuotanhao font12 color-danger" v-tooltip.right="{content:'即将到达上限', 'theme': 'is-light'}"></i>
                                                </div>
                                                <div class="font14 color999">磁盘</div>
                                            </div>
                                        </router-link>
                                    </el-col>
                                    <el-col>
                                        <router-link :to="{ name: 'app.ecs.snaplist'}">
                                            <div class="data--inner">
                                                <div class="text-right img-text-center color999">
                                                    <i class="dot" :class="{'color-warning': getUsage(tenantData.SNAPSHOTS, tenantData.qSnapshot)}"></i>{{tenantData.qSnapshot || 0}}</div>
                                                <div style="margin-top:20px;">
                                                    <i class="iconfont icon-kuaizhao-gailan" />
                                                </div>
                                                <div class="number mt20" :class="{'color-warning': getUsage(tenantData.SNAPSHOTS, tenantData.qSnapshot)}">
                                                    <ICountUp :startVal="0" :endVal="tenantData.SNAPSHOTS  || 0" :duration="2" />
                                                    <i v-show="getUsage(tenantData.SNAPSHOTS, tenantData.qSnapshot)" class="iconfont icon-wuuiconsuotanhao font12 color-danger" v-tooltip.right="{content:'即将到达上限', 'theme': 'is-light'}"></i>
                                                </div>
                                                <div class="font14 color999">快照</div>
                                            </div>
                                        </router-link>
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
                                <router-link :to="{ name: 'app.ticketSystem.myTicket'}">
                                    <div class="todo-task">
                                        我的工单
                                        <span class="pull-right">{{allOrder.myorderCount}}</span>
                                    </div>
                                </router-link>
                                <router-link :to="{ name: 'app.ticketSystem.myTicket'}">
                                    <div class="todo-task mt10">
                                        未处理工单
                                        <span class="pull-right">{{allOrder.todoOrderCount}}</span>
                                    </div>
                                </router-link>
                                <router-link :to="{ name: 'app.ticketSystem.myTicket'}">
                                    <div class="todo-task mt10">
                                        已处理工单
                                        <span class="pull-right">{{allOrder.doneOrderCount}}</span>
                                    </div>
                                </router-link>
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
                                    <el-radio-group value="1d" v-model="radioTime" @change="dataChangeType" class="header-radio-group mr5">
                                        <el-radio border name="1天" label="1d">1天</el-radio>
                                        <el-radio border name="7天" label="7d">7天</el-radio>
                                        <el-radio border name="30天" label="30d">30天</el-radio>
                                    </el-radio-group>
                                    <el-select v-model="instance" @change="dataChangeType" placeholder="请选择" size="mini">
                                        <el-option :value="item.id" :label="item.name" v-for="item in instanceList" :key="item.name"></el-option>
                                        <i class="el-input__icon iconfont icon-zhuji" slot="prefix"></i>
                                    </el-select>
                                </span>
                            </div>
                            <div class="info-box-content" id="echartsLine" v-loading="loadingContent">
                                <echarts-line v-if="seriesData.length > 0" :isMarkPoint="false" :gridVal="gridVal" :legendData="legendData" :seriesData="seriesData" :xAxisData="xData" legendIcon="rect" :markPointSymbolSize="['150','55']" :mouldColor="['#ffad00', '#0d7ef2', '#61a0a8', '#c4ccd3']" :dotStyle="['b0e9c4', 'b0e9c4']" :idString="'mychart'"></echarts-line>
                                <div v-if="!loadingContent && seriesData.length === 0" class="color-secondary font20 text-c no-data">暂无数据</div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8 ">
                        <div class="info-box monitor-warning">
                            <div class="info-box-head">监控警告
                                <router-link :to="{name: 'app.monitor.history'}" class="pull-right font14 ">查看更多</router-link>
                            </div>
                            <h5 style="height: 37px; border-left: 2px solid #d3d8de;margin: 0 0 10px 0;padding-left: 10px;">
                                <div class="pull-left">
                                    <span class="color-secondary font14 mb5 inline-block">近{{value}}日警告线</span>
                                    <br>
                                    <span class="font16">{{totalWarn}}条</span>
                                </div>
                                <div class="pull-right" style="width: 100px;">
                                    <el-select v-model="value" @change="getMonitorWarnFn" placeholder="请选择" size="mini">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </h5>
                            <div class="info-box-content">
                                <echarts-bar v-if="xWarnData.length > 0" :legendData="legendWarnData" :isMarkPoint="false" :gridVal="gridVal2" :seriesData="seriesWarnData" :xAxisData="xWarnData" :markPointSymbolSize="['150','55']" :mouldColor="['#f77e28', '#0d7ef2', '#61a0a8', '#c4ccd3']" :dotStyle="['b0e9c4']" :idString="'mychart1'"></echarts-bar>
                                <div v-else class="color-secondary text-c font20 no-data">暂无数据</div>
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
                                            <router-link :to="{ name: 'app.vpc.pn'}">
                                                <div class="products-inner img-text-center">
                                                    <i class="iconfont icon-wangluo-gailan"></i>
                                                    <span class="font14 products-name">网络</span>
                                                    <div class="products-count pull-right">{{tenantData.NETWORK || '0'}}</div>
                                                </div>
                                            </router-link>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="products">
                                            <router-link :to="{ name: 'app.ecs.netsecurity.safegrp'}">
                                                <div class="products-inner img-text-center">
                                                    <i class="iconfont icon-anquanzu-gailan"></i>
                                                    <span class="font12 products-name">安全组</span>
                                                    <div class="products-count pull-right">{{tenantData.SECURITY_GROUP || '0'}}</div>
                                                </div>
                                            </router-link>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="products">
                                            <router-link :to="{ name: 'app.vpc.pn-routeManage'}">
                                                <div class="products-inner img-text-center">
                                                    <i class="iconfont icon-luyouqi-gailan"></i>
                                                    <span class="font12 products-name">路由器</span>
                                                    <div class="products-count">{{tenantData.ROUTER || '0'}}</div>
                                                </div>
                                            </router-link>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="products">
                                            <router-link :to="{ name: 'app.vpc.pn-flexip'}">
                                                <div class="products-inner img-text-center" style="border-right: 0;">
                                                    <i class="iconfont icon-fudongIP-gailan"></i>
                                                    <span class="font12 products-name">浮动IP</span>
                                                    <div class="products-count">{{tenantData.FLOATINGIP || '0'}}</div>
                                                </div>
                                            </router-link>
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
<script src="./over.js"></script>
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
        a {
            text-decoration: none;
            color: #333333;
        }
        flex: 1;
        .todo-task:hover {
            background-color: #e1e6ed;
            cursor: pointer;
            span {
                color: #999;
            }
        }
        .no-data {
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
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
        a {
            text-decoration: none;
            color: #333333;
        }
        &:hover {
            i,
            span {
                color: #0d7ff2 !important;
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
}
</style>
