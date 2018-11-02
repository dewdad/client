<template>
    <div class="table-label">
        <label class="table-label--title" :style="{'width': labelWidth + 'px'}">{{title}}</label>
        <div :class="['table-label--content', {'text-ellipsis': fold}]">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    props: {
        title: String,
        labelWidth: {
            type: Number,
            default: 120
        },
        fold: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style scoped lang="scss">
.table-label {
    display: flex;
    overflow: hidden;
    .table-label--title {
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #999;
        line-height: 36px;
        font-weight: normal;
        box-sizing: border-box;
        text-align: left;
    }
    .table-label--content {
        flex: 1;
        position: relative;
        font-size: 12px;
        line-height: 24px;
        min-height: 36px;
        padding: 6px 0;
    }
}
</style>
