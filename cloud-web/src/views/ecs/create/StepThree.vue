<template>
    <div class="create-form">
        <!-- 所选配置 start -->
        <el-card v-if="created" class="box-card create-form-item create-form-item__name" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-head_console_people"></zt-icon>
                    {{$t('ecs.create.selectConfig')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <div class="config-item">
                    <div>{{$t('ecs.create.basicConfig')}}
                        <zt-icon icon="color-primary font12 icon-edit_people1 ml5" @click.native="changStep(0)"></zt-icon>
                    </div>
                </div>
                <el-row class="mt5">
                    <el-col :span="8">
                        <span>{{$t('common.instName')}}：</span>{{get(createEcsFormData,'instance.instname')}}</el-col>
                    <el-col :span="8">
                        <span>{{$t('common.instSpec')}}：</span>{{get(createEcsFormData,'flavorObj.types')}} {{get(createEcsFormData,'flavorObj.vCpu')}} {{$t('abbr.vcpu')}} {{get(createEcsFormData, 'flavorObj.ram')}}{{$t('abbr.gb')}}内存</el-col>
                    <el-col :span="8">
                        <span>{{$t('common.applyNumber')}}：</span>{{get(createEcsFormData, 'applyNumber')}}</el-col>
                    <el-col :span="8">
                        <span>{{$t('ecs.image.list.publicImage')}}：</span>{{get(createEcsFormData,'mirror.osType.name')}} {{get(createEcsFormData,'mirror.imageObj.name')}}</el-col>
                    <el-col :span="8">
                        <span>{{$t('common.sysDisk')}}：</span>{{get(createEcsFormData,'storage.sysDisk.type.label')}} {{get(createEcsFormData,'storage.sysDisk.size')}}{{$t('abbr.gb')}}</el-col>
                    <el-col :span="8">
                        <span>{{$t('common.dataDisk')}}：</span>
                        <el-popover placement="top" title="" :disabled="createEcsFormData.storage.dataDisk.length === 0" trigger="hover">
                            <div class="font12">
                                <template v-for="disk in createEcsFormData.storage.dataDisk">
                                    <template v-for="d in disk.diskNum">
                                        <span :key="d">{{disk.diskPerformance.label}} {{disk.diskSize}}{{$t('abbr.gb')}}<br /></span>
                                    </template>
                                </template>
                            </div>
                            <span class="color333" slot="reference">{{dataDiskNumber}}块</span>
                        </el-popover>
                    </el-col>
                    <el-col :span="8">
                        <span>登录凭证：</span>{{loginType}}</el-col>
                    <el-col :span="8" v-if="get(createEcsFormData,'keyPair.loginType') === '1'">
                        <span>{{$t('common.keypair')}}：</span>{{get(createEcsFormData,'keyPair.keyname')}}</el-col>
                </el-row>
                <div class="config-item mt10">
                    <div>{{$t('ecs.create.netAndSafe')}}
                        <zt-icon icon="color-primary font12 icon-edit_people1 ml5" @click.native="changStep(1)"></zt-icon>
                    </div>
                </div>
                <el-row class="mt5">
                    <el-col :span="8">
                        <span>{{$t('common.net')}}：</span>{{$t('common.privateNet')}}</el-col>
                    <!-- <el-col :span="8">
                        <span>{{$t('common.privateNet')}}：</span>{{get(createEcsFormData,'netWorkInfo.netWork.name')}}</el-col> -->
                    <!-- <el-col :span="8" v-if="get(createEcsFormData, 'broadBand.checked') && get(createEcsFormData,'broadBand.type') === 'isReady'">
                        <span>{{$t('common.publicNetworkIP')}}：</span>{{get(createEcsFormData,'broadBand.ipAdd.ipAdd')}} / {{get(createEcsFormData,'broadBand.ipAdd.name')}}</el-col>
                    <el-col :span="8" v-if="get(createEcsFormData, 'broadBand.checked') && get(createEcsFormData,'broadBand.type') === 'newCreate'">
                        <span>{{$t('common.publicNet')}}：</span>分配公网IP地址 / BGP(多线)</el-col> -->
                    <el-col :span="8">
                        <span>{{$t('common.subnet')}}：</span>{{get(createEcsFormData,'netWorkInfo.subNet.name')}}</el-col>
                    <el-col :span="8">
                        <span>{{$t('common.securityGroup')}}：</span>{{get(createEcsFormData.securityGroup, 'currentSecurityGroup.name')||'默认安全组'}}</el-col>
                </el-row>
            </div>
        </el-card>
        <!-- 所选配置 end -->
        <!-- 服务协议 start -->
        <!-- <el-card class="box-card create-form-item create-form-item__name" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-chuangjianyunzhuji-fuwutiaokuan"></zt-icon>
                    {{$t('ecs.create.serviceAgreement')}}
                </label>
            </div>
            <div :class="{'create-form-item__content':true, 'is-error':isError}">
                <el-checkbox v-model="argee">
                    <span :class="{'color-primary': !isError}">《证通云服务条款》</span>
                </el-checkbox>
            </div>
        </el-card> -->
        <!-- 服务协议 end -->
    </div>
</template>
<script>
import {mapState} from 'vuex';
import {isEmpty} from '@/utils/utils';
export default {
    name: 'StepThree',
    data() {
        return {
            argee: false,
            created: false,
            isError: false
        };
    },
    props: {
        active: {
            type: Number,
            default: 0
        }
    },
    watch: {
        active: function(newval) {
            if (newval === 2) {
                this.created = true;
            }
        },
        argee: function() {
            this.isError = false;
        }
    },
    computed: {
        ...mapState({
            createEcsFormData: state => state.createEcsFormData
        }),
        dataDiskNumber() {
            let total = 0;
            let dataDisk = this.createEcsFormData.storage.dataDisk;
            if (isEmpty(dataDisk)) return 0;
            for (let disk of dataDisk) {
                total += disk.diskNum * 1;
            }
            return total;
        },
        loginType() {
            return this.createEcsFormData.keyPair.loginType === '1' ? '密钥对' : '密码';
        },
        ports() {
            let arr = [];
            if (!isEmpty(this.createEcsFormData.securityGroup.currentSecurityGroup)) {
                let rules = this.createEcsFormData.securityGroup.ruleList;
                for (let rule of rules) {
                    arr.push(rule.port);
                }
            } else {
                let ports = [];
                if (this.createEcsFormData.securityGroup.setType === '1') {
                    ports = this.createEcsFormData.securityGroup.labelList;
                } else {
                    ports = this.createEcsFormData.securityGroup.ports;
                    let custom_port = this.createEcsFormData.securityGroup.custom_port ? this.createEcsFormData.securityGroup.custom_port.split(',') : [];
                    let custom_udp = this.createEcsFormData.securityGroup.custom_udp ? this.createEcsFormData.securityGroup.custom_udp.split(',') : [];
                    ports = ports.concat(custom_port, custom_udp);
                }
                for (let port of ports) {
                    arr.push(port.replace(',', '、'));
                }
            }
            arr.sort((a, b) => a - b);
            // 去重显示
            var r = arr.filter(function(element, index, self) {
                return self.indexOf(element) === index;
            });
            if (r.length > 1) r = r.filter(item => item !== '全部');
            return r.join('、');
        },
        zone: function() {
            let string = this.createEcsFormData.netWorkInfo.subNet && this.createEcsFormData.netWorkInfo.subNet.name;
            let zone = this.$options.filters.zone(string);
            return zone;
        }
    },
    methods: {
        changStep(active) {
            this.$parent.active = active;
        }
    }
};
</script>
<style scoped  lang="scss">
.el-col {
    font-size: 12px;
    line-height: 22px;
    span {
        color: #999;
    }
}
.el-form-item .el-form-item__content {
    line-height: 1;
}
</style>
