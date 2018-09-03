<template>
    <div id="header" class="single-header">
        <el-header height="">
            <div class="logo">
                <router-link :to="{'name': 'app'}"><img src="@/assets/images/control/logo.png"></router-link>
            </div>
            <div class="title" v-if="title">
                {{title}}
            </div>
            <router-link v-if="showLoginLink" class="headerRight" :to="{'name': 'login'}">{{$t('common.login')}}</router-link>
            <router-link v-else-if="showLink" class="headerRight" :to="{'name': 'app'}">{{$t('common.console')}}</router-link>
        </el-header>
    </div>
</template>
<script>
export default {
    name: 'SingleHeader',
    data() {
        return {
            linkBlockLost: ['register.reg', 'user.identity'], // 不显示管理控制台链接的网页
            LoginLink: ['user.forgetPwd'] // 显示登录链接
        };
    },
    computed: {
        showLink() {
            return !this.linkBlockLost.find(e => e === this.$route.name);
        },
        showLoginLink() {
            return this.LoginLink.find(e => e === this.$route.name);
        }
    },
    props: {
        title: String
    }
};
</script>
<style scoped>

</style>
