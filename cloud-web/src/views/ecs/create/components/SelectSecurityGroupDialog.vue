<template>
    <el-dialog v-if="isShow" width="878px" title="选择安全组" :visible="true" :close-on-click-modal="false" @close="cancel">
        <div>
            <search-box :fields="searchObjExtra.fields" @select="search"></search-box>
            <el-table :loading="loading" max-height="240" class="data-list" :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%;" @row-dblclick="confirm">
                <el-table-column prop="id" label="" width="50" class-name=" ">
                    <template slot-scope="scope">
                        <el-radio v-model="currentGroup" :label="scope.row"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="安全组名称ID ">
                </el-table-column>
                <el-table-column prop="name" label="安全组名称">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间">
                </el-table-column>
                <el-table-column prop="countInstance" label="实例数(台)">
                    <template slot-scope="scope">
                        {{scope.row.countInstance || 0}}
                    </template>
                </el-table-column>
                <el-table-column prop="flavor_type" label="规则" width="120" class-name="option-column">
                    <template slot-scope="scope">
                        <router-link class="btn-linker" target="_blank" :to="{name:'app.ecs.groupRule.safegrpRule', params: {ruleId:scope.row.id}}">查看规则</router-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background :current-page="searchObj.paging.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.paging.limit" layout="sizes, prev, pager, next" :total="searchObj.paging.totalItems">
                </el-pagination>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="info" @click="cancel" size="small">取消</el-button>
            <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">选择</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {getSecurityGroupList} from '@/service/ecs/security';
import SearchBox from '@/components/search/SearchBox';
export default {
    name: 'SelectSecurityGroupDialog',
    data() {
        return {
            loading: false,
            isShow: false,
            isSubmit: false,
            reject: null,
            resolve: null,
            tableData: [],
            currentGroup: null,
            searchObjExtra: {
                fields: [
                    {
                        field: 'name',
                        label: '安全组名称'
                    },
                    {
                        field: 'id',
                        label: '安全组ID'
                    }
                ]
            },
            searchObj: {
                name: '',
                id: '',
                //分页
                paging: {
                    pageIndex: 1,
                    limit: 10,
                    totalItems: 0
                }
            }
        };
    },
    components: {
        SearchBox
    },
    created() {
        this.getSecurityGroupList();
    },
    methods: {
        show() {
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            this.isShow = false;
        },
        cancel() {
            this.close();
        },
        confirm() {
            if (this.currentGroup === null) {
                this.$alert('请选择安全组', '提示', {
                    type: 'error'
                });
            } else {
                this.resolve(this.currentGroup);
                this.close();
            }
        },
        handleCurrentChange(value) {
            this.currentGroup = value;
        },
        getSecurityGroupList() {
            this.loading = true;
            let data = {
                pageIndex: this.searchObj.paging.pageIndex,
                limit: this.searchObj.paging.limit,
                name: this.searchObj.name,
                id: this.searchObj.id
            };
            getSecurityGroupList(data)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.tableData = res.result.records;
                        this.searchObj.paging.totalItems = res.result.total;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    // this.loading = false;
                });
        },
        search(params) {
            $log(params);
            this.searchObj.name = '',
            this.searchObj.id = '',
            this.searchObj[params.selValue.field] = params.selInputValue;
            this.searchObj.paging.pageIndex = 1;
            this.getSecurityGroupList();
        }
    }
};
</script>
<style scoped>
</style>
