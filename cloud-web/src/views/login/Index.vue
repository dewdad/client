<!--  -->
<template>
    <div id="login">
        <div class="row">
            <div class="login-bg">
                <div class="txt">
                    <p style="font-size:36px;margin-bottom:30px;color:#fff;">私有云管理重磅来袭</p>
                    <p style="font-size:22px;margin-bottom:10px;color:#fff;">立足用户&nbsp;&nbsp;&nbsp;&nbsp;服务用户</p>
                    <p style="font-size:22px;margin-bottom:10px;color:#fff;">持续创新&nbsp;&nbsp;&nbsp;&nbsp;云瞰未来</p>
                </div>
            </div>
            <div class="login-box">
                <div class="login-box--inner">
                    <div class="logo"><a href="http://cloud.szzt.com.cn/"><img src="@/assets/images/logo.png"></a></div>
                    <div class="login-box--form">
                        <el-alert v-if="errorMsg !==''" :title="errorMsg" class="mb20" type="error" :closable="false" show-icon>
                        </el-alert>
                        <el-form autocomplete="off" ref="pwdForm" :model="user" label-width="0" v-loading="isLoging" :rules="rules" element-loading-spinner="el-icon-loading" :show-message="false">
                            <!-- <el-form-item label="" class="mb10">
                               您可以申请试用获取体验账户，<a href="http://cloud.szzt.com.cn/#/register/reg" target="_blank">立即申请</a>
                            </el-form-item> -->
                            <el-form-item label="" prop="userName" :class="{'is-nomal': errorInput === ''}">
                                <input type="text" id="username" style="display: none;" disabled autocomplete="off" />
                                <input type="password" id="password" style="display: none;" disabled autocomplete="off" />
                                <el-input ref="userName" name="username" key="userName" v-model.trim='user.userName' prefix-icon="iconfont icon-icon-test1" :maxlength="32" :clearable="true" placeholder="用户名" >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="" prop="pwd">
                                <el-input ref="pwd" key="pwd" name="password" type="password" v-model="user.pwd" @keyup.enter.native="submit" prefix-icon="iconfont icon-icon-test" :maxlength="32" :clearable="true" placeholder="密码"  auto-complete="off">
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="loginFailNums > 0" :error="codeError"  :class="{'imagecode': true, 'is-error': errorInput === 'imageCode'}" id="imageCode" prop="imageCode" label="">
                                <image-code-input ref="imageCode" v-model.trim='user.imageCode' @keyup.enter.native="submit" @blur="inputBlur('imageCode', $event)" ></image-code-input>
                            </el-form-item>
                            <el-form-item label="" class="mb0">
                                <el-button type="primary" long @click="submit" value="" class="btn-register">
                                    {{$t('login.login')}}
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="login-copyright">Copyright © {{currentYear}} 证通云版权所有</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {userLogin} from '@/service/login';
import {checkImageCode} from '@/service/register';
import ImageCodeInput from '@/components/form/ImageCodeInput';
import {isEmpty} from '@/utils/utils';
import {mapState} from 'vuex';
export default {
    data() {
        const validatorImageCode = async (rule, value, callback) => {
            if (value) {
                let result = await checkImageCode(this.user.imageCode);
                if (result.code !== '0000') {
                    this.errorMsg = result.msg;
                    this.errorInput = 'imageCode';
                } 
            }
            callback();
        };
        return {
            isLoging: false,
            showImageCode: false,
            codeError: '',
            user: {
                userName: '',
                pwd: '',
                imageCode: ''
            },
            errorInput: '',
            errorMsg: '',
            // 表单验证规则
            rules: {
                userName: [
                    {
                        required: true,
                        message: '请输入账户名',
                        trigger: ['submit']
                    }
                ],
                pwd: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: ['submit']
                    }
                ],
                imageCode: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: ['submit']
                    },
                    {
                        min: 4,
                        max: 4,
                        message: '验证码不正确',
                        trigger: ['submit', 'blur']
                    },
                    {
                        validator: validatorImageCode,
                        message: '验证码不正确',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props: {},
    components: {
        ImageCodeInput
    },
    computed: {
        ...mapState({
            loginFailNums: state => state.user.loginFailNums
        }),
        // 当前年份
        currentYear() {
            let year = new Date().getFullYear();
            return year;
        }
    },
    created() {},
    methods: {
        // 验证表单域 filed: 验证字段
        async checkData(field) {
            return new Promise((resolve, reject) => {
                this.$refs.pwdForm.validateField(field, message => {
                    console.log('checkData', field, message);
                    if (message) {
                        this.errorMsg = message;
                        this.errorInput = field;
                        // 错误框自动获取焦点
                        reject({message, field});
                    } else {
                        if (field === this.errorInput) {
                            this.errorMsg = '';
                            this.errorInput = '';
                        }
                        resolve();
                        // if (field === 'userName' && this.loginType === 0) {
                        //     return this.checkUserName(resolve);
                        // } else {
                        //     resolve();
                        // }
                    }
                });
            });
        },
        // input框失去焦点事件
        inputBlur(input, e) {
            // 如果当前失去焦点对象与错误对象且点击过登录按钮时 验证INPUT
            console.log('errorInput', this.errorInput === input);
            console.log('isSubmit', this.isSubmit);
            let value = '';
            if (input !== 'imageCode') {
                value = this.user[input];
            } else {
                $log('values', this.user.imageCode);
                value = this.user.imageCode;
            }
            // 为空时移除验证结果
            if (value === '') {
                this.$refs.pwdForm.clearValidate([input]);
                return;
            }
            if (value && this.errorInput === input) {
                this.checkData(input).catch(err => {
                    $log(err);
                });
            }
        },
        submit() {
            this.checkData('userName') // 第一步：验证邮箱或手机号码
                .then(() => {
                    return this.checkData('pwd'); // 第二步：验证密码
                })
                .then(() => {
                    // 第三步：验证图片验证码
                    if (this.loginFailNums > 0) {
                        return this.checkData('imageCode');
                    }
                    return Promise.resolve(); 
                })
                .then(() => {
                    // 第四步：登录
                    this.login(this.loginType);
                })
                .catch(err => {
                    $log(err);
                });
        },
        // 登录
        login(type) {
            if (this.isLoging) return;
            this.isLoging = true;
            userLogin({
                loginNo: this.user.userName,
                loginPass: this.user.pwd,
                imageCode: this.user.imageCode,
            })
                .then(async result => {
                    this.isLoging = false;
                    let code = result.code;
                    if (code === '0000') {
                        // 记录token
                        this.$store.commit('SET_LOGIN_STATUS', {
                            status: true,
                            token: ''
                            // uid: result.data.result.uid
                        });
                        // 记录用户信息
                        this.$store.commit('user/SET_USERINFO', result.data);
                    
                        let redirect = this.$route.query.c;
                        if (!isEmpty(redirect)) {
                            // 如果路由中存在redirect参数 跳转到redirect对应的页面
                            this.$router.push(redirect);
                        } else {
                            if (result.data.roleType === '4') {
                                this.$router.push({
                                    name: 'app'
                                });
                            } else {
                                window.location.href = '/admin/';
                            }
                            
                        }
                    } else {
                        this.errorMsg = result.msg;
                        // 记录失败次数
                        this.$store.commit('user/SET_LOGIN_FAIL_NUMS');
                        // 刷新验证码
                        if (this.loginFailNums > 1) {
                            this.$refs.imageCode.getImgCode();
                        }
                    }
                })
                .catch(err => {
                    $log(err);
                    this.isLoging = false;
                    this.errorMsg = this.$t('exception.server');
                });
        }
    }
};
</script>
<style lang='scss' scoped>
#login {
    flex: 1;
    height: 100%;
    .row {
        position: absolute;
        margin: 0px;
        width: 100%;
        height: 100%;
        display: flex;
    }
}
.login-bg {
    flex: 3;
    height: 100%;
    background: #000000 url(../../assets/images/bg.png) bottom right;
    background-repeat: no-repeat;
    background-size: 600px;
    .txt {
        position: absolute;
        top: 5%;
        left: 10%;
        text-align: left;
        margin-top: calc(50vh - 160px);
    }
}
.login-box {
    flex: 2;
    height: 100%;
    background: #f5f5f5;
    position: relative;
    .login-box--inner {
        padding: 75px 20px 0 60px;
    }
    .login-box--form {
        position: absolute;
        width: 320px;
        left: 50%;
        margin-left: -160px;
        margin-top: calc(50vh - 200px);
    }
    .login-copyright {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        text-align:center;
    }
}
</style>