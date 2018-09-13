<template>
<div :class="klass">
    <!-- 搜素栏 -->
    <page-header v-if="!serverId" class="mb10">操作审计
        <div slot="content"  class="pull-right">
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <div class="search-box">
        <!-- 风险名称： -->
        <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
            <zt-form-item label="搜索：">
                <el-input placeholder="主机IP" v-model="inputval"></el-input>
            </zt-form-item>
            <zt-form-item>
                <!-- 查询按钮 -->
                <el-button type="primary" @click="search" icon="el-icon-search">
                    {{$t('common.searchButtonText')}}
                </el-button>
            </zt-form-item>
        </zt-form>
        <!-- 时间区间 -->
        <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
            <zt-form-item label="时间区间：">
                <el-date-picker v-model="date" @change="search" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </zt-form-item>
        </zt-form>
    </div>
    <!-- 表格 -->
    <el-table
        v-loading="isLoading"
        :data="tableData"
        class="data-list mt10"
        row-class-name="data-list"
        header-row-class-name="data-list"
        size="small"
        stripe
        border
    >
        <el-table-column prop="title" label="主机">
            <template slot-scope="scope" :min-width="90">
                <span class="font12">{{scope.row.host_ip}}</span>
            </template>
        </el-table-column>
        <el-table-column label="命令内容" :min-width="140">
            <template slot-scope="scope">
                <span class="font12">{{scope.row.cmd}}</span>
            </template>
        </el-table-column>
        <el-table-column  prop="login_user" label="登录用户" :min-width="40">
        </el-table-column>
        <el-table-column  prop="login_ip" label="登录IP">
        </el-table-column>
        <el-table-column  prop="login_ip_area" label="归属地" :min-width="50">
        </el-table-column>
        <el-table-column prop="op_date" label="操作时间" :min-width="90">
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
        <el-pagination
            v-if="total"
            @size-change="sizeChange"
            @current-change="fetchData"
            :current-page.sync="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            layout="sizes, prev, pager, next"
            :total="total"
        >
        </el-pagination>
    </div>
</div>
</template>
<script>
import LabelDropdown from '@/components/label/LabelDropdown';
import StatusLeakLevel from '@/views/security/status/LeakLevel.vue';
import StatusEmergent from '@/views/security/status/emergent.vue';
import StatusLeakStatus from '@/views/security/status/LeakStatus.vue';
import {dateFormat} from '@/utils/utils';
import {opAuditList} from '@/service/security';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            date: [],
            inputval: '',
            listData: {}
        };
    },
    computed: {
        tableData() {
            return this.listData ? this.listData.data || [] : [];
        },
        serverId() {
            return this.$route.params.serverID;
        },
        klass() {
            return this.serverId ? 'page-body mt20' : 'page-main';
        },
        start_date() {
            if (!this.date || !this.date.length) return '0';
            return dateFormat(this.date[0].toString(), 'YYYY-MM-DD HH:mm:ss');
        },
        end_date() {
            if (!this.date || !this.date.length) return '0';
            return dateFormat(this.date[1].toString(), 'YYYY-MM-DD HH:mm:ss');
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        sizeChange(val) {
            this.pageIndex = 1;
            this.limit = val;
            this.fetchData();
        },
        search() {
            this.pageIndex = 1;
            this.fetchData();
        },
        async fetchData() {
            try {
                // 清空数据
                this.isLoading = true;
                let params = {
                    server_name: this.inputval,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    limit: this.limit,
                    pageIndex: this.pageIndex
                };

                let ret = await opAuditList(params);
                console.log('fetchData', ret);

                this.listData = ret;
                // this.date = new Date().getTime();

                this.pageIndex = parseInt(ret.pageIndex);
                this.total = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        }
    },
    components: {
        LabelDropdown,
        StatusEmergent,
        StatusLeakLevel,
        StatusLeakStatus
    }
};
</script>
