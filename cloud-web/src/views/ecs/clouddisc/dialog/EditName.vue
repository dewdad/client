<template>
    <el-dialog
        title="编辑磁盘名称"
        :visible.sync="isShow"
        width="600px"
        class="amendNameDialog"
        @close="cancel">
        <zt-form inline-message class="wd403" ref="ruleForm" size="small"
        :model="form" label-width="85px" :rules="rules">
            <!-- 实例名称 -->
            <zt-form-item label="磁盘名称" class="mb0" prop="name">
                <el-input size="small" v-model="form.name" maxlength="64"></el-input>
                <div slot="help" class="input-help">长度限制为2-64个字符, 只能由中文字符、英文字母、数字、下划线、中划线组成</div>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info"  @click="isShow=false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary"  @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {INST_NAME} from '@/constants/regexp';
import {updateDisk} from '@/service/ecs/disk/disk';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            requestFn: null,
            form: {
                id: '',
                name:''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入磁盘名称',
                        trigger: ['submit']
                    },
                    {
                        min: 2,
                        max: 64,
                        message: '名称输入有误',                       
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: INST_NAME,
                        message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props:{       
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.form.name = '';
                this.loading = false;
                this.$refs['ruleForm'].clearValidate();
            }
        }
    },
    methods: {
        show({name, id}) {
            this.form.name = name;
            this.form.id = id;
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
                    this.loading = true;
                    updateDisk({...this.form}).then(res => {
                        if (res.code === '0000') {
                            this.$message.success('操作成功');
                            this.hide();
                            this.resolve();
                        }
                    }).catch(err => {
                        $log(err);
                    }).finally(() => {
                        this.loading = false;
                    });
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
