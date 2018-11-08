<template>
    <el-dialog title="创建资源模板" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="实例类型" prop="instanceType" :label-width="formLabelWidth">
                <el-select v-model="form.instanceType" placeholder="请选择实例类型" >
                    <el-option v-for="item in ecsTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规格族" prop="types" :label-width="formLabelWidth">
                <el-select v-model="form.types" placeholder="请选择" >
                    <el-option v-for="item in selectItems" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称 " prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="VCPU数量" prop="vCpu" :label-width="formLabelWidth">
                <el-input-number class="width-full" controls-position="right" :min="1" :max="999999999" v-model="form.vCpu"></el-input-number>
            </el-form-item>
            <el-form-item label="内存（MB）" prop="ram" :label-width="formLabelWidth">
                <el-input-number class="width-full" controls-position="right" :min="1" :max="999999999" v-model="form.ram"></el-input-number>
            </el-form-item>
            <el-form-item label="处理器型号" prop="cpuType" :label-width="formLabelWidth">
                <el-input v-model="form.cpuType" placeholder="输入处理器型号"></el-input>
            </el-form-item>
            <el-form-item label="处理器主频（GHz）" prop="cpuSpeed" :label-width="formLabelWidth">
                <el-input-number class="width-full" controls-position="right" :min="1" :max="999999999" v-model="form.cpuSpeed"></el-input-number>
            </el-form-item>
            <el-form-item label="内网带宽（MB）" prop="brand" :label-width="formLabelWidth">
                <el-input-number class="width-full" controls-position="right" :min="1" :max="999999999" v-model="form.brand"></el-input-number>
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
            formLabelWidth: '180px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            form:{
                types:'',
                name:'',
                instanceType:'ECS',
                vCpu:1,
                ram:1,
                brand: 1,
                cpuSpeed: 1,
                cpuType: 'Intel Xeon E5-2650 v4',
            },
            selectItems: [
                {
                    label: '通用型',
                    value: '通用型'
                },
                {
                    label: '计算型',
                    value: '计算型'
                },
                {
                    label: '内存型',
                    value: '内存型'
                }
            ],
            ecsTypes: [
                {
                    label: 'ECS',
                    value: 'ECS'
                },
                {
                    label: 'RDS',
                    value: 'RDS'
                }
            ],
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                vCpu: [
                    { required: true, message: '请输VCPU数量', trigger: 'submit' }
                ],
                types: [
                    { required: true, message: '请选择规格族', trigger: 'submit' }
                ],
                instanceType: [
                    { required: true, message: '请选择实例类型', trigger: 'submit' }
                ],
                ram: [
                    { required: true, message: '请输内存大小', trigger: 'submit' }
                ],
                brand: [
                    { required: true, message: '输入内网带宽', trigger: 'submit' }
                ],
                cpuSpeed: [
                    { required: true, message: '输入处理器主频', trigger: 'submit' }
                ],
                cpuType: [
                    { required: true, message: '输入处理器型号', trigger: 'submit' }
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
            this.form = {
                types:'',
                name:'',
                vCpu:1,
                ram:1,
                brand: 1,
                cpuSpeed: 1,
                cpuType: '',
            };
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
