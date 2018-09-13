<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            我的工单
            <div slot="right">
                <el-button type="primary" size="small">创建工单</el-button>                
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 搜索筛选栏 -->
        <div class="mt20 mb20 font12">
            <span class="mr10">产品类型：</span>
            <el-select v-model="value" size="small" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <span class="ml10 mr10">时间范围：</span>
            <el-date-picker
            v-model="value6"
            type="datetimerange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
            </el-date-picker>
            <span class="ml10 mr10">工单编号：</span>
            <el-input class="workList mr10" v-model="workList" size="small"></el-input>
            <el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
        </div>
        <!-- 列表 -->
        <div>
            <el-table class="font12 data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
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
        </div>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';

let tableData = [
    {
        name: '201806281527221501',
        id: '201806281527221501',
        lable: '下载',
        volume_type:'云服务器ECS',
        bootable: '远程连接',
        countSnapshot:'2018-06-28 15:27:22',
        status:'运行中',
        nettype: '专有网络',
        cfginfo: '配置',
        paytype:'付费方式',
        diskStatus: '运行中'

    }
];
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
export default {
    data() {
        return {
            options:[
                {value: '1',label: '黄金'},
                {value: '2',label: '黄金糕'}
            ],
            value: '1',
            value6: '',
            workList: '',
            tableData,
            cols
        };
    },
    components: { 
        PageHeader
    },
    methods: {
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
    }
};
</script>
<style lang="scss" scoped>
.workList{
    width: 200px;
}
</style>
