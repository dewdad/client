<template>
<div class="mt10">
    <!-- 搜素栏 -->
    <div class="search-box">
        <!-- 搜索： -->
        <zt-form :inline="true" size="small" class="search-form-inline">
            <zt-form-item label="搜索：">
                <el-input placeholder="软件名" v-model="ipt1"></el-input>
            </zt-form-item>
            <zt-form-item>
                <el-input placeholder="软件版本" v-model="ipt2" :autofocus="true"></el-input>
            </zt-form-item>
            <zt-form-item>
                <el-input placeholder="软件安装目录" v-model="ipt3" :autofocus="true"></el-input>
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
        <el-table-column prop="software_name" label="软件名" >
        </el-table-column>
        <el-table-column prop="software_version" label="软件版本">
        </el-table-column>
        <el-table-column prop="software_last_update_date" label="软件最后更新时间">
        </el-table-column>
        <el-table-column prop="software_install_dir" label="软件安装目录">
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
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            method: 'web',
            ipt1: '',
            ipt2: '',
            ipt3: '',
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
                    software_name: this.ipt1,
                    software_version: this.ipt2,
                    software_install_dir: this.ipt3,
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

