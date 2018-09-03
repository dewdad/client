<template>
    <el-dialog
        :title="title"
        :visible.sync="isShow"
        width="600px"
        class="amendNameDialog"
        @close="cancel">
        <zt-form inline-message class="wd403" ref="ruleForm" size="small"
        :model="form" label-width="85px" :rules="rules">
            <!-- 实例名称 -->
            <zt-form-item :label="label" class="mb0" prop="name">
                <el-input size="small" v-model="form.name" maxlength="64"></el-input>
                <div class="input-help">{{ $t('dialog.editName.inputHelp') }}</div>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="cancel" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {INST_NAME} from '@/constants/regexp';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            title: '',
            label: '',            
            input: '',
            requestFn: null,
            form: {
                name:''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: $t('dialog.editName.name.validator.required'),
                        trigger: ['submit']
                    },
                    {
                        min: 1,
                        max: 64,
                        //show: true,
                        message: $t('dialog.editName.name.validator.max'),                       
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: INST_NAME,
                        //show: true,
                        message: $t('dialog.editName.name.validator.pattern'),
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props:{       
    },
    methods: {
        show({name,title,label}) {
            this.title = title || $t('dialog.editName.title');
            this.label = label || $t('dialog.editName.label');   
            this.form.name = name;

            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;

            this.input = '';
            this.label = '';
            this.title = '';
            this.form.name = '';
            this.loading = false;
            this.$refs['ruleForm'].clearValidate();
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
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.resolve({
                        name:this.form.name,
                        dlg:this,
                    });
                } else {
                    return false;
                }
            });
            //this.hide();  
        }
    }
};
</script>
<style lang="scss">
.amendNameDialog{
    .wd403 {
        width: 403px; //85 + 318     
    }
    .el-form .el-form-item__label {
        padding-right: 0;
    }
}
</style>
