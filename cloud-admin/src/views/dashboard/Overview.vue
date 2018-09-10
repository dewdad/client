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
                                <div class="pull-left cloud-host__title__icon">
                                    <i class="iconfont icon-yunzhuji-gailan"></i>
                                </div>
                                <div>
                                    <div class="font16">弹性云主机</div>
                                    <div>
                                        <span class="is-bold font25">705</span>个
                                        <span class="pull-right mt10 color-secondary">
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
                            <div style="height: 320px;">
                                <!-- 图表 -->
                                <echarts-line
                                :gridVal="gridVal" 
                                :seriesData="seriesData" 
                                :xAxisData="xData" 
                                :isMarkPoint="false"
                                :markPointSymbolSize="['150','55']" 
                                :mouldColor="['#3ac76c', '#0d7ef2', '#61a0a8', '#c4ccd3']" 
                                :dotStyle="['b0e9c4', 'b0e9c4']" 
                                :idString="'mychart'"></echarts-line>
                            </div>
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
                                <!-- CPU 饼图 -->
                                <div class="item__data">
                                    <div style="width:154px;height:154px;float:left;background: #fff;">
                                        <echarts-pie></echarts-pie>
                                    </div>
                                    <div class="text-r" style="height:77px; border-bottom: 1px solid #ebf3f7;">
                                        <div class="color-warning font30 icon-box">
                                            3600
                                            <span class="icon">
                                                <el-tooltip class="item" effect="light" content="即将达到上限" placement="right">
                                                    <i class="iconfont icon-wuuiconsuotanhao font14"></i>
                                                </el-tooltip>
                                            </span>
                                        </div>
                                        <span class="color-secondary font14">已使用</span>
                                    </div>
                                    <div class="text-r mt10">
                                        <div class="font30 lh30">96</div>
                                        <span class="color-secondary font14">可用</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mem item back-white">
                                <div class="item__title">
                                    <span>内存</span>
                                    <span class="pull-right"><i class="dot"></i> 总配额：3696GB</span>
                                </div>
                                <!-- 内存 饼图 -->
                                <div class="item__data">
                                    <div style="width:154px;height:154px;float:left;background: #fff;">
                                        <echarts-pie :mouldColor="['#ffad00', '#ebf3f7']" ></echarts-pie>
                                    </div>
                                    <div class="text-r" style="height:77px; border-bottom: 1px solid #ebf3f7;">
                                        <div class="font30 icon-box">
                                            3600
                                        </div>
                                        <span class="color-secondary font14">已使用</span>
                                    </div>
                                    <div class="text-r mt10">
                                        <span class="font30 lh30">96</span>
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
                                        <span class="is-bold font25">232936 </span>GB
                                    </div>
                                </div>
                                <div class="disk__data__item disk__data__pie">
                                    <div style="width:94px;height:94px;float:left;background: #fff;">
                                        <echarts-pie :mouldColor="['#18bcc9', '#ebf3f7']"></echarts-pie>
                                    </div>
                                    <div class="text-r" style="height: 47px; border-bottom: 1px solid #ebf3f7;">
                                        <div class="font18 pos-relative">
                                            205604
                                        </div>
                                        <span class="color-secondary font12">已使用</span>
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
                        <div class="info-box">
                            <div class="info-box__item">
                                <i class="iconfont icon-wangluo-gailan font20 color-secondary"></i>
                                <span class="ml10">网络</span>
                                <span class="pull-right"><span>1</span>/100</span>
                            </div>
                            <div class="info-box__item">
                                <i class="iconfont icon-anquanzu-gailan font20 color-secondary"></i>
                                <span class="ml10">安全组</span>
                                <span class="pull-right"><span>1</span>/100</span>
                            </div>
                            <div class="info-box__item">
                                <i class="iconfont icon-luyouqi-gailan font20 color-secondary"></i>
                                <span class="ml10">路由器 </span>
                                <span class="pull-right"><span>1</span>/100</span>
                            </div>
                            <div class="info-box__item">
                                <i class="iconfont icon-fudongIP-gailan font20 color-secondary"></i>
                                <span class="ml10">浮动IP</span>
                                <span class="pull-right"><span>1</span>/100</span>
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
                top: '60'
            },
            options: [
                {value: '1', label: '1天'},
                {value: '3', label: '3天'},
                {value: '7', label: '7天'}
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

<style lang="scss">
.overflow-box{
    background: #ebeef3;
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
        margin: 30px 20px 10px 20px;
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
.info-box {
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


</style>
