<template>
    <div class="zt-table">
        <el-table  :data="dataList" v-loading="loading" stripe border class="data-list">
            <el-table-column v-for="column in tableColums" :width="column.width ? column.width : 'auto'" :prop="column.prop" :label="column.label"  :key="column.label">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default{
    name: 'ZtTable',
    data() {
        return {
            h: null
        };
    },
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        tableColums: {
            type: Array
        },
        dataList: {
            type: Array
        }
    },
    created() {
        // this.$options.render = h => this.a = h;
        // console.log(this.$createElement);
    },
    methods: {
    }
};
</script>
<style scoped>
</style>
