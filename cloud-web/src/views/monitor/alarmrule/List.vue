<template>
    <div class="page-main">
        <page-header>
            报警规则列表
            <div slot="right">
                <el-button type="primary" @click="$router.push({name: 'app.monitor.alarmrule.add'})" size="small">新建报警规则</el-button>
                <el-button type="info" size="small" @click="getData(false)">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getData" :paging="searchObj.paging">
                <el-table-column min-width="120" prop="ruleName" label="规则名称">
                </el-table-column>
                <!-- <el-table-column min-width="180" prop="id" label="启用">
                </el-table-column> -->
                <el-table-column min-width="180" prop="ruleMetric" label="监控项">
                    <template slot-scope="scope">
                        {{scope.row.ruleMetric|showTextByKey(MONITOR_RULE_TYPES, 'value', 'name')}}
                    </template>
                </el-table-column>
                <el-table-column min-width="100" prop="size" label="资源">
                    <template slot-scope="scope">
                        <!-- 全部云硬盘 -->
                        <span v-if="scope.row.resourceType === '0'">全部资源</span>
                        <div v-else>
                            <el-popover placement="top" width="200" trigger="hover">
                                <div v-for="item in scope.row.alarmInstances" :key="item.instanceId">实例：{{item.instanceId}}/{{item.instanceName}}</div>
                                <span slot="reference">自定义</span>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="300" prop="ruleMetric" :show-overflow-tooltip="false" label="报警规则">
                    <template slot-scope="scope">
                        <div style="word-break: break-word;">{{scope.row|getRuleDesc}}</div>
                    </template>
                </el-table-column>
                <el-table-column min-width="180" prop="noticeMail" label="通知对象">
                    <template slot-scope="scope">
                        <el-popover v-for="vo in scope.row.alarmNotices" placement="top" width="200" trigger="hover" :key="vo.name">
                            <div>手机：{{vo.phone}}</div>
                            <div>邮箱：{{vo.email}}</div>
                            <el-tag slot="reference" class="mr10">{{vo.name}}</el-tag>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" prop="status" label="状态">
                    <template slot-scope="scope">
                        <zt-status :status="statusArr" :value="''+scope.row.status+''"></zt-status>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" min-width="150" class-name="option-column">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === 0" @click="forbid(scope.row, 1)" class="btn-linker">禁用</a>
                        <a v-else @click="resume(scope.row, 0)" class="btn-linker">启用</a>
                        <b class="link-division-symbol"></b>
                        <router-link :to="{name: 'app.monitor.alarmrule.edit', params: {id: scope.row.id, alarmId: scope.row.alarmId}}" class="btn-linker">修改</router-link>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteRule(scope.row, 2)" class="btn-linker">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <delete-dialog ref="DeleteDailog" />
    </div>
</template>
<script>
import {getAlarmRuleList, deleteRule} from '@/service/monitor/alarmRule.js';
import {getSysConfig} from '@/service/app';
import {showTextByKey, operatorReplace} from '@/utils/utils';
let MONITOR_RULE_TYPES = [];
const statusArr = [
    {
        text: '启用',
        value: '0',
        className: 'color-success',
        icon: 'zticon-running_people'
    },
    {
        text: '禁用',
        value: '1',
        className: 'color-danger',
        icon: 'zticon-overdue_people'
    }
];
export default {
    data() {
        let fields = [{field: 'ruleName', label: '规则名称', inputval: '', tagType: 'INPUT'}];
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            }
        };
        return {
            fields,
            statusArr,
            MONITOR_RULE_TYPES: [],
            tableData: [],
            loading: false,
            snaplistShow: true,
            searchObj,
            fieldValue: '',
            showId: '',
            inlineForm: {
                field: '',
                value: ''
            },
            ruleMetric: ['']
        };
    },
    filters: {
        getRuleDesc: function(rule) {
            return (
                '监控项：' +
                showTextByKey(MONITOR_RULE_TYPES, rule.ruleMetric, 'value', 'name') +
                '，监控频率：' +
                rule.alarmTime +
                '分钟， ' +
                '监控值：' +
                operatorReplace(rule.comparisonOperator) +
                rule.threshold
            );
        }
    },
    computed: {
        filterItems: function() {
            return this.MONITOR_RULE_TYPES.map(item => {
                item['text'] = item['name'];
                return item;
            });
        }
    },
    async created() {
        let res = await getSysConfig({code: 'alarm.metrics'});
        this.MONITOR_RULE_TYPES = res.data.data[0].itemList;
        MONITOR_RULE_TYPES = this.MONITOR_RULE_TYPES;
        this.fields.push({field: 'ruleMetric', label: '监控项', options: this.filterItems, inputval: '', tagType: 'SELECT'});
        this.getData();
    },
    methods: {
        getData(params) {
            params = params || this.searchObj.paging;
            if (params !== false) this.loading = true;
            getAlarmRuleList(params)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data;
                        if (resData && resData.data) {
                            this.tableData = resData.data || [];
                            this.searchObj.paging.totalItems = resData.total || 0;
                        }
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        editSnap(row) {
            this.$refs.CreateDisk.show(row).then(() => {});
        },
        deleteRule(row) {
            this.$refs.DeleteDailog.show('告警规则', row.name, () => {
                return deleteRule(row.id, 2);
            }).then(res => {
                this.$message.success('操作成功');
                this.getData();
            });
        },
        // 启用
        resume(row) {
            this.$confirm('您确定要启用该规则吗', '启用', {
                type: 'warning'
            }).then(() => {
                deleteRule(row.id, 0).then(res => {
                    if (res.code === '0000') {
                        this.$message.success('操作成功');
                        this.getData();
                    }
                });
            });
        },
        // 禁用
        forbid(row) {
            this.$confirm('您确定要禁用该规则吗', '禁用', {
                type: 'warning'
            }).then(() => {
                deleteRule(row.id, 1).then(res => {
                    if (res.code === '0000') {
                        this.$message.success('操作成功');
                        this.getData();
                    }
                });
            });
        }
    }
};
</script>

