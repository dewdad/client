<template>
    <div class="page-main">
        <page-header>
            {{$t('ecs.image.list.title')}}
            <region-radio slot="content" v-model="region"></region-radio>
            <div slot="right">
                <el-button type="primary" @click="importImage" size="small" icon="el-icon-search">{{ $t('ecs.image.list.importImage') }}</el-button>                
                <el-button type="info" size="small">
                    <i class="iconfont icon-refresh_people" @click="getEcsImageList"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body">
            <el-tabs v-model="searchObj.type" @tab-click="handleClick">
                <el-tab-pane label="公共镜像" name="0"></el-tab-pane>
                <el-tab-pane label="自定义镜像" name="1"></el-tab-pane>                
            </el-tabs>            
            <search-box :searchObjExtra="searchObjExtra" @select="getExtraVal"></search-box>
            <!-- 列表 -->
            <div id="table">
                <el-table class="data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
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
                        <!-- 空 -->
                        <template v-if="col.column=='empty'">
                            <el-table-column width="80" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <el-popover transition="scale-in" placement="top" trigger="hover">
                                        <div>
                                            <div>系统大小 :<span class="font12">{{convertMinSize(scope.row.minSize)}}</span></div>
                                            <div>描述 :
                                                <span class="font12">{{ scope.row.description }}</span>
                                            </div>
                                        </div>
                                        <i slot="reference" class="iconfont icon-notice_people font16"></i>
                                    </el-popover>
                                    <span class="mr10"></span>
                                    <el-popover transition="scale-in" placement="top" trigger="hover">
                                        <div>{{scope.row.name}}</div>
                                        <i slot="reference" class="iconfont font16" :class="getSysOsIcon(scope.row.osVer)"></i>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 镜像类型 -->
                        <template v-if="col.column=='imageType'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{ showTextByKey(imageTypeArr,scope.row.imageType) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 平台 -->
                        <template v-if="col.column=='platform'">
                            <el-table-column width="100" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.osType}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 操作系统 -->
                        <template v-if="col.column=='os'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.osVer}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 创建时间 -->
                        <template v-if="col.column=='createTime'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.createDate}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 状态 -->
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="80" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="color090">{{ showTextByKey(statusArr,scope.row.imageStatus) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <!-- 快照列表 -->
                                <a v-if="searchObj.type === '1'" @click="editImageDesc(scope.row)" class="btn-linker">编辑描述</a>
                                <el-tooltip v-if="searchObj.type === '0'" content="您不能对非自定义镜像进行描述修改" transition="scale" placement="bottom" effect="light">
                                    <span><a disabled>编辑描述</a></span>
                                </el-tooltip>                                
                                <b class="link-division-symbol"></b>
                                <router-link :to="{name:'app.ecs.list',params:{id:scope.row.id,item:scope.row,fromstate:'app.ecs.image'}}" class="btn-linker">相关实例</router-link>
                                <b class="link-division-symbol"></b>
                                <a v-if="searchObj.type === '1'" @click="deleteImage(scope.row)" class="btn-linker">删除</a>
                                <el-tooltip v-if="searchObj.type === '0'" content="您不能对非自定义镜像进行删除" transition="scale" placement="bottom" effect="light">
                                    <span><a disabled>删除</a></span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" :current-page="searchObj.pageIndex" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
                </el-pagination>
            </div>
        </div>
        <!-- 对话框 导入镜像-->
        <import-image-dialog ref="ImportImageDialog"/>
        <!-- 对话框 编辑自定义镜像描述-->
        <custom-image-desc ref="CustomImageDesc"/>  
    </div>
</template>
<script src="./EcsImageList.js"></script>
<style lang='scss' scoped>
</style>

