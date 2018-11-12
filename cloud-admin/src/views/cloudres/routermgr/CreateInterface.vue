<template>
    <el-dialog title="接口" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-alert
                    title="您可以将一个指定的子网连接到路由器被创建接口的默认IP地址是被选用子网的网关。在此您可以指定接口的另一个IP地址。您必须从上述列表中选择一个子网，这个指定的IP地址应属于该子网。"
                    type="info"
                    :closable="false">
            </el-alert>
            <el-form-item label="子网：" prop="subnetId" :label-width="formLabelWidth" class="mt20">
                <el-select v-model="form.subnetId">
                    <el-option v-for="item in pull" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="IP地址："  prop="fixedIp"  :label-width="formLabelWidth">
                <el-input v-model="form.fixedIp" style="width:88%" ></el-input>
                <el-tooltip class=" ml10" effect="light" content="为创建的实例指定IP地址 (例如 192.168.0.254)." placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="路由名称："  :label-width="formLabelWidth">
                <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="路由id："  :label-width="formLabelWidth">
                <el-input v-model="form.routerId" disabled></el-input>
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
import {allSubnets,addInterface} from '@/service/cloudres.js';
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
                subnetId:'',
                fixedIp:'',
                routerId:'',
            },
            rules:{
                subnetId: [
                    { required: true, message: '请输选择子网', trigger: 'blur' }
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
            this.form.subnetId = '';
            this.form.routerId = item.id;
            this.form.name = item.name;
            console.log('item',item);
            this.allSubnets();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        allSubnets(){
            let param = {
                enable_dhcp:true
            };
            allSubnets(param).then(ret => {
                $log('datasunnet', ret);
                let resData = ret.data;
                if(resData ){
                    this.pull = resData || [];
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
                    let network = this.pull.find( (me) => {
                        return me.id === this.form.subnetId;
                    });
                    this.form.network_id = network.network_id;
                    addInterface(this.form)
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
