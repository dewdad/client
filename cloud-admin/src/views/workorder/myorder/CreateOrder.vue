<template>
    <el-dialog title="创建工单" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules" label-width="120px">
            <!-- 标题 -->
            <el-form-item label="标题" prop="orderTitle"  >
                <el-input   v-model="form.orderTitle"></el-input>
            </el-form-item>

            <!-- 描述 -->
            <el-form-item label="描述" prop="orderDesc" >
                <el-input clearable type="textarea" v-model="form.orderDesc"></el-input>
            </el-form-item>

            <!-- 联系方式 -->
            <el-form-item label="联系方式" prop="phone"  >
                <el-input clearable v-model="form.phone"></el-input>
            </el-form-item>

            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email"  >
                <el-input clearable v-model="form.email"></el-input>
            </el-form-item>
            <!-- 附件 -->
            <el-form-item label="附件"  >
                <el-upload
                        class="upload-demo"
                        action="http://10.11.3.99:7100/fileProcess/upload"
                        :on-change="change"
                        :limit="1"
                        :on-exceed="handleExceed"
                        list-type="picture"
                        :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
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
import {createOrder} from '@/service/order.js';
export default {
    data() {
        let validateEmail = function(rule, value, callback){
            let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的邮箱格式'));
            } else {
                callback();
            }
        };
        let validatePhone = function(rule, value, callback){
            let reg = /^1[3|5|7|8|]\d{9}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号码格式'));
            } else {
                callback();
            }
        };
        return{
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            brunch:{},
            item:{},
            fileList: [],
            responseFile:{},
            domainName:'',
            form:{
                orderTitle: '',
                orderDesc: '',
                phone: '',
                email: ''
            },
            rules:{
                'orderTitle':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'orderDesc':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'phone':[
                    { required: true,message: '必填项',trigger: ['blur']},
                    { validator: validatePhone, trigger: 'blur' }
                ],
                'email':[
                    { required: true,message: '必填项',trigger: ['blur']},
                    { validator: validateEmail, trigger: 'blur' }
                ],

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
        show() {
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
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        change(file){
            console.log('file',file);
            this.responseFile = file;
        },
        handleExceed(files, fileList) {
            this.$alert(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        //保存（提交）
        submitForm() {
            this.confirmBtn = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.form.orderAttach = this.responseFile.response.data[0];
                    createOrder(this.form).then(ret => {
                        if(ret.data.code === '0000'){
                            this.confirmBtn = false;
                            this.hide();
                            this.setting();
                            this.$alert('操作成功','提示');
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
  }
</style>
