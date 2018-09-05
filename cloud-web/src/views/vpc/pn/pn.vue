<template>
<div class="page-main">
    <!-- 搜素栏 -->
    <page-header class="mb10">
        <div slot="content"  class="pull-right">
            <el-button type="primary" size="small" @click="create">
                创建专有网络
            </el-button>
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-refresh_people"></i>
            </el-button>
        </div>
    </page-header>
    <!-- 表格 -->
    <zt-table
        :loading="isLoading"
        :data="tableData"
        @search="getVpcList" 
        :paging="searchObj.paging">
        <el-table-column prop="title" label="VPCID/名称" :min-width="180">
            <template slot-scope="scope">
                <div>
                    <router-link :to="{name: 'app.vpc.pn-detail', params: {id: scope.row.id}}">
                        <span class="font12">{{scope.row.id}}</span>
                    </router-link>
                </div>
                <div>{{scope.row.name}}</div>
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <zt-status :status="ECS_STATUS" :value="scope.row.status" ></zt-status>
            </template>
        </el-table-column>
        <el-table-column label="是否共享" width="100">
            <template slot-scope="scope">
                {{scope.row.shared ? '是' : '否' }}
            </template>
        </el-table-column>
        <el-table-column label="外部网络" width="100">
            <template slot-scope="scope">
                {{scope.row['router:external'] ? '是' : '否'}}
            </template>
        </el-table-column>
        <el-table-column label="子网数量" width="100">
            <template slot-scope="scope">
                <!-- <router-link :to="{name: 'app.vpc.pn-subnet', params: {id: scope.row.id}}"> -->
                    <el-tag>{{scope.row.subnets.length}}</el-tag>
                <!-- </router-link> -->
            </template>
        </el-table-column>
        <el-table-column label="管理状态"  width="100">
            <template slot-scope="scope">
                {{scope.row.admin_state_up ? 'UP' : 'DOWN'}}
            </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="90">
            <template slot-scope="scope" >
                <router-link :to="{name: 'app.vpc.pn-subnet', params: {id: scope.row.id, name: scope.row.name } }">管理子网</router-link>
                <b class="link-division-symbol"></b>
                <a @click="updateNetwork(scope.row)">编辑</a>
                <b class="link-division-symbol"></b>
                <a @click="deleteNetwork(scope.row)">删除</a>
            </template>
        </el-table-column>
    </zt-table>
    <!-- 创建专有网络弹窗 -->
    <create ref="create"></create>
</div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import Create from './Create';
import {ECS_STATUS} from '@/constants/dicts/ecs.js';
import {queryNetwork, deleteNetwork} from '@/service/ecs/network.js';

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
            pageIndex: 1,
            limit: 10,
            total: 0,
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
                create.show({
                    type: 'create'
                }).then(ret => {
                    if (ret) {
                        this.fetchData();
                    }
                });
            }
        },
        updateNetwork(data) {
            let create = this.$refs.create;
            if (create) {
                create.show({
                    type: 'update',
                    ...data
                }).then(ret => {
                    if (ret) {
                        this.fetchData();
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
                    }
                })
                .catch((error) => {
                    // 取消
                    $log('deleteNetwork', error.message);
                });
            
        },
        search() {
            this.pageIndex = 1;
            this.fetchData();
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

                this.pageIndex = parseInt(ret.pages);
                this.searchObj.paging.totalItems = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        },
        // 抛出函数
        getVpcList(params) {
            $log(params);
        }
    },
    components: {
        RegionRadio,
        Create
    }
};
</script>
