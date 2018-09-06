<template>
    <div class="baseData oss-box">
        <div class="oss-box-header">{{$t('oss.overview.baseData')}}</div>
        <div class="oss-box-content">
            <el-alert :title="$t('oss.overviewTips')" type="warning" :closable="false">
            </el-alert>
            <div class="oss-box-content__inner">
                <el-row :gutter="20">
                    <el-col :span="span">
                        <!-- 存储容量 -->
                        <div class="title">{{$t('oss.overview.storageSize')}}</div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.usedCap[0])" :duration="2" :decimals="0" /> {{baseData.usedCap[1]}}
                        </div>
                        <div class="font12 lh32">&nbsp;</div>
                    </el-col>
                    <el-col :span="span">
                        <div class="title monthRequest">
                            {{$t('oss.overview.monthFlow')}}
                            <span class="pull-right">
                                <el-select v-model="flowType" placeholder="请选择" size="small">
                                    <el-option label="流入" value="in">
                                    </el-option>
                                    <el-option label="流出" value="out">
                                    </el-option>
                                </el-select>
                            </span>
                        </div>
                        <div v-if="flowType === 'in'" class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.transferIn[0])" :duration="2" /> {{baseData.transferIn[1]}}
                        </div>
                        <div v-if="flowType === 'out'" class="data">
                            <ICountUp :startVal="0" :endVal="parseInt(baseData.transferOut[0])" :duration="2" /> {{baseData.transferOut[1]}}
                        </div>
                        <!-- <div class="font12 lh32">上月外网流出流量：256MB</div> -->
                    </el-col>
                    <el-col :span="span">
                        <div class="title monthRequest">
                            {{$t('oss.overview.monthRequest')}}
                            <span class="pull-right">
                                <el-select v-model="methodType" placeholder="请选择" size="small">
                                    <el-option label="PUT" value="PUT">
                                    </el-option>
                                    <el-option label="GET" value="GET">
                                    </el-option>
                                </el-select>
                            </span>
                        </div>
                        <div class="data">
                            <ICountUp :startVal="0" :endVal="methodType === 'PUT' ? parseInt(baseData.hitPut) : parseInt(baseData.hitGet)" :duration="2" /> 次
                        </div>
                        <!-- <div class="font12 lh32">上月请求次数：15次</div> -->
                    </el-col>
                    <el-col v-if="showFileNums" :span="span">
                        <div class="title">{{$t('oss.overview.fileNums')}}</div>
                        <div class="data">
                            <span>{{baseData.objNum}}</span>
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
import ICountUp from 'vue-countup-v2';
export default {
    name: 'BaseData',
    data() {
        return {
            loading: true,
            span: 8,
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
            $log(newval);
            this.init();
        }
    },
    created() {
        if (this.showFileNums) this.span = 6;
        this.init();
        // alert(this.$options.filters['convertByteSize'](1024000000))
    },
    methods: {
        init() {
            if (this.$route.params.bucketId && this.$route.params.bucketId !== '') {
                // 如果是单个桶 查询桶数据
                // this.getBucket(this.$route.params.bucketId);
                // this.baseData.usedCap = this.$options.filters['convertByteSize'](this.headerInfo.usedCap);
                // this.baseData.transferIn = this.$options.filters['convertByteSize'](this.headerInfo.transferIn);
                // this.baseData.hitPut = this.headerInfo.hitPut;
                // this.baseData.hitGet = this.headerInfo.hitGet;
                // this.baseData.hitDel = this.headerInfo.hitDel;
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
