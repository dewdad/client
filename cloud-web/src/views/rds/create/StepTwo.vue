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
                <!-- <div>
                    <el-radio-group v-model="form.netWorkType" size="small">
                        <el-radio-button label="1">专有网络</el-radio-button>
                    </el-radio-group>
                    <el-popover placement="bottom" title="" width="340" trigger="hover">
                        <div>
                            <span class="is-bold">网络类型</span><br> 指ECS实例的网络管理及使用模式，与运营商公网接入网络质量无关，任何网络类型的运营商接入均为 BGP 线路，请您放心使用，并根据自己需要进行选择。
                        </div>
                        <span class="tips-help" slot="reference">
                            <zt-icon icon="icon-iconfontwenhao1"></zt-icon>
                        </span>
                    </el-popover>
                </div> -->
                <div class="mt10">
                    <select-subnet v-if="created" v-model="form.netWorkInfo" @loading="checkNetLoading" ref="selectSubnet"></select-subnet>
                   
                    <!-- <div class="network-info">
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
                    </div> -->
                </div>
            </div>
        </el-card>
        <!-- 网络 end -->
       <!-- 访问端口 strat -->
        <el-card class="box-card create-form-item" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-cunchu"></zt-icon>
                    访问端口
                </label>
            </div>
            <div class="create-form-item__content">
                <zt-form ref="portForm" :show-message="false" inline-message size="small" :model="form"  label-width="0" style="width:300px;">
                    <zt-form-item  label="" class="hide-star" prop="port" >
                        <el-input  v-model="form.port" placeholder="请输入访问端口" maxlength="64" :clearable="true"></el-input>
                        <!-- <span class="input-help text-nowrap">{{$t('ecs.create.instname.tips')}}</span> -->
                    </zt-form-item>
                </zt-form>
            </div>
        </el-card>
        <!-- 访问端口 end -->
        <!-- 访问凭证 strat -->
        <el-card class="box-card create-form-item" shadow="hover" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-miyuedui"></zt-icon>
                    访问凭证
                </label>
            </div>
            <div class="create-form-item__content">
                <key-pair ref="keypair" v-model="form.keyPair"  ></key-pair>
            </div>
        </el-card>
        <!-- 访问凭证 end -->
    </div>
</template>
<script>
import KeyPair from './components/KeyPair';
import SecurityGroup from './components/SecurityGroup';
import SelectSubnet from './components/SelectSubnet';
import {showErrAlert, scrollTo, isEmpty} from '@/utils/utils';
import {mapState} from 'vuex';
export default {
    name: 'StepTwo',
    data() {
        return {
            netLoading: false,
            keyLoading: false,
            created: false,
            firstValid: true,
            form: {
                netWorkType: '1',
                netWorkInfo: {},
                broadBand: {},
                port: '3306',
                keyPair: {}
            },
            errorField: ''
        };
    },
    components: {
        KeyPair,
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
            createRdsFormData: state => state.createRdsFormData
        }),
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
                        return resolve();
                        // 验证公网带宽
                        // this.validSecurityGroup(resolve, reject);
                    } else {
                        return resolve();
                        // this.showError(field);
                    }
                    // this.firstValid = false;
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
            if (isEmpty(this.$refs.securityGroup.form.currentSecurityGroup)) {
                showErrAlert('请选择安全组', () => {
                    scrollTo('#select-security', {
                        offset: -200
                    });
                    // if (refs) refs[keys[0]].focus();
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
