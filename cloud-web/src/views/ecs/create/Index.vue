<template>
    <div class="inst-create create-ecs">
        <el-steps id="el-steps" :active='active' class="font12">
            <el-step title='基础配置'>
                <div slot="icon" class="finger-cursor el-step__icon-inner" @click="upateActive(0)">1</div>
                <span slot="title" class="finger-cursor" @click="upateActive(0)">{{$t('ecs.create.stepOne')}}</span>
            </el-step>
            <el-step title=''>
                <div slot="icon" class="finger-cursor el-step__icon-inner" @click="upateActive(1)">2</div>
                <span slot="title" class="finger-cursor" @click="upateActive(1)">{{$t('ecs.create.stepTwo')}}</span>
            </el-step>
            <el-step title='确认规格'>
                <div slot="icon" class="finger-cursor el-step__icon-inner" @click="upateActive(2)">3</div>
                <span slot="title" class="finger-cursor" @click="upateActive(2)">{{$t('ecs.create.stepThree')}}</span>
            </el-step>
        </el-steps>
        <!-- 基础配置 -->
        <step-one ref="stepone" v-model="dataOne" v-show="active===0"></step-one>
        <!-- 网络配置 -->
        <step-two ref="steptwo" v-model="dataTwo" v-show="active===1" :active="active"></step-two>
        <!-- 确认规格 -->
        <step-three ref="stepthree" v-show="active===2" :active="active"></step-three>
        <!-- 按钮区 -->
        <div class="create-footer">
            <!-- <span class="pull-left color999">公网带宽：52Mbps 按固定带宽</span>  -->
            <el-button v-if="active===0" key="1" type="warning" @click="next(1)">{{$t('ecs.create.next')}}</el-button>
            <el-button v-if="active===1" key="2" type="warning" @click="active = 0" plain>{{$t('ecs.create.pre')}}</el-button>
            <el-button v-if="active===0" key="3" type="info" @click="upateActive(2)">{{$t('ecs.create.stepThree')}}</el-button>
            <el-button v-if="active===1" key="4" type="warning" @click="next(2)">{{$t('ecs.create.stepThree')}}</el-button>
            <el-button v-if="active===2" key="5" type="warning" @click="active = 1" :disabled="creating" plain>{{$t('ecs.create.preNet')}}</el-button>
            <el-button v-if="active===2" key="6" type="warning" :plain="creating" @click="createInst" :loading="creating">{{creating ? '正在为您创建...' : '立即创建'}}</el-button>
        </div>
    </div>
</template>
<script>
import {addClass, removeClass} from '@/utils/utils';
import {createECS} from '@/service/ecs/list';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import {mapState} from 'vuex';
export default {
    name: 'Create',
    data() {
        return {
            active: 0,
            dataOne: {
                mirror: {
                    osType: ''
                }
            },
            dataTwo: {},
            creating: false
        };
    },
    components: {
        StepOne,
        StepTwo,
        StepThree
    },
    watch: {
        // 步骤条切换时滚动条置顶部
        active: function(newval) {
            window.scrollTo(0, 0);
        },
        dataOne: {
            deep: true,
            handler: function(newval) {
                this.setValue();
            }
        },
        dataTwo: {
            deep: true,
            handler: function(newval) {
                this.setValue();
            }
        }
    },
    computed: {
        ...mapState({
            createEcsFormData: state => state.createEcsFormData
        }),
        dataDiskList() {
            let dataDiskList = this.createEcsFormData.storage.dataDisk;
            let arr = [];
            for (let disk of dataDiskList) {
                let obj = {
                    diskPerformance: disk.diskPerformance.value,
                    diskSize: disk.diskSize,
                    diskNum: disk.diskNum
                };
                arr.push(obj);
            }
            return arr;
        }
    },
    methods: {
        next(step) {
            if (step === 1) {
                this.validStepOne()
                    .then(res => {
                        this.active = step;
                    })
                    .catch(err => {
                        $log(err);
                    });
            }
            if (step === 2) {
                this.validStepTwo().then(res => {
                    this.active = step;
                });
            }
            // 测试用
            // this.active = step;
        },
        /**
         * 验证基础配置组件数据是否填写完整
         */
        validStepOne() {
            return new Promise((reslove, reject) => {
                this.$refs.stepone
                    .validate()
                    .then(res => {
                        reslove(true);
                    })
                    .catch(err => {
                        $log(err);
                    });
            });
        },
        /**
         * 验证网络和安全组数据是否填写完整
         */
        validStepTwo() {
            return new Promise((reslove, reject) => {
                this.$refs.steptwo
                    .validate()
                    .then(res => {
                        reslove(true);
                    })
                    .catch(err => {
                        this.active = 1;
                        $log(err);
                    });
            });
        },
        async upateActive(active) {
            if (this.creating) return;
            await this.validStepOne();
            await this.validStepTwo();
            this.active = active;
        },
        createInst() {
            this.doCreate();
        },
        setValue() {
            let formData = Object.assign({}, this.dataOne, this.dataTwo);
            this.$store.commit('SET_CREATE_ECS_FORM_DATA', formData);
        },
        doCreate() {
            if (this.creating) return;
            // 请求体
            let body = {
                server: {
                    flavorRef: this.createEcsFormData.flavorObj.id,
                    name: this.createEcsFormData.instance.instname,
                    adminPass: this.createEcsFormData.mirror.osType.toLowerCase().includes('windows') ? '' : this.createEcsFormData.keyPair.password1,
                    circle: '1_month',
                    block_device_mapping_v2: [
                        {
                            source_type: 'image',
                            destination_type: 'volume',
                            uuid: this.createEcsFormData.mirror.imageObj.id,
                            delete_on_termination: 'False',
                            boot_index: '0',
                            volume_type: this.createEcsFormData.storage.sysDisk.type.value,
                            volume_size: this.createEcsFormData.storage.sysDisk.size
                        }
                    ],
                    security_groups: [
                        {
                            name: this.createEcsFormData.securityGroup.currentSecurityGroup ? this.createEcsFormData.securityGroup.currentSecurityGroup.id : ''
                        }
                    ],
                    networks: [
                        {
                            uuid: this.createEcsFormData.netWorkInfo.subNet.network_id
                        }
                    ],
                    availability_zone: 'az1.dc1',
                    key_name: this.createEcsFormData.keyPair.keyname
                },
                instanceDescribe: this.createEcsFormData.instance.desc,
                applyInstNum: this.createEcsFormData.applyNumber,
                dataDiskList: this.dataDiskList,
                ecsName: this.createEcsFormData.instance.instname,
                availabilityZone: this.createEcsFormData.region || 'az1.dc1',
                imageId: this.createEcsFormData.mirror.imageObj.id,
                bandWidth: 0,
                floatIpId:
                    this.createEcsFormData.broadBand.checked && this.createEcsFormData.broadBand.type !== 'isReady' && this.createEcsFormData.broadBand.ipAdd
                        ? this.createEcsFormData.broadBand.ipAdd.id
                        : '',
                floatIpType: this.createEcsFormData.broadBand.checked ? this.createEcsFormData.broadBand.type : '新建',
                loginCert: this.createEcsFormData.keyPair.loginType
                // ports: this.createEcsFormData.securityGroup.setType === '1' ? this.createEcsFormData.securityGroup.labelList.join(',') : this.createEcsFormData.securityGroup.ports.join(','),
                // labels: []
                // bill: [
                //     {
                //         billType: 1
                //     },
                //     {
                //         flavorId: this.createEcsFormData.flavorObj.id
                //     },
                //     {
                //         period: '1_month'
                //     },
                //     {
                //         count: 1
                //     },
                //     {
                //         bandWidth: 4
                //     },
                //     {
                //         sata: 20
                //     },
                //     {
                //         sata: 20
                //     }
                // ]
            };
            // 如果没有指定安全组
            // if (isEmpty(this.createEcsFormData.securityGroup.currentSecurityGroup)) {
            //     // 如果是自定义端口
            //     if (this.createEcsFormData.securityGroup.setType === '2') {
            //         if (this.createEcsFormData.securityGroup.custom_port !== '') {
            //             body.ports += ',' + this.createEcsFormData.securityGroup.custom_port;
            //         }
            //         if (this.createEcsFormData.securityGroup.custom_udp !== '') {
            //             body.ports += ',' + this.createEcsFormData.securityGroup.custom_udp;
            //         }
            //         if (this.createEcsFormData.securityGroup.ping === '1') {
            //             body.ports += ',icmp';
            //         }
            //     } else {
            //         body.ports += ',icmp';
            //     }
            // } else {
            //     body.ports = '';
            // }

            $log(body);
            this.creating = true;
            createECS(body)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message.success('弹性云主机创建成功');
                        this.$router.push({name: 'app.ecs.list'});
                    } else {
                        this.creating = false;
                    }
                })
                .catch(err => {
                    this.creating = false;
                    $log(err);
                });
        }
    },
    destroyed() {
        removeClass(document.body, 'create');
    },
    mounted() {
        addClass(document.body, 'create');
    }
};
</script>
<style scoped>
</style>
