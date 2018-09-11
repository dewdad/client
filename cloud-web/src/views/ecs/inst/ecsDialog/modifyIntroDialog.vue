<template>
    <el-dialog :title="$t('dialog.modifyEcsInstInfo.title')" :visible.sync="isShow" width="600px" class="modifyIntroDialog" @close="cancel">
        <zt-form inline-message size="small" class="wd403" :model="ecsInst" label-width="85px" :rules="rules" ref="ruleForm" :show-message="false">
            <!-- 当前实例 -->
            <zt-form-item :label="$t('dialog.modifyEcsInstInfo.currentInst')" class="lh-em1 text-break-all">
                <span>{{ rowItem.id + ' / ' + rowItem.name }}</span>
            </zt-form-item>

            <zt-form-item :label="$t('dialog.modifyEcsInstInfo.instName.label')" class="mb20" prop="name" :showRule="true" has-help>
                <el-input v-model="ecsInst.name" :placeholder="$t('dialog.modifyEcsInstInfo.instName.placeholder')" maxlength="64" minlength="2" :clearable="true"></el-input>
                <!-- <span class="input-help">只能由中文字符、英文字母、数字、下划线、中划线组成，且长度小于等于64个字符</span> -->
            </zt-form-item>
            <zt-form-item :label="$t('dialog.modifyEcsInstInfo.desc.label')" class="mb0 hide-star" prop="remark">
                <el-input type="textarea" v-model="ecsInst.remark" maxlength="300" autosize :placeholder="$t('dialog.modifyEcsInstInfo.desc.placeholder')" :clearable="true"></el-input>
                <span class="input-help">{{$t('dialog.modifyEcsInstInfo.desc.tip')}}</span>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" :disabled="loading">{{ $t('common.ok') }}</el-button>            
        </span>
    </el-dialog>
</template>
<script>
import {INST_NAME} from '@/constants/regexp';
import {editInstInfo} from '@/service/ecs/list.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            rowItem:{},
            ecsInst: {
                instanceId:'',
                name:'',
                remark:''
            },            
            rules: {
                name: [
                    {
                        required: true,
                        message: $t('dialog.modifyEcsInstInfo.instName.required'),
                        trigger: ['submit']
                    },
                    {
                        min: 2,
                        max: 64,
                        show: true,
                        message: $t('valid.name.length'),
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: INST_NAME,
                        show: true,
                        message: $t('valid.name.regex'),
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.rowItem = {};
                this.ecsInst = {
                    instanceId: '',
                    name: '',
                    remark: ''
                };
            }
        }
    },
    methods: {
        show(rowItem) {
            this.rowItem = rowItem; 
            let {id, name, remark} = {...rowItem};            
            this.ecsInst = {instanceId: id, name, remark};
            console.log('this.ecsInst', this.ecsInst);
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
        },
        cancel() {
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
            //提交后台：修改信息
            this.$refs['ruleForm'].validate( valid => {
                if(valid){
                    this.loading = true;
                    editInstInfo(this.ecsInst).then(
                        res => {
                            this.loading = false;                    
                            let {name,remark} = this.ecsInst;
                            this.resolve({name,remark});                    
                            this.hide();
                            this.$message.success($t('common.successOpt'));                  
                        },
                        err => {
                            this.loading = false;
                            $log(err);
                        }
                    );
                }
            });
            
        }
    }
};
</script>
<style lang="scss">
.modifyIntroDialog {
    .wd403 {
        width: 403px; //85 + 318     
    }
    .el-form .el-form-item__label {
        padding-right: 0;
    }
    .el-form {         
        .el-form-item.el-form-item--small.lh-em1 {
            margin-bottom: 12px;
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
