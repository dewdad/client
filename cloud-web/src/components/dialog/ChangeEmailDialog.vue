<template>
    <el-dialog title="绑定邮箱" :visible.sync="isShow" width="600px"  class="change-pwd" @close="cancel" v-dialogDrag>
        <el-form inline-message size="small" label-width="85px" :model="form" ref="form" :rules="rules">
            <el-form-item label="邮箱地址" prop="email">
                <el-input type="text" placeholder="请输入邮箱地址" v-model="form.email"></el-input>
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
import {updateUserInfoDetail} from '@/service/user.js';
import {EMAIL_REGEXP} from '@/constants/regexp.js';
export default {
    data() {
        const checkEmail = (rule, value, callback) => {
            let email = this.form.email;
            if (!email) {
                return callback();
            }
            console.log(EMAIL_REGEXP.test(email), email);

            if (!EMAIL_REGEXP.test(email)) {
                callback(this.$t('account.emailIsError'));
            }
            return callback();
        };
        return{            
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            form:{
                email: ''
            },
            rules:{
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur,submit' },
                    { validator: checkEmail, message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
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
            this.form.id = id;
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
                email: '',
                id: ''
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
            if(!this.form.id) return; 
            
            this.$refs.form.validate( (valid) => {
                alert(2);
                if (valid) {
                    this.loading = true;                    
                    updateUserInfoDetail(this.form)
                        .then(res => {
                            this.loading = false;
                            if(res && res.code === this.CODE.SUCCESS_CODE){
                                this.resolve();
                                this.hide(); 
                            }
                        })
                        .catch(err => {
                            $log(err);
                            this.loading = false;                            
                        });
                } else {
                    console.log('error submit!!');
                    alert(2);
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
