<template>
    <div class="charts" style="color: #000">
        <div :id="idString" style="width:154px; height:154px;"></div>
    </div>
</template>
<script>
import background from '@/assets/images/echarts-bg.png';
import {mapGetters} from 'vuex';
export default {
    data() {
        return{
            background,
            option: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    show: ''
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['80%', '100%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:1548, name:'搜索引擎'},
                            {value:535, name:'直接访问'}
                        ],
                        animation: false
                    }
                ]
            },
            chartsWidth: '',
            seriesArray: []
        };
    },
    props: {
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
        }
    },
    computed: {
        ...mapGetters(['navCollapse', 'collapse']),
        chartWidth() {
            let charts = document.getElementsByClassName('charts');
            return charts[0].offsetWidth;
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
            // this.arrangeSeries();
            this.option.xAxis['data'] = this.xAxisData;
            setTimeout(() =>{
                let myChart = this.$echarts.init(document.getElementById(this.idString));
                myChart.setOption(this.option);
            }, 200);
        }
    },
    methods: {
        myChartContainer () {
            // let myChartDom = document.getElementById(this.idString);
            // let charts = document.getElementsByClassName('charts');
            // console.warn(charts[0].offsetWidth);
            // myChartDom.style.width = charts[0].offsetWidth + 'px';
        },
        // 重新画图
        againCanvas() {
            let myChart = this.$echarts.init(document.getElementById(this.idString));
            myChart.resize();
        },
        // 整理折线图条数
        arrangeSeries() {
            this.seriesArray = [];
            for (let o in this.seriesData) {
                let obj = {
                    name: this.legendData[o],
                    type:'line',
                    showSymbol: false,
                    smooth: true,
                    lineStyle: {
                        // color: this.lineStyle[o]
                    },
                    areaStyle: {
                        // color: this.lineStyle[o]
                        opacity: 0.1
                    },
                    data:this.seriesData[o].seriesData,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'}
                        ],
                        // symbol: 'rect',
                        symbolSize: ['138','55'],
                        symbolOffset: ['0', '-30'],
                        symbol: `image:// ${this.background}`,
                        symbolKeepAspect: true,
                        label: {
                            textBorderColor: 'none',
                            // formatter: '{a}峰值: {c}' + this.yUnit
                            // offset: ['0', '10'],
                            formatter: (params) => {
                                let a = params.seriesName + '峰值: ' + params.value + this.yUnit;
                                let b = this.xAxisData[params.data.coord[0]];
                                console.log(params);
                                return a + '\n' + b;
                                // return [ `{a| ${a}}`, `{b| ${b}}`].join('</br>');
                            },
                            rich: {
                                a: {},
                                b: {}
                            }
                        }
                    }
                };
                this.seriesArray.push(obj);
            }
            this.option['series'] = this.seriesArray;
        }
    },
    async mounted () {
        // await this.arrangeSeries();
        this.myChartContainer();
        let myChart = this.$echarts.init(document.getElementById(this.idString));
        myChart.setOption(this.option);
    }
};
</script>
<style lang="scss">
.tooltip-icon{
    width: 10px; 
    height: 10px;
    display: inline-block;
    border: solid 1px #c3c5c6;
    position: relative;
    top: 1px;
    margin-right: 5px;
}
</style>
