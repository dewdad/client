<template>
<div class="vulnerablity-detail" :class="{'page-main': isPage}">
    <page-header>
        <span class="font14 border-left">{{data.title}}</span>
        <div slot="right">
            <!-- 刷新按钮 -->
            <el-button type="info" size="small">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <div class="panel panel-default mt20" v-if="data">
        <div class="panel-heading">
            <i class="ecs-ecs_essential-information_people"></i>{{ $t('security.basicInfo') }}
        </div>
        <div class="panel-body zt-panel-body-info">
            <div class="content">
                <p class="font12 mt10">风险分类：{{getRiskType(data.type)}}</p>
                <p class="font12 mt10">检测项说明：</p>
                <p v-html="data.desc" class="bg font12"></p>
            </div>
        </div>
    </div>
    <div class="mt20">
        <div class="font16">影响资产</div>
        <div class="search-box mt10">
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="资产选择：">
                    <el-input placeholder="搜索资产IP或名称" v-model="inputval"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search" icon="el-icon-search">
                        {{$t('common.searchButtonText')}}
                    </el-button>
                    <label-dropdown @select="search"></label-dropdown>
                </zt-form-item>
            </zt-form>
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="是否处理：">
                    <el-radio-group v-model="handleStatus" @change="search">
                        <el-radio border label="0">全部</el-radio>
                        <el-radio border label="1">未处理</el-radio>
                        <el-radio border label="2">已处理</el-radio>
                    </el-radio-group>
                </zt-form-item>
            </zt-form>
        </div>
                <!-- 表格 -->
        <el-table
            :data="listData"
            class="data-list mt10"
            row-class-name="data-list"
            header-row-class-name="data-list"
            size="small"
            stripe
            border
            >
            <el-table-column label="影响资产" :min-width="120">
                <template slot-scope="scope">
                    <div class="font12">{{scope.row.server_info.server_detail.ip}}({{scope.row.server_info.server_detail.host_name}})</div>
                </template>
            </el-table-column>
            <el-table-column label="状态" :min-width="50">
                <template slot-scope="scope">
                    <router-link to="#">
                        <status-leak-status :data="scope.row.status"></status-leak-status>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="solution" label="风险详情" :min-width="200">
            </el-table-column>
            <el-table-column label="首次/最后发现时间" :min-width="90">
                <template slot-scope="scope">
                    <div>{{scope.row.cdate}}</div>
                    <div>{{scope.row.mdate}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" :min-width="60">
                <template slot-scope="scope">
                    <a class="font12" @click="verify(scope.row)">验证</a>
                    <span class="color-secondary">|</span>
                    <a @click="baseLineIgnore(scope.row)" class="font12" v-if="scope.row.status === '0'">忽略</a>
                    <a @click="baseLineIgnoreCancel(scope.row)" class="font12" v-else>取消忽略</a>
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
    <leak-manage-ignore ref="dialog"></leak-manage-ignore>
</div>
</template>

<script>
import {
    baseLineDetail,
    baseLineIgnore,
    baseLineIgnoreCancel,
    baseLineVerify
} from '@/service/security';
import StatusLeakStatus from '@/views/security/status/LeakStatus.vue';
import StatusEmergent from '@/views/security/status/emergent.vue';
import LeakManageIgnore from '@/views/security/assetsList/LeakManageIgnore.vue';
import {RISK_TYPE} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            inputval: '',
            handleStatus: '0',
            data: {},
            listData: []
        };
    },
    watch: {
        $route: {
            immediate: true,
            handler: function() {
                this.search();
            }
        }
    },
    components: {
        StatusLeakStatus,
        LeakManageIgnore,
        StatusEmergent
    },
    computed: {
        riskNo() {
            return this.$route.params.no;
        },
        serverID() {
            return this.$route.params.serverID;
        },
        dialog() {
            return this.$refs.dialog;
        },
        isPage() {
            return this.$route.name === 'app.security.baselinecheck.detail';
        }
    },
    methods: {
        getRiskType(val) {
            let item = RISK_TYPE.find(e => e.value === val);
            return item ? item.label : val;
        },
        async baseLineIgnore(row) {
            try {
                let ret = await baseLineIgnore({
                    server_id: this.serverID,
                    riskNo: this.riskNo
                });
                if (ret) {
                    this.$message.success('操作成功');
                    setTimeout(() => {
                        this.fetchData();
                    }, 1000);
                }
            } catch (error) {
                console.warn('基线忽略失败', error.message);
            }
        },
        async baseLineIgnoreCancel(row) {
            try {
                let ret = await baseLineIgnoreCancel({
                    server_id: this.serverID,
                    riskNo: this.riskNo
                });
                if (ret) {
                    this.$message.success('操作成功');
                    setTimeout(() => {
                        this.fetchData();
                    }, 1000);
                }
            } catch (error) {
                console.warn('基线取消忽略失败', error.message);
            }
        },
        verify(row) {
            console.warn(row);
            this.$confirm('您确定要验证这些风险吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(() => {
                    return baseLineVerify({
                        serverId: this.serverID,
                        riskNo: row.no
                    });
                })
                .then(ret => {
                    if (ret) {
                        this.$message.success('操作成功');
                        this.fetchData();
                    } else {
                        // this.$message.error('操作失败');
                    }
                })
                .catch(err => {
                    if (err && err !== 'cancel') {
                        console.warn('验证操作失败', err.message);
                        // this.$message.error('操作失败');
                    }
                });
        },
        search() {
            this.pageIndex = 1;
            this.fetchData();
        },
        sizeChange(val) {
            this.pageIndex = 1;
            this.limit = val;
            this.fetchData();
        },
        async fetchData() {
            try {
                // 清空数据
                this.isLoading = true;
                let params = {
                    serverName: this.inputval,
                    pageIndex: this.pageIndex,
                    limit: this.limit,
                    handleStatus: this.handleStatus,
                    riskNo: this.riskNo,
                    serverId: this.serverID
                };
                let ret = await baseLineDetail(params);
                console.log('fetchData', ret);
                if (ret.data) {
                    this.data = ret.data[0];
                    this.date = new Date().getTime();
                }
                this.listData = ret.data;

                this.pageIndex = parseInt(ret.pageIndex);
                this.total = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        }
    }
};
</script>

<style lang="scss">
.vulnerablity-detail {
    tbody {
        border-bottom: 1px solid #e8e8e8;
    }
    .content {
        box-sizing: border-box;
        padding: 10px;
    }
    .bg {
        box-sizing: border-box;
        background-color: #f9fafd;
        padding: 20px;
    }
}
</style>
