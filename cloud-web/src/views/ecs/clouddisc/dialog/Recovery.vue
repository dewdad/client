<template>
    <el-dialog title="恢复备份" :visible.sync="isShow" width="600px" class="CustomImageDesc" @close="cancel">
        <div style="padding-left:20px;">
            <zt-form inline-message class="mt20 demo-ruleForm" label-width="80px" size="small" ref="ruleForm">
                <!-- 恢复到 -->
                <zt-form-item label="恢复到">
                    <el-select v-model="formData.volumeId" :loading="remote" value-key="id" placeholder="请选择云盘">
                        <el-option v-for="item in disks" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>
                </zt-form-item>
            </zt-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disabled="loading">取 消</el-button>
             <el-button type="primary" size="small" :loading="loading" :disabled="formData.volumeId === ''" @click="confirm">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {getDiskList, restoreBackup} from '@/service/ecs/disk/disk.js';

export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            remote: false,
            loading: false,
            rowItem: {},
            disks: [],
            formData:{
                volumeId:''
            },
            
        };
    },
    watch: {
        isShow(val) {
            if(!val){
                this.formData.volumeId = '';
                this.$refs['ruleForm'].clearValidate();
            }
        }
    },
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.isShow = true;
            this.getAllDisk();

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
            let data = {
                backupId: this.rowItem.id,
                volumeId: this.formData.volumeId.id
                //imageRef: '',
            };
            if (this.formData.volumeId.size <= this.rowItem.size) {
                this.$alert('磁盘容量必须大于等于备份容量', {
                    type: 'error'
                });
                return;
            }
            this.loading = true;
            restoreBackup(data)
                .then( res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) { 
                        this.resolve(res);
                        this.hide();
                        //this.setting();                                            
                    }                              
                })
                .catch(
                    err => {
                        $log(err);
                    }
                ).finally(() => {
                    this.loading = false;
                });
        },
        //查询所有云盘
        getAllDisk() {
            this.remote = true;
            let params = {
                pageIndex:1,
                limit: 9999,
                status: 'available'
            };
            getDiskList(params).then(res => {
                if (res.code === '0000') {
                    let data = res.data;
                    let jsonData = data.data;
                    this.disks = jsonData || [];
                }
            }).catch(err => {
                $log(err);
            }).finally(() => {
                this.remote = false;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.CustomImageDesc {
    .demo-ruleForm {
        width: 80%;
    }
}
</style>
