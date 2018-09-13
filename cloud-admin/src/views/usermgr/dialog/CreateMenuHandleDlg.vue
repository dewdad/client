<template>
    <el-dialog v-dialogDrag :title="title + '操作'" :visible.sync="isShow" width="600px" class="menu-handler" @close="cancel">
        <el-form inline-message size="small" label-width="120px" class="input-width" :model="handler" :rules="rules" ref="menuHandlerForm">
            <el-form-item label="菜单编码" prop="menuCode">
                <span>{{ handler.menuCode}}</span>
            </el-form-item>

            <el-form-item label="操作名称" prop="opName">
                <el-input v-model="handler.opName"></el-input>
            </el-form-item>

            <el-form-item label="关联方法" prop="opMethod">
                <el-input v-model="handler.opMethod"></el-input> 
            </el-form-item>

            <el-form-item label="关键字" prop="opKey">
                <el-input v-model="handler.opKey"></el-input>
                <!-- <div class="input-help">多个参数以逗号隔开，如item,itemList</div>  -->
            </el-form-item>

            <el-form-item label="url" prop="opUrl">
                <el-input v-model="handler.opUrl"></el-input>               
            </el-form-item>

            <el-form-item label="描述 " prop="description">
                <el-input type="textarea" :rows="2" v-model="handler.description"></el-input>              
            </el-form-item>

            <!-- <el-form-item label="是否选择" prop="selected">
                <el-radio-group v-model="handler.selected">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>                    
            </el-form-item> -->
        </el-form>

        <span slot="footer" class="dialog-footer">

            <el-button type="info" class="font12" size="small" @click="cancel">取消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm" :loading="loading">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { addMenuOp,updateMenuOp } from '@/service/usermgr/menumgr';

export default {
    data() {
        return{           
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            title: '',
            opType: 1, //1:创建 ； 2：编辑

            rowItem:{},
            handler: {
                menuCode:this.$route.params.code || '',
                opName:'',
                opMethod:'',
                opKey:'',
                opUrl:'',
                description:'',
                //selected: true,            
            },
            rules: {
                opName: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit']
                    },                    
                ],
                opMethod: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit']
                    },                    
                ],
                opKey: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: ['submit']
                    },                    
                ],
            }
        };
    },
    props: {},
    methods: {
        show(rowItem,optype) {
            this.rowItem = rowItem;
            this.opType = optype;
            if(optype == 1){//创建
                this.title = '创建'; 
            }else if(optype == 2){//编辑
                this.title = '编辑';
                Object.assign(this.handler,rowItem);
            }

            this.isShow = true;         
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            //数据恢复到初始化数据
            this.rowItem = {};
            this.opType = 1;
            this.handler = {
                menuCode:this.$route.params.code || '',
                opName:'',
                opMethod:'',
                opKey:'',
                opUrl:'',
                description:'',
                //selected: true,
            };
            this.loading = false;
            this.$refs['menuHandlerForm'].clearValidate();
        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },       
        confirm() { 
            this.$refs['menuHandlerForm'].validate( valid => {
                if(valid){                   
                    let saveInfoFn = addMenuOp; //默认新增接口
                    if (this.opType === 2) saveInfoFn = updateMenuOp; //如果是修改

                    this.loading = true;
                    saveInfoFn(this.handler)
                        .then( result => {
                            this.loading = false;
                            if (result && result.code === this.CODE.SUCCESS_CODE) {                                
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });   
                                this.hide();
                                this.resolve(this.handler);                            
                            } else {                                
                                this.$message.error(result.msg);
                            }
                        })
                        .catch((err) => {
                            this.loading = false;
                            // 显示异常
                            this.$message.error(err);
                        });
                }
            });  
        },
       



    }
};
</script>
<style lang="scss" scoped>
.menu-handler {
    .input-width {
        width: 360px;
    }
}
</style>
