<template>
    <div>
        <page-header>
            平台管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true"  size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createPlatForm({},1)">新建平台</el-button>
                    </el-form-item>

                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-new-刷新" @click="getplatformList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 角色id -->
                        <template v-if="col.column=='platFormId'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='resource'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.resource}}</span>
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
                                <router-link :to="{name:'app.platform.platAuth',params:{id:scope.row.id,item:scope.row,fromstate:'app.platform.resource'}}" class="btn-linker">查看平台权限</router-link>
                                <b class="link-division-symbol" ></b>
                                <a  @click="createPlatForm(scope.row,2)" class="btn-linker" >编辑</a>
                                <b class="link-division-symbol"></b>
                                <a  @click="delPlatForm(scope.row)" class="btn-linker" >删除</a>

                            </template>
                        </el-table-column>
                    </template>
                </el-table>
                //分页
                <div class="pagination">
                    <el-pagination background
                                   @handleCurrentChange="handleCurrentChange"
                                   :current-page="searchObj.paging.pageIndex"
                                   :page-sizes="[10, 20, 50, 100]"
                                   :page-size="searchObj.paging.limit"
                                   layout="sizes, prev, pager, next"
                                   :total="searchObj.paging.totalItems">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <create-resource ref="CreateResource"></create-resource>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateResource from './CreateResource';

import {getplatformList,delPlatForm} from '@/service/usermgr/platform.js';
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
            { column: 'platFormId', text:'平台ID' , width: '30%'},
            { column: 'resource', text:'资源' , width: '15%'},
            { column: 'createTime', text: '创建时间', width: '20%' }
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
            type:'name',
            tableData: []

        };
    },
    components: {
        PageHeader,
        CreateResource

    },
    methods: {
        getplatformList(){
            let params = {
                paging:this.searchObj.paging

            };
            $log('params', params);
            getplatformList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.totalItems = resData.total || 0;
                }

            });
        },
        addPlatAuth(item){

        },
        /**
         * 删除平台
         */
        delPlatForm(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delPlat(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //创建平台
        createPlatForm(item,optype){
            this.$refs.CreateResource.show(item,optype)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.getplatformList();
                    return this.$confirm('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        delPlat(item){
            delPlatForm(item).then(ret=>{
                this.getplatformList();
            });
        },
        handleCurrentChange:function (params) {
            this.getplatformList();
        },
        onSubmit() {}
    },
    mounted(){
        this.getplatformList();
    }
};
</script>
<style scoped>
</style>
