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
                                            <div class="flex1 text-ellipsis"><a>{{item.name}}</a> 
                                            </div>
                                            <span class="top-list--content__number">{{item.transferOut}} MB</span>
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
                            <ul v-if="!!requestTop">
                                <li v-for="(item, index) in requestTop" :key="index" class="animated fadeIn">
                                    <span class="top-list--index">{{index+1}}</span>
                                    <span class="top-list--content">
                                        <div class="mb5 flex" >
                                            <div class="flex1 text-ellipsis" ><a>{{item.name}}</a> 
                                            </div>
                                            <span class="top-list--content__number">{{item.transferIn}} MB</span>
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
                                        <a>{{item.name}}</a> 
                                        </div>
                                        <span class="top-list--content__number">{{item.use}} MB</span>
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
                            <ul v-if="!!requestTop">
                                <li v-for="(item, index) in fileTop" :key="index" class="animated fadeIn">
                                    <span class="top-list--index">{{index+1}}</span>
                                    <span class="top-list--content">
                                         <div class="mb5 flex">
                                        <div class="flex1 text-ellipsis" >
                                            <router-link :to="{'name': 'app.oss.bucket', 'params': {'view': 'overview', 'bucketId': item.id, 'name': item.name}}">{{item.name}}</router-link> 
                                            </div>
                                            <span class="top-list--content__number">{{item.fileNums}}</span>
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
            bucketList: [
                {
                    name: 'zt-bucket001',
                    transferOut: 86,
                    transferIn: 100,
                    use: 24.86,
                    fileNums: 32
                },
                {
                    name: 'zt-bucket002',
                    transferOut: 75,
                    transferIn: 95,
                    use: 16,
                    fileNums: 21
                },
                {
                    name: 'zt-bucket003',
                    transferOut: 50,
                    transferIn: 76,
                    use: 12.15,
                    fileNums: 17
                },
                {
                    name: 'zt-bucket004',
                    transferOut: 32,
                    transferIn: 32,
                    use: 5,
                    fileNums: 12
                },
                {
                    name: 'zt-bucket005',
                    transferOut: 12,
                    transferIn: 5,
                    use: 2,
                    fileNums: 3
                }
            ],
            dataItem:'2',
            form:{
                startTime:'',
                endTime:'',
            }
        };
    },
    computed: {
        requestTop: function() {
            return this.bucketList.slice(0, 5);
            // if(this.bucketList.length > 0){
            //     let bucketList = cloneDeep(this.bucketList);
            //     if (this.methodType === 'PUT') {
            //         bucketList.sort((a, b) => {
            //             return b.hitPut - a.hitPut;
            //         });
            //     } else {
            //         bucketList.sort((a, b) => {
            //             return b.hitGet - a.hitGet;
            //         });
            //     }
            //     return bucketList.slice(0, 5);
            // }
        },
        usedCapTop: function() {
            // if(this.bucketList.length > 0){
            //     let bucketList = cloneDeep(this.bucketList);
            //     bucketList.sort((a, b) => {
            //         return b.usedCap - a.usedCap;
            //     });
            //     return bucketList.slice(0, 5);
            // }
            return this.bucketList.slice(0, 5);
        },
        fileTop: function() {
            // if(this.bucketList.length > 0){
            //     let bucketList = cloneDeep(this.bucketList);
            //     bucketList.sort((a, b) => {
            //         return b.objNum - a.objNum;
            //     });
            //     return bucketList.slice(0, 5);
            // }
            return this.bucketList.slice(0, 5);
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