<template>
    <el-dialog title="云主机热迁移" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="当前物理主机 " prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入名称" v-model="form.name" disabled=""></el-input>
            </el-form-item>
            <el-form-item label="新物理主机" prop="id" :label-width="formLabelWidth">
                <el-input placeholder="输入ID" style="width:88%" v-model="form.id"></el-input>
                <el-tooltip class="ml10" effect="light" content="热迁移一个云主机到指定物理主机。" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="允许磁盘超量" prop="shared" :label-width="formLabelWidth">
                <el-radio v-model="form.shared" label="1">是</el-radio>
                <el-radio v-model="form.shared" label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="块设备迁移" prop="routerExternal" :label-width="formLabelWidth">
                <el-radio v-model="form.routerExternal" label="1">是</el-radio>
                <el-radio v-model="form.routerExternal" label="2">否</el-radio>
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
import {editNetwork,createNetwork} from '@/service/cloudres.js';
export default {
    data() {
        return{
            formLabelWidth: '150px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            optype:1,
            form:{
                name:'',
                id:'',
                admin_state_up:'1',
                shared:'1',
                routerExternal:'1',
                subnet:{
                    name:'',
                    cidr:'',
                    dHCPEnabled:'1',
                    dnsNames:'',
                    hostRoutes:'',
                    gateway:'',
                    noGateway:'1',
                    pools:'',
                    ipVersion:'1',
                }
            },
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                id: [
                    { required: true, message: '请输入ID', trigger: 'blur' }
                ],
                'subnet.cidr': [
                    { required: true, message: '请输入网络地址', trigger: 'blur' }
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
                this.form.shared = item.shared ? '1' : '2';
                this.form.routerExternal = item.routerExternal ? '1' : '2';
                this.form.id = item.id;
            }
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
                    if(this.optype === 1){
                        this.createNetwork();
                    }else{
                        this.editNetwork();
                    }
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        editNetwork(){
            this.form.shared = this.form.shared === '1' ? true : false;
            this.form.routerExternal = this.form.routerExternal === '1' ? true : false;
            this.form.admin_state_up = this.form.admin_state_up === '1' ? true : false;
            editNetwork(this.form)
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
        createNetwork(){
            this.form.shared = this.form.shared == '1' ? true : false;
            this.form.routerExternal = this.form.routerExternal == '1' ? true : false;
            createNetwork(this.form)
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
