<template>
    <div class="page-main">
        <page-header>
            <el-button class=" fa fa-angle-left font12 mr10"   @click="goBack" size="small">&nbsp;返回</el-button>
            接口管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createInterface(item)">
                            <span class="icon-zt_plus"></span>
                            创建接口
                        </el-button>
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
                        <template v-if="col.column=='neutronSubnets'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.fixed_ips[0].ip_address}}</span>
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
                        <template v-if="col.column=='type'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.device_owner}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='manage'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.admin_state_up == true?'是':'否'}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="createInterface(scope.row)" class="btn-linker" >删除接口</a>
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
        <create-interface ref="CreateInterface"></create-interface>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import ZtStatus from '@/components/status/ZtStatus';
import CreateInterface from './CreateInterface';
import {searchPortList} from '@/service/cloudres.js';
export default {
    name: 'app',

    data() {
        let stateParams = this.$route.params || {};
        let item = JSON.parse(stateParams.item);
        console.log('stateParams',stateParams);
        // console.log('item',item);
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            { column: 'name', text:'名称' , width: '10%'},
            { column: 'neutronSubnets', text:'固定IP' , width: '10%'},
            { column: 'status', text:'状态' , width: '10%'},
            { column: 'type', text:'类型' , width: '10%'},
            { column: 'manage', text:'管理状态' , width: '10%'},
        ];

        return {
            cols,
            item,
            searchObj,

            formInline:{},
            tableData: []

        };
    },
    components: {
        PageHeader,
        CreateInterface,
        ZtStatus
    },
    methods: {
        searchPortList(){
            let params = {
                // paging:this.searchObj.paging,
                deviceId:this.item.id
            };
            $log('params', this.item);
            searchPortList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData ){
                    this.tableData = resData || [];

                }

            });
        },
        createInterface(){
            this.$refs.CreateInterface.show(this.item)
                .then(ret => {
                    this.modelList();
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
        goBack(){
            window.history.back();
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.searchPortList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.searchPortList();
        },
        onSubmit() {}
    },
    mounted(){
        this.searchPortList();
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
