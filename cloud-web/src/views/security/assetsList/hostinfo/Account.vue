<template>
<div class="mt10">
    <!-- 搜素栏 -->
    <div class="search-box">
        <!-- 搜索： -->
        <zt-form :inline="true" size="small" class="search-form-inline" label-width="95px">
            <zt-form-item label="搜索：">
                <el-input placeholder="账号名" v-model="userIpt"></el-input>
            </zt-form-item>
            <zt-form-item>
                <!-- 查询按钮 -->
                <el-button type="primary" @click="search" icon="el-icon-search">
                    {{$t('common.searchButtonText')}}
                </el-button>
            </zt-form-item>
            <zt-form-item class="pull-right">
                数据最后获取时间：{{date | date}} <a class="font12" @click="search">  重新获取</a>
            </zt-form-item>

        </zt-form>
        <!-- ROOT权限： -->
        <zt-form :inline="true" size="small" class="search-form-inline" label-width="95px">
            <zt-form-item label="ROOT权限：">
                <el-radio-group v-model="isRoot">
                    <el-radio border label="0">全部</el-radio>
                    <el-radio border :label="item.value" v-for="item in rootList" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </zt-form-item>
        </zt-form>
    </div>
    <!-- 表格 -->
    <el-table
        v-loading="isLoading"
        :data="tableData"
        class="data-list mt10"
        row-class-name="data-list"
        header-row-class-name="data-list"
        size="small"
        stripe
        border
    >
        <el-table-column prop="user_name" label="账号名" >
        </el-table-column>
        <el-table-column label="root权限">
            <template slot-scope="scope">
                {{scope.row.is_root === '0' ? '否' : '是'}}
            </template>
        </el-table-column>
        <el-table-column prop="user_group" label="用户组" :min-width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="到期时间">
            <template slot-scope="scope">
                {{scope.row.exp_time === 'never' ? '永不过期' : scope.row.exp_time}}
            </template>
        </el-table-column>
        <el-table-column prop="last_login_date" label="上次登录时间" :min-width="180">
        </el-table-column>
        <el-table-column prop="last_login_ip" label="上次登录IP">
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
        <el-pagination
            v-if="total"
            @size-change="sizeChange"
            @current-change="fetchHostInfoList"
            :current-page.sync="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            layout="sizes, prev, pager, next"
            :total="total"
        >
        </el-pagination>
    </div>
</div>
</template>
<script>
import LabelDropdown from '@/components/label/LabelDropdown';
import {hostInfoList} from '@/service/security';

import {ROOT_LIST} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            date: '',
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            method: 'account',
            isRoot: '',
            userIpt: '',
            rootList: ROOT_LIST,
            searchObjExtra: {
                selField: {}
            },
            assetsListData: []
        };
    },
    computed: {
        tableData() {
            return this.assetsListData
                ? this.assetsListData.list_data || []
                : [];
        },
        serverId() {
            return this.$route.params.serverID;
        }
    },
    watch: {
        isRoot() {
            this.search();
        }
    },
    methods: {
        search() {
            this.pageIndex = 1;
            this.fetchHostInfoList();
        },
        async fetchHostInfoList() {
            try {
                // 清空数据
                this.isLoading = true;
                let params = {
                    serverId: this.serverId,
                    method: this.method,
                    limit: this.limit,
                    is_root: this.isRoot,
                    user_name: this.userIpt,
                    pageIndex: this.pageIndex
                };

                let ret = await hostInfoList(params);
                console.log('fetchHostInfoList', ret);

                this.assetsListData = ret;
                this.date = new Date().getTime();

                if (!ret.page_info) throw new Error('分页数据异常');
                this.pageIndex = ret.page_info.cur_page;
                this.total = ret.page_info.count_sum;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchHostInfoList', error.message);
            }
        },
        sizeChange(val) {
            this.limit = val;
            this.fetchHostInfoList();
        },
        getProprotectWwitch(value) {
            let item = this.filters.protect_switch.find(e => e.value === value);
            return item ? item.text : '保护中';
        }
    },
    mounted() {
        this.fetchHostInfoList();
    },
    components: {
        LabelDropdown
    }
};
</script>

