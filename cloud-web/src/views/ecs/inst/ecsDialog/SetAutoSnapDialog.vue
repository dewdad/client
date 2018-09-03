<template>
    <el-dialog title="设置自动快照策略" :visible.sync="isShow" width="45%" class="SetAutoSnapDialog">
        <!-- tip提示 -->
        <el-alert  title="" type="warning" :closable="false">
            <span class="font12">为了保证快照创建成功，正在创建快照时，您不能修改ECS实例状态，比如停止或重启ECS实例，请耐心等待。</span>
        </el-alert>
        <div class="enterPwd mt20 font12">
            <span class="title">
                自动快照策略
            </span>
            <div class="right ml20">
                <el-switch v-model="snapState" active-color="#6FC856" inactive-color="#D9DCE5">
                </el-switch>
            </div>
        </div>
        <div class="enterPwd mt20 font12 color666" :class="{'color999': !snapState}">
            <span class="title">
                策略名称
            </span>
            <div class="right ml20">
                <el-select v-model="selectedPolicy" :disabled="!snapState" size="small" placeholder="请选择">
                    <el-option v-for="item in policyOptions" :key="item.value" :label="item.label" :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="enterPwd mt20 font12" :class="{'color999': !snapState}">
            <span class="title">
                创建时间
            </span>
            <div class="right ml20">
                <span>{{selectedPolicy.execTime}}</span>
            </div>
        </div>
        <div class="enterPwd mt20 font12">
            <span class="title" :class="{'color999': !snapState}">
                重复日期
            </span>
            <div class="right ml20">
                <span>{{selectedPolicy.repeatDate}}</span>
            </div>
        </div>
        <div class="enterPwd mt20 font12" :class="{'color999': !snapState}">
            <span class="title">
                保留时间
            </span>
            <div class="right ml20">
                <span>{{ selectedPolicy.saveDays ==='-1' ? '不限': ((selectedPolicy.saveDays || '0')+'天') }}</span>
            </div>
        </div>

        <span slot="footer" class="dialog-footer">           
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {getPolicy} from '@/service/ecs/policy.js';
import {setDiskSnapshotPolicy} from '@/service/ecs/disk/disk.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            selectedPolicy: {},
            policyOptions: [],
            snapState: false,
            rowItem: {}
        };
    },
    props: {},
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.snapState = !!rowItem.policyId;
            this.isShow = true;
            this.getPolicy();

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.rowItem = {};
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
        //确定提交
        confirm() {
            if (!this.selectedPolicy.pid) return;
            let data = {
                disk_ids: [],
                policy_id: this.selectedPolicy.pid
            };
            setDiskSnapshotPolicy(data)
                .then(res => {
                    this.resolve(data);
                    this.hide();
                    //this.setting();                  
                })
                .catch(err => {
                    console.log('setDiskSnapshotPolicy', err);
                });
        },
        //查询策略(策略名称下拉列表)
        getPolicy() {
            let data = {
                limit: 100,
                pageIndex: 1
            };
            getPolicy(data)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.log('getPolicy', res);
                        let resData = res.result;
                        if (resData && resData.records) {
                            this.policyOptions = res.records || [];

                            let selItem = this.policyOptions.find(item => item.pid === this.rowItem.policyId);
                            this.selectedPolicy = selItem || this.policyOptions[0] || {};
                        }
                    }
                })
                .catch(err => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
        //切换策略
        changeSnapStrategy() {}
    }
};
</script>
<style lang="scss" scoped>
.SetAutoSnapDialog {
    .tip {
        background-color: #fbf7cf;
        padding: 15px 30px;
        color: #f68300;
        border: 1px solid #f6e0c4;
    }
    .enterPwd {
        display: flex;
        justify-content: center;
        span.title {
            flex: 1;
            padding-left: 20px;
            display: flex;
            align-items: center;
        }
        .right {
            flex: 5;
            div {
                width: 300px;
            }
        }
        .el-input {
            input {
                width: 300px;
            }
            flex: 5;
        }
    }
}
</style>
