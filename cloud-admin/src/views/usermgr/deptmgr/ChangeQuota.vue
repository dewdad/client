<template>
    <el-dialog title="修改配额" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
        <div >
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
import {searchRentQuota,changeQuota} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        return{
            formLabelWidth: '130px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            brunch:{},
            item:{},
            data:[],
            form:{
                quota:{
                    cpu:10,
                    instances:10,
                    volumes:10,
                    snapshot:10,
                    volumeSize:100,
                    ram:100,
                    securityGroup:10,
                    securityGroupRule:10,
                    floatingIps:10,
                    network:10,
                    ports:10,
                    routers:10,
                    subnet:10,
                    backup:10,
                    backupSize:10
                }
            },
            rules:{
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
        show(item,brunch) {
            this.isShow = true;
            this.item = item;
            this.brunch = brunch;
            console.log('item......',item);
            if(item.quota){
                this.form.quota = item.quota;
            }
            this.getQuotaList();
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
        //获取租户列表
        getQuotaList(){
            searchRentQuota(this.item.id).then(ret => {
                $log('list....', ret);
                let resData = ret.data;
                if(resData && resData.id){
                    this.form.quota = resData || [];
                }
            });
        },
        confirm() {
            this.confirmBtn = true;
            console.log('this.form',this.form);
            this.form.quota.projectId = this.item.id;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    changeQuota(this.form.quota)
                        .then(res => {
                            console.log('reds',res);
                            if(res.code === '0000'){
                                this.resolve(this.form.quota);
                                this.$alert('操作成功','提示');
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
