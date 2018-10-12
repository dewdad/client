<template>
    <el-dialog title="创建资源模板" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="名称 " prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="VCPU数量" prop="vcpus" :label-width="formLabelWidth">
                <el-input-number class="width-full" controls-position="right" :min="1" :max="999999999" v-model="form.vcpus"></el-input-number>
            </el-form-item>
            <el-form-item label="内存（MB）" prop="ram" :label-width="formLabelWidth">
                <el-input-number class="width-full" controls-position="right" :min="1" :max="999999999" v-model="form.ram"></el-input-number>
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
import {createModel} from '@/service/cloudres.js';
export default {
    data() {
        return{
            formLabelWidth: '120px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            form:{
                name:'',
                vcpus:1,
                ram:1
            },
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                vcpu: [
                    { required: true, message: '请输VCPU数量', trigger: 'submit' }
                ],
                ram: [
                    { required: true, message: '请输内存大小', trigger: 'submit' }
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
        show() {
            this.isShow = true;
            // this.optype = optype;
            // console.log('item',item);
            // if(optype !== 1){
            //     this.form.roleType = item.roleType;
            //     this.form.id = item.id;
            // }
            // this.form.roleName = item.roleName;
            // this.form.description = item.description;
            // console.log('optype',optype);
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
            // this.form.deptId = this.user.deptId;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    createModel(this.form)
                        .then(res => {
                            console.log('res',res);
                            if(res.code === '0000'){
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
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss">

</style>
