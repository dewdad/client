<template>
    <el-dialog :title="$t('common.deleteButtonText')" :visible.sync="isShow" width="500px" class="zt-dialog" @close="cancel">
        <div class="title img-text-center">
            <i class="el-icon-warning"></i>
            <span>您所选的</span>
            <span @click="toggleClass = !toggleClass">
                <a>1个{{type}} </a>
                <i :class="{'el-icon-arrow-up':toggleClass,'el-icon-arrow-down':!toggleClass}" class="font12">
                </i>
            </span>
            <span> 将执行{{opName}}操作，您是否确认操作？</span>
        </div>
        <div class="zt-alert">
            <el-alert v-show="toggleClass" class="font12 mt5" type="info" :closable="false" :title="title">
            </el-alert>
        </div>

        <!-- <el-alert class="font12 mt20" type="warning" :closable="false" title="">
            <div>
                {{ $t('dialog.deleteEcsInst.alert') }}              
            </div>
        </el-alert> -->

        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow=false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading">{{ $t('common.ok') }}</el-button>
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
            toggleClass: false,
            callback: null,
            title: '',
            type: '',
            opName: ''
        };
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.callback = {};
                this.toggleClass = false;
                this.loading = false;
                this.type = '';
                this.title = '';
            }
        }
    },
    methods: {
        show(type, title, callback) {
            this.isShow = true;
            this.type = type;
            this.title = title;
            this.callback = callback;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
        },
        cancel() {
            typeof this.reject === 'function' && this.reject();
        },
        confirm() {
            if (typeof this.callback !== 'function') return;
            this.loading = true;
            new Promise((resolve, reject) => {
                return this.callback().then((res) => {
                    if (res.code === '0000') {
                        return resolve();
                    } else {
                        return reject();
                    }
                });
            }).then(() => {
                this.hide();
                this.loading = false;
                this.resolve();
            }).catch(() => {
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
