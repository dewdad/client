<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            我的工单
            <div slot="right">
                <el-button type="primary" size="small" @click="$router.push({name:'app.ticketSystem.submitticket'})">创建工单</el-button>                
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 搜索筛选栏 -->
        <div class="mt20 mb20 font12">
            <span class="mr10">产品类型：</span>
            <el-select v-model="searchObj.moduleType" size="small" placeholder="请选择" value-key="value">
                <el-option
                v-for="item in moduleTypes"
                :key="item.value"
                :label="item.label"
                :value="item">
                </el-option>
            </el-select>
            <span class="ml10 mr10">时间范围：</span>
            <el-date-picker
            v-model="searchObj.daterange"
            type="datetimerange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00','23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
            <span class="ml10 mr10">工单编号：</span>
            <el-input class="workList mr10" v-model="searchObj.orderNO" size="small"></el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <!-- 列表 -->
        <div v-loading="loading">
            <el-table class="font12 data-list" :data="tableDataList" header-row-class-name="data-list" style="width: 100%">
                <template v-for="col in cols">
                    <!-- 工单编号 -->
                    <template v-if="col.column=='name'">
                        <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                        </el-table-column>
                    </template>
                    <!-- 问题标题 -->
                    <template v-if="col.column=='lable'">
                        <el-table-column min-width="200" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <a class="zt-numlink">{{scope.row.lable}}</a>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 产品类型 -->
                    <template v-if="col.column=='volume_type'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                        </el-table-column>
                    </template>
                    <!-- 故障类型 -->
                    <template v-if="col.column=='bootable'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                        </el-table-column>
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="col.column=='countSnapshot'">
                        <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                        </el-table-column>
                    </template>
                    <!-- 状态 -->
                    <template v-if="col.column=='status'">
                        <el-table-column width="80" :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                            <template slot-scope="scope">
                                <span class="color-success">{{scope.row.status}}</span>
                            </template>
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template>
                    <el-table-column label="操作" key="op" width="250">
                        <template slot-scope="scope">
                            <!-- 查看 -->
                            <span class="color-primary finger-cursor">查看</span>
                            <b class="link-division-symbol"></b>
                            <!-- 关闭 -->
                            <span @click="closeWork(scope.row.id)" class="color-primary finger-cursor">关闭</span>
                            <b class="link-division-symbol"></b>
                            <!-- 删除 -->
                            <span @click="deleteWork(scope.row.id)" class="color-primary finger-cursor">删除</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" :current-page.sync="searchObj.paging.pageIndex" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.paging.limit" layout="sizes, prev, pager, next" :total="searchObj.paging.totalItems">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import { getOrderList } from '@/service/ticket.js';

export default {
    components: { 
        PageHeader
    },
    data() {
        let cols = [
            { column: 'name', text: '工单编号', width: '20%' },
            { column: 'lable', text: '问题标题', width: '4%' },
            { column: 'volume_type', text: '产品类型', width: '4%' },
            { column: 'bootable', text: '故障类型', width: '4%' },
            { column: 'countSnapshot', text: '提交时间', width: '10%' },
            { 
                column: 'status',
                text: '状态',
                width: '4%',
                dropdowns: [
                    {key: 0, 'text': '全部', 'state': true, value: ''},
                    {key: 1, 'text': '待审核', 'state': false, value: '1'},
                    {key: 2, 'text': '待处理', 'state': false, value: '0'},
                    {key: 2, 'text': '已审核', 'state': false, value: '0'},
                    {key: 2, 'text': '已关闭', 'state': false, value: '0'}
                ] 
            }
        ];
        let moduleTypes = [
            {value: '1', label: '弹性云主机',
                errTypes: [
                    {value: 10, label: '远程连接'},
                    {value: 11, label: '镜像'},
                    {value: 12, label: '安全组配置'},
                    {value: 13, label: '升降配'},
                    {value: 14, label: '磁盘扩容'},
                    {value: 15, label: '挂载磁盘'}
                ]
            },
            // {value: '2', label: '云数据库RDS',
            //     errTypes: [
            //         {value: 20, label: '版本/规格'},
            //         {value: 21, label: '只读实例'},
            //         {value: 22, label: '监控与报警'},
            //         {value: 23, label: '日志'},
            //         {value: 24, label: '参数设置'},
            //         {value: 25, label: '备份恢复'}
            //     ]
            // },
            {value: '3', label: '对象存储OSS',
                errTypes: [
                    {value: 30, label: '文件上传/下载'},
                    {value: 31, label: '读写限制'},
                    {value: 32, label: 'SDK/API'},
                    {value: 33, label: '图片处理服务'},
                    {value: 34, label: '域名/监控'},
                    {value: 35, label: '静态页面'},
                    {value: 36, label: '防盗链'},
                    {value: 37, label: '镜像回源'}
                ]
            },
            // {value: '4', label: '云数据库Redis', errTypes: []},
            // {value: '5', label: '弹性伸缩', errTypes: []},
            {value: '6', label: '专有网络VPC',
                errTypes: [
                    {value: 60, label: 'VPC使用场景'},
                    {value: 61, label: 'VPC配置'},
                    {value: 62, label: '对等连接'},
                    {value: 63, label: '虚拟防火墙'}
                ]
            },            
        ];
        let searchObj = {
            paging: {
                pageIndex: 1,
                limit: 10,  
                totalItems: 0, 
            },             
            moduleType:{},
            daterange:[], 
            orderNO:'',           
        };
        return {
            searchObj,
            loading: false,
            moduleTypes,    
            tableDataList:[],
            cols
        };
    },    
    methods: {
        //查询
        search(){
            let { paging:{ pageIndex,limit },daterange,orderNO,moduleType } = this.searchObj;
            let data = {
                pageIndex,
                limit,
                startTime: daterange && daterange[0],
                endTime: daterange && daterange[1],
                orderNO,
                moduleType: moduleType.value, 
            };           
            this.loading = true;
            getOrderList(data)
                .then( res => {     
                    this.loading = false;              
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        // let dataList = res.data || [];
                        // this.tableDataList = dataList;                        
                        // this.searchObj.paging.totalItems = data.total || 0;
                        // $log(this.tableDataList);
                    }else {
                        $log(res.msg);
                    }                   
                })
                .catch(err => {
                    $log('getOrderList', err);
                    this.loading = false;
                });

        },

        handleSizeChange: function(params) {
            console.log('params:', params);
            this.searchObj.paging.limit = params;
            this.searchObj.paging.pageIndex = 1;
            this.search();
        },

        handleCurrentChange: function(params) {
            console.log('handleCurrentChange:', params);
            this.search();
        },

        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        // 删除工单
        deleteWork(id){
            this.$confirm('删除后，您将无法恢复和查看该工单，请谨慎操作。您确定要删除该工单吗?', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 关闭工单
        closeWork(id){
            this.$confirm('关闭后将停止受理，请确认问题已得到解决。确定关闭该工单', '关闭确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    },

    created(){
        this.search();
    }
};
</script>
<style lang="scss" scoped>
.workList{
    width: 200px;
}
</style>
