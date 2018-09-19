<template>
    <div class="page-main">
        <div style="padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #e8e8e8;">
            <el-button  icon="el-icon-arrow-left" @click="goBack" size="small">返回</el-button>
            <span class="ml20 font16">主机详情</span>
        </div>
        <div class="page-body">
            <el-row>
                <el-col :span="12" class="clearfix">
                    <div class="pull-left">
                        <img src="@/assets/images/cloud_detail.png" alt="" width="48">
                    </div>
                    <div class="pull-left ml10">
                        <h3 class="mb5">{{item.name}}</h3>
                        <p class="font12">
                            创建时间：{{item.created | date}}
                            <span class="ml20">状态：
                                {{getStatusText(item.status)}}
                            </span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <el-form :inline="true" size="small">
                        <el-form-item>
                            <el-button type="primary" @click="goBack()">
                                <span class="iconfont icon-chaolianjie font12"></span>  远程连接</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="goBack()">
                                <span class="iconfont icon-dashboard_icon_peop3 font12"></span> 开机</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary"  @click="goBack()">
                                <span class="iconfont icon-tingzhi font12"></span>  关机</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="goBack()">
                                <span class="iconfont icon-zhongqi font12"></span>  重启</el-button>
                        </el-form-item>
                        <el-form-item class="pull-right">
                            <el-button type="primary" class=" icon-zt_refresh" @click="setOrigin"></el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
           <div class="main">
               <el-row :gutter="20">
                   <el-col :span="12" >
                       <div class="detail-box mt50">
                           <div class="top clearfix">
                               <div class="pull-left img">
                                  <em class=" iconfont icon-user_profile_people"></em>
                               </div>
                               <div class="pull-left ml10">
                                   <span>基本信息</span>
                               </div>
                           </div>
                           <div class="main">
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       ID：
                                   </el-col>
                                   <el-col :span="18">
                                       {{item.id}}
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       可用域：
                                   </el-col>
                                   <el-col :span="18">
                                       {{host.zone || ''}}
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       创建后的时间：
                                   </el-col>
                                   <el-col :span="18">
                                        {{timediff(item.created)}}
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       主机：
                                   </el-col>
                                   <el-col :span="18">
                                         {{host.hostname || ''}}
                                   </el-col>
                               </el-row>
                           </div>
                       </div>
                       <div class="detail-box mt20">
                           <div class="top clearfix">
                               <div class="pull-left img">
                                   <em class=" iconfont icon-user_setting_people"></em>
                               </div>
                               <div class="pull-left ml10">
                                   <span>配置信息</span>
                               </div>
                           </div>
                           <div class="main">
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       资源模板名称：
                                   </el-col>
                                   <el-col :span="18">
                                        {{item.flavor.name}}
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       资源模板ID：
                                   </el-col>
                                   <el-col :span="18">
                                       {{item.flavor.flavorid}}
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       内存：
                                   </el-col>
                                   <el-col :span="18">
                                       {{item.flavor.memory_mb === '' ? '-' : item.flavor.memory_mb/1024}}GB
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       CPU数量：
                                   </el-col>
                                   <el-col :span="18">
                                       {{item.flavor.vcpus === '' ? '-' : item.flavor.vcpus}} VCPU
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       IP：
                                   </el-col>
                                   <el-col :span="18">
                                       <div v-for="(name,val) in item.addresses.addresses" :key="name[0].address">
                                           <p>{{val}}</p>
                                           <p>{{name[0].address}}</p>
                                       </div>

                                   </el-col>
                               </el-row>
                           </div>
                       </div>
                       <div class="detail-box mt20">
                           <div class="top clearfix">
                               <div class="pull-left img">
                                   <em class=" iconfont icon-security_people"></em>
                               </div>
                               <div class="pull-left ml10">
                                   <span>安全信息</span>
                               </div>
                           </div>
                           <div class="main">
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       安全组：
                                   </el-col>
                                   <el-col :span="18">
                                       <el-row v-for="group in safeGroup" :key="group.id">
                                           <el-col :span="7">
                                               {{group.name}}
                                           </el-col>
                                           <el-col :span="17">
                                               <div v-for="rule in group.security_group_rules" :key="rule.id">
                                                    <span>允许{{rule.direction=='egress'?'出方向':'入方向'}}&nbsp;{{rule.ethertype}}&nbsp; {{rule.protocol}} &nbsp;{{rule.port_range_min}}&nbsp;{{rule.port_range_min?"-":""}}&nbsp;{{rule.port_range_max}}&nbsp; {{rule.remote_group_id?'default':rule.remote_ip_prefix}}</span>
                                               </div>
                                           </el-col>
                                       </el-row>
                                   </el-col>
                               </el-row>
                               <el-row class="listitem">
                                   <el-col :span="6" class="title">
                                       密钥对：
                                   </el-col>
                                   <el-col :span="18">
                                       {{host.keyname===''?'':host.keyname}}
                                   </el-col>
                               </el-row>
                           </div>
                       </div>
                       <div class="detail-box mt20">
                           <div class="top clearfix">
                               <div class="pull-left img">
                                   <em class=" iconfont icon-oss_people"></em>
                               </div>
                               <div class="pull-left ml10">
                                   <span>磁盘信息</span>
                               </div>
                           </div>
                           <div class="main">
                               <div class=" mb10">概览</div>
                               <div class="ml40">
                                   <el-row class="listitem">
                                       <el-col :span="6" class="title">
                                           名称：
                                       </el-col>
                                       <el-col :span="18">
                                           {{volume.name}}
                                       </el-col>
                                   </el-row>
                                   <el-row class="listitem">
                                       <el-col :span="6" class="title">
                                           ID：
                                       </el-col>
                                       <el-col :span="18">
                                           {{volume.id}}
                                       </el-col>
                                   </el-row>
                                   <el-row class="listitem">
                                       <el-col :span="6" class="title">
                                           磁盘类型：
                                       </el-col>
                                       <el-col :span="18">
                                           {{volume.volumeTag=='root'?'系统磁盘':'数据磁盘'}}
                                       </el-col>
                                   </el-row>
                                   <el-row class="listitem">
                                       <el-col :span="6" class="title">
                                           挂载点：
                                       </el-col>
                                       <el-col :span="18">
                                            <p v-for="attachment in volume.attachments" :key="attachment.id">
                                                <span>{{attachment.device}}</span>
                                            </p>
                                       </el-col>
                                   </el-row>
                               </div>
                               <div class="mt10 mb10">规格</div>
                               <div class="ml40">
                                   <el-row class="listitem">
                                       <el-col :span="6" class="title">
                                           大小：
                                       </el-col>
                                       <el-col :span="18">
                                           {{volume.size}}GB
                                       </el-col>
                                   </el-row>
                                   <el-row class="listitem">
                                       <el-col :span="6" class="title">
                                           可启动：
                                       </el-col>
                                       <el-col :span="18">
                                           {{volume.bootable ? '是':'否'}}
                                       </el-col>
                                   </el-row>
                                   <el-row class="listitem">
                                       <el-col :span="6" class="title">
                                           创建时间：
                                       </el-col>
                                       <el-col :span="18">
                                           {{volume.created_at | date}}

                                       </el-col>
                                   </el-row>
                               </div>
                           </div>
                       </div>
                   </el-col>
                   <el-col :span="12" >
                       <div class="detail-box mt50">
                           <div class="top clearfix">
                               <div class="pull-left img">
                                   <em class=" iconfont icon-monitor_people"></em>
                               </div>
                               <div class="pull-left ml10">
                                   <span>监控信息</span>
                               </div>
                           </div>
                           <div class="main">
                               <div class="clearfix">
                                   <div class="font16 mt10 pull-left">cpu使用率</div>
                                   <el-button-group class="pull-right">
                                       <el-button  :class="{'btnChosen':cpuBtn == '1h'}"   @click="searchMetric('1h','cpu')">1小时</el-button>
                                       <el-button   :class="{'btnChosen':cpuBtn == '6h'}" @click="searchMetric('6h','cpu')">6小时</el-button>
                                       <el-button  :class="{'btnChosen':cpuBtn == '12h'}" @click="searchMetric('12h','cpu')">12小时</el-button>
                                       <el-button  :class="{'btnChosen':cpuBtn == '1d'}" @click="searchMetric('1d','cpu')">1天</el-button>
                                   </el-button-group>
                               </div>
                               <div id="cpu" style="height: 320px;" class="mt10">
                                   <echarts-line v-if="xData_cpu.length > 0"
                                                 :legendData="legendData_cpu"
                                                 :seriesData="seriesData_cpu"
                                                 :lineStyle="lineStyle_cpu"
                                                 :areaStyle="areaStyle_cpu"
                                                 :xAxisData="xData_cpu"
                                                 :xType="xType"
                                                 :markPointSymbolSize="['158','55']"
                                                 :mouldColor="['#0d7ef2','#3ac76c', '#61a0a8', '#c4ccd3']"
                                                 :dotStyle="['dbecfd']"
                                                 :idString="'mychart_cpu'">
                                   </echarts-line>
                                   <div v-else class="content"><span class="text color-secondary">暂无数据</span></div>
                               </div>
                           </div>
                           <div class="main">

                               <div class="clearfix">
                                   <div class="font16 mt10 pull-left">内存使用率</div>
                                   <el-button-group class="pull-right" size="small">
                                       <el-button :class="{'btnChosen':memBtn == '1h'}"  @click="searchMetric('1h','mem')">1小时</el-button>
                                       <el-button  :class="{'btnChosen':memBtn == '6h'}"  @click="searchMetric('6h','mem')">6小时</el-button>
                                       <el-button :class="{'btnChosen':memBtn == '12h'}"  @click="searchMetric('12h','mem')">12小时</el-button>
                                       <el-button :class="{'btnChosen':memBtn == '1d'}"  @click="searchMetric('1d','mem')">1天</el-button>
                                   </el-button-group>
                               </div>
                               <div id="ram" style="height: 320px;" class="mt10">
                                   <echarts-line v-if="xData_mem.length > 0"
                                                 :legendData="legendData_mem"
                                                 :seriesData="seriesData_mem"
                                                 :lineStyle="lineStyle_mem"
                                                 :areaStyle="areaStyle_mem"
                                                 :xAxisData="xData_mem"
                                                 :xType="xType"
                                                 :markPointSymbolSize="['150','55']"
                                                 :mouldColor="['#3ac76c', '#0d7ef2', '#61a0a8', '#c4ccd3']"
                                                 :dotStyle="['b0e9c4']"
                                                 :idString="'mychart_mem'">

                                   </echarts-line>
                                   <div v-else class="content"><span class="text color-secondary">暂无数据</span></div>
                               </div>
                           </div>
                       </div>
                   </el-col>
               </el-row>
           </div>
        </div>
    </div>
</template>

<script>
// import {createUser} from '@/service/usermgr/deptmgr.js';
import EchartsLine from '@/components/charts/EchartsLine';
import {getHostItem,getHostItemDetail,showVolumeDetails,getEcharts} from '@/service/cloudres.js';
export default {
    name: 'createUser',
    components: {
        EchartsLine
    },
    data() {
        let stateParams = this.$route.params || {};
        return {
            cpuBtn:'1h',
            memBtn:'1h',
            host:{},
            volume:{},
            stateParams,
            item:stateParams.item ? stateParams.item : {},
            fullscreenLoading: false,
            safeGroup:[],
            seriesData_cpu: [],
            legendData_cpu: ['CPU使用率'],
            xData_cpu: [],
            lineStyle_cpu: ['#0d7ef2'],
            areaStyle_cpu: ['#e2effd'],
            seriesData_mem: [],
            legendData_mem: ['内存使用率'],
            xData_mem: [],
            lineStyle_mem: ['#3ac76c'],
            areaStyle_mem: ['#e7f8ed'],
            searchDate:'1h',
            searchObj:{
                startDate:'',
                endDate:'',
            }
        };
    },
    beforeRouteLeave(to, from, next){
        //打开详情页（或者下一个任意界面）之前，把筛选条件保存到localStorage，如果离开列表页并且打开的不是详情页则清除，也可以选择不清除
        if (to.name == 'app.resources.instance') {
            let condition = JSON.stringify(this.stateParams);
            localStorage.setItem('condition', condition);
        }else{
            localStorage.removeItem('condition');
        }
        next();
    },
    computed:{
        xType() {
            let state = this.searchDate === '1h' || this.searchDate === '6h' || this.searchDate === '12d' || this.searchDate === '1d';
            return state;
        },
    },
    methods:{
        timediff(time) {
            let outstr = '';
            if(time){
                let now = new Date().getTime();
                let diff = now - new Date(time).getTime();//时间差的毫秒数;

                //计算出相差天数
                let days = Math.floor(diff / (24 * 3600 * 1000));

                //计算出小时数
                let leave1 = diff % (24 * 3600 * 1000);//计算天数后剩余的毫秒数
                let hours = Math.floor(leave1 / (3600 * 1000));

                //计算相差分钟数
                let leave2 = leave1 % (3600 * 1000);//计算小时数后剩余的毫秒数
                let minutes = Math.floor(leave2 / (60 * 1000));

                //计算相差秒数
                let leave3 = leave2 % (60 * 1000);//计算分钟数后剩余的毫秒数
                let seconds = Math.round(leave3 / 1000);
                outstr = days + '天 ' + hours + '小时 ' + minutes + '分钟' + seconds + '秒';
            }
            return outstr;
        },
        getStatusText(status){
            let outstr = '';
            if(status){
                switch(status){
                    case 'ACTIVE': { outstr = '运行';break;}
                    case 'SHUTOFF':{ outstr = '关机';break;}
                    case 'BUILDING':{ outstr = '未完成构建';break;}
                    case 'DELETED':{ outstr = '删除';break;}
                    case 'ERROR':{ outstr = '出错';break;}
                    case 'HARD_REBOOT':{ outstr = '硬重启中';break;}
                    case 'MIGRATING': { outstr = '迁移' ; break ; }
                    case 'PASSWORD':{ outstr = '密码重置';break;}
                    case 'PAUSED':{ outstr = '暂停';break;}
                    case 'REBOOT':{ outstr = '软重启中';break;}
                    case 'REBUILD':{ outstr = '重建';break;}
                    case 'RESCUED':{ outstr = '救援';break;}
                    case 'RESIZED':{ outstr = '关闭';break;}
                    case 'RESIZE':{ outstr = '正在调整配置';break;}
                    case 'VERIFY_RESIZE':{ outstr = '等待确认';break;}
                    case 'REVERT_RESIZE':{ outstr = '放弃调整配置';break;}
                    case 'SOFT_DELETED':{ outstr = '软删除';break;}
                    case 'STOPPED':{ outstr = '停止';break;}
                    case 'SUSPENDED':{ outstr = '挂起';break;}
                    case 'UNKNOWN':{ outstr = '未知';break;}
                    case 'SHELVED_OFFLOADED':{ outstr = '废弃';break;}
                    case 'BUILD':{ outstr = '创建中';break;}
                    default:{ outstr = status; }
                }
            }
            return outstr;
        },
        setOrigin(){
            console.log('this.stateParams',this.stateParams);
            console.log('this.item',this.item);
            let param = localStorage.getItem('condition');
            if(param){
                this.stateParams = JSON.parse(param);
                this.item = this.stateParams.item;
            }else{
                let condition = JSON.stringify(this.stateParams);
                localStorage.setItem('condition', condition);
            }

            getHostItem(this.item.id).then(ret => {
                $log('getHostItem', ret);
                let resData = ret.data;
                if(resData){
                    this.safeGroup = resData || [];
                }

            });
            getHostItemDetail(this.item.id).then(ret => {
                $log('getHostItemDetail', ret);
                let resData = ret.data;
                if(resData){
                    if(resData['OS-EXT-AZ:availability_zone']) this.host.zone = resData['OS-EXT-AZ:availability_zone'];
                    if(resData['OS-EXT-SRV-ATTR:hypervisor_hostname']) this.host.hostname = resData['OS-EXT-SRV-ATTR:hypervisor_hostname'];
                    if(resData['key_name']) this.host.keyname = resData['key_name'];
                    console.log('this.host',this.host);
                    if(resData['os-extended-volumes:volumes_attached'].length !== 0){
                        showVolumeDetails(resData['os-extended-volumes:volumes_attached'][0].id).then(ret => {
                            $log('getHostItemDetail', ret);
                            let resData = ret.data;
                            if(resData){
                                this.volume = resData;
                            }

                        });
                    }
                }

            });
            this.getCharts('cpu');
            this.getCharts('mem');
        },
        //获取图表信息
        searchMetric(time,type) {
            this.searchObj.startDate = '';
            this.searchObj.endDate = '';
            let now, st;
            if(type == 'cpu'){
                this.cpuBtn = time;
            }else{
                this.memBtn = time;
            }
            switch(time){
                case '1h':{
                    now = new Date();
                    st = new Date(now);
                    st.setHours(st.getHours() - 1);
                    break;
                }
                case '6h':{
                    now = new Date();
                    st = new Date(now);
                    st.setHours(st.getHours() - 6);
                    break;
                }
                case '12h':{
                    now = new Date();
                    st = new Date(now);
                    st.setHours(st.getHours() - 12);
                    break;
                }
                case '1d':{
                    now = new Date();
                    st = new Date(now);
                    st.setHours(st.getHours() - 24);
                    break;
                }
                case '30d':{
                    now = new Date();
                    st = new Date(now);
                    st.setHours(st.getHours() - 24 * 30);
                    break;
                }
                default:{
                    now = new Date();
                    st = new Date(now);
                    st.setHours(st.getHours() - 1);
                }
            }
            this.searchObj.startDate = st;
            this.searchObj.endDate = now;
            this.getCharts(type);
        },
        //获取图表
        getCharts(dataType){
            if(!this.searchObj.startDate || !this.searchObj.endDate)
            {
                let now = new Date();
                let st = new Date(now);
                st.setHours(st.getHours() - 1);
                this.searchObj.startDate = st;
                this.searchObj.endDate = now;
            }
            let filters = this.$options.filters;
            let param = {
                dataType: dataType, //'cpu','mem'
                instanceType: 'ecs',
                instanceId:this.stateParams.id,
                startTime:filters['date'](this.searchObj.startDate ,'YYYY-MM-DD HH:mm:ss'),
                endTime:filters['date'](this.searchObj.endDate,'YYYY-MM-DD HH:mm:ss')
            };
            getEcharts(param).then(ret => {
                $log('echarts', ret);
                let datas = ret.data || [];
                if(datas.length > 0){
                    if(dataType == 'cpu'){
                        this.seriesData_cpu = datas;
                        this.xData_cpu = datas[0].xData;
                    }else{
                        this.seriesData_mem = datas;
                        this.xData_mem = datas[0].xData;
                    }
                }
            });
        },
        setTime(){

        },
        //返回到列表页面
        goBack(){
            window.history.back();
        }
    },

    mounted() {
        this.setOrigin();
    },
    created(){
        //从localStorage中读取条件并赋值给查询表单
        let condition = localStorage.getItem('condition');
        if (condition != null) {
            this.stateParams = JSON.parse(condition);
            this.item = this.stateParams.item;
        }
    }
};
</script>
<style lang="scss" scoped>
.page-body{
    .detail-box{
        .img{
            em{
                color:#fff;
            }
            color:#fff;
            height: 40px;
            width: 40px;
            background: #4895d7;
            text-align:center;
            vertical-align: middle;
        }
        .top{
            & *{
                color:#656565;
                font-size: 14px;
            }
            line-height: 40px;
            border: 1px solid #d1d5de;
            height: 40px;
            background: #ffffff;
        }
        .main{
            .title{
                color:#999;
            }
            div.listitem{
                &:last-child{
                    margin-bottom:0;
                }
                margin-bottom:10px;
            }
            & *{
                color:#656565;
                font-size: 12px;
            }
            border: 1px solid #d1d5de;
            border-top:0;
            padding:20px;
            background:#fff;
        }
    }
    .clearfix *{
        color:#666;
    }
    padding:20px;
    background: #f4f8f9;
    .content{
        span{
            font-size: 24px !important;
        }
        height:100%;
        line-height: 320px;
        text-align: center;
    }
    .btnChosen{
        background-color:#4895d7;
        color:#fff !important;
        span{
            color:#fff !important;
        }
    }
}
</style>