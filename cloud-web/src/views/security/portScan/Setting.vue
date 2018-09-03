<template>
<span>
    <el-button type="primary" size="small" class="mr10" @click="show">
        <i class="iconfont icon-shezhi"></i> &nbsp;设置端口防扫描
    </el-button>
    <el-dialog
        title="设置"
        :visible.sync="isShow"
        class="lock-ip-dialog">
        <zt-form size="small" :model="ruleForm" class="portscan-setting-form color-secondary" :rules="rules" ref="ruleForm" :inline-message="true">
            <el-alert title=" " type="info" class="font12 mb10" :closable="false">
                说明文档： <router-link to="#" class="font12">原理，设置指导和影响</router-link>
            </el-alert>
            <select-assets v-model="ruleForm.server_id" label-width="130px" prop="server_id" @input="getConfig" @clear="clear"></select-assets>
            <!-- <zt-form-item label="检测周期" label-width="130px" prop="scan_span">
                <el-input v-model="ruleForm.scan_span"></el-input>秒
            </zt-form-item> -->
            <zt-form-item label="端口扫描次数" label-width="130px" prop="port_link_count">
                <el-input v-model="ruleForm.port_link_count">
                    <span slot="suffix">次</span>
                </el-input>
            </zt-form-item>
            <zt-form-item label="IP锁定时间" label-width="130px" prop="ip_lock_span">
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
import {setPortScanConfig} from '@/service/security';
export default {
    props: {
        data: Object
    },
    data() {
        return {
            isShow: false,
            ruleForm: {
                server_id: '',
                port_link_count: '',
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
                // scan_span: [
                //     {
                //         required: true,
                //         message: '请输入检测周期',
                //         trigger: ['change', 'blur']
                //     }
                // ],
                port_link_count: [
                    {
                        required: true,
                        message: '请输入端口扫描次数',
                        trigger: ['change', 'blur']
                    }
                ],
                ip_lock_span: [
                    {
                        required: true,
                        message: 'IP锁定时间',
                        trigger: ['change', 'blur']
                    }
                ]
            }
        };
    },
    methods: {
        ...mapActions('security', ['fetchPortScanConfig']),
        async getConfig(server_id) {
            if (server_id) {
                let ret = await this.fetchPortScanConfig({
                    server_id: server_id
                });
                $log('获取设置', ret);

                if (ret) {
                    let {ip_lock_span, port_link_count} = ret;
                    if (ip_lock_span) {
                        this.ruleForm.ip_lock_span = ip_lock_span;
                    }
                    if (port_link_count) {
                        this.ruleForm.port_link_count = port_link_count;
                    }
                    // if (scan_span) {
                    //     this.ruleForm.scan_span = scan_span;
                    // }
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
                port_link_count: '',
                ip_lock_span: ''
            };
        },
        confirm() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.setPortScanConfig();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        setPortScanConfig() {
            let params = {
                op_status: '1',
                server_id: this.ruleForm.server_id,
                // scan_span: this.scan_span,
                port_link_count: this.ruleForm.port_link_count,
                ip_lock_span: this.ruleForm.ip_lock_span
            };
            $log('setPortScanConfig -> ', params);
            setPortScanConfig(params)
                .then(ret => {
                    $log('setPortScanConfig', ret);
                })
                .catch(error => {
                    console.warn('setPortScanConfig', error.message);
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
.portscan-setting-form{
    .el-form-item__content {
        width: 310px !important;
        margin-right: 10px;
    }
    .el-form-item__label {
        text-indent: 18px;
    }
}
</style>
