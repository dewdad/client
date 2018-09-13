<template>
    <div class="page-main">
        <page-header>
            <el-button class=" fa fa-angle-left font12 mr10"   @click="goBack" size="small">&nbsp;返回</el-button>
            关联用户
        </page-header>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <template v-if="col.column=='userCode'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='userName'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
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
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import {getMgrUser} from '@/service/usermgr/rolemgr.js';
export default {
    name: 'app',

    data() {
        let stateParams = this.$route.params || {};

        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            { column: 'userCode', text:'用户编码' , width: '50%'},
            { column: 'userName', text:'用户名称' , width: '55%'}
        ];

        return {
            stateParams,
            cols,
            searchObj,

            type:'name',
            tableData: []

        };
    },
    components: {
        PageHeader
    },
    methods: {
        getMgrUser(){
            console.log('stateParams1111',this.stateParams.roleId);
            let params = {
                // paging:this.searchObj.paging,
                roleId:this.stateParams.roleId
            };
            $log('params', params);
            getMgrUser(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData ){
                    this.tableData = resData || [];

                }

            });
        },
        goBack(){
            window.history.back();
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.getMgrUser();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.getMgrUser();
        },
        onSubmit() {}
    },
    mounted(){
        this.getMgrUser();
    }
};
</script>
<style scoped lang="scss">
    .header-top{
        margin-bottom:20px;
        padding-bottom:20px;
        border-bottom:1px solid #e4eaec;
    }
</style>
