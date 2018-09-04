<template>
    <div class="page-main">
        <!-- 顶部 -->
        <page-header class="mb10">
            <div slot="content"  class="pull-right">
                <el-button type="primary" size="small" class="mr10">
                    添加路由
                </el-button>
                <el-button type="info" size="small">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 搜索栏 -->
        <search-box :searchObjExtra="searchObjExtra" @select="getScreenVal"></search-box>
        <!-- 表格 -->
        <div>
            <el-table
                :data="routerList"
                class="data-list"
                row-class-name="data-list"
                header-row-class-name="data-list"
                size="small"
                stripe
                border
            >
                <el-table-column label="路由名称" :min-width="180">
                    <template slot-scope="scope">
                        <div>{{scope.row.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <zt-status :status="ECS_STATUS" :value="scope.row.status" ></zt-status>
                    </template>
                </el-table-column>
                <el-table-column label="外部网络" :min-width="50">
                    <template slot-scope="scope">
                        <span>{{scope.row.networkName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="管理状态" :min-width="50">
                    <template slot-scope="scope">
                        <span>{{scope.row.adminStateUp}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" :min-width="90">
                    <template slot-scope="scope" >
                        <a>编辑路由</a>
                        <b class="link-division-symbol"></b>
                        <a>静态路由表</a>
                        <b class="link-division-symbol"></b>
                        <zt-dropdown>
                            <span class="el-dropdown-link font12">
                                更多<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                            <zt-dropdown-menu slot="dropdown">
                                <zt-dropdown-item>删除</zt-dropdown-item>
                                <zt-dropdown-item>清除网关</zt-dropdown-item>
                            </zt-dropdown-menu>
                        </zt-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import searchBox from '@/components/search/SearchBox';
import {getRouterList} from '@/service/ecs/network.js';
import {ECS_STATUS} from '@/constants/dicts/ecs.js';

let fields = [
    { field: 'name', label: '路由名称',inputval:'1', tagType: 'ID' },
    { field: 'status', label: '状态',inputval:'2', tagType: 'ID' },
    { field: 'adminStateUp', label: '管理状态',inputval:'3', tagType: 'ID' }
];
        
let searchObjExtra = {
    frominfo: '',
    fields:fields,
    selField:fields[0]
};
export default {
    data() {
        return {
            fields,
            searchObjExtra,
            ECS_STATUS,
            routerList: []
        };
    },
    components: {
        searchBox
    },
    methods: {
        getScreenVal(params) {
            $log(params);
        },
        getRouterListFn() {
            let params = {
                pageIndex: 1,
                limit: 10,
                offset: 1
            };
            getRouterList(params)
                .then(res => {
                    if (res && res.data) {
                        let data = res.data;
                        if (data.code && data.code === this.CODE.SUCCESS_CODE) {
                            let dataList = data.data || [];
                            this.routerList = dataList.data;
                            $log('getRouterList ->', dataList);
                        }
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                    self.loading = false;
                });
        }
        
    },
    created() {
        this.getRouterListFn();
    }
};
</script>