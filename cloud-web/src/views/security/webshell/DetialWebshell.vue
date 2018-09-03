<template>
<div :class="klass">
    <page-header class="mb10">主机木马
        <div slot="content"  class="pull-right">
            <!-- <el-button type="primary" size="small">设置暴力破解</el-button> -->
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
                <zt-form-item label="资产选择：">
                    <el-input placeholder="搜索资产IP或名称" v-model="inputval"></el-input>
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
                <zt-form-item label="类型筛选：">
                    <el-radio-group v-model="handle_status" @change="search">
                        <el-radio border label="0">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in webshell_status" :key="item.value">{{item.label}}</el-radio>
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
            <el-table-column prop="title" label="主机IP/名称" :min-width="180">
                <template slot-scope="scope">
                    <div class="font12">{{scope.row.server_info.server_detail.ip}} ({{scope.row.server_info.server_detail.host_name}})</div>
                </template>
            </el-table-column>
            <el-table-column prop="file_path" label="木马文件路径" :min-width="200">
            </el-table-column>
            <el-table-column prop="title" label="状态" :min-width="55">
                <template slot-scope="scope">
                    <webshell-status :data="scope.row.status"></webshell-status>
                </template>
            </el-table-column>
            <el-table-column label="木马生成时间" :min-width="110">
                <template slot-scope="scope">
                    {{scope.row.file_cdate * 1000 | date}}
                </template>
            </el-table-column>
            <el-table-column label="木马类型" > 
                <template slot-scope="scope">
                    {{getWellshellCode(scope.row.type_code)}}
                </template>
            </el-table-column>
             <el-table-column prop="name" label="操作" :min-width="140">
                <template slot-scope="scope">
                    <span class="text-nowrap color-secondary">
                        <el-button @click="webshellTrust(scope.row)" type="text" :disabled="scope.row.status === '2'">误报</el-button>|<el-button @click="banWebshell(scope.row)" type="text" :disabled="scope.row.status === '1'">隔离</el-button>|<el-button @click="unBanWebshell(scope.row)" type="text" :disabled="scope.row.status === '0'">恢复</el-button>|<el-button type="text">提交工单</el-button>
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
import WebsellStatus from '@/views/security/status/WebsellStatus.vue';
import lockIPDialog from '@/components/dialog/lockIPDialog.vue';
import {get} from '@/utils/utils';

import {
    webshellTrust,
    webshellDetail,
    banWebshell,
    unBanWebshell
} from '@/service/security';
import {WEBSHELL_STATUS} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            handle_status: '0', // 是否封停 0：全部 1：已封停 2：未封停 3：误报
            webshell_status: WEBSHELL_STATUS, // 是否封停 0：全部 1：已封停 2：未封停 3：误报
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
        webshellTrust(row) {
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
                    return webshellTrust({
                        server_id,
                        detail_info: row.detail,
                        file_path_base64: row.file_path_base64
                    });
                })
                .then(ret => {
                    $log('webshellTrust', ret);
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
                    console.warn('webshellTrust 失败', error.message);
                });
        },
        banWebshell(row) {
            this.$confirm(`您确定隔离该记录吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(() => {
                    let server_id = get(
                        row,
                        `server_info.mac_address`,
                        this.serverId
                    );
                    return banWebshell({
                        server_id,
                        detail_info: row.detail,
                        file_path_base64: row.type_code,
                        ws_type: row.file_md5
                    });
                })
                .then(ret => {
                    $log('banWebshell', ret);
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
                    console.warn('banWebshell 失败', error.message);
                });
        },
        unBanWebshell(row) {
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
                    return unBanWebshell({
                        server_id,
                        file_path: row.file_path,
                        file_md5: row.file_md5
                    });
                })
                .then(ret => {
                    $log('unBanWebshell', ret);
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
                    console.warn('unBanWebshell 失败', error.message);
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
                    handle_status: this.handle_status,
                    server_name: this.inputval
                };
                let ret = await webshellDetail(params);
                console.log('fetchData', ret);

                this.listData = ret;

                this.pageIndex = parseInt(ret.pageIndex);
                this.total = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        },
        // 转换木马类型
        getWellshellCode(code) {
            let list = {
                '900': '变形webshell',
                '1000': 'webshell'
            };
            return list[code] || '已知webshell';
        }
    },
    components: {
        'webshell-status': WebsellStatus,
        'lockip-dialog': lockIPDialog
    }
};
</script>
