<template>
    <div class="mt10">
        <!-- <page-header class="page-header-second">
            参数设置
        </page-header> -->
        <el-row>
            <el-col :span="24">
                <div class="search-box">
                    <zt-form :inline="true" size="small" class="search-form-inline">
                        <zt-form-item label="参数名称">
                            <el-input placeholder="" v-model="keywords"></el-input>
                        </zt-form-item>
                    </zt-form>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table v-loading="loading" :data="tableData" stripe border class="data-list mt10">
                    <el-table-column v-for="column in tableColumns" :width="column.width ? column.width : 'auto'" :prop="column.prop" :label="column.label" :key="column.label">
                        <template slot-scope="scope">
                            <div v-if="column.prop === 'valueRange'">
                                <el-popover placement="top" transition="scale" trigger="hover">
                                    <div class="pd10" style="word-break:break-all;max-width: 200px; max-height:300px;overflow-y: auto;">{{scope.row[column.prop]}}</div>
                                    <span slot="reference">{{scope.row[column.prop]|cut(0, 15)}}</span>
                                </el-popover>
                            </div>
                            <div v-else-if="column.prop === 'value'">
                                {{scope.row[column.prop]}}
                                <a v-if="scope.row['readonly'] === '0'" href="javascript:;" @click="editParams(scope.row, scope.$index)" class="el-button el-button--text pull-right color-secondary">
                                    <i class="iconfont icon-edit_people"></i>
                                </a>
                            </div>
                             <div v-else-if="column.prop === 'readonly'">
                                {{scope.row[column.prop] === '0' ? '是': '否'}}
                            </div>
                            <div v-else>
                                {{scope.row[column.prop]}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-if="!loading" class="pagination">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.currentPage" :page-sizes="[20, 50, 100]" :page-size="pagination.pageSize" layout="sizes, prev, pager, next, total" :total="filterData.length">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- 修改参数弹框 -->
        <el-dialog v-if="isShow" title="修改运行参数值" :visible.sync="isShow" :append-to-body="true" :close-on-click-modal="false" @close="isShow=false">
            <div class="form" style="padding-right:250px;">
                <zt-form v-loading="isSubmit" loading="empty" ref="myForm"  label-width="100px" :model="myForm" size="small" inline-message>
                    <zt-form-item label="参数名">
                        {{myForm.name}}
                    </zt-form-item>
                    <zt-form-item v-if="myForm.datatype === 'string' || myForm.datatype === 'boolean' || myForm.datatype === 'list'" label="参数值" prop="value" :rules="[{required: true, message: '参数值不能为空', trigger: 'change'}]">
                        <el-select v-model="myForm.value" :multiple="myForm.datatype === 'list'" placeholder="请选择">
                            <el-option v-for="item in myForm.valueRange.split('|')" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </zt-form-item>
                    <zt-form-item v-if="myForm.datatype === 'integer'" label="参数值" prop="value" :rules="[{required: true, message: '参数值不能为空', trigger: 'change'}]">
                        <el-input-number style="width: 100%;" v-model="myForm.value" controls-position="right" :min="myForm.valueRange.split('-')[0]" :max="myForm.valueRange.split('-')[1]"></el-input-number>
                        <!-- <el-input  v-model="myForm.runvalue" placeholder="请输入参数值"></el-input> -->
                        <span slot="help" class="input-help">
                            输入范围：[{{myForm.valueRange}}]
                        </span>
                    </zt-form-item>
                </zt-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm" :loading="isSubmit" :disabled="isSubmit" size="small">确定</el-button>
                <el-button type="info" @click="isShow=false" :disabled="isSubmit" size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getParameters, putParameters} from '@/service/rds/detail';
import {cloneDeep} from '@/utils/utils';
// 表列
const tableColumns = [
    {
        prop: 'name',
        label: '参数名',
        width: '250px'
    },
    {
        prop: 'value',
        label: '运行参数值'
    },
    {
        prop: 'valueRange',
        label: '参数值说明'
    },
    {
        prop: 'needRestart',
        label: '是否重启'
    },
    {
        prop: 'readonly',
        label: '是否充许修改',
        width: '120px'
    },
    {
        prop: 'description',
        label: '参数描述',
        width: '300px'
    }
];
export default {
    data() {
        return {
            loading: true,
            // 显示OR隐藏弹框
            isShow: false,
            isSubmit: false,
            tableColumns,
            sourceDate: [],
            pagination: {
                total: 0,
                pageSize: 10,
                currentPage: 1
            },
            // 关键字过滤
            keywords: '',
            // 修改运行参数表单
            myForm: {
                name: '',
                value: '',
                datatype: '',
                valueRange: '',
                index: ''
            }
        };
    },
    computed: {
        // 通过计算返回当前页的数据
        tableData: function() {
            let arr = this.filterData.filter((item, index) => {
                let start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
                $log(start);
                return index > start && index < start + this.pagination.pageSize;
            });
            return arr;
        },
        // 根据关键字过滤得到的分页数据
        filterData: function() {
            return this.sourceDate.filter((item, index) => {
                return item.name.includes(this.keywords);
            });
        },
        instId: function() {
            return this.$route.params.id;
        }
    },
    watch: {
        isShow: function(newval) {
            if (!newval) { // 关闭时清空表单记录
                this.myForm = {};
                this.isSubmit = false;
                this.$refs.myForm.clearValidate();
            }
        },
        keywords: function() {
            this.pagination.currentPage = 1;
        }
    },
    created() {
        this.getParameters();
    },
    methods: {
        // 获取所有参数
        getParameters() {
            getParameters(this.instId)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let datas = JSON.parse(res.result);
                        // this.tableData = datas.configuration.parameters;
                        // 将获取到的参数放到sourceDate源对象中
                        this.sourceDate = cloneDeep(datas.configuration.parameters);
                        // 参数个数
                        this.pagination.total = this.sourceDate.length;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        // 显示修改参数弹框
        editParams(row, index) {
            this.myForm = row;
            this.myForm['index'] = index;
            this.isShow = true;
        },
        confirm() {
            this.$refs.myForm.validate(valid => {
                if (valid) {
                    let body = {};
                    this.isSubmit = true;
                    body[this.myForm.name] = this.myForm.value;
                    putParameters(this.instId, body).then(res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            this.$message.success('参数设置成功');
                            // 设置列表中为最新修改的值
                            this.sourceDate.map(item => {
                                if (item.name === this.myForm.name) {
                                    item.value = this.myForm.value;
                                }
                                return item;
                            });
                            // 关闭弹框
                            this.isShow = false;
                        }
                    }).catch(err => {
                        $log(err);
                    }).finally(() => {
                        this.isSubmit = false;
                    });
                }
            });
        }
    }
};
</script>
<style lang='scss' scoped>
</style>
