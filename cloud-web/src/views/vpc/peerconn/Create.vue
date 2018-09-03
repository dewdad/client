<template>
    <el-dialog v-if="isShow" title="创建对待连接" :visible.sync="isShow" width="500px" :append-to-body="true" @close="cancel">
        <div class="form" style="padding-right:130px;">
            <zt-form ref="myForm" label-width="80px" :model="myForm" size="small" inline-message>
                <zt-form-item label="名称" prop="name" :rules="{required: true,message: '请填写对待连接名称',trigger: ['blur', 'change']}">
                    <el-input v-model="myForm.name" placeholder="请填写对待连接名称"></el-input>
                </zt-form-item>
                <zt-form-item label="本端VPC" prop="reqVpcId" :rules="{required: true,message: '请选择本端VPC',trigger: ['blur', 'change']}">
                    <el-select v-model="myForm.reqVpcId" placeholder="请选择本端VPC">
                        <el-option v-for="vpc in reqNetwork" :key="vpc.id" :label="vpc.name" :value="vpc.hwId">
                        </el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="对端VPC" prop="accVpcId" :rules="{required: true,message: '请选择对端VPC',trigger: ['blur', 'change']}">
                    <el-select v-model="myForm.accVpcId" placeholder="请选择对端VPC">
                        <el-option v-for="vpc in accNetwork" :key="vpc.id" :label="vpc.name" :value="vpc.hwId">
                        </el-option>
                    </el-select>
                </zt-form-item>
            </zt-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm" :loading="isSubmit" :disabled="isSubmit" size="small">确定</el-button>
            <el-button type="info" @click="cancel" :disabled="isSubmit" size="small">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {queryNetwork} from '@/service/ecs/network';
import {createPeering} from '@/service/ecs/peerconn';
export default {
    name: 'ApplyIp',
    data() {
        return {
            isShow: false,
            isSubmit: false,
            reject: null,
            resolve: null,
            myForm: {
                name: '',
                reqVpcId: '',
                accVpcId: ''
            },
            vpcList: []
        };
    },
    computed: {
        // 本端vpc列表
        reqNetwork: function() {
            return this.vpcList.filter(item => {
                return item.hwId !== this.myForm.accVpcId; // 过滤对端已选择的VPC
            });
        },
        accNetwork: function() {
            return this.vpcList.filter(item => {
                return item.hwId !== this.myForm.reqVpcId; // 过滤本端已选择的VPC
            });
        }
    },
    methods: {
        queryNetwork() {
            queryNetwork()
                .then(res => {
                    this.vpcList = res.records;
                })
                .catch(err => $log(err));
        },
        show() {
            this.isShow = true;
            this.queryNetwork();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            this.isShow = false;
            // 重置表单值
            this.myForm = {
                name: '',
                reqVpcId: '',
                accVpcId: ''
            };
        },
        cancel() {
            this.close();
        },
        confirm() {
            this.$refs['myForm'].validate(valid => {
                if (valid) {
                    this.isSubmit = true;
                    createPeering({...this.myForm})
                        .then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('创建成功');
                                this.resolve(res);
                                this.close();
                            }
                        })
                        .catch(err => {
                            $log(err);
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
