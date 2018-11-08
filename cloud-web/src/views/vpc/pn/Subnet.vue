<template>
<div class="page-main">
    <page-header>
        <div class="font16"><img src="@/assets/images/control/vpc_icon.svg" height="36" alt=""><span class="ml10">{{vpcName}}</span></div>
        <div slot="content" class="pull-right">
            <el-button type="primary" size="small" @click="createSubnet">
                新建子网
            </el-button>
            <el-button type="info" size="small" @click="fetchData">
                <i class="iconfont icon-icon-refresh"></i>
            </el-button>
        </div>
    </page-header>
    <!-- 提示框 -->
    <!-- <el-alert :title="$t('security.assetslist.tips')" type="warning" :closable="false" class="mt10">
    </el-alert> -->
    <div class="page-body" v-loading="deleteing">
        <!-- 表格 -->
        <zt-table :data="listData" :loading="loading"  :search="true" :search-condition="fields" @search="getSubnetList" :paging="searchObj.paging">
            <el-table-column label="子网ID/名称" :min-width="110" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div class="text-nowrap">{{scope.row.id}}</div>
                    <div class="text-nowrap">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="cidr" label="网段" :min-width="90">
            </el-table-column>
            <el-table-column label="DHCP" :min-width="50">
                <template slot-scope="scope">
                    {{scope.row.enable_dhcp ? '已激活' : '未激活'}}
                </template>
            </el-table-column>
            <el-table-column label="IP版本" :min-width="50">
                <template slot-scope="scope">
                    IPV{{scope.row.ip_version}}
                </template>
            </el-table-column>
            <el-table-column prop="gateway_ip" label="网关IP" :min-width="70">
            </el-table-column>
            <el-table-column prop="name" label="操作" :min-width="70">
                <template slot-scope="scope">
                    <a @click="editSubnet(scope.row)">编辑</a> | 
                    <a @click="deleteSubnet(scope.row)">删除</a>
                </template>
            </el-table-column>
        </zt-table>
    </div>
    <create ref="create"></create>
    <edit-subnet ref="editSubnet"></edit-subnet>
</div>
</template>
<script>
import {getSubnetByNetId, deleteSubnet} from '@/service/v2.1/network.js';
import Create from './CreateSubnet';
import EditSubnet from './EditSubnet';

let fields = [
    { field: 'id', label: '子网ID', tagType: 'INPUT' },
    { field: 'name', label: '子网名称', tagType: 'INPUT' }
];

let searchObj = {
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    }
};

export default {
    components: {Create, EditSubnet},
    data() {
        return {
            loading: false,
            deleteing: false,
            inputval: '',
            vpcName: this.$route.params.name,
            selestSearchOptionType: {},
            fields,
            searchObj,
            pageIndex: 1,
            limit: 10,
            total: 0,
            listData: []
        };
    },
    methods: {
        editSubnet(row) {
            let editSubnet = this.$refs.editSubnet;
            if (editSubnet) {
                editSubnet.show(row).then(ret => {
                    this.fetchData();
                });
            }
        },
        // 新建子网
        createSubnet(row) {
            let create = this.$refs.create;
            if (create) {
                create.show({vpcName: this.vpcName, vpcId:this.vpcId}).then(ret => {
                    this.fetchData();
                });
            }
        },
        deleteSubnet(row) {
            $log('删除数据', row);
            this.$confirm(`您确定要删除ID为:${row.id}的子网吗？`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'danger'
            })
                .then(() => {
                    this.deleteing = true;
                    return deleteSubnet({
                        id: row.id
                    });
                })
                .then(ret => {
                    $log('deleteSubnet ret <-', ret);
                    if (ret) {
                        this.deleteing = false;
                        this.$message.success('删除成功');
                        this.fetchData();
                    }
                })
                .catch((error) => {
                    // 取消
                    this.deleteing = false;
                    $log('deleteSubnet', error.message);
                });
        },
        // 获取子网列表
        async fetchData() {
            try {
                this.total = 0;
                this.listData = [];
                this.loading = true;
                // 发送请求
                let params = {
                    ...this.searchObj.paging,
                    networkId: this.vpcId,
                    ...this.selestSearchOptionType
                };
                let ret = await getSubnetByNetId(params);
                this.loading = false;
                if (ret) {
                    $log('获取子网列表 <-', ret);
                    let dataList = ret.data;
                    this.listData = dataList;
                    this.searchObj.paging.totalItems = ret.total;
                } else {
                    throw new Error('无数据。');
                }
            } catch (error) {
                this.loading = false;
                console.error('fetechInfo 失败', error.message);
                this.listData = [];
            }
        },
        // 抛出函数
        getSubnetList(params) {
            $log(params);
            this.selestSearchOptionType = params;
            this.fetchData();
        }
    },
    created() {
        let vpcId = this.$route.params.id;
        if (vpcId) {
            this.vpcId = vpcId;
        }
        this.fetchData();
    }
};
</script>

