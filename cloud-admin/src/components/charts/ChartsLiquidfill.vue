<template>
    <div class="charts" style="margin: 0 auto">
        <div :id="idString" :style="chartSizeStyle"></div>
    </div>
</template>
<script>

export default {
    data() {
        return{
            option:{
                series: [{
                    type: 'liquidFill',
                    data: this.optionData.ratio,
                    radius: '60%',
                    color: [this.colorState],
                    backgroundStyle: {
                        // borderWidth: 5,
                        color: 'white',
                        shadowColor: 'rgba(0, 0, 0, 0)',
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: this.colorState,
                                fontSize: this.textSize
                            },
                            // formatter: function() {
                            //     return this.optionData.ratio[0] * 100 + '%\n良好';
                            // }.bind(this)
                            formatter: () => {
                                return this.optionData.ratio[0] * 100 + '%\n' + this.colorStatus.text;
                            }
                        },
                    },
                    outline: {
                        borderDistance: 3, //边框距
                        itemStyle: {
                            borderWidth: 5,
                            borderColor: this.colorState
                        }
                    },
                }]
            }
        };
    },
    props: {
        optionData: {
            type: Object,
            default: function () {
                return {
                    ratio: [0.3]
                };
            }
        },
        // 文字大小
        textSize: {
            type: Number,
            default: 21
        },
        // 水波图大小
        chartSize: {
            type: Number,
            default: 180
        },
        // 水波图主题
        colorState: {
            type: String,
            default: '#f68300'
        },
        // 水波图主题是否自定义
        colorType: {
            type: String,
            default: 'default'
        },
        idString: {
            type: String,
            default: 'myCharts'
        }
    },
    watch: {
        optionData() {
            let myChart = this.$echarts.init(document.getElementById(this.idString));
            myChart.setOption(this.option);
        }
    },
    computed: {
        // 水波图主题默认颜色
        colorStatus() {
            let colorArray = ['#009900', '#f68300', '#f40000'];
            let num = this.optionData.ratio[0];
            let color = colorArray[0];
            let text = '过剩';
            switch (true) {
                case num >= 0 && num < 0.4:
                    color = colorArray[0];
                    text = '过剩';
                    break;
                case num >= 0.4 && num < 0.8:
                    color = colorArray[1];
                    text = '良好';
                    break;
                case num >= 0.8:
                    text = '过度';
                    color = colorArray[2];
            }
            return {
                color,
                text 
            };
        },
        chartSizeStyle() {
            return {
                'width': this.chartSize + 'px',
                'height': this.chartSize + 'px'
            };
        }
    },
    methods: {
        // 选取颜色状态
        selColorStatus() {
            if(this.colorType === 'default') {
                this.option.series[0].color[0] = this.colorStatus.color;
                this.option.series[0].label.normal.textStyle.color = this.colorStatus.color;
                this.option.series[0].outline.itemStyle.borderColor = this.colorStatus.color;
            }
        }
    },
    async mounted() {
        await this.selColorStatus();
        let myChart = this.$echarts.init(document.getElementById(this.idString));
        myChart.setOption(this.option);
    }
};
</script>