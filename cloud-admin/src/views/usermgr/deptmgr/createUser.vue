<template>
    <div class="page-main">
        <div style="padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #e8e8e8;">
            <el-button  icon="el-icon-arrow-left" @click="goBack" size="small">返回</el-button>
            <span class="pull-right font16">用户{{opType ===1 ? '创建' : '编辑'}}</span>
        </div>
        <div class="page-body">
            <el-form class="base-info" ref="form" label-position="right"  v-loading.lock="fullscreenLoading" size="small" :model="form" label-width="115px" style="width:633px;" :rules="rules" >
                <!-- 名称 -->
                <el-form-item label="部门" prop="domainId"  >
                    <el-input   :value="domainName" disabled></el-input>
                </el-form-item>
                <!-- 名称 -->
                <el-form-item label="用户名称" prop="name" >
                    <el-input clearable :maxlength="100" v-model="form.name"></el-input>
                </el-form-item>
                <!-- 描述 -->
                <el-form-item label="描述" prop="description"  >
                    <el-input clearable type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email"  >
                    <el-input clearable type="email"  v-model="form.email" v-bind:class="{ borderRed: invalidEmail }" @blur="checkEmail" @change="checkEmail"></el-input>
                    <div v-if="invalidEmail" style="color: #f56c6c;font-size: 12px;text-align:left;line-height:1.6">密码格式不正确</div>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password"  >
                    <el-input clearable type="password"   v-model="form.password"></el-input>
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item label="确认密码" prop="confirpwd"  >
                    <el-input clearable type="password" v-bind:class="{ borderRed: invalidPsd }" v-model="form.confirpwd" @blur="checkPwd" @change="checkPwd"></el-input>
                    <div v-if="invalidPsd" style="color: #f56c6c;font-size: 12px;text-align:left;line-height:1.6">两次密码不一致</div>
                </el-form-item>
                <!-- 角色 -->
                <el-form-item label="角色" prop="roleId"  >
                    <el-select clearable v-model="form.roleId"  placeholder="请选择" style="width:100%;">
                        <el-option :label="role.roleName" :value="role.id" v-for="role in roleLists" :key="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 是否激活 -->
                <el-form-item label="是否激活" prop="status"  >
                    <el-radio v-model="form.status" label='1'>是</el-radio>
                    <el-radio v-model="form.status" label='0'>否</el-radio>
                </el-form-item>
            </el-form>
            <div class="mt10" style="margin-left:115px;">
                <el-button type="default" size="small" class="font12" @click="goBack">取 消</el-button>
                <el-button type="primary" size="small" class="font12" @click="submit">提 交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {createUser} from '@/service/usermgr/deptmgr.js';
import {getRoleList} from '@/service/usermgr/rolemgr.js';
export default {
    name: 'createUser',
    components: {

    },
    data() {
        let stateParams = this.$route.params || {};
        return {
            opType: 1,
            domainName:'',
            invalidPsd:false,
            invalidEmail:false,
            form:{
                name: '',
                domainId: '',
                description: '',
                status: '1',
                email: '',
                roleId: '',
                password: '',
                confirpwd: '',
            },
            roleLists:[],
            stateParams,
            fullscreenLoading: false,
            rules: {
                'name':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'password':[
                    { required: true,message: '必填项',trigger: ['blur']},

                ],
                'confirpwd':[
                    { required: true,message: '必填项',trigger: ['submit']}

                ],
                'roleId':[
                    { required: true,message: '必填项',trigger: ['change']}
                ],
                // 'email':[
                //     { required: false,message: '必填项',trigger: ['change']},
                //     { validator: validateEmail, trigger: 'submit' }
                // ]
            },
        };
    },
    beforeRouteLeave(to, from, next){
        console.log('to.name',to.name);
        //打开详情页（或者下一个任意界面）之前，把筛选条件保存到localStorage，如果离开列表页并且打开的不是详情页则清除，也可以选择不清除
        if (to.name == 'app.usrmgr.deptmgr') {
            let createUserParam = JSON.stringify(this.stateParams);
            localStorage.setItem('createUserParam', createUserParam);
        }else{
            localStorage.removeItem('createUserParam');
        }
        next();
    },
    methods:{
        //保存（提交）
        submit() {
            let param = {
                status:this.form.status == '1' ? '1' : '0',
                deptId:this.stateParams.item.id,
                name:this.form.name,
                description:this.form.description,
                password:this.form.password,
                email:this.form.email,
                roleId:this.form.roleId,
            };
            if(this.form.password !== this.form.confirpwd || this.invalidEmail) {
                this.invalidPsd = true;
                return;
            } else {
                this.invalidPsd = false;
            }
            console.log('param...',param);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    createUser(param).then(ret => {
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
                            return;
                        }
                    }).catch(err => {
                        if (err) {
                            console.log('Error', err);
                        } else {
                            console.log('取消');
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        selectRoleList(){
            let param = {
                limit:9999
            };
            getRoleList(param).then(ret => {
                $log('roleList', ret);
                let resData = ret.data;
                if(resData){
                    this.roleLists = resData.data || [];
                }

            });
        },
        checkPwd(){
            if(this.form.password !== this.form.confirpwd) {
                this.invalidEmail = true;
            } else {
                this.invalidEmail = false;
            }
        },
        checkEmail(){
            let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
            if (this.form.email == '') {
                this.invalidEmail = false;
            } else if(!reg.test(this.form.email)){
                this.invalidEmail = true;
            }else{
                this.invalidEmail = false;
            }
        },
        setOrigin(){
            console.log('stateParams.......',this.stateParams);
            let createUserParam = localStorage.getItem('createUserParam');
            if (createUserParam != null) {
                this.stateParams = JSON.parse(createUserParam);
            }
            if(this.stateParams.item) this.domainName = this.stateParams.item.name;
        },
        //返回到列表页面
        goBack(){
            window.history.back();
        }
    },

    mounted() {
        if(this.stateParams && this.stateParams.item){
            let str = JSON.stringify(this.stateParams);
            localStorage.setItem('createUserParam', str);

        }
        let createUserParam = localStorage.getItem('createUserParam');
        if (createUserParam) {
            let json = JSON.parse(createUserParam);
            if(json.item) this.stateParams = json;
        }
        this.setOrigin();
        this.selectRoleList();
        
    },
};
</script>
<style lang="scss" scoped>
    .borderRed{
        border-color:#f56c6c;
    }
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