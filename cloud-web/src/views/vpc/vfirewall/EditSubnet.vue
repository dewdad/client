<template>
<el-dialog :visible.sync="isShow" v-loading="loading" loading="empty">
    <div slot="title">编辑专有网络</div>
    <div class="pr130">
        <zt-form size="small" :model="data" :rules="rules" ref="form" label-width="140px" :inline-message="true">
            <zt-form-item label="子网名称" prop="name">
                <el-input v-model="data.name"></el-input>
                <span slot="help" class="input-help">只能由中文、英文字母、数字、下划线、中划线组成，长度小于48个字符。</span>
            </zt-form-item>
            <zt-form-item label="描述">
                <el-input v-model="data.remark"></el-input>
                <span slot="help" class="input-help">描述长度为2-64个字符，不能以http://和https://开头。</span>
            </zt-form-item>
        </zt-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="font12" @click="confirm" :loading="loading">确 定</el-button>
        <el-button type="info" class="font12" @click="hide">取 消</el-button>
    </span>
</el-dialog>
</template>

<script>
import RegionSelect from '@/components/form/RegionSelect.vue';
import {updateSubnet} from '@/service/ecs/network.js';

export default {
    components: {RegionSelect},
    data() {
        return {
            isShow: false,
            loading: false,
            row: {},
            type: 'create',
            data: {
                name: '',
                remark: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入专有网络名称',
                        trigger: 'blur'
                    }
                ]
            },
            resolve: () => {},
            reject: () => {}
        };
    },
    computed: {
    },
    methods: {
        clear() {
            this.data.name = '';
            this.data.remark = '';
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
        },
        hide() {
            this.isShow = false;
            this.reject('calcel');
        },
        show(data) {
            $log('show', data);
            this.isShow = true;
            this.clear();
            this.row = data;
            this.data.name = data.name;
            this.data.remark = data.remark;
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        },
        updateSubnet() {
            let params = Object.assign({}, this.data);
            params.id = this.row.id;
            this.loading = true;
            updateSubnet(params)
                .then(ret => {
                    if (ret) {
                        this.resolve(ret);
                    }
                })
                .catch(error => {
                    console.warn('更新VPC', error.message);
                })
                .finally(() => {
                    this.loading = false;
                    this.hide();
                });
        },
        confirm() {
            let form = this.$refs.form;
            if (!this.$refs.form) return false;

            // 表单验证
            form.validate(valid => {
                if (valid) {
                    this.updateSubnet();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style>
</style>
