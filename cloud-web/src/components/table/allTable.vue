<template>
    <!-- 列表 -->
    <div id="table">
        <el-table class="font12" :data="tableData" header-row-class-name="data-list" style="width: 100%">
            <template v-for="col in cols">
                <!-- 实例名称 -->
                <template v-if="col.column=='name'">
                    <el-table-column width="140" :prop="col.column" :label="col.text" :key="col.column">
                        <template slot-scope="scope">
                            <ul>
                                <li>
                                    <!-- <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link> -->
                                </li>
                                <li>
                                    <span class="font12 mr10 color-primary">{{scope.row.name}}</span>
                                    <el-tooltip content="Bottom center" placement="top" effect="light">
                                        <i class="iconfont icon-notice_people font12"></i>
                                    </el-tooltip>
                                </li>
                                <li>
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </template>
                <!-- 标签 -->
                <template width="50" v-if="col.column=='lable'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                        <template slot-scope="scope">
                            <el-tooltip content="Bottom center" placement="top" effect="light">
                                <i class="iconfont icon-label_people"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </template>
                <!-- 磁盘种类 -->
                <template v-if="col.column=='diskType'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                        <template slot-scope="scope">
                            <span v-html="scope.row.diskType"></span>
                        </template>
                    </el-table-column>
                </template>
                <!-- 磁盘状态 -->
                <template v-if="col.column=='diskStatus'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                        <template slot-scope="scope">
                            <i class="iconfont icon-step_done_people mr5"></i>
                            <span class="color090">{{scope.row.diskStatus}}</span>
                        </template>
                    </el-table-column>
                </template>
                <!-- 付费方式 -->
                <template v-if="col.column=='volume_type'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                    </el-table-column>
                </template>
                <!-- 可用区 -->
                <template v-if="col.column=='bootable'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                        <template slot-scope="scope">
                            <span>{{scope.row.region}}</span>
                            <br>
                            <span>{{scope.row.region}}</span>
                        </template>
                    </el-table-column>
                </template>
                <!-- 磁盘属性 -->
                <template v-if="col.column=='isBoot'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                    </el-table-column>
                </template>
                <!-- 所在区域 -->
                <template v-if="col.column=='region'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                        <template slot-scope="scope">
                            <span>{{scope.row.region}}</span>
                            <br>
                            <span>{{scope.row.region}}</span>
                        </template>
                    </el-table-column>
                </template>
                <!-- 快照数量 -->
                <template v-if="col.column=='countSnapshot'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                        <template slot-scope="scope">
                            <a class="zt-numlink">{{scope.row.countSnapshot}}</a>
                        </template>
                    </el-table-column>
                </template>
                <!-- ip地址 -->
                <template v-if="col.column=='ipaddr'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                    </el-table-column>
                </template>
                <!-- 状态 -->
                <template v-if="col.column=='status'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                    </el-table-column>
                </template>
                <!-- 网络类型 -->
                <template v-if="col.column=='nettype'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                    </el-table-column>
                </template>
                <!-- 配置 -->
                <template v-if="col.column=='cfginfo'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                    </el-table-column>
                </template>
                <!-- 付费方式 -->
                <template v-if="col.column=='paytype'">
                    <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                    </el-table-column>
                </template> 
            </template>
            <!-- 操作 -->
            <template>
                <el-table-column label="操作" key="op" width="250" :class-name="snaplistShow ? 'option-snaplist' : ''">
                    <template slot-scope="scope">
                        <!-- 管理 -->
                        <span class="finger-cursor" v-show="isShow">管理</span>
                        <!-- 创建快照 -->
                        <span class="color-primary finger-cursor" v-show="cloudDiskShow">创建快照</span>
                        <b class="link-division-symbol" v-show="cloudDiskShow"></b>
                        <!-- 设置自动快照策略 -->
                        <span class="color-primary finger-cursor" v-show="cloudDiskShow">设置自动快照策略</span>
                        <b class="link-division-symbol" v-show="cloudDiskShow"></b>
                        <!-- 更多 -->
                        <el-dropdown v-show="cloudDiskShow" class="font12" trigger="click" placement="bottom-start">
                            <span class="el-dropdown-link color-primary">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-tooltip content="Top center" placement="left">
                                    <el-dropdown-item class="color999">挂载</el-dropdown-item>
                                </el-tooltip>
                                <el-tooltip content="Top center" placement="left">
                                    <el-dropdown-item class="color999">卸载</el-dropdown-item>
                                </el-tooltip>
                                <el-tooltip content="Top center" placement="left">
                                    <el-dropdown-item class="color999">释放</el-dropdown-item>
                                </el-tooltip>
                                <el-dropdown-item> 修改磁盘描述</el-dropdown-item>
                                <el-dropdown-item> 修改磁盘描述</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- 快照列表 -->
                        <span class="color-primary finger-cursor" v-show="snaplistShow">快照列表</span>
                        <!-- 修改策略 -->
                        <span class="color-primary finger-cursor" v-show="autosnapstrategyShow">修改策略</span>
                        <b class="link-division-symbol" v-show="autosnapstrategyShow"></b>
                        <!-- 设置磁盘 -->
                        <span class="color-primary finger-cursor" v-show="autosnapstrategyShow">设置磁盘</span>
                        <b class="link-division-symbol" v-show="autosnapstrategyShow"></b>
                        <!-- 删除策略 -->
                        <span class="color-primary finger-cursor" v-show="autosnapstrategyShow">删除策略</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </div>
</template>
<script>
export default {
    name: 'allTable',
    data() {
        return {};
    },
    props: {
        tableData: {},
        cols:{},
        cloudDiskShow:{
            default:false
        },
        snaplistShow:{
            default:false
        },
        autosnapstrategyShow: {
            default:false
        }
    }
};
</script>

<style scope lang="scss">
#table{
    font-size: 12px;
    .el-table .data-list th{
        line-height: 32px;
        height: 32px;
        border-top: 1px solid #c3c5c6;
        border-right: 0px solid transparent;
        background-color: #f5f6fb;
        color: #999;
        padding: 0px;
        font-size: 12px;
        font-weight: 500;
    }
    .el-table th .cell{
        border-right:1px solid #e8e8e8;
        font-size: 12px;
    }
    .zt-numlink {
        background-color: #f6f8fa;
        padding: 10px;
        font-size: 12px;
        line-height: 12px;
        color: #2B65C5;
    }
    .link-division-symbol{
        margin-right: 8px;
        margin-left: 8px;
        height: 9px;
        display: inline-block;
        border-right: 1px solid #4895d7;
    }
    .option-snaplist{
        text-align: right;
    }
}
</style>
