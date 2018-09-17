<template>
    <div class="page-main">
        <page-header>
            云盘备份
            <div slot="right">
                <el-button type="info" size="small" @click="getBackupList('')">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getBackupList" :paging="searchObj.paging">
                <!-- 实例名称 -->
                <el-table-column min-width="180" prop="name" label="名称">
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
                <el-table-column label="操作" key="op" width="250" class-name="option-column">
                    <template slot-scope="scope">
                        <span @click="recovery(scope.row)" class="btn-linker">恢复备份</span>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteBackup(scope.row)" class="btn-linker">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <recovery ref="Recovery"/>
        <delete-dialog ref="DeleteDailog"/>
    </div>
</template>
<script>
import {getBackupList, deleteBackup} from '@/service/ecs/disk/disk.js';
import Recovery from './dialog/Recovery';
import {DISK_BACK_STATUS} from '@/constants/dicts/ecs';
let statusArr = [
    {text: '全部', state: true, value: ''},
    ...DISK_BACK_STATUS
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
            },
            task: null
        };
    },
    components: {
        Recovery
    },
    destroyed() {
        clearInterval(this.task);
    },
    mounted() {
        this.getBackupList();
        // 每30秒查询一次
        this.task = setInterval(() => {
            this.getBackupList(false);
        }, 30000);
    },
    methods: {
        getBackupList(params) {
            if (params !== false) this.loading = true;
            params = params || this.searchObj.paging;
            getBackupList(params)
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
        recovery(row) {
            this.$refs.Recovery.show(row).then(() => {
                this.$message.success('操作成功');
            }).catch(err => {
                $log(err);
            });
        },
        deleteBackup(row) {
            this.$refs.DeleteDailog.show('备份', row.name, () => {
                return deleteBackup(row.id);
            }).then(res => {
                this.$message.success('操作成功');
                this.getBackupList();
            });
        }
    }
};
</script>

