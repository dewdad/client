<template>
    <div class="page-main">
        <page-header>
            磁盘
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
                        <el-button class="ml10" size="small" type="primary" @click="searchCloudList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="searchCloudList"></el-button>
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
                                    <span class="font12 mr10">{{scope.row.size}}GB</span>

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
                        <template v-if="col.column=='linkto'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <div class="font12 mr10">
                                        <p v-for="attachment in scope.row.attachment" :key="attachment.id">{{attachment.hostname}}</p>
                                        </div>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='zoon'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.availability_zone}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='canstart'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.bootable?'是':'否'}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="60" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <!--<span   v-if="scope.row.status !='available' && scope.row.status !='in-use' && scope.row.status !='awaiting-transfer' && 'deleting'!=scope.row.status" class="color999 font12">删除</span>-->
                                <a  @click="delCloud(scope.row)" v-if="scope.row.status=='available' || scope.row.status=='error_restoring'|| scope.row.status=='error'" class="btn-linker">删除</a>
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
import {searchCloudList,delCloud} from '@/service/cloudres.js';
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
            { column: 'linkto', text: '挂载到', width: '10%' },
            { column: 'zoon', text: '可用域', width: '10%' },
            { column: 'canstart', text: '可启动', width: '10%' },
        ];

        let searchCond1 = [
            {key: 'project_name', value: '租户'},
            {key: 'display_name', value: '名称'},
            {key: 'status', value: '状态'},
            {key: 'size', value: '大小'}
        ];
        let searchCond2 = [
            {key: 'domain_name', value: '部门'},
            {key: 'project_name', value: '租户'},
            {key: 'display_name', value: '名称'},
            {key: 'status', value: '状态'},
            {key: 'size', value: '大小'}
        ];
        let statusArrVolume = [
            {key:'creating',value:'创建中'},
            {key:'available',value:'可用'},
            {key:'reserved',value:'保留'},
            {key:'attaching',value:'连接中'},
            {key:'detaching',value:'分离中'},
            {key:'in-use',value:'使用中'},
            {key:'maintenance',value:'维修中'},
            {key:'deleting',value:'删除中'},
            {key:'awaiting_transfer',value:'等待转移'},
            {key:'error',value:'错误'},
            {key:'error_deleting',value:'删除时出错'},
            {key:'backing_up',value:'备份中'},
            {key:'restoring_backup',value:'恢复备份中'},
            {key:'error_backing_up',value:'备份时出错'},
            {key:'error_restoring',value:'恢复备份时出错'},
            {key:'error_extending',value:'扩展时错误'},
            {key:'downloading',value:'下载中'},
            {key:'uploading',value:'上传中'},
            {key:'extending',value:'扩展中'},
        ];
        let ECS_STATUS = [
            {
                text: '扩展中',
                value: 'extending',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },{
                text: '维修中',
                value: 'maintenance',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },{
                text: '恢复备份中',
                value: 'restoring_backup',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },{
                text: '恢复备份时出错',
                value: 'error_restoring',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            }, {
                text: '下载中',
                value: 'downloading',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            }, {
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
                text: '使用中',
                value: 'in-use',
                className: 'color-success',
                icon: 'icon-running_people'
            },
            {
                text: '保留',
                value: 'reserved',
                className: 'color-danger',
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
                text: '删除时出错',
                value: 'error_deleting',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '待重启',
                value: 'WAIT_REBOOT',
                className: 'color-warning',
                icon: 'zticon-running_people'
            },
            {
                text: '创建中',
                value: 'build',
                className: 'color-primary',
                type: 'progress'
            }
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
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    components: {
        PageHeader,
        ZtStatus

    },
    methods: {
        searchCloudList(){
            let params = {
                paging:this.searchObj.paging,
            };
            if([this.type] && this.formInline.searchText){
                params[this.type] = this.formInline.searchText;
            }
            this.tableData = [];
            $log('params', params);
            searchCloudList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.resultList){
                    this.tableData = resData.resultList || [];
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
            this.searchCloudList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.searchCloudList();
        },
        del(item){
            delCloud(item.id).then(ret=>{
                if(ret.code === '0000'){
                    this.searchCloudList();
                    return this.$alert('操作成功','提示');
                }
            });
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
        this.searchCloudList();
    }
};
</script>
<style scoped>
</style>
