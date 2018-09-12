<template>
    <div class="page-body my-account">
        <page-header class="no-border">
            <span class="font18">我的账号</span>
        </page-header>
        <!-- 主体 -->
        <div class="main-box mt20 pt20" v-loading.lock="fullscreenLoading">
            <!-- 头像信息 -->
            <div class="userinfo font12">
                <div class="user-head pull-left text-center">
                    <avatar-show class="inline-block" :boxSize="86"></avatar-show>
                </div>
                <div class="info">                    
                    <p class="title">
                        <span>欢迎回来，{{userInfo.userName}}</span> 
                    </p>
                    <p class="sub-title">
                        <span class="font12">{{ $t('management.registerTime') }}:</span>
                        <span>{{registerTime|date('YYYY-MM-DD HH:mm:ss')}}</span>
                    </p>
                </div>
            </div>
            <!-- 登录密码 -->
            <zt-card class="mb20 mt15 h100">
                <i slot="icon" class="iconfont icon-denglumima color-pwd-success"></i>
                <template slot="content">
                    <div>
                        <span class="settingTitle">{{ $t('management.loginPwd') }}</span><br>
                        <span class="settingTips ">安全性高的密码可以使账号更安全。建议您顶起更换密码，设置一个包含字母，符号或数字中至少两项且长度超过6位的密码。</span>
                    </div>
                </template>
                <div class="settingRight " slot="right">
                    <div v-if="pwdStatus===true">
                        <i class="iconfont icon-chenggong  color-success"></i>
                        <span class="color-success">{{ $t('management.setting') }}</span>
                        |
                        <a class="color-primary link ml3" @click="$router.push({'name': 'user.PwdReset'})">{{ $t('management.amend') }}</a>

                    </div>
                    <div v-else>
                        <i class="iconfont icon-wuuiconsuotanhao color-warning"></i>
                        <span class="color-warning">{{ $t('management.nobind') }} </span>
                        |
                        <a class="color-primary link ml3" @click="$router.push({'name': 'user.BindMailbox'})">{{ $t('management.bind') }}</a>
                    </div>
                </div>
            </zt-card>
                        
            <!-- 邮箱 -->
            <zt-card class="h100">
                <template slot="icon">
                    <i v-if="email" class="iconfont icon-youxiang color-email-success"></i>
                    <i v-else class="iconfont icon-youxiang color-email"></i>
                </template>
                <template slot="content">
                    <div>
                        <span class="settingTitle">{{ $t('management.emailTitle') }}</span><br>
                        <span class="settingTips "> {{ $t('management.emailTitleContent') }}</span>
                    </div>
                </template>
                <div class="settingRight " slot="right">
                    <div v-if="email">
                        <i class="iconfont icon-chenggong  color-success "></i>
                        <span class="color-success">{{ $t('management.alreadyBind') }}</span>
                        |
                        <a class="color-primary link ml3" @click="$router.push({'name': 'user.changeMailBox'})">{{ $t('management.amend') }}</a>
                    </div>
                    <div v-else>
                        <i class="iconfont icon-wuuiconsuotanhao color-warning"></i>
                        <span class="color-warning">{{ $t('management.nobind') }}</span>
                        |
                        <a class="color-primary link ml3" @click="$router.push({'name': 'user.BindMailbox'})">{{ $t('management.bind') }}</a>
                    </div>
                </div>
            </zt-card>            
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import {getUserDetail, /*updateUserInfoDetail, saveUserInfo*/} from '@/service/user';
//import {API_UserAccount} from '@/constants/apiUrl';
import AvatarShow from '@/components/avatar/AvatarShow';
import ZtCard from '@/components/common/ZtCard';
//import CopyText from '@/components/copy/copyText';
//const env = process.env.NODE_ENV;
//let env_url = env === 'production' ? API_URL : 'http://10.3.123.249:8000';
export default {
    components: {       
        ZtCard,
        AvatarShow,
        //CopyText
    },
    data() {
        return {
            input: '',
            pwdStatus: true,
            email: '',
            authStatus: 0,
            mobileStatus: 1,
            //mobile: '',
            registerTime: '',
            uid: '',
            //file_id: '', // upload返回ID
            dialogVisible: false,
            message:'',
            //copyStyle: true,
            fullscreenLoading: false,
            //uploadAction: env_url + '/' + API_UserAccount.uploadFile
        };
    },
    async created() {
        // this.fullscreenLoading = true;
        // await this.getUserDetail();
        // this.mobile = this.userInfo.mobile || '';
        // console.log(JSON.stringify(this.userInfo));
        // this.email = this.userInfo.email || '';
        // this.authStatus = this.userInfo.authStatus || '';
        // this.mobileStatus = this.userInfo.mobile || '';
        // await this.getUserInfoDetail();
        // this.fullscreenLoading = false;
    },
    computed: {
        ...mapGetters(['userInfo']),
        ...mapGetters('user', ['getAvatarUrl']),
        ...mapState('user', ['photoId', 'datumId'])
    },
    methods: {
        ...mapActions('user', ['getUserInfoDetailFn']),
        //获得用户基本资料详情
        getUserDetail() {
            return getUserDetail({uid: this.userInfo.uid}).then(res => {
                console.log('用户基本资料详情：' + JSON.stringify(res));
                this.registerTime = res.result.createTime;
                this.uid = res.result.uid;
            });
        },
     
        hide() {
            this.dialogVisible = false;
        },

        getUserInfoDetail() {
            this.getUserInfoDetailFn(this.userInfo.uid);
        },
    },
};
</script>
<style  lang='scss'>
.my-account.page-body {
    padding: 0 5px;
    .main-box {
        position: relative;
        // overflow: hidden;
        padding: 3px 5px 0 10px;
        .userinfo {
            height: 105px;
        }
        .info {
            padding-left: 116px;
            p{
                margin: 0px 0px 8px;
                padding-top: 0px;
                &.title {
                    font-size:24px;
                }
                &.sub-title {
                    font-size:12px;
                }
                span:first-child{
                    width: 100%;
                    display: inline-block;
                }
                .iconfont{
                    color: "#898a8a";
                }
            } 
        }
        .icon-denglumima,
        .unsetting {
            color: #f60;
        }
        .icon-wuuiconsuotanhao {
            color: #f00;
        }
        .zt-card{
            padding: 0px 30px 0px 28px;
            dt .iconfont{
                font-size: 36px;
            }
            .ml3{
                margin-left: 3px !important;
            }
        }       
    }
    .el-dialog .el-dialog__body {
        padding-left: 35px;
        padding-right: 31px;
    }
}

.settingTitle {
    margin-left:7px;
    position: relative;
    top: -1px;
    font-size: 14px;
    font-weight: 600;
    color: #666;
}
.settingTips {
    margin-left:7px;
    color: #666;
    position: relative;
    top: 2px;
    font-size: 12px;
}
.settingRight {
    width: 102px;
    margin-right: 42px;
    text-align: left;
    .iconfont {
        position: relative;
        font-size: 12px;
    }
    span {
        margin: 0 4px 0 5px;
        font-size: 12px;
    }
    .el-input {
        width: 300px;
    }
    .el-button {
        height: 40px;
        border-radius: 0px;
        padding: 13px 20px;
    }
}
.link {
    cursor: pointer;
}
.h100{
    height: 100px;
}
.color-phone{
    color: #abd037 !important;
}
.color-email{
    color: rgb(220,220,220);
}


</style>