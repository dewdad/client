<template>
<el-dialog title="告警设置" :visible.sync="isShow" class="lock-ip-dialog">
    <zt-form size="small">
        <zt-form-item label="通知项目" label-width="130px">
                {{data.name}}
        </zt-form-item>
        <zt-form-item label="通知方式" label-width="130px" >
            <el-checkbox v-model="data.email_send" true-label="1" false-label="0">邮件</el-checkbox>
            <el-checkbox v-model="data.sms_send" true-label="1" false-label="0">短信</el-checkbox>
        </zt-form-item>
        <zt-form-item label="通知时间" label-width="130px">
                <el-radio-group v-model="data.send_time">
                    <el-radio label="1">每周一</el-radio>
                    <el-radio label="2">任何时间</el-radio>
                    <el-radio label="3">仅8:00-20:00（仅工作时间，不含周末）</el-radio>
                </el-radio-group>
        </zt-form-item>
    </zt-form>
    <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="hide">取 消</el-button>
        </span>
</el-dialog>
</template>

<script>
import {setWarningConfig} from '@/service/security';

export default {
    data() {
        return {
            isShow: false,
            data: {
                name: '登录安全',
                email_send: '1',
                sms_send: '1',
                send_time: '1'
            }
        };
    },
    methods: {
        confirm() {
            let params = Object.assign({}, this.data);
            if (this.data.sms_send === '1' || this.data.email_send === '1') {
                params.send_way = [];
                if (this.data.sms_send === '1') {
                    params.send_way.push('sms');
                }
                if (this.data.email_send === '1') {
                    params.send_way.push('email');
                }
            }
            setWarningConfig(params)
                .then(ret => {
                    if (ret) {
                        this.resolve(ret);
                    }
                })
                .finally(() => {
                    this.hide();
                });
        },
        show(data) {
            $log('edit', data);
            return new Promise((resolve, reject) => {
                this.data = data;
                this.isShow = true;
                this.resolve = resolve;
                this.reject = reject;
            });
        },
        hide() {
            this.resolve('cancel');
            this.isShow = false;
            this.data = {
                name: '登录安全',
                email_send: '1',
                sms_send: '1',
                send_time: '1'
            };
        }
    }
};
</script>

<style>
</style>
