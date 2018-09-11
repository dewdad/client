<template>
    <div class="page-body user-info">
        <!-- <page-header class="no-border"> -->
        <page-header>
            <span class="font18">{{ $t('basicInfo.basicInfo') }}</span>
        </page-header>
        <div class="userInfo">
            <zt-form ref="userInfo" v-loading.lock="fullscreenLoading" size="small" label-width="102px" :rules="rules" inline-message>                
                <zt-form-item label="用户名：" class="mt20">
                   <span>{{userDetailInfo.name}}</span>
                </zt-form-item>

                <zt-form-item label="用户ID：" >
                   <span>{{userDetailInfo.id}}</span>
                </zt-form-item>

                <zt-form-item label="租户名称：" >
                   <span>{{userDetailInfo.name}}</span>
                </zt-form-item>

                <zt-form-item label="租户ID：" >
                   <span>{{userDetailInfo.projectId || '--'}}</span>
                </zt-form-item>

                <zt-form-item label="部门名称：" >
                   <span>{{userDetailInfo.deptId}}</span>
                </zt-form-item>

                <zt-form-item label="邮箱：" >
                    <span class="wd200 inline-block">{{userDetailInfo.email  || '--'}}</span>
                </zt-form-item>

                <zt-form-item label="密码：" >                   
                   <span class="wd200 inline-block">{{ userDetailInfo.password ? '******' : '--' }}</span>
                   <a class="pl20" @click="changePwd">修改</a>
                </zt-form-item>

                <zt-form-item label="描述：" >                   
                   <span class="wd200 inline-block">{{userDetailInfo.description  || '--'}}</span>
                </zt-form-item>

                <zt-form-item label="角色：" >
                   <el-table :data="roleTableData" row-class-name="data-list" header-row-class-name="data-list" border class="data-list">
                        <el-table-column label="角色名称" width="318">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.roleName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="角色类型" width="318">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.roleType}}</span>
                            </template>
                        </el-table-column>                       
                        <el-table-column label="描述">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.roleDescription}}</span>
                            </template>
                        </el-table-column>                    
                    </el-table>
                </zt-form-item>

                <zt-form-item label="Project：" >
                   <el-table :data="projectTableData" row-class-name="data-list" header-row-class-name="data-list" border class="data-list">
                        <el-table-column prop="title" label="名称" width="318">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="ID" width="318">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.id}}</span>
                            </template>
                        </el-table-column>                                               
                        <el-table-column label="描述">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.description}}</span>
                            </template>
                        </el-table-column>                    
                    </el-table>
                    <div class="pagination">
                        <el-pagination background  class="text-left"
                        @size-change="handleSizeChange" 
                        :current-page.sync="searchObj.paging.pageIndex" 
                        @current-change="handleCurrentChange" 
                        :page-sizes="[10, 20, 50, 100]" 
                        :page-size="searchObj.paging.limit" 
                        layout="sizes,total,prev, pager, next" 
                        :total="searchObj.paging.totalItems">
                        </el-pagination>
                    </div>
                </zt-form-item>
                
            </zt-form>
        </div>

        <!-- 修改密码 -->
        <change-pwd-dialog ref="changePwdDialog" />
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { getUserInfoDetail,getProjectByUserId } from '@/service/user';
import ChangePwdDialog from '@/components/dialog/ChangePwdDialog';
export default {   
    components: {
        ChangePwdDialog,       
    },
    data() {   
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },            
        };   
        return {
            searchObj,
            fullscreenLoading: false,
            userDetailInfo:{
                isEditEmail: false,
                isEditPwd: false,
                isEditDesc: false
            }, 
            roleTableData: [],            
            projectTableData:[],          
            rules: {                
            },         
        };
    },
    created() {
        this.getUserInfoDetail(); 
        this.getProjectByUserId();      
    },
    computed: {
        ...mapGetters(['userInfo']),        
    },
    methods: {
        // 获取基本资料详情
        getUserInfoDetail() {
            // this.fullscreenLoading = true;
            getUserInfoDetail({uid: this.userInfo.id})
                .then( res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        $log(res); 
                        Object.assign(this.userDetailInfo,res.data || { }); 

                        let {id,roleId, roleName,roleType,roleDescription } = this.userDetailInfo;
                        this.roleTableData = [ {id,roleId, roleName,roleType,roleDescription }]; 
                    }else {

                    }                                
                })
                .catch(err => {                    
                    $log(err);
                });
        }, 

        getProjectByUserId(){    
            let { pageIndex,limit } = this.searchObj.paging;
            let data = {
                pageIndex,
                limit,
                userId: this.userInfo.id,
            };       
            getProjectByUserId(data)
                .then( res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        $log(res); 
                        let resData = res.data;
                        if(resData && resData.data){
                            this.projectTableData = resData.data || [];
                            this.searchObj.paging.totalItems = resData.total;
                        }     
                    }else {
                        $log(res.msg);
                    }
                })
                .catch(err => {                    
                    $log(err);
                });
        },

        //修改密码
        changePwd(){
            this.$refs.changePwdDialog
                .show()
                .then( res => {
                    
                });
        },

        handleSizeChange: function(params) {
            console.log('params:', params);
            this.searchObj.paging.limit = params;
            this.searchObj.paging.pageIndex = 1; 
            this.getProjectByUserId();      
        },

        handleCurrentChange: function(params) {
            console.log('handleCurrentChange:', params);     
            this.getProjectByUserId();     
        },
    },    
};
</script>
<style  lang='scss'>
.user-info {
    .el-form .el-form-item {
        margin-bottom: 10px;
    }
    .wd200 {
        width: 200px;
    }
}
</style>
