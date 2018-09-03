<template>
    <el-dialog :title="dialogTitle" :visible.sync="isShow" width="600px" class="dlg-bindLinkip" @close="cancel">

        <zt-form inline-message :model="ruleForm" style="width:318px;" size="small"  ref="ruleForm" :show-message="false">
            <template v-if="opType === 1">
                <!-- 新建IP地址 -->
                <zt-form-item class="lh-em1" >
                    <el-radio v-model="ruleForm.applyType" :label="1">
                        <span class="color333">{{$t('dialog.bindLinkip.newIP')}}</span>
                    </el-radio>
                </zt-form-item>
                <!-- 选择已有 -->
                <zt-form-item class="lh-em1 mb0">
                    <el-radio v-model="ruleForm.applyType" :label="2">
                        <span class="color333">{{$t('dialog.bindLinkip.selectExisted')}}</span>
                    </el-radio>
                </zt-form-item>

                <zt-form-item class="lh-em1 mb0 selip" v-if="ruleForm.applyType === 2" prop="portObj" :rules="rules">                   
                    <el-select v-model="ruleForm.portObj" size="small" :placeholder="$t('dialog.bindLinkip.placeholder')" value-key="id" >
                        <el-option v-for="item in publicNetData" :key="item.id" :label="item.ipAdd" :value="item">
                        </el-option>
                    </el-select>                                    
                </zt-form-item>
            </template>

            <template v-if="opType === 2">
                <zt-form-item class="mb0" :label="$t('dialog.bindLinkip.linkIP')" label-width="82px" prop="portObj" :rules="rules">
                    <span class="color333 pl20">{{ ruleForm.portObj.ipAdd }} </span>
                    <!-- <el-select v-model="ruleForm.portObj" size="small" :placeholder="$t('dialog.bindLinkip.placeholder')" value-key="id" >
                        <el-option v-for="item in bandedPublicNetData" :key="item.id" :label="item.ipAdd" :value="item"></el-option>
                    </el-select> -->
                </zt-form-item>
            </template>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="cancel" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {
    getPortByEcsId,
    getBindedPublicIpByEcsId
} from '@/service/ecs/list.js';
import { getUnbindPublicIP,modifyFloatIP } from '@/service/ecs/floating.js';
export default {
    data() {        
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,

            ecsInst: {}, 
            intranetData:{},   
            publicNetData: [], //绑定页面：未绑定的公网
            bandedPublicNetData: [], //解绑页面：本实例已绑定的公网 
            opType: 1, //1:绑定连接IP； 2：解绑连接IP
            applyType: 1, //1:新建连接IP； 2：使用已有连接IP

            ruleForm:{
                applyType:1,
                portObj:'',
            },
            rules:  [
                {
                    required: true,
                    message: $t('dialog.bindLinkip.placeholder'),
                    trigger: ['submit', 'change']
                }
            ],                
            
        };
    },    
    computed: {
        dialogTitle() {
            return this.opType === 1 ? $t('dialog.bindLinkip.bindLinkip') : $t('dialog.bindLinkip.unbindLinkip');
        }
    },
    methods: {
        show(rowItem,opType) {
            let { id, name, ip, floatIp } = { ...rowItem };
            this.ecsInst = { ecsId: id, name, ip, floatIp };
            this.opType = opType;

            console.log('this.ecsInst', this.ecsInst);
            this.isShow = true;

            this.getPortByEcsId(this.ecsInst);

            switch (this.opType) {
                case 1: {
                    //绑定连接IP
                    this.getUnbindPublicIP();
                    break;
                }
                case 2: {
                    //解绑连接IP
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
                applyType:1,
                portObj:'',
            };
            this.intranetData = {};       
            this.bandedPublicNetData = [];
            this.publicNetData = [];
            this.loading = false;
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
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    //初始值为：绑定 新建IP地址(ruleForm.applyType == 1)
                    //id 传递实例id
                    //port传递intranetData.portId
                    let data = {
                        id: this.ecsInst.ecsId, 
                        type: 'newCreate', //'bind','newCreate','unbind'
                        port: this.intranetData.portId, 
                    };                    
                    if(this.opType === 1){//绑定连接IP                        
                        if(this.ruleForm.applyType == 2){//选择已有
                            data.type = 'bind';
                            data.id = this.ruleForm.portObj ? this.ruleForm.portObj.id : '';
                        }
                        if(!data.port) return;
                    }else {//解绑连接IP
                        if(this.ruleForm.portObj && this.ruleForm.portObj.id){
                            data.id = this.ruleForm.portObj.id;
                            data.type = 'unbind';
                            data.port = ''; //port传空值
                        }else{
                            return;
                        }
                    }                   
                    
                    this.loading = true;
                    //提交后台
                    modifyFloatIP(data)
                        .then( res => {
                            this.loading = false;
                            console.log(res);
                            this.resolve(this.ecsInst);
                            this.hide();
                            this.$message.success($t('common.successOpt'));
                        })
                        .catch(err => {     
                            this.loading = false;         
                            $log(err);                   
                        });
                }
            });
            
        },

        //解绑：查询本实例已经绑定的公网IP
        getBindedPublicIpByEcsId: function(ecsInst) {
            getBindedPublicIpByEcsId(ecsInst)
                .then( res => {           
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.result;
                        this.bandedPublicNetData = resData || []; 
                        this.ruleForm.portObj = this.bandedPublicNetData[0] || {};
                    }
                })
                .catch(err => {              
                    $log(err);                   
                });
        },
        //绑定：根据实例id查询端口（端口和内网IP是一对一的关系，可以理解是内网IP）
        getPortByEcsId: function(ecsInst) {
            getPortByEcsId(ecsInst)
                .then( res => {                  
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.result;
                        //内网IP（port），新建或者选择已有都传递该值
                        this.intranetData = resData[0] || {}; 
                    }
                })
                .catch(err => {              
                    $log(err);                   
                });
        },
        //绑定：找所有未绑定的 公网IP
        //status: 值为'DOWN' 时查询找所有未绑定的 公网IP
        getUnbindPublicIP: function( status = 'DOWN', eip_subnet = 'true') {
            getUnbindPublicIP({ status,eip_subnet })
                .then( res => {                 
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.result;
                        if (resData && resData.records) {
                            this.publicNetData = resData.records;
                        }
                    }
                })
                .catch(err => {
                    this.loading = false;
                    $log(err);                   
                });
        }
    }
};
</script>
<style lang="scss">
.mt16 {
    margin-top: 16px;
}
.dlg-bindLinkip {
    .el-form {      
        .el-form-item {
            margin-bottom: 16px;
        }  
        .el-form-item__label {
            padding-right: 0;
        }
        .el-form-item.el-form-item--small.lh-em1 {
            .el-form-item__label {
                line-height: 1 !important;
                margin-bottom: 16px;
            }
            .el-form-item__content {
                line-height: 1 !important;
            }
        }
    }
    .el-radio .el-radio__label {
        font-size: 14px;
        padding-left: 6px;
    }
    .selip {
        width: 318px;
        margin-left: 20px;
        margin-top: 4px;
    }
}
</style>
