<template>
    <div class="page-main">
        <page-header>
            报警规则列表
            <div slot="right">
                <el-button type="primary" @click="$router.push({name: 'app.monitor.alarmrule.add'})" size="small">新建报警规则</el-button>
                <el-button type="info" size="small" @click="getSnapshotList">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getSnapshotList" :paging="searchObj.paging">
                <el-table-column min-width="120" prop="name" label="规则名称">
                </el-table-column>
                <el-table-column min-width="180" prop="id" label="启用">
                </el-table-column>
                <el-table-column min-width="180" prop="volumeName" label="监控项">
                </el-table-column>
                <el-table-column min-width="100" prop="size" label="维度">
                    <template slot-scope="scope">
                        {{scope.row.size}}
                    </template>
                </el-table-column>
                <el-table-column min-width="180" prop="description" label="报警规则">
                </el-table-column>
                <el-table-column min-width="180" prop="description" label="通知对象">
                </el-table-column>
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
        <delete-dialog ref="DeleteDailog" />
    </div>
</template>
<script>
import {getSnapshotList, deleteSnapshots} from '@/service/ecs/snapshot.js';

export default {
    data() {
        let fields = [{field: 'name', label: '规则名称', inputval: '', tagType: 'INPUT'}];
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
    },
    mounted() {
    },
    methods: {
        getSnapshotList(params) {
            params = params || this.searchObj.paging;
            if (params !== false) this.loading = true;
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
            this.$refs.CreateDisk.show(row).then(() => {});
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

