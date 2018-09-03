
import EcsInstDetailHeader from './DetailHeader';
import ChartsLine from '@/components/charts/ChartsLine.vue';
import EchartsLine from '@/components/charts/EchartsLine.vue';
import TelnetDialog from '../ecsDialog/telnetDialog';
import ModifyInfoDialog from '../ecsDialog/modifyIntroDialog';
import CustomImageDialog from '../ecsDialog/CustomImageDialog';
import {mapGetters} from 'vuex';
import {ECS_STATUS} from '@/constants/dicts/ecs.js';
import CopyText from '@/components/copy/copyText';
import {     
    moniterEchartMetricData
} from '@/service/ecs/overview';


import { 
    getInstanceDetail,    
    getFlavorsDetail,
    getInstanceNet,
    getInstanceCountInfo
} from '@/service/ecs/detail/index';
// import { Loading } from 'element-ui';
// import { convertToVchartData } from '@/utils/utils';


export default {
    name: 'EcsInstDetail',
    components: {
        EcsInstDetailHeader,
        ChartsLine,
        TelnetDialog,
        ModifyInfoDialog,
        CustomImageDialog,
        CopyText,
        EchartsLine
    },
    data() { 
        let stateParams = this.$route.params || {};     
        return {
            flavorId: '',
            ECS_STATUS,
            stateParams,
            // dataPickOpt:this.dataPick(),
            ecsInst: stateParams.item ? stateParams.item : {id:stateParams.id},
            flavor:{},
            instanceNet:{},
            instDetailTop:{},
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
            seriesData_net: [],
            legendData_net: ['出口流量', '入口流量'],
            xData_net: [],
            lineStyle_net: ['#f60', '#7c84dc'],
            areaStyle_net: ['#ffcaa6', '#e1ae9e'],
            loadingBody: false,
            
            searchDate:'1h',
            searchObj:{
                startDate:'',
                endDate:'',
                dateRange:[]
            }
        };
    },
    methods: {
        // dataPick(){
        //     console.log(this.searchDate);
        // },
        getSecurityGroupName(val) {
            return val === 'default' ? '默认安全组' : val;
        },
        selectDetailTime(){
            console.log(this.searchObj.dateRange);
            this.searchDate = '';
            this.searchObj.startDate = this.searchObj.dateRange[0];
            this.searchObj.endDate = this.searchObj.dateRange[1];
            this.searchCharts('cpu');
            this.searchCharts('mem');
            this.searchCharts('net');
        },
        dataChangeType(value){
            this.searchObj.dateRange = [];
            console.log(value);
            let now ,st;
            switch(value){
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
                case '1d':{ 
                    now = new Date();
                    st = new Date(now);   
                    st.setHours(st.getHours() - 24);                         
                    break;
                }
                case '7d':{ 
                    now = new Date();
                    st = new Date(now); 
                    st.setHours(st.getHours() - 7 * 24);                                
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
            this.searchObj.dateRange.push(st);
            this.searchObj.dateRange.push(now);


            this.searchCharts('cpu');
            this.searchCharts('mem');
            this.searchCharts('net');
        },
        async search (type) {
            await this.getInstanceDetail(this.stateParams.id);
            this.getFlavorsDetail(this.flavorId);
            this.getInstanceNet(this.stateParams.id);
            this.getInstanceCountInfo(this.stateParams.id);
            await this.searchCharts('mem');
            await this.searchCharts('cpu');
            await this.searchCharts('net');
            if (type === 1) {
                this.loadingBodyFn();
            }
        },
        // 获取基本信息
        getInstanceDetail:function (instanceId) {
            return getInstanceDetail(instanceId).then( (res) => {
                if(res && res.code && res.code === this.CODE.SUCCESS_CODE){
                    // console.log('getInstanceDetail',res);                       
                    let ecsInst = res.result;
                    this.ecsInst = ecsInst;  
                    this.flavorId = ecsInst.flavorId;
                    console.log('getInstanceDetail ecsInst',this.ecsInst);                                       
                } 
            });            
        },

        //获取实例规格（配置信息）
        getFlavorsDetail:function (flavorId) {
            getFlavorsDetail(flavorId).then( (res) => {
                if(res && res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getFlavorsDetail',res);
                    let jsonData = res.result;
                    this.flavor = jsonData;
                    // let flavor = JSON.parse(jsonData) || jsonData;
                    // console.log('getFlavorsDetail flavor',flavor);
                    // if(flavor && flavor.flavor)      
                    //     this.flavor = flavor.flavor;            
                } 
            });            
        },

        //获取实例网络信息
        getInstanceNet:function (instanceId) {
            getInstanceNet(instanceId).then( (res) => {
                if(res && res.code && res.code === this.CODE.SUCCESS_CODE){ 
                    this.instanceNet = res.result;  
                    console.log('getInstanceNet',this.instanceNet);                                       
                } 
            });            
        },
        // 获取磁盘数量等信息
        getInstanceCountInfo:function (instanceId) {
            getInstanceCountInfo(instanceId).then( (res) => {
                if(res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getInstanceCountInfo',res);   
                    let instDetailTop = res.result;
                    this.instDetailTop = instDetailTop;  
                    console.log('getInstanceCountInfo ecsInst',this.ecsInst);                                       
                } 
            });
            
        },
        searchCharts:function (dataType) {
            if(!this.searchObj.startDate || !this.searchObj.endDate)
            {
                let now = new Date();
                let st = new Date(now);
                st.setHours(st.getHours() - 1); 
                this.searchObj.startDate = st;
                this.searchObj.endDate = now;
                this.searchObj.dateRange.push(st);
                this.searchObj.dateRange.push(now);
            }  
            let filters = this.$options.filters;  
            let data = {
                startTime: filters['date'](this.searchObj.startDate ,'YYYY-MM-DD HH:mm:ss'),
                endTime: filters['date'](this.searchObj.endDate,'YYYY-MM-DD HH:mm:ss'),
                dataType: dataType, //'cpu','mem','net'
                instanceType: 'ecs',
                //searchAllEcs: 'true',
                instanceId: this.stateParams.id
            };
            moniterEchartMetricData(data).then( (res) => {
                if(res && res.code && res.code === this.CODE.SUCCESS_CODE){
                    let datas = res.result || [];

                    // let echartDatas = convertToVchartData(datas);
                    switch(dataType){
                        case 'cpu':{  
                            this.seriesData_cpu = datas;
                            this.xData_cpu = datas[0].xData;
                            break;
                        }
                        case 'mem':{  
                            this.seriesData_mem = datas;
                            this.xData_mem = datas[0].xData;                                
                            break;
                        }
                        case 'net':{ 
                            this.seriesData_net = datas;
                            this.xData_net = datas[0].xData;                                 
                            break;
                        }
                        default:{}
                    }    
                }  
            });
            
        },
        loadingBodyFn() {
            this.loadingBody = true;
            setTimeout(() => {
                this.loadingBody = false;
            }, 500);
        }
    },
    created () {
        this.stateParams = this.$route.params || {}; 
        console.log('stateParams' + JSON.stringify(this.stateParams),this.stateParams.item );
        this.search();   
            
    },
    computed: {
        ...mapGetters(['userInfo']),
        xType() {
            let state = this.searchDate === '1h' || this.searchDate === '6h' || this.searchDate === '1d';
            return state;
        },
        loading() {
            return this.seriesData_cpu.length > 0 
            && this.seriesData_mem.length > 0 
            && this.seriesData_net.length > 0;
        },
        // 默认安全组
        securityGroupName() {
            return this.instanceNet && this.instanceNet.securityGroupName && this.instanceNet.securityGroupName.map(e => this.getSecurityGroupName(e)).join(',');
        },
        // 私有网络
        vpcName() {
            return this.instanceNet && this.instanceNet.vpcName && this.instanceNet.vpcName.join(',');
        },
        // 子网
        subnetName() {
            return this.instanceNet && this.instanceNet.subnetName && this.instanceNet.subnetName.join(',');
        }
    }

};
