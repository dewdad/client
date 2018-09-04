<template>
    <div>
        <!-- 头部 -->
        <span class="mr10">概览：</span>
        <el-select v-model="value" size="small" key="id" value-key="name" placeholder="请选择" @change="changeDeptlist(value)">
            <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
            </el-option>
        </el-select>
        <el-row :gutter="20" style="margin:20px 0;">
            <el-col :span="8">
               <div class="block-con first">
                   <div>
                       <div>
                           <p class="">已使用{{overview.totalInstancesUsed || 0}}个</p>
                           <p>共 {{overview.maxTotalInstances}}个</p>
                       </div>
                       <img src="@/assets/images/hoster.png" width="88">
                   </div>
                   <div class="subCon">
                      主机
                   </div>
               </div>
            </el-col>
            <el-col :span="8" v-if="overview.totalNetworkUsed != null || overview.maxTotalNetwork != null">
                <div class="block-con second">
                    <div>
                        <div>
                            <p class="">已使用{{overview.totalNetworkUsed || 0}}个</p>
                            <p>共 {{overview.maxTotalNetwork}}个</p>
                        </div>
                        <img src="@/assets/images/network.png" width="88">
                    </div>
                    <div class="subCon">
                        网络
                    </div>
                </div>
            </el-col>
            <el-col :span="8" v-if="overview.totalRouterUsed != null || overview.maxTotalRouter != null">
                <div class="block-con third">
                    <div>
                        <div>
                            <p class="">已使用{{overview.totalRouterUsed || 0}}个</p>
                            <p>共 {{overview.maxTotalRouter}}个</p>
                        </div>
                        <img src="@/assets/images/router.png" width="88">
                    </div>
                    <div class="subCon">
                        路由器
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
             <el-col :span="6" class="con">
                 <div class="otitle">
                     CPU
                     <span>
                       已使用{{overview.totalCoresUsed || 0}}个
                   </span>
                 </div>
                 <div class="charContainer" id="cpu">
                    <p>
                        <span></span>
                    </p>
                 </div>
             </el-col>
             <el-col :span="6"  class="con">
                 <div class="otitle">
                     内存
                     <span>
                       已使用{{overview.totalRamUsed || 0}}
                   </span>
                 </div>
                 <div class="charContainer" id="ram">

                 </div>
             </el-col>
             <el-col :span="6"  class="con">
                 <div class="otitle">
                     磁盘容量
                     <span>
                       已使用{{overview.totalVolumeSizeUsed || 0}}
                   </span>
                 </div>
                 <div class="charContainer" id="VirtualHard">

                 </div>
             </el-col>
             <el-col :span="6"  class="con">
                 <div class="otitle">
                     数据磁盘
                     <span>
                       已使用{{overview.totalVolumesUsed || 0}}个
                   </span>
                 </div>
                 <div class="charContainer" id="hardDisk">

                 </div>
             </el-col>
        </el-row>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import PageHeader from '@/components/pageHeader/PageHeader';
import {getDeptList} from '@/service/overview.js';
export default {
    name: 'app',
    data() {
        return {
            options:[

            ],
            deptData:[],
            value: '本部门',
            queryDepObj:{
                pageIndex: 1,
                limit: 10,
                total: 0,
            },
            optionObj:{
                dept:null
            },
            overview:{},
            cpuUsedRate: [],
            ramUsedRate: [],
            VirtualHardUsedRate: [],
            hardDiskUsedRate: [],
        };
    },
    components: {
        PageHeader
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods:{
        calcChart(documentId,data1,data2,name) {
            let thisdom = document.getElementById(documentId);
            let myChart = this.$echarts.init(thisdom);
            let option = {
                color:['#4895d7','#d7dde4'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    y: 'bottom',
                    itemWidth:6,
                    itemHeight:6
                },
                grid: {
                    top:'3%',
                    left: '3%',
                    right: '3%',
                    bottom: '5%',
                    containLabel: true
                },
                series: [
                    {
                        name:name,
                        type:'pie',
                        radius: ['30%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'top'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:data2
                    }
                ]
            };
            myChart.setOption(option);
            thisdom = null;
        },
        setLegendData(used,totals,type) {
            let unused = totals - used,val,val2;
            if(type === 0){
                val = unused;
            }else if( type === 1){
                val = this.calcRamSize(unused);
            }else{
                val = this.calcHardDiskSize(unused);
            }
            if(type === 0){
                val2 = used;
            }else if( type === 1){
                val2 = this.calcRamSize(used);
            }else{
                val2 = this.calcHardDiskSize(used);
            }

            return ['已使用：' + val, '未使用：' + val2 ];
        },

        setSeriesData(used,totals,type) {
            let unused = totals - used,val1,val2;
            if(type === 0){
                val1 = unused;
            }else if( type === 1){
                val1 = this.calcRamSize(unused);
            }else{
                val1 = this.calcHardDiskSize(unused);
            }
            if(type === 0){
                val2 = used;
            }else if( type === 1){
                val2 = this.calcRamSize(used);
            }else{
                val2 = this.calcHardDiskSize(used);
            }
            let out = [
                { value: used, name: '已使用：' + val1 },
                { value: unused, name: '未使用：' + val2 }
            ];
            return out;
        },
        calcRamSize(size) {
            if (!size) {
                return '0';
            }
            if (size > 0) {
                if (size < 1024) {
                    return size + 'MB';
                } else if (size < 1024 * 1024) {
                    return (size / 1024) + 'GB';
                } else {
                    return (size / (1024 * 1024)) + 'TB';
                }
            }
            return size.toString();
        },
        calcHardDiskSize(size) {
            if (!size) {
                return '0';
            }
            if (size > 0) {
                if (size < 1024) {
                    return size + 'MB';
                } else if (size < 1024 * 1024) {
                    return (size / 1024) + 'GB';
                } else {
                    return (size / (1024 * 1024)) + 'TB';
                }
            }
            return size.toString();
        },
        changeDeptlist(value){
            this.optionObj.dept = value;
            this.queryDeptlist();
        },
        queryDeptlist() {
            let param = {};
            if (this.optionObj.dept) {
                param.deptId = this.optionObj.dept.id;
            }
            console.log('param',param);
            getDeptList(param).then(ret => {
                $log('queryNetworkByID', ret);
                let data = ret.data;
                if(this.options.length === 0) this.options = data.deptList;
                console.log('this.options',this.options);
                if (this.options && this.options.length > 0){
                    let roleType = parseInt(this.user.roleType);
                    if (roleType === 1) {
                        this.optionObj.dept = this.options[0];
                    } else {
                        // this.options.splice(0,0,{'name': '本部门'});
                        this.optionObj.dept = this.options[0] ;
                    }
                }
                let quota = data.quota;
                let usages = data.usages;

                if (quota != null && usages != null) {
                //配额
                //cpu--数量
                    this.calcChart('cpu', this.setLegendData(usages.cores, quota.cpu, 0), this.setSeriesData(usages.cores, quota.cpu, 0), 'CPU');
                    //内存-GB
                    this.calcChart('ram', this.setLegendData(usages.ram, quota.ram, 1), this.setSeriesData(usages.ram, quota.ram, 1), '内存');
                    // 数据磁盘--卷数量
                    this.calcChart('VirtualHard', this.setLegendData(usages.volumes, quota.volumes, 0), this.setSeriesData(usages.volumes, quota.volumes, 0), '数据磁盘');
                    // 磁盘容量--卷容量
                    this.calcChart('hardDisk', this.setLegendData(usages.gigabytes, quota.volumeSize, 2), this.setSeriesData(usages.gigabytes, quota.volumeSize, 2), '磁盘容量');

                    this.overview.maxTotalInstances = quota.instances;//实例
                    this.overview.maxTotalNetwork = quota.network;////网络
                    this.overview.maxTotalRouter = quota.routers;//路由器
                    this.overview.totalInstancesUsed = usages.instances;//实例
                    this.overview.totalNetworkUsed = usages.network;//网络
                    this.overview.totalRouterUsed = usages.router;//路由器
                    this.overview.totalCoresUsed = usages.cores;//cpu-数量
                    this.overview.totalRamUsed = this.calcRamSize(usages.ram);//内存-GB
                    this.overview.totalVolumesUsed = usages.volumes;//卷数量
                    this.overview.totalVolumeSizeUsed = this.calcHardDiskSize(usages.gigabytes);//卷容量
                } else if (usages != null) {
                    //已使用
                    this.overview.totalInstancesUsed = usages.instances;//实例
                    this.overview.totalNetworkUsed = usages.network;//网络
                    this.overview.totalRouterUsed = usages.router;//路由器
                    this.overview.totalCoresUsed = usages.cores;//cpu-数量
                    this.overview.totalRamUsed = this.calcRamSize(usages.ram);//内存-GB
                    this.overview.totalVolumesUsed = usages.volumes;//卷数量
                    this.overview.totalVolumeSizeUsed = this.calcHardDiskSize(usages.gigabytes);//卷容量
                } else if (quota != null) {
                    //配额
                    this.overview.maxTotalInstances = quota.instances;//实例
                    this.overview.maxTotalCores = quota.cpu;//cpu数量
                    this.overview.maxTotalRAMSize = this.calcRamSize(quota.ram);//内存-GB
                    this.overview.maxTotalNetwork = quota.network;////网络
                    this.overview.maxTotalRouter = quota.routers;//路由器
                    this.overview.maxTotalVolumes = quota.volumes;//卷数量
                    this.overview.maxTotalVolumeGigabytes = this.calcHardDiskSize(quota.volumeSize);//卷容量
                } else {

                }
            }
            );
        }
    },
    mounted() {
        this.queryDeptlist();
    }
};
</script>
<style scoped  lang="scss">
    .block-con{

        overflow: hidden;
        p{
            color:#fff;
            font-size:24px;
        }
        & p+p{
            font-size:16px;
        }
        &>div{
            overflow: hidden;
            &>div{
                margin-top:10px;
                float: left;
            }
            padding:20px;
        }
        img{
            float:right;
        }
        .subCon{
            height:auto;
            padding:8px 20px;
            color:#fff;
        }
    }
    .block-con.first{
        .subCon{
            background-color:#408ed1
        }
        background-color: #4895d7;
    }
    .block-con.second{
        .subCon{
            background-color:#2dbcc8
        }
        background-color: #32c5d2;
    }
    .block-con.third{
        .subCon{
            background-color:#ea8917
        }
        background-color: #f18f1c;
    }
    .otitle{
        height:44px;
        line-height:44px;
        padding:0 15px;
        border: 1px solid #d1d5de;
        border-bottom: 0;
    }
    .otitle span{
        color: #93a4b8;
        font-size: 14px;
        float: right;
    }
    .charContainer{
        width:100%;
        min-height:230px;
        border: 1px solid #d1d5de;
    }
</style>
