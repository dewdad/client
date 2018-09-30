<template>
    <div class="page-main">
        <page-header>
            磁盘快照
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">

                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText=''">
                            <el-option v-for="item in searchCond1" :value="item.key" :label="item.value" :key="item.key" v-if="user.roleType == 3"></el-option>
                            <el-option v-for="item in searchCond2" :value="item.key" :label="item.value" :key="item.key" v-if="user.roleType != 3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText" v-if="type !== 'status'" @change="clearIndex"></el-input>
                        <el-select placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'status'" @change="clearIndex">
                            <el-option v-for="item in statusArrVolume" :value="item.key" :label="item.value" :key="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="searchSnapshotList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="searchSnapshotList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <template v-if="col.column=='domain_name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.domain_name}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='project_name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.project_name}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.display_name}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='size'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.volume_size}}GB</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <zt-status :status="ECS_STATUS" :value="scope.row.status" class="text-nowrap status-column font12"></zt-status>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='volumeName'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.volume_name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='desc'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.display_description}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <!--<span   v-if="scope.row.status !='available' && scope.row.status !='in-use' && scope.row.status !='awaiting-transfer' && 'deleting'!=item.status" class="color999">删除</span>-->
                                <a  @click="delCloud(scope.row)" v-if="scope.row.status=='available' " class="btn-linker">删除</a>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination background
                   @current-change="currentChange"
                   @size-change="handleSizeChange"
                   :current-page="searchObj.paging.pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="searchObj.paging.limit"
                   layout="sizes, prev, pager, next"
                   :total="searchObj.paging.totalItems">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import PageHeader from '@/components/pageHeader/PageHeader';
import ZtStatus from '@/components/status/ZtStatus';
import {delSnapshot,searchSnapshotList} from '@/service/cloudres.js';
export default {
    name: 'app',

    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            { column: 'domain_name', text:'部门' , width: '10%'},
            { column: 'project_name', text:'租户' , width: '5%'},
            { column: 'name', text: '名称', width: '5%' },
            { column: 'size', text: '大小', width: '5%' },
            { column: 'status', text: '状态', width: '5%' },
            { column: 'volumeName', text: '数据磁盘名称', width: '10%' },
            { column: 'desc', text: '描述', width: '10%' },
        ];

        let searchCond1 = [
            {key: 'project_name', value: '租户'},
            {key: 'display_name', value: '名称'},
            {key: 'display_description', value: '描述'},
            {key: 'status', value: '状态'}
        ];
        let searchCond2 = [
            {key: 'domain_name', value: '部门'},
            {key: 'project_name', value: '租户'},
            {key: 'display_name', value: '名称'},
            {key: 'display_description', value: '描述'},
            {key: 'status', value: '状态'}
        ];
        let statusArrVolume = [
            {key: 'creating', value: '创建中'},
            {key: 'available', value: '可用'},
            {key:'in-use',value:'使用中'},
            {key: 'deleting', value: '删除中'},
            {key: 'error', value: '错误'},
            {key: 'backing-up', value: '备份中'},
            {key: 'awaiting-transfer', value: '转让中'},
            {key: 'error_deleting', value: '删除时出错'},
        ];
        let ECS_STATUS = [
            {
                text: '创建中',
                value: 'creating',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },
            {
                text: '使用中',
                value: 'in-use',
                className: 'color-success',
                icon: 'icon-running_people'
            },
            {
                text: '可用',
                value: 'available',
                className: 'color-success',
                icon: 'icon-running_people'
            },
            {
                text: '转让中',
                value: 'awaiting-transfer',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },
            {
                text: '备份中',
                value: 'backing-up',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },
            {
                text: '删除中',
                value: 'deleting',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '错误',
                value: 'error',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '恢复时出错',
                value: 'error_restoring',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '恢复中',
                value: 'restoring',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },

        ];
        return {
            ECS_STATUS,
            statusArrVolume,
            searchCond1,
            searchCond2,
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
            },
            type:'',
            tableData: []

        };
    },
    components: {
        PageHeader,
        ZtStatus

    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods: {
        searchSnapshotList(){
            let params = {
                paging:this.searchObj.paging,
            };
            if([this.type] && this.formInline.searchText){
                params[this.type] = this.formInline.searchText;
            }
            this.tableData = [];
            searchSnapshotList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.resultList){
                    this.tableData = resData.resultList || [];
                    console.log('this.tableData',this.tableData);
                    this.searchObj.paging.totalItems = resData.totalRows || 0;
                }
            });
        },
        clearIndex(){
            if([this.type] && this.formInline.searchText){
                this.searchObj.paging.pageIndex = 1;
            }
        },
        calcSize(size) {
            if (size < 1024) {
                return size + 'B';
            }
            if (size < 1024 * 1024) {
                return size / 1024 + 'KB';
            }
            if (size < 1024 * 1024 * 1024) {
                return size / (1024 * 1024) + 'MB';
            }
            return size / (1024 * 1024 * 1024) + 'GB';
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.searchSnapshotList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.searchSnapshotList();
        },
        del(item){
            delSnapshot(item.id).then(ret=>{
                if(ret.code === '0000'){
                    this.searchSnapshotList();
                    return this.$alert('操作成功','提示');
                }
            });
        },
        convertStatusSnapshot(status) {
            status = status.toLowerCase();
            for (var i = 0, ii = this.statusArrVolume.length; i < ii; i++) {
                var item = this.statusArrVolume[i];
                if (item.key == status) {
                    return item.value;
                }
            }
            return status;
        },
        /**
         * 删除镜像
         */
        delCloud(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.del(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },

    mounted(){
        this.searchSnapshotList();
    }
};
</script>
<style scoped>
</style>
