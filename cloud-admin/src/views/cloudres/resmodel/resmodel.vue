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
                        <el-select placeholder="请选择" v-model="type">
                            <el-option label="内存>=" value="minRam"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
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
                                    <span class="font12 mr10">{{scope.row.vcpu}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='ram'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.ram}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='public'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
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
        <!--<create-role ref="CreateRole"></create-role>-->
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateModel from './CreateModel';
// import CreateRole from './CreateRole';
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
        let cols = [
            { column: 'name', text:'名称' , width: '10%'},
            { column: 'vcpu', text:'VCPU数量' , width: '10%'},
            { column: 'ram', text: '内存', width: '10%' },
            { column: 'public', text: '公有', width: '10%' }
        ];

        return {
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
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
                [this.type]:this.formInline.searchText
            };
            $log('params', params);
            modelList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
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
                this.modelList();
            });
        },
        /**
         * 删除角色
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
