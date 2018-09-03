<template>
    <el-dialog
        :title="$t('common.deleteButtonText')"
        :visible.sync="isShow"
        width="45%"
        class="deleteDialog">
        <!-- tip提示信息 -->
        <div class="tip font16">
            {{ $t('ecs.inst.list.deleteDialog.tip') }}
        </div>
        <!-- 选择框 -->
        <div class="delOption mt10">
                <el-checkbox label="true" v-model="releaseFloatIp">{{ $t('ecs.inst.list.deleteDialog.releaseFloatIp') }}</el-checkbox>
                <el-checkbox label="true" v-model="releaseDataDisk">{{ $t('ecs.inst.list.deleteDialog.releaseDataDisk') }}</el-checkbox>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">{{$t('common.ok')}}</el-button>
            <el-button type="info" class="font12" @click="isShow = false">{{$t('common.cancel')}}</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            releaseFloatIp:false,
            releaseDataDisk:false,
            isShow: false,
            resolve: null,
            reject: null,
            checkList: []
        };
    },
    methods: {
        show() {
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            this.hide();
            //this.setting();
            this.resolve({
                releaseFloatIp: this.releaseFloatIp,
                releaseDataDisk:this.releaseDataDisk
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.deleteDialog{
    .tip, .delOption{
        margin: 0 auto;
        width:540px;
        padding: 0 40px;
        box-sizing: border-box;
    }
    .tip{
        line-height: 30px;
    }
}
</style>
