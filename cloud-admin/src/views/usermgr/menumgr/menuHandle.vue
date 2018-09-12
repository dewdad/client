<template>
    <div class="page-main">
        <page-header>
            <el-button type="primary" icon="el-icon-arrow-left" @click="goBack" size="small">返回</el-button>
            <span class="ml20">关联操作</span>
        </page-header>
        <div class="page-body">
            <!-- <search-box :searchObjExtra="searchObjExtra" @select="search"></search-box> -->
            <el-row :gutter="20" class="mb10">
                <el-col :span="8" ><el-button type="primary" size="small" @click="editMenuHandle(null,1)">新建</el-button></el-col>
                <el-col :span="16">
                    <div class="pull-right">                       
                        <el-select class="ml10 width152" size="small" clearable v-model="searchObj.field" @change="searchObj.searchText = '';" placeholder="请选择">
                            <el-option v-for="field in searchObjExtra.fields" :label="field.label" :value="field.field" :key="field.field"></el-option>
                        </el-select>
                        <el-input class="ml10"  size="small" placeholder="" style="width:208px;" v-model="searchObj.searchText"></el-input>
                        <el-button class="ml10" size="small" type="primary" @click="search" icon="el-icon-search">搜索</el-button>  
                        <el-button type="primary" size="small" class="ml10 search-refresh-btn icon-new-刷新" @click="search"></el-button>                      
                    </div>                    
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <!-- 列表 -->
                    <div>
                        <el-table class="font12 data-list" :data="dataList" header-row-class-name="data-list" style="width: 100%">
                            <template v-for="col in tableColums">
                                <!-- 名称 -->
                                <template v-if="col.prop==='opName'">
                                    <el-table-column  :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.opName}}</span>                                            
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- 关联函数方法 -->
                                <template v-if="col.prop==='opMethod'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.opMethod}}</span>                                            
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- 关键字 -->
                                <template v-if="col.prop==='opKey'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.opKey}}</span>                                             
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- url -->
                                <template v-if="col.prop==='opUrl'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.opUrl}}</span>                                            
                                        </template>                                    
                                    </el-table-column>
                                </template>
                           

                                <!-- 描述 -->
                                <template v-if="col.prop==='description'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.description}}</span>                                             
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- 是否选择 -->
                                <!-- <template v-if="col.prop==='isSelected'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.selected ? '是' : '否'}}</span>                                             
                                        </template>                                    
                                    </el-table-column>
                                </template> -->
                            </template>
                                
                            <!-- 操作 -->
                            <template>
                                <el-table-column label="操作" key="op" width="280">
                                    <template slot-scope="scope">
                                        
                                        <!-- 编辑 -->
                                        <a @click="editMenuHandle(scope.row,2)" class="btn-linker">编辑</a>
                                        <b class="link-division-symbol"></b>    
                                        <!-- 删除 -->
                                        <a @click="deleteMenuHandle(scope.row)" class="btn-linker">删除</a>
                                        <!-- <b class="link-division-symbol"></b>                                      -->
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </div>

                    <!-- 分页 -->
                    <div class="pagination">
                        <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="searchObj.paging.pageIndex" 
                        :page-sizes="[10, 20, 50, 100]" 
                        :page-size="searchObj.paging.limit" 
                        layout="sizes, prev, pager, next" 
                        :total="searchObj.paging.totalItems">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>  
        </div>

        <!-- 创建/编辑操作对话框 -->
        <create-menu-handle-dlg ref="createMenuHandleDlg"></create-menu-handle-dlg>        
    </div>
</template>

<script>

import PageHeader from '@/components/pageHeader/PageHeader';
import { getHandleListOfMenu,deleteMenuOp } from '@/service/usermgr/menumgr';
import CreateMenuHandleDlg from '@/views/usermgr/dialog/CreateMenuHandleDlg.vue';

// 表头列
const tableColums = [
    { prop: 'opName', label: '名称', render: true, width: '200px'},
    { prop: 'opMethod', label: '方法名', render: true, width: '200px'},
    { prop: 'opKey', label: '关键字', render: true, width: '200px'},
   

    { prop: 'opUrl', label: 'url', render: true, width: '200px'},
    { prop: 'description', label: '描述', render: true, width: '200px'}, 
    // { prop: 'isSelected', label: '是否选择', render: true, width: '200px'},   
];
export default {
    name: 'menuHandle',
    components: {        
        PageHeader,
        CreateMenuHandleDlg,
    }, 
    data() {        
        return {
            tableColums,  
            dataList:[], 
            searchObjExtra: {               
                //查询字段
                fields: [
                    { label: '名称', field: 'opName' },                  
                ]
            },
            // 查询参数
            searchObj: {
                menuCode:this.$route.params.code || '',
                field: '', //'text'菜单名称 'code'菜单编码 
                searchText:'',  
                //分页
                paging: {
                    pageIndex: 1,
                    limit: 10,
                    totalItems: 0
                },           
            },        
        };
    },    
           
    created() {
        this.search();
    },
    methods: {
        //查询；
        search(){ 
            let { field,searchText,paging } = this.searchObj;
            let searchData = {
                menuCode:this.$route.params.code || '',
                [field]:field ? searchText : '',
                paging,
            };          
            getHandleListOfMenu(searchData)
                .then( res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data;
                        console.log('resData', resData);
                        if (resData) {
                            let dataList = resData.data || [];                                
                            this.dataList = dataList;                            
                            this.searchObj.paging.totalItems = resData.total || 0;
                        }                    
                    } else {
                        this.$message.error(res.msg);
                    }                    
                })
                .catch( err => {                  
                    this.dataList = [];
                    this.searchObj.paging.totalItems = 0;
                });
        },

        //编辑
        editMenuHandle(rowItem,opType){   
            this.$refs.createMenuHandleDlg
                .show(rowItem,opType)
                .then( (dlgData) => { 
                    this.search();                   
                })
                .catch( err => {                   
                }); 
        },

        //删除操作
        deleteMenuHandle(rowItem){
            this.$confirm('您确定要删除<span class="color-primary">' + rowItem.opName + '</span>' + '操作吗？', '删除', {
                type: 'warning',
                dangerouslyUseHTMLString: true
            }).then(() => {
                deleteMenuOp(rowItem.id)
                    .then(res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            this.$message.success('删除成功');
                            this.search();  
                        }else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {
                        $log(err);
                    });
            });            
        },

        //返回到列表页面
        goBack(){
            this.$router.push({name:'app.usrmgr.menumgr'});
        },

        //分页查询事件
        handleCurrentChange(pageIndex){
            this.searchObj.paging.pageIndex = pageIndex;
            this.search();
        },
        handleSizeChange: function(params) {
            console.log('params:', params);
            this.searchObj.paging.limit = params;
            this.searchObj.paging.pageIndex = 1;
            this.search();
        },
    },
    mounted() {}
};
</script>
<style  lang="scss" scoped>
.width152{
    width: 152px;
}

</style>
