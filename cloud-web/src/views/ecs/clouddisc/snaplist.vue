<template>
    <div class="page-main">
        <page-header>
            云盘快照
            <el-button class="ml30" type="primary" size="small">北京1</el-button>
            <el-button disabled size="small">北京2(即将开放)</el-button>
            <div slot="right">
                <el-button type="info" size="small">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body mt10">
            <!-- 筛选操作 -->
            <div class="search-box mb10">
                <zt-form :inline="true" size="small" class="search-form-inline">
                    <zt-form-item label="">
                        <el-select value-key="field" v-model="fieldValue" placeholder="请选择">
                            <el-option v-for="field in searchObjExtra.fields" :label="field.label" :value="field" :key="field.field"></el-option>
                        </el-select>
                    </zt-form-item>
                    <zt-form-item label="">
                        <el-input placeholder="关键字"></el-input>
                    </zt-form-item>
                    <zt-form-item>
                        <el-button type="primary" @click="getSnapshotList" icon="el-icon-search">查询</el-button>
                    </zt-form-item>
                </zt-form>
            </div>
            <!-- 列表 -->
            <div id="table">
                <el-table class="font12" @cell-mouse-enter="showEditName" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 实例名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <ul>
                                        <li>
                                            <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                        </li>                                       
                                        <li>
                                            <span class="font12 mr10">{{scope.row.name}}</span>
                                            <AmendName :scope="scope" v-if="scope.row.id === showId"></AmendName>
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 源磁盘属性 -->
                        <template v-if="col.column=='isBoot'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                <template slot-scope="scope">
                                    <span>{{scope.row.isBoot == 1?'系统盘':'数据盘'}}</span>
                                </template> 
                            </el-table-column>
                        </template>
                        <!-- 源磁盘容量 -->
                        <template v-if="col.column=='disksize'">
                            <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.diskSize || '0'}}GB</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 快照数量 -->
                        <template v-if="col.column=='countSnapshot'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <router-link :to="{name:'app.ecs.snapshot.detail',params:{id:scope.row.id,item:scope.row}}" class="zt-numlink">{{scope.row.countSnapshot}}</router-link>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="250" :class-name="snaplistShow ? 'option-snaplist' : ''">
                            <template slot-scope="scope">
                                <!-- 快照列表 -->
                                <router-link class="btn-linker" :to="{name:'app.ecs.snapshot.detail',params:{id:scope.row.id,item:scope.row}}">快照列表</router-link>
                                <!-- <span class="color-primary finger-cursor" v-show="snaplistShow">快照列表</span> -->
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
        <div class="pagination">
            <el-pagination background :current-page="searchObj.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import AllTable from '@/components/table/allTable.vue';
import AmendName from '@/components/amend/AmendName';

import {getSnapshotList} from '@/service/ecs/snapshot.js';
import { getDiskList } from '@/service/ecs/disk/disk.js';

export default {
    data() {
        let fields = [
            {field: 'name', label: '磁盘名称', inputval: '', tagType: 'INPUT'}, 
            {field: 'ip', label: '磁盘ID', inputval: '', tagType: 'INPUT'}
        ];
        let searchObjExtra = {
            fields: fields,
            selField: fields[0]
        };
        let cols = [
            {column: 'name', text: '磁盘ID/磁盘名称', width: '20%'},
            {column: 'isBoot', text: '源磁盘属性', width: '4%'},
            {column: 'disksize', text: '源磁盘容量', width: '10%'},
            {column: 'countSnapshot', text: '快照数量', width: '10%'}
        ];
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            }
        };
        return {
            searchObjExtra,
            cols,
            tableData: [],
            snaplistShow: true,
            searchObj,
            fieldValue: '',
            showId: ''
        };
    },  
    components: {
        PageHeader,
        LabelDropdown,
        AllTable,
        AmendName
    },
    mounted(){
        //this.getSnapshotList();
        this.getDiskList();
    },

    methods: {
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },

        //获取云盘列表数据
        getDiskList(){
            let params = {
                paging:this.searchObj.paging,
                fileds:{
                    [this.searchObjExtra.selField.field]:this.fieldValue
                } 
            };
            getDiskList(params).then( (res) => {
                if(res.code && res.code === this.CODE.SUCCESS_CODE){
                    console.log('getDiskList',res);  
                    let resData = res.result;
                    if(resData && resData.records){
                        this.tableData = resData.records || [];  
                        this.searchObj.totalItems = resData.total || 0;
                        console.log('getInstanceDetail tableData',this.tableData); 
                    }                           
                }

            });
        },

        getSnapshotList(){
            getSnapshotList(this.searchObj)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) { 
                        let resData = res.result;
                        if(resData && resData.records){
                            this.tableData = resData.records || [];
                            this.searchObj.totalItems = resData.total || 0;
                        }                                               
                    }
                })
                .catch(err => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },

        /**
         * 进入单元格
         */
        showEditName(row, column, cell, event) {
            this.showId = row.id;
        }
    }
};
</script>

<style scope lang="scss">
#table {
    font-size: 12px;
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
}
</style>
