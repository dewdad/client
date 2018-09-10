<template>
    <el-dialog title="租户使用量" :visible.sync="isShow" width="800px"   v-dialogDrag>
            <el-date-picker
                    v-model="date"
                    type="daterange"
                    size="small"
                    style="width:300px"
                    start-placeholder="开始日期"
                    range-separator="至"
                    end-placeholder="结束日期"
                    :default-time="['12:00:00']">
            </el-date-picker>
           <el-button class="ml10" size="small" type="primary" @click="viewUsage" icon="el-icon-search">搜索</el-button>
            <el-row class="mt20">
                <el-col :span="24">
                    <el-table :data="tableData"  header-row-class-name="data-list">
                        <template v-for="col in cols">
                            <!-- 实例名称 -->
                            <template v-if="col.column=='instance'">
                                <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <span class="font12 mr10" >{{scope.row.projectName}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- vcpu数量 -->
                            <template v-if="col.column=='cpu'">
                                <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <span class="font12 mr10" >{{ scope.row.CORES}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 内存 -->
                            <template v-if="col.column=='ram'">
                                <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <span class="font12 mr10">{{scope.row.RAM}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 创建后多少小时 -->
                            <template v-if="col.column=='time'">
                                <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <span class="font12 mr10">{{scope.row.operUserName}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                        </template>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination background
                                       @current-change="currentChange"
                                       @size-change="handleSizeChange"
                                       :current-page="searchObj.paging.pageIndex"
                                       :page-sizes="[10, 20, 50, 100]"
                                       :page-size="searchObj.paging.limit"
                                       layout="sizes, prev, pager, next"
                                       :total="searchObj.paging.totalItems">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
    </el-dialog>
</template>
<script>
import {dateFormat} from '@/utils/utils';
import {viewUsage} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            {
                'column': 'instance',
                'text': '实例名称',
                'width': '10%'
            },
            {
                'column': 'cpu',
                'text': 'vcpu数量',
                'width': '10%'
            },
            {
                column: 'ram',
                text: '内存',
                width: '10%'
            },
            {
                'column': 'time',
                'text': '创建后多少小时',
                'width': '15%'
            }
        ];
        return{
            searchObj,
            cols,
            formLabelWidth: '130px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            date:[],
            tableData:[],
            item:{},
            brunch:{}

        };
    },
    computed:{
        start_date() {
            if (!this.date || !this.date.length) return [];
            return dateFormat(this.date[0].toString(), 'YYYY-MM-DD HH:mm:ss');
        },
        end_date() {
            if (!this.date || !this.date.length) return [];
            return dateFormat(this.date[1].toString(), 'YYYY-MM-DD HH:mm:ss');
        }
    },
    props: {},
    methods: {
        show(item,brunch) {
            this.isShow = true;
            this.item = item;
            this.brunch = brunch;
            this.viewUsage();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        hide() {
            this.isShow = false;

        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        viewUsage(){
            try {
                let params = {
                    paging:this.searchObj.paging,
                    startDate:this.start_date,
                    endDate: this.end_date,

                };
                $log('paramsviewUsage', params);
                viewUsage(params).then(ret => {
                    $log('viewUsage', ret);
                    let resData = ret.data;
                    if(resData && resData.data){
                        this.tableData = resData.data || [];
                        this.searchObj.paging.totalItems = resData.total || 0;
                    }
                });

            } catch (error) {
                console.error('fetchData', error.message);
            }
        },

        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.getLoglist();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.getLoglist();
        },
    },
    mounted(){

    }
};
</script>
<style lang="scss">

</style>
