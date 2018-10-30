<template>
    <el-dialog title="审批申请" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules" label-width="120px">
            <!-- 是否通过 -->
            <el-form-item label="是否通过"  prop="status">
                <el-radio v-model="form.status" :label="2">是</el-radio>
                <el-radio v-model="form.status" :label="3">否</el-radio>
            </el-form-item>
            <!-- 标题 -->
            <el-form-item label="审批描述" prop="approveRemark"  v-if="form.status == 3">
                <el-input   v-model="form.approveRemark" placeholder="审批描述，不得超过100字!"></el-input>
            </el-form-item>

            <!-- 账户名 -->
            <el-form-item label="账户名" prop="userName" v-if="form.status == 2">
                <el-input clearable  v-model="form.userName" ></el-input>
            </el-form-item>
            <!-- 账户密码 -->
            <el-form-item label="账户密码" prop="userPass" v-if="form.status == 2">
                <el-input clearable  v-model="form.userPass" ></el-input>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="submitForm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {applyRequest} from '@/service/usermgr/free.js';
export default {
    data() {

        return{
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,

            item:{},

            form:{
                approveRemark: '', //审批描述
                status: 2, //是否通过
                userName: '', //账户名
                userPass: '', //账户密码
            },
            radio2: 3,
            rules:{
                'userName':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'userPass':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ]

            }
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    props: {},
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;
            this.form = {
                approveRemark: '', //审批描述
                status: 2, //是否通过
                userName: '', //账户名
                userPass: '', //账户密码
            };
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
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
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },

        //保存（提交）
        submitForm() {
            this.confirmBtn = true;
            this.$refs.form.validate((valid) => {
                if (valid) {

                    applyRequest(this.item.id,this.form).then(ret => {
                        console.warn(ret);
                        if(ret && ret.code === '0000'){
                            this.confirmBtn = false;
                            this.hide();
                            this.setting();
                            return;
                        }else{
                            this.$alert('操作失败', '提示', {
                                type: 'error'
                            });
                            this.confirmBtn = false;
                        }

                    });
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });

        },

    },
    mounted(){

    }
};
</script>
<style lang="scss">
  .upload-demo input[type='file']{
      display: none;
  };
  .prioritytip {
      font-size: 12px;
      color: #333;
      padding: 10px 20px;
      border: 1px solid #8DACEB;
      background-color: #edf2fc;
      line-height: 1;
  }
</style>
