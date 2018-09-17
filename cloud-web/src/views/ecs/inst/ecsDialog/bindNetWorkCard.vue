<template>
    <el-dialog :title="dialogTitle" :visible.sync="isShow" width="600px" class="dlg-bindip" @close="cancel">
        <zt-form inline-message :model="ruleForm" label-width="73px" style="width:392px;" size="small" ref="ruleForm">
            <zt-form-item :label="$t('dialog.bindPublicip.currentInst')" class="lh-em1">
                <span class="font12">{{ecsInst.name||ecsInst.id}}</span>
            </zt-form-item>
            <zt-form-item label="网卡" prop="portId" class="mb0" :rules="rules">
                <el-select v-if="this.opType === 1" key="bind" v-model="ruleForm.portId" size="small" :loading="remote" placeholder="请选择" popper-class="el-popper--small">
                    <el-option v-for="item in netWorkListFilter" :key="item.id"  :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-if="this.opType === 2" key="unbind" v-model="ruleForm.portId" size="small" :loading="remote" placeholder="请选择" popper-class="el-popper--small">
                    <el-option v-for="item in netWorkList" :key="item.fixed_ips[0].ip_address" :label="item.fixed_ips[0].ip_address" :value="item.port_id">
                    </el-option>
                </el-select>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" :loading="loading" @click="confirm" size="small">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {queryNetwork} from '@/service/ecs/network.js';
import {attachPort, detachPort, listPortAttachment} from '@/service/ecs/list';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            remote: false,
            ecsInst: {},
            netWorkList: [],
            bandedPublicNetData: [],
            opType: 1,
            ruleForm: {
                serverId: '',
                portId: ''
            },
            rules: [
                {
                    required: true,
                    message: '请选择网卡',
                    trigger: ['submit', 'change']
                }
            ]
        };
    },
    computed: {
        dialogTitle() {
            return this.opType === 1 ? '添加网卡' : '分离网卡';
        },
        netWorkListFilter() {
            return this.netWorkList.filter(item => {
                // return item.hasOwnProperty(this.)
                return this.ecsInst.addresses && this.ecsInst.addresses.addresses[item.name] ? false : true;
            });
        }
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.ruleForm = {
                    serverId: '',
                    portId: ''
                };
                this.loading = false;
                this.ecsInst = {};
                this.$refs.ruleForm.resetFields();
                this.$refs.ruleForm.clearValidate();
            }
        }
    },
    methods: {
        show(rowItem, opType) {
            this.ecsInst = rowItem;
            this.opType = opType;

            console.log('this.ecsInst', this.ecsInst);
            this.isShow = true;

            switch (this.opType) {
                case 1: {
                    //添加网卡
                    this.queryNetwork();
                    break;
                }
                case 2: {
                    //分离网卡
                    this.listPortAttachment();
                    break;
                }
                default: {
                }
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
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    // await this.getPortByEcsId(this.ecsInst.ecsId, this.ruleForm.publicNet.id);
                    this.loading = true;
                    let handle = detachPort;
                    if (this.opType === 1) {
                        handle = attachPort;
                    }
                    //提交后台
                    handle(this.ecsInst.id, this.ruleForm.portId)
                        .then(async res => {
                            console.log('修改信息', res);
                            if (res.code === '0000') {
                                this.$message.success($t('common.successOpt'));
                                // this.setting();
                                this.resolve(this.ecsInst);
                                this.hide();
                            }
                        })
                        .catch(err => {
                            $log(err);
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
            });
        },

        listPortAttachment: function() {
            this.remote = true;
            listPortAttachment(this.ecsInst.id).then(
                res => {
                    $log('abc', res);
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.netWorkList = res.data || [];
                    }
                }
            ).catch(err => {
                $log(err);
            }).finally(() => {
                this.remote = false;
            });
        },

        // 查询网络列表
        queryNetwork: function() {
            this.remote = true;
            queryNetwork({pageIndex: 1, limit: 9999})
                .then(res => {
                    this.netWorkList = res.data || [];
                })
                .finally(() => {
                    this.remote = false;
                });
        }
    }
};
</script>
<style lang="scss">
.dlg-bindip {
    .el-form {
        .el-form-item__label {
            padding-right: 0;
        }
        .el-form-item.el-form-item--small.lh-em1 {
            .el-form-item__label {
                line-height: 1 !important;
            }
            .el-form-item__content {
                line-height: 1 !important;
            }
        }
    }
}
</style>
