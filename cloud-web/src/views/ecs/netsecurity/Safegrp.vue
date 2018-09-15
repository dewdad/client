<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            安全组列表
            <div slot="right">
                <el-button @click="modifySafeGrp({id: '', name: '', description: ''})" type="primary" size="small">创建安全组</el-button>
                <el-button type="info" size="small" @click="getGroupListFn">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 主体 -->
        <div class="page-body">
            <!-- 列表 -->
            <zt-table :loading="loading" :cell-mouse-enter="showEditName" :data="tableData" :search="true" :search-condition="fields" @search="getGroupListFn" :paging="searchObj.paging">
                <!-- 实例名称 -->
                <el-table-column min-width="180" prop="name" label="安全组ID/名称">
                    <template slot-scope="scope">
                        <ul>
                            <li>
                                <span class="font12 mr10">{{scope.row.id}}</span>
                            </li>
                            <li>
                                <span class="font12 mr10">{{scope.row.name}}</span>
                                <i class="amendInfo finger-cursor iconfont icon-edit_people" v-if="scope.row.id === showId" @click="editname(scope.row)"></i>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <!-- 描述 -->
                <el-table-column prop="description" label="描述">
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" width="250" class-name="option-column">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <span @click="modifySafeGrp(scope.row)" class="btn-linker">修改</span>
                        <b class="link-division-symbol"></b>
                        <!-- 配置规则 -->
                        <router-link class="btn-linker" :to="{name:'app.ecs.groupRule.safegrpRule', params: {ruleId:scope.row.id}}">配置规则</router-link>
                        <!-- <span class="color-primary finger-cursor">配置规则</span> -->
                        <b class="link-division-symbol"></b>
                        <!-- 删除 -->
                        <a @click="deleteSafeGrp(scope.row)" class="btn-linker">删除</a>

                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <edit-name ref="EditName" />
        <!-- 对话框 修改 -->
        <modify-safe-group ref="ModifySafeGroup" />
        <delete-dialog ref="DeleteDailog" />
    </div>
</template>
<script>
import ModifySafeGroup from './dialog/ModifySafeGroup';
import EditName from './dialog/EditName';
import {getSecurityGroupList, deleteGroup} from '@/service/ecs/security.js';

let fields = [{field: 'id', label: '安全组ID', inputval: '', tagType: 'ID'}, {field: 'name', label: '安全组名称', inputval: '', tagType: 'Name'}];

let cols = [
    {column: 'name', text: '安全组ID/名称', width: '20%'},
    {column: 'countInstance', text: '相关实例', width: '4%'},
    {column: 'createDate', text: '创建时间', width: '10%'},
    {column: 'remark', text: '描述', width: '10%'}
];
let searchObj = {
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    }
};
export default {
    data() {
        return {
            loading: false,
            fields,
            tableData: [],
            cols,
            showId: '',
            region: '',
            searchObj,
            searchVal: '',
            searchId: ''
        };
    },
    components: {
        ModifySafeGroup,
        EditName
    },
    methods: {
        getScreenVal(params) {
            console.log(params);
            if (params.selValue.tagType === 'ID') {
                this.searchId = params.selInputValue;
                this.searchVal = '';
            } else if (params.selValue.tagType === 'Name') {
                this.searchVal = params.selInputValue;
                this.searchId = '';
            }
            this.getGroupListFn();
        },
        /**
         * 进入单元格
         */
        showEditName(row, column, cell, event) {
            this.showId = row.id;
        },
        /**
         * 编辑安全组名称
         */
        editname(row) {
            this.$refs.EditName.show(row).then(res => {
                this.getGroupListFn();
            });
        },
        /**
         * 删除安全组弹窗确认
         */

        deleteSafeGrp(row) {
            this.$refs.DeleteDailog.show('安全组', row.name, () => {
                return deleteGroup(row.id);
            }).then(res => {
                this.$message.success('操作成功');
                this.getGroupListFn();
            });
        },
        // 修改安全组
        modifySafeGrp(rowItem) {
            console.log('modifySafeGrp:', rowItem);
            this.$refs.ModifySafeGroup.show(rowItem)
                .then(ret => {
                    this.getGroupListFn();
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        // 获得安全组列表
        getGroupListFn(params) {
            params = params || this.searchObj.paging;
            this.loading = true;
            getSecurityGroupList(params)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.log('getKeypairList', res);
                        let resData = res.data;
                        if (resData && resData.data) {
                            this.tableData = resData.data || [];
                            this.searchObj.paging.totalItems = resData.total || 0;
                            console.log('getKeypairList tableData', this.tableData);
                        }
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    mounted() {
        this.getGroupListFn();
    }
};
</script>
<style lang="scss" scoped>
</style>
