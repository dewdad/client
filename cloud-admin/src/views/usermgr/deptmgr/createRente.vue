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
                <div class="mb20 font16">
                    <i class="el-icon-tickets"></i>
                    <span class="pl6">配额</span>
                </div>
                <el-form-item label="VCPU数量：" prop="quota.cpu"  >
                    <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.cpu"></el-input-number>
                </el-form-item>
                <el-form-item label="实例：" prop="quota.instances" required>
                    <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.instances"></el-input-number>
                </el-form-item>
                <el-form-item label="卷：" prop="quota.volumes"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.volumes"></el-input-number>
                </el-form-item>
                <el-form-item label="卷快照：" prop="quota.snapshot"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.snapshot"></el-input-number>
                </el-form-item>
                <el-form-item label="卷及快照总大小(GB)：" prop="quota.volumeSize"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0"  :max="999999999" v-model="form.quota.volumeSize"></el-input-number>
                </el-form-item>
                <el-form-item label="内存(GB)：" prop="quota.ram"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.ram"></el-input-number>
                </el-form-item>
                <el-form-item label="安全组：" prop="quota.securityGroup"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.securityGroup"></el-input-number>
                </el-form-item>
                <el-form-item label="安全组规则：" prop="quota.securityGroupRule"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.securityGroupRule"></el-input-number>
                </el-form-item>
                <el-form-item label="浮动IP：" prop="quota.floatingIps"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.floatingIps"></el-input-number>
                </el-form-item>
                <el-form-item label="网络：" prop="quota.network" required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.network"></el-input-number>
                </el-form-item>
                <el-form-item label="端口：" prop="quota.ports" required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.ports"></el-input-number>
                </el-form-item>
                <el-form-item label="路由：" prop="quota.routers" required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.routers"></el-input-number>
                </el-form-item>
                <el-form-item label="子网：" prop="quota.subnet" required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.subnet"></el-input-number>
                </el-form-item>
                <el-form-item label="备份：" prop="quota.backup"  required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.backup"></el-input-number>
                </el-form-item>
                <el-form-item label="备份大小(GB)：" prop="quota.backupSize" required>
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="999999999" v-model="form.quota.backupSize"></el-input-number>
                </el-form-item>
                <!--<div class="mb20 font16">-->
                    <!--<i class="icon-new-配额"></i>-->
                    <!--<span class="pl6">成员</span>-->
                <!--</div>-->
                <!--<el-form-item label="选择成员："   >-->
                    <!--&lt;!&ndash;<el-button class="primary icon-zt_plus" style="cursor:pointer;padding:8px 12px;border:1px dashed #bbb;border-radius:3px;">  选择成员</el-button>&ndash;&gt;-->
                <!--</el-form-item>-->
                <!--<el-row>-->
                    <!--<div class="mb10" v-if="selectedUser.length>0">已选择：{{selectedUser[0].name}} 等 <span class="text-success font16 ">{{selectedUser.length}}</span> 位成员</div>-->
                    <!--<el-col :span="12" style="padding:10px;border:1px solid #BBB;height:400px;overflow-y: auto">-->
                        <!--<div class="mb10">所有用户：</div>-->
                        <!--<div class="item" v-for="(user,index) in allUsers" :key="user.id" v-if="allUsers.length>0">-->
                            <!--<span>{{user.name}}</span>-->
                            <!--<el-button type="primary pull-right" size="small" style="font-size: 18px;" @click="chooseCur(index)">+</el-button>-->
                        <!--</div>-->
                    <!--</el-col>-->
                    <!--<el-col :span="12" style="padding:10px;border:1px solid #BBB;border-left:0;height:400px;overflow-y: auto">-->
                        <!--<div class="mb10">已选择用户：</div>-->
                        <!--<div class="item" v-for="(user,index) in selectedUser" :key="user.id" v-if="selectedUser.length>0">-->
                            <!--<span>{{user.name}}</span>-->
                            <!--<el-button type="primary pull-right" size="small" style="font-size: 18px;" @click="delCur(index)">-</el-button>-->
                        <!--</div>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <div class="mt10" style="margin-left:180px;">
                    <el-button type="default" size="small" class="font12" @click="goBack">取 消</el-button>
                    <el-button type="primary" size="small" class="font12" @click="submitForm">提 交</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {selectAllUsers,createRenter} from '@/service/usermgr/deptmgr.js';
export default {
    name: 'createRenter',
    components: {
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
                quota:{
                    cpu:20,
                    instances:10,
                    volumes:10,
                    snapshot:10,
                    volumeSize:1000,
                    ram:50,
                    securityGroup:10,
                    securityGroupRule:100,
                    floatingIps:50,
                    network:10,
                    ports:50,
                    routers:10,
                    subnet:10,
                    backup:20,
                    backupSize:1000
                }
            },
            stateParams,
            fullscreenLoading: false,
            rules: {
                'name':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'quota.cpu': [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                'quota.instances': [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                'quota.volumes': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.snapshot': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.volumeSize': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.ram': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.securityGroup': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.securityGroupRule': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.floatingIps': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.network': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.ports': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.routers': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.subnet': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.backup': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ],
                'quota.backupSize': [
                    { required: true, message: '必填项', trigger: 'blur,submit' }
                ]
            },
            allUsers:[],
            selectedUser:[]
        };
    },
    methods:{
        //保存（提交）
        submitForm() {
            let param = {
                quota:this.form.quota,
                status:this.form.status == '1' ? '1' : '0',
                deptId:this.stateParams.item.id,
                extendId:this.stateParams.item.extendId,
                name:this.form.name,
                description:this.form.description,
            };
            this.$refs.form.validate((valid) => {
                if (valid) {
                    createRenter(param).then(ret => {
                        $log('result...', ret);
                        if(ret.data.code === '0000'){
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.goBack();
                        }else{
                            this.$alert('操作失败', '提示', {
                                type: 'error'
                            });
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
                domainId:this.stateParams.item.id
            };
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
            this.domainName = this.stateParams.item.name;
            this.form.domainId = this.stateParams.item.id;
        },
        //返回到列表页面
        goBack(){
            window.history.back();
        }
    },

    mounted() {
        this.setOrigin();
        this.selectAllProject();
        
        
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