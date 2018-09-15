<template>
    <el-dialog
        title="路由接口"
        :visible.sync="isShow"
        width="45%"
        class="RoutePort">
        <el-alert
            title="基于特殊参数创建一路由。"
            type="warning"
            :closable="false">
        </el-alert>
        <zt-form class="mt20" inline-message :model="ruleForm" label-width="100px" style="width:392px;" size="small" :rules="rules" ref="ruleForm">
            <!-- 网络 -->
            <zt-form-item label="网络">
                <el-select v-model="ruleForm.Net" placeholder="请选择">
                    <el-option
                    v-for="item in netOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </zt-form-item>
            <!-- ip地址 -->
            <zt-form-item label="ip地址"  prop="IpAddress">
                <el-input v-model="ruleForm.IpAddress"></el-input>
            </zt-form-item>
            <!-- 路由名称 -->
            <zt-form-item label="路由名称"  prop="routerName">
                <el-input v-model="ruleForm.routerName" disabled></el-input>
            </zt-form-item>
            <!-- 路由id -->
            <zt-form-item label="路由id"  prop="routerId">
                <el-input v-model="ruleForm.routerId" disabled></el-input>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="loadingBtn">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {addRoutePort} from '@/service/ecs/network.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loadingBtn: false,
            accesstType: '',
            routerId: '',
            ruleForm: {
                Net: '',
                IpAddress: '',
                routerName: '',
                routerId: ''
            },
            rules: {
                Net: [
                    { required: true, message: '请输入路由名称', trigger: 'blur' },
                ],
                // IpAddress: [
                //     { required: true, message: '请选择外网', trigger: 'change' },
                // ]
            },
            netOption: [],
            rowData: []
        };
    },
    watch: {
        isShow(val) {
            if (!val) {
                this.ruleForm.Net = '';
                this.ruleForm.IpAddress = '';
                this.ruleForm.routerName = '';
                this.ruleForm.routerId = '';
            }
        }
    },
    methods: {
        show(rowItem) {
            this.isShow = true;
            this.netOption = rowItem.netListData;
            this.rowData = rowItem.row;
            this.ruleForm.routerName = rowItem.row.name;
            this.ruleForm.routerId = rowItem.row.id;

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
                    this.addRoutePortFn();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 保存路由接口
        addRoutePortFn() {
            let subnet = this.netOption.filter(
                item => item.id === this.ruleForm.Net
            );

            let params = {
                fixedIp: '',
                networkId: this.ruleForm.Net,
                routerId: this.ruleForm.routerId,
                subnetId: subnet[0].subnets[0]
            };
            this.loadingBtn = true;
            addRoutePort(params)
                .then(res => {
                    this.hide();
                    this.loadingBtn = false;
                    if (res && res.data) {
                        let data = res.data;
                        console.warn(data);
                    }
                })
                .catch(e => {
                    this.loadingBtn = false;
                    console.error('getEcsInstList', e);
                });
        }
    }
};
</script>

