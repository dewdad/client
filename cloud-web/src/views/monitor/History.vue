<template>
    <div class="page-main">
        <page-header>
            报警历史
            <div slot="right">
                <el-radio-group v-model="radioTime" size="small">
                    <el-radio-button border :label="1">1小时</el-radio-button>
                    <el-radio-button border :label="2">2小时</el-radio-button>
                    <el-radio-button border :label="4">4小时</el-radio-button>
                    <el-radio-button border :label="6">6小时</el-radio-button>
                    <el-radio-button border :label="12">12小时</el-radio-button>
                    <el-radio-button border :label="24">1天</el-radio-button>
                    <el-radio-button border :label="72">3天</el-radio-button>
                    <el-radio-button border :label="168">7天</el-radio-button>
                </el-radio-group>
                选择日期：
                <el-date-picker v-model="daterange" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getData" :paging="searchObj.paging">
                <el-table-column prop="name" label="产品类型">
                    <template slot-scope="scope">
                        {{scope.row.type|showTextByKey(alarmTypes, 'value', 'name')}}
                    </template>
                </el-table-column>
                <el-table-column min-width="200" prop="instanceName" label="故障资源">
                     <template slot-scope="scope">
                       {{scope.row.instanceId}}/{{scope.row.instanceName||'-'}}
                    </template>
                </el-table-column>
                <el-table-column prop="volumeName" label="发生时间">
                     <template slot-scope="scope">
                        {{scope.row.createDt|date}}
                    </template>
                </el-table-column>
                <el-table-column prop="alamRuleName" label="规则名称">
                </el-table-column>
                <el-table-column prop="volumeName" label="状态">
                    <template slot-scope="scope">
                        <zt-status :status="statusArr" :value="scope.row.current"></zt-status>
                    </template>
                </el-table-column>
                <el-table-column prop="volumeName" label="通知方式">
                    <template slot-scope="scope">
                        {{scope.row.alarmNotices && scope.row.alarmNotices[0].noticeType === '0' ? '邮箱': '短信'}}
                    </template>
                </el-table-column>
                
                <el-table-column  label="通知对象">
                    <template slot-scope="scope">
                        <el-popover v-if="scope.row.alarmNotices" placement="top" width="200" trigger="hover" >
                            <div>手机：{{scope.row.alarmNotices[0].phone}}</div>
                            <div>邮箱：{{scope.row.alarmNotices[0].email}}</div>
                            <el-tag slot="reference" class="mr10"> {{scope.row.alarmNotices[0].name}}</el-tag>
                        </el-popover>
                       
                    </template>
                </el-table-column>
            </zt-table>
        </div>
    </div>
</template>
<script>
import {getAlarmHistoryList} from '@/service/monitor/alarmRule.js';
import {getSysConfig} from '@/service/app';
import {dateFormat} from '@/utils/utils';
let statusArr = [
    {
        text: '告警',
        value: 'alarm',
        className: 'color-warning',
        icon: 'zticon-running_people1'
    },
    {
        text: '正常',
        value: 'ok',
        className: 'color-success',
        icon: 'zticon-running_people'
    },
    {
        text: '数据不足',
        value: 'insufficient data',
        className: 'color-danger',
        icon: 'zticon-stop'
    }
];
export default {
    data() {
        let fields = [{field: 'alarmRuleName', label: '规则名称', inputval: '', tagType: 'INPUT'}, {field: 'instanceName', label: '资源名称', inputval: '', tagType: 'INPUT'}];
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            }
        };
        return {
            statusArr,
            fields,
            tableData: [],
            loading: false,
            snaplistShow: true,
            searchObj,
            showId: '',
            inlineForm: {
                startDate: '',
                endDate: ''
            },
            radioTime: '',
            daterange: [],
            alarmTypes: []
        };
    },
    watch: {
        daterange: function(newval) {
            if (newval) {
                this.inlineForm.startDate = dateFormat(newval[0], 'YYYY-MM-DD HH:mm:ss');
                this.inlineForm.endDate = dateFormat(newval[1], 'YYYY-MM-DD HH:mm:ss');
            } else {
                this.inlineForm.startDate = '';
                this.inlineForm.endDate = '';
            }
            this.search();
        },
        radioTime: function(newval) {
            let nowDate = new Date();
            this.inlineForm.endDate = dateFormat(nowDate, 'YYYY-MM-DD HH:mm:ss');
            this.inlineForm.startDate = dateFormat(new Date(nowDate.getTime() - newval * 3600000), 'YYYY-MM-DD HH:mm:ss');
            this.search();
        }
    },
    async created() {
        await this.getAlarmTypes();
        // 默认查询1小时
        this.radioTime = 1;
    },
    methods: {
        search() {
            let params = Object.assign({}, this.inlineForm, this.searchObj.paging);
            $log(params);
            this.getData(params);
        },
        getData(params) {
            params = params ? Object.assign({}, params, this.inlineForm) : this.searchObj.paging;
            if (params !== false) this.loading = true;
            getAlarmHistoryList(params)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data;
                        this.tableData = resData.records;
                        this.searchObj.paging.totalItems = resData.total || 0;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getAlarmTypes() {
            getSysConfig({code: 'alarm.types'})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let jsonData = res.data;
                        this.alarmTypes = jsonData.data[0].itemList || [];
                    }
                })
                .catch(err => {
                    $log(err);
                });
        }
    }
};
</script>

