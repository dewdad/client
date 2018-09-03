/**
 * ecs实例列表
 */
import {CHECK} from '@/constants/const';
import RegionRadio from '@/components/regionRadio/RegionRadio';
import RealNameVerify from '@/components/dialog/RealNameVerify';
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import EcsSelect from '@/components/form/EcsSelect.vue';
import {
    getEcsInstList,
    ecsInstAction,
    deleteEcsInstList,
    editInstInfo,
    getVncUrl
    //modifyVncPwd,
    //reloadSystem
} from '@/service/ecs/list.js';
import ZT_CONFIG from '@/constants/config';
import {showTextByKey, cloneDeep /*convertToVchartData*/} from '@/utils/utils.js';
//import {moniterEchartMetricData} from '@/service/ecs/overview';
import CopyText from '@/components/copy/copyText';

import AmendNameDialog from '@/components/dialog/AmendNameDialog';
import ModifyInfoDialog from './ecsDialog/modifyIntroDialog';
import DeleteDialog from './ecsDialog/deleteDialog';
import CustomImageDialog from './ecsDialog/CustomImageDialog';
import ModifyRemotePwd from './ecsDialog/ModifyRemotePwd';
import ResetPassword from './ecsDialog/resetPassword';
import TelnetGuideDialog from './ecsDialog/longDialog';
import EditLabelDialog from './ecsDialog/editLabelDialog';
import StopInstDialog from './ecsDialog/stopCaseDialog';
import DeleteInstDialog from './ecsDialog/deleteInstDialog';
import RepSysDiskDialog from './ecsDialog/RepSysDiskDialog';
import RepSysDiskOptionDialog from './ecsDialog/RepSysDiskOptionDialog';
import RestartInstDialog from './ecsDialog/restartInstDialog';
import StartInstDialog from './ecsDialog/startInstDialog';
import BindPublicIpDialog from './ecsDialog/bindPublicIpDialog';
import BindLinkIpDialog from './ecsDialog/bindLinkIpDialog';
import MobileCodeDialog from '@/components/dialog/MobileCodeDialog';
import HelpDialog from '@/views/ecs/inst/ecsDialog/HelpDialog.vue';
import ChartsLine from '@/components/charts/ChartsLine.vue';
import Retrieval from '@/components/retrieval/retrieval';
import {ECS_STATUS, ECS_DROPDOWN, remoteLoginActivedStatus, modifyConfigActivedStatus} from '@/constants/dicts/ecs.js';

export default {
    name: 'EcsInstList',
    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
            ////需要放入的其它参数
            //params: {},
            //附加查询条件
            extra: {
                //startTime:'',
                //endTime:'',
                //orderBy:'', //排序字段
                //ascOrDesc: '', //'DESC'、'ASC'  //descend 降序,ascend 升序
            }
            // //数组，查询字段:
            // fileds:[
            //     { field:'',value:''},
            // ],
        };

        let fields = [{field: 'name', label: this.$t('common.instName'), inputval: '', tagType: 'INPUT'}, {field: 'ip', label: this.$t('common.ipaddr'), inputval: '', tagType: 'INPUT'}];

        let searchObjExtra = {
            frominfo: '',
            fields: fields,
            selField: fields[0]
        };

        let cols = [
            {column: 'name', text: this.$t('ecs.inst.list.instIdAndName')},
            {column: 'os', text: '镜像', width: '8%'},
            // {column: 'region', text: this.$t('common.region'), width: '100'},
            {column: 'empty', text: '', width: '100'},
            {column: 'region', text: this.$t('ecs.inst.list.region'), width: '8%'},
            {column: 'ipaddr', text: this.$t('common.ipaddr'), width: '10%'},
            {
                column: 'status',
                text: this.$t('common.status'),
                width: '100',
                dropdowns: [
                    {key: -1, text: this.$t('common.all'), state: true, value: ''},
                    {key: 2, text: this.$t('common.state.shutoff'), state: false, value: 'SHUTOFF'},
                    {key: 5, text: this.$t('common.state.failed'), state: false, value: 'ERROR'},
                    {key: 1, text: this.$t('common.state.running'), state: false, value: 'ACTIVE'},
                    {key: 3, text: this.$t('common.state.creating'), state: false, value: 'BUILD'},
                    {key: 12, text: this.$t('common.state.awaitReboot'), state: false, value: 'WAIT_REBOOT'},
                    // {key: 4, text: this.$t('common.state.deleting'), state: false, value: 'DELETED'},
                    {key: 6, text: this.$t('common.state.restarting'), state: false, value: 'RESTARTING'},
                    {key: 13, text: this.$t('common.state.stoping'), state: false, value: 'STOPING'}
                    //{key:7,'text':this.$t('common.state.rebuilding'),'state':false,value:'REBUILD'},
                    //{key:8,'text':this.$t('common.state.suspend'),'state':false,value:'SUSPENDED'},
                    // {key: 9, text: this.$t('common.state.reinstalling'), state: false, value: 'RELOAD'},
                    // {key: 10, text: this.$t('common.state.changing'), state: false, value: 'CHANGESYSTEM'},
                    // {key: 11, text: this.$t('common.state.configing'), state: false, value: 'CHANGE'}
                ]
            },
            {column: 'cfginfo', text: this.$t('ecs.inst.list.configInfo'), width: '10%', class: 'text-left'},
            {column: 'createTime', text: '创建时间', width: '82px'}
        ];

        /** 列表操作项：更多：下拉功能菜单：所有按钮禁用：实例状态枚举 */
        let allBtnDisableds = ['DELETED', 'BUILD', 'RELOAD', 'CHANGESYSTEM', 'CHANGE'];

        //列表操作项：更多：下拉列表更多操作项
        /**
         * key: 标识唯一值
         * text： 下拉菜单显示的lable名称
         * activedStatus: 按钮激活的状态,[]表示该按钮永不禁用
         * tip：禁用disable时需要tooltip提示时提示内容，不需要时必须要保持为空或者无此字段
         * handle： vue中methods对象里进行定义了的功能函数名称
         * url: 列表操作项，下拉列表菜单中路由跳转链接
         * params：当url有值，路由跳转需要转递参数时，必须要设置params字段；
         * target：当url有值，需要新开页签时，设置值为'_blank'
         * hidden:隐藏选项
         */
        // let moreHandles = [
        //     { key:1,text:this.$t('ecs.inst.list.dropdownBtns.start'),activedStatus:['SHUTOFF'],tip:'',handle:'startinst'},
        //     { key:2,text:this.$t('ecs.inst.list.dropdownBtns.stop'),activedStatus:['ACTIVE'],tip:'',handle:'stopinst'},
        //     { key:3,text:this.$t('ecs.inst.list.dropdownBtns.restart'),activedStatus:['ACTIVE'],tip:'',handle:'restart' },
        //     { key:4,text:this.$t('ecs.inst.list.dropdownBtns.reinstallOperateSysem'),activedStatus:['SHUTOFF'],tip:this.$t('common.tip.mustStopInst'),handle:'reinstall'},
        //     { key:5,text:this.$t('ecs.inst.list.dropdownBtns.changeSystemDisk'),activedStatus:['SHUTOFF'],tip:this.$t('common.tip.mustStopInst'),handle:'replacedisk'},
        //     { key:6,text:this.$t('ecs.inst.list.dropdownBtns.modifyInfo'),activedStatus:[],tip:'',handle:'editinfo' },
        //     { key:7,text:this.$t('ecs.inst.list.dropdownBtns.editLable'),activedStatus:[],tip:'',handle:'editLabel'},
        //     { key:8,text:this.$t('ecs.inst.list.dropdownBtns.createCustomImage'),activedStatus:['SHUTOFF'],tip:this.$t('common.tip.mustStopInst'),handle:'createImage'},
        //     { key:9,text:this.$t('ecs.inst.list.dropdownBtns.securityGroupConfig'),activedStatus:[],tip:'',handle:'',url:'app.ecs.inst.safegrp',params:{id:'',item:''},target:'' },
        //     { key:10,text:this.$t('ecs.inst.list.dropdownBtns.bindPublicIP'),activedStatus:[],tip:'',handle:'bindip',hidden:false},
        //     { key:11,text:this.$t('ecs.inst.list.dropdownBtns.unbindPublicIP'),activedStatus:[],tip:'',handle:'unbindip',hidden:false},
        //     { key:12,text:this.$t('ecs.inst.list.dropdownBtns.bindConnIp'),activedStatus:[],tip:'',handle:'bindconnectip',hidden:false},
        //     { key:13,text:this.$t('ecs.inst.list.dropdownBtns.unbindConnIp'),activedStatus:[],tip:this.$t('ecs.inst.list.newMediaBuildingBindconnectip'),handle:'unbindconnectip',hidden:false },
        //     { key:14,text:this.$t('ecs.inst.list.dropdownBtns.delete'),activedStatus:[],tip:'',handle:'delECS'},
        //     { key:15,text:this.$t('ecs.inst.list.dropdownBtns.modifyRemoteLoginPassword'),activedStatus:[],tip:'',handle:'modifyVncpwd'},
        //     { key:16,text:this.$t('ecs.inst.list.dropdownBtns.remoteConnGuide'),activedStatus:[],tip:'',handle:'showGuide' },
        //     { key:17,text:this.$t('ecs.inst.list.dropdownBtns.submitTicket'),activedStatus:[],tip:'',handle:'submitTick',url:'app.ecs.overview',target:'_blank' }
        // ];

        // //测试数据
        // let dataList = [
        //     {id:'e-cqsfghziqpdv', name:'测试主机',lable:'',region:'北京1 资源池A',ipaddr:'192.168.0.35(内)',status:'ACTIVE',nettype:'专有网络',cfginfo:'CPU:1核 内存:2GB 宽度：MB',paytype:'免费试用',instanceStatus:'ACTIVE','$$moreHandles':Array.from(moreHandles)}
        // ]

        let chartExtendData = {
            grid: {
                // 网格配置
                bottom: '12%', // 离容器下侧的距离（留白）。
                left: '8%', // 离容器左侧的距离（留白）。
                right: '10%', // 离容器右侧的距离（留白）。
                top: '2%' // 离容器上侧的距离（留白）。
            },
            legend: {
                // 图列组件的配置
                bottom: '0'
            },
            yAxis: {
                type: 'value',
                axisLabel: {formatter: '{value} %'}
            }
        };

        //cpu使用率
        let cpuChartData = {
            settings: {
                labelMap: {
                    cpu: 'cpu'
                },
                dataType: {
                    cpu: 'percent'
                },
                stack: {cpu: ['cpu']},
                area: true,
                yAxisType: 'percent'
            },
            datas: {},
            chartExtendData
        };
        let netChartData = {
            settings: {
                labelMap: {
                    cpu: 'cpu'
                },
                dataType: {
                    cpu: 'percent'
                },
                stack: {cpu: ['cpu']},
                area: true,
                yAxisType: 'percent'
            },
            datas: {},
            chartExtendData
        };
        // // 所有可选标签
        // let allLabelData = [
        //     {labelKey: 'dded', labelvalue:'fddff' },
        //     {labelKey: 'ddd', labelvalue:'fff2' },
        //     {labelKey: '2ddd', labelvalue:'f3ff' },
        //     {labelKey: 'dd1', labelvalue:'fddff' },
        //     {labelKey: 'dd2', labelvalue:'fff2' },
        //     {labelKey: '2d3d', labelvalue:'f3ff' }
        // ];
        return {
            remoteLoginActivedStatus,
            modifyConfigActivedStatus,
            paginationAffix: false,
            paddingBottom: '0',
            status: '',
            ECS_STATUS,
            ECS_DROPDOWN,
            loading: false,
            CHECK,
            cols,
            allBtnDisableds,
            searchObj,
            searchObjExtra,
            //moreHandles,
            dialogVisible: false,
            region: '',
            tableDataList: [],
            stateParams: this.$route.params,
            showTextByKey,
            cpuChartData,
            netChartData,
            chartSearchObj: {
                datetimerange: []
            }, //监控图表查询条件对象
            instanceInfoData: 0,
            selTimeData: 1,
            //allLabelData,
            retrievalData: [],
            selectLabelList: [],
            opType: 1,
            currentInst: {},
            options: {},
            // 分页
            pageIndex: 1,
            limit: 10,
            totalItems: 0
        };
    },
    computed: {},
    components: {
        CopyText,
        RegionRadio,
        EcsSelect,
        RealNameVerify,
        PageHeader,
        LabelDropdown,
        ModifyInfoDialog,
        TelnetGuideDialog,
        EditLabelDialog,
        StopInstDialog,
        DeleteInstDialog,
        AmendNameDialog,
        DeleteDialog,
        CustomImageDialog,
        ModifyRemotePwd,
        ResetPassword,
        RepSysDiskDialog,
        RepSysDiskOptionDialog,
        RestartInstDialog,
        StartInstDialog,
        BindPublicIpDialog,
        BindLinkIpDialog,
        MobileCodeDialog,
        ChartsLine,
        HelpDialog,
        Retrieval
    },
    destroyed() {},
    created() {},
    watch: {
        options: {
            deep: true,
            handler() {
                this.resetPaging();
                this.getEcsInstList();
            }
        },
        $route: {
            immediate: true,
            handler() {
                // 根据路由筛选状态
                let {s} = this.$route.query;
                if (s) {
                    let isStatus = this.getDropdown('status').find(e => e.value === s);
                    if (isStatus) {
                        // 更新页面的status，触发查询
                        this.status = s;
                    } else {
                        this.status = '';
                        this.resetPaging();
                        this.getEcsInstList();
                    }
                }
            }
        },
        status() {
            this.resetPaging();
            this.getEcsInstList();
        }
    },
    methods: {
        /**
         * 更改实例规格，是否可以点击
         */
        changeConfigDisabled(status) {
            // 可以点击的列表
            let arr = ['SHUTOFF', 'ACTIVE', 'HARD_REBOOT', 'HARD_REBOOT', 'REBOOT'];
            return arr.findIndex(e => e === status) < 0;
        },
        /**
         * 显示搜索帮助
         */
        showHelpDialog() {
            this.$refs.HelpDialog.isShow = true;
        },
        /**
         * 获取下拉菜单位置
         */
        getPlacement(index) {
            let isLast = this.tableDataList.length > 3 && this.tableDataList.length - index < 3;
            return isLast ? 'top-end' : 'bottom-end';
        },
        getLabel(val) {
            return this.cols.find(e => e.column === val).text;
        },
        /**
         * 获取筛选下拉菜单
         */
        getDropdown(val) {
            return this.cols.find(e => e.column === val).dropdowns;
        },
        /**
         * 重置分页
         */
        resetPaging() {
            this.pageIndex = 1;
            this.totalItems = 0;
        },
        dropdownClickHandler(handleItem, rowItem) {
            if (!handleItem && !rowItem) return;
            if (this.arraySome(this.allBtnDisableds, rowItem.status)) return;
            if (rowItem.toCpu) return;
            //如果是a链接
            if (handleItem.url) return;
            //执行操作，传递参数rowItem
            if (handleItem.handle) {
                return this[handleItem.handle](rowItem);
            }
        },
        // 是否点击
        dropdownActive(status, arr) {
            if (!arr || !arr.length) return;
            return !arr.find(e => e.toLowerCase() === status);
        },
        ecsSelect(val) {
            // this.selectOption = Object.assign({}, this.selectOption, val.data);
        },
        //查询列表数据
        setOptions(options) {
            this.options = options;
        },
        getEcsInstList: function(payload = {}) {
            // let params = {
            //     paging:this.searchObj.paging,
            //     fileds:{
            //         [this.searchObjExtra.selField.field]:this.searchObjExtra.selField.inputval
            //     }
            // };
            let {show} = payload;
            let paging = {
                pageIndex: this.pageIndex,
                limit: this.limit
            };
            let params = Object.assign({}, paging, this.options, {status: this.status ? this.status.toLowerCase() : ''});
            if (show !== false) {
                this.loading = true;
                this.tableDataList = [];
            }
            let self = this;
            getEcsInstList(params)
                .then(res => {
                    //this.tableDataList = res
                    if (res && res.data) {
                        let data = res.data;
                        if (data.code && data.code === this.CODE.SUCCESS_CODE) {
                            let dataList = data.data || [];
                            this.tableDataList = dataList.data;
                            $log(this.tableDataList);
                            this.totalItems = data.total || 0;
                        }
                    }
                    self.loading = false;
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                    self.loading = false;
                });
        },

        // //列表数据中监控图表“点击查看”，查看监控信息；
        // searchCharts: function(dataType) {
        //     if (!this.currentInst.id) return;
        //     let now, st;
        //     if (this.chartSearchObj.datetimerange.length) {
        //         now = this.chartSearchObj.datetimerange[1];
        //         st = this.chartSearchObj.datetimerange[0];
        //     } else {
        //         now = new Date();
        //         st = new Date(now);
        //         st = st.setHours(st.getHours() - 24);
        //     }
        //     let filters = this.$options.filters;
        //     let data = {
        //         startTime: filters['date'](st, 'YYYY-MM-DD HH:mm:ss'),
        //         endTime: filters['date'](now, 'YYYY-MM-DD HH:mm:ss'),
        //         dataType: dataType, //'cpu','mem','net'
        //         instanceType: 'ecs',
        //         //searchAllEcs: 'true',
        //         instanceId: this.currentInst.id
        //     };
        //     moniterEchartMetricData(data).then(res => {
        //         if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
        //             let datas = res.result || [];
        //             let echartDatas = convertToVchartData(datas);
        //             switch (dataType) {
        //                 case 'cpu': {
        //                     this.cpuChartData.datas = echartDatas;
        //                     break;
        //                 }
        //                 case 'net': {
        //                     this.netChartData.datas = echartDatas;
        //                     break;
        //                 }
        //                 default: {
        //                 }
        //             }
        //         }
        //     });
        // },
        createInst: function() {
            this.$router.push({
                name: 'app.ecs.create'
            });
        },
        handleSearch: function(labels) {
            this.retrievalData = labels;
            console.log(labels);
        },
        getRetrieval(data) {
            this.selectLabelList = data;
        },

        /**列表下拉菜单执行操作代理
         * handleItem:moreHandles数据项
         * rowItem：列表行数据项
         * @param {*} param0
         */
        // handleCommand({handleItem,rowItem}) {
        //     if(!handleItem && !rowItem) return;
        //     if(this.arraySome(this.allBtnDisableds,rowItem.instanceStatus)) return;
        //     if(rowItem.toCpu) return;
        //     //如果是a链接
        //     if(handleItem.url) return;
        //     //执行操作，传递参数rowItem
        //     if(handleItem.handle){
        //         return this[handleItem.handle](rowItem);
        //     }
        // },
        // tableRowClassName({ row, rowIndex }) {
        //     if (rowIndex === 1) {
        //         return 'warning-row';
        //     } else if (rowIndex === 3) {
        //         return 'success-row';
        //     }
        // },
        filterHandler(filters) {
            let values = Object.values(filters);
            let value = values[0][0];
            if (value) {
                this.status = value;
            } else {
                this.status = '';
            }
        },
        arraySome: function(arr, val) {
            if (arr && Array.isArray(arr)) {
                return arr.some(function(it) {
                    return it === val;
                });
            }
            return false;
        },
        // 获取图标
        getIcon(type) {
            if (type && typeof type === 'string') {
                let name = type.split(' ')[0];
                if (name) {
                    return `zticon-${name.toLowerCase()}`;
                }
            }
            return type;
        },

        /**
         * 远程登录
         */
        getVncBefore: function(rowItem) {
            getVncUrl({instanceId: rowItem.id})
                .then(res => {
                    if (res && res.code == this.CODE.SUCCESS_CODE) {
                        let vnc_url = res.data.url;
                        console.log('url===', vnc_url);
                        //window.open(vnc_url);
                        window.open(vnc_url);
                    }
                })
                .catch(err => {
                    $log('getVncUrl err:', err);
                });
        },

        //开关机操作统一处理 （停止、强制停止、启动、重启、强制重启）
        ecsInstAction: async function(instanceId, actionReq, type) {
            //向后台提交表单请求
            return ecsInstAction(instanceId, actionReq, type).then(res => {
                console.log('ecsInstAction:::', res);
                // this.getEcsInstList();
            });
        },

        /**
         * 启动实例
         */
        startinst: function(rowItem) {
            console.log('start:', rowItem);
            this.$refs.startInstDialog
                .show(rowItem)
                .then(ret => {
                    this.$refs.mobileCodeDialog.show().then(async res => {
                        console.log('restartInst ret:::', ret);
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            ret.loading = true;
                            this.ecsInstAction(rowItem.id, 'start', 2)
                                .then(() => {
                                    ret.loading = false;
                                    ret.hide();
                                    this.$message.success($t('common.successOpt'));
                                    this.getEcsInstList();
                                })
                                .catch(err => {
                                    ret.loading = false;
                                    $log(err);
                                });
                        }
                    });
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        /**
         * 停止实例
         */
        stopinst: function(rowItem) {
            console.log('stopinst:', rowItem);
            this.$refs.stopInstDialog
                .show(rowItem)
                .then(ret => {
                    console.log('stopInst ret:::', ret);
                    this.$refs.mobileCodeDialog.show().then(async res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            //this.ecsInstAction(rowItem.id, ret.radio);
                            ret.loading = true;
                            this.ecsInstAction(rowItem.id, 'stop', 3)
                                .then(() => {
                                    ret.loading = false;
                                    ret.hide();
                                    this.$message.success($t('common.successOpt'));
                                    this.getEcsInstList();
                                })
                                .catch(err => {
                                    ret.loading = false;
                                    $log(err);
                                });
                        }
                    });
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        /**
         * 重启实例
         */
        restart: function(rowItem) {
            console.log('restart:', rowItem);
            this.$refs.restartInstDialog
                .show(rowItem)
                .then(ret => {
                    console.log('restartInst ret:::', ret);
                    this.$refs.mobileCodeDialog.show().then(async res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            //this.ecsInstAction(rowItem.id, ret.radio);
                            ret.loading = true;
                            this.ecsInstAction(rowItem.id, 'reboot', 1)
                                .then(() => {
                                    ret.loading = false;
                                    ret.hide();
                                    this.$message.success($t('common.successOpt'));
                                    this.getEcsInstList();
                                })
                                .catch(err => {
                                    ret.loading = false;
                                    $log(err);
                                });
                        }
                    });
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        // /**
        //  * 重装操作系统
        //  */
        // reinstall: function(rowItem) {
        //     console.log('reinstall:', rowItem);
        //     this.$confirm('您确定要重装系统吗？', '重装系统', {
        //         type: 'warning'
        //     }).then(() => {
        //         console.log('reinstall:::');
        //         this.$refs.mobileCodeDialog.show().then(async res => {
        //             if (res.code === this.CODE.SUCCESS_CODE) {
        //                 reloadSystem({instanceId: rowItem.id}).then(
        //                     res => {
        //                         if (res && res.data) {
        //                             let resData = res.data;
        //                             if (resData.code && resData.code === '0000') {
        //                                 this.$message.success($t('common.successOpt'));
        //                             } else {
        //                                 this.$alert(resData.msg, $t('common.tip'), {
        //                                     type: 'error'
        //                                 });
        //                             }
        //                         }
        //                     },
        //                     err => {
        //                         this.$alert(err, $t('common.tip'), {
        //                             type: 'error'
        //                         });
        //                     }
        //                 );
        //             }
        //         });
        //     });
        // },

        // /**
        //  * 更换系统盘
        //  */
        // replacedisk: function(rowItem) {
        //     console.log('replacedisk:', rowItem);
        //     this.$refs.RepSysDiskDialog.show()
        //         .then(ret => {
        //             this.$refs.RepSysDiskOptionDialog.show(rowItem).then(ret => {});

        //             // console.log('修改信息', ret);
        //             // this.$message.success($t('common.successOpt'));
        //         })
        //         .catch(err => {
        //             if (err) {
        //                 console.log('Error', err);
        //             } else {
        //                 console.log($t('common.cancel'));
        //             }
        //         });
        // },

        /**
         * 修改信息
         */
        editinfo: function(rowItem) {
            console.log('editinfo:', rowItem);
            this.$refs.ModifyInfoDialog.show(rowItem)
                .then(({name, remark}) => {
                    //局部刷新：刷新行数据
                    rowItem.name = name;
                    rowItem.remark = remark;
                    this.getEcsInstList({show: false});
                })
                .catch(err => {});
        },

        // /**
        //  * 编辑标签
        //  */
        // editLabel: function(rowItem) {
        //     console.log('editLabel:', rowItem);
        //     this.$refs.editLabelDialog
        //         .show(rowItem, 1, 1)
        //         .then(ret => {
        //             console.log($t('common.successOpt'), ret);
        //             this.$message.success($t('common.successOpt'));
        //         })
        //         .catch(err => {
        //             if (err) {
        //                 console.log('Error', err);
        //             } else {
        //                 console.log($t('common.cancel'));
        //             }
        //         });
        // },

        // /**
        //  * 创建自定义镜像
        //  */
        createImage: function(rowItem) {
            console.log('createImage:', rowItem);
            this.$refs.CustomImageDialog.show(rowItem)
                .then(ret => {})
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        /**
         * 绑定公网IP
         */
        bindip: function(rowItem) {
            console.log('bindip:', rowItem);
            this.$refs.bindPublicIpDialog
                .show(rowItem, 1)
                .then(ret => {
                    this.getEcsInstList({show: false});
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        /**
         * 解绑公网IP
         */
        unbindip: function(rowItem) {
            this.$refs.bindPublicIpDialog
                .show(rowItem, 2)
                .then(ret => {
                    this.getEcsInstList({show: false});
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
            console.log('unbindip:', rowItem);
        },

        /**
         * 绑定连接IP
         */
        bindconnectip: function(rowItem) {
            console.log('bindconnectip:', rowItem);
            this.$refs.bindLinkIpDialog
                .show(rowItem, 1)
                .then(ret => {
                    this.getEcsInstList({show: false});
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        /**
         * 解绑连接IP
         */
        unbindconnectip: function(rowItem) {
            this.$refs.bindLinkIpDialog
                .show(rowItem, 2)
                .then(ret => {
                    this.getEcsInstList({show: false});
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        /**
         * 删除
         */

        delECS: function(rowItem) {
            console.log('delECS:', rowItem);
            this.$refs.deleteInstDialog
                .show(rowItem)
                .then(ret => {
                    //身份验证（手机短信验证码）
                    this.$refs.mobileCodeDialog.show().then(async res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            ret.loading = true;
                            let data = {
                                instanceId: rowItem.id
                                //releaseFloatIp: false,
                                //releaseDataDisk: false
                            };
                            console.log('delECS data:::', data);
                            deleteEcsInstList(data).then(
                                () => {
                                    setTimeout(() => {
                                        ret.loading = false;
                                        ret.hide();
                                        this.$message.success($t('common.successOpt'));
                                        this.getEcsInstList({show: false});
                                    }, 500);
                                },
                                () => {
                                    ret.loading = false;
                                }
                            );
                        }
                    });
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },

        /**
         * 修改远程登录密码
         */
        modifyVncpwd: function(rowItem) {
            console.log('modifyVncpwd:', rowItem);
            this.$refs.mobileCodeDialog.show().then(async res => {
                if (res && res.code === this.CODE.SUCCESS_CODE) {
                    this.$refs.modifyRemotePwd.show(rowItem).then(ret => {});
                }
            });
        },

        /**
         * 重置密码
         */
        resetPassword: function(rowItem) {
            console.log('resetPassword:', rowItem);
            this.$refs.resetPassword.show(rowItem).then(ret => {});
        },

        /**
         * 安全组配置  点击进入本实例安全组
         */
        instSafeGroup: function(rowItem) {
            this.$router.push({name: 'app.ecs.inst.securitygrp', params: {id: rowItem.id, item: rowItem}});
        },

        // /**
        //  * 提交工单
        //  */
        // submitTick: function(rowItem) {
        //     console.log('submitTick:', rowItem);
        //     this.$router.push({name: 'app.ecs.overview', params: {id: rowItem.id, item: rowItem}});
        // },

        handleSizeChange: function(params) {
            console.log('params:', params);
            this.limit = params;
            this.pageIndex = 1;
            this.getEcsInstList();
        },

        handleCurrentChange: function(params) {
            console.log('handleCurrentChange:', params);
            this.getEcsInstList();
        },

        //编辑实例名称
        editinstname: function(rowItem) {
            console.log('editinstname:', rowItem);
            let dlgData = {
                name: rowItem.name, //实例名称
                title: $t('common.edit') + $t('common.instName'), //对话框title
                label: $t('common.instName') //对话框表单的label
            };
            this.$refs.amendNameDialog
                .show(dlgData)
                .then(({name, dlg}) => {
                    //dlg为对话框对象this的引用
                    dlg.loading = true; //加载等待动画
                    let data = {
                        instanceId: rowItem.id,
                        name
                    };
                    editInstInfo(data)
                        .then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                dlg.loading = false;
                                rowItem.name = name; //局部刷新
                                this.$message.success($t('common.successOpt'));
                            }
                        })
                        .catch(err => {
                            dlg.loading = false;
                            $log(err);
                        });
                })
                .catch(err => {});
        },

        // //改变当前选择的实例
        // changeCurrentEcsInst: function(rowItem) {
        //     this.selTimeFn(this.selTimeData);
        //     console.log('changeCurrentEcsInst:', rowItem);
        //     this.instanceInfoData = 4;
        //     this.currentInst = rowItem;
        //     this.searchCharts('cpu');
        //     this.searchCharts('net');
        // },

        getSysOsIcon: function(osType) {
            if (osType) {
                const sysname = osType.split(' ')[0];
                const sysname_lowercase = sysname.toLowerCase() || sysname;
                let out_osname = '';
                switch (sysname_lowercase) {
                    case 'debian': {
                        out_osname = 'icon-debian';
                        break;
                    }
                    case 'suse': {
                        out_osname = 'icon-suse';
                        break;
                    }
                    case 'coreos': {
                        out_osname = 'icon-coreos';
                        break;
                    }
                    case 'centos': {
                        out_osname = 'icon-centos';
                        break;
                    }
                    case 'ubuntu': {
                        out_osname = 'icon-ubuntu';
                        break;
                    }
                    case 'redhat': {
                        out_osname = 'icon-redhat';
                        break;
                    }
                    case 'freebsd': {
                        out_osname = 'icon-freebsd';
                        break;
                    }
                    case 'windows': {
                        out_osname = 'icon-windows';
                        break;
                    }
                    default: {
                    }
                }
                return out_osname;
            }
            return '';
        },

        // // 选择时间
        // selTimeFn(num) {
        //     this.selTimeData = num;
        //     let now = new Date();
        //     let st = new Date(now);
        //     st = st.setHours(now.getHours() - num);
        //     this.chartSearchObj.datetimerange = [st, now];
        //     this.searchCharts('cpu');
        //     this.searchCharts('net');
        // },
        // 关闭实例信息展示
        closeInstanceInfo() {
            this.instanceInfoData = 0;
        },

        //获取列表中的分组操作项
        getChildren(item, rowItem) {
            let children = item.children;
            if (children && Array.isArray(children)) {
                //网络和安全
                if (item.flag) {
                    let outarr = [];
                    children.forEach(child => {
                        // console.log('child', child);
                        if (child.show) {
                            outarr.push(child);
                        } else {
                            let isPublicIP = rowItem.floatIp ? rowItem.floatIp.indexOf(ZT_CONFIG.FLOAT_IP_IS_PUBLIC_IP) != -1 : false;
                            let isConnIP = rowItem.floatIp ? rowItem.floatIp.indexOf(ZT_CONFIG.FLOAT_IP_IS_CONNECT_IP) != -1 : false;
                            switch (child.handle) {
                                case 'bindip':
                                case 'bindconnectip': {
                                    if (!rowItem.floatIp) outarr.push(child);
                                    break;
                                }
                                case 'unbindip': {
                                    if (rowItem.floatIp && isPublicIP) outarr.push(child);

                                    break;
                                }
                                case 'unbindconnectip': {
                                    if (rowItem.floatIp && isConnIP) outarr.push(child);
                                    break;
                                }
                                default: {
                                }
                            }
                        }
                    });
                    return outarr;
                }
            }
            return cloneDeep(children);
        }
    }
};
