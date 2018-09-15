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
        <div class="table">
            <!-- <el-table :data="tableData"  header-row-class-name="data-list">
                <template v-for="col in cols">
                    
                    <template v-if="col.column=='orderNO'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="font12 mr10">{{scope.row.orderNO}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    
                    <template v-if="col.column=='orderTitle'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <a class="font12 mr10" @click="showDetail(scope.row)">{{scope.row.title}}</a>
                            </template>
                        </el-table-column>
                    </template>
                    
                    <template v-if="col.column=='phone'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="font12 mr10">{{scope.row.mobile}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-if="col.column=='productType'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="font12 mr10">{{scope.row.productType}}</span>
                            </template>
                        </el-table-column>
                    </template>
                </template>
            </el-table> -->
        </div>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
// import {transferList} from '@/service/order.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            searchName: '',
            ruleForm:{
                supple:'',
            },
            rules:{
                supple: [
                    { required: true, message: '请输入补充说明', trigger: 'blur' }
                ]
            }
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
        // 
        // getTransferList() {

        // }
    }
};
</script>
<style lang="scss">
.TransferDialog{}
</style>
