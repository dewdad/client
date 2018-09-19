
<template>
    <el-dialog :title="$t('dialog.restartEcsInst.title')" :visible.sync="isShow" width="500px" class="stopCaseDialog" @close="cancel">        
        <el-alert :title="$t('dialog.restartEcsInst.alert')" type="warning" :closable="false">
        </el-alert>
        <div class="font14 mt20">
            <span>{{$t('dialog.tipPart0')}}</span>  
            <span @click="toggleClass = !toggleClass">
                <a>{{$t('dialog.tipPart1')}}</a>
                <i :class="{'el-icon-arrow-up':toggleClass,'el-icon-arrow-down':!toggleClass}" class="font12">
                </i>
            </span>
            <span>{{ $t('dialog.restartEcsInst.tipPart2') }}</span>
        </div>
        <el-alert v-show="toggleClass" class="font12 mt5" type="info" :closable="false" :title="rowItem.id +  ' / ' + rowItem.name">            
        </el-alert>
        <div class="mt20">
            <span class="title font14">{{ $t('dialog.restartEcsInst.restartType') }}</span>
            <el-radio v-model="radio" label="SOFT">{{ $t('dialog.restartEcsInst.restart') }}</el-radio>
            <el-radio v-model="radio" label="HARD">{{ $t('dialog.restartEcsInst.forceRestart') }}</el-radio>
        </div>
        <el-alert v-show="radio ===5" class="font12 mt20" type="warning" :closable="false" title="">
            <div>
                <p>{{ $t('dialog.restartEcsInst.forceRestartTip') }}</p>
                <el-checkbox v-model="isForcechecked">{{ $t('dialog.restartEcsInst.checkboxOfForceRestart') }}</el-checkbox>
            </div>
        </el-alert>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="cancel" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :disabled="loading || (radio === 5 && !isForcechecked)" :loading="loading">{{ $t('common.ok') }}</el-button>            
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            radio: 'SOFT',
            toggleClass:false,
            isForcechecked:false,
            rowItem:{}
        };
    },
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;

            this.rowItem = {};
            this.radio = 4;
            this.isForcechecked = false;
            this.toggleClass = false;
            this.loading = false;
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
            this.resolve(this);
            //this.hide();
        }
    }
};
</script>
<style lang="scss" scoped>
.stopCaseDialog{
    font-size: 12px;
    .title{
        margin-right: 20px;
    }
}
</style>
