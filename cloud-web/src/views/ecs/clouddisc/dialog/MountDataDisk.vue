<template>
    <el-dialog title="挂载云盘" :visible.sync="isShow" width="600px" class="CustomImageDesc" @close="cancel">
        <el-alert type="warning" :closable="false" class="font12">
            重要提示：“磁盘挂载”执行成功后，您还需要登录本实例对挂载的磁盘进行“分区格式化和挂载新分区”的操作。 分区格式化/挂载数据盘操作指南: <a class="font12">Window</a>>,<a class="font12">Linux</a>>
        </el-alert>
        <div style="padding-left:20px;">
            <zt-form inline-message class="mt20 demo-ruleForm" label-width="140px" size="small" ref="ruleForm">
                <!-- 镜像名称 -->
                <zt-form-item label="磁盘ID">
                    <span>{{rowItem.id}}</span>
                </zt-form-item>
                <!-- 系统平台 -->
                <zt-form-item label="目标实例">
                    <el-select v-model="formData.instanceId" placeholder="请选择">
                        <el-option v-for="item in ecsInsts" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </zt-form-item>
                <!-- 本实例可用设备名 -->
                <zt-form-item label="本实例可用设备名">
                    <span class="mr10">自动分配</span>
                    <i class="iconfont icon-notice_people"></i>
                </zt-form-item>
            </zt-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disabled="loading">取 消</el-button>
             <el-button type="primary" size="small" :loading="loading" :disabled="formData.instanceId === ''" @click="confirm">执行挂载</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {getEcsInstList} from '@/service/ecs/list.js';
import {mountDisk} from '@/service/ecs/disk/disk.js';

export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            rowItem: {},
            ecsInsts: [],
            formData:{
                autoDelSnapshot:false,
                instanceId:''
            },
            
        };
    },
    watch: {
        isShow(val) {
            if(!val){
                this.formData.instanceId = '';
                this.$refs['ruleForm'].clearValidate();
            }
        }
    },
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.isShow = true;
            this.getEcsInstAll();

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
                volumeId: this.rowItem.id,
                instanceId: this.formData.instanceId
                //imageRef: '',
            };
            this.loading = true;
            mountDisk(data)
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

        //查询目标实例(可以挂载的ecs实例)
        getEcsInstAll() {
            getEcsInstList({status: 'active'}).then(
                res => {
                    if (res && res.data) {
                        let data = res.data;
                        if (data.code && data.code === this.CODE.SUCCESS_CODE) {
                            let jsonData = data.data;
                            console.log('jsonData', jsonData);
                            if (jsonData && jsonData.data) {
                                let ecsInsts = jsonData.data || [];
                                this.ecsInsts = ecsInsts;
                            }
                        }
                    }
                },
                () => {}
            );
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
