<template>
    <el-dialog title="创建磁盘" :visible.sync="isShow" width="600px" class="CreateSnapDialog" @close="cancel">
        <zt-form inline-message class="mt20 demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
            <!-- 快照ID -->
            <zt-form-item label="快照ID">
                <span>{{ruleForm.id}}</span>
            </zt-form-item>
            <!-- 磁盘大小 -->
            <zt-form-item label="磁盘大小" prop="size">
               <el-input-number size="small" style="width: 100%" :min="50" :step="1" :precision="0" controls-position="right" v-model="ruleForm.size"></el-input-number>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disabled="loading">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {createDisk} from '@/service/ecs/snapshot.js';

export default {
    data() {
        return {
            loading: false,
            isShow: false,
            resolve: null,
            reject: null,
            rowItem: {},
            ruleForm: {
                size: '',
            },
            rules: {
                size: [
                    {required: true, message: '请填写磁盘大小', trigger: ['submit']},
                ]
            }
        };
    },
    watch: {
        isShow(val) {
            if (!val) {
                this.ruleForm.id = '';
                this.ruleForm.size = '';
                this.$refs['ruleForm'].clearValidate();
            }
        }
    },
    methods: {
        show(row) {
            this.ruleForm.id = row.id;
            this.rowItem = row;
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
                    let data = {
                        snapshotId: this.rowItem.id,
                        size: this.ruleForm.size
                    };
                    this.loading = true;
                    //提交后台
                    createDisk({...data})
                        .then(res => {
                            if (res.code === '0000') {
                                this.hide();
                                this.$message.success('操作成功');
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
    .demo-ruleForm {
        width: 80%;
        padding-left: 20px;
    }
}
</style>
