<template>
    <div class="page-main">
        <page-header>
            资源模板
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createModel({},1)">
                            <span class="icon-zt_plus"></span>
                            创建模板
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText=''">
                            <el-option label="内存(MB)>=" value="minRam"></el-option>
                            <el-option label="实例类型" value="instanceType"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input-number  controls-position="right" :min="0"  class="width-full"  :max="999999999" v-if="type == 'minRam'" v-model="formInline.searchText"></el-input-number>
                        <el-select placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'instanceType'" @change="clearIndex">
                            <el-option v-for="item in ecsTypes" :value="item.label" :label="item.value" :key="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="modelList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="modelList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- vcpu数量 -->
                        <template v-if="col.column=='vcpu'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.vCpu}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='ram'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{calcSize(scope.row.ram)}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='public'">
                            <el-table-column min-width="80" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row['os-flavor-access:is_public']?'是':'否'}}</span>
                                </template>
                            </el-table-column>
                        </template>
                         <template v-if="col.column=='brand'">
                            <el-table-column min-width="80" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.brand}}MB</span>
                                </template>
                            </el-table-column>
                         </template>
                          <template v-if="col.column=='types'">
                            <el-table-column min-width="80" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.types}}</span>
                                </template>
                            </el-table-column>
                          </template>
                           <template v-if="col.column=='cpuType'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.cpuType}}</span>
                                </template>
                            </el-table-column>
                           </template>
                            <template v-if="col.column=='cpuSpeed'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.cpuSpeed}}GHz</span>
                                </template>
                            </el-table-column>
                            </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="100" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="delModel(scope.row.id)" class="btn-linker">删除资源模板</a>
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
        <create-model ref="CreateModel"></create-model>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateModel from './CreateModel';

import {modelList,delModel} from '@/service/cloudres.js';
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
        let ecsTypes = [
            {
                label: 'ECS',
                value: 'ECS'
            },
            {
                label: 'RDS',
                value: 'RDS'
            }
        ];
        let cols = [
            { column: 'name', text:'名称' , width: '10%'},
            { column: 'vcpu', text:'VCPU数量' , width: '10%'},
            { column: 'ram', text: '内存', width: '10%' },
            { column: 'public', text: '公有', width: '10%' },
            { column: 'brand', text: '带宽', width: '10%' },
            { column: 'types', text: '类型', width: '10%' },
            { column: 'cpuType', text: '型号', width: '10%' },
            { column: 'cpuSpeed', text: '主频', width: '10%' },
        ];

        return {
            cols,
            searchObj,
            ecsTypes,
            formInline: {
                data:'',
                searchText:0
            },
            type:'minRam',
            tableData: []

        };
    },
    components: {
        PageHeader,
        CreateModel,
    },
    methods: {
        modelList(){
            let params = {
                paging:this.searchObj.paging,
            };
            if(this.formInline.searchText || this.formInline.searchText === 0){
                params[this.type] = this.formInline.searchText;
            }
            modelList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        clearIndex(){
            if([this.type] && this.formInline.searchText){
                this.searchObj.paging.pageIndex = 1;
            }
        },
        calcSize(size) {
            size = size * 1024 * 1024;
            if (size < 1024) {
                return size + 'B';
            }
            if (size < 1024 * 1024) {
                return size / 1024 + 'KB';
            }
            if (size < 1024 * 1024 * 1024) {
                return size / (1024 * 1024) + 'MB';
            }
            return size / (1024 * 1024 * 1024) + 'GB';
        },
        createModel(){
            this.$refs.CreateModel.show()
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
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.modelList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.modelList();
        },
        del(id){
            delModel(id).then(ret=>{
                if(ret.code === '0000'){
                    this.modelList();
                    return this.$alert('操作成功','提示');
                }
            });
        },
        /**
         * 删除模板
         */
        delModel(id) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.del(id);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },

    mounted(){
        this.modelList();
    }
};
</script>
<style scoped>
</style>
