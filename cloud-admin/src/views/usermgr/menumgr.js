
import PageHeader from '@/components/pageHeader/PageHeader';
import {getMenuList} from '@/service/usermgr/menumgr';

// 表头列
const tableColums = [
    { prop: 'menucode', label: '菜单编码', render: true, width: '200px'},
    { prop: 'menuname', label: '菜单名称', render: true, width: '200px'},
    { prop: 'menuicon', label: '菜单图标', render: true, width: '200px'},

    { prop: 'sref', label: '路由地址', render: true, width: '200px'},
    { prop: 'pmenucode', label: '父菜单编码', render: true, width: '200px'},
    { prop: 'menutype', label: '菜单类型', render: true, width: '200px'},
];
export default {
    name: 'menuMgr',
    components: {        
        PageHeader,
    }, 
    data() {
        
        return {
            tableColums,  
            dataList:[], 
            searchObjExtra: {
                //菜单类型
                menutypes: [
                    { label: '用户', field: 'user',value:1 },
                    { label: '管理员', field: 'admin',value:2 },
                ],
                //查询字段
                fields: [
                    { label: '菜单名称', field: 'text' },
                    { label: '菜单编码', field: 'code' },
                ]
            },
            // 查询参数
            searchObj: {
                menutype:'',
                field: '', //'text'菜单名称 'code'菜单编码 
                searchText:'',  
                //分页
                paging: {
                    pageIndex: 1,
                    limit: 10,
                    totalItems: 0
                },           
            },        
        };
    },    
           
    created() {
        this.search();
    },
    methods: {
        //查询；
        search(){            
            getMenuList(this.searchObj)
                .then( res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data;
                        console.log('resData', resData);
                        if (resData && resData.data) {
                            let dataList = resData.data || [];                                
                            this.dataList = dataList;                            
                            this.searchObj.paging.totalItems = resData.total || 0;
                        }                      
                    } else {
                        this.$message.error(res.msg);
                    }                    
                })
                .catch( err => {
                    // //测试数据
                    // let res = {'code':'0000','data':{'limit':'10','offset':'0','marker':null,'sort':null,'sortKey':null,'pageIndex':'1','total':69,'data':[{'id':'1','code':'1000','text':'概览','icon':'icon-new-概览','sref':'app.overview.overview','url':'/app/views/overview/overview.html','alert':'1','prCode':null,'menuType':1,'status':1,'orderBy':1,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null},{'id':'10','code':'10021006','text':'网络','icon':'','sref':'#','url':null,'alert':'1','prCode':'1002','menuType':1,'status':1,'orderBy':2,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null},{'id':'11','code':'100210061001','text':'网络拓扑','icon':'','sref':'app.cloudres.network.topology','url':'/app/views/cloudres/network/topology.html','alert':'1','prCode':'10021006','menuType':1,'status':1,'orderBy':1,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':''},{'id':'12','code':'100210061002','text':'网络管理','icon':'','sref':'app.cloudres.network.netmgr','url':'/app/views/cloudres/network/netmgr.html','alert':'1','prCode':'10021006','menuType':1,'status':1,'orderBy':2,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null},{'id':'13','code':'100210061003','text':'路由管理','icon':'','sref':'app.cloudres.network.routermgr','url':'/app/views/cloudres/network/routermgr.html','alert':'1','prCode':'10021006','menuType':1,'status':1,'orderBy':3,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null},{'id':'14','code':'100210061004','text':'IP管理','icon':'','sref':'app.cloudres.network.ipmgr','url':'/app/views/cloudres/network/ipmgr.html','alert':'1','prCode':'10021006','menuType':1,'status':1,'orderBy':4,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null},{'id':'15','code':'1003','text':'安全监控','icon':'icon-new-安全监控','sref':'#','url':null,'alert':'1','prCode':'','menuType':1,'status':1,'orderBy':4,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null},{'id':'16','code':'10031001','text':'安全组','icon':'','sref':'app.safemonitor.groups','url':'/app/views/safemonitor/groups.html','alert':'1','prCode':'1003','menuType':1,'status':1,'orderBy':1,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':''},{'id':'17','code':'10031002','text':'告警策略','icon':'','sref':'app.safemonitor.alarmstrategy','url':'/app/views/safemonitor/alarmstrategy.html','alert':'1','prCode':'1003','menuType':1,'status':1,'orderBy':2,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null},{'id':'18','code':'2001','text':'系统管理','icon':'icon-new-系统管理','sref':'#','url':null,'alert':'1','prCode':'','menuType':2,'status':1,'orderBy':6,'selected':false,'permissionId':null,'submenu':null,'handlers':null,'arrow':'1','attrServices':null}],'param':{'totalItems':'69'}},'msg':'success','success':true};
                    // let resData = res.data;
                    // this.dataList = resData.data || [];
                    // this.searchObj.paging.totalItems = resData.total;
                    this.dataList = [];
                    this.searchObj.paging.totalItems = 0;
                });
        },

        //创建子菜单
        createSubmenu(rowItem){
            return this.$router.push({name:'app.usrmgr.menumgr.edit',params:{opType:1,code:rowItem.menuCode}});
        },

        //编辑
        editMenu(rowItem){            
            return this.$router.push({name:'app.usrmgr.menumgr.edit',params:{opType:2,code:rowItem.menuCode,rowItem}});
        },

        //关联操作
        setMenuInfo(){

        },

        //分页查询事件
        handleCurrentChange(pageIndex){
            this.searchObj.paging.pageIndex = pageIndex;
            this.search();
        },
        handleSizeChange: function(params) {
            console.log('params:', params);
            this.searchObj.paging.limit = params;
            this.searchObj.paging.pageIndex = 1;
            this.search();
        },
    },
    mounted() {}
};