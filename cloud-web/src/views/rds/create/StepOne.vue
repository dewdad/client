<template>
    <div class="create-form">
        <!-- 主实例信息 -->
        <!-- <inst-info ></inst-info> -->
        <!-- 实例名称 start -->
        <el-card class="box-card create-form-item create-form-item__name" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-chuangjianyunzhuji-shilimingcheng"></zt-icon>
                    云数据库名称
                </label>
            </div>
            <div class="create-form-item__content">
                <div style="width: 300px">
                    <inst-name ref="instname" v-model="form.instance"></inst-name>
                </div>
                <!-- <div class="create-form-item__input">
                        <el-input placeholder="请输入内容" size="small"></el-input>
                        <span slot="help" class="input-help">只能由中文字符、英文字母、数字、下划线、中划线组成，且长度小于等于64个字符</span>
                    </div>
                    <div class="create-form-item__input">
                        <el-input type="textarea" autosize placeholder="请输入内容" v-model="active" size="small"></el-input>
                        <span slot="help" class="input-help">描述为选填内容，长度小于300个字符</span>
                    </div> -->
            </div>
        </el-card>
        <!-- 实例名称 end -->
        <!-- 区域选择 strat -->
        <el-card class="box-card create-form-item" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-quyu"></zt-icon>
                    可用区
                </label>
            </div>
            <div class="create-form-item__content">
                <region-select v-model="form.region"></region-select>
            </div>
        </el-card>
        <!-- 区域选择 end -->
        <!-- 实例选择 strat -->
        <flavor-table ref="flavor" v-model="form.flavorObj"></flavor-table>
        <!-- 实例选择 end -->
        <!-- 存储 strat -->
        <el-card class="box-card create-form-item mt10" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-yunzhujichuangjian-cunchu"></zt-icon>
                    存储空间
                </label>
            </div>
            <div class="create-form-item__content">
                <zt-input-number v-model="form.volume_size" size="small" :precision="0" :step="10" :suffix="$t('abbr.gb')" controls-position="right" :min="10" :max="500"></zt-input-number>
                <!-- <storage ref="storage" v-model="form.storage"></storage> -->
            </div>
        </el-card>
        <!-- 存储 end -->
    </div>
</template>
<script>
import RegionSelect from '@/components/form/RegionSelect';
import InstInfo from './components/InstInfo';
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
                volume_size: 10,
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
        KeyPair,
        InstInfo
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
                        return this.validImage(resolve, reject);
                    } else {
                        this.showError(field, this.$refs.instname.$refs);
                        let keys = Object.keys(field);
                        showErrAlert(field[keys[0]][0]['message'], () => {
                            this.$refs.instname.$refs.inputInstName.focus();
                        });
                    }
                });
            });
        },
        /**
         * 验证实例
         */
        validImage(resolve, reject) {
            this.$refs.flavor.$refs.flavorForm.validate((valid, field) => {
                if (valid) {
                    return resolve();
                } else {
                    this.showError(field, this.$refs.flavor.$refs);
                    let keys = Object.keys(field);
                    showErrAlert(field[keys[0]][0]['message']);
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
