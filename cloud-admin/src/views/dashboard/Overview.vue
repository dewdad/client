<template>
    <div class="page-main overflow-box">
        <!-- 外层 -->
        <el-row :gutter="20" >
            <el-col :span="24">
                <!-- 上部分 -->
                <el-row :gutter="20">
                    <!-- 弹性云主机 -->
                    <el-col :span="8">
                        <div class="cloud-host" style="min-height: 528px;">
                            <div class="cloud-host__title">
                                <div class="pull-left">
                                    <i></i>
                                </div>
                                <div>
                                    <div class="font16">弹性云主机</div>
                                    <div>
                                        <span class="is-bold font25">705</span>个
                                        <span class="pull-right">
                                            较上月同期：
                                            <span class="color-success">+20个</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h5 class="cloud-host__data">
                                <div class="pull-left">
                                    <span class="color-secondary font14 mb5 inline-block">近7日警告线</span>
                                    <br>
                                    <span class="font16">108个</span>
                                </div>
                                <div class="pull-right" style="width: 100px;">
                                    <el-select v-model="value" placeholder="请选择" size="mini">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </h5>
                            <!-- 图表 -->
                            <echarts-line 
                            :isMarkPoint="false" 
                            :gridVal="gridVal" 
                            :legendData="legendData" 
                            height="236px" 
                            :seriesData="seriesData" 
                            :xAxisData="xData" 
                            :markPointSymbolSize="['150','55']" 
                            :mouldColor="['#3ac76c', '#0d7ef2', '#61a0a8', '#c4ccd3']" 
                            :dotStyle="['b0e9c4', 'b0e9c4']" 
                            :idString="'mychart'"></echarts-line>
                        </div>
                    </el-col>
                    <!-- CPU、内存、磁盘 -->
                    <el-col :span="16">
                        <div class="cpu_net-box"> 
                            <div class="cpu item back-white mr20">
                                <div class="item__title">
                                    <span>CPU</span>
                                    <span class="pull-right"><i class="dot color-warning"></i> 总配额：3696个</span>
                                </div>
                                <div class="item__data">
                                    <echarts-pie></echarts-pie>
                                </div>
                            </div>
                            <div class="mem item back-white">
                                <div class="item__title">
                                    <span>内存</span>
                                    <span class="pull-right"><i class="dot"></i> 总配额：3696GB</span>
                                </div>
                            </div>
                        </div>
                        <div class="mt20 back-white" style="min-height: 214px;">

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
import EchartsLine from '@/components/charts/EchartsLine';
import EchartsPie from '@/components/charts/EchartsPie';
export default {
    data() {
        return {
            legendData: ['邮件营销'],
            xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            seriesData: [
                {
                    seriesData: [120, 132, 101, 134, 90, 230, 210]
                }
            ],
            gridVal: {
                bottom: '60',
                right: '20',
                left: '60',
                top: '10'
            },
            options: [
                {value: '7天',label: '7'}
            ],
            value: '',
        };
    },
    components: {
        EchartsLine,
        EchartsPie
    },
};
</script>

<style lang="scss" scoped>
.overflow-box{
    background: #ebeef3;
}
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
        margin: 30px 20px 10px 20px;
        padding-left: 10px;
    }
    &__title{
        padding: 10px 20px;
        border-bottom: 1px solid #ebf3f7;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
    }
}
.cpu_net-box{
    display: flex;
    .item{
        min-height: 294px;
        flex: 1;
        border-radius: 4px;
        &__title{
            padding: 20px 30px;
            border-bottom: 1px solid #ebf3f7;
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
    &.color-warning {
        background-color: #ff4400;
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
