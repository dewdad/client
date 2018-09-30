<template>
    <el-dialog title="重置密码" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="新密码" prop="newPwd" :label-width="formLabelWidth">
                <el-input placeholder="输入新密码" type="password" v-model="form.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd" :label-width="formLabelWidth">
                <el-input placeholder="再次输入密码" @blur="checkPwd" @change="checkPwd" v-bind:class="{ borderRed: invalidPsd }" type="password" v-model="form.confirmPwd"></el-input>
                <div v-if="invalidPsd" style="color: #f56c6c;font-size: 12px;text-align:left;line-height:1.6">两次密码不一致</div>
            </el-form-item>

            <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                <el-input placeholder="再次输入用户名称" v-model="form.username" disabled></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {resetPwd} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        return{
            formLabelWidth: '120px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            invalidPsd:false,
            form:{
                newPwd:'',
                username:'',
                confirmPwd:'',
            },
            rules:{
                newPwd: [
                    { required: true, message: '请输新密码', trigger: 'blur,submit' }
                ],
                confirmPwd: [
                    { required: true, message: '请确认密码', trigger: 'blur,submit' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur,submit' }
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
            console.log('item',item);
            this.form.username = item.name;
            this.form.confirmPwd = '';
            this.form.newPwd = '';
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        hide() {
            this.isShow = false;

        },
        checkPwd(){
            if(this.form.newPwd !== this.form.confirmPwd) {
                this.invalidPsd = true;
            } else {
                this.invalidPsd = false;
            }
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
        confirm() {
            this.confirmBtn = true;
            this.form.userId = this.item.id;
            console.log('this.form',this.form);
            if(this.form.newPwd !== this.form.confirmPwd) {
                this.invalidPsd = true;
                this.confirmBtn = false;
                return;
            } else {
                this.invalidPsd = false;
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    resetPwd(this.form)
                        .then(res => {
                            console.log('resddddd',res);
                            if(res.data.code === '0000'){
                                this.resolve(this.form);
                                this.hide();
                                this.setting();
                                this.confirmBtn = false;
                                return this.$alert('操作成功','提示');
                            }else{
                                this.$alert('修改失败', '提示', {
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
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
};
</script>
<style lang="scss" scoped>
    .borderRed{
        border-color:#f56c6c;
    }
</style>
