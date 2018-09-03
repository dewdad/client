<template>
    <div class="storage">
        <ul>
            <li :class="{'is-open': showSYS}">
                <div class="head">
                    <!-- <i class="el-icon-arrow-right"></i> -->
                    <i class="el-icon-arrow-right" @click="showSYS = !showSYS"></i>
                    <span class="head-inner" @click="showSYS = !showSYS">
                        <label>{{$t('common.sysDisk')}}：</label>
                        <span class="color999">{{sysDisk.type.label}} {{sysDisk.size}}{{$t('abbr.gb')}}</span>
                    </span>
                </div>
                <div v-show="showSYS" class="content mt10">
                    <div class="font12">
                        <el-select v-model="sysDisk.type" placeholder="请选存储类型" popper-class="el-popper--small" key-value="value" size="small" class="mr10">
                            <el-option v-for="type in STORAGE_TYPES" :key="type.value" :label="type.label" :value="type">
                            </el-option>
                        </el-select>
                        <zt-input-number v-model="sysDisk.size" :tooltip="'容量范围:' + sysDiskMinSize + 'G - ' + sysDiskMaxSize + 'G'" size="small" :precision="0" :step="10" :suffix="$t('abbr.gb')" controls-position="right" :min="sysDiskMinSize" :max="sysDiskMaxSize"></zt-input-number>
                        <span class="ml10" v-if="sysDisk.type.value === 'SSD'">1960 IOPS</span>
                        <span class="ml10" v-if="sysDisk.type.value === 'SATA'">1120 IOPS</span>
                        <span class="devname">系统盘设备名：/dev/xvda</span>
                    </div>
                    <div class="mt10 font12 color999">
                        {{$t('ecs.create.storage.sysDiskTxt')}}
                        <a class="font12">详细说明</a>
                    </div>
                </div>

            </li>
            <li :class="{'is-open': showData}">
                <div class="head">
                    <i class="el-icon-arrow-right" @click="showData = !showData"></i>
                    <div class="head-inner" @click="showData = !showData">
                        <label>{{$t('common.dataDisk')}}：</label>
                        <span class="color999">{{countDisk}}/{{maxApplyNumber}}</span>
                        <span class="color999">{{$t('ecs.create.storage.dataDiskDesc')}}
                            <a class="font12">分区格式化数据盘</a>
                        </span>
                    </div>
                </div>
                <div v-show="showData" class="content mt10 font12">
                    <div v-if="countDisk" class="font12 color999">
                        您已选择
                        <!-- 
                        -->
                        <span class="color-danger">{{countDisk}}</span>块盘，还可以选择
                        <!-- 
                        -->
                        <span class="color-danger">{{maxDiskNumber}}</span>块盘；</div>
                    <ul class="mt10">
                        <li v-for="(disk, index) in dataDisk" :key="disk.diskPerformance.label + index">
                            <el-button type="primary" size="small" class="mr10" icon="el-icon-minus" @click="removeDataDisk(index)"></el-button>
                            <el-select v-model="disk.diskPerformance" placeholder="请选存储类型" popper-class="el-popper--small" key-value="value" size="small" class="mr10">
                                <el-option v-for="type in STORAGE_TYPES" :key="type.value" :label="type.label" :value="type">
                                </el-option>
                            </el-select>
                            <zt-input-number v-model="disk.diskSize" tooltip="容量范围:20G - 3276G"  size="small" :suffix="$t('abbr.gb')" :precision="0" :step="10" controls-position="right" :min="20" :max="3276"></zt-input-number>
                            <span class="ml10" v-if="disk.diskPerformance.value === 'SSD'">1960 IOPS</span>
                            <span class="ml10" v-if="disk.diskPerformance.value === 'SATA'">1120 IOPS</span>
                            <span class="numbers">
                                数量：
                                <zt-input-number v-model="dataDisk[index].diskNum" size="small" controls-position="right" :precision="0" :min="1" :max="getMax(index)"></zt-input-number>
                            </span>
                            <el-popover placement="top" title="" width="340" trigger="hover">
                                <div v-html="$t('ecs.create.storage.autoTips')">
                                </div>
                                <span class="tips-help font12" slot="reference">
                                    {{$t('ecs.create.storage.labelTxt')}}
                                </span>
                            </el-popover>
                        </li>
                        <li>
                            <el-button type="text" size="small" :disabled="!isAdd" @click="addDataDisk">
                                <i class="el-icon-plus"></i>
                                <span class="ml10">增加{{$t('common.dataDisk')}}</span>
                            </el-button>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import ZtInputNumber from '@/components/ZTInput-number/index.js';
import {STORAGE_TYPES} from '@/constants/dicts/ecs';
import {mapState} from 'vuex';
export default {
    name: 'Storage',
    data() {
        return {
            STORAGE_TYPES,
            showSYS: true,
            showData: false,
            sysDisk: {
                type: STORAGE_TYPES[0],
                size: 20
            },
            maxApplyNumber: 10,
            dataDisk: []
        };
    },
    props: {
        value: Object
    },
    components: {
        ZtInputNumber
    },
    watch: {
        /**
         * 监听数据变化，抛出组件input事件
         */
        sysDisk: function(newval) {
            this.setValue();
        },
        dataDisk: function(newval) {
            this.setValue();
        },
        sysDiskMinSize: function(newval) {
            this.sysDisk.size = newval;
        }
    },
    created() {
        this.setValue();
    },
    computed: {
        ...mapState({
            createEcsFormData: state => state.createEcsFormData
        }),
        sizeRange: function() {
            let minSize = this.createEcsFormData.mirror && this.createEcsFormData.mirror.imageObj !== '' ? this.createEcsFormData.mirror.imageObj.minSize : '20';
            let size = minSize.indexOf(',') !== -1 ? minSize.split(',') : [minSize, 500];
            return size;
        },
        sysDiskMinSize: function() {
            return parseInt(this.sizeRange[0]);
        },
        sysDiskMaxSize: function() {
            return parseInt(this.sizeRange[1]);
        },
        countDisk: function() {
            let total = 0;
            for (let disk of this.dataDisk) {
                total += disk.diskNum;
            }
            return total;
        },
        maxDiskNumber: function() {
            let max = this.maxApplyNumber - this.countDisk;
            return Math.max(max, 0);
        },
        isAdd: function() {
            let total = this.countDisk;
            return total < this.maxApplyNumber;
        }
    },
    methods: {
        /**
         * 添加数据盘
         */
        addDataDisk() {
            if (this.isAdd !== true) {
                return;
            }
            let obj = {
                diskPerformance: STORAGE_TYPES[0],
                diskSize: 20,
                diskNum: 1,
                max: this.maxApplyNumber
            };
            this.dataDisk.push(obj);
        },
        /**
         * 删除数据盘
         */
        removeDataDisk(index) {
            this.dataDisk.splice(index, 1);
        },
        /**
         * 获取数据盘可设置的最大值
         */
        getMax(index) {
            if (this.dataDisk.length === 1) {
                return this.maxApplyNumber;
            } else {
                let total = 0;
                this.dataDisk.forEach((disk, i) => {
                    if (i !== index) total += disk.diskNum;
                });
                return this.maxApplyNumber - total;
            }
        },
        /**
         * 设置组件的v-model值
         */
        setValue() {
            let value = {
                sysDisk: this.sysDisk,
                dataDisk: this.dataDisk
            };
            this.$emit('input', value);
        }
    }
};
</script>
<style scoped lang="scss">
.storage {
    .el-select,
    .el-input,
    .el-input-number {
        width: 170px !important;
    }
    li:not(:last-child) {
        margin-bottom: 10px;
    }
    .head {
        position: relative;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        display: flex;
        .el-icon-arrow-right {
            position: absolute;
            left: -17px;
            top: 0px;
            font-size: 12px;
            color: #364556;
            line-height: 28px;
            transition: transform 0.3s;
        }
        .head-inner {
            label,
            span {
                margin-right: 50px;
            }
            width: 100%;
            padding: 0 2px;
            &:hover {
                background: #eceff8;
                // border-bottom: solid 1px #0d7ef2;
            }
        }
    }
    .devname {
        margin-left: 76px;
    }
    .numbers {
        margin-left: 40px;
        margin-right: 35px;
        .el-input-number {
            width: 120px !important;
        }
    }
    .heop-tips {
        margin-left: 40px;
    }
    .is-open {
        .head .head-inner {
            background: #eceff8;
            border-bottom: solid 1px #0d7ef2;
        }
        .el-icon-arrow-right {
            transform: rotate(90deg);
        }
        .content {
            display: block;
        }
    }
    .el-button.el-button--primary {
        width: 32px;
        height: 32px;
        padding: 0px;
    }
    .el-button.el-button--text {
        height: 32px;
        padding: 0px 10px 0 0;
        line-height: 32px;
        .el-icon-plus {
            display: inline-block;
            width: 32px;
            height: 32px;
            line-height: 32px;
            background: #0d7ef2;
            color: #fff;
            padding: 0px;
        }
        &.is-disabled {
            .el-icon-plus {
                background: #ccd1db;
            }
        }
    }
}
</style>
