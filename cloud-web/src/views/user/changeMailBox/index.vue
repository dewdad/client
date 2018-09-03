<template>
<div class='pull-page-main change-mailbox-page email-page'>
    <single-header :title="title"></single-header>
    <div class='pull-page-body'>
        <div class="content">
            <!-- 提示文字 -->
            <div class="tips text-center" :class="[index > 1 ? 'font18':'font16']">{{tips || ''}}</div>
            <!-- 步骤条 -->
            <el-steps :active="index" align-center class="mt30">
                <el-step v-for="(step, key) in steps" :title="step.step || step.title" :key="key"></el-step>
            </el-steps>
            <div class="form-box">
                <!-- 第一步 验证身份 -->
                <validate-mobile class="mt-14" v-if="index === 0" :btn-text="$t('common.next')" @success="next"></validate-mobile>
                <!-- 第二步 修改安全邮箱 -->
                <change-mail-box v-if="index === 1" @success="next"></change-mail-box>
                <!-- 第三步 成功 -->
                <div class="success-box" v-if="index === 2">
                    <el-button type="primary" @click="success">{{$t('common.ok')}}</el-button> <br>
                    <!-- 倒计时 -->
                    <timer :value="5" @end="success" class="color-primary">S</timer>
                </div>
            </div>
        </div>
    </div>
    <single-footer></single-footer>
</div>
</template>

<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import ValidateMobile from '@/components/validate/Mobile';
import Timer from '@/components/common/Timer.vue';
import ChangeMailBox from '@/views/user/changeMailBox/ChangeMailBox.vue';

export default {
    data() {
        return {
            key: 'value',
            index: 0,
            steps: [
                {
                    // 验证身份
                    title: $t('useremail.steps[0].title'),
                    tips: $t('useremail.steps[0].tips'),
                },
                {
                    // 修改安全邮箱
                    title: $t('useremail.steps[1].title'),
                    tips: $t('useremail.steps[1].tips'),
                },
                {
                    // 完成
                    title: $t('useremail.steps[2].title'),
                    step: $t('useremail.steps[2].step'),
                    tips: $t('useremail.steps[2].tips'),
                }
            ]
        };
    },
    computed: {
        tips() {
            return this.steps[this.index].tips;
        },
        title() {
            return this.steps[this.index].title;
        }
    },
    methods: {
        next() {
            if (this.index < 2) {
                this.index++;
            }
        },
        success() {
            this.$router.push({
                name: 'accountMg.SecutitySet'
            });
        }
    },
    components: {
        SingleHeader,
        ValidateMobile,
        ChangeMailBox,
        Timer,
        SingleFooter
    }
};
</script>

<style lang="scss">
.change-mailbox-page {
    padding-top: 30px!important;
    .form-box {
        width: 450px;
        margin: auto;
        padding-top: 40px;
    }

    .tips {
        height: 20px;
        font-weight: 600;
    }

    .content {
        margin: auto;
        width: 750px;
        position: relative;
        top: -50px;
    }

    .main{
        width: 360px;
        margin: auto;
    }

    .success-box {
        text-align: center;
        .el-button {
            width: 450px;
            margin: 50px auto 10px;
        }
    }
}
</style>
