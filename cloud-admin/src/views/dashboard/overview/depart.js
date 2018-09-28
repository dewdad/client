import EchartsLine from '@/components/charts/EchartsLine';
import EchartsPie from '@/components/charts/EchartsPie';
import { mapState } from 'vuex';
import {getAdminOverview, getTenantIntro} from '@/service/overview.js';
import {deptTree} from '@/service/usermgr/deptmgr.js';
let resourceArr = [
    {class: 'iconfont icon-yunzhuji-gailan', name: '弹性主机', field: 'INSTANCES', totalField: 'qInstances'},
    {class: 'iconfont icon-CPU-gailan', name: 'CPU', field: 'CPU', totalField: 'qCpu'},
    {class: 'iconfont icon-neicun-gailan', name: '内存', field: 'RAM', totalField: 'qRam'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘数量', field: 'VOLUMES', totalField: 'qVolumes'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘内存', field: 'VOLUME_SIZE', totalField: 'qVolumeSize'},
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
            departData: [],
            departShow: false,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            quota: {
                cpu:0,
                instances:0,
                volumes:0,
                snapshot:0,
                volumeSize:0,
                ram:0,
                securityGroup:0,
                securityGroupRule:0,
                floatingIps:0,
                network:0,
                ports:0,
                routers:0,
                subnet:0,
                backup:0,
                backupSize:0
            },
            usages: {
                cores: '',
                instances: '',
                volumes: '',
                snapshots: '',
                gigabytes: '',
                ram: '',
                security_group: '',
                security_group_rule: '',
                floatingip: '',
                network: '',
                port: '',
                router: '',
                subnet: '',
                region: '',
                backup: '',
                backupSize: ''
            },
            tenantList: [],
            selTenantId: '',
            deptList:[],
            brunch:{},
            selectedKey:[],
            item:{},
            fullscreenLoading: false,

        };
    },
    methods:{
        handleNodeClick(data){
            this.brunch = data;
            // 记录当前部门分支
            this.$store.commit('user/DEPTBRUNCH', data);
            this.selectedKey = [];
            this.selectedKey.push(data.id);
            console.log('this.selectedKey',this.selectedKey);
            this.deptTree();
            this.getAdminOverviewFn(data.id);
            this.getTenantIntroFn();
        },
        //获取部门树
        deptTree(){
            let params = {
                pageIndex: 1,
                limit: 999,
                totalItems: 0,
                roleType:this.user.roleType,
                domain:this.deptbrunch.id,
            };
            $log('params', params);
            this.fullscreenLoading = true;
            deptTree(params).then(ret => {
                this.fullscreenLoading = false;
                $log('treedata', ret);
                let resData = ret.data;
                let tree = this.deptbrunch;
                if(resData){
                    console.log('resData',resData);
                    this.departData = resData|| [];
                    if(tree && tree.id){
                        let treeId = tree.id;
                        function GetSubJson(jsonData, destID, json) {
                            for (let i = 0; i < jsonData.length; i++) {
                                if (jsonData[i].id == destID)
                                    json.push(jsonData[i]);
                                else {
                                    if (jsonData[i].hasOwnProperty("children")) {
                                        GetSubJson(jsonData[i].children, destID, json);
                                    }
                                }
                            }
                        }
                        let json = [];
                        GetSubJson(resData, treeId, json);
                        console.log('json',json);
                        this.brunch = json[0];
                        this.selectedKey.push(this.brunch.id);
                        console.log('brunch......',this.brunch );
                    }else{
                        this.brunch = this.departData[0];
                        this.selectedKey.push(this.brunch.id);
                        // 记录当前部门分支
                        this.$store.commit('user/DEPTBRUNCH', this.brunch);
                        this.getAdminOverviewFn(this.brunch.id);
                    }

                    this.getTenantIntroFn();

                }
            });
        },
        // 选择部门
        selDepart(data) {
            console.warn(data);
            this.departShow = false;
        },
        // 打开部门菜单
        // selDepartBox(e){
        //     this.departShow = !this.departShow;
        // },
        // 概览数据
        getAdminOverviewFn(id){
            let params = {
                deptId: id
            };
            getAdminOverview(params)
                .then(res => {
                    this.quota = [];
                    this.usages = [];
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.quota = res.data && res.data.quota || [];
                        this.usages = res.data && res.data.usages || [];
                        let deptList = res.data && res.data.deptList || [];
                        this.deptList = res.data && res.data.deptList || [];
                        // this.departData = [];
                        // for (let d in deptList){
                        //     let treeArr = {};
                        //     treeArr.label = deptList[d].name;
                        //     treeArr.id = deptList[d].id;
                        //     this.departData.push(treeArr);
                        // }
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
        //显示当前租户的详情
        selTenant(id){
            this.selTenantId = id;
            this.getAdminOverviewFn(id)
        },
        // 
        getTenantIntroFn() {
            let params = {
                deptId: this.brunch.id,
                projectName: this.searchVal
            };
            getTenantIntro(params)
                .then(res => {
                    console.warn(res);
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.tenantList = [];
                        this.tenantList = res.data || [];
                        console.log(' this.tenantList', this.tenantList);
                        console.log('this.selTenantId',this.selTenantId);
                        if(this.tenantList.length > 0) this.selTenantId = this.tenantList && this.tenantList[0].projectId;
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
        ...mapState({
            user: state => state.user.userInfo,
            deptbrunch: state => state.user.deptbrunch,
        }),
        tenantResource() {
            return this.tenantList.filter(
                item => item.projectId === this.selTenantId
            )
        },
    },
    created() {
        this.deptTree();
    },
    mounted(){
        this.clickDeptDropdown = (e) => {
            e.stopPropagation();
            if (e.target.className.split(' ')[1] === 'deptDropdownBtn' || e.target.className.split(' ')[0] === 'el-dropdown-link'|| e.target.className.split(' ')[0] === 'el-icon-caret-bottom'){
                this.departShow = !this.departShow;
                // document.getElementById('submit').click();
            }else{
                this.departShow = false;
            }
        };
        document.body.addEventListener('click', this.clickDeptDropdown, false);
    }
};