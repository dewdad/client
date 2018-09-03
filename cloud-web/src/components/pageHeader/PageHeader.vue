<template>
   <!-- 列表页，详情页页头公共组件 -->
    <div class="page-header">
        <div class="page-header__title">
            <slot></slot>
        </div>
        <div class="page-header__content">
            <slot name="content"></slot>
        </div>
        <div class="page-header__buttons">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PageHeader',
    data() {
        return {};
    },
    props: {
        title: String
    }
};
</script>
<style scoped>
label {
    font-weight: 500;
}
</style>
