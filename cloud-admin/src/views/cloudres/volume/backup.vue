<template>
    <div class="page-main">
        <page-header>
            磁盘备份
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">

                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText=''">
                            <el-option v-for="item in searchCond" :value="item.key" :label="item.value" :key="item.key" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText" v-if="type !== 'status'"></el-input>
                        <el-select placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'status'">
                            <el-option v-for="item in imageStatusArr" :value="item.key" :label="item.value" :key="item.key"></el-option>
                        </el-select>
                        <el-select placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'visibility'">
                            <el-option v-for="item in imageVisibilityArr" :value="item.key" :label="item.value" :key="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="searchBackupList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="searchBackupList"></el-button>
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
                        <template v-if="col.column=='display_name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.display_name }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='display_description'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.display_description}}</span>
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
                        <template v-if="col.column=='size'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.size}} GB</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="delBackup(scope.row)"  v-if="scope.row.status=='available' || scope.row.status=='error_restoring'" class="btn-linker">删除</a>
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
import {searchBackupList,delBackup} from '@/service/cloudres.js';
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
            { column: 'display_name', text: '名称', width: '5%' },
            { column: 'display_description', text: '描述', width: '5%' },
            { column: 'status', text: '状态', width: '10%' },
            { column: 'size', text: '大小', width: '10%' },
        ];
        let imageStatusArr = [
            {key: 'creating', value: '创建中'},
            {key: 'available', value: '可用'},
            {key: 'deleting', value: '删除中'},
            {key: 'error', value: '错误'},
            {key: 'restoring', value: '恢复中'},
            {key: 'error_restoring', value: '恢复时出错'}
        ];
        let ECS_STATUS = [
            {
                text: '创建中',
                value: 'creating',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },
            {
                text: '可用',
                value: 'available',
                className: 'color-success',
                icon: 'icon-running_people'
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
        let searchCond = [
            {key: 'display_name', value: '名称'},
            {key: 'display_description', value: '描述'},
            {key: 'status', value: '状态'}
        ];
        return {
            ECS_STATUS,
            searchCond,
            imageStatusArr,
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
        searchBackupList(){
            let params = {
                paging:this.searchObj.paging,
            };
            if([this.type] && this.formInline.searchText){
                params[this.type] = this.formInline.searchText;
            }
            $log('params', params);
            searchBackupList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.resultList){
                    this.tableData = resData.resultList || [];
                    this.searchObj.paging.totalItems = resData.totalPages || 0;
                }
            });
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
            this.searchBackupList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.searchBackupList();
        },
        del(item){
            delBackup(item.id).then(ret=>{
                this.searchBackupList();
            });
        },
        /**
         * 删除镜像
         */
        delBackup(item) {
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
        this.searchBackupList();
    }
};
</script>
<style scoped>
</style>
