<template>
<el-dialog :visible.sync="isShow" v-loading="loading" loading="empty">
    <div slot="title">{{title}}</div>
    <div class="pr130">
        <zt-form size="small" :model="data" :rules="rules" ref="form" label-width="140px" :inline-message="true">
            <zt-form-item label="专有网络名称" prop="name">
                <el-input v-model="data.name"></el-input>
                <span class="input-help">只能由中文、英文字母、数字、下划线、中划线组成，长度小于48个字符。</span>
            </zt-form-item>
            <zt-form-item label="网段" prop="cindr">
                <ip-input v-model="data.cindr" v-if="isShow"></ip-input>
                <span class="input-help">
                    <span class="color-warning lh20">创建后无法修改。</span><br>
                    <span class="text-break-all lh20">子网网段必须属于下面三类：10.0.0.0/8~28，172.16.0.0/12~28，192.168.0.0/16~28。</span><br>
                    <span class="lh20">例如：192.168.94.0/24</span>
                </span>
            </zt-form-item>
            <zt-form-item label="IP版本">
                <el-radio-group v-model="data.version">
                    <el-radio :label="4">IPV4</el-radio>
                    <el-radio :label="6">IPV6</el-radio>
                </el-radio-group>
            </zt-form-item>
            <zt-form-item label="DHCP">
                <el-radio-group v-model="data.DHCPVal">
                    <el-radio :label="true">已激活</el-radio>
                    <el-radio :label="false">未激活</el-radio>
                </el-radio-group>
            </zt-form-item>
        </zt-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="font12" @click="confirm" :loading="loading">确 定</el-button>
        <el-button type="info" class="font12" @click="hide">取 消</el-button>
    </span>
</el-dialog>
</template>

<script>
import {createNetwork, updateNetwork} from '@/service/ecs/network.js';
import IpInput from '@/components/form/IPInput.vue';

function judgeSubnetIpValid(ip ,mask) {
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
        let cindr = function(rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入网段'));
            } else {
                let [ipstr, port] = value.split('/');
                let ip = ipstr.split('.');
                if (port && ip.length === 4 && ip.every(e => e >= 0) && judgeSubnetIpValid(ip, port)) {
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
            data: {
                name: '默认专有网络',
                cindr: '',
                version: 4,
                DHCPVal: true
            },
            rules: {
                name: [
                    { required: true, message: '请输入专有网络名称', trigger: 'blur' }
                ],
                cindr: [
                    { required: true, message: '请输入网段', trigger: 'blur' },
                    { validator: cindr, trigger: 'submit' }
                ]
            },
            resolve: () => {},
            reject: () => {}
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
            if(!val) {
                this.$refs.form.resetFields();
            }
        }
    },
    methods: {
        clear() {
            this.data.name = '默认专有网络';
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
            if (type === 'update') {
                console.warn(data);
                this.data.name = data.name;
                this.data.cindr = data.neutronSubnets && data.neutronSubnets[0].cidr;
            } else {
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
                    ipVersion: this.data.version,
                }
            };
            alert(params);
            debugger;
            createNetwork(params)
                .then(ret => {
                    if (ret) {
                        this.resolve(ret);
                    }
                })
                .catch(error => {
                    console.warn('创建VPC', error.message);
                })
                .finally(() => {
                    this.hide();
                    this.loading = false;
                });
        },
        // 修改专有网络
        updateNetwork() {
            // let params = Object.assign({}, this.data);
            let params = {
                id: this.row.id,
                name: this.data.name,
                subnet: {
                    cidr: this.data.cindr,
                    dHCPEnabled: this.data.DHCPVal,
                    ipVersion: this.data.version,
                }
            };
            params.vpcId = this.row.id;
            this.loading = true;
            updateNetwork(params)
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
        }
    }
};
</script>

<style>
</style>
