<template>

    <!-- 
    获取短信验证码按钮
    <mobile-code width="130px" height="42px" btn-type="default" :disabled="disabled" :validate-user="true" :code-type="LOGIN_CODE" :mobile="mobile"></mobile-code>
-->
    <el-button :type="btnType" class="btn-mobile-code ml10" :style="{'width': width, 'height': height}" :disabled="isDisabled" :loading="loading" :mobile="mobile" @click="getMobileCode">{{ codeBtnText}}</el-button>
</template>
<script>
import {sendMobilecode} from '@/service/mobile';
// import {MOBILE_REGEXP} from '@/constants/regexp.js';
export default {
    name: 'MobileCode',
    data() {
        return {
            // 发送按钮名称
            codeBtnText: this.btnText,
            // 是否已发送
            isSend: false,
            // 发送中
            loading: false,
            interal: null,
        };
    },
    props: {
        // 是否可用
        disabled: {
            type: Boolean,
            default: false
        },
        // 手机号码
        mobile: String,
        // 发送验证码类型,登录：login_code；注册：register_code，绑定手机号码：reset_phone_code
        codeType: String,
        // 是否需要验证用户，取值true和false 默认为false
        validateUser: {
            type: Boolean,
            default: false
        },
        // 按钮样式default  primary
        btnType: {
            type: String,
            default: 'primary'
        },
        // 按钮样式default  primary
        btnText: {
            type: String,
            default: $t('form.btn.code')
        },
        // 按钮宽度
        width: {
            type: String,
            default: '120px' // 默认宽度
        },
        // 按钮高度
        height: {
            type: String,
            default: '38px' // 默认高度
        },
        // v-model绑定值
        value: {
            type: Boolean,
            default: false
        },
        beforeSend: {
            type: Function
        },
        afterSend: {
            type: Function
        },
        // 发送失败触发该事件
        onError: {
            type: Function
        },
        // 自动发送
        autoSend: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isDisabled() {
            return this.disabled || this.loading || this.isSend;
        }
    },
    destroyed() {
        this.$destroy();
    },
    methods: {
        // 获取短信验证码
        async getMobileCode() {
            try {
                if (this.isDisabled || /^1(3|4|5|7|8|9)\d{9}$/.test(this.mobile) === false) return;
                // 验证之前的钩子函数
                if (typeof this.beforeSend === 'function') {
                    await this.beforeSend();
                }
                this.loading = true;            
                this.codeBtnText = '发送中...';
                let code = '';
                sendMobilecode(this.mobile, this.codeType, this.validateUser)
                    .then(data => {
                        this.loading = false;
                        if (data && data.code === '0000') {
                            this.$emit('input', true);
                            this.messageCodeTimer();
                            typeof this.afterSend === 'function' && this.afterSend(true);
                        } else {
                            if (typeof this.onError === 'function') {
                                // 调用发送失败的钩子函数
                                this.onError(data.msg);
                            }
                            this.codeBtnText = '发送失败,重新获取';
                            code = data && data.code;
                            throw new Error(data.msg);
                        }
                    })
                    .catch((err) => {
                        $log(err);
                        // 发送失败
                        let message = $t('form.btn.sendError');
                        if (err && err.name === 'Error') {
                            message = err.message;
                        }
                        typeof this.afterSend === 'function' && this.afterSend(message);
                        this.loading = false;
                        // 用户不存在
                        if (code !== 'PORTAL.0106') {
                            this.codeBtnText = $t('form.btn.resend');
                        } else {
                            this.codeBtnText = this.btnText;
                        }
                    });
            } catch (error) {
                $log('beforeSend 执行失败', error.message);
            }
        },
        // 60秒后可重新发送
        messageCodeTimer() {
            let timer = 60;
            this.codeBtnText = $t('form.btn.hasSend') + '（60s）';
            this.isSend = true;
            this.interal = setInterval(() => {
                timer--;
                // 动态显示文字
                this.codeBtnText = `${$t('form.btn.hasSend')}（${timer}s）`;
                if (timer == 0) {
                    this.isSend = false;
                    clearInterval(this.interal);
                    this.codeBtnText = $t('form.btn.resend');
                }
            }, 1000);
        },
        reset() {
            if (this.interal) {
                this.interal = clearInterval(this.interal);
            }
            if (this.codeBtnText !== $t('form.btn.resend')) {
                this.codeBtnText = $t('form.btn.resend');
            }
            this.isSend = false;
            this.loading = false;
            return;
        }
    },
    mounted() {
        if (this.autoSend) {
            this.getMobileCode();
        }
    }
};
</script>
<style scoped>
</style>
