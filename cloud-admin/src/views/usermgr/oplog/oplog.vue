<template>
    <div>
        <page-header>
            操作日志
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type">
                            <el-option label="操作名称" value="serviceDesc"></el-option>
                            <el-option label="操作结果" value="result"></el-option>
                            <el-option label="操作人" value="operUserName"></el-option>
                            <el-option label="地区" value="region"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期">
                        <el-date-picker
                                v-model="formInline.date"
                                type="datetimerange"
                                size="small"
                                style="width:300px"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['12:00:00']">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="getLoglist" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-new-刷新" @click="getLoglist"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 操作名称 -->
                        <template v-if="col.column=='serviceDesc'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <a class="font12 mr10" @click.stop="showDetail(scope.row)">{{scope.row.serviceDesc}}</a>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 操作结果 -->
                        <template v-if="col.column=='result'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10" >{{ scope.row.result==0?'未知':(scope.row.result==1?'成功':'失败') }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 操作人 -->
                        <template v-if="col.column=='operUserName'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.operUserName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 开始时间 -->
                        <template v-if="col.column=='operStartTime'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.operStartTime | date}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 结束时间 -->
                        <template v-if="col.column=='operEndTime'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.operStartTime | date}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 部门 -->
                        <template v-if="col.column=='domainId'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.domainName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 租户 -->
                        <template v-if="col.column=='projectId'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.projectId}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 地区 -->
                        <template v-if="col.column=='region'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.region}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination background
                   @current-change="currentChange"
                   @size-change="handleSizeChange"
                   :current-page="searchObj.paging.pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="searchObj.paging.limit"
                   layout="sizes, prev, pager, next"
                   :total="searchObj.paging.totalItems">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
         <log-detail ref="LogDetail"></log-detail>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import LogDetail from './LogDetail';

import {getLoglist} from '@/service/usermgr/oplog.js';
export default {
    name: 'app',

    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            {
                'column': 'serviceDesc',
                'text': '操作名称',
                'width': '10%'
            },
            {
                'column': 'result',
                'text': '操作结果',
                'width': '10%'
            },
            {
                column: 'operUserName',
                text: '操作人',
                width: '10%'
            },
            {
                'column': 'operStartTime',
                'text': '开始时间',
                'width': '15%'
            },
            {
                'column': 'operEndTime',
                'text': '结束时间',
                'width': '15%'
            },
            {
                'column': 'domainId',
                'text': '部门',
                'width': '10%'
            },
            {
                'column': 'projectId',
                'text': '租户',
                'width': '20%'
            },
            {
                'column': 'region',
                'text': '地区',
                'width': '5%'
            },
        ];
        return {
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
            },
            type:'serviceDesc',
            tableData: []

        };
    },
    components: {
        PageHeader,
        LogDetail
    },
    methods: {
        getLoglist(){
            let params = {
                paging:this.searchObj.paging,
                [this.type]:this.formInline.searchText
            };
            $log('params', params);
            getLoglist(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.records){
                    this.tableData = resData.records || [];
                    console.log('this.tableData',this.tableData);
                    this.searchObj.paging.totalItems = resData.total || 0;
                    console.log('getEcsImageList tableData',this.tableData);
                }

            });
        },
        relateAuth(){

        },
        showDetail(item){
            console.log('detail',item);
            this.$refs.LogDetail.show(item);

        },

        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.getLoglist();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.getLoglist();
        },
        onSubmit() {}
    },
    mounted(){
        this.getLoglist();
    }
};
</script>
<style scoped>
</style>
