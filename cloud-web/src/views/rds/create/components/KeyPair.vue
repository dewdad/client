<template>
    <zt-form :model="form" ref="keyPairform" class="show-icon keyPairform" :show-message="true" inline-message :rules="rules" label-width="95px" size="small">
        <zt-form-item id="password1" key="password1" label="主密码" prop="password1" :showRule="true" style="width:395px;" :class="{'hide-star': true, 'hide-message': form.password1 === ''}" >
            <el-input v-model="form.password1" :type="showPwd1 ? 'text' : 'password'" placeholder="请输入主密码">
                <i :class="pwdIcon1" slot="suffix" @click="togglePwd(1)"></i>
            </el-input>
        </zt-form-item>
        <zt-form-item id="password2" key="password2" label="确认密码" prop="password2" style="width:395px;" :class="{'hide-star': true, 'hide-message': form.password2 === '', 'mb0': true}">
            <el-input v-model="form.password2" :type="showPwd2 ? 'text' : 'password'"  placeholder="请输入确认密码">
                <i :class="pwdIcon2" slot="suffix" @click="togglePwd(2)"></i>
            </el-input>
        </zt-form-item>
    </zt-form>
</template>
<script>
import {PASSWORD_REGEXP, INST_PASSWORD} from '@/constants/regexp';
import {mapState} from 'vuex';
export default {
    name: 'KeyPair',
    data() {
        // 验证两次密码是否输入一至
        const validatePass = (rule, value, callback) => {
            if (value && this.form.password1 && value !== this.form.password1) {
                callback(new Error(this.$t('register.passIsUnEqual')));
                return;
            }
            callback();
        };
        // const validateKey = (rule, value, callback) => {
        //     if (this.form.loginType === '1' && value === '') {
        //         callback(new Error('请选择密钥对'));
        //         return;
        //     }
        //     callback();
        // };
        return {
            loading: false,
            showPwd1: false,
            showPwd2: false,
            form: {
                loginType: '2',
                password1: '',
                password2: '',
                keyname: ''
            },
            keyPairList: [],
            rules: {
                password1: [
                    {
                        required: true,
                        message: this.$t('form.input.ecsPassword'),
                        trigger: ['submit']
                    },
                    {
                        min: 8,
                        max: 30,
                        show: true,
                        tipsMessage: this.$t('valid.password.length'),
                        message: this.$t('register.loginPassIsError'),
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: PASSWORD_REGEXP,
                        show: true,
                        tipsMessage: this.$t('valid.password.char'),
                        message: this.$t('register.loginPassIsError'),
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: INST_PASSWORD,
                        show: true,
                        tipsMessage: this.$t('valid.password.regex'),
                        message: this.$t('register.loginPassIsError'),
                        trigger: ['submit', 'blur']
                    }
                ],
                password2: [
                    {
                        required: true,
                        message: this.$t('form.input.ecsconfirmPassword'),
                        trigger: ['submit']
                    },
                    {validator: validatePass, trigger: ['submit', 'blur']}
                ]
            }
        };
    },
    props: {
        value: Object
    },
    watch: {
        'form.loginType': function(newval) {
            this.form.password1 = '';
            this.form.password2 = '';
            this.form.keyname = '';
        },
        form: {
            deep: true,
            handler: function(newval) {
                this.setValue();
            }
        },
        loading: function(newval) {
            this.$emit('loading', newval);
        }
    },
    computed: {
        ...mapState({
            createRdsFormData: state => state.createRdsFormData
        }),
        pwdIcon1() {
            return this.showPwd1 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        },
        pwdIcon2() {
            return this.showPwd2 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        }
    },
    created() {
    },
    methods: {
        // 切换明暗文
        togglePwd(val) {
            if (val === 1) {
                this.showPwd1 = !this.showPwd1;
            } else if (val === 2) {
                this.showPwd2 = !this.showPwd2;
            }
        },
        /**
         * 设置组件的v-model值
         */
        setValue() {
            let value = this.form;
            this.$emit('input', value);
        }
    }
};
</script>

