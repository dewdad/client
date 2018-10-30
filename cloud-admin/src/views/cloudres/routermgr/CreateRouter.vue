<template>
    <el-dialog :title="optype == 1?'创建路由':'编辑路由'" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-alert
                    title="基于特殊参数创建一路由。"
                    type="info"
                    :closable="false">
            </el-alert>
            <el-form-item label="路由名称：" prop="name" :label-width="formLabelWidth" class="mt20">
                <el-input placeholder="输入路由名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="管理状态：" prop="adminStateUp" :label-width="formLabelWidth">
                <el-select v-model="form.adminStateUp">
                    <el-option v-for="item in adminStateUps" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
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
import {createRouter,editRouter} from '@/service/cloudres.js';
export default {
    data() {
        let adminStateUps = [
            {key:'true',value:'UP'},
            {key:'false',value:'DOWN'},
        ];
        return{
            adminStateUps,
            formLabelWidth: '130px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            optype:1,
            item:{},
            form:{
                name:'',
                adminStateUp:'true',

            },
            rules:{
                name: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                adminStateUp: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
            },
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
            this.item = item;
            console.log('adminStateUp',item);
            this.optype = optype;
            if(optype === 2){
                this.form.name = item.name;
                this.form.adminStateUp = item.admin_state_up ? 'true' : 'false';
            }else{
                this.form.name = '';
                this.form.adminStateUp = '';
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
                        let param = {
                            id:this.item.id,
                            param:this.form,
                        };
                        this.edit(param);
                    }
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        create(){
            createRouter(this.form)
                .then(res => {
                    console.log('redssssssss',res);
                    console.log('this.form',this.form);
                    if(res.code === '0000'){
                        this.resolve(this.form);
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
                        return this.$alert('操作成功','提示');
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
        edit(param){
            editRouter(param)
                .then(res => {
                    console.log('redsvvvvvvvv',res);
                    if(res.code === '0000'){
                        this.resolve(param);
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
                        return this.$alert('操作成功','提示');
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
