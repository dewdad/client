<template>
    <el-dialog title="添加静态路由" :visible.sync="isShow" width="600px" class="addStaticRouter">
        <zt-form class="mt20" inline-message :model="ruleForm" label-width="100px" style="width:392px;" size="small" :rules="rules" ref="ruleForm">
            <!-- 路由名称 -->
            <zt-form-item label="目的CIDR" prop="destination">
                <el-input v-model="ruleForm.destination"></el-input>
                <span slot="help" class="input-help" style="line-height: 16px">比如要建立子网A:192.168.0.0/24到子网B：192.168.1.0/24的静态路由表，那么目的cidr就是192.168.1.0/24</span>
            </zt-form-item>
            <!-- 选择外网 -->
            <zt-form-item label="下一跳" prop="nexthop">
                <el-input v-model="ruleForm.nexthop"></el-input>
                <span slot="help" class="input-help" style="line-height: 16px">下一跳的IP必须是路由器接口已连接的子网的一个IP。</span>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disabled="loadingBtn">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="loadingBtn">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {addStaticRouter} from '@/service/ecs/network.js';
import {cloneDeep} from '@/utils/utils';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loadingBtn: false,
            routeData: [],
            ruleForm: {
                destination: '',
                nexthop: ''
            },
            rules: {
                destination: [{required: true, message: '请输入目的CIDR', trigger: 'blur'}],
                nexthop: [{required: true, message: '请输入下一跳IP', trigger: 'blur'}]
            }
        };
    },
    watch: {
        isShow(val) {
            if (!val) {
                this.ruleForm.destination = '';
                this.ruleForm.nexthop = '';
                this.$refs['ruleForm'].resetFields();
            }
        }
    },
    methods: {
        show(rowItem) {
            this.isShow = true;
            this.routeData = rowItem.route;
            $log(this.routeData);
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.$refs['ruleForm'].resetFields();
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
            let ruleForm = this.$refs.ruleForm;
            if (!this.$refs.ruleForm) return false;

            // 表单验证
            ruleForm.validate(valid => {
                if (valid) {
                    this.createStaticRoute();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 创建静态路由
        createStaticRoute() {
            let routes = cloneDeep(this.routeData.routes);
            let data = {
                id: this.routeData.id,
                name: this.routeData.name,
                adminStateUp: this.routeData.admin_state_up,
                networkId: this.routeData.external_gateway_info.network_id,
                routes: [...routes, this.ruleForm]
            };
            this.loadingBtn = true;
            addStaticRouter(data)
                .then(ret => {
                    if (ret.code === '0000') {
                        this.resolve(ret);
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.hide();
                    }
                    this.loadingBtn = false;
                })
                .catch(error => {
                    this.loadingBtn = false;
                    console.warn('添加路由', error.message);
                })
                .finally(() => {
                    this.loadingBtn = false;
                });
        }
    }
};
</script>
