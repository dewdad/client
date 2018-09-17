<template>
    <el-select v-model="ids" :multiple="multiple" :disabled="disabled" no-data-text="暂无Bucket" :loading="loading" :placeholder="placeholder">
        <el-option v-for="item in bucketList" :key="item.owner.id" :label="item.name" :value="item.name"></el-option>
    </el-select>
</template>
<script>
import {getBucketListByUid} from '@/service/oss/index';
export default {
    data() {
        return {
            ids: null,
            loading: false,
            bucketList: []
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择bucket'
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
        this.getBucket();
        this.ids = this.value;
    },
    methods: {
        getBucket() {
            this.loading = true;
            getBucketListByUid()
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.bucketList = res.data || [];
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
