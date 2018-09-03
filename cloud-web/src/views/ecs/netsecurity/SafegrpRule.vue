<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            <img src="@/assets/images/ecs/group_icon.svg" width="50" alt="">
            <div slot="right">
                <a href="JavaScript:void(0)" class="font12 mr10">
                    添加安全组规则说明
                    <i class="font12 iconfont icon-ecport_people"></i>
                </a>
                <el-button @click="addrule(direction, ruleId)" type="primary" size="small">添加规则</el-button>                
                <el-button type="info" size="small">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 切换展示条件 -->
        <el-tabs v-model="direction">
            <el-tab-pane label="入方向" name="ingress"></el-tab-pane>
            <el-tab-pane label="出方向" name="egress"></el-tab-pane>
        </el-tabs>
        <!-- 注意事项 -->
        <el-alert type="warning" title="" :closable="false" class="font12 mb20" v-show="direction === 'egress'">
            <i class="iconfont icon-notice_people mr10"></i>
            <span>安全组出方向默认允许所有访问，即从安全组内ECS访问外部都是放行的。</span>
        </el-alert>
        <!-- 列表 -->
        <div>
            <el-table class="data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                <template v-for="col in cols">
                    <!-- 实例名称 -->
                    <template>
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template>
                    <el-table-column label="操作" key="op" class-name="option-snaplist">
                        <template slot-scope="scope">
                            <span @click="amendDes" class="btn-linker">修改描述</span>
                            <b class="link-division-symbol"></b>
                            <!-- 移出 -->
                            <span @click="deleteExample(scope.row.id)" class="btn-linker" >删除</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>

        <div class="pagination">
            <el-pagination background :current-page="searchObj.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
            </el-pagination>
        </div>
        <!-- 对话框 修改描述 -->
        <amend-describe ref="AmendDescribe"/>
        <!-- 对话框 增加组件 -->
        <add-rules ref="AddRules"/>
    </div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import PageHeader from '@/components/pageHeader/PageHeader';
import searchBox from '@/components/search/SearchBox';
import AmendDescribe from './dialog/AmendDescribe';
import AddRules from './dialog/AddRules';

import { getGroupRuleList } from '@/service/ecs/security.js';


let searchObj = {    
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    }
};
let cols = [
    { column: 'protocolType', text: '协议类型', width: '20%' },
    { column: 'portRange',text: '端口范围',width: '4%'},
    { column: 'authType', text: '授权类型', width: '10%' },
    { column: 'authorityObj', text: '授权对象', width: '10%' },
    { column: 'describe', text: '描述', width: '10%' },
    { column: 'createTime', text: '创建时间', width: '10%' }
];
export default {
    data() {
        return {
            imgType: 1,
            tableData: [],
            cols,
            direction: 'ingress',
            searchObj,
            ruleId: this.$route.params.ruleId
        };
    },
    watch: {
        direction (val) {
            this.getGroupRuleListFn();
        }
    },
    components: {
        RegionRadio,    
        PageHeader,
        searchBox,
        AmendDescribe,
        AddRules
    },
    methods: {
        // 删除
        deleteExample(id) {
            this.$confirm(`您确定要删除该规则吗?`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 修改描述
        amendDes(rowItem) {
            console.log('modifySafeGrp:',rowItem);
            this.$refs.AmendDescribe
                .show(rowItem)
                .then( ret => {                    
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });  
        },
        // 增加规则
        addrule(rowItem, groupId) {
            console.log('AddRules:',rowItem);
            this.$refs.AddRules
                .show(rowItem, groupId)
                .then( ret => {                    
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                }); 
        },
        // 获得安全组规则列表
        getGroupRuleListFn() {
            let params = {
                paging:this.searchObj.paging,
                direction: this.direction,
                create_date: ''
            };
            console.warn(params);
            getGroupRuleList(this.ruleId, params).then( (res) => {
                if(res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getKeypairList',res);  
                    let resData = res.result;
                    if(resData && resData.records){
                        this.tableData = resData.data || []; 
                        this.searchObj.totalItems = resData.total || 0;
                        console.log('getKeypairList tableData',this.tableData); 
                    }                           
                }

            });
        }
    },
    mounted() {
        this.getGroupRuleListFn();
    }
};
</script>

<style lang="scss" scoped>
.conditionTab{
    border-bottom: 1px solid #eee;
    color: #999999;
    &::after{
        content: '';
        display: block;
        clear: both;
    }
    .Image{
        width: 60px;
        height: 42px;
        line-height: 38px;
        text-align: center;
        float: left;
        .spanBorder{
            display: block;
            display: flex;
            justify-content: center;
            width: 100%;
            span{
                width: 0%;
                height: 4px;
                background: #0d7ef2;
                transition: width .6s;
            }
        }
    }
    .active {
        color: #333333;
        .spanBorder span{
            width: 100%;
        }
    }
    .pubImage:hover .spanBorder span{
        width: 100%;
    }
    .customImage:hover .spanBorder span{
        width: 100%;
    }
}
</style>

