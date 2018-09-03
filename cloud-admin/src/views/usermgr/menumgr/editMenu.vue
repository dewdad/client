<template>
    <div class="page-main">
        <page-header>            
            <i class="fa fa-angle-left" @click="goBack"></i>
            <span>菜单{{opType ===1 ? '创建' : '编辑'}}</span> 
        </page-header>
        <div class="page-body">
            <div class="mb20 font16">
                <i class="fa fa-angle-left"></i>
                <span>基本信息</span>
            </div>
            <el-form class="base-info" ref="createMenu" label-position="left" v-loading.lock="fullscreenLoading" size="small" :model="menu" label-width="115px" style="width:433px;" :rules="rules" inline-message>
                <!-- 基本信息 -->               
                                       
                <!-- 菜单名称 -->
                <el-form-item label="菜单名称" prop="text">
                    <el-input clearable :maxlength="32" v-model="menu.text"></el-input>
                </el-form-item>

                <!-- 菜单图标 -->
                <el-form-item label="菜单图标" >
                    <el-input clearable :maxlength="100" v-model="menu.icon"></el-input>
                </el-form-item>

                <!-- 菜单路由地址 -->
                <el-form-item label="菜单路由地址" prop="sref">
                    <el-input clearable :maxlength="200" v-model="menu.sref"></el-input>
                </el-form-item>

                <!-- 菜单视图地址 -->
                <el-form-item label="菜单视图地址" prop="url">
                    <el-input clearable :maxlength="200" v-model="menu.url"></el-input>
                </el-form-item>

                <!-- 菜单排序 -->
                <el-form-item label="菜单排序" prop="orderBy">
                    <el-input type="number" clearable max="100" v-model="menu.orderBy"></el-input>
                </el-form-item>

                <!-- 菜单类型 -->
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="menu.menuType">
                        <el-radio :label="1">用户</el-radio>
                        <el-radio :label="2">管理员</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 菜单状态 -->
                <el-form-item label="菜单状态" prop="status">
                    <el-radio-group v-model="menu.status">
                        <el-radio :label="1">有效</el-radio>
                        <el-radio :label="2">无效</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 是否展现 -->
                <el-form-item label="是否展现" prop="alert">
                    <el-radio-group v-model="menu.alert">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>  

                <el-form-item>
                    <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
                    <el-button size="small" @click="goBack">取消</el-button>
                </el-form-item>                  
               
            </el-form>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import { addtMenu,updateMenu} from '@/service/usermgr/menumgr';
export default {
    name: 'editMenu',
    components: {        
        PageHeader,
    },
    data() {
        let menu = {
            text: '',
            icon: '',
            sref: '',
            url: '',
            orderBy: '',
            menuType: 1,
            status: 1,
            alert : '1',
        };
        
        return {           
            opType: 1,
            menu,
            fullscreenLoading: false,
            rules: {
                text:[
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit','blur']
                    },
                    {
                        min: 1,
                        max:32,
                        message: '最多32位',
                        trigger: ['submit','blur']
                    },
                ],
                sref:[
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit','blur']
                    },
                    {
                        min: 1,
                        max:200,
                        message: '最多200位',
                        trigger: ['submit','blur']
                    },
                ],
                url:[
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit','blur']
                    },
                    {
                        min: 1,
                        max:200,
                        message: '最多200位',
                        trigger: ['submit','blur']
                    },                
                ],
                orderBy:[
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit','blur']
                    },
                    {    
                        min:0,                    
                        max:100,
                        message: '最大值100',
                        trigger: ['submit','blur']
                    },
                ]
            } 
        };
    },
    methods:{
        //保存（提交）
        onSubmit() {
            this.$refs['createMenu'].validate( valid => {
                if (valid) {                  
                    let saveInfoFn = addtMenu; //默认新增接口
                    if (this.opType === 2) saveInfoFn = updateMenu; //如果是修改，则saveInfoFn 指向修改用户接口

                    this.fullscreenLoading = true;
                    saveInfoFn(this.menu)
                        .then( result => {
                            this.fullscreenLoading = false;
                            if (result && result.code === this.CODE.SUCCESS_CODE) {
                                console.log(JSON.stringify(result));
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });                               
                            } else {
                                this.$message.error(result.msg);
                            }
                        })
                        .catch((err) => {
                            this.fullscreenLoading = false;
                            // 显示异常
                            this.$message.error(err);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        goBack(){
            this.$router.push({name:'app.usrmgr.menumgr'});
        }
    },

    created() {
        let stateParams = this.$route.params;
        this.opType = stateParams.opType;
        if(stateParams.opType === 2) {
            this.menu = stateParams.rowItem;            
        }
    },
};
</script>
<style lang="scss" scoped>
.base-info {
    padding-left: 30px;
}
</style>