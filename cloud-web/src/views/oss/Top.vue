<template>
    <el-card shadow="never" class="overview-card oss-box" :body-style="{ padding: '10px 0px', height: '309px' }">
        <div class="oss-box-content" v-loading="loading">
            <div class="oss-box-content__inner mt5" style="padding: 0 10px;">
                <el-row :gutter="20">
                    <el-col :span="6"  border>
                        <!-- 存储容量 -->
                        <div class="title ">流出流量
                        </div>
                        <div class="top-list">
                            <ul v-if="!!requestTop">
                                <li v-for="(item, index) in requestTop" :key="index" class="animated fadeIn">
                                    <span class="top-list--index">{{index+1}}</span>
                                    <span class="top-list--content">
                                        <div class="mb5 flex" >
                                            <div class="flex1 text-ellipsis"><a>{{item[0]}}</a> 
                                            </div>
                                            <span class="top-list--content__number">{{item[1]|convertByteSize(1, 'string')}}</span>
                                        </div>
                                        <el-progress :show-text="false" :text-inside="true" :stroke-width="14" :percentage="100/(index+1)" linear theme="primary"></el-progress>
                                    </span>
                                </li>
                            </ul>
                            <div v-else class="content text-center" style="margin-top:90px;padding-bottom:88px;">
                                <span class="text color-secondary font16 color999">暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6"  border>
                        <!-- 存储容量 -->
                        <div class="title ">流入流量
                        </div>
                        <div class="top-list">
                            <ul v-if="!!putTop">
                                <li v-for="(item, index) in putTop" :key="index" class="animated fadeIn">
                                    <span class="top-list--index">{{index+1}}</span>
                                    <span class="top-list--content">
                                        <div class="mb5 flex" >
                                             <div class="flex1 text-ellipsis"><a>{{item[0]}}</a> 
                                            </div>
                                            <span class="top-list--content__number">{{item[1]|convertByteSize(1, 'string')}}</span>
                                        </div>
                                        <el-progress :show-text="false" :text-inside="true" :stroke-width="14" :percentage="100/(index+1)" linear theme="primary"></el-progress>
                                    </span>
                                </li>
                            </ul>
                            <div v-else class="content text-center" style="margin-top:90px;padding-bottom:88px;">
                                <span class="text color-secondary font16 color999">暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6"  border>
                        <div class="title monthRequest ml10">
                            存储容量
                        </div>
                        <div class="top-list">
                            <ul v-if="!!usedCapTop">
                                <li v-for="(item, index) in usedCapTop" :key="index" class="animated fadeIn" >
                                    <span class="top-list--index">{{index+1}}</span>
                                    <span class="top-list--content">
                                        <div class="mb5 flex">
                                        <div class="flex1 text-ellipsis" >
                                        <a>{{item[0]}}</a> 
                                        </div>
                                        <span class="top-list--content__number">{{item[1]|convertByteSize(1, 'string')}}</span>
                                            </div>
                                        <el-progress :show-text="false" :text-inside="true" :stroke-width="14" :percentage="100/(index+1)" linear theme="warning"></el-progress>
                                    </span>
                                </li>
                            </ul>
                            <div v-else class="content text-center" style="margin-top:90px;padding-bottom:88px;">
                                <span class="text color-secondary font16 color999">暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="title ml10">
                            文件数量
                        </div>
                        <div class="top-list">
                            <ul v-if="!!fileTop">
                                <li v-for="(item, index) in fileTop" :key="index" class="animated fadeIn">
                                    <span class="top-list--index">{{index+1}}</span>
                                    <span class="top-list--content">
                                         <div class="mb5 flex">
                                        <div class="flex1 text-ellipsis" >
                                            <router-link :to="{'name': 'app.oss.bucket', 'params': {'view': 'overview', 'bucketId': item[0], 'name': item[0]}}">{{item[0]}}</router-link> 
                                            </div>
                                            <span class="top-list--content__number">{{item[1]}}</span>
                                        </div>
                                        <el-progress :show-text="false" :text-inside="true" :stroke-width="14" :percentage="100/(index+1)" linear theme="success"></el-progress>
                                    </span>
                                </li>
                            </ul>
                            <div v-else class="content text-center" style="margin-top:90px;padding-bottom:88px;">
                                <span class="text color-secondary font16 color999">暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </el-card>

</template>
<script>
import {getBucketListByUid} from '@/service/oss/index';
// import {cloneDeep} from '@/utils/utils';
export default {
    data() {
        return {
            loading: false,
            methodType: 'GET',
            dataItem:'2',
            form:{
                startTime:'',
                endTime:'',
            }
        };
    },
    props: {
        bucketList: {
            type: Object,
            default: () => { return {};}
        }
    },
    computed: {
        requestTop: function() {
            return this.bucketList.listGet;
        },
        putTop: function() {
            return this.bucketList.listPut;
        },
        usedCapTop: function() {
            // if(this.bucketList.length > 0){
            //     let bucketList = cloneDeep(this.bucketList);
            //     bucketList.sort((a, b) => {
            //         return b.usedCap - a.usedCap;
            //     });
            //     return bucketList.slice(0, 5);
            // }
            return this.bucketList.listSize;
        },
        fileTop: function() {
            return this.bucketList.listFileNum;
        }
    },
    created() {
        this.form.startTime = new Date().getTime() - 7 * 24 * 3600000;
        this.form.endTime = new Date().getTime();
        // this.getData();
    },
    methods: {
        getData() {
            this.loading = true;
            getBucketListByUid(this.form)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.bucketList = res.data;
                        console.log('bucketList', this.bucketList);
                        // this.oldBucketList = res.result;
                    }
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    console.log(err);
                });
        },
        selTime(value){
            this.getData();
            console.log('value',this.dataItem);

        }

    },
    watch:{
        'dataItem': function(newval) {
            let nowday = new Date();
            switch (newval) {
                case '0':
                    this.form.startTime = new Date(new Date().toLocaleDateString()).getTime();
                    break;
                case '2':
                    this.form.startTime = nowday.getTime() - 7 * 24 * 3600000;
                    break;
                case '3':
                    this.form.startTime = nowday.getTime() - (new Date().getDate() - 1) * 24 * 3600000;
                    break;
                case '4':
                    this.form.startTime = nowday.getTime() - 30 * 24 * 3600000;
                    break;
                default:
                    break;
            }
            this.form.endTime = new Date().getTime();

        },
    },
};
</script>
<style scoped lang="scss">
    .overview-card {
        border:none;
    }
.top-list {
    margin-top: 20px;
    margin-left: 10px;
    li {
        display: flex;
        margin-top: 8px;
        align-items: center;
    }
    &--index {
        display: inline-block;
        margin-right: 10px;
    }
    &--content {
        display: inline-block;
        flex: 1;
        color: #1890ff;
        overflow: hidden;
    }
    &--content__number {
       display: inline-block;
       text-align:right;
       margin-left:20px;
        color: #999;
    }
}
</style>