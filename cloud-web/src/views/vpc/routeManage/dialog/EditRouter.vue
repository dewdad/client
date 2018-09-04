<template>
    <el-dialog
        title="申请浮动IP"
        :visible.sync="isShow"
        width="45%"
        class="EditRouter">
        <el-alert
            title="基于特殊参数创建一路由。"
            type="warning"
            :closable="false">
        </el-alert>
        <zt-form class="mt20" inline-message :model="ruleForm" label-width="100px" style="width:392px;" size="small"  ref="ruleForm">
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
            <!-- 管理状态 -->
            <zt-form-item label="管理状态" prop="manageState">
                <el-select v-model="ruleForm.manageState" placeholder="请选择">
                    <el-option
                    v-for="item in stateOption"
                    :key="item.state"
                    :label="item.name"
                    :value="item.state">
                    </el-option>
                </el-select>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="loadingBtn">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {editRouter, amendRouter} from '@/service/ecs/network.js';
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
                ],
                manageState: [
                    { required: true, message: '请选择管理状态', trigger: 'change' },
                ]
            },
            netOption: [],
            stateOption: [
                {
                    state: true,
                    name: 'UP' 
                },
                {
                    state: false,
                    name: 'DOWN' 
                },
            ]
        };
    },
    methods: {
        show(rowItem) {
            this.isShow = true;
            this.accesstType = rowItem.type;
            this.netOption = rowItem.outerNetData;
            if (rowItem.type === 'update') {
                this.ruleForm.routerName = rowItem.row.name;
                this.ruleForm.outerNet = rowItem.row.networkId;
                this.ruleForm.manageState = rowItem.row.adminStateUp;
                this.routerId = rowItem.row.id;
            }
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
                    this.addRouter();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 添加路由
        addRouter() {
            this.loadingBtn = true;
            let params = {
                adminStateUp: this.ruleForm.manageState,
                name: this.ruleForm.routerName,
                networkId: this.ruleForm.outerNet
            };
            let editRouterFn = editRouter;
            if (this.accesstType === 'update') {
                params.id = this.routerId;
                editRouterFn = amendRouter;
            }
            editRouterFn(params)
                .then(ret => {
                    if (ret) {
                        this.resolve(ret);
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    }
                })
                .catch(error => {
                    console.warn('添加路由', error.message);
                })
                .finally(() => {
                    this.hide();
                    this.loadingBtn = false;
                });
        },
    }
};
</script>

