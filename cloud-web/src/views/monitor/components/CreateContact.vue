<template>
    <el-dialog title="创建报警联系人" :visible.sync="isShow" width="600px" class="CreateSnapDialog" @close="cancel">
        <zt-form inline-message class="mt20 demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
            <zt-form-item label="姓名" prop="name">
                <el-input size="small" v-model="ruleForm.name" placeholder="请输入联系人姓名"></el-input>
                <span class="input-help">姓名以中英文字符开始，且长度大于2位，小于30的中文、 英文字母、数字、"."、下划线组成</span>
            </zt-form-item>
            <zt-form-item label="手机号码" prop="phone">
                <el-input size="small" v-model="ruleForm.phone" placeholder="请输入联系人手机"></el-input>
            </zt-form-item>
            <zt-form-item label="短信验证码" class="flex" prop="messageCode">
                <el-input size="small" v-model="ruleForm.messageCode" placeholder="请输入短信验证码"></el-input>
                <mobile-code width="120px" height="32px" btn-text="获取验证码" :mobile="ruleForm.phone" btn-type="default"></mobile-code>
            </zt-form-item>
            <zt-form-item label="邮箱" prop="email">
                <el-input size="small" :on-error="sendError" v-model="ruleForm.email" placeholder="请输入联系人邮箱"></el-input>
            </zt-form-item>
            <zt-form-item label="邮箱验证码" class="flex" prop="emailCode">
                <el-input size="small" v-model="ruleForm.emailCode" placeholder="请输入邮箱验证码"></el-input>
                <email-code style="width: 120px" class="ml10" :data="{email: ruleForm.email}"></email-code>
            </zt-form-item>
        </zt-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disabled="loading">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {alarmNotice, updateAlarmNotice} from '@/service/monitor/alarmRule';
import {MOBILE_REGEXP, EMAIL_REGEXP} from '@/constants/regexp';
import MobileCode from '@/components/common/MobileCode';
import EmailCode from '@/components/common/EmailCode';
export default {
    data() {
        return {
            loading: false,
            isShow: false,
            resolve: null,
            reject: null,
            ruleForm: {
                name: '',
                phone: '',
                messageCode: '',
                email: '',
                emailCode: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: ['submit']},
                    {min: 2, max: 30, message: '2-30个字符', trigger: ['submit', 'blur']},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_.]+$/, message: '格式错误', trigger: ['submit', 'blur']}
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入联系人手机',
                        trigger: ['submit']
                    },
                    {pattern: MOBILE_REGEXP, message: '格式错误', trigger: ['submit', 'blur']}
                ],
                messageCode: [
                    {required: true, message: '请输入短信验证码', trigger: ['submit']}
                    // { min: 2, max: 30, message: '2-30个字符', trigger: ['submit', 'blur'] },
                ],
                email: [
                    {
                        required: true,
                        message: '请输入联系人邮箱',
                        trigger: ['submit']
                    },
                    {pattern: EMAIL_REGEXP, message: '格式错误', trigger: ['submit', 'blur']}
                ],
                emailCode: [
                    {required: true, message: '请输入邮箱验证码', trigger: ['submit']}
                    // { min: 2, max: 30, message: '2-30个字符', trigger: ['submit', 'blur'] },
                ]
            },
            type: 0
        };
    },
    components: {
        MobileCode,
        EmailCode
    },
    watch: {
        isShow(val) {
            if (!val) {
                this.ruleForm = {
                    name: '',
                    phone: '',
                    messageCode: '',
                    email: '',
                    emailCode: ''
                };
                this.$refs['ruleForm'].clearValidate();
            }
        }
    },
    methods: {
        show(type, row) {
            this.isShow = true;
            this.type = type;
            if (row) {
                this.ruleForm = {...row};
            }
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
        confirm() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.loading = true;
                    let handle = alarmNotice;
                    if (this.type === 1) {
                        handle = updateAlarmNotice;
                    }
                    //提交后台
                    handle(this.ruleForm)
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
        },
        sendError: function(msg) {}
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
