<template>
    <div class="page-body user-info">
        <!-- <page-header class="no-border"> -->
        <page-header>
            <span class="font18">{{ $t('basicInfo.basicInfo') }}</span>
        </page-header>
        <div class="userInfo">
            <zt-form ref="userInfo" v-loading.lock="fullscreenLoading" size="small" label-width="102px" :rules="rules" inline-message>                
                <zt-form-item label="用户名：" class="mt20">
                   <span>{{userInfo.name}}</span>
                </zt-form-item>

                <zt-form-item label="用户ID：" >
                   <span>{{userInfo.id}}</span>
                </zt-form-item>

                <zt-form-item label="租户名称：" >
                   <span>{{userInfo.name}}</span>
                </zt-form-item>

                <zt-form-item label="租户ID：" >
                   <span>{{userInfo.id}}</span>
                </zt-form-item>

                <zt-form-item label="部门名称：" >
                   <span>{{userInfo.deptId}}</span>
                </zt-form-item>

                <zt-form-item label="邮箱：" >                   
                   <el-input v-if="userDetailInfo.isEditEmail" type="email" class="wd200" v-model="userInfo.email"></el-input>
                   <span class="wd200 inline-block" v-else>{{userInfo.email  || '--'}}</span>
                   <a class="pl20" @click="userDetailInfo.isEditEmail = true;">修改</a>
                </zt-form-item>

                <zt-form-item label="密码：" >                   
                   <el-input v-if="userDetailInfo.isEditPwd" type="password" class="wd200" v-model="userInfo.email"></el-input>
                   <span class="wd200 inline-block" v-else>{{ userInfo.password|hiddenStr(0,0) || '--' }}</span>
                   <a class="pl20" @click="userDetailInfo.isEditPwd = true;">修改</a>
                </zt-form-item>

                <zt-form-item label="描述：" >                   
                   <el-input v-if="userDetailInfo.isEditDesc" type="textarea" class="wd200" v-model="userInfo.description"></el-input>
                   <span class="wd200 inline-block" v-else>{{userInfo.description  || '--'}}</span>
                   <a class="pl20" @click="userDetailInfo.isEditDesc = true;">修改</a>
                </zt-form-item>

                <zt-form-item label="角色：" >
                   <el-table :data="roleTableData" row-class-name="data-list" header-row-class-name="data-list" border class="data-list">
                        <el-table-column label="角色名称" width="318">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="角色类型" width="202">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.roleType}}</span>
                            </template>
                        </el-table-column>                       
                        <el-table-column label="描述">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.desc}}</span>
                            </template>
                        </el-table-column>                    
                    </el-table>
                </zt-form-item>

                <zt-form-item label="Project：" >
                   <el-table :data="projectTableData" row-class-name="data-list" header-row-class-name="data-list" border class="data-list">
                        <el-table-column prop="title" label="名称" width="318">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="ID" width="202">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.ID}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="地域" width="202">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.region}}</span>
                            </template>
                        </el-table-column>                        
                        <el-table-column label="描述">
                            <template slot-scope="scope">
                                <span class="font12">{{scope.row.desc}}</span>
                            </template>
                        </el-table-column>                    
                    </el-table>
                    <div class="pagination">
                        <el-pagination background  class="text-left"
                        @size-change="handleSizeChange" 
                        :current-page.sync="searchObj.paging.pageIndex" 
                        @current-change="handleCurrentChange" 
                        :page-sizes="[10, 20, 50, 100]" 
                        :page-size="searchObj.paging.limit" 
                        layout="sizes,total,prev, pager, next" 
                        :total="searchObj.paging.totalItems">
                        </el-pagination>
                    </div>
                </zt-form-item>
                
            </zt-form>
        </div>
    </div>
</template>
<script>
import {getUserInfoDetail} from '@/service/user';
import {mapGetters} from 'vuex';
export default {
    data() {   
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 2
            },            
        };   
        return {
            searchObj,
            fullscreenLoading: false,
            userDetailInfo:{
                isEditEmail: false,
                isEditPwd: false,
                isEditDesc: false
            },  
            roleTableData:[
                {name:'Resource Admin',roleType:'系统预置角色',desc:'资源管理租户管理员，资源管理角色，具有所有资源管理租户内的所有资源管理权限。'},
                {name:'Menu Admin',roleType:'系统预置角色',desc:'菜单管理租户管理员，菜单管理角色，具有所有菜单管理租户内的所有菜单管理权限。'},
            ],
            projectTableData:[
                {name:'project01',ID:'44dfdfsjqw',region:'长沙',desc:'证通云平台测试'},
                {name:'project02',ID:'bbvffcdefw',region:'长沙',desc:'证通云平台测试'},
            ],          
            rules: {                
            },         
        };
    },
    created() {
        this.getUserInfoDetail();       
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        // 获取基本资料详情
        getUserInfoDetail() {
            // this.fullscreenLoading = true;
            getUserInfoDetail({uid: this.userInfo.id}).then( res => {
                this.userDetailInfo = res.result || {};               
            });
        }, 

        handleSizeChange: function(params) {
            console.log('params:', params);
            this.searchObj.paging.limit = params;
            this.searchObj.paging.pageIndex = 1;       
        },

        handleCurrentChange: function(params) {
            console.log('handleCurrentChange:', params);          
        },
    },
    components: {
       
    }
};
</script>
<style  lang='scss'>
.user-info {
    .el-form .el-form-item {
        margin-bottom: 10px;
    }
    .wd200 {
        width: 200px;
    }
}
</style>
