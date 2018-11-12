<template>
    <el-dialog :title="optype === 1?'创建部门':'编辑部门'" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="部门名称：" prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入部门名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="描述：" prop="description" :label-width="formLabelWidth">
                <el-input placeholder="输入描述" v-model="form.description"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm" >确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {createDept,editDept} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        return{
            formLabelWidth: '130px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            optype:1,
            roleType:'1',
            brunch:{},
            form:{
                enabled:true,
                name:'',
                description:'',
                parentId:'',
            },
            rules:{
                name: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ]
            },
            item:{}
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },

    props: {},
    methods: {
        show(item,brunch,optype) {
            this.isShow = true;
            this.item = item;
            this.brunch = brunch;
            this.roleType = this.user.roleType;
            console.log(this.user.roleType);
            if(optype === 2){
                console.log('item',item);

                this.form.id = item.id;
                this.form.name = item.name;
                this.form.description = item.description;
            }else{
                this.form.id = '';
                this.form.name = '';
                this.form.description = '';
            }
            this.optype = optype;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
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
        confirm() {
            this.confirmBtn = true;
            console.log('this.form',this.form);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.optype === 1){
                        this.create();
                    }else{
                        this.edit();
                    }
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        create(){
            this.form.parentId = this.roleType == '1' ? '' : this.brunch.id;
            createDept(this.form)
                .then(res => {
                    console.log('reds',res);
                    if(res.data.code === '0000'){
                        this.resolve(res.data.data);
                        this.confirmBtn = false;
                        this.hide();
                        this.setting();
                        // this.$alert('操作成功,请及时修改部门配额');
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
        edit(){
            editDept(this.form)
                .then(res => {
                    console.log('reds',this.form);
                    if(res.data.code === '0000'){
                        this.resolve(this.form);
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
                        return this.$alert('操作成功');
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
    },
    mounted(){

    }
};
</script>
<style lang="scss">

</style>
