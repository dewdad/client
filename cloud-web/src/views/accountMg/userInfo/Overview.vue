<template>
    <div class="page-body user-info">
        <div>
            <div class="title"></div>
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 头像信息 -->
                    <div class="user-info__header modular mb20" >
                        <img src="@/assets/images/my-bg.svg">
                        <div class="text-c user-info__header__img">
                            <img src="@/assets/images/header-tenant.svg" width="124">
                        </div>
                        <div class="text-c font24">{{userDetailInfo && userDetailInfo.name}}</div>
                        <div class="text-c mt20"><span class="color-secondary">用户ID：</span>{{userDetailInfo.id}}</div>
                    </div>
                    <!-- 个人基本信息 -->
                    <div class="user-info__personal modular">
                        <ul>
                            <li >
                               <i class="iconfont icon-bumen-wodezhanghao"></i> 
                               <span class="font12 title color-secondary ml10">部门名称：</span>
                               <span class="font12 ml10">{{projectTableData[0] && projectTableData[0].name}}</span>
                            </li>
                            <li >
                               <i class="iconfont icon-bumenID-wodezhanghao"></i> 
                               <span class="font12 title color-secondary ml10">部门ID：</span>
                               <span class="font12  ml10">{{userDetailInfo && userDetailInfo.deptId}}</span>
                            </li>
                            <li >
                               <i class="iconfont icon-jiaosemingcheng-wodezhanghao"></i> 
                               <span class="font12 title color-secondary ml10">角色名称：</span>
                               <span class="font12 ml10">{{userDetailInfo.roleName}}</span>
                            </li>
                            <li >
                               <i class="iconfont icon-zuhu-wodezhanghao"></i> 
                               <span class="font12 title color-secondary ml10">角色类型：</span>
                               <span class="font12 ml10">{{userDetailInfo.roleType | showTextByKey(DICT_USER.ROLE_TYPE,'roleType','roleName') }}</span>
                            </li>
                            <li >
                               <i class="iconfont icon-chuangjianshijian-wodezhanghao"></i> 
                               <span class="font12 title color-secondary ml10">创建时间：</span>
                               <span class="font12 ml10">{{userInfo.createTime | date}}</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="16">
                    <!-- 登录密码 -->
                    <div class="user-info__password modular mb20">
                        <zt-card class="h100">
                            <i slot="icon" class="iconfont icon-denglumima color-pwd-success"></i>
                            <template slot="content">
                                <div>
                                    <span class="settingTitle">{{ $t('management.loginPwd') }}</span><br>
                                    <span class="settingTips font12 color-secondary">安全性高的密码可以使账号更安全。建议您设置一个同时包含数字，字母，特殊符号且长度超过8位的密码。</span>
                                </div>
                            </template>
                            <div class="settingRight " slot="right">
                                <div>
                                    <i class="iconfont icon-chenggong  color-success mr10"></i>
                                    <span class="color-success mr10">{{ $t('management.setting') }}</span>
                                    |
                                    <a class="color-primary link ml10 font12" @click="changePwd">{{ $t('management.amend') }}</a>
                                </div>
                            </div>
                        </zt-card>
                    </div>
                    <!-- 邮箱 -->
                    <div class="user-info__email modular mb20">
                        <zt-card class="h100">
                            <template slot="icon">
                                <i v-if="userInfo.email" class="iconfont icon-youxiang color-success"></i>
                                <i v-else class="iconfont icon-youxiang color-email"></i>
                            </template>
                            <template slot="content">
                                <div>
                                    <span class="settingTitle">{{ $t('management.emailTitle') }}</span><br>
                                    <span class="settingTips font12 color-secondary"> {{ $t('management.emailTitleContent') }}</span>
                                </div>
                            </template>
                            <div class="settingRight " slot="right">
                                <div v-if="userInfo.email">
                                    <i class="iconfont icon-chenggong  color-success mr10"></i>
                                    <span class="color-success mr10">{{ $t('management.alreadyBind') }}</span>
                                    |
                                    <a class="color-primary link ml10" @click="changeEmail">{{ $t('management.amend') }}</a>
                                </div>
                                <div v-else>
                                    <i class="iconfont icon-wuuiconsuotanhao color-warning mr10"></i>
                                    <span class="color-warning mr10" >{{ $t('management.nobind') }}</span>
                                    |
                                    <a class="color-primary link ml10 font12" @click="changeEmail">{{ $t('management.bind') }}</a>
                                </div>
                            </div>
                        </zt-card>
                    </div>
                    <!--  -->
                    <div class="user-info__tenant modular" >
                        <div class="font16 mb20">租户信息</div>
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
                        <!--  -->
                        <div class="pagination">
                            <el-pagination background  class="text-r"
                            @size-change="handleSizeChange" 
                            :current-page.sync="searchObj.paging.pageIndex" 
                            @current-change="handleCurrentChange" 
                            :page-sizes="[3]" 
                            :page-size="searchObj.paging.limit" 
                            layout="sizes,total,prev, pager, next" 
                            :total="searchObj.paging.totalItems">
                            </el-pagination>
                        </div> 
                    </div>
                </el-col>
            </el-row>
            <!-- 修改密码 -->
            <change-pwd-dialog ref="changePwdDialog" />
            <!-- 绑定或修改邮箱 -->
            <change-email-dialog ref="changeEmailDialog" />
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { getUserDetail,getProjectByUserId } from '@/service/user';
import ChangePwdDialog from '@/components/dialog/ChangePwdDialog';
import ChangeEmailDialog from '@/components/dialog/ChangeEmailDialog';
import { DICT_USER } from '@/constants/dicts/user';
import ZtCard from '@/components/common/ZtCard';
export default {   
    components: {
        ChangePwdDialog,
        ChangeEmailDialog,
        ZtCard     
    },
    data() {   
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 3,
                totalItems: 0
            },            
        };   
        return {
            searchObj,
            DICT_USER,
            fullscreenLoading: false,
            userDetailInfo:{}, 
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
            getUserDetail({uid: this.userInfo.id})
                .then( res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        $log(res); 
                        this.userDetailInfo = res.data;
                    }else {
                        $log('getUserDetail数据获取失败');
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
                    this.$message.success($t('common.successOpt'));   
                    this.getUserInfoDetail();                 
                });
        },

        // 绑定邮箱或修改邮箱
        changeEmail(){
            this.$refs.changeEmailDialog
                .show()
                .then( res => {
                    this.$message.success($t('common.successOpt'));   
                    this.getUserInfoDetail();                 
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
    &__header{
        height: 316px;
        &__img{
            position: relative;
            top: -26px;
        }
    }
    &__password{
        height: 90px;
        padding-top: 20px;
    }
    &__email{
        height: 90px;
        padding-top: 20px;
    }
    &__personal{
        min-height: 208px;
        padding: 30px;
        ul{
            padding-left:30px;
            li{
                margin-bottom: 9px;
                span{
                    display: inline-block;
                }
                .title{
                    width: 60px;
                }
                i{
                    color: #94a8c9;
                }
            }
        }
    }
    &__tenant{
        min-height: 324px;
        padding: 20px 30px;
        .el-table {
            max-height: 190px;
        }
    }
    .modular{
        background: #fff;
    }
    .zt-card{
        padding: 0 30px;
        margin: 0;
        border: 0 !important;
        &:hover{
            box-shadow: none;
        }
    }
    .color-email{
        color: #8ea4d1;
    }
}
</style>
