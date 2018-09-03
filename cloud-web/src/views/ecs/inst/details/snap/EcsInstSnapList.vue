<template>   
    <div class="page-main">
        <ecs-inst-detail-header :ecsInst='ecsInst'></ecs-inst-detail-header>            
        <div class="page-body">
            <div class="mt10 mb20">快照列表</div>
            <!-- 列表 -->
            <div id="table">
                <el-table class="data-list" :data="tableData" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 实例名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <ul>
                                        <li>
                                            <!-- <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link> -->
                                        </li>
                                        <li>
                                            <span class="font12 mr10 color-primary">{{scope.row.name}}</span>
                                            <el-popover transition="scale-in" placement="top" trigger="hover">
                                                <div>
                                                    <div>设备名 :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                    <div>实例名称/ID :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                    <div>实例状态 :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                    <div>创建时间 :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                </div>
                                                <i slot="reference" class="iconfont icon-notice_people font12"></i>
                                            </el-popover>
                                        </li>
                                        <li>
                                            <span class="font12 mr10">{{scope.row.name}}</span>
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 源磁盘属性 -->
                        <template v-if="col.column=='isBoot'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                            </el-table-column>
                        </template>
                        <!-- 源磁盘容量 -->
                        <template v-if="col.column=='disksize'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.disksize}}</span>
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
                        <!-- 快照容量 -->
                        <template v-if="col.column=='snapSize'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.snapSize}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                     <template>
                        <el-table-column label="操作" key="op" width="250" :class-name="true ? 'option-snaplist' : ''">
                            <template slot-scope="scope">
                                <!-- 管理 -->
                                <span class="finger-cursor" v-show="false">管理</span>
                                <!-- 快照列表 -->
                                <span class="color-primary finger-cursor" v-show="true">快照列表</span>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div> 
    </div>
</template>
<script src="./EcsInstSnapList.js">    
</script>
<style scoped lang="scss">
</style>