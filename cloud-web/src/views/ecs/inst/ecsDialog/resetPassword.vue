<template>
    <el-dialog
        :title="$t('dialog.resetPwd.title')"
        :visible.sync="isShow"
        width="600px"
        class="zt-dialog-resetpwd"
        @close="cancel">
        <div class="zt-alert mb20">
            <el-alert class="font12 mt5" type="warning" :closable="false" :title="$t('dialog.resetPwd.alertTip0')">            
            </el-alert>
        </div>   
        <zt-form ref='resetPwd' class="show-icon" :model='ecsInst' label-width='80px' style="width:370px;" :rules='rules' inline-message size="small" >
            <div>
                <zt-form-item id="loginPass" prop="password1" :label="$t('dialog.resetPwd.loginPwd')" :showRule="true" has-help>
                    <el-input :type="showPwd1 ? 'text' : 'password'" :maxlength="30" v-model="ecsInst.password1" :placeholder='$t("form.input.newPassword")'>                       
                        <i :class="pwdIcon1" slot="suffix" @click="togglePwd(1)"></i> 
                    </el-input>
                    <!-- <div class="input-help mt10">{{ $t('dialog.resetPwd.tooltip') }}</div>                 -->
                </zt-form-item>
                <zt-form-item class="mb0" id="confirmPass" prop="password2" :label="$t('dialog.resetPwd.confirmPwd')">
                    <el-input :type="showPwd2 ? 'text' : 'password'" :maxlength="30"  :placeholder='$t("form.input.confirmPassword")' v-model="ecsInst.password2">                    
                        <i :class="pwdIcon2" slot="suffix" @click="togglePwd(2)"></i> 
                    </el-input>
                </zt-form-item>               
            </div>
        </zt-form>

        <!-- <div class="title img-text-center mt20">            
            <span>{{ $t('dialog.resetPwd.tipPart0') }}</span>  
            <span @click="toggleClass = !toggleClass">
                <a>{{ $t('dialog.resetPwd.tipPart1') }}</a>
                <i :class="{'el-icon-arrow-up':toggleClass,'el-icon-arrow-down':!toggleClass}" class="font12">
                </i>
            </span>
            <span> {{ $t('dialog.resetPwd.tipPart2') }}</span>
        </div>
        <div class="zt-alert">
            <el-alert v-show="toggleClass" class="font12 mt5" type="info" :closable="false" :title="rowItem.id +  ' / ' + rowItem.name">            
            </el-alert>
        </div> -->

        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="cancel" size="small">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" :loading="loading" :disabled="loading" @click="confirm" size="small">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { resetEcsInstPassword } from '@/service/ecs/list.js';
import {INST_PASSWORD,PASSWORD_REGEXP} from '@/constants/regexp';
export default {
    data() {
        // 校验密码是否相同
        const ValidatePwdIsSame = (rule, value, callback) => {
            console.log('rule',rule);
            console.log('value',value);
            if(this.ecsInst.password1 && value){
                if(this.ecsInst.password1 !== value){
                    return callback(new Error($t('dialog.resetPwd.passwordNotSame')));
                }
            }           
            callback();
        };
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            //toggleClass:false,
            // 是否显示明文密码
            showPwd1: false,
            showPwd2: false,
            rowItem:{},
            ecsInst:{
                ecsId:'',
                password1:'',
                password2:''
            },
            rules: {
                password1: [
                    {
                        required: true,
                        message: $t('dialog.resetPwd.inputNewPwd'),
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
                        message: $t('dialog.resetPwd.inputConfirmPwd'),
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
            this.rowItem = rowItem;
            this.ecsInst.ecsId = rowItem.id;

            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;

            //清空数据
            this.ecsInst = {
                ecsId:'',
                password1:'',
                password2:''
            };
            this.$refs['resetPwd'].clearValidate();
            this.showPwd1 = false;
            this.showPwd2 = false;
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
        confirm() {
            this.$refs['resetPwd'].validate(valid => {
                if (valid) {
                    this.loading = true;
                    resetEcsInstPassword(this.ecsInst)
                        .then( (res) => {    
                            this.loading = false;              
                            if(res && res.code && res.code === this.CODE.SUCCESS_CODE){
                                // this.setting();                                
                                let { ecsId,password1,password2 } = this.ecsInst;
                                this.resolve({ ecsId,password1,password2 });
                                this.hide();
                                this.$message.success($t('common.successOpt'));
                            }  
                        },
                        (err) => {
                            this.loading = false;
                            $log(err); 
                        });
                } else {
                    return false;
                }
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
    }
};
</script>
<style lang="scss">
.zt-dialog-resetpwd{
    font-size: 12px;  
    .el-form .el-form-item__label {
        padding-right: 0;
    }
    .title {
        font-size: 14px;      
        vertical-align:center;
        .el-icon-warning {
            font-size:28px;
            color:#f60;
            margin-right:10px;          
        }
    } 
    .zt-alert {
        padding:0;
    } 
    
}
</style>
