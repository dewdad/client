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
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        data:[
                            {value:1548, name:'搜索引擎'},
                            {value:535, name:'直接访问'}
                        ],
                        animation: false
                    }
                ],
                color:['#0d7ef2','#ebf3f7']
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
                $log(o);
                let obj = {
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
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data:[
                        {value:1548, name:'搜索引擎'},
                        {value:535, name:'直接访问'}
                    ],
                    animation: false
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
