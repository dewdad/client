<template>
<div class="mt20">
    <div class="page-body">
        <!-- 搜素栏 -->
        <div class="search-box">
            <!-- 漏洞搜索： -->
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="漏洞搜索：">
                    <el-input placeholder="搜索漏洞名称" v-model="ipt1"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search" icon="el-icon-search">
                        {{$t('common.searchButtonText')}}
                    </el-button>
                </zt-form-item>
            </zt-form>
            <!-- 漏洞状态： -->
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="漏洞状态：">
                    <el-radio-group v-model="status" @change="search">
                        <el-radio border label="">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in statusList" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </zt-form-item>
            </zt-form>
            <!-- 漏洞等级： -->
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="漏洞等级：">
                    <el-radio-group v-model="level" @change="search">
                        <el-radio border label="">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in levelList" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
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
            <el-table-column label="漏洞名称" :min-width="200">
                <template slot-scope="scope">
                    <router-link :to="getRoute(scope.row)">
                        <span class="font12">{{scope.row.leak_name}}</span>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="修复必要性" :min-width="60">
                <template slot-scope="scope">
                    <status-emergent :emergent="scope.row.emergent" ></status-emergent>
                </template>
            </el-table-column>
            <el-table-column label="漏洞等级" :min-width="60">
                <template slot-scope="scope">
                    <status-leak-level :data="scope.row.leak_level" ></status-leak-level>
                </template>
            </el-table-column>
            <el-table-column prop="server_info.length" label="历史收影响资产" :min-width="80">
            </el-table-column>
            <el-table-column label="状态" :min-width="50">
                <template slot-scope="scope">
                    <router-link to="#">
                        <status-leak-status :data="scope.row.status"></status-leak-status>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="cdate" label="最后发现时间" :min-width="90">
            </el-table-column>
            <el-table-column prop="name" label="操作" :min-width="70">
                <template slot-scope="scope">
                    <a @click="showLeakManageIgnore(scope.row)" class="font12" v-if="scope.row.status === '0'">忽略</a>
                    <span class="color-secondary" v-if="scope.row.status == '0'">|</span>
                    <a class="font12">提交工单</a>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                v-if="total"
                @size-change="sizeChange"
                @current-change="fetchLeakManageList"
                :current-page.sync="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                layout="sizes, prev, pager, next"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
    <leak-manage-ignore ref="dialog"></leak-manage-ignore>
</div>
</template>
<script>
import StatusEmergent from '@/views/security/status/emergent.vue';
import StatusLeakLevel from '@/views/security/status/LeakLevel.vue';
import StatusLeakStatus from '@/views/security/status/LeakStatus.vue';
import LabelDropdown from '@/components/label/LabelDropdown';
import LeakManageIgnore from './LeakManageIgnore.vue';
import {leakManageList} from '@/service/security';
import {get} from '@/utils/utils';

import {STATUS_LIST, SEVERITYS, FILTERS} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            status: '', // 漏洞状态
            statusList: STATUS_LIST, // 漏洞状态列表
            level: '', // 漏洞状态
            levelList: SEVERITYS, // 漏洞状态列表
            ipt1: '',
            filters: FILTERS,
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
        dialog() {
            return this.$refs.dialog;
        }
    },
    created() {
        this.fetchLeakManageList();
    },
    methods: {
        getRoute(row) {
            // 区分资产列表
            let name = 'app.security.assetslist.vulnerablity.detail';
            let params = {
                serverID: get(row, `server_info[0].mac_address`, this.serverId),
                cve_no: row.cve_no
            };
            return {
                name,
                params
            };
        },
        showLeakManageIgnore(row) {
            this.dialog.show(row).then(ret => {
                if (ret) {
                    this.$message.success('操作成功');
                    this.fetchLeakManageList();
                } else {
                    // this.$message.error('操作失败');
                }
            });
        },
        sizeChange(val) {
            this.pageIndex = 1;
            this.limit = val;
            this.fetchLeakManageList();
        },
        search() {
            this.pageIndex = 1;
            this.fetchLeakManageList();
        },
        async fetchLeakManageList() {
            try {
                // 清空数据
                this.isLoading = true;
                let params = {
                    leak_name: this.ipt1,
                    leak_level: this.level,
                    processing: this.status,
                    server_id: this.serverId,
                    method: this.method,
                    pageIndex: this.pageIndex,
                    limit: this.limit
                };

                let ret = await leakManageList(params);
                console.log('fetchLeakManageList', ret);

                this.listData = ret;
                this.date = new Date().getTime();

                this.pageIndex = parseInt(ret.pageIndex);
                this.total = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchLeakManageList', error.message);
            }
        },
        getProprotectWwitch(value) {
            let item = this.filters.protect_switch.find(e => e.value === value);
            return item ? item.text : '保护中';
        }
    },
    components: {
        LabelDropdown,
        LeakManageIgnore,
        StatusEmergent,
        StatusLeakStatus,
        StatusLeakLevel
    }
};
</script>

