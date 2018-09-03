<template>
<el-dialog title="忽略漏洞" :visible.sync="isShow">
    <zt-form :model="form" size="small">
        <p>您选择了1个漏洞</p>
        <p>忽略后，将不再给当前影响的资产提示该漏洞，但漏洞记录仍可见，如需取消忽略可到对应漏洞详情页操作。</p>
        <zt-form-item>
            <el-input type="textarea" :rows="5" v-model="form.op_note" placeholder="您可以填写本次操作说明备注，便于后续查看"></el-input>
        </zt-form-item>
        <p>是否确认继续？</p>
    </zt-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">确 定</el-button>
    </div>
</el-dialog>
</template>

<script>
import {leakManageIgnore} from '@/service/security';

export default {
    data() {
        return {
            data: {},
            isShow: false,
            rules: {
                op_note: [
                    {
                        required: true,
                        message: '填写本次操作说明备注',
                        trigger: 'blur'
                    }
                ]
            },
            form: {
                op_note: ''
            },
            resolve: null,
            reject: null
        };
    },
    computed: {
        serverId() {
            return this.$route.params.serverID;
        }
    },
    methods: {
        show(data) {
            console.log(data);
            this.data = data;
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.form = {
                op_note: ''
            };
        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        async leakManageIgnore() {
            try {
                let server_info = this.data.server_info[0] || this.data.server_info;
                let ret = await leakManageIgnore({
                    server_id: server_info['mac_address'],
                    cve_no: this.data.cve_no,
                    op_note: this.form.op_note
                });
                console.log('leakManageIgnore', ret);
                this.hide();
                this.resolve(ret);
            } catch (error) {
                console.warn('leakManageIgnore Error', error.message);
                this.hide();
                this.reject(error);
            }
        },
        confirm() {
            this.leakManageIgnore();
            // this.hide();
        }
    }
};
</script>

<style lang="scss">
</style>
