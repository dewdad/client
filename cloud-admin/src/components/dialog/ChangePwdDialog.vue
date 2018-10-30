<template>
    <el-dialog title="修改密码" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="旧密码 " prop="oldPwd" :label-width="formLabelWidth">
                <el-input placeholder="输入密码" v-model="form.oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd" :label-width="formLabelWidth">
                <el-input placeholder="输入新密码" v-model="form.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd" :label-width="formLabelWidth">
                <el-input placeholder="再次输入密码" v-model="form.confirmPwd" v-bind:class="{ borderRed: invalidPsd }" @blur="checkPwd" @change="checkPwd"></el-input>
                <div v-if="invalidPsd" style="color: #f56c6c;font-size: 12px;text-align:left;line-height:1.6">两次密码不一致</div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {pwdChange} from '@/service/user.js';
export default {
    data() {
        return{
            formLabelWidth: '120px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            invalidPsd:false,
            form:{
                newPwd:'',
                oldPwd:'',
                confirmPwd:''
            },
            rules:{
                newPwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                oldPwd: [
                    { required: true, message: '请输旧密码', trigger: 'blur' }
                ],
                confirmPwd: [
                    { required: true, message: '请确认密码', trigger: 'blur' }
                ]

            }
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    props: {},
    methods: {
        show() {
            this.isShow = true;
            this.form.newPwd = '';
            this.form.oldPwd = '';
            this.form.confirmPwd = '';
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        hide() {
            this.isShow = false;

        },
        checkPwd(){
            if(this.form.newPwd !== this.form.confirmPwd) {
                this.invalidPsd = true;
            } else {
                this.invalidPsd = false;
            }
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

            this.form.userId = this.user.id;
            this.form.userName = this.user.name;
            if(this.form.newPwd !== this.form.confirmPwd) {
                this.invalidPsd = true;
                return;
            } else {
                this.invalidPsd = false;
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.confirmBtn = true;
                    pwdChange(this.form)
                        .then(res => {
                            console.log('res',res);
                            if(res.data.code === '0000'){
                                this.resolve(this.form);
                                this.hide();
                                this.setting();
                                this.confirmBtn = false;
                            }else{
                                this.$alert('修改失败', '提示', {
                                    type: 'error'
                                });
                                this.confirmBtn = false;
                                return;
                            }
                        })
                        .catch(err => {
                            this.confirmBtn = false;
                            this.$alert(err, '提示', {
                                type: 'error'
                            });
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
};
</script>
<style lang="scss">
    .borderRed input{
        border-color:#f56c6c !important;
    }
</style>
