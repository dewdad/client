<template>
    <el-select v-model="ids" :multiple="multiple" :disabled="disabled" no-data-text="暂无联系人" value-key="id" :loading="loading" :placeholder="placeholder">
        <el-option v-for="item in noticeList" :key="item.id" :label="item.name" :value="item"></el-option>
    </el-select>
</template>
<script>
import {alarmNoticeList} from '@/service/monitor/alarmRule';
export default {
    data() {
        return {
            ids: null,
            loading: false,
            noticeList: []
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择联系人'
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
        this.getAllNotice();
        this.ids = this.value;
    },
    methods: {
        getAllNotice() {
            this.loading = true;
            alarmNoticeList({limit: 9999, pageIndex: 1}).then(
                res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let jsonData = res.data;
                        this.noticeList = jsonData.data || [];
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
