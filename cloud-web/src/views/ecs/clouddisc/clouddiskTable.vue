<template>
    <div>
        <!-- 筛选操作 -->
        <search-box v-if="!!isShowSearch" :searchObjExtra="searchObjExtra" @select="search"></search-box>

        <!-- 列表 -->
        <div>
            <el-table v-loading="loading" @cell-mouse-enter="showEditName" @filter-change="filterHandler" class="font12 data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                <!-- 实例名称 -->
                <el-table-column min-width="140" prop="name" label="磁盘ID/磁盘名称" key="磁盘ID/磁盘名称">
                    <template slot-scope="scope">
                        <ul>
                            <li>
                                <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                <!-- <el-popover transition="scale-in" placement="top" trigger="hover">
                                            <div class="nameTip">
                                                <div>设备名 :
                                                    <span class="font12">{{scope.row.mount||"-"}}</span>
                                                </div>
                                                <div>实例名称/ID :
                                                    <router-link v-if="!!scope.row.instanceId" class="font12 color-primary" :to="{name:'app.ecs.inst.detail',params:{id:scope.row.instanceId}}">{{scope.row.instanceId}}
                                                    </router-link>
                                                    <span>/</span>
                                                    <span class="color-primary">{{scope.row.name||'-'}}</span>
                                                </div>
                                                <div>实例状态 :
                                                    <span class="font12 color-success">
                                                        <i class="iconfont icon-running_people mr5"></i>{{scope.row.instanceStatus}}</span>
                                                </div>
                                                <div>创建时间 :
                                                    <span class="font12">{{scope.row.created_at|date}}</span>
                                                </div>
                                            </div>
                                            <i slot="reference" class="iconfont icon-notice_people font12"></i>
                                        </el-popover> -->
                            </li>
                            <li>
                                <span class="font12 mr10">{{scope.row.name}}</span>
                                <i v-if="scope.row.id === showId" class="amendInfo finger-cursor iconfont icon-edit_people" @click="editinstname(scope.row)"></i>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <!-- 磁盘容量 -->
                <el-table-column prop="size" label="磁盘容量">
                    <template slot-scope="scope">
                        {{scope.row.size}}G
                    </template>
                </el-table-column>
                <!-- 磁盘状态 -->
                <el-table-column prop="status" column-key="status" label="磁盘状态" key="磁盘状态" :filters="statusArr" :filtered-value="[status]" :filter-multiple="false">
                    <template slot-scope="scope">
                        <zt-status :status="statusArr" :value="scope.row.status" class="text-nowrap status-column"></zt-status>
                    </template>
                </el-table-column>
                <!-- 挂载到 -->
                <el-table-column prop="attachments" label="挂载到" key="挂载到">
                    <template slot-scope="scope">
                        <div v-if="scope.row.attachments.length">
                            <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.attachments[0].serverId}}"> {{scope.row.attachments[0].hostname}}</router-link> {{scope.row.attachments[0].device}}
                        </div>
                    </template>
                </el-table-column>
                <!-- 描述 -->
                <el-table-column prop="description" label="描述" key="描述">
                    <template slot-scope="scope">
                        <span>{{scope.row.description}}</span>
                    </template>
                </el-table-column>
                <!-- 创建时间 -->
                <el-table-column prop="created_at" label="创建时间" key="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.created_at|date}}
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" class-name="option-column" width="280">
                    <template slot-scope="scope">
                        <!-- 创建快照 -->
                        <span @click="createSnap(scope.row)" class="btn-linker">创建快照</span>
                        <b class="link-division-symbol"></b>
                        <!-- 创建备份 -->
                        <a @click="createBack(scope.row)" class="btn-linker">创建备份</a>
                        <b class="link-division-symbol"></b>
                        <!-- 更多 -->
                        <el-dropdown @command="handleCommand" size="small" class="font12" trigger="click" placement="bottom-start">
                            <span class="btn-linker">
                                更多
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :disabled="scope.row.status!=='available'" :command="{handle:'mountDataDiskFn',rowItem:scope.row}">挂载</el-dropdown-item>
                                <el-dropdown-item :disabled="scope.row.status!=='in-use'" :command="{handle:'unmoutDisk',rowItem:scope.row}">卸载</el-dropdown-item>
                                <el-dropdown-item :disabled="scope.row.status==='in-use'" :command="{handle:'releaseDisk',rowItem:scope.row}">释放</el-dropdown-item>
                                <el-dropdown-item :command="{handle:'modifyDiskDescrip',rowItem:scope.row}"> 修改磁盘描述</el-dropdown-item>
                                <el-dropdown-item command>
                                    <router-link tag="div" :to="{name:'app.ecs.expandsize',params:{id:scope.row.id,item:scope.row}}">磁盘扩容</router-link>
                                </el-dropdown-item>
                                <el-dropdown-item command class="color999 font12" v-if="scope.row.status!=='in-use' && scope.row.status !=='available' && scope.row.isBoot !== '1'">磁盘扩容</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" :current-page="searchObj.paging.pageIndex" @current-change="handleCurrentChange" :page-size="searchObj.paging.limit" layout="total, prev, pager, next" :total="searchObj.paging.totalItems">
            </el-pagination>
        </div>
        <!-- 编辑磁盘名称 -->
        <edit-name ref="EditName" />
        <!-- 对话框 创建快照 -->
        <create-snap-dialog ref="CreateSnapDialog" />
        <!-- 对话框 设置自动快照策略 -->
        <create-back-dialog ref="CreateBackDialog" />
        <!-- 对话框 修改磁盘描述 -->
        <modify-disk-descrip-dialog ref="ModifyDiskDescripDialog" />
        <!-- 对话框 修改属性 -->
        <modify-disk-prop-dialog ref="ModifyDiskPropDialog" />
        <!-- 对话框 挂载磁盘 -->
        <mount-data-disk ref="MountDataDisk" />
    </div>
</template>
<script src="./clouddiskTable.js">
</script>

<style scope lang="scss">
.zt-numlink {
    background-color: #f6f8fa;
    padding: 10px;
    font-size: 12px;
    line-height: 12px;
    color: #2b65c5;
}
.labelTip {
    text-align: center;
}
</style>
