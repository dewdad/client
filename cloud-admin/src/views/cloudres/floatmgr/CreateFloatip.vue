<template>
    <el-dialog title="分配IP各项目" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-alert
                    title="从指定的浮动IP池中分配一个浮动IP。"
                    type="info"
                    :closable="false">
            </el-alert>
            <el-form-item label="资源池：" prop="floatingNetworkId" :label-width="formLabelWidth" class="mt20">
                <el-select v-model="form.floatingNetworkId">
                    <el-option v-for="item in pull" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目配额："  :label-width="formLabelWidth">
                <el-progress :percentage="percent"></el-progress>
                <div>已使用 {{usage.current}}, 共{{usage.max}}</div>
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
import {networkList,floatIpquota,createFloatIp} from '@/service/cloudres.js';
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
            percent:0,
            usage:{},
            form:{
                floatingNetworkId:''
            },
            rules:{
                floatingNetworkId: [
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
        show(item,optype) {
            this.isShow = true;
            this.form.floatingNetworkId = '';
            this.networkList();
            this.floatIpquota();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        networkList(){
            let params = {
                is_default:0,
            };
            $log('params', params);
            networkList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.resultList){
                    this.pull = resData.resultList || [];
                }
            });
        },
        floatIpquota(){
            let params = {
                is_default:0,
            };
            $log('params', params);
            floatIpquota(params).then(ret => {
                $log('data', ret);

                let resData = ret.data;
                if(resData){

                    this.usage = resData || [];
                    let percent = parseInt(this.usage.current / this.usage.max) * 100;
                    this.percent = percent > 100 ? 100 : percent;
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
            this.$refs.form.validate((valid) => {
                if (valid) {
                    createFloatIp(this.form)
                        .then(res => {
                            console.log('redssssssss',res);
                            if(res.code === '0000'){
                                this.resolve(this.form);
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
