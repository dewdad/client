<template>
    <span class="region-select">
        <span class="region-select-item" v-for="item in list" :key="item.key">
            <el-button type="primary" class="width-full" :disabled="item.disabled" size="small">
                {{item.text}}
            </el-button>
            <el-select v-model="region" class="width-full" :disabled="item.disabled" popper-class="el-popper--region" size="small">
                <el-option v-for="el in item.respool" :key="el.key" :value="el.value" :label="el.text">{{el.text}}</el-option>
            </el-select>
        </span>
    </span>
</template>

<script>
import {get} from '@/utils/utils';
export default {
    props: {
        value: String
    },
    data() {
        return {
            list: AREA_CITY.regions,
            region: get(AREA_CITY, 'regions[0]respool[0]value', '')
        };
    },
    mounted() {
        this.$emit('input', this.region);
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
