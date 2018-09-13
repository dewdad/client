<template>
<div :class="klass">
    <page-header class="mb10">异常登录
        <div slot="content"  class="pull-right">
            <!-- <el-button type="primary" size="small">设置暴力破解</el-button> -->
            <el-button type="info" size="small" @click="search">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <div class="page-body mt20">
        <!-- 搜素栏 -->
        <div class="search-box">
            <!-- 攻击来源： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="服务器IP：">
                    <el-input placeholder="服务器IP或名称" v-model="inputval"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search" icon="el-icon-search">
                        {{$t('common.searchButtonText')}}
                    </el-button>
                </zt-form-item>
            </zt-form>
            <!-- 类型筛选： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="告警类型：">
                    <el-radio-group v-model="alert_type" @change="search">
                        <el-radio border :label="undefined">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in alert_type_list" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </zt-form-item>
            
            </zt-form>
            <!-- 类型筛选： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="类型筛选：">
                    <el-radio-group v-model="handle_status" @change="search">
                        <el-radio border label="0">全部</el-radio>
                        <el-radio border label="1">未处理</el-radio>
                        <el-radio border label="2">已处理</el-radio>
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
            <el-table-column prop="title" label="主机IP/名称" :min-width="140">
                <template slot-scope="scope">
                    <div class="font12">{{scope.row.server_info.server_detail.ip}}</div>
                    <div class="font12">{{scope.row.server_info.server_detail.host_name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="src_area" label="归属地" :min-width="50">
            </el-table-column>
            <el-table-column label="登录时间" :min-width="110">
                <template slot-scope="scope">
                    {{scope.row.login_date * 1000 | date}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="状态" :min-width="55">
                <template slot-scope="scope">
                    <abn-login-status :data="scope.row.status"></abn-login-status>
                </template>
            </el-table-column>
            <el-table-column prop="user_name" label="对应账号名" >
            </el-table-column>
            <el-table-column label="登录类型" :min-width="55">
                <template slot-scope="scope">
                    {{scope.row.login_type === '0' ? 'SSH' : '其他'}}
                </template>
            </el-table-column>
            <el-table-column prop="src_ip" label="登录源IP" >
            </el-table-column>
            <el-table-column label="告警类型" :min-width="55">
                <template slot-scope="scope">
                    {{getAlertType(scope.row.alert_type)}}
                </template>
            </el-table-column>
             <el-table-column prop="name" label="操作" :min-width="140">
                <template slot-scope="scope">
                    <span class="text-nowrap color-secondary">
                        <el-button @click="abnLoginAddTrust(scope.row)" type="text" :disabled="scope.row.status === '3'">误报</el-button>|<lockip-dialog @success="fetchData" :data="scope.row">封停</lockip-dialog>|<el-button @click="abnLoginUnlockIP(scope.row)" type="text" :disabled="scope.row.status === '2'">解封</el-button>|<el-button type="text">提交工单</el-button>
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
import AbnLoginStatus from '@/views/security/status/AbnLoginStatus.vue';
import lockIPDialog from '@/components/dialog/lockIPDialog.vue';
import {get} from '@/utils/utils';

import {
    abnLoginAddTrust,
    abnLoginDetail,
    abnLoginUnlockIP
} from '@/service/security';
import {ALERT_TYPE, ANTI_VIOLENCE_HANDLE_STATUS} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            handle_status: '0', // 是否封停 0：全部 1：已封停 2：未封停 3：误报
            alert_type: undefined,
            alert_type_list: ALERT_TYPE.filter(e => e.value !== '5'), //不传：所有1：异地登录2：非法IP登录3：非法账号登录4：非法时间登录
            anti_violence_handle_status: ANTI_VIOLENCE_HANDLE_STATUS, // 是否封停 0：全部 1：已封停 2：未封停 3：误报
            date: [], // 时间
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
        abnLoginAddTrust(row) {
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
                    return abnLoginAddTrust({
                        server_id,
                        type: 'ip',
                        ip: row.src_ip
                    });
                })
                .then(ret => {
                    $log('abnLoginAddTrust', ret);
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
                    console.warn('abnLoginAddTrust 失败', error.message);
                });
        },
        abnLoginUnlockIP(row) {
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
                    return abnLoginUnlockIP({
                        server_id,
                        src_ip: row.src_ip
                    });
                })
                .then(ret => {
                    $log('abnLoginUnlockIP', ret);
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
                    console.warn('abnLoginUnlockIP 失败', error.message);
                });
        },
        getWeakType(val) {
            let item = this.anti_violence_handle_status.find(
                e => e.value === val
            );
            return item ? item.label : val;
        },
        getAlertType(val) {
            let item = ALERT_TYPE.find(e => e.value === val);
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
                    handle_status: this.handle_status,
                    alert_type: this.alert_type,
                    server_name: this.inputval
                };

                let ret = await abnLoginDetail(params);
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
        AbnLoginStatus,
        'lockip-dialog': lockIPDialog
    }
};
</script>
