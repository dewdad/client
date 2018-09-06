<template>
    <el-dialog v-if="isShow" :title="$t('dialog.moblieVerify.smsVerification')" :visible.sync="isShow" width="500px" @close="cancel" class="dlg-verify-sms">
        <div>
            <zt-form ref="mobileForm" :model="mobileForm" :rules="rules" label-width="102px" style="width:420px;" size="small">
                <zt-form-item :label="$t('dialog.moblieVerify.yourPhone')" class="lh-em1 font12">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <span class="font12">{{userInfo.mobile|mobileReplace}}</span>
                    <span class="font12">(<a class="font12" @click="$router.push({'name': 'user.bindmobile'})">{{$t('dialog.moblieVerify.changePhone')}}</a>)</span>
                </zt-form-item>
                <zt-form-item :label="$t('dialog.moblieVerify.smsCode')" prop="verifyCode" class="mb0">
                    <el-input v-model="mobileForm.verifyCode" style="width: 162px;" @change="verifyCodeIsError = false"></el-input>
                    <mobile-code  height="32px" btn-type="default" :disabled="false" v-model="isSendedVerifyCode" :validate-user="true" :code-type="codeType" :mobile="userInfo.mobile"></mobile-code>
                </zt-form-item>
            </zt-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="info" @click="cancel" size="small">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="confirm" size="small">{{ $t('common.ok') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {checkMobileCode} from '@/service/mobile';
import {mapGetters} from 'vuex';
import MobileCode from '@/components/common/MobileCode';
export default {
    name: 'MobileCodeDialog',
    data() {
        // 验证短信验证码
        const validateMobileCode = async (rule, value, callback) => {
            if (this.verifyCodeIsError) {
                callback(new Error($t('dialog.moblieVerify.smsCodeError')));
            }
            callback();
        };
        return {
            isShow: false,
            reject: null,
            resolve: null,
            isSendedVerifyCode: false,
            verifyCodeIsError: false,
            mobileForm: {
                verifyCode: ''
            },
            rules: {
                verifyCode: [
                    {
                        required: true,
                        message: $t('dialog.moblieVerify.pleaseInputSmsCode'),
                        trigger: ['blur', 'change']
                    },
                    {
                        min: 4,
                        max: 6,
                        message: $t('dialog.moblieVerify.smsCodeError'),
                        trigger: 'blur'
                    },
                    {
                        pattern: /^\d{4,6}$/,
                        message: $t('dialog.moblieVerify.smsCodeError'),
                        trigger: 'blur'
                    },
                    {validator: validateMobileCode, trigger: 'blur'}
                ]
            }
        };
    },
    props: {
        // 发送验证码类型
        codeType: {
            type: String,
            default: ''
        }
    },
    components: {
        MobileCode
    },
    computed: {
        ...mapGetters(['userInfo', 'lastMoibleVerifyTime']),
        isVerify: function() {
            return true;
            // if (this.lastMoibleVerifyTime !== '' && (new Date().getTime() - this.lastMoibleVerifyTime) <= 30 * 60 * 1000) {
            //     return true;
            // } else {
            //     return false;
            // }
        }
    },    
    methods: {
        show() {
            if (this.isVerify) {
                let res = {
                    code: '0000'
                };
                return Promise.resolve(res);
            }
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.mobileForm.verifyCode = '';
        },
        cancel() {
            this.hide();
        },
        // 表单确认
        confirm() {
            // if (this.isSendedVerifyCode === false) {
            //     this.$alert('请先获取验证码', '提示', {
            //         type: 'warning'
            //     })
            //     return;
            // }
            this.$refs.mobileForm.validate(valid => {
                if (valid) {
                    // 验证成功 提交表单
                    return this.checkAuthCode();
                }
            });
        },
        // 提交验证
        checkAuthCode() {
            checkMobileCode(this.userInfo.mobile, this.mobileForm.verifyCode, this.codeType).then(res => {
                if (res && res.code && res.code === this.CODE.SUCCESS_CODE) { // 验证通过后返回Promise.resolve 通过then方法执行你要处理的业务
                    this.hide();
                    this.$store.commit('SET_LAST_MOBILE_VERIFY_TIME');
                    return (
                        typeof this.resolve === 'function' && this.resolve(res)
                    );
                } else {
                    this.verifyCodeIsError = true;
                    this.$refs.mobileForm.validateField('verifyCode', function() {});
                }
            });
        }
    }
};
</script>
<style  lang="scss">
.dlg-verify-sms {
    .el-form {
        .el-form-item__label {
            padding-right: 0;
        }
        .el-form-item.el-form-item--small.lh-em1 {
            .el-form-item__label {
                 line-height: 1 !important;
            }
            .el-form-item__content {
                line-height: 1 !important;
            }
        }
        .el-button.el-button--small {
            padding:9px 10px;
        }

    }
}
</style>