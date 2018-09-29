<template>
    <el-dialog
        title="转交"
        :visible.sync="isShow"
        width="45%"
        class="TransferDialog">
        <div style="width: 300px;">
            <el-input placeholder="请输入内容" v-model="searchName" @change="changeSearch" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getTransferList"></el-button>
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
                            <template slot-scope="scope">
                                <span class="font12 mr10">{{scope.row.userName}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-if="col.column=='depart'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="font12 mr10">{{scope.row.deptId}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-if="col.column=='role'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="font12 mr10" v-if="scope.row.roleType==1">超级管理员</span>
                                <span class="font12 mr10" v-if="scope.row.roleType==2">部门管理员</span>
                                <span class="font12 mr10" v-if="scope.row.roleType==3">子部门管理员</span>
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
        </div>
        <!-- 备注 -->
        <el-form inline-message :model="ruleForm" label-width="100px" :rules="rules" style="width:452px;" size="small"  ref="ruleForm">
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" class="remark-text" v-model="ruleForm.remark"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {transferList,orderTODO} from '@/service/order.js';
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
        return {
            isShow: false,
            resolve: null,
            searchObj,
            reject: null,
            searchName: '',
            sel_supple: '',
            ruleForm:{
                remark:'',
            },
            item:{},
            rules:{
                remark: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            tableData: [

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
            this.item = params;
            console.log('params',params);
            this.ruleForm.remark = params.remark;
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
                    let param = {
                        remark:this.ruleForm.remark,
                        srcUserId:this.item.userId,
                        descUserId:this.sel_supple,
                        orderNO:this.item.orderNO,
                    };
                    orderTODO(param)
                        .then(res => {
                            console.log('redssssssss',res);
                            if(res.code === '0000'){
                                this.resolve(param);
                                this.hide();
                                this.setting();
                                this.confirmBtn = false;
                                return this.$alert('操作成功','提示');
                            }else{
                                this.$alert('操作失败', '提示', {
                                    type: 'error'
                                });
                                this.confirmBtn = false;
                                return;
                            }
                        })
                        .catch(err => {
                            this.confirmBtn = false;
                            this.$alert(err, '提示', {
                                type: 'error'
                            });
                        });
                    this.hide();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        changeSearch(){
            if(this.searchName){
                this.getTransferList();
            }
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.getTransferList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.getTransferList();
        },
        // 获得转交工单列表
        getTransferList() {
            let params = {
                paging:this.searchObj.paging
            };
            if(this.searchName){
                params.searchName = this.searchName;
            }
            transferList(params)
                .then((res) => {
                    $log(res);
                    let resData = res.data;
                    if(resData && resData.data){
                        this.tableData = resData.data || [];
                        this.searchObj.paging.totalItems = resData.total || 0;
                    }
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
