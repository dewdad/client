<template>
<div class="page-main safecfg-page">
    <page-header class="mb20">告警配置</page-header>
    <el-table
            v-loading="isLoading"
            :data="listData"
            class="data-list mt10"
            row-class-name="data-list"
            header-row-class-name="data-list"
            stripe
            border
        >
        <el-table-column label="通知项目">
            <template slot-scope="scope">
                <div class="font12">{{getName(scope.row.type_name)}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="src_area" label="通知方式"  :min-width="150">
            <template slot-scope="scope">
                <el-checkbox disabled :value="scope.row.email_send === '1'">邮件</el-checkbox>
                <el-checkbox disabled :value="scope.row.sms_send === '1'">短信</el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="des_ip" label="通知时间" :min-width="200">
            <template slot-scope="scope">
                <div class="font12">{{getTimeType(scope.row.send_time)}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="cdate" label="创建时间" :min-width="110">
        </el-table-column>
        <el-table-column prop="mdate" label="更新时间" :min-width="110">
        </el-table-column>
        <el-table-column prop="name" label="操作" :min-width="30">
            <template slot-scope="scope">
                <span class="text-nowrap color-secondary">
                    <el-button @click="edit(scope.row)" type="text" :disabled="scope.row.status === '2'">编辑</el-button>
                </span>
            </template>
        </el-table-column>
    </el-table>
    <edit ref="edit"></edit>
</div>
</template>

<script>
import {getWarningConfig} from '@/service/security';
import {WEAKTYPES, EVENTTYPES} from '@/constants/dicts/security.js';
import Edit from './Edit';

const TYPE = [...WEAKTYPES, ...EVENTTYPES];

export default {
    components: {Edit},
    data() {
        return {
            isLoading: false,
            listData: []
        };
    },
    methods: {
        async fetchData() {
            try {
                // 清空数据
                this.isLoading = true;
                let ret = await getWarningConfig();
                console.log('fetchData', ret);
                this.listData = ret;
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        },
        edit(data) {
            this.$refs.edit &&
                this.$refs.edit
                    .show({name: this.getName(data.type_name), ...data})
                    .then(ret => {
                        if (ret) {
                            this.fetchData();
                        }
                    });
        },
        getName(val) {
            // HACK
            if (val === 'host') {
                val = 'host_anomaly';
            }
            let item = TYPE.find(e => e.value === val);
            return item ? item.label : val;
        },
        getTimeType(val) {
            let list = {
                '1': '每周一',
                '2': '任何时间',
                '3': '仅8:00-20:00（仅工作时间，不含周末）'
            };
            return list[val] || val;
        }
    },
    async created() {
        this.fetchData();
    }
};
</script>

<style lang="scss">
.safecfg-page {
    .content {
        box-sizing: border-box;
        padding: 20px 10px;
    }
}
</style>
