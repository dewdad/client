<template>
    <div class="pull-page-main pt50 register-success">
        <single-header :title="$t('register.successTitle')"></single-header>
        <el-row>
            <el-col :span="24">
                <div class="tips">
                    <div class="op-result">
                        <div class="op-result__text text-center">
                            <i class="iconfont icon-success color-success font40 mb20"></i>
                            <span class="font18">{{$t('register.success')}}!</span>
                        </div>
                    </div>
                    <el-row class="text-center font14 lh14 is-blod">
                            {{$t('register.account')}}
                            <router-link :to="{name: 'accountMg.SecutitySet'}">{{userInfo.mobile}}</router-link>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="width-full">
                    <div class="text-center font14 mb15">{{$t('register.successTips')}}</div>
                    <div class="btn-group text-center width-full">
                        <el-button type="primary" @click="$router.push({'name': 'user.auth.companyAuth'})">{{$t('register.authentication')}}</el-button>
                        <el-button type="primary" @click="$router.push({'name': 'app.home'})">{{$t('register.homeBtn')}}</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <single-footer></single-footer>
    </div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import {mapGetters} from 'vuex';
export default {
    name: 'app',
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    components: {
        SingleHeader,
        SingleFooter
    }
};
</script>
<style lang="scss">
.register-success {
    .tips {
        margin: 67px auto 20px;
    }

    .op-result {
        margin-bottom: 10px;
        .op-result__text {
            flex-direction: column;
        }

        .icon-success {
            font-size: 40px;
        }
    }

    .btn-group .el-button {
        width: 200px;
    }
}
</style>
