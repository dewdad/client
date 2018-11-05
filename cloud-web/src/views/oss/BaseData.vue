<template>
    <div class="baseData oss-box" style="border-bottom:1px solid #e8e8e8;">
        <div class="oss-box-content">
            <div class="oss-box-content__inner">
                <el-row :gutter="20">
                    <el-col :span="span">
                        <!-- 存储容量 -->
                        <div class="title">{{$t('oss.overview.storageSize')}}</div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.usedCap[0])" :duration="2" :decimals="0" /> {{baseData.usedCap[1]}}
                        </div>
                    </el-col>
                    <el-col :span="span" style="border-right:none">
                        <div class="title monthRequest">
                            流出流量
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.transferOut[0])" :duration="2" /> {{baseData.transferOut[1]}}
                        </div>
                        <!-- <div class="font12 lh32">上月外网流出流量：256MB</div> -->
                    </el-col>
                    <el-col :span="span" >
                        <div class="title monthRequest">
                           流入流量
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.transferIn[0])" :duration="2" /> {{baseData.transferIn[1]}}
                        </div>
                    </el-col>
                    <el-col :span="span" style="border-right:none">
                        <div class="title monthRequest">
                            读月请求次数
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.hitGet)" :duration="2" /> 次
                        </div>
                        <!-- <div class="font12 lh32">上月请求次数：15次</div> -->
                    </el-col>
                    <el-col :span="span">
                        <div class="title monthRequest">
                            写请求次数
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.hitPut)" :duration="2" /> 次
                        </div>
                        <!-- <div class="font12 lh32">上月请求次数：15次</div> -->
                    </el-col>
                    <el-col v-if="showFileNums" :span="span">
                        <div class="title">{{$t('oss.overview.fileNums')}}</div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.objNum)" :duration="2" /> 个
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import {getOssSpace, getBucket} from '@/service/oss';
import ERRCODE from '@/constants/code';
import {isEmpty} from '@/utils/utils';
import ICountUp from 'vue-countup-v2';
export default {
    name: 'BaseData',
    data() {
        return {
            loading: true,
            span: 4,
            flowType: 'in',
            methodType: 'PUT',
            baseData: {
                usedCap: [0, ''],
                transferIn: [0, ''],
                transferOut: [0, ''],
                hitPut: 0,
                hitGet: 0,
                objNum: 0
            }
        };
    },
    components: {
        ICountUp
    },
    props: {
        showFileNums: {
            type: Boolean,
            default: false
        },
        headerInfo: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    watch: {
        $route: function() {
            this.init();
        },
        headerInfo: function(newval) {
            if (!isEmpty(newval)) {
                this.init();
            }
        }
    },
    created() {
        if (this.showFileNums) this.span = 4;
        this.init();
        // alert(this.$options.filters['convertByteSize'](1024000000))
    },
    methods: {
        init() {
            if (this.$route.params.bucketId && this.$route.params.bucketId !== '') {
                // 如果是单个桶 查询桶数据
                if (!isEmpty(this.headerInfo) && this.headerInfo.usage.rgwMain) {
                    // this.getBucket(this.$route.params.bucketId);
                    this.baseData.usedCap = this.$options.filters['convertByteSize'](this.headerInfo.usage.rgwMain.size);
                    // this.baseData.transferIn = this.$options.filters['convertByteSize'](this.headerInfo.transferIn);
                    // this.baseData.hitPut = this.headerInfo.hitPut;
                    // this.baseData.hitGet = this.headerInfo.hitGet;
                    this.baseData.objNum = this.headerInfo.usage.rgwMain.num_objects;
                } else {
                    this.baseData.usedCap = [0, ''];
                    this.baseData.objNum = 0;
                }
            } else {
                // 查询总概览数据
                this.getSpaceData();
            }
        },
        // 加载基础数据
        getSpaceData() {
            getOssSpace()
                .then(res => {
                    this.loading = false;
                    if (res.code === ERRCODE.SUCCESS_CODE) {
                        this.setData(res.data);
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        // 查询桶当前月份的统计数据
        getBucket(bucketId) {
            getBucket(bucketId).then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    this.setData(res.data);
                }
            });
        },
        setData(data) {
            this.baseData.usedCap = this.$options.filters['convertByteSize'](data.usedCap);
            this.baseData.transferIn = this.$options.filters['convertByteSize'](data.transferIn);
            this.baseData.transferOut = this.$options.filters['convertByteSize'](data.transferOut);
            this.baseData.hitPut = data.hitPut;
            this.baseData.hitGet = data.hitGet;
            this.baseData.hitDel = data.hitDel;
        }
    }
};
</script>
<style scoped>
</style>
