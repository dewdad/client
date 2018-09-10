<template>
    <el-dialog :title="title" :visible.sync="isShow" width="500px" class="zt-dialog" @close="cancel">
        <div class="title img-text-center">
            <i class="el-icon-warning"></i>
            <span>您所选的</span>
            <span @click="toggleClass = !toggleClass">
                <a>1个实例</a>
                <i :class="{'el-icon-arrow-up':toggleClass,'el-icon-arrow-down':!toggleClass}" class="font12">
                </i>
            </span>
            <span>将执行{{title}}操作，您是否确认操作？</span>
        </div>
        <div class="zt-alert">
            <el-alert v-if="toggleClass" class="font12 mt5" type="info" :closable="false" :title="rowItem.id +  ' / ' + rowItem.name">
            </el-alert>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {revertResize, flavorConfirm} from '@/service/ecs/list';
import {sleep} from '@/utils/utils';
export default {
    data() {
        return {
            isShow: false,
            title: '',
            resolve: null,
            reject: null,
            loading: false,
            toggleClass: false,
            rowItem: {}
        };
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.rowItem = {};
                this.toggleClass = false;
                this.loading = false;
            }
        }
    },
    methods: {
        show(rowItem, title) {
            this.rowItem = rowItem;
            this.title = title;
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
            typeof this.reject() === 'function' && this.reject();
        },
        confirm() {
            this.loading = true;
            let handle = revertResize;
            if (this.title === '确认') handle = flavorConfirm;
            handle(this.rowItem.id).then(async (res) => {
                if (res.code === '0000') {
                    await sleep(3000);
                    this.resolve();
                    this.hide();
                    this.$message.success('操作成功');
                }
            }).catch(err => {
                $log(err);
            }).finally(() => {
                this.loading = false;
            });
            
            //this.hide();
        }
    }
};
</script>
<style lang="scss" scoped>
.zt-dialog {
    font-size: 12px;
    .title {
        font-size: 14px;
        vertical-align: center;
        .el-icon-warning {
            font-size: 28px;
            color: #f60;
            margin-right: 10px;
        }
    }
    .zt-alert {
        padding: 0 38px;
    }
}
</style>
