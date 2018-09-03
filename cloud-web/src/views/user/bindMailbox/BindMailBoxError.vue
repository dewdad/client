<template>
    <div class="bindEmailboxError">
        <single-header :title="title"></single-header>
        <div class='panal-body clearfix'>
            <el-row>
                <el-col :span='24'>
                    <div class="main-box">
                        <div class="bindError">
                            <i class='iconfont icon-error color-warning '></i> 邮箱绑定失败,验证码已失效,请重新发送</div>
                        <!-- <div class="bindErrorBtn"></div> -->
                        <el-button type="primary" @click="$router.push({'name': 'user.BindMailbox'})">重新绑定</el-button>
                        <el-button type="primary" @click="$router.push({'name': 'app'})">{{$t('common.console')}}</el-button>
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
            title: '绑定邮箱', 
        };
    },
    components: {
        SingleHeader,
        SingleFooter
    }
};
</script>
<style lang='scss'>
.bindEmailboxError {
    .panal-body {
        padding-top: 60px;
        width: 600px;
        margin: auto;
        text-align: left;
        .main-box {
            margin-top: 100px;


            .bindError {
                font-size: 28px;
                color: #333;
                .el-icon-Error {
                    padding-right: 15px;
                }
            }
            .el-button {
                width: 180px;
                margin-top: 50px;
                margin-left: 40px;
            }
        }
    }
}
</style>
