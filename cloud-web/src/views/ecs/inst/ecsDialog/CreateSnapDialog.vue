<template>
    <el-dialog title="创建快照" :visible.sync="isShow" width="600px" class="CreateSnapDialog" @close="cancel">
        <!-- tip提示 -->
        <el-alert  title="" type="warning" :closable="false">
            <span class="font12">为了保证快照创建成功，正在创建快照时，您不能修改ECS实例状态，比如停止或重启ECS实例，请耐心等待。</span>
        </el-alert>
        <zt-form inline-message class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
            <!-- 磁盘ID -->
            <zt-form-item label="磁盘ID">
                <span>{{rowItem.id}}</span>
            </zt-form-item>
            <!-- 实例ID/名称 -->
            <zt-form-item label="实例ID/名称">
                <span>{{rowItem.name || '-'}}</span>
            </zt-form-item>
            <!-- 快照名称 -->
            <zt-form-item label="快照名称" prop="snapshotName">
                <el-input size="small" v-model="ruleForm.snapshotName"></el-input>
                <span class="input-help">快照名称为2-128个字符，快照名不能以auto开头。</span>
            </zt-form-item>
        </zt-form>
        
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false" :disabled="loading">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {createSnapshot} from '@/service/ecs/snapshot.js';

export default {
    data() {
        const checkName = (rule, value, callback) => {
            if (value && value.indexOf('auto') === 0) {
                callback(new Error('不能以auto开头'));
                return;
            }
            callback();
        };
        return {
            loading: false,
            isShow: false,
            resolve: null,
            reject: null,
            rowItem: {},
            ruleForm:{
                snapshotName: ''
            },
            rules: {
                snapshotName: [
                    { required: true, message: '必填项', trigger: ['submit'] },
                    { min: 2, max: 64, message: '2-128个字符', trigger: ['submit', 'blur'] },
                    { validator: checkName, message: '不能以auto开头', trigger: ['submit', 'blur'] }
                ]
            }
        };
    },
    watch: {
        isShow(val) {
            if(!val){
                this.ruleForm.snapshotName = '';
                this.$refs['ruleForm'].clearValidate();
            }
        }
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
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let data = {
                        volumeId: this.rowItem.id,
                        name: this.ruleForm.snapshotName
                    };
                    this.loading = true;
                    //提交后台
                    createSnapshot({...data}).then(
                        res => {
                            if (res.code === '0000') {
                                this.hide();
                                this.$message.success('操作成功');
                                this.resolve();
                            }
                        }
                    ).catch(err => {
                        $log(err);
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.CreateSnapDialog {
    .tip {
        background-color: #fbf7cf;
        padding: 15px 30px;
        color: #f68300;
        border: 1px solid #f6e0c4;
    }
    .demo-ruleForm{
        width: 80%;
        padding-left: 20px;
    }
}
</style>
