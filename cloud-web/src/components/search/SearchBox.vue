<template>
    <div class="search-box">
        <zt-form :inline="true" size="small" class="search-form-inline">
            <zt-form-item label="">
                <el-select clearable v-model="allSearchVal.selValue" value-key="field" @change="allSearchVal.selInputValue='';" placeholder="请选择">
                    <el-option v-for="field in searchObjExtra.fields" :label="field.label" :value="field" :key="field.field"></el-option>
                </el-select>
            </zt-form-item>
            <zt-form-item label="">
                <el-input placeholder="" style="width:260px;" v-model="allSearchVal.selInputValue"></el-input>
            </zt-form-item>
            <zt-form-item>
                <el-button type="primary" @click="getSearchVal" icon="el-icon-search">搜索</el-button>
            </zt-form-item>
        </zt-form>
    </div>
</template>
<script>
import {isArray} from '@/utils/utils';
export default {
    name: 'SearchBox',
    data() {
        return {
            allSearchVal: {
                selValue: '',
                selInputValue: ''
            },            
        };
    },
    props: {
        searchObjExtra: {
            type: Object
        }
    },
    created() {
        // 默认选中第一个
        if (isArray(this.searchObjExtra.fields)) {
            this.allSearchVal.selValue = this.searchObjExtra.fields[0];
        }
    },
    methods: {
        getSearchVal() {
            this.$emit('select', this.allSearchVal);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>

