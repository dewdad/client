<template>
    <div class="page-main">
        <page-header>
            云盘快照
            <div slot="right">
                <el-button type="info" size="small" @click="getSnapshotList">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getSnapshotList" :paging="searchObj.paging">
                <!-- 实例名称 -->
                <el-table-column min-width="120" prop="name" label="名称">
                </el-table-column>
                <!-- 磁盘ID -->
                <el-table-column min-width="180" prop="id" label="磁盘ID">
                </el-table-column>
                <!-- 磁盘名称 -->
                <el-table-column min-width="180" prop="volumeName" label="磁盘名称">
                </el-table-column>
                <!-- 磁盘容量 -->
                <el-table-column min-width="100" prop="size" label="磁盘容量">
                    <template slot-scope="scope">
                        {{scope.row.size}}G
                    </template>
                </el-table-column>
                <!-- 描述 -->
                <el-table-column min-width="180" prop="description" label="描述">
                </el-table-column>
                <!-- 状态 -->
                <el-table-column min-width="100" prop="status" label="状态">
                    <template slot-scope="scope">
                        <zt-status :status="statusArr" :value="scope.row.status" class="text-nowrap status-column"></zt-status>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" width="150" class-name="option-column">
                    <template slot-scope="scope">
                        <span @click="editSnap(scope.row)" class="btn-linker">创建磁盘</span>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteSnap(scope.row)" class="btn-linker">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <create-disk ref="CreateDisk"/>
        <delete-dialog ref="DeleteDailog"/>
    </div>
</template>
<script>
import {getSnapshotList, deleteSnapshots} from '@/service/ecs/snapshot.js';
import CreateDisk from './dialog/CreateDisk';
let statusArr = [
    {text: '全部', state: true, value: ''},
    {
        text: '可用',
        value: 'available',
        className: 'color-success',
        icon: 'icon-chenggong',
        type: 'font'
    },
    {
        text: '错误',
        value: 'error',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '备份中',
        value: 'backing-up',
        className: 'color-progress-warning',
        type: 'progress'
    },
    {
        text: '删除时出错',
        value: 'error_deleting',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    },
    {
        text: '删除中',
        value: 'deleting',
        className: 'color-danger',
        type: 'progress'
    },
    {
        text: '创建中',
        value: 'downloading',
        className: 'color-progress-primary',
        type: 'progress'
    },
    {
        text: '创建中',
        value: 'creating',
        className: 'color-progress-primary',
        type: 'progress'
    },
];
export default {
    data() {
        let fields = [{field: 'name', label: '名称', inputval: '', tagType: 'INPUT'}];
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            }
        };
        return {
            fields,
            tableData: [],
            loading: false,
            statusArr,
            snaplistShow: true,
            searchObj,
            fieldValue: '',
            showId: '',
            inlineForm: {
                field: '',
                value: ''
            }
        };
    },
    components: {
        CreateDisk
    },
    mounted() {
        this.getSnapshotList();
    },
    methods: {
        getSnapshotList(params) {
            params = params || this.searchObj.paging;
            this.loading = true;
            getSnapshotList(params)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data;
                        if (resData && resData.data) {
                            this.tableData = resData.data || [];
                            this.searchObj.paging.totalItems = resData.total || 0;
                        }
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        editSnap(row) {
            this.$refs.CreateDisk.show(row).then(() => {
            });
        },
        deleteSnap(row) {
            this.$refs.DeleteDailog.show('快照', row.name, () => {
                return deleteSnapshots(row.id);
            }).then(res => {
                this.$message.success('操作成功');
                this.getSnapshotList();
            });
        }
    }
};
</script>

