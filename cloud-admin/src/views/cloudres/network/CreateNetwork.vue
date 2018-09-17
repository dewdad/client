<template>
    <el-dialog :title="optype == 1?'创建网络':'编辑网络'" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="名称 " prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="ID " prop="id" :label-width="formLabelWidth" v-if="optype == 2">
                <el-input placeholder="输入ID" v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="Enable Admin State" prop="admin_state_up" :label-width="formLabelWidth">
                <el-radio v-model="form.admin_state_up" label="1">是</el-radio>
            </el-form-item>
            <el-form-item label="是否共享" prop="shared" :label-width="formLabelWidth">
                <el-radio v-model="form.shared" label="1">是</el-radio>
                <el-radio v-model="form.shared" label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="是否为外部网络" prop="routerExternal" :label-width="formLabelWidth">
                <el-radio v-model="form.routerExternal" label="1">是</el-radio>
                <el-radio v-model="form.routerExternal" label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="子网选项："  :label-width="formLabelWidth">
            </el-form-item>
            <el-form-item label="子网名称 " prop="subnet.name" :label-width="formLabelWidth">
                <el-input placeholder="输入子网名称" v-model="form.subnet.name"></el-input>
            </el-form-item>
            <el-form-item label="网络地址 " prop="subnet.cidr" :label-width="formLabelWidth">
                <el-input placeholder="输入子网络地址" style="width:88%" v-model="form.subnet.cidr"></el-input>
                <el-tooltip class="ml10" effect="light" content="CIDR格式的网络地址 (例如 192.168.0.0/24, 2001:DB8::/48" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="IP版本" prop="subnet.ipVersion" :label-width="formLabelWidth">
                <el-radio v-model="form.subnet.ipVersion" label="1">IPV4</el-radio>
                <el-radio v-model="form.subnet.ipVersion" label="2">IPV6</el-radio>
            </el-form-item>
            <el-form-item label="网关IP" prop="subnet.gateway" :label-width="formLabelWidth" v-if="form.subnet.noGateway == '1'">
                <el-input placeholder="输入网关IP" v-model="form.subnet.gateway"></el-input>
            </el-form-item>
            <el-form-item label="禁用网关" prop="subnet.noGateway" :label-width="formLabelWidth">
                <el-radio v-model="form.subnet.noGateway" label="2">是</el-radio>
                <el-radio v-model="form.subnet.noGateway" label="1">否</el-radio>
            </el-form-item>
            <el-form-item label="激活DHCP" prop="subnet.dHCPEnabled" :label-width="formLabelWidth">
                <el-radio v-model="form.subnet.dHCPEnabled" label="1">是</el-radio>
                <el-radio v-model="form.subnet.dHCPEnabled" label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="分配地址池 " prop="subnet.pools" :label-width="formLabelWidth">
                <el-input placeholder="输入分配地址池" style="width:88%" v-model="form.subnet.pools"></el-input>
                <el-tooltip class=" ml10" effect="light"  placement="right">
                    <div slot="content">IP地址分配池.<br/>每条记录是：开始IP,结束IP(例如 192.168.1.100,192.168.1.120)，<br/> 每行一条记录。</div>
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="DNS服务器 " prop="subnet.dnsNames" :label-width="formLabelWidth">
                <el-input placeholder="输入DNS服务器" style="width:88%" v-model="form.subnet.dnsNames"></el-input>
                <el-tooltip class=" ml10" effect="light" content="该子网的DNS服务器IP地址列表，每行一个。" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="主机路由 " prop="subnet.hostRoutes" :label-width="formLabelWidth">
                <el-input placeholder="输入子主机路由" style="width:88%" v-model="form.subnet.hostRoutes"></el-input>
                <el-tooltip class=" ml10" effect="light"  placement="right">
                    <div slot="content">主机增加额外的路由. 记录格式是：目的CIDR, <br/>下一跳(例如192.168.200.0/24,10.56.1.254) ，<br/> 每行一条记录。</div>
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
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
