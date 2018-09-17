<template>
    <el-dialog :title="optype == 1?'创建端口':'编辑端口'" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="子网名称 " prop="name" :label-width="formLabelWidth">
                <el-input placeholder="输入子网名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="网络地址 " prop="cidr" :label-width="formLabelWidth">
                <el-input placeholder="输入子网络地址" v-model="form.cidr"></el-input>
                <el-tooltip class="item" effect="light" content="CIDR格式的网络地址 (例如 192.168.0.0/24, 2001:DB8::/48" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="IP版本" prop="ip_version" :label-width="formLabelWidth">
                <el-radio v-model="form.ip_version" label="1">IPV4</el-radio>
                <el-radio v-model="form.ip_version" label="2">IPV6</el-radio>
            </el-form-item>
            <el-form-item label="网关IP " prop="gateway_ip" :label-width="formLabelWidth" v-if="getway">
                <el-input placeholder="输入子网关IP" v-model="form.gateway_ip"></el-input>
                <el-tooltip class="item" effect="light" content="网关IP地址(例如 192.168.0.254) 缺省值是网络地址的第一个IP (例如 192.168.0.0/24的192.168.0.1, 2001:DB8::/48的2001:DB8::1). 如果您要使用缺省值，保留为空白。如果您不想使用网关，勾选下面的'禁用网关'。" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="" prop="getway" :label-width="formLabelWidth">
                <el-radio v-model="getway" label="1">禁用网关</el-radio>
            </el-form-item>
            <el-form-item label="DHCP" prop="enable_dhcp" :label-width="formLabelWidth">
                <el-radio v-model="form.enable_dhcp" label="1">是</el-radio>
                <el-radio v-model="form.enable_dhcp" label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="分配地址池 " prop="pools" :label-width="formLabelWidth">
                <el-input placeholder="输入分配地址池" v-model="form.pools"></el-input>
                <el-tooltip class="item" effect="light" content="IP地址分配池. 每条记录是：开始IP,结束IP(例如 192.168.1.100,192.168.1.120) ，每行一条记录." placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="DNS服务器 " prop="dnsNames" :label-width="formLabelWidth">
                <el-input placeholder="输入DNS服务器" v-model="form.dnsNames"></el-input>
                <el-tooltip class="item" effect="light" content="该子网的DNS服务器IP地址列表，每行一个。" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="主机路由 " prop="host_routes" :label-width="formLabelWidth">
                <el-input placeholder="输入子主机路由" v-model="form.host_routes"></el-input>
                <el-tooltip class="item" effect="light" content="主机增加额外的路由. 记录格式是：目的CIDR, 下一跳(例如192.168.200.0/24,10.56.1.254) ，每行一条记录。" placement="right">
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
import {editPort,createPort} from '@/service/cloudres.js';
export default {
    data() {
        return{
            formLabelWidth: '150px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            getway:true,
            optype:1,
            form:{
                name:'',
                cidr:'',
                ip_version:'1',
                enable_dhcp:'',
                gateway_ip:'',
                pools:'',
                dnsNames:'',
                host_routes:'',
            },
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                cidr: [
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
        editPort(){
            this.form.shared = this.form.shared == '1' ? true : false;
            this.form.routerExternal = this.form.routerExternal == '1' ? true : false;
            editPort(this.form)
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
        createPort(){
            this.form.shared = this.form.shared == '1' ? true : false;
            this.form.routerExternal = this.form.routerExternal == '1' ? true : false;
            createPort(this.form)
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
