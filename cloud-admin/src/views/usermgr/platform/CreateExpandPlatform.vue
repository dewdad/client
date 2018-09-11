<template>
    <el-dialog :title="optype === 1?'新建平台信息':'修改平台信息'" :visible.sync="isShow" width="600px" class="CreateResource" v-dialogDrag>
        <el-form size="small" :model="expandForm" :rules="rules" ref="expandForm">
            <el-form-item label="信息名称 " :label-width="formLabelWidth" prop="paramName">
                <el-input placeholder="输入信息名称" v-model="expandForm.paramName" ></el-input>
            </el-form-item>
            <el-form-item label="值 " :label-width="formLabelWidth" prop="paramVal">
                <el-input placeholder="输入值" v-model="expandForm.paramVal" ></el-input>
            </el-form-item>
            <el-form-item label="描述信息" :label-width="formLabelWidth" prop="description">
                <el-input placeholder="输入描述信息" v-model="expandForm.description" ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="submitForm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {createExpand,editExpand} from '@/service/platform.js';
export default {
    data() {
        return{
            formLabelWidth: '110px',
            isShow: false,
            resolve: null,
            reject: null,
            optype:1,
            confirmBtn: false,
            expandItem:{},
            platformResourceId:'',
            expandForm: {
                paramName: '',
                paramVal: '',
                description: '',
            },
            rules:{
                paramName: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                paramVal: [
                    { required: true, message: '请输入值', trigger: 'blur' }
                ],
            }
        };
    },
    props: {},
    methods: {
        show(item,id,optype) {
            this.isShow = true;
            this.optype = optype;
            this.expandItem = item;
            this.platformResourceId = id;
            console.log('this.expandItem',this.expandItem);
            console.log('this.optype',this.optype);
            this.expandForm.paramName = item.paramName;
            this.expandForm.paramVal = item.paramVal;
            this.expandForm.description = item.description;
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
                    typeof this.resolve(this.expandForm) === 'function' && this.resolve(this.expandForm);
                }, 1000);
            });
        },
        submitForm() {
            this.$refs.expandForm.validate((valid) => {
                console.log('this.optype',this.optype);
                this.confirmBtn = true;
                if (valid) {
                    if(this.optype === 1){
                        alert('add');
                        this.add();
                    }else{
                        this.edit(this.expandItem);
                    }
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //新建扩展信息
        add(){
            this.expandForm.platformResourceId = this.platformResourceId;
            let data = {
                expand: this.expandForm
            };
            createExpand(data)
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
        //修改扩展信息
        edit(item){
            this.expandForm.platformResourceId = this.platformResourceId;
            let data = {
                expand: this.expandForm,
                id:item.id
            };
            editExpand(data)
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
