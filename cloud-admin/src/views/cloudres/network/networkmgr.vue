<template>
    <div class="page-main">
        <page-header>
            网络管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createNetwork({},1)">
                            <span class="icon-zt_plus"></span>
                            创建网络
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type">
                            <el-option label="部门" value="domain_name"></el-option>
                            <el-option label="租户" value="project_name"></el-option>
                            <el-option label="名称" value="name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="networkList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="networkList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 部门 -->
                        <template v-if="col.column=='dept'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 租户 -->
                        <template v-if="col.column=='renter'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10" v-if="scope.row.roleType == 1">超级管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 2">部门管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 3">子部门管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 4">用户</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='net'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='share'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='outside'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{getStatusText(scope.row.status)}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='manageStatus'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.creatTime}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="delNetwork(scope.row)" class="btn-linker">删除</a>
                                <b class="link-division-symbol" ></b>
                                <a  @click="createNetwork(scope.row,2)" class="btn-linker" >编辑</a>
                                <b class="link-division-symbol" ></b>
                                <router-link :to="{name:'app.resources.network.protmgr',params:{id:scope.row.id,item:scope.row,fromstate:'app.resources.network'}}" class="btn-linker">端口管理</router-link>
                                <b class="link-division-symbol"></b>
                                <a  @click="delRole(scope.row)" class="btn-linker" v-if="scope.row.status == 'ACTIVE' ">关机</a>

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
        <!--<relate-auth ref="RelateAuth"></relate-auth>-->
        <create-network ref="CreateNetwork"></create-network>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
// import RelateAuth from './RelateAuth';
import CreateNetwork from './CreateNetwork';
import {networkList,delNetwork} from '@/service/cloudres.js';
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
            { column: 'dept', text:'部门' , width: '10%'},
            { column: 'renter', text:'租户' , width: '10%'},
            { column: 'name', text: '名称', width: '10%' },
            { column: 'net', text: '已连接的子网', width: '10%' },
            { column: 'share', text: '共享', width: '5%' },
            { column: 'outside', text: '外部', width: '5%' },
            { column: 'status', text: '状态', width: '5%' },
            { column: 'manageStatus', text: '管理状态', width: '10%' }
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
        CreateNetwork,
        // CreateRole
    },
    methods: {
        networkList(){
            let params = {
                paging:this.searchObj.paging,
                [this.type]:this.formInline.searchText
            };
            $log('params', params);
            networkList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        // relateAuth(item){
        //     this.$refs.RelateAuth.show(item)
        //         .then(ret => {
        //             return this.$alert('操作成功','提示');
        //         })
        //         .catch(err => {
        //             if (err) {
        //                 console.log('Error', err);
        //             } else {
        //                 console.log('取消');
        //             }
        //         });
        // },
        createNetwork(item,optype){
            this.$refs.CreateNetwork.show(item,optype)
                .then(ret => {
                    this.networkList();
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
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.networkList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.networkList();
        },
        /** 虚拟机操作
         * item: 行数据对象；
         * operateName： 动作操作选项(pause:暂停;unpause:解除暂停;stop:停止;start:启动;lock:锁定;unlock:解除锁定;suspend: 挂起;
         * resume: 解除挂起;rescue:抢救;unrescue:取消抢救;shelve:搁置;shelveOffload:删除已搁置的实例 ;unshelve:取消搁置)
         * */
        // rebootEcs(item){
        //     rebootEcs(item.id).then(ret=>{
        //         this.ecsList();
        //     });
        // },
        del(item){
            delNetwork(item.id).then(ret=>{
                this.networkList();
            });
        },
        /**
         * 删除角色
         */
        delNetwork(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.del(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },

    mounted(){
        this.networkList();
    }
};
</script>
<style scoped>
</style>
