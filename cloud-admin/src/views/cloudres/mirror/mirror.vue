<template>
    <div class="page-main">
        <page-header>
            镜像
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-button type="primary" @click="createMirror()">
                            <span class="icon-zt_plus"></span>
                            创建镜像
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText=''">
                            <el-option label="名称" value="name"></el-option>
                            <el-option label="状态" value="status"></el-option>
                            <el-option label="公有或私有" value="visibility"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'name'"></el-input>
                        <el-select placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'status'">
                            <el-option v-for="item in imageStatusArr" :value="item.key" :label="item.value" :key="item.key"></el-option>
                        </el-select>
                        <el-select placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'visibility'">
                            <el-option v-for="item in imageVisibilityArr" :value="item.key" :label="item.value" :key="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="searchMirrorList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="searchMirrorList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <a class="font12 mr10 btn-linker" @click="showDetail(scope.row)">{{scope.row.name}}</a>
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
                        <template v-if="col.column=='visibility'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.visibility == 'public'?'公有':'私有'}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='public'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.protected?'是':'否'}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='format'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.disk_format}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='size'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10" v-if="scope.row.size">{{calcSize(scope.row.size)}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="delMirror(scope.row)" class="btn-linker">删除镜像</a>
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
                   :total="totalItems">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <create-mirror ref="CreateMirror"></create-mirror>
        <mirror-detail ref="MirrorDetail"></mirror-detail>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import CreateMirror from './CreateMirror';
import MirrorDetail from './MirrorDetail';
import ZtStatus from '@/components/status/ZtStatus';
import {searchMirrorList,delMirror} from '@/service/cloudres.js';
export default {
    name: 'app',

    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
            },
        };
        let cols = [
            { column: 'name', text:'名称' , width: '10%'},
            { column: 'status', text:'状态' , width: '5%'},
            { column: 'protect', text: '可见性', width: '5%' },
            { column: 'visibility', text: '受保护的', width: '5%' },
            { column: 'format', text: '系统源格式', width: '10%' },
            { column: 'size', text: '大小', width: '10%' },
        ];
        let imageStatusArr = [
            {key: 'ACTIVE', value: '运行中'},
            {key: 'QUEUED', value: '已排队'},
            {key: 'SAVING', value: '保存中'},
            {key: 'KILLED', value: '破坏的'},
            {key: 'DELETED', value: '已删除'},
            {key: 'PENDING_DELETE', value: '删除中'}
        ];
        let ECS_STATUS = [
            {
                text: '保存中',
                value: 'saving',
                className: 'color-warning',
                icon: 'icon-recentcreation_peop'
            },
            {
                text: '已排队',
                value: 'queued',
                className: 'color-success',
                icon: 'icon-running_people'
            },
            {
                text: '运行中',
                value: 'active',
                className: 'color-success',
                icon: 'icon-running_people'
            },
            {
                text: '破坏的',
                value: 'killed',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '已删除',
                value: 'deleted',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '删除中',
                value: 'pending-delete',
                className: 'color-warning',
                icon: 'icon-overdue_people'
            }
        ];
        let imageVisibilityArr = [
            {key: 'public', value: '公有'},
            {key: 'private', value: '私有'},
        ];
        return {
            ECS_STATUS,
            imageVisibilityArr,
            imageStatusArr,
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
            },
            totalItems: 0,
            type:'name',
            tableData: []

        };
    },
    components: {
        PageHeader,
        CreateMirror,
        MirrorDetail,
        ZtStatus
    },
    methods: {
        searchMirrorList(){
            let params = {
                paging:this.searchObj.paging,
            };
            if(this.type && this.formInline.searchText){
                params[this.type] = this.formInline.searchText;
            }
            $log('params', params);
            searchMirrorList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.totalItems = resData.total || 0;
                }
            });
        },
        createMirror(){
            this.$refs.CreateMirror.show()
                .then(ret => {
                    this.searchMirrorList();
                    return this.$alert('操作成功','提示');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        showDetail(item){
            if(item) this.$refs.MirrorDetail.show(item);
        },
        convertStatus(status) {
            let upperCase = status ? status.toUpperCase() : '';
            for (let i = 0, ii = this.imageStatusArr.length; i < ii; i++) {
                let item = this.imageStatusArr[i];
                if (item.key === upperCase) {
                    return item.value;
                }
            }
            return status;
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
            this.searchMirrorList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.searchMirrorList();
        },
        del(item){
            delMirror(item.id).then(ret=>{
                this.searchMirrorList();
            });
        },
        /**
         * 删除镜像
         */
        delMirror(item) {
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
        this.searchMirrorList();
    }
};
</script>
<style scoped>
</style>
