<template>
<div class="page-main">
    <page-header>
        <img src="@/assets/images/control/cloud_disk_icon.svg" height="50" alt="">
        <div slot="content">
            <div class="font16" v-if="data">{{data.name}}</div>
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
                </zt-form-item>
                <zt-form-item  class="pull-right">
                    <el-button type="primary" @click="create">
                        新建子网
                    </el-button>
                </zt-form-item>
            </zt-form>
        </div>
        <!-- 表格 -->
        <!-- <el-table v-if="listData" :data="listData" style="width: 100%" row-class-name="data-list" stripe header-row-class-name="data-list" border class="data-list">
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
        </el-table> -->
        <el-table v-if="tableData" :data="tableData" style="width: 100%" row-class-name="data-list" stripe header-row-class-name="data-list" border class="data-list">
            <el-table-column
                prop="name"
                label="日期">
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination" v-if="total">
            <el-pagination
                @current-change="search"
                @size-change="handleSizeChange"
                :current-page.sync="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                layout="sizes, prev, pager, next"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
    <create ref="create"></create>
    <edit-subnet ref="editSubnet"></edit-subnet>
</div>
</template>
<script>
import {getSubnetByNetId, queryNetworkByID, deleteSubnet} from '@/service/ecs/network.js';
import Create from './CreateSubnet';
import EditSubnet from './EditSubnet';

let searchOptionType = [
    {
        label: '子网ID',
        value: 'server_id'
    },
    {
        label: '子网名称',
        value: 'server_name'
    }
];

export default {
    components: {Create, EditSubnet},
    data() {
        return {
            inputval: '',
            data: {},
            selestSearchOptionType: '',
            searchOptionType,
            pageIndex: 1,
            limit: 10,
            total: 0,
            listData: {},
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, 
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }
            ]

        };
    },
    computed: {
        // tableData() {
        //     return this.listData;
        // }
    },
    methods: {
        editSubnet(row) {
            let editSubnet = this.$refs.editSubnet;
            if (editSubnet) {
                editSubnet.show(row).then(ret => {
                    if (ret) {
                        this.fetchData();
                    }
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
                    return deleteSubnet({
                        id: row.id
                    });
                })
                .then(ret => {
                    $log('deleteSubnet ret <-', ret);
                    if (ret) {
                        this.fetchData();
                    }
                })
                .catch((error) => {
                    // 取消
                    $log('deleteSubnet', error.message);
                });
        },
        create() {
            let create = this.$refs.create;
            if (create) {
                create.show(this.data).then(ret => {
                    if (ret) {
                        this.fetchData();
                    }
                });
            }
        },
        queryNetworkByID() {
            queryNetworkByID({vpcId: this.vpcId}).then(ret => {
                $log('queryNetworkByID', ret);
                this.data = ret;
            });
        },
        search() {
            this.fetchData();
        },
        handleSizeChange(val) {
            this.limit = val;
            this.fetchData();
        },
        async fetchData() {
            try {
                this.total = 0;
                this.listData = {};
                // 发送请求
                let params = {
                    pageIndex: this.pageIndex,
                    limit: this.limit,
                    pnetId: 'vpc-28ijaat7y',
                    offset: 0,
                    vpcId: this.vpcId
                };

                if (this.selestSearchOptionType) {
                    params[this.selestSearchOptionType] = this.inputval;
                }

                let ret = await getSubnetByNetId(params);
                $log('获取子网列表 <-', ret);
                if (ret) {
                    this.listData = ret.data;
                    this.total = ret.total;
                } else {
                    throw new Error('无数据。');
                }
            } catch (error) {
                console.error('fetechInfo 失败', error.message);
                this.listData = {};
            }
        }
    },
    created() {
        let vpcId = this.$route.params.id;
        if (vpcId) {
            this.vpcId = vpcId;
        }
        // this.queryNetworkByID();
        this.fetchData();
    }
};
</script>

