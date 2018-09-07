<template>
    <el-dialog :title="dialogTitle" :visible.sync="isShow" width="600px" class="dlg-bindip" @close="cancel">
        <zt-form inline-message :model="ruleForm" label-width="73px" style="width:392px;" size="small"  ref="ruleForm" :show-message="false">
            <!-- 当前实例 -->
            <zt-form-item :label="$t('dialog.bindPublicip.currentInst')" class="lh-em1">
                <span class="font12">{{ecsInst.name||ecsInst.id}}</span>
            </zt-form-item>
            <!-- 公网IP -->
            <zt-form-item :label="$t('common.publicNetworkIP')" prop="publicNet.id" class="mb0" :rules="rules">
                <div>
                    <el-select v-model="ruleForm.publicNet" size="small" :placeholder="$t('common.selectButtonTip')" value-key="id" popper-class="el-popper--small">
                        <el-option v-for="item in (opType === 1?publicNetData:bandedPublicNetData)" :key="item.id" :label="item.floatingIpAddress" :value="item">
                        </el-option>
                    </el-select>
                    <!-- <el-select v-model="ruleForm.publicNet" size="small" :placeholder="$t('common.selectButtonTip')" value-key="id" v-if="opType === 2">
                        <el-option v-for="item in bandedPublicNetData" :key="item.id" :label="item.ipAdd" :value="item">
                        </el-option>
                    </el-select> -->
                    <!-- <i v-show="opType === 1" class="font16 ml10 finger-cursor iconfont icon-Refreshshuaxin" @click="getUnbindPublicIP"></i> -->
                </div>
                <router-link  v-show="opType === 1" :to="{name: 'app.vpc.pn-flexip'}" target="_blank" class="mt10 finger-cursor font12">{{$t('dialog.bindPublicip.goCreatePublicIP')}}</router-link>
            </zt-form-item>
            
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" :loading="loading" :disabled="loading" @click="confirm" size="small">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { getPortByEcsId, getBindedPublicIpByEcsId } from '@/service/ecs/list.js';
import { getUnbindPublicIP, bundlingIp, unbundlingIp } from '@/service/ecs/floating.js';

export default {    
    data() {
        //验证公网IP
        const ValidatePublicNet = (rule, value, callback) => {
            if(!value){
                return callback(new Error($t('dialog.bindPublicip.isEmpty')));
            }
            callback();
        };
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            ecsInst: {},
            //intranetData: {},
            publicNetData: [], //绑定页面：未绑定的公网
            bandedPublicNetData: [], //解绑页面：本实例已绑定的公网
            // intranet: {}, //内网
            // publicNet: {}, //公网
            opType: 1,
            ruleForm: {
                intranet: {}, //内网fixIp
                publicNet: ''
            },
            rules:  [
                {
                    required: true,
                    message: '',
                    trigger: ['submit', 'change']
                },
                {validator: ValidatePublicNet, trigger: 'blur'}
            ],            
        };
    },
    computed: {
        dialogTitle() {
            let pubIP = $t('common.publicNetworkIP'); //公网IP
            let b = this.opType === 1 ? $t('common.bind') : $t('common.unbind');
            return b + pubIP;
        }
    },
    methods: {
        show(rowItem, opType) {
            let { id, name, ip, floatIp } = { ...rowItem };
            this.ecsInst = { ecsId: id, name, ip, floatIp };
            this.opType = opType;

            console.log('this.ecsInst', this.ecsInst);
            this.isShow = true;

            switch (this.opType) {                
                case 1: {//绑定公网IP                   
                    this.getUnbindPublicIP();
                    break;
                }
                case 2: {//解绑公网IP
                    this.getBindedPublicIpByEcsId(this.ecsInst);
                    break;
                }
                default: {
                }
            }

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;

            this.ruleForm = {
                intranet: {}, //内网fixIp
                publicNet: ''
            },
            this.loading = false;
            this.ecsInst = {};   
            this.$refs['ruleForm'].clearValidate();         
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
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {   
                    await this.getPortByEcsId(this.ecsInst.ecsId, this.ruleForm.publicNet.id);                 
                    let data = {
                        floatipId: this.ruleForm.publicNet.id,
                        instanceId: this.ecsInst.ecsId
                    };
                    this.loading = true;
                    let handle = unbundlingIp;
                    if (this.opType === 1) {
                        handle = bundlingIp;
                    }
                    //提交后台
                    handle(data).then(
                        res => {
                            this.loading = false;
                            console.log('修改信息', res);
                            if (res.data.code === '0000') {
                                this.$message.success($t('common.successOpt'));
                                // this.setting();
                                this.resolve(this.ecsInst);
                                this.hide();
                            }
                            
                        },
                        err => {
                            this.loading = false;
                            $log(err);
                        }
                    );
                }
            });
            
        },

        //绑定：根据实例id查询端口（端口和内网IP是一对一的关系，可以理解是内网IP）
        getPortByEcsId: function(ecsInstId, ipId) {
            return new Promise((resolve, reject) => {
                getPortByEcsId(ecsInstId, ipId).then(
                    res => {                 
                        if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                            let resData = res.result || [];
                            this.ruleForm.intranet = resData[0] || {}; //内网IP
                            return resolve();
                        } else {
                            return reject();
                        }
                    }
                );
            });
            
        },

        //解绑：查询本实例已经绑定的公网IP
        getBindedPublicIpByEcsId: function(ecsInst) {
            return getBindedPublicIpByEcsId(ecsInst).then(
                res => {               
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {                      
                        this.bandedPublicNetData = res.data;
                    } else {
                    }
                },
                err => {}
            );
        },

        //绑定：找所有未绑定的 公网IP
        //status: 值为'DOWN' 时查询找所有未绑定的 公网IP
        getUnbindPublicIP: function(state = 'DOWN') {            
            return getUnbindPublicIP({ state }).then(
                res => {                   
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data;
                        if (resData && resData.data) {
                            this.publicNetData = resData.data || [];
                        }
                    } else {
                    }
                },
                err => {}
            );
        }
    }
};
</script>
<style lang="scss">
.dlg-bindip {
    .el-form {
        .el-form-item__label {
            padding-right: 0;
        }
        .el-form-item.el-form-item--small.lh-em1 {
            .el-form-item__label {
                    line-height: 1 !important;
            }
            .el-form-item__content {
                line-height: 1 !important;
            }
        }        
    }
}

</style>
