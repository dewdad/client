<template>
    <div class="page-main">
        <page-header>
            报警历史
            <div slot="right">
                <el-radio-group value="1d" v-model="radioTime" @change="dataChangeType" size="small">
                    <el-radio-button border  label="1d">1小时</el-radio-button>
                    <el-radio-button border label="7d">2小时</el-radio-button>
                    <el-radio-button border  label="30d">4小时</el-radio-button>
                    <el-radio-button border  label="30d">6小时</el-radio-button>
                    <el-radio-button border  label="30d">12小时</el-radio-button>
                    <el-radio-button border  label="30d">1天</el-radio-button>
                    <el-radio-button border  label="30d">3天</el-radio-button>
                    <el-radio-button border  label="30d">7天</el-radio-button>
                </el-radio-group>
                选择日期： <el-date-picker
      v-model="value6"
      type="daterange"
      size="small"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getSnapshotList" :paging="searchObj.paging">
                <el-table-column min-width="120" prop="name" label="产品类型">
                </el-table-column>
                <el-table-column prop="id" label="故障资源">
                </el-table-column>
                <el-table-column prop="volumeName" label="发生时间">
                </el-table-column>
                <el-table-column prop="volumeName" label="持续时间">
                </el-table-column>
                <el-table-column prop="volumeName" label="规则名称">
                </el-table-column>
                <el-table-column prop="volumeName" label="通知方式">
                </el-table-column>
                <el-table-column prop="volumeName" label="状态">
                </el-table-column>
                <el-table-column prop="volumeName" label="通知对象">
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="报警回调" key="op" width="150" class-name="option-column">
                    <template slot-scope="scope">
                        <span @click="editSnap(scope.row)" class="btn-linker">创建磁盘</span>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteSnap(scope.row)" class="btn-linker">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <delete-dialog ref="DeleteDailog" />
        <create-contact ref="CreateContact" />
    </div>
</template>
<script>
import {getSnapshotList, deleteSnapshots} from '@/service/ecs/snapshot.js';
import CreateContact from './components/CreateContact';
export default {
    data() {
        let fields = [{field: 'name', label: '规则名称', inputval: '', tagType: 'INPUT'}, {field: 'mobiel', label: '资源名称', inputval: '', tagType: 'INPUT'}];
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
            },
            radioTime: '1d'
        };
    },
    components: {
        CreateContact
    },
    mounted() {},
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
        },
        addContact() {
            this.$refs.CreateContact.show().then(() => {});
        }
    }
};
</script>

