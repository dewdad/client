<template>
    <div class="page-main">
        <div style="padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #e8e8e8;">
            <el-button  icon="el-icon-arrow-left" @click="goBack" size="small">返回</el-button>
            <span class="pull-right font16">租户{{opType ===1 ? '创建' : '编辑'}}</span>
        </div>
        <div class="page-body">
            <el-form class="base-info" ref="form" label-position="right"  v-loading.lock="fullscreenLoading" size="small" :model="form" label-width="180px" style="width:633px;" :rules="rules" inline-message>
                <div class="mb20 font16">
                    <i class="el-icon-tickets"></i>
                    <span class="pl6">基本信息</span>
                </div>
                <!-- 名称 -->
                <el-form-item label="部门" prop="domainId"  >
                    <el-input   :value="domainName" disabled></el-input>
                </el-form-item>

                <!-- 名称 -->
                <el-form-item label="名称" prop="name" >
                    <el-input clearable :maxlength="100" v-model="form.name"></el-input>
                </el-form-item>

                <!-- 描述 -->
                <el-form-item label="描述" prop="description"  >
                    <el-input clearable type="textarea" v-model="form.description"></el-input>
                </el-form-item>

                <!-- 是否激活 -->
                <el-form-item label="是否激活" prop="status"  >
                    <el-radio v-model="form.status" label='1'>是</el-radio>
                    <el-radio v-model="form.status" label='0'>否</el-radio>
                </el-form-item>

                <div class="mt10" style="margin-left:180px;">
                    <el-button type="default" size="small" class="font12" @click="goBack">取 消</el-button>
                    <el-button type="primary" size="small" class="font12" @click="submitForm">提 交</el-button>
                </div>
            </el-form>
        </div>
        <!--修改配额-->
        <change-quota ref="ChangeQuota"></change-quota>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import {selectAllUsers,createRenter} from '@/service/usermgr/deptmgr.js';
import ChangeQuota from './ChangeQuota';
export default {
    name: 'createRenter',
    components: {
        ChangeQuota
    },
    data() {
        let stateParams = this.$route.params || {};

        return {
            formLabelWidth:'30px;',
            opType: 1,
            domainName:'',
            form:{
                name: '',
                domainId: '',
                description: '',
                status: '1',

            },
            stateParams,
            fullscreenLoading: false,
            rules: {
                'name':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
            },
            allUsers:[],
            selectedUser:[]
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods:{
        //修改配额
        changeRentQuota(item){
            this.$refs.ChangeQuota.show(item).then(ret=>{
                if(ret){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.goBack();
                }
            }
            );
        },
        //保存（提交）
        submitForm() {
            let param = {
                status:this.form.status == '1' ? '1' : '0',
                deptId:this.stateParams.item.id,
                extendId:this.stateParams.item.extendId,
                name:this.form.name,
                description:this.form.description,
            };
            this.$refs.form.validate((valid) => {
                if (valid) {
                    createRenter(param).then(ret => {
                        $log('createRenter...', ret);
                        if(ret.data.code === '0000'){
                            console.log('ret.data.data',ret.data.data);
                            this.changeRentQuota(ret.data.data);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        selectAllProject(){
            let param = {
                limit:9999,
            };
            if(this.stateParams.item) param.domainId = this.stateParams.item.id;
            selectAllUsers(param).then(ret => {
                $log('list', ret);
                let resData = ret.data;
                if(resData){
                    this.allUsers = resData.data || [];
                }

            });
        },
        chooseCur(i){
            let item = this.allUsers.splice(i,1);
            this.selectedUser.push(item[0]);
        },
        delCur(i){
            let item = this.selectedUser.splice(i,1);
            this.allUsers.push(item[0]);
        },
        setOrigin(){
            console.log('stateParams.......',this.stateParams);
            let createRenteParam = localStorage.getItem('createRenteParam');
            if (createRenteParam != null) {
                this.stateParams = JSON.parse(createRenteParam);
            }
            if(this.stateParams.item) this.domainName = this.stateParams.item.name;
            if(this.stateParams.item) this.form.domainId = this.stateParams.item.id;
        },
        //返回到列表页面
        goBack(){
            window.history.back();
        }
    },
    beforeRouteLeave(to, from, next){
        console.log('to.name',to.name);
        //打开详情页（或者下一个任意界面）之前，把筛选条件保存到localStorage，如果离开列表页并且打开的不是详情页则清除，也可以选择不清除
        if (to.name == 'app.usrmgr.deptmgr') {
            let createRenteParam = JSON.stringify(this.stateParams);
            localStorage.setItem('createRenteParam', createRenteParam);
        }else{
            localStorage.removeItem('createRenteParam');
        }
        next();
    },
    mounted() {
        if(this.stateParams && this.stateParams.item){
            let str = JSON.stringify(this.stateParams);
            console.log('str',str);
            localStorage.setItem('createRenteParam', str);

        }
        let createRenteParam = localStorage.getItem('createRenteParam');
        if (createRenteParam) {
            let json = JSON.parse(createRenteParam);
            // let JSON = JSON.parse(createRenteParam);
            if(json.item) this.stateParams = json;
        }
        this.setOrigin();
        // this.selectAllProject();
        
        
    },
};
</script>
<style lang="scss" scoped>
.base-info {
    padding-left: 30px;
}
.item{
    &:last-child{
        border-bottom:1px solid #BBB;
    }
    border: 1px solid #BBB;
    border-bottom:0;
    background-color: #f9f9f9;
    overflow: hidden;
    line-height:40px;
    padding:5px;
    p{
        margin-bottom:10px;
    }
}
</style>