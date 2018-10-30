<template>
    <el-dialog title="修改用户" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules" label-width="120px">
            <!-- 名称 -->
            <el-form-item label="部门" prop="deptId"  >
                <el-input   :value="domainName" disabled></el-input>
            </el-form-item>

            <!-- 名称 -->
            <el-form-item label="名称" prop="name" >
                <el-input clearable :maxlength="100" v-model="form.name"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email" >
                <el-input clearable type="email" v-model="form.email"></el-input>
            </el-form-item>
            <!-- 描述 -->
            <el-form-item label="描述" prop="description"  >
                <el-input clearable type="textarea" v-model="form.description"></el-input>
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
import {editUser} from '@/service/usermgr/deptmgr.js';
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
        return{
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            brunch:{},
            item:{},
            domainName:'',
            form:{
                name: '',
                deptId: '',
                description: '',
                email: '',

            },
            rules:{
                'name':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'email':[
                    { validator: validateEmail, trigger: 'blur' }
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
        show(item,brunch) {
            this.isShow = true;
            this.item = item;
            console.log('iiii',item);
            this.form.name = item.name;
            this.form.description = item.description;
            this.form.email = item.email;
            this.brunch = brunch;
            this.domainName = brunch.name;
            this.form.deptId = brunch.id;
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
            let param = {
                data:{
                    email:this.form.email,
                    deptId:this.brunch.id,
                    name:this.form.name,
                    description:this.form.description,
                },
                id:this.item.id
            };
            console.log('param',param);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    editUser(param).then(ret => {
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

</style>
