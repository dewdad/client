<template>
    <el-dialog :title="$t('common.deleteButtonText')" :visible.sync="isShow" width="500px" class="zt-dialog" @close="cancel"> 
        <div class="title img-text-center">
            <i class="el-icon-warning"></i>
            <span>{{ $t('dialog.deleteEcsInst.tipPart0') }}</span>  
            <span @click="toggleClass = !toggleClass">
                <a>{{ $t('dialog.deleteEcsInst.tipPart1') }} </a>
                <i :class="{'el-icon-arrow-up':toggleClass,'el-icon-arrow-down':!toggleClass}" class="font12">
                </i>
            </span>
            <span> {{ $t('dialog.deleteEcsInst.tipPart2') }}</span>
        </div>
        <div class="zt-alert">
            <el-alert v-show="toggleClass" class="font12 mt5" type="info" :closable="false" :title="rowItem.id +  ' / ' + rowItem.name">            
            </el-alert>
        </div>

        <!-- <el-alert class="font12 mt20" type="warning" :closable="false" title="">
            <div>
                {{ $t('dialog.deleteEcsInst.alert') }}              
            </div>
        </el-alert> -->
              
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="cancel" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>
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
            toggleClass:false,           
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
            this.rowItem = {};
            this.toggleClass = false;
            this.loading = false;

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
            this.resolve(this);
            //this.hide();
        }
    }
};
</script>
<style lang="scss" scoped>
.zt-dialog{
    font-size: 12px;  
    .title {
        font-size: 14px;      
        vertical-align:center;
        .el-icon-warning {
            font-size:28px;
            color:#f60;
            margin-right:10px;          
        }
    } 
    .zt-alert {
        padding:0 38px;
    } 
    
}
</style>
