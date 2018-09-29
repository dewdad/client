<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            我的工单
            <div slot="right">
                <el-button type="primary" size="small" @click="$router.push({name:'app.ticketSystem.submitticket'})">创建工单</el-button>                
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh" @click="search"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 搜索筛选栏 -->
        <div class="mt20 mb20 font12">
            <span class="mr10">产品类型：</span>
            <el-select v-model="searchObj.moduleType" size="small" placeholder="请选择" clearable  value-key="value">
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
            type="daterange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
            </el-date-picker>
            <span class="ml10 mr10">工单编号：</span>
            <el-input class="workList mr10" v-model="searchObj.orderNO" size="small"></el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <!-- 列表 -->       
        <div v-loading="loading">
            <el-table class="font12 data-list" :data="tableDataList" @filter-change="filterHandler" header-row-class-name="data-list" style="width: 100%">
                <template v-for="col in cols">
                    <!-- 工单编号 -->
                    <template v-if="col.column=='orderNO'">
                        <el-table-column width="200" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.orderNO}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 问题标题 -->
                    <template v-if="col.column=='title'">
                        <el-table-column min-width="200" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 产品类型 -->
                    <template v-if="col.column=='moduleType'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.moduleType | showTextByKey(moduleTypes,'value','label') }}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 故障类型 -->
                    <template v-if="col.column=='orderType'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{ parseOrderType(moduleTypes,scope.row.orderType) }}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="col.column=='createTime'">
                        <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | date}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 状态 -->
                    <template v-if="col.column=='status'">
                        <el-table-column min-width="80" :prop="col.column" :label="col.text" :key="col.column" 
                        :filters="col.dropdowns"
                        :filter-multiple="false" 
                        :filtered-value="[searchObj.status]">
                            <template slot-scope="scope">
                                <span>{{scope.row.status | showTextByKey(orderStatus) }}</span>
                            </template>
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template>
                    <el-table-column label="操作" key="op" width="250">
                        <template slot-scope="scope">
                            <!-- 查看 -->
                            <router-link :to="{ name: 'app.ticketSystem.info', params: { id: scope.row.orderNO }}" class="color-primary finger-cursor" >查看</router-link>
                            <b class="link-division-symbol"></b>
                            <!-- 关闭 -->
                            <span @click="closeWork(scope.row.id)" class="color-primary finger-cursor">关闭</span>
                            <b class="link-division-symbol"></b>
                            <!-- 删除 -->
                            <span @click="deleteOrder(scope.row.id)" class="color-primary finger-cursor">删除</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="pagination">
                <el-pagination 
                    background 
                    @size-change="handleSizeChange" 
                    :current-page.sync="searchObj.paging.pageIndex"
                    @current-change="handleCurrentChange" 
                    :page-size="searchObj.paging.limit" 
                    layout="sizes, prev, pager, next" 
                    :total="searchObj.paging.totalItems">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';

import { getOrderList,deleteOrder,closeOrder } from '@/service/ticket.js';


export default {
    components: { 
        PageHeader
    },
    data() {
        let orderStatus = [
            {key:'' ,'text':'全部',value:''},
            {key:1,'text':'待审核',value:'1'},
            {key:2,'text':'处理中',value:'2'},
            {key:3,'text':'待确认',value:'3'},
            {key:4,'text':'已完成',value:'4'}
        ];
        let cols = [
            { column: 'orderNO', text: '工单编号', width: '20%' },
            { column: 'title', text: '问题标题', width: '4%' },
            { column: 'moduleType', text: '产品类型', width: '4%' },
            { column: 'orderType', text: '故障类型', width: '4%' },
            { column: 'createTime', text: '提交时间', width: '10%' },
            { 
                column: 'status',
                text: '状态',
                width: '4%',
                dropdowns: orderStatus, 
            }
        ];
        let moduleTypes = [
            {value: '1', label: '弹性云主机',
                orderTypes: [
                    {value: 10, label: '远程连接'},
                    {value: 11, label: '镜像'},
                    {value: 12, label: '安全组配置'},
                    {value: 13, label: '升降配'},
                    {value: 14, label: '磁盘扩容'},
                    {value: 15, label: '挂载磁盘'}
                ]
            },
            // {value: '2', label: '云数据库RDS',
            //     orderTypes: [
            //         {value: 20, label: '版本/规格'},
            //         {value: 21, label: '只读实例'},
            //         {value: 22, label: '监控与报警'},
            //         {value: 23, label: '日志'},
            //         {value: 24, label: '参数设置'},
            //         {value: 25, label: '备份恢复'}
            //     ]
            // },
            {value: '3', label: '对象存储OSS',
                orderTypes: [
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
            // {value: '4', label: '云数据库Redis', orderTypes: []},
            // {value: '5', label: '弹性伸缩', orderTypes: []},
            {value: '6', label: '专有网络VPC',
                orderTypes: [
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
            status: ''      
        };
        return {
            searchObj,
            loading: false,
            moduleTypes,    
            tableDataList:[],
            cols,
            orderStatus,
        };
    },    
    methods: {
        //查询
        search(){
            let { paging:{ pageIndex,limit },daterange,orderNO,moduleType,status } = this.searchObj;
            let data = {
                pageIndex,
                limit,
                startTime: daterange && daterange[0],
                endTime: daterange && daterange[1],
                orderNO,
                moduleType: moduleType.value, 
                status,
            };           
            this.loading = true;
            getOrderList(data)
                .then( res => {     
                    this.loading = false;              
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data || {};
                        if(resData.data){
                            this.tableDataList = resData.data || [];
                            this.searchObj.paging.totalItems = resData.total || 0;
                        }                        
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
        filterHandler(filters) {
            $log('filters::::',filters);          
            let values = Object.values(filters);
            let value = values[0][0];
            if (value) {
                this.searchObj.status = value;
            } else {
                this.searchObj.status = '';
            }
            this.search();
        },

        //根据
        parseOrderType(moduleTypes,val){
            let orderTypeText = '';
            if(moduleTypes && Array.isArray(moduleTypes) ){                
                moduleTypes.some( mt => {
                    let orderTypes = mt.orderTypes;
                    if(orderTypes && Array.isArray(orderTypes) ){
                        let orderType = orderTypes.find( ot => {
                            return ot.value === val;
                        });                        
                        if(orderType){
                            orderTypeText = orderType.label;
                            return true; 
                        }else {
                            return false;
                        }                        
                    }
                });               
            }
            return orderTypeText;
        },


        // 删除工单
        deleteOrder(id){
            this.$confirm('删除后，您将无法恢复和查看该工单，请谨慎操作。您确定要删除该工单吗?', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let date = {
                        req_param: id
                    };
                    deleteOrder(date)
                        .then( res => {
                            if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('删除成功');
                                this.search();
                            }                        
                        })
                        .catch( (err) => {
                            $log(err);                          
                        });
                })
                .catch( () => {
                            
                });
        },
        
        // 关闭工单
        closeWork(id){
            this.$confirm('关闭后将停止受理，请确认问题已得到解决。确定关闭该工单', '关闭确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message.success('操作成功');
                let date = {
                    id: id,
                    status: 1
                };
                closeOrder(date)
                    .then( res => {
                        if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                            this.$message.success('关闭成功');
                            this.search();
                        }                        
                    })
                    .catch( (err) => {
                        $log(err);                          
                    });

            }).catch(() => {         
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
