<!--  -->
<template>
    <div class="page-main">
        <page-header>
            对等连接
            <region-radio slot="content" v-model="zone"></region-radio>
            <div slot="right">
                <el-button type="primary" size="small" @click="create">创建对等链接</el-button>
                <el-tooltip content="刷新" placement="left">
                    <el-button type="info" size="small" @click="getList">
                        <i class="iconfont icon-refresh_people"></i>
                    </el-button>
                </el-tooltip>
            </div>
        </page-header>
        <div class="page-body">
            <el-table v-loading="loading" :data="tableData" stripe border class="data-list mt10">
                <el-table-column v-for="column in tableColumns" :width="column.width ? column.width : 'auto'" :prop="column.prop" :label="column.label" :key="column.label">
                    <template slot-scope="scope">
                        <span v-if="column.prop === 'name'">
                           <router-link to="/">{{scope.row.name}}</router-link> 
                        </span>
                        <span v-else-if="column.prop === 'status'" :class="{'color-danger': scope.row.status !== 'active', 'color-success': scope.row.status === 'active'}">
                            {{scope.row.status === 'active' ? '正常' : '错误'}}
                        </span>
                        <span v-else>
                            {{scope.row[column.prop]}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" :header-align="'right'" align="right" width="120px" class-name="option-column">
                    <template slot-scope="scope">
                        <a href="javascript:;" @click="recovery(scope.row.fileId)">管理</a>
                        <b class="link-division-symbol"></b>
                        <a href="javascript:;" @click="deletePeerconn(scope.row.id)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.currentPage" :page-sizes="[20, 50, 100]" :page-size="pagination.pageSize" layout="sizes, prev, pager, next, total" :total="pagination.total">
                </el-pagination>
            </div>
        </div>
        <create ref="create"></create>
    </div>
</template>

<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import Create from './Create';
import {getList, delPeering} from '@/service/ecs/peerconn';
const tableColumns = [
    {
        prop: 'name',
        label: '名称',
        width: '200px'
    },
    {
        prop: 'status',
        label: '状态'
    },
    {
        prop: 'reqVpcName',
        label: '本端VPC'
    },
    {
        prop: 'accVpcName',
        label: '对端VPC'
    }
];
export default {
    data() {
        return {
            loading: false,
            tableColumns,
            tableData: [
                {
                    id: 'ff80808262fbc8e50164a224d93d001e',
                    reqVpcId: '1e6bba46-5bbf-4759-b144-e1dbb7063bbb',
                    accVpcId: '5f486c45-85af-43b4-9ad5-735888f8d7f8',
                    name: '顶顶顶顶',
                    status: 'active',
                    createDate: '2018-07-16 16:12:14',
                    localId: 'peer-tceixfsideqe',
                    zone: 'az1.dc1',
                    userId: '0f9f99272cea40dca30cba302ccab26a',
                    reqVpcName: '专有网络-1531376431069',
                    accVpcName: '默认专有网络'
                },
                {
                    id: 'ff80808262fbc9ef0164634cbac30033',
                    reqVpcId: 'fd907e80-c8bf-4bbe-8b83-c820365a2604',
                    accVpcId: '5f486c45-85af-43b4-9ad5-735888f8d7f8',
                    name: 'test01',
                    status: 'active',
                    createDate: '2018-07-04 11:19:33',
                    localId: 'peer-xbzfjviiqtyn',
                    zone: 'az1.dc1',
                    userId: '0f9f99272cea40dca30cba302ccab26a',
                    reqVpcName: '专有网络-1530674063012',
                    accVpcName: '默认专有网络'
                }
            ],
            pagination: {
                total: 0,
                pageSize: 20,
                currentPage: 1
            },
            zone: ''
        };
    },
    components: {
        RegionRadio,
        Create
    },
    computed: {},
    methods: {
        getList() {
            this.loading = true;
            let query = {
                pageIndex: this.pagination.currentPage,
                limit: this.pagination.pageSize,
                zone: 'az1.dc1'
            };
            getList({...query})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.tableData = res.result.records;
                        this.pagination.total = res.resul.total;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getList();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getList();
            console.log(`当前页: ${val}`);
        },
        create() {
            this.$refs.create.show().then(res => {
                this.getList();
            });
        },
        // 删除对等链接
        deletePeerconn(id) {
            const h = this.$createElement;
            let message = h('div', null, [h('p', null, '您确定要删除该对等连接请求吗？'), h('p', null, '删除对等连接会同时删除其相关子网等所有属性。')]);
            this.$confirm(message, '删除', {
                type: 'error'
            }).then(() => {
                delPeering(id).then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message.success('删除成功');
                    }
                }).catch(err => {
                    $log(err);
                });
            });
        }
    },
    mounted() {
        // this.getList();
    }
};
</script>
<style lang='scss' scoped>
</style>