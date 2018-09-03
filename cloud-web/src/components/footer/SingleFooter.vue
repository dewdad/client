<template>
    <footer ref="footer" class="footer text-center">
        <span style="footer-text" class="text-center">
            {{$t('footer.copyright')}} © {{currentYear}} ·&nbsp;{{$t('footer.icp')}}</span>
    </footer>
</template>
<script>
// import { getDom } from '@/utils/utils';
import {addClass, removeClass} from '@/utils/utils';
import {mapState} from 'vuex';
export default {
    name: 'SingleFooter',
    data() {
        return {
            screenHeight: document.body.clientHeight
        };
    },
    watch: {
        screenHeight: function(newval, oldval) {
            this.setOptions();
        },
        resize: function() {
            this.setOptions();
        }
    },
    computed: {
        ...mapState({
            resize: state => state.resize
        }),
        currentYear: function() {
            let year = new Date().getFullYear();
            return year;
        }
    },
    methods: {
        // 设置底部版权位于浏览器位置
        setOptions() {
            this.$nextTick(() => {
                let clientHeight = document.documentElement.clientHeight; // 浏览器可视高度
                let scrollHeight = document.querySelector('.pull-page-main').scrollHeight; // 网页高度
                // 如果网页高度小于浏览器可视高度 footer显示在浏览器最底部
                if (scrollHeight < clientHeight) {
                    addClass(this.$refs['footer'], 'fixed');
                } else {
                    removeClass(this.$refs['footer'], 'fixed');
                }
            });
        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.documentElement.clientHeight;
            })();
        };
        this.setOptions();
    }
};
</script>
<style scoped lang="scss">
.footer {
    margin-top: 50px;
    width: 100%;
    border-top: 1px solid #c3c5c6;
    padding: 25px 0;
    &.fixed {
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
}
</style>
