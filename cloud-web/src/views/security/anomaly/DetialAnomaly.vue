<template>
<div :class="klass">
    <page-header class="mb10">主机异常
        <div slot="content"  class="pull-right">
            <!-- <el-button type="primary" size="small">设置暴力破解</el-button> -->
            <el-button type="info" size="small" @click="search">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <div class="page-body">
        <!-- 搜素栏 -->
        <div class="search-box">
            <!-- 资产选择 -->
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
            <!-- 事件名称： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="事件名称：">
                    <el-input placeholder="输入事件名称" v-model="inputval2"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search" icon="el-icon-search">
                        {{$t('common.searchButtonText')}}
                    </el-button>
                </zt-form-item>
            </zt-form>
            <!-- 事件分类： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="事件分类：">
                    <el-radio-group v-model="event_type" @change="search">
                        <el-radio border :label="undefined">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in event_type_list" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </zt-form-item>
            </zt-form>
            <!-- 危险程度： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="危险程度：">
                    <el-radio-group v-model="level" @change="search">
                        <el-radio border :label="undefined">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in anomaly_level" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </zt-form-item>
            </zt-form>
            <!-- 处理状态： -->
            <zt-form :inline="true" size="small" class="search-form-inline" label-width="100px">
                <zt-form-item label="处理状态：">
                    <el-radio-group v-model="status" @change="search">
                        <el-radio border :label="undefined">全部</el-radio>
                        <el-radio border :label="item.value" v-for="item in anomaly_status" :key="item.value">{{item.label}}</el-radio>
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
            <el-table-column prop="title" label="主机IP/名称" :min-width="120">
                <template slot-scope="scope">
                    <div class="font12">{{scope.row.server_info.server_detail.ip}}</div>
                    <div class="font12">{{scope.row.server_info.server_detail.host_name}}</div>
                </template>
            </el-table-column>
            <el-table-column label="可疑入侵事件名" :min-width="100">
                <template slot-scope="scope">
                    {{scope.row.event_name}}
                </template>
            </el-table-column>
            <el-table-column label="事件分类" :min-width="55">
                <template slot-scope="scope">
                    {{scope.row.event_type | event_type}}
                </template>
            </el-table-column>
            <el-table-column label="修复必要性" :min-width="65">
                <template slot-scope="scope">
                    <status-emergent :emergent="scope.row.emergent" ></status-emergent>
                </template>
            </el-table-column>
            <el-table-column label="危险程度" :min-width="55">
                <template slot-scope="scope">
                    <anomaly-level :data="scope.row.level"></anomaly-level>
                </template>
            </el-table-column>
            <el-table-column label="状态" :min-width="55">
                <template slot-scope="scope">
                    <anomaly-status :data="scope.row.status"></anomaly-status>
                </template>
            </el-table-column>
            <el-table-column label="发生时间" :min-width="110">
                <template slot-scope="scope">
                    {{scope.row.find_date | date}}
                </template>
            </el-table-column>
             <el-table-column prop="name" label="操作" :min-width="170">
                <template slot-scope="scope">
                    <span class="text-nowrap color-secondary">
                        <el-button @click="postAction('wlist_add', scope.row)" type="text" :disabled="scope.row.status === '2'">误报</el-button>
                        |<el-button @click="postAction('handled_add', scope.row)" type="text" :disabled="scope.row.status === '3'">已手动处理</el-button>
                        |<el-button @click="postAction('ignore_do', scope.row)" type="text" :disabled="scope.row.status === '1'">忽略本次</el-button>
                        <!-- |<el-button @click="postAction('ignore_do', scope.row)" type="text" :disabled="scope.row.status !== '1'">取消忽略</el-button> -->
                        |<el-button type="text">提交工单</el-button>
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
import AnomalyStatus from '@/views/security/status/AnomalyStatus.vue';
import LeakLevel from '@/views/security/status/LeakLevel.vue';
import lockIPDialog from '@/components/dialog/lockIPDialog.vue';
import StatusEmergent from '@/views/security/status/emergent.vue';

import {hostAnomaly} from '@/service/security';
import {EVENT_TYPE, ANOMALY_LEVEL, ANOMALY_STATUS} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            event_type_list: EVENT_TYPE,
            anomaly_level: ANOMALY_LEVEL,
            anomaly_status: ANOMALY_STATUS,
            event_type: undefined,
            level: undefined,
            status: undefined,
            inputval: '',
            inputval2: '',
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
    filters: {
        event_type(val) {
            let item = EVENT_TYPE.find(e => e.value === val);
            return item ? item.label : val;
        }
    },
    methods: {
        postAction(act, row) {
            let textList = {
                wlist_add:
                    '您确定要将此条记录设为误报吗？</br>确认误报后，系统将不会再扫描出这条记录。',
                handled_add:
                    '您确定要将此条记录设为已处理吗？</br>确认误报后，系统将不会再扫描出这条记录。',
                ignore_do:
                    '您确定要忽略此条记录吗？</br>确认误报后，系统将不会再扫描出这条记录。'
            };
            this.$confirm(textList[act], '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(() => {
                    return hostAnomaly({
                        server_id: this.serverId,
                        act
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
                    server_name: this.inputval,
                    event_name: this.inputval2,
                    act: 'list_get',
                    event_type: this.event_type,
                    // alias: this.handle_status, 标签
                    status: this.status,
                    level: this.level
                };
                let ret = await hostAnomaly(params);
                // ret = {
                //     pageIndex: 1,
                //     total: 1,
                //     data: [
                //         {
                //             id: '1',
                //             event_name: 'mining_process',
                //             event_type: 'mal_process',
                //             level: '3',
                //             find_date: '2018-04-20 14:32:24',
                //             detail:
                //                 'bash,ddg.2020,/tmp/ddg.2020,4432,/tmp/ddg.2020',
                //             cdate: '2018-04-20 13:01:41',
                //             mdate: '2018-04-20 13:01:41',
                //             status: '1',
                //             emergent: 1,
                //             server_info: {
                //                 mac_address:
                //                     'wuzhenru-0df16997086c2376f7712a5e55690811',
                //                 server_detail: {
                //                     ip: '172.17.194.187',
                //                     wwwip: '47.95.119.195',
                //                     host_name: 'iZ2zegd8k09sik3331szckZ'
                //                 }
                //             },
                //             detail_info: {
                //                 parent_process: 'bash',
                //                 process_name: 'ddg.2020',
                //                 process_path: '/tmp/ddg.2020',
                //                 pid: '4432',
                //                 start_parm: '/tmp/ddg.2020'
                //             },
                //             desc:
                //                 '黑客利用远程代码执行漏洞或者恶意木马在服务器中植入挖矿木马，占用及其所有cpu计算资源，严重影响服务器正常业务性能',
                //             solution:
                //                 '建议立刻kill该挖矿进程，并且如果报警中的父进程不是系统原生的程序软件，则很可能该挖矿进程是被其他病毒木马启动的，请及时清理计划任务中的恶意代码以及父进程对应的恶意病毒木马。'
                //         }
                //     ]
                // };
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
        'status-emergent': StatusEmergent,
        'anomaly-status': AnomalyStatus,
        'anomaly-level': LeakLevel,
        'lockip-dialog': lockIPDialog
    }
};
</script>
