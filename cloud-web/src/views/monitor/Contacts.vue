<template>
    <div class="page-main">
        <page-header>
            报警联系人管理
            <div slot="right">
                <el-button type="primary" @click="addContact" size="small">创建联系人</el-button>
                <el-button type="info" size="small" @click="getData(false)">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getData" :paging="searchObj.paging">
                <el-table-column min-width="120" prop="name" label="姓名">
                </el-table-column>
                <el-table-column min-width="180" prop="phone" label="手机号码">
                </el-table-column>
                <el-table-column min-width="180" prop="email" label="Email">
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" width="150" class-name="option-column">
                    <template slot-scope="scope">
                        <span @click="editNotice(scope.row)" class="btn-linker">修改</span>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteNotice(scope.row)" class="btn-linker">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <delete-dialog ref="DeleteDailog" />
        <create-contact ref="CreateContact" />
    </div>
</template>
<script>
import {alarmNoticeList, deleteNotice} from '@/service/monitor/alarmRule.js';
import CreateContact from './components/CreateContact';
export default {
    data() {
        let fields = [{field: 'name', label: '姓名', inputval: '', tagType: 'INPUT'},{field: 'mobiel', label: '手机号', inputval: '', tagType: 'INPUT'}];
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
        CreateContact
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData(params) {
            params = params || this.searchObj.paging;
            if (params !== false) this.loading = true;
            alarmNoticeList(params)
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
        editNotice(row) {
            this.$refs.CreateContact.show(1, row).then(() => {
                this.getData();
            });
        },
        deleteNotice(row) {
            this.$refs.DeleteDailog.show('报警联系人', row.name, () => {
                return deleteNotice(row.id);
            }).then(res => {
                this.$message.success('操作成功');
                this.getData();
            });
        },
        addContact() {
            this.$refs.CreateContact.show(0).then(() => {
                this.getData();
            });
        }
    }
};
</script>

