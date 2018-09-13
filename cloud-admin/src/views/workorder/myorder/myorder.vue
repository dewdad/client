<template>
    <div class="page-main">
        <page-header>
            角色管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createRole({},1)">
                            <span class="icon-zt_plus"></span>
                            新建角色
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type">
                            <el-option label="角色名称" value="name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="getRoleList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-new-刷新" @click="getRoleList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 角色id -->
                        <template v-if="col.column=='roleId'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 角色类型 -->
                        <template v-if="col.column=='roleType'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10" v-if="scope.row.roleType == 1">超级管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 2">部门管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 3">子部门管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 4">用户</span>

                                </template>
                            </el-table-column>
                        </template>
                        <!-- 角色名 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <router-link :to="{name:'app.usrmgr.rolemgrUser',params:{roleId:scope.row.id,item:scope.row,fromstate:'app.usrmgr.rolemgr'}}" class="btn-linker">关联用户</router-link>
                                <b class="link-division-symbol"></b>
                                <a  @click="relateAuth(scope.row)" class="btn-linker" v-if="scope.row.name != 'admin' && scope.row.roleType != 4">关联权限</a>
                                <b class="link-division-symbol" v-if="scope.row.name != 'admin' && scope.row.roleType != 4"></b>
                                <a  @click="createRole(scope.row,2)" class="btn-linker" v-if="scope.row.name != 'admin'">编辑</a>
                                <b class="link-division-symbol" v-if="scope.row.name != 'admin'"></b>
                                <a  @click="delRole(scope.row)" class="btn-linker" v-if="scope.row.name != 'admin'">删除</a>

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
        <relate-auth ref="RelateAuth"></relate-auth>
        <create-role ref="CreateRole"></create-role>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
// import RelateAuth from './RelateAuth';
// import CreateRole from './CreateRole';
import {getRoleList,delRole} from '@/service/usermgr/rolemgr.js';
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
            { column: 'roleId', text:'角色ID' , width: '30%'},
            { column: 'roleType', text:'角色类型' , width: '15%'},
            { column: 'name', text: '角色名', width: '20%' }
        ];

        return {
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
        PageHeader,

    },
    methods: {
        getRoleList(){
            let params = {
                paging:this.searchObj.paging,
                [this.type]:this.formInline.searchText
            };
            $log('params', params);
            getRoleList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        relateAuth(item){
            this.$refs.RelateAuth.show(item)
                .then(ret => {
                    return this.$confirm('操作成功','提示');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        createRole(item,optype){
            this.$refs.CreateRole.show(item,optype)
                .then(ret => {
                    this.getRoleList();
                    return this.$confirm('操作成功','提示');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.getRoleList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.getRoleList();
        },
        delrole(item){
            delRole(item).then(ret=>{
                this.getRoleList();
            });
        },
        /**
         * 删除角色
         */
        delRole(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delrole(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },

    mounted(){
        this.getRoleList();
    }
};
</script>
<style scoped>
</style>
