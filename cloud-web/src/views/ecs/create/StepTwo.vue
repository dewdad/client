<template>
    <div class="create-form">
        <!-- 网络 start -->
        <el-card class="box-card create-form-item" shadow="hover" v-loading="netLoading" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-wangluo"></zt-icon>
                    {{$t('common.net')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <div>
                    <el-radio-group v-model="form.netWorkType" size="small">
                        <el-radio-button label="1">{{$t('common.privateNet')}}</el-radio-button>
                    </el-radio-group>
                    <el-popover placement="bottom" title="" width="340" trigger="hover">
                        <div>
                            <span class="is-bold">网络类型</span><br> 指ECS实例的网络管理及使用模式，与运营商公网接入网络质量无关，任何网络类型的运营商接入均为 BGP 线路，请您放心使用，并根据自己需要进行选择。
                        </div>
                        <span class="tips-help" slot="reference">
                            <zt-icon icon="icon-iconfontwenhao1"></zt-icon>
                        </span>
                    </el-popover>
                </div>
                <div class="mt10">
                    <select-subnet v-if="created" v-model="form.netWorkInfo" @loading="checkNetLoading" ref="selectSubnet"></select-subnet>
                    <span class="input-help pt0">如需使用其他私有网络，请选择已有私有网络或
                        <router-link :to="{name: 'app.vpc.pn'}" target="_blank">前往控制台创建></router-link>
                    </span>
                    <div class="network-info">
                        <el-row>
                            <el-col :span="10">
                                <label>所选私有网络：</label>{{get(form.netWorkInfo, 'netWork.id')}}/{{get(form.netWorkInfo, 'netWork.name')}} </el-col>
                            <el-col :span="6">
                                <label>子网：</label>{{get(form.netWorkInfo, 'subNet.id')}}/{{get(form.netWorkInfo, 'subNet.name')}} </el-col>
                            <el-col :span="8">
                                <label>所选子网所在可用区：</label>{{zone}}</el-col>
                            <el-col :span="8">
                                <label>子网网段：</label>{{get(form.netWorkInfo, 'subNet.subnet')}}</el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </el-card>
        <!-- 网络 end -->
        <!-- 公网带宽 strat -->
        <el-card class="box-card create-form-item" shadow="hover" v-loading="bandLoading" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-gongwangkuandai"></zt-icon>
                    {{$t('common.publicNet')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <broad-band ref="broadBand" v-if="created" v-model="form.broadBand" @loading="checkBandLoading"></broad-band>
            </div>
        </el-card>
        <!-- 公网带宽 end -->
        <!-- 安全组 strat -->
        <el-card class="box-card create-form-item" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-chuangjianyunzhuji-anquanzu"></zt-icon>
                    {{$t('common.securityGroup')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <security-group ref="securityGroup" v-if="created" v-model="form.securityGroup" osType="osType"></security-group>
            </div>
        </el-card>
        <!-- 安全组 end -->
    </div>
</template>
<script>
import BroadBand from './components/BroadBand';
import SecurityGroup from './components/SecurityGroup';
import SelectSubnet from './components/SelectSubnet';
import {showErrAlert, scrollTo, isEmpty} from '@/utils/utils';
import {mapState} from 'vuex';
export default {
    name: 'StepTwo',
    data() {
        return {
            netLoading: false,
            bandLoading: false,
            created: false,
            firstValid: true,
            form: {
                netWorkType: '1',
                netWorkInfo: {},
                broadBand: {},
                securityGroup: {}
            },
            errorField: ''
        };
    },
    components: {
        BroadBand,
        SecurityGroup,
        SelectSubnet
    },
    props: {
        active: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapState({
            createEcsFormData: state => state.createEcsFormData
        }),
        osType() {
            try {
                return this.createEcsFormData.mirror.osType.platformName.toLowerCase();
            } catch (err) {
                return '';
            }
        },
        zone: function() {
            let string = this.form.netWorkInfo.subNet && this.form.netWorkInfo.subNet.name;
            let zone = this.$options.filters.zone(string);
            return zone;
        }
    },
    watch: {
        active: function(newval) {
            if (newval === 1) {
                this.created = true;
            }
        },
        form: {
            deep: true,
            handler: function(newval) {
                this.$emit('input', newval);
            }
        }
    },
    methods: {
        checkNetLoading(val) {
            this.netLoading = val;
        },
        checkBandLoading(val) {
            this.bandLoading = val;
        },
        validate() {
            return new Promise((resolve, reject) => {
                this.$refs.selectSubnet.$refs.subNetForm.validate((valid, field) => {
                    if (valid) {
                        // return resolve();
                        // 验证公网带宽
                        this.validBand(resolve, reject);
                    } else {
                        this.showError(field);
                    }
                    this.firstValid = false;
                });
            });
        },
        // 验证公网带宽
        validBand(resolve, reject) {
            if (this.$refs.broadBand.brand.type === 'isReady') {
                this.$refs.broadBand.$refs.floatIpForm.validate((valid, field) => {
                    if (valid) {
                        return this.validSecurityGroup(resolve, reject);
                    } else {
                        this.showError(field);
                    }
                });
            } else {
                return this.validSecurityGroup(resolve, reject);
            }
        },
        // 验证安全组
        validSecurityGroup(resolve, reject) {
            if (isEmpty(this.$refs.securityGroup.form.currentSecurityGroup) && this.$refs.securityGroup.form.setType === '2') {
                this.$refs.securityGroup.$refs.customForm.validate((valid, field) => {
                    if (valid) {
                        return resolve();
                    } else {
                        this.showError(field);
                    }
                });
            } else {
                return resolve();
            }
        },
        /**
         * 显示错误信息并滚动到指定元素
         */
        showError(field, refs) {
            let keys = Object.keys(field);
            let offset = -200; // 偏移量
            if (keys[0] === this.errorField) {
                // 如果不是第一次验证 弹框显示错误信息
                showErrAlert(field[keys[0]][0]['message'], () => {
                    scrollTo('#' + keys[0], {
                        offset
                    });
                    // if (refs) refs[keys[0]].focus();
                });
                this.errorField = '';
            } else {
                this.errorField = keys[0];
                scrollTo('#' + keys[0], {
                    offset
                });
                // if (refs) refs[keys[0]].focus();
            }
        }
    }
};
</script>
<style scoped lang="scss">
.el-select {
    width: 170px !important;
}
.pt0 {
    padding-top: 0px;
}
.network-info {
    margin-top: 10px;
    padding: 11px 30px;
    background: #eceff8;
    font-size: 12px;
    line-height: 22px;
    label {
        color: #999;
        font-weight: normal;
    }
}
</style>
