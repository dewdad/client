<template>
    <el-dialog :visible.sync="isShow" v-loading="loading" loading="empty">
        <div slot="title">{{title}}</div>
        <div class="pr130">
            <zt-form size="small" :model="data" :rules="rules" ref="form" label-width="140px" inline-message>
                <zt-form-item label="专有网络名称" prop="name">
                    <el-input v-model="data.name" maxlength="48"></el-input>
                    <span slot="help" class="input-help">只能由中文、英文字母、数字、下划线、中划线组成，长度小于48个字符。</span>
                </zt-form-item>
                <zt-form-item v-if="this.type === 'create'" label="IP版本">
                    <el-radio-group v-model="data.version">
                        <el-radio :label="4">IPV4</el-radio>
                        <el-radio :label="6">IPV6</el-radio>
                    </el-radio-group>
                </zt-form-item>
                <zt-form-item v-if="this.type === 'create' && data.version === 4" key="IPV4" label="网段" prop="cindr">
                    <ip-input v-model="data.cindr" :value="cindrVal" v-if="isShow"></ip-input>
                    <span slot="help" class="input-help">
                        <span class="color-warning lh20">创建后无法修改。</span><br>
                        <span class="lh20">例如：192.168.94.0/24</span>
                    </span>
                </zt-form-item>
                <zt-form-item v-if="this.type === 'create' && data.version === 6" key="IPV6" label="网段" prop="cindr">
                    <el-input v-model="data.cindr" maxlength="50"></el-input>
                    <span slot="help" class="input-help">
                        <span class="color-warning lh20">创建后无法修改。</span><br>
                        <span class="lh20">例如：0:0:0:0:0:0:0:1/48</span>
                    </span>
                </zt-form-item>
                <zt-form-item v-if="this.type === 'create'" label="DHCP">
                    <el-radio-group v-model="data.DHCPVal">
                        <el-radio :label="true">已激活</el-radio>
                        <el-radio :label="false">未激活</el-radio>
                    </el-radio-group>
                </zt-form-item>
                <zt-form-item v-if="this.type === 'create'" label="设置网关">
                    <el-radio-group v-model="data.setGateway">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </zt-form-item>
                <zt-form-item v-if="data.setGateway" label="外部网关" prop="externalGateway" :rules="[{required: true, message: '请选择外部网关', trigger: ['blur', 'change']}]">
                    <el-select v-model="data.externalGateway" placeholder="请选择外部网关">
                        <el-option v-for="item in netWorkList" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
                    </el-select>
                </zt-form-item>
            </zt-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="hide">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {createNetwork, updateNetwork} from '@/service/v2.1/network.js';
import {queryNetwork} from '@/service/ecs/network.js';
import IpInput from '@/components/form/IPInput.vue';

function judgeSubnetIpValid(ip, mask) {
    //子网网段必须属于下面三类：10.0.0.0/8~28，172.16.0.0/12~28，192.168.0.0/16~28。
    var ip_part0 = parseInt(ip[0]);
    var ip_part1 = parseInt(ip[1]);
    var ip_part2 = parseInt(ip[2]);
    var ip_part3 = parseInt(ip[3]);
    mask = parseInt(mask);
    if (ip_part2 < 0 || ip_part2 > 255) return false;
    if (ip_part3 < 0 || ip_part3 > 255) return false;

    //ip_to_binary
    var num = 0;
    num += parseInt(ip_part0) << 24;
    num += parseInt(ip_part1) << 16;
    num += parseInt(ip_part2) << 8;
    num += parseInt(ip_part3) << 0;
    num = num >>> 0;

    var ip_binary = num.toString(2);
    var host = ip_binary.substring(mask); //主机位

    if (parseInt(host) == 0) {
        return true; //合法
    } else {
        return false;
    }
}

export default {
    data() {
        // 验证 IP 格式
        const cindr = (rule, value, callback) => {
            if (value === '' || value === '.../') {
                callback(new Error('请输入网段'));
            } else {
                let [ipstr, port] = value.split('/');
                let ip = ipstr.split('.');
                if (
                    (this.data.version === 4 && port && ip.length === 4 && ip.every(e => e >= 0) && judgeSubnetIpValid(ip, port)) ||
                    (this.data.version === 6 && value.length <= 50 && /^[a-z0-9]+(:[a-z0-9]+)+\/\d+$/.test(value))
                ) {
                    callback();
                } else {
                    callback(new Error('格式不正确'));
                }
            }
        };
        return {
            isShow: false,
            loading: false,
            type: 'create',
            cindrVal: '',
            gatewayVal: '',
            data: {
                name: '默认专有网络',
                cindr: '',
                version: 4,
                DHCPVal: true,
                setGateway: false,
                externalGateway: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入专有网络名称', trigger: 'blur'},
                    {min: 1, max: 48, message: '长度为2-48个字符', trigger: 'blur'},
                    {
                        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]*$/,
                        message: '专有网络名称格式错误',
                        trigger: 'blur'
                    }
                ],
                cindr: [{required: true, message: '请输入网段', trigger: 'blur'}, {validator: cindr, trigger: 'submit'}]
            },
            resolve: () => {},
            reject: () => {},
            netWorkList: []
        };
    },
    components: {
        'ip-input': IpInput
    },
    computed: {
        title() {
            return this.type === 'create' ? '新建专有网络' : '编辑专有网络';
        }
    },
    watch: {
        isShow(val) {
            if (!val) {
                this.data.name = '默认专有网络';
                this.$refs.form.resetFields();
            }
        }
    },
    methods: {
        clear() {
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
        },
        hide() {
            this.isShow = false;
        },
        show({type = 'create', ...data} = {}) {
            this.isShow = true;
            this.type = type;
            this.row = data;
            this.data.cindr = '';
            this.cindrVal = '';
            this.version = 4;
            this.DHCPVal = true;
            if (type === 'update') {
                console.warn('update', data);
                this.data.name = data.name;
                this.data.cindr = data.neutronSubnets && data.neutronSubnets[0].cidr;
                this.cindrVal = data.neutronSubnets && data.neutronSubnets[0].cidr;
                this.version = data.neutronSubnets && data.neutronSubnets[0].ip_version;
                this.DHCPVal = data.neutronSubnets && data.neutronSubnets[0].enable_dhcp;
            } else {
                this.queryNetwork();
                this.clear();
            }
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        },
        // 创建专有网络
        createNetwork() {
            this.loading = true;
            let params = {
                name: this.data.name,
                subnet: {
                    cidr: this.data.cindr,
                    dHCPEnabled: this.data.DHCPVal,
                    ipVersion: this.data.version
                }
            };
            if (this.data.setGateway) {
                params['externalGateway'] = this.data.externalGateway;
            }
            createNetwork(params)
                .then(ret => {
                    if (ret) {
                        this.hide();
                        this.resolve(ret);
                    }
                })
                .catch(error => {
                    console.warn('创建VPC', error.message);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 修改专有网络
        updateNetwork() {
            // let params = Object.assign({}, this.data);
            let params = {
                id: this.row.id,
                name: this.data.name
            };
            this.loading = true;
            updateNetwork({...params})
                .then(ret => {
                    if (ret) {
                        this.resolve(ret);
                    }
                })
                .catch(error => {
                    console.warn('更新VPC', error.message);
                })
                .finally(() => {
                    this.loading = false;
                    this.hide();
                });
        },
        confirm() {
            let form = this.$refs.form;
            if (!this.$refs.form) return false;

            // 表单验证
            form.validate(valid => {
                if (valid) {
                    if (this.type === 'create') {
                        this.createNetwork();
                    } else if (this.type === 'update') {
                        this.updateNetwork();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 查询外部刚强
        queryNetwork() {
            queryNetwork({router_external: true}).then(res => {
                this.netWorkList = res.data || [];
            });
        }
    }
};
</script>

<style>
</style>
