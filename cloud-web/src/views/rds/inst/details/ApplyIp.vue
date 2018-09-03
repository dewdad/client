<template>
    <el-dialog v-if="isShow" title="申请连接IP" :visible.sync="isShow"  :append-to-body="true" @close="cancel">
        <div class="form" style="padding-right:230px;">
            <zt-form ref="myForm" label-width="0px" :model="myForm" size="small" inline-message>
                <zt-form-item label="">
                    <el-radio v-model="myForm.applyType" label="newCreate">新建IP地址</el-radio>
                </zt-form-item>
                <zt-form-item label="">
                    <el-radio v-model="myForm.applyType" label="isReady">连接IP地址</el-radio>
                </zt-form-item>
                <zt-form-item v-if="myForm.applyType==='isReady'" prop="applyIpData" :rules="{required: true,message: '请选择连接IP',trigger: ['blur', 'change']}">
                    <el-select value-key="ipAdd" v-model="myForm.applyIpData" placeholder="请选择连接IP地址" >
                        <el-option v-for="ip in ipDataList" :key="ip.ipAdd" :label="ip.ipAdd" :value="ip">
                        </el-option>
                    </el-select>
                </zt-form-item>
            </zt-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">确定</el-button>
            <el-button type="info" @click="cancel" size="small">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {getUnbindFloatingIP, updateFloatIp} from '@/service/rds/detail';
export default {
    name: 'ApplyIp',
    data() {
        return {
            isShow: false,
            isSubmit: false,
            reject: null,
            resolve: null,
            myForm: {
                applyType: 'newCreate',
                applyIpData: ''
            },
            ipDataList: []
        };
    },
    props: {
        instId: String
    },
    methods: {
        getIpDataList() {
            getUnbindFloatingIP().then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    this.ipDataList = res.result.records;
                }
            });
        },
        show() {
            this.isShow = true;
            this.getIpDataList();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            this.isShow = false;
            // 重置表单值
            this.myForm = {
                applyType: 'newCreate',
                applyIpData: ''
            };
        },
        cancel() {
            this.close();
        },
        confirm() {
            this.$refs['myForm'].validate(valid => {
                if (valid) {
                    this.isSubmit = true;
                    let ipAdd = this.myForm.applyType === 'isReady' ? this.myForm.applyIpData.ipAdd : '';
                    let id = this.myForm.applyType === 'isReady' ? this.myForm.applyIpData.hwId : '';
                    updateFloatIp(this.instId, 'enablePublicAccess', ipAdd, id)
                        .then(res => {
                            this.isSubmit = false;
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.resolve(res);
                                this.close();
                            }
                        })
                        .finally(() => {
                            this.isSubmit = false;
                        });
                }
            });
        }
    }
};
</script>
<style scoped>
.createBody {
    padding: 10px;
}
</style>
