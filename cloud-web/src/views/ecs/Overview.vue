<template>
    <div class="page-main">
        <div class="page-body pd-top0" v-show="true">
            <div class="width-box" v-loading.fullscreen.lock="loadingShow || fullscreenLoading">
                <!-- 左部分 -->
                <div class="width-box__left" v-if="serverCountShow && !loadingShow">
                    <div :gutter="20" class="width-box__child">
                        <!-- 实例统计信息 -->
                        <div class="width-box__child__left">
                            <div class="panel panel-default mb10 height140">
                                <div class="panel-heading height40" style="height: 40px">
                                    <i class="iconfont icon-shili mr10"></i>{{ $t('common.inst') }}
                                </div>
                                <div class="panel-body">
                                    <el-row :gutter="20">
                                        <el-col :span="v.width" v-for="v in instInfos" :key="v.key">
                                            <div class="panel-item mb5">{{v.text}}</div>
                                            <span v-if="v.params && v.params.state === 'expired' " :class="v.classes" class="color-secondary decoration-none" >{{v.value}}</span>
                                            <router-link v-else  :class="v.classes" :to="{name:v.href,query: {s: v.params ? v.params.state : undefined}}">{{v.value}}</router-link>
                                            <!-- <router-link v-else :class="v.classes" :to="{name: 'app'}">{{v.value}}</router-link> -->
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                        <!-- 快照统计信息 -->
                        <div class="width-box__child__right" >
                            <div class="panel panel-default mb10 height140">
                                <div class="panel-heading height40">
                                    <i class="iconfont icon-kuaizhao mr10"></i>{{ $t('common.snap') }}</div>
                                <div class="panel-body">
                                    <el-row :gutter="20">
                                        <el-col :span="12" v-for="snap in snapInfos" :key="snap.key">
                                            <div class="panel-item">{{snap.text}}</div>
                                            <div :class="snap.classes" v-if="!!snap.unit">{{snap.value}}
                                                <span class="font14 color-secondary" >{{ snap.unit }}</span> 
                                            </div>
                                            <span v-else :class="snap.classes" :to="{name:snap.href,params:snap.params}">{{snap.value}}</span>                                                                       
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- CPU监控、内存监控 -->
                    <div class="tab-box mb20">
                        <div class="tab-box__item" :class="{'tab-box__active': selOption2 === 1}" @click="tabBoxFn(1)">{{ $t('ecs.overview.cpuMonitor') }}</div>
                        <div class="tab-box__item" :class="{'tab-box__active': selOption2 === 2}" @click="tabBoxFn(2)">{{ $t('ecs.overview.memMonitor') }}</div>
                    </div>
                    <!-- CPU监控、内存监控统计状态表 -->
                    <el-row :gutter="15" v-if="!fullscreenLoading" v-loading="monitorLoading">
                        <!-- 最近2小时、最近24小时、最近7天 -->
                        <el-col :span="8" class="count-box text-c" v-for="(item, index) in timeOption" :key="index">
                            <div class="font16 count-box__time">{{item}}</div>
                            <div class="usage-rate">
                                {{ usedRateVal }}
                                <el-popover
                                    placement="top"
                                    trigger="hover">
                                    <span>{{ usedRateVal }}={{ usedRateValTotal }}</span>
                                    <i class="iconfont icon-wuuiconsuotanhao color-secondary" slot="reference"></i>                                    
                                </el-popover>
                            </div>
                            <div style="min-height: 150px;">
                                <charts-liquidfill v-if="optionData[index]" :optionData="optionData[index]" :idString="'myChart' + index"  class="count-box__chart"></charts-liquidfill>
                            </div>
                            <div class="count-box__ranking">{{usedRateRank}}</div>
                            <el-carousel class="count-box__progress"  :style="countHeight" :autoplay="false" trigger="click" :indicator-position="selUsedRate[index] && selUsedRate[index].length > 5 ? 'outside' : 'none'" arrow="never">
                                <el-carousel-item>
                                    <div class="count-box__progress__list">
                                        <div v-if="dex < 5" v-for="(arr,dex) in selUsedRate[index]" :key="dex">
                                            <span>
                                                <div class="text-l">
                                                    <i :class="numIcon[dex]"></i> 
                                                    <span class="ml5">{{arr[0]}}</span>
                                                    <a class="pull-right font12 lh20 color-primary" v-if="parseFloat(arr[1]) >= 80">{{ $t('ecs.overview.goConfigure') }}</a>
                                                </div>
                                                <div class="ml20 mb13 mt4"><zt-progress :ztWidth="16" :ztColor="arr[2]" :percentage="parseFloat(arr[1])"></zt-progress></div>
                                            </span>
                                        </div>
                                        <!-- 暂无数据 -->
                                        <div v-if="selUsedRate[index] && selUsedRate[index].length === 0" v-for="m in maxHostNum" :key="m">
                                            <div class="text-l">
                                                <i :class="numIcon[m-1]" class="color-secondary"></i> 
                                                <span class="ml5 color-secondary font12">暂无数据</span>
                                            </div>
                                            <div class="ml20 mb13 mt4"><zt-progress :ztWidth="16" :percentage="0"></zt-progress></div>
                                        </div>                                 
                                    </div>
                                </el-carousel-item>
                                <el-carousel-item v-if="selUsedRate[index] && selUsedRate[index].length > 5">
                                    <div class="count-box__progress__list">
                                        <div v-if="dex >= 5" v-for="(arr,dex) in selUsedRate[index]" :key="dex">
                                            <div class="text-l">
                                                <i :class="numIcon[dex]"></i> 
                                                <span class="ml10">{{arr[0]}}</span>
                                                <a class="pull-right font12 lh20 color-primary" v-if="parseFloat(arr[1]) >= 80" >{{ $t('ecs.overview.goConfigure') }}</a>
                                            </div>
                                            <div class="ml20 mt4 mb13"><zt-progress :ztWidth="16" :ztColor="arr[2]" :percentage="parseFloat(arr[1])"></zt-progress></div>
                                        </div>                                   
                                    </div>
                                </el-carousel-item>
                            </el-carousel>
                        </el-col>
                    </el-row>
                </div>
                <!-- 无云主机显示页面 -->
                <div class="width-box__left" v-if="!serverCountShow && !loadingShow">
                    <!-- 立即创建 -->
                    <div class="host-head">
                        <img src="@/assets/images/ecs/overview/ecs_host_head.png" class="host-head__img" alt="">
                        <div class="host-head__desc">
                            <div class="host-head__desc__title">{{ $t('ecs.overview.noHost.descTitle') }}</div>
                            <div class="host-head__desc__tip font12">{{ $t('ecs.overview.noHost.descTip') }}</div>
                            <button class="host-head__desc__btn" @click="createInst">{{ $t('ecs.overview.noHost.createNow') }}</button>
                        </div>
                        
                    </div>
                    <!-- 主机优势 -->
                    <div class="advantage mt20">
                        <div class="advantage__title">
                            <span class="font14 is-bold" >{{ $t('ecs.overview.noHost.advantageTitle') }}</span>
                            <a class="pull-right font12" >{{ $t('common.seeMore') }}</a>
                        </div>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <div class="text-c advantage-item">
                                    <img src="@/assets/images/ecs/overview/ecs_host_01.svg" width="45" alt="">
                                    <div class="advantage-item__title font14 mt15">{{ $t('ecs.overview.noHost.rubberSheet') }}</div>
                                    <div class="advantage-item__desc font12">{{ $t('ecs.overview.noHost.rubberSheetDesc') }}</div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="text-c advantage-item">
                                    <img src="@/assets/images/ecs/overview/ecs_host_02.svg" width="45" alt="">
                                    <div class="advantage-item__title font14 mt15">{{ $t('ecs.overview.noHost.dilatation') }}</div>
                                    <div class="advantage-item__desc font12">{{ $t('ecs.overview.noHost.dilatationDesc') }}</div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="text-c advantage-item">
                                    <img src="@/assets/images/ecs/overview/ecs_host_03.svg" width="45" alt="">
                                    <div class="advantage-item__title font14 mt15">{{ $t('ecs.overview.noHost.networkSDN') }}</div>
                                    <div class="advantage-item__desc font12">{{ $t('ecs.overview.noHost.networkSDNDesc') }}</div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <div class="text-c advantage-item">
                                    <img src="@/assets/images/ecs/overview/ecs_host_04.svg" width="45" alt="">
                                    <div class="advantage-item__title font14 mt15">{{ $t('ecs.overview.noHost.HA') }}</div>
                                    <div class="advantage-item__desc font12">{{ $t('ecs.overview.noHost.HADesc') }}</div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="text-c advantage-item">
                                    <img src="@/assets/images/ecs/overview/ecs_host_05.svg" width="45" alt="">
                                    <div class="advantage-item__title font14 mt15">{{ $t('ecs.overview.noHost.omnibearing') }}</div>
                                    <div class="advantage-item__desc font12 mt5">{{ $t('ecs.overview.noHost.omnibearingDesc') }}</div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="text-c advantage-item">
                                    <img src="@/assets/images/ecs/overview/ecs_host_06.svg" width="45" alt="">
                                    <div class="advantage-item__title font14 mt15">{{ $t('ecs.overview.noHost.efficiency') }}</div>
                                    <div class="advantage-item__desc font12">{{ $t('ecs.overview.noHost.efficiencyDesc') }}</div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="width-box__right" v-if="!loadingShow">
                    <product :height="rightHeight" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Product from '@/components/product/Index.vue';
import { getServerCount,getVolumeCount} from '@/service/ecs/overview';
import { moniterEchartMetricData } from '@/service/ecs/monitor.js';
import { getNetwork,getSubnetByNetId } from '@/service/ecs/network.js';
import { isEmpty } from '@/utils/utils';

import ChartsLiquidfill from '@/components/charts/ChartsLiquidfill.vue';
import ZtProgress from '@/components/ZTProgress/Progress.vue';

export default {
    name: 'Overview',
    data() {        
        //实例信息
        let searchObj_cpu = {
            dataType:'cpu',
            netid:'',
            subnetid:'',
            searchText:''
        };

        let searchObj_mem = {
            dataType:'mem',
            netid:'',
            subnetid:'',
            searchText:''
        };

        let instHref = 'app.ecs.list';
        let fromstate = 'app.ecs.overview';
        let inst_params_active = {fromstate:fromstate,state:'ACTIVE'};
        let inst_params_expired = {fromstate:fromstate,state:'expired'};

        let instInfos = [
            { key:'totalCount',text:this.$t('ecs.overview.total'),value:0,width:7,href:instHref, classes:'default'},
            { key:'runing',text:this.$t('common.state.running'),value:0,width:6,href:instHref, params:inst_params_active, classes:'highgreen'},
            { key:'nearExpired',text:this.$t('ecs.overview.loophole'),value:0,width:6,href:instHref, params:inst_params_expired, classes:'highred'},
            { key:'expiredEcs',text:this.$t('ecs.overview.baselineCheck'),value:0,width:5,href:instHref, params:inst_params_expired, classes:'highred'},
        ];
        //快照信息
        let snapInfos = [
            { key:'snapshotsSize',text:this.$t('ecs.overview.snapCapacity'),value:0,href:'',classes:'default',unit:'GiB'},
            { key:'snapshotsNum',text:this.$t('ecs.overview.total'),value:0,href:'app.ecs.snaplist',classes:'default'},   
        ];
        // 数字图标字体
        let numIcon = [
            'iconfont icon-icon-text1',
            'iconfont icon-icon-text2',
            'iconfont icon-icon-text3',
            'iconfont icon-icon-text4',
            'iconfont icon-icon-text5',
            'iconfont icon-icon-text6',
            'iconfont icon-icon-text7',
            'iconfont icon-icon-text8',
            'iconfont icon-icon-text9',
            'iconfont icon-icon-text10',
        ];
        let timeOption = [
            this.$t('ecs.overview.latelyOneHour'), 
            this.$t('ecs.overview.latelyfullHour'), 
            this.$t('ecs.overview.latelysevenDay')];
        return {         
            searchObj_cpu,
            searchObj_mem,            
            instInfos,
            snapInfos,
            timeOption,
            fullscreenLoading: false,
            loadingShow: true,
            cpuUsedRate: [],
            memUsedRate: [],         
            nets:[],
            subnets:[],
            selOption: 1,
            selOption2: 1,
            serverCountShow: true,
            rightHeight: 400, // 右侧产品动态高度   
            numIcon,
            noDataArray: [0, 1, 2, 3, 4]    
        };
    },
    components: {
        Product,
        ChartsLiquidfill,
        ZtProgress
    },
    computed: {
        selUsedRate() {
            if (this.selOption === 0) {
                return [];
            }
            return this.selOption === 1 ? this.cpuUsedRate : this.memUsedRate;
        },
        monitorLoading() {
            return this.selUsedRate.length === 0;
        },
        optionData() {
            let retArray = [];
            for(let x in this.selUsedRate) {
                let num = 0;
                for (let a in this.selUsedRate[x]){
                    num += parseFloat(this.selUsedRate[x][a][1]);

                }
                if( num === 0) {
                    retArray.push({ratio: [0]});
                    continue;
                }
                retArray.push({ratio: [((num / this.selUsedRate[x].length) / 100).toFixed(4)]});
            }
            return retArray;
        },
        usedRateVal() {
            return this.selOption === 1 ? this.$t('ecs.overview.cpuUsageRate') : this.$t('ecs.overview.memUsageRate');
        },
        usedRateRank() {
            return this.selOption === 1 ? this.$t('ecs.overview.cpuUsageRateRank') : this.$t('ecs.overview.memUsageRateRank');
        },
        usedRateValTotal() {
            return this.selOption === 1 ? this.$t('ecs.overview.allUsageRateCpuDesc') : this.$t('ecs.overview.allUsageRateMemDesc');
        },
        // 计算高度
        countHeight(){
            return {
                'height': this.maxHostNum * 52 + 'px'
            };
        },
        // 
        maxHostNum() {
            let maxLength = 0;
            for(let x in this.selUsedRate) {
                maxLength = this.selUsedRate[x].length > maxLength ? this.selUsedRate[x].length : maxLength;
            }
            if (maxLength === 0){
                maxLength = 5;
            }
            return maxLength;
        }
    },
    methods: {
        //获取实例统计信息
        getInstInfos: function () { 
            this.loadingShow = true;
            getServerCount().then((res) => {            
                if(res && res.result){
                    let respData = res.result;
                    if(!isEmpty(respData)){
                        this.serverCountShow = true;
                        this.instInfos.forEach( (item) => {
                            item.value = respData.allEcs[item.key];
                        });
                    } else {
                        this.serverCountShow = false;
                    }
                    this.loadingShow = false;                   
                }     
            });
        },
        //获取快照统计信息
        getSnapInfos: function () {  
            getVolumeCount().then((res) => {
                if(res && res.result){
                    let respData = res.result;
                    if(!isEmpty(respData)){
                        this.snapInfos.forEach( (item) => {
                            item.value = respData.allDisk[item.key];
                        });
                    }                    
                }   
            });
            
        },

        //获取图表数据
        searchEachars: function(searchobj, time){       
            let now = new Date();
            let st = new Date(now);
            st.setMinutes(now.getMinutes() - time); 
            let filters = this.$options.filters;  
            let data = {
                startTime: filters['date'](st,'YYYY-MM-DD HH:mm:ss'),
                endTime: filters['date'](now,'YYYY-MM-DD HH:mm:ss'),
                dataType: searchobj.dataType, //'cpu','mem'
                nameOrIp: searchobj.searchText,
                vpcId: searchobj.netid,
                subnetId: searchobj.subnetid,
                instanceType: 'ecs',
                searchAllEcs: 'true'
            };
            moniterEchartMetricData(data)
                .then( (res) => {
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE){
                        let datas = res.result || [];    
                        let top5IpDatas = datas[1]; //top5数据
                        
                        for (let d in top5IpDatas) {
                            let ret = top5IpDatas[d][1];
                            switch (true) {
                                case ret >= 0 && ret < 40:
                                    top5IpDatas[d].push('#009900');
                                    break;
                                case ret >= 40 && ret < 80:
                                    top5IpDatas[d].push('#f68300');                                
                                    break;
                                case ret >= 80:
                                    top5IpDatas[d].push('#f40000');
                            }
                        }
                        switch(searchobj.dataType){
                            case 'cpu':{ 
                                this.cpuUsedRate.push(top5IpDatas);                  
                                break;
                            }
                            case 'mem':{
                                this.memUsedRate.push(top5IpDatas);                            
                                break;
                            }
                            default:{}
                        }
                    }
                })
                .catch((err) => {
                    $log('获取图表数据失败', err);
                });             
        },

        //获取所有网络（参数为空时查询全部）
        getNetworkAll: function () {  
            return getNetwork()
                .then((res) => {
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE){
                        let resData = res.result;
                        if(resData && resData.records){
                            this.nets = resData.records || [];   
                            console.log('nets:::::',this.nets);
                        }                                            
                    }                  
                })
                .catch( err => {
                    this.nets = [];
                    console.log('Error', err);
                });            
        },

        //通过网络id获取子网
        getSubnetByNetId: function (networkId) {  
            if(typeof networkId === 'undefined') return;
            getSubnetByNetId( networkId )
                .then((res) => {
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE){                          
                        let resData = res.result;
                        if(resData && resData.records){
                            this.subnets = resData.records || [];   
                            console.log('subnets:::::',this.subnets);
                        }                 
                    }                  
                })
                .catch( err => {
                    this.subnets = [];
                    console.log('Error', err);
                }); 
        },

        //切换vpc网络
        changeVpcNet:function (networkId) {
            this.getSubnetByNetId(networkId);
        },

        //切换子网
        changeSubnet:function (params) {
            
        },
        // CPU监控 内存监控切换
        tabBoxFn(type) {
            this.selOption = 0;
            this.selOption2 = type;
            setTimeout(() => {
                this.selOption = type;
            },500);
        },
        // CPU 数据
        async getAllCpuData() {
            this.fullscreenLoading = true;
            await this.searchEachars(this.searchObj_cpu, 120);
            await this.searchEachars(this.searchObj_cpu, 1440);
            await this.searchEachars(this.searchObj_cpu, 10080);
        },
        // mem 数据
        async getAllMemData() {
            await this.searchEachars(this.searchObj_mem, 120);
            await this.searchEachars(this.searchObj_mem, 1440);
            await this.searchEachars(this.searchObj_mem, 10080);
        },
        createInst() {
            this.$router.push({
                name: 'app.ecs.create'
            });
        },

    },

    async mounted () {
        this.getInstInfos();
        this.getSnapInfos();
        this.getNetworkAll();
        await this.getAllCpuData();
        await this.getAllMemData();
        setTimeout(() =>{
            this.fullscreenLoading = false;
        }, 500);
        
    }
};
</script>
<style scoped lang="scss">
.panel{
    .panel-item{
        color: #999;
        font-size: 12px;
    }
    .panel-body{
        padding: 17px 0px 15px 28px;
    }
    .default{
        color: #333;
        font-size: 36px;
    }
    .highgreen{
        color: #090;
        font-size: 36px;
    }
    .highred{
        color: red;
        font-size: 36px;
    }
}
.width-box{
    width:100%;
    display: flex;
    &__left{
        width:73.2%; 
        float:left;
        padding-right: 20px;
    }
    &__right{
        width:26.8% ;
        float:left;
    }
    &__child{
        width:100%;
        height:140px;
        &__left{
            width:61.2%; 
            float:left; 
            padding-right: 20px;
        }
        &__right{
            width:38.8%;
            float:left;
        }
        .height140{
            height: 140px;
        }
        .height40{
            height: 40px;
        }
    }
    &:after{
        content: '';
        display: block;
        clear: both;
    }
}
.tab-box{
    width: 100%;
    height: 39px;
    line-height: 39px;
    margin-top: 12px;
    border-bottom: 1px solid #ddd;
    &__item{
        float: left;
        width: 100px;
        height: 39px;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
    }
    &__active{
        background: #fff;
        border: 1px solid #ddd;
        border-top: 2px solid #0d7ef2;
        border-bottom: 0;
    }
}
.count-box{
    &__time{
        text-align: center;
        background: rgb(230,242,254);
        font-weight: 600;
        height: 40px;
        line-height: 42px;
    }
    &__chart{
        display:flex;
        justify-content: center;
    }
    &__ranking{
        padding: 13px 10px 6px 0;
        border-top: 1px dashed #999;
    }
    &__progress{
        width: 100%;
        padding: 0 25px;
        position: relative;
        overflow: hidden;
        &__list{
            width: 100%;
            position: absolute;
            margin:0 auto;
            b{
                font-weight: 900;
            }
            .mb13{
                margin-bottom: 13px !important;
            }
            .mt4{
                margin-top: 4px !important;
            }
        }
    }
    .usage-rate{
        height:27px;
        line-height: 45px;
    }
}
.usage-rate span:hover i{
    color: #0d7ef2 !important;
    cursor: pointer;
}
.host-head{
    position: relative;
    color: #fff;
    height: 208px;
    &__desc{
        position: absolute;
        right: 59px;
        top: 50%;
        margin-top: -48px;
        &__title{
            font-size: 22px;
        }
        &__tip{
            margin-top: 3px;
        }
        &__btn{
            background-color: transparent;
            border: 1px solid #fff;
            font-size: 12px;
            width: 80px;
            height: 32px;
            line-height: 30px;
            margin-top: 12px;
        }
    }
    .host-head__desc__btn:hover {
        color: #0d7ef2;
        background-color: #fff;
    }
    .host-head__img {
        object-fit: cover;
        display: block;
        height: 100%;
        width: 100%;
    }
}
.advantage{
    border: solid 1px #d1d4d8;
    padding: 13px 10px;
    &__title{
        padding: 0 9px;
    }
    .advantage-item{
        padding: 38px 30px 0 28px;
        &__desc{
            line-height: 20px;
            margin-top: 3px;
            margin-bottom: 1px;
        }
    }
}
</style>
