<template>
    <el-dialog
        title="绑定浮动IP"
        :visible.sync="isShow"
        width="45%"
        class="BindFLexIPDialog">
        <zt-form inline-message :model="ruleForm" label-width="100px" style="width:392px;" size="small"  ref="ruleForm" :show-message="false">
            <zt-form-item label="IP地址" prop="felxIp">
                <el-input size="small" disabled v-model="ruleForm.felxIp"></el-input>
            </zt-form-item>
            <zt-form-item label="ECS实例" prop="ecsCase">
                <el-select v-model="ruleForm.ecsCase" placeholder="请选择">
                    <el-option
                    v-for="item in instOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {bindFloatIP} from '@/service/ecs/network.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            floatId: '',
            ruleForm:{
                felxIp:'',
                ecsCase: ''
            },
            instOptions: [],
            rules: {
                ecsCase: [
                    { required: true, message: '请选择ECS实例', trigger: 'submit' }
                ],
            }
        }; 
    },
    watch: {
        isShow(val) {
            if(!val){
                this.ruleForm.ecsCase = '';
            }
        }
    },
    methods: {
        show(params, rowItem) {
            this.ruleForm.felxIp = params.floatingIpAddress;
            this.floatId = params.id;
            this.instOptions = rowItem;
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
            if (!this.$refs['ruleForm']) return false;

            // 表单验证
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.bindFloatIPFn();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 确定绑定浮动IP
        bindFloatIPFn() {

            bindFloatIP(this.ruleForm.ecsCase, this.floatId)
                .then(res => {
                    if (res && res.data) {
                        let data = res.data;
                        if (data.code && data.code === this.CODE.SUCCESS_CODE) {
                            let dataList = data.data || [];
                            $log(dataList);
                        }
                    }
                })
                .catch(e => {
                    console.error('bindFloatIPFn', e);
                    self.loading = false;
                });
        }
    }
};
</script>
<style lang="scss">
.BindFLexIPDialog{
    .tip{
        background-color: #FBF7CF;
        padding: 15px 30px;
        color: #F68300;
        border: 1px solid #F6E0C4;
        ul, li{
            list-style-type: disc;
        }
    }
}
</style>
