<template>
    <el-dialog title="添加规则" :visible.sync="isShow" width="600px" top="50px" class="AddRules" @close="cancel">
        <!-- 注意事项 -->
        <zt-form size="small" :inline-message="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <!-- 规则方向 -->
            <zt-form-item label="规则方向">
                <span>{{direction === 'ingress' ? '入方向': '出方向'}}</span>
            </zt-form-item>
            <!-- 访问类型 -->
            <zt-form-item label="协议类型" prop="Protocol_type">
                <el-select v-model="ruleForm.Protocol_type" size="small" placeholder="请选择">
                    <el-option v-for="item in accessType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- 端口范围 -->
            <zt-form-item v-if="ruleForm.Protocol_type.indexOf('all') === -1" label="端口范围" prop="port">
                <el-input size="small" :disabled="checkPortList.length > 0 " v-model="ruleForm.port" placeholder="例如：22/22或3389/3389"></el-input>
                <span class="input-help">取值范围从1到65535；设置格式例如“1/200”、“80/80”。</span>
            </zt-form-item>
            <!-- 常用端口 -->
            <zt-form-item v-if="ruleForm.Protocol_type === 'TCP'" label="常用端口">
                <el-checkbox-group v-model="checkPortList">
                    <el-checkbox v-for="item in commonPort" :key="item.label" class="ml10" :label="item.label">{{item.value}}</el-checkbox>
                </el-checkbox-group>
            </zt-form-item>
            <!-- 授权类型 -->
            <zt-form-item label="授权类型">
                <el-select v-model="remoteIpPrefix" size="small" placeholder="请选择">
                    <el-option v-for="auth in authType" :key="auth.value" :label="auth.label" :value="auth.value">
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- 安全组 -->
            <zt-form-item label="授权对象" key="SGRP" prop="uthorizationip" v-if="remoteIpPrefix === 'SGRP'" :rules="[{required: true, message: '请选择', trigger: ['submit']}]">
                <el-select v-model="ruleForm.uthorizationip" size="small" placeholder="请选择">
                    <el-option v-for="item in safeGroupList" :key="item.value" :label="item.name" :value="item.id">
                        {{item.name}}
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- 地址段 -->
            <zt-form-item label="授权对象" key="ADDR" prop="uthorizationip" v-if="remoteIpPrefix === 'ADDR'" :rules="[{required: true, message: '必填项', trigger: ['submit']}, {pattern: IPAddr_REGEXP, message: '输入有误', trigger: ['submit', 'blur']}]">
                <el-input size="small" v-model="ruleForm.uthorizationip" placeholder="例如:10.x.y.z/32"></el-input>
                <span class="input-help">请根据实际场景设置授权对象的CIDR，另外，0.0.0.0/0代表允许或拒绝所有IP的访问，设置时请务必谨慎。</span>
            </zt-form-item>
            <!-- 描述 -->
            <zt-form-item label="描述" prop="remark">
                <el-input size="small" v-model="ruleForm.remark"></el-input>
                <div class="input-help">长度为2-256个字符，不能以http://或https://开头</div>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disabled="loading">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {createGroupRule, getSecurityGroupList} from '@/service/ecs/security.js';
import {IPAddr_REGEXP} from '@/constants/regexp';
let commonPort = [
    {label: '22/22', value: 'SSH (22)'},
    {label: '23/23', value: 'Telnet (23)'},
    {label: '80/80', value: 'HTTP (80)'},
    {label: '443/443', value: 'HTTPS (443)'},
    {label: '1433/1433', value: 'MS SQL (1433)'},
    {label: '1521/1521', value: 'Oracle (1521)'},
    {label: '3306/3306', value: 'MySQL (3306)'},
    {label: '3389/3389', value: 'RDP (3389)'},
    {label: '5432/5432', value: 'PostgreSQL (5432)'},
    {label: '6379/6379', value: 'Redis (6379)'}
];
export default {
    data() {
        const checkDesc = (rule, value, callback) => {
            if (value && (value.indexOf('https://') === 0 || value.indexOf('http://') === 0)) {
                callback(new Error('输入有误'));
                return;
            }
            callback();
        };
        return {
            loading: false,
            isShow: false,
            resolve: null,
            reject: null,
            IPAddr_REGEXP,
            descInput: '',
            commonPort,
            checkPortList: [],
            accessType: [{value: 'allTCP', label: '允许所有TCP'}, {value: 'allUDP', label: '允许所有UDP'}, {value: 'allICMP', label: '允许所有ICMP'},{value: 'TCP', label: 'TCP'}, {value: 'UDP', label: 'UDP'}, {value: 'ICMP', label: 'ICMP'}],
            authType: [{value: 'ADDR', label: '地址段访问'}, {value: 'SGRP', label: '安全组访问'}],
            remoteIpPrefix: 'ADDR',
            ruleForm: {
                Protocol_type: 'allTCP',
                port: '',
                uthorizationip: '',
                remark: ''
            },
            rules: {
                Protocol_type: [{required: true, message: '必填项', trigger: 'change'}],
                port: [{required: true, message: '必填项', trigger: 'change'}],
                remark: [
                    {
                        validator: checkDesc,
                        message: '输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            },
            safeGroupList: [],
            group_id: '',
            direction: ''
        };
    },
    watch: {
        checkPortList(val) {
            if (val.length > 0) {
                this.ruleForm.port = val.join(',');
            } else {
                this.ruleForm.port = '';
            }
        },
        isShow: function(newval) {
            if (!newval) {
                this.checkPortList = [];
                this.$refs.ruleForm.resetFields();
                this.$refs.ruleForm.clearValidate();
            }
        },
        remoteIpPrefix: function() {
            this.ruleForm.uthorizationip = '';
        }
    },
    methods: {
        show(direction, groupId) {
            this.direction = direction;
            this.group_id = groupId;
            this.isShow = true;
            this.getSecurityGroupList();
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
        confirm() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.createGroupRuleFn();
                }
            });
        },
        getSecurityGroupList() {
            getSecurityGroupList({pageIndex: 1, limit: 1000}).then(res => {
                if (res.code === '0000') {
                    this.safeGroupList = res.data.data;
                }
            });
        },
        // 创建安全组
        createGroupRuleFn() {
            // let date = new Date();
            let data = {
                direction: this.direction,
                securityGroupId: this.group_id,
                remoteIpPrefix: this.remoteIpPrefix,
                port: this.ruleForm.port,
                Protocol_type: this.ruleForm.Protocol_type,
                protocol: this.ruleForm.Protocol_type,
                remark: this.ruleForm.remark,
                uthorizationip: this.ruleForm.uthorizationip,
                uthorizationtype: this.remoteIpPrefix,
                orderlevel: 1,
                austrategy: 'DENY',
                nctype: 'inner'
            };
            $log(data);
            this.loading = true;
            createGroupRule(data).then(ret => {
                if (ret.code === '0000') {
                    this.$message.success('操作成功');
                    this.hide();
                    this.resolve();
                }
            }).catch(err => {
                $log(err);
            }).finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>
<style scoped lang="scss">
.AddRules {
    .demo-ruleForm {
        padding-left: 20px;
        width: 80%;
    }
    .el-checkbox {
        min-width: 88px;
    }
}
</style>
