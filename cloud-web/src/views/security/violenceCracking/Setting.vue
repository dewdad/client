<template>
<span>
    <el-button type="primary" size="small" class="mr10" @click="show">
        <i class="iconfont icon-shezhi"></i> &nbsp;设置暴力破解
    </el-button>
    <el-dialog
        title="设置"
        :visible.sync="isShow"
        class="lock-ip-dialog">
        <zt-form size="small" :model="ruleForm" class="violence-cracking-setting-form color-secondary" :rules="rules" ref="ruleForm" :inline-message="true">
            <el-alert title=" " type="info" class="font12 mb10" :closable="false">
                说明文档： <router-link to="#" class="font12">原理，设置指导和影响</router-link>
            </el-alert>
            <select-assets v-model="ruleForm.server_id" label-width="130px" prop="server_id" @input="getConfig" @clear="clear"></select-assets>
            <zt-form-item label="检测周期" label-width="130px" prop="scan_span">
                <el-input v-model="ruleForm.scan_span">
                    <span slot="suffix">秒</span>
                </el-input>
            </zt-form-item>
            <zt-form-item label="密码错误次数" label-width="130px" prop="pwd_error_time">
                <el-input v-model="ruleForm.pwd_error_time">
                    <span slot="suffix">次</span>
                </el-input>
            </zt-form-item>
            <zt-form-item label="封停时间" label-width="130px" prop="ip_lock_span">
                <el-input v-model="ruleForm.ip_lock_span">
                    <span slot="suffix">秒</span>
                </el-input>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="hide">取 消</el-button>
        </span>
</el-dialog>
</span>
</template>

<script>
import SelectAssets from '@/components/form/SelectAssets.vue';
import {mapActions} from 'vuex';
import {setBruteForceConfig} from '@/service/security';
export default {
    props: {
        data: Object
    },
    data() {
        return {
            isShow: false,
            ruleForm: {
                server_id: '',
                scan_span: '',
                pwd_error_time: '',
                ip_lock_span: ''
            },
            rules: {
                server_id: [
                    {
                        required: true,
                        message: '请选择资产',
                        trigger: ['change', 'blur']
                    }
                ],
                scan_span: [
                    {
                        required: true,
                        message: '请输入检测周期',
                        trigger: ['change', 'blur']
                    }
                ],
                pwd_error_time: [
                    {
                        required: true,
                        message: '请输入密码错误次数',
                        trigger: ['change', 'blur']
                    }
                ],
                ip_lock_span: [
                    {
                        required: true,
                        message: '请输入封停时间',
                        trigger: ['change', 'blur']
                    }
                ]
            }
        };
    },
    watch: {
        // 选择资产后显示当前配置
        ruleForm: {
            deep: true,
            handler: async function(val, oldval) {
                // if (val.server_id) {
                //     let ret = await this.fetchBruteForceConfig({
                //         server_id: val.server_id
                //     });
                //     $log('获取设置', ret);
                //     if (ret) {
                //         let {ip_lock_span, pwd_error_times, scan_span} = ret;
                //         if (ip_lock_span) {
                //             this.ruleForm.ip_lock_span = ip_lock_span;
                //         }
                //         if (pwd_error_times) {
                //             this.ruleForm.pwd_error_time = pwd_error_times;
                //         }
                //         if (scan_span) {
                //             this.ruleForm.scan_span = scan_span;
                //         }
                //     }
                // }
            }
        }
    },
    methods: {
        ...mapActions('security', ['fetchBruteForceConfig']),
        async getConfig(server_id) {
            if (server_id) {
                let ret = await this.fetchBruteForceConfig({
                    server_id: server_id
                });
                $log('获取设置', ret);

                if (ret) {
                    let {ip_lock_span, pwd_error_times, scan_span} = ret;
                    if (ip_lock_span) {
                        this.ruleForm.ip_lock_span = ip_lock_span;
                    }
                    if (pwd_error_times) {
                        this.ruleForm.pwd_error_time = pwd_error_times;
                    }
                    if (scan_span) {
                        this.ruleForm.scan_span = scan_span;
                    }
                }
            }
        },
        show(name) {
            this.isShow = true;
            this.$nextTick(() => {
                this.$refs['ruleForm'].clearValidate();
            });
        },
        hide() {
            this.isShow = false;
            this.clear();
        },
        clear() {
            this.ruleForm = {
                server_id: '',
                scan_span: '',
                pwd_error_time: '',
                ip_lock_span: ''
            };
        },
        confirm() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.setBruteForceConfig();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        setBruteForceConfig() {
            setBruteForceConfig({
                op_status: '1',
                server_id: this.ruleForm.server_id,
                scan_span: this.ruleForm.scan_span,
                pwd_error_time: this.ruleForm.pwd_error_time,
                ip_lock_span: this.ruleForm.ip_lock_span
            })
                .then(ret => {
                    $log('setBruteForceConfig', ret);
                })
                .catch(error => {
                    console.warn('setBruteForceConfig', error.message);
                })
                .finally(() => {
                    this.hide();
                });
        }
    },
    components: {
        SelectAssets
    }
};
</script>
<style lang="scss">
.violence-cracking-setting-form {
    .el-form-item__content {
        width: 310px !important;
        margin-right: 10px;
    }
    .el-form-item__label {
        text-indent: 18px;
    }
}
</style>
