<template>
    <el-dialog
        title="申请浮动IP"
        :visible.sync="isShow"
        width="45%"
        class="ApplyFloatIP">
        <zt-form inline-message :model="ruleForm" label-width="100px" style="width:392px;" size="small"  ref="ruleForm">
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
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm" :loading="loadingBtn">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {confirmApplyFloatIP} from '@/service/ecs/network.js';

export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            rowItem: {},
            loadingBtn: false,
            ruleForm:{
                outerNet: ''
            },
            netOption:[
                {
                    value: '选项1',
                    label: '黄金糕'
                }
            ]
        };
    },
    methods: {
        show(rowItem) {
            this.isShow = true;
            this.netOption = rowItem;
            this.ruleForm.outerNet = rowItem[0].id;
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
            try {
                // 清空数据
                let params = {
                    networkId: this.ruleForm.outerNet
                };
                this.loadingBtn = true;
                confirmApplyFloatIP(params)
                    .then((ret) => {
                        this.loadingBtn = false;
                        if (ret.code === '0000') {
                            console.warn('confirmApplyFloatIP', ret);
                            this.hide();
                            this.loadingBtn = false;
                            this.resolve(ret);
                        }
                    })
                    .catch((err) => {
                        $log(err);
                        this.loadingBtn = false;
                    });

            } catch (error) {
                console.error('fetchData', error.message);
            }
        }
    }
};
</script>

<style lang="scss" scoped>

</style>

