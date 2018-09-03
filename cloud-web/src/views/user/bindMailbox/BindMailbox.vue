<template>
<div class="pull-page-main email-page bind-mailbox-page" v-loading.fullscreen="loading2">
    <single-header :title="title"></single-header>
    <div class='pull-page-body'>
        <div class="main-box">
            <div class="toBind" v-if="isBinded===0">
                <div class="op-result">
                    <div class="op-result__text te">
                        <span class="text-nowrap">{{$t('useremail.bind.tips')}}</span>
                    </div>
                </div>
                <div class="emailValidateForm">
                    <zt-form :model="user" ref="emailValidateForm" :rules="rules" inline-message size="medium">
                        <zt-form-item class="font14 mb20" prop="email" label-width="0" :error="errorMessage">
                            <el-input v-email :placeholder="$t('form.input.email')" :maxlength="32" @blur="clearErrorMessage" type="email" v-model="user.email" auto-complete="off" clearable></el-input>
                        </zt-form-item>
                        <zt-form-item label-width="0">
                            <el-button type="primary" @click="bindEmail" long>{{$t('form.btn.sendEmail')}}</el-button>
                        </zt-form-item>
                    </zt-form>
                </div>
            </div>
            <div v-else>
                <div class="op-result">
                    <div class="text-center font18">
                        {{$t('useremail.bind.sendSuccess')}}
                    </div>
                </div>
                <el-button type="primary" @click="$router.push({name: 'accountMg.SecutitySet'})" long>{{$t('common.back')}}{{$t('common.console')}}</el-button>
                <div class="mt15 text-center"><no-emailcode-tip class="font14" :showicon="false"></no-emailcode-tip></div>
            </div>
        </div>
    </div>
    <single-footer></single-footer>
</div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import {activeEmail, bindMail, checkEmailExist} from '@/service/user.js';
import {EMAIL_REGEXP} from '@/constants/regexp.js';
import {mapGetters} from 'vuex';
import NoEmailcodeTip from '@/components/tips/NoEmailCode.vue';
import {sleep} from '@/utils/utils';

let reBindTimer;
export default {
    name: 'app',
    data() {
        var checkEmail = async (rule, value, callback) => {
            await sleep('600');
            let email = this.user.email;
            if (!email) {
                return callback();
                // return callback(this.$t('account.emailIsEmpty'));
            }
            console.log(EMAIL_REGEXP.test(email), email);

            if (EMAIL_REGEXP.test(email)) {
                await validateEmailExist(rule, value, callback);
            } else {
                callback(this.$t('account.emailIsError'));
            }
        };
        var validateEmailExist = async (rule, value, callback) => {
            let email = this.user.email;
            if (!email) {
                return callback();
                // return callback(this.$t('account.emailIsEmpty'));
            }
            await checkEmailExist(email).then(ret => {
                console.error('a', ret);
                if (ret.code !== '0000') {
                    return callback(ret.msg || '验证邮箱失败');
                }
                callback();
            }).catch(err => {
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
            title: '绑定邮箱',
            isBinded: 0,
            reBindTime: 0,
            loading1: false,
            loading2: false,
            errorMessage: '',
            codeError: '',
            user: {
                email: '',
                emailCode: ''
            },
            rules: {
                email: [
                    {
                        required: true,
                        message: $t('account.emailIsEmpty'),
                        trigger: 'submit'
                    },
                    {
                        validator: checkEmail,
                        trigger: ['blur', 'submit']
                    }
                ]
            }
        };
    },
    computed: {
        checkGetCodeIsDisable() {
            // console.log(this.user.email+'')
            return EMAIL_REGEXP.test(this.user.email);
            // return true;
        },
        checkActiveIsDisable() {
            return this.user.emailCode === '';
        },
        ...mapGetters(['token', 'userInfo'])
    },
    methods: {
        clearErrorMessage() {
            this.errorMessage = '';
        },
        clearCodeError() {
            this.codeError = '';
        },
        validateCode() {
            if (!this.user.emailCode) {
                this.codeError = this.$t('register.emailCodeIsEmpty');
                return false;
            } else if (this.user.emailCode.length < 5) {
                this.codeError = this.$t('register.emailCodeIsError');
                return false;
            }
            this.clearCodeError();
            return true;
        },
        activeEMail() {
            if (!this.validateCode()) {
                return;
            }
            this.loading1 = true;
            activeEmail(this.user)
                .then(result => {
                    this.loading1 = true;
                    if (result.code === '0000') {
                        // this.userInfo.email = this.user.email;
                        // this.userInfo.emailStatus = 1;
                        // this.$store.commit('user/SET_USERINFO', this.userInfo);
                        this.$router.push({
                            name: 'BindMailBox.Success'
                        });
                        // throw new Error('123123');
                    } else {
                        this.codeError = result.msg;
                        // alert(result.msg);
                        // this.$message.error(result.msg);
                        // this.$router.push({name: 'BindMailBox.Error'});
                    }
                })
                .catch(() => {
                    // 显示异常
                    this.$message.error(this.$t('exception.server'));
                    this.loading1 = false;
                })
                .finally(() => {
                    this.loading1 = false;
                });
        },
        clearReBindTimer() {
            if (reBindTimer) {
                reBindTimer = clearInterval(reBindTimer);
            }
        },
        reBindEmail() {
            // this.clearCodeError();
            this.bindEmail(() => {
                this.reBindTime = 60;
                reBindTimer = setInterval(() => {
                    if (this.reBindTime > 0) {
                        this.reBindTime--;
                    } else {
                        this.clearReBindTimer();
                        this.reBindTime = 0;
                    }
                }, 1000);
                this.$message({
                    message: $t('useremail.bind.sendSuccess'),
                    type: 'success'
                });
            });
        },
        bindEmail(cb) {
            this.clearErrorMessage();
            this.$refs.emailValidateForm.validateField('email', (err) => {
                console.error('emailValidateForm', err);
                if (!err) {
                    this.loading2 = true;
                    bindMail(this.user)
                        .then(result => {
                            this.loading2 = false;
                            if (result.code === '0000') {
                                this.isBinded = 1;
                                typeof cb === 'function' && cb();
                            } else {
                                this.errorMessage = result.msg;
                            }
                        })
                        .catch(() => {
                            // 显示异常
                            this.$message.error(this.$t('exception.server'));
                            this.loading2 = true;
                        })
                        .finally(() => {
                            this.loading2 = false;
                        });
                }
            });
        }
    },
    beforeDestroy() {
        this.clearReBindTimer();
    },
    components: {
        NoEmailcodeTip,
        SingleHeader,
        SingleFooter
    }
};
</script>
<style lang='scss'>
.bind-mailbox-page {
    padding-top: 60px!important;
    .main-box {
        width: 450px;
        margin: auto;
        text-align: left;
        .op-result {
            padding: 0 0 30px 0 !important;
            margin: 0 auto;

            .op-result__text {
                text-align: center;
                span {
                    padding: 0;
                }
            }
        }
        .bindSuccess {
            font-size: 18px;
            color: #333;
            .el-icon-success {
                padding-right: 5px;
            }
        }
        .el-input {
            position: relative;
            font-size: 14px;
            display: inline-block;
        }
    }
}
</style>
