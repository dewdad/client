<template>
    <el-select v-model="ids" :multiple="multiple" no-data-text="暂无类型" :loading="loading" :placeholder="placeholder">
        <el-option v-for="item in dataList" :key="item.id" :label="item.name" :value="item.value"></el-option>
    </el-select>
</template>
<script>
import {getSysConfig} from '@/service/app';
export default {
    data() {
        return {
            ids: null,
            loading: false,
            dataList: []
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择产品类型'
        },
        value: {
            type: [String, Array]
        }
    },
    watch: {
        ids: function(newval) {
            this.$emit('input', newval);
        }
    },
    created() {
        this.getData();
        this.ids = this.value;
    },
    methods: {
        getData() {
            this.loading = true;
            getSysConfig({code: 'alarm.types'})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let jsonData = res.data;
                        this.dataList = jsonData.data[0].itemList || [];
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style scoped>
</style>
