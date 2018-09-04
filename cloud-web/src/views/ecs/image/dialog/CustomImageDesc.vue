<template>
    <el-dialog title="编辑" :visible.sync="isShow" width="600px" class="CustomImageDesc" @close="cancel">
        <div style="padding-left:20px;">
            <zt-form inline-message class="demo-ruleForm" :model="ruleForm" label-width="130px" size="small" :rules="rules" ref="ruleForm">
                <!-- 系统平台 -->
                <zt-form-item label="自定义镜像名称" prop="name">
                    <div>
                    <el-input size="small" v-model="ruleForm.name"></el-input>
                    <span class="input-help">长度为2-128个字符，不能以特殊字符及数字开头，只可包含特殊字符中的"."，"_"或"-"。</span>
                    </div>
                </zt-form-item>
                <!-- 镜像描述 -->
                <zt-form-item label="是否受保护" prop="protected">
                    <el-radio v-model="ruleForm.protected" :label="true">受保护</el-radio>
                    <el-radio v-model="ruleForm.protected" :label="false">不受保护</el-radio>
                </zt-form-item>
            </zt-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {updateImage} from '@/service/ecs/image.js';

export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            rowItem: {},
            ruleForm: {
                id: '',
                name: '',
                protected: false
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入自定义镜像名称',
                        trigger: ['submit', 'change']
                    },
                    {
                        min: 2,
                        max: 64,
                        message: '长度为2-64个字符',
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: /^[a-zA-Z]{1}[a-zA-Z0-9._-]+$/,
                        message: '格式错误',
                        trigger: ['submit', 'blur']
                    }
                ]
            },
            options: [{value: '选项1', label: '黄金糕'}, {value: '2', label: '黄金'}]
        };
    },
    props: {},
    watch: {
        isShow: function(newval) {
            if (newval) {
                this.$nextTick(() => {
                    this.$refs.ruleForm.clearValidate();
                });
            } else {
                this.ruleForm.name = '';
                this.ruleForm.protected = false;
            }
        }
    },
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.ruleForm.id = rowItem.id;
            this.ruleForm.name = rowItem.name;
            this.ruleForm.protected = rowItem.protected;
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
            //imageId,type,name,description
            let data = {
                imageId: this.rowItem.id,
                type: 'desc',
                description: this.ruleForm.description
            };
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    updateImage(data)
                        .then(res => {
                            if (res.code === '0000') {
                                this.resolve(this.ruleForm.description);
                                this.hide();
                                this.$message.success('操作成功');
                            }
                            //this.setting();              
                        })
                        .catch(err => {
                            console.log('updateImage', err);
                        });
                }
            });
            
        }
    }
};
</script>
<style lang="scss" scoped>
.CustomImageDesc {
    .demo-ruleForm {
        width: 80%;
    }
}
</style>
