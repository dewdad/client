<template>
    <el-dialog
        title="修改磁盘描述"
        :visible.sync="isShow"
        width="600px"
        class="ModifyDiskDescripDialog">
        <zt-form :model="rowItem" :rules="rules" ref="rowItem" inline-message class="demo-ruleForm" label-width="100px" size="small">
            <!-- 磁盘名称 -->
            <zt-form-item label="磁盘名称" prop="name">
                <el-input minlength="2" maxlength="128" size="small" v-model="rowItem.name"></el-input>
                <div slot="help" class="input-help">只能由中文字符、英文字母、数字、下划线、中划线组成，且长度小于等于64个字符。</div>
            </zt-form-item>
            <!-- 磁盘描述 -->
            <zt-form-item label="磁盘描述" prop="remark">
                <el-input maxlength="128" size="small" v-model="rowItem.remark"></el-input>
                <div slot="help" class="input-help">您最多可以输入128个字符。</div>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" size="small" @click="isShow = false" :disabled="loading">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="loading">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {updateDisk} from '@/service/ecs/disk/disk.js';
import {INST_NAME} from '@/constants/regexp';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,        
            rowItem:{},
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入磁盘名称',
                        trigger: ['submit']
                    },
                    {
                        min: 2,
                        max: 64,
                        message: '名称输入有误',                       
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: INST_NAME,
                        message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ],
                description: [{required: true, message: '请输入磁盘描述', trigger: ['submit']}]
            }
        };
    },
    watch: {
        isShow(val) {
            if(!val){
                this.$refs['rowItem'].resetFields();
                this.$refs['rowItem'].clearValidate();
            }
        }
    },
    methods: {
        show(rowItem) {
            let { id,name,description} = rowItem;
            this.rowItem = { id,name, remark:description};
            this.isShow = true;

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.rowItem = {};
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
            //表单校验
            this.$refs['rowItem'].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    //提交后台
                    updateDisk(this.rowItem)
                        .then( res => {   
                            this.resolve(this.rowItem);                 
                            this.hide();
                            //this.setting();                     
                            this.$message.success('操作成功');                   
                        })
                        .catch(err => {
                            $log(err);
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
            });          
        }
    }
};
</script>
<style lang="scss">
.ModifyDiskDescripDialog{
    .demo-ruleForm{
        width: 70%;
        margin-left: 20px;
    }
}
</style>
