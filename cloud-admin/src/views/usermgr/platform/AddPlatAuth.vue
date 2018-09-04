<template>
    <el-dialog title="添加平台权限" :visible.sync="isShow" width="600px" class="AddPlatAuth" v-dialogDrag>
        <el-form size="small" :model="AddPlatAuthForm" :rules="rules" ref="AddPlatAuthForm">
            <el-form-item label="权限名称 " :label-width="formLabelWidth" prop="name">
                <el-input placeholder="输入权限名称" v-model="AddPlatAuthForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="角色 " :label-width="formLabelWidth" prop="roleVal">
                <el-input placeholder="输入角色名称" v-model="AddPlatAuthForm.roleVal" ></el-input>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                <el-input  type="textarea" placeholder="输入描述" v-model="AddPlatAuthForm.description" ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="submitForm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {addPlatAuth,editPlatAuth} from '@/service/platform.js';
export default {
    data() {
        return{
            formLabelWidth: '110px',
            isShow: false,
            resolve: null,
            reject: null,
            optype:1,
            resouceName: '',
            confirmBtn: false,
            platItem:{},
            AddPlatAuthForm: {
                name: '',
                roleVal: '',
                description: '',
                platformResourceId:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入权限名称', trigger: 'blur' }
                ],
                roleVal: [
                    { required: true, message: '请输入角色', trigger: 'blur' }
                ]
            }
        };
    },
    props: {},
    methods: {
        show(item,optype,id) {
            this.isShow = true;
            this.optype = optype;
            console.log('platformResourceId',id);
            this.AddPlatAuthForm.platformResourceId = id;
            this.AddPlatAuthForm.description = item.description;
            this.AddPlatAuthForm.roleVal = item.roleVal;
            this.AddPlatAuthForm.name = item.name;
            this.platItem = item;
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
            this.$refs.AddPlatAuthForm.validate((valid) => {
                console.log('this.platItem',this.platItem);
                console.log('this.optype',this.optype);
                if (valid) {
                    if(this.optype === 1){
                        this.add();
                    }else{
                        this.edit(this.platItem);
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //添加权限
        add(){
            addPlatAuth(this.AddPlatAuthForm)
                .then(res => {
                    this.resolve(this.AddPlatAuthForm);
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
        //修改权限
        edit(item){
            let data = {
                form: this.AddPlatAuthForm,
                id:item.id
            };
            editPlatAuth(data)
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
