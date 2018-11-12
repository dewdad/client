<template>
<div>
    <div class="baseData oss-box" style="border-bottom:1px solid #e8e8e8;">
        <div class="oss-box-content">
            <div class="oss-box-content__inner">
                <el-row :gutter="20" class="flex">
                    <el-col class="flex1">
                        <!-- 存储容量 -->
                        <div class="title">{{$t('oss.overview.storageSize')}}</div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseFloat(baseData.usedCap[0])" :duration="2" :decimals="1" /> {{baseData.usedCap[1]}}
                        </div>
                    </el-col>
                    <el-col class="flex1" style="border-right:none">
                        <div class="title monthRequest">
                            流出流量
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseFloat(baseData.transferOut[0])" :decimals="1" :duration="2" /> {{baseData.transferOut[1]}}
                        </div>
                        <!-- <div class="font12 lh32">上月外网流出流量：256MB</div> -->
                    </el-col>
                    <el-col class="flex1" >
                        <div class="title monthRequest">
                           流入流量
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseFloat(baseData.transferIn[0])" :decimals="1" :duration="2" /> {{baseData.transferIn[1]}}
                        </div>
                    </el-col>
                    <el-col class="flex1" style="border-right:none">
                        <div class="title monthRequest">
                            读请求次数
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.hitGet)" :duration="2" /> 次
                        </div>
                        <!-- <div class="font12 lh32">上月请求次数：15次</div> -->
                    </el-col>
                    <el-col class="flex1">
                        <div class="title monthRequest">
                            写请求次数
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.hitPut)" :duration="2" /> 次
                        </div>
                        <!-- <div class="font12 lh32">上月请求次数：15次</div> -->
                    </el-col>
                    <el-col v-if="showFileNums" class="flex1">
                        <div class="title">{{$t('oss.overview.fileNums')}}</div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.objNum)" :duration="2" /> 个
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
       
    </div>
     <div v-if="!showFileNums" class="mt20">
            <h3 class="font16">BUCKET统计排行榜</h3>
            <top :bucketList="countData"></top>
        </div>
    </div>
</template>
<script>
import {getOssSpace, getBucketUsage} from '@/service/oss';
import ERRCODE from '@/constants/code';
import {isEmpty} from '@/utils/utils';
import ICountUp from 'vue-countup-v2';
import Top from './Top.vue';
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
            },
            countData: {}
        };
    },
    components: {
        ICountUp,
        Top
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
                this.getBucketUsage(this.$route.params.bucketId);
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
                        this.countData = res.data;

                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        // 查询桶当前月份的统计数据
        getBucketUsage(bucketId) {
            getBucketUsage(bucketId).then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    this.setData(res.data);
                }
            });
        },
        setData(data) {
            if (this.$route.params.bucketId) {
                this.baseData.objNum = data.fileNum;
                this.baseData.usedCap = this.$options.filters['convertByteSize'](data.size);
                this.baseData.transferIn = this.$options.filters['convertByteSize'](data.putSize);
                this.baseData.transferOut = this.$options.filters['convertByteSize'](data.getSize);
                this.baseData.hitPut = data.putNum;
                this.baseData.hitGet = data.getNum;
            } else {
                this.baseData.usedCap = this.$options.filters['convertByteSize'](data.usedCap);
                this.baseData.transferIn = this.$options.filters['convertByteSize'](data.transferIn);
                this.baseData.transferOut = this.$options.filters['convertByteSize'](data.transferOut);
                this.baseData.hitPut = data.hitPut;
                this.baseData.hitGet = data.hitGet;
                this.baseData.hitDel = data.hitDel;
            }
        }
    }
};
</script>
<style scoped>
</style>
