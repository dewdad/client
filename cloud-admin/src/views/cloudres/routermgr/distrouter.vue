<template>
    <div class="page-main">
        <page-header>
            <el-button class=" fa fa-angle-left font12 mr10"   @click="goBack" size="small">&nbsp;返回</el-button>
            静态路由表
        </page-header>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <template v-if="col.column=='destination'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.destination}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='nextjump'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.nexthop}}</span>
                                </template>
                            </el-table-column>
                        </template>

                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <!--<template slot-scope="scope">-->
                                <!--<a  @click="createInterface(scope.row,2)" class="btn-linker" >编辑</a>-->
                                <!--<b class="link-division-symbol"></b>-->
                                <!--<a  @click="createInterface(scope.row)" >接口管理</a>-->
                                <!--<b class="link-division-symbol" ></b>-->
                                <!--<el-dropdown>-->
                                            <!--<span class="btn-linker">-->
                                                <!--更多-->
                                                <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                                            <!--</span>-->
                                    <!--<el-dropdown-menu slot="dropdown">-->
                                        <!--<el-dropdown-item @click.native="createInterface(scope.row)">静态路由表</el-dropdown-item>-->
                                        <!--<el-dropdown-item @click.native="setGateway(scope.row)">设置网关</el-dropdown-item>-->
                                        <!--<el-dropdown-item @click.native="createInterface(scope.row)">删除</el-dropdown-item>-->
                                    <!--</el-dropdown-menu>-->
                                <!--</el-dropdown>-->
                            <!--</template>-->
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
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import {delDetail} from '@/service/cloudres.js';
export default {
    name: 'app',

    data() {
        let stateParams = this.$route.params || {};
        let item = JSON.parse(stateParams.item);
        console.log('stateParams',stateParams);
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            { column: 'destination', text:'目的CIDR' , width: '10%'},
            { column: 'nextjump', text:'下一跳' , width: '10%'},
        ];

        return {
            cols,
            item,
            searchObj,
            tableData: []

        };
    },
    components: {
        PageHeader
    },
    methods: {
        delDetail(){
            delDetail(this.item.id).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.routes){
                    this.tableData = resData.routes || [];

                }

            });
        },

        goBack(){
            window.history.back();
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.delDetail();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.delDetail();
        },
        onSubmit() {}
    },
    mounted(){
        this.delDetail();
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
