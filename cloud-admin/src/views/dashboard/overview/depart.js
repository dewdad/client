import EchartsLine from '@/components/charts/EchartsLine';
import EchartsPie from '@/components/charts/EchartsPie';

import {getAdminOverview, getTenantIntro} from '@/service/overview.js';

let resourceArr = [
    {class: 'iconfont icon-yunzhuji-gailan', name: '弹性主机'},
    {class: 'iconfont icon-CPU-gailan', name: 'CPU'},
    {class: 'iconfont icon-neicun-gailan', name: '内存'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘数量'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘内存'},
    {class: 'iconfont icon-kuaizhao-gailan', name: '快照数量'},
    {class: 'iconfont icon-kuaizhao-gailan', name: '快照容量'},
    {class: 'iconfont icon-wangluo-gailan', name: '网络'},
    {class: 'iconfont icon-anquanzu-gailan', name: '安全组'},
    {class: 'iconfont icon-luyouqi-gailan', name: '路由器'},
    {class: 'iconfont icon-fudongIP-gailan', name: '浮动IP'}
];
export default {
    data() {
        return {
            resourceArr,
            searchVal: '',
            departData: [
                {
                    label: '一级部门1',
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
            tenantList: [
                {id: '1',name: '租户a',},
                {id: '2',name: '租户b',},
                {id: '3',name: '租户c',},
                {id: '4',name: '租户d',},
                {id: '5',name: '租户e',},
            ]
        };
    },
    methods:{
        // 选择部门
        selDepart() {
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
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                });
        },
        // 租户筛选
        searchTenant() {
        },
        // 
        getTenantIntroFn() {
            let params = {
                deptId: 'deptId'
            };
            getTenantIntro(params)
                .then(res => {
                    console.warn(res);
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
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
    mounted() {
        this.getAdminOverviewFn();
    }
};