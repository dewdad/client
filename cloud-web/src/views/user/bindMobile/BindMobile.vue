<template>
    <div class="pull-page-main bindMoblie">
        <single-header :title="title[isCheckedMobile]"></single-header>
        <div class='pull-page-body'>
            <div class ="text-c font18 is-bold mb50" v-if="isCheckedMobile !== 0 && isCheckedMobile !== 1" >{{$t('bindMobile.bindFinish')}}</div> 
            <!-- 步骤条 -->
            <el-steps :active="phoneActive" align-center class="font12">
                <el-step :title="$t('bindMobile.identityVerify')"></el-step>
                <el-step :title="$t('bindMobile.amendPhone')"></el-step>
                <el-step :title="$t('bindMobile.finish')"></el-step>
            </el-steps>
            <el-row>
                <el-col :span='24'>
                    <div class="fixed-form-box">
                        <!-- 第一步 验证身份 -->
                        <validate-mobile class="mt30" v-if="isCheckedMobile === 0" :btn-text="$t('common.next')" @success="checkOldMobileCode"></validate-mobile>

                        <!-- 修改手机 -->
                        <div v-else-if="isCheckedMobile===1">
                            <zt-form :model="user" class="show-icon" ref="newMobieValidateForm" :rules="rules" inline-message key='1'>
                                <zt-form-item class="font14 mt20" prop="newMobile">
                                    <el-input :placeholder="$t('form.input.newMobile')" clearable maxlength="11" v-model="user.newMobile"></el-input>
                                </zt-form-item>
                                <zt-form-item prop="newMobileCode" class=" mt20" :error="errorMsg">
                                    <el-input clearable v-model="user.newMobileCode" maxlength="6" class="mobiecodeInput" :placeholder="$t('form.input.mobileCode')"></el-input>
                                    <mobile-code height="40px" width="220px" btn-type="default" :btn-text="$t('form.btn.sendMobileCode')" :beforeSend="beforeValidateCode" :code-type="RESET_PHONE_CODE" :mobile="user.newMobile"></mobile-code>
                                </zt-form-item>
                                <el-button type="warning" @click="checkNewMobileCode">{{$t('common.next')}}</el-button>
                            </zt-form>
                        </div>
                        <!-- 完成 -->
                        <div v-else class="text-c">
                            <el-button tag="button" @click="logOut" class="el-button el-button--primary  bind-success">{{$t('common.ok')}}</el-button>
                            <div class="mt5 color999">
                                <span class="color-primary">{{jumpTimeVal}}S</span></div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <single-footer></single-footer>
    </div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import MobileCode from '@/components/common/MobileCode';
import ValidateMobile from '@/components/validate/Mobile';
import {bindMobile} from '@/service/user.js';
import {checkMobileCode} from '@/service/mobile';
import {mapGetters} from 'vuex';
import {RESET_PHONE_CODE} from '@/constants/const';
import {checkMobileExist} from '@/service/register';
import {MOBILE_REGEXP} from '@/constants/regexp.js';
let jumpTime = null;
export default {
    name: 'app',
    data() {
        // 验证手机号码是否注册
        const validateNewMobile = async (rule, value, callback) => {
            if (value === '') {
                callback();
                this.mobileIsError = true;
            } else {
                let result = await checkMobileExist(value).catch(() => {
                    callback(new Error(this.$t('exception.server')));
                });
                if (!result) {
                    this.mobileIsError = true;
                    callback(new Error(this.$t('register.mobileIsRegisted')));
                } else {
                    this.mobileIsError = false;
                    callback();
                }
            }
        };
        const validateNewMobileCode = async (rule, value, callback) => {
            if (value === '') {
                // callback(new Error(this.$t('register.mobileCodeIsEmpty')));
            } else {
                let result = await checkMobileCode(this.user.newMobile, value, RESET_PHONE_CODE).catch(() => {
                    callback(new Error(this.$t('exception.server')));
                });
                if (result.code !== '0000') {
                    callback(new Error(result.msg || this.$t('register.mobileCodeIsError')));
                }
                callback();
            }
        };
        return {
            title: [this.$t('bindMobile.identityVerify'), this.$t('bindMobile.amendPhone'), this.$t('bindMobile.finish')],
            RESET_PHONE_CODE,
            isCheckedMobile: 0,
            mobileIsError: true,
            jumpTimeVal: 5,
            user: {
                oldMobile: '',
                newMobile: '',
                oldMobileCode: '',
                newMobileCode: ''
            },
            rules: {
                newMobileCode: [
                    {
                        required: true,
                        message: this.$t('register.mobileCodeIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        min: 5,
                        max: 6,
                        message: this.$t('register.mobileCodeIsError'),
                        trigger: 'blur'
                    },
                    {validator: validateNewMobileCode, trigger: 'blur'}
                ],
                newMobile: [
                    {
                        required: true,
                        message: this.$t('register.mobileIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        pattern: MOBILE_REGEXP,
                        message: this.$t('register.mobileIsError'),
                        trigger: ['blur']
                    },
                    {validator: validateNewMobile, trigger: 'blur'}
                ]
            },
            errorMsg: ''
        };
    },
    computed: {
        ...mapGetters(['userInfo', 'token']),
        phoneActive() {
            if (this.isCheckedMobile === 0) {
                return 0;
            } else if (this.isCheckedMobile === 1) {
                return 1;
            } else {
                return 3;
            }
        }
    },
    watch: {
        jumpTimeVal(val) {
            if (val === 0) {
                clearInterval(jumpTime);
                this.$router.push({name: 'accountMg.SecutitySet'});
            }
        }
    },
    destroyed() {
        this.jumpTimeVal = 5;
        clearInterval(jumpTime);
    },
    created() {
        this.user.oldMobile = this.userInfo.mobile;
    },
    methods: {
        logOut() {
            // this.$store.dispatch('LOGOUT');
            this.$router.push({name: 'accountMg.SecutitySet'});
        },
        // 修改绑定新手机
        checkNewMobileCode() {
            this.$refs['newMobieValidateForm'].validate(valid => {
                if (valid) {
                    this.errorMsg = '';
                    if (this.user.newMobileCode !== '') {
                        bindMobile(this.user)
                            .then(result => {
                                if (result.code === '0000') {
                                    this.isCheckedMobile = 2;
                                    this.userInfo.mobile = this.user.newMobile;
                                    this.$store.commit('user/SET_USERINFO', this.userInfo);
                                    jumpTime = setInterval(() => {
                                        this.jumpTimeVal--;
                                    }, 1000);
                                } else {
                                    // this.$message.error(result.msg);
                                    this.errorMsg = result.msg;
                                }
                            })
                            .catch(() => {
                                // 显示异常
                                this.$message.error(this.$t('exception.server'));
                            });
                    }
                } else {
                    return false;
                }
            });
        },
        // 验证旧绑定手机
        checkOldMobileCode(params) {
            console.warn(params);
            this.isCheckedMobile = 1;
        },
        // 发送验证码之前钩子行数
        beforeValidateCode() {
            return new Promise((resolve, reject) => {
                this.$refs['newMobieValidateForm'].clearValidate(['newMobileCode']);
                this.$refs['newMobieValidateForm'].validateField('newMobile', async err => {
                    if (err) {
                        console.warn(err);
                        reject(new Error('手机号码验证失败'));
                    } else {
                        $log('手机号码格式验证成功，验证手机是否注册。');
                        resolve();
                    }
                });
            });
        }
    },
    components: {
        SingleHeader,
        SingleFooter,
        MobileCode,
        ValidateMobile
    }
};
</script>
<style lang='scss'>
.bindMoblie {
    .bindSuccess {
        font-size: 18px;
        color: #333;
        text-align: center;
        .el-icon-success {
            padding-right: 5px;
        }
    }
    .phoneTitle {
        width: 450px;
        margin: auto;
    }
    .el-input {
        position: relative;
        font-size: 14px;
        display: inline-block;
    }
    .el-button {
        width: 450px;
    }
    .bind-success {
        width: 450px;
        margin-top: 30px;
    }
    div.mobiecodeInput {
        width: 220px;
    }
    .fixed-form-box{
        width: 450px;
    }
}
</style>