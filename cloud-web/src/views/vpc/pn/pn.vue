<template>
    <div class="page-main">
        <page-header>
            专有网络列表
            <div slot="content" class="pull-right">
                <el-button type="primary" size="small" @click="create">
                    创建专有网络
                </el-button>
                <el-button type="info" size="small" @click="fetchData">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body">
            <!-- 表格 -->
            <zt-table :loading="isLoading" :data="tableData" @search="getVpcList" :paging="searchObj.paging">
                <el-table-column prop="title" label="VPCID/名称" min-width="300px">
                    <template slot-scope="scope">
                        <div>
                                <span class="font12">{{scope.row.id}}</span>
                        </div>
                        <div>{{scope.row.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <zt-status :status="ECS_STATUS" :value="scope.row.status.toLowerCase()"></zt-status>
                    </template>
                </el-table-column>
                <el-table-column label="外部网络">
                    <template slot-scope="scope">
                        <span>{{scope.row.networkName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="管理状态">
                    <template slot-scope="scope">
                        <span class="color-success" v-if="scope.row.adminStateUp">UP</span>
                        <span class="color-danger" v-else>DOWN</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" :min-width="90" class-name="option-column">
                    <template slot-scope="scope">
                         <router-link :to="{name: 'app.vpc.pn-subnet', params: {id: scope.row.id, name: scope.row.name } }">管理子网</router-link>
                <b class="link-division-symbol"></b> 
                        <a @click="updateNetwork(scope.row)" :disabled="scope.row['router:external'] || scope.row.shared">编辑</a>
                        <b class="link-division-symbol"></b>
                        <a @click="deleteNetwork(scope.row)" :disabled="scope.row['router:external'] || scope.row.shared">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <!-- 创建专有网络弹窗 -->
        <create ref="create"></create>
    </div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import Create from './Create';
import {ECS_STATUS} from '@/constants/dicts/ecs.js';
import {queryNetwork, deleteNetwork} from '@/service/v2.1/network.js';

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
            region: '',
            isLoading: false,
            searchObj,
            ECS_STATUS,
            listData: {}
        };
    },
    computed: {
        tableData() {
            return this.listData ? this.listData.data || [] : [];
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        create() {
            let create = this.$refs.create;
            if (create) {
                create
                    .show({
                        type: 'create'
                    })
                    .then(ret => {
                        if (ret) {
                            this.fetchData();
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }
                    });
            }
        },
        updateNetwork(data) {
            let create = this.$refs.create;
            if (create) {
                create
                    .show({
                        type: 'update',
                        ...data
                    })
                    .then(ret => {
                        if (ret) {
                            this.fetchData();
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }
                    });
            }
        },
        deleteNetwork(row) {
            $log('删除数据', row);
            this.$confirm(`您确定要删除专有网络：${row.name} 吗？`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'danger'
            })
                .then(() => {
                    return deleteNetwork({
                        vpcId: row.id
                    });
                })
                .then(ret => {
                    $log('deleteNetwork ret <-', ret);
                    if (ret) {
                        this.fetchData();
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    }
                })
                .catch(error => {
                    // 取消
                    $log('deleteNetwork', error.message);
                });
        },
        async fetchData() {
            try {
                // 清空数据
                this.isLoading = true;
                let params = {
                    ...this.searchObj.paging
                };

                let ret = await queryNetwork(params);
                console.warn('fetchData', ret);

                this.listData = ret;
                this.date = new Date().getTime();

                this.pageIndex = parseInt(ret.pageIndex);
                this.searchObj.paging.totalItems = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        },
        // 抛出函数
        getVpcList(params) {
            this.searchObj.paging.pageIndex = params.pageIndex;
            this.fetchData();
        }
    },
    components: {
        RegionRadio,
        Create
    }
};
</script>
