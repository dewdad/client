<template>
<div class="page-main">
    <page-header>
        浮动IP
        <div slot="content"  class="pull-right">
            <el-button type="primary" size="small" @click="applyFloatIPFn" class="mr10">
                申请浮动IP
            </el-button>
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <div class="page-body">
    <!-- 表格 -->
    <zt-table
        @filterVal="filterHandler"
        :loading="isLoading"
        :data="tableData" 
        :search="true" 
        :search-condition="fields" 
        @search="getScreenVal" 
        :paging="searchObj.paging"
        size="small">
        <el-table-column prop="title" label="VPCID/名称" :min-width="180">
            <template slot-scope="scope">
                <div>
                    <span class="font12">{{scope.row.floatingNetworkId}}</span>
                </div>
                <div>{{scope.row.networkName}}</div>
            </template>
        </el-table-column>
        <el-table-column label="IP地址">
            <template slot-scope="scope">
                {{scope.row.floatingIpAddress}}
            </template>
        </el-table-column>
        <el-table-column label="已映射固定IP地址">
            <template slot-scope="scope">
                {{scope.row.fixedIpAddress}}
            </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" :filter-multiple="false"  :filtered-value="[state]" :filters="[{text: '全部', value: ''}, {text: '已绑定', value: 'UP'},{text: '未绑定', value: 'DOWN'} ]">
            <template slot-scope="scope">
                <span :class="{'color-danger': scope.row.state === 'DOWN'}">
                    {{scope.row.state === 'DOWN' ? '未绑定' : '已绑定'}}
                </span>
            </template>
        </el-table-column>
        <el-table-column label="绑定实例" :min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.subnets}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" :min-width="90" class-name="option-column">
            <template slot-scope="scope" >
                <a @click="bindFlexFn(scope.row)">绑定</a>
                <b class="link-division-symbol"></b>
                <span class="color-secondary" v-if="scope.row.state === 'DOWN'">解绑</span>
                <a v-else>解绑</a>
                <b class="link-division-symbol"></b>
                <a @click="deleteFloatIP(scope.row)">释放</a>
            </template>
        </el-table-column>
    </zt-table>
    </div>
    <!-- 绑定浮动IP -->
    <BindFLexIP ref="BindFLexIP"></BindFLexIP>
    <!-- 申请浮动IP -->
    <ApplyFloatIP ref="ApplyFloatIP"></ApplyFloatIP>    
</div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import ApplyFloatIP from './dialog/ApplyFloatIP';
import BindFLexIP from './dialog/BindFLexIP';
import {queryFlexIP, queryNetwork, deleteFloatIP } from '@/service/ecs/network.js';
import {getEcsInstList} from '@/service/ecs/list.js';

let fields = [
    {field: 'name', label: '浮动IP地址', tagType: 'INPUT'}
];

let searchObj = {
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    },
    type: 'private' //镜像类型： false 公共镜像； true:自定义镜像
};
export default {
    data() {
        return {
            region: '',
            isLoading: false,
            pageIndex: 1,
            limit: 10,
            total: 0,
            searchObj,
            listData: {},
            fields,
            state: '',
            floatingIpAddressVal: '',
            exampleList: [],
            outerNetData: [] // 外网网络数据
        };
    },
    computed: {
        tableData() {
            return this.listData ? this.listData.data || [] : [];
        }
    },
    async created() {
        await this.fetchData();
        await this.getInstList();
        await this.getOuterNet();
    },
    methods: {
        async fetchData() {
            try {
                // 清空数据
                this.isLoading = true;
                let params = {
                    ...this.searchObj.paging,
                    offset: 1,
                    statusroptionValue: 'all',
                    status: this.state
                };
                if (this.floatingIpAddressVal) {
                    params.floatingIpAddress = this.floatingIpAddressVal;
                }
                let ret = await queryFlexIP(params);
                console.warn('fetchData', ret);

                this.listData = ret;

                // this.pageIndex = parseInt(ret.pages);
                this.searchObj.paging.totalItems = ret.total;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        },
        // 获得搜索条件
        getScreenVal(params) {
            $log('searchVal',params);
            this.searchObj.paging.pageIndex = params.pageIndex;
            this.floatingIpAddressVal = params.fileds.name;
            this.fetchData();
        },
        // 绑定浮动Ip
        bindFlexFn(params){
            let BindFLexIP = this.$refs.BindFLexIP;
            if (BindFLexIP) {
                BindFLexIP.show(params, this.exampleList)
                    .then(ret => {
                        if (ret) {
                            this.fetchData();
                        }
                    });
            }
        },
        // 申请浮动IP
        applyFloatIPFn() {
            let ApplyFloatIP = this.$refs.ApplyFloatIP;
            if (ApplyFloatIP) {
                ApplyFloatIP.show(this.outerNetData)
                    .then(ret => {
                        if (ret) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.fetchData();
                        }
                    });
            }
        },
        // 获取实例列表
        getInstList() {
            let params = {
                pageIndex: 1,
                limit: 999,
                offset: 1
            };
            getEcsInstList(params)
                .then(res => {
                    if (res && res.data) {
                        let data = res.data;
                        if (data.code && data.code === this.CODE.SUCCESS_CODE) {
                            let dataList = data.data || [];
                            this.exampleList = dataList.data;
                            $log(this.exampleList);
                        }
                    }
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                    self.loading = false;
                });
        },
        // 获得外网网络
        async getOuterNet() {
            try {
                // 清空数据
                let params = {
                    router_external: true
                };
                let ret = await queryNetwork(params);
                console.warn('fetchData', ret);

                this.outerNetData = ret.data;

            } catch (error) {
                console.error('fetchData', error.message);
            }
        },
        // 释放浮动IP
        deleteFloatIP(row) {
            $log('删除数据', row);
            this.$confirm(`浮动IP释放后无法恢复，你确定要释放弹性公网IP${row.floatingIpAddress} 吗？`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'danger'
            })
                .then(() => {
                    return deleteFloatIP({
                        floatIP: row.id
                    });
                    
                })
                .then(ret => {
                    $log('deleteNetwork ret <-', ret);
                    if (ret) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.fetchData();
                    }
                })
                .catch((error) => {
                    // 取消
                    $log('deleteNetwork', error.message);
                });
            
        },
        // 状态筛选
        filterHandler(value) {
            if (value) {
                this.state = value;
            } else {
                this.state = '';
            }
            console.warn(value);
            this.fetchData();
        }
    },
    components: {
        RegionRadio,
        BindFLexIP,
        ApplyFloatIP
    }
};
</script>
