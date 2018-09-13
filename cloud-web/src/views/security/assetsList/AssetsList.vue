<template>
<div class="page-main">
    <page-header>
        {{$t('security.assetslist.title')}}
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
                    <!-- 查询按钮 -->
                    <el-button type="primary" @click="search" icon="el-icon-search">
                        {{$t('common.searchButtonText')}}
                    </el-button>
                    <label-dropdown @select="search"></label-dropdown>
                </zt-form-item>
            </zt-form>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" row-class-name="data-list" stripe header-row-class-name="data-list" border class="data-list">
            <el-table-column label="服务器IP" :min-width="110">
                <template slot-scope="scope">
                    <div class="text-nowrap"><router-link :to="{name: 'app.security.assetslist.baseInfo', params: {serverID: scope.row.serverID}}" class="font12">{{scope.row.ip}}(内)</router-link></div>
                    <div class="text-nowrap" v-if="scope.row.wwwip"><router-link :to="{name: 'app.security.assetslist.baseInfo', params: {serverID: scope.row.serverID}}"  class="font12">{{scope.row.wwwip}}(公)</router-link></div>
                </template>
            </el-table-column>
            <el-table-column label="区域">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.area" placement="top">
                        <span class="text-nowrap">{{scope.row.area}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="在线状态" :filters="filters.online" :min-width="90">
                <template slot-scope="scope">
                    <span :class="scope.row.online === '0' ? 'color-danger' : 'color-success'">{{scope.row.online === '0' ? '离线' : '在线'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="保护状态" :filters="filters.protect_switch" :min-width="90">
                <template slot-scope="scope">
                    <span :class="scope.row.protect_switch === '0' ? 'color-danger' : 'color-success'">{{getProprotectSwitch(scope.row.protect_switch)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="leak" label="漏洞" :min-width="50">
            </el-table-column>
            <el-table-column prop="baseline" label="基线" :min-width="50">
            </el-table-column>
            <el-table-column prop="abnlogin" label="异常登录" :min-width="70">
            </el-table-column>
            <el-table-column prop="webshell" label="主机木马" :min-width="70">
            </el-table-column>
            <el-table-column prop="host" label="主机异常" :min-width="70">
            </el-table-column>
            <el-table-column prop="process" label="进程数" :min-width="60">
            </el-table-column>
            <el-table-column prop="port" label="端口数" :min-width="60">
            </el-table-column>
            <el-table-column prop="name" label="操作" :min-width="70">
                <template slot-scope="scope">
                    <el-dropdown @command="onCommand">
                        <span class="el-dropdown-link font12">
                            {{$t('common.tableHeaderOperateText')}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <!-- 在线 -->
                        <el-dropdown-menu slot="dropdown" v-if="scope.row.online === '1'">
                            <el-dropdown-item class="font12" :command="{type: 'onKeyScan', serverId: scope.row.serverID}">一键安全检查</el-dropdown-item>
                            <el-dropdown-item class="font12" :command="{type: 'changeProtect', data: scope.row}">{{scope.row.protect_switch === '1' ? '开启保护': '暂停保护'}}</el-dropdown-item>
                            <el-dropdown-item class="font12">安全配置</el-dropdown-item>
                        </el-dropdown-menu>
                        <!-- 离线 -->
                        <el-dropdown-menu slot="dropdown" v-else>
                            <el-dropdown-item class="font12" disabled :command="{type: 'onKeyScan', serverId: scope.row.serverID}">一键安全检查</el-dropdown-item>
                            <el-dropdown-item class="font12" disabled :command="{type: 'changeProtect', data: scope.row}">{{scope.row.protect_switch === '1' ? '开启保护': '暂停保护'}}</el-dropdown-item>
                            <el-dropdown-item class="font12" :command="{type: 'agent', data: scope.row}">安装Agent</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination" v-if="pagination">
            <el-pagination
                @current-change="search"
                @size-change="handleSizeChange"
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
// import mockData from '../mockData.json';
import {assetList, protect} from '@/service/security';
import {mapState, mapMutations, mapActions} from 'vuex';

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
            value: '1'
        },
        {
            text: '未安装Agent',
            value: '0'
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
        value: 'server_name'
    }
];
export default {
    data() {
        return {
            inputval: '',
            selestSearchOptionType: '',
            searchOptionType,
            filters: filters,
            limit: 10,
            pagination: {
                limit: 10,
                total: 1,
                pageIndex: 1
            }
            // assetsListData: mockData.assetsList
        };
    },
    computed: {
        ...mapState('security', {
            assetsListData: state => state.assetList
        }),
        tableData() {
            return this.assetsListData ? this.assetsListData.data || [] : [];
        }
    },
    methods: {
        ...mapMutations('security', ['setAssetList']),
        ...mapActions('security', ['onKeyScan']),
        search() {
            this.fetchAssetList();
        },
        handleSizeChange(val) {
            console.warn('handleSizeChange', val);
            this.$set(this.pagination, 'limit', val);
            this.fetchAssetList();
        },
        getProprotectSwitch(value) {
            let item = this.filters.protect_switch.find(e => e.value === value);
            return item ? item.text : '保护中';
        },
        setPagination(data) {
            this.pagination.total = 0;
            if (data.total) {
                this.pagination.pageIndex = parseInt(data.pageIndex);
                this.pagination.total = parseInt(data.total);
                this.pagination.limit = parseInt(data.limit);
            }
        },
        async fetchAssetList() {
            try {
                this.setAssetList({});
                // 发送请求
                let params = {
                    pageIndex: this.pagination.pageIndex,
                    limit: this.pagination.limit
                };

                if (this.selestSearchOptionType) {
                    params[this.selestSearchOptionType] = this.inputval;
                }

                let ret = await assetList(params);
                console.log('info', ret);
                if (ret && ret.data) {
                    this.setPagination(ret);
                    // this.assetsListData = ret;
                    this.setAssetList(ret);
                } else {
                    throw new Error('无数据。');
                }
            } catch (error) {
                console.error('fetechInfo 失败', error.message);
                this.setAssetList({});
            }
        },
        onCommand(option = {}) {
            console.log('onCommand', option);

            let {type, data} = option;
            let {serverID, protect_switch} = data || {};
            // opStatus 开关操作 0：关 1：开
            let opStatus;
            if (protect_switch === '1') {
                opStatus = '0';
            } else if (protect_switch === '0') {
                opStatus = '1';
            }
            switch (type) {
                case 'onKeyScan':
                    this.showOnKeyScan(option.serverId);
                    break;
                case 'changeProtect':
                    this.changeProtect({serverId: serverID, opStatus});
                    break;
                default:
                    break;
            }
        },
        showOnKeyScan(serverId) {
            if (!serverId) return;
            console.log('一键安全检查弹框', serverId);

            const h = this.$createElement;
            this.$msgbox({
                title: '温馨提示',
                message: h('div', null, [
                    h(
                        'div',
                        null,
                        '已为服务器进行了检查刷新，并全部操作成功。'
                    ),
                    h(
                        'div',
                        null,
                        '请耐心等待刷新数据结果，预计1-5分钟，请不要重复操作。'
                    )
                ]),
                showCancelButton: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(action => {
                    return this.onKeyScan({
                        serverId: [serverId]
                    });
                })
                .then(ret => {
                    $log('一键安全检查', ret);
                    this.$message.success('操作成功');
                });
        },
        async changeProtect({serverId, opStatus}) {
            try {
                let ret = await protect({serverId, opStatus});
                console.log('changeProtect', ret);
                if (ret) {
                    this.$message.success('操作成功');
                    this.fetchAssetList();
                }
            } catch (error) {
                console.error('changeProtect Error', error.message);
            }
        }
    },
    created() {
        if (this.$route.query.ip) {
            this.inputval = this.$route.query.ip;
        }
        this.fetchAssetList();
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

