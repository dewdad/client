<template>
    <div class="page-main">
        <page-header>
            部门管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createDept(null,brunch,1)">
                            <span class="icon-zt_plus"></span> 新建部门</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  @click="enableDept(brunch,2)" :disabled="brunch.id === user.deptId">
                            <span class="icon-zt_enablement"></span> 启用</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  @click="disableDept(brunch,2)" :disabled="brunch.id === user.deptId">
                            <span class="icon-zt_disable"></span> 禁用</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  @click="delDept(brunch)" :disabled="brunch.id === user.deptId">
                            <span class="fa fa-trash"></span> 删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  @click="createDeptQuota(brunch,brunch,2)" :disabled="brunch.id === user.deptId">
                            <span class="icon-zt_edit"></span> 修改部门配额</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="viewDept(brunch)" >
                            <span class="icon-zt_view"></span> 查看配额</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="createDept(brunch,brunch,2)" :disabled="brunch.id === user.deptId">
                            <span class="icon-zt_edit"></span> 编辑</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row class="deptContainer">
            <el-col :span="4"  class="deptTree p20">
                <el-form :inline="true" :model="formInline" size="small" style="margin-right:0;">
                    <el-form-item>
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText">
                            <el-button slot="append" icon="el-icon-search" @click="deptTree"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div>
                    <el-tree
                            default-expand-all
                            :highlight-current="true"
                            expand-on-click-node node-key="id"
                            :data="deptTreeData"
                            :check-strictly="true"
                            :props="defaultProps"
                            :default-checked-keys="selectedKey"
                            @node-click="handleNodeClick"
                            ref="tree"
                    ></el-tree>
                </div>
            </el-col>
            <el-col :span="20"  class="p20">
                <div class="topTitle">基本信息</div>
                <el-row class="mt20 mb20">
                    <el-col :span="8">部门名称：{{brunch.name}}</el-col>
                    <el-col :span="8">描述：{{brunch.description}}</el-col>
                    <el-col :span="8">状态：{{brunch.status?'启用':'禁用'}}</el-col>
                    <el-col :span="16" class="mt20">部门ID：{{brunch.id}}</el-col>
                </el-row>
                <el-tabs v-model="activeName">
                    <el-tab-pane label="租户管理" name="first">
                        <el-form :inline="true" :model="rentForm" size="small">
                            <el-form-item>
                                <el-button type="primary" @click="createRenter()">
                                    <span class="icon-zt_plus"></span> 新增租户</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-select placeholder="请选择" v-model="rentForm.type" @change="rentForm.searchText=''">
                                    <el-option label="租户名" value="name"></el-option>
                                    <el-option label="激活" value="status"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关键字">
                                <el-input placeholder="搜索关键字" v-model="rentForm.searchText" v-if="rentForm.type !== 'status'"></el-input>
                                <el-select clearable v-model="rentForm.searchText" placeholder="请选择" v-if="rentForm.type === 'status'">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="ml10" size="small" type="primary" @click="getprojectList" icon="el-icon-search">搜索</el-button>
                            </el-form-item>

                            <el-form-item class="pull-right">
                                <el-button class=" search-refresh-btn icon-zt_refresh " type="primary" @click="getprojectList"></el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="tableData1" header-row-class-name="data-list">
                            <template v-for="col in rentcols">
                                <!-- 用户名 -->
                                <template v-if="col.column=='username'">
                                    <el-table-column width="120" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <a class="font12 mr10" @click="showRentaDetail(scope.row)">{{scope.row.name}}</a>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--描述-->
                                <template v-if="col.column=='descprition'">
                                    <el-table-column min-width="100" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.description}}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--创建时间-->
                                <template v-if="col.column=='createtime'">
                                    <el-table-column width="130" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.createTime | date }}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--激活-->
                                <template v-if="col.column=='start'">
                                    <el-table-column width="60" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.status =='1'?'是':'否' }}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                            </template>
                            <!-- 操作 -->
                            <template>
                                <el-table-column label="操作"  key="op"  min-width="200" style="width:25%" class-name="option-snaplist">
                                    <template slot-scope="scope">
                                        <a @click="viewProjectUsage(scope.row)" class="btn-linker">查看配额</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="changeRentQuota(scope.row,brunch)" class="btn-linker">修改配额</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="disableProject(scope.row,brunch)" v-if="scope.row.status == 1" class="btn-linker">禁用</a>
                                        <a @click="ableProject(scope.row,brunch)" v-if="scope.row.status == 0" class="btn-linker">启用</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="editRente(scope.row,brunch)" class="btn-linker">编辑</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="delRenter(scope.row)" class="btn-linker">删除</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="manageMember(scope.row,brunch)" class="btn-linker">关联用户</a>

                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                        <!--分页-->
                        <div class="pagination">
                            <el-pagination background @current-change="currentChange1" @size-change="handleSizeChange1" :current-page="searchObj1.paging.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj1.paging.limit" layout="sizes, prev, pager, next" :total="searchObj1.paging.totalItems">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="用户管理" name="second">
                        <el-form :inline="true" :model="userForm" size="small">
                            <el-form-item>
                                <el-button type="primary" @click="createUser()">
                                    <span class="icon-zt_plus"></span> 新增用户</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-select placeholder="请选择" v-model="userForm.type" @change="userForm.searchText=''">
                                    <el-option label="用户名" value="name"></el-option>
                                    <el-option label="激活" value="status"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关键字">
                                <el-input placeholder="搜索关键字" v-model="userForm.searchText" v-if="userForm.type !== 'status'"></el-input>
                                <el-select clearable v-model="userForm.searchText" placeholder="请选择" v-if="userForm.type === 'status'">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="ml10" size="small" type="primary" @click="findeRole" icon="el-icon-search">搜索</el-button>
                            </el-form-item>

                            <el-form-item class="pull-right">
                                <el-button class=" search-refresh-btn icon-zt_refresh " type="primary"  @click="findeRole"></el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="tableData2" header-row-class-name="data-list">
                            <template v-for="col in usercols">
                                <!-- 用户名 -->
                                <template v-if="col.column=='username'">
                                    <el-table-column min-width="100" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <a class="font12 mr10" @click="showUserDetail(scope.row)">{{scope.row.name}}</a>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--邮箱-->
                                <template v-if="col.column=='emailAddress'">
                                    <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.email}}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--创建时间-->
                                <template v-if="col.column=='createtime'">
                                    <el-table-column min-width="100" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.createTime | date }}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--激活-->
                                <template v-if="col.column=='start'">
                                    <el-table-column min-width="80" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.status =='1'?'是':'否' }}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                            </template>
                            <!-- 操作 -->
                            <template>
                                <el-table-column label="操作" key="op"  min-width="200" class-name="option-snaplist">
                                    <template slot-scope="scope">
                                        <a @click="resetPwd(scope.row,brunch)" class="btn-linker">重置密码</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="EditUser(scope.row,brunch)" class="btn-linker">编辑</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="disableUser(scope.row,brunch)" v-if="scope.row.status == 1" class="btn-linker">禁用</a>
                                        <a @click="ableUser(scope.row,brunch)" v-if="scope.row.status == 0" class="btn-linker">启用</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="delUser(scope.row)" class="btn-linker">删除</a>
                                        <b class="link-division-symbol"></b>
                                        <a @click="userManageMember(scope.row,brunch)" class="btn-linker">关联租户</a>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                        <!--分页-->
                        <div class="pagination">
                            <el-pagination background @current-change="currentChange2" @size-change="handleSizeChange2" :current-page="searchObj2.paging.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj2.paging.limit" layout="sizes, prev, pager, next" :total="searchObj2.paging.totalItems">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>

            </el-col>
        </el-row>
        <!--创建部门-->
        <create-dept ref="CreateDept"></create-dept>
        <!--查看配额使用量-->
        <quota-and-usage ref="QuotaAndUsage"></quota-and-usage>
        <!--用户详情-->
        <client-detail ref="ClientDetail"></client-detail>
        <!--租户详情-->
        <project-detail ref="ProjectDetail"></project-detail>
        <!--重置密码-->
        <reset-pwd ref="ResetPwd"></reset-pwd>
        <!--查看租户使用量-->
        <view-usage ref="ViewUsage"></view-usage>
        <!--修改配额-->
        <change-quota ref="ChangeQuota"></change-quota>
        <!--查看租户配额-->
        <view-project-usage ref="ViewProjectUsage"></view-project-usage>
        <!--关联用户-->
        <select-member ref="SelectMember"></select-member>
        <!--修改租户-->
        <edit-rente ref="EditRente"></edit-rente>
        <!--修改用户-->
        <edit-user ref="EditUser"></edit-user>
        <!--关联租户-->
        <user-select-member ref="UserSelectMember"></user-select-member>
        <!--创建和修改部门配额-->
        <create-dept-quota ref="CreateDeptQuota"></create-dept-quota>
    </div>
</template>
<script src="./deptmgr.js"></script>
<style  lang="scss">
.topTitle {
    width: 100%;
    border-bottom: 1px solid #e8e8e8 !important;
    padding: 9px !important;
    font-size: 14px;
    color: #656565;
}
.deptContainer {
    & > .el-col-20 {
        border-left: 1px solid #dee7f1;
    }
    .p20 {
        padding: 20px;
    }
    .deptTree {
        min-height: 300px;
    }
    border: 1px solid #dee7f1;
}
.el-tree-node__c:hover,.el-tree-node__content:hover,.el-tree-node__content:visited,.el-tree-node:focus>.el-tree-node__content{
    background-color:#eee !important;
}
.el-tree .is-checked{
    background-color:#eee !important;
}
.is-checked .el-tree-node__children{
    background-color:#fff !important;
}
    .deptTree .el-form-item.el-form-item--small{
        margin-right:0 !important;
    }
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color:#eee !important;
}
</style>
