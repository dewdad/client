<template>
    <div class="page-main">
        <page-header>
            IP管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                    <el-button type="primary" @click="createFloatIp()">
                    <span class="icon-zt_plus"></span>
                    分配IP各项目
                    </el-button>
                    </el-form-item>

                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="floatIplist"></el-button>
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
                        <template v-if="col.column=='IPaddress'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.floating_ip_address}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='fixip'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.fixed_ip_address}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='pool'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.network_name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{statusText(scope.row.status)}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="removeIp(scope.row)" class="btn-linker" >释放IP</a>
                                <b class="link-division-symbol" v-if="scope.row.status == 'UP'"></b>
                                <a  @click="disConnectIp(scope.row)" v-if="scope.row.status == 'UP'">解绑IP</a>
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
        <create-floatip ref="CreateFloatip"></create-floatip>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateFloatip from './CreateFloatip';

import {floatIplist,delfloatIp,disassociateFromPort} from '@/service/cloudres.js';
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
            { column: 'IPaddress', text: 'IP地址', width: '5%' },
            { column: 'fixip', text: '已映射固定IP地址', width: '5%' },
            { column: 'pool', text: '资源池', width: '10%' },
            { column: 'status', text: '状态', width: '10%' },
        ];
        return {
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
        CreateFloatip
    },
    methods: {
        floatIplist(){
            let params = {
                paging:this.searchObj.paging,
                [this.type]:this.formInline.searchText
            };
            $log('params', params);
            floatIplist(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.resultList){
                    this.tableData = resData.resultList || [];
                    this.searchObj.paging.totalItems = resData.totalPages || 0;
                }
            });
        },
        statusText(status){
            let outstr = '';
            if(status){
                switch(status){
                    case 'ACTIVE':{ outstr = '运行中'; break;}
                    case 'DOWN':{ outstr = '未使用'; break;}
                    case 'ERROR':{ outstr = '错误'; break;}
                    default:{ outstr = status; }
                }
            }
            return outstr;
        },
        distRouter(){},
        setGateWay(){},
        //创建浮动ip
        createFloatIp(){
            this.$refs.CreateFloatip.show().then(ret=>{
                console.log('retasdasdasd',ret);
                if(ret.floatingNetworkId){
                    this.floatIplist();
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
            this.floatIplist();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.floatIplist();
        },
        del(item){
            delfloatIp(item.id).then(ret=>{
                this.floatIplist();
            });
        },
        /**
         * 释放IP
         */
        removeIp(item) {
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
        /**
         * 解绑IP
         */
        disConnectIp(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                disassociateFromPort(item.id).then(ret=>{
                    this.floatIplist();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },

    mounted(){
        this.floatIplist();
    }
};
</script>
<style scoped>
</style>
