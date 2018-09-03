<template>
    <div class="page-body securitySet">
        <page-header class="no-border">
            <span class="font18">{{ $t('management.securitySet') }}</span>
        </page-header>
        <!-- 主体 -->
        <div class="main-box mt20 pt20" v-loading.lock="fullscreenLoading">
            <!-- 头像信息 -->
            <div class="userinfo font12">
                <div class="user-head pull-left text-center">
                    <avatar-show :boxSize="72" :avatarUrl="getAvatarUrl"></avatar-show>
                    <a @click="dialogVisible = true" class="inline-block mt10 color-primary link lh15 font12" size="small">{{ $t('management.avatar') }}</a>
                </div>
                <div class="info">
                    <p>
                        <span class="color-secondary">{{ $t('management.userId') }}:</span>
                        <span id="userId" class="mr5" :v-model="uid">{{uid}}</span>
                        <copy-text :bindText="uid"></copy-text>
                        <!-- <i class="iconfont icon-niantie font14 finger-cursor" :class="{'color-secondary': copyStyle}" @mousedown="mousedownFn" @mouseup="mouseupFn" v-clipboard:copy="uid"></i> -->
                    </p>
                    <p>
                        <span class="color-secondary">{{ $t('management.loginAccount') }}:</span>
                        <span class="mr10">{{userInfo.userName}}</span>
                        <span v-if="!authStatus">(
                            <span class="color-warning" style="width: 50px;">{{ $t('management.noAuthentication') }},</span>
                            <router-link class="font12" :to="{name: 'user.auth.companyAuth'}">{{ $t('management.nameAuthentication') }}</router-link> )
                        </span>
                    </p>
                    <p>
                        <span class="color-secondary">{{ $t('management.registerTime') }}:</span>
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
                        <span class="settingTips ">{{ $t('management.loginPwdContent') }}</span>
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
            <!-- 手机绑定 -->
            <zt-card class="mb20 h100">
                <i slot="icon" class="iconfont icon-shoujibangding color-phone"></i>
                <template slot="content">
                    <div>
                        <span class="settingTitle">{{ $t('management.bindPhone') }}</span><br>
                        <span class="settingTips "> {{ $t('management.bindPhoneContentFront') }}
                            <span class="color-success">{{mobile|mobileReplace}}</span> {{ $t('management.bindPhoneContentAfter') }}。</span>
                    </div>
                </template>
                <div class="settingRight " slot="right">
                    <div v-if="mobileStatus">
                        <i class="iconfont icon-chenggong  color-success "></i>
                        <span class="color-success">{{ $t('management.setting') }}</span>
                        |
                        <a class="color-primary link ml3" @click="$router.push({'name': 'user.bindmobile'})">{{ $t('management.amend') }}</a>
                    </div>
                    <div v-else>
                        <i class="iconfont icon-wuuiconsuotanhao color-warning"></i>
                        <span class="color-warning">{{ $t('management.nobind') }}</span>
                        |
                        <a class="color-primary link ml3" @click="$router.push({'name': 'user.BindMailbox'})"> {{ $t('management.bind') }} </a>
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
            <!-- 头像上传弹窗 -->
            <el-dialog :title="$t('management.avatar')" :visible.sync="dialogVisible" width="600px">
                <div class="font14 lh32 mb10">{{ $t('management.avatarUpload') }}</div>
                <div class="font12 mb5">{{ $t('management.uploadTips') }}</div>
                <avatar-upload :uploadAction="uploadAction" :dialogVisible="dialogVisible" @getPhotoId="getPhotoId"></avatar-upload>
                <div class="mb20"></div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="samll" :disabled="!file_id" @click="confirmUpload">{{ $t('common.ok') }}</el-button>
                    <el-button type="info" size="samll" @click="cancelUpload">{{ $t('common.cancel') }}</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import {getUserDetail, updateUserInfoDetail, saveUserInfo} from '@/service/user';
import {API_UserAccount} from '@/constants/apiUrl';

import AvatarUpload from '@/components/upload/AvatarUpload';
import AvatarShow from '@/components/avatar/AvatarShow';
import ZtCard from '@/components/common/ZtCard';
import CopyText from '@/components/copy/copyText';
const env = process.env.NODE_ENV;
let env_url = env === 'production' ? API_URL : 'http://10.3.123.249:8000';
export default {
    data() {
        return {
            input: '',
            pwdStatus: true,
            email: '',
            authStatus: 0,
            mobileStatus: 1,
            mobile: '',
            registerTime: '',
            uid: '',
            file_id: '', // upload返回ID
            dialogVisible: false,
            message:'',
            copyStyle: true,
            fullscreenLoading: false,
            uploadAction: env_url + '/' + API_UserAccount.uploadFile
        };
    },
    async created() {
        this.fullscreenLoading = true;
        await this.getUserDetail();
        this.mobile = this.userInfo.mobile || '';
        console.log(JSON.stringify(this.userInfo));
        this.email = this.userInfo.email || '';
        this.authStatus = this.userInfo.authStatus || '';
        this.mobileStatus = this.userInfo.mobile || '';
        await this.getUserInfoDetail();
        this.fullscreenLoading = false;
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
        // 获取上传完成成功后的信息
        getPhotoId(fileData) {
            $log('获取上传信息', fileData);
            this.file_id = fileData.response.result;
        },
        hide() {
            this.dialogVisible = false;
        },
        // 确认上传
        confirmUpload() {
            if (!this.file_id) {
                return;
            }
            let params = {
                id: this.datumId,
                photoId: this.file_id
            };
            let saveUserInfoFn = saveUserInfo;
            if (this.datumId) {
                saveUserInfoFn = updateUserInfoDetail;
            }
            saveUserInfoFn(params)
                .then(result => {
                    if (result.code === '0000') {
                        console.log(JSON.stringify(result));
                        this.getUserInfoDetail();
                        this.hide();
                    } else {
                        this.$message.error(result.msg);
                    }
                })
                .catch(() => {
                    // 显示异常
                    this.$message.error(this.$t('exception.server'));
                });
        },
        // 取消上传
        cancelUpload() {
            this.hide();
        },
        getUserInfoDetail() {
            this.getUserInfoDetailFn(this.userInfo.uid);
        },
        mousedownFn() {
            this.copyStyle = false;
        },
        mouseupFn() {
            this.copyStyle = true;
        }
    },
    watch: {
        dialogVisible(val) {
            if (!val) {
                this.file_id = '';
            }
        }
    },
    components: {
        AvatarUpload,
        AvatarShow,
        ZtCard,
        CopyText
    }
};
</script>
<style  lang='scss'>
.securitySet.page-body {
    padding: 0 5px;
    .main-box {
        position: relative;
        // overflow: hidden;
        padding: 3px 5px 0 10px;
        .userinfo {
            height: 105px;
        }
        .info {
            padding-left: 92px;
            p{
                margin: 0px 0px 8px;
                padding-top: 0px;
                span:first-child{
                    width: 60px;
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

        input[type='file'] {
            display: none;
        }
        .el-upload-list__item {
            display: none;
        }
        .imgProgress {
            width: 265px;
            height: 20px;
        }
        .el-progress-bar__inner {
            transition: all 0.5s;
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