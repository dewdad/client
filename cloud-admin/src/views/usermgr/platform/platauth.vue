<template>
    <div class="page-main">
        <page-header>
            <el-button class=" fa fa-angle-left font12 mr10"   @click="goBack" size="small">&nbsp;返回</el-button>
            平台权限
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" size="small">
                    <el-form-item>

                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary icon-zt_plus" @click="addPlatAuth({},1)"> 添加平台权限</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="searchPlatAuth"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 角色id -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='roleVal'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleVal}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='description'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.description}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='createTime'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.createTime | date }}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="addPlatAuth(scope.row,2)" class="btn-linker" >编辑</a>
                                <b class="link-division-symbol"></b>
                                <a  @click="delPlatAuth(scope.row)" class="btn-linker" >删除</a>

                            </template>
                        </el-table-column>
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
        <add-plat-auth ref="AddPlatAuth"></add-plat-auth>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import AddPlatAuth from './AddPlatAuth';

import {searchPlatAuth,delPlatAuth} from '@/service/platform.js';
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
            { column: 'name', text:'权限名称' , width: '15%'},
            { column: 'roleVal', text:'角色' , width: '15%'},
            { column: 'description', text: '描述', width: '15%' },
            { column: 'createTime', text: '创建时间', width: '15%' },
        ];
        // let fields = [
        //     { field: 'name', label: '角色名称',inputval:'', tagType: 'INPUT' },
        // ];
        //
        // let searchObjExtra = {
        //     fields:fields,
        //     selField:fields[0]
        // };
        return {
            cols,
            searchObj,
            platId:stateParams.id,

            tableData: []

        };
    },
    components: {
        PageHeader,
        AddPlatAuth

    },
    methods: {
        searchPlatAuth(){
            let params = {
                paging:this.searchObj.paging,
                platformResourceId:this.platId

            };
            $log('params', params);
            searchPlatAuth(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        /**
         * 删除平台
         */
        delPlatAuth(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delAuth(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //创建平台
        addPlatAuth(item,optype){
            let id = this.platId;
            this.$refs.AddPlatAuth.show(item,optype,id)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.searchPlatAuth();
                    return this.$alert('操作成功','提示');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        delAuth(item){
            delPlatAuth(item).then(ret=>{
                this.searchPlatAuth();
            });
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.searchPlatAuth();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.searchPlatAuth();
        },
        goBack(){
            window.history.back();
        },
        onSubmit() {}
    },
    mounted(){
        this.searchPlatAuth();
    }
};
</script>
<style scoped>
</style>
