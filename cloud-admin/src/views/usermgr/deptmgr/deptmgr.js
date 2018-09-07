import PageHeader from '@/components/pageHeader/PageHeader';
import CreateDept from './CreateDept';
import QuotaAndUsage from './QuotaAndUsage';
import ClientDetail from './ClientDetail';
import ProjectDetail from './ProjectDetail';
import ResetPwd from './ResetPwd';
import { mapState } from 'vuex';

import {deptTree,delDept,ableDept,projectList,delRenter} from '@/service/usermgr/deptmgr.js';
export default {
    name: 'deptmgr',
    data() {
        let searchObj1 = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let searchObj2 = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let rentcols = [
            { column: 'username', text:'用户名' , width: '10%'},
            { column: 'descprition', text:'描述' , width: '10%'},
            { column: 'id', text: '租户ID', width: '10%' },
            { column: 'start', text: '激活', width: '5%' },
            { column: 'dept', text: '部门', width: '10%' },
        ];
        let usercols = [
            { column: 'username', text:'用户名' , width: '10%'},
            { column: 'emailAddress', text:'邮箱' , width: '10%'},
            { column: 'id', text: '用户ID', width: '10%' },
            { column: 'start', text: '激活', width: '5%' },
            { column: 'dept', text: '部门', width: '10%' },
        ];
        return {
            rentcols,
            usercols,
            searchObj1,
            searchObj2,
            formInline:{
                searchText:''
            },
            rentForm:{
                type:'name',
                searchText:''
            },
            userForm:{
                type:'name',
                searchText:''
            },
            activeName:'first',
            tableData1: [],
            tableData2: [],
            deptTreeData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            brunch:{},
            hasBrunch:false
        };
    },
    components: {
        PageHeader,
        CreateDept,
        QuotaAndUsage,
        ClientDetail,
        ProjectDetail,
        ResetPwd

    },
    computed:{
        ...mapState({
            dept: state => state.user.dept,
            user: state => state.user.userInfo,
        }),
    },
    methods: {
        handleNodeClick(data){
            this.brunch = data;
            sessionStorage.setItem('deptTree',data);
            console.log(data);
        },
        //获取部门树
        deptTree(){
            let params = {
                pageIndex: 1,
                limit: 999,
                totalItems: 0,
                roleType:this.user.roleType,
                domain:this.user.deptId,
            };
            $log('params', params);
            deptTree(params).then(ret => {
                $log('treedata', ret);
                let resData = ret.data;
                let tree = sessionStorage.getItem('deptTree');
                if(resData){
                    this.deptTreeData = resData|| [];
                    if(tree&&tree.id){
                        this.for_each_branch( this.deptTreeData,function (b) {
                            if(tree.id == b.id){
                                this.branch = tree;
                            }
                        });
                    }else{
                        this.brunch = this.deptTreeData[0];
                    }
                    this.getprojectList();
                    sessionStorage.setItem('deptTree',this.deptTreeData[0]);
                }
            });
        },
        //创建租户
        createRenter(){
            return this.$router.push({name:'app.usrmgr.createRente',params:{optType:1,item:this.brunch}});
        },
        //创建用户
        createUser(){
            return this.$router.push({name:'app.usrmgr.createRente',params:{optType:1,item:this.brunch}});
        },
        //删除租户
        delRenter(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delRenter(item.id).then(ret=>{
                    this.getprojectList();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        for_each_branch(treeData,f) {
            let do_f, root_branch, _i, _len, _ref, _results;
            do_f = function(branch) {
                let child, _i, _len, _ref, _results;
                f(branch);
                if ( (branch.children != null) && (branch.children.length>0) ){
                    _ref = branch.children;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        child = _ref[_i];
                        _results.push(do_f(child));
                    }
                    return _results;
                }
            };
            _ref = treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                root_branch = _ref[_i];
                _results.push(do_f(root_branch, 1));
            }
            return _results;
        },
        getprojectList(){
            let param = {
                [this.rentForm.type]:this.rentForm.searchText,
                paging:this.searchObj1,
                deptId:this.brunch?this.brunch.id:this.user.deptId
            };
            $log('params', param);
            projectList(param).then(ret => {
                $log('list', ret);
                let resData = ret.data;
                if(resData){
                    this.tableData1 = resData.data|| [];

                }

            });
        },
        createDept(item,optype){
            this.$refs.CreateDept.show(item,optype)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.deptTree();
                    return this.$confirm('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        deleteDept(){

        },
        viewDept(){
            this.$refs.QuotaAndUsage.show(this.brunch)
                .then(ret => {

                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        enableDept(item){
            let enableState = item.enabled;
            let status = item.status;
            item.enabled = true;
            item.status = 1;
            ableDept(item).then(ret => {
                if(ret.data.code === '0000'){
                    console.log('操作成功', ret);
                    this.deptTree();
                    return this.$confirm('操作成功');
                }else{
                    item.enabled = enableState;
                    item.status = status;
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }

            });
        },
        disableDept(item){
            let enableState = item.enabled;
            let status = item.status;
            item.enabled = false;
            item.status = 0;
            ableDept(item).then(ret => {
                if(ret.data.code === '0000'){
                    console.log('操作成功', ret);
                    this.deptTree();
                    return this.$confirm('操作成功');
                }else{
                    item.enabled = enableState;
                    item.status = status;
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            });
        },
        editDept(){

        },
        searchDeptTree(){

        },
        /**
         * 删除部门
         */
        delDept(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delDept(item).then(ret=>{
                    this.deptTree();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //创建平台
        createPlatForm(item,optype){
            this.$refs.CreateResource.show(item,optype)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.getplatformList();
                    return this.$confirm('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },

        currentChange1(val){
            this.searchObj1.paging.pageIndex = val;
            this.getplatformList();
        },
        handleSizeChange1 (val) {
            this.searchObj1.paging.limit = val;
            this.getplatformList();
        },
        currentChange2(val){
            this.searchObj2.paging.pageIndex = val;
            this.getplatformList();
        },
        handleSizeChange2 (val) {
            this.searchObj2.paging.limit = val;
            this.getplatformList();
        },
        onSubmit() {}
    },
    mounted(){
        console.log('dd',this.dept);
        this.deptTree();
    }
};