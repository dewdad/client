<template>
    <el-dialog v-if="isShow" width="1200px" title="安全组配置" :visible="true" :close-on-click-modal="false" @close="cancel">
        <el-row :gutter="30" v-loading="isSubmit">
            <el-col :span="12">
                <div>
                    <b class="leftBlueBox"></b>
                    <span class="ml10">所有安全组</span>
                </div>
                <search-box class="mt10" :fields="searchObjExtra.fields" @select="searchL"></search-box>
                <el-table v-loading="loadingL" class="data-list" :data="tableData" highlight-current-row style="width: 100%;">
                    <el-table-column prop="id" min-width="200" label="安全组ID/名称 ">
                        <template slot-scope="scope">
                            {{scope.row.id}} <br>{{scope.row.name}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="countInstance" label="实例数(台)">
                        <template slot-scope="scope">
                            {{scope.row.countInstance || 0}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="flavor_type" label="规则">
                        <template slot-scope="scope">
                            <router-link class="btn-linker" target="_blank" :to="{name:'app.ecs.groupRule.safegrpRule', params: {ruleId:scope.row.id}}">查看规则</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="选择" width="120" class-name="option-column">
                        <template slot-scope="scope">
                            <a @click="confirm(scope.row.id)" :disabled="checkDisabled(scope.row.id)">选择</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background :current-page="searchObj.paging.pageIndex" @current-change="handleCurrentChange" :page-size="searchObj.paging.limit" layout="total, prev, pager, next" :total="searchObj.paging.totalItems">
                    </el-pagination>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <b class="leftBlueBox"></b>
                    <span class="ml10">已选择安全组</span>
                </div>
                <search-box class="mt10" :fields="searchObjExtra.fields" @select="searchR"></search-box>
                <el-table v-loading="loadingR" class="data-list" :data="currentGroupList" highlight-current-row style="width: 100%;">
                    <el-table-column prop="id" min-width="200" label="安全组ID/名称 ">
                        <template slot-scope="scope">
                            {{scope.row.id}} <br>{{scope.row.name}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="countInstance" label="实例数(台)">
                        <template slot-scope="scope">
                            {{scope.row.countInstance || 0}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="flavor_type" label="规则">
                        <template slot-scope="scope">
                            <router-link class="btn-linker" target="_blank" :to="{name:'app.ecs.groupRule.safegrpRule', params: {ruleId:scope.row.id}}">查看规则</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="删除" width="120" class-name="option-column">
                        <template slot-scope="scope">
                            <a v-if="tableDataR.length > 1" @click="deleteSafeGroup(scope.row.id)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="info" @click="cancel" size="small">关闭</el-button>
            <!-- <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">选择</el-button> -->
        </div>
    </el-dialog>
</template>
<script>
import {getSecurityGroupList, addGroupForInstance, listGroupByInstance, delGroupForInstance} from '@/service/ecs/security';
import SearchBox from '@/components/search/SearchBox';
export default {
    data() {
        return {
            loadingL: false,
            loadingR: false,
            isShow: false,
            isSubmit: false,
            reject: null,
            resolve: null,
            tableData: [],
            tableDataR: [],
            currentGroupList: [],
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
                    limit: 5,
                    totalItems: 0
                }
            },
            rowItem: ''
        };
    },
    components: {
        SearchBox
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                this.tableData = [];
                this.tableDataR = [];
                this.currentGroupList = [];
                this.isSubmit = false;
            }
        }
    },
    created() {},
    methods: {
        show(rowItem) {
            this.isShow = true;
            this.rowItem = rowItem;
            this.listGroupByInstance();
            this.getSecurityGroupList();
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
        confirm(id) {
            let findId = this.tableDataR.find(item => {
                return item.id === id;
            });
            if (findId !== undefined) {
                this.$alert('请不要重复选择安全组', '提示', {
                    type: 'warning'
                });
                return;
            }
            this.isSubmit = true;
            addGroupForInstance(this.rowItem.id, id)
                .then(res => {
                    this.$message.success('操作成功');
                    this.listGroupByInstance();
                })
                .finally(() => {
                    this.isSubmit = false;
                });
        },
        checkDisabled(id) {
            let find = this.currentGroupList.find(item => {
                return item.id === id;
            });
            return find === undefined ? false : true;
        },
        handleCurrentChange(value) {
            this.searchObj.paging.pageIndex = value;
            this.getSecurityGroupList();
        },
        getSecurityGroupList() {
            this.loadingL = true;
            let data = {
                pageIndex: this.searchObj.paging.pageIndex,
                limit: this.searchObj.paging.limit,
                name: this.searchObj.name,
                id: this.searchObj.id
            };
            getSecurityGroupList(data)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.tableData = res.data.data;
                        this.searchObj.paging.totalItems = res.data.total;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loadingL = false;
                });
        },
        // 查询本实例安全组
        listGroupByInstance() {
            this.loadingR = true;
            listGroupByInstance(this.rowItem.id)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let data = Array.isArray(res.data) ? res.data : [];
                        this.tableDataR = data;
                        this.currentGroupList = data;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loadingR = false;
                });
        },
        deleteSafeGroup(id) {
            this.isSubmit = true;
            delGroupForInstance(this.rowItem.id, id)
                .then(res => {
                    this.$message.success('操作成功');
                    this.listGroupByInstance();
                })
                .finally(() => {
                    this.isSubmit = false;
                });
        },
        searchL(params) {
            $log(params);
            (this.searchObj.name = ''), (this.searchObj.id = ''), (this.searchObj[params.selValue.field] = params.selInputValue);
            this.searchObj.paging.pageIndex = 1;
            this.getSecurityGroupList();
        },
        searchR(params) {
            this.currentGroupList = this.tableDataR.filter(item => {
                return item[params.selValue.field] === params.selInputValue || params.selInputValue === '';
            });
        }
    }
};
</script>
<style scoped>
</style>
