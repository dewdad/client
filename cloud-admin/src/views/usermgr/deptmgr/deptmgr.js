import PageHeader from '@/components/pageHeader/PageHeader';
import CreateDept from './CreateDept';
import QuotaAndUsage from './QuotaAndUsage';
import ClientDetail from './ClientDetail';
import ProjectDetail from './ProjectDetail';
import ChangeQuota from './ChangeQuota';
import EditRente from './EditRente';
import EditUser from './EditUser';
import SelectMember from './SelectMember';
import ViewUsage from './ViewUsage';
import ResetPwd from './ResetPwd';
import { mapState } from 'vuex';

import {deptTree,delDept,ableDept,projectList,delRenter,findeRole,delUser,editUser} from '@/service/usermgr/deptmgr.js';
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
            hasBrunch:false,
            selectedKey:[],
            i:0,
        };
    },
    components: {
        PageHeader,
        CreateDept,
        QuotaAndUsage,
        ClientDetail,
        ProjectDetail,
        ResetPwd,
        ViewUsage,
        ChangeQuota,
        SelectMember,
        EditRente,
        EditUser

    },
    computed:{
        ...mapState({
            dept: state => state.user.dept,
            user: state => state.user.userInfo,
            deptbrunch: state => state.user.deptbrunch,
        }),
    },
    methods: {
        // handleClick(data,checked, node) {
        //     this.i++;
        //     if(this.i%2==0){
        //         if(checked){
        //             this.$refs.tree.setCheckedNodes([]);
        //             this.$refs.tree.setCheckedNodes([data]);
        //             //交叉点击节点
        //         }else{
        //             this.$refs.tree.setCheckedNodes([]);
        //             //点击已经选中的节点，置空
        //         }
        //     }
        // },
        handleNodeClick(data){
            this.brunch = data;
            // 记录当前部门分支
            this.$store.commit('user/DEPTBRUNCH', data);
            this.selectedKey = [];
            this.selectedKey.push(data.id);
            console.log('this.selectedKey',this.selectedKey);
            this.deptTree();
            this.getprojectList();
            this.findeRole();
        },
        //获取部门树
        deptTree(){
            let params = {
                pageIndex: 1,
                limit: 999,
                totalItems: 0,
                roleType:this.user.roleType,
                domain:this.user.deptId,
                searchText:this.formInline.searchText
            };
            $log('params', params);
            deptTree(params).then(ret => {
                $log('treedata', ret);
                let resData = ret.data;
                let tree = this.deptbrunch;
                this.selectedKey = [];
                if(resData){
                    this.deptTreeData = resData|| [];
                    if(tree && tree.id){
                        console.log('tree....',tree);
                        this.brunch = tree;
                        this.selectedKey.push(tree.id);
                    }else{
                        this.brunch = this.deptTreeData[0];
                        this.selectedKey.push(this.brunch.id);
                        // 记录当前部门分支
                        this.$store.commit('user/DEPTBRUNCH', this.brunch);
                    }
                    this.getprojectList();
                    this.findeRole();

                }
            });
        },
        //创建租户
        createRenter(){
            return this.$router.push({name:'app.usrmgr.createRente',params:{optType:1,item:this.brunch}});
        },
        //创建用户
        createUser(){
            return this.$router.push({name:'app.usrmgr.createUser',params:{optType:1,item:this.brunch}});
        },
        //删除租户
        delRenter(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delRenter(item.id).then(ret=>{
                    if(ret.code === '0000'){
                        this.getprojectList();
                        return this.$confirm('操作成功');
                    }else{
                        this.$alert('操作失败', '提示', {
                            type: 'error'
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //删除用户
        delUser(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delUser(item.id).then(ret=>{
                    if(ret.code === '0000'){
                        this.findeRole();
                        return this.$confirm('操作成功');
                    }else{
                        this.$alert('操作失败', '提示', {
                            type: 'error'
                        });
                    }

                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //获取租户列表
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
        //获取用户列表
        findeRole(){
            let param = {
                [this.userForm.type]:this.userForm.searchText,
                paging:this.searchObj2,
                deptId:this.brunch?this.brunch.id:this.user.deptId
            };
            $log('findeRoleparams', param);
            findeRole(param).then(ret => {
                $log('findeRole', ret);
                let resData = ret.data;
                if(resData){
                    this.tableData2 = resData.data|| [];

                }

            });
        },
        //创建部门
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
        //查看配额
        viewUsage(item,brunch){
            this.$refs.ViewUsage.show(item,brunch);
        },
        //修改配额
        changeRentQuota(item,brunch){
            this.$refs.ChangeQuota.show(item,brunch).then(ret=>{
                    if(ret) this.getprojectList();
                }
            );
        },
        //管理成员
        manageMember(item,brunch){
            this.$refs.SelectMember.show(item,brunch);
        },
        //租户详情
        showRentaDetail(item){
            this.$refs.ProjectDetail.show(item);
        },
        //用户详情
        showUserDetail(item){
            this.$refs.ClientDetail.show(item);
        },
        //修改租户
        editRente(item,brunch){
            this.$refs.EditRente.show(item,brunch).then(ret=>{
                    if(ret) this.getprojectList();
                }
            );
        },
        //修改用户
        EditUser(item,brunch){
            this.$refs.EditUser.show(item,brunch).then(ret=>{
                    if(ret) this.findeRole();
                }
            );
        },
        //修改用户
        resetPwd(item,brunch){
            this.$refs.ResetPwd.show(item,brunch).then(ret=>{
                    if(ret) this.findeRole();
                }
            );
        },
        //查看配额
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
        //启用部门
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
        //禁用部门
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
        //禁用用户
        disableUser(item,brunch){
            let enableState = item.enabled;
            let status = item.status;
            item.enabled = false;
            item.status = 0;
            let param = {
                data:{
                    enabled:false,
                    status:0,
                },
                id:item.id
            };
            editUser(param).then(ret => {
                if(ret.data.code === '0000'){
                    console.log('操作成功', ret);
                    this.findeRole();
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
                    // 清空被删除的部门分支
                    this.$store.commit('user/DEPTBRUNCH', {});
                    this.deptTree();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
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
        }
    },
    mounted(){
        console.log('dd',this.dept);
        this.deptTree();

    }
};