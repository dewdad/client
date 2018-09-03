<template>
    <el-dialog title="创建角色" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="角色名称 " prop="roleName" :label-width="formLabelWidth">
                <el-input placeholder="输入角色名称" v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色类型" prop="roleType" :label-width="formLabelWidth">
                    <el-radio v-model="form.roleType" label="1">管理员</el-radio>
                    <el-radio v-model="form.roleType" label="2">用户</el-radio>
            </el-form-item>
            <el-form-item label="描述 " prop="description" :label-width="formLabelWidth">
                <el-input placeholder="输入描述" type="textarea" v-model="form.description"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {createRole} from '@/service/usermgr/rolemgr.js';
export default {
    data() {
        return{
            formLabelWidth: '120px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            form:{
                roleType:'1',
                roleName:'',
                description:'',
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
    props: {},
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods: {
        show(item,optype) {
            this.isShow = true;

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
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.form.deptId = this.user.deptId;
                    createRole(this.form)
                        .then(res => {
                            this.resolve(this.form);
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
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
    },
    mounted(){

    }
};
</script>
<style lang="scss">

</style>
