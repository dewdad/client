<template>   
    <div class="page-main">
        <ecs-inst-detail-header :ecsInst='ecsInst'></ecs-inst-detail-header>            
        <div class="page-body">
            <el-row :gutter="20" class="mt10 mb20">
                <el-col :span="8" ><span class="font16">磁盘列表</span></el-col>
                <el-col :span="16">
                    <div class="operateDisk">
                        <el-button type="primary" size="small">加入安全组</el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 列表 -->
            <div>
                <el-table @cell-mouse-enter="showEditName" @cell-mouse-leave="hideEditName" class="data-list" :data="tableData" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 实例名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <ul>
                                        <li>
                                            <span class="font12 mr10">{{scope.row.name}}</span>
                                        </li>
                                        <li>
                                            <span class="font12 mr10">{{scope.row.name}}</span>
                                            <AmendName :scope="scope" v-show="scope.row.name === showId"></AmendName>
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 描述 -->
                        <template v-if="col.column=='describe'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                            </el-table-column>
                        </template>
                        <!-- IP地址 -->
                        <template v-if="col.column=='ipaddr'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.ipaddr}}</span>
                                    <span class="color999">（内）</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 所属专用网络 -->
                        <template v-if="col.column=='privateNetwork'">
                            <el-table-column :prop="col.column" min-width="150" :label="col.text" :key="col.column">
                                
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                     <template>
                        <el-table-column label="操作" key="op" width="250" :class-name="true ? 'option-snaplist' : ''">
                            <template slot-scope="scope">
                                <!-- 管理 -->
                                <span class="finger-cursor color-primary">配置规则</span>
                                <b class="link-division-symbol"></b>
                                <!-- 快照列表 -->
                                <span class="color-primary finger-cursor">移出</span>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div> 
    </div>
</template>
<script src="./EcsInstSecuritygrpList.js">    
</script>
<style scoped>

</style>