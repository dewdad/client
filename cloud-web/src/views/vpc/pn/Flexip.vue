<template>
<div class="page-main">
    <!-- 搜素栏 -->
    <page-header class="mb10">
        <div slot="content"  class="pull-right">
            <el-button type="primary" size="small" class="mr10">
                申请浮动IP
            </el-button>
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-refresh_people"></i>
            </el-button>
        </div>
    </page-header>
    <!-- 搜索栏 -->
    <search-box :searchObjExtra="searchObjExtra" @select="getScreenVal"></search-box>
    <!-- 表格 -->
    <el-table
        v-loading="isLoading"
        :data="tableData"
        class="data-list"
        row-class-name="data-list"
        header-row-class-name="data-list"
        size="small"
        stripe
        border
    >
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
        <el-table-column label="IP地址">
            <template slot-scope="scope">
                {{scope.row.status}}
            </template>
        </el-table-column>
        <el-table-column label="已映射固定IP地址">
            <template slot-scope="scope">
                {{scope.row.shared ? '是' : '否' }}
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                {{scope.row['router:external'] ? '是' : '否'}}
            </template>
        </el-table-column>
        <el-table-column label="绑定实例" :min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.subnets.length}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" :min-width="90">
            <template slot-scope="scope" >
                <router-link :to="{name: 'app.vpc.pn-subnet', params: {id: scope.row.id}}">绑定</router-link> | 
                <a>解绑</a> | 
                <a>释放</a>
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
import searchBox from '@/components/search/SearchBox';
import Create from './Create';
import {queryFlexIP} from '@/service/ecs/network.js';

let fields = [
    { field: 'id', label: '安全组ID',inputval:'', tagType: 'ID' },
    { field: 'name', label:'安全组名称',inputval:'', tagType: 'Name' }
];
        
let searchObjExtra = {
    frominfo: '',
    fields:fields,
    selField:fields[0]
};

export default {
    data() {
        return {
            region: '',
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            listData: {},
            fields,
            searchObjExtra
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
                    offset: 1,
                    limit: this.limit,
                    pageIndex: this.pageIndex
                };

                let ret = await queryFlexIP(params);
                console.warn('fetchData', ret);

                this.listData = ret;
                this.date = new Date().getTime();

                this.pageIndex = parseInt(ret.pages);
                this.total = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        },
        // 
        getScreenVal(params) {
            $log(params);
        }
    },
    components: {
        RegionRadio,
        Create,
        searchBox
    }
};
</script>
