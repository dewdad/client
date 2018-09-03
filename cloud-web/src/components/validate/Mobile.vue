<template>
    <div class="validate-mobile">
        <div class="main-box">
            <zt-form :model="user" ref="mobileForm" :rules="rules" inline-message key='0' size="medium">
                <!-- <div class="color-secondary">您当前绑定的手机号码</div> -->
                <zt-form-item :label="label + '：'"  class="font14 mt20" prop="mobile">
                    <el-input :maxlength="11" :placeholder="user.mobile|mobileReplace" :disabled="true"></el-input>
                </zt-form-item>
                <zt-form-item label-width="0"  prop="mobileCode" class="flex" :error="error">
                    <el-input :maxlength="6" v-model="user.mobileCode" class="mobileCodeInput" :placeholder="$t('form.input.mobileCode')" key='1' clearable @focus="clearMessage(true)"></el-input>
                    <mobile-code width="220px" :btn-text="$t('form.btn.sendMobileCode')" :beforeSend="clearMessage(true)" :afterSend="clearMessage" :validate-user="true" :mobile="userInfo.mobile" :autoSend="autoSend" btn-type="default" :code-type="LOGIN_CODE"></mobile-code>
                </zt-form-item>
                <el-button long :type="btnType" @click="submit">{{btnText}}</el-button>
            </zt-form>
        </div>
    </div>
</template>
<script>
import MobileCode from '@/components/common/MobileCode';
import {mapGetters} from 'vuex';
import {checkMobileCode} from '@/service/mobile';
import {LOGIN_CODE} from '@/constants/const';

export default {
    name: 'validate-mobile',
    props: {
        btnText: {
            type: String,
            default: $t('common.ok')
        },
        btnType: {
            type: String,
            default: 'warning'
        },
        label: {
            type: String,
            default: $t('form.label.currentMobile')
        },
        autoSend: {
            type: Boolean,
            default: false
        }
    },
    data() {
        // 验证短信验证码
        const validateMobileCode = async (rule, value, callback) => {
            if (value === '') {
                // callback(new Error(this.$t('register.imageCodeIsEmpty')));
                callback();
            } else {
                let result = await checkMobileCode(this.user.mobile, value, LOGIN_CODE).catch(() => {
                    callback(new Error(this.$t('exception.server')));
                });
                if (result.code !== '0000') {
                    callback(new Error(result.msg || this.$t('register.mobileCodeIsError')));
                }
                this.imageIsError = false;
                callback();
            }
        };
        return {
            title: $t('useremail.change'),
            mobileIsError: false,
            user: {
                mobile: '',
                mobileCode: ''
            },
            LOGIN_CODE,
            error: '',
            rules: {
                mobileCode: [
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
                    {
                        validator: validateMobileCode,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    mounted() {
        this.user.mobile = this.userInfo.mobile;
    },
    methods: {
        submit() {
            let form = this.$refs.mobileForm;
            if (form) {
                form.validate(valid => {
                    if (valid) {
                        this.success();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        success() {
            this.$emit('success', this.user);
        },
        clearMessage(val) {
            try {
                if (val === true) {
                    this.$nextTick(() => {
                        let form = this.$refs.mobileForm;
                        if (form) {
                            this.error = '';
                            form.clearValidate(['mobileCode']);
                        }
                    });
                } else {
                    // 发送失败
                    this.error = val;
                }
            } catch (error) {
                $log('clear', error);
            }
        }
    },
    components: {
        MobileCode
    }
};
</script>
<style lang='scss'>
.validate-mobile {
    .panal-body {
        .el-form .el-form-item__error.el-form-item__error--inline {
            position: absolute;
            width: 100%;
            top: 0;
            padding-top: 0;
            height: 40px;
            line-height: 40px;
            left: 62%;
        }
        .el-input {
            position: relative;
            font-size: 14px;
            display: inline-block;
            // width: 355px;
        }
        .el-button {
            width: 355px;
            margin-left: 100px;
        }
        .bind-success {
            width: 200px;
            margin-left: 255px;
            margin-top: 30px;
        }
        .mobileCodeInput {
            width: 225px;
        }
    }
    .el-form .el-form-item__label {
        line-height: 12px;
        margin-bottom: 10px;
    }
}
</style>
