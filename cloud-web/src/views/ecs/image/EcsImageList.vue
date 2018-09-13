<template>
    <div class="page-main">
        <page-header>
            {{$t('ecs.image.list.title')}}
            <div slot="right">
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh" @click="getEcsImageList"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body">
            <el-tabs v-model="searchObj.type" @tab-click="handleClick">
                <el-tab-pane label="自定义镜像" name="private"></el-tab-pane>
                <el-tab-pane label="公共镜像" name="public"></el-tab-pane>
            </el-tabs>
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getEcsImageList" :paging="searchObj.paging">
                <template v-for="col in cols">
                    <!-- 镜像ID/名称 -->
                    <template v-if="col.column=='name'">
                        <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <ul>
                                    <li>
                                        <span class="font12 mr10">{{scope.row.id}}</span>
                                    </li>
                                    <li>
                                        <span class="font12 mr10">{{scope.row.name}}</span>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 镜像类型 -->
                    <template v-if="col.column=='disk_format'">
                        <el-table-column width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                {{scope.row.disk_format}}
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 平台 -->
                    <template v-if="col.column=='size'">
                        <el-table-column width="100" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.size|convertByteSize(2, 'string')}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 操作系统 -->
                    <template v-if="col.column=='protected'">
                        <el-table-column width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.protected ? '是' : '否'}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 创建时间 -->
                    <template v-if="col.column=='createTime'">
                        <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.created_at|date}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 状态 -->
                    <template v-if="col.column=='status'">
                        <el-table-column width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <zt-status :status="statusArr" :value="scope.row.status" class="text-nowrap status-column"></zt-status>
                            </template>
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template v-if="searchObj.type === 'private'">
                    <el-table-column label="操作" key="op" width="120" class-name="option-column">
                        <template slot-scope="scope">
                            <!-- 快照列表 -->
                            <a @click="editImageDesc(scope.row)">编辑</a>
                            <b class="link-division-symbol"></b>
                            <a @click="deleteImage(scope.row)" :disabled="scope.row.protected">删除</a>
                        </template>
                    </el-table-column>
                </template>
            </zt-table>
        </div>
        <!-- 对话框 导入镜像-->
        <import-image-dialog ref="ImportImageDialog" />
        <!-- 对话框 编辑自定义镜像描述-->
        <custom-image-desc ref="CustomImageDesc" />
    </div>
</template>
<script src="./EcsImageList.js"></script>
<style lang='scss' scoped>
</style>

