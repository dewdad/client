<template>
    <div class="page-main">
        <page-header>
            我的工单
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createOrder({},1)">
                            <span class="icon-zt_plus"></span>
                            创建工单
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText=''">
                            <el-option label="工单号" value="orderNO"></el-option>
                            <el-option label="标题" value="orderTitle"></el-option>
                            <el-option label="联系方式" value="phone"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="myorderList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="myorderList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 工单号 -->
                        <template v-if="col.column=='orderNO'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.orderNO}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 标题 -->
                        <template v-if="col.column=='orderTitle'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <a class="font12 mr10" @click="showDetail(scope.row)">{{scope.row.title}}</a>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 联系方式 -->
                        <template v-if="col.column=='phone'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.mobile}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 产品类型 -->
                        <template v-if="col.column=='productType'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.productType}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 故障类型 -->
                        <template v-if="col.column=='faultType'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.faultType}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 创建时间 -->
                        <template v-if="col.column=='createTime'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.createTime | date}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 状态 -->
                        <template v-if="col.column=='status'">
                            <el-table-column width="90" :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                <template slot-scope="scope">
                                    <span class="font12 mr10" v-if="scope.row.status == 1">待审核</span>
                                    <span class="font12 mr10" v-if="scope.row.status == 2">待处理</span>
                                    <span class="font12 mr10" v-if="scope.row.status == 3">已审核</span>
                                    <span class="font12 mr10" v-if="scope.row.status == 4">已关闭</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="relateAuth(scope.row)" class="btn-linker" >转交</a>
                                <b class="link-division-symbol" ></b>
                                <a  @click="createRole(scope.row,2)" class="btn-linker" >补充</a>
                                <b class="link-division-symbol" ></b>
                                <a  @click="delOrder(scope.row)" class="btn-linker" >删除</a>

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
        <create-order ref="CreateOrder"></create-order>
        <order-detail ref="OrderDetail"></order-detail>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateOrder from './CreateOrder';
import OrderDetail from './OrderDetail';

import {myorderList,delOrder} from '@/service/order.js';
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
            { column: 'orderNO', text:'工单号' , width: '10%'},
            { column: 'orderTitle', text:'问题标题' , width: '15%'},
            { column: 'productType', text: '产品类型', width: '10%' },
            { column: 'faultType', text: '故障类型', width: '10%' },
            { column: 'phone', text: '联系方式', width: '10%' },
            { column: 'createTime', text: '创建时间', width: '10%' },
            { column: 'status', text: '状态', width: '10%' ,
                dropdowns: [
                    {key: 0, 'text': '全部', 'state': true, value: ''},
                    {key: 1, 'text': '待审核', 'state': false, value: '1'},
                    {key: 2, 'text': '待处理', 'state': false, value: '2'},
                    {key: 3, 'text': '已审核', 'state': false, value: '3'},
                    {key: 4, 'text': '已关闭', 'state': false, value: '4'}
                ]
            },
        ];

        return {
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
            },
            type:'orderNO',
            tableData: []

        };
    },
    components: {
        PageHeader,
        CreateOrder,
        OrderDetail

    },
    methods: {
        myorderList(){
            let params = {
                paging:this.searchObj.paging,
                [this.type]:this.formInline.searchText
            };
            $log('params', params);
            myorderList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.records){
                    this.tableData = resData.records || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        relateAuth(item){
            this.$refs.RelateAuth.show(item)
                .then(ret => {
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
        createOrder(item,optype){
            this.$refs.CreateOrder.show(item,optype)
                .then(ret => {
                    this.myorderList();
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
        //工单详情
        showDetail(item){
            this.$refs.OrderDetail.show(item);
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.myorderList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.myorderList();
        },
        del(item){
            delOrder(item).then(ret=>{
                this.myorderList();
            });
        },
        /**
         * 删除工单
         */
        delOrder(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.del(item.id);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },

    mounted(){
        this.myorderList();
    }
};
</script>
<style scoped>
</style>
