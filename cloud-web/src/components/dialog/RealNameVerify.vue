<template>
    <div>
        <el-dialog title="提示" visible @close="closeDialog">
            <span v-if="user.authStatus == 0">检测到您当前的账号尚未实名认证，使用云服务器需要先进行实名认证</span>
            <span v-if="user.authStatus == 1">实名认证信息审核中！<br>您的实名认证资料正在审核中,预计审核时间为2-3个工作日,请耐心等候。</span>
            <span v-if="user.authStatus == 3">您当前账号实名认证未通过！<br>为了使您方便快捷的申请证通云资源，建议您重新进行实名认证。</span>
            <span v-if="user.authStatus == 4">实名认证信息审核通过！<br>请输入确认金额完成实名认证。</span>
            <span slot="footer" class="dialog-footer">
                <router-link :to='{name: "app.accountmgr.creditet"}' v-if="user.authStatus == 4" target="_blank">去确认金额></router-link>
                <router-link :to='{name: "login.userAuthenfill"}' v-if="user.authStatus == 3" target="_blank">重新认证></router-link>
                <router-link :to='{name: "login.userAuthenfill"}' v-if="user.authStatus == 0" target="_blank">去认证></router-link>
            </span>
        </el-dialog>
    </div>

</template>
<script>
//实例认证弹框
import {mapState} from 'vuex';
export default {
    name: 'RealNameVerify',
    props: ['name'],
    data() {
        return {};
    },
    computed: {
        ...mapState({
            user: state => state.user.userInfo
        })
    },
    methods: {
        closeDialog: function() {
            this.$parent[this.name] = false;
            this.$store.commit('SET_SHOW_VERIFY', false);
        }
    },
    mounted() {
        console.log(this.user);
    }
};
</script>
<style scoped>
</style>














