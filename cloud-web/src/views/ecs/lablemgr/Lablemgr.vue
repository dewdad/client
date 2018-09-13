<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            标签管理
            <div slot="right">            
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 主体 -->
        <div class="search-column mt20 mb20">
            <span class="mr10">
                键：
                <el-input v-model="labelKey" size="small" placeholder="请输入内容"></el-input>
            </span>
            <span class="mr10">
                值：
                <el-input v-model="labelValue" size="small" placeholder="请输入内容"></el-input>
            </span>
            <el-button @click="searchLabel" type="primary" size="small" icon="el-icon-search">搜索</el-button>
        </div>
        <!-- 列表 -->
        <div>
            <el-table class="data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                <template v-for="col in cols">
                    <template>
                        <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template>
                    <el-table-column label="使用详情" key="op" width="250" class-name="option-snaplist">
                        <template slot-scope="scope">
                            <span class="mr20">实例：</span>
                            <!-- 配置规则 -->
                            <span class="color-success finger-cursor mr10">1台</span>
                            <!-- 删除 -->
                            <span class="btn-linker" >查看</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination background :current-page="searchObj.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import { statLabels } from '@/service/ecs/labels.js';
// let tableData = [
//     {
//         labelKey: 0,
//         labelValue: '高效云盘'
//     }
// ];
let cols = [
    { column: 'labelKey', text: '标签键', width: '20%' },
    { column: 'labelValue',text: '标签值',width: '4%'}
];
let searchObj = {    
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    }
};
export default {
    data() {
        return{
            labelKey: '',
            labelValue: '',
            tableData: [],
            cols,
            searchObj
        };
    },
    components: { 
        PageHeader
    },
    methods: {
        // 查询所有标签
        getAlllabel() {
            let params = {
                paging:this.searchObj.paging,
                deviceId: '',
                labelKey: this.labelKey,
                labelValue: this.labelValue
            };
            statLabels(params).then( (res) => {
                if(res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getKeypairList',res);  
                    let resData = res.result;
                    if(resData && resData.records){
                        this.tableData = resData.records || []; 
                        this.searchObj.totalItems = resData.total || 0;
                        console.log('getKeypairList tableData',this.tableData); 
                    }                           
                }

            });
        },
        // 搜索标签
        searchLabel() {
            this.getAlllabel();
            this.labelKey = '';
            this.labelValue = '';
        }
    },
    mounted() {
        this.getAlllabel();
    }
};
</script>
<style lang="scss" scoped>
.search-column{
    .el-input{
        width:200px;
    }
}
</style>
