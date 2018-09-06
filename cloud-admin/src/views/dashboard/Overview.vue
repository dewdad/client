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
                                <!-- CPU 饼图 -->
                                <div class="item__data">
                                    <div style="width:154px;float:left;background: #fff;">
                                        <echarts-pie></echarts-pie>
                                    </div>
                                    <div class="text-r" style="height:77px; border-bottom: 1px solid #ebf3f7;">
                                        <span class="color-warning font30">3600</span><i></i>
                                        <br>
                                        <span class="color-secondary font14">已使用</span>
                                    </div>
                                    <div class="text-r">
                                        <span class="font30">96</span><i></i>
                                        <br>
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
                                    <div style="width:154px;float:left;background: #fff;">
                                        <echarts-pie idString="echartmem"></echarts-pie>
                                    </div>
                                    <div class="text-r" style="height:77px; border-bottom: 1px solid #ebf3f7;">
                                        <span class="color-warning font30">3600</span><i></i>
                                        <br>
                                        <span class="color-secondary font14">已使用</span>
                                    </div>
                                    <div class="text-r">
                                        <span class="font30">96</span><i></i>
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
                        </div>
                    </el-col>
                </el-row>
                <!-- 已申请资源 -->
                <el-row class="mt20">
                    <el-col :span="24">
                        <div class="info-box">
                            <div class="info-box__item">
                                <i></i>
                                <span>网络</span>
                                <span class="pull-right"><span>1</span>/100</span>
                            </div>
                            <div class="info-box__item">
                                <i></i>
                                <span>安全组</span>
                            </div>
                            <div class="info-box__item">
                                <i></i>
                                <span>路由器 </span>
                            </div>
                            <div class="info-box__item">
                                <i></i>
                                <span>浮动IP</span>
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
        &__data{
            padding: 40px 54px;
            &::after{
                content: '';
                display: block;
                clear: both;
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
    padding: 39px 60px;
    display: flex;
    &__item{
        flex: 1;
        padding: 0 30px;
        border-right: 1px solid #ebf3f7;
    }
}


</style>
