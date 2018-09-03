<template>
    <div class="zt-scroller" :style="style">
        <slot></slot>
    </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
    data() {
        return {
            clientHeight: document.documentElement.clientHeight
        };
    },
    watch: {
        resize: function() {
            this.onresize();
        }
    },
    computed: {
        ...mapState({
            resize: state => state.resize
        }),
        maxHeight() {
            return this.clientHeight - 143; 
        },
        style() {
            return {
                maxHeight: this.maxHeight + 'px'
            };
        }
    },
    methods: {
        onresize() {
            this.$nextTick(() => {
                this.clientHeight = document.documentElement.clientHeight; // 浏览器可视高度
            });
        }
    }
};
</script>
