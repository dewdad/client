<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            密钥对管理
            <region-radio slot="content" v-model="region"></region-radio>
            <div slot="right">
                <el-button @click="createKey" type="primary" size="small">创建密钥对</el-button>
            </div>
        </page-header>
        <!-- 主体 -->
        <div class="page-body">
            <!-- 搜索栏 -->
            <search-box :searchObjExtra="searchObjExtra" @select="getScreenVal"></search-box>
            <!-- 列表 -->
            <div>
                <el-table class="data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 实例名称 -->
                        <template>
                            <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                                
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="250" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <!-- 删除 -->
                                <span @click="deleteExample(scope.row.id)" class="btn-linker" >删除</span>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
        <div class="pagination">
            <el-pagination background :current-page="searchObj.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
            </el-pagination>
        </div>
        <!-- 对话框 创建密钥对-->
        <create-keypair ref="CreateKeypair"/>
    </div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import PageHeader from '@/components/pageHeader/PageHeader';
import searchBox from '@/components/search/SearchBox';
import CreateKeypair from './dialog/CreateKeypair';

import { getKeypairList, deleteKeypairs } from '@/service/ecs/keypairs.js';

let fields = [
    { field: 'status', label:'密钥对名称',inputval:'', tagType: 'SELECT' }
];

let searchObj = {    
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    },
    ////需要放入的其它参数
    //params: {},
    //附加查询条件
    extra:{     
        //startTime:'',
        //endTime:'',    
        //orderBy:'', //排序字段
        //ascOrDesc: '', //'DESC'、'ASC'  //descend 降序,ascend 升序  
    }, 
};
let searchObjExtra = {
    frominfo: '',
    fields:fields,
    selField:fields[0]
};
let cols = [
    { column: 'name', text: '密钥对名称', width: '20%' },
    { column: 'fingerPrint',text: '密钥对指纹',width: '4%'},
];
export default {
    data() {
        return {
            fields,
            searchObjExtra,
            tableData: [],
            cols,
            searchObj,
            region: '',
            searchVal: ''
        };
    },
    components: {
        RegionRadio,    
        PageHeader,
        searchBox,
        CreateKeypair
    },
    mounted() {
        this.getKeypairFn();
    },
    methods: {
        getScreenVal(params) {
            console.log(params);
            this.searchVal = params.selInputValue;
            this.getKeypairFn();
        },
        /**
         * 删除密钥对的弹窗
         */ 
        deleteExample(params) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteKeypairsFn(params);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        /**
         * 创建密钥对
         */ 
        createKey(rowItem) {
            console.log('CreateKeypair:',rowItem);
            this.$refs.CreateKeypair
                .show(rowItem)
                .then( ret => {
                    this.getKeypairFn();
                    return this.$confirm('操作成功');     
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });  
        },
        /**
         * 获取秘钥对列表 
         */ 
        getKeypairFn() {
            let params = {
                paging:this.searchObj.paging,
                name: this.searchVal
            };
            getKeypairList(params).then( (res) => {
                if(res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getKeypairList',res);  
                    let resData = res.result;
                    if(resData && resData.data){
                        this.tableData = resData.data || []; 
                        this.searchObj.totalItems = resData.total || 0;
                        console.log('getKeypairList tableData',this.tableData); 
                    }                           
                }

            });
        },
        /**
         * 删除密钥对
         */ 
        deleteKeypairsFn(params){
            deleteKeypairs(params)
                .then((ret) =>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getKeypairFn();
                }).catch((err) => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });   
                });
        }
    }
};
</script>
<style lang="scss" scoped>

</style>
