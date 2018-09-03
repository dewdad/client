<template>
    <div class="AuthApply">
        <single-header :title="title"></single-header>
        <div class='panal-body clearfix'>
            <el-row>
                <el-col :span='12' :offset="6">
                    <div class="main-box">
                        <div class="applyResult">
                            <i class="iconfont icon-notice_people color-warning"></i>
                            <span class="font18"> {{$t("account.Auth.authApply.authApplyTitle")}}</span><br>
                            <span class="font14 pt10"> {{$t("account.Auth.authApply.authApplyTitleTips")}}</span>
                        </div>
                        <router-link tag="button" to="/app/overview" class="el-button el-button--primary">{{$t('common.console')}}</router-link>
                    </div>
                </el-col>
            </el-row>
        </div>
        <single-footer></single-footer>
    </div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
// import checkEmailExist from '@/service/user'
import { EMAIL_REGEXP } from '@/constants/regexp.js';
export default {
    name: 'app',
    data() {
        return {
            title: '绑定邮箱',
            isBinded: 0,
            emailIsError: true,
            user: {
                agree: false,
                email: '',
                token: ''
            },
            rules: {
                email: [
                    {
                        required: true,
                        message: this.$t('account.emailIsEmpty'),
                        trigger: 'blur'
                    },
                    {
                        pattern: EMAIL_REGEXP,
                        message: this.$t('account.emailIsError'),
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        checkEmail: function() {
            return !this.emailIsError;
        }
    },
    methods: {
        submitForm() {
            this.isBinded = 1;
        }
    },
    components: {
        SingleHeader,
        SingleFooter
    }
};
</script>
<style scoped lang='scss'>
.AuthApply {
    .panal-body {
        padding-top: 60px;
        margin: auto;
        text-align: left;
        .applyResult {
            padding: 55px;
            margin: 0 auto;
            span {
                display: inline-block;
                margin: 5px;
            }
        }
        .el-button{
            width: 200px;
            margin-left: 120px;

        }
    }
}
</style>
