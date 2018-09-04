<template>
    <el-dialog
        title="修改磁盘描述"
        :visible.sync="isShow"
        width="45%"
        class="ModifyDiskDescripDialog">
        <zt-form :model="rowItem" :rules="rules" ref="rowItem" inline-message class="demo-ruleForm" label-width="100px" size="small">
            <!-- 磁盘名称 -->
            <zt-form-item label="磁盘名称" prop="name">
                <el-input minlength="2" maxlength="128" size="small" v-model="rowItem.name"></el-input>
                <div class="input-help">长度限制为2-128个字符。</div>
            </zt-form-item>
            <!-- 磁盘描述 -->
            <zt-form-item label="磁盘描述" prop="remark">
                <el-input maxlength="128" size="small" v-model="rowItem.remark"></el-input>
                <div class="input-help">您最多可以输入128个字符。</div>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {updateDisk} from '@/service/ecs/disk/disk.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,            
            rowItem:{},
            rules: {
                name: [
                    { required: true, message: '必填项', trigger: 'blur' }
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
            let { id,name,remark} = rowItem;
            this.rowItem = { id,name,remark};
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
