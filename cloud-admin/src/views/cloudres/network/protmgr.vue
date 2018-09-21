<template>
    <div class="page-main">
        <page-header>
            <el-button class=" fa fa-angle-left font12 mr10"   @click="goBack" size="small">&nbsp;返回</el-button>
            端口管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" size="small">
                    <el-form-item>
                        <el-button type="primary icon-zt_plus" @click="createPort({},1)"> 创建端口</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="searchPortList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='fixedIp'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.fixed_ips[0].ip_address}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.status == "ACTIVE"? "运行中":"关闭"}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='admin'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.admin_state_up?'UP':'DOWN'}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="createPort(scope.row,2)" class="btn-linker" >编辑</a>
                                <b class="link-division-symbol"></b>
                                <a  @click="delPort(scope.row)" class="btn-linker" >删除</a>
                                <!--<b class="link-division-symbol"></b>-->
                                <!--<a  @click="addAddress(scope.row)" class="btn-linker" >添加地址对</a>-->
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
        <create-port ref="CreatePort"></create-port>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreatePort from './CreatePort';
import {searchPortList,delPort} from '@/service/cloudres.js';
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
            { column: 'name', text:'名称' , width: '15%'},
            { column: 'fixedIp', text:'固定ip' , width: '15%'},
            { column: 'device', text: '连接设备', width: '15%' },
            { column: 'status', text: '状态', width: '15%' },
            { column: 'admin', text: '管理状态', width: '15%' },
        ];
        return {
            cols,
            searchObj,
            networkId:stateParams.id,

            tableData: []

        };
    },
    components: {
        PageHeader,
        CreatePort

    },
    methods: {
        searchPortList(){
            let params = {
                paging:this.searchObj.paging,
                networkId:this.networkId
            };
            $log('params', params);
            searchPortList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData ){
                    this.tableData = resData || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        /**
         * 删除端口
         */
        delPort(item) {
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
        //创建端口
        createPort(item,optype,){
            let id = this.networkId;
            this.$refs.CreatePort.show(item,optype,id)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.searchPortList();
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
        del(item){
            delPort(item.id).then(ret=>{
                if(ret.code === '0000'){
                    this.searchPortList();
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }

            });
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.searchPortList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.searchPortList();
        },
        goBack(){
            window.history.back();
        },
        onSubmit() {}
    },
    mounted(){
        this.searchPortList();
    }
};
</script>
<style scoped>
</style>
