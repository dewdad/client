<template>
    <el-dialog title="填写联系人资料" :visible.sync="isShow" width="600px" class="LinkmanDialog">
        <zt-form inline-message class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
            <!-- 磁盘ID -->
            <zt-form-item label="姓名" prop="name" >
                <el-input size="small" maxlength="30" v-model="ruleForm.name" :disabled="dialogType === 0" placeholder="请输入联系人姓名"></el-input>
                <span class="input-help">姓名以中英文开始，长度2-30位、可由英文字母、数字、"."、下划线组成</span>
            </zt-form-item>
            <!-- 实例ID/名称 -->
            <zt-form-item label="手机号码" prop="mobile">
                <el-input size="small" maxlength="11" v-model="ruleForm.mobile" :class="{'color-secondary': dialogType === 0}" :disabled="dialogType === 0" placeholder="请输入联系人手机号码"></el-input>
            </zt-form-item>
            <!-- 磁盘属性 -->
            <zt-form-item label="邮箱地址" prop="email">
                <el-input size="small" v-model="ruleForm.email" :disabled="dialogType === 0" placeholder="请输入联系人邮箱地址"></el-input>
            </zt-form-item>
            <!-- 快照名称 -->
            <zt-form-item label="职位">
                <el-input size="small" v-model="ruleForm.position" placeholder="请输入联系人职位"></el-input>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm" >确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {MOBILE_REGEXP, EMAIL_REGEXP, ZY_START} from '@/constants/regexp.js';
import {addContact, amendContact} from '@/service/user';

import {mapGetters} from 'vuex';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            linkManData: {},
            ruleForm:{
                name: '',
                mobile: '',
                email: '',
                position: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'submit' },
                    {
                        min: 2,
                        max: 30,
                        message: this.$t('form.error.username.length2_32'),
                        trigger: ['blur']
                    },
                    {
                        pattern: ZY_START,
                        message: this.$t('form.input.formatError'),
                        trigger: ['blur']
                    }
                ],
                mobile: [
                    { required: true, message: '请输入手机号码', trigger: 'submit' },
                    {
                        pattern: MOBILE_REGEXP,
                        message: this.$t('register.mobileIsError'),
                        trigger: ['blur']
                    },
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'submit' },
                    {
                        pattern: EMAIL_REGEXP,
                        message: this.$t('account.emailIsError'),
                        trigger: ['blur']
                    },
                ]
            },
            dialogType: 1,
            linkId: ''
        };
    },
    watch: {
        isShow(val) {
            if(!val){
                this.$refs['ruleForm'].resetFields();
                this.ruleForm.name = '';
                this.ruleForm.mobile = '';
                this.ruleForm.email = '';
                this.ruleForm.position = '';
                this.linkId = '';
            }
        }
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        show(rowItem, type) {
            this.dialogType = type;
            console.warn(rowItem);
            if(rowItem) {
                this.ruleForm.name = rowItem.name;
                this.ruleForm.mobile = rowItem.mobile;
                this.ruleForm.email = rowItem.email;
                this.ruleForm.position = rowItem.position;
                this.linkId = rowItem.id;
            }
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
            this.hide();
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
            this.linkManData = {};
            this.$set(this.linkManData, 'name', this.ruleForm.name);
            this.$set(this.linkManData, 'mobile', this.ruleForm.mobile);
            this.$set(this.linkManData, 'email', this.ruleForm.email);
            this.$set(this.linkManData, 'position', this.ruleForm.position);
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    // 默认为添加联系人
                    let operateContact = addContact;
                    if (this.dialogType === 2) {
                        operateContact = amendContact; // 修改联系人
                        this.$set(this.linkManData, 'id', this.linkId);
                    }
                    let data = {
                        ...this.linkManData
                    };
                    try {
                        operateContact(data)
                            .then(ret => {
                                $log('操作成功', ret);
                                this.hide();
                                this.resolve(ret);
                            })
                            .catch((err) => {
                            });
                    } catch (error) {
                        $log('beforeSend 执行失败', error.message);
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.LinkmanDialog {
    .demo-ruleForm{
        width: 80%;
        padding-left: 20px;
    }
    .input-help{
        line-height: 18px;
    }
}
</style>