<template>
    <div class='pull-page-main email-page unbind-email-page'>
        <single-header :title="title"></single-header>
        <div class='pull-page-body'>
            <el-row>
                <el-col :span='24'>
                    <div class="main-box">
                        <div class="op-result">
                            <div class="op-result__text text-center">
                                <span>{{$t('useremail.unbind.title')}}</span>
                            </div>
                        </div>
                        <div class="subMessage" v-html="$t('useremail.unbind.content')">
                        </div>
                        <div class="btn-group text-center">
                            <el-button type="primary" @click="$router.push({'name': 'user.BindMailbox'})">{{$t('useremail.bind.bindBtn')}}</el-button>
                            <el-button type="primary" @click="$router.push({'name': 'app'})">{{$t('useremail.unbind.next')}}</el-button>
                        </div>
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
export default {
    name: 'app',
    data() {
        return {
            title: '登录'
        };
    },
    methods: {},
    components: {
        SingleHeader,
        SingleFooter
    }
};
</script>
<style lang='scss'>
.unbind-email-page{
    padding-top: 50px!important;
    .main-box {
        text-align: center;
        .subMessage {
            width: 313px;
            margin: 28px auto 29px auto;
            text-align: left;
            p{
                line-height: 14px;
                font-size: 14px;
            }
        }
        button {
            width: 180px;
        }
        .el-button + .el-button {
            margin-left: 20px;
        }
        .el-form-item__error.el-form-item__error--inline {
            text-align: left;
        }
    }
}
</style>
