<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            {{groupName}}
            <region-radio slot="content" v-model="region"></region-radio>
            <div slot="right">
                <el-button @click="addInstToGroupFn(ecsList)" type="primary" size="small">添加实例</el-button>                
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 主题 -->
        <div class="page-body">
            <!-- 搜索栏 -->
            <search-box :fields="searchObjExtra.fields" @select="getScreenVal"></search-box>
            <!-- 列表 -->
            <div>
                <el-table class="data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 实例名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <ul>
                                        <li>
                                            <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.id,item:scope.row}}" class="btn-linker">{{scope.row.id}}</router-link>
                                        </li>
                                        <li>
                                            <span class="font12 mr10">{{scope.row.name}}</span>                                        
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 所在可用区 -->
                        <template v-if="col.column=='region'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            </el-table-column>
                        </template>
                        <!-- IP地址 -->
                        <template v-if="col.column=='ip'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.ip}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="250" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <!-- 移出 -->
                                <span @click="deleteExample(scope.row.id)" class="btn-linker" >移出</span>
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
        <!-- 对话框 添加实例 -->
        <add-inst-to-group ref="AddInstToGroup"/>
    </div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import PageHeader from '@/components/pageHeader/PageHeader';
import searchBox from '@/components/search/SearchBox';
import AddInstToGroup from './dialog/AddInstToGroup';

import { getExistEcs, exampleBindGroup, getInstByGroup, exampleUntieGroup } from '@/service/ecs/security.js';

import { mapActions, mapState } from 'vuex';

let fields = [
    { field: 'name', label: '实例名称',inputval:'', tagType: 'NAME' },
    { field: 'ip', label:'ip地址',inputval:'', tagType: 'IP' }
];
        
let searchObjExtra = {
    frominfo: '',
    fields:fields,
    selField:fields[0]
};
let searchObj = {    
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    }
};
let cols = [
    { column: 'name', text: '实例ID/名称', width: '20%' },
    { column: 'region',text: '所在可用区',width: '4%'},
    { column: 'ip', text: 'IP地址', width: '10%' }
];
export default {
    data() {
        return {
            fields,
            searchObjExtra,
            tableData: [],
            cols,
            region: '',
            searchObj,
            ruleId: this.$route.params.ruleId,
            ecsList: {},
            searchId: '',
            searchVal: ''
        };
    },
    components: {
        RegionRadio,    
        PageHeader,
        searchBox,
        AddInstToGroup
    },
    computed: {
        ...mapState('ecs', ['needGroup']),
        groupName() {
            return this.needGroup.length > 0 && this.needGroup[0].name;
        }
    },
    methods: {
        ...mapActions('ecs', ['getNeedGroupFn']),
        getScreenVal(params) {
            if (params.selValue.tagType === 'IP') {
                this.searchId = params.selInputValue;
                this.searchVal = '';
            } else if(params.selValue.tagType === 'NAME') {
                this.searchVal = params.selInputValue;
                this.searchId = '';
            }
            $log(params);
            this.getInstByGroupFn();
        },
        // 查询安全组内实例列表
        getExistEcsFn() {
            getExistEcs(this.ruleId).then( (res) => {
                if(res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getExistEcs',res);  
                    this.ecsList = res.result;                      
                }

            });
        },
        // 查询当前安全组所绑定的实例
        getInstByGroupFn() {
            let params = {
                group_id: this.ruleId,
                name: this.searchVal,
                ip: this.searchId
            };
            getInstByGroup(params)
                .then((res) => {
                    if(res.code && res.code === this.CODE.SUCCESS_CODE){
                        $log('getInstByGroup',res);  
                        let resData = res.result;
                        if(resData && resData.records){
                            this.tableData = resData.records || [];
                            this.searchObj.totalItems = resData.total || 0; 
                        }                           
                    }
                });
        },
        // 为安全组添加实例弹窗
        addInstToGroupFn(rowItem) {
            console.log('AddInstToGroup:',rowItem);
            this.$refs.AddInstToGroup
                .show(rowItem)
                .then( ret => {
                    $log('为安全组添加实例返回', ret); 
                    this.exampleBindGroupFn(ret);
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                }); 
        },
        // 给实例绑定安全组
        exampleBindGroupFn(params) {
            let data = {
                group_id: this.ruleId,
                ecsId: params.instVal
            };
            exampleBindGroup(data)
                .then((res) => {
                    $log('成功');
                    this.getInstByGroupFn();
                })
                .catch((err) => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
        /**
         * 移除弹窗确认
         */ 
        deleteExample(params) {
            this.$confirm(`您确定要将ID为:${params}的实例移出安全组吗?`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exampleUntieGroupFn(params);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 实例移除安全组
        exampleUntieGroupFn(params) {
            let data = {
                group_id: this.ruleId,
                ecsId: params
            };
            exampleUntieGroup(data)
                .then((ret) =>{
                    this.$message({
                        type: 'success',
                        message: '移除成功!'
                    });
                });
        }
    },
    mounted() {
        this.getExistEcsFn();
        this.getInstByGroupFn();
        let params = {
            name: '',
            id: this.$route.params.ruleId
        };
        this.getNeedGroupFn(params);
    }
};
</script>
<style lang="scss" scoped>

</style>
