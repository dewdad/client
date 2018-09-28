<template>
    <div class="select-security-group">
        <div id="select-security" class="mb10">
            <span class="select-security color-primary img-text-center">
                <span class="finger-cursor img-text-center" @click="showDialog">
                    <zt-icon icon="zticon-chuangjiananquanzu" class=" select-security__icon" type="svg"></zt-icon>{{$t('ecs.create.safeGroup.select')}}</span>
                <el-popover placement="top" width="340" title="" trigger="hover">
                    {{$t('ecs.create.safeGroup.tips')}}
                    <zt-icon icon="icon-iconfontwenhao1 color999  ml10" slot="reference"></zt-icon>
                </el-popover>
                <span class="color999 font12" style="margin-left:40px;">
                    {{$t('ecs.create.safeGroup.descTxt')}}
                    <router-link class="btn-linker" target="_blank" :to="{name:'app.ecs.netsecurity.safegrp'}">新建安全组></router-link>
                    <a class="font12">教我选择></a>
                </span>
            </span>
        </div>
        <div v-if="form.currentSecurityGroup" class="current-security">
            <span>
                <label class="label">{{$t('ecs.create.safeGroup.selectLabel')}}：</label> {{securityGroupName}}</span>
            <span class="template-name color999">{{labelName}}</span>
            <i :class="{'el-icon-arrow-up': true, 'is-hidden': !isOpen}" @click="isOpen = !isOpen"></i>
        </div>
        <!-- <el-alert v-if="form.currentSecurityGroup && unopen" type="warning" title="" class="mt10" :closable="false">
            <i class="iconfont icon-notice_people"></i>
            <span v-if="isWindows">{{$t('ecs.create.safeGroup.windowAlert')}}</span>
            <span v-else>{{$t('ecs.create.safeGroup.linuxAlert')|replaceParamVal([osType])}}</span>
            <router-link class="btn-linker" target="_blank" :to="{name:'app.ecs.groupRule.safegrpRule', params: {ruleId:form.currentSecurityGroup.id}}">前往设置</router-link>
        </el-alert> -->
        <transition>
            <div v-if="isOpen">
                <div v-if="false" class="setting-port">
                    <div class="mb10 font12">{{$t('ecs.create.safeGroup.defaultPort')}}：</div>
                    <div>
                        <el-radio-group v-model="form.setType" size="small">
                            <el-radio-button label="1">{{$t('ecs.create.safeGroup.labelTxt')}}</el-radio-button>
                            <el-radio-button label="2">{{$t('ecs.create.safeGroup.customPort')}}</el-radio-button>
                        </el-radio-group>
                        <el-popover placement="top" width="340" title="" trigger="hover">
                            <div>
                                <p>
                                    <span class="is-bold">{{$t('ecs.create.safeGroup.labelTxt')}}</span><br> {{$t('ecs.create.safeGroup.labelTips')}}
                                </p>
                                <p>
                                    <span class="is-bold">{{$t('ecs.create.safeGroup.customPort')}}</span><br> {{$t('ecs.create.safeGroup.portTips')}}
                                </p>
                            </div>
                            <zt-icon icon="icon-iconfontwenhao1 color999 font14 ml5" slot="reference"></zt-icon>
                        </el-popover>
                    </div>
                    <div class="setting-port__inner">
                        <transition name="fade">
                            <!-- 标签选择 -->
                            <div v-if="form.setType==='1'" class="template">
                                <el-form class="font12" ref="commonForm" :model="form" label-width="110px" key="common" size="mini">
                                    <el-form-item label="常用标签" class="mb0">
                                        <el-checkbox-group v-model="form.labelList" key="labelList" @change="computedTips">
                                            <el-checkbox v-for="label in COMMON_LABEL" :key="label.label" :label="label.port" :disabled="checkDisabled(label.port)">
                                                <el-popover placement="top" title="" trigger="hover" :disabled="!label.desc">
                                                    <div v-html="label.desc.replace('；', '<br>')"></div>
                                                    <span slot="reference">{{label.label}}：{{label.port}}</span>
                                                </el-popover>
                                            </el-checkbox>
                                        </el-checkbox-group>
                                        <div class="font12" style="margin-top: -5px;">
                                            是否允许ping：是
                                            <div class="open-port" style="padding-right:125px;">
                                                <span class="color999">{{$t('ecs.create.safeGroup.openPort')}}：</span>
                                                <span>{{tipsContent}}
                                                    <i v-if="loading" class="color-primary el-icon-loading"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <!-- 自定义端口选择 -->
                            <div v-if="form.setType==='2'" class="custom">
                                <el-form class="font12 show-icon" ref="customForm" inline-message :model="form" key="custom" :rules="rules" label-width="110px" size="mini">
                                    <el-form-item label="是否允许ping">
                                        <el-radio v-model="form.ping" label="1">是</el-radio>
                                        <el-radio v-model="form.ping" label="2">否</el-radio>
                                    </el-form-item>
                                    <el-form-item :label="$t('ecs.create.safeGroup.openPort')">
                                        <el-checkbox-group v-model="form.ports" key="ports" @change="computedTips">
                                            <el-checkbox v-for="port in TCP_PORT" :key="port.port" :label="port.port" :disabled="checkDisabled(port.port)">
                                                <el-popover placement="top" title="" trigger="hover" :disabled="!port.desc">
                                                    <div v-html="port.desc"></div>
                                                    <span slot="reference">{{port.port}}</span>
                                                </el-popover>
                                            </el-checkbox>
                                        </el-checkbox-group>
                                        <div class="open-port font12" style="padding-right:125px;">
                                            <span class="color999">{{$t('ecs.create.safeGroup.openPort')}}：</span>
                                            <span>{{tipsPortContent}}
                                                <i v-if="loading" class="color-primary el-icon-loading"></i>
                                            </span>
                                        </div>
                                    </el-form-item>
                                    <el-form-item id="custom_port" :label="$t('ecs.create.safeGroup.commTcp')" style="width:410px;" class="hide-star" prop="custom_port">
                                        <el-input v-model="form.custom_port" placeholder="如：8080,8090"></el-input>
                                    </el-form-item>
                                    <el-form-item id="custom_udp" :label="$t('ecs.create.safeGroup.customUdp')" style="width:410px;" class="hide-star mb0" prop="custom_udp">
                                        <el-input v-model="form.custom_udp" placeholder="如：8091,8095"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </transition>
                    </div>
                </div>
                <!-- 所选安全组规则 -->
                <div v-if="form.currentSecurityGroup" v-loading="ruleLoading" element-loading-spinner="el-icon-loading" class="security-group-rules">
                    <div class="font12">{{$t('ecs.create.safeGroup.rule')}}：</div>
                    <div class="security-group-rules__inner">
                        <!-- 切换展示条件 -->
                        <el-tabs v-model="direction">
                            <el-tab-pane label="入方向" name="ingress"></el-tab-pane>
                            <el-tab-pane label="出方向" name="egress"></el-tab-pane>
                        </el-tabs>
                        <el-table :data="tableData" class="data-list" :search="false" empty-text="还未配置相关规则">
                            <!-- 协议类型 -->
                            <el-table-column prop="protocol" label="协议类型">
                                <template slot-scope="scope">
                                  <span v-if="scope.row.protocol">  {{scope.row.protocol}}</span>
                                  <span v-else>所有</span>
                                </template>
                            </el-table-column>
                            <!-- 端口范围 -->
                            <el-table-column prop="protocol" label="端口范围">
                                <template slot-scope="scope">
                                  <span v-if="scope.row.port_range_min">  {{scope.row.port_range_min}} - {{scope.row.port_range_max}}</span>
                                  <span v-else>所有</span>
                                </template>
                            </el-table-column>
                            <!-- 授权地址 -->
                            <el-table-column prop="remote_ip_prefix" label="授权地址">
                                <template slot-scope="scope">
                                    {{scope.row.remote_ip_prefix === null || scope.row.remote_ip_prefix === '0.0.0.0/0' ? '所有' : scope.row.remote_ip_prefix}}
                                </template>
                            </el-table-column>
                            <!-- 授权类型 -->
                            <el-table-column prop="ethertype" label="授权类型">
                                <template slot-scope="scope">
                                    {{scope.row.remote_group_id ? '安全组访问' : '地址段访问'}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 安全组弹框 -->
        <select-security-group-dialog v-if="showSelectSecurityGroupDialog" ref="SelectSecurityGroupDialog"></select-security-group-dialog>
    </div>
</template>
<script>
import SelectSecurityGroupDialog from './SelectSecurityGroupDialog';
import {isEmpty, sleep, cloneDeep} from '@/utils/utils';
import {CUSTOM_PORT} from '@/constants/regexp';
import {getGroupRuleList, getSecurityGroupList} from '@/service/ecs/security';
import {TCP_PORT, COMMON_LABEL} from '@/constants/dicts/ecs';
import {mapState} from 'vuex';
export default {
    name: 'SecurityGroup',
    data() {
        return {
            showSelectSecurityGroupDialog: false,
            ruleLoading: false,
            isOpen: true,
            direction: 'ingress',
            /**
             * 常用端口
             */
            TCP_PORT,
            /**
             * 常用标签
             */
            COMMON_LABEL,
            /**
             * 表单对象
             */
            form: {
                setType: '1',
                currentSecurityGroup: '',
                ping: '1',
                labelList: [],
                ports: [],
                custom_port: '',
                custom_udp: '',
                ruleList: []
            },
            /**
             * 常用标签选择的端口提示内容
             */
            tipsContent: '',
            /**
             * 常用端口选择的提示内容
             */
            tipsPortContent: '',
            loading: false,
            rules: {
                custom_port: [
                    {
                        pattern: CUSTOM_PORT,
                        message: '端口输入有误',
                        trigger: ['submit', 'blur']
                    }
                ],
                custom_udp: [
                    {
                        pattern: CUSTOM_PORT,
                        message: '端口输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props: {
        value: Object
    },
    components: {
        SelectSecurityGroupDialog
    },
    computed: {
        ...mapState({
            createEcsFormData: state => state.createEcsFormData
        }),
        osType: function() {
            try {
                return this.createEcsFormData.mirror.osType ? this.createEcsFormData.mirror.osType : '';
            } catch (err) {
                $log(err);
                return '';
            }
        },
        // 当前安全组名称
        securityGroupName: function() {
            if (isEmpty(this.form.currentSecurityGroup)) {
                return '默认安全组';
            } else {
                return (
                    this.form.currentSecurityGroup.id +
                    ' / ' +
                    this.form.currentSecurityGroup.name +
                    ' (已有' +
                    (this.form.currentSecurityGroup.countInstance ? this.form.currentSecurityGroup.countInstance : 0) +
                    '个实例)'
                );
            }
        },
        // 检查默认22或3389端口是否开放
        unopen: function() {
            let flag = this.form.ruleList.find(item => {
                return item.port === '全部' || item.port === (this.isWindows ? '3389' : '22');
            });
            return flag === undefined ? true : false;
        },
        labelList: function() {
            let newarr = cloneDeep(this.form.labelList);
            return newarr.sort((a, b) => a.split(',')[0] - b.split(',')[0]);
        },
        portList: function() {
            let newarr = cloneDeep(this.form.ports);
            return newarr.sort((a, b) => a - b);
        },
        labelName: function() {
            let string = [];
            if (isEmpty(this.form.currentSecurityGroup)) {
                let newval = this.labelList;
                if (this.form.setType === '2') return '自定义端口';
                for (let port of newval) {
                    let item = this.COMMON_LABEL.find(item => {
                        return item.port === port;
                    });
                    if (item !== undefined && item.label !== '') string.push(item.label + '标签');
                }
            }
            return string.join('、');
        },
        isWindows: function() {
            return this.osType.toLowerCase().includes('windows') ? true : false;
        },
        tableData: function() {
            return this.form.ruleList.filter(item => {
                return item.direction === this.direction;
            });
        }
    },
    watch: {
        // 安全组变化时获取规则
        'form.currentSecurityGroup': function(newval) {
            if (newval.id) {
                // this.getSecurityGroupRules();
                this.form.ruleList = newval.security_group_rules;
            }
        },
        osType: function(newval) {
            if (!this.isWindows) {
                this.form.labelList = ['22'];
                this.form.ports = ['22'];
            } else {
                this.form.labelList = ['3389'];
                this.form.ports = ['3389'];
            }
            this.computedTips(this.form.labelList, '1');
            this.computedTips(this.form.ports, '2');
        },
        form: {
            deep: true,
            handler: function(newval) {
                this.$emit('input', newval);
            }
        }
    },
    async created() {
        await this.getSecurityGroupList().catch(err => $log(err));
        /**
         * 根据镜像类型设置默认选择端口
         */
        if (this.isWindows) {
            this.form.ports.push('3389');
            this.form.labelList.push('3389');
        } else {
            this.form.ports.push('22');
            this.form.labelList.push('22');
        }
        this.computedTips(this.form.labelList, '1');
        this.computedTips(this.form.ports, '2');
    },
    methods: {
        /**
         * 显示安全组弹框
         */
        showDialog() {
            this.showSelectSecurityGroupDialog = true;
            setTimeout(() => {
                this.$refs.SelectSecurityGroupDialog.show().then(res => {
                    $log(res);
                    this.$refs.SelectSecurityGroupDialog.close();
                    this.form.currentSecurityGroup = res;
                });
            }, 500);
        },
        /**
         * 获取安全组规则
         */
        getSecurityGroupRules() {
            this.ruleLoading = true;
            getGroupRuleList(this.form.currentSecurityGroup.id)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.form.ruleList = res.result || [];
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.ruleLoading = false;
                });
        },
        /**
         * 根据镜像类型禁用必选端口选择
         */
        checkDisabled(port) {
            if (port === '22' && !this.isWindows) {
                return true;
            }
            if (port === '3389' && this.isWindows) {
                return true;
            }
            return false;
        },
        /**
         * 根据选择端口显示对应对口的提示
         */
        async computedTips(value, type) {
            this.loading = true;
            let string = '';
            let setType = type || this.form.setType;
            if (setType === '1') {
                this.tipsContent = '';
                for (let port of this.labelList) {
                    let item = this.COMMON_LABEL.find(item => {
                        return item.port === port;
                    });
                    if (item !== undefined && item.desc !== '') string += item.desc + '；';
                }
                await sleep(500);
                this.loading = false;
                this.tipsContent = string;
            } else {
                this.tipsPortContent = '';
                for (let port of this.portList) {
                    let item = this.TCP_PORT.find(item => {
                        return item.port === port;
                    });
                    if (item !== undefined && item.desc !== '') string += item.desc + '；';
                }
                await sleep(500);
                this.loading = false;
                this.tipsPortContent = string;
            }
        },
        // 查找默认安全组
        getSecurityGroupList() {
            let data = {
                pageIndex: 1,
                limit: 1000
            };
            return new Promise((reslove, reject) => {
                getSecurityGroupList(data)
                    .then(res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            this.tableData = res.result.records;
                            if (res.result.total > 0) {
                                // 查询默认安全组
                                let currentSecurityGroup = res.result.records.find(item => {
                                    return item.remark === 'default';
                                });
                                if (currentSecurityGroup) {
                                    this.form.currentSecurityGroup = currentSecurityGroup;
                                }
                                reject();
                            } else {
                                reslove();
                            }
                        }
                    })
                    .catch(err => {
                        $log(err);
                    });
            });
        }
    },
    mounted() {
        this.$emit('input', this.form);
    }
};
</script>
<style  lang="scss">
.select-security-group {
    .select-security {
        height: 28px;
        line-height: 28px;
    }
    .select-security__icon {
        font-size: 28px;
        margin-right: 5px;
    }
    .current-security {
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0px 10px;
        background-color: #eceff8;
        border-bottom: solid 1px #0d7ef2;
        font-size: 12px;
        .label {
            color: #666;
            font-weight: normal;
        }
        .template-name {
            margin-left: 30px;
        }
        i[class^='el-icon'] {
            position: absolute;
            right: 10px;
            top: 10px;
        }
        .el-icon-arrow-up {
            transition: transform 0.3s;
            &.is-hidden {
                transform: rotate(180deg);
            }
        }
    }
    .setting-port,
    .security-group-rules {
        padding: 10px;
        font-size: 12px;
    }
    .security-group-rules {
        .rows {
            &:not(:last-child) {
                border-bottom: solid 1px #d1d4d8;
            }
            color: #999;
            padding: 15px;
            line-height: 1;
            .value {
                display: inline-block;
                color: #333 !important;
            }
        }
    }
    .setting-port {
        &__inner {
            margin-top: 10px;
            border: solid 1px #d1d4d8;
            padding: 16px 15px;
        }
        .open-port {
            display: table;
            span {
                &:first-child {
                    width: 96px;
                }
                display: table-cell;
                line-height: 20px;
            }
        }
        .el-form-item {
            margin-bottom: 10px;
        }
        .el-input {
            width: 300px;
        }
    }
    .el-checkbox {
        width: 200px;
        line-height: 14px;
        // margin-bottom: 5px;
        .el-checkbox__label {
            color: #333 !important;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #333 !important;
        }
        & + .el-checkbox {
            margin-left: 0px;
        }
    }
    .el-radio-group .el-radio-button {
        margin-right: 5px;
    }
    .custom {
        .el-checkbox {
            width: 140px;
        }
    }
}
</style>
