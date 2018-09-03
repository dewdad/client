<template>
<div class="page-main">
    <!-- 搜素栏 -->
    <page-header class="mb10">专有网络
        <region-radio slot="content" v-model="region"></region-radio>
        <div slot="content"  class="pull-right">
            <el-button type="primary" size="small" class="mr10" @click="create">
                创建专有网络
            </el-button>
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-refresh_people"></i>
            </el-button>
        </div>
    </page-header>
    <!-- 表格 -->
    <el-table
        v-loading="isLoading"
        :data="tableData"
        class="data-list mt20"
        row-class-name="data-list"
        header-row-class-name="data-list"
        size="small"
        stripe
        border
    >
        <el-table-column prop="title" label="VPCID/名称">
            <template slot-scope="scope">
                <div>
                    <router-link :to="{name: 'app.vpc.pn-detail', params: {id: scope.row.id}}">
                        <span class="font12">{{scope.row.id}}</span>
                    </router-link>
                </div>
                <div>{{scope.row.name}}</div>
            </template>
        </el-table-column>
        <el-table-column label="所在区域">
            <template slot-scope="scope">
                {{scope.row.zone | zone}}
            </template>
        </el-table-column>
        <el-table-column label="子网数量" :min-width="50">
            <template slot-scope="scope">
                <router-link :to="{name: 'app.vpc.pn-subnet', params: {id: scope.row.id}}">
                    <el-tag>{{scope.row.countSubnet}}</el-tag>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column label="默认网络"  :min-width="50">
            <template slot-scope="scope">
                {{scope.row.isProper === '0' ? '是' : '否'}}
            </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述" :min-width="70">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" :min-width="90">
        </el-table-column>
        <el-table-column prop="name" label="操作" :min-width="90">
            <template slot-scope="scope" >
                <router-link :to="{name: 'app.vpc.pn-subnet', params: {id: scope.row.id}}">管理子网</router-link> | 
                <a @click="updateNetwork(scope.row)">编辑</a> | 
                <a @click="deleteNetwork(scope.row)">删除</a>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
        <el-pagination
            v-if="total"
            @size-change="sizeChange"
            @current-change="fetchData"
            :current-page.sync="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            layout="sizes, prev, pager, next"
            :total="total"
        >
        </el-pagination>
    </div>
    <create ref="create"></create>
</div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import Create from './Create';
// import {get} from '@/utils/utils';
import {queryNetwork, deleteNetwork} from '@/service/ecs/network.js';

export default {
    data() {
        return {
            region: '',
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            listData: {}
        };
    },
    computed: {
        tableData() {
            return this.listData ? this.listData.records || [] : [];
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
        sizeChange(val) {
            this.pageIndex = 1;
            this.limit = val;
            this.fetchData();
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
                    zone: this.region,
                    limit: this.limit,
                    pageIndex: this.pageIndex
                };

                let ret = await queryNetwork(params);
                console.log('fetchData', ret);

                this.listData = ret;
                this.date = new Date().getTime();

                this.pageIndex = parseInt(ret.pages);
                this.total = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        }
    },
    components: {
        RegionRadio,
        Create
    }
};
</script>
