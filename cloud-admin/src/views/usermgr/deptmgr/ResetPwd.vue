<template>
    <el-dialog title="修改密码" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="新密码" prop="newPwd" :label-width="formLabelWidth">
                <el-input placeholder="输入新密码" v-model="form.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd" :label-width="formLabelWidth">
                <el-input placeholder="再次输入密码" v-model="form.confirmPwd"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                <el-input placeholder="再次输入密码" v-model="form.username"></el-input>
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
            form:{
                newPwd:'',
                username:'',
                confirmPwd:''
            },
            rules:{
                newPwd: [
                    { required: true, message: '请输旧密码', trigger: 'blur,submit' }
                ],
                confirmPwd: [
                    { required: true, message: '请确认密码', trigger: 'blur,submit' }
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
            this.confirmBtn = true;
            this.form.userId = this.user.id;
            this.form.userName = this.user.name;
            console.log('this.user',this.user);
            console.log('this.form',this.form);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    pwdChange(this.form)
                        .then(res => {
                            if(res.code === '0000'){
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

</style>
