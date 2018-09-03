<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="getLog">
            <el-tab-pane label="错误日志" name="errorLog"></el-tab-pane>
            <el-tab-pane label="慢日志明细" name="slowLog"></el-tab-pane>
        </el-tabs>
        <el-row class="mt10">
            <el-col :span="24">
                <transition name="fade-in-linear">
                    <div v-if="activeName==='errorLog'">
                        <div class="search-box">
                            <zt-form :inline="true" size="small" class="search-form-inline">
                                <zt-form-item label="">
                                    <el-date-picker type="daterange" v-model="daterange" :picker-options="pickerBeginDateBefore" value-format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </zt-form-item>
                            </zt-form>
                        </div>
                        <zt-table class="mt10" :tableColums="errorLogTableColumns" :loading="loading" :dataList="errorLog"></zt-table>
                        <div v-if="!loading && errorLog.length > 0" class="pagination">
                            <el-pagination background  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize" layout="sizes, prev, pager, next" :total="pagination.total">
                            </el-pagination>
                        </div>
                    </div>
                </transition>
                <transition name="fade-in-linear">
                    <div v-if="activeName==='slowLog'">
                        <div class="search-box">
                            <zt-form :inline="true" size="small" class="search-form-inline">
                                <zt-form-item label="查询条数">
                                    <el-select style="width: 60px" v-model="queryLimit" placeholder="请选择查询条数">
                                        <el-option :value="20"></el-option>
                                        <el-option :value="30"></el-option>
                                        <el-option :value="40"></el-option>
                                        <el-option :value="50"></el-option>
                                    </el-select>
                                </zt-form-item>
                                <zt-form-item label="">
                                    <el-button type="primary" @click="getSlowLog" icon="el-icon-search">搜索</el-button>
                                </zt-form-item>
                            </zt-form>
                        </div>
                        <zt-table class="mt10" :tableColums="slowLogTableColumns" :loading="loading" :dataList="slowLog"></zt-table>
                    </div>
                </transition>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import ZtTable from '@/components/table/ZtTable';
import {dateFormat, isArray} from '@/utils/utils';
import {getErrorLog, getSlowLog} from '@/service/rds/log';
import {mapState} from 'vuex';
const errorLogTableColumns = [
    {
        prop: 'datetime',
        label: '错误日志',
        width: '200px'
    },
    {
        prop: 'content',
        label: '慢日志明细'
    }
];
const slowLogTableColumns = [
    {
        prop: 'database',
        label: '数据库',
        width: '200px'
    },
    {
        prop: 'querySample',
        label: '执行语法'
    },
    {
        prop: 'time',
        label: '执行时间'
    },
    {
        prop: 'lockTime',
        label: '等待锁时间'
    },
    {
        prop: 'rowsSent',
        label: '结果行数据'
    },
    {
        prop: 'rowsExamined',
        label: '扫描行数量'
    },
    {
        prop: 'users',
        label: '帐号'
    },
    {
        prop: 'count',
        label: '执行次数'
    }
];
export default {
    name: 'Logmgr',
    data() {
        return {
            loading: false,
            activeName: 'errorLog',
            errorLogTableColumns,
            slowLogTableColumns,
            errorLog: [],
            slowLog: [],
            daterange: '',
            searchParams: {
                startDate: '',
                endDate: ''
            },
            queryLimit: 20,
            pagination: {
                total: 0,
                pageSize: 20,
                currentPage: 1
            },
            pickerBeginDateBefore: {
                disabledDate: date => {}
            }
        };
    },
    components: {
        ZtTable
    },
    computed: {
        ...mapState({
            rdsInst: state => state.rds.instance
        }),
        instId: function() {
            return this.$route.params.id;
        }
    },
    watch: {
        daterange: function(newval) {
            if (isArray(newval)) {
                this.searchParams.startDate = newval[0];
                this.searchParams.endDate = newval[1];
            } else {
                this.searchParams.startDate = '';
                this.searchParams.endDate = '';
            }
            this.getLog();
        },
        activeName: function(newval) {
            this.$router.push({name: 'app.rds.inst.logmgr', params: {tab: newval}});
        }
    },
    created() {
        if (this.$route.params.tab) {
            this.activeName = this.$route.params.tab;
        }
        // 设置是日期可选范围
        this.pickerBeginDateBefore.disabledDate = date => {
            return date.getTime() < new Date(this.rdsInst.created).getTime() - 24 * 3600 * 1000 || date.getTime() > Date.now();
        };
        let date = new Date();
        this.searchParams.endDate = dateFormat(date, 'YYYY-MM-DD HH:mm');
        this.searchParams.startDate = dateFormat(date.setDate(date.getDate() - 1), 'YYYY-MM-DD HH:mm');
        this.daterange = [this.searchParams.startDate, this.searchParams.endDate];
        this.getLog();
    },
    methods: {
        getLog() {
            if (this.activeName === 'errorLog') {
                this.getErrorLog();
            }
            if (this.activeName === 'slowLog') {
                this.getSlowLog();
            }
        },
        // 错误日志
        getErrorLog() {
            this.loading = true;
            getErrorLog(this.rdsInst.id, {...this.searchParams, limit: this.pagination.pageSize, pageIndex: this.pagination.currentPage})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let data = res.result;
                        this.errorLog = data.data;
                        this.pagination.total = data.total;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 慢日志
        getSlowLog() {
            this.loading = true;
            getSlowLog(this.rdsInst.id, this.queryLimit, 'SELECT')
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.slowLog = res.result ? res.result : [];
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getErrorLog();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getErrorLog();
            console.log(`当前页: ${val}`);
        }
    }
};
</script>
<style scoped>
</style>
