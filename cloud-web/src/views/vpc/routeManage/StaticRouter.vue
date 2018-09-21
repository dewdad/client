<template>
<div class="page-main">
    <!-- 搜素栏 -->
    <page-header class="mb10">
        静态路由
        <div slot="content"  class="pull-right">
            <el-button type="primary" size="small" @click="addStaticRouterFn">
                添加静态路由
            </el-button>
            <el-button type="info" size="small" @click="getRouterListFn">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <!-- 表格 -->
    <zt-table
        :loading="isLoading"
        :data="routerList"
        @search="getVpcList"
        :isPaging="false">
        <el-table-column prop="destination" label="目的CIDR" width="280">
            <template slot-scope="scope">
                <div>{{scope.row.destination}}</div>
            </template>
        </el-table-column>
        <el-table-column label="下一跳">
            <template slot-scope="scope">
                <div>{{scope.row.nexthop}}</div>
            </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="90" class-name="option-column">
            <template slot-scope="scope" >
                <a style="padding-right: 0;" @click="removeRoute(scope.row)">删除</a>
            </template>
        </el-table-column>
    </zt-table>

    <!-- 添加静态路由 -->
    <add-static-router ref="AddStaticRouter"></add-static-router>
    <delete-dialog ref="DeleteDailog" />
</div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import AddStaticRouter from './dialog/AddStaticRouter';
import {ECS_STATUS} from '@/constants/dicts/ecs.js';
import { getRouterInfo, addStaticRouter} from '@/service/ecs/network.js';
import DeleteDailog from '@/components/dialog/DeleteDailog';
import {cloneDeep} from '@/utils/utils';
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
            routerList: [],
            ECS_STATUS,
            listData: {},
            routerInfo: '',
        };
    },
    computed: {
        tableData() {
            return this.listData ? this.listData.data || [] : [];
        },
        selRoute() {
            return this.routerList.filter(
                item => item.id === this.$route.params.id
            );
        }
    },
    created() {
        this.getRouterListFn();
    },
    methods: {
        addStaticRouterFn() {
            let AddStaticRouter = this.$refs.AddStaticRouter;
            if (AddStaticRouter) {
                AddStaticRouter.show({
                    type: 'create',
                    route: this.routerInfo
                }).then(ret => {
                    if (ret) {
                        this.getRouterListFn();
                    }
                });
            }
        },
        // 获得所有路由列表
        getRouterListFn() {
            this.isLoading = true;
            getRouterInfo(this.$route.params.id)
                .then(res => {
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let dataList = res.data || [];
                        this.routerInfo = res.data;
                        this.routerList = dataList && dataList.routes;
                        $log('getRouterList ->', dataList);
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                }).finally(() => {
                    this.isLoading = false;
                });
        },
        // 抛出函数
        getVpcList(params) {
            $log(params);
        },
        removeRoute(row, index) {
            // deleteRouter
            this.$refs.DeleteDailog.show('静态路由', row.destination, () => {
                let routerList = cloneDeep(this.routerList);
                let data = {
                    id: this.routerInfo.id,
                    name: this.routerInfo.name,
                    adminStateUp: this.routerInfo.admin_state_up,
                    networkId: this.routerInfo.external_gateway_info.network_id,
                    routes: routerList.splice(index, 1)
                };
                return addStaticRouter(data);
            }).then(res => {
                this.$message.success('操作成功');
                this.getRouterListFn();
            }).catch(err => {
                $log(err);
            });
        }
    },
    components: {
        RegionRadio,
        AddStaticRouter,
        DeleteDailog
    }
};
</script>
