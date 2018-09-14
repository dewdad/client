<template>
    <el-dialog :title="optype == 1?'创建角色':'编辑角色'" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="角色名称 " prop="roleName" :label-width="formLabelWidth">
                <el-input placeholder="输入角色名称" v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色类型" prop="roleType" :label-width="formLabelWidth">
                <el-radio v-model="form.roleType" label="2">部门管理员</el-radio>
                <el-radio v-model="form.roleType" label="3">子部门管理员</el-radio>
                <el-radio v-model="form.roleType" label="4">用户</el-radio>
            </el-form-item>
            <el-form-item label="描述 " prop="description" :label-width="formLabelWidth">
                <el-input placeholder="输入描述" type="textarea" v-model="form.description"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {createRole,editRole} from '@/service/usermgr/rolemgr.js';
export default {
    data() {
        return{
            formLabelWidth: '120px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            optype:1,
            form:{
                roleType:'2',
                roleName:'',
                description:''
            },
            rules:{
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleType: [
                    { required: true, message: '请输勾选角色类型', trigger: 'submit' }
                ]

            }
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    props: {},
    methods: {
        show(item,optype) {
            this.isShow = true;
            this.optype = optype;
            console.log('item',item);
            if(optype !== 1){
                this.form.roleType = item.roleType;
                this.form.id = item.id;
            }
            this.form.roleName = item.roleName;
            this.form.description = item.description;
            console.log('optype',optype);
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
        confirm() {
            this.confirmBtn = true;
            this.form.deptId = this.user.deptId;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.optype === 1){
                        this.addRole();
                    }else{
                        this.editRole();
                    }
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        addRole(){
            createRole(this.form)
                .then(res => {
                    if(res.data.code === '0000'){
                        this.resolve(this.form);
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
                    }else{
                        this.$alert('操作失败', '提示', {
                            type: 'error'
                        });
                        this.confirmBtn = false;
                        return;
                    }
                })
                .catch(err => {
                    this.confirmBtn = false;
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
        editRole(){
            editRole(this.form)
                .then(res => {
                    if(res.data.code === '0000'){
                        this.resolve(this.form);
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
                    }else{
                        this.$alert('操作失败', '提示', {
                            type: 'error'
                        });
                        this.confirmBtn = false;
                        return;
                    }
                })
                .catch(err => {
                    this.confirmBtn = false;
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        }

    }
};
</script>
<style lang="scss">

</style>
