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
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getSnapshotList" :paging="searchObj.paging">
                <el-table-column min-width="120" prop="ruleName" label="规则名称">
                </el-table-column>
                <!-- <el-table-column min-width="180" prop="id" label="启用">
                </el-table-column> -->
                <el-table-column min-width="180" prop="ruleMetric" label="监控项">
                    <template slot-scope="scope">
                        {{scope.row.ruleMetric|showTextByKey(MONITOR_RULE_TYPES, 'value', 'name')}}
                    </template>
                </el-table-column>
                <el-table-column min-width="100" prop="size" label="维度">
                    <template slot-scope="scope">
                        <!-- 全部云硬盘 -->
                    </template>
                </el-table-column>
                <el-table-column min-width="300" prop="ruleMetric" :show-overflow-tooltip="false" label="报警规则">
                    <template slot-scope="scope">
                        <div style="word-break: break-word;">{{scope.row|getRuleDesc}}</div>
                    </template>
                </el-table-column>
                <el-table-column min-width="180" prop="noticeMail" label="通知对象">
                    <template slot-scope="scope">
                        手机：{{scope.row.noticePhone}}<br> 邮箱：{{scope.row.noticeMail}}
                    </template>
                </el-table-column>
                <el-table-column min-width="100" prop="status" label="状态">
                    <template slot-scope="scope">
                        <zt-status :status="statusArr" :value="scope.row.status" class="text-nowrap status-column"></zt-status>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" width="150" class-name="option-column">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'app.monitor.alarmrule.edit', params: {id: scope.row.alarmId}}" class="btn-linker">修改</router-link>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteRule(scope.row)" class="btn-linker">删除</a>
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
export default {
    data() {
        let fields = [{field: 'name', label: '规则名称', inputval: '', tagType: 'INPUT'}];
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
            }
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
    async created() {
        let res = await getSysConfig({code: 'alarm.metrics'});
        this.MONITOR_RULE_TYPES = res.data.data[0].itemList;
        MONITOR_RULE_TYPES = this.MONITOR_RULE_TYPES;
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
                return deleteRule(row.alarmId);
            }).then(res => {
                this.$message.success('操作成功');
                this.getData();
            });
        }
    }
};
</script>

