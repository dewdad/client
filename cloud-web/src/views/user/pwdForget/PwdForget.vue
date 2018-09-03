<template>
    <div class='pull-page-main '>
        <single-header :title='title'></single-header>
        <div class='pull-page-body pwd-page '>
            <div v-if="active===0"  class=' text-center'>
                <span  class='font16'>{{$t("account.pwdManage.step1Tips")}} </span>
            </div>
            <div v-else-if="active===1"  class=' text-center' >
                <span  class='font16'>{{$t("account.pwdManage.step2Tips")}}</span>
            </div>
            <div v-else-if="active===2"  class=' text-center' >
                <span  class='font16'>{{$t("account.pwdManage.step3Tips")}}</span>
            </div>
            <div class="mt30">
                <el-steps :active='active' align-center class="font12">
                    <el-step :title='$t("account.pwdManage.step1")'></el-step>
                    <el-step :title='$t("account.pwdManage.pwdForget.step2")'></el-step>
                    <el-step :title='$t("account.pwdManage.step3")'></el-step>
                </el-steps>
            </div>
            <div class='fixed-form-box'>
                <el-row>
                    <el-col :span='24'>
                        <zt-form ref='pwdforgetFormStep1' class="show-icon" :model='user' label-width='0px' :rules='rules' inline-message>
                            <div v-show='active===0'>
                                <zt-form-item id='mobile' prop='mobile'>
                                    <el-input v-model='user.mobile' :clearable="true" :maxlength="11" :placeholder='$t("form.input.mobile")'  auto-complete="on">
                                    </el-input>
                                </zt-form-item>
                                <zt-form-item id="imageCode" prop="imageCode.code" :error="imgCodeErrorMessage">
                                    <image-code-input ref="imageCode.code"   :icon="false" v-model.trim='user.imageCode' :placeholder='$t("form.input.imageCode")'></image-code-input>
                                </zt-form-item>
                                <zt-form-item id="mobileCode" prop="mobileCode">
                                    <el-input v-model.trim='user.mobileCode'  :placeholder='$t("form.input.mobileCode")'  autocomplete="off" maxlength="32" class="pull-left input-code"></el-input>
                                    <mobile-code :beforeSend="beforeValidateCode" :btn-text="$t('form.btn.sendMobileCode')" btn-type="default" width="220px"   :code-type="RESETPASS_CODE" :mobile="user.mobile"></mobile-code>
                                </zt-form-item>
                                <zt-form-item>
                                    <el-button long type="warning" @click='next'>{{$t("account.pwdManage.next")}}</el-button>
                                </zt-form-item>
                            </div>
                        </zt-form>
                         <zt-form ref='pwdforgetFormStep2' class="show-icon" :model='user' label-width='0px' :rules='rules' inline-message>
                            <div v-show='active===1' >
                                <zt-form-item id="loginPass" prop="loginPass" v-capslock inline>
                                    <el-input :type="showPwd1 ? 'text' : 'password'" :maxlength="32" v-model="user.loginPass"  :placeholder='$t("form.input.newPassword")'  @focus="showLevel=true" @blur="showLevel=false">
                                        <i :class="pwdIcon1" slot="suffix" @click="togglePwd(1)"></i>
                                    </el-input>
                                    <password-check v-show="showLevel" :password="user.loginPass"></password-check>
                                </zt-form-item>
                                <zt-form-item id="confirmPass" prop="confirmPass" v-capslock>
                                    <el-input :type="showPwd2 ? 'text' : 'password'" :maxlength="32"  :placeholder='$t("form.input.confirmPassword")' v-model="user.confirmPass">
                                        <i :class="pwdIcon2" slot="suffix" @click="togglePwd(2)"></i>
                                    </el-input>
                                </zt-form-item>
                                <el-button long type="warning" @click='savePass'>{{$t("account.pwdManage.next")}}</el-button>
                            </div>
                        </zt-form>
                        <zt-form ref='pwdforgetFormStep3' class="show-icon" :model='user' label-width='0px' :rules='rules' inline-message>
                            <div v-show='active===2' class="op-result resetSuccess">
                                <el-button type='primary' @click='toLogin'>{{$t("account.pwdManage.toLogin")}}</el-button>
                            </div>
                        </zt-form>
                    </el-col>
                </el-row>
            </div>
        </div>
        <single-footer></single-footer>
    </div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import PasswordCheck from '@/components/passwordCheck/PasswordCheck';
import {REG_PASSWORD_REGEXP, MOBILE_REGEXP} from '@/constants/regexp.js';
import ImageCodeInput from '@/components/form/ImageCodeInput';
import MobileCode from '@/components/common/MobileCode';
import {pwdForget,validatePassword} from '@/service/user.js';
import {checkMobileExist, checkImageCode} from '@/service/register';
import {checkMobileCode} from '@/service/mobile';
import {RESETPASS_CODE} from '@/constants/const';
import Capslock from '@/utils/capslock';
export default {
    name: 'app',
    data() {
        // 验证两次密码是否输入一至
        const validatePass = (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
            }else if (!pwdRexp(value)) {
                callback(new Error(this.$t('register.loginPassIsError')));
            }
            else if (value !== this.user.loginPass && this.user.loginPass !== '') {
                callback(new Error(this.$t('register.passIsUnEqual')));
            } else {
                this.loginPass = false;
                this.$refs['pwdforgetFormStep2'].clearValidate(['loginPass']);
                callback();
            }
        };
        const validateIsOldPassword = async (rule, value, callback) => {
            this.clearMessage();
            console.log(value);
            if (value === '') {
                callback();
            } else 
            {
                let result = await validatePassword(value,this.user.mobile).catch(() => {
                    this.clearMessage();
                    callback(new Error(this.$t('exception.server')));
                });
                if (result.code !== '0000') {
                    callback(new Error(result.msg));
                }
                else{
                    callback();
                }
            }
        };
        // 验证手机号码是否注册
        const validateMobile = async (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
            } else {
                let result = await checkMobileExist(value).catch(() => {
                    this.clearMessage();
                    callback(new Error(this.$t('exception.server')));
                });
                if (result) {
                    callback(new Error(this.$t('register.mobileIsNotRegisted')));
                } else {
                    this.mobileIsError = false;
                    callback();
                }
            }
        };
        // 验证图片验证码
        const validateImageCode = async (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
            } else {
                let result = await checkImageCode(
                    value,
                    this.user.imageCode.id
                ).catch(() => {
                    this.clearMessage();
                    callback(new Error(this.$t('exception.server')));
                });
                if (!result) {
                    callback(new Error(this.$t('register.imageCodeIsError')));
                } else if (result.code !== '0000') {
                    callback(new Error(result.msg || this.$t('register.imageCodeIsError')));
                }
                this.imageIsError = false;
                callback();
            }
        };
        // 验证短信验证码
        const validateMobileCode = async (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
            }
            else {
                // alert(RESETPASS_CODE);
                let result = await checkMobileCode(this.user.mobile, value, RESETPASS_CODE).catch(() => {
                    this.reSendImgCode();
                    callback(new Error(this.$t('exception.server')));
                });
                if (result.code !== '0000') {
                    this.reSendImgCode();
                    callback(new Error(this.$t('register.mobileCodeIsError')));
                } else {
                    this.mobileCodeIsError = false;
                    callback();
                }
            }
        };
        /**
         * FIX 先输入下面，再输入上面密码的时候
         * 
         */
        const validateSamePwd = (rule, value, callback) => {
            this.clearMessage();
            if (!value) {
                // 没有quert密码直接通过。
                callback();
            } else if (!pwdRexp(value)) {
                callback(new Error(this.$t('register.loginPassIsError')));
            } {
                if (this.user.confirmPass !== this.user.loginPass && this.user.confirmPass && this.user.loginPass) {
                    callback(new Error(this.$t('register.passIsUnEqual')));
                } else {
                    this.$refs['pwdforgetFormStep2'].clearValidate(['confirmPass']);
                    callback();
                }
            }
        };
        // passRexp
        const pwdRexp = function (value) {
            return value.indexOf(' ') === -1 && value.indexOf('>') === -1 && value.indexOf('<') === -1 && REG_PASSWORD_REGEXP.test(value);
        };
        return {
            showLevel: false,
            mobileIsError: true,
            loginPassIsError: true,
            loginPass: true,
            mobileCodeIsError: true,
            getMobileLoading: false,
            showPwd1: false,
            showPwd2: false,
            active:0,
            imgCodeErrorMessage:'',
            title:$t('account.pwdManage.step1'),
            RESETPASS_CODE,
            // 忘记密码表单对象
            user: {
                mobile: '',
                loginPass: '',
                confirmPass: '',
                imageCode: {
                    code: '',
                    id: ''
                },
                mobileCode: '',
                agree: false,
                imageId: ''
            },
            rules: {
                mobile: [
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
                    {validator: validateMobile, trigger: 'blur'}
                ],
                'imageCode.code': [
                    {
                        required: true,
                        message: this.$t('register.imageCodeIsEmpty'),
                        trigger: ['submit']
                    },
                    { validator: validateImageCode, trigger: 'blur' }
                ],
                loginPass: [
                    {
                        required: true,
                        message: this.$t('register.loginPassIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        min: 8,
                        max: 32,
                        message: this.$t('register.loginPassLength'),
                        trigger: 'blur'
                    },
                    { validator: validateSamePwd, trigger: 'blur' },
                    {
                        validator: validateIsOldPassword, trigger: 'blur'
                    }
                    
                ],
                confirmPass: [
                    {
                        required: true,
                        message: this.$t('register.confirmPassIsEmpty'),
                        trigger:  ['submit']
                    },
                    { validator: validatePass, trigger: 'blur' },
                    {
                        validator: validateIsOldPassword, trigger: 'blur'
                    }
                    
                ],
                mobileCode: [
                    {
                        required: true,
                        message: this.$t('register.mobileCodeIsEmpty'),
                        trigger:  ['submit']
                    },
                    {
                        min: 5,
                        max: 6,
                        message: this.$t('register.mobileCodeIsError'),
                        trigger: 'blur'
                    },
                    {validator: validateMobileCode, trigger: 'blur'}
                ]
            }
        };
    },
    watch: {},
    computed: {
        pwdIcon1 () {
            return this.showPwd1 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        },
        pwdIcon2 () {
            return this.showPwd2 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        }
    },
    directives: {
        capslock: Capslock
    },
    created() {},
    methods: {
        // 清除错误信息
        clearMessage () {
            this.imgCodeErrorMessage = '';
        },
        // 刷新验证码
        reSendImgCode () {
            this.$refs['imageCode.code'].getImgCode();
            this .imgCodeErrorMessage = this.$t('register.imageCodeIsError');  
        },
        togglePwd (val) {
            if (val === 1) {
                this.showPwd1 = !this.showPwd1;
            } else if (val === 2) {
                this.showPwd2 = !this.showPwd2;
            }
        },
        // async validateField(array) {
        //     return new Promise((resolve, reject) => {
        //         let len = array.length;
        //         let pass = 0;
        //         for (let index = 0; index < array.length; index++) {
        //             const name = array[index];
        //             this.$refs['pwdforgetForm'].validateField(name, err => {
        //                 console.log('err',err);
        //                 if (err) {
        //                     return reject(new Error(err));    
        //                 }
        //                 pass++;
        //                 if (pass === len) {
        //                     // 验证通过
        //                     resolve(true);
        //                 }
        //             });
        //         }
        //     });
        // },
        next() {
            this.$refs['pwdforgetFormStep1'].validate(async valid => {
                if (valid) {
                    this.active = 1;
                    this.title = $t('account.pwdManage.pwdForget.step2');
                }
            });
            // this.validateField(['mobile','imageCode.code','mobileCode']).then(
            //     valid => {
            //         if (valid) {
            //             // 表单验证成功
            //             this.active = 1;
            //             this.title = $t('account.pwdManage.pwdForget.step2');
            //         }
            //     }
            // ).catch(function(error) {
            //     // console.log('发生错误！', error);
            // });
        },
        beforeValidateCode() {
            return new Promise((resolve, reject) => {
                this.$refs['pwdforgetFormStep1'].validateField('mobile', async err => {
                    if (err) {
                        reject(new Error('手机号码验证失败'));
                    } else {
                        $log('手机号码格式验证成功，验证手机是否注册。');
                        // 验证手机是否注册
                        return this.$refs['pwdforgetFormStep1'].validateField('imageCode.code', async imageCodeErr => {
                            console.log('imageCodeErr',imageCodeErr);
                            if (imageCodeErr) {
                                reject(new Error('图形验证码失败'));
                            } else {
                                $log('成功！');
                                resolve();
                            }
                        });
                    }
                });
            });
        },
        savePass() {
            this.$refs['pwdforgetFormStep2'].validate(async valid => {
                if (valid) {
                    // 表单验证成功
                    pwdForget(this.user)
                        .then(result => {
                            if (result) {
                                if (result.code === '0000') {
                                    this.active++;
                                    this.title = $t('account.pwdManage.step3');
                                } else {
                                    this.errorMsg = result.msg;
                                }
                            }
                        })
                        .catch(() => {
                            // 显示异常
                            this.$message.error(this.$t('exception.server'));
                        });
                }
            });
        },
        toLogin() {
            this.$store.dispatch('LOGOUT');
            this.$router.push({name: 'login'});
        }
    },
    components: {
        SingleHeader,
        SingleFooter,
        PasswordCheck,
        MobileCode,
        ImageCodeInput
    }
};
</script>
<style scoped  lang='scss'>
.font16{
    font-size: 16px;
    font-weight: bold;
}
.fixed-form-box{
        width: 450px;
    }
.resetSuccess {
    .el-button {
        width: 450px;
        height: 38px;
        margin-top: 50px;
       
    }
}
.input-code {
    width: 48%;
}
</style>
