<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            {{$t('ecs.image.list.title')}}
            <region-radio slot="content" v-model="region"></region-radio>
            <div slot="right">
                <el-button @click="modifySafeGrp('')" type="primary" size="small">创建安全组</el-button>                
                <el-button type="info" size="small">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 主体 -->
        <div class="page-body">
            <!-- 搜索栏 -->
            <search-box :searchObjExtra="searchObjExtra" @select="getScreenVal"></search-box>
            <!-- 列表 -->
            <div>
                <el-table class="data-list" @cell-mouse-enter="showEditName" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 实例名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <ul>
                                        <li>
                                            <span class="font12 mr10">{{scope.row.id}}</span>
                                        </li>
                                        <li>
                                            <span class="font12 mr10">{{scope.row.name}}</span>
                                            <AmendName :scope="scope" v-show="scope.row.id === showId"></AmendName>                                            
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 相关实例 -->
                        <template v-if="col.column=='countInstance'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <el-tag>{{scope.row.countInstance || 0}}</el-tag>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 创建时间 -->
                        <template v-if="col.column=='createDate'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.createDate}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 描述 -->
                        <template v-if="col.column=='remark'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="250" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <!-- 修改 -->
                                <span @click="modifySafeGrp(scope.row)" class="btn-linker">修改</span>
                                <b class="link-division-symbol"></b>
                                <!-- 管理实例 -->
                                <!-- <span class="color-primary finger-cursor">管理实例</span> -->
                                <router-link class="btn-linker" :to="{name:'app.ecs.groupRule.safegrpList', params:{ruleId:scope.row.id}}">管理实例</router-link>
                                <b class="link-division-symbol"></b>
                                <!-- 配置规则 -->
                                <router-link class="btn-linker" :to="{name:'app.ecs.groupRule.safegrpRule', params: {ruleId:scope.row.id}}">配置规则</router-link>
                                <!-- <span class="color-primary finger-cursor">配置规则</span> -->
                                <b class="link-division-symbol"></b>
                                <!-- 删除 -->
                                <span v-if="!scope.row.countInstance" @click="deleteExample(scope.row.id)" class="btn-linker" >删除</span>
                                <el-tooltip v-if="scope.row.countInstance" content="已关联到实例" transition="scale-in" placement="bottom" effect="light">
                                    <span class="btn-linker"><a disabled >删除</a></span>
                                </el-tooltip> 
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
        <!-- 对话框 修改 -->
        <modify-safe-group ref="ModifySafeGroup"/>
    </div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import PageHeader from '@/components/pageHeader/PageHeader';
import searchBox from '@/components/search/SearchBox';
import AmendName from '@/components/amend/AmendName';
import ModifySafeGroup from './dialog/ModifySafeGroup';

import { getSecurityGroupList, deleteGroup } from '@/service/ecs/security.js';

let fields = [
    { field: 'id', label: '安全组ID',inputval:'', tagType: 'ID' },
    { field: 'name', label:'安全组名称',inputval:'', tagType: 'Name' }
];
        
let searchObjExtra = {
    frominfo: '',
    fields:fields,
    selField:fields[0]
};
let cols = [
    { column: 'name', text: '安全组ID/名称', width: '20%' },
    { column: 'countInstance',text: '相关实例',width: '4%'},
    { column: 'createDate', text: '创建时间', width: '10%' },
    { column: 'remark', text: '描述', width: '10%' }
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
        return {
            fields,
            searchObjExtra,
            tableData: [],
            cols,
            showId: '',
            region: '',
            searchObj,
            searchVal: '',
            searchId: ''
        };
    },
    components: {
        RegionRadio,    
        PageHeader,
        searchBox,
        AmendName,
        ModifySafeGroup
    },
    methods: {
        getScreenVal(params) {
            console.log(params);
            if (params.selValue.tagType === 'ID') {
                this.searchId = params.selInputValue;
                this.searchVal = '';
            } else if(params.selValue.tagType === 'Name') {
                this.searchVal = params.selInputValue;
                this.searchId = '';
            }
            this.getGroupListFn();
        },
        /**
         * 进入单元格
         */
        showEditName(row, column, cell, event){
            this.showId = row.id;
        },
        /**
         * 删除安全组弹窗确认
         */ 
        deleteExample(params) {
            this.$confirm(`您确定要删除ID为:${params}的安全组吗?`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delGroupFn(params);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 删除安全组
        delGroupFn(params) {
            deleteGroup(params)
                .then((ret) =>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getGroupListFn();
                }).catch((err) => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });   
                });
        },
        // 修改安全组
        modifySafeGrp(rowItem) {
            console.log('modifySafeGrp:',rowItem);
            this.$refs.ModifySafeGroup
                .show(rowItem)
                .then( ret => {
                    this.getGroupListFn();                
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });  
        },
        // 获得安全组列表
        getGroupListFn() {
            let params = {
                paging:this.searchObj.paging,
                name: this.searchVal,
                id: this.searchId
            };
            getSecurityGroupList(params).then( (res) => {
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
        } 
    },
    mounted() {
        this.getGroupListFn();
    }
};
</script>
<style lang="scss" scoped>

</style>
