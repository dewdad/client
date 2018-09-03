<template>
<div :class="klass">
    <!-- 搜素栏 -->
    <page-header v-if="!serverId" class="mb10">弱口令检查
        <div slot="content"  class="pull-right">
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-refresh_people"></i>
            </el-button>
        </div>
    </page-header>
    <div class="search-box">
        <!-- 风险名称： -->
        <zt-form :inline="true" size="small" class="search-form-inline">
            <zt-form-item label="风险名称：">
                <el-input placeholder="搜索风险名称" v-model="inputval"></el-input>
            </zt-form-item>
            <zt-form-item>
                <!-- 查询按钮 -->
                <el-button type="primary" @click="search" icon="el-icon-search">
                    {{$t('common.searchButtonText')}}
                </el-button>
            </zt-form-item>
        </zt-form>
        <!-- 是否处理： -->
        <zt-form :inline="true" size="small" class="search-form-inline">
            <zt-form-item label="是否处理：">
                <el-radio-group v-model="status" @change="search">
                    <el-radio border label="0">全部</el-radio>
                    <el-radio border :label="item.value" v-for="item in baselineStatusList" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </zt-form-item>
        </zt-form>
        <!-- 风险分类： -->
        <zt-form :inline="true" size="small" class="search-form-inline">
            <zt-form-item label="风险分类：">
                <el-radio-group v-model="riskType" @change="search">
                    <el-radio border label="">全部</el-radio>
                    <el-radio border :label="item.value" v-for="item in riskList" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </zt-form-item>
        </zt-form>
        <!-- 漏洞等级： -->
        <zt-form :inline="true" size="small" class="search-form-inline">
            <zt-form-item label="漏洞等级：">
                <el-radio-group v-model="riskLevel" @change="search">
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
        <el-table-column prop="title" label="风险名称" :min-width="140">
            <template slot-scope="scope">
                <router-link :to="getRoute(scope.row)">
                    <span class="font12">{{scope.row.title}}</span>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column label="修复必要性">
            <template slot-scope="scope">
                <status-emergent :emergent="scope.row.emergent" ></status-emergent>
            </template>
        </el-table-column>
        <el-table-column label="风险等级" :min-width="50">
            <template slot-scope="scope">
                <status-leak-level :data="scope.row.level" ></status-leak-level>
            </template>
        </el-table-column>
        <el-table-column label="风险分类"  :min-width="50">
            <template slot-scope="scope">
                <span>{{getRiskType(scope.row.type)}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="server_info.length" label="当前未处理资产" :min-width="70">
        </el-table-column>
        <el-table-column label="状态" :min-width="50">
                <template slot-scope="scope">
                    <status-leak-status :data="scope.row.status"></status-leak-status>
                </template>
        </el-table-column>
        <el-table-column prop="mdate" label="最后发现时间" :min-width="90">
        </el-table-column>
        <el-table-column prop="name" label="操作" :min-width="80">
            <template slot-scope="scope" >
                <span v-if="scope.row.status === '3'" class="el-dropdown-link font12" @click="baseLineIgnoreCancel(scope.row)">取消忽略</span>
                <span v-else class="el-dropdown-link font12" @click="baseLineIgnore(scope.row)">忽略</span>
                |
                <span class="el-dropdown-link font12">提交工单</span>
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
</template>
<script>
import LabelDropdown from '@/components/label/LabelDropdown';
import StatusLeakLevel from '@/views/security/status/LeakLevel.vue';
import StatusEmergent from '@/views/security/status/emergent.vue';
import StatusLeakStatus from '@/views/security/status/LeakStatus.vue';
import {get} from '@/utils/utils';
import {
    baseLineList,
    baseLineIgnore,
    baseLineIgnoreCancel
} from '@/service/security';
import {BASELINE_STATUS_LIST, SEVERITYS, RISK_TYPE} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            status: '0', // 漏洞状态
            baselineStatusList: BASELINE_STATUS_LIST, // 基线状态列表
            riskType: '', // 风险分类：
            levelList: SEVERITYS, // 漏洞状态列表
            riskLevel: '', // 漏洞等级
            riskList: RISK_TYPE, // 风险分类
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
        getRoute(row) {
            // 区分资产列表
            let name = this.serverId
                ? 'app.security.assetslist.baselinecheck.detail'
                : 'app.security.baselinecheck.detail';
            let params = {
                serverID: get(row, `server_info[0].mac_address`, this.serverId),
                no: row.no
            };
            return {
                name,
                params
            };
        },
        async baseLineIgnore(row) {
            try {
                $log('baseLineIgnore -> ', row);
                let server_id = get(
                    row,
                    `server_info[0].mac_address`,
                    this.serverId
                );
                let ret = await baseLineIgnore({
                    riskNo: row.no,
                    server_id
                });
                $log('baseLineIgnore', ret);
                if (ret) {
                    this.$message.success('操作成功');
                    this.fetchData();
                }
            } catch (error) {
                console.warn('baseLineIgnore', error.message);
            }
        },
        async baseLineIgnoreCancel(row) {
            try {
                $log('baseLineIgnore -> ', row);
                let server_id = get(
                    row,
                    `server_info[0].mac_address`,
                    this.serverId
                );
                let ret = await baseLineIgnoreCancel({
                    riskNo: row.no,
                    server_id
                });
                $log('baseLineIgnore', ret);
                if (ret) {
                    this.$message.success('操作成功');
                    this.fetchData();
                }
            } catch (error) {
                console.warn('baseLineIgnore', error.message);
            }
        },
        getRiskType(val) {
            let item = this.riskList.find(e => e.value === val);
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
                    title: this.inputval,
                    handleStatus: this.status,
                    riskType: this.riskType,
                    riskLevel: this.riskLevel,
                    serverId: this.serverId,
                    limit: this.limit,
                    pageIndex: this.pageIndex
                };

                let ret = await baseLineList(params);
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
        LabelDropdown,
        StatusEmergent,
        StatusLeakLevel,
        StatusLeakStatus
    }
};
</script>
