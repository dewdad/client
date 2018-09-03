<template>
    <div>
        <el-tabs type="card" value="1">
            <el-tab-pane label="待审批" name="1"></el-tab-pane>
            <el-tab-pane label="已审批" name="2"></el-tab-pane>
            <el-tab-pane label="审批拒绝" name="3"></el-tab-pane>
            <el-tab-pane label="打款确认中" name="4"></el-tab-pane>
        </el-tabs>
        <el-row>
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-select placeholder="请选择搜索类型">
                            <el-option label="姓名" value="shanghai"></el-option>
                            <el-option label="公司名称" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input placeholder="搜索关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期">
                        <el-date-picker
                                v-model="value6"
                                type="datetimerange"
                                size="small"
                                style="width:300px"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['12:00:00']">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border>
                    <el-table-column prop="date" label="租户姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="name" label="认证类型" width="180">
                    </el-table-column>
                    <el-table-column prop="address" label="公司名称">
                    </el-table-column>
                    <el-table-column prop="address" label="部门">
                    </el-table-column>
                    <el-table-column prop="address" label="申请时间">
                    </el-table-column>
                    <el-table-column prop="address" label="状态">
                    </el-table-column>
                    <el-table-column prop="address" label="操作">
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background layout="prev, pager, next" :total="1000">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- <real-auth-dailog ref="RealAuthDailog"></real-auth-dailog> -->
    </div>
</template>
<script>
import RealAuthDailog from './components/RealAuthDailog';
export default {
    name: 'app',
    data() {
        return {
            formInline: {},
            tableData: [],
            value6:''
        };
    },
    components: {
        RealAuthDailog
    },
    methods: {
        onSubmit() {}
    }
};
</script>
<style scoped>
</style>
