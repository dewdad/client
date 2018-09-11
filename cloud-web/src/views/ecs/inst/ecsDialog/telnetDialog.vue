 <template>
    <el-dialog :title="title" :visible.sync="isShow" :width="dlgWidth" class="telnetDialog" @close="cancel">
        <!-- 未产生远程登录密码 -->
        <template v-if="!rowItem.vncPassword">
            <div class="mb10">
                <span>远程登录密码</span>
                <span> {{ form.remoteLoginPwd }} </span>
            </div>
            <div>
                <el-alert :title="$t('ecs.inst.list.remoteLoginDlg.alertTip')" type="warning" :closable="false"></el-alert>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" class="font12" @click="confirm">关闭</el-button>
            </span>
        </template>

        <!-- 远程登录 -->
        <template v-else>
            <zt-form inline-message size="small" class="mb0" :model="form" label-width="128px" style="width:446px;"  ref="relnetForm">
                <zt-form-item label="请输入远程密码" prop="remoteLoginPwd" :error="remoteLoginPwdIsError">
                    <el-input class="wd318" :type="showPwd1 ? 'text' : 'password'" @focus="remoteLoginPwdIsError=''" size="small" v-model="form.remoteLoginPwd">
                        <i :class="pwdIcon1" slot="suffix" @click="togglePwd(1)"></i>
                    </el-input>
                </zt-form-item>

            </zt-form>            
            <span slot="footer" class="dialog-footer">
                <el-button type="info" class="font12" @click="isShow = false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary" class="font12" size="small" :loading="loading" :disabled="!form.remoteLoginPwd || loading" @click="confirm">{{ $t('common.ok') }}</el-button>                
            </span>
        </template>
    </el-dialog>
</template>
<script>
import {checkVncPwd, getVncUrl} from '@/service/ecs/list.js';
import ZT_CONFIG from '@/constants/config';
export default {
    data() {       
        return {
            rowItem: {},
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            // 是否显示明文密码
            showPwd1: false,
            title: '',
            dlgWidth: '500px',
            form:{
                remoteLoginPwd:''
            },
            remoteLoginPwdIsError: '',
            rules: {
                remoteLoginPwd: [
                    {
                        required: true,
                        //message: '请输入密码',
                        trigger: ['submit']
                    },                  
                ]
            }
        };
    },
    computed: {        
        pwdIcon1 () {
            return this.showPwd1 ? 'hover-active iconfont icon-yanjing pwd-icon' : 'hover-active iconfont icon-yanjing-bi pwd-icon';
        },        
    },
    methods: {
        show(rowItem) {
            if (rowItem.vncPassword) {                
                this.title = '远程登录';
                this.dlgWidth = '600px';
            } else {
                this.form.remoteLoginPwd = getRandomPwd();
                this.title = '远程登录密码';
                this.dlgWidth = '500px';
            }            
            this.rowItem = rowItem;
            console.log('getVncUrl rowItem::', rowItem);

            this.isShow = true;
            
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

            //生成随机6位数字密码
            function getRandomPwd() {
                let num = '';
                for (let i = 0; i < 6; i++) {
                    num += Math.floor(Math.random() * 10);
                }
                return num;
            }
        },
        hide() {
            this.isShow = false;

            
            this.form.remoteLoginPwd = '';
            if (this.rowItem.vncPassword) {
                this.$refs['relnetForm'].clearValidate();
            }  
            this.remoteLoginPwdIsError = '';  
            this.loading = false;
            this.showPwd1 = false;
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
            //this.$refs['relnetForm'].clearValidate();
            if(this.rowItem.vncPassword) {    
                this.$refs['relnetForm'].validate(valid => {
                    if (!valid) return;
                });
            }
            let data = {
                instanceId: this.rowItem.id,
                password: this.form.remoteLoginPwd
            };
            this.loading = true;      
            this.remoteLoginPwdIsError = '';     
            checkVncPwd(data)
                .then(res => {
                    if (res.code == this.CODE.SUCCESS_CODE) {
                        if(this.rowItem.vncPassword) {
                            this.getVncUrl();
                        } else {
                            this.$parent.getEcsInstList && this.$parent.getEcsInstList();
                        }
                        //this.rowItem.vncPassword = ZT_CONFIG.REMOTE_LOGIN_VNCPWD;
                        this.loading = false;
                        this.resolve();
                        this.hide();
                    } else {
                        this.loading = false;
                        if( res.code == '9999'){
                            this.remoteLoginPwdIsError = '密码不正确';
                        }                        
                    } 
                })
                .catch(err => {                
                    $log('checkVncPwd err:',err);                                    
                });            
        },

        getVncUrl: function() {
            getVncUrl({instanceId: this.rowItem.id})
                .then(res => {               
                    if (res && res.code == this.CODE.SUCCESS_CODE) {
                        let vnc_url = res.result.replace(ZT_CONFIG.WEB_SITE_URL, ZT_CONFIG.REMOTE_LOGIN_URL_ALIAS);
                        console.log('url===', vnc_url);
                        //window.open(vnc_url);
                        window.open(vnc_url);
                    }
                })
                .catch(err => {
                    $log('getVncUrl err:',err);                    
                });
        },

        // 切换明暗文
        togglePwd (val) {
            this.showPwd1 = !this.showPwd1;
        },
    }
};
</script>
<style scoped lang="scss">
    .el-input .el-input--small .wd318 {
        width:318px;
    }
    .el-form .el-form-item {
        margin-bottom: 0;
    }
    
</style>
