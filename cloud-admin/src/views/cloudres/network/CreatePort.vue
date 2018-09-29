<template>
    <el-dialog :title="optype == 1?'创建端口':'编辑端口'" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-alert
                    title="在此可以更新端口的可编辑属性"
                    type="info"
                    :closable="false">
            </el-alert>
            <el-form-item label="端口ID " prop="id" class="mt20" v-if="optype != 1" :label-width="formLabelWidth">
                <el-input  v-model="id" disabled></el-input>
            </el-form-item>
            <div style="margin-top:20px" v-if="optype == 1"></div>
            <el-form-item label="管理状态 " prop="admin_state_up" :label-width="formLabelWidth">
                <el-select v-model="form.admin_state_up">
                    <el-option v-for="item in adminStateUps" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备ID" prop="deviceId" :label-width="formLabelWidth"  v-if="optype==1">
                <el-input placeholder="输入设备ID" style="width:88%" v-model="form.deviceId"></el-input>
                <el-tooltip class=" ml10" effect="light" content="连接到端口的设备ID" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="设备所属者 " prop="deviceName" :label-width="formLabelWidth"  v-if="optype==1">
                <el-input placeholder="输入设备所属者" style="width:88%" v-model="form.deviceName"></el-input>
                <el-tooltip class=" ml10" effect="light" content="连接到端口的设备所属者" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="指定IP或子网 " prop="chooseType" :label-width="formLabelWidth" v-if="optype==1">
                <el-select v-model="form.chooseType" style="width:88%" @change="changeType">
                    <el-option v-for="item in chooseTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-tooltip class=" ml10" effect="light" content="要指定一个子网或一个固定IP地址的，请选择相应选项" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="子网 " prop="subnetId" :label-width="formLabelWidth" v-if="form.chooseType == 'sub'">
                <el-select v-model="form.subnetId" style="width:88%" :required="form.chooseType == 'sub'">
                    <el-option v-for="item in subnets" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="固定IP地址 " prop="fixedIp" :label-width="formLabelWidth"  v-if="form.chooseType == 'fix'">
                <el-input placeholder="输入固定IP地址" style="width:88%" v-model="form.fixedIp" :required="form.chooseType == 'fix'"></el-input>
            </el-form-item>
            <el-form-item label="绑定VNIC " prop="vnic_type" :label-width="formLabelWidth">
                <el-select v-model="form.vnic_type" style="width:88%">
                    <el-option v-for="item in vnics" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-tooltip class=" ml10" effect="light" content="Neutron 端口对应的 VNIC 类型" placement="right">
                    <i class="iconfont icon-iconfontwenhao1"></i>
                </el-tooltip>
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
import {editPort,createPort,seachSubnet} from '@/service/cloudres.js';
export default {
    data() {
        let validateIp = function(rule, value, callback){
            let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            if (!reg.test(value)) {
                callback(new Error('IP格式有误或为空'));
            } else {
                callback();
            }
        };
        let adminStateUps = [
            {key:'true',value:'UP'},
            {key:'false',value:'DOWN'},
        ];
        let chooseTypeList = [
            {key:'none',value:'未指定'},
            {key:'sub',value:'子网'},
            {key:'fix',value:'固定IP地址'}
        ];
        let vnics = [
            {key:'normal',value:'正常'},
            {key:'direct',value:'直连'},
            {key:'macvtap',value:'macVTap'}
        ];
        return{
            chooseTypeList,
            adminStateUps,
            vnics,
            formLabelWidth: '150px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            optype:1,
            id:'',
            item:{},
            subnets:[],
            networkId:'',
            form:{
                name:'',
                admin_state_up:'',
                deviceId:'',
                deviceName:'',
                chooseType:'',
                vnic_type:'',
                subnetId:'',
                fixedIp:''
            },
            rules:{
                chooseType: [
                    { required: true, message: '请指定IP或子网', trigger: 'blur' }
                ],
                fixedIp: [
                    { validator: validateIp, trigger: 'blur' },
                    { required: false, message: '请输入固定IP地址', trigger: 'blur' }
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
        show(item,optype,id) {
            this.isShow = true;
            this.networkId = id;
            this.optype = optype;
            this.item = item;
            console.log('item',item);
            this.form.networkId = id;
            this.searchSubnet(id);
            if(optype === 1){
                this.form.name = '';
                this.form.deviceId = '';
                this.form.admin_state_up = '';
                this.form.deviceName = '';
                this.form.vnic_type = '';
                this.form.chooseType = '';
            }else{
                this.form.name = item.name;
                this.id = item.id;
                this.form.deviceId = item.device_id;
                this.form.admin_state_up = item.admin_state_up + '';
                this.form.deviceName = item.deviceName ? item.deviceName : '';
                this.form.vnic_type = item['binding:vnic_type'];
                this.form.chooseType = '';
            }
            console.log('optype',optype);
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
        changeType(){
            if(this.form.chooseType === 'sub'){
                this.form.fixedIp = '';
            }else if(this.form.chooseType === 'fix'){
                this.form.subnetId = '';
            }
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
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.optype === 1){
                        if(this.form.chooseType === 'fix'){
                            this.form.subnetId = '';
                        }else{
                            this.form.fixedIp = '';
                        }
                        this.createPort();
                    }else{
                        this.editPort();
                    }
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        searchSubnet(id){
            seachSubnet(id).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                this.subnets = [];
                if(resData ){
                    this.subnets = resData.neutronSubnets;
                }
            });
        },
        editPort(){
            let param = {
                id:this.item.id,
                form:this.form
            };
            console.log('param',param);
            editPort(param)
                .then(res => {
                    if(res.code === '0000'){
                        this.resolve(param);
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
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
        },
        createPort(){
            createPort(this.form)
                .then(res => {
                    if(res.code === '0000'){
                        this.resolve(this.form);
                        this.hide();
                        this.setting();
                        this.confirmBtn = false;
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
        }

    }
};
</script>
<style lang="scss">

</style>
