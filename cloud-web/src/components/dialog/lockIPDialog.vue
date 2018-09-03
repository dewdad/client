<template>
<span>
    <el-button @click="show" type="text" :disabled="data.status === '1'">封停</el-button>
    <el-dialog
        title="封停"
        :visible.sync="isShow"
        class="lock-ip-dialog">
        <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="封停时间：">
                    <el-select clearable v-model="time" value-key="field">
                        <el-option  label="15分钟" :value="15 * 60"></el-option>
                        <el-option  label="1小时" :value="60 * 60"></el-option>
                        <el-option  label="1天" :value="24* 60 * 60"></el-option>
                        <el-option  label="永久" :value="undefined"></el-option>
                    </el-select>
                </zt-form-item>
            </zt-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</span>
</template>
<script>
import {abnLoginLockIP} from '@/service/security';
export default {
    props: {
        data: Object
    },
    data() {
        return {
            type: 'abnLogin',
            isShow: false,
            resolve: null,
            reject: null,
            time: undefined
        };
    },
    methods: {
        show(name) {
            $log('lockIPDialog', this.data);
            this.isShow = true;
            this.time = undefined;
            if (name) this.input = name;
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
        lockIP() {
            let adepter = abnLoginLockIP;
            let params = {
                server_id: this.data.server_info.mac_address,
                src_ip: this.data.src_ip,
                ban_time_span: this.time
            };
            $log('lockIP -> ', params);
            return adepter(params);
        },
        async confirm() {
            let ret = await this.lockIP();
            if (ret) {
                this.$message.success('操作成功');
                setTimeout(() => {
                    this.$emit('success');
                }, 1000);
            }
            this.hide();
            $log('封停结果', ret);
        }
    }
};
</script>
