<template>
    <div class="page-main">
        <page-header>
            <el-button  icon="el-icon-arrow-left" @click="goBack" size="small">返回</el-button>
            <span class="ml20">菜单{{opType ===1 ? '创建' : '编辑'}}</span>
        </page-header>
        <div class="page-body">
            <el-form class="base-info" ref="createMenu" label-position="right" v-loading.lock="fullscreenLoading" size="small" :model="menu" label-width="115px" style="width:433px;" :rules="rules" inline-message>
                <!-- 基本信息 -->   

                <!-- 上级菜单Code -->
                <el-form-item label="上级菜单Code" prop="parentMenuCode" v-if="(opType === 1) && menu.parentMenuCode">
                    <span>{{ menu.parentMenuCode}}</span>
                    <!-- <el-input clearable :maxlength="32" v-model="menu.menuName"></el-input> -->
                </el-form-item>            
                                       
                <!-- 菜单名称 -->
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input clearable :maxlength="32" v-model="menu.menuName"></el-input>
                </el-form-item>

                <!-- 菜单图标 -->
                <el-form-item label="菜单图标" >
                    <el-input clearable :maxlength="100" v-model="menu.menuIcon"></el-input>
                </el-form-item>

                <!-- 菜单路由地址 -->
                <el-form-item label="菜单路由地址" prop="routeHref">
                    <el-input clearable :maxlength="200" v-model="menu.routeHref"></el-input>
                </el-form-item>

                <!-- 菜单视图地址 -->
                <el-form-item label="菜单视图地址" prop="routeUrl">
                    <el-input clearable :maxlength="200" v-model="menu.routeUrl"></el-input>
                </el-form-item>

                <!-- 菜单排序 -->
                <el-form-item label="菜单排序" prop="orderBy">
                    <el-input-number class="width-full" controls-position="right" :min="0" :max="100" v-model="menu.orderBy"></el-input-number>
                </el-form-item>

                <!-- 菜单类型 -->
                <!-- <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="menu.menuType">
                        <el-radio :label="1">用户</el-radio>
                        <el-radio :label="2">管理员</el-radio>
                    </el-radio-group>
                </el-form-item> -->

                <!-- 菜单状态 -->
                <el-form-item label="菜单状态" prop="status">
                    <el-radio-group v-model="menu.status">
                        <el-radio :label="1">有效</el-radio>
                        <el-radio :label="2">无效</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 是否展现 -->
                <el-form-item label="是否展现" prop="isNew">
                    <el-radio-group v-model="menu.isNew">
                        <el-radio label="new">是</el-radio>
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
            parentMenuCode: '',
            menuName: '',
            menuIcon: '',
            routeHref: '',
            routeUrl: '',
            orderBy: 1,
            menuType: 1,
            status: 1,
            isNew : 'new',
        };
        
        return {           
            opType: 1,
            menu,
            fullscreenLoading: false,
            rules: {
                menuName:[
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
                routeHref:[
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
                routeUrl:[
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
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });   
                                this.goBack();                            
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

        //返回到列表页面
        goBack(){
            this.$router.push({name:'app.usrmgr.menumgr'});
        }
    },

    created() {
        let stateParams = this.$route.params;
        this.opType = parseInt(stateParams.opType);        
        if(this.opType === 1){
            if(parseInt(stateParams.code) > 0){
                this.menu.parentMenuCode = stateParams.code;
            }            
        } else if(this.opType === 2) {
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