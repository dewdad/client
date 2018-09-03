<template>
    <div class="page-main ipList">
        <page-header>
            弹性公网IP
            <region-radio slot="content" v-model="region"></region-radio>
            <div slot="right">
                <a type="primary" class="el-button el-button--small el-button--primary" @click="toCreat" target="_blank">申请弹性公网IP</a>
                <el-button type="info" size="small">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body">
            <div class="search-box">
                <zt-form :inline="true" size="small" class="search-form-inline">
                    <zt-form-item label="">
                        <el-select placeholder="IP地址" v-model="selectType" value-key="value">
                            <el-option v-for="item in selectData" :label="item.label" :value="item.label" :key="item.label"></el-option>
                        </el-select>
                    </zt-form-item>
                    <zt-form-item label="">
                        <el-input v-model="ipSearch"></el-input>
                    </zt-form-item>
                    <zt-form-item>
                        <el-button type="primary" @click="toSearch">搜索</el-button>
                    </zt-form-item>
                </zt-form>
            </div>
            <div id="iptable">
                <el-table class="font12" :data="tableDatas" header-row-class-name="data-list" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 公网ID -->
                        <template v-if="col.column=='id'">
                            <el-table-column width="130" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span v-html="scope.row.id"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- IP地址 -->
                        <template v-if="col.column=='ipAdd'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span v-html="scope.row.ipAdd"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 带宽 -->
                        <template v-if="col.column=='bandWidth'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                <template slot-scope="scope">
                                    <span v-html="scope.row.bandWidth"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 付费方式 -->
                        <template v-if="col.column=='paytype'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>免费试用</span>
                                    <br>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 状态 -->
                        <template v-if="col.column=='status'">
                            <el-table-column empty-text :filter-multiple="false"  :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                <template slot-scope="scope">
                                    <span v-if="!!scope.row.instanceId " class="color-danger">已绑定</span>
                                    <span v-else>未绑定</span>
                                    <br>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 绑定实例 -->
                        <template v-if="col.column=='instanceId'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.instanceId}}</span>
                                    <br>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 实例类型 -->
                        <template v-if="col.column=='instanceType'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span v-if="!!scope.row.instanceId "> ecs实例</span>
                                    <span v-else></span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="250" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <template v-if="!!scope.row.instanceId">
                                    <!-- 绑定 -->
                                    <!-- <span class="color-primary finger-cursor" @click="toBind(scope.row)"></span> -->
                                    <el-tooltip effect="light" transition="scale" content="请先解绑实例" placement="bottom">
                                        <span>
                                            <a disabled class="el-a">绑定</a>
                                        </span>
                                    </el-tooltip>
                                    <b class="link-division-symbol"></b>
                                    <!-- 解绑 -->
                                    <a class="btn-linker" @click="toUnBind(scope.row)">解绑</a>
                                    <b class="link-division-symbol"></b>
                                    <!-- 释放 -->
                                    <el-tooltip effect="light" transition="scale" content="只有非绑定状态的IP可以释放" placement="bottom">
                                        <span>
                                            <a disabled class="el-a">释放</a>
                                        </span>
                                    </el-tooltip>
                                    <b class="link-division-symbol"></b>
                                    <!-- 修改带宽 -->
                                    <!-- <router-link @click="toModify(scope.row)" class="btn-linker">修改带宽</router-link> -->
                                    <a class="btn-linker" @click="toModify(scope.row)">修改带宽</a>
                                </template>
                                <template v-else>
                                    <!-- 绑定 -->
                                    <a class="btn-linker" @click="toBind(scope.row)">绑定</a>
                                    <b class="link-division-symbol"></b>
                                    <!-- 解绑 -->
                                    <el-tooltip effect="light" content="请先绑定实例 " transition="scale" placement="bottom">
                                        <span>
                                            <a disabled class="el-a">解绑</a>
                                        </span>
                                    </el-tooltip>
                                    <b class="link-division-symbol"></b>
                                    <!-- 释放 -->
                                    <a class="btn-linker" @click="toDeliver(scope.row)">释放</a>
                                    <b class="link-division-symbol"></b>
                                    <!-- 修改带宽 -->
                                    <a class="btn-linker" @click="toModify(scope.row)">修改带宽</a>
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination @size-change="sizeChange" @current-change="getList" :current-page.sync="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <delievery-ip v-if="delieveryIpDialog" :ipadd='ipadd' :id='id' v-model="delieveryIpDialog"></delievery-ip>
        <bind-ip v-if="bindIpDialog" :id='id' v-model="bindIpDialog"></bind-ip>
        <UnbindIp v-if="unbindIpDialog" :id='id' v-model="unbindIpDialog"></UnbindIp>
    </div>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import {getIpList} from '@/service/ecs/floating';
import DelieveryIp from './DelieveryIp';
import UnbindIp from './UnbindFlexip';
import BindIp from './BindFlexip';
import PageHeader from '@/components/pageHeader/PageHeader';
export default {
    name: 'List',
    data() {
        let cols = [
            { column: 'id', text: '公网ID' },
            { column: 'ipAdd', text: 'IP地址' },
            {
                column: 'bandWidth',
                text: '带宽',
                width: '3%'
            },
            {
                column: 'paytype',
                text: '付费方式',
                width: '3%'
            },
            {
                column: 'status',
                text: '状态',
                width: '3%',
                dropdowns: [
                    { key: 0, text: '全部', state: true, value: '' },
                    { key: 1, text: '已绑定', state: false, value: 1 },
                    { key: 2, text: '未绑定', state: false, value: 0 }
                ]
            },
            { column: 'instanceId', text: '绑定实例', width: '3%' },
            { column: 'instanceType', text: '实例类型', width: '10%' }
        ];
        return {
            region: '',
            delieveryIpDialog: false,
            bindIpDialog: false,
            unbindIpDialog: false,
            selectType: null,
            id: '',
            ipadd: '',
            total: 0,
            limit: 10,
            pageIndex: 1,
            ipSearch:'',
            selectData: [
                {
                    label: 'IP地址',
                    value: {type: 'INPUT'}
                }
            ],
            tableDatas: [],
            isBinded: true,
            cols
        };
    },
    watch: {},
    created() {
        this.getList();
    },
    methods: {
        filterHandler(value, row, column) {
            const isBinded = !!row['instanceId'];
            return isBinded === !!value || value === '';
        },
        toCreat() {
            this.$router.push({name: 'app.ip.creatflexip'});
        },
        toBind(row) {
            this.id = row.id;
            this.bindIpDialog = true;
        },
        toUnBind(row) {
            this.id = row.id;
            this.unbindIpDialog = true;
        },
        toSearch(){
            console.log('获取列表');
            let data = {
                ip:this.ipSearch
            };
            getIpList(data)
                .then(result => {
                    if (result.code === '0000') {
                        this.tableDatas = result.result.records;
                        this.total = this.tableDatas.total;
                    } else {
                        this.$message.error(result.msg);
                    }
                })
                .catch(() => {
                    // 显示异常
                    this.$message.error(this.$t('exception.server'));
                });
        },
        toDeliver(row) {
            this.ipadd = row.ipAdd;
            this.id = row.id;
            this.delieveryIpDialog = true;
        },
        toModify(row) {
            this.$router.push({
                name: 'app.ip.modifyflexip',
                params: {
                    id: row.id,
                    bandWidth: row.bandWidth,
                    zone: row.zone
                }
            });
        },
        sizeChange(val) {
            this.pageIndex = 1;
            this.limit = val;
            this.getList();
        },
        getList() {
            console.log('获取列表');
            let data = {
                pageIndex: this.pageIndex,
                limit: this.limit
            };
            getIpList(data)
                .then(result => {
                    if (result.code === '0000') {
                        this.tableDatas = result.result.records;
                        this.total = this.tableDatas.total;
                    } else {
                        this.$message.error(result.msg);
                    }
                })
                .catch(() => {
                    // 显示异常
                    this.$message.error(this.$t('exception.server'));
                });
        }
    },
    components: {
        RegionRadio,
        PageHeader,
        DelieveryIp,
        BindIp,
        UnbindIp
    }
};
</script>
<style  lang="scss">
.ipList {
    #iptable {
        font-size: 12px;
        margin-top: 10px;
        .el-table .data-list th {
            line-height: 32px;
            height: 32px;
            border-top: 1px solid #c3c5c6;
            border-right: 0px solid transparent;
            background-color: #f5f6fb;
            color: #999;
            padding: 0px;
            font-size: 12px;
            font-weight: 500;
        }
        .el-table th .cell {
            border-right: 1px solid #e8e8e8;
            font-size: 12px;
        }
        .zt-numlink {
            background-color: #f6f8fa;
            padding: 10px;
            font-size: 12px;
            line-height: 12px;
            color: #2b65c5;
        }
        .link-division-symbol {
            margin-right: 8px;
            margin-left: 8px;
            height: 9px;
            display: inline-block;
            border-right: 1px solid #4895d7;
        }
        .option-snaplist {
            text-align: right;
        }
        .el-table_1_column_8 {
            text-align: right;
        }
    }
    .el-a {
        font-size: 12px !important;
        padding: 5px;
    }
}
</style>
