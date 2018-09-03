<template>
    <div class="pull-page-main">
        <el-container>
            <single-header :title="title"></single-header>
            <div class="main">
                <el-row>
                    <el-col :span='24'>
                        <router-view />
                    </el-col>
                </el-row>
            </div>
        </el-container>
        <single-footer ref="footer"></single-footer>
    </div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
export default {
    name: 'app',
    data() {
        return {
            authType: ''
        };
    },
    methods: {},
    computed: {
        title: function() {            
            let title_inner = $t('account.Auth.companyAuth.companyAuthTitle'); //默认 企业认证；
            let routename = this.$route.name;            
            switch(routename){
                case 'user.auth.companyAuth':{
                    break;
                }
                case 'auth.departAuth':{
                    title_inner = $t('account.Auth.departAuth.departAuthTitle');break;
                }
                default:{}
            }             
            return title_inner;
        }
    },
    components: {
        SingleHeader,
        SingleFooter
    }
};
</script>
<style scoped lang='scss'>
@import '@/assets/css/theme/common.scss';
.title {
    padding-top: 20px;
    font-size: 18px;
    font-weight: 700;
}
.main {
    padding-top: $--basic-header-height;
    width:100%;
    //min-width: 1024px;
    //max-width: 1200px;
    //margin: 0 auto;
}
</style>
