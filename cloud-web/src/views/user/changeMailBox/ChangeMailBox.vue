<template>
<zt-form class="change-mail-box show-icon" :model="user" ref="emailValidateForm" :rules="rules" inline-message v-loading.fullscreen="loading">
    <!-- 邮箱 -->
    <zt-form-item label-width="0" prop="email" :error="emailErrorMessage">
        <el-input v-email :maxlength="32" type="email" v-model="user.email" clearable :placeholder="$t('form.input.newEmail')" ></el-input>
    </zt-form-item>
    <!-- 验证码 -->
    <!-- <zt-form-item label-width="0" prop="emailCode" :error="codeErrorMessage" class="flex hide-success mb30">
        <el-input :maxlength="6" type="email" v-model="user.emailCode" :placeholder="$t('form.input.emailCode')" class="mr10" clearable></el-input>
        <email-code :data="user" :beforeSend="beforeSendCode" @error="codeError"></email-code>
        <no-emailcode-tip class="input-help"></no-emailcode-tip>
    </zt-form-item> -->
    <!-- 确定 -->
    <zt-form-item>
        <el-button type="primary" @click="corfirm" long>{{$t('form.btn.sendEmail')}}</el-button>
    </zt-form-item>
</zt-form>
</template>

<script>
import {EMAIL_REGEXP} from '@/constants/regexp.js';
import EmailCode from '@/components/common/EmailCode.vue';
import {bindMail, checkEmailExist} from '@/service/user.js';
import {mapGetters} from 'vuex';
// import {cloneDeep} from '@/utils/utils.js';
import NoEmailcodeTip from '@/components/tips/NoEmailCode.vue';

export default {
    components: {EmailCode, NoEmailcodeTip},
    data() {
        var checkEmail = (rule, value, callback) => {
            setTimeout(() => {
                let email = this.user.email;
                if (!email) {
                    return callback();
                    // return callback(this.$t('account.emailIsEmpty'));
                }
                console.log(EMAIL_REGEXP.test(email), email);

                if (EMAIL_REGEXP.test(email)) {
                    validateEmailExist(rule, value, callback);
                } else {
                    callback(this.$t('account.emailIsError'));
                }
            }, 600);
        };

        var validateEmailExist = async (rule, value, callback) => {
            let email = this.user.email;
            if (!email) {
                return callback();
                // return callback(this.$t('account.emailIsEmpty'));
            }
            await checkEmailExist(email)
                .then(ret => {
                    if (ret.code !== '0000') {
                        return callback(ret.msg || '验证邮箱失败');
                    }
                    callback();
                })
                .catch(err => {
                    if (err && err.message) {
                        if (err.name === 'Error') {
                            callback(err.message);
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                });
        };

        return {
            emailErrorMessage: '',
            codeErrorMessage: '',
            loading: false,
            rules: {
                emailCode: [
                    {
                        required: true,
                        message: this.$t('register.emailCodeIsEmpty'),
                        trigger: 'submit'
                    },
                    {
                        min: 5,
                        max: 6,
                        message: this.$t('register.emailCodeIsError'),
                        trigger: 'blur'
                    }
                    // 失焦不触发验证码后台校验（校验通过直接就是绑定成功）；
                ],
                email: [
                    {
                        required: true,
                        message: $t('account.emailIsEmpty'),
                        trigger: 'submit'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ]
            },
            user: {}
        };
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        bindEmail() {},
        clearErrorMessage() {},
        // 校验验证码
        bindMail() {
            this.loading = true;
            this.codeErrorMessage = '';
            return bindMail(this.user)
                .then(result => {
                    if (result.code === '0000') {
                        // let userInfo = cloneDeep(this.userInfo);
                        // userInfo.email = this.user.email;
                        // userInfo.emailStatus = 1;
                        // this.$store.commit('user/SET_USERINFO', userInfo);
                        this.success();
                    } else {
                        this.codeErrorMessage = result.msg;
                    }
                })
                .catch(() => {
                    this.$message.error(this.$t('exception.server'));
                })
                .finally(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                });
        },
        /**
         * 点击确认
         * 校验表单之后发送请求；
         */
        corfirm() {
            this.$refs['emailValidateForm'].validate(valid => {
                if (valid) {
                    this.bindMail();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /**
         * 发送错误
         */
        codeError(msg) {
            this.emailErrorMessage = msg;
        },
        /**
         * 成功
         */
        success() {
            this.$emit('success', this.userInfo);
            // this.$router.push({
            //     name: 'BindMailBox.Success'
            // });
        },
        /**
         * 校验邮箱，不通过不发送验证码。
         */
        beforeSendCode() {
            this.emailErrorMessage = '';
            return new Promise((resolve, reject) => {
                this.$refs['emailValidateForm'].validateField(
                    'email',
                    async err => {
                        if (err) {
                            reject(
                                new Error(
                                    err || this.$t('register.emailCodeIsError')
                                )
                            );
                        } else {
                            $log('邮箱验证成功。');
                            resolve();
                        }
                    }
                );
            });
        }
    }
};
</script>

<style lang="scss">
.change-mail-box {
    padding-top: 28px;
    .email-code {
        width: 170px;
    }
}
</style>
