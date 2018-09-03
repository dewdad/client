<template>
    <div class="pull-page-main register pt50 ">
        <single-header :title="$t('register.register')"></single-header>
        <el-row>
            <el-col :span="24">
                <div class="register-box">
                    <div class="register-header">
                        <h3>{{ $t('register.title') }}
                        </h3>
                        <div class="tips">
                            <span class="tips-text font14">{{$t('register.hasAcount')}}?</span>
                            <router-link class="tips-link" :to="{name: 'login'}">{{$t('login.directLogin')}}</router-link>
                        </div>
                    </div>
                    <zt-form ref="registerForm" size="medium" class="show-icon pt10" :model="user" label-width="0px" :rules="rules" inline-message v-loading="isSubmit" element-loading-spinner="el-icon-loading">
                        <zt-form-item id="username" prop="username" :showRule="true" has-help>
                            <div>
                                <el-input v-model="user.username" :maxlength="32" :placeholder="$t('form.input.username')" clearable></el-input>
                                <span class="input-help">{{$t('form.tips.username')}}</span>
                            </div>
                        </zt-form-item>
                        <zt-form-item id="mobile" prop="mobile">
                            <el-input v-model="user.mobile" :maxlength="11" :placeholder="$t('form.input.mobile')" clearable></el-input>
                        </zt-form-item>
                        <zt-form-item id="loginPass" prop="loginPass">
                            <el-input :type="showPwd1 ? 'text' : 'password'" :maxlength="32" v-model="user.loginPass" :placeholder="$t('form.input.password')" @focus="showLevel=true" @blur="showLevel=false">
                                <i :class="pwdIcon1" slot="suffix" @click="togglePwd(1)"></i>
                            </el-input>
                            <password-check v-show="showLevel" :password="user.loginPass"></password-check>
                        </zt-form-item>
                        <zt-form-item id="confirmPass" prop="confirmPass">
                            <el-input :type="showPwd2 ? 'text' : 'password'" :maxlength="32" v-model="user.confirmPass" :placeholder="$t('form.input.confirmPassword')">
                                <i :class="pwdIcon2" slot="suffix" @click="togglePwd(2)"></i>
                            </el-input>
                        </zt-form-item>
                        <zt-form-item id="imageCode" prop="imageCode.code" :error="imgCodeErrorMessage">
                            <image-code-input ref="imageCode.code" v-model.trim='user.imageCode' :icon="false"></image-code-input>
                        </zt-form-item>
                        <zt-form-item id="mobileCode" prop="mobileCode" class="flex">
                            <el-input v-model="user.mobileCode" :maxlength="6" :placeholder="$t('form.input.mobileCode')" class="msm-code" clearable></el-input>
                            <mobile-code ref="mobileCode" :btn-text="$t('form.btn.sendMobileCode')" btn-type="default" :beforeSend="beforeValidateCode" width="172px" :disabled="false" :validate-user="false" :code-type="REGISTER_CODE" :mobile="user.mobile"></mobile-code>
                        </zt-form-item>
                        <zt-form-item prop="agree" class="agree lh14 mb25">
                            <el-checkbox v-model="user.agree"></el-checkbox> {{$t('register.agreement')}}
                            <a href="">{{$t('register.termsOfService')}}</a>和
                            <a href="">{{$t('register.privacyStatement')}}</a>
                        </zt-form-item>
                        <zt-form-item>
                            <el-button type="primary" @click="doReg" long>
                                {{$t('register.agree')}}
                            </el-button>
                        </zt-form-item>
                    </zt-form>
                </div>
            </el-col>
        </el-row>
        <single-footer></single-footer>
    </div>
</template>
<script src="./Register.js"></script>
<style lang="scss">
.register .pwd-icon {
    position: relative;
    left: -5px;
    line-height: 38px;
}
.register-box {
    position: relative;
    margin: 0 auto;
    padding-top: 5px;
    width: 355px;
}
.register {
    .agree .el-form-item__content {
        line-height: 14px !important;
        height: 14px !important;
    }

    .imageCode {
        display: inline-block;
        position: absolute;
        right: 10px;
    }
    .imageCode img {
        width: 88px;
        height: 27px;
    }

    form {
        .el-loading-spinner i {
            font-size: 42px;
            color: #333;
        }
    }
}
.register-box .register-header {
    position: relative;
    h3 {
        width: 350px;
        text-align: justify;
        text-align-last: justify;
        font-size: 30px;
        margin-bottom: 30px;
        white-space: nowrap;
    }
    .tips {
        position: absolute;
        top: -12px;
        left: 590px;
        width: 200px;
        font-size: 10px;
        color: #73777a;
        letter-spacing: 0.4px;
        line-height: 40px;
        text-align: right;
    }
}
</style>
