import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import PasswordCheck from '@/components/passwordCheck/PasswordCheck';
import ImageCodeInput from '@/components/form/ImageCodeInput';
import MobileCode from '@/components/common/MobileCode';
import { MOBILE_REGEXP, REG_PASSWORD_REGEXP, USERNAME_REGEXP, ALL_NUMBER } from '@/constants/regexp.js';
import { REGISTER_CODE } from '@/constants/const';
import { cloneDeep, sleep } from '@/utils/utils';
import {
    checkMobileExist,
    checkImageCode,
    registerUser
} from '@/service/register';
import { checkMobileCode } from '@/service/mobile';
export default {
    name: 'Register',
    data () {
        // 验证两次密码是否输入一至
        const validatePass = (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
                // callback(new Error(this.$t('register.passAgain')));
            } else if (!pwdRexp(value)) {
                callback(new Error(this.$t('register.loginPassIsError')));
            } else if (this.user.loginPass && value !== this.user.loginPass) {
                callback(new Error(this.$t('register.passIsUnEqual')));
            } else {
                this.loginPass = false;
                this.$refs['registerForm'].clearValidate(['loginPass']);
                callback();
            }
        };
        // 账号名
        const validateUsername = async (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
                // callback(new Error(this.$t('register.mobileIsEmpty')));
            } else {
                let result = await checkMobileExist(value, 'userName').catch(() => {
                    this.clearMessage();
                    callback(new Error(this.$t('exception.server')));
                });
                if (!result) {
                    callback(new Error(this.$t('form.error.username.registed')));
                }
                callback();
            }
        };
        // 验证手机号码是否注册
        const validateMobile = async (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
                // callback(new Error(this.$t('register.mobileIsEmpty')));
            } else {
                let result = await checkMobileExist(value).catch(() => {
                    this.clearMessage();
                    callback(new Error(this.$t('exception.server')));
                });
                if (!result) {
                    callback(new Error(this.$t('register.mobileIsRegisted')));
                }
                this.mobileIsError = false;
                callback();
            }
        };
        // 验证图片验证码
        const validateImageCode = async (rule, value, callback) => {
            this.clearMessage();
            if (value === '') {
                callback();
                // callback(new Error(this.$t('register.imageCodeIsEmpty')));
            } else {
                let result = await checkImageCode(
                    value,
                    this.user.imageCode.id
                ).catch(() => {
                    this.clearMessage();
                    callback(new Error(this.$t('exception.server')));
                });
                if (!result) {
                    callback(new Error(this.$t('register.imageCodeIsError')));
                } else if (result.code !== '0000') {
                    callback(new Error(result.msg || this.$t('register.imageCodeIsError')));
                }
                this.imageIsError = false;
                callback();
            }
        };
        // 验证短信验证码
        const validateMobileCode = async (rule, value, callback) => {
            this.clearMessage();
            await sleep(200);
            $log('1', new Date().getTime() - this.sendTime);
            if (new Date().getTime() - this.sendTime < 500) {
                return callback();
            }
            if (value === '') {
                callback();
                // callback(new Error(this.$t('register.imageCodeIsEmpty')));
            } else {
                let result = await checkMobileCode(
                    this.user.mobile,
                    value
                ).catch(() => {
                    this.reSendImgCode();
                    callback(new Error(this.$t('exception.server')));
                });
                if (!result) {
                    this.reSendImgCode();
                    callback(new Error(this.$t('register.mobileCodeIsError')));
                } else if (result.code !== '0000') {
                    if (this.user.imageCode.code) {
                        this.reSendImgCode();
                    }
                    callback(result.msg || new Error(this.$t('register.imageCodeIsError')));
                    // 验证码已失效，请重新获取
                    // console.error('data.code', result.code);
                    // if (result.code === '9999') {
                    //     this.$refs.mobileCode.reset();
                    // }
                }
                this.imageIsError = false;
                callback();
            }
        };
        // 验证是否同意条款
        const validateAgree = async (rule, value, callback) => {
            this.clearMessage();
            if (value === true) {
                callback();
            } else {
                callback(new Error(this.$t('register.notAgree')));
            }
        };
        /**
         * FIX 先输入下面，再输入上面密码的时候
         * 
         */
        const validateSamePwd = (rule, value, callback) => {
            this.clearMessage();
            if (!value) {
                // 没有quert密码直接通过。
                callback();
            } else if (!pwdRexp(value)) {
                callback(new Error(this.$t('register.loginPassIsError')));
            } {
                this.$refs['registerForm'].clearValidate(['confirmPass']);
                if (this.user.confirmPass !== this.user.loginPass && this.user.loginPass && this.user.confirmPass) {
                    callback(new Error(this.$t('register.passIsUnEqual')));
                } else {
                    callback();
                }
            }
        };
        // passRexp
        const pwdRexp = function (value) {
            return value.indexOf(' ') === -1 && value.indexOf('>') === -1 && value.indexOf('<') === -1 && REG_PASSWORD_REGEXP.test(value);
        };
        return {
            REGISTER_CODE,
            // 提交操作
            isSubmit: false,
            // 是否显示明文密码
            showPwd1: false,
            showPwd2: false,
            // 是否显示密码等级框
            showLevel: false,
            imageIsError: true,
            mobileIsError: true,
            MobileCodeIsError: true,
            loginPass: true,
            getMobileLoading: false,
            getMobileCodeDisabled: false,
            imgCodeErrorMessage: '',
            // 获取验证码按钮文字
            codeBtnText: this.$t('form.btn.code'),
            // 图片验证地址
            imageCode: '',
            interal: '',
            // 发送验证码的时间
            sendTime: '',
            // 注册表单对象
            user: {
                username: '',
                mobile: '',
                loginPass: '',
                confirmPass: '',
                mobileCode: '',
                // imageCode: '',
                // imageId: '',
                imageCode: {
                    code: '',
                    id: ''
                },
                agree: false
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: this.$t('form.error.username.empty'),
                        trigger: ['submit']
                    },
                    {
                        min: 5,
                        max: 32,
                        show: true,
                        message: this.$t('form.error.username.length'),
                        trigger: ['blur']
                    },
                    {
                        pattern: USERNAME_REGEXP,
                        show: true,
                        message: this.$t('form.error.username.format'),
                        trigger: ['blur']
                    },
                    {
                        pattern: ALL_NUMBER,
                        show: true,
                        message: this.$t('form.error.username.allNumber'),
                        trigger: ['blur']
                    },
                    { validator: validateUsername, trigger: 'blur' }
                ],
                mobile: [
                    {
                        required: true,
                        message: this.$t('register.mobileIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        pattern: MOBILE_REGEXP,
                        message: this.$t('register.mobileIsError'),
                        trigger: ['blur']
                    },
                    { validator: validateMobile, trigger: 'blur' }
                ],
                loginPass: [
                    {
                        required: true,
                        message: this.$t('register.loginPassIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        min: 8,
                        max: 32,
                        message: this.$t('register.loginPassLength'),
                        trigger: 'blur'
                    },
                    // {
                    //     pattern: REG_PASSWORD_REGEXP,
                    //     message: this.$t('register.loginPassIsError'),
                    //     trigger: 'blur'
                    // },
                    { validator: validateSamePwd, trigger: 'blur' }
                ],
                confirmPass: [
                    {
                        required: true,
                        message: this.$t('register.confirmPassIsEmpty'),
                        trigger: 'submit'
                    },
                    // {
                    //     pattern: REG_PASSWORD_REGEXP,
                    //     message: this.$t('register.loginPassIsError'),
                    //     trigger: 'blur'
                    // },
                    { validator: validatePass, trigger: 'blur' }
                ],
                'imageCode.code': [
                    {
                        required: true,
                        message: this.$t('register.imageCodeIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        min: 4,
                        max: 4,
                        message: this.$t('register.imageCodeIsError'),
                        trigger: 'blur'
                    },
                    { validator: validateImageCode, trigger: 'blur' }
                ],
                mobileCode: [
                    {
                        required: true,
                        message: this.$t('register.mobileCodeIsEmpty'),
                        trigger: 'submit'
                    },
                    {
                        min: 5,
                        max: 6,
                        message: this.$t('register.mobileCodeIsError'),
                        trigger: 'blur'
                    },
                    { validator: validateMobileCode, trigger: 'blur' }
                ],
                agree: [
                    { validator: validateAgree, trigger: 'submit' },
                    { validator: validateAgree, trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        // 判断短信发送按钮是否可用
        checkMobile: function () {
            return !this.mobileIsError;
        },
        pwdIcon1 () {
            return this.showPwd1 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        },
        pwdIcon2 () {
            return this.showPwd2 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        }
    },
    created () {
        // this.getImgCode();
        // let userInfo = {
        //     uid: '0f9f99272cea40dca30cba302ccab26a',
        //     emailStatus: 1,
        //     authStatus: 2,
        //     mobile: '18670096061',
        //     comName: '快乐阳光',
        //     email: '20180731@qq.com',
        //     ext2: 'true',
        //     status: 2,
        //     ext1: null,
        //     statusReason: '',
        //     token: '786309d31c7d8fb14fadc83b894de1468d57e33c3a59b5a71304a4863a34fa5cc0158e64d4ca03aa'
        // };
        // setTimeout(() => {
        //     this.success({result: userInfo});
        // }, 3000);
    },
    methods: {
        // 清除错误信息
        clearMessage () {
            this.imgCodeErrorMessage = '';
        },
        // 切换明暗文
        togglePwd (val) {
            if (val === 1) {
                this.showPwd1 = !this.showPwd1;
            } else if (val === 2) {
                this.showPwd2 = !this.showPwd2;
            }
        },
        // 刷新验证码
        reSendImgCode () {
            this.$refs['imageCode.code'].getImgCode();
            if (this.user.imageCode.code) {
                this.imgCodeErrorMessage = this.$t('register.imageCodeIsError');
            } else {
                // this .imgCodeErrorMessage = this.$t('register.imageCodeIsEmpty');
            }
        },
        // 发送验证码之前钩子行数
        beforeValidateCode () {
            // 发送时间，发送验证码的时候不校验短信验证码
            $log('2', new Date().getTime());
            this.sendTime = new Date().getTime();
            return new Promise((resolve, reject) => {
                this.$refs['registerForm'].validateField(
                    'mobile',
                    async err => {
                        if (err) {
                            reject(new Error('手机号码验证失败'));
                        } else {
                            $log('手机号码格式验证成功，验证手机是否注册。');
                            // 验证手机是否注册
                            return this.$refs['registerForm'].validateField(
                                'imageCode.code',
                                imageCodeErr => {
                                    if (imageCodeErr) {
                                        reject(new Error('图形验证码失败'));
                                    } else {
                                        $log('成功！');
                                        resolve();
                                        this.$refs['registerForm'].clearValidate(['mobileCode']);
                                    }
                                }
                            );
                        }
                    }
                );
                this.$refs['registerForm'].clearValidate(['mobileCode']);
            });
        },
        doReg () {
            // 以下语句防止重复提交
            if (this.isSubmit) return;
            // 表单验证成功后提交
            this.$refs['registerForm'].validate(async valid => {
                if (valid) {
                    // 表单验证成功
                    this.isSubmit = true;
                    let user = cloneDeep(this.user);
                    let imageCode = cloneDeep(user.imageCode);
                    user.imageCode = imageCode.code;
                    user.imageId = imageCode.id;
                    registerUser(user)
                        .then(result => {
                            this.isSubmit = false;
                            if (result && result.data.code === '0000') {
                                this.success(result);
                            } else {
                                this.$message.error(result.data.msg);
                            }
                        })
                        .catch(() => {
                            // 显示异常
                            this.isSubmit = false;
                            this.$message.error(this.$t('exception.server'));
                        });
                    this.reSendImgCode();
                    this.$refs['registerForm'].clearValidate();
                    this.clearMessage();
                }
            });
        },
        success (result) {
            this.$store.commit('SET_LOGIN_STATUS', {
                status: true,
                token: result.headers['x-people-token']
            });
            this.$store.commit('user/ADD_ACCOUNT', result.data.result.uid);
            this.$store.commit('user/SET_USERINFO', result.data.result);
            this.$router.push({ name: 'register.success' });
        },
        // 获取图片验证码
        // getImgCode() {
        //     getImageCode()
        //         .then(data => {
        //             this.user.imageId = data.headers.image_id;
        //             this.imageCode = 'data:image/png;base64,' + data.data;
        //         })
        //         .catch(() => {
        //             this.imageCode = '验证码加载失败';
        //         });
        // }
    },
    components: {
        SingleHeader,
        PasswordCheck,
        SingleFooter,
        ImageCodeInput,
        MobileCode
    }
};
