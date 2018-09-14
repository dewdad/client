<template>
    <el-dialog
        title="申请浮动IP"
        :visible.sync="isShow"
        width="45%"
        class="EditRouter">
        <el-alert
            title="您可以将一个指定的外部网络连接到路由器.外部网络将作为路由器的默认路由同时将扮演外部连接网关的角色"
            type="warning"
            :closable="false">
        </el-alert>
        <zt-form class="mt20" inline-message :model="ruleForm" label-width="100px" style="width:392px;" size="small" :rules="rules" ref="ruleForm">
            <!-- 路由名称 -->
            <zt-form-item label="路由名称"  prop="routerName">
                <el-input v-model="ruleForm.routerName"></el-input>
            </zt-form-item>
            <!-- 选择外网 -->
            <zt-form-item label="选择外网">
                <el-select v-model="ruleForm.outerNet" placeholder="请选择">
                    <el-option
                    v-for="item in netOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- 路由id -->
            <zt-form-item label="路由id" prop="manageState">
                <el-input v-model="routerId" disabled></el-input>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="loadingBtn">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {editGateway} from '@/service/ecs/network.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loadingBtn: false,
            accesstType: '',
            routerId: '',
            gateway: {},
            ruleForm: {
                routerName: '',
                outerNet: '',
                manageState: true
            },
            rules: {
                routerName: [
                    { required: true, message: '请输入路由名称', trigger: 'blur' },
                ],
                outerNet: [
                    { required: true, message: '请选择外网', trigger: 'change' },
                ]
            },
            netOption: []
        };
    },
    methods: {
        show(rowItem) {
            this.isShow = true;
            this.netOption = rowItem.outerNetData;
            this.routerId = rowItem.row.id;
            this.ruleForm.routerName = rowItem.row.name;
            this.gateway = rowItem.row;
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
            let ruleForm = this.$refs.ruleForm;
            if (!this.$refs.ruleForm) return false;

            // 表单验证
            ruleForm.validate(valid => {
                if (valid) {
                    this.editGatewayFn();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 添加路由
        editGatewayFn() {
            this.loadingBtn = true;
            let networkName = this.netOption.filter(
                item => item.id === this.ruleForm.outerNet
            );
            this.gateway.networkId = this.ruleForm.outerNet;
            this.gateway.networkName = networkName[0].name;
            let params = {
                ...this.gateway
            };
            editGateway(params)
                .then(ret => {
                    if (ret) {
                        this.resolve(ret);
                    }
                })
                .catch(error => {
                    console.warn('设置网关失败', error.message);
                })
                .finally(() => {
                    this.hide();
                    this.loadingBtn = false;
                });
        },
    }
};
</script>

