<template>
    <el-dialog
        title="转交"
        :visible.sync="isShow"
        width="45%"
        class="TransferDialog">
        <div style="width: 300px;">
            <el-input placeholder="请输入内容" v-model="searchName" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div class="table mt20">
            <el-table :data="tableData"  header-row-class-name="data-list">
                <template v-for="col in cols">
                    <template v-if="col.column=='option'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <el-radio v-model="sel_supple" :label="scope.row.id"></el-radio>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-if="col.column=='name'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                        </el-table-column>
                    </template>
                    <template v-if="col.column=='depart'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                        </el-table-column>
                    </template>
                    <template v-if="col.column=='role'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            
                        </el-table-column>
                    </template>
                </template>
            </el-table>
        </div>
        <!-- 备注 -->
        <el-form inline-message :model="ruleForm" label-width="100px" :rules="rules" style="width:452px;" size="small"  ref="ruleForm">
            <el-form-item label="备注" prop="remark">
                <textarea class="remark-text" v-model="ruleForm.remark"></textarea>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {transferList} from '@/service/order.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            searchName: '',
            sel_supple: '',
            ruleForm:{
                remark:'',
            },
            rules:{
                remark: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            tableData: [
                {id: '1', name: 'admin', depart: 'dept-appcloud', role: '超级管理员'},
                {id: '2', name: 'admin', depart: 'dept-appcloud', role: '超级管理员'},
                {id: '3', name: 'admin', depart: 'dept-appcloud', role: '超级管理员'},
                {id: '4', name: 'admin', depart: 'dept-appcloud', role: '超级管理员'},
            ],
            cols: [
                { column: 'option', text:'' },
                { column: 'name', text: '名称'},
                { column: 'depart', text:'部门'},
                { column: 'role', text:'角色类型'}
            ]
        }; 
    },
    watch: {
        isShow(val) {
            if(!val){
                this.$refs['ruleForm'].resetFields();
            }
        }
    },
    methods: {
        show(params) {
            this.isShow = true;
            this.getTransferList();

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
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            if (!this.$refs['ruleForm']) return false;
            
            // 表单验证
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.hide();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获得转交工单列表
        getTransferList() {
            transferList()
                .then((res) => {
                    $log(res);
                }).catch((err) => {
                    $log(err);
                });
        }
    }
};
</script>
<style lang="scss">
.TransferDialog{
    .el-radio .el-radio__label{
        display: none;
    }
    .remark-text{
        min-width: 100%;
        max-width: 100%;
        min-height: 60px;
        max-height: 60px;
    }
}
</style>
