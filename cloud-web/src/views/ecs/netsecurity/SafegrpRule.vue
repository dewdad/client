<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            <img src="@/assets/images/ecs/group_icon.svg" width="50" alt=""> {{get(currentSafeGroup, 'name')}}
            <div slot="right">
                <el-button @click="addrule(direction, ruleId)" type="primary" size="small">添加规则</el-button>                
                <el-button type="info" size="small" @click="getGroupRuleListFn">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 切换展示条件 -->
        <el-tabs v-model="direction">
            <el-tab-pane label="入方向" name="ingress"></el-tab-pane>
            <el-tab-pane label="出方向" name="egress"></el-tab-pane>
        </el-tabs>
        <!-- 列表 -->
            <zt-table :loading="loading"  :data="tableData" :search="false"  @search="getGroupRuleListFn" :paging="searchObj.paging">
                    <!-- 协议类型 -->
                    <el-table-column prop="protocol" label="协议类型"></el-table-column>
                    <!-- 端口范围 -->
                    <el-table-column prop="protocol" label="端口范围">
                        <template slot-scope="scope">
                            {{scope.row.port_range_min}} - {{scope.row.port_range_max}}
                            </template>
                    </el-table-column>
                    <!-- 授权类型 -->
                    <el-table-column prop="ethertype" label="授权类型"></el-table-column>
                <!-- 操作 -->
                    <el-table-column label="操作" width="150" key="op" class-name="option-column">
                        <template slot-scope="scope">
                            <span @click="deleteExample(scope.row.id)" class="btn-linker" >删除</span>
                        </template>
                    </el-table-column>
            </zt-table>

        <amend-describe ref="AmendDescribe"/>
        <!-- 对话框 增加组件 -->
        <add-rules ref="AddRules"/>
    </div>
</template>
<script>
import AmendDescribe from './dialog/AmendDescribe';
import AddRules from './dialog/AddRules';

import { getGroupRuleList, getSecurityGroupList, deleteGroupRuleList } from '@/service/ecs/security.js';


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
            loading: false,
            imgType: 1,
            tableData: [],
            direction: 'ingress',
            searchObj,
            ruleId: this.$route.params.ruleId,
            currentSafeGroup: ''
        };
    },
    watch: {
        direction (val) {
            this.getGroupRuleListFn();
        }
    },
    components: {
        AmendDescribe,
        AddRules
    },
    created() {
        this.getGroupDetial();
        this.getGroupRuleListFn();
    },
    methods: {
        // 删除
        deleteExample(id) {
            this.$messageBox.confirm(`您确定要删除该规则吗?`, '删除', {
                alertMessage: '删除操作无法恢复，请谨慎操作',
                subMessage: id,
                type: 'warning'
            }).then(() => {
                deleteGroupRuleList(id).then(res => {
                    if (res.code === '0000') {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getGroupRuleListFn(); 
                    }
                });
            }).catch(() => {     
            });
        },
        // 增加规则
        addrule(direction, groupId) {
            this.$refs.AddRules
                .show(direction, groupId)
                .then( ret => {   
                    this.getGroupRuleListFn();        
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                }); 
        },
        // 获得安全组详情
        getGroupDetial() {
            let params = {
                ...this.searchObj.paging,
                id: this.ruleId
            };
            getSecurityGroupList(params)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.log('getKeypairList', res);
                        let resData = res.data;
                        if (resData && resData.data.length) {
                            this.currentSafeGroup = resData.data[0];
                        } else {
                            this.$message.error('安全组不存在');
                        }
                    }
                })
                .catch(err => {
                    $log(err);
                });
        },
        // 获得安全组规则列表
        getGroupRuleListFn(params) {
            let post = {
                ...this.searchObj.paging
            };
            params = params || post;
            console.warn(params);
            params['direction'] = this.direction;
            params['groupId'] = this.ruleId;
            this.loading = true;
            getGroupRuleList({...params}).then( (res) => {
                if(res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getKeypairList',res);  
                    let resData = res.data;
                    if(resData && resData.data){
                        this.tableData = resData.data || []; 
                        this.searchObj.paging.totalItems = resData.total || 0;
                        console.log('getKeypairList tableData',this.tableData); 
                    }                           
                }

            }).catch(err => {
                $log(err);
            }).finally(() => {
                this.loading = false;
            });
        }
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

