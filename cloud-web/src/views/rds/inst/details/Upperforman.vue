<template>
    <div class="mt10">
        <page-header>
            资源分析
        </page-header>
        <el-row class="mt10">
            <el-col :span="24">
                <el-table  :data="tableData" stripe border class="data-list">
                    <el-table-column v-for="column in tableColumns" :width="column.width ? column.width : 'auto'" :prop="column.prop" :label="column.label"  :key="column.label">
                        <template slot-scope="scope">
                            <span v-if="scope.row[column.prop] === null">
                                <i class="el-icon-loading"></i>
                            </span>
                            <span v-else>{{scope.row[column.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

    </div>
</template>
<script>
import {getPerformance} from '@/service/rds/detail';
const tableColumns = [
    {
        prop: 'resourceName',
        label: '资源名称'
    },
    {
        prop: 'use',
        label: '使用情况',
        render: true
    },
    {
        prop: 'minValue',
        label: '最小值(%)',
        render: true
    },
    {
        prop: 'maxValue',
        label: '最大值(%)',
        render: true
    },
    {
        prop: 'avgValue',
        label: '平均值(%)',
        render: true
    },
    {
        prop: 'referenceValue',
        label: '参考值'
    },
    {
        prop: 'desc',
        label: '说明',
        width: '300px'
    }
];
export default {
    name: 'Upperforman',
    data() {
        return {
            tableColumns,
            tableData: [
                {
                    code: 'rds001_cpu_usage',
                    resourceName: 'CPU',
                    use: null,
                    maxValue: null,
                    minValue: null,
                    avgValue: null,
                    referenceValue: '20%-40%',
                    desc: '数据库引擎CPU的开销'
                },
                {
                    code: 'rds002_mem_usage',
                    resourceName: '内存',
                    use: null,
                    maxValue: null,
                    minValue: null,
                    avgValue: null,
                    referenceValue: '40%-85%',
                    desc: '数据库缓存和连接内存的开销'
                },
                {
                    code: 'rds039_disk_usage',
                    resourceName: '存储空间',
                    use: null,
                    maxValue: null,
                    minValue: null,
                    avgValue: null,
                    referenceValue: '30%-60%',
                    desc: '数据库数据和日志文件的开销'
                }
            ]
        };
    },
    computed: {
        instId: function() {
            return this.$route.params.id;
        }
    },
    created() {
        this.tableData.forEach(item => {
            this.getPerformance(item);
        });
    },
    methods: {
        // 获取监控数据
        getPerformance(item) {
            getPerformance(this.instId, item.code).then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    let result = res.result;
                    item.minValue = result.minValue;
                    item.maxValue = result.maxValue;
                    item.avgValue = result.avgValue;
                    let max = 0, min = 0;
                    if (item.code == 'rds001_cpu_usage') {
                        max = 40;
                        min = 20;
                    } else if (item.code == 'rds002_mem_usage') {
                        max = 85;
                        min = 40;
                    }else if (item.code == 'rds039_disk_usage') {
                        max = 60;
                        min = 30;
                    }
                    if (item.avgValue < min) {
                        item.use = '过剩';
                    } else if (item.avgValue >= min && item.avgValue < max){
                        item.use = '良好';
                    } else if (item.avgValue >= max) {
                        item.use = '过度';
                    }
                }
            });
        }
    }
};
</script>
<style scoped>
</style>
