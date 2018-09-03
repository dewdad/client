<template>
    <el-dialog
        title="添加规则"
        :visible.sync="isShow"
        width="45%"
        class="AddRules">
        <!-- 注意事项 -->
        <el-alert title="" class="font12 mb20" type="warning" :closable="false">
            <i class="iconfont icon-notice_people mr10"></i>
            <span>入方向规则为充许访问的规则</span>
        </el-alert>
        <zt-form size="small" :inline-message="true" :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="100px" class="demo-ruleForm">
            <!-- 规则方向 -->
            <zt-form-item label="规则方向">
                <span>入方向</span>
            </zt-form-item>
            <!-- 访问类型 -->
            <zt-form-item label="访问类型">
                <el-select v-model="ruleForm.accessTypeVal" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in accessType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- 端口范围 -->
            <zt-form-item label="端口范围" prop="portInput" v-show="ruleForm.accessTypeVal === 'TCP' || ruleForm.accessTypeVal === 'UDP' ">
                <el-input size="small" :readonly="checkPortList.length > 0 " v-model="ruleForm.portInput"></el-input>
                <span class="input-help">取值范围从1到65535；设置格式例如“1-200”、“80-80”，其中 “-1”代表不限制端口。</span>
            </zt-form-item>
            <!-- 常用端口 -->
            <zt-form-item label="常用端口" v-show="ruleForm.accessTypeVal === 'TCP' || ruleForm.accessTypeVal === 'UDP' ">
                <el-checkbox-group v-model="checkPortList">
                    <el-checkbox v-for="item in commonPort" :key="item.label"  class="ml10" :label="item.label">{{item.value}}</el-checkbox>
                </el-checkbox-group>
            </zt-form-item>
            <!-- 授权类型 -->
            <zt-form-item label="授权类型">
                <el-select v-model="authTypeVal" size="small" placeholder="请选择">
                    <el-option
                    v-for="auth in authType"
                    :key="auth.value"
                    :label="auth.label"
                    :value="auth.value">
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- 安全组 -->
            <zt-form-item label="安全组" prop="accessTypeVal" v-show="authTypeVal === 'SGRP'">
                <el-select v-model="ruleForm.accessTypeVal" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in accessType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- 地址段 -->
            <zt-form-item label="地址段" prop="addrInput" v-show="authTypeVal === 'ADDR'">
                <el-input size="small" v-model="ruleForm.addrInput"></el-input>
                    <span class="input-help">填写规则:符合子网掩码填写规则的IP地址段，如10.x.y.z/32,也可单独填写某个IP地址，-1代表所有IP地址。</span>
            </zt-form-item>
            <!-- 描述 -->
            <zt-form-item label="描述">
                <el-input size="small" v-model="descInput"></el-input>
                <div class="input-help">长度为2-256个字符，不能以http://或https://开头</div>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>

import { createGroupRule } from '@/service/ecs/security.js';

let commonPort = [
    {label : '22', value: 'SSH (22)'},
    {label : '23', value: 'Telnet (23)'},
    {label : '80', value: 'HTTP (80)'},
    {label : '443', value: 'HTTPS (443)'},
    {label : '1433', value: 'MS SQL (1433)'},
    {label : '1521', value: 'Oracle (1521)'},
    {label : '3306', value: 'MySQL (3306)'},
    {label : '3389', value: 'RDP (3389)'},
    {label : '5432', value: 'PostgreSQL (5432)'},
    {label : '6379', value: 'Redis (6379)'},
];
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            descInput: '',
            commonPort,
            checkPortList: [],
            accessType: [
                {value: 'SG_TYPE_ALL',label: '全部'},
                {value: 'TCP',label: 'TCP'},
                {value: 'UDP',label: 'UDP'},
                {value: 'ICMP',label: 'ICMP'}
            ],
            authType: [
                {value: 'ADDR',label: '地址段访问'},
                {value: 'SGRP',label: '安全组访问'}
            ],
            authTypeVal: 'ADDR',
            ruleForm: {
                addrInput: '',
                accessTypeVal: 'SG_TYPE_ALL',
                portInput: ''
            },
            rules: {
                addrInput: [
                    { required: true, message: '必填项', trigger: 'change' }
                ],
                accessTypeVal: [
                    { required: true, message: '必填项', trigger: 'change' }
                ],
                portInput: [
                    { required: true, message: '必填项', trigger: 'change' }
                ]
            },
            group_id: '',
            direction: ''
        };
    },
    watch: {
        checkPortList (val) {
            if(val.length > 0) {
                this.ruleForm.portInput = val.join(',');
            } else{
                this.ruleForm.portInput = '';
            }
        }
    },
    methods: {
        show(direction, groupId) {
            this.direction = direction;
            this.group_id = groupId;
            this.isShow = true;
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
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            this.hide();
            this.createGroupRuleFn();
            this.resolve({
            });
        },
        // 创建安全组
        createGroupRuleFn() {
            // let date = new Date();
            let data = {
                createdate: '',
                direction: this.direction ,
                groupid: this.group_id ,
                id:'' ,
                orderlevel: 1,
                port: this.ruleForm.portInput ,
                protocoltype: this.ruleForm.accessTypeVal,
                remark: this.descInput,
                uthorizationip: 'sg-vbzersavqooz',
                uthorizationpolicy:'' ,
                uthorizationtype: this.authTypeVal 
            };
            $log(data);
            createGroupRule(data)
                .then((ret) => {
                    $log(ret);
                });
        }
    }
};
</script>
<style lang="scss">
.AddRules{
    .demo-ruleForm{
        padding-left: 20px;
        width: 80%;
    }
}
.el-dialog .el-dialog__body{
    max-height: 380px;
    overflow: auto;
}
</style>
