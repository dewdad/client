<template>
    <el-radio-group v-model="currentRadio" size="mini" @change="handleChange" :class="['region-radio', type]">
        <el-radio-button v-for="region in regionList" :key="region.key" :label="region.value" :disabled="region.disabled">{{region.text}}</el-radio-button>
    </el-radio-group>
</template>
<script>
// import { getRegion } from '@/service/app';
export default {
    name: 'RegionRadio',
    data() {
        return {
            regionList: AREA_CITY.regions,
            currentRadio: ''
        };
    },
    props: {
        value: {
            type:String,
            default: 'beijing1',
        },
        type: {
            type: String,
            default: 'default'
        }
    },
    created() {
        this.currentRadio = AREA_CITY.regions[0].value;
        this.$emit('input', this.currentRadio);
        // this.getRegions();
    },
    methods: {
        handleChange(value) {
            this.$emit('input', value);
        }
        // async getRegions() {
        //     // let regionList = await getRegion();
        //     console.log(`regionList ${regionList}`);
        //     this.regionList = regionList.regionObj.regions;
        //     this.currentRadio = this.regionList[0].value;
        // }
    },
    mounted() {}
};
</script>
<style lang="scss">
.region-radio {
    &.list{
        .el-radio-button {
            margin-right: 5px;
        }
        .el-radio-button__inner{
            background-color: #d9e0e7;
            padding: 7px;
        }
        .is-active .el-radio-button__inner {
            background-color: #455461;
            border-color: #455461;
        }
    }
}
</style>
