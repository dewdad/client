<template>
    <el-dialog :title="form.id ? '修改安全组':'添加安全组'" :visible.sync="isShow" width="600px" class="amendNameDialog" @close="cancel">
        <div style="padding-right:150px;">
        <zt-form inline-message  ref="ruleForm" size="small" :model="form" label-width="100px" :rules="rules">
            <!-- 安全组名称 -->
            <zt-form-item label="安全组名称"  prop="name" class="cdcd">
                <el-input size="small" v-model="form.name" maxlength="64"></el-input>
                <div class="input-help">长度限制为2-64个字符, 只能由中文字符、英文字母、数字、下划线、中划线组成</div>
            </zt-form-item>
            <!-- 安全组描述 -->
            <zt-form-item label="安全组描述" class="mb0 cdcd" prop="description">
                <el-input size="small" v-model="form.description" maxlength="128"></el-input>
                <div class="input-help">长度为2-128个字符，不能以http://或https://开头。</div>
            </zt-form-item>
        </zt-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow=false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {INST_NAME} from '@/constants/regexp';
import {modifyGroup, createGroup} from '@/service/ecs/security';
export default {
    data() {
        const checkDesc = (rule, value, callback) => {
            if (value && (value.indexOf('https://') === 0 || value.indexOf('http://') === 0) ) {
                callback(new Error('输入有误'));
                return;
            }
            callback();
        };
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            requestFn: null,
            form: {
                id: '',
                name: '',
                description: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入安全组名称',
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
                ],
                description: [
                    {
                        required: true,
                        message: '请输入描述',
                        trigger: ['submit']
                    },
                    {
                        min: 2,
                        max: 128,
                        message: '输入有误',
                        trigger: ['submit', 'blur']
                    },
                    {
                        validator: checkDesc,
                        message: '输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props: {},
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.form.name = '';
                this.form.description = '';
                this.loading = false;
                this.$refs['ruleForm'].clearValidate();
            }
        }
    },
    methods: {
        show({name, id, description}) {
            this.form.name = name;
            this.form.description = description;
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
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.loading = true;
                    let handle = createGroup;
                    if (this.form.id !== '') {
                        handle = modifyGroup;
                    }
                    handle({...this.form})
                        .then(res => {
                            if (res.code === '0000') {
                                this.$message.success('操作成功');
                                this.hide();
                                this.resolve();
                            }
                        })
                        .catch(err => {
                            $log(err);
                        })
                        .finally(() => {
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
    .cdcd .el-form-item__error.el-form-item__error--inline{
        margin-left:300px;
    }
.amendNameDialog {
    .wd403 {
        width: 403px; //85 + 318
    }
    .el-form .el-form-item__label {
        padding-right: 0;
    }
}
</style>
