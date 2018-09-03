<template>
    <div class="mt10">
        <page-header class="page-header-second">
            备份与恢复
        </page-header>
        <el-row>
            <el-col :span="24">
                <el-tabs v-model="activeName" @tab-click="tabClick">
                    <el-tab-pane label="数据备份" name="backup">
                        <el-table v-loading="loading" :data="tableData" stripe border class="data-list mt10">
                            <el-table-column v-for="column in tableColumns" :width="column.width ? column.width : 'auto'" :prop="column.prop" :label="column.label" :key="column.label">
                                <template slot-scope="scope">
                                    <span v-if="column.prop === 'size'">
                                        {{(scope.row[column.prop]*1024)|convertByteSize(1, 'string')}}
                                    </span>
                                    <span v-else-if="column.prop === 'backupMethod'">
                                        {{scope.row[column.prop] == "auto" ? "自动" : "手动"}}
                                    </span>
                                    <span v-else-if="column.prop === 'status'">
                                        <zt-status :status="DICT_RDS.BACKUP_STATUS" :value="scope.row[column.prop]"></zt-status>
                                    </span>
                                    <span v-else-if="column.prop === 'startTime'">
                                        {{parseInt(scope.row[column.prop])|date('YYYY-MM-DD HH:mm:ss')}}
                                    </span>
                                    <span v-else>
                                        {{scope.row[column.prop]}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" :header-align="'right'" align="right" width="120px" class-name="option-column">
                                <template slot-scope="scope">
                                    <a href="javascript:;" :disabled="scope.row.status === 'backing_up'" @click="recovery(scope.row.fileId)">恢复</a>
                                    <b class="link-division-symbol"></b>
                                    <a href="javascript:;" :disabled="scope.row.status === 'backing_up'" @click="deleteBackup(scope.row.fileId, scope.row.name)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.currentPage" :page-sizes="[20, 50, 100]" :page-size="pagination.pageSize" layout="sizes, prev, pager, next, total" :total="pagination.total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="备份设置" name="setting">
                        <div v-if="activeName==='setting'" class="mt10">
                            <div class="search-box">
                                <zt-form size="small" style="width: 300px; padding-left:" ref="policy" :model="policy" label-width="130px" inline-message>
                                    <zt-form-item label="数据备份保留">
                                        <el-input-number style="width:100%;" v-if="isShow" v-model="policy.keepday" controls-position="right" :min="1" :max="30"></el-input-number>
                                        <span v-if="!isShow">{{policy.keepday}}</span>
                                    </zt-form-item>
                                    <zt-form-item label="备份时间" prop="starttime" :rules="[{required: true, message: '请选择备份时间', trigger: ['change']}]">
                                        <el-time-picker style="width:100%;" v-if="isShow" v-model="policy.starttime" :picker-options="{ selectableRange: '00:0:00 - 23:59:59'}" placeholder="任意时间点"></el-time-picker>
                                        <span v-if="!isShow">{{policy.starttime|date('HH:mm:ss')}}</span>
                                    </zt-form-item>
                                    <zt-form-item v-if="!isShow" label="">
                                        <el-button type="info" @click="isShow=true">设置</el-button>
                                    </zt-form-item>
                                    <zt-form-item v-if="isShow" label="">
                                        <el-button type="primary" @click="updatePolicy">保存</el-button>
                                        <el-button type="info" @click="isShow=false">取消</el-button>
                                    </zt-form-item>
                                </zt-form>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <!-- RDS备份恢复弹框 -->
        <el-dialog v-if="showRecovery" title="RDS备份恢复" :visible.sync="showRecovery" :append-to-body="true" :close-on-click-modal="false" @close="showRecovery=false">
            <el-alert title="请谨慎操作！" :closable="false" type="warning"></el-alert>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm" :loading="isSubmit" :disabled="isSubmit" size="small">恢复到当前实例</el-button>
                <a href="#" class="el-button el-button--primary el-button--small" :disabled="isSubmit">恢复到新实例</a>
                <el-button type="info" @click="showRecovery=false" :disabled="isSubmit" size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getSnapshotList, deleteBackup, updatePolicy} from '@/service/rds/detail';
import {serverAction} from '@/service/rds/list';
import ZtStatus from '@/components/status/ZtStatus';
import {DICT_RDS} from '@/constants/dicts/rds';
import {dateFormat, cloneDeep} from '@/utils/utils';
import {mapState} from 'vuex';
import ZtAlert from '@/components/ZTAlert/Index';
const tableColumns = [
    {
        prop: 'name',
        label: '备份名称',
        width: '250px'
    },
    {
        prop: 'backupMethod',
        label: '备份类型'
    },
    {
        prop: 'startTime',
        label: '备份时间'
    },
    {
        prop: 'size',
        label: '备份大小'
    },
    {
        prop: 'status',
        label: '状态'
    },
    {
        prop: 'description',
        label: '备份描述'
    }
];
export default {
    name: 'Logmgr',
    data() {
        return {
            loading: false,
            // 当前 tab
            activeName: 'backup',
            // 显示设置选择
            isShow: false,
            // 显示恢复对话框
            showRecovery: false,
            isSubmit: false,
            DICT_RDS,
            tableColumns,
            tableData: [],
            pagination: {
                total: 0,
                pageSize: 20,
                currentPage: 1
            },
            policy: {
                keepday: 1,
                starttime: ''
            },
            backupRef: '' // 恢复时需要
        };
    },
    components: {
        ZtStatus,
        ZtAlert
    },
    computed: {
        ...mapState({
            instance: state => state.rds.instance
        }),
        instId: function() {
            return this.$route.params.id;
        }
    },
    watch: {
        activeName: function(newval) {
            this.$router.push({name: 'app.rds.inst.backrecover', params: {tab: newval}});
        },
        isShow: function(newval) {
            if (!newval) {
                this.policy.keepday = this.instance.backupStrategy.keepDays;
                this.policy.starttime = new Date('2018-12-12 ' + this.instance.backupStrategy.startTime);
            }
        }
    },
    created() {
        if (this.$route.params.tab) {
            this.activeName = this.$route.params.tab;
        }
        this.policy.keepday = this.instance.backupStrategy.keepDays;
        this.policy.starttime = new Date('2018-12-12 ' + this.instance.backupStrategy.startTime);

        this.getSnapshotList();
    },
    methods: {
        tabClick() {
            // if (this.activeName === 'backup') this.getSnapshotList();
        },
        // 获取快照列表数据
        getSnapshotList() {
            this.loading = true;
            getSnapshotList({filterContent: this.instId, limit: this.pagination.pageSize, pageIndex: this.pagination.currentPage})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.tableData = res.result.data;
                        this.pagination.total = res.result.total;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getSnapshotList();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getSnapshotList();
            console.log(`当前页: ${val}`);
        },
        // 删除备份
        deleteBackup(id, name) {
            // const h = this.$createElement;
            // 删除备份
            // let message = h('div', null, [
            //     h('p', {class: {font16: true}}, '确定要删除备份吗？'),
            //     h('el-alert', {props: {type: 'warning', title: '删除操作无法恢复，请谨慎操作。', showIcon: false, closable: false}}),
            // ]);
            this.$messageBox
                .confirm('确定要删除备份吗？', '删除备份', {
                    type: 'help',
                    alertMessage: '删除操作无法恢复，请谨慎操作',
                    subMessage: name
                })
                .then(action => {
                    deleteBackup(id)
                        .then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('删除成功');
                                this.getSnapshotList();
                            }
                        })
                        .catch(err => {
                            $log(err);
                        });
                });
        },
        // 更新备份设置
        updatePolicy() {
            this.$refs.policy.validate(valid => {
                if (valid) {
                    let hours = dateFormat(this.policy.starttime, 'HH:mm:ss');
                    updatePolicy(this.instId, this.policy.keepday, hours)
                        .then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('设置成功');
                                // 更新vuex缓存
                                let instance = cloneDeep(this.instance);
                                instance.backupStrategy.keepDays = this.policy.keepday;
                                instance.backupStrategy.startTime = hours;
                                this.$store.commit('rds/SET_INSTANCE', instance);
                                this.isShow = false;
                            }
                        })
                        .catch(err => $log(err));
                }
            });
        },
        // 显示恢复备份对话框
        recovery(fileId) {
            this.showRecovery = true;
            this.backupRef = fileId;
        },
        // 提交恢复操作
        confirm() {
            this.isSubmit = true;
            serverAction(this.instId, {backupRef: this.backupRef})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message.success('操作成功');
                    }
                })
                .catch(err => $log(err))
                .finally(() => (this.isSubmit = false));
        }
    }
};
</script>
<style scoped>
</style>
