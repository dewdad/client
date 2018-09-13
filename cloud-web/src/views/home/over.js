import EchartsLine from '@/components/charts/EchartsLine.vue';
import EchartsBar from '@/components/charts/EchartsBar.vue';
import ICountUp from 'vue-countup-v2';
import {getOrderCount, getMonitorWarn, getUserUsagesAndQuota, moniterEchartMetricData} from '@/service/ecs/overview.js';
import {getEcsInstList} from '@/service/ecs/list.js';
export default {
    name: 'Overview',
    data() {
        return {
            legendData: ['CPU使用率', '内存使用率'],
            legendWarnData: ['监控警告'],
            xData_cpu: [],
            xData_mem: [],
            xWarnData: [],
            seriesData_cpu:[],
            seriesData_mem:[],
            gridVal: {
                bottom: '60',
                right: '20',
                left: '60',
                top: '10'
            },
            gridVal2: {
                bottom: '30',
                right: '20',
                left: '20',
                top: '10'
            },
            seriesWarnData: [
            ],
            options: [
                {value: 1, label: '1天'},
                {value: 3, label: '3天'},
                {value: 7, label: '7天'}
            ],
            value: 7,
            echartsLineHeight: '200px',
            radioTime: '1d',
            allOrder: [],
            tenantData: {},
            instanceList: [],
            instance: '',
            searchObj:{
                startDate:'',
                endDate:'',
                dateRange:[]
            }
        };
    },
    computed: {
        seriesData() {
            let arr = [];
            if (this.seriesData_cpu.length > 0 && this.seriesData_mem.length > 0) {
                arr[0] = {
                    seriesData: this.seriesData_cpu[0].seriesData
                };
                arr[1] = {
                    seriesData: this.seriesData_mem[0].seriesData
                };
                return arr;
            } 
            return arr;
        },
        // 总警告数
        totalWarn() {
            let num = 0;
            num = this.seriesWarnData[0] && this.seriesWarnData[0].seriesData &&  eval(this.seriesWarnData[0].seriesData.join("+")) || 0;
            return num;
        },
        // 内存配额
        ramVal() {
            return parseFloat((this.tenantData.qRam / 1024).toFixed(2)) || 0 ;
        },
        ramUsage() {
            return parseFloat((this.tenantData.RAM / 1024).toFixed(2)) || 0 ;
        },
        xData() {
            return this.xData_cpu.length >= this.xData_mem.length ? this.xData_cpu : this.xData_mem;
        }
    },
    components: {
        EchartsLine,
        EchartsBar,
        ICountUp
    },
    methods: {
        getOrderCountFn() {
            getOrderCount()
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.allOrder = res.data && res.data.allOrder || [];
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 监控告警接口
        getMonitorWarnFn() {
            getMonitorWarn(this.value)
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let monitoRet = res.data || [];
                        this.seriesWarnData = [];
                        this.xWarnData = []; 
                        let arr = [];
                        for (let w in monitoRet) {
                            let xVal = monitoRet[w].countDate;
                            this.xWarnData.push(xVal.substring(5, xVal.length));
                            arr.push(monitoRet[w].count);
                        }
                        this.seriesWarnData.push({
                            seriesData: arr
                        });
                        $log('dfdsfs', monitoRet);
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 用户使用量与配额
        getUserUsagesAndQuotaFn() {
            getUserUsagesAndQuota(this.value)
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.tenantData = res.data[0] || [];
                        // $log('dfdsfs', monitoRet);
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 获得所有实例
        getEcsInstListFn(){
            let params = {
                pageIndex: 1,
                limit: 9999
            };
            getEcsInstList(params)
                .then(res => {
                    if (res && res.data) {
                        let data = res.data;
                        if (data.code && data.code === this.CODE.SUCCESS_CODE) {
                            let dataList = data.data || [];
                            this.instanceList = dataList.data;
                            this.instance = dataList.data[0].id;
                            this.editMonitorData();
                        }
                    }
                    self.loading = false;
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                    self.loading = false;
                });
        },
        // 监控数据--获取chart数据（执行）
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
                instanceId: this.instance
            };
            moniterEchartMetricData(data).then( (res) => {
                if(res && res.code && res.code === this.CODE.SUCCESS_CODE){
                    let datas = res.data || [];
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
                        default:{}
                    } 
                }  
            });
            
        },
        // 监控数据--筛选日期
        dataChangeType(){
            let value = this.radioTime;
            this.searchObj.dateRange = [];
            console.log(value);
            let now ,st;
            switch(value){
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


            this.editMonitorData();
        },
        // 监控数据--获取chart数据
        editMonitorData() {
            this.searchCharts('mem');
            this.searchCharts('cpu');
        },
        // 
        getUsage(val1, val2) {
            if(val2 === 0) {
                return false;
            }
            return parseFloat(val1/val2) > 0.9;
        }
    },
    mounted() {
        this.getOrderCountFn();
        this.getMonitorWarnFn();
        this.getUserUsagesAndQuotaFn();
        this.getEcsInstListFn();
    }
};