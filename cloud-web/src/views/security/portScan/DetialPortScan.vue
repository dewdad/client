<template>
<div :class="klass">
    <page-header class="mb10">防端口扫描
        <div slot="content"  class="pull-right">
            <setting v-if="!serverId"></setting>
            <el-button type="info" size="small" @click="search">
                <i class="iconfont icon-refresh_people"></i>
            </el-button>
        </div>
    </page-header>
    <div class="page-body">
        <!-- 搜素栏 -->
        <div class="search-box">
            <!-- 攻击来源： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="攻击来源：">
                    <el-input placeholder="搜索攻击来源IP" v-model="inputval"></el-input>
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
            <!-- 类型筛选： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="类型筛选：">
                    <el-radio-group v-model="type" @change="search">
                        <el-radio border :label="item.value" v-for="item in anti_violence_handle_status" :key="item.value">{{item.label}}</el-radio>
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
            <el-table-column prop="title" label="攻击IP" :min-width="100">
                <template slot-scope="scope">
                    <div class="font12">{{scope.row.src_ip}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="src_area" label="归属地">
            </el-table-column>
            <el-table-column prop="des_ip" label="攻击目标" >
                <template slot-scope="scope">
                    <router-link :to="{name: 'app.security.assetslist', query: {ip: scope.row.des_ip}}">{{scope.row.des_ip}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="ban_date" label="封禁时间" :min-width="110">
            </el-table-column>
            <el-table-column prop="ban_times" label="累计封停次数" :min-width="55">
            </el-table-column>
            <el-table-column prop="title" label="封禁状态" :min-width="55">
                <template slot-scope="scope">
                    <antiviolence-status :data="scope.row.status"></antiviolence-status>
                </template>
            </el-table-column>
             <el-table-column prop="name" label="操作" :min-width="140">
                <template slot-scope="scope">
                    <span class="text-nowrap color-secondary">
                        <el-button @click="portScanAddTrust(scope.row)" type="text" :disabled="scope.row.status === '2'">误报</el-button>|<el-button @click="portScanAddTrust(scope.row)" type="text" :disabled="scope.row.status === '0'">封停</el-button>|<el-button @click="portScanUnlockIP(scope.row)" type="text" :disabled="scope.row.status !== '0'">解封</el-button>|<el-button type="text">提交工单</el-button>
                    </span>
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
import Setting from '@/views/security/portScan/Setting.vue';

import StatusLeakLevel from '@/views/security/status/LeakLevel.vue';
import StatusEmergent from '@/views/security/status/emergent.vue';
import StatusLeakStatus from '@/views/security/status/LeakStatus.vue';
import AntiviolenceStatus from '@/views/security/status/AntiviolenceStatus.vue';
import {
    portScanAddTrust,
    portScanDetail,
    portScanUnlockIP
} from '@/service/security';
import {ANTI_VIOLENCE_HANDLE_STATUS} from '@/constants/dicts/security.js';
import {dateFormat} from '@/utils/utils';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            type: '0', // 是否封停 0：全部 1：已封停 2：未封停 3：误报
            anti_violence_handle_status: ANTI_VIOLENCE_HANDLE_STATUS.filter(
                e => e.value !== '3'
            ),
            date: [], // 时间
            inputval: '',
            handle_status: '0',
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
        start_date() {
            if (!this.date || !this.date.length) return '0';
            return dateFormat(this.date[0].toString(), 'YYYY-MM-DD HH:mm:ss');
        },
        end_date() {
            if (!this.date || !this.date.length) return '0';
            return dateFormat(this.date[1].toString(), 'YYYY-MM-DD HH:mm:ss');
        },
        klass() {
            return this.serverId ? 'page-body mt20' : 'page-main';
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        portScanAddTrust(row) {
            this.$confirm(
                `您确定要将此条记录设为误报吗？</br>确认误报后，系统将不会再扫描出这条记录。`,
                '提示',
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }
            )
                .then(() => {
                    return portScanAddTrust({
                        server_id: this.serverId,
                        src_ip: row.src_ip
                    });
                })
                .then(ret => {
                    $log('portScanAddTrust', ret);
                    if (ret) {
                        this.$message.success('操作成功');
                        setTimeout(() => {
                            this.fetchData();
                        }, 1000);
                    } else {
                        // this.$message.error('操作失败');
                    }
                })
                .catch(error => {
                    console.warn('portScanAddTrust 失败', error.message);
                });
        },
        portScanUnlockIP(row) {
            this.$confirm(`您确定解封该记录吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(() => {
                    return portScanUnlockIP({
                        server_id: this.serverId,
                        src_ip: row.src_ip
                    });
                })
                .then(ret => {
                    $log('portScanUnlockIP', ret);
                    if (ret) {
                        this.$message.success('操作成功');
                        setTimeout(() => {
                            this.fetchData();
                        }, 1000);
                    } else {
                        // this.$message.error('操作失败');
                    }
                })
                .catch(error => {
                    console.warn('portScanUnlockIP 失败', error.message);
                });
        },
        getWeakType(val) {
            let item = this.anti_violence_handle_status.find(
                e => e.value === val
            );
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
                    limit: this.limit,
                    pageIndex: this.pageIndex,
                    server_id: this.serverId,
                    handle_status: this.type,
                    server_type: this.server_type,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    src_ip: this.inputval
                };

                let ret = await portScanDetail(params);
                console.log('fetchData', ret);

                this.listData = ret;

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
        Setting,
        StatusEmergent,
        StatusLeakLevel,
        AntiviolenceStatus,
        StatusLeakStatus
    }
};
</script>
