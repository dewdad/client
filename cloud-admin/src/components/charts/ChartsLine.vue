<template>
    <!-- 折线图组件 -->
    <div>
        <ve-line ref="vline" :data="chartData" :height="height" :settings="settings" :loading="loading" :data-empty="dataEmpty" :extend="chartExtend" :legend-visible="legendVisible"></ve-line>
    </div>
</template>
<script>
import VeLine from 'v-charts/lib/line.common';
import {mapGetters} from 'vuex';
let tooltip = {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    textStyle: {
        color: '#000',
        padding: '0 10px'
    }
};
let xAxis = {
    boundaryGap: false
};
export default {
    name: 'ChartsLine',
    data() {
        return {
            chartExtend: {},
            tooltip,
            xAxis
        };
    },
    components: {
        VeLine
    },
    props: {
        //图表数据
        chartData: {
            type: Object
        },
        //图表设置对象
        settings: {
            type: Object
        },
        //图表loading动画
        loading: {
            type: Boolean,
            default: false
        },
        dataEmpty: {
            type: Boolean,
            default: false
        },
        //图例是否显示
        legendVisible: {
            type: Boolean,
            default: true
        },
        height: {
            type: String
        },
        chartExtendData: {
            type: Object
        }
    },
    computed: {
        ...mapGetters(['navCollapse', 'collapse'])
    },
    watch: {
        navCollapse: function() {
            $log(this.$refs.vline);
            this.$refs.vline.resizeHandler();
        },
        collapse: function() {
            this.$refs.vline.resizeHandler();
        }
    },
    mounted() {
        this.chartExtend = this.chartExtendData || {};
        this.chartExtend.tooltip = tooltip;
        this.chartExtend.xAxis = xAxis;
    }
};
</script>
<style scoped>
</style>
