<template>
    <el-select v-model="ids" :multiple="multiple" :disabled="disabled" value-key="id" no-data-text="暂无云盘" :loading="loading" :placeholder="placeholder">
        <el-option v-for="item in diskList" :key="item.id" :label="item.name" :value="item"></el-option>
    </el-select>
</template>
<script>
import {getAllDisk} from '@/service/ecs/disk/disk.js';
export default {
    data() {
        return {
            ids: null,
            loading: false,
            diskList: []
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择云盘'
        },
        value: {
            type: [String, Array]
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        ids: function(newval) {
            this.$emit('input', newval);
        }
    },
    created() {
        this.getAllDisk();
        this.ids = this.value;
    },
    methods: {
        getAllDisk() {
            this.loading = true;
            getAllDisk().then(
                res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let jsonData = res.data;
                        this.diskList = jsonData.data || [];
                    }
                }
            ).finally(() => {
                this.loading = false;
            });
        }
    }

};
</script>
<style scoped>
</style>
