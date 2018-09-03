<template>
    <el-dialog v-if="isShow" title="创建RDS备份" :visible.sync="isShow" width="600px" :append-to-body="true" @close="cancel">
        <div class="form" style="padding-right:180px;">
            <zt-form ref="myForm" v-loading="isSubmit" loading="empty" label-width="110px" :model="myForm" size="small" :rules="rules" inline-message>
                <zt-form-item label="备份实例">
                    {{instName}}
                </zt-form-item>
                <zt-form-item label="备份名称" prop="name">
                    <el-input v-model="myForm.name" placeholder="请输入备份名称"></el-input>
                    <span class="input-help">
                         名称在4位到64位之间，必须以字母开头，不区分大小写，可以包含字母、数字、中划线或下划线，不能包含其他特殊字符。
                    </span>
                </zt-form-item>
                <zt-form-item label="备份描述">
                    <el-input v-model="myForm.description" maxlength="256" placeholder=""></el-input>
                </zt-form-item>
            </zt-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">{{isSubmit ? '正在创建' : '确定'}}</el-button>
            <el-button type="info" @click="cancel" size="small">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {RDS_BACKUP_NAME_REGEXP} from '@/constants/regexp';
import {createSnapShot} from '@/service/rds/list';
export default {
    name: 'Backup',
    data() {
        return {
            isShow: false,
            isSubmit: false,
            reject: null,
            resolve: null,
            myForm: {
                name: '',
                description: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入备份名称',
                        trigger: ['blur', 'change']
                    },
                    {
                        pattern: RDS_BACKUP_NAME_REGEXP,
                        message: '请以字母开头且不能包含其他特殊字符。',
                        trigger: ['blur', 'change']
                    },
                    {
                        min: 4,
                        max: 64,
                        message: '名称长度在4-64个字符之间',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    props: {
        instName: String,
        instId: String
    },
    methods: {
        show() {
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            this.isShow = false;
            // 重置表单值
            this.myForm = {
                name: '',
                description: ''
            };
        },
        cancel() {
            this.close();
        },
        // 提交表单
        confirm() {
            this.$refs['myForm'].validate(valid => {
                if (valid) {
                    this.isSubmit = true;
                    createSnapShot(this.instId, this.myForm.name, this.myForm.description)
                        .then(res => {
                            this.isSubmit = false;
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message({
                                    message: '创建成功',
                                    type: 'success'
                                });
                                this.resolve(res);
                                this.close();
                            }
                        })
                        .catch(err => {
                            this.isSubmit = false;
                            $log('创建失败', err);
                        });
                }
            });
        }
    }
};
</script>
<style scoped>
.createBody {
    padding: 10px;
}
</style>
