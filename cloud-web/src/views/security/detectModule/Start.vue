<template>
    <div class="detect-module detect-module-start">
        <div class="bg"></div>
        <div class="content">
            <div class="text color-white pull-left">
                <h2 class="tips">{{$t('security.overview.safetyExamination')}}</h2>
                <p class="desc">
                    {{$t('security.overview.safetyExaminationTips')}}
                    <router-link to="#" class="color-white">
                        {{$t('security.overview.checkInspectionStrategy')}}
                    </router-link>
                </p>
            </div>
            <div class="pull-right actions">
                <el-button @click="showResult">今日检测结果</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapMutations} from 'vuex';
export default {
    methods: {
        ...mapActions('security', ['onKeyScan', 'onkeyscanStatus']),
        ...mapMutations('security', ['setGetInfoTime']),
        showResult() {
            this.setGetInfoTime();
            this.$emit('showResult');
        }
    },
    mounted() {
        this.onkeyscanStatus();
    }
};
</script>

<style lang="scss">
.detect-module-start {
    position: relative;
    height: 160px;
    width: 100%;
    background-color: #2f7bdf;

    .bg,
    .content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .bg {
        background-image: url('../../../assets/images/security/detect_bg.png');
        background-repeat: no-repeat;
        background-position-x: 100%;
        opacity: 0.2;
    }
}
</style>
