<template>
    <div class="charts" @mouseover="echartHover" @mouseout="echartOut" style="color: #000">
        <div :id="idString" :style="{height: height}"></div>
    </div>
</template>
<script>
import background from '@/assets/images/echarts-bg.png'; 
import {mapGetters} from 'vuex';
import echarts from 'echarts';
export default {
    data() {
        return{
            background,
            option:{
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#FFF',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333',
                        fontSize: 12
                    },
                    formatter: (params) => {
                        let res = '';
                        for(let i = 0; i < params.length; i++){
                            if ( i === 0){
                                res += `<p style="margin: 10px 0 5px 0;">
                                <span class="tooltip-icon" style="background: ${params[i].color};"></span>${params[i].seriesName}: ${params[i].data}${this.yUnit}</p>`;
                                continue;
                            }
                            res += `<p  style="margin-bottom: 5px;"><span class="tooltip-icon" style="background: ${params[i].color};"></span>${params[i].seriesName}: ${params[i].data}${this.yUnit}</p>`;
                        }
                        res += '<p>' + params[0].name + '</p>';
                        return res;
                    },
                },
                grid: this.gridVal,
                legend: {
                    data: this.legendData,
                    y: 'bottom',
                    icon: 'circle',
                    pageIconColor: 'yellow',
                    selectedMode: 'multiple'
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {show:false},
                    axisTick: {show:false},
                    data: this.xAxisData,
                    minInterval: 1,
                    axisLabel: {
                        formatter: (value, index) => {
                            let val = this.HandleXData(value);
                            return val;
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {show:false},
                    axisTick: {show:false},
                    splitNumber: 4, // 坐标轴的分割段数
                    axisLabel: {
                        formatter: '{value}' + this.yUnit // y轴坐标轴单位
                    }
                },
                color: this.mouldColor,
                series: []
            },
            chartsWidth: '',
            seriesArray: [],
            markPointSymbol: `image:// ${background}`
        };
    },
    props: {
        height: {
            type: String,
            default: '348px'
        },
        // 文字大小
        textSize: {
            type: Number,
            default: 21
        },
        // 图表ID
        idString: {
            type: String,
            default: 'myCharts'
        },
        // x轴数据
        xAxisData:{
            type: Array,
            default: function () {
                return [];
            }
        },
        // 
        seriesData: {
            type: Array,
            default: function () {
                return [];
            }
        },
        // y轴单位
        yUnit: {
            type: String,
            default: '%'
        },
        // 折线颜色
        lineStyle: {
            type: Array,
            default: function () {
                return [];
            } 
        },
        // 区域填充颜色
        areaStyle: {
            type: Array,
            default: function () {
                return [];
            }
        },
        // 图例名称
        legendData: {
            type: Array,
            default: function () {
                return [];
            }
        },
        // 峰值背景宽度
        markPointSymbolSize: {
            type: Array,
            default: function () {
                return ['138','55'];
            }
        },
        // 模板颜色
        mouldColor: {
            type: Array,
            default: function () {
                return ['#0d7ef2','#3ac76c', '#61a0a8', '#c4ccd3'];
            }
        },
        // 小圆点样式
        dotStyle: {
            type: Array,
            default: function () {
                return [];
            }
        },
        // 
        xType: {
            type: Boolean,
            default: true
        },
        isMarkPoint: {
            type: Boolean,
            default: true
        },
        // 留边值
        gridVal:{
            type: Object,
            default: function () {
                return {
                    bottom: '60',
                    right: '70',
                    left: '80',
                    top: '60'
                };
            }
        }

    },
    computed: {
        ...mapGetters(['navCollapse', 'collapse']),
        chartWidth() {
            let charts = document.getElementsByClassName('charts');
            return charts[0].offsetWidth;
        },
        nowTime() {
            let filters = this.$options.filters; 
            let now = new Date();
            let nowtime = filters['date'](now ,'YYYY-MM-DD') + ' ';
            let nowtimeYear = filters['date'](now ,'YYYY') + '-';
            return this.xType ? nowtime : nowtimeYear;
        },
        xState() {
            let fisrtData = this.xAxisData[0] + ':00';
            let last = this.xAxisData[this.xAxisData.length - 1];
            $log(last);
            let subtract = Date.parse(last) - Date.parse(fisrtData);
            return subtract < 7 * 24 * 3600 * 1000;
        }
    },
    watch: {
        navCollapse () {
            setTimeout(() =>{
                this.myChartContainer();
                this.againCanvas();
            }, 500);
            
        },
        collapse() {
            setTimeout(() =>{
                this.myChartContainer();
                this.againCanvas();
            }, 500);
        },
        seriesData() {
            this.arrangeSeries();
            this.option.xAxis['data'] = this.xAxisData;
            setTimeout(() =>{
                let myChart = echarts.init(document.getElementById(this.idString));
                myChart.setOption(this.option);
            }, 200);
        }
    },
    methods: {
        myChartContainer () {
            let myChartDom = document.getElementById(this.idString);
            let charts = document.getElementsByClassName('charts');
            console.warn(charts[0].offsetWidth);
            myChartDom.style.width = charts[0].offsetWidth + 'px';
        },
        // 重新画图resize(宽度变化)
        againCanvas() {
            let myChart = echarts.init(document.getElementById(this.idString));
            myChart.resize();
        },
        // 重新setOption
        async againSetOption() {
            await this.arrangeSeries();
            setTimeout(() =>{
                let myChart = echarts.init(document.getElementById(this.idString));
                myChart.setOption(this.option);
            }, 200);
        },
        // 整理折线图条数
        arrangeSeries() {
            this.seriesArray = [];
            for (let o in this.seriesData) {
                let obj = {
                    name: this.legendData[o],
                    type:'line',
                    showSymbol: false,
                    symbol: 'circle',
                    smooth: true,
                    symbolSize: 6,
                    itemStyle: {
                        normal: {
                            color: this.lineStyle[o],
                            borderColor: this.dotStyle[o],
                            borderWidth: 3,
                        }
                    },
                    lineStyle: {
                        // color: this.lineStyle[o]
                    },
                    areaStyle: {
                        opacity: 0.2
                    },
                    data:this.seriesData[o].seriesData,
                    markPoint: {
                        data: [
                            // {
                            //     type: 'max', 
                            //     name: '最大值',
                            // }
                            {
                                coord: [this.xAxisData[this.getMaxData(this.seriesData[o].seriesData)], this.seriesData[o].seriesData[this.getMaxData(this.seriesData[o].seriesData)]]
                            }
                        ],
                        animationDuration: 100,
                        // symbol: 'rect',
                        symbolSize: this.markPointSymbolSize,
                        symbolOffset: ['0', '-30'],
                        symbol: this.isMarkPoint ? this.markPointSymbol : 'none',
                        symbolKeepAspect: true,
                        label: {
                            textBorderColor: 'none',
                            offset: [0, -5],
                            formatter: (params) => {
                                let a = params.seriesName + ': ' + params.data.coord[1] + this.yUnit;
                                let b = params.data.coord[0];
                                // console.log(params);
                                return '{a|' + b + '}' + '\n{b|' + a + '}';
                                // return '{a|' + a + '\n' + b + '}';
                            },
                            rich: {
                                a: {
                                    color: '#fff',
                                    lineHeight: 20,
                                    // minWidth: 100,
                                    // align: 'center',
                                    // backgroundColor: '#00ffff',
                                    // padding: [5, 10]
                                },
                                b: {
                                    color: '#fff',
                                }
                            }
                        }
                    }
                };
                this.seriesArray.push(obj);
            }
            this.option['series'] = this.seriesArray;
        },
        async echartHover() {
            this.markPointSymbol = 'none';
            this.againSetOption();
            // console.warn(this.option);
        },
        async echartOut() {
            this.markPointSymbol = `image:// ${background}`;
            this.againSetOption();
        },
        // 处理X轴数据
        HandleXData(params) {
            let val = this.xState ? params.substring(params.lastIndexOf(' ')) : params.substring(5, params.lastIndexOf(' '));
            if(val === ' 00:00') {
                val = params.substring(5, params.lastIndexOf(' ')); 
            }
            return val;
        },
        // 获取数据中最大（且靠右）的值
        getMaxData(arr) {
            let max = 0;
            let index = 0;
            for(let i in arr) {
                if(parseFloat(arr[i]) >= parseFloat(max)) {
                    max = arr[i];
                    index = i;
                }
            }
            // console.warn(max);
            return index;
        }
    },
    async mounted () {
        await this.arrangeSeries();
        this.myChartContainer();
        let myChart = echarts.init(document.getElementById(this.idString));
        myChart.setOption(this.option);
    }
};
</script>
<style lang="scss">
.tooltip-icon{
    width: 12px; 
    height: 12px;
    display: inline-block;
    border: solid 1px #c3c5c6;
    position: relative;
    top: 2px;
    margin-right: 5px;
}
</style>
