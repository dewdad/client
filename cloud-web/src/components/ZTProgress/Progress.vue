<template>
    <div class="progress-box" :style="boxStyle">
        <div class="progress-box__inner" :style="innerStyle">
            <span class="progress-box__inner__text font12" :class="{'text-active': percentage < 50, 'text-none': percentage === 0 }">{{percentage}}%</span>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        innerStyle() {
            return {
                background: this.ztColor,
                height: this.ztWidth + 'px',
                width: this.percentage + '%',
                'border-radius': parseInt(this.ztWidth) / 2 + 'px'
            };
        },
        boxStyle() {
            return {
                'border-radius': parseInt(this.ztWidth) / 2 + 'px',
                height: this.ztWidth + 'px',
                'line-height': this.ztWidth + 'px',
                background: this.backColor,
            };
        }
    },
    props: {
        ztColor: {
            type: String,
            default: '#67c23a'
        },
        // 进度条宽度
        ztWidth: {
            type: Number,
            default: 18
        },
        // 进度条长度
        percentage: {
            type: Number,
            default: 18
        },
        // 背景颜色
        backColor: {
            type: String,
            default: '#ebeef5'
        },
    }
};
</script>
<style lang="scss" scoped>
.progress-box{
    width: 100%;
    position: relative;
    overflow: hidden;
    &__inner{
        position: absolute;
        text-align: right;
        transition: all .5s;
        &__text{
            color: #FFF;
            padding: 0 5px;
            display: inline-block;
        }
        .text-active{
            color: #333;
            position: absolute;
        }
        .text-none{
            display: none;
        }
    }
}
</style>
