<template>
    <div class="page-main" id="rdslist">
        <page-header>
            实例列表
            <region-radio slot="content" v-model="region"></region-radio>
            <div slot="right">
                <a type="primary" class="el-button el-button--small el-button--primary" target="_blank">创建实例</a>
                <el-button type="info" size="small" v-tooltip.bottom="{content:'刷新', theme: 'is-light'}">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body">
            <search-box :searchObjExtra="searchObjExtra" @select="search"></search-box>
            <el-row>
                <el-col :span="24">
                    <el-table ref="tableData" :data="dataList" :default-expand-all="true" :row-key="setRowKey" v-loading="loading" stripe border class="data-list" @filter-change="filterChange">
                        <el-table-column type="expand" width="10px">
                            <template slot-scope="props">
                                <el-table v-if="props.row.children.length" :data="props.row.children" :show-header="false" stripe border class="data-list rds-list">
                                    <el-table-column type="expand" width="10px">
                                        <template slot-scope="props">
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-for="column in tableColums" :width="column.width ? column.width: 'auto'" :prop="column.prop" :label="column.label" :filters="column.filters" :filter-multiple="column.filterMultiple" :filtered-value="column.filteredValue" :key="column.label">
                                        <template v-if="column.render" slot-scope="scope">
                                            <!-- ID/名称 -->
                                            <div v-if="column.prop === 'name'" style="line-height:20px; padding-left: 25px; position: relative;">
                                                <span style="position:absolute;top:-5px;height:25px;width:10px;left:10px;border-bottom:1px solid #e8e8e8;border-left:1px solid #e8e8e8;"></span>
                                                <span class="inline-block">
                                                    <el-tooltip v-if="scope.row.type=='readreplica'" class="item" transition="scale" effect="dark" content="只读实例" placement="top">
                                                        <img src="@/assets/images/rds/read_people.svg" class="mr5">
                                                    </el-tooltip>
                                                    <el-tooltip class="item" transition="scale" effect="dark" content="失败实例" placement="top">
                                                        <img v-if="scope.row.status=='FAILED'" src="@/assets/images/rds/fault_people.svg" class="mr5">
                                                    </el-tooltip>
                                                    <el-tooltip class="item" transition="scale" effect="dark" content="单机版" placement="top">
                                                        <img v-if="scope.row.ha !== true" src="@/assets/images/rds/single.svg" class="mr10">
                                                    </el-tooltip>
                                                    <el-tooltip class="item" transition="scale" effect="dark" content="高可用" placement="top">
                                                        <img v-if="scope.row.ha===true" src="@/assets/images/rds/HA.svg" class="mr10">
                                                    </el-tooltip>
                                                </span>
                                                <span class="inline-block">
                                                    <router-link :to="{name: 'app.rds.inst', params: {id: scope.row.id}}" :disabled="scope.row.status !== 'ACTIVE'">{{scope.row.localId}}</router-link>
                                                    <br> {{scope.row.name}}
                                                </span>

                                            </div>
                                            <!-- 状态 -->
                                            <div v-if="column.prop === 'status'">
                                                <zt-status :status="DICT_RDS.RDS_STATUS" :value="scope.row[column.prop]" class="mr10"></zt-status>
                                                <el-tooltip v-if="scope.row.status === 'BUILD'" content="创建实例需要5~10分钟，请耐心等待" transition="scale-in" placement="top" effect="light">
                                                    <span style="display:inline-block;width:12px;">
                                                        <i class="iconfont icon-wenhao font14 color-primary"></i>
                                                    </span>
                                                </el-tooltip>
                                                <el-tooltip v-if="scope.row.status === 'FAILED'" :content="scope.row.errorMsg" transition="scale-in" placement="top" effect="light">
                                                    <span style="display:inline-block;width:12px;">
                                                        <i class="iconfont icon-wenhao font14 color-primary"></i>
                                                    </span>
                                                </el-tooltip>
                                            </div>
                                            <!-- 类型 -->
                                            <span v-if="column.prop === 'type'">{{scope.row[column.prop]|showTextByKey(column.filters)}}</span>
                                            <!-- 类型 -->
                                            <span v-if="column.prop === 'availabilityZone'">{{scope.row[column.prop]|showTextByKey(regions)}}</span>
                                            <span v-if="column.prop === 'netype'">专有网络</span>
                                            <!-- 创建时间 -->
                                            <span v-if="column.prop === 'createTime'">{{scope.row.createTime|date('YYYY-MM-DD HH:mm:ss')}}</span>
                                            <!-- 数据库类型 -->
                                            <span v-if="column.prop === 'datatype'">
                                                MySQL {{scope.row.datastoreVersionName}} {{scope.row.ha == true ? "高可用" : "单机"}} {{ scope.row.volumeType|showTextByKey(volumeType)}}
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" :header-align="'right'" align="right" width="120px" class-name="option-column">
                                        <template slot-scope="scope">
                                            <span class="inline-block">
                                                <router-link v-if="scope.row.status==='ACTIVE'" :to="{name: 'app.rds.inst.detail', params: {id: scope.row.id}}">管理</router-link>
                                                <el-tooltip v-else content="当前状态不能管理" transition="scale" placement="bottom" effect="light">
                                                    <a disabled>管理</a>
                                                </el-tooltip>
                                            </span>
                                            <b class="link-division-symbol"></b>
                                            <el-dropdown trigger="click" class="inline-block" size="small" @command="command">
                                                <span class="el-dropdown-link">
                                                    更多
                                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                                </span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item :command="{row: scope.row, action: 'restart'}" :disabled="scope.row.status !== 'SHUTOFF' && scope.row.status !== 'ACTIVE'">重启</el-dropdown-item>
                                                    <el-dropdown-item :command="{row: scope.row, action: 'backup'}" :disabled="true">备份</el-dropdown-item>
                                                    <el-dropdown-item :command="{row: scope.row, action: 'release'}" :disabled="scope.row.status === 'BUILD'">释放</el-dropdown-item>
                                                    <el-dropdown-item>
                                                        <router-link :to="'/people'" target="_blank">提交工单</router-link>
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="column in tableColums" :width="column.width ? column.width: 'auto'" :prop="column.prop" :column-key="column.prop" :label="column.label" :filters="column.filters" :filter-multiple="column.filterMultiple" :filtered-value="column.filteredValue" :key="column.label">
                            <template v-if="column.render" slot-scope="scope">
                                <!-- ID/名称 -->
                                <div v-if="column.prop === 'name'" style="line-height:20px;position:relative;">
                                    <span class="inline-block">
                                        <img v-tooltip="'主实例'" src="@/assets/images/rds/main_people.svg" class="mr5">
                                        <img v-if="scope.row.status=='FAILED'" v-tooltip="'失败实例'" src="@/assets/images/rds/fault_people.svg" class="mr5">
                                        <img v-if="scope.row.ha !== true" v-tooltip="'单机版'" src="@/assets/images/rds/single.svg" class="mr10">
                                        <img v-if="scope.row.ha===true" v-tooltip="'高可用'" src="@/assets/images/rds/HA.svg" class="mr10">
                                    </span>
                                    <span class="inline-block">
                                        <router-link :to="{name: 'app.rds.inst', params: {id: scope.row.id}}" :disabled="scope.row.status !== 'ACTIVE'">{{scope.row.localId}}</router-link>
                                        <br> {{scope.row.name}}
                                    </span>
                                    <span v-if="scope.row.children.length" style="position:absolute;left:10px;bottom:-5px;width:1px;height:15px;background:#e8e8e8;"></span>
                                </div>
                                <!-- 状态 -->
                                <div v-if="column.prop === 'status'">
                                    <zt-status :status="DICT_RDS.RDS_STATUS" :value="scope.row[column.prop]" class="mr10"></zt-status>
                                    <el-tooltip v-if="scope.row.status === 'BUILD'" content="创建实例需要5~10分钟，请耐心等待" transition="scale-in" placement="top" effect="light">
                                        <span style="display:inline-block;width:12px;">
                                            <i class="iconfont icon-wenhao font14 color-primary"></i>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip v-if="scope.row.status === 'FAILED'" :content="scope.row.errorMsg" transition="scale-in" placement="top" effect="light">
                                        <span style="display:inline-block;width:12px;">
                                            <i class="iconfont icon-wenhao font14 color-primary"></i>
                                        </span>
                                    </el-tooltip>
                                </div>
                                <!-- 类型 -->
                                <span v-if="column.prop === 'type'">{{scope.row[column.prop]|showTextByKey(column.filters)}}</span>
                                <!-- 类型 -->
                                <span v-if="column.prop === 'availabilityZone'">{{scope.row[column.prop]|showTextByKey(regions)}}</span>
                                <span v-if="column.prop === 'netype'">专有网络</span>
                                <!-- 创建时间 -->
                                <span v-if="column.prop === 'createTime'">{{scope.row.createTime|date('YYYY-MM-DD HH:mm:ss')}}</span>
                                <!-- 数据库类型 -->
                                <span v-if="column.prop === 'datatype'">
                                    MySQL {{scope.row.datastoreVersionName}} {{scope.row.ha == true ? "高可用" : "单机"}} {{ scope.row.volumeType|showTextByKey(volumeType)}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" :header-align="'right'" align="right" width="120px" class-name="option-column">
                            <template slot-scope="scope">
                                <span class="inline-block">
                                    <router-link v-if="scope.row.status==='ACTIVE'" :to="{name: 'app.rds.inst.detail', params: {id: scope.row.id}}">管理</router-link>
                                    <el-tooltip v-else content="当前状态不能管理" transition="scale" placement="bottom" effect="light">
                                        <a disabled>管理</a>
                                    </el-tooltip>
                                </span>
                                <b class="link-division-symbol"></b>
                                <el-dropdown trigger="click" class="inline-block" size="small" @command="command">
                                    <span class="el-dropdown-link">
                                        更多
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{row: scope.row, action: 'restart'}" :disabled="scope.row.status !== 'SHUTOFF' && scope.row.status !== 'ACTIVE'">重启</el-dropdown-item>
                                        <el-dropdown-item :command="{row: scope.row, action: 'backup'}" :disabled="scope.row.status !== 'ACTIVE' || scope.row.type!=='master'">备份</el-dropdown-item>
                                        <el-dropdown-item :command="{row: scope.row, action: 'release'}" :disabled="scope.row.children.length || scope.row.status === 'BUILD'">释放</el-dropdown-item>
                                        <el-dropdown-item>
                                            <router-link :to="'/people'" target="_blank">提交工单</router-link>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <zt-table :tableColums="tableColums" :dataList="dataList" :loading="loading" :renderCell="renderCell"></zt-table> -->
                </el-col>
            </el-row>
        </div>
        <backup ref="backup" :instId="currentRow.instId" :instName="currentRow.instName"></backup>
    </div>
</template>
<script src="./list.js"></script>
<style  lang="scss">
#rdslist {
    .rds-list {
        &::before {
            background-color: #fff;
        }
    }
    .el-table__expanded-cell {
        .el-table {
            margin: -5px 0px;
        }
    }
    .el-table__expand-icon {
        display: none;
    }
    .el-table__row td:nth-of-type(2) .cell {
        overflow: visible;
    }
    .el-table__expanded-cell:empty {
        display: none;
        border-bottom: 0px solid transparent;
    }
}
</style>
