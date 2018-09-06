<template>
    <div class="page-main">
        <page-header>
            系统配置
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createSysconfig({},1)"><span class="icon-zt_plus"></span>  新增配置</el-button>
                        <el-button type="primary" @click="reloadCache()">刷新缓存</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type">
                            <el-option label="配置编码" value="code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getConfigList">查询</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-new-刷新" @click="getConfigList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 编码 -->
                        <template v-if="col.column=='code'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.code}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 描述 -->
                        <template v-if="col.column=='desc'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.desc}}</span>
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
                        <!-- 参数类型 -->
                        <template v-if="col.column=='configType'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.configType == '1'?'系统参数':'业务参数'}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="createSysconfig(scope.row,2)" class="btn-linker" >编辑</a>
                                <b class="link-division-symbol" ></b>
                                <a  @click="delSysconfig(scope.row)" class="btn-linker" >删除</a>

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

    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import {getConfigList,delConfig,reloadCache} from '@/service/usermgr/sysconfig.js';
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
            { column: 'code', text:'配置编码' , width: '15%'},
            { column: 'name', text:'配置名称' , width: '20%'},
            { column: 'desc', text:'配置描述' , width: '15%'},
            { column: 'createTime', text:'创建时间' , width: '20%'},
            { column: 'configType', text:'参数类型' , width: '10%'}
        ];

        return {
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
            },
            type:'code',
            tableData: []

        };
    },
    components: {
        PageHeader
    },
    methods: {
        getConfigList(){
            let params = {
                paging:this.searchObj.paging,
                [this.type]:this.formInline.searchText
            };
            $log('params', params);
            getConfigList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        //编辑
        createSysconfig(rowItem,optype){
            return this.$router.push({name:'app.usrmgr.editConfig',params:{opType:optype,item:rowItem}});
        },
        reloadCache(){
            reloadCache().then(ret => {
                $log('data', ret);
                if(ret.data.code == '0000'){
                    console.log('操作成功', ret);
                    return this.$confirm('操作成功');

                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                }

            });
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.getConfigList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.getConfigList();
        },
        del(item){
            delConfig(item).then(ret=>{
                this.getConfigList();
            });
        },
        /**
         * 删除配置
         */
        delSysconfig(item) {
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
        this.getConfigList();
    }
};
</script>
<style scoped>
</style>
