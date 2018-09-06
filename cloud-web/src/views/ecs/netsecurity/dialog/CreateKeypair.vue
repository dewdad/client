<template>
    <el-dialog title="创建密钥对" :visible.sync="isShow" width="600px" class="CreateKeypair" @close="cancel">
        <div style="padding-right:120px;">
            <zt-form inline-message class="wd403" ref="ruleForm" size="small" :model="form" label-width="100px" :rules="rules">
                <zt-form-item label="密钥对名称" class="mb0" prop="keyPairName">
                    <el-input size="small" v-model="form.keyPairName" maxlength="64" placeholder="请输入密钥对名称"></el-input>
                    <div class="input-help">长度限制为2-64个字符, 只能由中文字符、英文字母、数字、下划线、中划线组成</div>
                </zt-form-item>
                <zt-form-item label="创建类型" class="mb0" prop="radioType" :rules="[{
                        required: true,
                        message: '请选择创建类型',
                        trigger: ['submit']
                    }]">
                    <el-radio v-model="form.radioType" label="auto">自动新建密钥对</el-radio>
                    <el-radio v-model="form.radioType" label="import">导入已有密钥对</el-radio>
                    <div v-if="form.radioType === 'auto'" class="input-help">创建完成后请一定下载私钥，您只有一下载私钥的机会。</div>
                </zt-form-item>
                <zt-form-item v-if="form.radioType === 'import'" label="公钥内容" class="mb0" prop="keyContent" :rules="[{
                        required: true,
                        message: '请导入已有密钥对',
                        trigger: ['submit']
                    }]">
                    <el-input type="textarea" size="small" :autosize="{ minRows: 6, maxRows: 10}" v-model="form.keyContent" placeholder=""></el-input>
                    <div class="input-help">(Base64编码)
                        <a class="finger-cursor">导入样例</a>
                    </div>
                </zt-form-item>
            </zt-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {createKeypairs} from '@/service/ecs/keypairs.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            form: {
                radioType: 'auto',
                keyPairName: '',
                keyContent: ''
            },
            rules: {
                keyPairName: [
                    {
                        required: true,
                        message: '请输入密钥对名称',
                        trigger: ['submit']
                    },
                    {
                        min: 2,
                        max: 64,
                        message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9-_]+$/,
                        message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props: {},
    watch: {
        isShow(val) {
            if (!val) {
                this.form.radioType = 'auto';
                this.form.keyPairName = '';
                this.form.keyContent = '';
                this.$refs.ruleForm.clearValidate();
            }
        }
    },
    methods: {
        show(rowItem) {
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
            this.$refs.ruleForm.validate(valid => {
                if(valid) {
                    this.confirmBtn = true;
                    let data = {
                        name: this.form.keyPairName,
                        crtype: this.form.radioType
                    };
                    if (this.form.radioType === 'import') {
                        data['content'] = this.form.keyContent;
                    }
                    console.warn(data);
                    createKeypairs(data)
                        .then(res => {
                            if (res.code === '0000') {
                                this.$message.success('操作成功');
                                this.resolve(data);
                                this.hide();
                            }
                        })
                        .catch(err => {
                            $log(err);
                        }).finally(() => {
                            this.confirmBtn = false;
                        });
                }
            });
            
        }
    }
};
</script>
<style lang="scss">
.CreateKeypair {
    .tip {
        background-color: #fbf7cf;
        padding: 15px 30px;
        color: #f68300;
        border: 1px solid #f6e0c4;
        ul,
        li {
            list-style-type: disc;
        }
    }
    .enterPwd {
        display: flex;
        justify-content: center;
        span.title {
            flex: 1;
            padding-top: 10px;
            padding-left: 20px;
        }
        .right {
            flex: 4;
            div {
                width: 300px;
            }
            .existKeypair textarea {
                min-width: 280px;
                max-width: 280px;
                min-height: 200px;
                max-height: 200px;
                border-radius: 5px;
                resize: none;
            }
        }
        .el-input {
            input {
                width: 300px;
            }
        }
    }
}
</style>
