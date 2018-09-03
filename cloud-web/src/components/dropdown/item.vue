<template>
    <li :class="['zt-dropdown-item', 'finger-cursor', {
        'disabled': disabled,
        hasChild: hasChild
    }]" @mouseover="show" @mouseout="hide" @click.stop="clickHandler">
        <i class="zt-dropdown-item__icon el-icon-arrow-right pull-right" v-if="hasChild"></i>
        <slot></slot>
        <div v-show="showMenu" class="zt-dropdown-submenu" v-if="hasChild">
            <slot name="dropdown"></slot>
        </div>
    </li>
</template>

<script>
export default {
    data() {
        return {
            showMenu: false
        };
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        hasChild() {
            return this.$slots.dropdown;
        }
    },
    inject: ['dropdown'],
    methods: {
        clickHandler(e) {
            if (this.disabled || this.hasChild) return;
            this.$emit('click', e);
            this.dropdown.hide();
        },
        show() {
            if (this.disabled) return;
            this.showMenu = true;
        },
        hide() {
            this.showMenu = false;
        }
    }
};
</script>

<style>
.zt-dropdown-item__icon {
    line-height: inherit!important;
}
</style>
