<template>
    <el-dialog
        title="添加静态路由"
        :visible.sync="isShow"
        width="45%"
        class="addStaticRouter">
        <zt-form class="mt20" inline-message :model="ruleForm" label-width="100px" style="width:392px;" size="small" :rules="rules" ref="ruleForm">
            <!-- 路由名称 -->
            <zt-form-item label="目的CIDR"  prop="destination">
                <el-input v-model="ruleForm.destination"></el-input>
                <span class="input-help" style="line-height: 16px">比如要建立子网A:192.168.0.0/24到子网B：192.168.1.0/24的静态路由表，那么目的cidr就是192.168.1.0/24</span>
            </zt-form-item>
            <!-- 选择外网 -->
            <zt-form-item label="下一跳" prop="nexthop">
                <el-input v-model="ruleForm.nexthop"></el-input>
                <span class="input-help" style="line-height: 16px">下一跳的IP必须是路由器接口已连接的子网的一个IP。</span>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="loadingBtn">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {addStaticRouter} from '@/service/ecs/network.js';
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
                nexthop: '',
            },
            rules: {
                destination: [
                    { required: true, message: '请输入目的CIDR', trigger: 'blur' },
                ],
                nexthop: [
                    { required: true, message: '请输入下一跳IP', trigger: 'blur' },
                ]
            },
        };
    },
    methods: {
        show(rowItem) {
            this.isShow = true;
            this.routeData = rowItem.route;
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
                    this.createStaticRoute();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 创建静态路由
        createStaticRoute() {
            this.routeData[0].routes = [
                {
                    ...this.ruleForm
                }
            ];
            addStaticRouter(this.routeData[0])
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
        }
        
    }
};
</script>
