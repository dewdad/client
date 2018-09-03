<template>
<el-dialog :visible.sync="isShow" v-loading="loading" loading="empty">
    <div slot="title">{{title}}
        <router-link to="#" class="ml10">创建说明 <i class=" font12 iconfont icon-ecport_people"></i></router-link>
    </div>
    <div class="pr130">
        <zt-form size="small" :model="data" :rules="rules" ref="form" label-width="140px" :inline-message="true">
            <zt-form-item label="专有网络名称" prop="name">
                <el-input v-model="data.name"></el-input>
                <span class="input-help">只能由中文、英文字母、数字、下划线、中划线组成，长度小于48个字符。</span>
            </zt-form-item>
            <zt-form-item label="区域" v-if="type === 'create'">
                <region-select v-model="data.zone"></region-select>
            </zt-form-item>
            <zt-form-item label="描述">
                <el-input v-model="data.remark"></el-input>
                <span class="input-help">描述长度为2-64个字符，不能以http://和https://开头。</span>
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
import {createNetwork, updateNetwork} from '@/service/ecs/network.js';

export default {
    components: {RegionSelect},
    data() {
        return {
            isShow: false,
            loading: false,
            type: 'create',
            data: {
                name: '默认专有网络',
                zone: '',
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
        title() {
            return this.type === 'create' ? '创建专有网络' : '编辑专有网络';
        }
    },
    methods: {
        clear() {
            this.data.name = '默认专有网络';
            this.data.remark = '';
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
        },
        hide() {
            this.isShow = false;
            this.reject('calcel');
        },
        show({type = 'create', ...data} = {}) {
            this.isShow = true;
            this.type = type;
            this.row = data;
            if (type === 'update') {
                this.data.name = data.name;
                this.data.remark = data.remark;
            } else {
                this.clear();
            }
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        },
        createNetwork() {
            this.loading = true;
            createNetwork(this.data)
                .then(ret => {
                    if (ret) {
                        this.resolve(ret);
                    }
                })
                .catch(error => {
                    console.warn('创建VPC', error.message);
                })
                .finally(() => {
                    this.hide();
                    this.loading = false;
                });
        },
        updateNetwork() {
            let params = Object.assign({}, this.data);
            params.vpcId = this.row.id;
            this.loading = true;
            updateNetwork(params)
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
                    if (this.type === 'create') {
                        this.createNetwork();
                    } else if (this.type === 'update') {
                        this.updateNetwork();
                    }
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
