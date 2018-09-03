<template>
    <div v-if="isShow">
        <el-dialog title="修改磁盘属性" :visible.sync="isShow" width="45%" class="ModifyDiskPropDialog">
            <zt-form inline-message class="demo-ruleForm" label-width="100px" size="small">
                <!-- 当前磁盘 -->
                <zt-form-item label="当前磁盘">
                    <span>{{rowItem.id}}</span>
                </zt-form-item>
                <!-- 所属实例 -->
                <zt-form-item label="所属实例">
                    <span>{{rowItem.instanceId || '未设置'}} / {{rowItem.instanceName || '未设置'}}</span>
                </zt-form-item>
                <!-- 设备名 -->
                <zt-form-item label="设备名">
                    <span>{{rowItem.mount||'-'}}</span>
                </zt-form-item>
                <!-- 磁盘种类 -->
                <zt-form-item label="磁盘种类">
                    <span v-if="rowItem.type=='SATA'">高效云盘</span>
                    <span v-if="rowItem.type=='SSD'">SSD云盘</span>
                </zt-form-item>
                <!-- 释放行为 -->
                <zt-form-item label="释放行为">
                    <el-checkbox v-model="rowItem.autoDelSnapshot">快照随磁盘释放</el-checkbox>
                    <el-tooltip class="item ml10" effect="light" transition="scale-in" content="如果选择快照随磁盘释放,在磁盘释放的时候系统会自动将对应的快照删除" placement="top">
                        <i class="iconfont icon-wenhao"></i>
                    </el-tooltip>
                </zt-form-item>
            </zt-form>
            <span slot="footer" class="dialog-footer">               
                <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
                <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
            </span>
        </el-dialog>

    </div>

</template>
<script>
import {updateDisk} from '@/service/ecs/disk/disk.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            checked: '',
            rowItem: {}
        };
    },
    props: {},
    methods: {
        show(rowItem) {
            let {id, instanceId, instanceName, mount, type, autoDelSnapshot = false} = rowItem;
            this.rowItem = {id, instanceId, instanceName, mount, type, autoDelSnapshot:!!autoDelSnapshot};
            this.isShow = true;

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
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            //表单校验

            //提交后台
            updateDisk(this.rowItem)
                .then(res => {
                    this.hide();
                    //this.setting();
                    this.resolve(this.rowItem);
                    this.$message.success('操作成功');
                })
                .catch(err => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.ModifyDiskPropDialog {
    .demo-ruleForm{
        width: 80%;
        margin-left: 20px;
    }
}
</style>
