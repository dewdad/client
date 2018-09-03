<template>
    <div >
        <!-- 筛选操作 -->
        <div class="search-box mb10" v-if="!!isShowSearch">
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="">
                    <el-select value-key="field" v-model="fieldValue" placeholder="请选择">
                        <el-option v-for="field in searchObjExtra.fields" :label="field.label" :value="field" :key="field.field"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="">
                    <el-input placeholder="关键字"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <el-button type="primary" @click="getDiskList" icon="el-icon-search">{{ $t('common.searchButtonText') }}</el-button>
                    <label-dropdown :selectLabelData="selectLabelList" :labelList="allLabelData" @select="getSelLabelList"></label-dropdown>
                </zt-form-item>
            </zt-form>
        </div>
        <retrieval @select="getRetrieval" :retrievalData="retrievalData"></retrieval>
        <!-- 列表 -->
        <div>
            <el-table @cell-mouse-enter="showEditName" class="font12 data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                <template v-for="col in cols">
                    <!-- 实例名称 -->
                    <template v-if="col.column=='name'">
                        <el-table-column width="140" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <ul>
                                    <li>
                                        <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                        <reveal-popover :scopeRow="scope.row"></reveal-popover>
                                    </li>
                                    <li>
                                        <span class="font12 mr10">{{scope.row.name}}</span>
                                        <AmendName :scope="scope" v-if="scope.row.id === showId"></AmendName>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 标签 -->
                    <template width="50" v-if="col.column=='lable'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <el-popover transition="scale-in" placement="top" trigger="hover">
                                    <div>
                                        <div v-if="!!scope.row.labels.length">
                                            <el-row>
                                                <li v-for="(label,index) in scope.row.labels" :key="index">
                                                    <span>{{ label.labelKey }}:{{ label.labelValue }}</span>
                                                </li>
                                            </el-row>
                                        </div>
                                        <div class="labelTip">
                                            <span class="mr10">{{ $t('common.noData') }}</span>
                                            <a class="font12" @click="editLabel">{{ $t('ecs.inst.list.dropdownBtns.editLable') }}</a>
                                        </div>
                                    </div>
                                    <i slot="reference" class="iconfont icon-biaoqianmen-tianchong font16"></i>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 磁盘种类 -->
                    <template v-if="col.column=='diskType'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                            <template slot-scope="scope">
                                <span v-html="scope.row.type">{{scope.row.type}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 磁盘状态 -->
                    <template v-if="col.column=='diskStatus'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                            <template slot-scope="scope">
                                <span class="color090">
                                    <i class="iconfont icon-chenggong mr5"></i>{{scope.row.diskStatus}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 付费方式 -->
                    <template v-if="col.column=='volume_type'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                {{ $t('ecs.inst.list.freeTrial')}}
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 可用区 -->
                    <template v-if="col.column=='bootable'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.zone}}</span>
                                <br>
                                <span>{{scope.row.zone}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 磁盘属性 -->
                    <template v-if="col.column=='isBoot'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                            <template slot-scope="scope">
                                {{scope.row.isBoot === '1' ? '系统盘' : '数据盘' }}
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 快照数量 -->
                    <template v-if="col.column=='countSnapshot'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <el-tag>
                                    {{scope.row.countSnapshot}}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template>
                    <el-table-column label="操作" key="op" width="280">
                        <template slot-scope="scope">
                            <!-- 创建快照 -->
                            <span @click="createSnap(scope.row)" class="btn-linker">创建快照</span>
                            <b class="link-division-symbol"></b>
                            <!-- 设置自动快照策略 -->
                            <a @click="setAutoSnap(scope.row)" class="btn-linker">设置自动快照策略</a>
                            <b class="link-division-symbol"></b>
                            <!-- 更多 -->
                            <el-dropdown @command="handleCommand" class="font12" trigger="click" placement="bottom-start">
                                <span class="btn-linker">
                                    更多
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item class="font12" v-if="scope.row.diskStatus==='available'" :command="{handle:'mountDataDiskFn',rowItem:scope.row}">挂载</el-dropdown-item>
                                    <el-tooltip content="待挂载状态的磁盘才可挂载" placement="left" v-else>
                                        <el-dropdown-item class="color999 font12" command>挂载</el-dropdown-item>
                                    </el-tooltip>

                                    <el-tooltip content="请先关机再卸载" placement="left" v-if="scope.row.instanceStatus==='ACTIVE'">
                                        <el-dropdown-item class="color999 font12" command>卸载</el-dropdown-item>
                                    </el-tooltip>
                                    <el-dropdown-item class="font12" v-if="scope.row.diskStatus==='in-use' && scope.row.instanceStatus==='SHUTOFF' " :command="{handle:'unmoutDisk',rowItem:scope.row}">卸载</el-dropdown-item>
                                    <el-dropdown-item class="color999 font12" v-else command>卸载</el-dropdown-item>

                                    <el-dropdown-item class="font12" v-if="scope.row.diskStatus!=='in-use'" :command="{handle:'releaseDisk',rowItem:scope.row}">释放</el-dropdown-item>
                                    <el-tooltip content="请先卸载后再释放" placement="left" v-else>
                                        <el-dropdown-item class="color999 font12" command>释放</el-dropdown-item>
                                    </el-tooltip>
                                    <el-dropdown-item class="font12" :command="{handle:'modifyDiskDescrip',rowItem:scope.row}"> 修改磁盘描述</el-dropdown-item>
                                    <el-dropdown-item class="font12" :command="{handle:'modifyDiskProp',rowItem:scope.row}"> 修改属性</el-dropdown-item>
                                    <el-dropdown-item class="font12" :command="{handle:'editLabel',rowItem:scope.row}"> 编辑标签</el-dropdown-item>

                                    <el-dropdown-item command class="font12" v-if="scope.row.diskStatus == 'in-use' && scope.row.isBoot !== '1'">
                                        <router-link :to="{name:'app.ecs.expandsize',params:{id:scope.row.id,item:scope.row}}">磁盘扩容</router-link>
                                    </el-dropdown-item>
                                    <el-tooltip content="请先卸载磁盘" placement="left" v-if="scope.row.diskStatus=='available' && scope.row.isBoot !== '1'">
                                        <el-dropdown-item class="color999 font12" command>磁盘扩容</el-dropdown-item>
                                    </el-tooltip>
                                    <el-tooltip content="通过更换系统盘来扩容" placement="left" v-if="scope.row.isBoot === '1'">
                                        <el-dropdown-item class="color999 font12" command>磁盘扩容</el-dropdown-item>
                                    </el-tooltip>
                                    <el-dropdown-item command class="color999 font12" v-if="scope.row.diskStatus!=='in-use' && scope.row.diskStatus !=='available' && scope.row.isBoot !== '1'">磁盘扩容</el-dropdown-item>

                                    <el-dropdown-item class="font12" command>
                                        <router-link :to="{name:'app.ticketSystem.submitticket'}" target="_blank">提交工单</router-link>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination background :current-page="searchObj.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
            </el-pagination>
        </div>

        <!-- 对话框 编辑标签 -->
        <edit-label-dialog ref="editLabelDialog" />
        <!-- 对话框 创建快照 -->
        <create-snap-dialog ref="CreateSnapDialog" />
        <!-- 对话框 设置自动快照策略 -->
        <set-auto-snap-dialog ref="SetAutoSnapDialog" />
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
