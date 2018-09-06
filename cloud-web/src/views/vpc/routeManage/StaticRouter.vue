<template>
<div class="page-main">
    <!-- 搜素栏 -->
    <page-header class="mb10">
        <div slot="content"  class="pull-right">
            <el-button type="primary" size="small" @click="addStaticRouterFn">
                添加静态路由
            </el-button>
            <el-button type="info" size="small">
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
        <el-table-column prop="title" label="目的CIDR" width="280">
            <template slot-scope="scope">
                <div>{{scope.row.name}}</div>
            </template>
        </el-table-column>
        <el-table-column label="下一跳">
            <template slot-scope="scope">
                <zt-status :status="ECS_STATUS" :value="scope.row.status" ></zt-status>
            </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="90" class-name="option-column">
            <template slot-scope="scope" >
                <a>编辑</a>
                <b class="link-division-symbol"></b>
                <a>删除</a>
            </template>
        </el-table-column>
    </zt-table>

    <!-- 添加静态路由 -->
    <add-static-router ref="AddStaticRouter"></add-static-router>
</div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import AddStaticRouter from './dialog/AddStaticRouter';
import {ECS_STATUS} from '@/constants/dicts/ecs.js';
// import {queryNetwork, deleteNetwork} from '@/service/ecs/network.js';

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
    },
    methods: {
        addStaticRouterFn() {
            let AddStaticRouter = this.$refs.AddStaticRouter;
            if (AddStaticRouter) {
                AddStaticRouter.show({
                    type: 'create'
                }).then(ret => {
                    if (ret) {
                        this.fetchData();
                    }
                });
            }
        },
        // 抛出函数
        getVpcList(params) {
            $log(params);
        }
    },
    components: {
        RegionRadio,
        AddStaticRouter
    }
};
</script>
