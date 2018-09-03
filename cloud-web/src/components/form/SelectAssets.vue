<template>
<zt-form-item label="资产选择" :label-width="labelWidth" :prop="prop">
    <el-select clearable v-model="data" value-key="field" placeholder="请选择资产" @clear="$emit('clear')">
        <el-option v-for="item in assetList.data" :label="item.ip" :value="item.mac_address" :key="item.mac_address"></el-option>
    </el-select>
</zt-form-item>
</template>

<script>
import {mapState} from 'vuex';
export default {
    computed: {
        ...mapState('security', ['assetList'])
    },
    props: ['value', 'label-width', 'prop'],
    data() {
        return {
            data: this.value
        };
    },
    watch: {
        value(val) {
            this.data = val;
        },
        data() {
            this.$emit('input', this.data);
        }
    }
};
</script>

<style>
</style>
