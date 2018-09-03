<template>
<div :class="klass">
    <page-header class="mb10">防暴力破解
        <div slot="content"  class="pull-right">
            <!-- <el-button type="primary" size="small">设置暴力破解</el-button> -->
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
            <!-- 服务类型： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="服务类型：">
                    <el-radio-group v-model="server_type" @change="search">
                        <el-radio border label="all">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in server_type_list" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
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
            <el-table-column prop="title" label="攻击IP" :min-width="110">
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
            <el-table-column prop="user" label="受攻击帐号" :min-width="55">
            </el-table-column>
            <el-table-column prop="cdate" label="攻击时间" :min-width="110">
            </el-table-column>
            <el-table-column prop="cdate" label="最近封停时间" :min-width="110">
            </el-table-column>
            <el-table-column prop="ban_times" label="攻击次数" :min-width="55">
            </el-table-column>
            <el-table-column prop="title" label="处理结果" :min-width="55">
                <template slot-scope="scope">
                    <antiviolence-status :data="scope.row.status"></antiviolence-status>
                </template>
            </el-table-column>
             <el-table-column prop="name" label="操作" :min-width="140">
                <template slot-scope="scope">
                    <span class="text-nowrap color-secondary">
                        <el-button @click="bruteForceAddTrust(scope.row)" type="text" :disabled="scope.row.status === '2'">误报</el-button>|<el-button @click="bruteForceAddTrust(scope.row)" type="text" :disabled="scope.row.status === '0'">封停</el-button>|<el-button @click="bruteForceUnlockIP(scope.row)" type="text" :disabled="scope.row.status !== '0'">解封</el-button>|<el-button type="text">提交工单</el-button>
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
import Setting from '@/views/security/violenceCracking/Setting.vue';
import StatusLeakLevel from '@/views/security/status/LeakLevel.vue';
import StatusEmergent from '@/views/security/status/emergent.vue';
import StatusLeakStatus from '@/views/security/status/LeakStatus.vue';
import AntiviolenceStatus from '@/views/security/status/AntiviolenceStatus.vue';
import {get} from '@/utils/utils';

import {
    bruteForceAddTrust,
    bruteForceDetail,
    bruteForceUnlockIP
} from '@/service/security';
import {SERVER_TYPE, ANTI_VIOLENCE_HANDLE_STATUS} from '@/constants/dicts/security.js';
import {dateFormat} from '@/utils/utils';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            server_type: 'all', // 服务类型
            server_type_list: SERVER_TYPE, // 服务类型 all：全部 sshd：ssh服务 vsftpd：ftp服务 mysql：mysql服务 tomcat：tomcat服务
            type: '0', // 是否封停 0：全部 1：已封停 2：未封停 3：误报
            anti_violence_handle_status: ANTI_VIOLENCE_HANDLE_STATUS,
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
        bruteForceAddTrust(row) {
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
                    let server_id = get(
                        row,
                        `server_info.mac_address`,
                        this.serverId
                    );
                    return bruteForceAddTrust({
                        server_id,
                        src_ip: row.src_ip
                    });
                })
                .then(ret => {
                    $log('bruteForceAddTrust', ret);
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
                    console.warn('bruteForceAddTrust 失败', error.message);
                });
        },
        bruteForceUnlockIP(row) {
            this.$confirm(`您确定解封该记录吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(() => {
                    let server_id = get(
                        row,
                        `server_info.mac_address`,
                        this.serverId
                    );
                    return bruteForceUnlockIP({
                        server_id,
                        src_ip: row.src_ip
                    });
                })
                .then(ret => {
                    $log('bruteForceUnlockIP', ret);
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
                    console.warn('bruteForceUnlockIP 失败', error.message);
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
                    type: this.type,
                    server_type: this.server_type,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    src_ip: this.inputval
                };

                let ret = await bruteForceDetail(params);
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
