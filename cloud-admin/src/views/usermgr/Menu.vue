<template>
    <div class="page-main">
        <page-header>
            菜单管理 
        </page-header>
        <div class="page-body">
            <!-- <search-box :searchObjExtra="searchObjExtra" @select="search"></search-box> -->
            <el-row :gutter="20" class="mb10">
                <el-col :span="8" ><el-button type="primary" size="small" @click="$router.push({name:'app.usrmgr.menumgr.edit',params:{opType:1,code:0}})"><span class="icon-zt_plus"></span>  新建一级菜单</el-button></el-col>
                <el-col :span="16">
                    <div class="pull-right">
                        <el-select class="width152" size="small" clearable v-model="searchObj.menuType" placeholder="请选择菜单类型">
                            <el-option label="用户" value="2" ></el-option>
                            <el-option label="管理员" value="1" ></el-option>
                        </el-select>
                        <el-select class="ml10 width152" size="small" clearable v-model="searchObj.field" @change="searchObj.searchText = '';" placeholder="请选择">
                            <el-option label="菜单编码" value="code" ></el-option>
                            <el-option label="菜单名称" value="menuName" ></el-option>
                        </el-select>
                        <el-input class="ml10"  size="small" placeholder="" style="width:208px;" v-model="searchObj.searchText"></el-input>
                        <el-button class="ml10" size="small" type="primary" @click="search" icon="el-icon-search">搜索</el-button>  
                        <el-button type="primary" size="small" class="ml10 search-refresh-btn icon-zt_refresh" @click="search"></el-button>
                    </div>                    
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <!-- 列表 -->
                    <div>
                        <el-table class="font12 data-list" :data="dataList" header-row-class-name="data-list" style="width: 100%">
                            <template v-for="col in tableColums">
                                <!-- 菜单编码 -->
                                <template v-if="col.prop==='menucode'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.menuCode}}</span>                                            
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- 菜单名称 -->
                                <template v-if="col.prop==='menuname'">
                                    <el-table-column  :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.menuName}}</span>                                            
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- 菜单图标 -->
                                <template v-if="col.prop==='menuicon'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.menuIcon}}</span>                                             
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- 路由地址 -->
                                <template v-if="col.prop==='sref'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.routeHref}}</span>                                            
                                        </template>                                    
                                    </el-table-column>
                                </template>

                                <!-- 父菜单编码 -->
                                <template v-if="col.prop==='pmenucode'">
                                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.parentMenuCode}}</span>                                             
                                        </template>                                    
                                    </el-table-column>
                                </template>
                            </template>
                                
                            <!-- 操作 -->
                            <template>
                                <el-table-column label="操作" key="op" width="280">
                                    <template slot-scope="scope">
                                        <!-- 创建子菜单 -->
                                        <span @click="createSubmenu(scope.row)" class="btn-linker">创建子菜单</span>
                                        <b class="link-division-symbol"></b>
                                        <!-- 编辑 -->
                                        <a @click="editMenu(scope.row)" class="btn-linker">编辑</a>
                                        <b class="link-division-symbol"></b>    
                                        <!-- 关联操作 -->
                                        <a @click="setMenuHander(scope.row)" class="btn-linker">关联操作</a>
                                        <!-- <b class="link-division-symbol"></b>                                      -->
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </div>

                    <!-- 分页 -->
                    <div class="pagination">
                        <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="searchObj.paging.pageIndex" 
                        :page-sizes="[10, 20, 50, 100]" 
                        :page-size="searchObj.paging.limit" 
                        layout="sizes, prev, pager, next" 
                        :total="searchObj.paging.totalItems">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>  
        </div>        
    </div>
</template>
<script src="./menumgr.js"></script>
<style  lang="scss" scoped>
.width152{
    width: 152px;
}

</style>
