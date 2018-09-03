<template>
    <el-dialog title="编辑自定义镜像描述" :visible.sync="isShow" width="600px" class="CustomImageDesc">
        <div style="padding-left:20px;">
            <zt-form inline-message class="demo-ruleForm" :model="ruleForm" label-width="130px" size="small" :rules="rules" ref="ruleForm">
                <!-- 镜像名称 -->
                <zt-form-item label="自定义镜像ID">
                    <span>{{ rowItem.id || '-' }}</span>
                </zt-form-item>
                <!-- 系统平台 -->
                <zt-form-item label="自定义镜像名称">
                    <span>{{ rowItem.name || '-' }}</span>
                </zt-form-item>
                <!-- 镜像描述 -->
                <zt-form-item label="自定义镜像描述" prop="description">
                    <el-input size="small" v-model="ruleForm.description"></el-input>
                </zt-form-item>
            </zt-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
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
                description: ''
            },
            rules: {
                description: [{required: true, message: '必填项', trigger: 'blur'}]
            },
            options: [{value: '选项1', label: '黄金糕'}, {value: '2', label: '黄金'}]
        };
    },
    props: {},
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.ruleForm.description = rowItem.description;
            this.isShow = true;

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;

            this.ruleForm = {};
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
            //imageId,type,name,description
            let data = {
                imageId: this.rowItem.id,
                type: 'desc',
                description: this.ruleForm.description
            };
            updateImage(data)
                .then(res => {
                    this.resolve(this.ruleForm.description);
                    this.hide();
                    //this.setting();              
                })
                .catch(err => {
                    console.log('updateImage', err);
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
