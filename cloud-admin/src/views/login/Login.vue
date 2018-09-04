<template>
    <div class="login-box">
        <div class="login-form">
            <el-card class="box-card">
                <div slot="header" class="clearfix text-center">
                    <span >欢迎使用证通云服务</span>
                </div>
                <el-form ref="form" :model="form" label-width="0" :rules="rules">
                    <el-form-item>
                        <el-input v-model="form.username" placeholder="请输入账号名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" long @click="submit">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
import {userLogin} from '@/service/login';
import {mapGetters} from 'vuex';
export default {
    data() {
        // 验证邮箱或手机号码
        const validatorUserName = async (rule, value, callback) => {

            if (value) {

                console.log('checkUserName');

            }
            callback();
        };
        return {
            errorMsg: '',
            // 错误框
            errorInput: '',
            // 显示常用邮件选择框
            isShow: true,
            // 登录中
            isLoging: false,
            // 点击登录后设为true
            isSubmit: false,
            // 登录实体
            form: {
                username: '',
                password: ''
            },
            // 表单验证规则
            rules: {
                username: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit']
                    },
                    {
                        validator: validatorUserName,
                        message: '用户名错误',
                        trigger: ['submit', 'blur']
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit']
                    }
                ]
            }
        };
    },

    props: {},

    components: {},

    computed: {
        ...mapGetters(['loginFailNums', 'isIdentity'])
    },

    created() {},

    methods: {
        // 验证表单域 filed: 验证字段
        async checkData(field) {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate(field, message => {
                    console.log('checkData', field, message);
                    if (message) {
                        this.errorMsg = message;
                        this.errorInput = field;
                        // 错误框自动获取焦点
                        reject({message, field});
                    } else {
                        if (field === this.errorInput) {
                            this.errorMsg = '';
                            this.errorInput = '';
                        }
                        resolve();

                    }
                });
            });
        },
        // input框失去焦点事件
        inputBlur(input, e) {
            // 如果当前失去焦点对象与错误对象且点击过登录按钮时 验证INPUT
            console.log('errorInput', this.errorInput === input);
            console.log('isSubmit', this.isSubmit);
            let value = '';
            value = this.form[input];
            // 为空时移除验证结果
            if (value === '') {
                this.$refs.form.clearValidate([input]);
                return;
            }
            if (value && this.errorInput === input && this.isSubmit) {
                this.checkData(input).catch(err => {
                    $log(err);
                });
            }
        },
        inputFocus(input, e) {
            $log('fsd');
            if (this.errorInput === input) {
                this.errorMsg = '';
                this.errorInput = '';
            }
        },
        // 提交表单
        async submit() {
            // 验证是否可登录
            // 密码登录
            this.isSubmit = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    // console.log(this.form);
                    this.login();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 登录
        login(type) {
            this.isLoging = true;
            userLogin({
                userName: this.form.username,
                passWord: this.form.password

            })
                .then(async result => {
                    this.isLoging = false;
                    let code = result.data.code;
                    if (code === '0000') {
                        // 记录token
                        this.$store.commit('SET_LOGIN_STATUS', {
                            status: true,

                        });

                        // 记录用户信息
                        this.$store.commit('user/SET_USERINFO', result.data.data);
                        // 如果没有验证过身份

                        this.$router.push({
                            name: 'app.dashboard'
                        });
                    } else {
                        this.errorMsg = result.data.msg;
                    }
                })
                .catch(err => {
                    $log(err);
                    this.isLoging = false;
                    this.errorMsg = 'dsds';
                });
        }
    }
};
</script>
<style lang='scss' scoped>
    .login-box {
        background: url('../../assets/images/login-bg2.jpg');
        background-size: cover;
        background-position: 50%;
        position: relative;
        width: 100%;
        height: 100%;
    }
    .login-form {
        position: absolute;
        right: 160px;
        top: 50%;
        transform: translateY(-60%);
        width: 300px;
    }
</style>