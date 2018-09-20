<template>
    <el-dialog title="修改密码" :visible.sync="isShow" width="600px"  class="change-pwd" @close="cancel" v-dialogDrag>
        <el-form inline-message size="small" label-width="85px" :model="form" ref="form" :rules="rules">
            <el-form-item label="旧密码 " prop="oldPwd">
                <el-input type="password" placeholder="输入密码" v-model="form.oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input type="password" placeholder="输入新密码" v-model="form.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd">
                <el-input type="password" placeholder="再次输入密码" v-model="form.confirmPwd"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="cancel" :disabled="loading" size="small">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="loading" :disabled="loading" size="small">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {pwdChange} from '@/service/user.js';
export default {
    data() {
        // 校验密码是否相同
        const ValidatePwdIsSame = (rule, value, callback) => {            
            if(this.form.newPwd && value){
                if(this.form.newPwd !== value){
                    return callback(new Error('两次输入密码不一致'));
                }
            }           
            callback();
        };
        return{            
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            form:{
                newPwd: '',
                oldPwd: '',
                confirmPwd: '',
                userId: '',
                userName: '',
            },
            rules:{
                newPwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur,submit' }
                ],
                oldPwd: [
                    { required: true, message: '请输旧密码', trigger: 'blur,submit' }
                ],
                confirmPwd: [
                    { required: true, message: '请输入确认密码', trigger: 'blur,submit' },
                    { validator: ValidatePwdIsSame, trigger: ['submit', 'blur'] }
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
            let {id,name} = this.user;
            this.form.userId = id;
            this.form.userName = name;

            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        hide() {
            this.isShow = false;

            this.form = {
                newPwd: '',
                oldPwd: '',
                confirmPwd: '',
                userId: '',
                userName: '',
            };
            this.loading = false;
            this.$refs.form.clearValidate();
        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        
        confirm() {
            console.log('confirm');
            if(!this.form.userId) return; 
            this.$refs.form.validate( (valid) => {
                if (valid) {
                    this.loading = true;                   
                    pwdChange(this.form)
                        .then(res => {
                            console.warn(res);
                            this.loading = false;
                            if(res && res.code === this.CODE.SUCCESS_CODE){
                                this.$alert('修改成功，请重新登录', '提示', {
                                    confirmButtonText: '确定',
                                    showClose: false
                                }).then(() => {
                                    this.resolve();
                                    this.hide();   
                                }); 
                                
                            }
                        })
                        .catch(err => {
                            $log(err);
                            this.loading = false;                            
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
.change-pwd {
    .el-form {
        width: 403px; //85 + 318
        .el-form-item__label {
            padding-right: 0;
        }
    }

}
</style>
