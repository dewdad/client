<template>
    <el-select v-model="instanceIds" :multiple="multiple" :disabled="disabled" no-data-text="暂无实例" :loading="loading" :placeholder="placeholder">
        <el-option v-for="item in ecsInsts" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import {getEcsInstList} from '@/service/ecs/list.js';
export default {
    data() {
        return {
            instanceIds: null,
            loading: false,
            ecsInsts: []
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择实例'
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
        instanceIds: function(newval) {
            this.$emit('input', newval);
        }
    },
    created() {
        this.getEcsInstAll();
        this.instanceIds = this.value;
    },
    methods: {
        getEcsInstAll() {
            this.loading = true;
            getEcsInstList({status: 'active'}).then(
                res => {
                    if (res && res.data) {
                        let data = res.data;
                        if (data.code && data.code === this.CODE.SUCCESS_CODE) {
                            let jsonData = data.data;
                            console.log('jsonData', jsonData);
                            if (jsonData && jsonData.data) {
                                let ecsInsts = jsonData.data || [];
                                this.ecsInsts = ecsInsts;
                            }
                        }
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
