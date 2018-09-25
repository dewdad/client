<template>
    <div class="page-main">
        <page-header class="no-border">
            <!-- 返回上一级 -->
            <div class="GoBack">
                <b class="font16 mr10">添加报警规则</b>
                <el-button size="mini" type="info" @click="$router.go(-1)">
                    <i class="iconfont icon-fanhui"></i>返回</el-button>
            </div>
        </page-header>
        <div class="page-body" v-loading="loading">
            <zt-form inline-message :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="small">
                <legend style="padding-bottom:5px" class="pt0">
                    <span style="line-height:2; margin-right:10px;" class="font14 iconfont icon-head_workorder_peop"></span>
                    <span class="color3 font16">关联资源</span>
                </legend>
                <zt-form-item label="产品" prop="alarm.type">
                    <select-system-config v-model="ruleForm.alarm.type" code="alarm.types" placeholder="请选择产品类型"></select-system-config>
                </zt-form-item>
                <zt-form-item label="资源" prop="alarm.resourceType">
                    <el-select v-model="ruleForm.alarm.resourceType" placeholder="请选择资源">
                        <el-option label="全部资源" value="0"></el-option>
                        <!-- <el-option v-if="ruleForm.alarm.type === '1'" label="bucket维度" value="1"></el-option> -->
                        <el-option label="自定义" value="1"></el-option>
                        <!-- <el-option v-if="ruleForm.alarm.type === '3'" label="云硬盘" value="1"></el-option> -->
                    </el-select>
                </zt-form-item>
                <zt-form-item key="bucket" v-if="ruleForm.alarm.type === '1' && ruleForm.alarm.resourceType === '1'" label="bucket" prop="alarm.alarmInstances" :rules="[{required: true, message: '请选择bucket', trigger: ['submit']}]">
                    <select-bucket v-model="ruleForm.alarm.alarmInstances" :multiple="true" placeholder="请选择bucket"></select-bucket>
                </zt-form-item>
                <zt-form-item key="ecsInst" v-if="ruleForm.alarm.type === 'instance' && ruleForm.alarm.resourceType === '1'" label="实例" prop="alarm.alarmInstances" :rules="[{required: true, message: '请选择实例', trigger: ['submit']}]">
                    <select-ecs-inst v-model="ruleForm.alarm.alarmInstances" :multiple="true" placeholder="请选择实例"></select-ecs-inst>
                </zt-form-item>
                <zt-form-item key="disk" v-if="ruleForm.alarm.type === '3' && ruleForm.alarm.resourceType === '1'" label="云盘" prop="alarm.alarmInstances" :rules="[{required: true, message: '请选择云盘', trigger: ['submit']}]">
                    <select-disk v-model="ruleForm.alarm.alarmInstances" :multiple="true" placeholder="请选择云盘"></select-disk>
                </zt-form-item>
                <legend style="padding-bottom:5px" class="pt0">
                    <span style="line-height:2; margin-right:10px;" class="font14 iconfont icon-setting_people"></span>
                    <span class="color3 font16">设置规则</span>
                </legend>
                <div v-for="(item, index) in ruleForm.rules" :key="'rule' + index">
                    <zt-form-item label="规则名称" :prop="'rules.' + index + '.ruleName'" :rules="[{required: true, message: '请输入规则名称', trigger: ['submit']}]">
                        <el-input placeholder="请输入规则名称" v-model="ruleForm.rules[index].ruleName"></el-input>
                        <i v-if="ruleForm.rules.length > 1" class="ml10 finger-cursor el-icon-delete" @click="removeRule(index)"></i>
                    </zt-form-item>
                    <zt-form-item label="规则描述" :prop="'rules.' + index + '.threshold'" :rules="[{required: true, message: '请输入阈值', trigger: ['submit']}]">
                        <select-system-config class="is-nomal" v-model="ruleForm.rules[index].ruleMetric" code="alarm.metrics" placeholder="请选择规则描述"></select-system-config>
                        <el-select class="ml10 is-nomal" v-model="ruleForm.rules[index].alarmTime" style="width: 100px">
                            <el-option label="5分钟" value="5"></el-option>
                            <el-option label="15分钟" value="15"></el-option>
                            <el-option label="30分钟" value="30"></el-option>
                            <el-option label="60分钟" value="60"></el-option>
                        </el-select>
                        <el-select class="ml10 is-nomal" value="1" style="width: 100px">
                            <el-option label="监控值" value="1"></el-option>
                        </el-select>
                        <select-system-config class="ml10 is-nomal" v-model="ruleForm.rules[index].comparisonOperator" code="alarm.comparison.operator"></select-system-config>
                        <el-input class="ml10" style="width: 100px" v-model="ruleForm.rules[index].threshold" type="number" placeholder="阀值"></el-input>
                        <!-- <el-popover placement="top" title="" width="200" trigger="hover">
                            <div>
                                {{getToolTips(ruleForm.rules[index].ruleMetric)}}
                            </div>
                            <span class="tips-help ml10" slot="reference">
                                <zt-icon icon="icon-iconfontwenhao1"></zt-icon>
                            </span>
                        </el-popover> -->
                        <hr slot="help" />
                    </zt-form-item>
                </div>
                <zt-form-item>
                    <label class="finger-cursor" @click.prevent="addRule">
                        <el-button type="primary" icon="el-icon-plus" size="mini"></el-button> 增加报警规则</label>
                </zt-form-item>
                <!-- <zt-form-item label="通道沉默时间" prop="">
                    <el-select>
                        <el-option label="5分钟" value="5"></el-option>
                        <el-option label="15分钟" value="15"></el-option>
                        <el-option label="30分钟" value="30"></el-option>
                        <el-option label="60分钟" value="60"></el-option>
                        <el-option label="3小时" value="180"></el-option>
                        <el-option label="6小时" value="360"></el-option>
                        <el-option label="12小时" value="720"></el-option>
                        <el-option label="24小时" value="1440"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="连续几次超过阈值后报警" prop="">
                    <span style="line-height:16px !important;display: inline-block" slot="label">连续几次超过阈值后报警</span>
                    <el-select>
                        <el-option label="1"></el-option>
                        <el-option label="3"></el-option>
                        <el-option label="5"></el-option>
                        <el-option label="15"></el-option>
                        <el-option label="30"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="生效时间" prop="">
                    <el-time-select style="width: 150px" :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '24:00'
                    }" placeholder="选择时间"></el-time-select>
                    至
                    <el-time-select style="width: 150px" :picker-options="{
                        start: '00:59',
                        step: '01:00',
                        end: '23:59'
                    }" placeholder="选择时间"></el-time-select>

                </zt-form-item> -->
                <legend style="padding-bottom:5px" class="pt0">
                    <span style="line-height:2; margin-right:10px;" class="font14 iconfont icon-inform_people"></span>
                    <span class="color3 font16">通知方式</span>
                </legend>
                <zt-form-item label="通知对象" prop="notices">
                    <select-notice v-model="ruleForm.notices" :multiple="true" placeholder="请选择通知对象"></select-notice>
                </zt-form-item>
                <zt-form-item label="通知方式" prop="">
                    <el-radio v-model="ruleForm.noticeType" label="0">邮箱</el-radio>
                    <el-radio v-model="ruleForm.noticeType" label="1">短信</el-radio>
                </zt-form-item>
                <zt-form-item prop="">
                    <el-button type="primary" size="small" @click="submit">创建</el-button>
                    <el-button type="info" size="small" @click="$router.go(-1)">
                        取消
                    </el-button>
                </zt-form-item>
            </zt-form>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import SelectEcsInst from '../components/SelectEcsInst';
import SelectDisk from '../components/SelectDisk';
import SelectBucket from '../components/SelectBucket';
import SelectNotice from '../components/SelectNotice';
import SelectSystemConfig from '../components/SelectSystemConfig';
import {cloneDeep} from '@/utils/utils';
import {createRule, getRule} from '@/service/monitor/alarmRule';
const ruleItem = {
    alarmTime: '5',
    comparisonOperator: '',
    ruleMetric: '',
    ruleName: '',
    threshold: ''
};
export default {
    data() {
        return {
            loading: false,
            ruleForm: {
                alarm: {
                    alarmInstances: [],
                    resourceType: '0',
                    type: 'instance'
                },
                notices: [],
                rules: [cloneDeep(ruleItem)],
                noticeType: '1'
            },
            notices: [],
            rules: {
                'alarm.type': [{required: true, message: '请选择产品类型', trigger: ['submit', 'change']}],
                'alarm.resourceType': [{required: true, message: '请选择资源类型', trigger: ['submit', 'change']}],
                notices: [{required: true, message: '请选择通知对象', trigger: ['submit', 'change']}]
            }
        };
    },
    components: {
        SelectSystemConfig,
        SelectEcsInst,
        SelectDisk,
        SelectBucket,
        SelectNotice
    },
    watch: {
        'ruleForm.alarm.type': function(newval) {
            this.ruleForm.alarm.alarmInstances = [];
            this.$nextTick(() => {
                this.ruleForm.rules.map(item => {
                    return (item['ruleMetric'] = this.filterArr[0].key);
                });
            });
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        }),
        noticesList: function() {
            let notices = cloneDeep(this.ruleForm.notices);
            return notices.map(item => {
                item['noticeType'] = this.ruleForm.noticeType;
                return item;
            });
        },
    },
    created() {},
    methods: {
        addRule() {
            let obj = cloneDeep(ruleItem);
            $log(obj);
            this.ruleForm.rules.push(obj);
        },
        removeRule(index) {
            this.ruleForm.rules.splice(index, 1);
        },
        getRule() {
            getRule(this.$route.params.id).then(res => {
                if (res.code === '0000') {
                    this.ruleForm = res.data;
                } else {
                    this.$alert('告警规则不存在', {
                        type: 'error'
                    });
                }
            });
        },
        submit() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let data = cloneDeep(this.ruleForm);
                    data.notices = this.noticesList;
                    // data.alarm.domainId = this.userInfo.deptId;
                    // data.alarm.projectId = this.userInfo.projectId;
                    this.loading = true;
                    createRule(data)
                        .then(res => {
                            if (res.code === '0000') {
                                this.$message.success('操作成功');
                                this.$router.push({name: 'app.monitor.alarmrule.list'});
                            }
                        })
                        .catch(err => {
                            $log(err);
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
            });
        }
    }
};
</script>
<style scoped lang="scss">
.el-input,
.el-select {
    width: 300px;
}
hr {
    margin-bottom: 0;
}
.is-error {
    .el-form-item__error.el-form-item__error--inline {
        display: inline-flex;
        position: relative;
        left: 0px;
    }
}
</style>
