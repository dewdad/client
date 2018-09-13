<template>
<div class="page-main">
    <page-header title="资产列表">
        <div slot="right">
            <!-- 刷新按钮 -->
            <el-button type="info" size="small" @click="search">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <!-- 提示框 -->
    <el-alert :title="$t('security.assetslist.tips')" type="warning" :closable="false" class="mt10">
    </el-alert>
    <div class="page-body">
        <!-- 搜素栏 -->
        <div class="search-box">
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="">
                    <el-select clearable v-model="selestSearchOptionType" value-key="field" placeholder="请选择">
                        <el-option v-for="field in searchOptionType" :label="field.label" :value="field.value" :key="field.value"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="">
                    <el-input placeholder="关键字" v-model="inputval"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                    <label-dropdown @select="handleSearch"></label-dropdown>
                </zt-form-item>
            </zt-form>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" row-class-name="data-list" stripe header-row-class-name="data-list" border class="data-list">
            <el-table-column label="服务器IP" :min-width="110">
                <template slot-scope="scope">
                    <div class="text-nowrap"><router-link to="#" class="font12">{{scope.row.ip}}(内)</router-link></div>
                    <div class="text-nowrap" v-if="scope.row.wwwip"><router-link to="#" class="font12">{{scope.row.wwwip}}(公)</router-link></div>
                </template>
            </el-table-column>
            <el-table-column label="区域">
                <template slot-scope="scope">
                    北京1
                </template>
            </el-table-column>
            <el-table-column label="在线状态" :filters="filters.online" :min-width="90">
                <template slot-scope="scope">
                    <span :class="scope.row.online === '0' ? 'color-danger' : 'color-success'">{{scope.row.online === '0' ? '离线' : '在线'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="保护状态" :filters="filters.protect_switch" :min-width="90">
                <template slot-scope="scope">
                    <span :class="scope.row.protect_switch === '1' ? 'color-danger' : 'color-success'">{{getProprotectSwitch(scope.row.protect_switch)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="leak" label="漏洞" :min-width="50">
            </el-table-column>
            <el-table-column prop="baseline" label="基线" :min-width="50">
            </el-table-column>
            <el-table-column prop="abnlogin" label="异常登录" :min-width="70">
            </el-table-column>
            <el-table-column prop="abnlogin" label="主机木马" :min-width="70">
            </el-table-column>
            <el-table-column prop="abnlogin" label="主机异常" :min-width="70">
            </el-table-column>
            <el-table-column prop="process" label="进程数" :min-width="60">
            </el-table-column>
            <el-table-column prop="port" label="端口数" :min-width="60">
            </el-table-column>
            <el-table-column prop="name" label="操作" :min-width="70">
                <template slot-scope="scope">
                    <el-dropdown>
                        <span class="el-dropdown-link font12">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item disabled class="font12">一键安全检查</el-dropdown-item>
                            <el-dropdown-item disabled class="font12">暂停保护</el-dropdown-item>
                            <el-dropdown-item class="font12">安装Agent</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                @handleCurrentChange="handleCurrentChange"
                :current-page.sync="pagination.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination.limit"
                layout="sizes, prev, pager, next"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
    </div>
</div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import mockData from './mockData.json';

// 筛选条件
const filters = {
    online: [
        {
            text: '在线',
            value: 'online'
        },
        {
            text: '离线',
            value: 'offline'
        }
    ],
    protect_switch: [
        {
            text: '保护中',
            value: '0'
        },
        {
            text: '未安装Agent',
            value: '1'
        },
        {
            text: '暂停保护',
            value: '2'
        }
    ]
};

let searchOptionType = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '服务器IP',
        value: 'IP'
    }
];
export default {
    data() {
        return {
            inputval: '',
            selestSearchOptionType: '',
            searchOptionType,
            searchObjExtra: {
                selField: {}
            },
            filters: filters,
            assetsListData: mockData.assetsList
        };
    },
    computed: {
        tableData() {
            return this.assetsListData ? this.assetsListData.data || [] : [];
        },
        pagination() {
            return {
                pageIndex: parseInt(this.assetsListData.pageIndex),
                total: parseInt(this.assetsListData.total),
                limit: parseInt(this.assetsListData.limit)
            };
        }
    },
    methods: {
        handleSearch() {},
        handleCurrentChange() {},
        getProprotectSwitch(value) {
            let item = this.filters.protect_switch.find(e => e.value === value);
            return item ? item.text : '保护中';
        }
    },
    mounted() {
        console.log(this.getProprotectSwitch('0'));
        console.log(this.getProprotectSwitch('1'));
        console.log(this.getProprotectSwitch('2'));
    },
    components: {
        PageHeader,
        LabelDropdown
    }
};
</script>

<style lang='scss' scoped>
.zt-color9 {
    color: #999;
}
</style>

