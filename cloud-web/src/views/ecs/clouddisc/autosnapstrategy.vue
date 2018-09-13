<template>
    <div class="page-main">
        <page-header>
            自动快照策略
            <div slot="right">
                <el-button type="primary" size="small" @click="AmendStrategy({},1)">创建策略</el-button>
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh" @click="getPolicy"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 列表 -->
            <zt-table :data="tableData" @search="getPolicy" :paging="searchObj.paging">
                <template v-for="col in cols">
                    <!-- 自动快照策略名称 -->
                    <template v-if="col.column=='nettype'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                {{scope.row.pname}}
                            </template>

                        </el-table-column>
                    </template>
                    <!-- 自动快照策略详情 -->
                    <template v-if="col.column=='isBoot'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <ul style="line-height:1.5;" class="left">
                                    <!-- ngIf: !item.toCpu -->
                                    <li class="">
                                        <span class="">创建时间： {{scope.row.execTime}}</span>
                                    </li>
                                    <li class="">
                                        <span class="">重复日期：{{scope.row.repeatDate|getWeekString }}</span>
                                    </li>
                                    <li class="">
                                        <span class="">保留时间：{{scope.row.saveDays=='-1' ? '不限' : (scope.row.saveDays+'天') }}</span>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 关联磁盘数 -->
                    <template v-if="col.column=='countDisk'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <el-tag>
                                    <router-link :to="{name:'app.ecs.clouddisc-list',params:{policyId:scope.row.pid} }">{{scope.row.countDisk}}</router-link>
                                </el-tag>
                            </template>
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template>
                    <el-table-column label="操作" key="op" width="250">
                        <template slot-scope="scope">
                            <!-- 修改策略 -->
                            <span @click="AmendStrategy(scope.row,2)" class="color-primary finger-cursor">修改策略</span>
                            <b class="link-division-symbol"></b>
                            <!-- 设置磁盘 -->
                            <span @click="setDisk(scope.row)" class="color-primary finger-cursor">设置磁盘</span>
                            <b class="link-division-symbol"></b>
                            <!-- 删除策略 -->
                            <span @click="deleteStrategy(scope.row)" class="color-primary finger-cursor">删除策略</span>
                        </template>
                    </el-table-column>
                </template>
            </zt-table>
        </div>

        <!-- 对话框 修改策略 -->
        <amend-strategy-dialog ref="AmendStrategyDialog" />
        <!-- 对话框 设置磁盘 -->
        <set-disk-dialog ref="SetDiskDialog" />
        <delete-dialog ref="DeleteDailog" />
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import AllTable from '@/components/table/allTable.vue';
import AmendStrategyDialog from './../inst/ecsDialog/AmendStrategyDialog';
import SetDiskDialog from './dialog/SetDiskDialog';

import {getPolicy, deletePolicy} from '@/service/ecs/policy.js';

let cols = [{column: 'nettype', text: '自动快照策略名称', width: '20%'}, {column: 'isBoot', text: '自动快照策略详情', width: '4%'}, {column: 'countDisk', text: '关联磁盘数', width: '10%'}];
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
            cols,
            tableData: [],
            searchObj
        };
    },
    filters: {
        getWeekString: function(string) {
            if (string === '') return '';
            let week = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
            let newString = [];
            let arr = string.split(',');
            for (const iterator of arr) {
                newString.push(week[iterator]);
            }
            return newString.join(',');
        }
    },
    created() {
        this.getPolicy();
    },
    methods: {
        //获取自动快照策略
        getPolicy(parpms) {
            parpms = parpms || this.searchObj.paging;
            getPolicy(parpms)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.log('getPolicy', res);
                        this.tableData = res.data.records || [];
                        this.searchObj.paging.totalItems = res.data.total || 0;
                    }
                })
                .catch(err => {
                    console.log('getPolicy err', err);
                });
        },

        /**
         * 创建、修改策略
         */
        AmendStrategy: function(rowItem, opType) {
            console.log('editLabel:', rowItem);
            this.$refs.AmendStrategyDialog.show(rowItem, opType)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.$message.success('操作成功');
                    this.getPolicy();
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        /**
         * 删除策略
         */

        deleteStrategy(row) {
            if (row && row.countDisk > 0) {
                this.$confirm('请先删除关联磁盘', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });

                return;
            } else {
                this.$refs.DeleteDailog.show('快照策略', row.pname, () => {
                    return deletePolicy(row.pid);
                }).then(res => {
                    this.$message.success('操作成功');
                    this.getPolicy();
                });
            }
        },
        /**
         * 设置磁盘
         */

        setDisk(rowItem) {
            console.log('setDisk:', rowItem);
            this.$refs.SetDiskDialog.show(rowItem)
                .then(ret => {
                    rowItem.countDisk = ret; //局部刷新数据
                    console.log('操作成功', ret);
                    this.$message.success('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        }
    },
    components: {
        PageHeader,
        LabelDropdown,
        AllTable,
        AmendStrategyDialog,
        SetDiskDialog
    }
};
</script>

<style scope lang="scss">
#table {
    font-size: 12px;
    .el-table .data-list th {
        line-height: 32px;
        height: 32px;
        border-top: 1px solid #c3c5c6;
        border-right: 0px solid transparent;
        background-color: #f5f6fb;
        color: #999;
        padding: 0px;
        font-size: 12px;
        font-weight: 500;
    }
    .el-table th .cell {
        border-right: 1px solid #e8e8e8;
        font-size: 12px;
    }
}
</style>
