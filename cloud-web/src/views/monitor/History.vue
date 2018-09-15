<template>
    <div class="page-main">
        <page-header>
            报警历史
            <div slot="right">
                <el-radio-group v-model="radioTime" size="small">
                    <el-radio-button border  :label="1">1小时</el-radio-button>
                    <el-radio-button border :label="2">2小时</el-radio-button>
                    <el-radio-button border  :label="4">4小时</el-radio-button>
                    <el-radio-button border  :label="6">6小时</el-radio-button>
                    <el-radio-button border  :label="12">12小时</el-radio-button>
                    <el-radio-button border  :label="24">1天</el-radio-button>
                    <el-radio-button border  :label="72">3天</el-radio-button>
                    <el-radio-button border  :label="168">7天</el-radio-button>
                </el-radio-group>
                选择日期： <el-date-picker
      v-model="daterange"
      type="daterange"
      size="small"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getData" :paging="searchObj.paging">
                <el-table-column min-width="120" prop="name" label="产品类型">
                </el-table-column>
                <el-table-column prop="id" label="故障资源">
                </el-table-column>
                <el-table-column prop="volumeName" label="发生时间">
                </el-table-column>
                <el-table-column prop="volumeName" label="持续时间">
                </el-table-column>
                <el-table-column prop="volumeName" label="规则名称">
                </el-table-column>
                <el-table-column prop="volumeName" label="通知方式">
                </el-table-column>
                <el-table-column prop="volumeName" label="状态">
                </el-table-column>
                <el-table-column prop="volumeName" label="通知对象">
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="报警回调" key="op" width="150" class-name="option-column">
                    <template slot-scope="scope">
                        <span @click="editSnap(scope.row)" class="btn-linker">创建磁盘</span>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteSnap(scope.row)" class="btn-linker">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
    </div>
</template>
<script>
import {getAlarmHistoryList} from '@/service/monitor/alarmRule.js';
import {dateFormat} from '@/utils/utils';
export default {
    data() {
        let fields = [{field: 'name', label: '规则名称', inputval: '', tagType: 'INPUT'}, {field: 'mobiel', label: '资源名称', inputval: '', tagType: 'INPUT'}];
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
            daterange: []
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
    created() {
        // 默认查询1小时
        this.radioTime = 1;
        this.getData();
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
                        this.tableData = resData.records || [];
                        this.searchObj.paging.totalItems = resData.total || 0;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

