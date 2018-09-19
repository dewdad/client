<template>
    <el-dialog :title="optype === 1?'创建部门':'编辑部门'" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="部门名称：" prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入部门名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="描述：" prop="description" :label-width="formLabelWidth">
                <el-input placeholder="输入描述" v-model="form.description"></el-input>
            </el-form-item>

        <div v-if="user.roleType == 1 || user.roleType == 2">
            <el-form-item label="VCPU数量：" prop="quota.cpu" :label-width="formLabelWidth" >
                <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.cpu"></el-input-number>
            </el-form-item>
            <el-form-item label="实例：" prop="quota.instances" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.instances"></el-input-number>
            </el-form-item>
            <el-form-item label="卷：" prop="quota.volumes" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.volumes"></el-input-number>
            </el-form-item>
            <el-form-item label="卷快照：" prop="quota.snapshot" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.snapshot"></el-input-number>
            </el-form-item>
            <el-form-item label="卷及快照总大小(GB)：" prop="quota.volumeSize" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.volumeSize"></el-input-number>
            </el-form-item>
            <el-form-item label="内存(GB)：" prop="quota.ram" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.ram"></el-input-number>
            </el-form-item>
            <el-form-item label="安全组：" prop="quota.securityGroup" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.securityGroup"></el-input-number>
            </el-form-item>
            <el-form-item label="安全组规则：" prop="quota.securityGroupRule" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.securityGroupRule"></el-input-number>
            </el-form-item>
            <el-form-item label="浮动IP：" prop="quota.floatingIps" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.floatingIps"></el-input-number>
            </el-form-item>
            <el-form-item label="网络：" prop="quota.network" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.network"></el-input-number>
            </el-form-item>
            <el-form-item label="端口：" prop="quota.ports" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.ports"></el-input-number>
            </el-form-item>
            <el-form-item label="路由：" prop="quota.routers" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.routers"></el-input-number>
            </el-form-item>
            <el-form-item label="子网：" prop="quota.subnet" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.subnet"></el-input-number>
            </el-form-item>
            <el-form-item label="备份：" prop="quota.backup" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.backup"></el-input-number>
            </el-form-item>
            <el-form-item label="备份大小(GB)：" prop="quota.backupSize" :label-width="formLabelWidth" required>
                <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.backupSize"></el-input-number>
            </el-form-item>
        </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {createDept,editDept,createQuota,changeDeptQuota,searchDeptDetail} from '@/service/usermgr/deptmgr.js';
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
                quota:{
                    cpu:200,
                    instances:100,
                    volumes:100,
                    snapshot:100,
                    volumeSize:10000,
                    ram:500,
                    securityGroup:100,
                    securityGroupRule:1000,
                    floatingIps:500,
                    network:100,
                    ports:500,
                    routers:100,
                    subnet:100,
                    backup:200,
                    backupSize:10000
                }
            },
            rules:{
                name: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                'quota.cpu': [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                'quota.instances': [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                'quota.volumes': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.snapshot': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.volumeSize': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.ram': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.securityGroup': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.securityGroupRule': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.floatingIps': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.network': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.ports': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.routers': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.subnet': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.backup': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.backupSize': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
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
                if(item.quota) this.form.quota = item.quota;
                this.form.description = item.description;
                this.searchDeptDetail();
            }else{
                this.form.id = '';
                this.form.name = '';
                this.form.description = '';
            }
            this.optype = optype;

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
        //通过部门id查找详情
        searchDeptDetail(){
            searchDeptDetail(this.item.id).then(ret => {
                $log('list....detail', ret);
                let resData = ret.data;
                if(resData && resData.quota){
                    this.form = resData || [];
                }
            });
        },
        create(){
            this.form.parentId = this.roleType == '1' ? '' : this.brunch.id;
            createDept(this.form)
                .then(res => {
                    console.log('reds',res);
                    if(res.data.code === '0000'){
                        this.resolve(this.form);
                        this.form.quota.deptId = res.data.data.id;
                        if(this.roleType == '1'){
                            createQuota(this.form.quota)
                                .then(res => {
                                    console.log('reds',res);
                                    if(res.data.code === '0000'){
                                        this.resolve(this.form.quota);
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
        edit(){
            editDept(this.form)
                .then(res => {
                    console.log('reds',this.form);
                    if(res.data.code === '0000'){
                        this.resolve(this.form);
                        this.form.quota.deptId = this.form.id;
                        if(this.roleType == '1'){
                            changeDeptQuota(this.form.quota)
                                .then(res => {
                                    console.log('reds',res);
                                    if(res.data.code === '0000'){
                                        this.resolve(this.form.quota);
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
