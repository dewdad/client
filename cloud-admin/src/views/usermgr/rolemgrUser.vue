<template>
    <div>
        <div class="header-top">
            <el-button type="primary" class=" fa fa-angle-left" @click="goBack" size="small">&nbsp;返回</el-button>
            <span class="font16 pull-right">关联用户</span>
        </div>
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
                <div class="pagination">
                    <el-pagination background @size-change="handleSizeChange" :current-page="searchObj.pageIndex" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
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
            formInline: {
                data:'',
                searchText:''
            },
            type:'name',
            tableData: []

        };
    },
    components: {

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
        handleSizeChange:function (params) {
            console.log('params:',params);
        },
        handleCurrentChange:function (params) {
            console.log('handleCurrentChange:',params);
        },
        handleSearch: function(labels) {
            console.log(labels);
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
