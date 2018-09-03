<template>
    <div v-loading="searchLoading">
        <page-header class="no-border">
            <span class="font18">{{ $t('account.Auth.title') }}</span>
        </page-header>
        <!-- authType: 1:企业认证； 2：部门认证 -->
        <!-- authStatus： 0：未认证； 1：申请已提交，未审核； 2：审核通过； 3：审核拒绝； 4：审核通过，打款金额 -->
        <div class="page-body"> 
            <!-- 您还未进行实名认证，认证通过后方可申请媒体云资源 -->
            <div v-if="authStatus===0">
                <div class="services-item">                    
                    <div class="content">
                        <div class="pic"> <img src="@/assets/icons/icon_auth_2.png" /></div>
                        <div class="inner">
                            <div>
                                <div class="title img-text-center">
                                    <i class="iconfont icon-kulian color-danger"></i>
                                    {{ $t('account.Auth.overview.status0.title') }}
                                </div>                               
                            </div>
                        </div>
                    </div>
                </div>
                <div class="services-item">
                    <div class="content">
                        <div class="text-center">
                            <div class="zt-button--note">{{ $t('account.Auth.overview.status0.tip')}}</div>
                            <el-button size="small" type="primary" @click="goUrl">{{ $t('account.Auth.overview.btnAuth')}}</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 您的申请已提交，请耐心等待审核... -->
            <div v-else-if="authStatus===1">
                <div class="services-item">                    
                    <div class="content">
                        <div class="pic"> <img src="@/assets/icons/icon_auth_1.png" /></div>
                        <div class="inner">
                            <div>
                                <div class="title img-text-center">
                                    <i class="iconfont icon-overview_operationl color-primary"></i>
                                    {{ $t('account.Auth.overview.status1.title') }}
                                </div>                               
                            </div>
                        </div>
                    </div>
                </div>
                <div class="services-item">
                    <div class="content">
                        <div class="text-center">
                            <div class="zt-button--note">{{ $t('account.Auth.overview.status1.tip')}}</div>
                            <el-button size="small" type="primary">{{ $t('account.Auth.overview.clickHere')}}</el-button>
                        </div>
                    </div>
                </div>
            </div>            

            <!-- 您已通过媒体云实名认证 -->
            <div v-else-if="authStatus===2">
                <div class="services-item">                    
                    <div class="content">
                        <div class="pic"> <img src="@/assets/icons/icon_auth_1.png" /></div>
                        <div class="inner">
                            <div>
                                <div class="title img-text-center">
                                    <i class="iconfont icon-emotion color-success"></i>
                                    {{ $t('account.Auth.overview.status2.title') }}
                                </div>
                                <div class="desc">
                                    <div>{{ $t('account.Auth.overview.comName')}}：{{ userInfo.comName | hiddenStr(3,2)}}</div>
                                    <div v-if="!authInfo.fUid">{{ $t('account.Auth.overview.creditCode')}}：{{ authInfo.companyLicense | hiddenStr(3,3)}}</div>
                                    <div v-else>{{ $t('account.Auth.overview.deptName')}}：{{ authInfo.companyDept}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="services-item">
                    <div class="content">
                        <div class="text-center">
                            <div class="zt-button--note">{{ $t('account.Auth.overview.status2.tip')}}</div>
                            <el-button size="small" type="primary" @click="$router.push({name:'app.ecs.list'})">{{ $t('account.Auth.overview.clickHere')}}</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 审核拒绝； -->
            <div v-else-if="authStatus===3">
                <div class="services-item">                    
                    <div class="content">
                        <div class="pic"> <img src="@/assets/icons/icon_auth_2.png" /></div>
                        <div class="inner">
                            <div>
                                <div class="title img-text-center">
                                    <i class="iconfont icon-kulian color-danger"></i>
                                    {{ $t('account.Auth.overview.status3.title') }}
                                </div>   
                                <div class="desc">
                                    <div>{{ $t('account.Auth.overview.status3.subtitle')}}</div>                                   
                                </div>                            
                            </div>
                        </div>
                    </div>
                </div>
                <div class="services-item">
                    <div class="content">
                        <div class="text-center">
                            <div class="zt-button--note">{{ $t('account.Auth.overview.status3.tip')}}</div>
                            <el-button size="small" type="primary" @click="goUrl">{{ $t('account.Auth.overview.btnRetryAuth')}}</el-button>
                        </div>
                    </div>
                </div>
            </div>        

            <!-- 企业认证：审核通过，确定打款 authStatus===4-->
            <div v-else-if="authStatus===4">
                <div class="services-item">                    
                    <div class="content">
                        <div class="pic"> <img src="@/assets/icons/icon_auth_2.png" /></div>
                        <div class="inner">
                            <!-- 打款输入次数超出允许次数，认证失败 -->
                            <div v-if="authInfo.confirmFailedCnt >= ZT_CONFIG.CONFIRM_MONNEY_FAILED_MAX">
                                <div class="title img-text-center">
                                    <i class="iconfont icon-kulian color-danger"></i>
                                    {{ $t('account.Auth.overview.status4.moneyConfirm.titleFailedCnt') }}
                                </div>   
                                <div class="desc">
                                    <div>{{ $t('account.Auth.overview.status4.moneyConfirm.subtitleFailedCnt')}}</div>                                   
                                </div>                            
                            </div>
                            <!-- 确认打款 --> 
                            <div v-else>                               
                                <div class="title img-text-center">
                                    <i class="iconfont icon-yinxingqia color-danger"></i>
                                    {{ $t('account.Auth.overview.status4.moneyConfirm.title') }}
                                </div>               
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 打款输入次数超出允许次数，认证失败 -->
                <div class="services-item" v-if="authInfo.confirmFailedCnt >= ZT_CONFIG.CONFIRM_MONNEY_FAILED_MAX">
                    <div class="content">
                        <div class="text-center">
                            <div class="zt-button--note">{{ $t('account.Auth.overview.status3.tip')}}</div>
                            <el-button size="small" type="primary" @click="goUrl">{{ $t('account.Auth.overview.btnRetryAuth')}}</el-button>
                        </div>
                    </div>
                </div>
                <!-- 确认打款 -->
                <div class="services-item" v-else>
                    <div class="content">
                        <div>
                            <zt-form size="small" :model="realAuth" style="width:270px;">
                                <zt-form-item class="mb10" v-if="authInfo.confirmFailedCnt > 0">
                                    <el-alert class="h20" type="error" show-icon :title="replaceParamVal($t('account.Auth.overview.status4.moneyConfirm.validator.error'),[ZT_CONFIG.CONFIRM_MONNEY_FAILED_MAX - authInfo.confirmFailedCnt])" :closable="false" size="small">
                                    </el-alert>
                                </zt-form-item>
                                <zt-form-item class="" prop="money">
                                    <zt-input-number type="number" style="width:100%;" v-model="realAuth.money" 
                                    :placeholder="$t('account.Auth.overview.status4.moneyConfirm.placeholder')"
                                    :min="0"
                                    :controls="false"
                                    ></zt-input-number>
                                    <span class="money-unit">{{$t('abbr.rmb')}}</span>
                                    <span class="input-help color-danger">{{ $t('account.Auth.overview.status4.moneyConfirm.subtitle') }}</span>                                    
                                </zt-form-item>
                                <zt-form-item class="text-center mb0">                                    
                                    <el-button type="primary" @click="confirmMoney">{{ $t('common.submit') }}</el-button>
                                </zt-form-item>
                            </zt-form>
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {userAuthMoneyConfirm, getUserAuthInfo} from '@/service/user';
import {replaceParamVal} from '@/utils/utils';
import ZT_CONFIG from '@/constants/config';
import ZtAlert from '@/components/ZTAlert/Index.vue';
import ZtInputNumber from '@/components/ZTInput-number/index.js';
export default {
    components:{
        ZtAlert,
        ZtInputNumber
    },
    data() {
        return {
            ZT_CONFIG,
            replaceParamVal,          
            authInfo: {}, //用户认证详情信息
            searchLoading: false,
            confirmMoneyLoading: false,
            realAuth:{
                money:null
            }
        };
    },
    computed: {
        ...mapGetters(['userInfo', 'token']),
        authStatus: function() {
            return this.userInfo.authStatus;
        }
    },
    created() {
        this.getUserAuthInfo();
    },
    methods: {
        //查用户认证详情
        getUserAuthInfo() {
            this.searchLoading = true;
            getUserAuthInfo(this.userInfo.uid)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.searchLoading = false;
                        this.authInfo = res.result || {confirmMoney: 0, confirmFailedCnt: 0};
                    }
                })
                .catch(error => {
                    this.searchLoading = false;
                    this.$message.error(this.$t('exception.server'));
                });
        },

        //确定金额
        confirmMoney() {
            if(this.authStatus !== 4) return;
            if (this.authInfo.confirmFailedCnt < ZT_CONFIG.CONFIRM_MONNEY_FAILED_MAX) {
                if(this.realAuth.money) {//非空 或者 非零数
                    if(this.realAuth.money < ZT_CONFIG.CONFIRM_MONNEY_MIN) return;
                }else {//为空或者0
                    return;
                }
                this.confirmMoneyLoading = true;
                userAuthMoneyConfirm({money: this.realAuth.money})
                    .then(res => {
                        this.confirmMoneyLoading = false;
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            //this.$message.success($t('account.Auth.overview.status4.moneyConfirm.tipSuccess'));
                            let usrinfo = Object.assign({}, this.userInfo);
                            usrinfo.authStatus = 2;
                            this.$store.commit('user/SET_USERINFO', usrinfo);
                        } else {                            
                        }
                        this.getUserAuthInfo();
                    })
                    .catch(error => {
                        this.confirmMoneyLoading = false;
                        //this.$message.error(this.$t('exception.server'));
                    });
            } else {
            }
        },

        goUrl() {
            // if (this.authInfo && this.authInfo.fUid) {
            //     //部门认证
            //     let {fUid, companyName} = this.authInfo;
            //     this.$router.push({name: 'auth.departAuth', params: {id: fUid, item: {uid: fUid, companyName}}});
            // } else {
            //     //企业认证
            //     this.$router.push({name: 'user.auth.companyAuth'});
            // }
            this.$router.push({name: 'user.auth.companyAuth'});
        }
    }
};
</script>
<style scoped lang='scss'>

.mb0 {
    margin-bottom: 0;
}
.wd100 {
    width: 100px;
}



.page-body {
    padding-top: 0px;
    
    .services-item {
        border: 1px solid #d1d5de;
        margin-bottom: 10px;
        display: flex;
        height: 200px;
        align-items: center;
        .content {
            // width:283px;
            margin: auto;
            display: flex;
            .h20{
                height:20px;
            }
            
            .pic {
                width: 200px;
                height: 180px;
                line-height: 180px;
                background: #fbfbfb;
                border-radius: 2px;
                text-align: center;
            }
            .inner {
                display: flex;
                flex: 1;
                margin-left: 20px;
                align-items: center;

                .title {
                    .iconfont {
                        font-size: 30px;
                    }
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 48px;
                    color: #333;
                }
                .desc {
                    padding-left: 40px;
                    font-size: 12px;
                    line-height: 18px;
                    color: #333;
                }
            }
            .zt-button--note {
                font-size: 14px;
                margin-bottom:14px;               
                color: #333;
            }
            .el-button--primary {
                width: 200px;
            }
            span.money-unit{
                position:absolute;
                font-size:12px;
                color:#333;
                right:-18px;
            }
        }
        &:hover {
            box-shadow: 0 0 10px 0 rgba(80, 90, 109, 0.16);
        }
        &:last-child {
            margin-bottom: 0px;
        }
    }
}
</style>
