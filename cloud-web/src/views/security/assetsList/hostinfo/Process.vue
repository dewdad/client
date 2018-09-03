<template>
<div class="mt10">
    <!-- 搜素栏 -->
    <div class="search-box">
        <!-- 搜索： -->
        <zt-form :inline="true" size="small" class="search-form-inline">
            <zt-form-item label="搜索：">
                <el-input placeholder="进程名" v-model="processIpt" :autofocus="true"></el-input>
            </zt-form-item>
            <zt-form-item>
                <el-input placeholder="运行用户" v-model="userIpt"></el-input>
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
        <el-table-column prop="process_name" label="进程名称" :min-width="70">
        </el-table-column>
        <el-table-column label="进程路径" :min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
                <span class="text-nowrap">{{scope.row.process_path}}</span>
            </template>
        </el-table-column>
        <el-table-column label="必要性"  :min-width="40">
            <template slot-scope="scope">
                {{scope.row.is_must === '0' ? '非必要' : '必要'}}
            </template>
        </el-table-column>
        <el-table-column prop="start_parm" label="启动参数"  :min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cdate" label="启动时间" :min-width="90">
        </el-table-column>
        <el-table-column prop="run_user" label="运行用户" :min-width="50">
        </el-table-column>
        <el-table-column prop="run_permission" label="运行权限" :min-width="50">
        </el-table-column>
        <el-table-column prop="pid" label="PID" :min-width="43">
        </el-table-column>
        <el-table-column prop="parent_process" label="父进程" :min-width="40">
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


export default {
    data() {
        return {
            date: '',
            processIpt: '',
            userIpt: '',
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            method: 'process',
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
                    process_name: this.processIpt,
                    run_user: this.userIpt,
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

