<template>
    <div class="create-form">
        <!-- 实例名称 start -->
        <el-card class="box-card create-form-item create-form-item__name" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-chuangjianyunzhuji-shilimingcheng"></zt-icon>
                    {{$t('common.instName')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <div style="width: 300px">
                    <inst-name ref="instname" v-model="form.instance"></inst-name>
                </div>
                <!-- <div class="create-form-item__input">
                        <el-input placeholder="请输入内容" size="small"></el-input>
                        <span class="input-help">只能由中文字符、英文字母、数字、下划线、中划线组成，且长度小于等于64个字符</span>
                    </div>
                    <div class="create-form-item__input">
                        <el-input type="textarea" autosize placeholder="请输入内容" v-model="active" size="small"></el-input>
                        <span class="input-help">描述为选填内容，长度小于300个字符</span>
                    </div> -->
            </div>
        </el-card>
        <!-- 实例名称 end -->
        <!-- 计费方式 strat -->
        <el-card class="box-card create-form-item" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-ecs_billingmethod_p"></zt-icon>
                    {{$t('common.payType')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <el-radio-group v-model="form.bill_type" size="small">
                    <el-radio-button label="1">{{$t('ecs.inst.list.freeTrial')}}</el-radio-button>
                </el-radio-group>
            </div>
        </el-card>
        <!-- 计费方式 end -->
        <!-- 区域选择 strat -->
        <!-- <el-card class="box-card create-form-item" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-quyu"></zt-icon>
                    {{$t('common.area')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <region-select v-model="form.region"></region-select>
            </div>
        </el-card> -->
        <!-- 区域选择 end -->
        <!-- 实例选择 strat -->
        <el-card class="box-card create-form-item" shadow="hover" v-loading="flavorLoading" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-shili1"></zt-icon>
                    {{$t('common.inst')}}
                </label>
                <div v-html="$t('ecs.create.flavor.descTxt')"></div>
            </div>
            <div class="create-form-item__content">
                <flavor-table v-model="form.flavorObj" @loading="handleFlavorLoading"></flavor-table>
                <div class="mt10 font12 color666">申请数量：
                    <zt-input-number v-model="form.applyNumber" :tooltip="$t('ecs.create.maxApplyNumber')|replaceParamVal([form.applyMax])" size="small" suffix="台" :precision="0" controls-position="right" :min="1" :max="form.applyMax"></zt-input-number>
                </div>
            </div>
        </el-card>
        <!-- 实例选择 end -->
        <!-- 镜像 strat -->
        <el-card class="box-card create-form-item" shadow="hover" v-loading="mirrorLoading" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-jingxiang"></zt-icon>
                    {{$t('common.image')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <select-mirror ref="mirror" @loading="handleMirrorLoading" v-model="form.mirror"></select-mirror>
            </div>
        </el-card>
        <!-- 镜像 end -->
        <!-- 存储 strat -->
        <el-card class="box-card create-form-item" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-cunchu"></zt-icon>
                    {{$t('common.storage')}}
                </label>
                <div v-html="$t('ecs.create.storage.descTxt')"></div>
            </div>
            <div class="create-form-item__content">
                <storage ref="storage" v-model="form.storage"></storage>
            </div>
        </el-card>
        <!-- 存储 end -->
        <!-- 密钥对 strat -->
        <el-card class="box-card create-form-item" shadow="hover" v-loading="keyLoading" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-miyuedui"></zt-icon>
                    {{$t('common.logonCredentials')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <key-pair ref="keypair" v-model="form.keyPair" @loading="handleLoading" :ostype="form.mirror.osType"></key-pair>
            </div>
        </el-card>
        <!-- 密钥对 end -->
    </div>
</template>
<script>
import RegionSelect from '@/components/form/RegionSelect';
import ZtInputNumber from '@/components/ZTInput-number/index.js';
import InstName from './components/InstName';
import FlavorTable from './components/FlavorTable';
import SelectMirror from './components/SelectMirror';
import Storage from './components/Storage';
import KeyPair from './components/KeyPair';
import {showErrAlert, scrollTo} from '@/utils/utils';
const applyMax = ZT_ECS_APPLY_MAX;
export default {
    name: 'StepOne',
    data() {
        return {
            value1: '',
            flavorLoading: false,
            keyLoading: false,
            mirrorLoading: false,
            firstValid: true,
            form: {
                instance: {},
                bill_type: '1',
                region: '',
                applyNumber: 1,
                mirror: {},
                applyMax,
                flavorObj: {},
                storage: {},
                keyPair: {}
            },
            errorField: ''
        };
    },
    components: {
        InstName,
        RegionSelect,
        FlavorTable,
        ZtInputNumber,
        SelectMirror,
        Storage,
        KeyPair
    },
    watch: {
        form: {
            deep: true,
            handler: function(newval) {
                this.$emit('input', newval);
            }
        }
    },
    methods: {
        handleFlavorLoading(val) {
            this.flavorLoading = val;
        },
        handleLoading(val) {
            this.keyLoading = val;
        },
        handleMirrorLoading(val) {
            this.mirrorLoading = val;
        },
        validate() {
            return new Promise((resolve, reject) => {
                this.$refs.instname.$refs.instNameForm.validate((valid, field) => {
                    if (valid) {
                        // return resolve();
                        return this.validMirror(resolve, reject);
                    } else {
                        this.showError(field, this.$refs.instname.$refs);
                        // let keys = Object.keys(field);
                        // showErrAlert(field[keys[0]][0]['message'], () => {
                        //     this.$refs.instname.$refs.inputInstName.focus();
                        // });
                    }
                });
            });
        },
        /**
         * 验证镜像
         */
        validMirror(resolve, reject) {
            this.$refs.mirror.$refs.imageForm.validate((valid, field) => {
                if (valid) {
                    return this.validKeyPair(resolve, reject);
                } else {
                    this.showError(field);
                }
            });
        },
        /**
         * 验证密钥对
         */
        validKeyPair(resolve, reject) {
            this.$refs.keypair.$refs.keyPairform.validate((valid, field) => {
                if (valid) {
                    return resolve();
                } else {
                    this.showError(field);
                }
            });
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
                    // 如果是未选择镜像，根据数据盘数量动态计算偏移量
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
<style scoped>
</style>
