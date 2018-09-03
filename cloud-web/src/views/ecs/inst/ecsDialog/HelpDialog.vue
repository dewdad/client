<template>
    <el-dialog :title="$t('ecs.inst.list.helpDialog.title')" :visible.sync="isShow" width="666px" class="HelpDialog">
        <div class="is-bold font16 title">{{$t('ecs.inst.list.helpDialog.infoTitle')}}</div>
        <div class="info font12" v-html="$t('ecs.inst.list.helpDialog.info')"></div>
        <img :src="img" class="img" />
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import img from '@/assets/images/ecs/help-dailog-img.jpg';
export default {
    data() {
        return {
            img,
            isShow: false
        };
    }
};
</script>

<style lang="scss">
.HelpDialog {
    .title {
        margin-top: -15px;
        margin-bottom: 15px;
    }
    .info {
        line-height: 20px;
    }
    .img {
        display: block;
        width: 100%;
        height: 100px;
        border: solid 1px #0d7ef233;
    }
    .el-dialog__body {
        padding-left: 20px;
        padding-right: 20px;
    }
}
</style>
