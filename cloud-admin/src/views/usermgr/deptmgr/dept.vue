<template>
    <div class="page-main">
        <page-header>
            部门管理
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true"  size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createDept(null,1)"><span class="icon-zt_plus"></span>  新建部门</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="delDept(brunch)"><span class="fa fa-trash"></span>  删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="viewDept()"><span class="icon-zt_view"></span>  查看配额</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="enableDept(brunch,2)"><span class="icon-zt_enablement"></span>  启用</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="disableDept(brunch,2)"><span class="icon-zt_disable"></span>  禁用</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="createDept(brunch,2)"><span class="icon-zt_edit"></span>  编辑</el-button>
                    </el-form-item>

                </el-form>
            </el-col>
        </el-row>
        <el-row class="deptContainer">

            <el-col :span="5" class="deptTree p20" >
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item  style="width:102px;">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText" style="width:115px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="searchDeptTree" >搜索</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-tree :data="deptTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </div>
            </el-col>
            <el-col :span="19" class="p20">
                <div class="topTitle">基本信息</div>
                <el-row class="mt20 mb20">
                    <el-col :span="8">部门名称：{{brunch.name}}</el-col>
                    <el-col :span="8">描述：{{brunch.description}}</el-col>
                    <el-col :span="8">状态：{{brunch.status?'启用':'禁用'}}</el-col>
                </el-row>
                <el-tabs v-model="activeName" >
                    <el-tab-pane label="租户管理" name="first">
                        <el-form :inline="true" :model="rentForm" size="small">
                            <el-form-item>
                                <el-button type="primary" @click="createSysconfig({},1)"><span class="icon-zt_plus"></span>  新增租户</el-button>
                                <el-button type="primary" @click="createSysconfig()">刷新缓存</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-select placeholder="请选择" v-model="rentForm.type" @change="rentForm.searchText=''">
                                    <el-option label="租户名" value="name"></el-option>
                                    <el-option label="激活" value="enabled"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关键字">
                                <el-input placeholder="搜索关键字" v-model="rentForm.searchText" v-if="rentForm.type !== 'enabled'"></el-input>
                                <el-select clearable v-model="rentForm.searchText"  placeholder="请选择" v-if="rentForm.type === 'enabled'">
                                    <el-option label="是" value="0"></el-option>
                                    <el-option label="否" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="createDept">查询</el-button>
                            </el-form-item>
                            <el-form-item class="pull-right">
                                <el-button type="primary" class=" search-refresh-btn icon-new-刷新" @click="disableDept"></el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="tableData1"  header-row-class-name="data-list">
                            <template v-for="col in rentcols">
                                <!-- 用户名 -->
                                <template v-if="col.column=='username'">
                                    <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.id}}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--描述-->
                                <template v-if="col.column=='descprition'">
                                    <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.resource}}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--租户ID-->
                                <template v-if="col.column=='id'">
                                    <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.createTime | date }}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--激活-->
                                <template v-if="col.column=='start'">
                                    <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.createTime }}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                                <!--部门-->
                                <template v-if="col.column=='dept'">
                                    <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                        <template slot-scope="scope">
                                            <span class="font12 mr10">{{scope.row.createTime }}</span>
                                        </template>
                                    </el-table-column>
                                </template>
                            </template>
                            <!-- 操作 -->
                            <template>
                                <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                                    <template slot-scope="scope">
                                        <a  @click="createPlatForm(scope.row,2)" class="btn-linker" >查看使用量</a>
                                        <b class="link-division-symbol"></b>
                                        <a  @click="createPlatForm(scope.row)" class="btn-linker" >修改配额</a>
                                        <b class="link-division-symbol"></b>
                                        <a  @click="createPlatForm(scope.row)" class="btn-linker" >管理成员</a>
                                        <el-dropdown>
                                            <span class="el-dropdown-link">
                                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item @click="createDept(scope.row)">编辑租户</el-dropdown-item>
                                                <el-dropdown-item @click="createDept(scope.row)">删除租户</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                        <!--分页-->
                        <div class="pagination">
                            <el-pagination background
                                           @current-change="currentChange1"
                                           @size-change="handleSizeChange1"
                                           :current-page="searchObj1.paging.pageIndex"
                                           :page-sizes="[10, 20, 50, 100]"
                                           :page-size="searchObj1.paging.limit"
                                           layout="sizes, prev, pager, next"
                                           :total="searchObj1.paging.totalItems">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="用户管理" name="second">用户管理</el-tab-pane>
                </el-tabs>

            </el-col>
        </el-row>
        <create-dept ref="CreateDept"></create-dept>
        <quota-and-usage ref="QuotaAndUsage"></quota-and-usage>
        <client-detail ref="ClientDetail"></client-detail>
        <project-detail ref="ProjectDetail"></project-detail>
        <reset-pwd ref="ResetPwd"></reset-pwd>
    </div>
</template>
<script src="./deptmgr.js"></script>
<style scoped lang="scss">
    .topTitle{
        width: 100%;
        border-bottom: 1px solid #e8e8e8 !important;
        padding: 9px !important;
        font-size: 14px;
        color:#656565;
    }
    .deptContainer{
        .p20{
            padding:20px;
        }
        .deptTree{
            background-color:#f4f8f9;
            border-right:1px solid #dee7f1;
            min-height:300px;
        }
        border: 1px solid #dee7f1;
    }
</style>
