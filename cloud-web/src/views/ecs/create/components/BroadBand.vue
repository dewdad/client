<template>
    <div>
        <div>
            <el-checkbox v-model="brand.checked">分配公网IP地址</el-checkbox>
            <span class="color999 font12" style="margin-left:70px;">系统会分配公网IP，也可采用更加灵活的弹性公网IP方案，配置并
                <a class="font12">绑定弹性公网 IP 地址</a>
            </span>
        </div>
        <template v-if="brand.checked">
            <div class="mt10">
                <el-radio-group v-model="brand.type" size="small">
                    <el-radio-button v-model="brand.type" label="newCreate" border>新建</el-radio-button>
                    <el-radio-button v-model="brand.type" label="isReady" border>使用已有</el-radio-button>
                </el-radio-group>
            </div>
            <template v-if="brand.type === 'isReady'">
                <div class="mt10">
                    <zt-form ref="floatIpForm" :inline="true" :show-message="false" inline-message size="small" :model="brand" :rules="rules" label-width="0">
                        <zt-form-item id="ipAdd" label="" class="mb0 hide-star" prop="ipAdd">
                            <el-select v-model="brand.ipAdd" placeholder="请选择公网IP" size="small" popper-class="el-popper--small" value-key="id" style="width:300px;" class="mr10">
                                <el-option v-for="ip in floatIpList" :key="ip.id" :label="ip.ipAdd" :value="ip">
                                    {{ip.ipAdd}}
                                </el-option>
                            </el-select>
                            <i class="el-icon-refresh" @click="getUnbindPublicIP"></i>
                        </zt-form-item>
                    </zt-form>
                </div>
                <div class="mt5"><router-link :to="{name: 'app.ip.creatflexip'}" target="_blank" class="font12">弹性公网IP创建></router-link></div>
            </template>
        </template>
    </div>
</template>
<script>
import {getUnbindPublicIP} from '@/service/ecs/floating';
import {isEmpty} from '@/utils/utils';
export default {
    name: 'BroadBand',
    data() {
        return {
            loading: false,
            brand: {
                checked: false,
                type: 'newCreate',
                ipAdd: ''
            },
            floatIpList: [],
            rules: {
                ipAdd: [
                    {
                        required: true,
                        message: '请选择公网IP',
                        trigger: ['submit', 'change']
                    }
                ]
            }
        };
    },
    props: {
        value: Object
    },
    watch: {
        'brand.type': function(newval) {
            if (newval === 'isReady' && isEmpty(this.floatIpList)) {
                this.getUnbindPublicIP();
            }
        },
        brand: {
            deep: true,
            handler: function(newval) {
                this.$emit('input', newval);
            }
        },
        loading: function(newval) {
            this.$emit('loading', newval);
        }
    },
    created() {
        this.$emit('input', this.brand);
    },
    methods: {
        getUnbindPublicIP: function() {
            this.loading = true;
            getUnbindPublicIP()
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.floatIpList = res.result.records;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style scoped>
</style>
