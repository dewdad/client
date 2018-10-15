<template>
    <el-dialog title="设置网关" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-alert
                    title="您可以将一个指定的外部网络连接到路由器.外部网络将作为路由器的默认路由同时将扮演外部连接网关的角色"
                    type="info"
                    :closable="false">
            </el-alert>
            <el-form-item label="外部网络：" prop="networkId" :label-width="formLabelWidth" class="mt20">
                <el-select v-model="form.networkId">
                    <el-option v-for="item in pull" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="路由名称："  :label-width="formLabelWidth">
                <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="路由id："  :label-width="formLabelWidth">
                <el-input v-model="form.id" disabled></el-input>
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
import {listSDK,editRouter} from '@/service/cloudres.js';
export default {
    data() {
        return{
            formLabelWidth: '130px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            optype:1,
            pull:[],
            item:{},
            form:{
                networkId:'',
                name:'',
                id:'',
            },
            rules:{
                networkId: [
                    { required: true, message: '请输选择资源', trigger: 'blur' }
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
            this.form.networkId = '';
            this.form.id = item.id;
            this.form.name = item.name;
            this.listSDK();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        listSDK(){
            listSDK().then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.pull = resData.data || [];
                }
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
        confirm() {
            this.confirmBtn = true;
            console.log('this.form',this.form);
            this.form.adminStateUp = this.item.admin_state_up ? 'true' : 'false';
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let param = {
                        id:this.item.id,
                        param:this.form
                    };
                    editRouter(param)
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
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    mounted(){

    }
};
</script>
<style lang="scss">

</style>
