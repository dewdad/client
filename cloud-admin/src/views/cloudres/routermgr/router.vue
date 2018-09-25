<template>
    <div class="page-main">
        <page-header>
            路由管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                    <el-button type="primary" @click="editRouter({},1)">
                    <span class="icon-zt_plus"></span>
                    新建路由
                    </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText=''">
                            <el-option v-for="item in searchCond" :value="item.column" :label="item.text" :key="item.column"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="routerList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="routerList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <template v-if="col.column=='domain_name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.domain_name}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='project_name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.project_name}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span  v-if="scope.row.status == 'ACTIVE'">
                                        <zt-status :status="[{text: '运行中',value: 'ACTIVE',className: 'color-success',icon: 'icon-running_people'}]" :value="scope.row.status" class="text-nowrap status-column font12"></zt-status>
                                    </span>
                                    <span v-else>
                                        <svg  class="zticon" aria-hidden="true">
                                              <use href="#icon-overdue_people"></use>

                                        </svg>
                                        <span class="font12"> 关闭</span>
                                    </span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='networkName'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.networkName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='adminStateUp'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.admin_state_up ? "UP":"DOWN"}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="editRouter(scope.row,2)" class="btn-linker" >编辑</a>
                                <b class="link-division-symbol"></b>
                                <a  @click="manageRouter(scope.row)" >接口管理</a>
                                <b class="link-division-symbol" ></b>
                                <el-dropdown>
                                            <span class="btn-linker">
                                                更多
                                                <i class="el-icon-arrow-down el-icon--right"></i>
                                            </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="distRouter(scope.row)">静态路由表</el-dropdown-item>
                                        <el-dropdown-item @click.native="setGateWay(scope.row)">设置网关</el-dropdown-item>
                                        <el-dropdown-item @click.native="delRouter(scope.row)">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
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
        <create-router ref="CreateRouter"></create-router>
        <create-gateway ref="CreateGateway"></create-gateway>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateRouter from './CreateRouter';
import CreateGateway from './CreateGateway';
import ZtStatus from '@/components/status/ZtStatus';
import {routerList,delRouter} from '@/service/cloudres.js';
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
            { column: 'domain_name', text:'部门' , width: '10%'},
            { column: 'project_name', text:'租户' , width: '5%'},
            { column: 'name', text: '名称', width: '5%' },
            { column: 'status', text: '状态', width: '5%' },
            { column: 'networkName', text: '外部网络', width: '10%' },
            { column: 'adminStateUp', text: '管理状态', width: '10%' },
        ];

        let searchCond = [
            {column: 'domain_name', text: '部门'},
            {column: 'project_name', text: '租户'},
            {column: 'name', text: '路由名称'}
        ];
        return {
            searchCond,
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
            },
            type:'',
            tableData: []

        };
    },
    components: {
        PageHeader,
        CreateRouter,
        CreateGateway,
        ZtStatus
    },
    methods: {
        routerList(){
            let params = {
                paging:this.searchObj.paging,
            };
            if([this.type] && this.formInline.searchText){
                params[this.type] = this.formInline.searchText;
            }
            $log('params', params);
            routerList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.resultList){
                    this.tableData = resData.resultList || [];
                    this.searchObj.paging.totalItems = resData.totalPages || 0;
                }
            });
        },
        manageRouter(rowItem){
            let itemStr = JSON.stringify(rowItem);
            return this.$router.push({name:'app.cloudres.network.routermanage',params:{item:itemStr}});
        },
        distRouter(rowItem){
            let itemStr = JSON.stringify(rowItem);
            return this.$router.push({name:'app.cloudres.network.distrouter',params:{item:itemStr}});
        },
        setGateWay(item){
            this.$refs.CreateGateway.show(item).then(ret=>{
                console.log('retfsdff',ret);
                if(ret && ret.id){
                    this.routerList();
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            }
            );
        },
        //修改/创建路由
        editRouter(item,optype){
            this.$refs.CreateRouter.show(item,optype).then(ret=>{
                console.log('retfsdff',ret);
                if(ret.adminStateUp || ret.id){
                    this.routerList();
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            }
            );
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.routerList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.routerList();
        },
        del(item){
            delRouter(item.id).then(ret=>{
                if(ret.code === '0000'){
                    this.routerList();
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            });
        },
        /**
         * 删除镜像
         */
        delRouter(item) {
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
        this.routerList();
    }
};
</script>
<style scoped>
</style>
