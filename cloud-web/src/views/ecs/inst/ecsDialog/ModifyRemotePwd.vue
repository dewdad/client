<template>
    <el-dialog
        :title="$t('dialog.remotePwd.title')"
        :visible.sync="isShow"
        width="600px"
        class="ModifyRemotePwd"
        @close="cancel">   
        <zt-form ref='modifyRemoteLoginPwd' class="show-icon" :model='remoteLogin' label-width='75px' style="width:365px;" :rules='rules' inline-message size="small" >
            <div>
                <zt-form-item id="loginPass" prop="password1" :label="$t('dialog.remotePwd.newPwd')" :showRule="true" has-help>
                    <el-input :type="showPwd1 ? 'text' : 'password'" :maxlength="6" v-model="remoteLogin.password1" :placeholder='$t("form.input.newPassword")'>  
                        <i :class="pwdIcon1" slot="suffix" @click="togglePwd(1)"></i>                    
                    </el-input>
                    <!-- <div class="input-help">限制为6位，支持数字和大小写字母。不支持特殊字符</div>                 -->
                </zt-form-item>
                <zt-form-item class="mb0" id="confirmPass" prop="password2" :label="$t('dialog.remotePwd.confirmPwd')">
                    <el-input :type="showPwd2 ? 'text' : 'password'" :maxlength="6"  :placeholder='$t("form.input.confirmPassword")' v-model="remoteLogin.password2">                    
                        <i :class="pwdIcon2" slot="suffix" @click="togglePwd(2)"></i>  
                    </el-input>
                </zt-form-item>               
            </div>
        </zt-form>

        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="cancel" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { modifyVncPwd } from '@/service/ecs/list.js';
import {REMOTE_LOGIN_PWD} from '@/constants/regexp';
export default {
    data() {
        // 校验密码是否相同
        const ValidatePwdIsSame = (rule, value, callback) => {
            console.log('rule',rule);
            console.log('value',value);
            if(this.remoteLogin.password1 && value){
                if(this.remoteLogin.password1 !== value){
                    return callback(new Error($t('valid.equal.tips1')));
                }
            }           
            callback();
        };
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,

            // 是否显示明文密码
            showPwd1: false,
            showPwd2: false,
            remoteLogin:{
                ecsId:'',
                password1:'',
                password2:''
            },
            rules: {
                password1: [
                    {
                        required: true,
                        message: $t('dialog.remotePwd.inputNewPwd'),
                        trigger: ['submit']
                    },
                    {
                        min: 1,
                        max: 6,
                        show: true,
                        message: $t('dialog.remotePwd.pwdIsNotCorrect'),
                        tipsMessage: $t('valid.remotePasswod.length'),
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: REMOTE_LOGIN_PWD,
                        show: true,
                        message: $t('dialog.remotePwd.pwdIsNotCorrect'),
                        tipsMessage: $t('valid.remotePasswod.regex'),
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ],
                password2: [
                    {
                        required: true,
                        message: $t('dialog.remotePwd.inputConfirmPwd'),
                        trigger: ['submit']
                    },                    
                    { validator: ValidatePwdIsSame, trigger: ['submit', 'blur'] }
                ]

            }
        };
    },
    props:{

    },
    computed: {        
        pwdIcon1 () {
            return this.showPwd1 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        },
        pwdIcon2 () {
            return this.showPwd2 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        }
    },
    methods: {
        show(rowItem) {
            this.remoteLogin.ecsId = rowItem.id;

            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;

            // 是否显示明文密码
            this.showPwd1 = false;
            this.showPwd2 = false;
            this.remoteLogin = {}; //清空数据
            this.loading = false;
            this.$refs['modifyRemoteLoginPwd'].clearValidate();
        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        // 切换明暗文
        togglePwd (val) {
            if (val === 1) {
                this.showPwd1 = !this.showPwd1;
            } else if (val === 2) {
                this.showPwd2 = !this.showPwd2;
            }
        },
        confirm() {
            this.$refs['modifyRemoteLoginPwd'].validate(valid => {
                if (valid) {
                    modifyVncPwd(this.remoteLogin)
                        .then( (res) => {                  
                            if(res && res.code && res.code === this.CODE.SUCCESS_CODE){                                  
                                // this.setting();
                                this.$message.success($t('common.successOpt'));
                                this.resolve(this.remoteLogin);
                                this.hide();
                            }  
                        })
                        .catch(err => {
                            $log(err);                   
                        });
                } else {
                    return false;
                }
            });                        
        }
    }
};
</script>
<style lang="scss">
.ModifyRemotePwd{
    .wd318 {
        width:318px;
    }
    .el-form .el-form-item__label {
        padding-right: 0;
    }
    .enterPwd{
        display: flex;
        justify-content: center;
        span.title{
            flex: 1;
            padding-top: 10px;
            padding-left: 20px;
        }
        .right{
            flex: 5;
            div{
                width: 300px;
            }
        }
        .el-input{
            input{
                width: 300px;
            }
            flex: 5
        }
    }
}
</style>
