<template>
    <el-button @click="clickHandler" :disabled="disabled" class="email-code">
        <span v-if="!time">{{text}}</span>
        <span v-if="time">{{$t('form.btn.hasSend')}}（<timer v-model="time"></timer>s）</span>
    </el-button>
</template>

<script>
import Timer from '@/components/common/Timer.vue';
import {bindMail} from '@/service/user.js';

export default {
    components: {
        Timer
    },
    props: {
        beforeSend: Function,
        data: Object
    },
    data() {
        return {
            time: 0,
            loading: false
        };
    },
    computed: {
        disabled() {
            return this.loading || this.time > 0;
        },
        text() {
            return this.loading ? $t('form.btn.hasSend') : $t('form.btn.sendEmail');
        },
    },
    methods: {
        async clickHandler() {
            try {
                if (typeof this.beforeSend === 'function') {
                    await this.beforeSend();
                }
                this.loading = true;
                await this.send();
                this.loading = false;
                this.time = 60;
            } catch (err) {
                this.loading = false;
                this.$emit('error', err.message || '验证码发送失败');
            }
        },
        async send() {
            if (!this.data || !this.data.email) {
                throw new Error(this.$t('account.emailIsEmpty'));
            }
            let result = await bindMail(this.data);
            if (result && result.code === '0000') {
            } else {
                throw new Error(result.msg);
            }
        }
    }
};
</script>
