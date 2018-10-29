<template>
    <el-radio-group v-model="region" size="small">
        <el-radio-button :label="item.value" border v-tooltip.bottom="create && item.disabled ? '即将上线' : ''" v-for="item in list" :key="item.key" v-if="(showDisabled && item.disabled) || !item.disabled" :disabled="create && item.disabled">{{item.text}}</el-radio-button>
    </el-radio-group>
</template>

<script>
export default {
    props: {
        value: String,
        showDisabled: {
            type: Boolean,
            default: true
        },
        // 是否为创建页（需求创建页只能用第一个）
        create: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            list: AREA_CITY.regions,
            region: AREA_CITY.regions[0].value
        };
    },
    mounted() {
        this.$emit('input', this.region);
        this.$emit('change', this.region);
    }
};
</script>

<style lang="scss">
.region-select {
    .region-select-item {
        width: 140px;
        display: inline-block;

        & + .region-select-item {
            margin-left: 10px;
        }

        .el-select input {
            text-align: center;
            text-indent: 20px;
        }
    }
    .el-button--primary.is-disabled {
        background: #fff;
        color: #999999;
        border-color: #d1d4d8;
        border-bottom-color: transparent;
    }
    .el-input.is-disabled .el-input__inner {
        background: #fff;
        border-color: #d1d4d8;
    }
}
</style>
