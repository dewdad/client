<template>
    <zt-form :model="form" ref="keyPairform" class="show-icon keyPairform" :show-message="true" inline-message :rules="form.loginType==='2' ? rules : rules1" label-width="95px" size="small">
        <zt-form-item :label="$t('common.type')">
            <el-radio v-model="form.loginType" label="2">{{$t('ecs.create.passwordtext')}}</el-radio>
            <el-radio v-if="default_username ==='root'" v-model="form.loginType" label="1">{{$t('common.keypair')}}</el-radio>
        </zt-form-item>
        <zt-form-item v-if="form.loginType==='2'" key="username" :label="$t('ecs.create.username')">
            {{default_username}}
        </zt-form-item>
        <zt-form-item v-if="form.loginType==='2'" id="password1" key="password1" :label="$t('ecs.create.loginPassword')" prop="password1" :showRule="true" style="width:395px;" :class="{'hide-star': true, 'hide-message': form.password1 === ''}" has-help>
            <el-input v-model="form.password1" :type="showPwd1 ? 'text' : 'password'" :placeholder="$t('ecs.create.password.placeholder')|replaceParamVal([default_username])">
                <i :class="pwdIcon1" slot="suffix" @click="togglePwd(1)"></i>
            </el-input>
            <!-- <span class="input-help text-nowrap">{{$t('ecs.create.password.tips')}}</span> -->
        </zt-form-item>
        <zt-form-item v-if="form.loginType==='2'" id="password2" key="password2" :label="$t('ecs.create.confirmPassword')" prop="password2" style="width:395px;" :class="{'hide-star': true, 'hide-message': form.password2 === '', 'mb0': true}">
            <el-input v-model="form.password2" :type="showPwd2 ? 'text' : 'password'" :placeholder="$t('ecs.create.password1.placeholder')|replaceParamVal([default_username])">
                <i :class="pwdIcon2" slot="suffix" @click="togglePwd(2)"></i>
            </el-input>
            <!-- <span class="input-help text-nowrap">{{$t('ecs.create.password1.tips')}}</span> -->
        </zt-form-item>
        <zt-form-item v-if="form.loginType==='1'" id="keyname" :label="$t('common.keypair')" prop="keyname" style="width:420px;" :showRule="true" :class="{'hide-star': true, 'hide-message': form.password1 === '', 'mb0': true}">
            <template slot="label">{{$t('common.keypair')}}
                <el-popover placement="top" title="" width="340" trigger="hover">
                    <div>
                        {{tipcontent}}
                    </div>
                    <span class="tips-help ml5" slot="reference">
                        <zt-icon icon="icon-iconfontwenhao1"></zt-icon>
                    </span>
                </el-popover>
            </template>
            <el-select v-model="form.keyname" key="keyname" popper-class="el-popper--small" :placeholder="$t('form.input.keyname')">
                <el-option v-for="item in keyPairList" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
            </el-select>
            <i class="font14 ml10 el-icon-refresh" v-tooltip="{content: $t('common.clickRefresh'), theme: 'is-light'}" @click="getKeypairList" ></i>
            <div>
                <router-link :to="{name: 'app.ecs.netsecurity.keypair'}" target="_blank" class="font12">详情参考 | 新建密钥对</router-link>
            </div>
        </zt-form-item>

    </zt-form>

</template>
<script>
import {PASSWORD_REGEXP, INST_PASSWORD} from '@/constants/regexp';
import {getKeypairList} from '@/service/ecs/keypairs';
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
            tipcontent: '密钥对由公有密钥和私有密钥文件构成，目前只有 I/O 优化实例支持。它们共同帮助您安全地连接到您的实例，如果您选择了密钥对的登录方式，我们将默认禁用用户名密码的登录方式',
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
            },
            rules1: {
                keyname: [
                    {
                        required: true,
                        message: this.$t('form.input.keyname'),
                        trigger: ['submit', 'change']
                    }
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
        },
        osType: function(newval) {
            if (newval.includes('windows')) {
                this.form.loginType = '2';
            }
        }
    },
    computed: {
        ...mapState({
            createEcsFormData: state => state.createEcsFormData
        }),
        osType: function() {
            try {
                return this.createEcsFormData.mirror.osType.toLowerCase();
            } catch (err) {
                // $log(err);
                return '';
            }
        },
        pwdIcon1() {
            return this.showPwd1 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        },
        pwdIcon2() {
            return this.showPwd2 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        },
        default_username() {
            return this.osType.includes('windows') ? 'Administrator' : 'root';
        }
    },
    created() {
        this.getKeypairList();
    },
    methods: {
        getKeypairList() {
            this.loading = true;
            getKeypairList({pageIndex:1, limit: 1000})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.keyPairList = res.data.data || [];
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
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
<style  lang="scss">
.keyPairform {
    .el-input,
    .el-select {
        width: 300px;
    }
    .el-form-item:not(:last-child) {
        margin-bottom: 16px;
    }
    .el-form-item:first-child .el-form-item__label {
        line-height: 1;
    }
    .el-form-item:first-child .el-form-item__content {
        line-height: 1;
    }
    .el-form-item.is-required .el-form-item__label:after {
        content: '';
    }
}
</style>
