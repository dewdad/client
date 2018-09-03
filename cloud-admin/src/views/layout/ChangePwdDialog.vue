<template>
    <el-dialog title="设置自动快照策略" :visible.sync="isShow" width="1200px" class="editPwdDialog">
        <div class="setDisk">
            <div class="notSet set">
                <div class="head mb20">
                    <div class="left">
                        <b class="leftBlueBox"></b>
                        <span class="ml10">未设置快照磁盘</span>
                    </div>
                    <div class="right">
                        <el-select v-model="searchObjExtra.selFieldL.field" size="small" filterable  placeholder="请选择" >
                            <el-option v-for="item in searchObjExtra.fields" :key="item.field" :label="item.label" :value="item.field">
                            </el-option>
                        </el-select>
                        <el-input class="ml10 noSetInput" v-model="searchObjExtra.selFieldL.inputval" size="small"></el-input>
                    </div>
                </div>
                <!-- 列表 -->
                <div>
                    <el-table class="data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                        <template v-for="col in cols">
                            <!-- 磁盘名称 -->
                            <template v-if="col.column=='diskName'">
                                <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <ul>
                                            <li>
                                                <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                            </li>
                                            <li>
                                                <span class="font12">{{scope.row.name}}</span>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 实例名称 -->
                            <template v-if="col.column=='name'">
                                <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <ul>
                                            <li>
                                                <span class="font12" v-if="!scope.row.instanceId">-</span>
                                                <router-link v-else :to="{name:'app.ecs.inst.detail',params:{id:scope.row.instanceId,item:scope.row}}">{{ scope.row.instanceId }}</router-link>
                                            </li>
                                            <li>
                                                <span class="font12 mr10">{{scope.row.instanceName || '-'}}</span>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘种类 -->
                            <template v-if="col.column=='diskType'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.type">{{scope.row.type}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘属性 -->
                            <template v-if="col.column=='isBoot'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        {{scope.row.isBoot === 1 ? '系统盘' : '数据盘' }}
                                    </template>
                                </el-table-column>
                            </template>
                        </template>
                        <!-- 操作 -->
                        <template>
                            <el-table-column label="操作" key="op" width="50">
                                <template slot-scope="scope">
                                    <!-- 选择 -->
                                    <span @click="selDisk(scope.row)" class="color-primary finger-cursor">选择</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
            <div class="alreadySet set">
                <div class="head mb20">
                    <div class="left">
                        <b class="leftBlueBox"></b>
                        <span class="ml10">已设置快照磁盘</span>
                    </div>
                    <div class="right">
                        <el-select v-model="searchObjExtra.selFieldL.field" size="small" placeholder="请选择">
                            <el-option v-for="item in searchObjExtra.fields" :key="item.field" :label="item.label" :value="item.field">
                            </el-option>
                        </el-select>
                        <el-input class="ml10 noSetInput" v-model="searchObjExtra.selFieldL.inputval" size="small"></el-input>
                    </div>
                </div>
                <!-- 列表 -->
                <div>
                    <el-table class="data-list" :data="alreadyTableData" header-row-class-name="data-list" style="width: 100%">
                        <template v-for="col in cols">
                            <!-- 磁盘名称 -->
                            <template v-if="col.column=='diskName'">
                                <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <ul>
                                            <li>
                                                <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                            </li>
                                            <li>
                                                <span class="font12">{{scope.row.name}}</span>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 实例名称 -->
                            <template v-if="col.column=='name'">
                                <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <ul>
                                            <li>
                                                <span class="font12" v-if="!scope.row.instanceId">-</span>
                                                <router-link v-else :to="{name:'app.ecs.inst.detail',params:{id:scope.row.instanceId,item:scope.row}}">{{ scope.row.instanceId }}</router-link>
                                            </li>
                                            <li>
                                                <span class="font12 mr10">{{scope.row.instanceName || '-'}}</span>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘种类 -->
                            <template v-if="col.column=='diskType'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.type">{{scope.row.type}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘属性 -->
                            <template v-if="col.column=='isBoot'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        {{scope.row.isBoot === 1 ? '系统盘' : '数据盘' }}
                                    </template>
                                </el-table-column>
                            </template>
                        </template>
                        <!-- 操作 -->
                        <template>
                            <el-table-column label="操作" key="op" width="50">
                                <template slot-scope="scope">
                                    <!-- 选择 -->
                                    <span @click="cancelDisk(scope.row)" class="color-primary finger-cursor">取消</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>

export default {
    data() {

    },
    props: {},
    methods: {

    }
};
</script>
<style lang="scss">
.editPwdDialog {
    padding: 0 40px;
    .setDisk {
        display: flex;
        .set {
            flex: 1;
            .head {
                display: flex;
                width: 100%;
                line-height: 32px;
                .left {
                    flex: 1;
                }
                .right {
                    flex: 2;
                    text-align: right;
                }
                .el-select {
                    width: 100px;
                }
                .noSetInput {
                    width: 200px;
                }
            }
        }
        .notSet {
            border-right: 1px solid #e2e2e2;
            padding-right: 20px;
        }
        .alreadySet {
            padding-left: 20px;
        }
    }
}
</style>
