<template>
<div :class="klass">
    <page-header class="mb10">弱口令检查
        <div slot="content"  class="pull-right">
            <el-button type="info" size="small" @click="exportExcel">
                <i class="iconfont icon-ecport_people"></i> 导出
            </el-button>
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-refresh_people"></i>
            </el-button>
        </div>
    </page-header>
    <div class="page-body">
        <!-- 搜素栏 -->
        <div class="search-box">
            <!-- 是否处理： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="弱密码类型：">
                    <el-radio-group v-model="type" @change="search">
                        <el-radio border :label="undefined">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in weak_pwd_type" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </zt-form-item>
            </zt-form>
            <!-- 应用名称： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="应用名称：">
                    <el-input placeholder="搜索应用名称" v-model="inputval"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search" icon="el-icon-search">
                        {{$t('common.searchButtonText')}}
                    </el-button>
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
            <el-table-column prop="title" label="主机IP/名称" :min-width="200">
                <template slot-scope="scope">
                    <div class="font12">{{scope.row.server_info.server_detail.ip}}</div>
                    <div class="font12">{{scope.row.server_info.server_detail.host_name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="service_name" label="应用">
            </el-table-column>
            <el-table-column prop="user_name" label="账号名">
            </el-table-column>
            <el-table-column prop="user_pwd" label="密码值">
            </el-table-column>
            <el-table-column label="弱密码类型" >
                <template slot-scope="scope">
                    <span>{{getWeakType(scope.row.weak_type)}}</span>
                </template>
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
</div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import StatusLeakLevel from '@/views/security/status/LeakLevel.vue';
import StatusEmergent from '@/views/security/status/emergent.vue';
import StatusLeakStatus from '@/views/security/status/LeakStatus.vue';
import {weakPwdDetail} from '@/service/security';
import {WEAK_PWD_TYPE} from '@/constants/dicts/security.js';
import {exportExcel} from '@/utils/files.js';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            type: undefined, // 漏洞状态
            weak_pwd_type: WEAK_PWD_TYPE, // 基线状态列表
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
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        exportExcel() {
            try {
                exportExcel({el: '.el-table', name: '弱口令检查'});
            } catch (error) {
                this.$message.error('导出 Excel 失败。');
                console.error('导出 Excel 失败', error.message);
            }
        },
        getWeakType(val) {
            let item = this.weak_pwd_type.find(e => e.value === val);
            return item ? item.label : val;
        },
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
                    server_id: this.serverId,
                    type: this.type,
                    service_name: this.inputval,
                    limit: this.limit,
                    pageIndex: this.pageIndex
                };

                let ret = await weakPwdDetail(params);
                console.log('fetchData', ret);

                this.listData = ret;
                this.date = new Date().getTime();

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
        PageHeader,
        LabelDropdown,
        StatusEmergent,
        StatusLeakLevel,
        StatusLeakStatus
    }
};
</script>
