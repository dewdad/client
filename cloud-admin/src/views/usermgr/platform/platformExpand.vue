<template>
    <div class="page-main">
        <page-header>
            <el-button class=" fa fa-angle-left font12 mr10"   @click="goBack" size="small">&nbsp;返回</el-button>
            平台扩展
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createExpand({},stateParams.id,1)"><span class="icon-zt_plus"></span>  添加平台扩展信息</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="getExpandList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 参数名 -->
                        <template v-if="col.column=='paramName'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.paramName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='paramVal'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.paramVal}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='description'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.description}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='time'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.createTime | date }}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="createExpand(scope.row,stateParams.id,2)" class="btn-linker" >编辑</a>
                                <b class="link-division-symbol"></b>
                                <a  @click="delExpand(scope.row)" class="btn-linker" >删除</a>
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
        <create-expand-platform ref="CreateExpandPlatform"></create-expand-platform>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateExpandPlatform from './CreateExpandPlatform';
import {getExpandList,delExpand} from '@/service/platform.js';
export default {
    name: 'platformExpand',

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
            { column: 'paramName', text:'参数名' , width: '10%'},
            { column: 'paramVal', text:'值', width: '15%'},
            { column: 'description', text: '描述', width: '20%' },
            { column: 'time', text: '创建时间', width: '10%' }
        ];
        // let fields = [
        //     { field: 'name', label: '角色名称',inputval:'', tagType: 'INPUT' },
        // ];
        //
        // let searchObjExtra = {
        //     fields:fields,
        //     selField:fields[0]
        // };
        return {
            stateParams,
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
        CreateExpandPlatform

    },
    methods: {
        goBack(){
            window.history.back();
        },
        getExpandList(){
            let params = {
                paging:this.searchObj.paging,
                platformResourceId:this.stateParams.id
            };
            $log('params', params);
            getExpandList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        addPlatAuth(item){

        },
        /**
         * 删除扩展信息
         */
        delExpand(item) {
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
        //创建扩展信息
        createExpand(item,id,optype){
            this.$refs.CreateExpandPlatform.show(item,id,optype)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.getExpandList();
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
            delExpand(item).then(ret=>{
                if(ret.code === '0000'){
                    this.getExpandList();
                    return this.$alert('操作成功','提示');
                }
            });
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.getExpandList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.getExpandList();
        },
        onSubmit() {}
    },
    mounted(){
        this.getExpandList();
    }
};
</script>
<style scoped>
</style>
