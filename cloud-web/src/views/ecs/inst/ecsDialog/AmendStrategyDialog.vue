<template>
    <el-dialog :title="dlgTitle+'策略'" :visible.sync="isShow" width="700px" class="AmendStrategyDialog" @close="cancel">
        <div style="padding-right:100px">
            <zt-form inline-message class="demo-ruleForm" :model="policy" :rules="rules" ref="policy" label-width="100px" size="small">
                <!-- 策略名称 -->
                <zt-form-item label="策略名称" prop="pname">
                    <el-input size="small" v-model="policy.pname"></el-input>
                    <div class="input-help">长度为2-30个字符，不能以特殊字符及数字开头，只可包含特殊字符中的"."，"_"或"-"。</div>
                </zt-form-item>
                <!-- 创建时间 -->
                <zt-form-item label="创建时间" prop="execTime">
                    <el-time-picker size="small" v-model="policy.execTime" value-format="HH:mm:ss" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择时间" style="width: 100%">
                    </el-time-picker>
                </zt-form-item>
                <!-- 重复日期 -->
                <zt-form-item label="重复日期" prop="repeatDate">
                    <el-checkbox-group v-model="policy.repeatDate">
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
                        <el-input-number size="small" v-model="policy.saveDays" controls-position="right" :min="1" :max="65536"></el-input-number>
                        <span class="unit color999">天</span>
                        <span class="color999">保留天数取值范围：1-65536</span>
                    </div>
                    <!-- <div class="font12">
                    <el-radio name="remainTime" class="font12 mt20" v-model="remainTime" :label="2">持续保留，直至快照数量达到额度上限后被自动删除</el-radio>
                </div> -->
                </zt-form-item>
            </zt-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="loading">{{ $t('common.ok') }}</el-button>
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
            loading: false,
            dlgTitle: '',
            policy: {
                pname: '',
                execTime: '',
                repeatDate: ['1'],
                saveDays: 1
            },
            savaPolicy: null,
            rules: {
                pname: [
                    {required: true, message: '请输入策略名称', trigger: 'blur'},
                    {
                        min: 2,
                        max: 30,
                        message: '长度为2-30个字符',
                        trigger: ['chang', 'submit']
                    }
                ],
                execTime: [{required: true, message: '请选择执行时间', trigger: 'blur'}],
                repeatDate: [{required: true, message: '请选择重复日期', trigger: 'blur'}]
            }
        };
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.policy = {
                    pname: '',
                    execTime: '',
                    repeatDate: ['1'],
                    saveDays: 1
                };
                this.$refs.policy.resetFields();
                this.$refs.policy.clearValidate();
            }
        }
    },
    methods: {
        show(rowItem, opType) {
            this.opType = opType;
            if (opType) {
                if (opType == 1) {
                    //创建
                    this.dlgTitle = '创建';
                    this.savaPolicy = createPolicy;
                } else if (opType == 2) {
                    //修改
                    this.dlgTitle = '修改';
                    this.savaPolicy = modifyPolicy;
                    this.policy.pid = rowItem.pid;
                    this.policy.pname = rowItem.pname;
                    this.policy.execTime = rowItem.execTime;
                    this.policy.saveDays = rowItem.saveDays;
                    this.policy.repeatDate = rowItem.repeatDate.split(',');
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
        },
        cancel() {
            typeof this.reject() === 'function' && this.reject();
        },
        confirm() {
            this.$refs.policy.validate(valid => {
                if (valid) {
                    let data = {
                        pname: this.policy.pname,
                        execTime: this.policy.execTime,
                        repeatDate: this.policy.repeatDate.join(','),
                        saveDays: this.policy.saveDays,
                        ptype: 1
                    };
                    if (this.opType === 2) data['pid'] = this.policy.pid;
                    this.savaPolicy(data)
                        .then(res => {
                            if (res.code === '0000') {
                                $log('savaPolicy', res);
                                this.hide();
                                this.resolve();
                            }
                        })
                        .catch(err => {});
                }
            });
        }
    }
};
</script>
<style lang="scss">
.AmendStrategyDialog {
    .demo-ruleForm {
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
