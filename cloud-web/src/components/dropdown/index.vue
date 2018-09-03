<template>
 <div class="zt-dropdown finger-cursor" ref="dropdown">
    <el-popover
        v-if="!loading"
        v-model="isShow"
        popper-class="zt-dropdown-content"
        :placement="placement"
        :trigger="trigger">
        <slot name="dropdown"></slot>
        <span slot="reference">
            <slot></slot>
        </span>
    </el-popover>
 </div>
</template>
<script>
import {on, off} from '@/utils/utils';
export default {
    props: {
        trigger: {
            type: String,
            default: 'click'
        }
    },
    data() {
        return {
            loading: false,
            isShow: false,
            isBottom: false
        };
    },
    provide() {
        return {
            dropdown: this
        };
    },
    watch: {
        placement() {
            // 重新渲染Tooltip保证方向正确
            this.loading = true;
            this.$nextTick(() => {
                this.loading = false;
            });
        },
    },
    computed: {
        dropdown() {
            return this.$refs.dropdown;
        },
        placement() {
            return this.isBottom ? 'top-end' : 'bottom-end';
        }
    },
    methods: {
        hide() {
            this.isShow = false;
        },
        getPlacement() {
            this.$nextTick(() => {
                let el = this.dropdown;
                let clientHeight = document.body.clientHeight;
                let {top, bottom} = el.getBoundingClientRect();
                // 视窗之外不管
                if (clientHeight - top < 0) return;
                // 更新位置
                if (clientHeight - bottom < 250) {
                    this.isBottom = true;
                } else {
                    this.isBottom = false;
                }
            });
        }
    },
    mounted() {
        this.getPlacement();
        on(window, 'scroll', this.getPlacement);
        on(window, 'resize', this.getPlacement);
    },
    destroyed() {
        off(window, 'scroll', this.getPlacement);
        off(window, 'resize', this.getPlacement);
    }
};
</script>

<style lang="scss">
$width: 130px;
$height: 33px;
$--color-primary: #0d7ef2;
.zt-dropdown{
    display: inline-block;
}
.zt-dropdown-item {
    min-width: $width;
    height: $height;
    line-height: $height;
    position: relative;
    display: block;
    box-sizing: border-box;
    padding: 0 10px;
    color: #666;
    white-space: nowrap;
    &.disabled {
        color: #bbb;
    }
    &:not(.disabled){
        &:hover {
            color: $--color-primary;
            background: #f9fafe;
        }
    }
}

.zt-dropdown-menu {
    background: #fff;
}

.zt-dropdown-submenu {
    position: absolute;
    left: 0;
    top: -1px;
    transform: translateX(-100%);
    // border: 1px solid #d1d5de !important;

    // &:hover {
    //     box-shadow: 0 0 10px 0 rgba(80, 90, 109, 0.16);
    // }
}

.el-popover.zt-dropdown-content {
    padding: 0 !important;
    min-width: 130px;
    border: none;
    box-shadow: none;
    background: none;

    .popper__arrow {
        display: none!important;
    }

    &>.zt-dropdown-menu {
        position: relative;
        right: -18px;
    }

    .zt-dropdown-menu{
        border: 1px solid #c3c5c6;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.34);
    }
}
</style>
