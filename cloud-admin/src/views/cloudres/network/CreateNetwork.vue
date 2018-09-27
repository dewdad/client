<template>
    <el-dialog :title="optype == 1?'创建网络':'编辑网络'" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="网络名称 " prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入网络名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="网络类型 " prop="networkType" :label-width="formLabelWidth">
                <el-select v-model="form.networkType">
                    <el-option label="VXLAN" value="VXLAN"></el-option>
                    <el-option label="VLAN" value="VLAN"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物理网络 " prop="physicalNetwork" v-if="form.networkType == 'VLAN'" :label-width="formLabelWidth">
                <el-input placeholder="输入物理网络" v-model="form.physicalNetwork"></el-input>
            </el-form-item>
            <el-form-item label="段ID " prop="segmentId" :label-width="formLabelWidth" v-if="optype == 1">
                <el-input placeholder="输入段ID" v-model="form.segmentId"></el-input>
            </el-form-item>
            <el-form-item label="ID " prop="id" :label-width="formLabelWidth" v-if="optype == 2">
                <el-input placeholder="输入ID" v-model="form.id" :disabled='optype == 2'></el-input>
            </el-form-item>
            <el-form-item label="Enable Admin State" prop="admin_state_up" :label-width="formLabelWidth">
                <el-radio v-model="form.admin_state_up" label="true">是</el-radio>
            </el-form-item>
            <el-form-item label="是否共享" prop="shared" :label-width="formLabelWidth">
                <el-radio v-model="form.shared" label="true">是</el-radio>
                <el-radio v-model="form.shared" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="是否为外部网络" prop="routerExternal" :label-width="formLabelWidth">
                <el-radio v-model="form.routerExternal" label="true">是</el-radio>
                <el-radio v-model="form.routerExternal" label="false">否</el-radio>
            </el-form-item>

            <el-form-item label="网络地址 " prop="subnet.cidr" :label-width="formLabelWidth">
                <el-input placeholder="输入子网络地址" style="width:88%" v-model="form.subnet.cidr" :disabled='optype == 2'></el-input>
                <el-tooltip class="ml10" effect="light" content="CIDR格式的网络地址 (例如 192.168.0.0/24, 2001:DB8::/48" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="IP版本" prop="subnet.ipVersion" :label-width="formLabelWidth">
                <el-radio v-model="form.subnet.ipVersion" label="4">IPV4</el-radio>
                <el-radio v-model="form.subnet.ipVersion" label="6">IPV6</el-radio>
            </el-form-item>
            <el-form-item label="网关IP" prop="subnet.gateway" :label-width="formLabelWidth" v-if="form.subnet.noGateway == '1'">
                <el-input placeholder="输入网关IP" v-model="form.subnet.gateway"></el-input>
            </el-form-item>
            <el-form-item label="禁用网关" prop="subnet.noGateway" :label-width="formLabelWidth">
                <el-radio v-model="form.subnet.noGateway" label="true">是</el-radio>
                <el-radio v-model="form.subnet.noGateway" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="激活DHCP" prop="subnet.dHCPEnabled" :label-width="formLabelWidth">
                <el-radio v-model="form.subnet.dHCPEnabled" label="true">是</el-radio>
                <el-radio v-model="form.subnet.dHCPEnabled" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="分配地址池 " prop="subnet.pools" :label-width="formLabelWidth">
                <el-input placeholder="输入分配地址池" type="textarea" style="width:88%" v-model="form.subnet.pools"></el-input>
                <el-tooltip class=" ml10" effect="light"  placement="right">
                    <div slot="content">IP地址分配池.<br/>每条记录是：开始IP,结束IP(例如 192.168.1.100,192.168.1.120)，<br/> 每行一条记录。</div>
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="DNS服务器 " prop="subnet.dnsNames" :label-width="formLabelWidth">
                <el-input placeholder="输入DNS服务器" type="textarea" style="width:88%" v-model="form.subnet.dnsNames"></el-input>
                <el-tooltip class=" ml10" effect="light" content="该子网的DNS服务器IP地址列表，每行一个。" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="主机路由 " prop="subnet.hostRoutes" :label-width="formLabelWidth">
                <el-input placeholder="输入子主机路由" type="textarea" style="width:88%" v-model="form.subnet.hostRoutes"></el-input>
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
        let validateIp = function(rule, value, callback){
            let reg = /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d{1,2})?(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d{1,2})*$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的IP格式'));
            } else {
                callback();
            }
        };
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
                admin_state_up:'true',
                shared:'true',
                routerExternal:'true',
                networkType:'VXLAN',
                physicalNetwork:'',
                segmentId:'',
                subnet:{
                    name:'',
                    cidr:'',
                    dHCPEnabled:'true',
                    dnsNames:'',
                    hostRoutes:'',
                    gateway:'',
                    noGateway:'true',
                    pools:'',
                    ipVersion:'4',
                }
            },
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                id: [
                    { required: true, message: '请输入ID', trigger: 'blur' }
                ],
                physicalNetwork: [
                    { required: true, message: '请输入物理网络', trigger: 'blur' }
                ],
                segmentId: [
                    { required: true, message: '请输入段ID', trigger: 'blur' }
                ],
                'subnet.cidr': [
                    { validator: validateIp, trigger: 'blur' },
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
                this.form.shared = item.shared;
                this.form.admin_state_up = item.adminStateUp;
                this.form.routerExternal = item.routerExternal;
                this.form.subnet.cidr = item.subnets[0].cidr;
                this.form.subnet.gateway = item.subnets[0].gatewayIp;
                this.form.subnet.dHCPEnabled = item.subnets[0].enableDhcp;
                this.form.name = item.name;
                this.form.networkType = item.networkType == 'vxlan' ? 'VXLAN' : 'VLAN';
                this.form.id = item.id;
            }else{
                this.form = {
                    name:'',
                    id:'',
                    admin_state_up:'true',
                    shared:'true',
                    routerExternal:'true',
                    networkType:'VXLAN',
                    physicalNetwork:'',
                    segmentId:'',
                    subnet:{
                        name:'',
                        cidr:'',
                        dHCPEnabled:'true',
                        dnsNames:'',
                        hostRoutes:'',
                        gateway:'',
                        noGateway:'true',
                        pools:'',
                        ipVersion:'4',
                    }
                };
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
            if (typeof this.form.subnet.pools !== 'undefined' && this.form.subnet.pools.toString() !== ''){
                this.form.subnet.pools = this.form.subnet.pools.split('\n');
            }else{
                this.form.subnet.pools = [''];
            }

            if (typeof this.form.subnet.dnsNames !== 'undefined' && this.form.subnet.dnsNames.toString() !== ''){
                this.form.subnet.dnsNames = this.form.subnet.dnsNames.split('\n');
            }else{
                this.form.subnet.dnsNames = [''];
            }

            if (typeof this.form.subnet.host_routes !== 'undefined' && this.form.subnet.host_routes.toString() !== ''){
                this.form.subnet.hostRoutes = this.form.subnet.hostRoutes.split('\n');
            }else{
                this.form.subnet.hostRoutes = [''];
            }
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
            this.form.admin_state_up = this.form.admin_state_up === 'true' ? true : false;
            editNetwork(this.form)
                .then(res => {
                    if(res.code === '0000'){
                        this.resolve(this.form);
                        this.form.shared = 'true';
                        this.form.routerExternal = 'true';
                        this.form.admin_state_up = 'true';
                        this.form.subnet.dHCPEnabled = 'true';
                        this.form.subnet.noGateway = 'true';
                        this.form.subnet.ipVersion = '4';
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
                    }else{
                        this.$alert('操作失败', '提示', {
                            type: 'error'
                        });
                        this.form.shared = 'true';
                        this.form.routerExternal = 'true';
                        this.form.admin_state_up = 'true';
                        this.form.subnet.dHCPEnabled = 'true';
                        this.form.subnet.noGateway = 'true';
                        this.form.subnet.ipVersion = '4';
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
            this.form.admin_state_up = this.form.admin_state_up === 'true' ? true : false;
            createNetwork(this.form)
                .then(res => {
                    if(res.code === '0000'){
                        this.resolve(this.form);
                        this.form.shared = 'true';
                        this.form.routerExternal = 'true';
                        this.form.admin_state_up = 'true';
                        this.form.subnet.dHCPEnabled = 'true';
                        this.form.subnet.noGateway = 'true';
                        this.form.subnet.ipVersion = '4';
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
                    }else{
                        this.$alert('操作失败', '提示', {
                            type: 'error'
                        });
                        this.form.shared = 'true';
                        this.form.routerExternal = 'true';
                        this.form.admin_state_up = 'true';
                        this.form.subnet.dHCPEnabled = 'true';
                        this.form.subnet.noGateway = 'true';
                        this.form.subnet.ipVersion = '4';

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
