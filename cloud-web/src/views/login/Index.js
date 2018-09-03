import {userLogin, checkUserName} from '@/service/login';
import {LOGIN_CODE} from '@/constants/const';
import {MOBILE_REGEXP, EMAIL_REGEXP} from '@/constants/regexp.js';
import MobileCode from '@/components/common/MobileCode';
import ImageCodeInput from '@/components/form/ImageCodeInput';
import EmailSelect from '@/components/form/EmailSelect';
import Clickoutside from '@/utils/clickoutside';
import Capslock from '@/utils/capslock';
import {isEmpty} from '@/utils/utils';
import {mapGetters} from 'vuex';
export default {
    name: 'login',
    data() {
        // 验证邮箱或手机号码
        const validatorUserName = async (rule, value, callback) => {
            // if (value && !MOBILE_REGEXP.test(value) && !EMAIL_REGEXP.test(value)) {
            //     this.errorMsg = this.$t('login.userNameIsError');
            //     this.errorInput = 'userName';
            //     return callback(new Error(this.$t('login.userNameIsError')));
            // }
            if (value) {
                let ret = await checkUserName({
                    user_name: value
                });
                console.log('checkUserName', ret);
                if (ret) {
                    this.showImageCode = true;
                    // this.errorMsg = this.$t('register.imageCodeIsEmpty');
                } else {
                    this.showImageCode = false;
                }
            }
            callback();
        };
        return {
            LOGIN_CODE,
            // 错误信息
            errorMsg: '',
            // 错误框
            errorInput: '',
            // 显示常用邮件选择框
            isShow: true,
            // 右键验证正则
            EMAIL_REGEXP,
            // 登录类型 0 密码 1短信
            loginType: 0,
            // 登录中
            isLoging: false,
            // 是否显示图形验证码
            showImageCode: false,
            // 短信发送中
            getMobileLoading: false,
            // 短信发送结果
            sendResult: '',
            // 短信登录说明框
            dialogVisible: false,
            // 点击登录后设为true
            isSubmit: false,
            // 登录实体
            user: {
                userName: '',
                pwd: '',
                pwd1: '',
                phoneNumber: '',
                messageCode: '',
                imageCode: {
                    code: '',
                    id: ''
                }
            },
            // 表单验证规则
            rules: {
                userName: [
                    {
                        required: true,
                        message: this.$t('login.userNameIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        validator: validatorUserName,
                        message: this.$t('login.userNameIsError'),
                        trigger: ['submit', 'blur']
                    }
                ],
                pwd: [
                    {
                        required: true,
                        message: this.$t('login.pwdIsEmpty'),
                        trigger: ['submit']
                    }
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
                        trigger: ['submit']
                    }
                ],
                phoneNumber: [
                    {
                        required: true,
                        message: this.$t('register.mobileIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        pattern: MOBILE_REGEXP,
                        message: this.$t('register.mobileIsError'),
                        trigger: ['submit']
                    }
                ],
                messageCode: [
                    {
                        required: true,
                        message: this.$t('register.mobileCodeIsEmpty'),
                        trigger: ['submit']
                    },
                    {
                        pattern: /^\d{5,6}$/,
                        message: this.$t('register.mobileCodeIsError'),
                        trigger: ['submit']
                    }
                ]
            }
        };
    },
    directives: {
        clickoutside: Clickoutside,
        capslock: Capslock
    },
    components: {
        MobileCode,
        ImageCodeInput,
        EmailSelect
    },
    watch: {
        loginType: function() {
            this.errorMsg = '';
            this.errorInput = '';
            this.sendResult = '';
            this.$refs.pwdForm.clearValidate();
            // 登录类型变换时清空表单所有数据
            // for (const key of Object.keys(this.user)) {
            //     if (key !== 'imageCode') {
            //         this.user[key] = '';
            //     } else {
            //         this.user[key] = {
            //             code: '',
            //             id: ''
            //         };
            //     }
            // }
        },
        user: {
            deep: true,
            handler: function(newval) {
                // this.errorMsg = '';
            }
        },
        'user.phoneNumber': function() {
            this.sendResult = '';
        }
    },
    computed: {
        // 当前年份
        currentYear() {
            let year = new Date().getFullYear();
            return year;
        },
        medium() {
            return (this.loginType === 0 && (this.showImageCode || this.errorMsg !== '' || this.sendResult)) || (this.loginType === 1 && (this.errorMsg !== '' || this.sendResult));
        },
        ...mapGetters(['loginFailNums', 'isIdentity'])
    },
    methods: {
        // 验证表单域 filed: 验证字段
        async checkData(field) {
            return new Promise((resolve, reject) => {
                this.$refs.pwdForm.validateField(field, message => {
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
                        // if (field === 'userName' && this.loginType === 0) {
                        //     return this.checkUserName(resolve);
                        // } else {
                        //     resolve();
                        // }
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
            if (input !== 'imageCode.code') {
                value = this.user[input];
            } else {
                $log('values', this.user.imageCode.code);
                value = this.user.imageCode.code;
            }
            // 为空时移除验证结果
            if (value === '') {
                this.$refs.pwdForm.clearValidate([input]);
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
        // 已废弃
        async checkUserName(cb) {
            if (this.loginType === 1) {
                typeof cb === 'function' && cb('');
                return;
            }
            let user_name = '';
            if (this.loginType === 0) {
                user_name = this.user.userName;
            } else {
                user_name = this.user.phoneNumber;
            }
            let ret = await checkUserName({
                user_name
            });
            console.log('checkUserName', ret);
            if (ret && !this.showImageCode) {
                this.showImageCode = true;
                this.errorMsg = this.$t('register.imageCodeIsEmpty');
                throw new Error(this.$t('register.imageCodeIsEmpty'));
            } else {
                // this.errorMsg = '';
            }
            typeof cb === 'function' && cb();
        },
        // 提交表单
        async submit() {
            // 验证是否可登录
            // 密码登录
            this.isSubmit = true;
            if (this.loginType === 0) {
                this.checkData('userName') // 第一步：验证邮箱或手机号码
                    .then(() => {
                        return this.checkData('pwd'); // 第二步：验证密码
                    })
                    .then(() => {
                        // 第三步：验证图片验证码
                        if (this.showImageCode) {
                            return this.checkData('imageCode.code');
                        } else {
                            return Promise.resolve();
                        }
                    })
                    .then(() => {
                        // 第四步：登录
                        this.login(this.loginType);
                    })
                    .catch(err => {
                        $log(err);
                    });
            }
            if (this.loginType === 1) {
                this.sendResult = false;
                this.checkData('phoneNumber') // 第一步：验证手机号码
                    .then(() => {
                        // 第二步：验证短信验证码
                        return this.checkData('messageCode');
                    })
                    .then(() => {
                        // 第三步：登录
                        this.login(this.loginType);
                    })
                    .catch(err => {
                        $log(err);
                    });
            }
        },
        // 登录
        login(type) {
            if (this.isLoging) return;
            this.isLoging = true;
            userLogin({
                loginType: type,
                loginNo: type === 0 ? this.user.userName : this.user.phoneNumber,
                loginPass: this.user.pwd,
                imageCode: this.user.imageCode.code,
                imageId: this.user.imageCode.id,
                messageCode: this.user.messageCode
            })
                .then(async result => {
                    this.isLoging = false;
                    let code = result.data.code;
                    if (code === '0000') {
                        // 记录token
                        this.$store.commit('SET_LOGIN_STATUS', {
                            status: true,
                            token: result.headers['x-people-token']
                            // uid: result.data.result.uid
                        });
                        // 记录用户信息
                        this.$store.commit('user/SET_USERINFO', result.data.result);
                        // 如果没有验证过身份
                        if (!this.isIdentity) {
                            if (this.loginType === 1) {
                                this.$store.commit('user/ADD_ACCOUNT', result.data.result.uid);
                            } else {
                                return this.$router.push({name: 'user.identity'});
                            }
                        }
                        let redirect = this.$route.query.c;
                        if (!isEmpty(redirect)) {
                            // 如果路由中存在redirect参数 跳转到redirect对应的页面
                            this.$router.push(redirect);
                        } else {
                            // 如果未绑定邮箱跳转到未绑定邮箱提示页面
                            this.$router.push({
                                name: result.data.result.emailStatus === 0 ? 'user.unbind' : 'app'
                            });
                        }
                    } else {
                        this.errorMsg = result.data.msg;
                        if (result.data.code === this.CODE.IMAGE_CODE_ERROR) {
                            this.errorInput = 'imageCode.code';
                        }
                        // 记录失败次数
                        this.$store.commit('user/SET_LOGIN_FAIL_NUMS');
                        // 刷新验证码
                        if (this.loginType === 0 && this.showImageCode) {
                            this.$refs.imageCode.getImgCode();
                        }
                        // 更重新获取是否输入验证码状态
                        // this.checkUserName();
                    }
                })
                .catch(err => {
                    $log(err);
                    this.isLoging = false;
                    this.errorMsg = this.$t('exception.server');
                });
        },
        // 短信发送前的验证
        beforeSend() {
            return this.checkData('phoneNumber')
                .then(() => {
                    this.errorMsg = '';
                    this.errorInput = '';
                    return Promise.resolve('SUCCESS');
                })
                .catch(message => {
                    return Promise.reject('ERROR');
                });
        },
        // 短信发送失败钩子
        sendError(message) {
            this.errorMsg = message;
        },
        // 邮箱/手机号码输入框外部点击时隐藏邮箱选择列表
        clickOutSide() {
            this.isShow = false;
        }
    }
};
