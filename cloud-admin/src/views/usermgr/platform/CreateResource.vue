<template>
    <el-dialog title="创建平台" :visible.sync="isShow" width="600px" class="CreateResource" v-dialogDrag>
        <el-form size="small" :model="rescourceForm" :rules="rules" ref="rescourceForm">
            <el-form-item label="资源名称 " :label-width="formLabelWidth" prop="resource">
                <el-input placeholder="输入资源名称" v-model="rescourceForm.resource" ></el-input>
            </el-form-item>
            <el-form-item label="endpoint " :label-width="formLabelWidth" prop="endpoint">
                <el-input placeholder="输入endpoint" v-model="rescourceForm.endpoint" ></el-input>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="submitForm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {addPlatForm,editPlatForm} from '@/service/platform.js';
export default {
    data() {
        let validateEndpoint = function(rule, value, callback){
            let reg = /^(http|https):\/\//;
            if (!reg.test(value)) {
                callback(new Error('请输入以http或https开头的endpoint'));
            } else {
                callback();
            }
        };
        return{
            formLabelWidth: '110px',
            isShow: false,
            resolve: null,
            reject: null,
            optype:1,
            resouceName: '',
            confirmBtn: false,
            resouceNameShow:0,
            resourceItem:{},
            rescourceForm: {
                resource: '',
                endpoint: '',
            },
            rules:{
                resource: [
                    { required: true, message: '请输入资源名称', trigger: 'blur' }
                ],
                endpoint: [
                    { required: true, message: '请输入endpoint', trigger: 'blur' },
                    {validator: validateEndpoint, trigger: 'blur' }
                ],
            }
        };
    },
    props: {},
    methods: {
        show(item,optype) {
            this.isShow = true;
            this.optype = optype;
            this.resourceItem = item;
            if(item){
                this.rescourceForm.resource = item.resource;
                this.rescourceForm.endpoint = item.endpoint;
            }
            this.$nextTick(() => {
                this.$refs['rescourceForm'].clearValidate();
            });
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
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        submitForm() {
            this.$refs.rescourceForm.validate((valid) => {
                console.log('this.resourceItem',this.resourceItem);
                console.log('this.optype',this.optype);
                this.confirmBtn = true;
                if (valid) {
                    if(this.optype === 1){
                        this.add();
                    }else{
                        this.edit(this.resourceItem);
                    }
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //新建平台
        add(){
            let data = {
                resource: this.rescourceForm.resource,
                endpoint: this.rescourceForm.endpoint
            };
            addPlatForm(data)
                .then(res => {
                    this.resolve(data);
                    this.hide();
                    this.setting();
                    this.confirmBtn = false;
                })
                .catch(err => {
                    this.confirmBtn = false;
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
        //修改平台
        edit(item){
            let data = {
                resource: this.rescourceForm.resource,
                endpoint: this.rescourceForm.endpoint,
                id:item.id
            };
            editPlatForm(data)
                .then(res => {
                    this.resolve(data);
                    this.hide();
                    this.setting();
                    this.confirmBtn = false;
                })
                .catch(err => {
                    this.confirmBtn = false;
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },

    }




};
</script>
<style lang="scss">

</style>
