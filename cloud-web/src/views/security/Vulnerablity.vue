<template>
<div class="page-main">
    <page-header>
        {{$t('security.vulnerablity.title')}}
        <div slot="right">
            <!-- 刷新按钮 -->
            <el-button type="primary" size="small" @click="showSetting">
                <i class="iconfont icon-shezhi"></i> 
                &nbsp;{{$t('security.vulnerablity.vulnerablityMrgSetting')}}
            </el-button>
            <el-button type="info" size="small" @click="search">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <div class="page-body">
        <!-- 搜素栏 -->
        <div class="search-box">
            <!-- 漏洞搜索： -->
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="漏洞搜索：">
                    <el-input placeholder="搜索漏洞名称" v-model="inputval"></el-input>
                </zt-form-item>
                <zt-form-item>
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search" icon="el-icon-search">
                        {{$t('common.searchButtonText')}}
                    </el-button>
                </zt-form-item>
            </zt-form>
            <!-- 漏洞状态： -->
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="漏洞状态：">
                    <el-radio-group v-model="status">
                        <el-radio border :label="item" v-for="item in statusList" :key="item"></el-radio>
                    </el-radio-group>
                </zt-form-item>
            </zt-form>
            <!-- 漏洞等级： -->
            <zt-form :inline="true" size="small" class="search-form-inline">
                <zt-form-item label="漏洞等级：">
                    <el-radio-group v-model="level">
                        <el-radio border :label="item" v-for="item in levelList" :key="item"></el-radio>
                    </el-radio-group>
                </zt-form-item>
            </zt-form>
        </div>
        <!-- 漏洞等级说明 -->
        <el-row>
            <el-col :span="24">
                <el-button class="pull-right" type="primary" size="small">
                    {{$t('security.vulnerablity.VulnerabilityLevelDescription')}}
                </el-button>
            </el-col>
        </el-row>
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
            <el-table-column prop="name" label="漏洞名称" :min-width="120">
            </el-table-column>
            <el-table-column label="修复必要性">
                <template slot-scope="scope">必要</template>
            </el-table-column>
            <el-table-column label="漏洞等级" :filters="filters.online" :min-width="60">
                <template slot-scope="scope">
                    <span :class="scope.row.online === '0' ? '' : 'color-danger'">{{scope.row.online === '0' ? '低危' : '高危'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="leak" label="历史收影响资产" :min-width="60">
            </el-table-column>
            <el-table-column prop="baseline" label="状态" :min-width="50">
            </el-table-column>
            <el-table-column prop="mdate" label="最后发现时间" :min-width="90">
            </el-table-column>
            <el-table-column prop="name" label="操作" :min-width="70">
                <template slot-scope="scope">
                    <el-dropdown>
                        <span class="el-dropdown-link font12">
                            {{$t('common.tableHeaderOperateText')}}<i class="el-icon-arrow-down el-icon--right"></i>
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
    <!-- 对话框 漏洞管理设置设置 -->
    <setting-dialog ref="settingDialog"/>
</div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import SettingDialog from './SettingDialog';
import mockData from '../mockData.json';
// import {sleep} from '@/utils/utils';

import {
    FILTERS,
    STATUS_LIST,
    LEVEL_LIST,
    SEARCH_OPTION_TYPE
} from '@/constants/dicts/security.js';

export default {
    data() {
        return {
            status: '全部', // 漏洞状态
            statusList: STATUS_LIST, // 漏洞状态列表
            level: '全部', // 漏洞状态
            levelList: LEVEL_LIST, // 漏洞状态列表
            inputval: '',
            selestSearchOptionType: '',
            searchOptionType: SEARCH_OPTION_TYPE,
            searchObjExtra: {
                selField: {}
            },
            filters: FILTERS,
            assetsListData: mockData.assetsList
        };
    },
    computed: {
        tableData() {
            return this.assetsListData ? this.assetsListData.data || [] : [];
        },
        settingDialog() {
            return this.$refs.settingDialog;
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
        search() {},
        handleCurrentChange() {},
        getProprotectWwitch(value) {
            let item = this.filters.protect_switch.find(e => e.value === value);
            return item ? item.text : '保护中';
        },
        showSetting() {
            this.settingDialog
                .show()
                .then(ret => {
                    console.log('漏洞管理设置结果', ret);
                    return this.$confirm('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        }
    },
    components: {
        SettingDialog,
        PageHeader,
        LabelDropdown
    }
};
</script>

