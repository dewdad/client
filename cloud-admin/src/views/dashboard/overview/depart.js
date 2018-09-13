import EchartsLine from '@/components/charts/EchartsLine';
import EchartsPie from '@/components/charts/EchartsPie';

import {getAdminOverview, getTenantIntro} from '@/service/overview.js';

let resourceArr = [
    {class: 'iconfont icon-yunzhuji-gailan', name: '弹性主机', field: 'INSTANCES', totalField: 'qInstances'},
    {class: 'iconfont icon-CPU-gailan', name: 'CPU', field: 'CORES', totalField: 'qCpu'},
    {class: 'iconfont icon-neicun-gailan', name: '内存', field: 'RAM', totalField: 'qRam'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘数量', field: 'VOLUMES', totalField: 'qVolumes'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘内存', field: '', totalField: 'qVolumeSize'},
    {class: 'iconfont icon-kuaizhao-gailan', name: '快照数量', field: 'SNAPSHOTS', totalField: 'qSnapshot'},
    {class: 'iconfont icon-wangluo-gailan', name: '网络', field: 'NETWORK', totalField: 'qNetwork'},
    {class: 'iconfont icon-anquanzu-gailan', name: '安全组', field: 'SECURITY_GROUP', totalField: 'qSecutityGroup'},
    {class: 'iconfont icon-luyouqi-gailan', name: '路由器', field: 'ROUTER', totalField: 'qRouters'},
    {class: 'iconfont icon-fudongIP-gailan', name: '浮动IP', field: 'FLOATINGIP', totalField: 'qFloatingIps'}
];
export default {
    data() {
        return {
            resourceArr,
            searchVal: '',
            departData: [
                {
                    label: '一级部门1',
                    id: 'yijibumen',
                    children: [{
                        label: '二级部门1-1',
                        children: [{
                            label: '三级部门1-1-1'
                        }]
                    }]
                },
                {
                    label: '一级部门2',
                    children: [{
                        label: '二级部门2-1',
                        children: [{
                            label: '三级部门2-1-1'
                        }]
                    }]
                },
                {
                    label: '一级部门3',
                    children: [{
                        label: '二级部门3-1',
                        children: [{
                            label: '三级部门3-1-1s'
                        }]
                    }]
                }
            ],
            departShow: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            quota: {},
            usages: {},
            tenantList: [],
            selTenantId: ''
        };
    },
    methods:{
        // 选择部门
        selDepart(data) {
            console.warn(data);
            this.departShow = false;
        },
        // 打开部门菜单
        selDepartBox(){
            this.departShow = !this.departShow;
        },
        // 概览数据
        getAdminOverviewFn(){
            let params = {
                deptId: 'deptId'
            };
            getAdminOverview(params)
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.quota = res.data && res.data.quota || [];
                        this.usages = res.data && res.data.usages || [];
                        let deptList = res.data && res.data.deptList || [];
                        this.departData = [];
                        for (let d in deptList){
                            let treeArr = {};
                            treeArr.label = deptList[d].name;
                            treeArr.id = deptList[d].id;
                            this.departData.push(treeArr);
                        }
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 租户筛选
        searchTenant() {
            this.getTenantIntroFn();
        },
        // 
        getTenantIntroFn() {
            let params = {
                deptId: '760dca9617db40b8b594029315ab371c',
                projectName: this.searchVal
            };
            getTenantIntro(params)
                .then(res => {
                    console.warn(res);
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.tenantList = res.data || [];
                        this.selTenantId = this.tenantList && this.tenantList[0].projectId;
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        }

    },
    components: {
        EchartsLine,
        EchartsPie
    },
    computed: {
        tenantResource() {
            return this.tenantList.filter(
                item => item.projectId === this.selTenantId
            )
        },
        // 当前选中部门
        selDepartVal() {
            return this.departData[0].label;
        }
    },
    mounted() {
        this.getAdminOverviewFn();
        this.getTenantIntroFn();
    }
};