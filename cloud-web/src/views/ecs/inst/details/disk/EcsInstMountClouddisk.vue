<template>
    <el-dialog :title="title" :visible.sync="isShow" width="600px" class="CustomImageDesc">
        <div class="zt-orangetip">
            重要提示：“磁盘挂载”执行成功后，您还需要登录本实例对挂载的磁盘进行“分区格式化和挂载新分区”的操作。 分区格式化/挂载数据盘操作指南:
            <a class="font12">Window</a>>,
            <a class="font12">Linux</a>>
        </div>
        <div style="padding-left:20px;">
            <zt-form inline-message class="demo-ruleForm" label-width="120px" size="small" ref="ruleForm">
                <!-- 镜像名称 -->
                <zt-form-item label="实例ID">
                    <span>{{rowItem.id}}</span>
                </zt-form-item>
                <!-- 系统平台 -->
                <zt-form-item label="目标磁盘">
                    <el-select v-model="formData.diskId" placeholder="请选择">
                        <el-option v-for="item in disks" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </zt-form-item>
                <!-- 本实例可用设备名 -->
                <zt-form-item label="本实例可用设备名">
                    <span class="mr10">自动分配</span>
                    <i class="iconfont icon-notice_people"></i>
                </zt-form-item>
                <!-- 释放行为 -->
                <zt-form-item label="释放行为">
                    <el-checkbox v-model="formData.autoDelSnapshot">快照随磁盘释放</el-checkbox>
                </zt-form-item>
            </zt-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">执行挂载</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {getDiskList, mountDisk} from '@/service/ecs/disk/disk.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,

            rowItem: {},
            title: '',
            disks: [],
            formData: {
                autoDelSnapshot: false,
                disk_id: ''
            }
        };
    },
    props: {},
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.title = '挂载云盘';
            this.isShow = true;

            this.getDiskAll();

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.rowItem = {};
            this.title = '';
            this.disks = [];
            this.formData = {
                autoDelSnapshot: false,
                disk_id: ''
            };
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
        confirm() {
            let data = {
                disk_id: this.formData.diskId,
                instanceId: this.rowItem.id,
                autoDelSnapshot: this.formData.autoDelSnapshot
                //imageRef: '',
            };
            //挂载云盘
            mountDisk(data)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        this.resolve(res);
                        this.hide();
                        //this.setting();
                    } else {
                    }
                })
                .catch(err => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },

        //查询目标磁盘(可以挂载的)
        getDiskAll() {
            let params = {
                diskStatus: 'available'
            };
            getDiskList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    console.log('getDiskList', res);
                    let resData = res.result;
                    if (resData && resData.records) {
                        this.disks = resData.records || [];
                    }
                }
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
