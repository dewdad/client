<template>
    <div class='pull-page-main user-identity-page'>
        <single-header title='验证身份'></single-header>
        <div class='pull-page-body'>
            <div class='fixed-form-box mt0'>
                <el-alert title="" center type="success" :closable="false">
                    <i class='iconfont icon-chenggong color-success font14'></i> 验证码已发送至您绑定的手机号码，请注意查收
                </el-alert>
                <div class='text-center'>
                    <h3 class="font14">为保障您的账号安全，证通云需要校验您的短信验证码</h3>
                </div>

                <validate-mobile btn-text="确定" label="手机号码" :auto-send="true" btn-type='primary' @success="checkSuccess"></validate-mobile>
            </div>
        </div>
        <single-footer></single-footer>
    </div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import ValidateMobile from '@/components/validate/Mobile';
import {mapGetters} from 'vuex';
export default {
    name: 'app',
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['userInfo', 'accountList'])
    },
    methods: {
        // 验证旧绑定手机
        checkSuccess(params) {
            console.warn(params);
            this.$store.commit('user/ADD_ACCOUNT', this.userInfo.uid);
            this.$router.push('/people/overview');
        }
    },
    components: {
        SingleHeader,
        SingleFooter,
        ValidateMobile
    }
};
</script>
<style lang='scss'>
.user-identity-page {
    .el-alert {
        padding-left: 16px;
        padding-right: 16px;
    }
    h3 {
        text-align-last: justify;
    }
    .btn-mobile-code {
        width: 120px!important;
    }
}
</style>
