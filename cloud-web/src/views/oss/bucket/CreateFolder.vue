<template>
    <el-dialog v-if="isShow" title="新建目录" :visible.sync="isShow" width="600px" :append-to-body="true" @close="cancel">
        <div class="form" style="padding-right:130px;">
            <zt-form ref="myForm" label-width="110px" :model="myForm" size="small" :rules="rules" inline-message>
                <zt-form-item label="目录名" prop="dirname">
                    <el-input v-model="myForm.dirname" placeholder="请输入目录名称"></el-input>
                    <span class="input-help">
                        目录命名规范：<br/> 1.不允许使用表情符，请使用符合要求的UTF-8字符
                        <br/> 2.「/」用于分割路径，可快速创建子目录，但，不要以「/」打头，不要出现连续的「/」
                        <br/> 3.不允许出现名为「..」的子目录
                        <br/> 4.总长度控制在1-254个字符
                    </span>
                </zt-form-item>
            </zt-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="info" @click="cancel" size="small">取消</el-button>
            <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {createDir} from '@/service/oss/filemgr';
export default {
    name: 'CreateFolder',
    data() {
        // 验证目录方法
        const validateDirname = (rule, value, callback) => {
            let pattern1 = /^\//;
            let pattern2 = /\/{2,}/;
            let pattern3 = /\/\.\.\//;
            let pattern4 = /\/\.\.$/;
            if (pattern1.test(value) || pattern2.test(value) || pattern3.test(value) || pattern4.test(value) || value.trim() === '..' || value.trim().indexOf('../') === 0) {
                callback(new Error('不符合命名规范'));
            }
            callback();
        };
        return {
            isShow: false,
            isSubmit: false,
            reject: null,
            resolve: null,
            myForm: {
                dirname: ''
            },
            rules: {
                dirname: [
                    {
                        required: true,
                        message: '请输入目录名称',
                        trigger: ['submit']
                    },
                    {validator: validateDirname, trigger: ['submit', 'blur']},
                    {
                        min: 1,
                        max: 124,
                        message: '名称长度在1-124个字符之间',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props: {
        path: String,
        bucketId: String
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
                dirname: ''
            };
        },
        cancel() {
            this.close();
        },
        confirm() {
            this.$refs['myForm'].validate(valid => {
                if (valid) {
                    this.isSubmit = true;
                    let prefix = this.path + this.myForm.dirname;
                    createDir(this.bucketId, prefix)
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
                            $log('创建目录失败', err);
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
