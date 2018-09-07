<template>
    <div>
        
        <div class="logo-con pull-left">
            <img src="@/assets/images/logo_open.svg" width="85px" alt="" @click="goHome">
        </div>
        
        <!--  <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>您的当前位置：</el-breadcrumb-item> 
            <el-breadcrumb-item class="crumb" v-for="item in breadcrumb" :key="item.name" >{{item.meta.title||'-'}}</el-breadcrumb-item>
        </el-breadcrumb>-->
        <el-dropdown style="float:right;" :hide-on-click="false">
            <span class="el-dropdown-link">
                <!-- {{user.name}} -->
                <i class="el-icon-arrow-down el-icon--right el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editPwd">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 对话框 设置自动快照策略 -->
        <change-pwd-dialog ref="ChangePwdDialog" />
    </div>
</template>
<script>
import ChangePwdDialog from '@/components/dialog/ChangePwdDialog';
import { mapState } from 'vuex';
export default {
    name: 'navbar',
    data() {
        return {};
    },
    components: {
        ChangePwdDialog
    },
    computed: {
        ...mapState({
            user: state => state.user.userInfo,            
        }),
        breadcrumb: function() {
            let matched = this.$route.matched;
            console.log(matched);
            return matched;
        }
    },
    methods:{
        /**
         * 设置自动快照策略
         */
        editPwd: function() {
            console.log('editLabel:');
            this.$refs.ChangePwdDialog.show()
                .then(ret => {
                    console.log('操作成功', ret);
                    return this.$confirm('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },

        logOut() {
            this.$store.dispatch('LOGOUT');
            //this.$router.push({name: 'login'});
        },  
        
        goHome(){
            this.$router.push({name: 'app.overview'});
        }
    }
};
</script>
<style lang="scss">
.el-dropdown-link{
    color:#fff !important;
}
.crumb span{
    color:#fff !important;
}
 .source .el-breadcrumb__inner{
    color:#fff !important;
}
.source {
    padding: 21px 20px;
    background-color:#001529;
    .logo-con {
        display: inline-block;
        width:150px;
        height: 59px;
        line-height: 59px;
        border-bottom: 1px solid #000c17;
        img {
            vertical-align: middle;
        }
    }  
}
</style>
