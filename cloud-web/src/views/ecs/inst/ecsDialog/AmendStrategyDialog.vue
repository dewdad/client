<template>
    <el-dialog :title="dlgTitle+'策略'" :visible.sync="isShow" width="600px" class="AmendStrategyDialog">
        <zt-form  inline-message class="demo-ruleForm" :model="policy" :rules="rules" ref="policy" label-width="100px" size="small">
            <!-- 策略名称 -->
            <zt-form-item label="策略名称" prop="pname">
                <el-input size="small" v-model="policy.pname"></el-input>
                <div class="input-help">长度为2-30个字符，不能以特殊字符及数字开头，只可包含特殊字符中的"."，"_"或"-"。</div>
            </zt-form-item>
            <!-- 创建时间 -->
            <zt-form-item label="创建时间" prop="execTime">
                <el-time-picker
                    size="small"
                    v-model="policy.execTime"
                    value-format="HH:mm:ss"
                    :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                    placeholder="请选择时间">
                </el-time-picker>
            </zt-form-item>
            <!-- 重复日期 -->
            <zt-form-item label="重复日期" prop="checkList">
                <el-checkbox-group v-model="checkList">
                    <el-checkbox label="1">周一</el-checkbox>
                    <el-checkbox label="2">周二</el-checkbox>
                    <el-checkbox label="3">周三</el-checkbox>
                    <el-checkbox label="4">周四</el-checkbox>
                    <el-checkbox label="5">周五</el-checkbox>
                    <el-checkbox label="6">周六</el-checkbox>
                    <el-checkbox label="7">周日</el-checkbox>
                </el-checkbox-group>
            </zt-form-item>
            <!-- 保留时间 -->
            <zt-form-item label="保留时间">
                <div class="font12">
                    <el-radio name="remainTime" class="font12 mr10" v-model="remainTime" :label="1">自定义时长</el-radio>
                    <el-input-number size="small" v-model="policy.saveDays" controls-position="right" :min="1" :max="65536"></el-input-number>
                    <span class="unit color999">天</span>
                    <span class="color999">保留天数取值范围：1-65536</span>
                </div>
                <div class="font12">
                    <el-radio name="remainTime" class="font12 mt20" v-model="remainTime" :label="2">持续保留，直至快照数量达到额度上限后被自动删除</el-radio>
                </div>
            </zt-form-item>
        </zt-form>
        
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {createPolicy, modifyPolicy} from '@/service/ecs/policy.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            dlgTitle:'',
            policy: {
            },
            savaPolicy: null,
            checkList:['1'],
            remainTime:1,
            rules: {
                pname: [
                    { required: true, message: '必填项', trigger: 'blur' },
                ],
                execTime: [
                    { required: true, message: '必填项', trigger: 'blur' },
                ],
                checkList: [
                    { required: true, message: '必填项', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        show(rowItem, opType) {
            this.opType = opType;
            if (opType) {
                if (opType == 1) {
                    //创建
                    this.dlgTitle = '创建';
                    this.savaPolicy = createPolicy;

                    this.remainTime = 1;
                    this.policy = {
                        ptype: 1,                     
                        saveDays: 7, 
                        repeatDate:''                  
                    };                    
                } else if (opType == 2) {
                    //修改
                    this.dlgTitle = '修改';
                    this.savaPolicy = modifyPolicy;
                    
                    this.policy = Object.assign({}, rowItem);
                    if(this.policy.saveDays === -1) {
                        this.remainTime = 2;
                        this.policy.saveDays = '';
                    }                    
                }
            }

            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.policy = {};
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
            //重复日期：字符串
            this.policy.repeatDate = this.checkList.join(',');
            if(this.remainTime == 2) this.policy.saveDays = -1;
            this.savaPolicy(this.policy)
                .then(res => {
                    $log('savaPolicy', res);  
                    this.hide();  
                    this.resolve(this.policy);                 
                })
                .catch(err => {                   
                });
        }
    }
};
</script>
<style lang="scss">
.AmendStrategyDialog {
    .demo-ruleForm{
        width: 95%;
        padding-left: 20px;
        .el-radio__label {
            font-size: 12px;
        }
        .unit {
            position: relative;
            left: -48px;
        }
    }
}
</style>
